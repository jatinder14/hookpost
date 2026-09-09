#!/bin/bash
set -euo pipefail

# Cloud Run injects PORT and requires us to listen on it. On the VM we default
# to 5000 to match docker-compose's published port.
export APP_PORT="${PORT:-5000}"

# CRITICAL: unset PORT before starting the apps. The backend does
# `process.env.PORT || 3000`, so leaving PORT set makes it try to bind the port
# nginx already owns -- it then lands somewhere unexpected and nginx proxies
# /api/ to a dead :3000. nginx has APP_PORT; the apps must use their own
# defaults (backend :3000, frontend :4200), which nginx.conf hardcodes.
unset PORT

# nginx.conf has no envsubst of its own, and $host/$remote_addr must survive
# substitution, so only replace APP_PORT explicitly.
envsubst '${APP_PORT}' \
  < /app/var/docker/nginx.conf.template \
  > /etc/nginx/nginx.conf

echo "[entrypoint] nginx will listen on ${APP_PORT}"

# Push the Prisma schema before any app process accepts traffic. This is
# idempotent, so it is safe on every boot.
if [ "${SKIP_DB_PUSH:-false}" != "true" ]; then
  echo "[entrypoint] applying database schema..."
  pnpm run prisma-db-push
fi

# nginx daemonizes, so control returns here.
nginx

# Each app's `pm2` script is `pm2 start ...`, which registers the process with
# the pm2 daemon and returns immediately. If we exec'd that, PID 1 would exit
# and the container would stop, so start the apps and then hand PID 1 to
# `pm2 logs`, which streams their output and blocks. This mirrors upstream's
# root `pm2` script.
# Start the pm2 daemon first. Registering the apps in parallel makes all the
# clients try to spawn the daemon at once; the losers of that race drop their
# registration and only one app ends up running.
pm2 ping >/dev/null 2>&1 || true

# The backend must reach a listening state BEFORE the orchestrator starts.
# Both embed Mastra, which creates its storage tables on boot, and concurrent
# CREATE TABLE against the same Postgres raises
#   MASTRA_STORAGE_PG_CREATE_TABLE_FAILED / pg_type_typname_nsp_index
# killing whichever process loses. That made every boot a coin flip on whether
# the API came up, with nginx serving 502s and the frontend looking healthy.
echo "[entrypoint] starting backend first (owns the Mastra schema migration)"
pnpm --filter ./apps/backend run pm2

# 60s was too tight: the backend took 51s on one boot and over 60s on another,
# so the wait expired and the orchestrator started alongside an unfinished
# migration -- reintroducing the very race this ordering exists to prevent.
# NestJS boot plus the Mastra schema work needs real headroom here.
for i in $(seq 1 240); do
  if (echo > /dev/tcp/127.0.0.1/3000) >/dev/null 2>&1; then
    echo "[entrypoint] backend listening on :3000 after ${i}s"
    break
  fi
  sleep 1
done

if ! (echo > /dev/tcp/127.0.0.1/3000) >/dev/null 2>&1; then
  # Don't abort: the frontend is still worth serving, and pm2 keeps the backend
  # under supervision. Make the reason obvious in the logs.
  echo "[entrypoint] WARNING: backend did not open :3000 within 240s;" \
       "starting remaining apps anyway -- the Mastra migration may race." \
       "Check: pm2 logs backend"
fi

echo "[entrypoint] starting frontend and orchestrator"
pnpm --filter ./apps/frontend --filter ./apps/orchestrator \
  --workspace-concurrency=1 run pm2

echo "[entrypoint] apps registered with pm2:"
pm2 list --no-color 2>&1 | grep -E 'backend|frontend|orchestrator' || true
exec pm2 logs --raw
