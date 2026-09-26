import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { IndiaCostNote } from "../IndiaCostNote";
import { PUBLISHABLE_CHANNEL_COUNT } from "../../channels/channel-count";
import { pricingINR, pricingUSD } from "@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing";

const FREE = pricingINR.FREE;
const STD_USD = pricingUSD.STANDARD;
const STD_INR = pricingINR.STANDARD;
const PRO_USD = pricingUSD.PRO;
const PRO_INR = pricingINR.PRO;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// Postiz hosted pricing, checked 26 Sep 2026 at postiz.com/pricing: no free
// hosted plan (7-day trial); Standard $29/mo or $23/mo billed yearly for 5
// channels; Team $39/mo or $31/mo billed yearly, adds unlimited team members.
// Every plan includes its hosted MCP server, CLI and public API. The free
// route is self-hosting the AGPL-3.0 code (github.com/gitroomhq/postiz-app,
// ~36k stars). Hookpost is built on that code. Other Postiz tiers are not
// quoted here because they were not verified.
const POSTIZ_STD_MONTHLY = 29;
const POSTIZ_STD_YEARLY = 23;
const POSTIZ_TEAM_MONTHLY = 39;
const POSTIZ_TEAM_YEARLY = 31;
// Hootsuite Standard, $99/user/mo billed annually (hootsuite.com/plans, same day).
const HOOTSUITE_STD = 99;
const MONTHS = 36;
const STD_SAVE_MONTHLY = POSTIZ_STD_MONTHLY - STD_USD.month_price;
const STD_SAVE_YEARLY = POSTIZ_STD_YEARLY - STD_USD.month_price;
const STD_SAVE_MONTHLY_PCT = Math.round((STD_SAVE_MONTHLY / POSTIZ_STD_MONTHLY) * 100);
const STD_SAVE_YEARLY_PCT = Math.round((STD_SAVE_YEARLY / POSTIZ_STD_YEARLY) * 100);
const TCO_HOOKPOST_STD = STD_USD.month_price * MONTHS;
const TCO_POSTIZ_STD_MONTHLY = POSTIZ_STD_MONTHLY * MONTHS;
const TCO_POSTIZ_STD_YEARLY = POSTIZ_STD_YEARLY * MONTHS;
const TCO_HOOKPOST_PRO = PRO_USD.month_price * MONTHS;
const TCO_POSTIZ_TEAM_MONTHLY = POSTIZ_TEAM_MONTHLY * MONTHS;
const TCO_POSTIZ_TEAM_YEARLY = POSTIZ_TEAM_YEARLY * MONTHS;
const TCO_HOOTSUITE_STD = HOOTSUITE_STD * MONTHS;

