import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionFaq } from '../../SectionFaq';
import { PUBLISHABLE_CHANNEL_COUNT } from '../../channels/channel-count';

interface CompetitorData {
  name: string;
  category: string;
  tagline: string;
  startingPrice: string;
  weaknesses: string[];
  strengths: string[];
}

const COMPETITORS: Record<string, CompetitorData> = {
  'buffer': {
    name: 'Buffer',
    category: 'Social Media Management',
    tagline: 'Simple social media tools for authentic engagement',
    startingPrice: '$6/channel/mo',
    weaknesses: ['Per-channel pricing adds up fast', 'No multi-account team collaboration on basic tier', 'Limited AI writing credits', 'No self-hosting or data sovereignty'],
    strengths: ['Simple interface', 'Basic scheduling'],
  },
  'postiz': {
    name: 'Postiz',
    category: 'Open-Source Social Scheduler',
    tagline: 'Open-source social media management platform',
    startingPrice: '$29/mo (Cloud)',
    weaknesses: ['No Indian payment gateways (Foreign cards only)', 'Community Discord-only support', 'Complex manual setup'],
    strengths: ['Open source', 'Self-hostable'],
  },
  'hootsuite': {
    name: 'Hootsuite',
    category: 'Enterprise Social Media Management',
    tagline: 'Social media marketing & management dashboard',
    startingPrice: '$99/mo (Billed annually)',
    weaknesses: ['Extremely expensive for creators & small businesses', 'Forced annual contracts', 'Cluttered legacy interface', 'No free tier'],
    strengths: ['Extensive enterprise integrations', 'Large brand history'],
  },
  'sprout-social': {
    name: 'Sprout Social',
    category: 'Enterprise Social Suite',
    tagline: 'Deep social listening and analytics',
    startingPrice: '$199/user/mo',
    weaknesses: ['Astronomical pricing for small teams', 'No open-source options', 'Complex onboarding'],
    strengths: ['Deep listening tools', 'CRM integrations'],
  },
  'later': {
    name: 'Later',
    category: 'Visual Social Media Marketing',
    tagline: 'Visual social planner for Instagram and Pinterest',
    startingPrice: '$25/mo',
    weaknesses: ['Heavy focus only on Instagram/Pinterest', 'Weak B2B LinkedIn & X features', 'Strict post limits'],
    strengths: ['Visual Instagram feed preview', 'Link in bio tool'],
  },
  'metricool': {
    name: 'Metricool',
    category: 'Social Media & Ad Analytics',
    tagline: 'All-in-one social media analytics and planning',
    startingPrice: '$22/mo',
    weaknesses: ['Cluttered reporting dashboard', 'Slow multi-channel publishing queues', 'Complex ad account linking'],
    strengths: ['Detailed analytics', 'Competitor tracking'],
  },
  'publer': {
    name: 'Publer',
    category: 'Social Media Automation',
    tagline: 'Virtual social media superhero',
    startingPrice: '$12/mo',
    weaknesses: ['Limited open-source flexibility', 'Per-social account upcharges', 'No self-hosted Docker option'],
    strengths: ['Auto-scheduling', 'Recycling posts'],
  },
  'socialpilot': {
    name: 'SocialPilot',
    category: 'Agency Social Media Tool',
    tagline: 'Cost-effective social media scheduling for teams',
    startingPrice: '$30/mo',
    weaknesses: ['No free starter tier', 'Interface lacks modern AI reel tools', 'No self-hosted options'],
    strengths: ['Agency client management', 'Bulk scheduling'],
  },
  'planoly': {
    name: 'Planoly',
    category: 'Visual Planner',
    tagline: 'Visual planning tool for creators',
    startingPrice: '$16/mo',
    weaknesses: ['Limited to visual platforms', 'Weak analytics', 'No multi-tenant agency management'],
    strengths: ['Instagram grid planning', 'Mobile app'],
  },
  'agorapulse': {
    name: 'Agorapulse',
    category: 'Social Media Management Suite',
    tagline: 'Social inbox and publishing platform',
    startingPrice: '$49/user/mo',
    weaknesses: ['Per-user pricing becomes very expensive for agencies', 'No open-source version', 'Complex UI'],
    strengths: ['Unified social inbox', 'Power reports'],
  },
  'zoho-social': {
    name: 'Zoho Social',
    category: 'All-in-One Social Tool',
    tagline: 'Social media management for businesses',
    startingPrice: '$15/mo',
    weaknesses: ['Locked into Zoho ecosystem', 'Outdated UI', 'Limited short-form video auto-publishing'],
    strengths: ['Zoho CRM integration', 'Monitoring dashboard'],
  },
  'sendible': {
    name: 'Sendible',
    category: 'Agency Social Media Platform',
    tagline: 'Social media tool built for agencies',
    startingPrice: '$29/mo',
    weaknesses: ['Strict client profile limits', 'No free tier', 'Slow mobile app'],
    strengths: ['Custom white-label reports', 'Canva integration'],
  },
  'loomly': {
    name: 'Loomly',
    category: 'Brand Success Platform',
    tagline: 'Social media calendar and brand manager',
    startingPrice: '$42/mo',
    weaknesses: ['High starting price point', 'No free plan', 'Limited AI generation capabilities'],
    strengths: ['Post ideas library', 'Approval workflows'],
  },
  'tailwind': {
    name: 'Tailwind',
    category: 'Pinterest & Instagram Scheduler',
    tagline: 'Automated marketing for small businesses',
    startingPrice: '$19.99/mo',
    weaknesses: ['Only focused on Pinterest and Instagram', 'No X or LinkedIn automation', 'No open-source options'],
    strengths: ['SmartLoop Pinterest scheduling', 'Ghostwriter AI'],
  },
  'co-schedule': {
    name: 'CoSchedule',
    category: 'Marketing Calendar',
    tagline: 'Organize all your marketing in one place',
    startingPrice: '$29/user/mo',
    weaknesses: ['Expensive add-on pricing', 'Steep learning curve', 'Complex interface'],
    strengths: ['Marketing calendar', 'Headline analyzer'],
  },
  'meet-edgar': {
    name: 'MeetEdgar',
    category: 'Social Automation Tool',
    tagline: 'Automated evergreen social publishing',
    startingPrice: '$29.99/mo',
    weaknesses: ['Outdated UI', 'No short-form video support', 'Expensive for solo creators'],
    strengths: ['Evergreen content recycling', 'Category-based scheduling'],
  },
};

