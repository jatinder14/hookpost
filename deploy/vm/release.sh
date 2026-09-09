#!/usr/bin/env bash
# Push config to the Hookpost VM and (re)start the stack.
#
# Reads .env.production from the repo root -- that file is gitignored and must
# contain YOUR OWN credentials. This script refuses to run while any
# placeholder is still unfilled.
set -euo pipefail

PROJECT="${PROJECT:-jr-consulting-co}"
ZONE="${ZONE:-asia-south1-a}"
REGION="${REGION:-asia-south1}"
VM_NAME="${VM_NAME:-hookpost-prod}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
# The image was built into the us-central1 registry; a Mumbai VM pulls it
# cross-region, which only costs a slower first pull.
IMAGE_REGION="${IMAGE_REGION:-us-central1}"
IMAGE="${IMAGE_REGION}-docker.pkg.dev/${PROJECT}/hookpost/hookpost:${IMAGE_TAG}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.production"

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$ENV_FILE" ] || die "$ENV_FILE not found. Copy .env.production.example and fill it in."

# Only inspect actual assignments -- the file's own comments mention the
# placeholder text, and matching those would block every deploy.
UNFILLED="$(grep -nE '^[A-Za-z_][A-Za-z0-9_]*=.*FILL ME' "$ENV_FILE" || true)"
if [ -n "$UNFILLED" ]; then
  echo "These values are still placeholders:" >&2
  echo "$UNFILLED" >&2
  die "Fill in every '<<< FILL ME >>>' before deploying."
fi

# Generated once and then reused, so a redeploy never orphans the data volume.
say "Resolving database passwords"
PG_PASS_FILE="$REPO_ROOT/.deploy-secrets"
if [ ! -f "$PG_PASS_FILE" ]; then
  {
    echo "POSTGRES_PASSWORD=$(openssl rand -hex 24)"
    echo "TEMPORAL_DB_PASSWORD=$(openssl rand -hex 24)"
  } > "$PG_PASS_FILE"
  chmod 600 "$PG_PASS_FILE"
  echo "    generated new passwords -> .deploy-secrets (keep this file!)"
else
  echo "    reusing existing .deploy-secrets"
fi

run_on_vm() {
  gcloud compute ssh "$VM_NAME" --zone "$ZONE" --project "$PROJECT" \
    --tunnel-through-iap --command "$1"
}

say "Creating /opt/hookpost on the VM"
run_on_vm "sudo mkdir -p /opt/hookpost && sudo chown -R \$(whoami) /opt/hookpost"

say "Uploading config"
for f in "$ENV_FILE:app.env" \
         "$REPO_ROOT/deploy/vm/docker-compose.prod.yaml:docker-compose.yaml" \
         "$REPO_ROOT/deploy/vm/Caddyfile:Caddyfile"; do
  src="${f%%:*}"; dst="${f##*:}"
  gcloud compute scp "$src" "$VM_NAME:/opt/hookpost/$dst" \
    --zone "$ZONE" --project "$PROJECT" --tunnel-through-iap
  echo "    $dst"
done
# Write the compose interpolation file on the VM. Doing it here (rather than
# exporting variables for a single command) means docker compose keeps working
# in any later shell, and across a reboot.
run_on_vm "
  set -e
  umask 077
  cat > /opt/hookpost/.env <<EOF
HOOKPOST_IMAGE=${IMAGE}
$(cat "$PG_PASS_FILE")
EOF
  chmod 600 /opt/hookpost/.env /opt/hookpost/app.env
"

say "Authenticating Docker to Artifact Registry and starting the stack"
run_on_vm "
  set -e
  gcloud auth configure-docker ${IMAGE_REGION}-docker.pkg.dev --quiet
  cd /opt/hookpost
  docker compose pull
  docker compose up -d --remove-orphans
  docker compose ps

  # The image is ~6.6GB, so a handful of old tags fills a 60GB disk. Drop any
  # hookpost image no container is using; the running one is protected by
  # docker itself and cannot be removed.
  docker image prune -af --filter 'label!=keep' >/dev/null 2>&1 || true
  echo '--- disk after prune ---'
  df -h / | tail -1
"

STATIC_IP=$(gcloud compute addresses describe "${VM_NAME}-ip" \
  --region "$REGION" --project "$PROJECT" --format='value(address)' 2>/dev/null || echo '?')

cat <<DONE

------------------------------------------------------------------
Stack started. First boot takes 1-2 minutes (schema push + app start).

Check progress:
    gcloud compute ssh $VM_NAME --zone $ZONE --project $PROJECT \\
      --tunnel-through-iap --command 'cd /opt/hookpost && docker compose logs -f hookpost'

Then visit: https://hookpost.hookstep.in   (A record -> ${STATIC_IP})
------------------------------------------------------------------
DONE
