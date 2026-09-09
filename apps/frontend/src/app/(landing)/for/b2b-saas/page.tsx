import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Media Management for B2B SaaS Founders | Hookpost',
  description:
    'Distribute launches, changelogs, and thought leadership across LinkedIn, X, Hashnode, and DEV. Open-source scheduling for B2B SaaS and developer tools.',
  keywords: [
    'b2b saas social media scheduler',
    'developer marketing tool',
    'founder personal branding scheduler',
    'linkedin thought leadership automation',
    'changelog to social media tool',
    'devto and hashnode scheduler',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/b2b-saas',
  },
};

export default function B2BSaaSLandingPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "B2B SaaS Teams", item: "https://hookpost.hookstep.in/for/b2b-saas" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can B2B SaaS teams automate founder LinkedIn and X posts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost supports multi-author personal brand scheduling for founders and executives alongside company page updates and automated GitHub release distribution.",
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
    { title: '💼 LinkedIn & X Founder Authority Builder', desc: 'Schedule founder breakdown posts, metric milestones, and industry insights across personal profiles and company pages.' },
    { title: '🚀 Changelog & Product Launch Distribution', desc: 'Turn GitHub release notes and product updates into viral launch threads on X, LinkedIn articles, Dev.to, Hashnode, and Medium.' },
    { title: '👨‍💻 Developer-First Platforms & Webhooks', desc: 'Auto-publish directly to developer hubs including Dev.to, Medium, Hashnode, Discord, and Slack channels.' },
    { title: '🤖 AI Repurposing Engine', desc: 'Paste a technical blog post or changelog URL and watch Hookpost generate 10 high-converting bite-sized social posts.' },
    { title: '⚡ Dynamic Queue & Auto-Recycle', desc: 'Keep your top evergreen lead generation posts in a high-performing automated rotation to drive continuous demo signups.' },
    { title: '🛡️ Self-Hosted or Cloud Option', desc: 'Deploy with Docker or use our managed high-speed cloud platform with complete data privacy and zero vendor lock-in.' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#3b82f6] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#3b82f6] text-white text-center font-bold text-sm py-1.5 px-4">
        🚀 Hookpost for B2B SaaS — Drive Demos & Revenue with Automated Thought Leadership & Product Launches
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#3b82f6]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#3b82f6] px-4 py-2 border border-white/20 rounded-full">
            Log In
          </Link>
          <Link href="/auth" className="text-sm font-semibold text-black bg-white hover:bg-[#3b82f6] hover:text-white px-5 py-2 rounded-full">
            Start Free SaaS Trial
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
            <li className="text-[#FF4CE2] font-semibold">B2B SaaS Teams</li>
          </ol>
        </nav>

        <div className="inline-block px-4 py-1.5 rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-bold uppercase tracking-wider mb-6">
          SaaS Founders • DevTools • Growth Marketers • Tech Startups
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
          Distribute Product Launches & Growth <br />
          <span className="text-[#3b82f6]">Across LinkedIn, X & Dev Hubs.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 max-w-[800px] mx-auto mb-10 leading-relaxed">
          Transform your startup's changelogs, feature drops, and founder insights into continuous organic inbound pipeline across 18 networks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-[#3b82f6] text-white font-bold rounded-full text-base hover:opacity-90">
            Start Free SaaS Workspace (No CC) →
          </Link>
          <Link href="/alternatives/buffer" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full text-base hover:bg-white/10">
            Compare vs Postiz & Buffer
          </Link>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#3b82f6]/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionFaq items={faqSchema.mainEntity} />



      <footer className="w-full border-t border-neutral-800 py-12 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Hookpost • The AI Social Media Copilot for High-Growth Tech Companies Worldwide.</p>
      </footer>
    </div>
  );
}
