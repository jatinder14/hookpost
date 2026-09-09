#!/usr/bin/env bash
# =============================================================================
# Publish the three Hookpost npm packages.
#
# npm requires a 2FA code for every publish. Codes last about 30 seconds, which
# is enough for all three back to back - this asks once and reuses it, rather
# than making you re-read the authenticator three times.
#
#   ./scripts/publish-packages.sh            # prompts for the code
#   ./scripts/publish-packages.sh 123456     # or pass it in
#
# Versions already on the registry are skipped, so re-running is safe.
# =============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! npm whoami >/dev/null 2>&1; then
  echo "Not logged in to npm. Run: npm login"
  exit 1
fi
echo "npm user: $(npm whoami)"

# Ask for the code only if there is actually something left to publish.
latest_on_registry() {
  curl -s -m 20 "https://registry.npmjs.org/${1//\//%2F}" | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  try{const j=JSON.parse(s);console.log(j.error?'':j['dist-tags'].latest)}catch{console.log('')}
})"
}

DIRS=(apps/sdk apps/cli apps/n8n-node)
TODO=()
for dir in "${DIRS[@]}"; do
  name="$(node -p "require('$ROOT/$dir/package.json').name")"
  want="$(node -p "require('$ROOT/$dir/package.json').version")"
  have="$(latest_on_registry "$name")"
  if [ "$have" = "$want" ]; then
    echo "skip    $name@$want (already on the registry)"
  else
    TODO+=("$dir")
  fi
done

if [ ${#TODO[@]} -eq 0 ]; then
  echo ""
  echo "Nothing to publish - every package is already live at its current version."
  echo "Bump the version in package.json first if you meant to release a change."
  exit 0
fi

OTP="${1:-}"
if [ -z "$OTP" ]; then
  read -r -p "npm one-time code (from your authenticator): " OTP
fi
[ -z "$OTP" ] && { echo "No code given."; exit 1; }

FAILED=0
for dir in "${TODO[@]}"; do
  name="$(node -p "require('$ROOT/$dir/package.json').name")"
  echo ""
  echo "=============================================================="
  echo "publishing $name  ($dir)"
  echo "=============================================================="
  # --access public matters for scoped names and is harmless otherwise.
  if ( cd "$ROOT/$dir" && npm publish --access public --otp "$OTP" ); then
    echo "OK  $name published"
  else
    echo "FAILED  $name  (see the npm error above)"
    FAILED=1
  fi
done

echo ""
echo "=== verifying against the registry ==="
sleep 4
for dir in "${DIRS[@]}"; do
  name="$(node -p "require('$ROOT/$dir/package.json').name")"
  want="$(node -p "require('$ROOT/$dir/package.json').version")"
  have="$(latest_on_registry "$name")"
  if [ "$have" = "$want" ]; then
    echo "  live     $name@$have"
  elif [ -n "$have" ]; then
    echo "  BEHIND   $name  registry=$have  local=$want"
    FAILED=1
  else
    echo "  MISSING  $name"
    FAILED=1
  fi
done

exit $FAILED
