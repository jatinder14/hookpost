import React from 'react';
import { pricingUSD, pricingINR, PURCHASABLE_TIERS } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { FAQ_DATA } from './LandingFaq';
import { CHANNEL_COUNT, PUBLISHABLE_CHANNEL_COUNT } from './channels/channel-count';

export default function SeoSchemas() {
  const homepageGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://hookpost.hookstep.in/#software',
        name: 'Hookpost',
        alternateName: ['Hookpost Social Media Scheduler', 'Hookpost AI Scheduler'],
        operatingSystem: 'All (Web-based, Cloud, Self-hostable Docker)',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Social Media Management & Automation',
        url: 'https://hookpost.hookstep.in',
        image: 'https://hookpost.hookstep.in/brand-logo.png',
        description:
          `Open-source social media management and scheduling platform. Schedule, automate, and publish posts to ${PUBLISHABLE_CHANNEL_COUNT} networks including Instagram, Pinterest, YouTube, LinkedIn, X, Facebook, and Threads.`,
        publisher: {
          '@id': 'https://hookpost.hookstep.in/#organization',
        },
        // Was INR-only with highPrice = ULTIMATE and offerCount 5. ULTIMATE
        // (and TEAM) are retired - PURCHASABLE_TIERS is FREE/STANDARD/PRO - so
        // the schema advertised a top price nobody can pay. And Googlebot crawls
        // from the US, where the visible page now says $15: an INR-only offer
        // no longer matched the price on the page it described. USD is the
        // aggregate; the INR offers carry eligibleRegion IN.
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: String(pricingUSD.FREE.month_price),
          highPrice: String(pricingUSD.PRO.month_price),
          offerCount: String(PURCHASABLE_TIERS.length * 2),
          offers: [
            ...PURCHASABLE_TIERS.map((tier) => ({
              '@type': 'Offer',
              name: tier === 'FREE' ? 'Free Plan' : tier.charAt(0) + tier.slice(1).toLowerCase(),
              price: String(pricingUSD[tier].month_price),
              priceCurrency: 'USD',
            })),
            ...PURCHASABLE_TIERS.map((tier) => ({
              '@type': 'Offer',
              name: `${tier === 'FREE' ? 'Free Plan' : tier.charAt(0) + tier.slice(1).toLowerCase()} (India)`,
              price: String(pricingINR[tier].month_price),
              priceCurrency: 'INR',
              eligibleRegion: 'IN',
            })),
          ],
        },
        featureList: [
          'Multi-channel visual content calendar',
          `${CHANNEL_COUNT} supported social platforms`,
          'Instagram Reels and carousel auto-publishing',
          'Facebook Reels and Page video scheduling',
          'YouTube Shorts auto-publishing',
          'Pinterest Pin board scheduling',
          'AI caption and hashtag generation',
          'Team workspace and role management',
          'Real-time social analytics & engagement tracking',
          'Official Model Context Protocol (MCP) server',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://hookpost.hookstep.in/#faq',
        mainEntity: FAQ_DATA.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://hookpost.hookstep.in/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://hookpost.hookstep.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Alternatives',
            item: 'https://hookpost.hookstep.in/alternatives',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Compare Tools',
            item: 'https://hookpost.hookstep.in/compare',
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph) }}
    />
  );
}
