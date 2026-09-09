#!/usr/bin/env node
import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { createInterface } from 'readline';

const CONFIG_DIR = join(homedir(), '.hookpost');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const DEFAULT_HOST = 'https://hookpost.hookstep.in/api';

type Config = { apiKey?: string; host?: string };

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
};

async function readConfig(): Promise<Config> {
  // Environment wins over the stored file so CI can run without `auth login`.
  const fromEnv: Config = {
    apiKey: process.env.HOOKPOST_API_KEY,
    host: process.env.HOOKPOST_API_URL,
  };
  let stored: Config = {};
  try {
    stored = JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8'));
  } catch {
    /* no config yet */
  }
  return {
    apiKey: fromEnv.apiKey || stored.apiKey,
    host: fromEnv.host || stored.host || DEFAULT_HOST,
  };
}

async function writeConfig(cfg: Config) {
  await fs.mkdir(dirname(CONFIG_FILE), { recursive: true });
  await fs.writeFile(CONFIG_FILE, JSON.stringify(cfg, null, 2));
  // The key is a full-access credential, so keep it owner-readable only.
  await fs.chmod(CONFIG_FILE, 0o600);
}

async function api(
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  path: string,
  body?: unknown
) {
  const { apiKey, host } = await readConfig();
  if (!apiKey) {
    throw new Error(
      'Not signed in. Run `hookpost auth login`, or set HOOKPOST_API_KEY.'
    );
  }
  const res = await fetch(`${String(host).replace(/\/+$/, '')}/public/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Hookpost takes the raw key - a Bearer prefix is rejected.
      Authorization: apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = data?.msg || data?.message || text || `HTTP ${res.status}`;
    throw new Error(`${res.status} ${msg}`);
  }
  return data;
}

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a.trim());
    })
  );
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
}

const HELP = `
${c.bold('hookpost')} - schedule and publish social media posts from your terminal

${c.bold('Usage')}
  hookpost <command> [options]

${c.bold('Commands')}
  auth login              Store your API key
  auth status             Show who you are signed in as
  auth logout             Remove the stored key

  channels                List your connected channels
  posts                   List upcoming posts
  post <text>             Create a post
  delete <postId>         Delete a post
  slot [channelId]        Show the next free slot

${c.bold('post options')}
  --channel <id>          Channel to post to (required)
  --at <ISO date>         When to publish; omitted uses your next free slot
  --now                   Publish immediately
  --draft                 Save as a draft
  --settings <json>       Per-channel settings, e.g. YouTube title/visibility

${c.bold('Examples')}
  hookpost channels
  hookpost post "Shipped something small today." --channel abc123
  hookpost post "Live now" --channel abc123 --now
  hookpost posts --days 14

${c.bold('Environment')}
  HOOKPOST_API_KEY        Use instead of \`auth login\` (handy in CI)
  HOOKPOST_API_URL        Override the API host when self-hosting

Docs: https://hookpost.hookstep.in/docs/public-api
`;

async function main() {
  const argv = process.argv.slice(2);
  const [cmd, sub] = argv;

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    console.log(HELP);
    return;
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log(require('../package.json').version);
    return;
  }

  if (cmd === 'auth') {
    if (sub === 'login') {
      const key = await ask('API key (Settings -> Public API): ');
      if (!key) throw new Error('No key entered.');
      const host =
        (await ask(`API host [${DEFAULT_HOST}]: `)) || DEFAULT_HOST;
      await writeConfig({ apiKey: key, host });
      // Prove the key works now rather than failing on first real use.
      await api('GET', '/is-connected');
      console.log(c.green(`Signed in. Key saved to ${CONFIG_FILE}`));
      return;
    }
    if (sub === 'status') {
      const { apiKey, host } = await readConfig();
      if (!apiKey) {
        console.log('Not signed in.');
        return;
      }
      await api('GET', '/is-connected');
      console.log(`${c.green('Signed in')}  host=${host}  key=${apiKey.slice(0, 8)}...`);
      return;
    }
    if (sub === 'logout') {
      await fs.rm(CONFIG_FILE, { force: true });
      console.log('Signed out.');
      return;
    }
    throw new Error('Usage: hookpost auth <login|status|logout>');
  }

  if (cmd === 'channels') {
    const list = await api('GET', '/integrations');
    if (!Array.isArray(list) || !list.length) {
      console.log('No channels connected yet.');
      return;
    }
    for (const ch of list) {
      console.log(
        `${c.cyan(ch.id)}  ${String(ch.name).padEnd(24)} ${c.dim(
          ch.identifier || ch.providerIdentifier || ''
        )}`
      );
    }
    return;
  }

  if (cmd === 'posts') {
    const days = Number(flag(argv, 'days') || 7);
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + days * 864e5).toISOString();
    const res = await api(
      'GET',
      `/posts?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    const posts = res?.posts || res || [];
    if (!posts.length) {
      console.log(`No posts in the next ${days} days.`);
      return;
    }
    for (const p of posts) {
      const when = new Date(p.publishDate).toISOString().replace('T', ' ').slice(0, 16);
      const text = String(p.content || '').replace(/<[^>]*>/g, '').slice(0, 50);
      console.log(`${c.dim(when)}  ${String(p.state).padEnd(9)} ${c.cyan(p.id)}  ${text}`);
    }
    return;
  }

  if (cmd === 'post') {
    const text = argv[1];
    if (!text || text.startsWith('--')) {
      throw new Error('Usage: hookpost post "your text" --channel <id>');
    }
    const channel = flag(argv, 'channel');
    if (!channel) throw new Error('--channel is required. Run `hookpost channels` to list them.');

    const type = argv.includes('--now')
      ? 'now'
      : argv.includes('--draft')
      ? 'draft'
      : 'schedule';

    let date = flag(argv, 'at');
    if (type === 'schedule' && !date) {
      const slot = await api('GET', `/find-slot/${channel}`);
      date = slot?.date;
      console.log(c.dim(`No --at given, using next free slot: ${date}`));
    }

    const settingsRaw = flag(argv, 'settings');
    const settings = settingsRaw ? JSON.parse(settingsRaw) : undefined;

    const res = await api('POST', '/posts', {
      type,
      date: date || new Date().toISOString(),
      shortLink: false,
      tags: [],
      posts: [
        {
          integration: { id: channel },
          value: [{ content: text, image: [] }],
          ...(settings ? { settings } : {}),
        },
      ],
    });
    console.log(c.green('Created.'), JSON.stringify(res));
    return;
  }

  if (cmd === 'delete') {
    const id = argv[1];
    if (!id) throw new Error('Usage: hookpost delete <postId>');
    await api('DELETE', `/posts/${id}`);
    console.log(c.green(`Deleted ${id}`));
    return;
  }

  if (cmd === 'slot') {
    const id = argv[1];
    const res = await api('GET', id ? `/find-slot/${id}` : '/is-connected');
    console.log(JSON.stringify(res));
    return;
  }

  throw new Error(`Unknown command: ${cmd}\nRun \`hookpost help\`.`);
}

main().catch((err) => {
  console.error(c.red(`Error: ${err.message}`));
  process.exit(1);
});
