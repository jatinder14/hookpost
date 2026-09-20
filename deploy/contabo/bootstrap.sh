#!/usr/bin/env bash
# Provision a Contabo Cloud VPS to run Hookpost, replacing the GCP e2-small.
#
# Idempotent: safe to re-run. Every step checks before it acts.
#
# Two things are deliberately NOT here:
#   - the .env, which lives in GCP Secret Manager (hookpost-dotenv) and is
#     copied across separately so it never lands in git or in a shell history
#   - the frontend build, which must happen on a CI runner. The old 2 GB box
#     could not build Next.js at all; this box has 8 GB and probably could,
#     but keeping the build in CI means the VM stays reproducible.
#
# The app user is called flexiple_jr on purpose: every PM2 path, nginx root,
# cron entry and systemd unit in this project hard-codes /home/flexiple_jr,
# so matching the name makes the migration a copy instead of a rewrite.
set -euo pipefail

APP_USER=flexiple_jr
APP_HOME=/home/$APP_USER
NODE_MAJOR=24
PG_MAJOR=16
TEMPORAL_VERSION=1.31.2

log(){ printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

# ---------------------------------------------------------------- base system
log "base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl ca-certificates gnupg git rsync ufw fail2ban \
  build-essential unzip jq postgresql-$PG_MAJOR postgresql-client-$PG_MAJOR nginx

# ------------------------------------------------------------------- app user
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  log "creating $APP_USER"
  adduser --disabled-password --gecos "" "$APP_USER"
  usermod -aG sudo "$APP_USER"
  echo "$APP_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/90-$APP_USER
  chmod 440 /etc/sudoers.d/90-$APP_USER
fi
# adduser leaves the home directory at 750 on Ubuntu 24.04. nginx runs as
# www-data and serves /uploads and the frontend's public/ from under here, so
# it needs to traverse (x) - not list (r). Without this every static file 404s,
# and because open_file_cache_errors is on, the 404 survives the fix for a
# further 60s and makes it look like the chmod did nothing.
chmod 751 "$APP_HOME"
install -d -m 700 -o "$APP_USER" -g "$APP_USER" "$APP_HOME/.ssh"
if [ -f /root/.ssh/authorized_keys ]; then
  cp /root/.ssh/authorized_keys "$APP_HOME/.ssh/authorized_keys"
  chown "$APP_USER:$APP_USER" "$APP_HOME/.ssh/authorized_keys"
  chmod 600 "$APP_HOME/.ssh/authorized_keys"
fi

# --------------------------------------------------------------------- sshd
# Password auth is disabled only once a key is proven present, otherwise a
# typo here locks everyone out of a server with no console.
if [ -s "$APP_HOME/.ssh/authorized_keys" ]; then
  log "hardening sshd (key-only)"
  # 00- prefix is load-bearing: sshd takes the FIRST occurrence of a keyword,
  # and Ubuntu 24.04 ships 50-cloud-init.conf containing "PasswordAuthentication
  # yes". A 99- file is read last and therefore silently loses.
  cat > /etc/ssh/sshd_config.d/00-hookpost.conf <<'EOF'
PasswordAuthentication no
PermitRootLogin prohibit-password
KbdInteractiveAuthentication no
EOF
  sshd -t && systemctl reload ssh
else
  echo "!! no authorized_keys found - leaving password auth ON"
fi

# ------------------------------------------------------------------ firewall
log "firewall"
ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null
ufw status numbered | sed 's/^/    /'

# ---------------------------------------------------------------------- swap
# 8 GB of RAM makes swap a safety net rather than a crutch, but the old box
# swapped 34 GB in two days and the only warning was an OOM kill, so keep some.
if ! swapon --show | grep -q .; then
  log "swap (2G)"
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap -q /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -qw vm.swappiness=10
  grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

# ---------------------------------------------------------------------- node
if ! command -v node >/dev/null || [ "$(node -v | cut -c2- | cut -d. -f1)" != "$NODE_MAJOR" ]; then
  log "node $NODE_MAJOR"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
  apt-get install -y -qq nodejs
fi
corepack enable >/dev/null 2>&1 || npm i -g corepack >/dev/null 2>&1
command -v pnpm >/dev/null || npm i -g pnpm@11.25.0 >/dev/null
command -v pm2  >/dev/null || npm i -g pm2@7.0.4   >/dev/null
node -v; pnpm -v; pm2 -v

# ------------------------------------------------------------------ postgres
# Temporal's two databases live here. This replaces Cloud SQL db-f1-micro
# (Rs 790/mo) for a workload that is 60 MB and ~12 tx/s - trivial locally,
# expensive only when someone bills you for uptime.
log "postgres $PG_MAJOR for Temporal"
systemctl enable --now postgresql >/dev/null
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='temporal'" | grep -q 1 || {
  PW=$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)
  sudo -u postgres psql -qc "CREATE ROLE temporal LOGIN PASSWORD '$PW';"
  umask 077; echo "$PW" > /root/.temporal_db_password
  echo "    temporal db password written to /root/.temporal_db_password"
}
for db in temporal temporal_visibility; do
  sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" | grep -q 1 || \
    sudo -u postgres createdb -O temporal "$db"
done
# local-only: Temporal connects over loopback, nothing else may reach it
sudo -u postgres psql -qc "ALTER SYSTEM SET listen_addresses = 'localhost';"
systemctl restart postgresql
sudo -u postgres psql -tAc "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname LIKE 'temporal%';" | sed 's/^/    /'

# ------------------------------------------------------------------ temporal
if [ ! -x "$APP_HOME/temporal-server-dist/temporal-server" ]; then
  log "temporal-server $TEMPORAL_VERSION"
  tmp=$(mktemp -d)
  curl -fsSL -o "$tmp/t.tar.gz" \
    "https://github.com/temporalio/temporal/releases/download/v${TEMPORAL_VERSION}/temporal_${TEMPORAL_VERSION}_linux_amd64.tar.gz"
  mkdir -p "$APP_HOME/temporal-server-dist"
  tar -xzf "$tmp/t.tar.gz" -C "$APP_HOME/temporal-server-dist"
  rm -rf "$tmp"
  chown -R "$APP_USER:$APP_USER" "$APP_HOME/temporal-server-dist"
fi

# --------------------------------------------------------------------- nginx
systemctl enable --now nginx >/dev/null

install -d -o "$APP_USER" -g "$APP_USER" "$APP_HOME/hookpost"

log "done - node $(node -v), pg $(psql --version | awk '{print $3}'), temporal $TEMPORAL_VERSION"
