import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../SectionFaq";
import { PUBLISHABLE_CHANNEL_COUNT } from '../channels/channel-count';

export const metadata: Metadata = {
  title: "Social Media MCP Server for Claude & Cursor | Hookpost",
  description:
    "Open-source Model Context Protocol server. Connect Claude, Cursor, and other AI agents to 18 social networks to draft, schedule, and analyse content.",
  keywords: [
    "social media mcp server",
    "mcp server social media",
    "claude mcp social media",
    "model context protocol scheduler",
    "ai agent social media posting",
    "hookpost mcp",
    "cursor mcp social media",
    "cline mcp social media",
    "windsurf mcp social media",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/mcp",
  },
  openGraph: {
    title: "Social Media MCP Server for Claude & Cursor | Hookpost",
    description:
      "Connect Claude Desktop, Cursor, and AI agents directly to 18 social networks. Official open-source Model Context Protocol server for automated multi-channel publishing.",
    url: "https://hookpost.hookstep.in/mcp",
    siteName: "Hookpost",
    images: [
      {
        url: "https://hookpost.hookstep.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hookpost Social Media MCP Server for AI Agents",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media MCP Server (2026): Automate 18 Platforms with Claude & Cursor",
    description: "An open-source Social Media Model Context Protocol (MCP) server. Schedule and draft across 18 channels.",
    images: ["https://hookpost.hookstep.in/og-image.png"],
  },
};

export default function McpPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hookpost.hookstep.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Social Media MCP Server",
        item: "https://hookpost.hookstep.in/mcp",
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Hookpost Social Media MCP Server",
    operatingSystem: "Cross-platform (macOS, Windows, Linux)",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "AI Agent Social Media Automation",
    url: "https://hookpost.hookstep.in/mcp",
    author: {
      "@type": "Person",
      name: "Mohan Bhanushali",
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        name: "JR Consulting Co.",
        url: "https://hookstep.in",
      },
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      `Official open-source Model Context Protocol (MCP) server enabling Claude, Cursor, Cline, and LLM agents to schedule and publish across ${PUBLISHABLE_CHANNEL_COUNT} social platforms.`,
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Connect Hookpost Social Media MCP Server to Claude Desktop",
    description:
      "Step-by-step guide to installing and configuring the Hookpost MCP server to schedule social media posts directly from Claude Desktop.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Generate Your Hookpost API Key",
        text: "Sign in to Hookpost at hookpost.hookstep.in and navigate to Settings > Developer to create an API key with publishing permissions.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Edit claude_desktop_config.json",
        text: "Add a hookpost entry under mcpServers whose url is https://hookpost.hookstep.in/api/mcp/ followed by your API key.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Restart Claude and Prompt Your Agent",
        text: "Relaunch Claude Desktop. Look for the hammer icon showing list_channels, draft_post, schedule_post, and get_analytics, then prompt Claude to manage your social calendar.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Social Media MCP Server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `A Social Media MCP Server is a Model Context Protocol bridge that connects Large Language Models (like Claude, ChatGPT, and Cursor AI) directly to social media management APIs. It allows AI agents to inspect scheduled content calendars, generate platform-optimized captions, draft threads, and publish across ${PUBLISHABLE_CHANNEL_COUNT} networks using standard JSON-RPC tools.`,
        },
      },
      {
        "@type": "Question",
        name: "What tools does the Hookpost MCP Server provide to AI agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hookpost exposes four primary MCP tools: (1) list_channels: inspect connected profiles and limits, (2) draft_post: stage multi-network posts with character validation, (3) schedule_post: queue posts with ISO timestamps and media, and (4) get_analytics: retrieve engagement metrics.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost MCP support Cursor, VS Code, and Windsurf alongside Claude?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost MCP implements the open Anthropic Model Context Protocol specification and works seamlessly across Claude Desktop, Cursor AI, VS Code (Cline/Roo-Code), Windsurf, and custom terminal agent scripts.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Hookpost MCP Server free and open-source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Hookpost MCP is licensed under AGPL-3.0. The public source release is not out yet, so the repository is shared on request. You can use it with free cloud accounts or self-host your own Docker instance with zero subscription fees.",
        },
      },
      {
        "@type": "Question",
        name: "How do I install and configure Hookpost MCP in Claude Desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open your claude_desktop_config.json and add 'hookpost': { 'url': 'https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY' }. Restart Claude Desktop and you will see a hammer icon representing the live social media tools.",
        },
      },
      {
        "@type": "Question",
        name: "Can AI agents auto-publish directly, or is there a human-in-the-loop review step?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both workflows are supported. You can configure agents to draft posts into your Hookpost queue as drafts requiring visual review, or grant permissions for autonomous scheduling directly to connected channels.",
        },
      },
      {
        "@type": "Question",
        name: "How are social media OAuth tokens and credentials secured in the MCP server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OAuth credentials and refresh tokens are AES-256 encrypted in Hookpost's database. The local MCP server only communicates with Hookpost via secure HTTPS JSON-RPC API tokens. Your social platform access tokens never pass into LLM context windows or training datasets.",
        },
      },
      {
        "@type": "Question",
        name: "Does Hookpost MCP support custom AI agent frameworks like LangChain, AutoGen, and CrewAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost implements the standard Anthropic Model Context Protocol specification over stdio and SSE transports. Any agent framework that supports MCP clients (LangChain, CrewAI, AutoGen, LlamaIndex) can connect directly to Hookpost tools.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        ⚡ The Open-Source Model Context Protocol (MCP) Server for Social Media
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.webp" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/hookstep"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:inline"
          >
            GitHub
          </a>
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
            Get API Key
          </Link>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 pt-8 pb-24 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Social Media MCP Server</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-[860px] mx-auto">
          <div className="inline-block bg-[#FF4CE2]/15 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Anthropic Model Context Protocol (MCP)
          </div>
          <h1 className="text-[36px] sm:text-[64px] font-black tracking-tight text-white leading-[1.12]">
            Social Media <span className="text-[#FF4CE2]">MCP Server</span> for AI Agents
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Turn Claude Desktop, Cursor, Cline, or your custom AI agent into an autonomous social media manager. Schedule, draft, and publish across {PUBLISHABLE_CHANNEL_COUNT} channels with natural language prompts.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/auth"
              className="w-full sm:w-auto bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-8 py-3.5 rounded-full transition-all shadow-lg shadow-[#FF4CE2]/20"
            >
              Get Free MCP API Key &rarr;
            </Link>
            <a
              href="https://github.com/hookstep"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:border-white text-white font-semibold text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              View on GitHub (AGPL) &rarr;
            </a>
          </div>

          {/* Quick Terminal Command */}
          <div className="inline-flex items-center gap-3 bg-[#0d0d0d] border border-white/10 rounded-full px-5 py-2 text-xs font-mono text-neutral-300">
            <span className="text-emerald-400 font-bold">$</span>
            <span>claude mcp add hookpost --transport http &lt;your-url&gt;</span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest pl-2">Zero Install</span>
          </div>

          {/* E-E-A-T Author Citation Byline */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Architected &amp; Maintained by <strong>Mohan Bhanushali</strong> (Founder &amp; Systems Lead, JR Consulting Co.)</span>
            <span className="text-white/20">•</span>
            <span>Updated September 2026</span>
          </div>
        </div>

        {/* High Citability Definition Box */}
        <section className="bg-[#111] border-l-4 border-[#FF4CE2] p-6 sm:p-8 rounded-r-2xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is a Social Media MCP Server?
          </h2>
          <p className="text-[#d1d1d1] text-base sm:text-lg leading-relaxed">
            A <strong>Social Media MCP Server</strong> is a specialized implementation of Anthropic's open Model Context Protocol that allows AI models (such as Claude 3.7 Sonnet, ChatGPT, and Cursor AI) to securely interact with social media publishing APIs. Through standardized JSON-RPC tool endpoints, AI agents can inspect scheduled calendars, draft platform-compliant captions, validate character limits, and publish directly to {PUBLISHABLE_CHANNEL_COUNT} social networks without human context switching.
          </p>
        </section>

        {/* Multi-Client Configuration Tabs */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            One MCP Server, All Your Favorite AI Clients
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Claude Desktop */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF4CE2]"></span>
                  Claude Desktop
                </h3>
                <span className="text-xs text-white/60 font-mono">claude_desktop_config.json</span>
              </div>
              <pre className="bg-[#050505] p-4 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "hookpost": {
      "url": "https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY"
    }
  }
}`}
              </pre>
            </div>

            {/* Cursor */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  Cursor AI
                </h3>
                <span className="text-xs text-white/60 font-mono">.cursor/mcp.json</span>
              </div>
              <pre className="bg-[#050505] p-4 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY"],
      "env": {
        "HOOKPOST_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`}
              </pre>
            </div>

            {/* VS Code / Cline */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  VS Code (Cline / Roo)
                </h3>
                <span className="text-xs text-white/60 font-mono">cline_mcp_settings.json</span>
              </div>
              <pre className="bg-[#050505] p-4 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY"],
      "env": {
        "HOOKPOST_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`}
              </pre>
            </div>

            {/* Windsurf */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  Windsurf Cascade
                </h3>
                <span className="text-xs text-white/60 font-mono">mcp_config.json</span>
              </div>
              <pre className="bg-[#050505] p-4 rounded-xl text-xs font-mono text-neutral-300 overflow-x-auto border border-white/5">
{`{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY"],
      "env": {
        "HOOKPOST_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Tool API Reference */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            Native MCP Tools Exposed to Agents
          </h2>
          <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-[#262626] bg-[#161616]">
                  <th className="p-4 sm:p-5 font-bold text-white">Tool Name</th>
                  <th className="p-4 sm:p-5 font-bold text-[#FF4CE2]">Function</th>
                  <th className="p-4 sm:p-5 font-bold text-white">Input Parameters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 font-mono text-[#FF4CE2]">list_channels</td>
                  <td className="p-4 sm:p-5 text-white/80">Lists all active connected profiles, handles, and character constraints.</td>
                  <td className="p-4 sm:p-5 text-white/60 font-mono text-xs">None</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 font-mono text-[#FF4CE2]">draft_post</td>
                  <td className="p-4 sm:p-5 text-white/80">Stages a drafted post with platform validation across multiple networks.</td>
                  <td className="p-4 sm:p-5 text-white/60 font-mono text-xs">channels, content, mediaUrls?</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 font-mono text-[#FF4CE2]">schedule_post</td>
                  <td className="p-4 sm:p-5 text-white/80">Queues content for automated dispatch at a specified UTC timestamp.</td>
                  <td className="p-4 sm:p-5 text-white/60 font-mono text-xs">channels, content, scheduledAt, media?</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 font-mono text-[#FF4CE2]">get_analytics</td>
                  <td className="p-4 sm:p-5 text-white/80">Queries real-time impressions, engagement rates, and post performance.</td>
                  <td className="p-4 sm:p-5 text-white/60 font-mono text-xs">postId?, channelId?, timeRange?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Production Prompt Formulas */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Prompt Engineering</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Production MCP Prompts for Claude &amp; Cursor
            </h2>
            <p className="text-neutral-400 text-sm max-w-xl mx-auto">
              Natural language instructions you can send directly to Claude Desktop or Cursor to drive Hookpost:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#FF4CE2]">1. Multi-Platform Launch Thread</span>
                <span className="text-neutral-500 font-mono">X • Threads • Bluesky</span>
              </div>
              <p className="text-sm text-neutral-300 font-mono bg-[#070707] p-3 rounded-lg border border-white/5">
                &ldquo;Inspect my connected channels using Hookpost MCP. Draft a 4-post launch thread about our open-source release with hashtags, validate character counts for X and Bluesky, and queue them for tomorrow at 9:00 AM UTC.&rdquo;
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400">2. Cross-Channel Blog Syndication</span>
                <span className="text-neutral-500 font-mono">LinkedIn • Threads • Discord</span>
              </div>
              <p className="text-sm text-neutral-300 font-mono bg-[#070707] p-3 rounded-lg border border-white/5">
                &ldquo;Summarize the blog post at this URL into a professional LinkedIn article format and a concise Threads post. Cross-post drafts to Hookpost for review.&rdquo;
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-400">3. Calendar Cadence &amp; Gap Audit</span>
                <span className="text-neutral-500 font-mono">All Channels</span>
              </div>
              <p className="text-sm text-neutral-300 font-mono bg-[#070707] p-3 rounded-lg border border-white/5">
                &ldquo;Query Hookpost for all scheduled posts across our Instagram and Facebook profiles over the next 14 days. Identify days with zero scheduled posts and draft 3 reel concepts to fill the gaps.&rdquo;
              </p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-400">4. Engagement Analytics Summary</span>
                <span className="text-neutral-500 font-mono">Analytics API</span>
              </div>
              <p className="text-sm text-neutral-300 font-mono bg-[#070707] p-3 rounded-lg border border-white/5">
                &ldquo;Call get_analytics for our top 5 performing posts over the past 30 days. Breakdown impressions, click-throughs, and engagement rates by platform, and output an executive markdown summary.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specifications & Architecture Matrix */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold">Engineering Deep Dive</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              MCP Protocol Specifications &amp; Architecture
            </h2>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-[#0e0e0e]">
            <table className="w-full text-left text-sm border-collapse">
              <tbody className="divide-y divide-white/5 font-mono">
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">Protocol Specification</td>
                  <td className="p-4 text-white font-semibold">Anthropic Model Context Protocol (v2024-11-05 / 2025 Standard)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">Supported Transports</td>
                  <td className="p-4 text-white font-semibold"><code className="text-[#FF4CE2]">stdio</code> (Terminal Subprocess) &amp; <code className="text-emerald-400">sse</code> (Server-Sent Events over TLS 1.3)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">Cryptographic Security</td>
                  <td className="p-4 text-white font-semibold">AES-256 GCM encrypted OAuth tokens; zero transmission of social credentials to LLMs</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">AI Client Compatibility</td>
                  <td className="p-4 text-white font-semibold">Claude Desktop, Cursor AI, VS Code (Cline/Roo-Code), Windsurf Cascade, LangChain, CrewAI</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">Supported Social Platforms</td>
                  <td className="p-4 text-white font-semibold">18 Networks (Instagram, YouTube, X, LinkedIn, Facebook, Threads, Bluesky, Pinterest, Discord, Telegram...)</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400">Open-Source License</td>
                  <td className="p-4 text-white font-semibold">AGPL-3.0 (full self-hosting &amp; commercial SaaS freedom)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* MCP FAQ Section */}
        <SectionFaq
          items={faqSchema.mainEntity}
          title="Social Media MCP Server Frequently Asked Questions"
        />

        {/* Self-Hosted & Privacy */}
        <section className="bg-gradient-to-r from-[#1A0B2E] to-[#0A1128] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            100% Private, On-Premise AI Execution
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
            The Hookpost MCP Server connects directly from your local terminal to your Hookpost instance. Your API tokens, audience analytics, and drafted media never leave your controlled infrastructure.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/guides/docker-self-hosting"
              className="bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-semibold text-sm px-6 py-3 rounded-full transition-all"
            >
              Docker Self-Hosting Guide &rarr;
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
