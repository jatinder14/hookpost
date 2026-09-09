import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PUBLISHABLE_CHANNEL_COUNT } from '../../channels/channel-count';

export const metadata: Metadata = {
  title: "How to Schedule Social Media with Claude & MCP (2026 Guide)",
  description:
    "Learn how to schedule posts to X, LinkedIn, Instagram, and YouTube directly from Claude Desktop using Hookpost and the Model Context Protocol (MCP).",
  keywords: [
    "schedule social media with claude",
    "claude mcp social media scheduler",
    "model context protocol social media",
    "automate social media with claude desktop",
    "hookpost mcp",
    "claude desktop social media tool",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/guides/claude-mcp-social-media",
  },
};

export default function ClaudeMcpGuidePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://hookpost.hookstep.in/guides" },
      { "@type": "ListItem", position: 3, name: "Claude MCP Social Media Scheduling", item: "https://hookpost.hookstep.in/guides/claude-mcp-social-media" },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Schedule Social Media Posts Using Claude Desktop and Hookpost MCP",
    description: "Step-by-step instructions to connect Claude Desktop to your social media accounts via Model Context Protocol.",
    step: [
      {
        "@type": "HowToStep",
        name: "Create a Free Hookpost Account and Connect Channels",
        text: "Sign up at hookpost.hookstep.in and link your target social profiles (X, LinkedIn, Threads, Instagram, YouTube).",
      },
      {
        "@type": "HowToStep",
        name: "Add Hookpost to your Claude Desktop Config",
        text: "Open your claude_desktop_config.json file and register the hookpost MCP server command.",
      },
      {
        "@type": "HowToStep",
        name: "Prompt Claude to Draft and Schedule Posts",
        text: "Instruct Claude in plain English to write platform-specific copy, generate hooks, and schedule directly to your live queue.",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How to Schedule Social Media with Claude & MCP (2026 Guide)",
    description: `Learn how to schedule posts to X, LinkedIn, Instagram and ${PUBLISHABLE_CHANNEL_COUNT} networks directly from Claude Desktop using Hookpost and the Model Context Protocol (MCP).`,
    datePublished: "2026-09-02T08:00:00+00:00",
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
      cssSelector: ["h1", "h2", ".article-summary"],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        ⚡ Developer Guide — Automate Multi-Channel Social Publishing with Claude Desktop &amp; MCP
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
            <li><Link href="/for" className="hover:text-white transition-colors">Solutions</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Claude MCP Guide</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Model Context Protocol (MCP) Tutorial
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            How to Schedule Social Media Posts Using <span className="text-[#FF4CE2]">Claude &amp; MCP</span>
          </h1>
          <p className="text-[#aaa] text-lg leading-relaxed article-summary">
            Stop manually copying text from AI chat windows into social schedulers. Connect Claude Desktop directly to Hookpost to draft, refine, and queue posts across {PUBLISHABLE_CHANNEL_COUNT} networks in seconds.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-white/60">
            <span>By JR Consulting Co. Engineering Team</span>
            <span>&bull;</span>
            <span>Updated September 2026</span>
            <span>&bull;</span>
            <span>Tested with Claude 3.7 Sonnet &amp; Claude Desktop</span>
          </div>
        </div>

        {/* Featured Snippet Definition Box */}
        <div className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 rounded-r-2xl space-y-3">
          <h2 className="text-xl font-bold text-white">
            Can Claude Desktop schedule social media posts directly?
          </h2>
          <p className="text-[#d1d1d1] text-base leading-relaxed">
            Yes. By connecting Claude Desktop to Hookpost through Anthropic's Model Context Protocol (MCP), Claude gains direct access to your connected social channels. Claude can inspect drafts, write platform-optimized captions, generate viral hooks, and schedule posts to X, LinkedIn, Instagram, and YouTube without you leaving your chat window.
          </p>
        </div>

        {/* Step 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">1</span>
            Connect Your Channels on Hookpost
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            First, create a free account at <Link href="/auth" className="text-[#FF4CE2] underline">hookpost.hookstep.in</Link>. From your dashboard, link the social networks you want Claude to manage:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#ddd] pl-2">
            <li><strong>X (Twitter)</strong>: Posts, threads, and polls.</li>
            <li><strong>LinkedIn</strong>: Personal profiles and company organization pages.</li>
            <li><strong>Instagram &amp; Threads</strong>: Single images, carousels, and Reels.</li>
            <li><strong>YouTube &amp; Shorts</strong>: Video uploads and captions.</li>
          </ul>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">2</span>
            Add Hookpost to Claude Desktop Configuration
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            Open your Claude Desktop configuration file:
          </p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-xs font-mono text-[#eee] overflow-x-auto">
            <p className="text-white/50 mb-1"># macOS location:</p>
            <p>~/Library/Application Support/Claude/claude_desktop_config.json</p>
          </div>
          <p className="text-[#bbb] text-base leading-relaxed">
            Add the <code>hookpost</code> server entry under <code>mcpServers</code>:
          </p>
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-xs font-mono text-[#eee] overflow-x-auto">
            <pre>{`{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "hookpost", "mcp"],
      "env": {
        "HOOKPOST_API_KEY": "YOUR_API_KEY_FROM_HOOKPOST_SETTINGS"
      }
    }
  }
}`}</pre>
          </div>
          <p className="text-xs text-white/50">
            Restart Claude Desktop. You will see a hammer icon (tools) appear in the bottom-right corner with Hookpost endpoints active.
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#FF4CE2] text-black font-black flex items-center justify-center text-sm">3</span>
            Example Prompts to Command Claude
          </h2>
          <p className="text-[#bbb] text-base leading-relaxed">
            Now you can prompt Claude in plain natural language. Here are three tested prompt templates:
          </p>

          <div className="space-y-3">
            <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#FF4CE2] uppercase tracking-wider">Example A: The Multi-Network Launch</span>
              <p className="text-sm font-mono text-white/90">
                &ldquo;Claude, inspect our connected accounts. We just shipped v2.0 of our open-source repo. Draft an engaging thread for X with code snippets, and a professional summary for LinkedIn. Then schedule both for tomorrow at 10:00 AM IST.&rdquo;
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#FF4CE2] uppercase tracking-wider">Example B: Viral Hook Brainstorming</span>
              <p className="text-sm font-mono text-white/90">
                &ldquo;Claude, analyze my recent high-performing tweets using Hookpost tools. Write 5 high-converting hook variations on why self-hosting social schedulers beats paying $99/mo to Hootsuite.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Security and Privacy */}
        <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white">Complete Privacy &amp; Data Ownership</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Hookpost operates under the AGPL license. The MCP server runs locally via standard JSON-RPC. Your OAuth social tokens remain securely encrypted with AES-256 and never leak to third-party model training pipelines.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Supercharge Claude with Social Scheduling?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            Create your free account today. Start scheduling via Claude Desktop in under 2 minutes.
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
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
          <span>&bull;</span>
          <Link href="/for" className="hover:underline text-[#888]">All Solutions</Link>
        </div>
      </footer>
    </div>
  );
}
