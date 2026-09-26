import Link from 'next/link';
import { Metadata } from 'next';
import { SiteNav } from '../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { COMPETITOR_FACTS, CompetitorFacts, FACTS_CHECKED, PAIRS } from './competitor-facts';

// The comparison hub. Every competitor figure is read from competitor-facts.ts
// (vendor pricing pages, checked on FACTS_CHECKED); Hookpost's from pricing.ts.
// This page used to hand-type its matrix and had drifted into claims like a
// "$0 tier with AI" (Free has no AI) and Buffer "AI extra cost" (Buffer's free
// plan includes its AI assistant). Nothing here is typed by hand any more.

const CANONICAL = 'https://hookpost.hookstep.in/compare';
const { FREE, STANDARD } = pricingINR;

const price = (c: CompetitorFacts) => {
  const p = c.cheapestPaid;
  if (!p) return 'Not published';
  const sym = p.currency === 'USD' ? '$' : p.currency === 'EUR' ? '€' : `${p.currency} `;
  if (p.billing === 'one-time') return `${sym}${p.price} one-time`;
  return `${sym}${p.price} / ${p.per.replace('/month', '').replace('month', 'mo')}${p.billing === 'annual' ? ' (annual)' : ''}`;
};

const free = (c: CompetitorFacts) =>
  c.freePlan ? 'Yes' : c.freeTrialDays ? `${c.freeTrialDays}-day trial` : 'No';

const ORDER = ['buffer', 'hootsuite', 'later', 'sprout-social', 'metricool', 'publer', 'socialpilot', 'agorapulse', 'postiz', 'mixpost', 'zoho-social', 'sendible'];

const FAQ = [
  {
    q: 'Which social media scheduler has the best free plan?',
    a: `It depends on your networks. Buffer's free plan gives 3 channels with 10 queued posts per channel and includes its AI assistant. Metricool's free plan allows 20 posts a month but leaves out X and LinkedIn. Hookpost's free plan gives ${FREE.channel} channels and ${FREE.posts_per_month} posts a month including X and LinkedIn, without AI. Hootsuite, Later, Sprout Social and SocialPilot have trials, not free plans.`,
  },
  {
    q: 'Which schedulers are open source?',
    a: 'Hookpost and Postiz are AGPL-3.0 and can be self-hosted. Mixpost Lite is MIT-licensed; Mixpost Pro is a paid self-hosted licence. Buffer, Hootsuite, Later, Sprout Social and the others are closed source.',
  },
  {
    q: 'Which schedulers have an MCP server for AI agents?',
    a: 'Most of them now do. Of the twelve tools checked, ten list an MCP server or AI-agent integration, including Buffer (on its free plan), Hootsuite, Postiz and Metricool. Hookpost has one too, on Standard and above.',
  },
  {
    q: 'Can I pay for a social media scheduler in rupees with UPI?',
    a: `Hootsuite, Zoho Social, Publer and SocialPilot show rupee prices to Indian visitors, but none of the twelve lists UPI. Hookpost bills in rupees with UPI Autopay: Standard is ₹${STANDARD.month_price} a month for ${STANDARD.channel} channels.`,
  },
];

export const metadata: Metadata = {
  title: 'Compare Social Media Schedulers: 12 Tools, Real Prices',
  description:
    'Buffer, Hootsuite, Later, Sprout, Metricool, Publer, Postiz, Mixpost and more compared on price, free plan, API, MCP and open source, from vendor pages.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Compare social media schedulers - 12 tools, real prices',
    description: 'Cheapest plan, free plan, API, MCP and open source for 12 schedulers, read from each vendor page.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Social media scheduler comparison' }],
  },
};

export default function ComparePage() {
  const tools = ORDER.map((k) => COMPETITOR_FACTS[k]).filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Compare', item: CANONICAL },
        ],
      },
    ],
  };

  const cell = 'py-3 pe-4 align-top';
  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1200px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Checked {FACTS_CHECKED}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Social media schedulers compared
        </h1>
        <p className="mt-4 max-w-[70ch] text-lg text-white/70">
          Twelve schedulers and Hookpost on the things that decide the bill: the cheapest paid plan, how it is priced, whether
          there is a free plan, and whether you get an API, an MCP server for AI agents, or the source code. Every figure was
          read off the vendor&apos;s own pricing page, linked on each comparison.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-10">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <caption className="sr-only">Social media schedulers compared</caption>
            <thead>
              <tr className="border-b border-white/15 text-white/60">
                {['Tool', 'Cheapest paid plan', 'Pricing model', 'Free plan', 'API', 'MCP / AI agents', 'Open source', 'Rupee prices'].map((h) => (
                  <th key={h} scope="col" className="py-3 pe-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/80">
              <tr className="border-b border-white/10 bg-[#FF4CE2]/[0.06]">
                <th scope="row" className={`${cell} font-bold text-white`}>Hookpost</th>
                <td className={cell}>₹{STANDARD.month_price} / mo</td>
                <td className={cell}>flat tiers</td>
                <td className={cell}>Yes</td>
                <td className={cell}>Yes</td>
                <td className={cell}>Yes</td>
                <td className={cell}>AGPL-3.0</td>
                <td className={cell}>Yes, UPI Autopay</td>
              </tr>
              {tools.map((c) => (
                <tr key={c.slug} className="border-b border-white/10">
                  <th scope="row" className={`${cell} font-bold text-white`}>
                    {c.hasAlternativePage ? (
                      <Link href={`/alternatives/${c.slug}`} className="hover:text-[#FF4CE2]">{c.name}</Link>
                    ) : (
                      c.name
                    )}
                  </th>
                  <td className={cell}>{price(c)}</td>
                  <td className={cell}>{c.pricingModel || '—'}</td>
                  <td className={cell}>{free(c)}</td>
                  <td className={cell}>{c.api == null ? 'Not stated' : c.api ? 'Yes' : 'No'}</td>
                  <td className={cell}>{c.mcp == null ? 'Not stated' : c.mcp ? 'Yes' : 'No'}</td>
                  <td className={cell}>{c.openSource ? c.openSource.split(' ')[0] : 'No'}</td>
                  <td className={cell}>{c.inr == null ? 'Not stated' : c.inr ? 'Yes (localised)' : 'No, USD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-white/55">
          USD prices are the cheapest plan as listed; annual means billed yearly. Several vendors change prices and currency by
          country. Confirm on the vendor&apos;s page before you buy.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight font-jakarta">Head-to-head comparisons</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAIRS.map((p) => {
              const [a, b] = p.split('-vs-');
              return (
                <li key={p}>
                  <Link
                    href={`/compare/${p}`}
                    className="block rounded-xl border border-white/10 px-4 py-3 font-semibold transition-colors hover:border-[#FF4CE2]/50 hover:text-[#FF4CE2]"
                  >
                    {COMPETITOR_FACTS[a].name} vs {COMPETITOR_FACTS[b].name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 text-white/60">
            Looking for a replacement rather than a matchup? See{' '}
            <Link href="/alternatives" className="text-[#FF4CE2] underline">alternatives</Link>,{' '}
            <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">free plans compared</Link> and{' '}
            <Link href="/open-source-social-media-scheduler" className="text-[#FF4CE2] underline">open-source schedulers</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight font-jakarta">Questions</h2>
          <dl className="mt-6 flex flex-col gap-6">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
