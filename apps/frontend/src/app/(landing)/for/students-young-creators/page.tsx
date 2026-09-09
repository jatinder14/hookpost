import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Social Media Scheduler for Students | Hookpost',
  description:
    'Schedule Instagram Reels, YouTube Shorts, Threads, and Discord posts on autopilot. Free for students, teen creators, and streamers - no card needed.',
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
          text: "Yes. Hookpost provides a full-featured $0 free tier with no credit card required, perfect for students building portfolios on LinkedIn and X.",
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
        100% Free Forever for Students & Emerging Creators Worldwide 🎓🚀
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
            Build Your Audience While You Sleep or Study. <span className="text-[#FF4CE2]">100% Free.</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-8">
            Never stress about posting times between classes. Auto-post your short-form videos and clips to Instagram Reels, YouTube Shorts, Threads, X, Discord, and Telegram from a single dashboard.
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
              Upload your video once. Hookpost automatically formats and schedules it across Instagram Reels, YouTube Shorts, and Facebook Reels simultaneously.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-xl font-bold mb-2">Viral AI Caption & Hook Ideas</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Stuck on titles? Built-in AI generates trending viral hooks, captions, and hashtag clusters tailored for young audiences.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
            <div className="text-3xl mb-4">💰</div>
            <h2 className="text-xl font-bold mb-2">$0 Forever Free Tier</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Unlike Buffer or Hootsuite that charge $15-$99/month, Hookpost gives students and young creators genuine free access with zero hidden paywalls.
            </p>
          </div>
        </div>
        <SectionFaq items={faqSchema.mainEntity} />

      </main>
    </div>
  );
}
