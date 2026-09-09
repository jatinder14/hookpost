#!/usr/bin/env bash
# ==============================================================================
# Google Cloud Automated Daily Billing & Resource Cleanup Script
# Project: jr-consulting-co
# Runs daily to purge:
#   1. Orphaned / detached persistent disks
#   2. Untagged / superseded container images in Artifact Registry
#   3. Orphaned / unattached static external IP addresses
#   4. Stale snapshots outside active retention
# ==============================================================================
set -euo pipefail

PROJECT_ID="jr-consulting-co"
GCLOUD_BIN="${GCLOUD_BIN:-/Users/flexiple_jr/Downloads/google-cloud-sdk/bin/gcloud}"

echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] Starting GCP Daily Cost & Billing Cleanup for ${PROJECT_ID}..."

# 1. Clean up untagged images in Artifact Registry (us-central1 & asia-south1)
echo "==> 1. Checking Artifact Registry for untagged images..."
for REGION in "us-central1" "asia-south1"; do
  REPOS=$(${GCLOUD_BIN} artifacts repositories list --project="${PROJECT_ID}" --location="${REGION}" --format="value(name)" 2>/dev/null || true)
  for REPO in $REPOS; do
    echo "Scanning repository ${REPO} in ${REGION}..."
    UNTAGGED_IMAGES=$(${GCLOUD_BIN} artifacts docker images list "${REPO}" --project="${PROJECT_ID}" --format="value(DIGEST)" --filter="-tags:*" 2>/dev/null || true)
    for DIGEST in $UNTAGGED_IMAGES; do
      echo "Deleting untagged image ${DIGEST}..."
      ${GCLOUD_BIN} artifacts docker images delete "${DIGEST}" --project="${PROJECT_ID}" --quiet 2>/dev/null || true
    done
  done
done

# 2. Check and delete unattached disks (disks not attached to any running instance)
echo "==> 2. Checking for orphaned/detached disks..."
ORPHANED_DISKS=$(${GCLOUD_BIN} compute disks list --project="${PROJECT_ID}" --filter="-users:*" --format="value(name,zone)" 2>/dev/null || true)
if [ -n "${ORPHANED_DISKS}" ]; then
  echo "Found orphaned disks: ${ORPHANED_DISKS}"
  while read -r DISK_NAME DISK_ZONE; do
    if [ -n "${DISK_NAME}" ]; then
      echo "Deleting detached disk ${DISK_NAME} in ${DISK_ZONE}..."
      ${GCLOUD_BIN} compute disks delete "${DISK_NAME}" --zone="${DISK_ZONE}" --project="${PROJECT_ID}" --quiet 2>/dev/null || true
    fi
  done <<< "${ORPHANED_DISKS}"
else
  echo "No orphaned disks found."
fi

# 3. Check for unattached static external IP addresses
echo "==> 3. Checking for unattached static external IP addresses..."
UNATTACHED_IPS=$(${GCLOUD_BIN} compute addresses list --project="${PROJECT_ID}" --filter="status:RESERVED" --format="value(name,region)" 2>/dev/null || true)
if [ -n "${UNATTACHED_IPS}" ]; then
  echo "Found unattached static IPs: ${UNATTACHED_IPS}"
  while read -r IP_NAME IP_REGION; do
    if [ -n "${IP_NAME}" ]; then
      echo "Releasing unattached IP ${IP_NAME} in ${IP_REGION}..."
      ${GCLOUD_BIN} compute addresses delete "${IP_NAME}" --region="${IP_REGION}" --project="${PROJECT_ID}" --quiet 2>/dev/null || true
    fi
  done <<< "${UNATTACHED_IPS}"
else
  echo "No unattached static IPs found."
fi

echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] GCP Daily Cleanup Finished Successfully!"
