import { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  getPricing,
  CURRENCY_CONFIG,
  SupportedCurrency,
  isIndianRegion,
} from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import Link from 'next/link';
import { SiteNav } from '../site-nav';
import { PricingPlans } from '../PricingPlans';
import { PUBLISHABLE_CHANNEL_COUNT } from '../channels/channel-count';

/**
 * /pricing page with strict geo-isolation:
 * - US & International visitors are presented exclusively with USD ($19 / $39 / $79 / $159).
 * - Indian visitors are presented with INR (₹699 / ₹1,499 / ₹2,299 / ₹4,499).
 * - No INR price comparison table is ever leaked to international visitors.
 */

const CANONICAL = 'https://hookpost.hookstep.in/pricing';

export const metadata: Metadata = {
  title: 'Hookpost Pricing: Flat plans, no per-channel fee',
  description:
    'Flat per-plan pricing for Hookpost across 17+ networks. Free starter tier and transparent flat plans with zero per-channel fees, visual calendar, and native MCP support.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Hookpost Pricing — flat plans, no per-channel fee',
    description:
      'Free tier plus four paid plans with every limit listed, including posts per month and AI generation caps.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [
      {
        url: 'https://hookpost.hookstep.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hookpost Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookpost Pricing — flat plans, no per-channel fee',
    description:
      'Free tier plus four paid plans. No per-channel fee and no setup fee.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

const n = (v: number) => v.toLocaleString();

const FAQ = [
  {
    q: 'Does Hookpost charge per social channel?',
    a: 'No. Every plan is a flat monthly price and the channel count is a limit inside the plan, not a per-channel fee. Each connected profile or page counts as one channel.',
  },
  {
    q: 'What currencies can I pay in?',
    a: 'Hookpost supports US Dollars (USD $), European Euros (EUR €), British Pounds (GBP £), and Indian Rupees (INR ₹). Pay using international cards (Visa, Mastercard, American Express), SEPA, UPI, or NetBanking.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. The Free plan is $0 forever and includes 2 channels, 30 posts a month, the visual calendar and public API access. It does not include AI generation.',
  },
  {
    q: 'What happens when I hit the monthly post limit?',
    a: 'Publishing is blocked for the rest of the billing month once the plan limit is reached. The limits are enforced in code, not just advertised, so the number on this page is the number you get.',
  },
  {
    q: 'Can I self-host Hookpost instead of paying?',
    a: 'Yes. Hookpost is open source under the AGPL and there is a production Docker Compose setup documented in the self-hosting guide. Self-hosting has no plan limits because you run the infrastructure.',
  },
  {
    q: 'Is there a trial on paid plans?',
    a: 'Standard includes a 7-day trial. No charge is taken until the trial ends.',
  },
];

export default function PricingPage() {
  const headerList = headers();
  const country = (headerList.get('x-hookpost-country') || '').toUpperCase();
  const rawCurrency = headerList.get('x-hookpost-currency') as SupportedCurrency | null;
  const isIndian = headerList.get('x-hookpost-is-indian') === '1' || country === 'IN';
  const currency: SupportedCurrency = rawCurrency || (isIndian ? 'INR' : 'USD');

  const activePricing = getPricing(currency);
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const sym = config.symbol;
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';

  const TIERS = (['FREE', 'STANDARD', 'TEAM', 'PRO', 'ULTIMATE'] as const).map(
    (tier) => {
      const plan = activePricing[tier];
      return {
        name: `${tier.charAt(0)}${tier.slice(1).toLowerCase()}`,
        priceFormatted: `${sym}${plan.month_price.toLocaleString(locale)}`,
        channels: n(plan.channel ?? 0),
        posts: n(plan.posts_per_month),
        aiText: n(plan.ai_generation_count),
        aiImages: n(plan.image_generation_count),
        aiVideos: n(plan.generate_videos),
        webhooks: n(plan.webhooks),
        team: plan.team_members ? 'Unlimited' : 'No',
      };
    }
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${CANONICAL}#product`,
        name: 'Hookpost',
        description:
          `Open-source AI social media scheduling and publishing for ${PUBLISHABLE_CHANNEL_COUNT} networks, with a native MCP server and Docker self-hosting.`,
        brand: { '@type': 'Brand', name: 'Hookpost' },
        offers: {
          '@type': 'AggregateOffer',
          url: CANONICAL,
          priceCurrency: currency,
          lowPrice: '0',
          highPrice: String(activePricing.ULTIMATE.month_price),
          offerCount: String(TIERS.length),
          offers: TIERS.map((t) => ({
            '@type': 'Offer',
            name: `${t.name} plan`,
            price: t.priceFormatted.replace(/[^0-9]/g, ''),
            priceCurrency: currency,
            url: CANONICAL,
            availability: 'https://schema.org/InStock',
            description: `${t.channels} channels, ${t.posts} posts per month, ${t.aiText} AI text generations.`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${CANONICAL}#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Pricing', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1280px] px-5 pt-16 sm:px-10">
        <h1 className="text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Hookpost pricing
        </h1>
        {isIndian ? (
          <p className="mt-4 max-w-[70ch] text-lg text-white/70">
            Hookpost costs ₹0 a month on the Free plan and ₹699, ₹1,499,
            ₹2,299 or ₹4,499 a month on the four paid plans.
            There is no per-channel fee and no setup fee, and the open-source
            version can be self-hosted at no licence cost.
          </p>
        ) : (
          <p className="mt-4 max-w-[70ch] text-lg text-white/70">
            Hookpost costs $0 a month on the Free plan and $19, $39,
            $79 or $159 a month on the four paid plans.
            There is no per-channel fee and no setup fee, and the open-source
            version can be self-hosted at no licence cost.
          </p>
        )}
      </section>

      <PricingPlans
        initialCurrency={currency}
        initialCountry={country}
        isIndianRegion={isIndian}
      />

      {/* --------------------------------------------------- full tier table */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Every limit, including Ultimate
          </h2>
          <p className="mt-3 max-w-[62ch] text-white/60">
            These are enforced limits, not guidance. Publishing stops when the
            monthly post count is reached.
          </p>

          <div className="mt-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Hookpost plan limits by tier
              </caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pr-4 font-semibold">Plan</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Price / mo</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Channels</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Posts / month</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">AI text</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">AI images</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">AI videos</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Webhooks</th>
                  <th scope="col" className="py-3 font-semibold">Team members</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {TIERS.map((t) => (
                  <tr key={t.name} className="border-b border-white/[0.08]">
                    <th scope="row" className="py-3 pr-4 font-semibold text-white">{t.name}</th>
                    <td className="py-3 pr-4 font-semibold text-[#FF4CE2]">{t.priceFormatted}</td>
                    <td className="py-3 pr-4 text-white/70">{t.channels}</td>
                    <td className="py-3 pr-4 text-white/70">{t.posts}</td>
                    <td className="py-3 pr-4 text-white/70">{t.aiText}</td>
                    <td className="py-3 pr-4 text-white/70">{t.aiImages}</td>
                    <td className="py-3 pr-4 text-white/70">{t.aiVideos}</td>
                    <td className="py-3 pr-4 text-white/70">{t.webhooks}</td>
                    <td className="py-3 text-white/70">{t.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-20 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Pricing questions
          </h2>
          <dl className="mt-10 flex flex-col gap-8">
            {FAQ.map((f) => (
              <div key={f.q} className="min-w-0">
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 text-white/60">
            Prefer to run it yourself?{' '}
            <Link href="/guides/docker-self-hosting" className="text-[#FF4CE2] underline">
              Self-hosting guide
            </Link>
            {' · '}
            <Link href="/contact" className="text-[#FF4CE2] underline">
              Ask a billing question
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
