import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../SectionFaq";
import { pricingINR, pricingUSD } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { COMPETITOR_FACTS, FACTS_CHECKED } from '../compare/competitor-facts';
import { PUBLISHABLE_CHANNEL_COUNT } from '../channels/channel-count';

// Hookpost figures come from pricing.ts (only FREE, STANDARD and PRO are sold);
// competitor figures from compare/competitor-facts.ts, checked FACTS_CHECKED.
const { FREE, STANDARD: STD_INR, PRO: PRO_INR } = pricingINR;
const { STANDARD: STD_USD, PRO: PRO_USD } = pricingUSD;
const inr = (n: number) => n.toLocaleString('en-IN');
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const FACTS = Object.values(COMPETITOR_FACTS);
const MCP_COUNT = FACTS.filter((c) => c.mcp === true).length;
const BUFFER_PER_CHANNEL = COMPETITOR_FACTS.buffer.cheapestPaid!.price; // annual billing
const HOOTSUITE_PER_USER = COMPETITOR_FACTS.hootsuite.cheapestPaid!.price; // annual billing
const AGORAPULSE_PER_USER = COMPETITOR_FACTS.agorapulse.cheapestPaid!.price; // annual billing, 10 profiles per user
const SPROUT_PER_SEAT = COMPETITOR_FACTS['sprout-social'].cheapestPaid!.price; // annual billing, 5 channels

