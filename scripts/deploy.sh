#!/usr/bin/env bash
# ==============================================================================
# Hookpost Production Fast Deployment Script
# Builds backend locally/runner, syncs dist and sources, and reloads PM2 with zero downtime.
# ==============================================================================
set -euo pipefail

# No default: the origin address is deliberately not in a public repository.
# CI supplies it from the PROD_HOST secret; set it in your shell to run locally.
TARGET_HOST="${TARGET_HOST:?set TARGET_HOST (deploy origin host)}"
SSH_USER="${SSH_USER:-flexiple_jr}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/google_compute_engine}"
REMOTE_DIR="/home/${SSH_USER}/hookpost"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"

echo "============================================================"
echo "🚀 Deploying Hookpost to ${TARGET_HOST} (User: ${SSH_USER})"
echo "============================================================"

# 1. Build backend and orchestrator locally
# Both dists must exist locally: the rsync below uses --delete, so a missing
# local dist wipes the server's copy and crash-loops that PM2 service.
echo "==> 1. Compiling backend..."
pnpm --filter ./apps/backend run build

echo "==> 1b. Compiling orchestrator..."
pnpm --filter ./apps/orchestrator run build

# 2. Sync updated source files and public assets
echo "==> 2. Syncing project sources, dist & assets..."
rsync -avz --delete -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude '.turbo' \
  --exclude '.gemini' \
  --exclude '*.log' \
  --exclude '*.tar.gz' \
  ./apps/ "${SSH_USER}@${TARGET_HOST}:${REMOTE_DIR}/apps/"

rsync -avz --delete -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  ./libraries/ "${SSH_USER}@${TARGET_HOST}:${REMOTE_DIR}/libraries/"

# .npmrc is included deliberately: it sets node-linker=hoisted, and the deploy
# now runs pnpm install on the server. Without shipping it, editing .npmrc here
# would leave the server installing with a different linker than the one this
# lockfile was resolved under - a different node_modules layout entirely, with
# nothing to indicate the two had diverged.
rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./.npmrc \
  "${SSH_USER}@${TARGET_HOST}:${REMOTE_DIR}/"

# The Temporal health check cron runs /home/flexiple_jr/check-temporal.sh, which
# nothing synced - so the repo copy and the live copy were independent files and
# had already drifted. Editing the repo one changed nothing in production.
rsync -avz -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  ./scripts/check-temporal.sh \
  "${SSH_USER}@${TARGET_HOST}:/home/${SSH_USER}/check-temporal.sh"

# 3. Remote Prisma generation & zero-downtime PM2 reload
echo "==> 3. Generating Prisma client & reloading PM2..."
# SKIP_FRONTEND_BUILD=1 tells the remote block not to build the frontend, for
# callers that ship a prebuilt .next instead (see .github/workflows/deploy-prod.yml).
# The heredoc below is quoted, so the value is injected as remote environment
# rather than expanded locally.
ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no "${SSH_USER}@${TARGET_HOST}" \
  "SKIP_FRONTEND_BUILD='${SKIP_FRONTEND_BUILD:-0}' bash -e" << 'EOF'
cd /home/flexiple_jr/hookpost

