import React from 'react';
import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
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
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: String(pricing.FREE.month_price),
          highPrice: String(pricing.ULTIMATE.month_price),
          offerCount: '5',
          offers: [
            {
              '@type': 'Offer',
              name: 'Free Plan',
              price: String(pricing.FREE.month_price),
              priceCurrency: 'INR',
              description: `Free social media scheduling and multi-platform publishing across ${PUBLISHABLE_CHANNEL_COUNT} channels.`,
            },
            {
              '@type': 'Offer',
              name: 'Standard',
              price: String(pricing.STANDARD.month_price),
              priceCurrency: 'INR',
              description: 'Multi-Channel Publishing, Multi-Agent AI Copilot, Visual Calendar, MCP Server & Analytics.',
            },
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
