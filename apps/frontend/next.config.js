// @ts-check
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a deploy build into a staging directory instead of overwriting the one
  // the running server is reading. `next build` clears distDir before it writes,
  // so building in place on the server took the frontend down for the whole
  // build. Unset at runtime, so `next start` still serves `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  experimental: {
    // Inline the stylesheet into the HTML instead of linking it. LCP on the
    // marketing pages was 90% "render delay" with TBT at 8ms - the page was
    // waiting on the network, not on script - and the remaining blocker was a
    // 22KB stylesheet costing 450ms of round-trip before anything could paint.
    // Inlining removes that request entirely. Safe here because the landing
    // sheet is 23KB transferred after the Polotno/Uppy split; it would have
    // been a bad trade against the old 483KB bundle.
    inlineCss: true,
    proxyTimeout: 90_000,
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      'lodash',
      'dayjs',
      '@blueprintjs/icons',
      'lucide-react',
      'react-icons',
      '@tabler/icons-react',
      'date-fns',
    ],
  },
  // Cache and security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Document-Policy',
            value: 'js-profiling',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // The site was serving no HSTS header at all, so a first visit
            // over http:// was still downgradeable. Two years, subdomains
            // included. Not adding `preload` — that is a one-way submission
            // to a browser-baked list and should be a deliberate call.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Deny the powerful features this app never uses, so a compromised
            // third-party script cannot reach for them either.
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()',
          },
          {
            // same-origin-allow-popups, NOT same-origin: every social channel
            // connects through an OAuth popup, and strict same-origin severs
            // window.opener so the popup cannot hand the token back. That would
            // break connecting every provider - the whole product.
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            // REPORT-ONLY on purpose. A wrong CSP takes the site down, and this
            // app loads Next's inlined bootstrap, Sentry, GTM and the Meta
            // pixel on (app) routes, plus Polotno. Ship it in report-only,
            // read the violations, then promote to enforcing once the policy
            // is known to be complete. Promoting this without reading reports
            // first would be a self-inflicted outage.
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              // checkout.razorpay.com is the payment modal. It is absent from
              // this policy today, which is harmless only because the header is
              // report-only - promoting it to enforcing without these three
              // Razorpay origins would stop every customer paying. Added now so
              // the promotion is safe whenever someone does it.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://static.cloudflareinsights.com https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              // cloudflareinsights is Cloudflare's own Web Analytics beacon, injected by
              // the CDN itself - it is not something the app loads, and omitting it
              // made our own report-only policy the sole entry in Chrome's Issues
              // panel, costing a Best Practices point for a self-inflicted report.
              "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://*.sentry.io https://cloudflareinsights.com https://api.razorpay.com https://lumberjack.razorpay.com",
              // The Razorpay modal renders its card/UPI form in an iframe it
              // creates itself, so frame-src has to allow it explicitly -
              // default-src 'self' would otherwise blank the payment form.
              "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(favicon.ico|favicon.png|apple-touch-icon.png|brand/:path*|svgs/:path*|icons/:path*|pngs/:path*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  transpilePackages: ['crypto-hash'],
  productionBrowserSourceMaps: false,

  // Custom webpack config optimized for speed and lean bundles
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
  async redirects() {
    return [
      // Channels we no longer offer. These pages were indexed and linked, so a
      // 404 would waste the accumulated authority and strand anyone arriving
      // from search. 301 to the channel index instead, which lists what is
      // genuinely connectable. If a channel becomes available again, remove it
      // from HIDDEN_PROVIDERS, restore its channel-specs entry, and delete the
      // redirect - in that order.
      {
        source: '/channels/tiktok',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/reddit',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/dribbble',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/mastodon',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/google-business',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/whop',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/twitch',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/skool',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/kick',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/warpcast',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/vk',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/mewe',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/channels/tumblr',
        destination: '/channels',
        permanent: true,
      },
      {
        source: '/api/uploads/:path*',
        destination:
          process.env.STORAGE_PROVIDER === 'local' ? '/uploads/:path*' : '/404',
        permanent: true,
      },
      // /vs/<x> and /alternatives/<x> were two pages chasing the same query
      // with near-identical titles, splitting their own ranking signals. The
      // /alternatives/ pages are the longer and better-linked of the pair, so
      // the overlapping /vs/ ten fold into them. The six competitors that only
      // exist under /vs/ (zoho-social, sendible, loomly, tailwind, co-schedule,
      // meet-edgar) are untouched and still live there.
      {
        // The hand-written Google page moved to the slug the sitemap
        // advertises; the old URL is indexable, so it points at the new one.
        source: '/channels/google-my-business',
        destination: '/channels/google-business',
        permanent: true,
      },
      ...[
        'buffer',
        'postiz',
        'hootsuite',
        'sprout-social',
        'later',
        'metricool',
        'publer',
        'socialpilot',
        'planoly',
        'agorapulse',
      ].map((slug) => ({
        source: `/vs/${slug}`,
        destination: `/alternatives/${slug}`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination:
          process.env.STORAGE_PROVIDER === 'local'
            ? '/api/uploads/:path*'
            : '/404',
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Sourcemap configuration optimized for monorepo
  sourcemaps: {
    disable: false,
    // More comprehensive asset patterns for monorepo
    assets: [
      '.next/static/**/*.js',
      '.next/static/**/*.js.map',
      '.next/server/**/*.js',
      '.next/server/**/*.js.map',
    ],
    ignore: [
      '**/node_modules/**',
      '**/*hot-update*',
      '**/_buildManifest.js',
      '**/_ssgManifest.js',
      '**/*.test.js',
      '**/*.spec.js',
    ],
    deleteSourcemapsAfterUpload: true,
  },

  // Release configuration
  release: {
    create: true,
    finalize: true,
    // Use git commit hash for releases in monorepo
    name:
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || undefined,
  },

  // NextJS specific optimizations for monorepo
  widenClientFileUpload: true,

  // Additional configuration
  telemetry: false,
  silent: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',

  // Error handling for CI/CD
  errorHandler: (error) => {
    console.warn('Sentry build error occurred:', error.message);
    console.warn(
      'This might be due to missing Sentry environment variables or network issues'
    );
    // Don't fail the build if Sentry upload fails in monorepo context
    return;
  },
});
