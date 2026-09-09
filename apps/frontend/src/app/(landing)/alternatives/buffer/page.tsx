import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { CHANNEL_COUNT } from "../../channels/channel-count";

export const metadata: Metadata = {
  title: "Hookpost vs Buffer (2026): Open-Source Alternative",
  description:
    "Compare Hookpost and Buffer on pricing and channel coverage: bundled plans instead of per-channel billing, an AI copilot, and a $0 free tier.",
  keywords: [
    "buffer competitors",
    "buffer competitor",
    "best buffer competitors",
    "buffer alternative",
    "open source buffer alternative",
    "top buffer alternatives 2026",
    "cheaper buffer competitor",
    "buffer vs hookpost",
    "hookpost hookstep",
    "buffer pricing 2026",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/buffer",
  },
  openGraph: {
    title: "Hookpost vs Buffer (2026): Open-Source Alternative",
    description:
      "Compare Hookpost vs Buffer. Zero per-channel penalties, bundled multi-channel scheduling across 18 networks, and native AI copilot.",
    url: "https://hookpost.hookstep.in/alternatives/buffer",
    siteName: "Hookpost",
    images: [
      {
        url: "https://hookpost.hookstep.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Buffer Competitors - Hookpost vs Buffer",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hookpost vs Buffer (2026): Open-Source Alternative",
    description: "Compare Hookpost vs Buffer. Buffer bills per channel ($5/mo each billed yearly, $6 month-to-month); Hookpost bundles channels into flat plans from $0.",
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function BufferAlternativePage() {
  const comparisonData = [
    // Basis stated explicitly. Buffer's headline price is $5/channel/mo
    // billed yearly ($60/yr); $6 is the month-to-month rate. Quoting $6
    // unlabelled reads as wrong to anyone who opens buffer.com/pricing.
    // Verified 8 Sep 2026 against buffer.com/pricing.
    { feature: "Channel Pricing Model", hookpost: "✅ Channels bundled into the plan", buffer: "Per channel: $5/mo billed yearly, $6 month-to-month", winner: "Hookpost" },
    // Was "₹699 ($9/mo)" against Buffer's ten channels. Standard caps at 5
    // channels (pricing.ts), so ten channels is the Team plan - the old row
    // overstated our own offer by comparing a 5-channel plan to Buffer's 10.
    { feature: "Cost for 10 social accounts", hookpost: "₹1,499 ($19/mo) — Team, 10 channels", buffer: "$50/mo billed yearly, $60 month-to-month", winner: "Hookpost" },
    { feature: "Open-Source & Self-Hostable", hookpost: "✅ 100% AGPLv3 Open-Source", buffer: "❌ Closed Proprietary SaaS", winner: "Hookpost" },
    { feature: "AI Content & Hook Copilot", hookpost: "✅ Native AI Copilot & MCP Server", buffer: "⚠️ Paid AI Add-on Credits", winner: "Hookpost" },
    { feature: "Supported Networks", hookpost: `${CHANNEL_COUNT} (Instagram, Facebook, Threads, YouTube, X, Pinterest, Bluesky...)`, buffer: "8-10 Channels", winner: "Hookpost" },
    // Scoring "Buffer: Foreign Credit Card Only" as a Hookpost win read exactly
    // backwards to the buyer this page is for - an ordinary credit card is what
    // they want. Stated as fact, with no winner claimed.
    { feature: "Billing & Payment Methods", hookpost: "Billed in INR — UPI, NetBanking & Indian cards", buffer: "Billed in USD — international cards", winner: "Tie" },
    { feature: "Multi-Client Agency Workspaces", hookpost: "✅ Workspaces & Granular Roles", buffer: "⚠️ Requires Agency Tier ($120+/mo)", winner: "Hookpost" },
    { feature: "Forever Free Tier", hookpost: "✅ $0 Starter Plan", buffer: "✅ Basic Free Tier (3 Channels Max)", winner: "Hookpost" },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hookpost",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Cloud, Self-Hosted Docker",
    url: "https://hookpost.hookstep.in/alternatives/buffer",
    description:
      "Modern open-source social media management platform and Buffer competitor supporting 18 channels with zero per-channel penalty fees.",
    isSimilarTo: {
      "@type": "SoftwareApplication",
      name: "Buffer",
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
        name: "Buffer Competitors",
        item: "https://hookpost.hookstep.in/alternatives/buffer",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is Hookpost the top competitor to Buffer in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buffer prices per channel: $5 per channel per month billed yearly, or $6 month-to-month, so ten channels costs $50-$60 a month. Hookpost bundles channels into flat plans - 5 channels on Standard at ₹699 ($9) a month and 10 channels on Team at ₹1,499 ($19) a month - across 18 networks, with a free tier at ₹0 and AGPL self-hosting. Buffer pricing verified 8 September 2026 at buffer.com/pricing.",
        },
      },
      {
        "@type": "Question",
        name: "How much can I save switching from Buffer to Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ten profiles on Buffer Essentials is $600 a year billed yearly, or $720 month-to-month. The like-for-like Hookpost plan for ten channels is Team at ₹1,499 ($19) a month, which is $228 a year - a saving of $372 to $492 a year, or 62% to 68%. Comparing against Hookpost Standard would not be like-for-like, because Standard includes 5 channels, not 10.",
        },
      },
      {
        "@type": "Question",
        name: "Is Hookpost open-source and self-hostable with Docker?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Unlike Buffer, which is closed proprietary SaaS, Hookpost is licensed under AGPL-3.0, allowing you to self-host with Docker on your own server with full data sovereignty.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support AI agents and Claude Desktop via MCP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost features an official Model Context Protocol (MCP) server. Claude Desktop, Cursor, and Cline can inspect your scheduled calendar, draft platform-compliant posts, and queue updates autonomously.",
        },
      },
      {
        "@type": "Question",
        name: "How do I migrate from Buffer to Hookpost with zero downtime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Migration takes 3 steps: (1) Export your scheduled post queue CSV from Buffer, (2) Connect your social media channels in Hookpost via official OAuth 2.0, and (3) Import your CSV calendar into Hookpost or drive scheduling via npx hookpost mcp.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support Indian payment methods like UPI and RuPay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost bills through Razorpay and supports UPI, RuPay, NetBanking and Indian cards at rupee pricing (₹699/mo). Buffer bills in USD by international card. If you are paying from outside India, Buffer's USD billing is the simpler option today.",
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
        Buffer bills per channel. Hookpost bundles channels into flat plans, starting at ₹0.
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.png" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
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
            <li className="text-[#FF4CE2] font-semibold">Buffer Alternative</li>
          </ol>
        </nav>

        <div className="text-center space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Buffer Alternative 2026
          </div>
          <h1 className="text-[36px] sm:text-[60px] font-black tracking-tight text-white leading-[1.15]">
            Tired of Buffer's Per-Channel Pricing? <br />
            Switch to <span className="text-[#FF4CE2]">Hookpost</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl max-w-[760px] mx-auto leading-relaxed">
            Buffer charges you for every single connected account. Hookpost gives you unlimited channels, AI generation, and multi-platform automation starting at $0.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/auth"
              className="bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-8 py-3.5 rounded-full transition-all shadow-lg shadow-[#FF4CE2]/20"
            >
              Get Started for Free &rarr;
            </Link>
          </div>
        </div>

        {/* Featured Snippet Box */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the Best Alternative to Buffer in 2026?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            Hookpost is the best modern alternative to Buffer for creators, agencies, and businesses. Where Buffer bills per channel, Hookpost provides bundled multi-channel scheduling across 18 social networks, built-in AI copywriting, self-hosted Docker freedom, and regional Razorpay UPI &amp; card payments starting at $0.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Side-by-Side Comparison: Hookpost vs Buffer
          </h2>
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 sm:p-5 font-bold text-white">Feature</th>
                  <th className="p-4 sm:p-5 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost</th>
                  <th className="p-4 sm:p-5 font-bold text-[#888]">Buffer</th>
                  <th className="p-4 sm:p-5 font-bold text-white">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">{row.feature}</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">{row.hookpost}</td>
                    <td className="p-4 sm:p-5 text-[#888]">{row.buffer}</td>
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

        {/* Why Hookpost Beats Buffer */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-bold text-white">💰 No Per-Channel Penalties</h3>
            <p className="text-sm text-[#888]">
              Buffer bills per channel: $5 a month each billed yearly, $6 month-to-month, so 10 channels is $50-$60 a month. Hookpost bundles channels - 10 of them on Team at $19 a month, and 2 on the free plan.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-bold text-white">⚡ {CHANNEL_COUNT} Supported Networks</h3>
            <p className="text-sm text-[#888]">
              Post to Instagram, Facebook, YouTube Shorts, Threads, X, LinkedIn, Pinterest, Discord, Slack, Bluesky, WordPress, and Telegram.
            </p>
          </div>
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-bold text-white">🤖 AI Copilot &amp; MCP Server</h3>
            <p className="text-sm text-[#888]">
              Generate platform-specific viral hooks, hashtags, and schedule directly via Claude, Cursor, and automated agents.
            </p>
          </div>
        </div>

        {/* Visible FAQ Section */}
        <SectionFaq
          items={faqSchema.mainEntity}
          title="Frequently Asked Questions: Buffer Competitors &amp; Migration"
        />

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Switch from Buffer to Hookpost Today
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            No credit card required. Connect your social channels in 30 seconds.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-10 py-4 rounded-full transition-all"
          >
            Start Free for $0
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
          <Link href="/alternatives/postiz" className="hover:underline text-[#888]">Postiz Alternative</Link>
        </div>
      </footer>
    </div>
  );
}
