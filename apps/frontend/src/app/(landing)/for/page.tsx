import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Solutions by Role | Hookpost",
  description:
    "Explore Hookpost tailored social media scheduling solutions for creators, agencies, B2B SaaS, e-commerce, real estate, and small businesses in 2026.",
  keywords: [
    "social media scheduler for agencies",
    "social media management for creators",
    "b2b saas social media automation",
    "small business social media tool",
    "hookpost solutions",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/for",
  },
};

const PERSONAS = [
  { slug: "creators", title: "Content Creators & Influencers", desc: "Batch schedule Reels, YouTube Shorts, and Threads with AI hook generation.", badge: "Creators" },
  { slug: "agencies", title: "Digital Marketing Agencies", desc: "Manage 50+ client workspaces, white-label visual calendars, and team approval workflows.", badge: "Agencies" },
  { slug: "b2b-saas", title: "B2B SaaS & Tech Startups", desc: "Automate founder LinkedIn thought leadership, X product updates, and GitHub release posts.", badge: "B2B SaaS" },
  { slug: "ecommerce", title: "E-Commerce Brands & Shopify Stores", desc: "Drive repeat sales with visual product carousels, Pinterest pins, and seasonal discount drops.", badge: "E-Commerce" },
  { slug: "small-business", title: "Small & Local Businesses", desc: "Consistent local presence on Facebook, Instagram, and Threads with zero complicated setups.", badge: "Small Business" },
  { slug: "solopreneurs-freelancers", title: "Solopreneurs & Freelancers", desc: "Save 10+ hours every week. One unified calendar to schedule across all your professional channels.", badge: "Solopreneurs" },
  { slug: "real-estate", title: "Real Estate Agents & Brokers", desc: "Showcase property video tours, open-house updates, and listing flyers across Facebook and Instagram.", badge: "Real Estate" },
  { slug: "restaurants-cafes", title: "Restaurants, Cafes & Bars", desc: "Schedule daily menu specials, happy hour stories, and weekend event teasers seamlessly.", badge: "Food & Beverage" },
  { slug: "fitness-coaches", title: "Fitness Coaches & Gyms", desc: "Post daily workout tips, client transformations, and nutritional guides to build an engaged community.", badge: "Fitness" },
  { slug: "healthcare-clinics", title: "Healthcare & Wellness Clinics", desc: "Build patient trust with educational health content, clinic updates, and doctor spotlights.", badge: "Healthcare" },
  { slug: "crypto-web3", title: "Web3, DeFi & Crypto Projects", desc: "Coordinate X announcements, Telegram community drops, and Discord updates in real time.", badge: "Web3" },
  { slug: "music-artists", title: "Musicians & Recording Artists", desc: "Drop album teasers, Spotify release count-downs, and tour announcements across 18 networks.", badge: "Music" },
  { slug: "educators-nonprofits", title: "Educators & Nonprofits", desc: "Amplify awareness campaigns, student outreach, and donation drives on an affordable $0 starter budget.", badge: "Nonprofit" },
  { slug: "enterprise-teams", title: "Enterprise Marketing Teams", desc: "Granular role-based permissions, multi-brand audit logs, and self-hosted on-premise Docker deployment.", badge: "Enterprise" },
  { slug: "students-young-creators", title: "Students & Young Founders", desc: "100% free starter tier to build personal brands, showcase portfolios, and launch side projects.", badge: "Students" },
];

export default function ForHubPage() {
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
        name: "Solutions",
        item: "https://hookpost.hookstep.in/for",
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hookpost Industry Solutions Directory (2026)",
    description: "Explore tailored social media scheduling and automation for creators, agencies, B2B SaaS, and local businesses.",
    url: "https://hookpost.hookstep.in/for",
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
        Hookpost Tailored Solutions — Built for Creators, High-Growth Teams &amp; Agencies
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
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Solutions</li>
          </ol>
        </nav>

        <div className="text-center space-y-4 max-w-[900px] mx-auto">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Tailored Industry Workflows
          </div>
          <h1 className="text-[34px] sm:text-[56px] font-black tracking-tight text-white leading-[1.15]">
            Social Media Scheduling <br />
            <span className="text-[#FF4CE2]">Engineered for Your Industry</span>
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl leading-relaxed">
            Whether you are a solo creator, a fast-scaling B2B startup, or an agency managing dozens of client workspaces, Hookpost adapts to your publishing rhythm.
          </p>
        </div>

        {/* Featured Snippet Definition Box (Position 0 Target) */}
        <div className="bg-[#161616] border border-[#FF4CE2]/30 rounded-2xl p-6 max-w-[900px] mx-auto text-left shadow-[0_0_30px_rgba(255,76,226,0.1)]">
          <p className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold mb-2">Social Media Solutions Summary</p>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            <strong>Hookpost Solutions</strong> provide specialized social media scheduling workflows tailored for 15+ personas, including content creators, marketing agencies, B2B SaaS startups, e-commerce stores, and small businesses. Key capabilities include multi-tenant client workspaces, AI-assisted viral hook generation, multi-network auto-posting, and self-hosted Docker deployment options.
          </p>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONAS.map((p) => (
            <div
              key={p.slug}
              className="bg-[#111] border border-white/10 hover:border-[#FF4CE2]/40 rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold bg-[#FF4CE2]/10 text-[#FF4CE2] px-3 py-1 rounded-full border border-[#FF4CE2]/20">
                  {p.badge}
                </span>
                <h2 className="text-xl font-bold text-white pt-1">
                  {p.title}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/for/${p.slug}`}
                  className="text-[#FF4CE2] hover:text-white font-semibold text-sm flex items-center gap-1 group transition-colors"
                >
                  Explore {p.badge} Solution
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </section>

        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Automate Your Industry Socials?
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base sm:text-lg">
            Connect all your channels in under 60 seconds with no credit card required.
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
          <Link href="/compare" className="hover:underline text-[#888]">Compare Tools</Link>
        </div>
      </footer>
    </div>
  );
}
