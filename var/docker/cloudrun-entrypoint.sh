#!/bin/bash
# Cloud Run entrypoint.
#
# The VM entrypoint (entrypoint.sh) runs nginx plus every tier in one
# container. That shape cannot autoscale: a Temporal worker has to poll
# continuously, so it dies under scale-to-zero, and nginx in front of the app
# duplicates what Cloud Run already does.
#
# This one runs exactly one tier, chosen by SERVICE_ROLE, listening directly on
# $PORT. Deploy the same image twice with different roles.
set -euo pipefail

ROLE="${SERVICE_ROLE:?SERVICE_ROLE must be 'frontend' or 'backend'}"
PORT="${PORT:-8080}"

# The apps' own start scripts run through `dotenv -e ../../.env`, so on the VM
# every setting arrives from /app/.env. Cloud Run mounts the same file from
# Secret Manager, so load it here rather than passing 60-odd values as
# individual service env vars. Anything already in the environment wins, which
# is what lets the service override TEMPORAL_ADDRESS per deployment.
# Must NOT be under /app. Cloud Run mounts a secret file by mounting its parent
# directory, so mounting /app/.env replaces the whole of /app with a volume
# containing just that file — the app code and this script included. That is
# what caused `failed to load /app/var/docker/cloudrun-entrypoint.sh` on the
# first two deploys.
ENV_FILE="${ENV_FILE:-/secrets/.env}"
if [ -f "$ENV_FILE" ]; then
  echo "[cloudrun] loading $ENV_FILE"
  while IFS= read -r line; do
    case "$line" in
      ''|\#*) continue ;;
    esac
    key="${line%%=*}"
    case "$key" in
      *[!A-Za-z0-9_]*|'') continue ;;
    esac
    # Only set it if the environment has not already provided it.
    if [ -z "$(eval "printf '%s' \"\${$key:-}\"")" ]; then
      val="${line#*=}"
      val="${val%\"}"; val="${val#\"}"
      export "$key=$val"
    fi
  done < "$ENV_FILE"
fi

# Schema changes are applied by the VM deploy, not here. Cloud Run can start
# many instances at once and they would race each other on the same push.
export SKIP_DB_PUSH=true

case "$ROLE" in
  backend)
    echo "[cloudrun] backend on :${PORT}"
    export PORT
    exec node /app/apps/backend/dist/apps/backend/src/main.js
    ;;
  frontend)
    echo "[cloudrun] frontend on :${PORT}"
    cd /app/apps/frontend
    exec /app/node_modules/.bin/next start -p "${PORT}" -H 0.0.0.0
    ;;
  *)
    echo "[cloudrun] unknown SERVICE_ROLE '${ROLE}'" >&2
    exit 1
    ;;
esac
