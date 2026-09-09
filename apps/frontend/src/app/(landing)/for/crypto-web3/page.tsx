import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for Web3 & Crypto | Hookpost',
  description:
    'Auto-publish to X, Discord, Telegram, Bluesky, Nostr, and Lemmy from one calendar. Built for Web3 builders, crypto protocols, and DAOs.',
  keywords: [
    'crypto social media scheduler',
    'web3 marketing tool',
    'nostr scheduler',
    'telegram channel auto post',
    'discord announcement scheduler',
    'nft community social manager',
    'nostr social media tool',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/crypto-web3',
  },
};

export default function CryptoWeb3LandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Web3 & Crypto Projects", item: "https://hookpost.hookstep.in/for/crypto-web3" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can Hookpost schedule announcements across X and Telegram?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost allows Web3 teams to simultaneously publish announcements across X, Telegram, Discord, Threads, and LinkedIn from a single dashboard.",
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
    { title: '🪐 Native Web3 & Decentralized Socials', desc: 'Publish simultaneously to Nostr, Bluesky, Lemmy, and X (Twitter) without copying and pasting across tabs.' },
    { title: '📢 Discord & Telegram Announcement Bot', desc: 'Broadcast alpha, roadmap updates, and community news straight into Telegram channels and Discord announcement feeds on a timed schedule.' },
    { title: '⚡ 24/7 Global Timezone Scheduling', desc: 'Your crypto audience never sleeps. Queue 24-hour round-the-clock dispatches targeting Asia, Europe, and US market sessions.' },
    { title: '🛡️ Multi-Sig & Multi-Admin Security', desc: 'Empower community managers and moderators without sharing master private keys or raw social account logins.' },
    { title: '🤖 AI Token & Community Copilot', desc: 'Turn technical whitepapers and GitHub release notes into viral Twitter threads, Discord highlights, and Nostr notes.' },
    { title: '📊 On-Chain & Cross-Channel Engagement', desc: 'Measure which social posts drive the highest referral traffic, engagement spikes, and community member joins.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#6366f1] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#6366f1] text-white text-center font-medium text-sm py-1.5 px-4">
        ⚡ Hookpost for Web3 — The Unified Social Operating System for Crypto, DAOs & Protocol Teams
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#6366f1]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#6366f1] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#6366f1] hover:text-white px-5 py-2 rounded-full">
            Launch Free Web3 Workspace
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
            <li className="text-[#FF4CE2] font-semibold">Web3 & Crypto Projects</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#6366f1]/40 bg-[#6366f1]/10 text-[#6366f1] text-xs font-bold uppercase tracking-wider mb-6">
          Web3, Decentralized Social & Crypto Marketing
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          One Calendar for X, Telegram, Discord, <br />
          <span className="text-[#6366f1]">Nostr, Bluesky & Beyond.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Traditional schedulers ignore Web3. Hookpost natively integrates Web2 (X, YouTube, LinkedIn, Discord) and Web3 (Nostr, Bluesky, Lemmy) into one high-speed AI calendar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#6366f1] text-white font-bold rounded-full text-base hover:opacity-90">
            Start Free Web3 Trial (No CC Required) →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare vs Buffer & Postiz
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#6366f1]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The Open-Source Social Media Copilot for Web3 Teams Worldwide.</p>
      </footer>
    </div>
  );
}