// The ten competitors that also have an /alternatives/<slug> page now 301 to
// it (see next.config.js), so there is no reason to build a page here that
// nothing can reach. Only the six that live exclusively under /vs/ are built.
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
    description: `Compare Hookpost and ${comp.name} on pricing, channel coverage, and self-hosting: 18 networks, AI drafting, and a Docker image you can run yourself.`,
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
        name: `Why are creators switching from ${comp.name} to Hookpost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Hookpost eliminates high subscription fees like ${comp.startingPrice}, offering 18 social networks, unlimited workspaces, built-in AI hooks, and self-hosted Docker deployment starting at $0.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I self-host Hookpost instead of paying for ${comp.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is 100% open-source under the AGPL license and can be deployed in minutes on any VPS or Docker host.",
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
    { feature: 'Starting Price', hookpost: '✅ $0 Forever Free Tier (Standard: $9 / ₹699)', competitor: `❌ ${comp.startingPrice}` },
    { feature: 'Global & Indian Payment Gateways', hookpost: '✅ Razorpay (UPI, Netbanking, Cards)', competitor: '❌ Foreign Credit Card Only' },
    { feature: 'Open-Source & Self-Hostable', hookpost: '✅ 100% Open-Source & 1-Click Docker', competitor: comp.name === 'Postiz' ? '✅ Open-Source' : '❌ Proprietary SaaS Only' },
    { feature: 'Built-in AI Reels & Hooks Generator', hookpost: '✅ Multi-Model Viral Hook & Caption AI', competitor: '⚠️ Basic or Expensive Add-on' },
    { feature: 'Multi-Tenant Agency Client Workspaces', hookpost: '✅ Included with Granular Permissions', competitor: '⚠️ High Per-User Upcharge' },
    { feature: 'Customer Support', hookpost: '✅ Email &amp; Discord Support', competitor: '⚠️ Standard Ticket Queues' },
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
        Hookpost — The #1 Rated Alternative to {comp.name} Worldwide 🚀
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
            Why pay {comp.startingPrice} when you can publish across {PUBLISHABLE_CHANNEL_COUNT} social networks, generate viral AI copy, and invite unlimited team members with Hookpost?
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
            Instagram, YouTube, X, LinkedIn, Facebook, Threads and Pinterest — from
            one calendar. It starts at <strong>$0</strong> with a Pro plan at{' '}
            <strong>$9/mo (₹699)</strong> billed through Razorpay (UPI, NetBanking
            and cards), and can be self-hosted with Docker. {comp.name} is a{' '}
            {comp.category.toLowerCase()} starting at {comp.startingPrice}, so
            Hookpost is the lower-cost, open-source alternative for creators,
            agencies and small businesses that want more networks without
            per-channel or per-seat fees.
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
                <span>$0 Forever Free starter tier with full multi-channel support</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Native Razorpay payment rails (UPI, NetBanking &amp; Cards)</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-300 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                <span>Full data sovereignty with 1-click self-hosted Docker option</span>
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
