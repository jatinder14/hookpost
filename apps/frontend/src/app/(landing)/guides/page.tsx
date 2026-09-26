import { Metadata } from 'next';
import Link from 'next/link';

// LandingFaq has always linked "engineering guides" at /guides, and there was
// no page there - it 404'd. Three guides existed, reachable only if you knew
// their URLs; the rewrite post in particular is the most substantial technical
// writing on the site and nothing linked to it.
export const metadata: Metadata = {
  title: 'Social Media Scheduling Guides & Free Tools | Hookpost',
  description:
    'Guides and free tools for scheduling social media: a character counter, the free plan explained, self-hosting with Docker and posting from Claude.',
  alternates: { canonical: 'https://hookpost.hookstep.in/guides' },
};

const GUIDES = [
  {
    href: '/guides/docker-self-hosting',
    title: 'Self-host a social media scheduler with Docker',
    blurb:
      'The full stack under Docker Compose — Next.js, NestJS, a Temporal orchestrator, PostgreSQL and Redis — and the memory footprint to expect on a small VPS.',
    tag: 'Self-hosting',
  },
  {
    href: '/guides/claude-mcp-social-media',
    title: 'Schedule social media from Claude with MCP',
    blurb:
      'Connect the Model Context Protocol server to Claude Desktop, Claude Code, Cursor or Windsurf, and have your assistant draft and queue posts directly.',
    tag: 'AI agents',
  },
];

// Pages that answer a scheduling question on their own. Linked from here so
// the hub is not a two-item list and the landing pages have a crawled parent.
const RESOURCES = [
  {
    href: '/tools/character-counter',
    title: 'Social media character counter',
    blurb: 'Paste a post and see how many characters are left on X, LinkedIn, Instagram, Threads, Bluesky and YouTube at once. X links and emoji are weighted the way X counts them.',
    tag: 'Free tool',
  },
  {
    href: '/free-social-media-scheduler',
    title: 'What a free social media scheduler actually includes',
    blurb: 'Hookpost\'s free plan next to the free plans of Buffer, Metricool, Hootsuite and Later, with the limits read off each pricing page.',
    tag: 'Comparison',
  },
  {
    href: '/social-media-scheduler-india',
    title: 'Scheduling social media from India, paid in rupees',
    blurb: 'Plans in INR, how UPI Autopay mandates work for a subscription, and what five channels cost in rupees against a dollar-billed tool.',
    tag: 'India',
  },
  {
    href: '/guides/schedule-discord-announcements',
    title: 'How to schedule Discord messages and announcements',
    blurb: 'Invite the bot, pick the channel, and schedule one-off or repeating messages, with what Discord posting can and cannot do.',
    tag: 'Guide',
  },
  {
    href: '/guides/schedule-x-threads',
    title: 'How to schedule a thread on X',
    blurb: 'Write the thread once, set per-post delays and publish it as a reply chain at the time you pick.',
    tag: 'Guide',
  },
  {
    href: '/guides/cross-post-x-bluesky',
    title: 'Cross-post to X and Bluesky at the same time',
    blurb: 'One post, two networks, with a shorter version for each limit and threads on both.',
    tag: 'Guide',
  },
  {
    href: '/guides/cross-post-dev-articles',
    title: 'Cross-post articles to Dev.to, Hashnode and WordPress',
    blurb: 'Publish the original once, point the copies back with a canonical URL, and schedule all three.',
    tag: 'Guide',
  },
  {
    href: '/alternatives/typefully',
    title: 'Hookpost vs Typefully',
    blurb: 'Plans, free tier and networks side by side, including where Typefully is the better pick.',
    tag: 'Comparison',
  },
  {
    href: '/open-source-social-media-scheduler',
    title: 'Open-source social media schedulers compared',
    blurb: 'Hookpost, Postiz and Mixpost side by side: licence, GitHub activity, self-hosting and hosted pricing.',
    tag: 'Comparison',
  },
  {
    href: '/social-media-scheduling-api',
    title: 'A social media scheduling API',
    blurb: 'Endpoints, auth and real curl examples for scheduling posts from your own code.',
    tag: 'Developers',
  },
  {
    href: '/integrations/n8n',
    title: 'Schedule social posts from n8n',
    blurb: 'Install the Hookpost community node and build a workflow that posts to X, LinkedIn and more.',
    tag: 'Integration',
  },
  {
    href: '/tools/thread-splitter',
    title: 'Thread splitter for X and Bluesky',
    blurb: 'Paste long text and get numbered posts that each fit the limit.',
    tag: 'Free tool',
  },
  {
    href: '/compare/postiz-vs-buffer',
    title: 'Postiz vs Buffer',
    blurb: 'Pricing, free plan, API and AI-agent support from each vendor\'s own page.',
    tag: 'Comparison',
  },
  {
    href: '/channels/x',
    title: 'How to schedule posts and threads on X',
    blurb: 'Post types, the per-post settings and the one constraint that trips people up when scheduling to X.',
    tag: 'Channel guide',
  },
  {
    href: '/channels/linkedin',
    title: 'How to schedule LinkedIn posts',
    blurb: 'Carousels, video and the rules LinkedIn enforces on each post type.',
    tag: 'Channel guide',
  },
  {
    href: '/channels/youtube',
    title: 'How to schedule YouTube videos and Shorts',
    blurb: 'Titles, visibility, thumbnails and tags set per upload, and what YouTube rejects.',
    tag: 'Channel guide',
  },
];

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-black text-white font-dm">
      <div className="mx-auto w-full max-w-[900px] px-5 py-20 sm:px-10 sm:py-28">
        <Link
          href="/"
          className="text-sm text-white/50 transition-colors hover:text-[#FF4CE2]"
        >
          ← Hookpost
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Guides and free tools
        </h1>
        <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-white/60">
          Practical answers for scheduling social media: how each network
          behaves, what the free options really include, how to run Hookpost
          yourself and how to drive it from an AI agent.
        </p>

        <div className="mt-14 flex flex-col gap-5">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                {g.tag}
              </span>
              <h2 className="mt-3 text-xl font-bold font-jakarta group-hover:text-[#FF4CE2] sm:text-2xl">
                {g.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                {g.blurb}
              </p>
            </Link>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-bold font-jakarta">Scheduling guides and tools</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {RESOURCES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                {g.tag}
              </span>
              <h3 className="mt-2 text-lg font-bold font-jakarta group-hover:text-[#FF4CE2]">
                {g.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{g.blurb}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-white/50">
            Looking for the API instead?{' '}
            <Link href="/docs/public-api" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              Public API reference
            </Link>{' '}
            and{' '}
            <Link href="/docs/oauth" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              OAuth for third-party apps
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
