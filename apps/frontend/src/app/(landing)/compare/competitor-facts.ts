// Verified facts on third-party social media tools, for the /compare pages.
//
// Every value was read off the vendor's own pricing page (or GitHub API for
// open-source licences) on FACTS_CHECKED; the URLs are in `sources` and are
// printed on each page. null means the vendor does not state it - never fill
// one from memory. Prices are what an Indian visitor is NOT necessarily shown:
// several vendors (Hootsuite, Zoho, Publer, SocialPilot) localise to INR by IP,
// which is what `inr` records. None of the twelve mention UPI.
//
// Re-check every vendor before bumping FACTS_CHECKED.

export const FACTS_CHECKED = '26 September 2026';

export interface CompetitorFacts {
  slug: string;
  name: string;
  freePlan: string | null;
  freeTrialDays: number | null;
  cheapestPaid: {
    name: string | null;
    price: number;
    currency: string;
    per: string;
    billing: 'annual' | 'monthly' | 'one-time';
    /** Entry price in USD per month, only when directly comparable. */
    usdMonthly: number | null;
    /** Channels the cheapest plan includes, when the vendor states a number. */
    channelsIncluded: number | null;
  } | null;
  pricingModel: string | null;
  api: boolean | null;
  mcp: boolean | null;
  openSource: string | null;
  inr: boolean | null;
  networks: string[];
  sources: string[];
  hasAlternativePage: boolean;
}

