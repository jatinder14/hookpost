import { CHANNEL_DEEP } from '../channel-deep';
import { CHANNEL_SPECS } from '../channel-specs';
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SectionFaq } from '../../SectionFaq';

interface ChannelConfig {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  keywords: string[];
}

const CHANNELS_DATA: Record<string, ChannelConfig> = {
  instagram: {
    name: 'Instagram',
    slug: 'instagram',
    tagline: 'Auto-Publish Instagram Reels, Carousels & Stories',
    description:
      'Schedule and auto-publish single images, carousels, and Reels straight to your Instagram Business or Creator account - no manual reminders.',
    features: [
      'Direct Instagram Reels auto-publishing',
      'Multi-image carousel scheduling with tag previews',
      'AI caption & viral hashtag generation',
      'Best time to post recommendations',
      'First comment scheduling for hashtags',
    ],
    keywords: ['schedule instagram posts', 'auto post instagram reels', 'instagram carousel scheduler', 'instagram content calendar'],
  },
  pinterest: {
    name: 'Pinterest',
    slug: 'pinterest',
    tagline: 'Pinterest Pin Scheduler & Bulk Board Publisher',
    description:
      'Schedule Pins and Idea Pins across multiple Pinterest boards. Drive evergreen traffic to your store, blog, or website with automated posting.',
    features: [
      'Schedule Pins to multiple boards simultaneously',
      'Attach destination URLs and SEO rich descriptions',
      'Bulk visual Pin upload queue',
      'Board-level analytics and click tracking',
    ],
    keywords: ['pinterest scheduler', 'schedule pins', 'pinterest auto poster', 'pinterest marketing tool'],
  },
  youtube: {
    name: 'YouTube',
    slug: 'youtube',
    tagline: 'YouTube Shorts & Long-Form Video Auto-Publisher',
    description:
      'Schedule YouTube Shorts and long-form videos with custom titles, descriptions, tags, and category metadata directly from Hookpost.',
    features: [
      'YouTube Shorts auto-publishing',
      'Custom thumbnail, title, and tag scheduling',
      'Privacy settings (Public, Unlisted, Scheduled)',
      'Cross-post YouTube Shorts to Instagram and Facebook Reels simultaneously',
    ],
    keywords: ['youtube shorts scheduler', 'auto post youtube shorts', 'youtube video scheduling tool'],
  },
  linkedin: {
    name: 'LinkedIn',
    slug: 'linkedin',
    tagline: 'Schedule LinkedIn Personal Posts & Company Page Updates',
    description:
      'Grow your professional personal brand and company page presence with scheduled LinkedIn posts, PDF documents, carousels, and multi-image posts.',
    features: [
      'Personal profile and Company Page scheduling',
      'PDF carousel and document posting',
      'AI hook generator for viral LinkedIn copy',
      'Post-level impression and engagement analytics',
    ],
    keywords: ['linkedin post scheduler', 'schedule linkedin company posts', 'linkedin automation'],
  },
  facebook: {
    name: 'Facebook',
    slug: 'facebook',
    tagline: 'Facebook Pages & Groups Auto-Poster',
    description:
      'Schedule posts, videos, links, and photos to all your Facebook Pages and Groups from one unified dashboard.',
    features: [
      'Facebook Page & Group scheduling',
      'Link previews and custom captions',
      'Multi-page simultaneous cross-posting',
      'Detailed page insights and reach reports',
    ],
    keywords: ['facebook page scheduler', 'auto post to facebook groups', 'facebook social media scheduler'],
  },
  threads: {
    name: 'Threads',
    slug: 'threads',
    tagline: 'Meta Threads Post & Discussion Scheduler',
    description:
      'Schedule text posts, links, and media to Meta Threads to grow your audience on the newest fast-growing social conversation platform.',
    features: [
      'Direct Threads API scheduling',
      'Single and multi-post threads',
      'Photo and video attachments',
      'Real-time engagement insights',
    ],
    keywords: ['threads scheduler', 'meta threads auto post', 'schedule threads posts'],
  },
  x: {
    name: 'X (Twitter)',
    slug: 'x',
    tagline: 'X (Twitter) Tweet & Thread Scheduler',
    description:
      'Schedule individual tweets, long threads, polls, and media posts to X (Twitter). Recycle your best performing tweets automatically.',
    features: [
      'Multi-tweet thread scheduling',
      'Image, GIF, and video attachments',
      'Evergreen post recycling queue',
      'Retweet and impression analytics',
    ],
    keywords: ['twitter scheduler', 'schedule x threads', 'tweet scheduler', 'twitter auto post'],
  },
  bluesky: {
    name: 'Bluesky',
    slug: 'bluesky',
    tagline: 'Decentralized Bluesky Post & Thread Scheduler',
    description:
      'Schedule posts, threads, and media to Bluesky Social (AT Protocol). Expand your reach across the open decentralized social web.',
    features: [
      'Direct AT Protocol scheduling',
      'Thread storm composition with image alt text',
      'Multi-account Bluesky profile management',
      'Federated network reach analytics',
    ],
    keywords: ['bluesky scheduler', 'schedule bluesky posts', 'bluesky auto post', 'at protocol scheduler'],
  },
  discord: {
    name: 'Discord',
    slug: 'discord',
    tagline: 'Discord Channel & Server Announcement Scheduler',
    description:
      'Broadcast announcements, updates, and media embeds automatically to multiple Discord channels via Webhooks and native Bot integration.',
    features: [
      'Scheduled Discord server announcements',
      'Rich embed styling with image banners',
      'Multi-channel role mention automation',
      'Webhook & bot auto-dispatch',
    ],
    keywords: ['discord post scheduler', 'schedule discord announcements', 'discord webhook scheduler'],
  },
  slack: {
    name: 'Slack',
    slug: 'slack',
    tagline: 'Slack Workspace & Channel Update Scheduler',
    description:
      'Automate internal company announcements, product launches, and community updates across public and private Slack channels.',
    features: [
      'Slack channel scheduling with rich markdown',
      'Custom webhook & app integration',
      'Scheduled recurring team broadcasts',
      'Multi-workspace management',
    ],
    keywords: ['slack scheduler', 'schedule slack messages', 'slack announcement automation'],
  },
  telegram: {
    name: 'Telegram',
    slug: 'telegram',
    tagline: 'Telegram Channel & Supergroup Auto-Publisher',
    description:
      'Schedule broadcast messages, media galleries, polls, and formatted posts to unlimited Telegram channels and groups.',
    features: [
      'Telegram channel broadcast scheduling',
      'HTML / Markdown formatted message delivery',
      'Inline button links & media attachments',
      'Channel subscriber view tracking',
    ],
    keywords: ['telegram channel scheduler', 'schedule telegram posts', 'telegram auto poster bot'],
  },
  // Keyed 'google-business' to match the slug the sitemap actually advertises.
  // It used to be 'google-my-business', so /channels/google-business fell
  // through to the generic builder while this hand-written entry sat on a URL
  // nothing linked to. Google renamed the product to Business Profile in 2021;
  // the old name stays in keywords because people still search it.
};

