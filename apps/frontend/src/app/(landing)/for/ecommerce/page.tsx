import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Automation for E-Commerce Brands | Hookpost',
  description:
    'Schedule product launches to YouTube, X, Telegram, Discord and your Listmonk email list from one calendar. Instagram and Facebook follow once Meta approves the app.',
  keywords: [
    'social media scheduler for ecommerce',
    'shopify social media automation',
    'pinterest pin scheduler bulk',
    'product launch social campaign scheduler',
    'dtc brand content calendar',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/ecommerce',
  },
};

export default function EcommerceLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "E-Commerce Brands", item: "https://hookpost.hookstep.in/for/ecommerce" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Hookpost support product carousels and Pinterest pins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Partly, today. LinkedIn image carousels, X image posts and YouTube videos publish now. Pinterest can be connected but cannot publish until Pinterest grants Standard API access, and new accounts cannot connect Instagram or Facebook until Meta approves the Hookpost app.",
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
    { title: '🛍️ Flash Sale & Drop Countdown Scheduling', desc: 'Pre-schedule multi-day flash sale announcement sequences across X, Telegram and Discord. Instagram and Facebook join once Meta approves the app.' },
    { title: '🎬 YouTube Product Demos', desc: 'Schedule product demos and unboxing videos to YouTube, including Shorts, from the same calendar as your social posts.' },
    { title: '📧 Drop Emails via Listmonk', desc: 'Send the same drop announcement to your Listmonk mailing list from the calendar that schedules your social posts.' },
    { title: '🤖 AI High-Converting Product Copywriter', desc: 'Turn product feature lists into benefit-driven copy, discount announcements and hashtags with the AI assistant (Standard and Pro).' },
    { title: '🔌 Bulk Scheduling via API', desc: 'Queue a whole season of sale posts from your own script or an n8n workflow through the public REST API (Standard and Pro).' },
    { title: '🔁 Repeating Promo Posts', desc: 'Set an always-on offer to repeat on a fixed interval, from daily to monthly, without rescheduling it by hand.' },
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
        🛍️ Hookpost for E-Commerce — Convert Social Followers into Store Revenue
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
            <li className="text-[#FF4CE2] font-semibold">E-Commerce Brands</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF4CE2]/40 bg-[#FF4CE2]/10 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider mb-6">
          Built For Shopify, DTC Brands & Amazon Sellers
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Automate Your Product Drops.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            Scale Traffic, Sales & Social Proof.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Stop manually posting product links. Hookpost schedules your YouTube demos, X and Telegram announcements and flash sale emails from one calendar. Instagram, Facebook and Pinterest follow once those platforms approve the app.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Start Free for E-Commerce
          </Link>
          <Link href="/alternatives/publer" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg">
            Compare with Publer
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center mb-12">Everything You Need to Scale DTC Sales</h2>
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
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Turn Social Engagement into Store Orders</h2>
          <p className="text-neutral-400 mb-8 text-lg">Set up your multi-channel e-commerce calendar in under 5 minutes.</p>
          <Link href="/auth" className="inline-block px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
