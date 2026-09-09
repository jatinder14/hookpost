import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hookpost Public API Reference | Hookpost',
  description:
    'Official Hookpost Public API reference. Authenticate with an API key and create, list and delete scheduled social posts across 18 networks over plain HTTP.',
  keywords: [
    'hookpost api',
    'social media scheduling api',
    'schedule posts api',
    'social media rest api',
    'hookpost public api',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/docs/public-api',
  },
};

const BASE = 'https://hookpost.hookstep.in/api/public/v1';

type Row = { method: string; path: string; what: string };

const POSTS: Row[] = [
  { method: 'GET', path: '/posts', what: 'List posts in a date range' },
  { method: 'POST', path: '/posts', what: 'Create a post — schedule it, publish now, or save a draft' },
  { method: 'DELETE', path: '/posts/:id', what: 'Delete a single post' },
  { method: 'DELETE', path: '/posts/group/:group', what: 'Delete every post in a group' },
  { method: 'PUT', path: '/posts/:id/settings', what: 'Update a post’s per-channel settings' },
  { method: 'PUT', path: '/posts/:id/status', what: 'Update a post’s status' },
  { method: 'GET', path: '/posts/:id/missing', what: 'Check which channels a post has not gone out on' },
  { method: 'GET', path: '/find-slot/:id', what: 'Next free slot in your posting schedule' },
];

const CHANNELS: Row[] = [
  { method: 'GET', path: '/integrations', what: 'List connected channels' },
  { method: 'GET', path: '/social/:integration', what: 'Start connecting a channel' },
  { method: 'DELETE', path: '/integrations/:id', what: 'Disconnect a channel' },
  { method: 'GET', path: '/integration-settings/:id', what: 'Read a channel’s settings schema' },
  { method: 'GET', path: '/is-connected', what: 'Check whether the API key is valid' },
  { method: 'GET', path: '/groups', what: 'List customer groups' },
];

const MEDIA: Row[] = [
  { method: 'POST', path: '/upload', what: 'Upload a file' },
  { method: 'POST', path: '/upload-from-url', what: 'Upload from a remote URL' },
  { method: 'POST', path: '/generate-video', what: 'Generate a video (requires AI credits)' },
];

const INSIGHTS: Row[] = [
  { method: 'GET', path: '/analytics/:integration', what: 'Channel-level analytics' },
  { method: 'GET', path: '/analytics/post/:postId', what: 'Per-post analytics' },
  { method: 'GET', path: '/users', what: 'Users in your organisation' },
  { method: 'GET', path: '/notifications', what: 'Your notifications' },
];

const Table = ({ title, rows }: { title: string; rows: Row[] }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-white">{title}</h3>
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm min-w-[560px]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.method + r.path} className="border-b border-white/5 last:border-0">
              <td className="py-2.5 px-4 align-top w-[80px]">
                <span className="font-mono text-xs font-bold text-[#FF4CE2]">{r.method}</span>
              </td>
              <td className="py-2.5 px-4 align-top font-mono text-xs text-white whitespace-nowrap">
                {r.path}
              </td>
              <td className="py-2.5 px-4 align-top text-[#aaa]">{r.what}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Code = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed font-mono text-white/90">
    {children}
  </pre>
);

