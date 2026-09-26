import { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteNav } from '../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "social media scheduling api", "social media posting api", "api to
// schedule social media posts", "buffer api alternative" and "ayrshare alternative".
//
// Hookpost facts come from the code:
// - endpoints: apps/backend/src/public-api/routes/v1/public.integrations.controller.ts
// - auth + 401 messages: apps/backend/src/services/auth/public.auth.middleware.ts
// - rate limit: ThrottlerModule in apps/backend/src/app.module.ts plus
//   libraries/nestjs-libraries/src/throttler/throttler.provider.ts. Only
//   POST /public/v1/posts is throttled, per organisation, over one hour. The cap
//   is the API_LIMIT env var, so no number is printed here.
// - plan gate: public_api in pricing.ts; FREE has no subscription row, so its
//   key gets 401 "No subscription found".
// - SDK and CLI: @hookpost/node and hookpost confirmed live on npm on CHECKED.
//
// Competitor facts were read off their own pages on CHECKED. Re-check before
// bumping the date; one stale figure makes the whole comparison untrustworthy.
const CANONICAL = 'https://hookpost.hookstep.in/social-media-scheduling-api';
const CHECKED = '26 September 2026';
const BASE = 'https://hookpost.hookstep.in/api/public/v1';

const STANDARD = pricingINR.STANDARD;
const PRO = pricingINR.PRO;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const PUBLISHING_TODAY = [
  ['X (Twitter)', '/channels/x'],
  ['LinkedIn', '/channels/linkedin'],
  ['YouTube', '/channels/youtube'],
  ['Bluesky', '/channels/bluesky'],
  ['Discord', '/channels/discord'],
  ['Slack', '/channels/slack'],
  ['Telegram', '/channels/telegram'],
  ['WordPress', '/channels/wordpress'],
  ['Hashnode', '/channels/hashnode'],
  ['Dev.to', '/channels/devto'],
  ['Lemmy', '/channels/lemmy'],
  ['Nostr', '/channels/nostr'],
  ['Listmonk', '/channels/listmonk'],
] as const;

const LIST_CHANNELS = `curl "${BASE}/integrations" \\
  -H "Authorization: YOUR_API_KEY"`;

const CREATE_POST = `curl -X POST "${BASE}/posts" \\
  -H "Authorization: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "schedule",
    "date": "2026-10-01T09:00:00.000Z",
    "shortLink": false,
    "tags": [],
    "posts": [
      {
        "integration": { "id": "LINKEDIN_CHANNEL_ID" },
        "value": [{ "content": "We shipped the new dashboard today.", "image": [] }]
      },
      {
        "integration": { "id": "X_CHANNEL_ID" },
        "value": [{ "content": "New dashboard is live.", "image": [] }]
      }
    ]
  }'`;

const ENDPOINTS: [string, string][] = [
  ['Posts', 'Create (schedule, publish now or draft), list by date range, delete, update status and per-channel settings, check which channels a post has not gone out on.'],
  ['Scheduling', 'GET /find-slot/:id returns the next free slot in your posting schedule for a channel.'],
  ['Channels', 'List connected channels, read a channel’s settings schema, start connecting a new channel, disconnect one.'],
  ['Media', 'Upload a file, or upload from a public URL. The response includes the path you attach to a post.'],
  ['Analytics', 'Channel-level analytics and per-post analytics.'],
];

const COMPETITORS: { name: string; api: string; entry: string; source: string }[] = [
  {
    name: 'Hookpost',
    api: 'REST, JSON. Key sent as a bare Authorization header.',
    entry: `Standard, ${inr(STANDARD.month_price)}/month for ${STANDARD.channel} channels and ${STANDARD.posts_per_month} posts. No API on the Free plan.`,
    source: '/pricing',
  },
  {
    name: 'Buffer',
    api: 'GraphQL at api.buffer.com. Bearer API key or OAuth 2.0.',
    entry: 'Available on Buffer’s Free plan: 1 API key, 100 requests per 15 minutes, 250 per day, 3,000 per 30 days.',
    source: 'https://developers.buffer.com/guides/api-limits.html',
  },
  {
    name: 'Ayrshare',
    api: 'API built for platforms that post on behalf of many user profiles.',
    entry: 'No free plan listed. Premium $149/month for 1 social profile; Launch $299/month for up to 10 profiles, with a 28-day trial.',
    source: 'https://www.ayrshare.com/pricing/',
  },
];

