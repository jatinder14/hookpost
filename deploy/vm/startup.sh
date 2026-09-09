#!/bin/bash
# GCE startup script: prepare an Ubuntu LTS host to run the Hookpost stack.
#
# Runs as root on every boot. Idempotent -- the apt install is a no-op once
# Docker is present.
#
# Why Ubuntu and not Container-Optimized OS: COS ships no package manager and
# no `docker compose` plugin, and mounts /opt read-only even for root. A
# compose-based stack cannot run there.
set -euxo pipefail

APP_DIR=/opt/hookpost

if ! command -v docker >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y ca-certificates curl gnupg

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update
  apt-get install -y \
    docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
fi

systemctl enable --now docker

mkdir -p "$APP_DIR"

# Let the interactive login user drive docker without sudo. GCE OS Login users
# are created on first SSH, so also add any existing uid>=1000 accounts.
for u in $(awk -F: '$3>=1000 && $3<65534 {print $1}' /etc/passwd); do
  usermod -aG docker "$u" || true
done
# And make the directory group-writable by docker users.
chgrp docker "$APP_DIR" || true
chmod 2775 "$APP_DIR"

# Authenticate Docker against Artifact Registry in both regions we may pull from.
gcloud auth configure-docker \
  asia-south1-docker.pkg.dev,us-central1-docker.pkg.dev --quiet || true

touch /var/log/hookpost-startup-complete
echo "startup script finished"
