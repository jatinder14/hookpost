import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CHANNEL_COUNT } from "./channel-count";

export const metadata: Metadata = {
  title: "Supported Social Media Channels (2026) | Hookpost",
  description:
    `Schedule and auto-publish across ${CHANNEL_COUNT} social platforms from one dashboard: Instagram, YouTube, LinkedIn, X, Threads, Pinterest, and more.`,
  keywords: [
    "supported social media platforms",
    "social media channels hookpost",
    "multi channel social media scheduler",
    "schedule to instagram youtube and linkedin",
    "open source social scheduler networks",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/channels",
  },
};

// NOTE: this list must cover every key in channel-specs.ts. The page header
// prints CHANNEL_COUNT, derived from those specs, so a channel present in the
// specs but absent here makes the page claim a number larger than the list it
// shows - which is what happened: "18 networks" above a grid of 11, with the
// other seven reachable only by typing the URL.
const CHANNELS = [
  {
    "slug": "lemmy",
    "name": "Lemmy",
    "desc": "Post to federated communities across any Lemmy instance.",
    "icon": "🐭"
  },
  {
    "slug": "nostr",
    "name": "Nostr",
    "desc": "Publish notes to relays on the censorship-resistant protocol.",
    "icon": "🔑"
  },
  {
    "slug": "listmonk",
    "name": "Listmonk",
    "desc": "Send the same update to your self-hosted newsletter list.",
    "icon": "📧"
  },
  {
    "slug": "wordpress",
    "name": "WordPress",
    "desc": "Publish posts and pages to any self-hosted WordPress site.",
    "icon": "📰"
  },
  {
    "slug": "medium",
    "name": "Medium",
    "desc": "Publish stories with tags and canonical links back to your site.",
    "icon": "✍️"
  },
  {
    "slug": "hashnode",
    "name": "Hashnode",
    "desc": "Cross-post developer articles to your own domain with series support.",
    "icon": "📝"
  },
  {
    "slug": "devto",
    "name": "DEV.to",
    "desc": "Publish articles with canonical URLs and tags to the DEV community.",
    "icon": "👩‍💻"
  },
  {
    "slug": "instagram",
    "name": "Instagram",
    "desc": "Auto-publish Reels, carousels, and stories to Business & Creator accounts.",
    "icon": "📸"
  },
  {
    "slug": "youtube",
    "name": "YouTube Shorts",
    "desc": "Schedule Shorts and long-form video uploads with SEO titles & tags.",
    "icon": "▶️"
  },
  {
    "slug": "linkedin",
    "name": "LinkedIn",
    "desc": "Schedule personal brand posts, PDF carousels, and company organization updates.",
    "icon": "💼"
  },
  {
    "slug": "x",
    "name": "X (Twitter)",
    "desc": "Draft and publish tweets, multi-post threads, polls, and image grids.",
    "icon": "🐦"
  },
  {
    "slug": "threads",
    "name": "Meta Threads",
    "desc": "Cross-post text threads and visual updates directly to your Threads profile.",
    "icon": "🧵"
  },
  {
    "slug": "pinterest",
    "name": "Pinterest",
    "desc": "Publish Pins and Idea Pins across multiple boards with rich destination links.",
    "icon": "📌"
  },
  {
    "slug": "facebook",
    "name": "Facebook",
    "desc": "Manage Facebook Pages and Groups with automated video and photo scheduling.",
    "icon": "📘"
  },
  {
    "slug": "bluesky",
    "name": "Bluesky",
    "desc": "Automate decentralized social posts across the AT Protocol network.",
    "icon": "🦋"
  },
  {
    "slug": "telegram",
    "name": "Telegram",
    "desc": "Broadcast announcements and media drops to your Telegram channels.",
    "icon": "✈️"
  },
  {
    "slug": "discord",
    "name": "Discord",
    "desc": "Post webhook updates and community announcements to Discord servers.",
    "icon": "💬"
  },
  {
    "slug": "slack",
    "name": "Slack",
    "desc": "Deliver team announcements, product updates, and daily digests to Slack channels.",
    "icon": "📢"
  }
];

export default function ChannelsHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Channels", item: "https://hookpost.hookstep.in/channels" },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hookpost Supported Social Media Networks & Channels (2026)",
    description: "Directory of supported social media networks for multi-platform scheduling and automation.",
    url: "https://hookpost.hookstep.in/channels",
    publisher: {
      "@type": "Organization",
      name: "Hookpost",
      url: "https://hookpost.hookstep.in",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost Platform Directory — One Visual Calendar for {CHANNEL_COUNT} Social Media Networks
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
            Start Free ($0)
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 pt-12 pb-24 space-y-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Channels</li>
          </ol>
        </nav>

        <div className="text-center space-y-4 max-w-[900px] mx-auto">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Supported Integrations
          </div>
          <h1 className="text-[34px] sm:text-[56px] font-black tracking-tight text-white leading-[1.15]">
            Connect, Schedule &amp; Publish <br />
            <span className="text-[#FF4CE2]">Across {CHANNEL_COUNT} Social Networks</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Stop switching tabs between different social platforms. Upload your content once, optimize it with AI, and schedule to all your accounts simultaneously.
          </p>
        </div>

        {/* Featured Snippet Definition Box (Position 0 Target) */}
        <div className="bg-[#161616] border border-[#FF4CE2]/30 rounded-2xl p-6 max-w-[900px] mx-auto text-left shadow-[0_0_30px_rgba(255,76,226,0.1)]">
          <p className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold mb-2">Supported Social Channels Summary</p>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            <strong>Hookpost</strong> supports multi-channel social media publishing across {CHANNEL_COUNT} networks, including Instagram (Reels &amp; Carousels), YouTube Shorts, LinkedIn, X, Meta Threads, Pinterest, and Facebook. Users can draft once, customize captions with AI, and schedule posts across all connected channels simultaneously from a unified visual calendar.
          </p>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHANNELS.map((ch) => (
            <div
              key={ch.slug}
              className="bg-[#111] border border-white/10 hover:border-[#FF4CE2]/40 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ch.icon}</span>
                  <h2 className="text-xl font-bold text-white">
                    {ch.name}
                  </h2>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {ch.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={"/channels/" + ch.slug}
                  className="text-[#FF4CE2] hover:text-white font-semibold text-sm flex items-center gap-1 group transition-colors"
                >
                  Explore {ch.name} Scheduling
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </section>

        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Connect Your Social Channels?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Connect unlimited profiles starting for $0 with no credit card required.
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
          <Link href="/for" className="hover:underline text-[#888]">Solutions</Link>
        </div>
      </footer>
    </div>
  );
}
