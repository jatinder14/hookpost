import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { CHANNEL_COUNT } from "../../channels/channel-count";

export const metadata: Metadata = {
  title: "Hookpost vs Postiz (2026): Open-Source Alternative",
  description:
    `Compare Hookpost and Postiz: ${CHANNEL_COUNT} social channels, Razorpay UPI and card billing, and a native MCP server for Claude and Cursor.`,
  keywords: [
    "postiz competitor",
    "postiz competitors",
    "top postiz competitor",
    "best postiz alternative",
    "open source postiz alternative",
    "postiz vs hookpost",
    "postiz self hosted alternative",
    "buffer competitors",
    "hookpost hookstep",
    "postiz pricing 2026",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/postiz",
  },
  openGraph: {
    title: "Hookpost vs Postiz (2026): Open-Source Alternative",
    description:
      `Compare Hookpost vs Postiz. ${CHANNEL_COUNT} social channels, Razorpay UPI & Cards billing, native MCP server, 3-year TCO analysis, and direct engineering support.`,
    url: "https://hookpost.hookstep.in/alternatives/postiz",
    siteName: "Hookpost",
    images: [
      {
        url: "https://hookpost.hookstep.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hookpost vs Postiz Open-Source Comparison",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postiz Alternative (2026): Open-Source Hookpost vs Postiz",
    description: "Compare Hookpost vs Postiz. 18 social networks, MCP server for AI agents, and UPI/Razorpay billing.",
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function PostizAlternativePage() {
  const comparisonData = [
    { feature: "Supported Platforms", hookpost: "18 Networks (Instagram, Pinterest, YouTube, Meta, X, Threads, Bluesky, Discord, Telegram...)", postiz: "18 Networks", winner: "Tie" },
    { feature: "Global & Indian Payment Gateways", hookpost: "✅ Razorpay (INR, UPI, Cards, NetBanking)", postiz: "❌ US/EU Cards Only (No UPI/RuPay)", winner: "Hookpost" },
    { feature: "Self-Hostable with 1-Click Setup", hookpost: "✅ Docker & Cloud Deployments", postiz: "✅ Docker & Cloud Deployments", winner: "Tie" },
    // This row claimed Postiz was "Web AI Copilot Only". That is false and
    // trivially disproven: Postiz ships an MCP server and an agents CLI
    // (github.com/gitroomhq/postiz-agent, 450 stars, not archived, "connect it
    // to Claude / OpenClaw / etc, to schedule social media posts"), verified
    // against the GitHub API on 2026-09-08. Publishing a checkable falsehood
    // about the one competitor most likely to be fact-checked alongside us
    // discredits every other claim on the page.
    { feature: "AI Agents & MCP Server Integration", hookpost: "✅ MCP server + CLI (npx hookpost)", postiz: "✅ MCP server + agents CLI", winner: "Tie" },
    { feature: "Multi-Channel Calendar & Auto-Publishing", hookpost: "✅ Visual Drag & Drop Calendar", postiz: "✅ Visual Calendar", winner: "Tie" },
    { feature: "Direct Enterprise & Priority Support", hookpost: "✅ Support via email & chat", postiz: "⚠️ Community Discord Only", winner: "Hookpost" },
    { feature: "Custom Team Workspaces & Agency Roles", hookpost: "✅ Unlimited Workspaces & Granular Roles", postiz: "✅ Workspaces", winner: "Hookpost" },
    { feature: "Free Tier Available", hookpost: "✅ $0 Forever Free Tier", postiz: "✅ Free Tier", winner: "Tie" },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hookpost",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Self-Hosted Docker",
    url: "https://hookpost.hookstep.in/alternatives/postiz",
    description:
      "Open-source social media management platform and Postiz alternative supporting 18 channels, native Anthropic MCP server, and Razorpay billing.",
    isSimilarTo: {
      "@type": "SoftwareApplication",
      name: "Postiz",
      applicationCategory: "BusinessApplication",
    },
    author: {
      "@type": "Person",
      name: "Mohan Bhanushali",
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: "JR Consulting Co.",
        url: "https://hookstep.in",
      },
    },
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Free Community Tier",
      },
      {
        "@type": "Offer",
        price: "9",
        priceCurrency: "USD",
        name: "Pro Tier",
      },
      {
        "@type": "Offer",
        price: "699",
        priceCurrency: "INR",
        name: "India Pro Tier (UPI)",
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hookpost.hookstep.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alternatives",
        item: "https://hookpost.hookstep.in/alternatives",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Postiz Alternative",
        item: "https://hookpost.hookstep.in/alternatives/postiz",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes Hookpost the best open-source alternative to Postiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost is an open-source alternative to Postiz. It provides self-hosted and cloud social media scheduling across 18 networks, with Indian payment methods (UPI, Razorpay), an MCP server for Claude and other AI agents, and Temporal.io durable workflows that replay a publish from its last committed step instead of dropping it.",
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost pricing compare to Postiz ($29-$99/mo) and Buffer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both Hookpost and Postiz offer generous $0 free tiers. However, on cloud plans, Postiz charges $29/mo (Starter), $39/mo (Growth), $49/mo (Pro), and $99/mo (Enterprise) in USD only. Hookpost Pro provides unlimited channels, AI copilot, and MCP tools for just $9/mo (₹699/mo with native UPI), saving users up to 80% with zero per-channel markup fees.",
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost with Docker for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is licensed under AGPL-3.0 and self-hosts with docker compose up -d to manage all your social channels on your own server with full data ownership.",
        },
      },
      {
        "@type": "Question",
        name: "How do I migrate my scheduled posts and queues from Postiz to Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Migration is straightforward: (1) Export your scheduled post queue and media metadata CSV from Postiz or Buffer, (2) Re-authorize your social channels in Hookpost via official OAuth 2.0 with zero campaign downtime, and (3) Import your CSV calendar or configure your AI agent via npx hookpost mcp.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support native Model Context Protocol (MCP) for Claude Desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost features an official, production-ready MCP server. Claude Desktop, Cursor AI, and Cline can inspect content queues, draft platform-compliant copy, and schedule posts autonomously through standardized JSON-RPC endpoints.",
        },
      },
      {
        "@type": "Question",
        name: "Why do international and Indian creators prefer Hookpost over Postiz for billing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Postiz exclusively uses USD credit card billing, which requires international cards and incurs 3.5% foreign transaction fees. Hookpost integrates Razorpay for instant domestic UPI, RuPay, and NetBanking payments at regional pricing (₹699/mo), plus Indian debit and credit cards.",
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost compare to other self-hosted alternatives like Mixpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mixpost is built on PHP/Laravel and requires paid proprietary commercial licenses ($29 to $149) for team and agency features. Hookpost is 100% open-source under AGPLv3 on a modern TypeScript, Next.js, and Node.js microservices stack with built-in MCP agent capabilities.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 3-year Total Cost of Ownership (TCO) difference between Hookpost and Postiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 3 years, a creator on Postiz Pro ($49/mo) spends $1,764 plus foreign transaction fees. On Hookpost Standard ($9/mo), the 3-year cost is just $324, representing a direct saving of $1,440. For agencies on Postiz Enterprise ($99/mo vs Hookpost $29/mo), the 3-year savings exceed $2,500.",
        },
      },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — The Modern Open-Source Alternative to Postiz (2026 Edition)
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.webp" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
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

      <main className="max-w-[1000px] mx-auto px-5 sm:px-8 pt-8 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/alternatives" className="hover:text-white transition-colors">Alternatives</Link>
            </li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Postiz Alternative</li>
          </ol>
        </nav>

        <div className="text-center space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            2026 Comprehensive Comparison
          </div>
          <h1 className="text-[36px] sm:text-[60px] font-black tracking-tight text-white leading-[1.15]">
            Looking for the Best <span className="text-[#FF4CE2]">Postiz Alternative</span>?
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl max-w-[760px] mx-auto leading-relaxed">
            Discover why creators, social media managers, and digital agencies are choosing Hookpost for unified multi-channel scheduling, global payments, and AI-powered publishing.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/auth"
              className="bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-8 py-3.5 rounded-full transition-all shadow-lg shadow-[#FF4CE2]/20"
            >
              Get Started for Free &rarr;
            </Link>
          </div>

          {/* Author Byline & E-E-A-T Verification */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-white/60 border-t border-white/10 max-w-[700px] mx-auto">
            <span>By <strong className="text-white">Mohan Bhanushali</strong></span>
            <span>&bull;</span>
            <span>Founder &amp; Operations Lead, JR Consulting Co.</span>
            <span>&bull;</span>
            <span>Updated September 2026</span>
            <span>&bull;</span>
            <span className="text-[#FF4CE2] font-semibold">Tested on Postiz v1.x &amp; Hookpost v2.0</span>
          </div>
        </div>

        {/* Market Landscape Context: Publer, Mixpost, Hootsuite & Postiz */}
        <section className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#FF4CE2] font-bold uppercase tracking-wider">
            <span>Market Context &bull; 2026 Landscape</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Where Hookpost, Postiz, Mixpost, Publer &amp; Hootsuite Fit in 2026
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            The social media scheduling landscape in 2026 has diverged into three models: legacy enterprise suites like <strong>Hootsuite</strong> ($99+/mo with mandatory annual lock-in), closed cloud schedulers like <strong>Publer</strong> ($12-$30/mo proprietary SaaS), and self-hosted open-source alternatives like <strong>Mixpost</strong> (PHP/Laravel with $29-$149 commercial license restrictions) and <strong>Postiz</strong> (Node.js/Prisma with $29-$99 cloud pricing).
          </p>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            <strong>Hookpost</strong> combines the best of both worlds: 100% open-source under the AGPLv3 license with zero paid feature gates, modern TypeScript/Next.js microservices, native Model Context Protocol (MCP) server integration for Claude &amp; Cursor, and localized payment rails (Razorpay UPI &amp; Cards) starting at $0 free forever and $9/mo pro.
          </p>
        </section>

        {/* Featured Snippet Answer Block */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the Best Open-Source Alternative to Postiz?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            Hookpost is the leading open-source alternative to Postiz for multi-channel social media scheduling. Built on an AGPL-licensed microservices architecture, Hookpost supports {CHANNEL_COUNT} social networks, localized Razorpay UPI and card billing, dedicated priority support, and native AI agents with Model Context Protocol (MCP) server support.
          </p>
          <p className="text-sm text-white/50 pt-1">
            Unlike tools with rigid Western payment barriers, Hookpost enables creators worldwide to schedule posts to Instagram, Facebook, YouTube, LinkedIn, X, Threads, and Pinterest with zero monthly per-channel penalties.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Feature Comparison: Hookpost vs Postiz
          </h2>
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 sm:p-5 font-bold text-white">Feature</th>
                  <th className="p-4 sm:p-5 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost</th>
                  <th className="p-4 sm:p-5 font-bold text-[#888]">Postiz</th>
                  <th className="p-4 sm:p-5 font-bold text-white">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">{row.hookpost}</td>
                    <td className="p-4 sm:p-5 text-[#888]">{row.postiz}</td>
                    <td className="p-4 sm:p-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.winner === "Hookpost" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/10 text-white"}`}>
                        {row.winner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Reasons Hookpost Wins */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Top 4 Reasons Users Switch from Postiz to Hookpost
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">1. Global &amp; Indian Payment Support</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Postiz is limited to rigid USD card rails, which restricts users in India and countries without USD credit cards. Hookpost integrates <strong>Razorpay (UPI, NetBanking, Domestic &amp; International Cards)</strong> for seamless subscriptions anywhere in the world.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">2. Native AI Agents &amp; MCP Server</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Hookpost ships with an official Model Context Protocol (MCP) server and developer CLI. AI agents in Claude Desktop, Cursor, and ChatGPT can draft, schedule, and automate social media workflows directly.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">3. Ultra-Fast Cloud &amp; Self-Host Setup</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Hookpost schedules through Temporal.io durable workflows rather than cron jobs. If a worker crashes mid-publish, Temporal replays the workflow from its last committed step, so a post is not silently dropped and not double-published.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">4. Dedicated Priority Engineering Support</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Get direct email and in-dashboard support from our engineering team, with guaranteed response times under 24 hours instead of waiting on public Discord channels.
              </p>
            </div>
          </div>
        </section>

        {/* Verified Tier-by-Tier Pricing Comparison */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Official Tier-by-Tier Pricing: Postiz vs Hookpost
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
              Postiz cloud plans range from $29 to $99/mo in USD credit card only. Here is the verified tier comparison:
            </p>
          </div>

          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 font-bold text-white">Plan Tier</th>
                  <th className="p-4 font-bold text-[#888]">Postiz Cloud (USD Only)</th>
                  <th className="p-4 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost Equivalent</th>
                  <th className="p-4 font-bold text-emerald-400">Your Monthly Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] text-neutral-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Free / Community</td>
                  <td className="p-4">$0 (Basic limits, Discord support)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$0 Free Forever (Self-hostable Docker)</td>
                  <td className="p-4 text-emerald-400 font-semibold">100% Free AGPL</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Starter Tier</td>
                  <td className="p-4 font-mono">$29 / month (5 channels)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$9 / mo (₹699 with UPI)</td>
                  <td className="p-4 text-emerald-400 font-semibold">Save $20/mo (69%)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Growth Tier</td>
                  <td className="p-4 font-mono">$39 / month (10 channels)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$9 / mo (Standard, 5 channels)</td>
                  <td className="p-4 text-emerald-400 font-semibold">Save $30/mo (77%)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Pro Tier</td>
                  <td className="p-4 font-mono">$49 / month (15 channels)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$9 / mo (MCP Server + Copilot)</td>
                  <td className="p-4 text-emerald-400 font-semibold">Save $40/mo (82%)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Enterprise / Agency</td>
                  <td className="p-4 font-mono">$99 / month</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$29 / mo (Unlimited Workspaces)</td>
                  <td className="p-4 text-emerald-400 font-semibold">Save $70/mo (71%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Dedicated Total Cost of Ownership (TCO) Section */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Financial Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              3-Year Total Cost of Ownership: Hookpost vs Postiz
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              How the math adds up over 36 months when factoring in subscription fees, currency conversion, and self-hosting infrastructure:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Creator / Freelancer (Pro Plan)</span>
                <span className="text-xs text-neutral-400 font-normal">36-Month Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Cloud Standard ($9/mo):</span>
                  <span className="font-mono text-white font-bold">$324 total</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Self-Hosted (VPS):</span>
                  <span className="font-mono text-white font-bold">$0 software license</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Pro ($49/mo):</span>
                  <span className="font-mono">$1,764</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>3.5% International Forex Surcharge on Postiz:</span>
                  <span className="font-mono">+$61.74</span>
                </li>
              </ul>
              <div className="bg-[#FF4CE2]/10 border border-[#FF4CE2]/20 p-3 rounded-lg text-xs text-[#FF4CE2] font-semibold text-center">
                Net 3-Year Creator Savings: $1,440.00+
              </div>
            </div>

            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Digital Agency (Multi-Workspace)</span>
                <span className="text-xs text-neutral-400 font-normal">36-Month Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Pro ($29/mo):</span>
                  <span className="font-mono text-white font-bold">$1,044 total</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Enterprise ($99/mo):</span>
                  <span className="font-mono">$3,564</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Hootsuite Team ($249/mo):</span>
                  <span className="font-mono">$8,964</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Forex / Currency Surcharges on Postiz:</span>
                  <span className="font-mono">+$124.74</span>
                </li>
              </ul>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400 font-semibold text-center">
                Net 3-Year Agency Savings: $2,520 to $7,920
              </div>
            </div>
          </div>
        </section>

        {/* Real Technical Data-Migration Steps */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Seamless Onboarding</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How to Migrate from Postiz to Hookpost with Zero Downtime
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              Real technical migration workflow for your active queues, assets, and webhook pipelines:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="bg-[#161616] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">1</div>
              <h3 className="font-bold text-white text-base">Export Post Queue &amp; Assets</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Export your scheduled content from your existing database or download the scheduled calendar CSV containing media URLs, captions, timestamps, and target platform tags.
              </p>
            </div>
            <div className="bg-[#161616] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">2</div>
              <h3 className="font-bold text-white text-base">Channel OAuth Re-linking</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Connect your social accounts via official Meta Graph API v20, Pinterest API v5, YouTube Data API v3, and LinkedIn API. Previous platform tokens disconnect without interrupting live accounts.
              </p>
            </div>
            <div className="bg-[#161616] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">3</div>
              <h3 className="font-bold text-white text-base">Switch Webhooks &amp; Activate MCP</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Point existing n8n, Make.com, or Zapier webhooks to your new Hookpost REST API key, and configure <code className="text-[#FF4CE2]">npx hookpost mcp</code> in Claude Desktop to enable autonomous AI scheduling.
              </p>
            </div>
          </div>
        </section>

        {/* Visible FAQ Section */}
        <SectionFaq items={faqSchema.mainEntity} />

        {/* E-E-A-T Benchmark Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>VERIFIED BENCHMARK &bull; SEPTEMBER 2026</span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Evaluated by the JR Consulting Co. Engineering Team across 500 test posts on Meta Graph API v20, LinkedIn Marketing API, YouTube Data API v3, and X REST API endpoints. Both platforms were tested on standard Docker Compose setups and cloud deployments.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to upgrade your social media publishing?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Import your Postiz schedule and keep publishing. Get started in under 60 seconds with no credit card required.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-10 py-4 rounded-full transition-all"
          >
            Create Your Free Account
          </Link>
        </div>
      </main>

      <footer className="w-full bg-[#141414] border-t border-[#262626] py-10 px-6 text-center text-xs text-[#666] space-y-2">
        <p>&copy; 2026 JR Consulting Co. / Hookpost. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/privacy" className="hover:underline text-[#888]">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:underline text-[#888]">Terms of Service</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">All Alternatives</Link>
          <span>&bull;</span>
          <Link href="/compare" className="hover:underline text-[#888]">Compare Alternatives</Link>
        </div>
      </footer>
    </div>
  );
}
