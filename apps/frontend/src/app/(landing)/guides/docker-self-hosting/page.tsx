import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Self-Host a Social Media Scheduler with Docker (2026)",
  description:
    "Complete step-by-step guide to self-hosting Hookpost using Docker Compose. Deploy an open-source social media management engine on your VPS in under 5 minutes.",
  keywords: [
    "self host social media scheduler",
    "docker compose social media scheduler",
    "self hosted postiz alternative",
    "open source buffer self host",
    "hookpost docker",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/guides/docker-self-hosting",
  },
};

export default function DockerSelfHostingGuidePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://hookpost.hookstep.in/guides" },
      { "@type": "ListItem", position: 3, name: "Docker Self-Hosting Guide", item: "https://hookpost.hookstep.in/guides/docker-self-hosting" },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Self-Host Hookpost Using Docker Compose",
    description: "Step-by-step tutorial to deploy Hookpost on Ubuntu or Debian Linux VPS using Docker Compose.",
    step: [
      {
        "@type": "HowToStep",
        name: "Get the Source",
        text: "Hookpost is licensed under AGPL-3.0. The public source release is not published yet - request access at hookpost.hookstep.in/about and you will be sent the repository and a deployment key.",
      },
      {
        "@type": "HowToStep",
        name: "Configure Environment Variables",
        text: "Copy the .env.example template to .env and configure your PostgreSQL connection, Redis URL, and encryption secrets.",
      },
      {
        "@type": "HowToStep",
        name: "Launch the Docker Compose Stack",
        text: "Run docker compose up -d to boot the frontend, backend NestJS API, Temporal workflow engine, and PostgreSQL database.",
      },
      {
        "@type": "HowToStep",
        name: "Configure Nginx Reverse Proxy with SSL",
        text: "Point your domain DNS to your VPS IP and run certbot to obtain a free Let's Encrypt SSL certificate.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        ⚡ Open-Source Guide — Run Your Own Social Media Scheduler with Complete Data Privacy
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
            Try Cloud Free ($0)
          </Link>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-10 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/channels" className="hover:text-white transition-colors">Channels</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Docker Self-Hosting</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            DevOps &amp; Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            How to Self-Host a Social Media Scheduler with <span className="text-[#FF4CE2]">Docker Compose</span>
          </h1>
          <p className="text-[#aaa] text-lg leading-relaxed">
            Take back control of your social media data. Learn how to deploy the full open-source Hookpost stack on a $5/month Linux VPS with zero vendor lock-in.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
            <span>By JR Consulting Co. DevOps Team</span>
            <span>&bull;</span>
            <span>Updated September 2026</span>
            <span>&bull;</span>
            <span>Docker Compose v2 Tested</span>
          </div>
        </div>

        {/* Featured Snippet Definition Box */}
        <div className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 rounded-r-2xl space-y-3">
          <h2 className="text-xl font-bold text-white">
            What is the best self-hosted open-source social media scheduler?
          </h2>
          <p className="text-[#d1d1d1] text-base leading-relaxed">
            Hookpost is the leading self-hosted social media management engine in 2026. Licensed under AGPL-3.0, it allows developers, creators, and agencies to deploy a complete multi-channel scheduling suite with unified calendar, AI caption copilot, and Claude Model Context Protocol (MCP) server on any Docker-compatible server.
          </p>
        </div>

        {/* Hardware Prerequisites */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">VPS Hardware Requirements</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center space-y-1">
              <span className="text-xs text-white/50 uppercase font-semibold">Minimum CPU</span>
              <p className="text-xl font-bold text-white">1 vCPU</p>
            </div>
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center space-y-1">
              <span className="text-xs text-white/50 uppercase font-semibold">Minimum RAM</span>
              <p className="text-xl font-bold text-[#FF4CE2]">2 GB RAM</p>
            </div>
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center space-y-1">
              <span className="text-xs text-white/50 uppercase font-semibold">Disk Space</span>
              <p className="text-xl font-bold text-white">20 GB SSD</p>
            </div>
          </div>
        </section>

        {/* Step 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">1</span>
            Clone the Repository
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            Hookpost is licensed under AGPL-3.0. The public source release is
            not out yet, so the repository is available on request rather than
            by public clone &mdash; ask via the contact details on{' '}
            <a href="/about" className="text-[#FF4CE2] underline">
              our about page
            </a>{' '}
            and you will get the repo plus a deployment key. Once you have it:
          </p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-xs font-mono text-[#eee] overflow-x-auto">
            <pre>{`git clone <your-access-url> hookpost
cd hookpost`}</pre>
          </div>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">2</span>
            Configure Environment File
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            Generate strong random secrets for your encryption keys and session tokens:
          </p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-xs font-mono text-[#eee] overflow-x-auto">
            <pre>{`cp .env.example .env
nano .env`}</pre>
          </div>
          <p className="text-xs text-white/50">
            Set your <code>FRONTEND_URL=https://your-domain.com</code> and <code>BACKEND_URL=https://your-domain.com/api</code>.
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">3</span>
            Launch Docker Containers
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            Start all microservices in detached mode:
          </p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-xs font-mono text-[#eee] overflow-x-auto">
            <pre>{`docker compose up -d --build`}</pre>
          </div>
          <p className="text-xs text-white/50">
            Docker will boot Next.js on port 4200, NestJS API on port 3000, and Temporal.io orchestrator.
          </p>
        </section>

        {/* Security and Updates */}
        <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white">Prefer Cloud Managed Without Server Upkeep?</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            If you want the power of Hookpost without the hassle of maintaining server certificates, database backups, and Meta Graph API updates, use our hosted cloud version.
          </p>
          <div className="pt-2">
            <Link
              href="/auth"
              className="inline-block bg-[#FF4CE2] text-black hover:bg-white font-bold text-sm px-6 py-2.5 rounded-full transition-all"
            >
              Start Free on Cloud ($0) &rarr;
            </Link>
          </div>
        </section>
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
