export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  channel?: number;
  posts_per_month: number;
  // Cap on AI *text* generations (copilot chat + agent). Images and videos
  // were already metered; text was not, which made it the only unbounded
  // variable cost on the account.
  ai_generation_count: number;
  team_members: boolean;
  community_features: boolean;
  featured_by_gitroom: boolean;
  ai: boolean;
  import_from_channels: boolean;
  image_generator?: boolean;
  image_generation_count: number;
  generate_videos: number;
  public_api: boolean;
  webhooks: number;
  autoPost: boolean;
}
export interface PricingInterface {
  [key: string]: PricingInnerInterface;
}

/**
 * Billing currency.
 *
 * Hookpost supports multi-currency regional pricing:
 * - INR (₹) for India (Razorpay UPI, NetBanking, Cards)
 * - USD ($) for US & Global (Stripe / Razorpay International)
 * - EUR (€) for European Union
 * - GBP (£) for United Kingdom
 * Default for international traffic is USD ($).
 */
export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  minorMultiplier: number;
  label: string;
}

export const CURRENCY_CONFIG: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', minorMultiplier: 100, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', minorMultiplier: 100, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', minorMultiplier: 100, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', minorMultiplier: 100, label: 'GBP (£)' },
};

export const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE'
]);

/**
 * Resolves a visitor's country and timezone to their regional currency.
 * Guarantees zero leakage: non-Indian visitors NEVER default to INR.
 */
export function resolveCountryToCurrency(
  countryCode?: string,
  timezone?: string
): SupportedCurrency {
  const code = (countryCode || '').trim().toUpperCase();
  const tz = (timezone || '').trim().toLowerCase();

  // 1. Explicit India detection
  if (code === 'IN' || tz.includes('kolkata') || tz.includes('calcutta')) {
    return 'INR';
  }

  // 2. United Kingdom
  if (code === 'GB' || code === 'UK' || tz.includes('london')) {
    return 'GBP';
  }

  // 3. European Union
  if (EU_COUNTRIES.has(code) || tz.includes('berlin') || tz.includes('paris') || tz.includes('rome') || tz.includes('madrid')) {
    return 'EUR';
  }

  // 4. Default global standard is USD
  return 'USD';
}

/**
 * Determines if a visitor is in the Indian region.
 * Used to completely hide Indian pricing from foreign visitors.
 */
export function isIndianRegion(countryCode?: string, timezone?: string): boolean {
  return resolveCountryToCurrency(countryCode, timezone) === 'INR';
}

export const CURRENCY_CODE =
  (process.env.NEXT_PUBLIC_BILLING_CURRENCY as SupportedCurrency) ||
  (process.env.BILLING_CURRENCY as SupportedCurrency) ||
  'INR';

export const CURRENCY_SYMBOL =
  process.env.NEXT_PUBLIC_BILLING_CURRENCY_SYMBOL ||
  process.env.BILLING_CURRENCY_SYMBOL ||
  '₹';

export const CURRENCY_MINOR_MULTIPLIER = 100;

export function getCurrencyConfig(currency?: string): CurrencyConfig {
  const code = (currency || CURRENCY_CODE).toUpperCase() as SupportedCurrency;
  return CURRENCY_CONFIG[code] || CURRENCY_CONFIG.USD;
}

/**
 * Highly competitive pricing with 85%+ gross profit margin via Razorpay.
 */
// posts_per_month is a real gate - permissions.service.ts blocks publishing
// once the org's monthly count reaches it. It used to be 1000000 on every paid
// tier (no cap in practice) while the pricing page advertised 400 on Standard,
// and 0 on FREE, which meant the advertised free tier could not publish at all.
//
// These numbers come from measured production cost: ~Rs 0.005 per published
// post (about 30 Redis commands) rising to ~Rs 0.065 if an AI caption is
// generated with gpt-4.1-mini. Each tier works out to 3-5 posts per channel
// per day, and the worst case - an AI caption on every single post - stays
// under 22% of the plan price on every tier.
/**
 * Shared tier limits between INR and USD tiers.
 */
const TIER_LIMITS = {
  FREE: {
    channel: 2,
    image_generation_count: 0,
    posts_per_month: 30,
    ai_generation_count: 0,
    team_members: false,
    community_features: false,
    featured_by_gitroom: false,
    ai: false,
    import_from_channels: false,
    image_generator: false,
    public_api: false,
    webhooks: 0,
    autoPost: false,
    generate_videos: 0,
  },
  STANDARD: {
    channel: 5,
    posts_per_month: 500,
    ai_generation_count: 500,
    image_generation_count: 20,
    team_members: false,
    ai: true,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: true,
    image_generator: false,
    public_api: true,
    webhooks: 2,
    autoPost: false,
    generate_videos: 3,
  },
  TEAM: {
    channel: 10,
    posts_per_month: 1500,
    ai_generation_count: 1500,
    image_generation_count: 100,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10,
    autoPost: true,
    generate_videos: 10,
  },
  PRO: {
    channel: 30,
    posts_per_month: 5000,
    ai_generation_count: 2500,
    image_generation_count: 300,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 30,
    autoPost: true,
    // Veo3 fast costs ~$0.30 (Rs 26) per generation at kie.ai, so the video
    // allowance is the single most expensive thing a plan can hand out. Held
    // to roughly 17% of plan price on every tier, matching the worst-case
    // discipline applied to posts above.
    generate_videos: 15,
  },
  ULTIMATE: {
    channel: 100,
    posts_per_month: 15000,
    ai_generation_count: 6000,
    image_generation_count: 500,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10000,
    autoPost: true,
    generate_videos: 25,
  },
};

/**
 * INR Pricing (₹).
 */
export const pricingINR: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 699, year_price: 5990, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 1499, year_price: 13990, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 2299, year_price: 21990, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 4499, year_price: 43990, ...TIER_LIMITS.ULTIMATE },
};

/**
 * USD Pricing ($) - Competitive SaaS Standard.
 * Benchmarked ~35% below Buffer ($30/mo for 5 channels) with far richer capabilities.
 */
export const pricingUSD: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 19, year_price: 180, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 39, year_price: 380, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 79, year_price: 780, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 159, year_price: 1550, ...TIER_LIMITS.ULTIMATE },
};

/**
 * EUR Pricing (€) - European Union.
 */
export const pricingEUR: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 19, year_price: 180, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 39, year_price: 380, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 79, year_price: 780, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 159, year_price: 1550, ...TIER_LIMITS.ULTIMATE },
};

/**
 * GBP Pricing (£) - United Kingdom.
 */
export const pricingGBP: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 16, year_price: 150, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 34, year_price: 330, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 69, year_price: 670, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 139, year_price: 1350, ...TIER_LIMITS.ULTIMATE },
};

export const PRICING_BY_CURRENCY: Record<SupportedCurrency, PricingInterface> = {
  INR: pricingINR,
  USD: pricingUSD,
  EUR: pricingEUR,
  GBP: pricingGBP,
};

export function getPricing(currency?: string): PricingInterface {
  if (currency && PRICING_BY_CURRENCY[currency.toUpperCase() as SupportedCurrency]) {
    return PRICING_BY_CURRENCY[currency.toUpperCase() as SupportedCurrency];
  }
  return pricingUSD;
}

/**
 * Backward compatibility: export default `pricing` aliased to INR.
 */
export const pricing: PricingInterface = pricingINR;
