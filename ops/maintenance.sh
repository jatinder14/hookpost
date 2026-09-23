#!/usr/bin/env bash
#
# Weekly housekeeping for the production box.
#
# The box starts clean and stays clean for a while, so this is not a response to
# a full disk - it is what stops one. Everything below grows without bound if
# nobody touches it:
#
#   - apt's package cache and old kernels (412M of /var/cache on day one)
#   - systemd's journal (no size cap is configured by default on Ubuntu)
#   - the pnpm content-addressable store, which keeps every version of every
#     package any deploy has ever installed, not just the current lockfile's
#   - build directories left behind by the .next.new swap the deploy does
#   - local copies of the Temporal dump that backup-temporal.sh already pushed
#     to R2, where the real retention lives
#
# PM2's own logs are NOT handled here. They are handled by the pm2-logrotate
# module, which rotates continuously rather than once a week - a week of
# hookpost-temporal at its normal polling rate is ~65MB in one unrotated file,
# which is too long to wait.
#
# Postgres is vacuumed rather than left to autovacuum alone. Autovacuum is
# keeping up today (23MB database against 12 transactions/second), but Temporal's
# tables are almost entirely churn: rows are inserted and deleted constantly, so
# the dead-tuple ratio moves fast and a weekly ANALYZE keeps the planner honest.
#
# Safe to run at any time: nothing here stops a service or touches application
# data. Run by cron at 03:30 on Sundays - the Temporal backup runs daily at
# 18:30 (/etc/cron.d/hookpost-temporal-backup), so the two never overlap.

set -uo pipefail   # deliberately NOT -e: one failing step must not skip the rest

LOG=/home/flexiple_jr/maintenance.log
exec >> "$LOG" 2>&1
echo "=========== $(date -Is) maintenance start ==========="

before_disk=$(df --output=avail -m / | tail -1 | tr -d ' ')

echo "--- apt ---"
sudo apt-get -y autoremove --purge
sudo apt-get -y clean

echo "--- journal (keep 7 days, cap 200M) ---"
sudo journalctl --vacuum-time=7d --vacuum-size=200M

echo "--- pnpm store ---"
# This has to run from INSIDE the repo, and the cd is the whole point of the
# step. Run from $HOME it does two wrong things at once: corepack downloads a
# fresh pnpm (the repo pins 10.6.1, the global one is 12.5.1) on every single
# run, and the prune then resolves a store path with no project referencing it,
# so it reports success having freed nothing. The store is 5.7GB - by a wide
# margin the largest thing on this box - so a step that silently no-ops here is
# the difference between housekeeping and theatre.
#
# Safe despite the size: node_modules is hardlinked into the store (a dependency
# file shows 4 links), so removing a store entry cannot pull a file out from
# under a running process. Only packages that no installed project references
# are removed.
( cd /home/flexiple_jr/hookpost && pnpm store prune ) || echo "pnpm store prune skipped"

echo "--- download caches older than 30 days ---"
# Pure caches, refetched on demand: pnpm's side cache (~258M), node headers,
# Prisma engines. Aged rather than emptied so a deploy the next morning does not
# have to re-download everything it just used.
find /home/flexiple_jr/.cache/pnpm /home/flexiple_jr/.cache/node \
     /home/flexiple_jr/.cache/prisma -type f -atime +30 -delete 2>/dev/null
find /home/flexiple_jr/.cache -type d -empty -delete 2>/dev/null

echo "--- stale build dirs from the .next swap ---"
# The deploy builds into .next.new and swaps, leaving .next.old behind. If a
# deploy died mid-swap there can also be an orphaned .next.new.
find /home/flexiple_jr/hookpost/apps -maxdepth 2 \
     \( -name '.next.old' -o -name '.next.new' -o -name 'dist.old' \) \
     -mtime +2 -prune -print -exec rm -rf {} + 2>/dev/null

echo "--- /tmp older than 7 days ---"
sudo find /tmp -mindepth 1 -mtime +7 -delete 2>/dev/null

# NOT handled here: local Temporal dumps in ~/backups. backup-temporal.sh
# already prunes its own output (find -name '*.dump' -mtime +$KEEP_LOCAL_DAYS),
# and the files are root-owned, so a second prune running as flexiple_jr would
# fail silently even if it had the right extension. Retention belongs with the
# script that knows what it uploaded to R2.

echo "--- vacuum temporal database ---"
sudo -u postgres psql -d temporal -c 'VACUUM (ANALYZE);'

echo "--- result ---"
after_disk=$(df --output=avail -m / | tail -1 | tr -d ' ')
echo "disk free: ${before_disk}M -> ${after_disk}M (reclaimed $((after_disk - before_disk))M)"
df -h / | tail -1
free -m | head -2

# Keep this log from becoming the thing it cleans up.
tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"

echo "=========== $(date -Is) maintenance done ==========="
