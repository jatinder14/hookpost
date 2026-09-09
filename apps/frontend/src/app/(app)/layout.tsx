import { SentryComponent } from '@hookpost/frontend/components/layout/sentry.component';

export const dynamic = 'force-dynamic';
import '../global.scss';
import 'react-tooltip/dist/react-tooltip.css';
import '@copilotkit/react-ui/styles.css';
import LayoutContext from '@hookpost/frontend/components/layout/layout.context';
import { ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import clsx from 'clsx';
import { VariableContextComponent } from '@hookpost/react/helpers/variable.context';
import { Fragment } from 'react';
import { PHProvider } from '@hookpost/react/helpers/posthog';
import UtmSaver from '@hookpost/helpers/utils/utm.saver';
import { DubAnalytics } from '@hookpost/frontend/components/layout/dubAnalytics';
import { FacebookComponent } from '@hookpost/frontend/components/layout/facebook.component';
import { GoogleTagManagerComponent } from '@hookpost/frontend/components/layout/gtm.component';
import { cookies } from 'next/headers';
import {
  cookieName,
  fallbackLng,
} from '@hookpost/react/translation/i18n.config';
import { HtmlComponent } from '@hookpost/frontend/components/layout/html.component';
import Script from 'next/script';
import { ChangeDirClient } from '@hookpost/frontend/components/new-layout/change.dir.client';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['600', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://hookpost.hookstep.in'),
  title: {
    default: 'Hookpost — Open-Source Social Media Scheduler & AI Growth Platform',
    template: '%s | Hookpost',
  },
  description:
    'Hookpost is the modern, open-source social media management and scheduling platform. Schedule, publish, and automate across 30+ social networks from a single dashboard.',
  applicationName: 'Hookpost',
  authors: [{ name: 'JR Consulting Co.', url: 'https://hookpost.hookstep.in' }],
  creator: 'JR Consulting Co.',
  publisher: 'JR Consulting Co.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hookpost.hookstep.in',
    title: 'Hookpost — Open-Source Social Media Scheduler & AI Growth Platform',
    description:
      'Manage and schedule content across 30+ social networks with AI-assisted publishing and analytics.',
    siteName: 'Hookpost',
    images: [
      {
        url: 'https://hookpost.hookstep.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hookpost Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookpost — Open-Source Social Media Scheduler & AI Growth Platform',
    description:
      'Manage and schedule content across 30+ social networks with AI-assisted publishing.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
    creator: '@hookstep',
    site: '@hookstep',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const language = cookieStore.get(cookieName)?.value || fallbackLng;
  const Plausible = !!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
    ? PlausibleProvider
    : Fragment;
  return (
    <html lang={language}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {!!process.env.DATAFAST_WEBSITE_ID && (
          <Script
            data-website-id={process.env.DATAFAST_WEBSITE_ID}
            data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || "hookpost.hookstep.in"}
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <ChangeDirClient />
      <body
        className={clsx(jakartaSans.className, 'dark text-primary !bg-primary')}
      >
        <VariableContextComponent
          storageProvider={
            process.env.STORAGE_PROVIDER! as 'local' | 'cloudflare'
          }
          environment={process.env.NODE_ENV!}
          backendUrl={(process.env.PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL)!}
          plontoKey={process.env.NEXT_PUBLIC_POLOTNO!}
          razorpayKeyId={(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)!}
          isChatBase={!!process.env.CHATBASE_TOKEN}
          billingEnabled={!!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)}
          discordUrl={process.env.NEXT_PUBLIC_DISCORD_SUPPORT!}
          frontEndUrl={process.env.FRONTEND_URL!}
          isGeneral={!!process.env.IS_GENERAL}
          genericOauth={!!process.env.HOOKPOST_GENERIC_OAUTH}
          oauthLogoUrl={process.env.NEXT_PUBLIC_HOOKPOST_OAUTH_LOGO_URL!}
          oauthDisplayName={process.env.NEXT_PUBLIC_HOOKPOST_OAUTH_DISPLAY_NAME!}
          uploadDirectory={process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY!}
          cloudflareUrl={process.env.CLOUDFLARE_BUCKET_URL || ''}
          mainUrl={process.env.MAIN_URL || ''}
          mcpUrl={process.env.MCP_URL}
          dub={!!(process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)}
          facebookPixel={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL!}
          telegramBotName={process.env.TELEGRAM_BOT_NAME!}
          neynarClientId={process.env.NEYNAR_CLIENT_ID!}
          appleClientId={process.env.APPLE_CLIENT_ID!}
          isSecured={!process.env.NOT_SECURED}
          disableImageCompression={!!process.env.DISABLE_IMAGE_COMPRESSION}
          disableXAnalytics={!!process.env.DISABLE_X_ANALYTICS}
          sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN!}
          extensionId={process.env.EXTENSION_ID || ''}
          googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
          googleAdsTrialTracking={process.env.NEXT_PUBLIC_TRACKING_TRIAL}
          language={language}
          transloadit={
            process.env.TRANSLOADIT_AUTH && process.env.TRANSLOADIT_TEMPLATE
              ? [
                  process.env.TRANSLOADIT_AUTH!,
                  process.env.TRANSLOADIT_TEMPLATE!,
                ]
              : []
          }
        >
          <SentryComponent>
            {/*<SetTimezone />*/}
            <HtmlComponent />
            <DubAnalytics />
            <FacebookComponent />
            {/*
              googleAdsId used to be fed NEXT_PUBLIC_GTM_ID, which is the GTM
              *container* id. TrialTracker therefore built
              send_to: 'GTM-N8ZDNPBG/<label>' - structurally invalid, because
              send_to needs an AW- conversion id. The StartTrial conversion
              could never have registered.

              Both ids are passed now: the container for whatever is configured
              in the GTM UI (currently nothing), and AW-17318487961 via gtag so
              Google Ads can actually detect the tag - it currently reports the
              Google tag as URGENT / not detected.
            */}
            <GoogleTagManagerComponent
              gtmId={process.env.NEXT_PUBLIC_GTM_ID}
              googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
            />
            <Plausible
              domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || 'hookpost.hookstep.in'}
            >
              <PHProvider
                phkey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
                host={process.env.NEXT_PUBLIC_POSTHOG_HOST}
              >
                <LayoutContext>
                  <UtmSaver />
                  {children}
                </LayoutContext>
              </PHProvider>
            </Plausible>
          </SentryComponent>
        </VariableContextComponent>
      </body>
    </html>
  );
}
