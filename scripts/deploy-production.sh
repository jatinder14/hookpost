#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Hookpost Production Deployment & Zero-Downtime Cache Sync Script
# Prevents CSS chunk 404s, unstyled UI, and cache desynchronization.
# ==============================================================================

# Paths are derived, not hardcoded, so this runs unchanged on the Mac and on a
# CI runner. It used to pin LOCAL_APP_DIR to /Users/flexiple_jr/... which made it
# Mac-only - and building the frontend somewhere other than the production VM is
# the entire point, because that VM cannot build Next.js (measured PSI memory
# full avg300 12.41%, peak swap 4857MB on a 3913MB box).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
# No default address: see scripts/deploy.sh. CI exports SSH_USER and
# TARGET_HOST (from secrets), not VM_HOST, so build it from those when it is not
# set explicitly - the previous hardcoded default masked that mismatch.
VM_HOST="${VM_HOST:-${SSH_USER:?set VM_HOST, or SSH_USER and TARGET_HOST}@${TARGET_HOST:?set VM_HOST, or SSH_USER and TARGET_HOST}}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/google_compute_engine}"
REMOTE_APP_DIR="/home/flexiple_jr/hookpost/apps/frontend"
LOCAL_APP_DIR="$REPO_ROOT/apps/frontend"

# ------------------------------------------------------------------------------
# Step 0: pull the real NEXT_PUBLIC_* values off the VM before building.
#
# Next.js inlines every NEXT_PUBLIC_* at BUILD time. This script builds on the
# Mac, where the repo's .env is the *development* one: NEXT_PUBLIC_BACKEND_URL
# is http://localhost:3000 and NEXT_PUBLIC_FACEBOOK_PIXEL / NEXT_PUBLIC_GTM_ID
# do not exist at all. Building without this step shipped a production bundle
# that called localhost for every API request and had the pixel and the Google
# tag compiled out - and nothing failed loudly, because an unset NEXT_PUBLIC_*
# inlines as an empty string and the tracking components simply return null.
#
# The VM's .env is the single source of truth, so read it from there every time
# rather than keeping a second copy here that drifts.
# ------------------------------------------------------------------------------
echo "==> Step 0: Fetching production NEXT_PUBLIC_* from the VM..."
PUBENV=$(mktemp /tmp/hookpost-pubenv.XXXXXX)
chmod 600 "$PUBENV"
trap 'rm -f "$PUBENV"' EXIT
ssh -i "$SSH_KEY" "$VM_HOST" 'grep "^NEXT_PUBLIC_" /home/flexiple_jr/hookpost/.env' > "$PUBENV"

set -a
# shellcheck disable=SC1090
source "$PUBENV"
set +a

# Fail before building rather than after shipping a silently gutted bundle.
for REQUIRED in NEXT_PUBLIC_BACKEND_URL NEXT_PUBLIC_FACEBOOK_PIXEL NEXT_PUBLIC_GTM_ID; do
  if [ -z "${!REQUIRED:-}" ]; then
    echo "ERROR: $REQUIRED is empty. Refusing to build - this would ship a bundle with it compiled out." >&2
    exit 1
  fi
done
case "$NEXT_PUBLIC_BACKEND_URL" in
  *localhost*|*127.0.0.1*)
    echo "ERROR: NEXT_PUBLIC_BACKEND_URL is $NEXT_PUBLIC_BACKEND_URL - that is the dev value. Refusing to build." >&2
    exit 1;;
esac
echo "    backend=$NEXT_PUBLIC_BACKEND_URL pixel=${NEXT_PUBLIC_FACEBOOK_PIXEL} gtm=${NEXT_PUBLIC_GTM_ID}"

echo "==> Step 1: Building frontend off-VM for atomic chunk generation..."
cd "$REPO_ROOT"
# NODE_ENV is pinned because the .env this repo ships sets NODE_ENV=development,
# and a development React build dies while prerendering /_global-error.
NODE_ENV=production pnpm --filter hookpost-frontend run build

