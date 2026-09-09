import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Hookpost & JR Consulting Co. — Open-Source Mission",
  description:
    "Learn about Hookpost, an AGPL open-source social media management engine built by JR Consulting Co. Empowering creators and agencies with data sovereignty.",
  keywords: [
    "about hookpost",
    "hookpost open source",
    "jr consulting co hookpost",
    "postiz fork hookpost",
    "open source social media company",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/about",
  },
};

export default function AboutPage() {
  // Reference the sitewide Organization (declared with @id in the landing
  // layout) instead of re-declaring it — two Organization entities with
  // different sameAs handles make the entity ambiguous to search/AI engines.
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: "https://hookpost.hookstep.in/about",
    mainEntity: { "@id": "https://hookpost.hookstep.in/#organization" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://hookpost.hookstep.in/about" },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — Built for Creators, Developers &amp; Agencies with 100% Open-Source AGPL Code
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.webp" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
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
            className="text-sm font-medium bg-white text-black hover:bg-[#FF4CE2] hover:text-white transition-all px-5 py-2 rounded-full font-semibold"
          >
            Start Free for $0
          </Link>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 pt-12 pb-24 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">About</li>
          </ol>
        </nav>

        <div className="space-y-6">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Our Mission &amp; Philosophy
          </div>
          <h1 className="text-[36px] sm:text-[54px] font-black tracking-tight text-white leading-tight">
            We Believe You Should <span className="text-[#FF4CE2]">Own Your Social Growth Stack</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Hookpost was born out of frustration with expensive SaaS monopolies that charge $6 per social profile, lock user data behind proprietary black boxes, and force yearly corporate contracts.
          </p>
        </div>

        {/* Core Values */}
        <section className="grid sm:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/10 p-7 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FF4CE2]">01.</span> Complete Data Sovereignty
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Every line of Hookpost is licensed under AGPL-3.0. You can run the entire stack on your own Docker or Kubernetes infrastructure with total control over customer data and OAuth credentials.
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-7 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FF4CE2]">02.</span> AI Agent Native (MCP)
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              We were the first social scheduler to ship an official Model Context Protocol (MCP) server, allowing Claude Desktop and autonomous AI agents to manage queues via standard JSON-RPC.
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-7 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FF4CE2]">03.</span> Global &amp; Regional Inclusivity
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Unlike Western tools that only accept USD credit cards, Hookpost integrates Razorpay for instant UPI (Google Pay, PhonePe, Paytm), RuPay, NetBanking, and Indian cards at transparent regional pricing.
            </p>
          </div>

          <div className="bg-[#111] border border-white/10 p-7 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#FF4CE2]">04.</span> Zero Artificial Paywalls
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              We do not believe in charging students, emerging creators, or small teams hundreds of dollars. Our $0 starter tier is permanent and needs no card, and paid plans scale from 5 channels up to 100.
            </p>
          </div>
        </section>

        {/* Leadership.
            HookStep is the parent business - technical recruiting - so Sakshi's
            title is her HookStep role, stated as such rather than reframed as a
            Hookpost title she does not hold. Mohan is named as Hookpost's
            founder, which is what our Organization schema says. Only first
            names are published on hookstep.in; Mohan's surname is used because
            it already appears in that schema. */}
        <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white">The people behind Hookpost</h2>
            <p className="mt-3 text-base text-white/70 leading-relaxed">
              Hookpost is built by JR Consulting Co., part of HookStep. The same
              team runs both.
            </p>
          </div>

          <div className="grid max-w-[640px] gap-6 sm:grid-cols-2">
            {[
              {
                slug: 'mohan',
                name: 'Mohan Bhanushali',
                role: 'Founder, Hookpost',
                bio: 'Operations lead \u2014 process, partnerships and delivery. Founder of Hookpost.',
              },
              {
                slug: 'sakshi',
                name: 'Sakshi',
                role: 'Head of Sales, HookStep',
                bio: 'Builds client relationships and helps companies hire exceptional tech talent, fast.',
              },
            ].map((person) => (
              <div
                key={person.slug}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center"
              >
                <img
                  src={`/team/${person.slug}.jpg`}
                  alt={person.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-[#FF4CE2]/40"
                />
                <h3 className="mt-4 font-bold text-white">{person.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#FF4CE2]">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base text-white/70 leading-relaxed">
            The engineering team has spent hundreds of hours tuning Meta Graph API
            rate limits, cutting the Turbopack build down to something a small VPS
            can hold, and making scheduled publishing survive a worker restart
            with Temporal.io.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://github.com/hookstep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-2.5 rounded-full border border-white/10 transition-colors"
            >
              GitHub Organization &rarr;
            </a>
            <Link
              href="/guides/claude-mcp-social-media"
              className="inline-flex items-center gap-2 bg-[#FF4CE2]/10 hover:bg-[#FF4CE2]/20 text-[#FF4CE2] font-medium text-sm px-5 py-2.5 rounded-full border border-[#FF4CE2]/30 transition-colors"
            >
              Claude MCP Guide &rarr;
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Join the Open-Source Social Movement
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            Create an account in 30 seconds or deploy your own self-hosted Docker instance.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-[#FF4CE2] text-black hover:bg-white hover:text-black font-bold text-base px-10 py-4 rounded-full transition-all shadow-xl shadow-[#FF4CE2]/20"
          >
            Get Started for Free &rarr;
          </Link>
        </div>
      </main>

      <footer className="w-full bg-[#141414] border-t border-[#262626] py-10 px-6 text-center text-xs text-[#666] space-y-2">
        <p>&copy; 2026 JR Consulting Co. / Hookpost. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/privacy" className="hover:underline text-[#888]">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:underline text-[#888]">Terms of Service</Link>
          <span>&bull;</span>
          <Link href="/channels" className="hover:underline text-[#888]">Channels</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
          <span>&bull;</span>
          <Link href="/for" className="hover:underline text-[#888]">Solutions</Link>
        </div>
      </footer>
    </div>
  );
}
