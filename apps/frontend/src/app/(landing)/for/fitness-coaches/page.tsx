import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Scheduler for Fitness Coaches | Hookpost',
  description:
    'Auto-schedule YouTube Shorts, X and LinkedIn posts, with Instagram and Facebook Reels once Meta approves the app. For personal trainers, gym owners, and wellness creators.',
  keywords: [
    'fitness social media scheduler',
    'instagram reels scheduler for personal trainers',
    'youtube shorts scheduler fitness',
    'gym social media software',
    'content calendar for fitness trainers',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/fitness-coaches',
  },
};

export default function FitnessCoachesLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Fitness Coaches & Gyms", item: "https://hookpost.hookstep.in/for/fitness-coaches" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can fitness trainers schedule recurring workout tips and transformation videos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Coaches can schedule weeks of workout videos and nutrition tips in one sitting and set a post to repeat on an interval from daily to monthly. YouTube publishes today; Instagram and Facebook Reels follow once Meta approves the Hookpost app.",
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
    { title: '🎬 Multi-Platform Video Auto-Publish', desc: 'Shoot one workout demo or transformation video and schedule it to YouTube Shorts, X and LinkedIn in 1 click. Instagram and Facebook Reels join once Meta approves the app.' },
    { title: '📅 Visual Content & Challenge Calendar', desc: 'Map out 30-day fitness challenges, client shoutouts, and nutrition tips weeks in advance so you can focus on training clients.' },
    { title: '🤖 AI Workout & Caption Writer', desc: 'Generate captions, workout breakdowns, rep-set guides and calls-to-action to book coaching calls with the AI assistant (Standard and Pro).' },
    { title: '📨 Telegram & Discord Community Posts', desc: 'Send daily workout tips to your Telegram channel or Discord server on the same schedule as your social posts.' },
    { title: '⏰ Your Own Posting Slots', desc: 'Set the times you want to post on each channel once, and new posts can drop into the next free slot.' },
    { title: '💵 Free Plan, Flat Pricing', desc: 'Start free with 2 channels and 30 posts a month. Standard is ₹599 / $15 a month for 5 channels and AI captions.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#10b981] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#10b981] text-black text-center font-bold text-sm py-1.5 px-4">
        💪 Hookpost for Fitness Coaches — Turn Social Followers into High-Ticket Coaching Clients
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#10b981]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#10b981] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#10b981] hover:text-black px-5 py-2 rounded-full">
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
            <li className="text-[#FF4CE2] font-semibold">Fitness Coaches & Gyms</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] text-xs font-bold uppercase tracking-wider mb-6">
          Personal Trainers • Online Coaches • Gym Studios
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Publish Workouts to Shorts, X & LinkedIn <br />
          <span className="text-[#10b981]">On Complete Autopilot.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Stop spending 3 hours a day reposting videos across apps. Hookpost publishes your YouTube Shorts, X and LinkedIn posts together with captions tuned per network. Instagram and Facebook Reels follow once Meta approves the app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#10b981] text-black font-bold rounded-full text-base hover:opacity-90">
            Start Free (No Credit Card Required) →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Why Coaches Switch from Buffer
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#10b981]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The AI Social Media Copilot for Fitness Creators Worldwide.</p>
      </footer>
    </div>
  );
}
