import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { CHANNEL_COUNT } from "../../channels/channel-count";

export const metadata: Metadata = {
  title: "Hookpost vs Mixpost (2026): Open-Source Self-Hosted Alternative",
  description:
    `Compare Hookpost and Mixpost: ${CHANNEL_COUNT} social networks, modern Node.js/Temporal stack vs PHP/Laravel, native Claude MCP server, and Razorpay UPI billing.`,
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
      `Compare Hookpost vs Mixpost: ${CHANNEL_COUNT} social platforms, Node.js + Temporal event-driven architecture, native MCP server for Claude and Cursor, and cloud + Docker self-hosting.`,
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
    description: `Compare Hookpost vs Mixpost. ${CHANNEL_COUNT} social networks, MCP server for AI agents, and event-driven temporal scheduling.`,
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function MixpostAlternativePage() {
  const comparisonData = [
    {
      feature: "Supported Social Networks",
      hookpost: "18+ Networks (Instagram, YouTube, TikTok, X, LinkedIn, Threads, Bluesky, Pinterest, Discord, Telegram...)",
      mixpost: "8 Networks (Facebook, Instagram, X, LinkedIn, YouTube, Pinterest, Mastodon, Threads)",
      winner: "Hookpost",
    },
    {
      feature: "Architecture & Stack",
      hookpost: "Modern TypeScript (Next.js 16 + NestJS + Temporal.io + Redis)",
      mixpost: "PHP / Laravel + Horizon Queue Worker",
      winner: "Hookpost",
    },
    {
      feature: "AI Agent & MCP Integration",
      hookpost: "✅ Official Model Context Protocol (MCP) server for Claude Desktop, Claude Code, Cursor & Windsurf",
      mixpost: "❌ No MCP Server (Web dashboard only)",
      winner: "Hookpost",
    },
    {
      feature: "Deployment Options",
      hookpost: "✅ Managed Cloud SaaS + 1-Click Docker Self-Hosting",
      mixpost: "⚠️ Self-Hosted Server Only (Requires managing PHP, Composer, MySQL, Nginx)",
      winner: "Hookpost",
    },
    {
      feature: "Video & Reels Auto-Publishing",
      hookpost: "✅ Direct API auto-publishing for Reels, Shorts, and TikTok with thumbnail selection",
      mixpost: "✅ Video publishing on supported networks",
      winner: "Tie",
    },
    {
      feature: "Payment Methods & Regional Access",
      hookpost: "✅ Global Cards + Native Indian UPI (Google Pay, PhonePe, Paytm, NetBanking) via Razorpay",
      mixpost: "❌ No built-in billing in core (Requires purchasing commercial Mixpost Pro license)",
      winner: "Hookpost",
    },
    {
      feature: "Team & Workspace Isolation",
      hookpost: "✅ Unlimited Isolated Workspaces, Client Roles & Granular Permissions",
      mixpost: "⚠️ Workspaces require paid Mixpost Pro license",
      winner: "Hookpost",
    },
    {
      feature: "Free Starter Tier",
      hookpost: "✅ Free Forever Cloud Tier (2 channels, 30 posts/month, no credit card required)",
      mixpost: "⚠️ Free Lite version is self-hosted only with limited channels",
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
      q: "What is the main difference between Hookpost and Mixpost?",
      a: "While both Hookpost and Mixpost offer open-source social media management, Hookpost is built on modern TypeScript (Next.js 16, NestJS, and Temporal.io for bulletproof job scheduling) and features a native Model Context Protocol (MCP) server that lets you schedule posts directly from Claude Code, Cursor, and AI agents. Hookpost also offers both a zero-maintenance cloud SaaS and Docker self-hosting, whereas Mixpost is a self-hosted PHP/Laravel application.",
    },
    {
      q: "Can I self-host Hookpost like Mixpost?",
      a: "Yes. Hookpost provides production-ready Docker Compose configurations that allow developers, agencies, and enterprises to self-host the entire stack (PostgreSQL, Redis, Temporal, NestJS backend, and Next.js frontend) on their own VPS or cloud infrastructure with complete data sovereignty.",
    },
    {
      q: "Does Hookpost support more networks than Mixpost?",
      a: "Yes. Hookpost supports 18+ platforms including Instagram (Feed, Reels, Stories), YouTube (Videos & Shorts), TikTok, LinkedIn (Profiles & Pages), X (Twitter), Facebook, Threads, Pinterest, Bluesky, Mastodon, Reddit, Telegram, Discord, and decentralized channels like Nostr and Lemmy.",
    },
    {
      q: "How does pricing compare between Hookpost and Mixpost?",
      a: "Hookpost offers a free cloud tier (2 channels, 30 posts/mo) and transparent flat plans starting at ₹699/month with Razorpay (UPI, NetBanking, Cards) and zero per-channel fees. Mixpost operates on a split model: an open-source Lite version with limited features, and a commercial Pro license ($149-$299/year) that requires your own server hosting costs.",
    },
    {
      q: "Does Hookpost have an AI scheduler or MCP server?",
      a: "Yes. Hookpost is the world's first social media management platform with a native Model Context Protocol (MCP) server. You can install it with 'npx hookpost' or integrate it directly into Claude Desktop, Claude Code, Cursor, and Windsurf to draft, review, and schedule social media campaigns through natural language.",
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
      </section>

      {/* Deep Dive Pillars */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-white">Event-Driven Temporal Engine</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Mixpost uses traditional PHP/Laravel cron queue workers that can drop posts if a worker crashes. Hookpost runs on Temporal.io, guaranteeing distributed state execution, auto-retries, and resilient publishing workflows.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-white">Native Model Context Protocol (MCP)</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Connect Hookpost directly to Claude Desktop, Cursor, or your autonomous AI marketing agents. Schedule, edit, and orchestrate campaigns directly from your terminal or AI IDE via standard MCP tools.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3 text-white">Transparent Flat Pricing & UPI</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              No commercial license lock-in. Hookpost offers a free forever cloud plan, plus flat plans with Razorpay UPI (Google Pay, PhonePe, Paytm) and international credit cards. No per-channel penalties.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 sm:px-12 max-w-4xl mx-auto py-16">
        <SectionFaq items={faqItems} title="Frequently Asked Questions: Hookpost vs Mixpost" />
      </section>

      {/* Final Call to Action */}
      <section className="px-6 sm:px-12 max-w-5xl mx-auto py-20 text-center">
        <div className="p-12 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Switch to the Smartest Open-Source Social Scheduler
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Start scheduling across 18+ networks with visual calendar queues, AI-assisted hooks, and full developer API access.
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
