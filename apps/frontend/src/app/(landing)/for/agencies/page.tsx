import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PUBLISHABLE_CHANNEL_COUNT } from '../../channels/channel-count';

export const metadata: Metadata = {
  title: 'Social Media Management Software for Agencies | Hookpost',
  description:
    'Group channels by client, share post previews for feedback, and add up to 15 team members on Pro with no per-seat fee. A Sprout Social and Hootsuite alternative.',
  keywords: [
    'social media software for agencies',
    'sprout social alternative for agencies',
    'multi-brand social media scheduler',
    'agency social media scheduler',
    'client post preview tool',
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
        name: "How do agencies manage several clients in Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each connected channel can be assigned to a customer, and the calendar can be filtered to one customer at a time. Pro includes 20 channels and up to 15 team members (owner included) with Admin and User roles, on one flat price with no per-seat fee.",
        },
      },
      {
        "@type": "Question",
        name: "Is Hookpost really free to get started?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The free plan covers 2 channels and 30 posts a month with no credit card. AI writing and the public API start on Standard (₹599 / $15 a month); Pro (₹1,999 / $39) raises that to 20 channels and 2,000 posts and adds team seats.",
        },
      },
    ],
  };

  const features = [
    { title: '🏢 Channels Grouped by Client', desc: 'Assign each connected channel to a customer and switch the calendar to one client at a time, so posts for different brands stay apart.' },
    { title: '✅ Preview Links for Client Feedback', desc: 'Save a post as a draft and share a preview link. Clients can open it without an account, and sign in to leave comments before you schedule it.' },
    { title: '👥 Team Seats Without Per-Seat Fees', desc: 'Pro includes up to 15 team members, owner included, on one flat price. Hootsuite Standard is $99 per user a month and Sprout Social Essentials $79 per user (both billed annually).' },
    { title: '🔌 Bulk Scheduling via API & n8n', desc: `Queue client posts in bulk from your own scripts or an n8n workflow through the public REST API, across ${PUBLISHABLE_CHANNEL_COUNT} networks (Standard and Pro).` },
    { title: '🔁 Repeating Posts & Signatures', desc: 'Set a post to repeat on an interval from daily to monthly, and save signatures you can drop into any client post.' },
    { title: '🛡️ Admin and User Roles', desc: 'Invite teammates as Admin or User. Channels connect through each network sign-in, so nobody needs a client password.' },
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
            Start Free
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
          Manage Every Client From One Calendar.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            No Per-User Fees.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Sprout Social Essentials is $79 per user a month and Hootsuite Standard is $99 per user (both billed annually). Hookpost Pro is ₹1,999 / $39 a month flat for 20 channels and up to 15 team members.
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
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