const FAQ = [
  {
    q: 'Is there an API to schedule social media posts?',
    a: `Yes. Hookpost's Public API schedules, publishes and deletes posts over plain REST at ${BASE}. One request can target several channels at once. It is included from the Standard plan at ${inr(STANDARD.month_price)} a month.`,
  },
  {
    q: 'Which networks can the API post to?',
    a: 'X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram, WordPress, Hashnode, Dev.to, Lemmy, Nostr and Listmonk, for any account connected today. Instagram, Facebook and Threads are waiting on Meta app approval, Pinterest cannot publish yet, and Medium no longer issues new API tokens.',
  },
  {
    q: 'What are the API rate limits?',
    a: 'Creating posts is capped per organisation over a one-hour window, and going over returns HTTP 429. Reads are not throttled. Separately, every post counts toward your plan’s monthly post limit.',
  },
  {
    q: 'Is Hookpost a Buffer API alternative?',
    a: 'For some teams. Buffer’s API is GraphQL and is available on its free plan with daily and monthly request caps. Hookpost’s is REST, needs a paid plan, and adds an MCP server, a CLI and an n8n node on the same key. If you want a free tier to experiment with, Buffer is the cheaper place to start.',
  },
  {
    q: 'Is Hookpost an Ayrshare alternative?',
    a: `If you are posting to your own or your company’s channels, yes: Standard is ${inr(STANDARD.month_price)} a month against Ayrshare’s $149 a month entry plan. Ayrshare is built for SaaS platforms posting on behalf of many end users, which Hookpost’s plans are not priced for.`,
  },
];

