/**
 * PM2 process definitions for the production VM.
 *
 * This replaces `ops/pm2-processes.json`, which was only an export. Before this
 * file existed there was no ecosystem file anywhere: all four processes had been
 * started ad hoc with `pm2 start`, and the sole record of how was
 * ~/.pm2/dump.pm2 on the box itself. Rebuilding the server meant guessing four
 * scripts, working directories, interpreters and argument lists.
 *
 * Recreate every process on a fresh box:
 *     pm2 startOrReload /home/flexiple_jr/hookpost/ops/ecosystem.config.js
 *     pm2 save
 *
 * These values are a FAITHFUL COPY of what was running on 2026-09-09, taken
 * from `pm2 jlist`. Nothing has been "improved" here on purpose - if this file
 * and the live processes differ, a deploy that applies it becomes a surprise
 * behaviour change rather than a no-op. Two things were deliberately left off:
 *
 *   - pm2-logrotate. It appears in `pm2 list` but is a pm2 MODULE, not an app.
 *     Modules are not managed by an ecosystem file; install it with
 *     `pm2 install pm2-logrotate`. Putting it here would create a duplicate,
 *     wrongly-pathed copy alongside the module.
 *
 *   - Restart policy (min_uptime / max_restarts). The frontend has a history of
 *     crash-looping (259 restarts once) and PM2 reporting "online" throughout,
 *     so a policy is worth adding - but it changes behaviour, so it belongs in
 *     its own change where it can be reasoned about, not smuggled into a file
 *     whose entire job is to match production exactly.
 *
 * UPDATE 2026-09-22: max_memory_restart is now set per process (see below), so
 * a leak restarts one process instead of pushing the box into swap. max_restarts
 * is still deliberately absent. PM2's max_restarts makes PM2 GIVE UP after N
 * failures and leave the process stopped, which turns a crash-loop - where the
 * site is at least intermittently up - into a hard outage that nothing recovers
 * from until someone logs in. A crash-loop should be caught by alerting, not by
 * switching the site off.
 *
 * No secrets here, and none needed: every process reads
 * /home/flexiple_jr/hookpost/.env at runtime. Confirmed PM2 carries 23
 * uppercase env keys of which zero are credential-shaped, which is why this
 * file is safe in a public repo.
 */
const HOME = '/home/flexiple_jr';
const APP = `${HOME}/hookpost`;

module.exports = {
  apps: [
    {
      name: 'hookpost-backend',
      // steady state 553MB measured 2026-09-22; ~2.7x that, so this fires on a leak, not a busy hour
      max_memory_restart: '1500M',
      restart_delay: 5000,
      script: `${APP}/apps/backend/dist/apps/backend/src/main.js`,
      cwd: APP,
      interpreter: 'node',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
    },
    {
      name: 'hookpost-frontend',
      // steady state 364MB; Next.js SSR caches grow under load, hence the wide margin
      max_memory_restart: '1200M',
      restart_delay: 5000,
      // `next start` from the workspace root's bin, run with the frontend app
      // as cwd - that is what resolves .next and public/ correctly.
      script: `${APP}/node_modules/.bin/next`,
      args: ['start', '-p', '4200'],
      cwd: `${APP}/apps/frontend`,
      interpreter: '/usr/bin/node',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
    },
    {
      name: 'hookpost-orchestrator',
      // steady state 107MB; holds posts in memory while publishing, so headroom is per-batch
      max_memory_restart: '800M',
      restart_delay: 5000,
      // Started through bash because it is a pnpm workspace script, not a
      // single entrypoint file.
      script: '/usr/bin/bash',
      args: ['-c', 'pnpm --filter ./apps/orchestrator run start'],
      cwd: APP,
      interpreter: 'none',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
    },
    {
      name: 'hookpost-temporal',
      // steady state 225MB; it polls continuously, so a climb here means a real leak
      max_memory_restart: '1000M',
      restart_delay: 5000,
      // NOTE: this binary lives OUTSIDE the repository, so a rebuild has to
      // re-fetch it before this process can start. It is not something `git
      // clone` gives you.
      script: `${HOME}/temporal-server-dist/temporal-server`,
      args: ['--env', 'production', '--root', '.', 'start'],
      cwd: `${HOME}/temporal-server-dist`,
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
