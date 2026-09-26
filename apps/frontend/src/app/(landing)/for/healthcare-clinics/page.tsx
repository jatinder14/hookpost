import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for Healthcare Clinics | Hookpost',
  description:
    'Share patient education across LinkedIn, YouTube and X, with Instagram and Facebook once Meta approves the app. Scheduling for clinics, dentists, therapists.',
  keywords: [
    'healthcare social media scheduler',
    'medical practice social media tool',
    'dental clinic marketing software',
    'doctor social media management',
    'health clinic content calendar',
    'wellness practitioner social media scheduler',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/healthcare-clinics',
  },
};

export default function HealthcareClinicsLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Healthcare & Wellness Clinics", item: "https://hookpost.hookstep.in/for/healthcare-clinics" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can clinics coordinate appointments and educational health tips?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost provides visual calendars to organize preventive wellness tips, doctor spotlights, and clinic schedule announcements.",
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
    { title: '🩺 Patient Education & Wellness Tips', desc: 'Pre-schedule weekly preventative care guides, dental hygiene tips, and clinic announcements across all channels.' },
    { title: '🔒 Drafts & Review Links', desc: 'Save posts as drafts and share a preview link so a lead physician or practice manager can review and comment before anything is scheduled.' },
    { title: '📍 Clinic Hours & Practitioner Updates', desc: 'Share seasonal clinic hours, flu shot availability, and new practitioner introductions on LinkedIn and X, and on your Facebook Page and Instagram once Meta approves the app.' },
    { title: '🤖 AI Medical & Wellness Explainer Prompts', desc: 'Turn clinic FAQs and study summaries into clear, patient-friendly social posts with the AI assistant (Standard and Pro).' },
    { title: '🏥 Multi-Specialty & Branch Management', desc: 'Group each department or branch (e.g. Pediatrics, Dermatology, Orthopedics) as a customer and filter the calendar to one at a time.' },
    { title: '📚 Blog and Social Together', desc: 'Publish a long-form article to WordPress and schedule the social posts that point to it from the same calendar.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#06b6d4] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#06b6d4] text-black text-center font-bold text-sm py-1.5 px-4">
        🩺 Hookpost for Healthcare — Build Patient Trust & Practice Authority with Educational Social Media
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#06b6d4]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#06b6d4] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#06b6d4] hover:text-black px-5 py-2 rounded-full">
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
            <li className="text-[#FF4CE2] font-semibold">Healthcare & Wellness Clinics</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#06b6d4]/40 bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-bold uppercase tracking-wider mb-6">
          Dental Clinics • Medical Practices • Physical Therapy • Mental Health
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Educate Patients & Build Trust <br />
          <span className="text-[#06b6d4]">Across Your Social Channels.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Provide valuable health guidance to your local community with zero marketing stress. Hookpost schedules your clinic's patient outreach on LinkedIn, YouTube and X, with Instagram and Facebook to follow once Meta approves the app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#06b6d4] text-black font-bold rounded-full text-base hover:opacity-90">
            Start Free →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare Hookpost vs Buffer
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#06b6d4]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The AI Social Media Copilot for Healthcare Practices Worldwide.</p>
      </footer>
    </div>
  );
}
