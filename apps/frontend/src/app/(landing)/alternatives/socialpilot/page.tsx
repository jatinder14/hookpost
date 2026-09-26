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
const SP = COMPETITOR_FACTS.socialpilot;

const BEST_ALTERNATIVE_ANSWER = `Hookpost is an open-source alternative to SocialPilot with a free plan. SocialPilot has no free plan (14-day trial); its Essentials plan is $25.50 a month billed annually ($30 billed monthly) for 7 channels and 1 user, and Indian visitors are shown INR prices. SocialPilot includes an MCP server on all paid plans, but its API is Enterprise-only. ${HOOKPOST_PLANS} ${HOOKPOST_NETWORKS} SocialPilot prices checked ${FACTS_CHECKED}.`;

export const metadata: Metadata = {
  title: "Hookpost vs SocialPilot (2026): Agency Alternative",
  description: `Compare Hookpost vs SocialPilot: open-source self-hosting, a free plan, and flat pricing (Standard ₹${inr(STD_INR.month_price)} or $${STD_USD.month_price}/mo) vs SocialPilot's $25.50/mo Essentials billed annually.`,
  keywords: ["socialpilot alternative","socialpilot competitors","socialpilot vs hookpost","social media tool for teams","socialpilot pricing"],
  alternates: {
    canonical: "https://hookpost.hookstep.in/alternatives/socialpilot",
  },
};

export default function SocialpilotAlternativePage() {
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
        name: "SocialPilot Alternative",
        item: "https://hookpost.hookstep.in/alternatives/socialpilot",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Best Alternative to SocialPilot in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: BEST_ALTERNATIVE_ANSWER,
        },
      },
      {
        "@type": "Question",
        name: "Can I self-host Hookpost instead of using SocialPilot?",
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
        Hookpost — The Modern SocialPilot Alternative for Creators &amp; Growth Teams
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
            <li className="text-[#FF4CE2] font-semibold">SocialPilot Alternative</li>
          </ol>
        </nav>

        <div className="text-center space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            2026 Competitive Intelligence
          </div>
          <h1 className="text-[36px] sm:text-[60px] font-black tracking-tight text-white leading-[1.15]">
            Looking for the Best <span className="text-[#FF4CE2]">SocialPilot Alternative</span>?
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
            What is the Best Alternative to SocialPilot in 2026?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            {BEST_ALTERNATIVE_ANSWER}
          </p>
        </section>

        {/* Head-to-Head Table */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Hookpost vs SocialPilot: Feature Comparison
          </h2>
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 sm:p-5 font-bold text-white">Capability</th>
                  <th className="p-4 sm:p-5 font-bold text-[#FF4CE2] bg-[#FF4CE2]/5">Hookpost</th>
                  <th className="p-4 sm:p-5 font-bold text-[#888]">SocialPilot</th>
                  <th className="p-4 sm:p-5 font-bold text-white">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Pricing Flexibility</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ $0 Free / ₹{inr(STD_INR.month_price)} or ${STD_USD.month_price}/mo Standard ({STD_INR.channel} channels)</td>
                    <td className="p-4 sm:p-5 text-[#888]">⚠️ No free plan (14-day trial); Essentials $25.50/mo billed annually ($30 monthly), 7 channels</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Self-Hosted Deployment</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ 100% Docker Compose self-hostable</td>
                    <td className="p-4 sm:p-5 text-[#888]">❌ Cloud SaaS only</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">AI Agent &amp; API Access</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ MCP server + CLI (npx hookpost); API and MCP on Standard and Pro</td>
                    <td className="p-4 sm:p-5 text-[#888]">✅ MCP server on all paid plans; API on Enterprise only</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                        Tie
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Payment Methods</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">✅ Razorpay (UPI, NetBanking &amp; Cards)</td>
                    <td className="p-4 sm:p-5 text-[#888]">Shows INR prices to Indian visitors; UPI not listed on its pricing page</td>
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                        Hookpost
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">Supported Networks</td>
                    <td className="p-4 sm:p-5 text-white bg-[#FF4CE2]/5 font-semibold">{PUBLISHABLE_CHANNEL_COUNT} networks publishable for new accounts (Instagram, Facebook, Threads and Pinterest not yet)</td>
                    <td className="p-4 sm:p-5 text-[#888]">10 networks listed, including Instagram, Facebook, TikTok and Google Business Profile</td>
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

        <IndiaCostNote slug="socialpilot" />


        <SectionFaq items={faqSchema.mainEntity} />

        {/* Sources. Replaced a "verified benchmark" claim that had no published
            methodology or data behind it. */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>SOURCES &bull; CHECKED {FACTS_CHECKED.toUpperCase()}</span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            {SP.name} figures were read off its own pricing page ({SP.sources.join(', ')}) on {FACTS_CHECKED}; prices can differ by country and billing period. Hookpost figures are its published plans. We do not publish performance benchmarks.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Upgrade from SocialPilot?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            No credit card required. Free plan: {FREE.channel} channels and {FREE.posts_per_month} posts a month.
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
