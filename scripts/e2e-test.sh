#!/usr/bin/env bash
# End-to-end smoke test against a running Hookpost instance.
#
# Exercises what can be driven without a human: the public page, registration,
# login, authenticated API access, the billing endpoints, and the Razorpay
# webhook path (using a correctly signed synthetic event, so no money moves).
#
# Run ON the VM, where the webhook secret already lives:
#   docker exec -i hookpost bash < scripts/e2e-test.sh
# or locally against the public URL with WEBHOOK_SECRET exported.
set -uo pipefail

BASE="${BASE:-http://localhost:5000}"
API="$BASE/api"
PASS=0; FAIL=0
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$*"; PASS=$((PASS+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; FAIL=$((FAIL+1)); }
head_() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }

# expect <label> <actual> <expected...>
expect() {
  local label="$1" actual="$2"; shift 2
  for want in "$@"; do
    [ "$actual" = "$want" ] && { ok "$label ($actual)"; return; }
  done
  bad "$label — got $actual, wanted $*"
}

code() { curl -sS -m 30 -o /dev/null -w '%{http_code}' "$@" 2>/dev/null; }
body() { curl -sS -m 30 "$@" 2>/dev/null; }

TS="$(date +%s)"
EMAIL="e2e-${TS}@hookpost.test"
PASSWORD="TestPass!${TS}"

head_ "Public surface"
expect "landing page /"            "$(code "$BASE/")" 200
expect "login page"                "$(code "$BASE/auth/login")" 200
expect "register page"             "$(code "$BASE/auth")" 200
expect "api root reachable"        "$(code "$API/")" 200 404
expect "billing requires auth"     "$(code "$API/billing/")" 401 403

LANDING="$(body "$BASE/")"
case "$LANDING" in
  *Hookpost*) ok "landing page mentions Hookpost" ;;
  *)          bad "landing page missing brand" ;;
esac
case "$LANDING" in
  *Postiz*) ok "landing page carries AGPL attribution" ;;
  *)        bad "landing page missing upstream attribution" ;;
esac

head_ "Registration and login"
REG_CODE="$(curl -sS -m 30 -o /tmp/e2e_reg.json -w '%{http_code}' \
  -X POST "$API/auth/register" \
  -H 'Content-Type: application/json' \
  -c "$COOKIE_JAR" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"company\":\"E2E Co\",\"provider\":\"LOCAL\"}" 2>/dev/null)"
expect "register new user" "$REG_CODE" 200 201
[ -s /tmp/e2e_reg.json ] && head -c 200 /tmp/e2e_reg.json | sed 's/^/        /'

LOGIN_CODE="$(curl -sS -m 30 -o /tmp/e2e_login.json -w '%{http_code}' \
  -X POST "$API/auth/login" \
  -H 'Content-Type: application/json' \
  -c "$COOKIE_JAR" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"provider\":\"LOCAL\"}" 2>/dev/null)"
expect "login" "$LOGIN_CODE" 200 201

if grep -q 'auth' "$COOKIE_JAR" 2>/dev/null; then
  ok "auth cookie issued"
else
  bad "no auth cookie — authenticated checks below will fail"
fi

head_ "Authenticated API"
expect "GET /user/self"            "$(code -b "$COOKIE_JAR" "$API/user/self")" 200
expect "GET /billing (subscription)" "$(code -b "$COOKIE_JAR" "$API/billing/")" 200
expect "GET /integrations/list"    "$(code -b "$COOKIE_JAR" "$API/integrations/list")" 200
expect "GET /posts (calendar)"     "$(code -b "$COOKIE_JAR" "$API/posts?week=1&year=2026&display=week&customer=")" 200 400

SELF="$(body -b "$COOKIE_JAR" "$API/user/self")"
case "$SELF" in
  *tier*|*subscription*|*email*) ok "/user/self returned a user object" ;;
  *)                             bad "/user/self body unexpected: $(printf '%s' "$SELF" | head -c 120)" ;;
esac

head_ "Razorpay webhook (signed synthetic event — no money)"
if [ -z "${RAZORPAY_WEBHOOK_SECRET:-}" ]; then
  bad "RAZORPAY_WEBHOOK_SECRET not set in this environment; skipping"
else
  # Unsigned must be rejected.
  expect "rejects unsigned webhook" \
    "$(code -X POST "$API/razorpay" -H 'Content-Type: application/json' \
        -H 'x-razorpay-signature: nonsense' -d '{"event":"subscription.charged"}')" 400

  PAYLOAD='{"event":"subscription.activated","payload":{"subscription":{"entity":{"id":"sub_E2E'"$TS"'","customer_id":"cust_E2E'"$TS"'","plan_id":"plan_does_not_exist","status":"active","current_start":1,"current_end":2,"end_at":99999999999,"total_count":120,"notes":{"service":"hookpost","billing":"STANDARD","period":"MONTHLY","orgId":"e2e-nonexistent"}}}}}'
  SIG="$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$RAZORPAY_WEBHOOK_SECRET" -hex | sed 's/.*= *//')"
  WH_CODE="$(curl -sS -m 30 -o /tmp/e2e_wh.json -w '%{http_code}' \
    -X POST "$API/razorpay" -H 'Content-Type: application/json' \
    -H "x-razorpay-signature: $SIG" -d "$PAYLOAD" 2>/dev/null)"
  expect "accepts correctly signed webhook" "$WH_CODE" 200
  [ -s /tmp/e2e_wh.json ] && sed 's/^/        /' /tmp/e2e_wh.json && echo
fi

head_ "Scheduler / Temporal"
expect "orchestrator health" "$(code "http://localhost:3002/health")" 200 404
if command -v nc >/dev/null 2>&1; then
  nc -z temporal 7233 2>/dev/null && ok "temporal reachable on 7233" \
    || bad "temporal not reachable on 7233"
fi

printf '\n\033[1m== %d passed, %d failed ==\033[0m\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
