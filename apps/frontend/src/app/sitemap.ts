import { MetadataRoute } from 'next';

const baseUrl = 'https://hookpost.hookstep.in';

// Real edit dates, bumped by hand when the content in that group actually
// changes.
//
// This used to be `new Date().toISOString()` for every entry, which meant all
// 86 URLs reported "modified just now" on every single crawl. Google discards
// lastmod once it catches a site doing that, so the signal was worth nothing.
// Honest, stable dates are what make it worth something again.
const UPDATED = {
  home: '2026-09-06',
  docs: '2026-09-06',
  guides: '2026-08-28',
  alternatives: '2026-08-28',
  personas: '2026-08-20',
  channels: '2026-08-20',
  legal: '2026-07-15',
};

type Entry = MetadataRoute.Sitemap[number];

const page = (
  path: string,
  lastModified: string,
  priority: number,
  changeFrequency: Entry['changeFrequency']
): Entry => ({
  url: path === '/' ? baseUrl : `${baseUrl}${path}`,
  lastModified,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  // Priorities are only useful as a *relative* ranking. Previously 82 of 86
  // URLs sat at >= 0.85, which told crawlers nothing. These spread across the
  // full range so the hubs and money pages actually stand out.
  const core: Entry[] = [
    page('/', UPDATED.home, 1.0, 'weekly'),
    page('/mcp', UPDATED.home, 0.9, 'weekly'),
    // High-intent money page. Did not exist until pricing moved off the
    // homepage fragment.
    page('/pricing', UPDATED.home, 0.9, 'weekly'),
    page('/alternatives', UPDATED.alternatives, 0.9, 'weekly'),
    page('/channels', UPDATED.channels, 0.8, 'monthly'),
    page('/for', UPDATED.personas, 0.8, 'monthly'),
    page('/compare', UPDATED.alternatives, 0.8, 'monthly'),
    page('/about', UPDATED.home, 0.7, 'monthly'),
    page('/contact', UPDATED.home, 0.7, 'monthly'),
    // The guides hub. LandingFaq linked here long before the page existed.
    page('/guides', UPDATED.guides, 0.75, 'monthly'),
  ];

  // Developer docs — these were live and indexable but missing from the
  // sitemap entirely, so nothing pointed crawlers at them.
  const docs: Entry[] = [
    page('/docs/public-api', UPDATED.docs, 0.85, 'monthly'),
    page('/docs/oauth', UPDATED.docs, 0.8, 'monthly'),
  ];

  const guides: Entry[] = [
    'claude-mcp-social-media',
    'docker-self-hosting',
    'why-we-rewrote-postiz',
  ].map((slug) => page(`/guides/${slug}`, UPDATED.guides, 0.85, 'monthly'));

  const alternatives: Entry[] = [
    'postiz',
    'buffer',
    'hootsuite',
    'sprout-social',
    'later',
    'metricool',
    'publer',
    'socialpilot',
    'agorapulse',
    'planoly',
  ].map((slug) =>
    page(
      `/alternatives/${slug}`,
      UPDATED.alternatives,
      slug === 'postiz' ? 0.9 : 0.75,
      'monthly'
    )
  );

  // Only the competitors that do NOT have an /alternatives page. The ten that
  // overlap are canonicalised onto /alternatives/<slug>, so listing them here
  // too would submit a URL that points its canonical somewhere else.
  const vs: Entry[] = [
    'zoho-social',
    'sendible',
    'loomly',
    'tailwind',
    'co-schedule',
    'meet-edgar',
  ].map((slug) => page(`/vs/${slug}`, UPDATED.alternatives, 0.6, 'monthly'));

  const personas: Entry[] = [
    'creators',
    'agencies',
    'small-business',
    'students-young-creators',
    'solopreneurs-freelancers',
    'educators-nonprofits',
    'enterprise-teams',
    'real-estate',
    'ecommerce',
    'crypto-web3',
    'fitness-coaches',
    'music-artists',
    'restaurants-cafes',
    'healthcare-clinics',
    'b2b-saas',
  ].map((slug) => page(`/for/${slug}`, UPDATED.personas, 0.55, 'monthly'));

  const channels: Entry[] = [
    'instagram',
    'pinterest',
    'youtube',
    'linkedin',
    'facebook',
    'threads',
    'x',
    'bluesky',
    'discord',
    'slack',
    'telegram',
    'lemmy',
    'nostr',
    'listmonk',
    'wordpress',
    'medium',
    'hashnode',
    'devto',
  ].map((slug) => page(`/channels/${slug}`, UPDATED.channels, 0.5, 'monthly'));

  // Legal pages stay listed so the entity looks complete, but at low priority.
  // /auth and /auth/login are deliberately absent: a login form has nothing to
  // rank for, and submitting it just spends crawl budget.
  const legal: Entry[] = [
    page('/privacy', UPDATED.legal, 0.3, 'yearly'),
    page('/terms', UPDATED.legal, 0.3, 'yearly'),
    page('/data-deletion', UPDATED.legal, 0.3, 'yearly'),
  ];

  return [
    ...core,
    ...docs,
    ...guides,
    ...alternatives,
    ...vs,
    ...personas,
    ...channels,
    ...legal,
  ];
}
