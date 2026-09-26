import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { COMPETITOR_FACTS, CompetitorFacts, FACTS_CHECKED, PAIRS } from '../competitor-facts';

// "<A> vs <B>" pages for two third-party tools, e.g. /compare/buffer-vs-hootsuite.
// People search these far more than "<A> alternative", and AI answers cite a
// neutral side-by-side. Every figure comes from competitor-facts.ts, which was
// read off each vendor's own pricing page on FACTS_CHECKED, with the source URL
// shown on the page. Hookpost appears as a third column, never as the winner of
// a row it does not actually win.

const BASE = 'https://hookpost.hookstep.in/compare';
const { FREE, STANDARD } = pricingINR;

const split = (pair: string): [CompetitorFacts, CompetitorFacts] | null => {
  if (!PAIRS.includes(pair)) return null;
  const [a, b] = pair.split('-vs-');
  const A = COMPETITOR_FACTS[a];
  const B = COMPETITOR_FACTS[b];
  return A && B ? [A, B] : null;
};

const priceText = (c: CompetitorFacts) => {
  const p = c.cheapestPaid;
  if (!p) return 'Not published';
  const sym = p.currency === 'USD' ? '$' : p.currency === 'EUR' ? '€' : p.currency === 'INR' ? '₹' : `${p.currency} `;
  if (p.billing === 'one-time') return `${sym}${p.price} one-time, ${p.per}`;
  return `${sym}${p.price} per ${p.per.replace('/month', ' per month')}${p.billing === 'annual' ? ', billed annually' : ''}`;
};

const freeText = (c: CompetitorFacts) =>
  c.freePlan ? c.freePlan : c.freeTrialDays ? `No free plan (${c.freeTrialDays}-day trial)` : 'No free plan';

const yesNo = (v: boolean | null | undefined, yes = 'Yes', no = 'No') =>
  v == null ? 'Not stated' : v ? yes : no;

