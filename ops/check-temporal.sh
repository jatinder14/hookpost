#!/bin/bash
# Temporal has no external health signal: it listens on a private IP, so a
# Cloud Monitoring uptime check cannot reach it. Without this, Temporal dying
# means scheduled posts silently stop and nobody finds out - the same class of
# failure that let the orchestrator crash-loop 19,402 times unnoticed.
#
# Runs every 5 minutes from cron and writes an ERROR log entry when unhealthy;
# an alert policy watches for that entry.
#
# Deployed by scripts/deploy.sh to /home/flexiple_jr/check-temporal.sh, which is
# the path cron runs. This file is the source of truth - before that sync
# existed the two copies drifted and editing this one changed nothing.
ADDR=10.148.0.2:7233
T=/home/flexiple_jr/.temporalio/bin/temporal

fail() {
  gcloud logging write hookpost-health \
    "{\"component\":\"temporal\",\"healthy\":false,\"reason\":\"$1\",\"load\":\"$(cut -d' ' -f1-3 /proc/loadavg)\"}" \
    --severity=ERROR --payload-type=json 2>/dev/null
  exit 1
}

# Retry before alerting. A single 20s timeout is not evidence that Temporal is
# down - it is also what a CPU-starved box looks like, and one such spike is
# enough to page someone at 2am about a healthy cluster. Three consecutive
# failures over ~40s is a real signal; one is noise. The load average goes into
# the alert payload so a starvation-driven failure is distinguishable from a
# genuine Temporal fault at a glance.
probe() {
  local what="$1" i out
  for i in 1 2 3; do
    case "$what" in
      serving)
        out=$(timeout 20 $T operator cluster health --address $ADDR 2>&1 | head -1)
        [[ "$out" == *SERVING* ]] && return 0
        ;;
      persistence)
        # Hits the database, so this fails if Cloud SQL is unreachable even
        # while the Temporal process itself is up.
        out=$(timeout 20 $T operator namespace describe --address $ADDR -n default 2>&1)
        [ $? -eq 0 ] && return 0
        ;;
    esac
    [ $i -lt 3 ] && sleep 10
  done
  LAST_ERR="$out"
  return 1
}

probe serving     || fail "cluster not serving after 3 attempts: ${LAST_ERR:0:200}"
probe persistence || fail "namespace query failed after 3 attempts - persistence may be unreachable"

gcloud logging write hookpost-health \
  '{"component":"temporal","healthy":true}' \
  --severity=INFO --payload-type=json 2>/dev/null
