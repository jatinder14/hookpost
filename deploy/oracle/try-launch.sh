#!/usr/bin/env bash
#
# Try once to grab an Oracle Ampere A1 instance, and stop trying once we have one.
#
# Oracle's Always Free A1 pool in ap-singapore-1 is usually exhausted - every
# size (4/24, 2/12, 1/6) returned "Out of host capacity" on 2026-09-20. Capacity
# does free up, but unpredictably, so the only working strategy is to ask
# periodically and take whatever is available.
#
# Designed to be called from a scheduler. Exits 0 when an instance exists (or was
# just created), 1 when capacity was unavailable this round.
#
# Deliberately makes at most FOUR API calls per run: one list + up to three
# launches. Hammering earns a 429 "Too many requests for the user", which then
# blocks the very call that would have succeeded.
set -uo pipefail
export OCI_CLI_SUPPRESS_FILE_PERMISSIONS_WARNING=True

T="ocid1.tenancy.oc1..aaaaaaaaucoi7npdwidbvcrcwj37qulp66zqyk27n47xwy4jb7l6ukaxyjda"
SUB="ocid1.subnet.oc1.ap-singapore-1.aaaaaaaaelkgjxiqnaecynbbcs7betozikyzd27x44cajnhbq6p3qs6wwzgq"
AD="gePE:AP-SINGAPORE-1-AD-1"
IMG="ocid1.image.oc1.ap-singapore-1.aaaaaaaapvdxm6d5ev4ljhwc4lcskjbq77ikgoybdquc3bptaoo5lkq6gz5a"
KEY="$HOME/.ssh/oracle_hookpost.pub"
NAME="hookpost-oracle"

log() { printf '[%s] %s\n' "$(date '+%F %H:%M:%S')" "$*"; }

# --- already have one? then we are done, and must not launch another ---
existing=$(oci compute instance list -c "$T" 2>/dev/null | python3 -c "
import json,sys
s=sys.stdin.read()
if '{' not in s: raise SystemExit
for i in json.loads(s[s.index('{'):]).get('data') or []:
    if i['display-name']=='$NAME' and i['lifecycle-state'] not in ('TERMINATED','TERMINATING'):
        print(i['id']); break
" 2>/dev/null)

if [ -n "$existing" ]; then
  log "instance already exists: $existing"
  echo "$existing" > "$HOME/.oci/hookpost_instance_id"
  exit 0
fi

# Largest first - 4/24 is the whole Always Free allowance. Anything is a win
# over the 1.9 GB GCP box, so fall back rather than hold out for the maximum.
for spec in "4 24" "2 12" "1 6"; do
  set -- $spec
  log "trying ${1} OCPU / ${2} GB"
  out=$(oci compute instance launch -c "$T" --availability-domain "$AD" --subnet-id "$SUB" \
    --display-name "$NAME" --image-id "$IMG" \
    --shape VM.Standard.A1.Flex --shape-config "{\"ocpus\":$1,\"memoryInGBs\":$2}" \
    --boot-volume-size-in-gbs 100 --assign-public-ip true \
    --ssh-authorized-keys-file "$KEY" 2>&1)

  if printf '%s' "$out" | grep -q '"id"'; then
    id=$(printf '%s' "$out" | python3 -c "import json,sys;s=sys.stdin.read();print(json.loads(s[s.index('{'):])['data']['id'])")
    log "LAUNCHED ${1}/${2}: $id"
    echo "$id" > "$HOME/.oci/hookpost_instance_id"
    exit 0
  fi

  if printf '%s' "$out" | grep -qi 'TooManyRequests'; then
    log "rate limited - stopping this round early so the next one is not blocked"
    exit 1
  fi
  printf '%s' "$out" | grep -qi 'Out of host capacity' \
    && log "  out of capacity" \
    || log "  other error: $(printf '%s' "$out" | grep -oE '"message": "[^"]*"' | head -1)"
done

exit 1
