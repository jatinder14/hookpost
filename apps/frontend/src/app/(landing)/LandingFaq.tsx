import React from 'react';
import { PUBLISHABLE_CHANNEL_COUNT, CHANNEL_COUNT } from './channels/channel-count';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

export const FAQ_DATA = [
  {
    q: 'What is Hookpost?',
    a: `Hookpost is an open-source social media management and scheduling platform from JR Consulting Co., founded by Mohan Bhanushali. It publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks from one visual calendar, ships a native Model Context Protocol (MCP) server so Claude Code, Cursor and Windsurf can draft and queue posts directly, is licensed under AGPL-3.0, and self-hosts with Docker. Billing runs through Razorpay, so UPI, NetBanking and cards all work.`,
  },
  {
    q: 'Can I self-host Hookpost with Docker for free?',
    a: 'Yes. Hookpost is licensed under AGPL-3.0 and self-hosts with `docker compose up -d`, running the whole stack (Next.js frontend, NestJS backend, Temporal orchestrator, PostgreSQL, and Redis) on your own VPS with no per-seat or per-channel fees. The public source release is not out yet, so the repository is shared on request rather than by public clone - ask via our about page and we will send it over with a deployment key.',
  },
  {
    q: 'Does Hookpost support AI agents, Claude, and Model Context Protocol (MCP)?',
    a: 'Yes. Hookpost ships with an official MCP server (`npx hookpost`) and terminal CLI that connects directly to Claude Desktop, Claude Code, Cursor, Windsurf, OpenClaw, and ChatGPT. AI agents can inspect connected channels, draft multi-network posts with platform-specific constraints, generate AI graphics, and schedule posts automatically via standard MCP tools.',
  },
  {
    q: 'Does Hookpost support Indian payment methods like UPI and Razorpay?',
    a: 'Yes. Hookpost offers transparent regional and global pricing starting at ₹699/month ($9 USD for Standard plan) with native UPI (Google Pay, PhonePe, Paytm), NetBanking, and Indian cards processed securely via Razorpay.',
  },
  {
    q: 'Can Hookpost auto-repeat or recycle evergreen posts?',
    a: 'Yes. Any post can be set to repeat on a schedule, so your best-performing content keeps going out without you copy-pasting it every month. Pick the post, set the cadence (for example, every 30 days), choose which channels it should hit each time, and Hookpost handles the rest. Each repost shows up in your calendar so you can still see, edit, or pause upcoming runs. On Team, Pro, and Ultimate plans you can also auto-post from an RSS feed, which is handy for turning a blog or newsletter into a steady social cadence.',
  },
  {
    q: 'Does Hookpost have a public API and webhooks?',
    a: 'Yes. Every paid plan includes a REST API for creating posts, uploading media, and managing integrations — useful if you want to plug Hookpost into your own tools, n8n, Zapier, or a custom dashboard. Webhooks are included from Standard and up, with the monthly allowance scaling by plan: Standard 2, Team 10, Pro 30, Ultimate unlimited. Combined with the public API, they let you trigger posts automatically from CI, a CMS, or any event source.',
  },
  {
    q: 'What analytics does Hookpost provide?',
    a: "Hookpost shows per-channel and per-post analytics pulled from each network's official insights API. Depending on the channel, you'll see impressions, likes, comments, shares, reach, and engagement rate. Everything is in one dashboard — you can compare how the same post performed on LinkedIn vs. X vs. Instagram without opening five different apps. Analytics coverage depends on what each platform exposes publicly.",
  },
  {
    q: 'Can I cross-post the same content to multiple platforms at once?',
    a: "Yes — that's the core of Hookpost. Write a post once, pick the channels, and Hookpost publishes to all of them at the time you choose. Before scheduling, each channel gets its own preview so you can tweak copy, media, or hashtags per platform — for example, a longer LinkedIn version and a shorter X version of the same post. You can also queue the same post to re-run on an evergreen schedule.",
  },
  {
    q: 'What AI features does Hookpost include?',
    a: 'Hookpost ships with a built-in AI agent that can draft posts, generate images, and produce short videos — all from one chat window. AI text generates hooks, captions, threads, and hashtags tuned per platform (included on every paid plan). AI images generate visuals directly from a prompt (monthly allowance: Standard 20, Team 100, Pro 300, Ultimate 500). AI videos produce short social clips (Standard 3, Team 10, Pro 30, Ultimate 60). You can also chat with the agent to schedule posts end-to-end.',
  },
  {
    q: 'Can I manage multiple brands or clients from a single Hookpost account?',
    a: 'Yes. On Team, Pro, and Ultimate plans you can organize your connected accounts into customer groups, so each brand or client has its own clean workspace inside one Hookpost login. Each customer group keeps its own channels, calendar, and analytics — useful for agencies, freelancers, or anyone running several brands.',
  },
  {
    q: 'How many team members can I invite, and what can they do?',
    a: 'Team, Pro, and Ultimate plans let you invite unlimited team members by email. Standard is a solo plan. Hookpost has two roles: Admin (manage channels, billing, and team settings) and Member (draft, schedule, and review posts). Everyone works from the same visual calendar, so drafts, scheduled posts, and analytics stay in one place.',
  },
  {
    q: "How much does Hookpost cost, and what's included in each plan?",
    a: `Hookpost has four transparent plans with monthly or annual billing (saving ~20%): Standard is ₹699/mo ($9 USD) for ${pricing.STANDARD.channel} channels, 500 posts/month, 500 AI text generations, 20 AI images, 3 AI videos, API, and 2 webhooks. Team is ₹1,499/mo ($19 USD) for ${pricing.TEAM.channel} channels, 1,500 posts/month, team members, 1,500 AI text generations, 100 AI images, 10 AI videos, RSS auto-posting, and 10 webhooks. Pro is ₹2,299/mo ($29 USD) for ${pricing.PRO.channel} channels, 5,000 posts/month, 2,500 AI text generations, 300 AI images, 30 AI videos, and 30 webhooks. Ultimate is ₹4,499/mo ($59 USD) for ${pricing.ULTIMATE.channel} channels, 15,000 posts/month, members, 6,000 AI text generations, 500 AI images, 60 AI videos, and custom SLA.`,
  },
  {
    q: 'Can I swap or change my connected channels after choosing a plan?',
    a: `Yes. You are never locked into any specific set of channels. Connect, disconnect, and swap any of the ${CHANNEL_COUNT} supported networks at any time, as long as your total active channels stay within your plan's limit. If you downgrade and exceed the new limit, Hookpost automatically disables the most recent connections without deleting data.`,
  },
  {
    q: 'If I connect 3 Facebook pages, does that count as 1 channel or 3?',
    a: `Each connected social account, profile, or page counts as one channel slot. So three Facebook pages count as three channels. Channel allowances are: Standard (${pricing.STANDARD.channel} channels), Team (${pricing.TEAM.channel} channels), Pro (${pricing.PRO.channel} channels), and Ultimate (${pricing.ULTIMATE.channel} channels).`,
  },
];

