import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for Healthcare Clinics | Hookpost',
  description:
    'Share patient education and build community authority across Instagram, LinkedIn, Facebook, and YouTube. Scheduling for clinics, dentists, therapists.',
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
          text: "Yes. Hookpost includes a generous $0 starter tier with no credit card required. Upgrade to Pro for unlimited accounts and advanced AI copilot tools.",
        },
      },
    ],
  };

  const features = [
    { title: '🩺 Patient Education & Wellness Tips', desc: 'Pre-schedule weekly preventative care guides, dental hygiene tips, and clinic announcements across all channels.' },
    { title: '🔒 Enterprise Role & Approval Workflows', desc: 'Ensure every post is reviewed and approved by lead physicians or practice managers before going live.' },
    { title: '📍 Clinic Hours & Practitioner Updates', desc: 'Share seasonal clinic hours, flu shot availability, and new practitioner introductions on your Facebook Page and Instagram profile.' },
    { title: '🤖 AI Medical & Wellness Explainer Prompts', desc: 'Transform complex medical studies and clinic FAQs into clear, patient-friendly social posts and infographics.' },
    { title: '🏥 Multi-Specialty & Branch Management', desc: 'Organize multiple specialty departments (e.g. Pediatrics, Dermatology, Orthopedics) into segregated workspaces.' },
    { title: '📊 Patient Growth & Engagement Metrics', desc: 'Track which educational posts generate the highest patient inquiries, shares, and website booking clicks.' },
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
            Start Free Practice Trial
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
          <span className="text-[#06b6d4]">Across All Social Networks.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Provide valuable health guidance to your local community with zero marketing stress. Hookpost automates your clinic's patient outreach on Instagram, LinkedIn, Facebook, and YouTube.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#06b6d4] text-black font-bold rounded-full text-base hover:opacity-90">
            Start Free Clinic Trial →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare Hookpost vs Sprout Social
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
