import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";

export const metadata: Metadata = {
  title: "Hookpost vs Hootsuite (2026): #1 Open-Source Alternative",
  description:
    "Compare Hookpost and Hootsuite on price and coverage: scheduling across 18 networks, AI agents, and a $0 free tier against a $99/mo minimum.",
  keywords: [
    "hootsuite alternative",
    "best hootsuite alternative",
    "free hootsuite alternative",
    "cheap hootsuite alternative",
    "open source hootsuite",
    "hootsuite vs hookpost",
    "hootsuite pricing 2026",
    "postiz competitor",
    "buffer competitors",
    "hookpost hookstep",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/hootsuite",
  },
};

export default function HootsuiteAlternativePage() {
  const comparisonData = [
    { feature: "Starting Monthly Price", hookpost: "₹0 Free Tier / ₹699 ($9/mo)", hootsuite: "$99 / user / month, billed annually (no free tier)", winner: "Hookpost" },
    { feature: "Supported Social Channels", hookpost: "18 Networks (Instagram, X, YouTube, LinkedIn, Pinterest, Threads, Bluesky, Facebook, Discord...)", hootsuite: "5-10 Networks", winner: "Hookpost" },
    { feature: "Self-Hostable (Docker / Local)", hookpost: "✅ 100% Open-Source & Self-Hostable", hootsuite: "❌ Closed Proprietary SaaS Only", winner: "Hookpost" },
    { feature: "AI Post & Reel Copilot", hookpost: "✅ Included with Hooks, Captions & Hashtags", hootsuite: "⚠️ Paid Add-on (OwlyWriter AI)", winner: "Hookpost" },
    { feature: "Payment Gateways", hookpost: "✅ Razorpay (UPI, NetBanking, Cards)", hootsuite: "❌ USD Credit Card Only", winner: "Hookpost" },
    { feature: "Visual Content Calendar", hookpost: "✅ Drag & Drop Multi-Channel Calendar", hootsuite: "✅ Hootsuite Planner", winner: "Tie" },
    // Was "$249/mo Enterprise Plan Required". No $249 tier exists.
    // hootsuite.com/plans lists Standard $99, Professional $199 and Advanced
    // $399 per user/month billed annually, plus a custom Enterprise tier;
    // cross-team approvals sit in Advanced. Verified 2026-09-08.
    { feature: "Team Roles & Agency Workspaces", hookpost: "✅ Multi-Org Workspaces Included", hootsuite: "Advanced, $399 / user / month", winner: "Hookpost" },
  ];

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
        name: "Hootsuite Alternative",
        item: "https://hookpost.hookstep.in/alternatives/hootsuite",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is Hookpost the best free alternative to Hootsuite?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hootsuite eliminated its free tier and instituted a steep $99/month minimum price. Hookpost provides a permanent $0 free tier, support for 18 social networks, full open-source self-hosting rights, and pro plans starting at just $9/mo (₹699/mo) with native UPI, NetBanking, and card support via Razorpay.",
        },
      },
      {
        "@type": "Question",
        name: "Can I manage agency clients on Hookpost instead of Hootsuite?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hootsuite puts cross-team approvals and co-working in its Advanced plan at $399 per user per month billed annually (Standard is $99 and Professional $199), whereas Hookpost provides unlimited client workspaces, granular role-based access control, and unified visual approval calendars out of the box.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — Escape Hootsuite's $99/mo Minimum. Start for $0 Today.
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.png" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-medium bg-white text-black hover:bg-[#FF4CE2] hover:text-white transition-all px-5 py-2 rounded-full font-semibold">
            Start Free for $0
          </Link>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 text-center space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50 text-left">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/alternatives" className="hover:text-white transition-colors">Alternatives</Link>
            </li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Hootsuite Alternative</li>
          </ol>
        </nav>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF4CE2] text-xs font-semibold uppercase tracking-wider mb-6 border border-white/10">
            The Modern Hootsuite Alternative
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Everything you love about Hootsuite. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] via-[#a855f7] to-[#06b6d4]">
              Without the $99/month price tag.
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Hootsuite killed its free plan and made social media management unaffordable for creators and small businesses. Hookpost brings back open-source, affordable scheduling across 18 channels with AI superpowers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#FF4CE2] hover:bg-[#e03cc7] text-white font-bold text-lg rounded-full shadow-lg shadow-[#FF4CE2]/25 transition-all">
              Switch from Hootsuite for Free →
            </Link>
            <Link href="/compare" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium text-lg rounded-full border border-white/10 transition-all">
              Compare All Competitors
            </Link>
          </div>
        </div>

        {/* Featured Snippet Answer Box */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the Best Alternative to Hootsuite in 2026?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            Hookpost is the best modern alternative to Hootsuite for creators, marketing teams, and digital agencies. Where Hootsuite requires a minimum $99/month subscription and locked-in annual contracts, Hookpost delivers multi-network scheduling across 18 channels, open-source Docker self-hosting, native AI copywriting, and a generous $0 starter tier.
          </p>
        </section>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-8 backdrop-blur-xl text-left">
          <h2 className="text-2xl font-bold mb-6 text-center">Head-to-Head Comparison: Hookpost vs Hootsuite</h2>
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="py-4 px-4 font-semibold">Feature / Capability</th>
                <th className="py-4 px-4 font-bold text-[#FF4CE2] text-center">Hookpost</th>
                <th className="py-4 px-4 font-semibold text-center">Hootsuite</th>
                <th className="py-4 px-4 font-semibold text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-white/90 font-semibold">{row.hookpost}</td>
                  <td className="py-4 px-4 text-center text-white/50">{row.hootsuite}</td>
                  <td className="py-4 px-4 text-center font-bold text-[#FF4CE2]">{row.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionFaq items={faqSchema.mainEntity} />
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
          <Link href="/compare" className="hover:underline text-[#888]">Compare Tools</Link>
        </div>
      </footer>
    </div>
  );
}
