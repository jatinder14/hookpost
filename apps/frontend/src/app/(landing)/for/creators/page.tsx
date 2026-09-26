import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { PUBLISHABLE_CHANNEL_COUNT } from '../../channels/channel-count';

export const metadata: Metadata = {
  title: 'Social Media Scheduler for Creators & Influencers | Hookpost',
  description:
    'Schedule YouTube Shorts, X threads and LinkedIn carousels from one calendar, with Instagram Reels once Meta approves the app. Free plan for creators and influencers.',
  keywords: [
    'social media scheduler for creators',
    'free reel scheduler',
    'youtube shorts scheduler',
    'instagram carousel scheduler free',
    'best content calendar for influencers',
    'buffer alternative for creators',
    'hootsuite alternative for students',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/creators',
  },
};

export default function CreatorsLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Content Creators", item: "https://hookpost.hookstep.in/for/creators" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Hookpost auto-post Shorts and Reels without mobile notifications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For YouTube Shorts, yes: Hookpost uploads through the YouTube Data API, so the video goes live at the scheduled time with nothing to tap. Instagram Reels work the same way through the Instagram Graph API, but new accounts cannot connect Instagram until Meta approves the Hookpost app.",
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
    { title: '🎬 Multi-Platform Video Auto-Publish', desc: 'Upload once and schedule to YouTube Shorts, X, LinkedIn and Bluesky together, with no confirmation notification to tap. Instagram Reels join once Meta approves the app.' },
    { title: '✍️ Built-in AI Hook & Caption Generator', desc: 'Generate caption variations, hook lines and hashtags with the AI assistant, on Standard and Pro.' },
    { title: '📅 Visual Drag & Drop Calendar', desc: 'Plan an entire month of content in one sitting, with a preview of how each post will look on its network.' },
    { title: '💸 Free Plan for Students & Emerging Creators', desc: '2 channels and 30 posts a month for free, no credit card. AI writing starts on Standard at ₹599 / $15 a month.' },
    { title: '🧵 X Threads & LinkedIn Carousels', desc: 'Draft and schedule X threads and LinkedIn image carousels from the same editor.' },
    { title: '⏰ Your Own Posting Slots', desc: 'Set the times you want to post on each channel once, and new posts can drop into the next free slot.' },
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
        ⚡ Hookpost for Creators — Post to {PUBLISHABLE_CHANNEL_COUNT} Networks, Start at $0
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
            <li className="text-[#FF4CE2] font-semibold">Content Creators</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FF4CE2]/40 bg-[#FF4CE2]/10 text-[#FF4CE2] text-xs font-bold uppercase tracking-wider mb-6">
          Built For Solo Creators, Reelmakers & YouTubers
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Schedule Once. Publish Across Your Channels.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4CE2] to-cyan-400">
            Shorts, X, LinkedIn & Bluesky in 1 Click.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Stop manually posting on 5 different apps every single day. Hookpost lets you batch-schedule 30 days of video, carousels, and threads in 1 hour.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Get Started Free (No Credit Card)
          </Link>
          <Link href="/compare" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 hover:border-white text-white font-medium text-lg">
            See Hookpost vs Buffer
          </Link>
        </div>

        {/* Entity Facts Block for AI Citability & GEO */}
        <div className="max-w-[860px] mx-auto mt-12 p-6 rounded-2xl bg-neutral-900/80 border border-white/10 text-left">
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            <strong className="text-white">Hookpost</strong> is an open-source (AGPLv3) multi-network social media scheduler built by <strong className="text-white">JR Consulting Co.</strong> (founded by Mohan Bhanushali). It serves as a flat-rate, modern alternative to Buffer and Hootsuite, letting creators and influencers auto-publish to X, LinkedIn, YouTube Shorts, Bluesky, Telegram, Discord, and Slack without per-channel fees.
          </p>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-black text-center mb-12">Superpowers Built For Creators</h2>
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
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Grow Your Audience?</h2>
          <p className="text-neutral-400 mb-8 text-lg">Connect a channel and schedule your first post in under five minutes - free, no card required.</p>
          <Link href="/auth" className="inline-block px-8 py-4 rounded-full bg-[#FF4CE2] text-black font-bold text-lg hover:scale-105 transition-all">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
