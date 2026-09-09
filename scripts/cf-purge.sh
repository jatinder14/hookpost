#!/usr/bin/env bash
# Purge the Cloudflare cache for hookstep.in.
#
#   ./scripts/cf-purge.sh                 # purge EVERYTHING for the zone
#   ./scripts/cf-purge.sh <url> [url...]  # purge only the given URLs
#
# Reads credentials from the environment (never hardcode them here):
#   CLOUDFLARE_API_TOKEN  scoped token with Zone > Cache Purge > Purge
#   CLOUDFLARE_ZONE_ID    zone id for hookstep.in
# On the prod VM these live in ~/hookpost/.env, so run:
#   set -a; . ~/hookpost/.env; set +a; ~/hookpost/scripts/cf-purge.sh <url>
set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?set CLOUDFLARE_API_TOKEN (see ~/hookpost/.env)}"
: "${CLOUDFLARE_ZONE_ID:?set CLOUDFLARE_ZONE_ID (see ~/hookpost/.env)}"

api="https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache"
auth=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json")

if [ "$#" -eq 0 ]; then
  echo "Purging EVERYTHING for zone ${CLOUDFLARE_ZONE_ID}..."
  body='{"purge_everything":true}'
else
  files=$(printf '"%s",' "$@"); files="[${files%,}]"
  echo "Purging ${#} url(s)..."
  body="{\"files\":${files}}"
fi

curl -fsS -X POST "$api" "${auth[@]}" --data "$body" \
  | python3 -c 'import sys,json;d=json.load(sys.stdin);print("OK" if d.get("success") else "FAILED: "+json.dumps(d.get("errors")))'
