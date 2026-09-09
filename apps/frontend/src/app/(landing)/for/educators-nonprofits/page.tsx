import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CHANNEL_COUNT } from '../../channels/channel-count';

export const metadata: Metadata = {
  title: 'Social Media Management for Non-Profits | Hookpost',
  description:
    'Affordable and free open-source social media management for educators, universities, charities, NGOs, and non-profit organizations worldwide.',
  keywords: [
    'social media scheduler for nonprofits',
    'social media tool for schools and teachers',
    'free buffer alternative for charities',
    'open source social media for universities',
    'hookpost hookstep',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/educators-nonprofits',
  },
};

export default function EducatorsNonprofitsPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Educators & Nonprofits", item: "https://hookpost.hookstep.in/for/educators-nonprofits" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Hookpost free for educational projects and charities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost offers a permanent $0 free tier that allows educators, universities, and charities to schedule posts across social channels at zero cost.",
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
        Empowering Educators, Charities & Non-Profits Around the Globe 🌍🤝
      </div>
      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">Hook<span className="text-[#FF4CE2]">post</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]">Log In</Link>
          <Link href="/auth" className="text-sm font-bold bg-[#FF4CE2] text-black px-5 py-2 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,76,226,0.5)]">Start Free</Link>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-16 pb-24 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-bold uppercase tracking-widest mb-6">
          For Non-Profits, NGOs & Educators
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Amplify Your Mission Without Draining Your Budget. <span className="text-[#FF4CE2]">$0 SaaS Fees.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          Share your cause across {CHANNEL_COUNT} social channels, coordinate community volunteers, and keep donors updated without paying extortionate enterprise software subscriptions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth" className="bg-[#FF4CE2] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(255,76,226,0.4)]">
            Start Free for Non-Profits
          </Link>
        </div>
        {/* Persona-specific detail. This page previously stopped after the hero
            and FAQ - about 120 words against 290-460 on its sibling /for/ pages -
            which reads as an unfinished template rather than a page worth
            ranking. Every claim below is checked against pricing.ts. */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-12 text-left">
          <h2 className="text-3xl font-black text-center mb-12">Made to work on a small budget</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
            { title: 'A free tier that does not expire', desc: '2 channels and 30 posts a month, no credit card, no trial clock. Enough for a department or a small charity to run its whole calendar.' },
            { title: 'Self-host at no licence cost', desc: 'AGPL-3.0. Run it on a university server or a cheap VPS and pay nothing per seat or per channel, forever.' },
            { title: 'Reach students where they already are', desc: 'Discord, Telegram, Lemmy and Bluesky alongside Instagram and YouTube — the places a campus audience actually reads.' },
            { title: 'Publish to a blog in the same breath', desc: 'WordPress, Medium, Hashnode and DEV are channels here, so a long-form update and its social posts go out together.' },
            { title: 'Pay in rupees', desc: 'Billing runs through Razorpay with UPI and NetBanking, so there is no foreign-card requirement or forex markup.' },
            { title: 'Hand over without retraining', desc: 'A visual calendar that a volunteer or a student worker can pick up, and unlimited team members from the Team plan up.' },
            ].map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-[#FF4CE2]/50 transition-all">
                <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <SectionFaq items={faqSchema.mainEntity} />

      </main>
    </div>
  );
}
