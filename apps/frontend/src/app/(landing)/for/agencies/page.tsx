import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management Software for Agencies | Hookpost',
  description:
    'Manage 50+ client brands with unlimited seats, white-label approval portals, and multi-tenant workspaces. A Sprout Social and Hootsuite alternative.',
  keywords: [
    'social media software for agencies',
    'sprout social alternative for agencies',
    'unlimited accounts social media scheduler',
    'white label social media management',
    'client approval workflow tool',
    'multi-client social media dashboard',
    'agency social media pricing',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/agencies',
  },
};

export default function AgenciesLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Marketing Agencies", item: "https://hookpost.hookstep.in/for/agencies" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many client workspaces can an agency manage on Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost Pro allows agencies to create unlimited client workspaces with granular role-based permissions, client approval calendars, and unified multi-brand publishing.",
        },
      },
      {
        "@type": "Question",
        name: "Is Hookpost really free to get started?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost includes a generous $0 starter tier with no credit card required. Upgrade to Pro for unlimited accounts and advanced AI copilot tools.",
        },
      },
    ],
  };

  const features = [
    { title: '🏢 Multi-Tenant Client Workspaces', desc: 'Isolate client accounts, credentials, and assets into dedicated branded workspaces with zero cross-client leakage.' },
    { title: '✅ White-Label Client Approval Portals', desc: 'Send interactive review links to clients. Clients can approve, reject, or request edits without creating an account or seeing competitor brands.' },
    { title: '👥 Unlimited Team Members & Granular Roles', desc: 'Stop paying $199/user/month. Add your entire creative, copywriting, and strategy team without per-seat price penalties.' },
    { title: '📦 500+ Post Bulk CSV Upload', desc: 'Schedule hundreds of client posts across 18 social networks in seconds using structured spreadsheet imports.' },
    { title: '📈 Unified Cross-Channel Reporting', desc: 'Generate high-impact PDF analytics and engagement reports highlighting client follower growth, engagement rates, and top posts.' },
    { title: '🛡️ Enterprise Role Permissions', desc: 'Assign fine-grained admin, editor, and viewer permissions to protect client API keys and social publishing access.' },
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

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4">
        🏢 Hookpost for Agencies — Scale Clients, Protect Margins, Zero Per-User Fees
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#FF4CE2] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#FF4CE2] hover:text-black px-5 py-2 rounded-full">
            Start Free Agency Trial
          </Link>
        </div>
      </header>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-16 text-center">

        <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-8">
          <ol className="flex items-center justify-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/for" className="hover:text-white transition-colors">Solutions</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Marketing Agencies</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF4CE2]/40 bg-[#FF4CE2]/10 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider mb-6">
          The Modern Sprout Social & Hootsuite Escape Hatch
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Manage 50+ Client Brands.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            No Per-User Fees. 100% Margins.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Tired of Sprout Social charging $199 per team member and Hootsuite capping your client profiles? Hookpost gives marketing agencies complete control with unlimited scale.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Scale Your Agency Today
          </Link>
          <Link href="/alternatives/sprout-social" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg">
            Compare with Sprout Social
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center mb-12">Why Fast-Growing Agencies Choose Hookpost</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-[#FF4CE2]/50 transition-all">
              <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <section className="w-full max-w-[900px] mx-auto px-6 py-16 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-neutral-900 to-black border border-[#FF4CE2]/30">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Protect Your Agency Profit Margins</h2>
          <p className="text-neutral-400 mb-8 text-lg">Switch your agency clients to Hookpost in under 15 minutes.</p>
          <Link href="/auth" className="inline-block px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Get Started with Unlimited Workspaces
          </Link>
        </div>
      </section>
    </div>
  );
}
