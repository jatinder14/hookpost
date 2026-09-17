/**
 * Loads .env and lets it WIN over whatever is already in process.env.
 *
 * Imported first by main.ts. It has to be a module rather than a `config()`
 * call in main.ts, because import declarations are hoisted: every imported
 * module body runs before the first statement of the importing file, so a call
 * there would happen after Sentry and friends had already read their config.
 *
 * Why this file exists at all
 * ---------------------------
 * PM2 runs the compiled main.js directly (`interpreter: node`), bypassing the
 * package.json "start" script and its `dotenv -e ../../.env`. For a long time
 * the backend's entire configuration therefore lived only as the environment
 * PM2 happened to capture whenever someone last started it by hand, which made
 * `pm2 restart --update-env` from a bare shell able to erase it - that dropped
 * the process from 92 env keys to 22 on 2026-09-10 and took port 3000 down.
 *
 * Why `override: true`, having first shipped this without it
 * ----------------------------------------------------------
 * The no-override version fixed erasure but not staleness, and the difference
 * is subtle enough that it bit within a week: `deploy.sh` reloads with
 * `pm2 reload --update-env`, which PRESERVES PM2's saved env, and dotenv skips
 * any key already present. So on every deploy a key PM2 already held kept its
 * old value no matter what the file said.
 *
 * The signature is distinctive and worth recognising: **newly added keys apply,
 * changed keys do not.** Adding INSTAGRAM_APP_ID worked, because PM2 had never
 * held it. Editing HIDDEN_PROVIDERS to un-hide instagram-standalone did not -
 * the file on disk was correct, the channel stayed invisible in Add Channel,
 * and nothing anywhere reported a problem.
 *
 * The original reasoning for skipping override was that CI-supplied variables
 * should still win. Checked before changing it, and that case does not exist
 * here: this process only ever runs on the production VM under PM2, and
 * deploy.sh's remote block is a plain `bash -e` over SSH that exports nothing
 * from CI. So the precedence being protected was hypothetical, while the
 * staleness it caused was real.
 *
 * Two things make this safe rather than merely convenient:
 *   - override only touches keys PRESENT IN THE FILE. Everything PM2 supplies
 *     and .env does not - PATH, HOME, PM2_* and so on - is untouched.
 *   - NODE_ENV is `development` in both the file and PM2's env today, so this
 *     does not silently flip the runtime mode. (That the production .env says
 *     `development` at all is a separate, known problem; the frontend build
 *     pins NODE_ENV=production explicitly because of it.)
 *
 * The consequence to keep in mind: **.env on the box is now the single source
 * of truth for this process.** A one-off `FOO=bar pm2 restart` will not stick
 * if FOO is also in the file. That is the intended trade - it is what everyone
 * already assumed was true.
 */
import { config } from 'dotenv';

// process.cwd() is the repo root: ops/ecosystem.config.js pins cwd, and
// deploy.sh's pm2 start fallbacks use the same directory.
config({ override: true });
