#!/usr/bin/env bash
# Interactively set the Razorpay credentials in .env.production, then deploy.
#
# Values are read from your terminal and written straight to the env file. The
# secrets are read with `read -s`, so they are never echoed to the screen and
# never land in your shell history.
#
# Usage:  ./deploy/vm/set-payment-keys.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.production"

say()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m    %s\033[0m\n' "$*"; }
die()  { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$ENV_FILE" ] || die "$ENV_FILE not found."

say "Razorpay credentials"
echo "    Dashboard -> Settings -> API Keys (check Test/Live mode first)."
echo

printf 'Key ID (rzp_test_... or rzp_live_...): '
read -r KEY_ID
[ -n "$KEY_ID" ] || die "Key ID cannot be empty."
case "$KEY_ID" in
  rzp_test_*) MODE="TEST" ;;
  rzp_live_*) MODE="LIVE" ;;
  *) die "That does not look like a Razorpay key id (expected rzp_test_ or rzp_live_ prefix)." ;;
esac

printf 'Key Secret (hidden): '
read -rs KEY_SECRET; echo
[ -n "$KEY_SECRET" ] || die "Key secret cannot be empty."

printf 'Webhook Secret (hidden) -- the string you set on the webhook, NOT the key secret: '
read -rs WEBHOOK_SECRET; echo
[ -n "$WEBHOOK_SECRET" ] || die "Webhook secret cannot be empty."

if [ "$KEY_SECRET" = "$WEBHOOK_SECRET" ]; then
  warn "Key secret and webhook secret are identical."
  warn "These are different values in Razorpay. If you reused the API secret as"
  warn "the webhook secret, every webhook will fail signature verification and"
  warn "no subscription will ever activate."
  printf '    Continue anyway? [y/N] '
  read -r ans
  [ "$ans" = "y" ] || [ "$ans" = "Y" ] || die "Aborted."
fi

# Replace in place. Uses a temp file rather than sed -i so the secrets never
# appear in a command line (and therefore never in the process list).
say "Writing to .env.production"
python3 - "$ENV_FILE" "$KEY_ID" "$KEY_SECRET" "$WEBHOOK_SECRET" <<'PY'
import sys, re
path, key_id, key_secret, webhook_secret = sys.argv[1:5]
values = {
    'RAZORPAY_KEY_ID': key_id,
    'RAZORPAY_KEY_SECRET': key_secret,
    'RAZORPAY_WEBHOOK_SECRET': webhook_secret,
    'NEXT_PUBLIC_RAZORPAY_KEY_ID': key_id,
}
lines = open(path).read().splitlines()
seen = set()
for i, line in enumerate(lines):
    m = re.match(r'^([A-Z_][A-Z0-9_]*)=', line)
    if m and m.group(1) in values:
        name = m.group(1)
        lines[i] = f'{name}="{values[name]}"'
        seen.add(name)
for name, val in values.items():
    if name not in seen:
        lines.append(f'{name}="{val}"')
open(path, 'w').write("\n".join(lines) + "\n")
print(f"    set {len(values)} variables")
PY
chmod 600 "$ENV_FILE"

say "Verifying (values masked)"
grep -E '^(RAZORPAY_KEY_ID|RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET|NEXT_PUBLIC_RAZORPAY_KEY_ID)=' "$ENV_FILE" \
  | sed -E 's/=".{0,6}.*"/="<set>"/' \
  | sed 's/^/    /'

if [ "$MODE" = "LIVE" ]; then
  warn ""
  warn "These are LIVE keys. Any subscription you create is a real charge on a"
  warn "real card, refundable only through the Razorpay dashboard."
  printf '    Deploy with LIVE keys? [y/N] '
  read -r ans
  [ "$ans" = "y" ] || [ "$ans" = "Y" ] || { echo "    Saved but not deployed."; exit 0; }
fi

say "Deploying ($MODE mode)"
"$REPO_ROOT/deploy/vm/release.sh"

cat <<DONE

------------------------------------------------------------------
Billing is now enabled in $MODE mode.

Still to do in the Razorpay dashboard (same mode!):
  Settings -> Webhooks -> Add
    URL:    https://hookpost.hookstep.in/api/razorpay
    Secret: the webhook secret you just entered
    Events: subscription.activated, subscription.charged,
            subscription.updated, subscription.cancelled,
            subscription.completed, subscription.pending,
            subscription.halted
------------------------------------------------------------------
DONE
