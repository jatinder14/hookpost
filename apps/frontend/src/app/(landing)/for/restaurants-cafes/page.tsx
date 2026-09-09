import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Scheduler for Restaurants & Cafes | Hookpost',
  description:
    'Schedule daily specials, menu reels, and Facebook Page updates from one calendar. Social media scheduling for restaurants, cafes, and bars.',
  keywords: [
    'restaurant social media scheduler',
    'cafe instagram marketing tool',
    'facebook page scheduler for restaurants',
    'food menu reels scheduler',
    'local restaurant marketing software',
    'hospitality social media calendar',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/restaurants-cafes',
  },
};

export default function RestaurantsCafesLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Restaurants & Cafes", item: "https://hookpost.hookstep.in/for/restaurants-cafes" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can restaurants schedule daily menu specials and weekend events?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost allows cafe owners and restaurant managers to schedule daily specials, happy hour reminders, and chef reels days in advance.",
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
    { title: '📍 Daily Specials on Facebook & Instagram', desc: 'Keep your Page and profile active with daily menu specials, happy hour times, and holiday hours.' },
    { title: '🍔 Visual Food & Drink Reels Scheduler', desc: 'Publish mouthwatering kitchen prep videos and cocktail creation reels across Instagram, Facebook, and YouTube Shorts simultaneously.' },
    { title: '⏰ Day-Part & Weekend Specials Automation', desc: 'Schedule lunch specials at 11:00 AM and weekend brunch promotions on Thursday evening on recurring automated slots.' },
    { title: '🤖 AI Menu & Event Description Assistant', desc: 'Generate appetizing captions for new seasonal dishes, wine tastings, and live music nights in seconds.' },
    { title: '👥 Multi-Location Restaurant Workspaces', desc: 'Manage 5, 10, or 50 restaurant branches from one central dashboard with separate location branding and team permissions.' },
    { title: '💬 Review & Engagement Tracking', desc: 'Monitor customer interactions, comments, and mentions across all platforms from a single unified inbox.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#f59e0b] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#f59e0b] text-black text-center font-bold text-sm py-1.5 px-4">
        🍽️ Hookpost for Restaurants & Cafes — Pack Tables & Boost Walk-in Foot Traffic with Automated Socials
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#f59e0b]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#f59e0b] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#f59e0b] hover:text-black px-5 py-2 rounded-full">
            Start Free Restaurant Trial
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
            <li className="text-[#FF4CE2] font-semibold">Restaurants & Cafes</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-6">
          Restaurants • Coffee Shops • Bakeries • Bars & Breweries
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Schedule Mouth-Watering Specials <br />
          <span className="text-[#f59e0b]">Across Instagram, Facebook & Google.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          While you run a bustling kitchen and provide exceptional guest hospitality, Hookpost keeps your social feeds and Google profile full of daily specials and event promotions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#f59e0b] text-black font-bold rounded-full text-base hover:opacity-90">
            Start Free Trial (Zero Setup Fees) →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare Hookpost vs Competitors
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#f59e0b]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The Open-Source Social Media Copilot for Hospitality Businesses Worldwide.</p>
      </footer>
    </div>
  );
}
