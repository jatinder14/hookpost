import '../landing-global.scss';
import { pricingUSD, pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { Metadata, Viewport } from 'next';
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import { FAQ_DATA } from './LandingFaq';

// style:['normal'] only. Without it next/font emits the italic face as well, so
// two declared families were loading FOUR woff2 files (102KB) and nothing on the
// marketing pages is italic.
//
// Do NOT add a `weight` array here. These are variable fonts: one file covers
// every weight. Pinning weights makes next/font emit a separate STATIC instance
// per weight - tried it, went from 4 files to 10.
const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal'],
  variable: '--font-dm',
  display: 'swap',
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  style: ['normal'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: '#05070a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { Suspense } from 'react';
import UtmSaver from '@hookpost/helpers/utils/utm.saver';
import { ViewContentTracker } from '@hookpost/frontend/components/layout/view-content.tracker';
import { FacebookComponent } from '@hookpost/frontend/components/layout/facebook.component';
import { GoogleTagManagerComponent } from '@hookpost/frontend/components/layout/gtm.component';
import { PUBLISHABLE_CHANNEL_COUNT } from './channels/channel-count';

export const metadata: Metadata = {
  metadataBase: new URL('https://hookpost.hookstep.in'),
  title: {
    // 69 chars was past the truncation point, and the part being cut was
    // This is the sitewide default, which in practice is the homepage title.
    // It named a competitor until the September 2026 rebuild; the homepage is
    // about this product now, and /alternatives/postiz still carries that
    // keyword on a page built for it. 54 chars, inside the truncation limit.
    default: 'Hookpost: Open-Source AI Social Media Scheduler',
    template: '%s',
  },
  description: `Open-source social media scheduler for ${PUBLISHABLE_CHANNEL_COUNT} networks. Visual calendar, AI drafting, and an MCP server so Claude or Cursor can publish. Self-host with Docker.`,
  keywords: [
    // Brand & Direct Competitor Search Terms
    'hookpost hookstep',
    'hookpost',
    'hookstep hookpost',
    'buffer competitors',
    'buffer competitor',
    'top buffer competitor',
    'buffer alternative',
    'hootsuite competitor',
    'sprout social competitor',
    'later competitor',

    // Gen Z, Teens & Young Creators (Free, Video, Gaming, Memes)
    'how to schedule youtube shorts for free without credit card',
    'free instagram reels scheduler',
    'free discord social media bot',
    'meme posting scheduler free',
    'best free social media app for young creators',

    // College Students & Early Career (LinkedIn, Twitter, Personal Brand)
    'free linkedin post scheduler for personal branding',
    'schedule tweets for build in public free',
    'bluesky scheduler free',
    'content calendar for college students and job seekers',
    'best free buffer alternative for students',
    'farcaster auto poster',

    // Adult Professionals, Growth Marketers & Indie Hackers
    'open source social media management software',
    'self hosted social media scheduler docker',
    'bulk schedule 100 posts csv',
    'ai social media scheduling tool',
    'multi brand social media calendar',
    'social media management software with razorpay upi cards',
    'white label social media scheduler',
    'client approval portal for marketing agency',

    // Older Entrepreneurs, Local Businesses & Non-Tech Founders
    'simple social media tool for small business',
    'schedule posts to google business profile',
    'how to post on facebook page and instagram at once automatically',
    'easy social media calendar for local shops',
    'best social media scheduler for real estate agents',
    'restaurant and cafe social media planner',
    'church and nonprofit social media scheduler free',
    'dental and clinic social media scheduling',

    // Global & Geographic Intent
    'best social media scheduler worldwide',
    'social media management usa uk canada australia india europe',
    'buffer competitors in india with upi razorpay',
  ],
  authors: [{ name: 'JR Consulting Co.', url: 'https://hookpost.hookstep.in' }],
  creator: 'JR Consulting Co.',
  publisher: 'JR Consulting Co.',
  applicationName: 'Hookpost',
  generator: 'Next.js',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://hookpost.hookstep.in',
    languages: {
      en: 'https://hookpost.hookstep.in',
      'en-US': 'https://hookpost.hookstep.in',
      'en-GB': 'https://hookpost.hookstep.in',
      'en-CA': 'https://hookpost.hookstep.in',
      'en-AU': 'https://hookpost.hookstep.in',
      'en-IN': 'https://hookpost.hookstep.in',
      'en-NZ': 'https://hookpost.hookstep.in',
      'en-ZA': 'https://hookpost.hookstep.in',
      es: 'https://hookpost.hookstep.in',
      'es-ES': 'https://hookpost.hookstep.in',
      'es-MX': 'https://hookpost.hookstep.in',
      pt: 'https://hookpost.hookstep.in',
      'pt-BR': 'https://hookpost.hookstep.in',
      de: 'https://hookpost.hookstep.in',
      fr: 'https://hookpost.hookstep.in',
      ja: 'https://hookpost.hookstep.in',
      'x-default': 'https://hookpost.hookstep.in',
    },
  },
  openGraph: {
    title:
      'Hookpost — Open-Source Social Media Scheduler & AI Management Platform',
    description: `Manage, schedule, and auto-publish across ${PUBLISHABLE_CHANNEL_COUNT} social networks with AI copilot, drag-and-drop calendar, and team workflows. Free and self-hostable.`,
    url: 'https://hookpost.hookstep.in',
    siteName: 'Hookpost',
    images: [
      {
        url: 'https://hookpost.hookstep.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hookpost Open-Source Social Media Scheduler',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Hookpost — Open-Source Social Media Scheduler & AI Management Platform',
    description:
      'Schedule and auto-publish posts worldwide to Instagram, Pinterest, YouTube, LinkedIn, X, Facebook, and Threads.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
    creator: '@hookstep',
    site: '@hookstep',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  other: {
    coverage: 'Worldwide',
    distribution: 'Global',
    rating: 'General',
    'revisit-after': '1 days',
    target: 'all',
    // Single-value legacy meta. It said INR because on 2026-09-17 INR was the
    // only currency that could be charged; USD and EUR were re-opened on
    // 2026-09-20 and the visible page is now priced per visitor, USD outside
    // India. USD is the global default and what crawlers see.
    priceCurrency: 'USD',
  },
};

const globalJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://hookpost.hookstep.in/#organization',
      name: 'Hookpost',
      legalName: 'JR Consulting Co.',
      url: 'https://hookpost.hookstep.in',
      logo: 'https://hookpost.hookstep.in/brand-logo.png',
      // "HookPost" collides with an indexed Shopify app and with the GNU
      // debugger's hookpost- command prefix, so search engines substitute
      // "Hookle" for the query and AI models have no clean signal to resolve
      // the entity. Third-party pages we demonstrably control are the only
      // corroboration available: the npm registry entries are independent,
      // dated, and name the product exactly.
      //
      // A 200 is NOT the check. This list used to carry
      // 'https://x.com/hookstep', which returns 200 all day because it is a
      // real account - belonging to "Billy Twotrees", joined June 2026, zero
      // posts, one follower. sameAs asserts identity, so we were telling Google
      // and every AI model that a stranger's empty profile IS Hookpost, on the
      // exact entity signal this array exists to fix. Removed 2026-09-22, the
      // night before the Product Hunt launch.
      //
      // The rule the old comment should have stated: verify each URL is OURS,
      // by name and content, not that it resolves. Re-checked on removal -
      // hookstep.in 200, github.com/hookstep is our org, the LinkedIn company
      // page is ours, and all three npm packages resolve in the registry with
      // Hookpost descriptions (npmjs.com itself 403s a bare curl, which is bot
      // protection, not a dead link).
      //
      // No X account: there is no Hookpost brand handle. The only X channels
      // connected in production are two personal accounts. Add one here when a
      // brand account exists - never the closest-looking name.
      sameAs: [
        'https://hookstep.in',
        'https://github.com/hookstep',
        // The public source repository (AGPL-3.0, public since 2026-09-09).
        'https://github.com/jatinder14/hookpost',
        // Directory listings verified ours by content on 2026-09-25.
        'https://www.producthunt.com/products/hookpost',
        'https://www.saashub.com/hookpost-in',
        'https://www.linkedin.com/company/hookpost',
        'https://www.npmjs.com/package/hookpost',
        'https://www.npmjs.com/package/@hookpost/node',
        'https://www.npmjs.com/package/n8n-nodes-hookpost',
      ],
      // Disambiguation for entity resolution: says plainly what this is, in
      // the terms the colliding results are not about.
      alternateName: 'Hookpost Social Media Scheduler',
      description: `Hookpost is an open-source social media scheduling platform that publishes to ${PUBLISHABLE_CHANNEL_COUNT} networks from one calendar and ships a Model Context Protocol server for AI agents. It is not affiliated with any Shopify application of a similar name.`,
      founder: {
        '@type': 'Person',
        name: 'Mohan Bhanushali',
        jobTitle: 'Founder',
        url: 'https://hookstep.in/founders',
        // No sameAs: the only URLs available were the company's GitHub org
        // and LinkedIn page, and asserting those as a person's identity is
        // wrong. Add his personal LinkedIn/GitHub here when they exist.
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@hookstep.in',
        contactType: 'Customer Support',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
      // Merged from two separate knowsAbout keys on this same object. A
      // duplicate key is not an error in JS - the later one silently won, so
      // the disambiguating terms (content calendar automation, social media
      // API integration) never reached the emitted schema.
      knowsAbout: [
        'Social Media Management',
        'Social Media Scheduling',
        'Content Calendar Automation',
        'Social Media API Integration',
        'Model Context Protocol',
        'AI Agents',
        'Open Source Software',
        'Self-Hosting',
        'Docker',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://hookpost.hookstep.in/#website',
      url: 'https://hookpost.hookstep.in',
      name: 'Hookpost',
      publisher: {
        '@id': 'https://hookpost.hookstep.in/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate:
            'https://hookpost.hookstep.in/alternatives?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      // Hookpost ships as a web app. The Android TWA is built (assetlinks.json
      // is served) but is NOT on the Play Store yet, so this stays a
      // WebApplication: markup must describe what a visitor can actually get.
      // Re-add a MobileApplication node with the Play URLs only once the
      // listing resolves — pointing installUrl at a 404 risks the whole
      // site's rich results.
      '@type': 'WebApplication',
      '@id': 'https://hookpost.hookstep.in/#app',
      name: 'Hookpost: AI Social Scheduler',
      operatingSystem: 'All (any modern browser)',
      browserRequirements:
        'Requires JavaScript. Supports Chrome, Firefox, Safari, and Edge.',
      applicationCategory: 'BusinessApplication',
      url: 'https://hookpost.hookstep.in',
      softwareVersion: '1.0.0',
      // No aggregateRating until there are real reviews to point at —
      // fabricated ratings are a Google spam-policy violation that can kill
      // rich results site-wide.
      // USD for the world, INR restricted to India - see SeoSchemas.tsx for
      // why an INR-only offer stopped matching the visible page.
      offers: [
        { '@type': 'Offer', price: String(pricingUSD.FREE.month_price), priceCurrency: 'USD', name: 'Free Forever' },
        { '@type': 'Offer', price: String(pricingUSD.STANDARD.month_price), priceCurrency: 'USD', name: 'Standard' },
        { '@type': 'Offer', price: String(pricingUSD.PRO.month_price), priceCurrency: 'USD', name: 'Pro' },
        { '@type': 'Offer', price: String(pricingINR.FREE.month_price), priceCurrency: 'INR', eligibleRegion: 'IN', name: 'Free Forever (India)' },
        { '@type': 'Offer', price: String(pricingINR.STANDARD.month_price), priceCurrency: 'INR', eligibleRegion: 'IN', name: 'Standard (India - UPI / NetBanking / card via Razorpay)' },
        { '@type': 'Offer', price: String(pricingINR.PRO.month_price), priceCurrency: 'INR', eligibleRegion: 'IN', name: 'Pro (India)' },
      ],
    },
  ],
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ ['--new-bgColor' as any]: '#05070a' }}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#05070a" />
        <meta
          name="p:domain_verify"
          content="173f3dbe31873eabc4da7e0962f5a07f"
        />
        <meta name="apple-mobile-web-app-title" content="Hookpost" />
        <meta name="application-name" content="Hookpost" />
        <meta name="format-detection" content="telephone=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // The homepage is served from the Cloudflare cache even to
                // signed-in users, so the middleware never sees those requests
                // and this is what sends them to the app. It used to redirect
                // on the readable hint alone. A hint outlives its session, so a
                // signed-out visitor went / -> /launches -> /auth, which is the
                // SIGN-UP page, and a returning customer could not get back to
                // the homepage at all. Now it asks the backend first: 200 goes
                // to the app, 401 deletes the stale hint in both the domain and
                // host-only shapes it can be stored in, and the visitor stays.
                try {
                  if (window.location.pathname !== '/') return;
                  var hinted = document.cookie.split(';').some(function (c) {
                    return c.trim().indexOf('hp_logged_in=1') === 0;
                  });
                  if (!hinted) return;
                  fetch('/api/user/self', { credentials: 'include', cache: 'no-store' })
                    .then(function (r) {
                      if (r.ok) { window.location.replace('/launches'); return; }
                      if (r.status === 401) {
                        var h = window.location.hostname.split('.');
                        var d = h.length > 2 ? '; domain=.' + h.slice(-2).join('.') : '';
                        document.cookie = 'hp_logged_in=; path=/; max-age=0';
                        document.cookie = 'hp_logged_in=; path=/; max-age=0' + d;
                      }
                    })
                    .catch(function () {});
                } catch (e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body { background-color: #05070a !important; color: #f4f4f6; margin: 0; }
              img, svg { max-width: 100%; height: auto; }
              nav img, header img, [class*="logo"] img, .brand-logo { max-width: 42px !important; max-height: 42px !important; object-fit: contain; }
              a { color: inherit; text-decoration: none; }
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${plusJakartaSans.variable}`}
        style={{
          margin: 0,
          color: '#f4f4f6',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/*
          Analytics were mounted only in (app)/layout.tsx - the logged-in app -
          so every marketing page was completely untracked: the homepage, the
          ten /alternatives/ pages, the fifteen /for/ pages, /mcp and the
          guides. That is precisely where paid traffic lands, which meant an ad
          click could never be tied to a signup and no retargeting audience
          could be built at all.

          Both components return null when their env var is unset, so this stays
          inert until NEXT_PUBLIC_FACEBOOK_PIXEL / NEXT_PUBLIC_GTM_ID exist.
        */}
        {/*
          These were deliberately left off the marketing pages while nothing was
          being spent: gtm.js 114KB + f.js 81KB + the pixel config 12KB measured
          208KB on the live homepage, 46% of its JavaScript, and they were the
          only reason Best Practices failed on third-party cookies. The note
          left here said to put them back the day paid campaigns start, because
          that is when match quality from the _fbp cookie is worth the weight.

          That day is 2026-09-18: Meta campaigns go live on these pages. Without
          the pixel here the landing view carries no _fbp, so no retargeting
          audience of visitors can be built at all and click attribution rests
          entirely on the Conversions API. ViewContentTracker still sends the
          server-side copy with event-ID deduplication, so the two do not double
          count.

          If the campaigns are stopped, take these back out - the page weight is
          only worth paying for while it is buying something.
        */}
        <FacebookComponent />
        <GoogleTagManagerComponent
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
        />
        {/*
          UtmSaver was mounted only in (app)/(provider)/(extension), never here.
          Paid traffic lands on these marketing pages carrying ?utm_source=...,
          so the tag was read for the first time on /auth/register - by which
          point the parameters are long gone and landingUrl/referrer record an
          internal hop. Every ad-sourced signup attributed to nothing.

          It reads useSearchParams, which opts a route into dynamic rendering
          unless it sits behind a Suspense boundary; these landing pages are
          statically prerendered and must stay that way.
        */}
        <Suspense fallback={null}>
          <UtmSaver />
        </Suspense>
        {/*
          TrackEnum.ViewContent was defined but nothing ever sent it, so the
          pixel had no top-of-funnel signal: no audience of people who read a
          landing page and left, and nothing for the algorithm to learn from
          but the few who converted. Landing routes only - firing this on every
          logged-in screen in (app) would bury the marketing signal.
        */}
        <ViewContentTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {/* <main>, not <div>: Lighthouse flagged "Document does not have a main
            landmark" on every marketing page, and screen-reader users lose the
            skip-to-content target without it. */}
        <main style={{ background: '#05070a', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
