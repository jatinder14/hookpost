import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Social Media Scheduler for Students | Hookpost',
  description:
    'Schedule YouTube Shorts, X, Discord and Telegram posts on autopilot, with Instagram once Meta approves. Free plan for students, teen creators, and streamers - no card needed.',
  keywords: [
    'social media scheduler for students',
    'free instagram reels scheduler',
    'youtube shorts auto poster',
    'hookpost hookstep',
    'content creator tools for teenagers',
    'student content creator free tools',
    'best free social media app for kids and students',
    'discord community scheduler',
    'free buffer alternative for students',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/students-young-creators',
  },
};

export default function StudentsYoungCreatorsPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Students & Young Creators", item: "https://hookpost.hookstep.in/for/students-young-creators" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can students build a personal brand for free with Hookpost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The free plan covers 2 channels and 30 posts a month with no credit card, enough to keep LinkedIn and X active while you build a portfolio. AI writing is on the paid plans.",
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
        A Free Plan for Students & Emerging Creators Worldwide 🎓🚀
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-bold bg-[#FF4CE2] text-black px-5 py-2 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,76,226,0.5)]"
          >
            Get Free Access
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-bold uppercase tracking-widest mb-6">
            For Students, Gamers & Young Creators
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Build Your Audience While You Sleep or Study. <span className="text-[#FF4CE2]">Free to Start.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-8">
            Never stress about posting times between classes. Auto-post your short-form videos and clips to YouTube Shorts, X, Discord, Telegram and Bluesky from a single dashboard. Instagram Reels and Threads follow once Meta approves the Hookpost app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-[#FF4CE2] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(255,76,226,0.4)]"
            >
              Start Free Today (No Card Required)
            </Link>
            <Link
              href="/alternatives/postiz"
              className="bg-neutral-900 border border-neutral-700 text-white font-medium px-8 py-4 rounded-xl text-lg hover:border-neutral-500 transition-all"
            >
              Compare Features
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <div className="text-3xl mb-4">⚡</div>
            <h2 className="text-xl font-bold mb-2">Cross-Post Short Form Video</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Upload your video once and schedule it to YouTube Shorts, X and Bluesky together. Instagram and Facebook Reels join once Meta approves the app.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-xl font-bold mb-2">Viral AI Caption & Hook Ideas</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Stuck on titles? The AI assistant drafts hooks, captions and hashtags. It is on Standard and Pro, not the free plan.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <div className="text-3xl mb-4">💰</div>
            <h2 className="text-xl font-bold mb-2">A Free Plan That Does Not Expire</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Buffer&apos;s free plan covers 3 channels and 10 scheduled posts per channel; Hootsuite has no free plan and starts at $99 per user a month. Hookpost&apos;s free plan gives you 2 channels and 30 posts a month, no card required. AI writing and the API are on paid plans.
            </p>
          </div>
        </div>
        <SectionFaq items={faqSchema.mainEntity} />

      </main>
    </div>
  );
}
