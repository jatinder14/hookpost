#!/usr/bin/env bash
# Hookpost Daily Lead Nurture Cron Runner
set -euo pipefail

LOG_FILE="/home/flexiple_jr/hookpost-lead-drip.log"
echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Running Hookpost Automated Lead Drip..." >> "$LOG_FILE"

cd /home/flexiple_jr/hookpost
/usr/bin/node /home/flexiple_jr/hookpost/scripts/lead-campaign/run-lead-drip.js >> "$LOG_FILE" 2>&1

# Keep log trimmed to last 2000 lines
tail -n 2000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