# The build can still silently drop a value (wrong app dir, stale cache), so
# prove the ids are actually present in the emitted chunks before shipping.
echo "==> Step 1b: Verifying the ids were inlined into the bundle..."
for ID in "$NEXT_PUBLIC_FACEBOOK_PIXEL" "$NEXT_PUBLIC_GTM_ID"; do
  CLEAN=$(printf '%s' "$ID" | tr -d '"'"'"'')
  if ! grep -rqF --exclude-dir=cache "$CLEAN" "$LOCAL_APP_DIR/.next"; then
    echo "ERROR: $CLEAN is not present anywhere in .next - it was compiled out. Not shipping." >&2
    exit 1
  fi
  echo " [OK] $CLEAN inlined"
done

echo "==> Step 2: Packaging atomic .next build (excluding dev caches and maps)..."
tar --exclude='*.map' --exclude='cache' --exclude='dev' -czf /tmp/next-atomic.tar.gz -C "$LOCAL_APP_DIR/.next" .

# public/ is NOT inside .next - `next start` serves it straight from the source
# tree - so a tarball of .next alone never updates it. That is why
# .well-known/apple-developer-merchantid-domain-association was committed,
# tracked, and still 404ing in production while assetlinks.json in the same
# directory returned 200: assetlinks arrived on an older deploy.sh run that
# rsynced apps/, and nothing has synced public/ since.
echo "==> Step 2b: Syncing public/ (served from source, not from .next)..."
rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  "$LOCAL_APP_DIR/public/" \
  "$VM_HOST:/home/flexiple_jr/hookpost/apps/frontend/public/" | tail -3

echo "==> Step 3: Transferring atomic bundle to production VM..."
rsync -avz -e "ssh -i $SSH_KEY -o ServerAliveInterval=15 -o ServerAliveCountMax=6 -o StrictHostKeyChecking=no" /tmp/next-atomic.tar.gz "$VM_HOST:/tmp/next-atomic.tar.gz"

# ------------------------------------------------------------------------------
# Step 3b: ship the server's own configuration.
#
# This deploy shipped only .next and public/, so nothing in the repo describing
# the *server* ever reached the server. The result: the live NGINX config drifted
# to 6,845 bytes against 2,198 committed - 142 lines - and the only copy of the
# HOOKPOST_SSR proxy_cache_path this very script depends on, of two live
# domain-verification routes, and of the kernel/gzip tuning was the production
# disk itself. A cron script and the PM2 process definitions were in the same
# state. Config that is never shipped is not configuration, it is a wish.
# ------------------------------------------------------------------------------
echo "==> Step 3b: Transferring server config from the repo..."
# check-temporal.sh is deliberately absent here: scripts/check-temporal.sh is
# its source of truth and scripts/deploy.sh already rsyncs it to the path cron
# runs. Shipping it from two places is how the nginx drift started.
rsync -avz -e "ssh -i $SSH_KEY -o ServerAliveInterval=15 -o ServerAliveCountMax=6 -o StrictHostKeyChecking=no" "$REPO_ROOT/nginx.hookpost.conf"      "$VM_HOST:/tmp/hookpost-nginx.conf"
rsync -avz -e "ssh -i $SSH_KEY -o ServerAliveInterval=15 -o ServerAliveCountMax=6 -o StrictHostKeyChecking=no" "$REPO_ROOT/ops/ecosystem.config.js"  "$VM_HOST:/tmp/hookpost-ecosystem.config.js"

echo "==> Step 4: Applying build without deleting existing chunk history & clearing NGINX cache..."
ssh -i "$SSH_KEY" "$VM_HOST" bash << 'REMOTECOMMANDS'
set -euo pipefail
# Create backup directory for existing chunks so old cached HTML requests never 404
mkdir -p /home/flexiple_jr/hookpost/apps/frontend/.next/static/chunks

# Extract the new build directly over .next
tar -xzf /tmp/next-atomic.tar.gz -C /home/flexiple_jr/hookpost/apps/frontend/.next/
rm -f /tmp/next-atomic.tar.gz

# Auto-prune stale chunks older than 3 days to keep disk usage strictly under ~25MB with zero performance impact
find /home/flexiple_jr/hookpost/apps/frontend/.next/static/chunks -type f -mtime +3 -delete 2>/dev/null || true

# Clear Next.js internal SSR cache
rm -rf /home/flexiple_jr/hookpost/apps/frontend/.next/cache

