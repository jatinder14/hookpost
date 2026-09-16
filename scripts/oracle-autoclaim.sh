#!/usr/bin/env bash
# ==============================================================================
# Hookpost Oracle Cloud Always Free Ampere A1 Auto-Claim Daemon
# Continuously retries launching the 24GB/12GB RAM instance until a slot frees up.
# ==============================================================================
set -euo pipefail

COMPARTMENT_ID="ocid1.tenancy.oc1..aaaaaaaaucoi7npdwidbvcrcwj37qulp66zqyk27n47xwy4jb7l6ukaxyjda"
AD_NAME="gePE:AP-SINGAPORE-1-AD-1"
IMAGE_ID="ocid1.image.oc1.ap-singapore-1.aaaaaaaakkcufaxe5ebkgdaaaiyozntfh27q6arlz6hbwcj462sfgha2q3xa"
SUBNET_ID="ocid1.subnet.oc1.ap-singapore-1.aaaaaaaatmst72566cltucy2hpqiycdibsy6cnwmdlf7gajc7q2b6sdf76ra"
SSH_KEY_FILE="$HOME/.ssh/id_ed25519.pub"
OUTPUT_FILE="$(pwd)/oracle_instance.json"
ATTEMPT=1

echo "======================================================================="
echo "🚀 Starting Oracle Cloud Singapore Always Free Ampere Auto-Claim Daemon"
echo "Target: Ubuntu 24.04 ARM (Ampere A1.Flex)"
echo "Subnet: ${SUBNET_ID}"
echo "======================================================================="

# We cycle between 4 OCPU / 24GB and 2 OCPU / 12GB to maximize slot grab probability
CONFIGS=(
  '{"ocpus":4,"memoryInGBs":24}'
  '{"ocpus":2,"memoryInGBs":12}'
)

while true; do
  for CONFIG in "${CONFIGS[@]}"; do
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] Attempt #${ATTEMPT}: Requesting shape ${CONFIG}..."
    
    RESPONSE=$(oci compute instance launch \
      --availability-domain "${AD_NAME}" \
      --compartment-id "${COMPARTMENT_ID}" \
      --shape "VM.Standard.A1.Flex" \
      --shape-config "${CONFIG}" \
      --source-details "{\"sourceType\": \"image\", \"imageId\": \"${IMAGE_ID}\", \"bootVolumeSizeInGBs\": 100}" \
      --subnet-id "${SUBNET_ID}" \
      --assign-public-ip true \
      --display-name "hookpost-prod" \
      --ssh-authorized-keys-file "${SSH_KEY_FILE}" 2>&1 || true)
      
    if echo "${RESPONSE}" | grep -q '"lifecycle-state": "PROVISIONING"'; then
      echo ""
      echo "🎉🎉🎉 BOOM! SUCCESS! Oracle Ampere instance has been claimed! 🎉🎉🎉"
      echo "${RESPONSE}" > "${OUTPUT_FILE}"
      
      INSTANCE_ID=$(echo "${RESPONSE}" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)
      echo "Instance OCID: ${INSTANCE_ID}"
      echo "Waiting 30 seconds for VNIC and Public IP assignment..."
      sleep 30
      
      PUBLIC_IP=$(oci compute instance list-vnics --instance-id "${INSTANCE_ID}" | grep -o '"public-ip": "[^"]*"' | head -1 | cut -d'"' -f4 || true)
      echo "Public IP Address: ${PUBLIC_IP}"
      
      echo "{\"instanceId\": \"${INSTANCE_ID}\", \"publicIp\": \"${PUBLIC_IP}\", \"claimedAt\": \"$(date -u)\"}" > "${OUTPUT_FILE}"
      echo "Instance metadata saved to ${OUTPUT_FILE}"
      exit 0
    elif echo "${RESPONSE}" | grep -q "Out of host capacity"; then
      echo "   → Result: Out of host capacity (slot busy). Waiting..."
    elif echo "${RESPONSE}" | grep -q "TooManyRequests"; then
      echo "   → Result: Rate limited (429). Backing off 30s..."
      sleep 30
    else
      echo "   → API Response: $(echo "${RESPONSE}" | head -n 3)"
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    sleep 40
  done
done
