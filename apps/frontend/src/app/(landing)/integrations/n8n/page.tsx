import { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "n8n social media automation", "n8n social media scheduler", "n8n
// schedule linkedin posts", "n8n twitter post" and "n8n postiz node alternative".
//
// Every operation named here exists in apps/n8n-node/nodes/Hookpost/Hookpost.node.ts
// and every credential field in apps/n8n-node/credentials/HookpostApi.credentials.ts.
// If the node gains or loses an operation, change OPERATIONS below in the same PR.
//
// Facts checked on CHECKED against live sources, re-check before bumping it:
// - npm: n8n-nodes-hookpost latest is NODE_VERSION.
// - n8n docs: "Unverified community nodes aren't available on n8n cloud".
// - api.n8n.io/api/community-nodes (the verified list): n8n-nodes-postiz is on
//   it, n8n-nodes-hookpost is not. Remove the Cloud caveat the day it is.
const CANONICAL = 'https://hookpost.hookstep.in/integrations/n8n';
const CHECKED = '26 September 2026';
const NODE_VERSION = '0.1.0';

const STANDARD = pricingINR.STANDARD;
const FREE = pricingINR.FREE;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const OPERATIONS: [string, string][] = [
  ['Create Post', 'Schedule a post, publish it now, or save it as a draft. The channel dropdown lists the channels you have connected in Hookpost. Leave Date empty on a scheduled post and the node asks Hookpost for the next free slot in your posting schedule.'],
  ['List Posts', 'Return every post between a start date and an end date.'],
  ['Delete Post', 'Delete a post by its id.'],
  ['List Channels', 'Return your connected channels with their ids.'],
  ['Find Free Slot', 'Return the next free slot in your posting schedule for one channel.'],
  ['Upload From URL', 'Pull an image or video from a public URL into your Hookpost media library. The result has a path you can pass to Create Post.'],
];

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

const LINKEDIN_CONTENT = `New on the blog: {{ $json.title }}

{{ $json.link }}`;

const X_CONTENT = `{{ $json.title }} {{ $json.link }}`;

const YOUTUBE_SETTINGS = `{
  "__type": "youtube",
  "title": "My video",
  "type": "private",
  "selfDeclaredMadeForKids": "no"
}`;

const FAQ = [
  {
    q: 'Is there an n8n node for Hookpost?',
    a: `Yes. n8n-nodes-hookpost is published on npm (version ${NODE_VERSION} as of ${CHECKED}). Install it from Settings, Community Nodes in a self-hosted n8n instance and add a Hookpost API credential with your API key.`,
  },
  {
    q: 'How do I schedule LinkedIn posts from n8n?',
    a: 'Add a Hookpost node, choose Create Post, pick your LinkedIn channel from the dropdown and set When to Schedule. Either set a Date or leave it empty and the node uses the next free slot in your Hookpost posting schedule.',
  },
  {
    q: 'Can n8n post to X (Twitter) through Hookpost?',
    a: 'Yes. Connect your X account in Hookpost, then choose it in the Create Post channel dropdown. X allows 280 characters (Hookpost accepts up to 4,000 for a Premium account), and Hookpost rejects a post that is too long with an error before queueing it.',
  },
  {
    q: 'Does the Hookpost node work on n8n Cloud?',
    a: 'Not yet. n8n Cloud only offers verified community nodes, and n8n-nodes-hookpost is not verified. On n8n Cloud, call the Hookpost REST API with the HTTP Request node instead, sending your key in the Authorization header.',
  },
  {
    q: 'Which Hookpost plan do I need?',
    a: `The node uses the Hookpost Public API, which starts on Standard at ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels and ${STANDARD.posts_per_month} posts. The Free plan (${FREE.channel} channels, ${FREE.posts_per_month} posts) does not include API access.`,
  },
];

export const metadata: Metadata = {
  title: 'n8n Social Media Automation Node | Hookpost',
  description:
    'Schedule LinkedIn, X and YouTube posts from n8n with the n8n-nodes-hookpost community node. Install steps, every operation, and an RSS-to-LinkedIn workflow.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'n8n social media automation with Hookpost',
    description: 'Install n8n-nodes-hookpost and schedule posts to LinkedIn, X, YouTube and more from any n8n workflow.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Hookpost n8n node' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n8n social media automation with Hookpost',
    description: 'Install n8n-nodes-hookpost and schedule posts to LinkedIn, X, YouTube and more from n8n.',
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

export default function N8nIntegrationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${CANONICAL}#article`,
        headline: 'Social media automation in n8n with the Hookpost node',
        description:
          'How to install the n8n-nodes-hookpost community node, what each operation does, and an example workflow that schedules blog posts to LinkedIn and X.',
        mainEntityOfPage: CANONICAL,
        dateModified: '2026-09-26',
        proficiencyLevel: 'Beginner',
        publisher: {
          '@type': 'Organization',
          name: 'Hookpost',
          url: 'https://hookpost.hookstep.in/',
          logo: 'https://hookpost.hookstep.in/brand-logo.png',
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
          { '@type': 'ListItem', position: 2, name: 'n8n integration', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">n8n community node · v{NODE_VERSION}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Social media automation in n8n with the Hookpost node
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          <code className="font-mono text-white">n8n-nodes-hookpost</code> lets an n8n workflow schedule, publish and delete
          posts on the channels you have connected in Hookpost. One credential covers every channel, so a single workflow can
          send the same update to LinkedIn, X, YouTube and Bluesky without a separate OAuth app for each.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Start free
          </Link>
          <a
            href="https://www.npmjs.com/package/n8n-nodes-hookpost"
            rel="noopener"
            target="_blank"
            className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]"
          >
            n8n-nodes-hookpost on npm
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Install the node</h2>
        <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
          <li>
            In your self-hosted n8n, go to <strong className="text-white">Settings → Community Nodes → Install</strong> and enter{' '}
            <code className="font-mono text-white">n8n-nodes-hookpost</code>. Only an Owner or Admin can install community nodes.
          </li>
          <li>
            In Hookpost, open <strong className="text-white">Settings → Developers</strong> and copy your API key.
          </li>
          <li>
            Back in n8n, create a <strong className="text-white">Hookpost API</strong> credential. Paste the key into API Key and
            leave Base URL as <code className="font-mono text-white">https://hookpost.hookstep.in/api</code> unless you self-host
            Hookpost.
          </li>
          <li>
            Press <strong className="text-white">Test</strong>. n8n calls <code className="font-mono text-white">/public/v1/is-connected</code>{' '}
            to confirm the key before you build anything with it.
          </li>
        </ol>
        <div className="mt-6 max-w-[70ch] rounded-2xl border border-white/10 p-5 text-white/70">
          <strong className="text-white">On n8n Cloud?</strong> n8n Cloud only runs{' '}
          <A href="https://docs.n8n.io/integrations/community-nodes/installation-and-management/">verified community nodes</A>, and
          this node is not verified yet (checked {CHECKED}). Use the HTTP Request node with the{' '}
          <A href="/social-media-scheduling-api">Hookpost REST API</A> instead: same endpoints, same key.
        </div>
        <p className="mt-6 max-w-[70ch] text-white/60">
          The node talks to the Hookpost Public API, which starts on Standard at {inr(STANDARD.month_price)} a month for{' '}
          {STANDARD.channel} channels and {STANDARD.posts_per_month} posts. <A href="/pricing">See every plan</A>.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What the node can do</h2>
          <p className="mt-3 max-w-[70ch] text-white/60">Six operations. This is the complete list.</p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {OPERATIONS.map(([name, what]) => (
              <div key={name} className="rounded-2xl border border-white/10 p-5">
                <dt className="font-bold text-white">{name}</dt>
                <dd className="mt-2 text-white/70">{what}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[70ch] text-white/70">
            Create Post also takes two optional fields. <strong className="text-white">Image URLs</strong> is a comma-separated
            list of media already in Hookpost, usually the <code className="font-mono">path</code> returned by Upload From URL.{' '}
            <strong className="text-white">Channel Settings (JSON)</strong> carries the extra fields some networks need. YouTube, for
            example, needs a title and a visibility:
          </p>
          <Code>{YOUTUBE_SETTINGS}</Code>
          <p className="mt-6 max-w-[70ch] text-white/70">
            There is no trigger node. To start a workflow when a post goes live, add a webhook in Hookpost under{' '}
            <strong className="text-white">Settings → Webhooks</strong> pointing at an n8n Webhook node. Hookpost sends the post
            as JSON after it publishes, and you can limit a webhook to specific channels.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Example: blog RSS to LinkedIn and X</h2>
          <p className="mt-3 max-w-[70ch] text-white/70">
            A three-node workflow that queues every new blog post for LinkedIn and X in your next free slots.
          </p>
          <ol className="mt-6 flex flex-col gap-6 text-white/80 list-decimal ps-6">
            <li>
              <strong className="text-white">RSS Feed Trigger</strong> (built into n8n), pointed at your blog&apos;s feed.
            </li>
            <li>
              <strong className="text-white">Hookpost → Create Post.</strong> Channel: your LinkedIn profile. When: Schedule. Date:
              empty, so it takes the next free slot. Content:
              <Code>{LINKEDIN_CONTENT}</Code>
            </li>
            <li>
              <strong className="text-white">Hookpost → Create Post</strong>, connected to the same trigger. Channel: your X
              account. When: Schedule. Content:
              <Code>{X_CONTENT}</Code>
            </li>
          </ol>
          <p className="mt-6 max-w-[70ch] text-white/70">
            Hookpost checks each post against the network&apos;s rules before queueing it, so a title that pushes the X post
            past 280 characters fails at the node with a readable error rather than at publish time. Turn on{' '}
            <strong className="text-white">Continue On Fail</strong> and the error is passed downstream as{' '}
            <code className="font-mono">{'{ "error": "..." }'}</code>, which you can route to Slack or email.
          </p>
          <p className="mt-4 max-w-[70ch] text-white/70">
            To attach an image, put <strong className="text-white">Upload From URL</strong> before Create Post and set Image URLs
            to <code className="font-mono">{'{{ $json.path }}'}</code>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Channels the node can publish to today</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
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

          <h3 className="mt-12 text-xl font-bold font-jakarta">Coming from the Postiz node?</h3>
          <p className="mt-3 max-w-[70ch] text-white/70">
            <code className="font-mono">n8n-nodes-postiz</code> is built for Postiz accounts, and it is on n8n&apos;s verified
            list, so it runs on n8n Cloud. <code className="font-mono">n8n-nodes-hookpost</code> is for Hookpost accounts and,
            for now, needs self-hosted n8n. Which one you want depends on where your account lives. Hookpost charges one flat
            price per plan rather than per channel, with rupee billing and UPI Autopay in India. See the <A href="/alternatives/postiz">Postiz comparison</A>.
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
            More ways in: the <A href="/docs/public-api">Public API reference</A>, the{' '}
            <A href="/social-media-scheduling-api">scheduling API overview</A>, the <A href="/mcp">MCP server</A> for Claude and
            Cursor, and <A href="/docs/oauth">OAuth apps</A> if your workflow acts on other people&apos;s Hookpost accounts.
          </p>
        </div>
      </section>
    </div>
  );
}
