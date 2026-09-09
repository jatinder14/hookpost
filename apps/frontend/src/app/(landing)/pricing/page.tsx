import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../site-nav';
import { PricingPlans } from '../PricingPlans';
import { PUBLISHABLE_CHANNEL_COUNT } from '../channels/channel-count';

/**
 * /pricing did not exist. Pricing was a #pricing section on the homepage, so:
 *
 *  - the nav's "Pricing" link was the bare fragment "#pricing", which is dead
 *    on all ~70 marketing pages that are not the homepage;
 *  - llms.txt pointed AI engines at "https://hookpost.hookstep.in/#pricing",
 *    and a homepage fragment is a poor citation target - engines cite URLs, so
 *    there was no page to win "hookpost pricing" or any
 *    "<competitor> vs hookpost pricing" query with;
 *  - paid search had nowhere to land people who want a price before signing
 *    up, which is most of them.
 *
 * The tables are the shared PricingPlans component, so this page and the
 * homepage cannot drift apart. Numbers trace to pricing.ts.
 */

const CANONICAL = 'https://hookpost.hookstep.in/pricing';

export const metadata: Metadata = {
  title: 'Hookpost Pricing: Free, ₹699, ₹1,499, ₹2,299 & ₹4,499 / month',
  description:
    'Flat per-plan pricing for Hookpost, billed in INR or USD. Free tier with 2 channels, paid plans from ₹699 / $9 a month. No per-channel fee, no setup fee. Pay by UPI, NetBanking or card.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Hookpost Pricing — flat plans, no per-channel fee',
    description:
      'Free tier plus four paid plans from ₹699 / $9 a month. Every limit listed, including posts per month and AI generation caps.',
    url: CANONICAL,
    type: 'website',
  },
};

// Full tier table including Ultimate, which the homepage only mentions in a
// footnote. Values mirror pricing.ts.
const TIERS = [
  { name: 'Free', inr: '₹0', usd: '$0', channels: '2', posts: '30', aiText: '0', aiImages: '0', aiVideos: '0', webhooks: '0', team: 'No' },
  { name: 'Standard', inr: '₹699', usd: '$9', channels: '5', posts: '500', aiText: '500', aiImages: '20', aiVideos: '3', webhooks: '2', team: 'No' },
  { name: 'Team', inr: '₹1,499', usd: '$19', channels: '10', posts: '1,500', aiText: '1,500', aiImages: '100', aiVideos: '10', webhooks: '10', team: 'Unlimited' },
  { name: 'Pro', inr: '₹2,299', usd: '$29', channels: '30', posts: '5,000', aiText: '2,500', aiImages: '300', aiVideos: '30', webhooks: '30', team: 'Unlimited' },
  { name: 'Ultimate', inr: '₹4,499', usd: '$59', channels: '100', posts: '15,000', aiText: '10,000', aiImages: '1,000', aiVideos: '100', webhooks: '100', team: 'Unlimited' },
];

const FAQ = [
  {
    q: 'Does Hookpost charge per social channel?',
    a: 'No. Every plan is a flat monthly price and the channel count is a limit inside the plan, not a per-channel fee. Each connected profile or page counts as one channel.',
  },
  {
    q: 'What currencies can I pay in?',
    a: 'Billing runs through Razorpay. Indian customers pay in INR by UPI, NetBanking, card or wallet. USD prices are shown for reference; recurring card billing outside India is not yet enabled.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. The Free plan is ₹0 forever and includes 2 channels, 30 posts a month, the visual calendar and public API access. It does not include AI generation.',
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
  // Offer-level schema, not aggregateRating: there are no genuine collected
  // reviews yet, and inventing them to win a star snippet would be fabricating
  // a record.
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
          priceCurrency: 'INR',
          lowPrice: '0',
          highPrice: '4499',
          offerCount: String(TIERS.length),
          offers: TIERS.map((t) => ({
            '@type': 'Offer',
            name: `${t.name} plan`,
            price: t.inr.replace(/[₹,]/g, ''),
            priceCurrency: 'INR',
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
        {/*
          A direct-answer opening paragraph. AI engines quote the passage that
          answers the question outright, so the prices and the no-per-channel
          fact go in the first sentence rather than after a value proposition.
        */}
        <p className="mt-4 max-w-[70ch] text-lg text-white/70">
          Hookpost costs ₹0 a month on the Free plan and ₹699 / $9, ₹1,499 /
          $19, ₹2,299 / $29 or ₹4,499 / $59 a month on the four paid plans.
          There is no per-channel fee and no setup fee, and the open-source
          version can be self-hosted at no licence cost.
        </p>
      </section>

      <PricingPlans />

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

          {/* Wide table scrolls inside its own container so the page body never
              scrolls horizontally on a phone. */}
          <div className="mt-10 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Hookpost plan limits by tier, monthly prices in INR and USD
              </caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pr-4 font-semibold">Plan</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">INR / month</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">USD / month</th>
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
                    <td className="py-3 pr-4 text-white/70">{t.inr}</td>
                    <td className="py-3 pr-4 text-white/70">{t.usd}</td>
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