function getChannelData(slug: string): ChannelConfig {
  const normalized = slug.toLowerCase();
  if (CHANNELS_DATA[normalized]) {
    return CHANNELS_DATA[normalized];
  }
  // Title-casing the slug turned real brands into "Vk", "Devto" and
  // "Wordpress". Getting a brand's own spelling wrong is a bad entity signal,
  // so the ones that do not title-case cleanly are spelled out here.
  const BRAND_NAMES: Record<string, string> = {
    devto: 'DEV.to',
    wordpress: 'WordPress',
    listmonk: 'Listmonk',
    hashnode: 'Hashnode',
    nostr: 'Nostr',
    lemmy: 'Lemmy',
    medium: 'Medium',
  };
  const formattedName =
    BRAND_NAMES[normalized] ||
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  return {
    name: formattedName,
    slug,
    tagline: `${formattedName} Post Scheduler & Auto-Publisher`,
    description: `Schedule, plan, and automate posts to ${formattedName} with Hookpost. The modern open-source social media management engine with Multi-Agent AI copilot.`,
    features: [
      `Direct ${formattedName} scheduling & auto-publishing`,
      'Unified visual calendar with drag-and-drop planning',
      'AI caption generation & hashtag optimization',
      'Multi-channel simultaneous broadcasting',
      'Real-time engagement analytics',
    ],
    keywords: [`${slug} scheduler`, `schedule ${slug} posts`, `auto post to ${slug}`, 'social media scheduler'],
  };
}

