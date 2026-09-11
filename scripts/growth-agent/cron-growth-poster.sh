#!/usr/bin/env bash
# ==============================================================================
# Hookpost Hourly Social Media Growth Poster Cron Runner
# ==============================================================================
set -euo pipefail

LOCKFILE="/tmp/hookpost-growth-poster.lock"
LOG_FILE="/home/flexiple_jr/hookpost-growth-poster.log"

# Prevent overlapping executions
if [ -e "$LOCKFILE" ]; then
  # Check if process is still alive
  PID=$(cat "$LOCKFILE" 2>/dev/null || true)
  if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
    echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Previous growth poster job (PID $PID) still running. Exiting." >> "$LOG_FILE"
    exit 0
  fi
fi

echo $$ > "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

echo "" >> "$LOG_FILE"
echo "========================================================" >> "$LOG_FILE"
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting Hourly Social Media Growth Poster..." >> "$LOG_FILE"
echo "========================================================" >> "$LOG_FILE"

cd /home/flexiple_jr/hookpost
/usr/bin/node /home/flexiple_jr/hookpost/scripts/growth-agent/run-growth-poster.js >> "$LOG_FILE" 2>&1

# Keep log trimmed to last 2000 lines
if [ -f "$LOG_FILE" ]; then
  tail -n 2000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
fi

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Hourly Growth Poster execution cycle complete." >> "$LOG_FILE"