export default function PublicApiDocsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in' },
      { '@type': 'ListItem', position: 2, name: 'Docs', item: 'https://hookpost.hookstep.in/docs/public-api' },
      { '@type': 'ListItem', position: 3, name: 'Public API', item: 'https://hookpost.hookstep.in/docs/public-api' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Hookpost Public API Reference',
    description:
      'Authenticate with an API key and create, list and delete scheduled social posts across 18 networks over plain HTTP.',
    image: 'https://hookpost.hookstep.in/brand-logo.png',
    mainEntityOfPage: 'https://hookpost.hookstep.in/docs/public-api',
    publisher: {
      '@type': 'Organization',
      name: 'Hookpost',
      url: 'https://hookpost.hookstep.in',
      logo: 'https://hookpost.hookstep.in/brand-logo.png',
    },
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        ⚡ Developer Docs — Schedule to 18 social networks over plain HTTP
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.png" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium bg-white text-black hover:bg-[#FF4CE2] hover:text-white transition-all px-5 py-2 rounded-full font-semibold"
          >
            Start Free for $0
          </Link>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-10 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Public API</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            API Reference
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Hookpost <span className="text-[#FF4CE2]">Public API</span>
          </h1>
          <p className="text-[#aaa] text-lg leading-relaxed article-summary">
            Schedule and manage posts across every channel you have connected, straight from your own
            code. Plain REST over HTTPS, JSON in and out, authenticated with a single API key.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Base URL</h2>
          <Code>{BASE}</Code>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Authentication</h2>
          <p className="text-[#aaa] leading-relaxed">
            Every request carries your API key in the <code className="text-white font-mono text-sm">Authorization</code>{' '}
            header. Note there is <strong className="text-white">no <code className="font-mono text-sm">Bearer</code> prefix</strong> —
            send the key on its own. A request without it returns{' '}
            <code className="text-white font-mono text-sm">401 No API Key found</code>.
          </p>
          <Code>{`Authorization: YOUR_API_KEY`}</Code>
          <p className="text-[#aaa] leading-relaxed">
            Find your key in the app under <strong className="text-white">Settings → Public API</strong>. You can rotate it
            there at any time; the old key stops working immediately, so update anything using it.
          </p>
          <div className="rounded-xl border border-[#FF4CE2]/30 bg-[#FF4CE2]/5 p-4">
            <p className="text-sm text-white/80 leading-relaxed">
              <strong className="text-[#FF4CE2]">Keep it server-side.</strong> The key grants full access to your
              organisation&apos;s channels and posts. Never ship it in a browser bundle, a mobile app, or a public repo.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Your first request</h2>
          <p className="text-[#aaa] leading-relaxed">
            Confirm the key works before writing anything else:
          </p>
          <Code>{`curl "${BASE}/is-connected" \\
  -H "Authorization: YOUR_API_KEY"`}</Code>
          <p className="text-[#aaa] leading-relaxed">Then list the channels you have connected:</p>
          <Code>{`curl "${BASE}/integrations" \\
  -H "Authorization: YOUR_API_KEY"`}</Code>
          <p className="text-[#aaa] leading-relaxed">
            Each channel comes back with an <code className="text-white font-mono text-sm">id</code> — that is what you
            reference when creating a post.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Creating a post</h2>
          <p className="text-[#aaa] leading-relaxed">
            <code className="text-white font-mono text-sm">type</code> decides what happens:{' '}
            <code className="text-white font-mono text-sm">schedule</code> queues it for{' '}
            <code className="text-white font-mono text-sm">date</code>,{' '}
            <code className="text-white font-mono text-sm">now</code> publishes immediately, and{' '}
            <code className="text-white font-mono text-sm">draft</code> saves it without publishing.
            Dates are ISO 8601 in UTC.
          </p>
          <Code>{`curl -X POST "${BASE}/posts" \\
  -H "Authorization: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "schedule",
    "date": "2026-09-10T09:00:00.000Z",
    "shortLink": false,
    "tags": [],
    "posts": [
      {
        "integration": { "id": "YOUR_CHANNEL_ID" },
        "value": [
          { "content": "Shipped something small today.", "image": [] }
        ]
      }
    ]
  }'`}</Code>
          <p className="text-[#aaa] leading-relaxed">
            Some channels require extra fields — YouTube needs a title and visibility, Pinterest needs a board.
            Call <code className="text-white font-mono text-sm">/integration-settings/:id</code> to see what a given
            channel expects, and pass them as a{' '}
            <code className="text-white font-mono text-sm">settings</code> object on the post.
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Endpoints</h2>
          <Table title="Posts" rows={POSTS} />
          <Table title="Channels" rows={CHANNELS} />
          <Table title="Media" rows={MEDIA} />
          <Table title="Analytics &amp; account" rows={INSIGHTS} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Client libraries</h2>
          <p className="text-[#aaa] leading-relaxed">
            Everything above is plain HTTP, so any language works. If you would rather not hand-roll the requests, these
            wrap the same API and take the same key:
          </p>
          <div className="space-y-4">
            <div>
              <div className="text-white font-semibold">Node.js</div>
              <p className="text-[#aaa] leading-relaxed">
                Typed client for the endpoints above. Works in ESM and CommonJS.
              </p>
              <pre className="mt-2 bg-[#111] border border-[#222] rounded-lg p-4 overflow-x-auto">
                <code className="text-white font-mono text-sm">npm install @hookpost/node</code>
              </pre>
              <a
                href="https://www.npmjs.com/package/@hookpost/node"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2] text-sm"
              >
                @hookpost/node on npm
              </a>
            </div>
            <div>
              <div className="text-white font-semibold">Command line</div>
              <p className="text-[#aaa] leading-relaxed">
                Schedule, list and delete posts from a terminal or a CI job.
              </p>
              <pre className="mt-2 bg-[#111] border border-[#222] rounded-lg p-4 overflow-x-auto">
                <code className="text-white font-mono text-sm">npm install -g hookpost</code>
              </pre>
              <a
                href="https://www.npmjs.com/package/hookpost"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2] text-sm"
              >
                hookpost on npm
              </a>
            </div>
            <div>
              <div className="text-white font-semibold">n8n</div>
              <p className="text-[#aaa] leading-relaxed">
                A community node for n8n workflows. Install it from{' '}
                <span className="text-white">Settings → Community Nodes</span>, then create a{' '}
                <span className="text-white">Hookpost API</span> credential with the key above.
              </p>
              <pre className="mt-2 bg-[#111] border border-[#222] rounded-lg p-4 overflow-x-auto">
                <code className="text-white font-mono text-sm">n8n-nodes-hookpost</code>
              </pre>
              <a
                href="https://www.npmjs.com/package/n8n-nodes-hookpost"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2] text-sm"
              >
                n8n-nodes-hookpost on npm
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Rate limits &amp; plans</h2>
          <p className="text-[#aaa] leading-relaxed">
            The API is rate limited per key. Public API access is included on paid plans — if your key returns{' '}
            <code className="text-white font-mono text-sm">401 No subscription found</code>, the organisation needs an
            active plan rather than a new key.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Prefer natural language?</h2>
          <p className="text-[#aaa] leading-relaxed">
            If you want an AI assistant to schedule posts for you rather than writing HTTP calls yourself, Hookpost also
            speaks the Model Context Protocol. See the{' '}
            <Link href="/mcp" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">MCP connector</Link> or the{' '}
            <Link href="/guides/claude-mcp-social-media" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Claude setup guide</Link>.
          </p>
          <p className="text-[#aaa] leading-relaxed">
            Building an integration other people will connect their own Hookpost account to? Use{' '}
            <Link href="/docs/oauth" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">OAuth apps</Link> instead of asking them
            for an API key.
          </p>
        </section>
      </main>
    </div>
  );
}