// Every channel the sitemap advertises. Only connectable channels are listed:
// a page here is a promise the product has to keep.
const ALL_CHANNEL_SLUGS = [
  ...new Set([
    ...Object.keys(CHANNELS_DATA),
    'lemmy',
    'nostr',
    'listmonk',
    'wordpress',
    'medium',
    'hashnode',
    'devto',
  ]),
];

// /channels/<anything> used to answer 200 with a page built from the slug -
// thin content promising a channel that does not exist. Only the slugs below
// are real; every other one now 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_CHANNEL_SLUGS.map((channel) => ({ channel }));
}

export async function generateMetadata({ params }: { params: Promise<{ channel: string }> | { channel: string } }): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const data = getChannelData(resolved.channel || '');

  return {
    // Was `${name} Scheduler — ${tagline} | Hookpost`, which ran to 87
    // characters and got truncated. The tagline already appears in the
    // description, so it does not need to be in both.
    title: `${data.name} Scheduler & Auto-Posting | Hookpost`,
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: `https://hookpost.hookstep.in/channels/${data.slug}`,
    },
  };
}

export default async function ChannelLandingPage({ params }: { params: Promise<{ channel: string }> | { channel: string } }) {
  const resolved = await Promise.resolve(params);
  const data = getChannelData(resolved.channel || '');

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Channels", item: "https://hookpost.hookstep.in/channels" },
      { "@type": "ListItem", position: 3, name: data.name + " Scheduler", item: `https://hookpost.hookstep.in/channels/${data.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Can I schedule posts to ${data.name} automatically with Hookpost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Hookpost connects directly to official ${data.name} APIs to allow seamless single and bulk post scheduling without manual confirmation notifications.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${data.name} scheduling supported on the free plan?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost offers a permanent $0 Starter plan that includes multi-network scheduling with no credit card required.",
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

      {/* Top Banner */}
      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — Official Direct {data.name} API Integration &amp; Scheduling Engine
      </div>

      {/* Header */}
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
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="bg-[#FF4CE2] hover:bg-[#e038c6] text-black font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-[#FF4CE2]/20 hover:scale-105"
          >
            Start Free Trial ($0)
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1200px] mx-auto px-6 pt-10 pb-24 text-center">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-8">
          <ol className="flex items-center justify-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/channels" className="hover:text-white transition-colors">Channels</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">{data.name}</li>
          </ol>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF4CE2] text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF4CE2] animate-pulse"></span>
          Direct {data.name} API Integration Live
        </div>

        {/*
          min-h reserves the heading's space so the CTA below it does not move
          when the web font swaps in. Measured CLS on this template was 0.144 -
          above Google's 0.1 "good" threshold, so these 18 pages were failing a
          Core Web Vital outright. The values are two lines at each breakpoint
          (text-4xl 36px and sm:text-6xl 60px, both at leading-tight 1.25).
        */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight mb-6 min-h-[5.625rem] sm:min-h-[9.375rem]">
          The Ultimate <span className="text-[#FF4CE2]">{data.name} Scheduler</span> &amp; AI Copilot
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          {data.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link
            href="/auth"
            className="w-full sm:w-auto bg-[#FF4CE2] hover:bg-[#e038c6] text-black font-bold text-lg px-8 py-4 rounded-full transition-all duration-200 shadow-xl shadow-[#FF4CE2]/30 hover:scale-105 flex items-center justify-center gap-2"
          >
            Start 7-Day Free Trial ($0)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://github.com/hookstep"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-200 border border-white/10"
          >
            Self-Host with Docker
          </a>
        </div>

        {/* Trust Badges */}
        <p className="text-xs text-white/50 mb-16">
          ✓ No credit card required upfront &nbsp;•&nbsp; ✓ Cancel anytime &nbsp;•&nbsp; ✓ Instant 60s setup
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-20">
          {data.features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FF4CE2]/50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF4CE2]/10 border border-[#FF4CE2]/20 flex items-center justify-center text-[#FF4CE2] font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
                {idx + 1}
              </div>
              {/*
                Each feature card used to repeat one identical sentence -
                "Automate your {name} content strategy effortlessly with AI
                agents and unified calendar scheduling." - under all five
                headings, on all 30 channel pages. That is ~130 copies of one
                sentence, which is the clearest machine-detectable signal of
                templated filler on the site, and it said nothing the heading
                did not already say. The headings carry the information, so the
                filler is gone rather than reworded.
              */}
              <h3 className="text-lg font-bold text-white">{feature}</h3>
            </div>
          ))}
        </div>

        {/*
          Real, per-network specification. Every channel page used to run within
          twenty words of every other one - the same template with a name
          swapped, which is the clearest signal of scaled content there is and
          gave a reader nothing they could not have guessed. These limits are
          the ones Hookpost actually enforces, so they differ genuinely from
          page to page and are worth landing on.
        */}
        {/* A channel that can be connected but cannot yet publish says so here,
            above its own specification. Selling a scheduler for a platform that
            returns 403 on publish is worse than not listing the platform. */}
        {CHANNEL_SPECS[data.slug]?.pending && (
          <div className="mx-auto mb-12 max-w-3xl rounded-2xl border border-amber-400/40 bg-amber-400/[0.07] p-6 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Not publishing yet
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              {CHANNEL_SPECS[data.slug].pending}
            </p>
          </div>
        )}

        {CHANNEL_SPECS[data.slug] && (
          <div className="mx-auto mb-20 max-w-5xl text-left">
            <h2 className="mb-6 text-center text-2xl font-bold text-white">
              {data.name} posting limits
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                  Caption limit
                </div>
                <div className="mt-2 text-lg font-bold text-white">
                  {CHANNEL_SPECS[data.slug].limit}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                  Connecting
                </div>
                <div className="mt-2 text-lg font-bold text-white">
                  {CHANNEL_SPECS[data.slug].auth}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                  Media rules
                </div>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/70">
                  {CHANNEL_SPECS[data.slug].rules.length ? (
                    CHANNEL_SPECS[data.slug].rules.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="text-[#FF4CE2]">·</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/50">
                      Text, images and video, as {data.name} allows.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Long-form detail, only for the channels that have it written. The
            others keep the specification block alone rather than getting
            padding, which would put the templated-content problem straight
            back. */}
        {CHANNEL_DEEP[data.slug] && (
          <div className="mx-auto mb-20 max-w-4xl text-left">
            <p className="text-base leading-relaxed text-white/70">
              {CHANNEL_DEEP[data.slug].intro}
            </p>

            <h2 className="mb-6 mt-12 text-2xl font-bold text-white">
              What you can publish to {data.name}
            </h2>
            <div className="flex flex-col gap-5">
              {CHANNEL_DEEP[data.slug].publish.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mb-5 mt-12 text-2xl font-bold text-white">
              Set on each post
            </h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {CHANNEL_DEEP[data.slug].perPost.map((f) => (
                <li key={f} className="flex gap-2.5 text-[15px] text-white/70">
                  <span className="text-[#FF4CE2]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-2xl border border-[#FF4CE2]/30 bg-[#FF4CE2]/[0.06] p-6">
              <h3 className="font-bold text-white">
                {CHANNEL_DEEP[data.slug].gotcha.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                {CHANNEL_DEEP[data.slug].gotcha.body}
              </p>
            </div>
          </div>
        )}

        <SectionFaq items={faqSchema.mainEntity} />

        {/* Bottom Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 via-[#FF4CE2]/10 to-white/5 border border-[#FF4CE2]/30 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to Supercharge Your <span className="text-[#FF4CE2]">{data.name}</span> Growth?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            {`Schedule ${data.name} alongside your other channels from one calendar. The free tier needs no card and does not expire.`}
          </p>
          <Link
            href="/auth"
            className="inline-flex bg-[#FF4CE2] hover:bg-[#e038c6] text-black font-bold text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-[#FF4CE2]/40 hover:scale-105"
          >
            Get Started Free (No Card Needed)
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
          <Link href="/channels" className="hover:underline text-[#888]">All Channels</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
          <span>&bull;</span>
          <Link href="/for" className="hover:underline text-[#888]">Solutions</Link>
        </div>
      </footer>
    </div>
  );
}
