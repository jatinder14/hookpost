// Server component. The only interactive part - the mobile menu - lives in
// site-nav.tsx, so none of this page's markup ships to the browser as JS.

// Homepage, rebuilt September 2026.
//
// The previous version is archived at /home-v1 (noindex). Two things drove the
// rewrite: it named competitors throughout — this page is about our own
// product, and /alternatives/<competitor> already serves anyone searching for a
// comparison — and it carried claims that were not true, listed below where
// each is corrected.
//
// Every number here comes from pricing.ts. Do not edit them in isolation.

import { SiteNav } from "./site-nav";
import Link from "next/link";
import SeoSchemas from "./SeoSchemas";
import AeoAnswerCapsule from "./AeoAnswerCapsule";
import LandingFaq from "./LandingFaq";
import { PricingPlans } from './PricingPlans';
import { PricingContrast } from './PricingContrast';
import { PUBLISHABLE_CHANNEL_COUNT } from './channels/channel-count';

const CHANNELS = [
  "instagram", "youtube", "linkedin", "x", "facebook",
  "threads", "bluesky", "pinterest", "discord", "slack",
  "telegram", "wordpress", "medium", "hashnode", "devto",
];

// The people who actually work on Hookpost. HookStep is the parent business -
// technical recruiting - so these are their HookStep titles, said as such
// rather than reframed as Hookpost roles they do not hold. Mohan leads because
// he is Hookpost's founder, which is what our Organization schema also says.
const TEAM = [
  {
    slug: "mohan",
    name: "Mohan Bhanushali",
    role: "Founder, Hookpost",
    bio: "Operations lead at HookStep — process, partnerships and delivery. Founded Hookpost.",
  },
  {
    slug: "sakshi",
    name: "Sakshi",
    role: "Head of Sales, HookStep",
    bio: "Builds client relationships and helps companies hire exceptional tech talent, fast.",
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <SeoSchemas />

      <SiteNav />

      {/* -------------------------------------------------------------- hero */}
      <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-16 sm:px-10 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF4CE2]/30 bg-[#FF4CE2]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
              Open source · AGPL-3.0
            </span>

            <h1 className="mt-6 text-[38px] font-extrabold leading-[1.08] tracking-tight sm:text-[54px] font-jakarta text-balance">
              Schedule social posts from a calendar — or from your AI agent
            </h1>

            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-white/70">
              Hookpost publishes to {PUBLISHABLE_CHANNEL_COUNT} networks from one visual calendar. It also
              ships a Model Context Protocol server, so Claude Code, Cursor and
              Windsurf can draft and queue posts without you opening the app.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/auth"
                className="rounded-full bg-[#FF4CE2] px-7 py-3.5 font-semibold text-black transition-opacity hover:opacity-90"
              >
                Start free — no card
              </Link>
              <Link
                href="/mcp"
                className="rounded-full border border-white/15 px-7 py-3.5 font-semibold transition-colors hover:border-[#FF4CE2]/50 hover:text-[#FF4CE2]"
              >
                Set up the MCP server
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/60">
              Free tier is 2 channels and 30 posts a month, and does not expire.
              Paid plans start at ₹699 / $9.
            </p>
          </div>

          {/* terminal */}
          <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0b0910] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-white/60">
                hookpost — CLI
              </span>
            </div>
            {/*
              This used to advertise `npx hookpost schedule --prompt "..."`.
              There is no `schedule` command — the CLI exposes auth, channels,
              posts, post, delete and slot. Anyone copying the old line got
              "Unknown command". These are real, working invocations.
            */}
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.9] text-white/80">
<span className="text-white/35">$ </span>npm install -g hookpost{"\n"}
<span className="text-white/35">$ </span>hookpost auth login{"\n"}
<span className="text-[#28c840]">✓</span> Signed in{"\n"}
{"\n"}
<span className="text-white/35">$ </span>hookpost channels{"\n"}
<span className="text-[#FF4CE2]">abc123</span>  Acme  <span className="text-white/60">linkedin</span>{"\n"}
<span className="text-[#FF4CE2]">def456</span>  Acme  <span className="text-white/60">bluesky</span>{"\n"}
{"\n"}
<span className="text-white/35">$ </span>hookpost post <span className="text-[#febc2e]">&quot;Shipped something small today.&quot;</span> \{"\n"}
{"    "}--channel abc123{"\n"}
<span className="text-white/50">  No --at given, using next free slot: 09:00</span>{"\n"}
<span className="text-[#28c840]">✓</span> Created.
            </pre>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- direct answer block */}
      <AeoAnswerCapsule />

      {/* ------------------------------------------------------------ who for */}
      <section className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
          Built for people who automate
        </h2>
        <p className="mt-3 max-w-[60ch] text-white/60">
          Most schedulers assume a human opens a dashboard. Hookpost works that
          way too — and works when nobody does.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              tag: "AI agents",
              title: "Post from Claude or Cursor",
              body: "The MCP server exposes your calendar and channels as tools. Ask your assistant to draft and queue a week of posts and it does, without a browser.",
              href: "/mcp",
              link: "MCP setup",
            },
            {
              tag: "Developers",
              title: "Build on the API",
              body: "A REST API and OAuth flow so your own product can connect a user's channels once and publish on their behalf. SDK and CLI on npm.",
              href: "/docs/public-api",
              link: "API reference",
            },
            {
              tag: "Automation",
              title: "Wire it into n8n",
              body: "A community n8n node with six operations — create, list, delete, channels, free slot, upload — so a workflow can publish without glue code.",
              href: "/docs/oauth",
              link: "OAuth for apps",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                {c.tag}
              </span>
              <h3 className="mt-3 text-xl font-bold font-jakarta">{c.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/60">
                {c.body}
              </p>
              <Link
                href={c.href}
                className="mt-5 text-sm font-semibold text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]"
              >
                {c.link} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- what it does */}
      <section className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Everything the posting itself needs
          </h2>

          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Visual calendar", "Drag a post to move it. Set the times you publish once, and new posts drop into the next free slot."],
              ["One draft, every network", "Write once, then adjust per channel where it matters — a thread on X, a carousel on Instagram."],
              ["AI drafting", "Generate captions, hooks and hashtags per platform, inside the character limit each one enforces."],
              ["Durable scheduling", "Posts run through Temporal workflows. If a worker restarts mid-publish it resumes, rather than dropping the post or sending it twice."],
              ["Self-hosting", "AGPL-3.0, and the whole stack runs under Docker Compose on your own server with no per-seat fee."],
              ["Indian payments", "Billing through Razorpay — UPI, NetBanking and cards, not foreign cards only."],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="text-lg font-bold font-jakarta">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- channels */}
      <section className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
          18 networks, including the ones nobody else covers
        </h2>
        <p className="mt-3 max-w-[62ch] text-white/60">
          Alongside the usual social networks, Hookpost publishes to developer
          and community platforms — Discord, Slack, Telegram, DEV, Hashnode,
          WordPress — that most schedulers leave out entirely.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {CHANNELS.map((c) => (
            <Link
              key={c}
              href={`/channels/${c}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm capitalize text-white/75 transition-colors hover:border-[#FF4CE2]/50 hover:text-white"
            >
              {c === "devto" ? "DEV.to" : c === "x" ? "X" : c}
            </Link>
          ))}
          <Link
            href="/channels"
            className="rounded-full border border-[#FF4CE2]/40 px-4 py-2 text-sm font-semibold text-[#FF4CE2] hover:bg-[#FF4CE2]/10"
          >
            See all channels →
          </Link>
        </div>
      </section>

      {/* Frames the numbers below: the objection to a scheduler is rarely the
          monthly price, it is what that price does when you add channels. */}
      <PricingContrast />

      {/* Shared with /pricing so both render one source of truth. id keeps
          the existing #pricing anchor working for in-page links. */}
      <PricingPlans id="pricing" />

      {/* --------------------------------------------------------------- faq */}
      {/* LandingFaq renders its own "Frequently asked questions" heading, so
          this section must not add a second one. */}
      <section className="mx-auto w-full max-w-[1100px] px-5 py-20 sm:px-10">
        <LandingFaq />
      </section>

      {/* ---------------------------------------------------------------- team */}
      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Who builds it
          </h2>
          <p className="mt-3 max-w-[58ch] text-white/60">
            Hookpost is made by JR Consulting Co., part of HookStep. The same
            team runs both.
          </p>

          <div className="mt-12 grid max-w-[720px] gap-6 sm:grid-cols-2">
            {TEAM.map((person) => (
              <div
                key={person.slug}
                className="flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-7 text-center"
              >
                <img
                  src={`/team/${person.slug}.jpg`}
                  alt={person.name}
                  width={104}
                  height={104}
                  loading="lazy"
                  className="h-26 w-26 rounded-full object-cover ring-2 ring-[#FF4CE2]/40"
                  style={{ width: 104, height: 104 }}
                />
                <h3 className="mt-5 font-bold font-jakarta">{person.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#FF4CE2]">
                  {person.role}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-white/60">
            Questions for the team?{" "}
            <Link href="/contact" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              support@hookstep.in
            </Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ closing */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 text-center sm:px-10">
          {/*
            Was "Elevate your social media planning and achieve new heights of
            efficiency and effectiveness" — which states nothing. A closing CTA
            should tell someone what happens next.
          */}
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Connect a channel and schedule your first post
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-white/60">
            The free tier needs no card and does not expire. Paid plans cancel in
            one click from the billing page.
          </p>
          <Link
            href="/auth"
            className="mt-8 inline-block rounded-full bg-[#FF4CE2] px-8 py-4 font-semibold text-black transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- footer */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <div className="flex items-center gap-2.5">
                <img src="/brand-logo-96.png" width="96" height="96" alt="" className="h-7 w-auto object-contain" />
                <span className="font-extrabold tracking-tight">Hookpost</span>
              </div>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-white/50">
                Open-source social media scheduling, by JR Consulting Co.
              </p>
            </div>

            {[
              ["Product", [["Channels", "/channels"], ["AI agents & MCP", "/mcp"], ["Pricing", "/pricing"], ["By role", "/for"]]],
              ["Developers", [["Public API", "/docs/public-api"], ["OAuth apps", "/docs/oauth"], ["Self-hosting", "/guides/docker-self-hosting"], ["Guides", "/guides/claude-mcp-social-media"]]],
              ["Company", [["About", "/about"], ["Contact", "/contact"], ["Comparisons", "/alternatives"], ["Privacy", "/privacy"], ["Terms", "/terms"]]],
              // Razorpay's payment-method review looks for these five policy
              // pages linked from the site, not just reachable by URL.
              ["Policies", [["Refunds", "/refund-policy"], ["Cancellation", "/cancellation-policy"], ["Shipping & delivery", "/shipping-policy"], ["Data deletion", "/data-deletion"]]],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
                  {heading as string}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {(links as string[][]).map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-white/65 transition-colors hover:text-[#FF4CE2]">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            {/* The operating address deliberately lives on /contact only, not
                here. Razorpay requires it published somewhere reachable on the
                site - a Contact page satisfies that - and it is the owner's
                home address, so it is printed once rather than on every page.
                If a Razorpay reviewer ever asks for it in the footer, add it
                back here and keep it identical to the GST and IEC records. */}
            <p>
              © {new Date().getFullYear()} JR Consulting Co. Licensed under AGPL-3.0.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/company/hookpost"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF4CE2]"
              >
                LinkedIn
              </a>
              <a href="mailto:support@hookstep.in" className="hover:text-[#FF4CE2]">
                support@hookstep.in
              </a>
              <Link href="/data-deletion" className="hover:text-[#FF4CE2]">
                Data deletion
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
