#!/usr/bin/env bash
# Nightly off-box backup of Temporal's two databases to Cloudflare R2.
#
# Temporal's data is semi-disposable - a wipe costs running workflows, not
# business data, and missingPostWorkflow re-queues any QUEUE post whose
# publishDate is within the last 2 days. But that 2-day window is the whole
# safety margin, so a backup that lets us restore in minutes is worth the
# 3 MB a night it costs.
#
# Credentials come from the app's own .env (the same R2 bucket the product
# already uses); nothing new to rotate.
set -euo pipefail

ENV_FILE=/home/flexiple_jr/hookpost/.env
OUT=/home/flexiple_jr/backups
KEEP_LOCAL_DAYS=7
STAMP=$(date -u +%Y%m%dT%H%M%SZ)

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a
PGPASSWORD=$(cat /root/.temporal_db_password 2>/dev/null || sudo cat /root/.temporal_db_password)
export PGPASSWORD

mkdir -p "$OUT"
for db in temporal temporal_visibility; do
  pg_dump -h 127.0.0.1 -U temporal -d "$db" -Fc -f "$OUT/${db}-${STAMP}.dump"
done

# R2 speaks S3. The endpoint is account-scoped, not bucket-scoped.
export AWS_ACCESS_KEY_ID="$CLOUDFLARE_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$CLOUDFLARE_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION=auto
ENDPOINT="https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"

for db in temporal temporal_visibility; do
  f="$OUT/${db}-${STAMP}.dump"
  aws s3 cp "$f" "s3://${CLOUDFLARE_BUCKETNAME}/db-backups/${db}/${STAMP}.dump" \
    --endpoint-url "$ENDPOINT" --only-show-errors
  echo "uploaded $(basename "$f") ($(du -h "$f" | cut -f1))"
done

# Local copies are a convenience for a fast restore; R2 is the real archive.
find "$OUT" -name '*.dump' -mtime +$KEEP_LOCAL_DAYS -delete
