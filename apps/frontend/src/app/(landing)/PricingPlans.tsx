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
 * Features strict geo-isolation:
 * - International visitors (US/EU/UK/Global) only see global currencies ($19/$39/$79/$159).
 * - INR rates (₹699) are strictly isolated to Indian visitors to prevent price leakage.
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

  useEffect(() => {
    // Secondary client-side timezone check (for visitors behind VPN or proxies)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
    const detectedIndian = tz.includes('kolkata') || tz.includes('calcutta');

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
      : 'International credit/debit cards (Visa, Mastercard, Amex)';

  const plans = [
    {
      name: 'Free',
      price: `${sym}${activePricing.FREE.month_price.toLocaleString(locale)}`,
      blurb: 'Enough to see whether it fits.',
      features: [
        `${activePricing.FREE.channel} channels`,
        `${activePricing.FREE.posts_per_month} posts / month`,
        'Visual calendar',
        'Public API',
      ],
      cta: 'Start free',
      featured: false,
    },
    {
      name: 'Standard',
      price: `${sym}${activePricing.STANDARD.month_price.toLocaleString(locale)}`,
      blurb: 'For a solo creator or a small brand.',
      features: [
        `${activePricing.STANDARD.channel} channels`,
        `${activePricing.STANDARD.posts_per_month.toLocaleString(locale)} posts / month`,
        `${activePricing.STANDARD.ai_generation_count.toLocaleString(locale)} AI text generations`,
        `${activePricing.STANDARD.image_generation_count} AI images · ${activePricing.STANDARD.generate_videos} AI videos`,
        `${activePricing.STANDARD.webhooks} webhooks`,
      ],
      cta: 'Start 7-day trial',
      featured: true,
    },
    {
      name: 'Team',
      price: `${sym}${activePricing.TEAM.month_price.toLocaleString(locale)}`,
      blurb: 'When more than one person posts.',
      features: [
        `${activePricing.TEAM.channel} channels`,
        `${activePricing.TEAM.posts_per_month.toLocaleString(locale)} posts / month`,
        `${activePricing.TEAM.ai_generation_count.toLocaleString(locale)} AI text generations`,
        `${activePricing.TEAM.image_generation_count} AI images · ${activePricing.TEAM.generate_videos} AI videos`,
        'Unlimited team members',
      ],
      cta: 'Choose Team',
      featured: false,
    },
    {
      name: 'Pro',
      price: `${sym}${activePricing.PRO.month_price.toLocaleString(locale)}`,
      blurb: 'For agencies running many brands.',
      features: [
        `${activePricing.PRO.channel} channels`,
        `${activePricing.PRO.posts_per_month.toLocaleString(locale)} posts / month`,
        `${activePricing.PRO.ai_generation_count.toLocaleString(locale)} AI text generations`,
        `${activePricing.PRO.image_generation_count} AI images · ${activePricing.PRO.generate_videos} AI videos`,
        `${activePricing.PRO.webhooks} webhooks`,
      ],
      cta: 'Choose Pro',
      featured: false,
    },
  ];

  return (
    <section id={id} className="border-t border-white/10 bg-white/[0.015]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
              Flat pricing, per plan — not per channel
            </h2>
            <p className="mt-3 max-w-[60ch] text-white/60">
              No setup fee and no per-channel charge. Pay by {paymentMethodText}.
            </p>
          </div>

          {/* Dynamic Currency Switcher with Strict Geo-Isolation */}
          <div className="inline-flex items-center self-start md:self-auto rounded-xl border border-white/15 bg-black/40 p-1.5 backdrop-blur-md">
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
                  <span>INR</span>
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
                  <span>USD</span>
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
                  <span>USD</span>
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                'flex flex-col rounded-2xl border p-7 ' +
                (p.featured
                  ? 'border-[#FF4CE2] bg-[#FF4CE2]/[0.06]'
                  : 'border-white/10 bg-white/[0.02]')
              }
            >
              {p.featured && (
                <span className="mb-3 inline-block w-fit rounded-full bg-[#FF4CE2] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                  Most chosen
                </span>
              )}
              <h3 className="text-lg font-bold font-jakarta">{p.name}</h3>
              <p className="mt-1 text-sm text-white/50">{p.blurb}</p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight font-jakarta tabular-nums">
                  {p.price}
                </span>
                <span className="text-sm text-white/60">/ month</span>
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

        <p className="mt-8 text-sm text-white/60">
          Ultimate is {sym}{activePricing.ULTIMATE.month_price.toLocaleString(locale)} for 100 channels and 15,000 posts a month.
          Each connected profile or page counts as one channel.
        </p>
      </div>
    </section>
  );
};

export default PricingPlans;
