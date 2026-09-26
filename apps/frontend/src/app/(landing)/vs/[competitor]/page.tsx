import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionFaq } from '../../SectionFaq';
import { PUBLISHABLE_CHANNEL_COUNT } from '../../channels/channel-count';

// Every number below was read off the vendor's own pricing page on
// PRICES_CHECKED (Zoho Social and Sendible via compare/competitor-facts.ts,
// the other four fetched directly). Only facts go in `weaknesses`: a subjective
// line like "Outdated UI" is not something a reader can check, so it is not
// here. Re-check every vendor before bumping the date.
const PRICES_CHECKED = '26 September 2026';

interface CompetitorData {
  name: string;
  category: string;
  tagline: string;
  startingPrice: string;
  /** Free plan as the vendor states it, or null when it offers none. */
  freePlan: string | null;
  /** Channels on the cheapest paid plan, as the vendor states it. */
  entryChannels: string;
  source: string;
  weaknesses: string[];
}

// Only the six competitors that live exclusively under /vs/ are defined. The
// other ten 301 to /alternatives/<slug> (see next.config.js); their old entries
// here carried stale prices and were removed rather than left to drift.
const COMPETITORS: Record<string, CompetitorData> = {
  'zoho-social': {
    name: 'Zoho Social',
    category: 'All-in-One Social Tool',
    tagline: 'Social media management for businesses',
    startingPrice: '$10/mo (Standard, billed annually)',
    freePlan: '6 channels',
    entryChannels: '14 channels on Standard',
    source: 'https://www.zoho.com/social/pricing.html',
    weaknesses: ['Not open source, so it cannot be self-hosted', 'UPI is not listed on its pricing page'],
  },
  'sendible': {
    name: 'Sendible',
    category: 'Agency Social Media Platform',
    tagline: 'Social media tool built for agencies',
    startingPrice: '$30/mo (Core, billed annually)',
    freePlan: null,
    entryChannels: '6 channels on Core',
    source: 'https://www.sendible.com/pricing',
    weaknesses: ['No free plan, only a 14-day trial', 'Core plan includes 6 channels', 'Not open source, so it cannot be self-hosted'],
  },
  'loomly': {
    name: 'Loomly',
    category: 'Brand Success Platform',
    tagline: 'Social media calendar and brand manager',
    startingPrice: '$49/mo (Starter, billed annually; $65 month to month)',
    freePlan: null,
    entryChannels: '12 social accounts and 3 users on Starter',
    source: 'https://www.loomly.com/pricing',
    weaknesses: ['No free plan, only a free trial', 'Entry plan is $49/mo billed annually, $65 month to month', 'Not open source, so it cannot be self-hosted'],
  },
  'tailwind': {
    name: 'Tailwind',
    category: 'Pinterest, Instagram & Facebook Scheduler',
    tagline: 'Automated marketing for small businesses',
    startingPrice: '$17.99/mo (Pro, billed annually)',
    freePlan: '5 posts a month, 1 Pinterest, 1 Instagram and 1 Facebook account',
    entryChannels: '1 Pinterest, 1 Instagram and 1 Facebook account on Pro',
    source: 'https://www.tailwindapp.com/pricing',
    weaknesses: ['Publishes to Pinterest, Instagram and Facebook only', 'Free plan is capped at 5 posts a month', 'Pro includes one account per network'],
  },
  'co-schedule': {
    name: 'CoSchedule',
    category: 'Marketing Calendar',
    tagline: 'Organize all your marketing in one place',
    startingPrice: '$29/mo (Starter, billed annually; $39 month to month)',
    freePlan: 'Up to 15 scheduled posts per profile',
    entryChannels: '3 social profiles on Starter (X profiles not included)',
    source: 'https://coschedule.com/pricing',
    weaknesses: ['Starter includes 1 user seat and 3 social profiles, not counting X', 'Extra seats on Professional cost $29/mo each'],
  },
  'meet-edgar': {
    name: 'MeetEdgar',
    category: 'Social Automation Tool',
    tagline: 'Automated evergreen social publishing',
    startingPrice: '$24.91/mo (Eddie, billed annually; $29.99 month to month)',
    freePlan: null,
    entryChannels: '5 social accounts on Eddie',
    source: 'https://meetedgar.com/pricing',
    weaknesses: ['No free plan, only a 30-day trial', 'Eddie plan covers 5 social accounts', 'Not open source, so it cannot be self-hosted'],
  },
};

const VS_ONLY = [
  'zoho-social',
  'sendible',
  'loomly',
  'tailwind',
  'co-schedule',
  'meet-edgar',
];

