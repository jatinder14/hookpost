import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Automation for E-Commerce Brands | Hookpost',
  description:
    'Connect Instagram Shop, Pinterest, YouTube, and Facebook for Shopify and Amazon brands. Automated multi-channel scheduling for product launches.',
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
        name: "Does Hookpost support visual product carousels and Pinterest pins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost supports multi-image carousels on Instagram, Pinterest Pins, YouTube video showcases, and Facebook product posts.",
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
    { title: '🛍️ Flash Sale & Drop Countdown Scheduling', desc: 'Pre-schedule multi-day flash sale announcement sequences across Pinterest, Instagram, and Facebook.' },
    { title: '📌 Automated Pinterest Pin Scheduling', desc: 'Drive high-converting buyer search traffic from Pinterest with bulk image and video pin scheduling.' },
    { title: '🎬 Instagram UGC Video Publishing', desc: 'Queue user-generated content and product demos directly into Instagram Reels for maximum organic reach.' },
    { title: '🤖 AI High-Converting Product Copywriter', desc: 'Turn product feature lists into high-urgency, benefit-driven ad copy, discount announcements, and hashtags.' },
    { title: '📦 Bulk Seasonal Campaign Import', desc: 'Upload 100+ Black Friday, holiday, and summer sale creatives in a single CSV file in seconds.' },
    { title: '📊 Revenue & Traffic Conversion Analytics', desc: 'Track which social channels generate the highest engagement and click-through rates to your store.' },
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
            Start Free E-Com Trial
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
          Stop manually posting product links. Hookpost automates your Pinterest pins, YouTube demos, Instagram carousels, and flash sale announcements on complete autopilot.
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
