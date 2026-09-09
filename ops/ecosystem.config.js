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
      script: `${APP}/apps/backend/dist/apps/backend/src/main.js`,
      cwd: APP,
      interpreter: 'node',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
    },
    {
      name: 'hookpost-frontend',
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
