import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for Small Businesses | Hookpost',
  description:
    'Auto-post to Facebook, Instagram, and Threads in minutes. Simple social media marketing for local shops, clinics, and restaurants.',
  keywords: [
    'social media for small business',
    'easy social media scheduler',
    'facebook page scheduler for local business',
    'facebook and instagram scheduler for business',
    'simple marketing tool for local store',
    'affordable social media management',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/small-business',
  },
};

export default function SmallBusinessLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Small Businesses", item: "https://hookpost.hookstep.in/for/small-business" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is Hookpost better than Buffer or Hootsuite for local shops?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost eliminates costly per-channel fees and $99/mo minimums, giving small businesses multi-channel scheduling starting at $0.",
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
    { title: '📍 Local Offers on Facebook & Instagram', desc: 'Publish special offers, opening-hours changes, and photos to your Facebook Page and Instagram Business account on a schedule.' },
    { title: '⚡ 1-Click Multi-Posting to Meta', desc: 'Publish to your Facebook Page and Instagram Business account simultaneously without opening Meta Business Suite.' },
    { title: '🤖 AI Copywriter for Busy Owners', desc: 'No marketing degree needed. Simply type what you sell, and our AI writes professional captions, offers, and hashtags for you.' },
    { title: '⏰ Set-and-Forget Weekly Scheduling', desc: 'Dedicate 20 minutes on Monday morning to schedule all your weekly promos, then focus 100% on running your business.' },
    { title: '💳 Affordable Plans with Zero Surprise Fees', desc: 'Start for free or upgrade to Pro for less than the cost of a single lunch. Fair pricing designed for main street businesses.' },
    { title: '📱 Clean, Non-Technical Dashboard', desc: 'No confusing tech jargon, APIs, or complex graphs. Clean, visual calendar anyone on your staff can use.' },
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
        🏪 Hookpost for Small Business — Attract Local Customers Without the Headache
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
            Try Free
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
            <li className="text-[#FF4CE2] font-semibold">Small Businesses</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF4CE2]/40 bg-[#FF4CE2]/10 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider mb-6">
          Built For Local Stores, Clinics, Restaurants & Services
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Put Your Social Media on Autopilot.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            More Local Customers, Zero Hassle.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          You have a business to run. Let Hookpost automatically publish your promotions, menus, and updates to Facebook, Instagram, and Threads every week.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Start Free for Your Business
          </Link>
          <Link href="/alternatives/hootsuite" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg">
            See Why We Beat Hootsuite
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center mb-12">Everything Your Business Needs to Stay Active</h2>
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
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Start Growing Your Business Today</h2>
          <p className="text-neutral-400 mb-8 text-lg">Set up in 2 minutes. No technical background required.</p>
          <Link href="/auth" className="inline-block px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