export const COMPETITOR_FACTS: Record<string, CompetitorFacts> = {
  "buffer": {
    "slug": "buffer",
    "name": "Buffer",
    "freePlan": "3 channels, 10 scheduled posts per channel (refills as posts publish)",
    "freeTrialDays": 14,
    "cheapestPaid": {
      "name": "Essentials",
      "price": 5,
      "currency": "USD",
      "per": "channel/month",
      "billing": "annual",
      "usdMonthly": 5.0,
      "channelsIncluded": 1
    },
    "pricingModel": "per channel",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": false,
    "networks": [
      "Bluesky",
      "Facebook",
      "Google Business Profile",
      "Instagram",
      "LinkedIn",
      "Mastodon",
      "Pinterest",
      "Substack",
      "Threads",
      "TikTok",
      "X",
      "YouTube"
    ],
    "sources": [
      "https://buffer.com/pricing",
      "https://buffer.com/mcp"
    ],
    "hasAlternativePage": true
  },
  "hootsuite": {
    "slug": "hootsuite",
    "name": "Hootsuite",
    "freePlan": null,
    "freeTrialDays": 14,
    "cheapestPaid": {
      "name": "Standard",
      "price": 99,
      "currency": "USD",
      "per": "user/month",
      "billing": "annual",
      "usdMonthly": 99.0,
      "channelsIncluded": 10
    },
    "pricingModel": "per user",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": true,
    "networks": [
      "Facebook",
      "Instagram",
      "LinkedIn",
      "Threads",
      "X",
      "TikTok",
      "Bluesky",
      "YouTube",
      "Pinterest",
      "WhatsApp",
      "Google Business Profile"
    ],
    "sources": [
      "https://www.hootsuite.com/plans",
      "https://www.hootsuite.com/integrations/mcp",
      "https://developer.hootsuite.com/docs/using-rest-apis",
      "https://help.hootsuite.com/hc/en-us/articles/204585410-Add-social-networks"
    ],
    "hasAlternativePage": true
  },
  "later": {
    "slug": "later",
    "name": "Later",
    "freePlan": null,
    "freeTrialDays": 14,
    "cheapestPaid": {
      "name": "Starter",
      "price": 18.75,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 18.75,
      "channelsIncluded": 8
    },
    "pricingModel": "flat tiers",
    "api": null,
    "mcp": null,
    "openSource": null,
    "inr": false,
    "networks": [
      "Instagram",
      "Facebook",
      "TikTok",
      "Pinterest",
      "LinkedIn",
      "YouTube",
      "Threads",
      "Snapchat"
    ],
    "sources": [
      "https://later.com/pricing/"
    ],
    "hasAlternativePage": true
  },
  "sprout-social": {
    "slug": "sprout-social",
    "name": "Sprout Social",
    "freePlan": null,
    "freeTrialDays": 30,
    "cheapestPaid": {
      "name": "Essentials",
      "price": 79,
      "currency": "USD",
      "per": "user/month",
      "billing": "annual",
      "usdMonthly": 79.0,
      "channelsIncluded": 5
    },
    "pricingModel": "per user",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": false,
    "networks": [
      "Facebook",
      "X",
      "Instagram",
      "LinkedIn",
      "Threads",
      "Pinterest",
      "TikTok"
    ],
    "sources": [
      "https://sproutsocial.com/pricing/",
      "https://support.sproutsocial.com/hc/en-us/articles/41236268336653-ChatGPT-Connection-Overview-and-Setup"
    ],
    "hasAlternativePage": true
  },
  "metricool": {
    "slug": "metricool",
    "name": "Metricool",
    "freePlan": "1 brand (all networks except LinkedIn and Twitter/X), 20 posts per month",
    "freeTrialDays": null,
    "cheapestPaid": {
      "name": "Starter",
      "price": 20,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 20.0,
      "channelsIncluded": null
    },
    "pricingModel": "flat tiers",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": false,
    "networks": [
      "Instagram",
      "Facebook",
      "Threads",
      "TikTok",
      "YouTube",
      "Twitch",
      "LinkedIn",
      "Pinterest",
      "Bluesky",
      "Google Business Profile",
      "Twitter/X (add-on)",
      "Web/Blog"
    ],
    "sources": [
      "https://metricool.com/pricing/"
    ],
    "hasAlternativePage": true
  },
  "publer": {
    "slug": "publer",
    "name": "Publer",
    "freePlan": "3 channels, 10 scheduled posts per account",
    "freeTrialDays": 7,
    "cheapestPaid": {
      "name": "Professional",
      "price": 4,
      "currency": "USD",
      "per": "channel/month",
      "billing": "annual",
      "usdMonthly": 4.0,
      "channelsIncluded": 1
    },
    "pricingModel": "per channel",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": true,
    "networks": [
      "Facebook",
      "Instagram",
      "X",
      "LinkedIn",
      "Pinterest",
      "TikTok",
      "YouTube",
      "Google Business Profile",
      "Threads",
      "Bluesky",
      "Mastodon",
      "Telegram",
      "WordPress"
    ],
    "sources": [
      "https://publer.com/plans"
    ],
    "hasAlternativePage": true
  },
  "socialpilot": {
    "slug": "socialpilot",
    "name": "SocialPilot",
    "freePlan": null,
    "freeTrialDays": 14,
    "cheapestPaid": {
      "name": "Essentials",
      "price": 25.5,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 25.5,
      "channelsIncluded": 7
    },
    "pricingModel": "flat tiers",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": true,
    "networks": [
      "Facebook",
      "Instagram",
      "LinkedIn",
      "X",
      "Threads",
      "TikTok",
      "Pinterest",
      "YouTube",
      "Google Business Profile",
      "Bluesky"
    ],
    "sources": [
      "https://www.socialpilot.co/plans",
      "https://www.socialpilot.co/socialpilot-pricing.md"
    ],
    "hasAlternativePage": true
  },
  "agorapulse": {
    "slug": "agorapulse",
    "name": "Agorapulse",
    "freePlan": null,
    "freeTrialDays": 30,
    "cheapestPaid": {
      "name": "Standard",
      "price": 79,
      "currency": "USD",
      "per": "user/month",
      "billing": "annual",
      "usdMonthly": 79.0,
      "channelsIncluded": 10
    },
    "pricingModel": "per user",
    "api": true,
    "mcp": true,
    "openSource": null,
    "inr": false,
    "networks": [
      "Facebook",
      "Instagram",
      "LinkedIn",
      "TikTok",
      "X",
      "YouTube",
      "Threads",
      "Pinterest",
      "Bluesky",
      "Google Business Profile"
    ],
    "sources": [
      "https://www.agorapulse.com/pricing/"
    ],
    "hasAlternativePage": true
  },
  "postiz": {
    "slug": "postiz",
    "name": "Postiz",
    "freePlan": null,
    "freeTrialDays": 7,
    "cheapestPaid": {
      "name": "Standard",
      "price": 23,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 23.0,
      "channelsIncluded": 5
    },
    "pricingModel": "flat tiers",
    "api": true,
    "mcp": true,
    "openSource": "AGPL-3.0",
    "inr": false,
    "networks": [
      "Facebook",
      "Instagram",
      "Threads",
      "LinkedIn",
      "Bluesky",
      "X",
      "TikTok",
      "YouTube",
      "Google Business Profile",
      "Reddit",
      "Telegram",
      "Discord",
      "Slack",
      "Pinterest"
    ],
    "sources": [
      "https://postiz.com/pricing",
      "https://api.github.com/repos/gitroomhq/postiz-app"
    ],
    "hasAlternativePage": true
  },
  "mixpost": {
    "slug": "mixpost",
    "name": "Mixpost",
    "freePlan": "unlimited accounts (Facebook Pages, X, Mastodon only)",
    "freeTrialDays": null,
    "cheapestPaid": {
      "name": "Pro",
      "price": 299,
      "currency": "USD",
      "per": "licence (1 domain or subdomain)",
      "billing": "one-time",
      "usdMonthly": null,
      "channelsIncluded": null
    },
    "pricingModel": "self-hosted licence",
    "api": true,
    "mcp": true,
    "openSource": "MIT (Mixpost Lite only; Pro/Enterprise source is delivered but redistribution is prohibited)",
    "inr": false,
    "networks": [
      "Facebook Pages",
      "Instagram",
      "X",
      "LinkedIn",
      "YouTube",
      "TikTok",
      "Pinterest",
      "Threads",
      "Bluesky",
      "Google Business Profile",
      "Mastodon",
      "Pixelfed"
    ],
    "sources": [
      "https://mixpost.app/pricing",
      "https://api.github.com/repos/inovector/mixpost"
    ],
    "hasAlternativePage": true
  },
  "zoho-social": {
    "slug": "zoho-social",
    "name": "Zoho Social",
    "freePlan": "6 channels",
    "freeTrialDays": 15,
    "cheapestPaid": {
      "name": "Standard",
      "price": 10,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 10.0,
      "channelsIncluded": 14
    },
    "pricingModel": "flat tiers",
    "api": null,
    "mcp": true,
    "openSource": null,
    "inr": true,
    "networks": [
      "Facebook",
      "X",
      "Instagram",
      "LinkedIn",
      "YouTube",
      "Pinterest",
      "TikTok",
      "Mastodon",
      "Threads",
      "Bluesky",
      "Snapchat",
      "Arattai",
      "WhatsApp Business",
      "Telegram"
    ],
    "sources": [
      "https://www.zoho.com/social/pricing.html",
      "https://www.zoho.com/social/mcp.html"
    ],
    "hasAlternativePage": false
  },
  "sendible": {
    "slug": "sendible",
    "name": "Sendible",
    "freePlan": null,
    "freeTrialDays": 14,
    "cheapestPaid": {
      "name": "Core",
      "price": 30,
      "currency": "USD",
      "per": "month",
      "billing": "annual",
      "usdMonthly": 30.0,
      "channelsIncluded": 6
    },
    "pricingModel": "flat tiers",
    "api": true,
    "mcp": null,
    "openSource": null,
    "inr": false,
    "networks": [
      "Instagram",
      "Facebook",
      "TikTok",
      "X",
      "LinkedIn",
      "Google Business Profile",
      "YouTube",
      "WordPress",
      "Threads",
      "Bluesky"
    ],
    "sources": [
      "https://www.sendible.com/pricing",
      "https://www.sendible.com/about"
    ],
    "hasAlternativePage": false
  }
};

// Pairs worth a page. Weighted to matchups where page 1 is small blogs rather
// than the vendors themselves (keyword map, 26 Sep 2026).
export const PAIRS: string[] = ["postiz-vs-buffer", "postiz-vs-mixpost", "postiz-vs-hootsuite", "postiz-vs-publer", "mixpost-vs-buffer", "publer-vs-buffer", "metricool-vs-buffer", "metricool-vs-later", "socialpilot-vs-buffer", "zoho-social-vs-buffer", "sendible-vs-hootsuite", "publer-vs-later", "buffer-vs-hootsuite", "later-vs-buffer"];
