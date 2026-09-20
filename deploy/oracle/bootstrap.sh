#!/usr/bin/env bash
#
# Bootstrap a fresh Oracle Cloud Ampere A1 (ARM64) box to run Hookpost.
#
# Target: Ubuntu 24.04 aarch64, VM.Standard.A1.Flex 4 OCPU / 24 GB.
# Run ON the new server as the `ubuntu` user:
#
#   scp -i ~/.ssh/oracle_hookpost deploy/oracle/bootstrap.sh ubuntu@<IP>:~
#   ssh -i ~/.ssh/oracle_hookpost ubuntu@<IP> 'bash ~/bootstrap.sh'
#
# Idempotent: safe to re-run. It never touches the GCP box.
set -euo pipefail

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31mFAILED: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(uname -m)" = "aarch64" ] || die "expected aarch64, got $(uname -m) - wrong shape?"

log "System packages"
sudo apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  build-essential git curl ca-certificates gnupg unzip jq \
  nginx postgresql postgresql-contrib \
  python3-certbot-nginx netfilter-persistent

log "Opening 80/443 in the LOCAL firewall"
# Oracle's Ubuntu images ship an iptables INPUT chain that REJECTs everything
# except SSH. Opening the port in the OCI Security List alone is not enough and
# is the single most common reason an Oracle box looks dead on 80/443.
for port in 80 443; do
  sudo iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null \
    || sudo iptables -I INPUT 6 -p tcp --dport "$port" -j ACCEPT
done
sudo netfilter-persistent save

log "Node.js 24 (arm64)"
if ! command -v node >/dev/null || [[ "$(node -v)" != v24* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
fi
node -v | grep -q '^v24' || die "node 24 not installed"
sudo npm install -g pnpm pm2 >/dev/null

log "PostgreSQL for Temporal (replaces Cloud SQL db-f1-micro, ~Rs 790/mo)"
# Temporal holds connections open permanently, which is exactly why it could not
# live on Neon's free tier (100 compute-hours/project vs ~182 needed) and why it
# was on Cloud SQL. With 24 GB of RAM locally, neither constraint applies.
sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='temporal'" | grep -q 1 || {
  TEMPORAL_PW="$(openssl rand -base64 24 | tr -d '/+=')"
  sudo -u postgres psql -qc "CREATE ROLE temporal LOGIN PASSWORD '${TEMPORAL_PW}';"
  sudo -u postgres createdb -O temporal temporal
  sudo -u postgres createdb -O temporal temporal_visibility
  umask 077; printf 'TEMPORAL_PW=%s\n' "$TEMPORAL_PW" > "$HOME/.temporal-db-credentials"
  echo "  credentials written to ~/.temporal-db-credentials (not printed)"
}

log "Temporal server (arm64)"
if [ ! -x "$HOME/temporal-server-dist/temporal-server" ]; then
  TAG=$(curl -fsSL https://api.github.com/repos/temporalio/temporal/releases/latest | jq -r .tag_name)
  V="${TAG#v}"
  mkdir -p "$HOME/temporal-server-dist"
  curl -fsSL "https://github.com/temporalio/temporal/releases/download/${TAG}/temporal_${V}_linux_arm64.tar.gz" \
    | tar xz -C "$HOME/temporal-server-dist"
  file "$HOME/temporal-server-dist/temporal-server" | grep -q 'ARM aarch64' \
    || die "downloaded temporal-server is not ARM - check the release asset name"
fi

log "Repo"
[ -d "$HOME/hookpost/.git" ] || git clone https://github.com/jatinder14/hookpost.git "$HOME/hookpost"
cd "$HOME/hookpost" && git fetch --quiet origin main && git checkout --quiet main && git reset --hard --quiet origin/main

log "Dependencies + build"
# 24 GB of RAM means this box can build Next.js itself. The GCP e2-small could
# not (1.9 GB, ~35 GB swapped in under 3 days), which is why builds were pushed
# to CI. That workaround is no longer needed.
pnpm install --frozen-lockfile
npx prisma generate --schema libraries/nestjs-libraries/src/database/prisma/schema.prisma
ls node_modules/.prisma/client/ | grep -q 'linux-arm64' || die "no arm64 prisma engine - check binaryTargets"
pnpm run build

log "NGINX"
sudo tee /etc/nginx/sites-available/hookpost >/dev/null <<'NGINX'
server {
  listen 80;
  server_name hookpost.hookstep.in;
  client_max_body_size 200M;
  location /api/ { proxy_pass http://127.0.0.1:3000/;  include proxy_params; }
  location /     { proxy_pass http://127.0.0.1:4200;   include proxy_params; }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/hookpost /etc/nginx/sites-enabled/hookpost
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

cat <<'DONE'

==> Bootstrap complete.

Still to do, in order (deliberately NOT automated - each needs a decision):
  1. Copy .env across. It lives in GCP Secret Manager as `hookpost-dotenv`.
     Point DATABASE_URL for Temporal at the LOCAL postgres, not Cloud SQL.
  2. Dump + restore the Temporal database from Cloud SQL.
  3. pm2 start the four processes, then `pm2 save && pm2 startup`.
  4. Point DNS at this box, then run:
       sudo certbot --nginx -d hookpost.hookstep.in
     (certbot must run AFTER DNS resolves here, or the challenge fails)
  5. Verify, then stop the GCP VM and delete the Cloud SQL instance.

DONE
