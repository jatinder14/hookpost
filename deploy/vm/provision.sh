#!/usr/bin/env bash
# Provision the Hookpost production VM on Compute Engine.
#
# Creates: a static external IP, an Ubuntu LTS VM with Docker + compose
# installed by startup.sh, and firewall rules for 80/443 only.
#
# Idempotent: re-running skips anything that already exists.
#
# Region defaults to asia-south1 (Mumbai) because pricing is in INR and the
# users are in India; us-central1 adds ~250ms of round-trip latency.
#
# Image family is Ubuntu LTS, NOT Container-Optimized OS. COS ships no package
# manager and no `docker compose` plugin, and mounts /opt read-only even for
# root, so a compose-based stack cannot run on it.
set -euo pipefail

PROJECT="${PROJECT:-jr-consulting-co}"
REGION="${REGION:-asia-south1}"
ZONE="${ZONE:-asia-south1-a}"
VM_NAME="${VM_NAME:-hookpost-prod}"
MACHINE_TYPE="${MACHINE_TYPE:-e2-standard-2}"
DISK_SIZE="${DISK_SIZE:-60GB}"
# Where the image lives. Kept separate from REGION so a Mumbai VM can pull an
# image that was built into the us-central1 registry.
IMAGE_REGION="${IMAGE_REGION:-us-central1}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE="${IMAGE_REGION}-docker.pkg.dev/${PROJECT}/hookpost/hookpost:${IMAGE_TAG}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

say "Reserving static IP ${VM_NAME}-ip in ${REGION}"
gcloud compute addresses create "${VM_NAME}-ip" \
  --region "$REGION" --project "$PROJECT" 2>/dev/null \
  || echo "    already reserved"
STATIC_IP=$(gcloud compute addresses describe "${VM_NAME}-ip" \
  --region "$REGION" --project "$PROJECT" --format='value(address)')
echo "    IP: $STATIC_IP"

say "Firewall: allow HTTP/HTTPS to tagged instances"
gcloud compute firewall-rules create hookpost-allow-web \
  --project "$PROJECT" \
  --allow=tcp:80,tcp:443 \
  --target-tags=hookpost-web \
  --description="Public web traffic to Hookpost" 2>/dev/null \
  || echo "    already exists"

say "Creating VM ${VM_NAME} (${MACHINE_TYPE}, Ubuntu LTS, ${ZONE})"
if gcloud compute instances describe "$VM_NAME" \
     --zone "$ZONE" --project "$PROJECT" >/dev/null 2>&1; then
  echo "    already exists"
else
  gcloud compute instances create "$VM_NAME" \
    --project "$PROJECT" \
    --zone "$ZONE" \
    --machine-type "$MACHINE_TYPE" \
    --image-family=ubuntu-2404-lts-amd64 \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size "$DISK_SIZE" \
    --boot-disk-type=pd-balanced \
    --address "$STATIC_IP" \
    --tags=hookpost-web \
    --scopes=cloud-platform \
    --metadata-from-file "startup-script=${SCRIPT_DIR}/startup.sh" \
    --metadata=google-logging-enabled=true
fi

say "Waiting for the startup script to install Docker (a few minutes)"
for i in $(seq 1 60); do
  if gcloud compute ssh "$VM_NAME" --zone "$ZONE" --project "$PROJECT" \
       --tunnel-through-iap --command 'test -f /var/log/hookpost-startup-complete' \
       >/dev/null 2>&1; then
    echo "    Docker is ready"
    break
  fi
  printf '.'
  sleep 15
done

cat <<NEXT

------------------------------------------------------------------
VM is up at ${STATIC_IP}  (${ZONE})

NEXT STEPS (in order):

1. Point DNS at the VM. In GoDaddy DNS for hookstep.in add:
       Type: A    Name: hookpost    Value: ${STATIC_IP}    TTL: 600
   Caddy cannot issue a TLS certificate until this name resolves.

2. Fill in your own secrets locally:
       cp .env.production.example .env.production
       \$EDITOR .env.production

3. Push config and start the stack:
       ./deploy/vm/release.sh

Image to be deployed: ${IMAGE}
------------------------------------------------------------------
NEXT
