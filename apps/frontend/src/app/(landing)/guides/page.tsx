import { Metadata } from 'next';
import Link from 'next/link';

// LandingFaq has always linked "engineering guides" at /guides, and there was
// no page there - it 404'd. Three guides existed, reachable only if you knew
// their URLs; the rewrite post in particular is the most substantial technical
// writing on the site and nothing linked to it.
export const metadata: Metadata = {
  title: 'Engineering Guides | Hookpost',
  description:
    'Self-hosting with Docker, driving the scheduler from Claude via MCP, and what running a social scheduler in production actually breaks.',
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
          Engineering guides
        </h1>
        <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-white/60">
          How to run Hookpost yourself, how to drive it from an AI agent, and
          what broke when we ran it in production.
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