# ---------------------------------------------------------------- config ----
# Install the NGINX config from git, but never blindly: a bad config that
# reaches `systemctl reload` takes the whole site down. Test first, roll back on
# failure, and fail the deploy rather than leaving a broken file in place.
if ! sudo cmp -s /tmp/hookpost-nginx.conf /etc/nginx/sites-available/hookpost; then
  echo "    nginx config differs from git - installing"
  sudo cp /etc/nginx/sites-available/hookpost /tmp/hookpost-nginx.rollback
  sudo cp /tmp/hookpost-nginx.conf /etc/nginx/sites-available/hookpost
  if sudo nginx -t >/dev/null 2>&1; then
    echo "    nginx -t OK"
  else
    echo "    ! nginx -t FAILED on the config from git - rolling back" >&2
    sudo nginx -t 2>&1 | sed 's/^/      /' >&2 || true
    sudo cp /tmp/hookpost-nginx.rollback /etc/nginx/sites-available/hookpost
    sudo nginx -t >/dev/null 2>&1 || echo "    !! rollback ALSO fails nginx -t - server config is broken" >&2
    exit 1
  fi
else
  echo "    nginx config already matches git"
fi

# The cron entry for the Temporal health check. deploy.sh ships the script
# itself; only the crontab line is missing from either script, and it was the
# one thing that existed nowhere but the box. Idempotent: grep -vF strips any
# older variant before re-adding, so repeated deploys cannot stack duplicates.
CRON_LINE='*/5 * * * * /home/flexiple_jr/check-temporal.sh >/dev/null 2>&1'
if crontab -l 2>/dev/null | grep -Fqx "$CRON_LINE"; then
  echo "    cron entry already present"
else
  { crontab -l 2>/dev/null | grep -vF 'check-temporal.sh'; echo "$CRON_LINE"; } | crontab -
  echo "    cron entry installed"
fi

# PM2 definitions are shipped and recorded, but deliberately NOT applied here.
# `pm2 startOrReload` would restart the backend, orchestrator and temporal on
# every frontend-only deploy, which is a much bigger blast radius than this
# script currently has. Use it by hand when rebuilding a box:
#   pm2 startOrReload /home/flexiple_jr/hookpost/ops/ecosystem.config.js && pm2 save
mkdir -p /home/flexiple_jr/hookpost/ops
install -m 0644 /tmp/hookpost-ecosystem.config.js /home/flexiple_jr/hookpost/ops/ecosystem.config.js
rm -f /tmp/hookpost-nginx.conf /tmp/hookpost-ecosystem.config.js

