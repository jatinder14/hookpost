import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Automation for Real Estate Agents | Hookpost',
  description:
    'Automatically schedule Just Listed reels, open-house tours, and multi-image property carousels. Social media scheduling for realtors and brokers.',
  keywords: [
    'social media for real estate agents',
    'realtor instagram scheduler',
    'just listed social media automation',
    'open house post scheduler',
    'real estate social media calendar',
    'property marketing tool',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/real-estate',
  },
};

export default function RealEstateLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Real Estate Agents", item: "https://hookpost.hookstep.in/for/real-estate" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can realtors auto-post property video tours and open house flyers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Realtors can batch-upload video walkthroughs, carousel listing photos, and open house dates to Facebook, Instagram, and YouTube Shorts.",
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
    { title: '🏡 "Just Listed" & "Open House" Multi-Publishing', desc: 'Promote new listings across Instagram, Facebook, LinkedIn, and X simultaneously with HD property photos and walkthrough videos.' },
    { title: '📸 Multi-Photo Carousel Previews', desc: 'Showcase floorplans, exterior architecture, and luxury interior shots in high-engagement Instagram & LinkedIn carousels.' },
    { title: '🎥 Vertical Video Tours for Reels & Shorts', desc: 'Auto-publish walkthrough video tours directly to Instagram Reels, Facebook Reels, and YouTube Shorts.' },
    { title: '🤖 AI Real Estate Property Description Writer', desc: 'Turn basic MLS property bullet points into compelling, luxury buyer-focused social copy in seconds.' },
    { title: '📅 Weekend Open House Blast Schedules', desc: 'Set up recurring reminders on Thursday, Friday, and Saturday mornings to maximize weekend open house turnout.' },
    { title: '👔 Professional LinkedIn Thought Leadership', desc: 'Position yourself as the premier local market expert with automated market statistic updates and neighborhood guides.' },
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
        🏡 Hookpost for Real Estate — Sell Homes Faster with Automated Social Marketing
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
            Start Free Realtor Trial
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
            <li className="text-[#FF4CE2] font-semibold">Real Estate Agents</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF4CE2]/40 bg-[#FF4CE2]/10 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider mb-6">
          Designed for Realtors, Brokerages & Property Managers
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Promote Every Listing Everywhere.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            More Buyer Inquiries, Less Screen Time.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Spend your time closing deals with clients, not fighting with 4 different social media apps. Hookpost automates your property launches from listing to sold.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Start Free for Real Estate
          </Link>
          <Link href="/alternatives/later" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg">
            Compare with Later
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center mb-12">Built to Showcase High-Value Properties</h2>
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
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Turn Listings into Signed Contracts</h2>
          <p className="text-neutral-400 mb-8 text-lg">Join top-performing real estate professionals using Hookpost.</p>
          <Link href="/auth" className="inline-block px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
