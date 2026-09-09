import { SectionFaq } from "../../SectionFaq";
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

export const metadata: Metadata = {
  title: 'Enterprise Social Media Management, Self-Hosted | Hookpost',
  description:
    'Self-hosted, secure, open-source social media management for enterprise companies, marketing departments, and cross-functional corporate teams.',
  keywords: [
    'enterprise social media management',
    'self hosted social media scheduler docker',
    'open source hootsuite enterprise alternative',
    'secure social media publishing platform',
    'hookpost hookstep',
  ],
  alternates: {
    canonical: 'https://hookpost.hookstep.in/for/enterprise-teams',
  },
};

export default function EnterpriseTeamsPage() {

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://hookpost.hookstep.in/for" },
      { "@type": "ListItem", position: 3, name: "Enterprise Teams", item: "https://hookpost.hookstep.in/for/enterprise-teams" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can Hookpost be deployed on-premise for strict compliance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is 100% open-source under the AGPL license and can be self-hosted via Docker Compose behind corporate firewalls with full data sovereignty.",
        },
      },
      {
        "@type": "Question",
        name: "Is Hookpost really free to get started?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost includes a generous $0 starter tier with no credit card required. Upgrade to Pro for 30 channels, 5,000 posts a month and the AI copilot.",
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
        Enterprise-Grade Security & Self-Hosted Deployments 🏢🔒
      </div>
      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">Hook<span className="text-[#FF4CE2]">post</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]">Log In</Link>
          <Link href="/auth" className="text-sm font-bold bg-[#FF4CE2] text-black px-5 py-2 rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(255,76,226,0.5)]">Get Started</Link>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 sm:px-12 pt-16 pb-24 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-bold uppercase tracking-widest mb-6">
          For Enterprise Organizations & Marketing Teams
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Full Data Sovereignty & Multi-Tenant Workspaces. <span className="text-[#FF4CE2]">Deploy Anywhere.</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          Deploy on your own private cloud or use our secure global infrastructure. Granular permissions, approval workflows, and audit trails for compliant corporate social marketing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth" className="bg-[#FF4CE2] text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(255,76,226,0.4)]">
            Explore Enterprise Cloud
          </Link>
        </div>
        {/* Persona-specific detail. This page previously stopped after the hero
            and FAQ - about 120 words against 290-460 on its sibling /for/ pages -
            which reads as an unfinished template rather than a page worth
            ranking. Every claim below is checked against pricing.ts. */}
        <section className="w-full max-w-[1200px] mx-auto px-6 py-12 text-left">
          <h2 className="text-3xl font-black text-center mb-12">Built for teams that answer to someone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
            { title: 'Self-host behind your firewall', desc: 'AGPL-3.0 and a Docker Compose stack you run on your own infrastructure. Posts, tokens and media never leave hardware you control.' },
            { title: 'Approval before anything publishes', desc: 'Draft, review and approve inside the calendar, so nothing reaches a corporate account without a second pair of eyes.' },
            { title: 'Unlimited team members on Team and above', desc: 'Seats are not metered. Add the whole marketing function without the bill moving.' },
            { title: 'Publishing that survives a restart', desc: 'Scheduling runs on Temporal workflows. If a worker dies mid-publish it resumes from its last committed step rather than dropping the post or sending it twice.' },
            { title: 'Webhooks into your own systems', desc: '30 webhooks on Pro, so publishing events can reach your data warehouse, Slack or an internal audit log.' },
            { title: `${pricing.PRO.channel} channels on Pro, ${pricing.ULTIMATE.channel} on Ultimate`, desc: 'Each connected profile or page counts as one channel, so a brand with several regional pages fits in a single workspace.' },
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
