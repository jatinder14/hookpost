import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../SectionFaq";

export const metadata: Metadata = {
  title: "Top Social Media Management Alternatives (2026) — Hookpost",
  description:
    "Open-source alternatives to Postiz, Buffer, Hootsuite, Later, Metricool, and Sprout Social - compared on features, pricing, and AI automation.",
  keywords: [
    "social media management alternatives",
    "postiz alternative",
    "buffer alternative",
    "hootsuite alternative",
    "later alternative",
    "metricool alternative",
    "sprout social alternative",
    "open source social media scheduler",
    "hookpost alternatives",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives",
  },
  openGraph: {
    title: "Top Social Media Management Alternatives (2026) — Hookpost",
    description:
      "Explore the top open-source and modern alternatives to Postiz, Buffer, Hootsuite, Later, Metricool, and Sprout Social. Compare features, pricing, and AI automation.",
    url: "https://hookpost.hookstep.in/alternatives",
    siteName: "Hookpost",
    images: [
      {
        url: "https://hookpost.hookstep.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hookpost Social Media Scheduler Alternatives",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Social Media Management Alternatives (2026) — Hookpost",
    description: "Compare features, pricing, and AI automation against Postiz, Buffer, Hootsuite, Later, and Metricool.",
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

const ALTERNATIVES = [
  {
    slug: "postiz",
    name: "Postiz",
    tagline: "Leading open-source social media management app",
    hookpostAdvantage: "Direct Razorpay UPI + Indian card billing, priority support, and built-in AI agents.",
    priceDiff: "Same $0 starter tier; Hookpost includes localized regional currency billing.",
    badge: "Open-Source Alternative",
  },
  {
    slug: "buffer",
    name: "Buffer",
    tagline: "Simple social media tools with per-channel pricing",
    hookpostAdvantage: "No per-channel price gouging ($6/channel adds up fast). Hookpost bundles unlimited channels.",
    priceDiff: "Save up to 80% with bundled multi-channel scheduling and AI generation.",
    badge: "Price Value Alternative",
  },
  {
    slug: "hootsuite",
    name: "Hootsuite",
    tagline: "Legacy enterprise social suite with $99/mo minimum",
    hookpostAdvantage: "Escape the $99/mo minimum fee. Hookpost gives you multi-network scheduling starting at $0.",
    priceDiff: "$0 vs $99/month minimum contract.",
    badge: "Cost-Saving Alternative",
  },
  {
    slug: "later",
    name: "Later",
    tagline: "Visual social planner focused on Instagram & Pinterest",
    hookpostAdvantage: "Full support for 18 networks including Instagram Reels, YouTube Shorts, Threads, X, and LinkedIn.",
    priceDiff: "Higher post limits, multi-account workspaces, and AI hook generator included.",
    badge: "Multi-Channel Alternative",
  },
  {
    slug: "metricool",
    name: "Metricool",
    tagline: "Social media planning & analytics dashboard",
    hookpostAdvantage: "100% open-source self-hostable with Docker, plus official Model Context Protocol (MCP) server.",
    priceDiff: "Free self-hosting forever with complete data privacy.",
    badge: "Open-Source Alternative",
  },
  {
    slug: "sprout-social",
    name: "Sprout Social",
    tagline: "High-end enterprise social media management",
    hookpostAdvantage: "No $199/user/month per-seat fees. Perfect for agile startups, creators, and lean digital agencies.",
    priceDiff: "$0 / $29 vs $199/user/month.",
    badge: "Agency Alternative",
  },
  {
    slug: "agorapulse",
    name: "Agorapulse",
    tagline: "Social media inbox and publishing tool",
    hookpostAdvantage: "Lightweight modern interface with AI agent copilot, n8n custom node, and Make.com integrations.",
    priceDiff: "Affordable flat-rate plans with zero mandatory annual lock-in.",
    badge: "Modern Workflow Alternative",
  },
  {
    slug: "publer",
    name: "Publer",
    tagline: "Virtual social media assistant and scheduler",
    hookpostAdvantage: "Native MCP server and developer CLI for AI coding assistants like Claude, Cursor, and ChatGPT.",
    priceDiff: "Free tier with robust AI generation and multi-platform automation.",
    badge: "Developer & AI Alternative",
  },
  {
    slug: "socialpilot",
    name: "SocialPilot",
    tagline: "Cost-effective social media scheduling for teams",
    hookpostAdvantage: "True self-hosted open-source architecture with full API access and localized INR pricing.",
    priceDiff: "Flexible monthly billing with Razorpay UPI and cards.",
    badge: "Team Alternative",
  },
  {
    slug: "mixpost",
    name: "Mixpost",
    tagline: "Self-hosted social media software for Laravel & PHP",
    hookpostAdvantage: "Modern TypeScript/Next.js/Node microservices stack with built-in MCP server, 18 networks, and native Razorpay UPI.",
    priceDiff: "$0 AGPL open-source vs $29-$149 closed self-hosted license.",
    badge: "Open-Source Alternative",
  },
  {
    slug: "planoly",
    name: "Planoly",
    tagline: "Visual social planner for visual creators",
    hookpostAdvantage: "Cross-posts visual reels and videos simultaneously across Meta, Threads, YouTube, and Pinterest.",
    priceDiff: "Flat pricing, unified analytics, and free tier.",
    badge: "Visual Alternative",
  },
];

export default function AlternativesHubPage() {
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
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Social Media Management Alternatives (2026)",
    description: "Comprehensive directory of alternatives to Postiz, Buffer, Hootsuite, Later, and Sprout Social.",
    url: "https://hookpost.hookstep.in/alternatives",
    publisher: {
      "@type": "Organization",
      name: "Hookpost",
      url: "https://hookpost.hookstep.in",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best alternative to Buffer and Hootsuite in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost is the highest-rated alternative to Buffer and Hootsuite for creators and teams. Unlike Buffer ($6/channel) and Hootsuite ($99/mo), Hookpost provides an open-source AGPL engine, bundles 18 social platforms with zero per-channel penalties, includes native Model Context Protocol (MCP) server support, and offers domestic UPI/card payments via Razorpay.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I save by switching from proprietary social schedulers to Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A solo creator managing 5 social channels saves over $1,000 across 3 years switching from Buffer, and over $3,500 compared to Hootsuite. A 5-member digital agency saves $6,000 to $8,000 over 3 years compared to Sprout Social and Hootsuite Team tiers.",
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost for free on my own server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is 100% open-source under the AGPL license. You can deploy it in 2 minutes using Docker Compose on any VPS or local machine with full data sovereignty and zero vendor lock-in.",
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost differ from Postiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost builds upon open-source foundations with essential production features: localized payment options (Razorpay UPI Autopay, NetBanking, and Indian cards), native Anthropic Model Context Protocol (MCP) server for Claude Desktop, and dedicated direct engineering support.",
        },
      },
      {
        "@type": "Question",
        name: "What are the hidden costs of legacy tools like Buffer, Later, and Hootsuite?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The primary hidden costs include: (1) per-channel pricing penalties ($6/channel quickly scaling to $60-$120/mo), (2) per-seat user fees ($199-$399/seat on Sprout Social), (3) add-on AI generation fees (e.g. Hootsuite OwlyWriter), (4) mandatory annual contract lock-ins, and (5) 3.5-5% foreign exchange fees on USD-only billing for international users.",
        },
      },
      {
        "@type": "Question",
        name: "Why do agencies prefer Hookpost over Sprout Social for team collaboration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sprout Social charges $199 to $399 per user per month, costing a 5-person agency up to $2,000/month. Hookpost provides unlimited client workspaces, granular role-based permissions, and unified visual approval calendars for a flat $29/month, saving agencies over $20,000 per year.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support AI agent automation through MCP (Model Context Protocol)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is the world's first open-source scheduler with native MCP server support. AI agents in Claude Desktop, Cursor, and Cline can inspect calendars, draft multi-network posts, and schedule autonomously via standardized JSON-RPC tools.",
        },
      },
      {
        "@type": "Question",
        name: "Can international and Indian creators pay in local currencies like INR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost supports native Razorpay integration for instant UPI (Google Pay, PhonePe, Paytm), RuPay, NetBanking, and Indian cards at regional pricing (₹699/mo).",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Compare Hookpost Against Top Social Media Scheduling Platforms (2026 Edition)
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
            Start Free ($0)
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 pt-12 pb-24 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Alternatives</li>
          </ol>
        </nav>

        <div className="text-center space-y-4 max-w-[900px] mx-auto">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            2026 Competitive Intelligence &amp; Software Hub
          </div>
          <h1 className="text-[34px] sm:text-[56px] font-black tracking-tight text-white leading-[1.15]">
            Best Social Media Management <br />
            <span className="text-[#FF4CE2]">Alternatives &amp; Competitors</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Looking for a faster, open-source, or more affordable social media scheduler? Compare Hookpost side-by-side with industry alternatives to find the ideal match for your workflow.
          </p>
        </div>

        {/* Featured Snippet Definition Box (Position 0 Target) */}
        <div className="bg-[#161616] border border-[#FF4CE2]/30 rounded-2xl p-6 max-w-[900px] mx-auto text-left shadow-[0_0_30px_rgba(255,76,226,0.1)]">
          <p className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold mb-2">Social Management Alternatives Summary</p>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            The top alternatives to proprietary social media tools like Buffer ($6/channel) and Hootsuite ($99/mo) include <strong>Hookpost</strong> and <strong>Postiz</strong>. Hookpost differentiates by combining an open-source AGPL engine, 1-click Docker self-hosting, bundled AI copy generation, and domestic regional payment support (Razorpay UPI &amp; Cards) with a $0 starter tier.
          </p>
        </div>

        <section className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {ALTERNATIVES.map((alt) => (
              <div
                key={alt.slug}
                className="bg-[#111] border border-white/10 hover:border-[#FF4CE2]/40 rounded-2xl p-6 sm:p-8 space-y-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Hookpost vs {alt.name}
                    </h2>
                    <span className="text-xs font-semibold bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/10">
                      {alt.badge}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 font-medium">
                    {alt.tagline}
                  </p>
                  <div className="space-y-2 pt-2 text-sm">
                    <p className="text-white/90">
                      <strong className="text-[#FF4CE2]">Why Switch: </strong>
                      {alt.hookpostAdvantage}
                    </p>
                    <p className="text-white/70">
                      <strong className="text-white">Pricing Comparison: </strong>
                      {alt.priceDiff}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/alternatives/${alt.slug}`}
                    className="text-[#FF4CE2] hover:text-white font-semibold text-sm flex items-center gap-1 group transition-colors"
                  >
                    Read Full {alt.name} Comparison
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-full border border-white/20 hover:border-white transition-all"
                  >
                    Try Free
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING COMPARISON TABLE WITH DOLLAR FIGURES */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Direct Pricing Comparison Matrix (2026 Dollar Figures)
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
              Transparent, unvarnished pricing data showing exactly how Hookpost compares with legacy SaaS schedulers.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 font-bold text-white">Platform</th>
                  <th className="p-4 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost</th>
                  <th className="p-4 font-bold text-neutral-300">Buffer</th>
                  <th className="p-4 font-bold text-neutral-300">Hootsuite</th>
                  <th className="p-4 font-bold text-neutral-300">Sprout Social</th>
                  <th className="p-4 font-bold text-neutral-300">Publer</th>
                  <th className="p-4 font-bold text-neutral-300">Postiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] text-neutral-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Starter Price</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$0 / free forever</td>
                  <td className="p-4">$0 (max 3 channels)</td>
                  <td className="p-4 text-red-400">No free tier</td>
                  <td className="p-4 text-red-400">No free tier</td>
                  <td className="p-4">$0 (max 3 accounts)</td>
                  <td className="p-4">$0 / free tier</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Pro / Team Tier</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$15 / mo (₹699)</td>
                  <td className="p-4">$6 / channel / mo</td>
                  <td className="p-4 text-red-400">$99 / mo minimum</td>
                  <td className="p-4 text-red-400">$199 / user / mo</td>
                  <td className="p-4">$12 / mo</td>
                  <td className="p-4">$19 / mo</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Per-Channel Penalty</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">$0 (Bundled)</td>
                  <td className="p-4 text-red-400">+$6 / channel / mo</td>
                  <td className="p-4 text-red-400">Add-on packs ($$)</td>
                  <td className="p-4 text-red-400">Add-on packs ($$)</td>
                  <td className="p-4">+$4 / account / mo</td>
                  <td className="p-4 text-emerald-400">$0 (Bundled)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Self-Hostable (Docker)</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">✅ 100% Free (AGPL)</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-emerald-400">✅ 100% Free (AGPL)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">MCP &amp; AI Agent Server</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">✅ Native MCP Server</td>
                  <td className="p-4 text-neutral-500">❌ Web Copilot Only</td>
                  <td className="p-4 text-neutral-500">❌ Web Copilot Only</td>
                  <td className="p-4 text-neutral-500">❌ Web Copilot Only</td>
                  <td className="p-4 text-neutral-500">❌ Web Copilot Only</td>
                  <td className="p-4 text-neutral-500">⚠️ Limited Web AI</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Payment Methods</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">Razorpay (UPI, NetBanking, Cards)</td>
                  <td className="p-4">Credit Cards Only</td>
                  <td className="p-4">Enterprise Invoice</td>
                  <td className="p-4">Enterprise Invoice</td>
                  <td className="p-4">Credit Cards Only</td>
                  <td className="p-4">Credit Cards Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3-YEAR TOTAL COST OF OWNERSHIP (TCO) */}
        <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Financial Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              3-Year Total Cost of Ownership (TCO) Breakdown
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Per-channel billing quietly drains creator budgets. Here is how much you spend over 36 months:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Scenario A: Solo Creator (5 Channels)</span>
                <span className="text-xs text-neutral-400 font-normal">3-Year Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Cloud Pro:</span>
                  <span className="font-mono text-white font-bold">$540 ($15/mo)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Self-Hosted:</span>
                  <span className="font-mono text-white font-bold">$0 (Free Forever)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Buffer ($30/mo for 5 channels):</span>
                  <span className="font-mono">$1,080</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Hootsuite ($99/mo standard):</span>
                  <span className="font-mono">$3,564</span>
                </li>
              </ul>
              <div className="bg-[#FF4CE2]/10 border border-[#FF4CE2]/20 p-3 rounded-lg text-xs text-[#FF4CE2] font-semibold text-center">
                Net 3-Year Creator Savings: $540 to $3,564
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Scenario B: Small Agency (15 Channels, 3 Seats)</span>
                <span className="text-xs text-neutral-400 font-normal">3-Year Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Pro:</span>
                  <span className="font-mono text-white font-bold">$1,044 ($29/mo)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Buffer ($90/mo for 15 channels):</span>
                  <span className="font-mono">$3,240</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Sprout Social ($199/user x 3 = $597/mo):</span>
                  <span className="font-mono">$21,492</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Hootsuite Team ($249/mo):</span>
                  <span className="font-mono">$8,964</span>
                </li>
              </ul>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400 font-semibold text-center">
                Net 3-Year Agency Savings: $7,920 to $20,448
              </div>
            </div>
          </div>

          {/* Blueprint: The 5 Hidden Costs of Legacy Schedulers */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white text-center">
              The 5 Hidden Gotchas of Legacy Social Media Schedulers
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">1. Per-Channel Gouging</span>
                <h4 className="text-sm font-bold text-white">The "Only $6/mo" Trap</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Buffer charges per channel. A brand active on Instagram, Bluesky, Pinterest, YouTube, X, Threads, Facebook, and LinkedIn pays $48-$60/mo just for basic connections. Hookpost includes 18 networks flat.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">2. Per-Seat Multipliers</span>
                <h4 className="text-sm font-bold text-white">Extortionate Agency Tax</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Sprout Social charges $199-$399 per seat per month. Adding your copywriter, designer, and client costs thousands extra. Hookpost includes unlimited team seats and client workspaces.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">3. AI Token Add-ons</span>
                <h4 className="text-sm font-bold text-white">Metered Copywriting</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Hootsuite charges extra for OwlyWriter AI credits; others restrict generations. Hookpost includes full AI generation and free local MCP server access for Claude and Cursor.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">4. Annual Contract Lock-in</span>
                <h4 className="text-sm font-bold text-white">Automatic Renewal Price Hikes</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enterprise suites enforce $1,188+ upfront annual commitments with automatic 15-20% price jumps upon renewal. Hookpost offers true month-to-month billing and $0 self-hosting.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">5. Forex &amp; Gateway Fees</span>
                <h4 className="text-sm font-bold text-white">3.5% International Surcharges</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Non-US creators pay hidden 3.5% foreign transaction fees on USD credit card payments. Hookpost provides native Razorpay UPI and card support in domestic currencies.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#FF4CE2]/10 to-transparent border border-[#FF4CE2]/30 rounded-xl p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FF4CE2] uppercase">The Hookpost Guarantee</span>
                  <h4 className="text-sm font-bold text-white">Zero Hidden Surcharges</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Transparent, predictable pricing. Open-source code you can audit yourself. Deploy with Docker or choose our cloud.
                  </p>
                </div>
                <Link href="/auth" className="text-xs text-[#FF4CE2] hover:text-white font-bold inline-flex items-center gap-1">
                  Start Free for $0 &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3-MINUTE MIGRATION GUIDE */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Frictionless Transition</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Migrate to Hookpost in 3 Easy Steps
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
              Switching from Buffer, Hootsuite, or Later takes under 3 minutes with zero downtime for your active campaigns.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4CE2]/20 text-[#FF4CE2] flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Export Your Queue or Inventory</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Download your scheduled posts CSV from your current tool or simply take inventory of your live connected channels.
              </p>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4CE2]/20 text-[#FF4CE2] flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">1-Click Channel OAuth</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Log into Hookpost and authorize your social accounts (X, Instagram, Facebook, LinkedIn, YouTube, Pinterest, etc.) in 60 seconds.
              </p>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4CE2]/20 text-[#FF4CE2] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Automate with AI &amp; MCP</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Drag-and-drop posts in the visual calendar or instruct Claude Desktop via the Hookpost MCP Server to schedule your upcoming month.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <SectionFaq
          items={faqSchema.mainEntity}
          title="Frequently Asked Questions About Alternatives"
        />

        <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-green-400 font-bold">
              Engineering Verification &amp; Testing Methodology
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            How We Evaluate Social Media Schedulers
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            {/*
              This claimed benchmarks "conducted by the JR Consulting Co.
              engineering team" measuring API reliability, queue execution
              latency and AI copilot output quality. No such benchmark is
              published, there is no methodology and no data, and there is no
              author page behind it. An authority claim a reader cannot check
              is worth less than no claim - and on pages whose whole job is to
              be believed about a competitor, it is actively costly.

              Replaced with what is actually true and checkable: these
              comparisons come from the competitors' own public pricing pages
              and public API documentation, and they are dated.
            */}
            Every competitor figure on these pages is taken from that
            competitor's own public pricing page or public API documentation,
            and is dated where it appears so you can check it against the
            source. Where a competitor prices per channel or per seat, we say
            so and state the billing basis, because monthly and annual rates
            differ. We do not publish performance benchmarks; where a
            capability is comparable, we mark it as a tie rather than claiming
            a win.
          </p>
          <div className="pt-2 text-xs text-white/50">
            Last updated: September 2026 &bull; Verified against production releases
          </div>
        </section>

        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Experience the #1 Open-Source Scheduler?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Schedule to 18 networks from one calendar. Free to start, no credit card, under 60 seconds to set up.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-[#FF4CE2] text-black hover:bg-white hover:text-black font-bold text-base px-10 py-4 rounded-full transition-all shadow-xl shadow-[#FF4CE2]/20"
          >
            Start Free for $0 &rarr;
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
          <Link href="/compare" className="hover:underline text-[#888]">Compare Tools</Link>
          <span>&bull;</span>
          <Link href="/" className="hover:underline text-[#888]">Home</Link>
        </div>
      </footer>
    </div>
  );
}
