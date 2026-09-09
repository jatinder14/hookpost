import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for Musicians & DJs | Hookpost',
  description:
    'Promote releases, tour dates, and behind-the-scenes clips across YouTube, Instagram, Threads, X, and Discord. For artists, bands, DJs, and labels.',
  keywords: [
    'musician social media scheduler',
    'music marketing software',
    'youtube music promotion tool',
    'dj social media manager',
    'album release social media campaign calendar',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/music-artists',
  },
};

export default function MusicArtistsLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Music Artists & Bands", item: "https://hookpost.hookstep.in/for/music-artists" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can musicians coordinate song and album releases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost lets artists schedule teaser clips, Spotify drop countdowns, and tour date flyers simultaneously across 18 networks.",
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
    { title: '🎵 Release Day Campaign Countdown', desc: 'Schedule your pre-save announcements, teaser snippets, music video drops, and listening party reminders months in advance.' },
    { title: '🎥 Short-Form Music Video Distribution', desc: 'Push audio teasers and performance clips to Instagram Reels and YouTube Shorts simultaneously without watermarks or quality loss.' },
    { title: '🎧 Tour & Live Show Announcements', desc: 'Broadcast ticket links, venue dates, and VIP pass releases to your entire fanbase across X, Facebook, and Discord channels.' },
    { title: '🤖 AI Lyric & Story Prompts', desc: 'Generate catchy hooks, story snippets, and captivating behind-the-scenes captions that boost stream counts and playlist saves.' },
    { title: '👥 Band & Manager Collaboration', desc: 'Collaborate with your manager, PR team, and bandmates in a shared workspace without sharing master passwords.' },
    { title: '📊 Fanbase Growth & Stream Analytics', desc: 'Track which video teasers generate the highest comments, shares, and Spotify/Apple Music link-in-bio clicks.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#a855f7] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#a855f7] text-white text-center font-bold text-sm py-1.5 px-4">
        🎧 Hookpost for Musicians & Artists — Promote Your Releases, Build a Diehard Fanbase
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#a855f7]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#a855f7] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#a855f7] hover:text-white px-5 py-2 rounded-full">
            Launch Free Artist Plan
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
            <li className="text-[#FF4CE2] font-semibold">Music Artists & Bands</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 text-[#a855f7] text-xs font-bold uppercase tracking-wider mb-6">
          Singers • Bands • Electronic DJs • Music Producers
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Drop Teasers on Reels, Shorts & YouTube <br />
          <span className="text-[#a855f7]">While You Make Music.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Focus on your craft in the studio. Hookpost takes care of scheduling release teasers, playlist promos, and fan engagement across all 18 social platforms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#a855f7] text-white font-bold rounded-full text-base hover:opacity-90">
            Start Free (No Credit Card) →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare Hookpost vs Buffer
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#a855f7]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The AI Social Media Copilot for Music Creators Worldwide.</p>
      </footer>
    </div>
  );
}