export async function generateStaticParams() {
  return VS_ONLY.filter((slug) => COMPETITORS[slug]).map((competitor) => ({
    competitor,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
  const { competitor } = await params;
  const comp = COMPETITORS[competitor];
  if (!comp) return {};

  return {
    // Kept under the ~60/~160 character limits so neither gets truncated in
    // results. The old pair ran to 88 and 199 characters, so the tail of both
    // — including the differentiators — was being cut off.
    title: `Hookpost vs ${comp.name}: Open-Source Alternative (2026)`,
    description: `Compare Hookpost and ${comp.name} on pricing, channel coverage, and self-hosting: ${PUBLISHABLE_CHANNEL_COUNT} networks, AI drafting, and a Docker image you can run yourself.`,
    keywords: [
      `${competitor} alternative`,
      `${competitor} competitor`,
      `hookpost vs ${competitor}`,
      `best ${competitor} alternative 2026`,
      `why switch from ${competitor}`,
      `${competitor} pricing vs hookpost`,
      'hookpost hookstep',
    ],
    alternates: {
      canonical: `https://hookpost.hookstep.in/vs/${competitor}`,
    },
  };
}

export default async function CompetitorComparisonPage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  const comp = COMPETITORS[competitor];
  if (!comp) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://hookpost.hookstep.in/alternatives" },
      { "@type": "ListItem", position: 3, name: `Hookpost vs ${comp.name}`, item: `https://hookpost.hookstep.in/vs/${competitor}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How does Hookpost compare with ${comp.name} on price?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${comp.name} starts at ${comp.startingPrice}${comp.freePlan ? `, with a free plan of ${comp.freePlan}` : ' and has no free plan'} (checked ${PRICES_CHECKED}). Hookpost has a free plan of 2 channels and 30 posts a month, Standard at $15 / ₹599 a month with AI writing and 5 channels, and Pro at $39 / ₹1,999 with 20 channels. It publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks and can be self-hosted with Docker.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I self-host Hookpost instead of paying for ${comp.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is open source under AGPL-3.0 and ships a Docker Compose file, so you can run it on your own VPS or Docker host.",
        },
      },
    ],
  };

  const comparisonRows = [
    // The 'Supported Platforms' row used to render `${comp.name} (Limited
    // Channels)` in the competitor column - a template slot presented as a
    // comparison fact, with no actual data about the competitor behind it. It
    // is removed rather than reworded: an empty comparison row is worse than a
    // missing one. Re-add it once each competitor's real channel list has been
    // checked and date-stamped.
    { feature: 'Free Plan', hookpost: '✅ 2 channels, 30 posts a month', competitor: comp.freePlan ? `✅ ${comp.freePlan}` : '❌ None' },
    { feature: 'Cheapest Paid Plan', hookpost: 'Standard: $15 / ₹599 a month', competitor: comp.startingPrice },
    { feature: 'Channels on Cheapest Paid Plan', hookpost: '5 on Standard (20 on Pro)', competitor: comp.entryChannels },
    { feature: 'UPI Autopay (India)', hookpost: '✅ Yes, via Razorpay', competitor: '— Not listed on pricing page' },
    { feature: 'Open-Source & Self-Hostable', hookpost: '✅ AGPL-3.0, Docker Compose', competitor: '❌ Proprietary SaaS Only' },
  ];

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
        Hookpost vs {comp.name} — Pricing Checked {PRICES_CHECKED}
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
            className="text-sm font-bold bg-[#FF4CE2] text-black px-5 py-2 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,76,226,0.5)]"
          >
            Switch to Hookpost Free
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-8 pb-24">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-8">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/alternatives" className="hover:text-white transition-colors">Alternatives</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Hookpost vs {comp.name}</li>
          </ol>
        </nav>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-bold uppercase tracking-widest mb-6">
            2026 Comparison Guide
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Looking for a Better Alternative to <span className="text-[#FF4CE2]">{comp.name}?</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-8">
            Hookpost publishes to {PUBLISHABLE_CHANNEL_COUNT} social networks from one calendar, with AI writing from $15 / ₹599 a month and up to 15 team members on Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-[#FF4CE2] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(255,76,226,0.4)]"
            >
              Start Free (No Credit Card Required)
            </Link>
          </div>
        </div>

        {/* Quick Answer capsule — self-contained, AI-citable definition */}
        <div className="max-w-3xl mx-auto mb-16 bg-neutral-950 border border-[#FF4CE2]/30 rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF4CE2] mb-3">
            Hookpost vs {comp.name}: the short answer
          </h2>
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
            Hookpost is an open-source (AGPL-3.0) AI social media scheduler by JR
            Consulting Co. that publishes to {PUBLISHABLE_CHANNEL_COUNT} social networks — including
            X, LinkedIn, YouTube, Bluesky, Discord and Telegram — from one
            calendar. Instagram, Facebook and Threads are waiting on Meta app
            approval for new accounts. It has a free plan, with Standard at{' '}
            <strong>$15/mo (₹599)</strong> and Pro at <strong>$39/mo (₹1,999)</strong>{' '}
            billed through Razorpay (UPI, NetBanking and cards), and can be
            self-hosted with Docker. {comp.name} is a{' '}
            {comp.category.toLowerCase()} starting at {comp.startingPrice}{' '}
            (<a href={comp.source} className="underline" rel="nofollow noopener" target="_blank">pricing page</a>,
            checked {PRICES_CHECKED}).
          </p>
        </div>

        {/* Comparison Table */}
        <div className="w-full overflow-x-auto mb-20">
          <table className="w-full text-left border-collapse bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="p-5 font-bold text-white text-lg">Key Feature</th>
                <th className="p-5 font-bold text-[#FF4CE2] text-lg">Hookpost</th>
                <th className="p-5 font-bold text-neutral-400 text-lg">{comp.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="border-b border-neutral-800/60 hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-medium text-white">{row.feature}</td>
                  <td className="p-5 text-neutral-200">{row.hookpost}</td>
                  <td className="p-5 text-neutral-400">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why Users Switch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-[#FF4CE2]">Why Creators Switch from {comp.name}</h2>
            <ul className="space-y-3">
              {comp.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-3 text-neutral-300 text-sm">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-[#FF4CE2]">What You Get with Hookpost</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Publish to {PUBLISHABLE_CHANNEL_COUNT} social networks from a single drag-and-drop calendar</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Free plan with 2 channels and 30 posts a month, no credit card</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Native Razorpay payment rails (UPI, NetBanking &amp; Cards)</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Self-host it with Docker Compose under AGPL-3.0</span>
              </li>
            </ul>
          </div>
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
          <Link href="/about" className="hover:underline text-[#888]">About</Link>
          <span>&bull;</span>
          <Link href="/channels" className="hover:underline text-[#888]">Channels</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
          <span>&bull;</span>
          <Link href="/for" className="hover:underline text-[#888]">Solutions</Link>
        </div>
      </footer>
    </div>
  );
}