export const metadata: Metadata = {
  title: 'Social Media Scheduling API (REST) | Hookpost',
  description: `REST API to schedule and publish posts to X, LinkedIn, YouTube, Bluesky and 9 more networks. Real curl examples, rate limits, and plans from ${inr(STANDARD.month_price)}/month.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Social media scheduling API - Hookpost',
    description: 'Schedule posts to X, LinkedIn, YouTube, Bluesky and more with one REST call.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Hookpost social media scheduling API' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social media scheduling API - Hookpost',
    description: 'Schedule posts to X, LinkedIn, YouTube, Bluesky and more with one REST call.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

const Code = ({ children }: { children: string }) => (
  <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed font-mono text-white/90">
    {children}
  </pre>
);

const A = ({ href, children }: { href: string; children: ReactNode }) =>
  href.startsWith('http') ? (
    <a href={href} className="text-[#FF4CE2] underline" rel="nofollow noopener" target="_blank">
      {children}
    </a>
  ) : (
    <Link href={href} className="text-[#FF4CE2] underline">
      {children}
    </Link>
  );

export default function SchedulingApiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${CANONICAL}#app`,
        name: 'Hookpost Public API',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: CANONICAL,
        description: 'REST API to schedule, publish and delete social media posts across X, LinkedIn, YouTube, Bluesky and more.',
        offers: {
          '@type': 'Offer',
          name: 'Standard plan',
          price: String(STANDARD.month_price),
          priceCurrency: 'INR',
          url: 'https://hookpost.hookstep.in/pricing',
          description: `${STANDARD.channel} channels, ${STANDARD.posts_per_month} posts per month, Public API included.`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${CANONICAL}#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Social media scheduling API', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">REST API · Standard plan and above</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          A social media scheduling API you call with one header
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Hookpost&apos;s Public API schedules, publishes and deletes posts on every channel you have connected. It is plain REST
          with JSON in and out, and one request can send a post to LinkedIn and X at the same time. It is included from{' '}
          <strong className="text-white">Standard at {inr(STANDARD.month_price)} a month</strong>, which covers {STANDARD.channel}{' '}
          channels and {STANDARD.posts_per_month} posts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Get an API key
          </Link>
          <Link href="/docs/public-api" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Read the API reference
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Two requests to your first scheduled post</h2>
        <p className="mt-3 max-w-[70ch] text-white/70">
          Copy your key from <strong className="text-white">Settings → Developers</strong>. It goes in the{' '}
          <code className="font-mono text-white">Authorization</code> header on its own, with{' '}
          <strong className="text-white">no Bearer prefix</strong>. First, list your channels to get their ids:
        </p>
        <Code>{LIST_CHANNELS}</Code>
        <p className="mt-6 max-w-[70ch] text-white/70">
          Then create the post. <code className="font-mono text-white">type</code> is{' '}
          <code className="font-mono text-white">schedule</code>, <code className="font-mono text-white">now</code> or{' '}
          <code className="font-mono text-white">draft</code>, and dates are ISO 8601 in UTC. Each entry in{' '}
          <code className="font-mono text-white">posts</code> is one channel, so this schedules different copy to LinkedIn and X
          in a single call:
        </p>
        <Code>{CREATE_POST}</Code>
        <p className="mt-6 max-w-[70ch] text-white/70">
          Hookpost validates each post against the network&apos;s rules before it is queued, the same checks the app runs. A post
          that is too long for X, or one missing a required channel setting, comes back as a 400 with the channel and the reason, not as
          a failure at publish time. Channels that need extra fields expose their schema at{' '}
          <code className="font-mono text-white">/integration-settings/:id</code>.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What the API covers</h2>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {ENDPOINTS.map(([name, what]) => (
              <div key={name} className="rounded-2xl border border-white/10 p-5">
                <dt className="font-bold text-white">{name}</dt>
                <dd className="mt-2 text-white/70">{what}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[70ch] text-white/70">
            <strong className="text-white">Webhooks.</strong> Add one under Settings → Webhooks and Hookpost POSTs the post as JSON
            to your URL after it publishes, optionally only for chosen channels. Standard includes {STANDARD.webhooks}; Pro
            includes {PRO.webhooks}.
          </p>
          <p className="mt-4 max-w-[70ch] text-white/70">
            <strong className="text-white">Limits.</strong> Creating posts is capped per organisation over a one-hour window, and
            going over returns HTTP 429. Reads are not throttled. Every post also counts toward your monthly allowance:{' '}
            {STANDARD.posts_per_month} on Standard, {PRO.posts_per_month.toLocaleString('en-IN')} on Pro. A key on an account with
            no paid plan returns <code className="font-mono">401 No subscription found</code>.
          </p>

          <h3 className="mt-12 text-xl font-bold font-jakarta">Channels the API can publish to today</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {PUBLISHING_TODAY.map(([name, href]) => (
              <li key={href}>
                <Link href={href} className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm hover:border-[#FF4CE2]">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[70ch] text-sm text-white/55">
            Instagram, Facebook and Threads are built but waiting on Meta app approval, so new accounts cannot connect them yet.
            Pinterest can be connected but cannot publish yet. Medium stopped issuing new API tokens, so only accounts with an
            older token can connect.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">The same key works everywhere else</h2>
          <ul className="mt-6 flex flex-col gap-4 text-white/80">
            <li>
              <strong className="text-white">Node.js SDK.</strong> <code className="font-mono">npm install @hookpost/node</code>, a
              typed client for the same endpoints that works with both import and require.
            </li>
            <li>
              <strong className="text-white">CLI.</strong> <code className="font-mono">npx hookpost channels</code> lists your
              channels; <code className="font-mono">hookpost post &quot;text&quot; --channel ID</code> schedules into your next free
              slot. Set <code className="font-mono">HOOKPOST_API_KEY</code> to use it in CI.
            </li>
            <li>
              <strong className="text-white">n8n.</strong> The <A href="/integrations/n8n">n8n-nodes-hookpost</A> community node
              wraps these endpoints for no-code workflows.
            </li>
            <li>
              <strong className="text-white">MCP.</strong> The <A href="/mcp">Hookpost MCP server</A> lets Claude, Cursor and other
              MCP clients list channels and schedule posts. See the{' '}
              <A href="/guides/claude-mcp-social-media">Claude setup guide</A>.
            </li>
            <li>
              <strong className="text-white">OAuth.</strong> Building something other people connect their own Hookpost account to?
              Use <A href="/docs/oauth">OAuth apps</A> rather than collecting API keys.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Compared with Buffer&apos;s API and Ayrshare</h2>
          <p className="mt-3 max-w-[70ch] text-white/60">
            Read off each company&apos;s own pages on {CHECKED}. Follow the source link to confirm.
          </p>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <caption className="sr-only">Social media scheduling APIs compared</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold">API</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Style</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Cheapest way in</th>
                  <th scope="col" className="py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((row) => (
                  <tr key={row.name} className={`border-b border-white/10 ${row.name === 'Hookpost' ? 'bg-[#FF4CE2]/[0.06]' : ''}`}>
                    <th scope="row" className="py-4 pe-4 font-bold">{row.name}</th>
                    <td className="py-4 pe-4 text-white/80">{row.api}</td>
                    <td className="py-4 pe-4 text-white/80">{row.entry}</td>
                    <td className="py-4">
                      <A href={row.source}>{row.source.startsWith('http') ? 'their docs' : 'our pricing'}</A>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[70ch] text-white/70">
            The honest summary: Buffer lets you try its API on a free plan, which Hookpost does not. Ayrshare is priced for
            platforms posting on behalf of many users. If you are automating your own or your company&apos;s channels, Hookpost
            gives you a REST API, webhooks, an MCP server and an n8n node for {inr(STANDARD.month_price)} a month. More detail in
            the <A href="/alternatives/buffer">Buffer comparison</A>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Questions</h2>
          <dl className="mt-8 flex flex-col gap-8">
            {FAQ.map((f) => (
              <div key={f.q} className="min-w-0">
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-white/60">
            Full endpoint list and error messages: <A href="/docs/public-api">Public API reference</A>. Plan limits:{' '}
            <A href="/pricing">pricing</A>.
          </p>
        </div>
      </section>
    </div>
  );
}
