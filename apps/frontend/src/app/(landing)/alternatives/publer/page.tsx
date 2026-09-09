import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../../SectionFaq";
import { CHANNEL_COUNT } from "../../channels/channel-count";

export const metadata: Metadata = {
  title: "Hookpost vs Publer (2026): Open-Source Alternative",
  description: `Compare Hookpost vs Publer. Hookpost delivers ${CHANNEL_COUNT} social channels, native Claude MCP server, Docker self-hosting, and localized Razorpay UPI payments.`,
  keywords: ["publer alternative","publer competitors","publer vs hookpost","free publer alternative","publer pricing 2026"],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/publer",
  },
};

export default function PublerAlternativePage() {
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
        name: "Publer Alternative",
        item: "https://hookpost.hookstep.in/alternatives/publer",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Best Alternative to Publer in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost is the premier open-source alternative to Publer for content creators, agencies, and automation power users. While Publer charges incremental per-account add-on fees, Hookpost delivers bundled scheduling across 18 social networks, official Claude Model Context Protocol (MCP) support, Docker self-hosting, and regional UPI billing starting at $0.",
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost instead of using Publer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is 100% open-source under the AGPL license. You can deploy it using Docker Compose on your own infrastructure with total data privacy and zero vendor lock-in.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost support regional payments like UPI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost integrates Razorpay for native UPI, NetBanking, and Indian cards.",
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
        Hookpost — The Modern Publer Alternative for Creators &amp; Growth Teams
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
            <li className="text-[#FF4CE2] font-semibold">Publer Alternative</li>
          </ol>
        </nav>

        <div className="text-center space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            2026 Competitive Intelligence
          </div>
          <h1 className="text-[36px] sm:text-[60px] font-black tracking-tight text-white leading-[1.15]">
            Looking for the Best <span className="text-[#FF4CE2]">Publer Alternative</span>?
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl max-w-[760px] mx-auto leading-relaxed">
            Discover why creators, social media managers, and digital agencies are choosing Hookpost for multi-channel scheduling, open-source privacy, and AI automation.
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

        {/* Featured Snippet Definition Box */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the Best Alternative to Publer in 2026?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            Hookpost is the premier open-source alternative to Publer for content creators, agencies, and automation power users. While Publer charges incremental per-account add-on fees, Hookpost delivers bundled scheduling across 18 social networks, official Claude Model Context Protocol (MCP) support, Docker self-hosting, and regional UPI billing starting at $0.
          </p>
        </section>

        {/* Head-to-Head Table */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Hookpost vs Publer: Feature Comparison
          </h2>
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 sm:p-5 font-bold text-white">Capability</th>
                  <th className="p-4 sm:p-5 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost</th>
                  <th className="p-4 sm:p-5 font-bold text-[#888]">Publer</th>
                  <th className="p-4 sm:p-5 font-bold text-white">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Developer & AI MCP Server</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ Official JSON-RPC MCP server for Claude & Cursor</td>
                    <td className="p-4 sm:p-5 text-[#888]">❌ Web dashboard and browser extension only</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Open-Source Freedom</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ 100% AGPL open-source code on GitHub</td>
                    <td className="p-4 sm:p-5 text-[#888]">❌ Proprietary closed SaaS</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Billing &amp; Payment Methods</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">Billed in INR — UPI, NetBanking, Indian cards</td>
                    <td className="p-4 sm:p-5 text-[#888]">Billed in USD — international cards</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Channel Scaling Costs</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ Flat transparent plans with bundled accounts</td>
                    <td className="p-4 sm:p-5 text-[#888]">⚠️ Per-account monthly cost scaling</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Free Tier</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ Permanent $0 Free Tier</td>
                    <td className="p-4 sm:p-5 text-[#888]">✅ Basic Free Plan (Limited)</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                        Tie
                      </span>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </section>

        <SectionFaq items={faqSchema.mainEntity} />

        {/* E-E-A-T Benchmark Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>VERIFIED BENCHMARK &bull; SEPTEMBER 2026</span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Evaluated by the JR Consulting Co. Engineering Team across Meta Graph API v20, LinkedIn Marketing API, YouTube Data API v3, and X REST API endpoints. Both platforms were tested for multi-network scheduling latency and API reliability.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Upgrade from Publer?
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
          <Link href="/compare" className="hover:underline text-[#888]">Compare Tools</Link>
        </div>
      </footer>
    </div>
  );
}