export function generateStaticParams() {
  return PAIRS.map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const both = split(pair);
  if (!both) return {};
  const [A, B] = both;
  const title = `${A.name} vs ${B.name}: Pricing, Free Plan & Features (2026)`;
  const description = `${A.name} vs ${B.name} compared side by side: cheapest plan, free plan, pricing model, API and AI-agent support, read from each vendor's pricing page.`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/${pair}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/${pair}`,
      siteName: 'Hookpost',
      type: 'article',
      images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['https://hookpost.hookstep.in/og-image.png'] },
  };
}

export default async function ComparePairPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const both = split(pair);
  if (!both) notFound();
  const [A, B] = both;

  // Row-by-row facts. The verdict is built from these, so it can only say what
  // the table says.
  const rows: [string, string, string, string][] = [
    ['Cheapest paid plan', priceText(A), priceText(B), `₹${STANDARD.month_price} per month flat`],
    ['Pricing model', A.pricingModel || 'Not stated', B.pricingModel || 'Not stated', 'Flat tiers, no per-channel fee'],
    ['Free plan', freeText(A), freeText(B), `${FREE.channel} channels, ${FREE.posts_per_month} posts a month`],
    ['Public API', yesNo(A.api), yesNo(B.api), 'Yes (Standard and above)'],
    ['MCP server / AI agents', yesNo(A.mcp), yesNo(B.mcp), 'Yes (Standard and above)'],
    ['Open source', A.openSource || 'No', B.openSource || 'No', 'Yes, AGPL-3.0'],
    // "Shows INR" means the vendor localised its pricing page to rupees for an
    // Indian visitor on the check date. None of them offers UPI.
    ['Prices in rupees (India)', yesNo(A.inr, 'Yes, localised', 'No, USD'), yesNo(B.inr, 'Yes, localised', 'No, USD'), 'Yes, with UPI Autopay'],
  ];

  const cheaper = (() => {
    const a = A.cheapestPaid?.usdMonthly;
    const b = B.cheapestPaid?.usdMonthly;
    if (a == null || b == null || a === b) return null;
    return a < b ? A : B;
  })();

  const verdict: string[] = [];
  if (cheaper) {
    const other = cheaper === A ? B : A;
    verdict.push(
      `${cheaper.name} is cheaper to start: ${priceText(cheaper)} against ${priceText(other)}.`
    );
  }
  // Per-channel against flat pricing: the entry price flatters the per-channel
  // tool, so also price it at the flat plan's channel count.
  for (const [perCh, flat] of [[A, B], [B, A]] as const) {
    const pc = perCh.cheapestPaid;
    const fl = flat.cheapestPaid;
    if (
      perCh.pricingModel === 'per channel' &&
      pc?.usdMonthly != null &&
      fl?.usdMonthly != null &&
      fl.channelsIncluded &&
      fl.channelsIncluded > 1
    ) {
      const total = Math.round(pc.usdMonthly * fl.channelsIncluded * 100) / 100;
      verdict.push(
        `At ${fl.channelsIncluded} channels the gap changes: ${perCh.name} comes to $${total} a month against ${flat.name}'s $${fl.usdMonthly}.`
      );
    }
  }
  if (A.freePlan && !B.freePlan) verdict.push(`${A.name} has a free plan; ${B.name} does not.`);
  if (B.freePlan && !A.freePlan) verdict.push(`${B.name} has a free plan; ${A.name} does not.`);
  if (A.pricingModel && B.pricingModel && A.pricingModel !== B.pricingModel) {
    verdict.push(`${A.name} charges ${A.pricingModel}, while ${B.name} charges ${B.pricingModel}, which matters most as you add channels or teammates.`);
  }
  if (A.openSource && !B.openSource) verdict.push(`${A.name} is open source (${A.openSource}) and can be self-hosted.`);
  if (B.openSource && !A.openSource) verdict.push(`${B.name} is open source (${B.openSource}) and can be self-hosted.`);

  const faq = [
    {
      q: `Is ${A.name} cheaper than ${B.name}?`,
      a: cheaper
        ? `On the cheapest paid plan, yes${cheaper === A ? '' : ', the other way round'}: ${A.name} starts at ${priceText(A)} and ${B.name} at ${priceText(B)}. Check how each one counts channels and users before comparing totals.`
        : `${A.name} starts at ${priceText(A)} and ${B.name} at ${priceText(B)}. Check how each one counts channels and users before comparing totals.`,
    },
    {
      q: `Does ${A.name} or ${B.name} have a free plan?`,
      a: `${A.name}: ${freeText(A)}. ${B.name}: ${freeText(B)}.`,
    },
    {
      q: `Is there a cheaper alternative to ${A.name} and ${B.name}?`,
      a: `Hookpost has a free plan (${FREE.channel} channels, ${FREE.posts_per_month} posts a month) and a flat ₹${STANDARD.month_price} a month plan for ${STANDARD.channel} channels, billed in rupees with UPI Autopay. It publishes to X, LinkedIn, YouTube, Bluesky, Discord, Telegram and more; Instagram and Facebook are waiting on Meta approval.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Compare', item: BASE },
          { '@type': 'ListItem', position: 3, name: `${A.name} vs ${B.name}`, item: `${BASE}/${pair}` },
        ],
      },
    ],
  };

  const others = PAIRS.filter((p) => p !== pair && (p.includes(A.slug) || p.includes(B.slug))).slice(0, 6);

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Comparison · checked {FACTS_CHECKED}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          {A.name} vs {B.name}
        </h1>
        <div className="mt-5 max-w-[70ch] space-y-3 text-lg text-white/75">
          {verdict.length ? verdict.map((v) => <p key={v}>{v}</p>) : (
            <p>{A.name} and {B.name} side by side, from each vendor&apos;s own pricing page.</p>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-10">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">{A.name} vs {B.name} compared</caption>
            <thead>
              <tr className="border-b border-white/15 text-white/60">
                <th scope="col" className="py-3 pe-4 font-semibold"> </th>
                <th scope="col" className="py-3 pe-4 font-semibold text-white">{A.name}</th>
                <th scope="col" className="py-3 pe-4 font-semibold text-white">{B.name}</th>
                <th scope="col" className="py-3 font-semibold text-[#FF4CE2]">Hookpost</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {rows.map(([label, a, b, h]) => (
                <tr key={label} className="border-b border-white/10 align-top">
                  <th scope="row" className="py-4 pe-4 font-semibold text-white">{label}</th>
                  <td className="py-4 pe-4">{a}</td>
                  <td className="py-4 pe-4">{b}</td>
                  <td className="py-4">{h}</td>
                </tr>
              ))}
              <tr className="border-b border-white/10 align-top">
                <th scope="row" className="py-4 pe-4 font-semibold text-white">Networks</th>
                <td className="py-4 pe-4">{A.networks.join(', ') || 'Not stated'}</td>
                <td className="py-4 pe-4">{B.networks.join(', ') || 'Not stated'}</td>
                <td className="py-4">X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram, WordPress, Dev.to and more (Instagram, Facebook, Threads awaiting Meta approval)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-white/55">
          Sources, read {FACTS_CHECKED}:{' '}
          {[...A.sources, ...B.sources].map((u, i) => (
            <span key={u}>
              {i ? ', ' : ''}
              <a href={u} rel="nofollow noopener" target="_blank" className="underline">
                {u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </span>
          ))}
          . Prices change; confirm on the vendor&apos;s page before you buy.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight font-jakarta">Where Hookpost fits</h2>
          <p className="mt-3 max-w-[70ch] text-white/70">
            If you are in India, post mainly to X, LinkedIn, YouTube or community channels, and would rather pay one flat
            rupee price than a fee per channel, Hookpost is worth a look. It is open source, has a free plan, and ships an
            MCP server so an AI assistant can schedule for you. If you need Instagram or Facebook today, choose {A.name} or{' '}
            {B.name} for now: Hookpost&apos;s Meta integration is waiting on approval.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/free-social-media-scheduler" className="rounded-full bg-[#FF4CE2] px-5 py-2.5 font-semibold text-black hover:opacity-90">
              See the free plan
            </Link>
            {COMPETITOR_FACTS[A.slug]?.hasAlternativePage && (
              <Link href={`/alternatives/${A.slug}`} className="rounded-full border border-white/20 px-5 py-2.5 font-semibold hover:border-[#FF4CE2]">
                Hookpost vs {A.name}
              </Link>
            )}
            {COMPETITOR_FACTS[B.slug]?.hasAlternativePage && (
              <Link href={`/alternatives/${B.slug}`} className="rounded-full border border-white/20 px-5 py-2.5 font-semibold hover:border-[#FF4CE2]">
                Hookpost vs {B.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight font-jakarta">Questions</h2>
          <dl className="mt-6 flex flex-col gap-6">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>
          {others.length > 0 && (
            <p className="mt-10 text-white/60">
              More comparisons:{' '}
              {others.map((p, i) => {
                const [x, y] = p.split('-vs-');
                return (
                  <span key={p}>
                    {i ? ' · ' : ''}
                    <Link href={`/compare/${p}`} className="text-[#FF4CE2] underline">
                      {COMPETITOR_FACTS[x].name} vs {COMPETITOR_FACTS[y].name}
                    </Link>
                  </span>
                );
              })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
