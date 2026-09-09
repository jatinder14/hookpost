import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why We Rewrote Postiz: 5 Architectural Gotchas (2026)",
  description:
    "An engineering post-mortem on forking Postiz: Turbopack OOM crashes, Meta Graph API token expiry, Neon connection pools, and Claude MCP.",
  keywords: [
    "why we rewrote postiz",
    "postiz review",
    "postiz internals",
    "forking postiz",
    "postiz alternative architecture",
    "hookpost vs postiz engineering",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/guides/why-we-rewrote-postiz",
  },
};

export default function WhyWeRewrotePostizPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://hookpost.hookstep.in/guides" },
      { "@type": "ListItem", position: 3, name: "Why We Rewrote Postiz", item: "https://hookpost.hookstep.in/guides/why-we-rewrote-postiz" },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Why We Rewrote Postiz: 5 Architectural Gotchas and Battle Scars",
    description: "Detailed technical review and post-mortem of rebuilding Postiz into Hookpost.",
    image: ["https://hookpost.hookstep.in/og-image.png"],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://hookpost.hookstep.in/guides/why-we-rewrote-postiz",
    },
    datePublished: "2026-08-25T10:00:00+00:00",
    dateModified: "2026-09-04T08:00:00+00:00",
    author: {
      "@type": "Person",
      name: "Mohan Bhanushali",
      jobTitle: "Founder",
      url: "https://hookstep.in/founders",
      // No sameAs: the only URLs available are the company GitHub org and
      // LinkedIn page. Asserting those as a person's identity tells Google
      // that Mohan and Hookpost are the same entity, which is wrong and
      // weakens both. Add his personal profiles here when they exist.
      worksFor: {
        "@type": "Organization",
        name: "JR Consulting Co.",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Hookpost",
      url: "https://hookpost.hookstep.in",
      logo: "https://hookpost.hookstep.in/brand-logo.png",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "p"],
    },
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Engineering Deep Dive — Architectural Battle Scars from Rebuilding an Open-Source Social Scheduler
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.png" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
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

      <main className="max-w-[860px] mx-auto px-6 pt-10 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/alternatives" className="hover:text-white transition-colors">Alternatives</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Postiz Engineering Deep Dive</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Engineering Post-Mortem
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Why We Rewrote Postiz: <br />
            <span className="text-[#FF4CE2]">5 Architectural Gotchas &amp; Battle Scars</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Postiz gained 35,000+ GitHub stars with an ambitious vision for open-source social media management. But when we took it into real production, we hit five serious architectural limitations that forced us to rebuild it as Hookpost.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
            <span>By Mohan Bhanushali, Founder &amp; Lead Operations</span>
            <span>&bull;</span>
            <span>JR Consulting Co.</span>
            <span>&bull;</span>
            <span>September 2026</span>
          </div>
        </div>

        {/* Gotcha 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">1</span>
            Turbopack OOM Exit Code 137 on Modest VPS Hosts
          </h2>
          <p className="text-[#ccc] text-base leading-relaxed">
            Postiz is structured as an Nx monorepo using Next.js 16 with Turbopack. While local builds on 32GB developer Macs finish in under 10 seconds, running <code>next build</code> on a standard 2GB RAM / 1 vCPU cloud server triggered the Linux Out-Of-Memory killer (Exit Code 137).
          </p>
          <div className="bg-[#111] border-l-4 border-amber-500 p-4 rounded-r-xl text-sm text-[#eee]">
            <strong>The Fix:</strong> We separated the build artifact pipeline. Turbopack generates a 6.8 GB development cache, but only 46 MB of lean compiled assets are needed for runtime. We created a local CI bundling workflow that packages only production JS chunks, dropping server memory consumption from 1,900 MB down to 640 MB.
          </div>
        </section>

        {/* Gotcha 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">2</span>
            Meta Graph API v20 Error 190 (The 2-Hour Silent Disconnect)
          </h2>
          <p className="text-[#ccc] text-base leading-relaxed">
            During early testing, scheduled Instagram Reels and Facebook Pages would suddenly fail with <code>OAuthException (Code 190, Subcode 463: Error validating access token)</code> exactly two hours after account connection. Postiz was storing short-lived user tokens directly from the OAuth callback.
          </p>
          <div className="bg-[#111] border-l-4 border-amber-500 p-4 rounded-r-xl text-sm text-[#eee]">
            <strong>The Fix:</strong> We rewrote the Meta OAuth callback to immediately execute an automated exchange with <code>oauth/access_token?grant_type=fb_exchange_token</code>, securing long-lived 60-day tokens and initiating automated background renewal cron jobs before expiration.
          </div>
        </section>

        {/* Gotcha 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">3</span>
            Neon Serverless Connection Exhaustion
          </h2>
          <p className="text-[#ccc] text-base leading-relaxed">
            When connecting to cloud serverless Postgres providers like Neon, Prisma ORM in Postiz rapidly opened 20+ persistent connections during background cron syncs, throwing <code>max_client_conn reached</code> errors.
          </p>
          <div className="bg-[#111] border-l-4 border-amber-500 p-4 rounded-r-xl text-sm text-[#eee]">
            <strong>The Fix:</strong> We split database operations into dual connection strings: a PgBouncer pooled connection (<code>?pgbouncer=true&amp;connection_limit=5</code>) for runtime queries, and a dedicated <code>DIRECT_URL</code> exclusively for schema migrations.
          </div>
        </section>

        {/* Gotcha 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">4</span>
            The Western Payment Monopoly: Adding Native Razorpay Support
          </h2>
          <p className="text-[#ccc] text-base leading-relaxed">
            Postiz assumed all creators have an international USD credit card. Millions of creators across India and emerging markets rely on instant UPI (Unified Payments Interface), RuPay, and domestic banking.
          </p>
          <div className="bg-[#111] border-l-4 border-amber-500 p-4 rounded-r-xl text-sm text-[#eee]">
            <strong>The Fix:</strong> We engineered native Razorpay billing inside Hookpost with cryptographic HMAC SHA-256 webhook validation, letting creators subscribe via Google Pay, PhonePe, Paytm, NetBanking, and cards starting at ₹699/month.
          </div>
        </section>

        {/* Gotcha 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">5</span>
            AI Agent Revolution: Building the Claude MCP Server
          </h2>
          <p className="text-[#ccc] text-base leading-relaxed">
            The way creators produce content changed in 2026. Nobody wants to copy-paste between Claude Desktop or ChatGPT and a web calendar dashboard. We wanted AI agents to schedule posts autonomously via natural conversation.
          </p>
          <div className="bg-[#111] border-l-4 border-amber-500 p-4 rounded-r-xl text-sm text-[#eee]">
            <strong>The Fix:</strong> We built an official Model Context Protocol (MCP) server directly into the Hookpost ecosystem (<code>npx hookpost mcp</code>), allowing Claude Desktop, Cursor, and Windsurf to manage queues programmatically via standard JSON-RPC.
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Experience the Re-engineered Architecture
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            Enjoy 100% open-source power, reliable direct API auto-publishing, and native Claude MCP integration.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-[#FF4CE2] text-black hover:bg-white hover:text-black font-bold text-base px-10 py-4 rounded-full transition-all shadow-xl shadow-[#FF4CE2]/20"
          >
            Start Free for $0 &rarr;
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
          <Link href="/about" className="hover:underline text-[#888]">About</Link>
          <span>&bull;</span>
          <Link href="/channels" className="hover:underline text-[#888]">Channels</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
        </div>
      </footer>
    </div>
  );
}
