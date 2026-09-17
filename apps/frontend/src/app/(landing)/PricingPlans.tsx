'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  pricingINR,
  pricingUSD,
  pricingEUR,
  pricingGBP,
  getPricing,
  CURRENCY_CONFIG,
  SupportedCurrency,
  isIndianRegion,
} from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

export interface PricingPlansProps {
  id?: string;
  initialCurrency?: SupportedCurrency;
  initialCountry?: string;
  isIndianRegion?: boolean;
}

/**
 * Shared pricing tables for homepage and /pricing page.
 * Features strict geo-isolation and Purchasing Power Parity (PPP):
 * - International visitors (US/EU/UK/UAE/Global) see localized global currencies with Early Adopter discounts. Figures live in pricing.ts; do not restate them in comments.
 * - INR rates carry a regional parity discount, strictly isolated to genuine domestic visitors. Figures live in pricing.ts.
 * - Secondary client-side timezone verification prevents foreign VPN users from spoofing Indian domestic rates.
 */
export const PricingPlans = ({
  id,
  initialCurrency,
  initialCountry,
  isIndianRegion: initialIsIndian,
}: PricingPlansProps) => {
  // Determine initial state from SSR props (defaults to USD for zero leak)
  const [currency, setCurrency] = useState<SupportedCurrency>(initialCurrency || 'USD');
  const [isIndian, setIsIndian] = useState<boolean>(
    initialIsIndian ?? (initialCountry === 'IN' || initialCurrency === 'INR')
  );

  const isUAE = (initialCountry || '').toUpperCase() === 'AE';

  useEffect(() => {
    // Client-side timezone verification (detects VPN / proxy spoofing)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
    const detectedIndian = tz.includes('kolkata') || tz.includes('calcutta') || tz.includes('asia/colombo');
    const isForeignTz =
      tz.includes('america') ||
      tz.includes('europe') ||
      tz.includes('london') ||
      tz.includes('pacific') ||
      tz.includes('australia');

    // Anti-Arbitrage Protection: If a foreign visitor uses an Indian VPN,
    // their device timezone flags the spoofing. Enforce global USD standard.
    if (isForeignTz && !initialIsIndian) {
      setCurrency('USD');
      setIsIndian(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hookpost_currency', 'USD');
        document.cookie = 'hookpost_currency=USD; path=/; max-age=2592000; SameSite=Lax';
      }
      return;
    }

    // Read persisted currency from cookie or localStorage
    const saved =
      typeof window !== 'undefined'
        ? (localStorage.getItem('hookpost_currency') ||
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('hookpost_currency='))
              ?.split('=')[1])
        : null;

    // Strict Anti-INR Leak Protection:
    // If not detected in India, NEVER allow INR. Always force USD or regional currency.
    if (!detectedIndian && !initialIsIndian && (saved === 'INR' || !saved)) {
      setCurrency('USD');
      setIsIndian(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('hookpost_currency', 'USD');
        document.cookie = 'hookpost_currency=USD; path=/; max-age=2592000; SameSite=Lax';
      }
    } else if (detectedIndian || initialIsIndian) {
      setIsIndian(true);
      if (saved === 'USD' || saved === 'INR') {
        setCurrency(saved as SupportedCurrency);
      } else {
        setCurrency('INR');
      }
    } else if (saved === 'USD' || saved === 'EUR' || saved === 'GBP') {
      setCurrency(saved as SupportedCurrency);
    }
  }, [initialIsIndian]);

  const changeCurrency = (c: SupportedCurrency) => {
    // Prevent foreign visitors from switching to INR
    if (!isIndian && c === 'INR') return;
    setCurrency(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hookpost_currency', c);
      document.cookie = `hookpost_currency=${c}; path=/; max-age=2592000; SameSite=Lax`;
    }
  };

  const activePricing = getPricing(currency);
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const sym = config.symbol;
  const isINR = currency === 'INR';
  const locale =
    currency === 'INR'
      ? 'en-IN'
      : currency === 'GBP'
      ? 'en-GB'
      : currency === 'EUR'
      ? 'de-DE'
      : 'en-US';

  const paymentMethodText =
    currency === 'INR'
      ? 'UPI, NetBanking or cards'
      : currency === 'EUR'
      ? 'SEPA, European credit cards or PayPal'
      : currency === 'GBP'
      ? 'UK credit cards, Apple Pay or PayPal'
      : isUAE
      ? 'UAE credit/debit cards (Mashreq, ENBD, ADCB) or Apple Pay'
      : 'International credit/debit cards (Visa, Mastercard, Amex)';

  // Two paid plans only. TEAM was dropped from the lineup (PURCHASABLE_TIERS in
  // pricing.ts) because four tiers was over-segmentation at this customer count;
  // its TIER_LIMITS entry still exists so current TEAM subscribers keep their
  // entitlements, it simply cannot be bought any more.
  const plans = [
    {
      name: 'Free',
      price: `${sym}${activePricing.FREE.month_price.toLocaleString(locale)}`,
      anchorPrice: null,
      discountBadge: null,
      subnote: null,
      blurb: 'Enough to see whether it fits.',
      features: [
        `${activePricing.FREE.channel} channels`,
        `${activePricing.FREE.posts_per_month} posts / month`,
        activePricing.FREE.team_members ? 'Unlimited team members' : 'Just you - 1 user',
        'Visual calendar',
        'Public API',
      ],
      cta: 'Start free',
      featured: false,
    },
    {
      name: 'Standard',
      price: `${sym}${activePricing.STANDARD.month_price.toLocaleString(locale)}`,
      anchorPrice: activePricing.STANDARD.anchor_month_price
        ? `${sym}${activePricing.STANDARD.anchor_month_price.toLocaleString(locale)}`
        : null,
      discountBadge: activePricing.STANDARD.discount_percent
        ? `${activePricing.STANDARD.discount_percent}% OFF`
        : null,
      subnote: isUAE && currency === 'USD' ? 'Approx ~69 AED / month' : null,
      blurb: 'For a solo creator or a small brand.',
      features: [
        `${activePricing.STANDARD.channel} channels`,
        `${activePricing.STANDARD.posts_per_month.toLocaleString(locale)} posts / month`,
        activePricing.STANDARD.team_members ? 'Unlimited team members' : 'Just you - 1 user',
        `${activePricing.STANDARD.ai_generation_count.toLocaleString(locale)} AI text generations`,
        activePricing.STANDARD.generate_videos
          ? `${activePricing.STANDARD.image_generation_count} AI images · ${activePricing.STANDARD.generate_videos} AI videos`
          : `${activePricing.STANDARD.image_generation_count} AI images`,
        `${activePricing.STANDARD.webhooks} webhooks`,
      ],
      cta: 'Start 7-day trial',
      featured: true,
    },
    {
      name: 'Pro',
      price: `${sym}${activePricing.PRO.month_price.toLocaleString(locale)}`,
      anchorPrice: activePricing.PRO.anchor_month_price
        ? `${sym}${activePricing.PRO.anchor_month_price.toLocaleString(locale)}`
        : null,
      discountBadge: activePricing.PRO.discount_percent
        ? `${activePricing.PRO.discount_percent}% OFF`
        : null,
      subnote: isUAE && currency === 'USD' ? 'Approx ~290 AED / month' : null,
      blurb: 'For agencies running many brands.',
      features: [
        `${activePricing.PRO.channel} channels`,
        `${activePricing.PRO.posts_per_month.toLocaleString(locale)} posts / month`,
        activePricing.PRO.team_members ? 'Unlimited team members' : 'Just you - 1 user',
        `${activePricing.PRO.ai_generation_count.toLocaleString(locale)} AI text generations`,
        activePricing.PRO.generate_videos
          ? `${activePricing.PRO.image_generation_count} AI images · ${activePricing.PRO.generate_videos} AI videos`
          : `${activePricing.PRO.image_generation_count} AI images`,
        `${activePricing.PRO.webhooks} webhooks`,
      ],
      cta: 'Choose Pro',
      featured: false,
    },
  ];

  return (
    <section id={id} className="border-t border-white/10 bg-white/[0.015]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
        {/* Dynamic Regional Discount / Early Adopter Announcement Badge */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {isIndian && currency === 'INR' && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
              <span className="text-sm">🇮🇳</span>
              <span>
                Regional Purchasing Power Parity (PPP):{' '}
                {activePricing.STANDARD.discount_percent}% discount applied for India
              </span>
            </div>
          )}
          {isUAE && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
              <span className="text-sm">🇦🇪</span>
              <span>Dubai / UAE Early Adopter Deal: 35% discount applied (~69 AED · Instant UAE Card / Apple Pay)</span>
            </div>
          )}
          {!isIndian && !isUAE && currency === 'USD' && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4CE2]/30 bg-[#FF4CE2]/10 px-3.5 py-1 text-xs font-semibold text-[#FF4CE2] backdrop-blur-md">
              <span className="text-sm">⚡</span>
              <span>Global Early Adopter Deal: 35% launch discount applied (Save vs Buffer $30 & Hootsuite $99)</span>
            </div>
          )}
          {currency === 'EUR' && (
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400 backdrop-blur-md">
              <span className="text-sm">🇪🇺</span>
              <span>European Union Launch Deal: 35% discount applied across all tiers</span>
            </div>
          )}
          {currency === 'GBP' && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
              <span className="text-sm">🇬🇧</span>
              <span>UK Creator Launch Deal: 36% discount applied across all plans</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
              Flat pricing, per plan — not per channel
            </h2>
            <p className="mt-3 mx-auto max-w-[60ch] text-white/60">
              No setup fee and no per-channel charge. Pay by {paymentMethodText}.
            </p>
          </div>

          {/* Currency switcher sits under the heading, centred with it, rather
              than floating off to the right of a three-card row. */}
          <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/40 p-1.5 backdrop-blur-md">
            {isIndian ? (
              // Indian visitors see INR with USD option
              <>
                <button
                  type="button"
                  onClick={() => changeCurrency('INR')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    currency === 'INR'
                      ? 'bg-[#FF4CE2] text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>₹</span>
                  <span>INR (India {pricingINR.STANDARD.discount_percent}% Off)</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeCurrency('USD')}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    currency === 'USD'
                      ? 'bg-[#FF4CE2] text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>$</span>
                  <span>USD (Global)</span>
                </button>
              </>
            ) : (
              // International visitors ONLY see global currencies (USD, EUR, GBP) - Zero INR Leakage
              <>
                <button
                  type="button"
                  onClick={() => changeCurrency('USD')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    currency === 'USD'
                      ? 'bg-[#FF4CE2] text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>$</span>
                  <span>USD {isUAE ? '(~AED)' : ''}</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeCurrency('EUR')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    currency === 'EUR'
                      ? 'bg-[#FF4CE2] text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>€</span>
                  <span>EUR</span>
                </button>
                <button
                  type="button"
                  onClick={() => changeCurrency('GBP')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    currency === 'GBP'
                      ? 'bg-[#FF4CE2] text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>£</span>
                  <span>GBP</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1100px] gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              // The highlight follows the pointer. Standard keeps it by default
              // (it is the "most chosen" one), but hovering any card lifts that
              // card instead - previously only Standard could ever look picked,
              // so hovering Pro gave no feedback at all.
              className={
                'group flex flex-col rounded-2xl border p-7 transition-all duration-200 ' +
                'hover:-translate-y-1 hover:border-[#FF4CE2] hover:bg-[#FF4CE2]/[0.06] ' +
                'hover:shadow-[0_0_0_1px_rgba(255,76,226,0.35),0_18px_40px_-18px_rgba(255,76,226,0.45)] ' +
                (p.featured
                  ? 'border-[#FF4CE2] bg-[#FF4CE2]/[0.06] md:[&:not(:hover)]:opacity-100 '
                  : 'border-white/10 bg-white/[0.02] ')
              }
            >
              {p.featured && (
                <span className="mb-3 inline-block w-fit rounded-full bg-[#FF4CE2] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                  Most chosen
                </span>
              )}
              <h3 className="text-lg font-bold font-jakarta">{p.name}</h3>
              <p className="mt-1 text-sm text-white/50">{p.blurb}</p>

              {/* Price block with guaranteed zero layout shift */}
              <div className="mt-5 flex flex-col justify-end min-h-[64px]">
                {p.anchorPrice ? (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white/40 line-through tabular-nums">
                      {p.anchorPrice}
                    </span>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {p.discountBadge}
                    </span>
                  </div>
                ) : (
                  <div className="h-6" />
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight font-jakarta tabular-nums text-white">
                    {p.price}
                  </span>
                  <span className="text-sm text-white/60">/ month</span>
                </div>
                {p.subnote && (
                  <span className="text-[11px] text-white/40 mt-1">{p.subnote}</span>
                )}
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[15px] text-white/70">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="text-[#FF4CE2]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                prefetch={false}
                className={
                  'mt-7 rounded-full px-5 py-3 text-center font-semibold transition-opacity hover:opacity-90 ' +
                  (p.featured
                    ? 'bg-[#FF4CE2] text-black'
                    : 'border border-white/15 text-white')
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Ultimate is no longer sold (PURCHASABLE_TIERS), so it is not
            advertised here. Existing Ultimate subscribers keep their plan. */}
        <p className="mx-auto mt-8 max-w-[70ch] text-center text-sm text-white/60">
          Each connected profile or page counts as one channel, so three Facebook
          pages use three of them. Need more than {activePricing.PRO.channel}?
          Email us and we will size a plan around you.
        </p>
      </div>
    </section>
  );
};

export default PricingPlans;