export const metadata: Metadata = {
  title: "Hookpost vs Postiz (2026): Open-Source Alternative",
  description:
    `Compare Hookpost and Postiz: Hookpost is built on Postiz and adds rupee billing (Razorpay UPI and cards) and a hosted free plan. Prices checked 26 September 2026.`,
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
      `Compare Hookpost vs Postiz. Publishing to ${PUBLISHABLE_CHANNEL_COUNT} networks, Razorpay UPI & card billing, a hosted free plan, and a 3-year cost comparison.`,
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
    description: `Compare Hookpost vs Postiz. Publishing to ${PUBLISHABLE_CHANNEL_COUNT} networks, a hosted free plan, and UPI/Razorpay billing.`,
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function PostizAlternativePage() {
  const comparisonData = [
    { feature: "Supported Platforms", hookpost: `${PUBLISHABLE_CHANNEL_COUNT} publishing today (X, LinkedIn, YouTube, Bluesky, Discord, Telegram...); Instagram, Facebook & Threads await Meta approval`, postiz: "30 listed, incl. Instagram, Facebook, TikTok, Reddit, Pinterest", winner: "Postiz" },
    { feature: "Global & Indian Payment Gateways", hookpost: "✅ Razorpay (INR, UPI, Cards, NetBanking)", postiz: "❌ USD pricing; no INR or UPI listed", winner: "Hookpost" },
    { feature: "Open Source & Self-Hostable", hookpost: "✅ AGPL-3.0, built on Postiz", postiz: "✅ AGPL-3.0, ~36k GitHub stars", winner: "Tie" },
    // This row claimed Postiz was "Web AI Copilot Only". That is false and
    // trivially disproven: Postiz ships an MCP server and an agents CLI
    // (github.com/gitroomhq/postiz-agent, 450 stars, not archived, "connect it
    // to Claude / OpenClaw / etc, to schedule social media posts"), verified
    // against the GitHub API on 2026-09-08, and postiz.com/pricing (26 Sep 2026)
    // says every plan includes the hosted MCP server. Publishing a checkable falsehood
    // about the one competitor most likely to be fact-checked alongside us
    // discredits every other claim on the page.
    { feature: "AI Agents & MCP Server Integration", hookpost: "✅ MCP server + CLI (npx hookpost)", postiz: "✅ Hosted MCP server + CLI on every plan", winner: "Tie" },
    { feature: "Multi-Channel Calendar & Auto-Publishing", hookpost: "✅ Visual Drag & Drop Calendar", postiz: "✅ Visual Calendar", winner: "Tie" },
    { feature: "Team Members", hookpost: `On Pro, ${usd(PRO_USD.month_price)}/mo (${inr(PRO_INR.month_price)})`, postiz: `Unlimited on Team, ${usd(POSTIZ_TEAM_MONTHLY)}/mo or ${usd(POSTIZ_TEAM_YEARLY)}/mo billed yearly`, winner: "Postiz" },
    { feature: "Hosted Free Plan", hookpost: `✅ ${FREE.channel} channels, ${FREE.posts_per_month} posts/month, no AI`, postiz: "❌ None on the hosted service (7-day trial); self-hosting is free", winner: "Hookpost" },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hookpost",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Self-Hosted Docker",
    url: "https://hookpost.hookstep.in/alternatives/postiz",
    description:
      `Open-source social media scheduler built on Postiz, publishing to ${PUBLISHABLE_CHANNEL_COUNT} networks, with an MCP server and Razorpay billing in INR.`,
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
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: String(STD_USD.month_price), priceCurrency: "USD", name: "Standard" },
      { "@type": "Offer", price: String(STD_INR.month_price), priceCurrency: "INR", name: "Standard (India, UPI)" },
      { "@type": "Offer", price: String(PRO_USD.month_price), priceCurrency: "USD", name: "Pro" },
      { "@type": "Offer", price: String(PRO_INR.month_price), priceCurrency: "INR", name: "Pro (India, UPI)" },
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
          text: `Hookpost is built on Postiz's open-source (AGPL-3.0) code, so scheduling works much the same way and both ship an MCP server for Claude and other AI agents. The differences are billing and the entry price: Hookpost bills in INR through Razorpay (UPI, NetBanking, Indian cards), has a hosted free plan (${FREE.channel} channels, ${FREE.posts_per_month} posts a month), and Standard is ${inr(STD_INR.month_price)} ($${STD_USD.month_price}) a month for ${STD_USD.channel} channels. Postiz's hosted service has no free plan (7-day trial), and its Standard plan is $${POSTIZ_STD_MONTHLY}/month, or $${POSTIZ_STD_YEARLY}/month billed yearly, for 5 channels. Hookpost publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks today; Postiz lists more, including Instagram, Facebook and TikTok.`,
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost pricing compare to Postiz and Buffer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Postiz's hosted service has no free plan; Standard is $${POSTIZ_STD_MONTHLY}/month ($${POSTIZ_STD_YEARLY} billed yearly) for 5 channels and Team is $${POSTIZ_TEAM_MONTHLY}/month ($${POSTIZ_TEAM_YEARLY} billed yearly) with unlimited team members, priced in USD. Hookpost has a free plan (${FREE.channel} channels), Standard at $${STD_USD.month_price}/month (${inr(STD_INR.month_price)} with UPI) for ${STD_USD.channel} channels with AI and API access, and Pro at $${PRO_USD.month_price}/month (${inr(PRO_INR.month_price)}) for ${PRO_USD.channel} channels with team members. Buffer charges $5 per channel per month billed yearly ($6 month-to-month) and has a free plan with 3 channels. Competitor prices checked 26 September 2026.`,
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost with Docker for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is licensed under AGPL-3.0 and self-hosts with docker compose up -d to manage all your social channels on your own server with full data ownership. Postiz, which Hookpost is built on, is AGPL-3.0 too and self-hosts the same way.",
        },
      },
      {
        "@type": "Question",
        name: "How do I migrate my scheduled posts and queues from Postiz to Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Migration takes three steps: (1) Re-connect your channels in Hookpost - OAuth for most networks, your own credentials for a few such as Bluesky, (2) recreate your scheduled queue in the Hookpost calendar or push it through the public API on Standard and Pro, and (3) point your AI agent at Hookpost via npx hookpost mcp.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support native Model Context Protocol (MCP) for Claude Desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost features an official, production-ready MCP server. Claude Desktop, Cursor AI, and Cline can inspect content queues, draft platform-compliant copy, and schedule posts autonomously through standardized JSON-RPC endpoints. Postiz also includes a hosted MCP server on every plan.",
        },
      },
      {
        "@type": "Question",
        name: "Why do international and Indian creators prefer Hookpost over Postiz for billing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Postiz prices its hosted plans in USD and lists no INR or UPI option, so Indian buyers pay with an internationally enabled card. Hookpost integrates Razorpay for domestic UPI, RuPay, and NetBanking payments at regional pricing (${inr(STD_INR.month_price)}/mo), plus Indian debit and credit cards.`,
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost compare to other self-hosted alternatives like Mixpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mixpost Lite is free and MIT-licensed but supports only Facebook Pages, X and Mastodon; Mixpost Pro is a $299 one-time licence per domain (Enterprise $1,199) and ships an MCP server. Hookpost is open source under AGPL-3.0 on a TypeScript, Next.js and Node.js stack, with its own MCP server. Mixpost pricing checked 26 September 2026 at mixpost.app/pricing.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 3-year Total Cost of Ownership (TCO) difference between Hookpost and Postiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `For 5 channels over 36 months, Postiz Standard costs ${usd(TCO_POSTIZ_STD_MONTHLY)} month-to-month or ${usd(TCO_POSTIZ_STD_YEARLY)} billed yearly. Hookpost Standard at $${STD_USD.month_price}/month costs ${usd(TCO_HOOKPOST_STD)}, a saving of ${usd(TCO_POSTIZ_STD_YEARLY - TCO_HOOKPOST_STD)} to ${usd(TCO_POSTIZ_STD_MONTHLY - TCO_HOOKPOST_STD)}. For teams, Hookpost Pro ($${PRO_USD.month_price}/month, ${usd(TCO_HOOKPOST_PRO)} over 36 months) costs the same as Postiz Team month-to-month; Postiz Team billed yearly (${usd(TCO_POSTIZ_TEAM_YEARLY)}) is cheaper. Self-hosting either one carries no licence fee.`,
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
            <span className="text-[#FF4CE2] font-semibold">Prices checked 26 September 2026</span>
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
            The social media scheduling market in 2026 splits three ways: per-seat suites like <strong>Hootsuite</strong> ($99 per user per month billed annually), cloud schedulers like <strong>Publer</strong> (from $4 per channel per month billed yearly, with a free plan), and self-hostable tools like <strong>Mixpost</strong> (free MIT Lite edition; Pro is a $299 one-time licence) and <strong>Postiz</strong> (AGPL-3.0; hosted plans from $23/mo billed yearly). Prices checked 26 September 2026.
          </p>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            <strong>Hookpost</strong> is built on Postiz's AGPL-3.0 code. It adds rupee billing through Razorpay (UPI &amp; cards), a hosted free plan ({FREE.channel} channels, {FREE.posts_per_month} posts a month), and paid plans from {inr(STD_INR.month_price)} / ${STD_USD.month_price} a month. Like Postiz, it ships an MCP server for Claude &amp; Cursor.
          </p>
        </section>

        {/* Featured Snippet Answer Block */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the Best Open-Source Alternative to Postiz?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            Hookpost is built on Postiz's open-source (AGPL-3.0) code, so the two share their scheduling engine and both ship an MCP server. Hookpost adds Razorpay UPI and card billing in rupees and a hosted free plan, and publishes to {PUBLISHABLE_CHANNEL_COUNT} networks today.
          </p>
          <p className="text-sm text-white/50 pt-1">
            Hookpost publishes to X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram, WordPress, Hashnode, Dev.to, Lemmy, Nostr and Listmonk. Instagram, Facebook and Threads are waiting on Meta approval, so Postiz is the better fit today if those are your main channels.
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
            Where Hookpost Differs from Postiz
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">1. Global &amp; Indian Payment Support</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Postiz prices its hosted plans in USD and lists no INR or UPI option. Hookpost bills Indian customers in rupees through <strong>Razorpay (UPI, NetBanking, Indian cards)</strong>, and international customers in USD.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">2. A Hosted Free Plan</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Postiz's hosted service has no free plan, only a 7-day trial; its free route is self-hosting. Hookpost's hosted free plan keeps {FREE.channel} channels and {FREE.posts_per_month} posts a month free. Both ship an MCP server and CLI for AI agents.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">3. Lower Entry Price</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Hookpost Standard is {inr(STD_INR.month_price)} (${STD_USD.month_price}) a month for {STD_USD.channel} channels. Postiz Standard is ${POSTIZ_STD_MONTHLY} a month, or ${POSTIZ_STD_YEARLY} billed yearly, for 5 channels. At team size the gap closes: Hookpost Pro and Postiz Team are both ${PRO_USD.month_price} a month.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 space-y-3">
              <h3 className="text-lg font-bold text-[#FF4CE2]">4. Direct Support</h3>
              <p className="text-sm text-[#bbb] leading-relaxed">
                Get direct email and in-dashboard support from the team that runs Hookpost.
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
              Postiz's hosted plans are priced in USD. Standard and Team below were read from postiz.com/pricing on 26 September 2026:
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
                  <td className="p-4 font-semibold text-white">Free / Trial</td>
                  <td className="p-4">No hosted free plan (7-day trial); self-hosting the AGPL code is free</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">Free: {FREE.channel} channels, {FREE.posts_per_month} posts/month (also self-hostable)</td>
                  <td className="p-4 text-emerald-400 font-semibold">Hosted free plan</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Standard</td>
                  <td className="p-4 font-mono">${POSTIZ_STD_MONTHLY} / month, or ${POSTIZ_STD_YEARLY} billed yearly (5 channels)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">${STD_USD.month_price}/mo ({inr(STD_INR.month_price)} with UPI), {STD_USD.channel} channels</td>
                  <td className="p-4 text-emerald-400 font-semibold">Save ${STD_SAVE_MONTHLY}/mo ({STD_SAVE_MONTHLY_PCT}%) vs monthly, ${STD_SAVE_YEARLY}/mo ({STD_SAVE_YEARLY_PCT}%) vs yearly</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Team</td>
                  <td className="p-4 font-mono">${POSTIZ_TEAM_MONTHLY} / month, or ${POSTIZ_TEAM_YEARLY} billed yearly (unlimited team members)</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">${PRO_USD.month_price}/mo Pro ({inr(PRO_INR.month_price)} with UPI), {PRO_USD.channel} channels, team members</td>
                  <td className="p-4 text-emerald-400 font-semibold">Same monthly price; Postiz is cheaper billed yearly</td>
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
              Subscription fees over 36 months, at the list prices above:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Creator / Freelancer (5 Channels)</span>
                <span className="text-xs text-neutral-400 font-normal">36-Month Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Cloud Standard (${STD_USD.month_price}/mo):</span>
                  <span className="font-mono text-white font-bold">{usd(TCO_HOOKPOST_STD)} total</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost or Postiz Self-Hosted (VPS):</span>
                  <span className="font-mono text-white font-bold">$0 software license</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Standard (${POSTIZ_STD_MONTHLY}/mo month-to-month):</span>
                  <span className="font-mono">{usd(TCO_POSTIZ_STD_MONTHLY)}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Standard (${POSTIZ_STD_YEARLY}/mo billed yearly):</span>
                  <span className="font-mono">{usd(TCO_POSTIZ_STD_YEARLY)}</span>
                </li>
              </ul>
              <div className="bg-[#FF4CE2]/10 border border-[#FF4CE2]/20 p-3 rounded-lg text-xs text-[#FF4CE2] font-semibold text-center">
                3-Year Creator Savings: {usd(TCO_POSTIZ_STD_YEARLY - TCO_HOOKPOST_STD)} to {usd(TCO_POSTIZ_STD_MONTHLY - TCO_HOOKPOST_STD)}
              </div>
            </div>

            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Team (Multiple Members)</span>
                <span className="text-xs text-neutral-400 font-normal">36-Month Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Pro (${PRO_USD.month_price}/mo, {PRO_USD.channel} channels):</span>
                  <span className="font-mono text-white font-bold">{usd(TCO_HOOKPOST_PRO)} total</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Team (${POSTIZ_TEAM_MONTHLY}/mo month-to-month):</span>
                  <span className="font-mono">{usd(TCO_POSTIZ_TEAM_MONTHLY)}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Postiz Team (${POSTIZ_TEAM_YEARLY}/mo billed yearly):</span>
                  <span className="font-mono">{usd(TCO_POSTIZ_TEAM_YEARLY)}</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-white/5 text-neutral-400">
                  <span>Hootsuite Standard (${HOOTSUITE_STD}/user/mo, billed annually):</span>
                  <span className="font-mono">{usd(TCO_HOOTSUITE_STD)} per user</span>
                </li>
              </ul>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400 font-semibold text-center">
                Hookpost Pro and Postiz Team cost about the same; both are far below Hootsuite
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
                Copy your scheduled content out of Postiz - from its database if you self-host, or from the calendar - including media URLs, captions, timestamps and target channels.
              </p>
            </div>
            <div className="bg-[#161616] border border-white/5 rounded-xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">2</div>
              <h3 className="font-bold text-white text-base">Channel OAuth Re-linking</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Connect your accounts in Hookpost - OAuth for X, LinkedIn, YouTube and most others, your own credentials for a few such as Bluesky. Instagram, Facebook and Threads are waiting on Meta approval.
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
        <IndiaCostNote slug="postiz" />

        <SectionFaq items={faqSchema.mainEntity} />

        {/* E-E-A-T Benchmark Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>FACTS CHECKED &bull; 26 SEPTEMBER 2026</span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Postiz's prices and plans were read from postiz.com/pricing, and its licence and star count from the GitHub API, on 26 September 2026. Hookpost's figures come from its live pricing configuration.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to upgrade your social media publishing?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Connect your channels and keep publishing. Get started in under 60 seconds with no credit card required.
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
