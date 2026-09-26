import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { IndiaCostNote } from "../IndiaCostNote";
import { PUBLISHABLE_CHANNEL_COUNT } from "../../channels/channel-count";
import { pricingINR, pricingUSD } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { COMPETITOR_FACTS, FACTS_CHECKED } from '../../compare/competitor-facts';

const { FREE, STANDARD: STD_INR, PRO: PRO_INR } = pricingINR;
const { STANDARD: STD_USD, PRO: PRO_USD } = pricingUSD;
const inr = (n: number) => n.toLocaleString('en-IN');
// One sentence on Hookpost's sold plans, read from pricing.ts so it cannot drift.
const HOOKPOST_PLANS = `Hookpost's free plan covers ${FREE.channel} channels and ${FREE.posts_per_month} posts a month (no AI or API). Standard is ₹${inr(STD_INR.month_price)} or $${STD_USD.month_price} a month for ${STD_INR.channel} channels and ${STD_INR.posts_per_month} posts, with AI, API and MCP. Pro is ₹${inr(PRO_INR.month_price)} or $${PRO_USD.month_price} a month for ${PRO_INR.channel} channels, ${inr(PRO_INR.posts_per_month)} posts and up to ${PRO_INR.team_member_limit} team members.`;
const HOOKPOST_NETWORKS = `Hookpost publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks for a new account today; Instagram, Facebook and Threads are awaiting Meta approval and Pinterest publishing is not available yet.`;
const MIXPOST = COMPETITOR_FACTS.mixpost;
const FACTS = Object.values(COMPETITOR_FACTS);
const MCP_COUNT = FACTS.filter((c) => c.mcp === true).length;

