export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  anchor_month_price?: number;
  anchor_year_price?: number;
  discount_percent?: number;
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
 * Currencies this Razorpay account can actually collect in.
 *
 * Checked against live Razorpay on 2026-09-17: of 8 payments ever taken, ALL
 * were INR. USD had 8 subscriptions created and 0 ever reached `authenticated`;
 * EUR and GBP have no plans on the account at all, so their checkouts cannot
 * even start. International cards and international recurring ARE switched on
 * in the dashboard - the capability exists - but no non-INR charge has ever
 * completed, and the dashboard also warns that non-3DS is disabled by
 * Razorpay's fraud team and that "only limited cards are supported" under the
 * RBI rules. Quoting a price nobody can pay costs an ad click and the trust.
 *
 * To re-enable a currency: take ONE real subscription in it end to end, watch
 * it reach `authenticated`, then add it here. Nothing else needs changing.
 */
export const COLLECTABLE_CURRENCIES: SupportedCurrency[] = ['INR'];

/**
 * The visitor's true regional currency, before collectability is considered.
 * Copy decisions (which wording, which parity claim) must use this, otherwise
 * a US visitor would be told they are getting an Indian regional discount.
 */
export function resolveCountryToCurrencyRaw(
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
 * The currency to actually BILL a visitor in. Falls back to INR whenever the
 * regional currency is not collectable, so nobody is ever shown a price that
 * cannot be charged. See COLLECTABLE_CURRENCIES.
 */
export function resolveCountryToCurrency(
  countryCode?: string,
  timezone?: string
): SupportedCurrency {
  const regional = resolveCountryToCurrencyRaw(countryCode, timezone);
  return COLLECTABLE_CURRENCIES.includes(regional) ? regional : 'INR';
}

/**
 * Determines if a visitor is in the Indian region. Deliberately uses the RAW
 * currency: this drives copy, not billing, and a foreign visitor billed in INR
 * is still not in the Indian region.
 */
export function isIndianRegion(countryCode?: string, timezone?: string): boolean {
  return resolveCountryToCurrencyRaw(countryCode, timezone) === 'INR';
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
    image_generation_count: 150,
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
    generate_videos: 10,
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
 * The plans we actually SELL. Four paid tiers was over-segmentation for a
 * product with a single-digit customer count: it multiplied the Razorpay plan
 * objects (13 exist, of which 3 are leftover test plans and one is an orphan at
 * a price we never offered), and every extra tier is another thing to keep
 * correct on the pricing page, in the FAQ and in the JSON-LD.
 *
 * TEAM and ULTIMATE keep their TIER_LIMITS entries on purpose. Entitlements are
 * resolved as `pricing[tier]`, and subscription.service.ts:52 treats a missing
 * tier as FREE - so deleting them would silently drop existing TEAM and
 * ULTIMATE subscribers to free-tier limits. There are live rows on both. They
 * are no longer purchasable; they still work for whoever already has them.
 */
export const PURCHASABLE_TIERS = ['FREE', 'STANDARD', 'PRO'] as const;

/**
 * INR Pricing (₹) - Regional Purchasing Power Parity (58% off global anchor).
 */
export const pricingINR: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 599, year_price: 5990, anchor_month_price: 1699, anchor_year_price: 16990, discount_percent: 65, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 1499, year_price: 13990, anchor_month_price: 3499, anchor_year_price: 34990, discount_percent: 57, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 1999, year_price: 19990, anchor_month_price: 5499, anchor_year_price: 54990, discount_percent: 64, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 4499, year_price: 43990, anchor_month_price: 9999, anchor_year_price: 99990, discount_percent: 55, ...TIER_LIMITS.ULTIMATE },
};

/**
 * USD Pricing ($) - Global Standard.
 *
 * Rule: every tier must sit strictly BELOW both competitors at the same channel
 * count. Buffer charges $5/channel (5ch $25, 10ch $50, 30ch $150, 100ch $500);
 * Postiz charges $29 / $39 / $49 / $99 for 5 / 10 / 30 / 100 channels. TEAM, PRO
 * and ULTIMATE used to lose that comparison against Postiz ($39/$79/$159), which
 * is why they moved to $35/$45/$89.
 *
 * The floor is worst-case COGS from the unit costs documented above - every
 * quota maxed, an AI caption on every post, every video generated:
 *
 *   STANDARD  $2.05   TEAM  $8.04   PRO  $20.06   ULTIMATE  $38.35
 *
 * leaving 89% / 77% / 55% / 57% gross margin at the prices below. Do not cut
 * further without recomputing that table - PRO carries the most video allowance
 * and is the first tier that would go underwater.
 *
 * INR is deliberately NOT changed: at ~Rs88/$ it already reads $7.94 / $17.03 /
 * $26.12 / $51.12, under both competitors everywhere. Its PRO and ULTIMATE
 * worst-case margins are the thinnest in the file (23% and 25%), so INR has no
 * room to move down.
 */
export const pricingUSD: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 15, year_price: 150, anchor_month_price: 29, anchor_year_price: 290, discount_percent: 48, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 35, year_price: 350, anchor_month_price: 59, anchor_year_price: 590, discount_percent: 41, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 39, year_price: 390, anchor_month_price: 119, anchor_year_price: 1190, discount_percent: 67, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 89, year_price: 890, anchor_month_price: 239, anchor_year_price: 2390, discount_percent: 63, ...TIER_LIMITS.ULTIMATE },
};

/**
 * EUR Pricing (€) - European Union (35% off launch offer).
 */
export const pricingEUR: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 15, year_price: 150, anchor_month_price: 29, anchor_year_price: 290, discount_percent: 48, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 35, year_price: 350, anchor_month_price: 59, anchor_year_price: 590, discount_percent: 41, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 39, year_price: 390, anchor_month_price: 119, anchor_year_price: 1190, discount_percent: 67, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 89, year_price: 890, anchor_month_price: 239, anchor_year_price: 2390, discount_percent: 63, ...TIER_LIMITS.ULTIMATE },
};

/**
 * GBP Pricing (£) - United Kingdom (36% off launch offer).
 */
export const pricingGBP: PricingInterface = {
  FREE: { current: 'FREE', month_price: 0, year_price: 0, ...TIER_LIMITS.FREE },
  STANDARD: { current: 'STANDARD', month_price: 16, year_price: 150, anchor_month_price: 25, anchor_year_price: 250, discount_percent: 36, ...TIER_LIMITS.STANDARD },
  TEAM: { current: 'TEAM', month_price: 29, year_price: 290, anchor_month_price: 49, anchor_year_price: 490, discount_percent: 41, ...TIER_LIMITS.TEAM },
  PRO: { current: 'PRO', month_price: 37, year_price: 370, anchor_month_price: 99, anchor_year_price: 990, discount_percent: 63, ...TIER_LIMITS.PRO },
  ULTIMATE: { current: 'ULTIMATE', month_price: 74, year_price: 740, anchor_month_price: 199, anchor_year_price: 1990, discount_percent: 63, ...TIER_LIMITS.ULTIMATE },
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