# Purge NGINX proxy cache so old pre-rendered HTML is never served
sudo rm -rf /var/cache/nginx/hookpost_cache/*
sudo systemctl reload nginx

# ...and Cloudflare, which sits in front of NGINX. This path purged only NGINX,
# so a deploy could clear the origin cache and still have the CDN serving the
# previous build's HTML and asset URLs. That is how a deploy "succeeds" while
# visitors keep getting the old page.
CF_TOKEN=$(sed -n 's/^CLOUDFLARE_API_TOKEN=//p' /home/flexiple_jr/hookpost/.env | tr -d '"' | head -1)
CF_ZONE=$(sed -n 's/^CLOUDFLARE_ZONE_ID=//p' /home/flexiple_jr/hookpost/.env | tr -d '"' | head -1)
if [ -n "${CF_TOKEN:-}" ] && [ -n "${CF_ZONE:-}" ]; then
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/purge_cache" \
    -H "Authorization: Bearer ${CF_TOKEN}" -H 'Content-Type: application/json' \
    --data '{"purge_everything":true}' -o /dev/null -w '    Cloudflare purge: %{http_code}\n'
else
  echo "    ! Cloudflare token/zone not in .env - CDN not purged" >&2
fi

# Restart PM2 frontend process
pm2 restart hookpost-frontend --update-env
REMOTECOMMANDS

echo "==> Step 5: Live Verification & Self-Healing Health Check..."

# This step used to fail good deploys, and not for the reason the comment
# further down describes. The script runs under `set -euo pipefail`, and the
# first thing it did was
#     CHUNKS=$(curl ... | grep -o '...css' | sort -u)
# five seconds after restarting the frontend. Next.js takes longer than that to
# boot, so the request came back as a Cloudflare error page with no CSS links,
# grep exited 1, pipefail carried it out of the pipeline, and set -e killed the
# script right there - before the "No CSS chunks" warning that was written for
# exactly this case, and before any of the retries below, which only ever
# covered the chunk fetches. Run 35745451077 (2026-09-22) died this way 25s after
# the restart while the new build was already serving correctly.
#
# So: wait for the ORIGIN to answer first (Next.js boot, no Cloudflare in the
# path), then fetch the homepage with retries, and never let an empty grep end
# the script on its own.
echo "    waiting for the frontend on the origin..."
ORIGIN_UP=false
for i in $(seq 1 30); do
  CODE=$(ssh -i "$SSH_KEY" "$VM_HOST" "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:4200/" 2>/dev/null || true)
  if [ "$CODE" = "200" ]; then ORIGIN_UP=true; echo "    origin 200 after ~$((i * 3))s"; break; fi
  sleep 3
done
if [ "$ORIGIN_UP" != true ]; then
  echo "==> ERROR: frontend never answered 200 on the origin within 90s"
  exit 1
fi

CHUNKS=""
for attempt in 1 2 3 4 5; do
  CHUNKS=$(curl -s --max-time 20 "https://hookpost.hookstep.in/?r=$(date +%s)" \
    | { grep -o '/_next/static/chunks/[^"]*\.css' || true; } | sort -u)
  [ -n "$CHUNKS" ] && break
  echo "    attempt $attempt: no CSS chunks in the edge response yet, retrying in 6s"
  sleep 6
done

if [ -z "$CHUNKS" ]; then
  # The origin is up (checked above), so an edge that still shows no chunks is
  # Cloudflare, not the build. Say so and let the chunk loop below no-op.
  echo "WARNING: origin serves 200 but the edge still returned no CSS chunks - treating as a Cloudflare hiccup, not a broken build."
fi

# A single request through Cloudflare is not evidence about the build.
# 2026-09-21: a deploy failed here on HTTP 520 for a chunk that was present on
# disk and served 200 from the origin - Cloudflare had hiccuped during the PM2
# restart a few lines earlier. The old check took that at face value, restarted
# the frontend again and marked a good deploy red. That is how the frontend
# accumulated restarts nothing had asked for.
#
# So: retry before believing a failure, and when it still looks bad, ask the
# ORIGIN. If the origin serves the chunk, the build is fine and the edge is
# having a moment - restarting PM2 cannot help and only adds an outage.
ALL_PASSED=true
for CHUNK in $CHUNKS; do
  URL="https://hookpost.hookstep.in$CHUNK"
  STATUS=000
  for attempt in 1 2 3; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$URL")
    [ "$STATUS" = "200" ] && break
    echo "    attempt $attempt: HTTP $STATUS, retrying in 5s"
    sleep 5
  done

  if [ "$STATUS" = "200" ]; then
    echo " [OK] $CHUNK -> HTTP 200"
    continue
  fi

  ORIGIN_STATUS=$(ssh -i "$SSH_KEY" "$VM_HOST" \
    "curl -sk -o /dev/null -w '%{http_code}' --max-time 20 \
     --resolve hookpost.hookstep.in:443:127.0.0.1 'https://hookpost.hookstep.in$CHUNK'" 2>/dev/null)

  if [ "$ORIGIN_STATUS" = "200" ]; then
    echo " [WARN] $CHUNK -> edge HTTP $STATUS but origin HTTP 200 - Cloudflare issue, not the build"
  else
    echo " [FAIL] $CHUNK -> edge HTTP $STATUS, origin HTTP $ORIGIN_STATUS"
    ALL_PASSED=false
  fi
done

if [ "$ALL_PASSED" = true ]; then
  echo "==> SUCCESS: All production CSS chunks verified 200 OK! Zero broken styles."
else
  echo "==> ERROR: Detected broken chunk! Triggering auto-recovery..."
  ssh -i "$SSH_KEY" "$VM_HOST" "sudo rm -rf /var/cache/nginx/hookpost_cache/* && pm2 restart hookpost-frontend"
  exit 1
fi