export const metadata: Metadata = {
  title: "Hookpost vs Mixpost (2026): Open-Source Self-Hosted Alternative",
  description:
    `Compare Hookpost and Mixpost: hosted cloud plus self-hosting vs self-hosted only, Node.js/Temporal vs PHP/Laravel, free and monthly plans vs a $299 one-time licence, and Razorpay UPI billing.`,
  keywords: [
    "mixpost alternative",
    "mixpost competitors",
    "mixpost open source alternative",
    "mixpost vs hookpost",
    "self hosted social media scheduler",
    "open source buffer alternative",
    "mixpost pricing 2026",
    "hookpost vs mixpost",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/mixpost",
  },
  openGraph: {
    title: "Hookpost vs Mixpost (2026): Open-Source Alternative",
    description:
      `Compare Hookpost vs Mixpost: publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks, Node.js + Temporal architecture, MCP server on paid plans, and cloud + Docker self-hosting.`,
    url: "https://hookpost.hookstep.in/alternatives/mixpost",
    siteName: "Hookpost",
    images: [
      {
        url: "https://hookpost.hookstep.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hookpost vs Mixpost Open-Source Comparison",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mixpost Alternative (2026): Hookpost vs Mixpost",
    description: `Compare Hookpost vs Mixpost. Publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks, hosted cloud plus self-hosting, and event-driven Temporal scheduling.`,
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function MixpostAlternativePage() {
  const comparisonData = [
    {
      feature: "Supported Social Networks",
      hookpost: `${PUBLISHABLE_CHANNEL_COUNT} networks for new accounts (X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram, WordPress...); Instagram, Facebook, Threads and Pinterest not yet`,
      mixpost: "12 networks on Pro, including Instagram, TikTok, Pinterest, Threads, Mastodon and Pixelfed; Lite covers Facebook Pages, X and Mastodon only",
      winner: "Tie",
    },
    {
      feature: "Architecture & Stack",
      hookpost: "Modern TypeScript (Next.js 16 + NestJS + Temporal.io + Redis)",
      mixpost: "PHP / Laravel + Horizon Queue Worker",
      winner: "Hookpost",
    },
    {
      feature: "AI Agent & MCP Integration",
      hookpost: "✅ MCP server on Standard and Pro, for Claude Desktop, Claude Code, Cursor and other MCP clients",
      mixpost: "✅ MCP server included with Mixpost Pro",
      winner: "Tie",
    },
    {
      feature: "Deployment Options",
      hookpost: "✅ Managed Cloud SaaS + Docker Self-Hosting",
      mixpost: "⚠️ Self-hosted only; no hosted plan",
      winner: "Hookpost",
    },
    {
      feature: "Video & Reels Auto-Publishing",
      hookpost: "Video publishing to YouTube (including Shorts), X, LinkedIn and others; no Instagram Reels or TikTok yet",
      mixpost: "✅ Video publishing on its supported networks, which include Instagram and TikTok",
      winner: "Mixpost",
    },
    {
      feature: "Payment Methods & Regional Access",
      hookpost: "✅ Monthly plans billed in INR via Razorpay (UPI, NetBanking, cards), or USD by card",
      mixpost: "One-time USD licence ($299 Pro), paid by card or PayPal",
      winner: "Hookpost",
    },
    {
      feature: "Team & Account Limits",
      hookpost: `Pro: ${PRO_INR.channel} channels and up to ${PRO_INR.team_member_limit} team members`,
      mixpost: "Pro: unlimited accounts on 1 domain or subdomain",
      winner: "Mixpost",
    },
    {
      feature: "Free Starter Tier",
      hookpost: `✅ Free cloud plan (${FREE.channel} channels, ${FREE.posts_per_month} posts/month, no AI or API, no credit card required)`,
      mixpost: "⚠️ Mixpost Lite: free and open source (MIT), self-hosted only; Facebook Pages, X and Mastodon only",
      winner: "Hookpost",
    },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hookpost",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All (Web-based, Cloud, Docker Self-Hosted)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Modern open-source social media management and scheduling software with multi-agent AI copilot and MCP server.",
  };

  const faqItems = [
    {
      name: "What is the main difference between Hookpost and Mixpost?",
      acceptedAnswer: {
        text: "While both Hookpost and Mixpost offer open-source social media management, Hookpost is built on modern TypeScript (Next.js 16, NestJS, and Temporal.io for bulletproof job scheduling) Both ship a Model Context Protocol (MCP) server (Hookpost on Standard and Pro, Mixpost with its Pro licence). Hookpost offers both a hosted cloud plan and Docker self-hosting, whereas Mixpost is a self-hosted PHP/Laravel application with no hosted plan.",
      },
    },
    {
      name: "Can I self-host Hookpost like Mixpost?",
      acceptedAnswer: {
        text: "Yes. Hookpost provides production-ready Docker Compose configurations that allow developers, agencies, and enterprises to self-host the entire stack (PostgreSQL, Redis, Temporal, NestJS backend, and Next.js frontend) on their own VPS or cloud infrastructure with complete data sovereignty.",
      },
    },
    {
      name: "Does Hookpost support more networks than Mixpost?",
      acceptedAnswer: {
        text: `Not across the board. Hookpost publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks for a new account, including X, LinkedIn, YouTube, Bluesky, Discord, Telegram, WordPress, Nostr and Lemmy. Instagram, Facebook and Threads are awaiting Meta approval and Pinterest publishing is not available yet. Mixpost Pro lists 12 networks, including Instagram, TikTok, Pinterest, Threads, Mastodon and Pixelfed, which Hookpost does not publish to today.`,
      },
    },
    {
      name: "How does pricing compare between Hookpost and Mixpost?",
      acceptedAnswer: {
        text: `${HOOKPOST_PLANS} Hookpost bills monthly via Razorpay (UPI, NetBanking, cards). Mixpost has no hosted plan: Mixpost Lite is free and open source (MIT) but self-hosted, and Mixpost Pro is a $299 one-time licence for one domain (1 year of updates included), plus your own server costs. Mixpost prices checked ${FACTS_CHECKED}.`,
      },
    },
    {
      name: "Does Hookpost have an AI scheduler or MCP server?",
      acceptedAnswer: {
        text: `Yes, on Standard and Pro (not on Free). You can install the CLI with 'npx hookpost' or connect the MCP server to Claude Desktop, Claude Code, Cursor or another MCP client to draft and schedule posts. It is not unique: Mixpost Pro also ships an MCP server, and ${MCP_COUNT} of the ${FACTS.length} social media tools we checked on ${FACTS_CHECKED} offer one.`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold uppercase tracking-wider text-[#00ffe6] mb-6">
          <span>⚡ Open-Source Comparison</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Hookpost vs Mixpost: <br className="hidden sm:inline" />
          The Modern Open-Source Alternative (2026)
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
          Looking for a modern, open-source social media management tool? Discover why creators,
          marketing teams, and developers choose Hookpost over Mixpost for multi-channel scheduling,
          event-driven Temporal reliability, and autonomous AI agent MCP integration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#00ffe6] via-[#3b82f6] to-[#8b5cf6] text-black font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
          >
            Get Started Free (No Card Required)
          </Link>
          <Link
            href="/mcp"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-semibold text-base transition-colors"
          >
            Explore AI Agent MCP Server →
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-4">
          Feature-by-Feature Comparison
        </h2>
        <p className="text-center text-white/60 mb-10 max-w-2xl mx-auto">
          See how Hookpost and Mixpost compare on platform coverage, automation, architecture, and pricing.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="py-4 px-6 text-sm font-semibold text-white/80">Feature</th>
                <th className="py-4 px-6 text-sm font-bold text-[#00ffe6]">Hookpost</th>
                <th className="py-4 px-6 text-sm font-semibold text-white/60">Mixpost</th>
                <th className="py-4 px-6 text-sm font-semibold text-white/80">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-white/90">{row.feature}</td>
                  <td className="py-4 px-6 text-white font-medium">{row.hookpost}</td>
                  <td className="py-4 px-6 text-white/70">{row.mixpost}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.winner === "Hookpost"
                          ? "bg-cyan-500/10 text-[#00ffe6] border border-cyan-500/20"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {row.winner}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-white/50 mt-4">
          {MIXPOST.name} figures read off {MIXPOST.sources[0]} on {FACTS_CHECKED}. Hookpost figures are its published plans.
        </p>
      </section>

      {/* Deep Dive Pillars */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-white">Event-Driven Temporal Engine</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Mixpost runs publishing on PHP/Laravel queue workers. Hookpost runs it as Temporal.io workflows, which keep their state across restarts and retry failed steps.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-white">Native Model Context Protocol (MCP)</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              On Standard and Pro, connect Hookpost to Claude Desktop, Cursor or another MCP client and schedule posts from your terminal or AI IDE. Mixpost Pro ships an MCP server too.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3 text-white">Transparent Flat Pricing & UPI</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Hookpost has a free cloud plan ({FREE.channel} channels, {FREE.posts_per_month} posts a month) and flat monthly plans from ₹{inr(STD_INR.month_price)} or ${STD_USD.month_price}, paid with Razorpay UPI (Google Pay, PhonePe, Paytm) or cards. Mixpost Pro is a $299 one-time licence you host yourself (prices checked {FACTS_CHECKED}).
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 sm:px-12 max-w-4xl mx-auto py-16">
        <IndiaCostNote slug="mixpost" />

        <SectionFaq items={faqItems} title="Frequently Asked Questions: Hookpost vs Mixpost" />
      </section>

      {/* Final Call to Action */}
      <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20 text-center">
        <div className="p-12 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Try Hookpost, the Open-Source Social Scheduler
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Publish to {PUBLISHABLE_CHANNEL_COUNT} networks from one calendar, with AI writing and API access on Standard and Pro.
          </p>
          <Link
            href="/auth"
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-[#00ffe6] via-[#3b82f6] to-[#8b5cf6] text-black font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-cyan-500/20"
          >
            Create Your Free Account Now
          </Link>
        </div>
      </section>
    </div>
  );
}