export default function LandingFaq() {
  return (
    <section
      id="faq"
      className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12"
      aria-label="Frequently Asked Questions"
    >
      {/* Left Column: Heading */}
      <div className="flex flex-col space-y-4 items-center lg:items-start shrink-0 lg:w-[320px]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold uppercase tracking-wider font-jakarta">
          <span>FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-jakarta text-center lg:text-left leading-tight">
          Frequently asked questions
        </h2>
        <img
          alt="Frequently asked questions underline"
          loading="lazy"
          width="228"
          height="62"
          className="scale-[0.7] sm:scale-100 origin-left"
          src="/svgs/underline-pink.svg"
        />
        <p className="text-sm text-gray-400 text-center lg:text-left">
          Have more questions? Read our{' '}
          <a href="/guides" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
            engineering guides
          </a>{' '}
          or join our{' '}
          <a
            href="https://github.com/hookstep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]"
          >
            GitHub community
          </a>
          .
        </p>
      </div>

      {/* Right Column: Accessible Details/Summary Accordion with Microdata */}
      <div className="flex-1 w-full space-y-3">
        {FAQ_DATA.map((item, idx) => (
          <details
            key={idx}
            open={idx === 0}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="group p-5 sm:p-6 bg-[#141318] border border-white/10 hover:border-[#FF4CE2]/40 rounded-[20px] transition-all"
          >
            <summary className="flex justify-between items-center cursor-pointer list-none select-none">
              <h3
                itemProp="name"
                className="text-base sm:text-lg font-bold font-jakarta text-white pr-4 group-open:text-[#FF4CE2] transition-colors"
              >
                {item.q}
              </h3>
              <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#FF4CE2]/20 flex items-center justify-center transition-colors">
                <svg
                  className="w-4 h-4 text-gray-400 group-open:text-[#FF4CE2] group-open:rotate-180 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
              className="text-left text-sm sm:text-base leading-relaxed text-gray-300 pt-3 mt-3 border-t border-white/5 font-normal"
            >
              <div itemProp="text" className="whitespace-pre-line">
                {item.a}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