# Read ONLY the two Cloudflare values. Sourcing the whole .env exported
# NODE_ENV="development" into `next build`, which made React resolve its dev
# build and killed the prerender of /_global-error with
# "Cannot read properties of null (reading 'useContext')" - so the build failed
# on every deploy while a hand-run build in a clean shell succeeded.
CF_TOKEN=$(sed -n 's/^CLOUDFLARE_API_TOKEN=//p' .env | tr -d '"'"'"' | head -1)
CF_ZONE=$(sed -n 's/^CLOUDFLARE_ZONE_ID=//p' .env | tr -d '"'"'"' | head -1)

# The frontend loads runtime env (TELEGRAM_BOT_NAME, HIDDEN_PROVIDERS, ...) via
# this symlink; the rsync --delete above removes it, so recreate it every deploy.
ln -sf ../../.env apps/frontend/.env

# Install dependencies. The rsync ships package.json, pnpm-lock.yaml and
# pnpm-workspace.yaml, but nothing acted on them - so a dependency change (a
# new package, or a security bump like the form-data CVE-2025-7783 override)
# never reached production. The server kept whatever node_modules it had, and
# the build compiled against those, not the lockfile.
#
# --frozen-lockfile so the server never silently resolves something different
# from what was committed and tested; a stale lockfile fails the deploy loudly.
pnpm install --frozen-lockfile

# Ensure Prisma client is regenerated
pnpm run prisma-generate

# Generating the client is NOT applying the schema, and nothing here applies it.
#
# Only warn when the SCHEMA HAS SOMETHING THE DATABASE LACKS - a new table or
# column that code will hit at runtime. The reverse direction is normal here:
# Mastra AI creates and owns 21 of its own tables (mastra_ai_spans, mastra_scorers
# and friends) that schema.prisma does not model, so a plain drift check reports
# 21 DropTable statements on every single deploy and means nothing.
#
# DO NOT "fix" that by running the repo's prisma-db-push script. It carries
# --accept-data-loss, and against this database that means DROPPING all 21
# Mastra tables. Verified 2026-09-08: the diff is 21 DropTable / 5 DropIndex /
# 2 AlterTable and ZERO CreateTable - nothing the app needs is missing.
SCHEMA_DIFF=$(pnpm dlx prisma@6.5.0 migrate diff \
  --from-url "$DATABASE_URL" \
  --to-schema-datamodel ./libraries/nestjs-libraries/src/database/prisma/schema.prisma \
  --script 2>/dev/null || true)
if printf '%s' "$SCHEMA_DIFF" | grep -qE '^CREATE TABLE|ADD COLUMN'; then
  echo "!  The database is MISSING tables or columns that schema.prisma defines:" >&2
  printf '%s' "$SCHEMA_DIFF" | grep -E '^CREATE TABLE|ADD COLUMN' | head -20 >&2
  echo "   Code reading them will fail at runtime. Apply deliberately - and do" >&2
  echo "   NOT use prisma-db-push, which would drop the Mastra tables." >&2
fi

# The rsync above excludes .next, so the frontend build never travels from the
# laptop, and this builds it here instead.
#
# An earlier version of this comment claimed a Mac-built .next is INVALID on the
# server because required-server-files.json records an absolute appDir. That is
# wrong, and it was wrong in a way that would mislead someone mid-incident.
# Production has served a Mac-built bundle with
# appDir=/Users/flexiple_jr/Desktop/hookpost/apps/frontend for hours at a time -
# `next start` uses the relativeAppDir (apps/frontend) recorded alongside it.
# scripts/deploy-production.sh does exactly that and was used twice to recover
# the site. Both recoveries were sound.
#
if [ "${SKIP_FRONTEND_BUILD:-0}" = "1" ]; then
  echo "→ Skipping the remote frontend build (SKIP_FRONTEND_BUILD=1)."
  echo "  The caller is expected to ship a prebuilt .next. This exists because"
  echo "  this VM cannot build Next.js: measured PSI memory full avg300 12.41%,"
  echo "  peak swap 4857MB on a 3913MB box. Building here is a coin flip."
else

# Build into .next.new, not .next. `next build` clears distDir before writing,
# so building in place deleted the directory the running server reads and took
# the frontend down for the entire build - six minutes of 502s on every deploy,
# and a failed build left it down until someone noticed. The live .next is not
# touched until the new one is complete and checked.
# Kill any orphaned build FIRST, then clean. Removing .next.new while a previous
# build is still alive lets that orphan recreate the directory after the cleanup
# and poison this run - observed tonight, twice. Match on the process name
# (comm), not the cmdline: `pkill -f next-build` over SSH matches the remote
# command string itself and kills your own session.
if pgrep -x next-build >/dev/null 2>&1 || pgrep -f 'turbopack-node' >/dev/null 2>&1; then
  echo "! An orphaned frontend build is still running - killing it before cleanup" >&2
  ps -eo pid,comm | awk '$2 ~ /^next-build/ {print $1}' | xargs -r kill -9
  pgrep -f 'turbopack-node' | xargs -r kill -9
  sleep 3
fi
rm -rf apps/frontend/.next.new apps/frontend/.next.old
# Prove the cleanup actually stuck before building into it.
if [ -e apps/frontend/.next.new ]; then
  echo "✗ FATAL: .next.new reappeared after cleanup - a build process is still alive" >&2
  exit 1
fi
export NEXT_DIST_DIR=.next.new

# Pinned explicitly: this must never inherit NODE_ENV=development from the
# server's .env, whatever else the deploy shell picks up later.
# Bound the heap. The VM has 3.9GB and is already 1.2GB into swap, and the
# build kept dying silently mid-compile - no error, no OOM line in dmesg, just
# a truncated log - which is what a Node process thrashing against physical
# memory looks like. 2GB forces GC instead of letting the heap grow until the
# machine gives out. Three consecutive server builds failed this way while the
# identical build succeeded locally every time.
build_ok=1
NODE_ENV=production NODE_OPTIONS="--max-old-space-size=2048" \
  pnpm --filter ./apps/frontend run build || build_ok=0

# "Compiled successfully" is not proof of a usable build: a corrupt Turbopack
# cache once killed it after BUILD_ID was written but before the manifests were.
# Check everything `next start` actually opens.
missing=""
for f in BUILD_ID prerender-manifest.json routes-manifest.json build-manifest.json app-path-routes-manifest.json; do
  [ -f "apps/frontend/.next.new/$f" ] || missing="$missing $f"
done

if [ "$build_ok" = "0" ] || [ -n "$missing" ]; then
  echo "✗ FATAL: frontend build failed or incomplete - missing:${missing:- (build exited non-zero)}" >&2
  echo "  The live frontend was never touched and keeps serving. Re-run the deploy." >&2
  rm -rf apps/frontend/.next.new
  exit 1
fi

# The build recorded distDir as .next.new; it is about to become .next.
python3 - <<'PYEOF'
import json, pathlib
p = pathlib.Path("apps/frontend/.next.new/required-server-files.json")
d = json.loads(p.read_text())
d["config"]["distDir"] = ".next"
p.write_text(json.dumps(d))
PYEOF

# Swap. Two renames on the same filesystem, so the window where .next does not
# exist is microseconds rather than minutes.
if [ -d apps/frontend/.next ]; then mv apps/frontend/.next apps/frontend/.next.old; fi
mv apps/frontend/.next.new apps/frontend/.next
echo "✓ Frontend build swapped in (BUILD_ID $(cat apps/frontend/.next/BUILD_ID))"
unset NEXT_DIST_DIR
fi

# Zero-downtime rolling reload of PM2 microservices
pm2 reload hookpost-backend --update-env || pm2 start apps/backend/dist/apps/backend/src/main.js --name hookpost-backend
pm2 reload hookpost-frontend --update-env || pm2 start /home/flexiple_jr/hookpost/node_modules/.bin/next --name hookpost-frontend --cwd /home/flexiple_jr/hookpost/apps/frontend -- start -p 4200
pm2 reload hookpost-orchestrator --update-env || pm2 start /usr/bin/bash --name hookpost-orchestrator -- -c 'pnpm --filter ./apps/orchestrator run start'

# The new build is only proven once the frontend actually serves a page. If it
# does not, put the previous build back rather than leaving the site down.
fe_up=0
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:4200/contact 2>/dev/null; then fe_up=1; break; fi
  sleep 2
done
if [ "$fe_up" = "0" ]; then
  echo "✗ Frontend did not come up on the new build - rolling back" >&2
  if [ -d apps/frontend/.next.old ]; then
    rm -rf apps/frontend/.next
    mv apps/frontend/.next.old apps/frontend/.next
    pm2 restart hookpost-frontend --update-env || true
    echo "  Previous build restored." >&2
  fi
  exit 1
fi
rm -rf apps/frontend/.next.old

# Guard: the orchestrator crash-loops silently if its dist is missing (PM2 still
# reports "online" between restarts), so fail the deploy loudly instead.
if [ ! -f apps/orchestrator/dist/apps/orchestrator/src/main.js ]; then
  echo "✗ FATAL: orchestrator dist missing on server — it will crash-loop" >&2
  exit 1
fi

# Ensure PM2 state is saved for reboot recovery
pm2 save

# Clear the NGINX SSR cache BEFORE reloading. A reload does not empty
# proxy_cache, so without this the edge kept serving the previous build's HTML
# for up to proxy_cache_valid (10m) after every deploy - the new page looked
# correct on 127.0.0.1:4200 and stale through the domain, and a query string
# hid it because the cache key includes $request_uri.
sudo rm -rf /var/cache/nginx/hookpost_cache/* 2>/dev/null || true
sudo systemctl reload nginx

# Cloudflare sits in front of that, so purge it too or the same stale HTML
# survives at the CDN edge.
if [ -n "${CF_TOKEN:-}" ] && [ -n "${CF_ZONE:-}" ]; then
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/purge_cache" \
    -H "Authorization: Bearer ${CF_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data '{"purge_everything":true}' -o /dev/null -w 'Cloudflare purge: %{http_code}\n'
else
  echo "! Cloudflare token/zone not found in .env - skipping CDN purge" >&2
fi
EOF

# 4. Health check
echo "==> 4. Verifying live health..."
ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no "${SSH_USER}@${TARGET_HOST}" "bash -e" << 'EOF'
# Poll rather than probe once: the reload above may still be swapping processes,
# and "/auth" is not a backend route (it 404s), so the old one-shot check on it
# could silently print nothing while the backend was perfectly healthy.
# 60 tries x 2s = 2 minutes. The backend takes ~30s to boot all its NestJS
# modules, which sat right on the old 30s limit and started failing outright
# once the frontend build was added above and pushed the reload later.
for i in $(seq 1 60); do
  # stderr is silenced because a refused connection is the expected state
  # while PM2 swaps processes - only the final failure below is real.
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:3000/ 2>/dev/null; then
    echo "✓ Backend online (Port 3000)"
    break
  fi
  if [ "$i" = 60 ]; then
    echo "✗ Backend NOT responding on port 3000 after 2 minutes" >&2
    exit 1
  fi
  sleep 2
done
# Poll, and fail loudly. As `curl ... && echo`, a dead frontend printed nothing
# at all and aborted the script under bash -e with no message - which is exactly
# how a 20 minute frontend outage got past this step unnoticed. Ask for a real
# page rather than the root, so a cached "/" cannot mask a broken build.
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null --max-time 5 http://127.0.0.1:4200/contact 2>/dev/null; then
    echo "✓ Frontend online (Port 4200)"
    break
  fi
  if [ "$i" = 30 ]; then
    echo "✗ Frontend NOT serving on port 4200 after 60s - check pm2 logs hookpost-frontend" >&2
    exit 1
  fi
  sleep 2
done
# Temporal binds to the VM's internal address (e.g. 10.148.0.2:7233), NOT
# 127.0.0.1, so the old `nc -z 127.0.0.1 7233` always failed and printed
# nothing - a false alarm on every deploy. Ask the kernel what is actually
# listening on 7233 instead of guessing the interface.
if ss -ltn 2>/dev/null | grep -q ':7233'; then
  echo "✓ Temporal online (Port 7233)"
else
  echo "✗ Temporal NOT listening on 7233" >&2
  exit 1
fi
curl -sI -H "Host: hookpost.hookstep.in" http://127.0.0.1/ > /dev/null && echo "✓ Nginx Reverse Proxy online (Port 80/443)"
EOF

echo "============================================================"
echo "🎉 Deployment to ${TARGET_HOST} completed successfully!"
echo "============================================================"