// 3-year cost scenarios, all at the vendors' annual-billing rates.
const MONTHS = 36;
const A_CHANNELS = STD_INR.channel;
const TCO_A = {
  hookpost: STD_USD.month_price * MONTHS,
  buffer: BUFFER_PER_CHANNEL * A_CHANNELS * MONTHS,
  hootsuite: HOOTSUITE_PER_USER * MONTHS,
};
const B_CHANNELS = 15;
const B_SEATS = 3;
const TCO_B = {
  hookpost: PRO_USD.month_price * MONTHS,
  buffer: BUFFER_PER_CHANNEL * B_CHANNELS * MONTHS,
  agorapulse: AGORAPULSE_PER_USER * B_SEATS * MONTHS,
};

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
    tagline: "Open-source social media management app",
    hookpostAdvantage: "A free hosted plan and rupee billing via Razorpay (UPI, NetBanking, cards). Postiz lists USD prices only and no UPI.",
    priceDiff: `Postiz has no hosted free plan (7-day trial); Standard is $23/mo billed annually for 5 channels. Hookpost Standard: ₹${inr(STD_INR.month_price)} or $${STD_USD.month_price}/mo for ${STD_INR.channel} channels.`,
    badge: "Open-Source Alternative",
  },
  {
    slug: "buffer",
    name: "Buffer",
    tagline: "Simple social media tools with per-channel pricing",
    hookpostAdvantage: `Buffer charges per channel ($5/channel/mo billed annually, $6 monthly). Hookpost Standard is one flat price for ${STD_INR.channel} channels.`,
    priceDiff: `${A_CHANNELS} channels: Buffer $${BUFFER_PER_CHANNEL * A_CHANNELS}/mo (billed annually) vs Hookpost $${STD_USD.month_price}/mo.`,
    badge: "Price Value Alternative",
  },
  {
    slug: "hootsuite",
    name: "Hootsuite",
    tagline: "Social media suite priced per user",
    hookpostAdvantage: "Hootsuite has no free plan (14-day trial). Hookpost has a free plan and flat monthly plans.",
    priceDiff: `$0 or $${STD_USD.month_price}/mo vs $99 per user/mo billed annually (₹1,999 for Indian visitors).`,
    badge: "Cost-Saving Alternative",
  },
  {
    slug: "later",
    name: "Later",
    tagline: "Visual social planner",
    hookpostAdvantage: "Hookpost publishes to X and Bluesky, which Later's plans don't include. Hookpost's Instagram, Facebook, Threads and Pinterest publishing are not available to new accounts yet.",
    priceDiff: `Later has no free plan; Starter is $18.75/mo billed annually ($25 monthly). Hookpost: free plan, Standard $${STD_USD.month_price}/mo.`,
    badge: "Multi-Channel Alternative",
  },
  {
    slug: "metricool",
    name: "Metricool",
    tagline: "Social media planning & analytics dashboard",
    hookpostAdvantage: "Open source (AGPL) and self-hostable with Docker; Metricool is not. Both offer an MCP server.",
    priceDiff: `Metricool Free: 1 brand, 20 posts/mo, no LinkedIn or X; Starter $20/mo billed annually. Hookpost Free: ${FREE.channel} channels, ${FREE.posts_per_month} posts/mo.`,
    badge: "Open-Source Alternative",
  },
  {
    slug: "sprout-social",
    name: "Sprout Social",
    tagline: "Enterprise social media management priced per seat",
    hookpostAdvantage: `Flat pricing instead of per seat: Hookpost Pro covers up to ${PRO_INR.team_member_limit} team members for one price.`,
    priceDiff: `$0 / $${STD_USD.month_price} / $${PRO_USD.month_price} per month vs $79 per seat/mo billed annually (Essentials).`,
    badge: "Agency Alternative",
  },
  {
    slug: "agorapulse",
    name: "Agorapulse",
    tagline: "Social media inbox and publishing tool",
    hookpostAdvantage: `Flat pricing instead of per user: Hookpost Pro is $${PRO_USD.month_price}/mo for up to ${PRO_INR.team_member_limit} team members.`,
    priceDiff: "Agorapulse Standard is $79 per user/mo billed annually ($99 monthly); no free plan listed on its pricing page.",
    badge: "Modern Workflow Alternative",
  },
  {
    slug: "publer",
    name: "Publer",
    tagline: "Social media scheduler priced per account",
    hookpostAdvantage: `API and MCP from Standard ($${STD_USD.month_price}/mo for ${STD_INR.channel} channels). On Publer they need the Business plan ($8 per account/mo billed annually).`,
    priceDiff: `Publer Free: 3 accounts, 10 scheduled posts each, no X; Professional $4 per account/mo billed annually. Hookpost Free: ${FREE.channel} channels, ${FREE.posts_per_month} posts/mo, no AI.`,
    badge: "Developer & AI Alternative",
  },
  {
    slug: "socialpilot",
    name: "SocialPilot",
    tagline: "Social media scheduling for teams",
    hookpostAdvantage: "Open source and self-hostable, with API access from Standard. SocialPilot's API is Enterprise-only.",
    priceDiff: `SocialPilot has no free plan (14-day trial); Essentials is $25.50/mo billed annually for 7 channels, with INR prices shown in India. Hookpost Standard: ₹${inr(STD_INR.month_price)}/mo.`,
    badge: "Team Alternative",
  },
  {
    slug: "mixpost",
    name: "Mixpost",
    tagline: "Self-hosted social media software for Laravel & PHP",
    hookpostAdvantage: "A hosted cloud plan as well as Docker self-hosting, and Razorpay UPI billing. Both ship an MCP server.",
    priceDiff: "Mixpost Lite is free (MIT, self-hosted); Pro is a $299 one-time licence. Mixpost has no hosted plan.",
    badge: "Open-Source Alternative",
  },
  {
    slug: "planoly",
    name: "Planoly",
    tagline: "Visual planner built around Instagram and Pinterest",
    hookpostAdvantage: "Hookpost publishes to YouTube, X, LinkedIn, Bluesky and more. Its Instagram and Pinterest publishing are not available to new accounts yet.",
    priceDiff: "Planoly plans start at $14/mo (planoly.com/pricing); its free plan is mobile-only with 10 uploads/mo.",
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
          text: `Hookpost is an open-source (AGPL) alternative to Buffer and Hootsuite with flat plans. Buffer charges per channel ($5 per channel per month billed annually, $6 monthly) and Hootsuite per user ($99 per user per month billed annually). Hookpost has a free plan (${FREE.channel} channels, ${FREE.posts_per_month} posts a month); Standard is ₹${inr(STD_INR.month_price)} or $${STD_USD.month_price} a month for ${STD_INR.channel} channels, and Pro is ₹${inr(PRO_INR.month_price)} or $${PRO_USD.month_price} for ${PRO_INR.channel} channels and up to ${PRO_INR.team_member_limit} team members, paid via Razorpay (UPI, NetBanking, cards). Buffer and Hootsuite also offer MCP servers, so that is not a difference. Prices checked ${FACTS_CHECKED}.`,
        },
      },
      {
        "@type": "Question",
        name: "How much can I save by switching from proprietary social schedulers to Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `At annual-billing rates over 3 years: a creator with ${A_CHANNELS} channels pays ${usd(TCO_A.hookpost)} on Hookpost Standard, ${usd(TCO_A.buffer)} on Buffer and ${usd(TCO_A.hootsuite)} on Hootsuite Standard (1 user). A team with ${B_CHANNELS} channels and ${B_SEATS} seats pays ${usd(TCO_B.hookpost)} on Hookpost Pro, ${usd(TCO_B.buffer)} on Buffer and ${usd(TCO_B.agorapulse)} on Agorapulse Standard. Competitor prices checked ${FACTS_CHECKED}.`,
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost for free on my own server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is 100% open-source under the AGPL license. You can deploy it using Docker Compose on any VPS or local machine with full data sovereignty and zero vendor lock-in.",
        },
      },
      {
        "@type": "Question",
        name: "How does Hookpost differ from Postiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost builds on open-source foundations. The practical differences are pricing and billing: Hookpost has a free hosted plan and bills Indian customers in rupees via Razorpay (UPI Autopay, NetBanking, cards), while Postiz has no hosted free plan (7-day trial) and lists USD prices from $23/mo billed annually. Both include an MCP server.",
        },
      },
      {
        "@type": "Question",
        name: "What are the hidden costs of legacy tools like Buffer, Later, and Hootsuite?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The costs that are easy to miss: (1) per-channel pricing ($5 per channel on Buffer, $4 per account on Publer, both billed annually), (2) per-seat pricing ($79 per seat on Sprout Social Essentials, $99 per user on Hootsuite, $79 per user on Agorapulse, all billed annually), (3) headline prices that are annual rates, with higher monthly rates, and (4) USD-only billing, where your bank may add a foreign-transaction fee. Prices checked ${FACTS_CHECKED}.`,
        },
      },
      {
        "@type": "Question",
        name: "Why do agencies prefer Hookpost over Sprout Social for team collaboration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sprout Social prices per seat: Essentials is $${SPROUT_PER_SEAT} per seat per month billed annually ($99 monthly) and includes 5 channels, so 5 seats cost $${SPROUT_PER_SEAT * 5} a month. Hookpost Pro is $${PRO_USD.month_price} (₹${inr(PRO_INR.month_price)}) a month flat for ${PRO_INR.channel} channels and up to ${PRO_INR.team_member_limit} team members. Prices checked ${FACTS_CHECKED}.`,
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support AI agent automation through MCP (Model Context Protocol)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, on Standard and Pro (not on Free). MCP clients such as Claude Desktop and Cursor can draft and schedule posts through it. It is not unique to Hookpost: ${MCP_COUNT} of the ${FACTS.length} social media tools we checked on ${FACTS_CHECKED} offer an MCP server, including Buffer, Hootsuite, Publer and Postiz.`,
        },
      },
      {
        "@type": "Question",
        name: "Can international and Indian creators pay in local currencies like INR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost supports native Razorpay integration for instant UPI (Google Pay, PhonePe, Paytm), RuPay, NetBanking, and Indian cards at regional pricing: Standard ₹" + inr(STD_INR.month_price) + "/mo, Pro ₹" + inr(PRO_INR.month_price) + "/mo.",
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
            Alternatives to proprietary social media tools like Buffer ($5 per channel/mo) and Hootsuite ($99 per user/mo, both billed annually) include <strong>Hookpost</strong> and <strong>Postiz</strong>. Hookpost combines an open-source AGPL engine, Docker self-hosting, AI writing on paid plans, and rupee billing via Razorpay (UPI &amp; cards) with a free plan of {FREE.channel} channels and {FREE.posts_per_month} posts a month. Competitor prices checked {FACTS_CHECKED}.
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
              Each vendor&apos;s cheapest paid plan, read off its own pricing page on {FACTS_CHECKED}. Competitor prices are annual-billing rates; monthly billing costs more.
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
                  <td className="p-4 font-semibold text-white">Free Plan</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">$0: {FREE.channel} channels, {FREE.posts_per_month} posts/mo</td>
                  <td className="p-4">$0: 3 channels, 10 scheduled posts each</td>
                  <td className="p-4 text-red-400">No free plan (14-day trial)</td>
                  <td className="p-4 text-red-400">No free plan (30-day trial)</td>
                  <td className="p-4">$0: 3 accounts, 10 scheduled posts each, no X</td>
                  <td className="p-4 text-red-400">No hosted free plan (7-day trial)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Entry Paid Plan</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">${STD_USD.month_price} / mo (₹{inr(STD_INR.month_price)}), {STD_INR.channel} channels</td>
                  <td className="p-4">$5 / channel / mo</td>
                  <td className="p-4">$99 / user / mo</td>
                  <td className="p-4">$79 / seat / mo</td>
                  <td className="p-4">$4 / account / mo</td>
                  <td className="p-4">$23 / mo, 5 channels</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Pricing Basis</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">Flat per plan ({STD_INR.channel} channels Standard, {PRO_INR.channel} Pro)</td>
                  <td className="p-4 text-red-400">Per channel</td>
                  <td className="p-4 text-red-400">Per user (10 channels)</td>
                  <td className="p-4 text-red-400">Per seat (5 channels on Essentials)</td>
                  <td className="p-4">Per account</td>
                  <td className="p-4 text-emerald-400">Flat per plan</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Self-Hostable (Docker)</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">✅ 100% Free (AGPL)</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-red-400">❌ Proprietary Cloud</td>
                  <td className="p-4 text-emerald-400">✅ Free (AGPL-3.0)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">MCP Server</td>
                  <td className="p-4 text-emerald-400 bg-[#FF4CE2]/5 font-bold">✅ Standard and Pro (not Free)</td>
                  <td className="p-4">✅ Every plan, incl. Free</td>
                  <td className="p-4">✅ Official MCP servers</td>
                  <td className="p-4">⚠️ ChatGPT only, TikTok data only</td>
                  <td className="p-4">✅ Business plan</td>
                  <td className="p-4">✅ Every plan</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 font-semibold text-white">Rupee Pricing / UPI</td>
                  <td className="p-4 text-white bg-[#FF4CE2]/5 font-bold">INR billing: UPI, NetBanking, Cards</td>
                  <td className="p-4">USD only; no UPI listed</td>
                  <td className="p-4">Shows INR (₹1,999 / user / mo); no UPI listed</td>
                  <td className="p-4">USD only; no UPI listed</td>
                  <td className="p-4">Shows INR; no UPI listed</td>
                  <td className="p-4">USD only; no UPI listed</td>
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
              What each plan costs over 36 months at the vendors&apos; annual-billing rates (checked {FACTS_CHECKED}):
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Scenario A: Solo Creator ({A_CHANNELS} Channels)</span>
                <span className="text-xs text-neutral-400 font-normal">3-Year Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Standard:</span>
                  <span className="font-mono text-white font-bold">{usd(TCO_A.hookpost)} (${STD_USD.month_price}/mo)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Self-Hosted:</span>
                  <span className="font-mono text-white font-bold">$0 (Free Forever)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Buffer (${BUFFER_PER_CHANNEL * A_CHANNELS}/mo for {A_CHANNELS} channels):</span>
                  <span className="font-mono">{usd(TCO_A.buffer)}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Hootsuite Standard (${HOOTSUITE_PER_USER}/user/mo, 1 user):</span>
                  <span className="font-mono">{usd(TCO_A.hootsuite)}</span>
                </li>
              </ul>
              <div className="bg-[#FF4CE2]/10 border border-[#FF4CE2]/20 p-3 rounded-lg text-xs text-[#FF4CE2] font-semibold text-center">
                3-year difference vs Hookpost Standard: {usd(TCO_A.buffer - TCO_A.hookpost)} to {usd(TCO_A.hootsuite - TCO_A.hookpost)}
              </div>
            </div>

            <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>Scenario B: Small Agency ({B_CHANNELS} Channels, {B_SEATS} Seats)</span>
                <span className="text-xs text-neutral-400 font-normal">3-Year Horizon</span>
              </h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-semibold">Hookpost Pro:</span>
                  <span className="font-mono text-white font-bold">{usd(TCO_B.hookpost)} (${PRO_USD.month_price}/mo)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Buffer (${BUFFER_PER_CHANNEL * B_CHANNELS}/mo for {B_CHANNELS} channels):</span>
                  <span className="font-mono">{usd(TCO_B.buffer)}</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Agorapulse Standard (${AGORAPULSE_PER_USER}/user x {B_SEATS} = ${AGORAPULSE_PER_USER * B_SEATS}/mo):</span>
                  <span className="font-mono">{usd(TCO_B.agorapulse)}</span>
                </li>
              </ul>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400 font-semibold text-center">
                3-year difference vs Hookpost Pro: {usd(TCO_B.buffer - TCO_B.hookpost)} to {usd(TCO_B.agorapulse - TCO_B.hookpost)}
              </div>
            </div>
          </div>

          {/* Blueprint: The 5 Hidden Costs of Legacy Schedulers */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white text-center">
              Five Pricing Details to Check Before You Pay
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">1. Per-Channel Pricing</span>
                <h4 className="text-sm font-bold text-white">The &quot;Only $5/mo&quot; Trap</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Buffer charges per channel: 8 channels cost ${BUFFER_PER_CHANNEL * 8}/mo billed annually, or $48 billed monthly. Hookpost Standard covers {STD_INR.channel} channels for ${STD_USD.month_price}/mo and Pro covers {PRO_INR.channel} for ${PRO_USD.month_price}/mo.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">2. Per-Seat Multipliers</span>
                <h4 className="text-sm font-bold text-white">Paying Again for Every Teammate</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Sprout Social Essentials is ${SPROUT_PER_SEAT} per seat per month billed annually; Standard is $199. Hookpost Pro includes up to {PRO_INR.team_member_limit} team members for ${PRO_USD.month_price}/mo.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">3. Gated API Access</span>
                <h4 className="text-sm font-bold text-white">API on the Top Tier Only</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Publer puts its API and MCP on Business, SocialPilot&apos;s API is Enterprise-only, and Sprout&apos;s API is on Advanced. Hookpost includes AI, API and MCP from Standard; Free has none of them.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">4. Annual-Rate Headlines</span>
                <h4 className="text-sm font-bold text-white">Monthly Billing Costs More</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Headline prices are often annual rates: Sprout Essentials $79 vs $99 monthly, Agorapulse $79 vs $99, SocialPilot $25.50 vs $30. Hookpost Standard is ₹{inr(STD_INR.month_price)} or ${STD_USD.month_price} billed monthly.
                </p>
              </div>
              <div className="bg-[#161616] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase">5. Currency</span>
                <h4 className="text-sm font-bold text-white">USD-Only Billing</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Buffer, Sprout Social, Agorapulse, Later and Postiz list USD prices only, and your bank may add a foreign-transaction fee. Hookpost bills Indian customers in INR via Razorpay, including UPI Autopay.
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
              Switching from Buffer, Hootsuite, or Later without pausing your active campaigns.
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
                Log into Hookpost and authorize your social accounts (X, LinkedIn, YouTube, Bluesky, Telegram and more). Instagram, Facebook, Threads and Pinterest are not available to new accounts yet.
              </p>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4CE2]/20 text-[#FF4CE2] flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Automate with AI &amp; MCP</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Drag-and-drop posts in the visual calendar or, on Standard and Pro, instruct Claude Desktop via the Hookpost MCP server to schedule your upcoming month.
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
            Competitor figures checked {FACTS_CHECKED}
          </div>
        </section>

        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Try an Open-Source Scheduler?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Publish to {PUBLISHABLE_CHANNEL_COUNT} networks from one calendar. Free to start, no credit card.
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
