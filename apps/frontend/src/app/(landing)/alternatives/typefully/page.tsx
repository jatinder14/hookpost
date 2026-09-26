import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';
import { pricingINR, pricingUSD } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "typefully alternative", "typefully pricing" and "cheaper typefully
// alternative". Hookpost numbers are read from pricing.ts. Typefully numbers
// were read off typefully.com/pricing on TYPEFULLY_CHECKED (the page renders
// prices client-side, so they were read in a browser, loaded from India):
//   Free $0: 1 social set, 1 user, 10 posts/month, API + MCP, no AI
//   Creator $99/year, annual billing only: 1,000 posts/month, AI, X analytics
//   Business $18/mo per social set billed yearly, $20 monthly: up to 50 social
//     sets, unlimited users, 1,500 posts/month
//   Networks (comparison table, every plan): X, Bluesky, LinkedIn, Threads,
//     Mastodon; plus Substack Notes (typefully.com/changelog/substack-notes)
// Re-check all of it before bumping the date. Typefully is not in
// competitor-facts, which is why IndiaCostNote is not used here.
const CANONICAL = 'https://hookpost.hookstep.in/alternatives/typefully';
const TYPEFULLY_CHECKED = '26 September 2026';
const TF_PRICING = 'https://typefully.com/pricing';
const TF_SOCIAL_SETS = 'https://support.typefully.com/en/articles/8717684-social-sets-and-accounts';
const TF_SUBSTACK = 'https://typefully.com/changelog/substack-notes';

const FREE = pricingINR.FREE;
const STD_INR = pricingINR.STANDARD;
const STD_USD = pricingUSD.STANDARD;
const PRO_INR = pricingINR.PRO;
const PRO_USD = pricingUSD.PRO;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const HOOKPOST_ONLY = [
  ['YouTube', '/channels/youtube'],
  ['Discord', '/channels/discord'],
  ['Slack', '/channels/slack'],
  ['Telegram', '/channels/telegram'],
  ['WordPress', '/channels/wordpress'],
  ['Hashnode', '/channels/hashnode'],
  ['Dev.to', '/channels/devto'],
  ['Lemmy', '/channels/lemmy'],
  ['Nostr', '/channels/nostr'],
  ['Listmonk', '/channels/listmonk'],
] as const;

const ROWS: [string, string, string][] = [
  ['Free plan', '1 social set, 1 user, 10 posts a month', `${FREE.channel} channels, ${FREE.posts_per_month} posts a month`],
  ['API and MCP on the free plan', 'Yes', 'No, from Standard'],
  ['AI writing', 'Creator and Business', 'Standard and Pro'],
  ['Cheapest paid plan', 'Creator, $99 a year, annual billing only, 1,000 posts a month', `Standard, ${inr(STD_INR.month_price)} or $${STD_USD.month_price} a month, ${STD_INR.channel} channels, ${STD_INR.posts_per_month} posts`],
  ['Next plan up', 'Business, $18 per social set a month billed yearly, $20 monthly', `Pro, ${inr(PRO_INR.month_price)} or $${PRO_USD.month_price} a month, ${PRO_INR.channel} channels, ${PRO_INR.posts_per_month.toLocaleString('en-US')} posts`],
  ['Networks', 'X, LinkedIn, Threads, Bluesky, Mastodon, Substack Notes', 'X, LinkedIn profiles, YouTube, Bluesky, Discord, Slack, Telegram, WordPress, Hashnode, Dev.to, Lemmy, Nostr, Listmonk'],
  ['Currency from India', 'US dollars', 'Rupees'],
];

const FAQ = [
  {
    q: 'How much does Typefully cost?',
    a: `On ${TYPEFULLY_CHECKED} Typefully's pricing page listed Free at $0, Creator at $99 a year (annual billing only) and Business at $18 per social set a month billed yearly, or $20 billed monthly. Enterprise is priced on request.`,
  },
  {
    q: 'Does Typefully have a free plan?',
    a: 'Yes. It allows 1 social set, 1 user and 10 posts a month, and includes its API and MCP server. AI writing and X analytics start on Creator.',
  },
  {
    q: 'Is Hookpost a cheaper Typefully alternative?',
    a: `It depends on what you post to. For one writer on X and LinkedIn, Typefully Creator at $99 a year costs less than Hookpost Standard at $${STD_USD.month_price} a month. Hookpost is the better value if you also publish to YouTube, Discord, Telegram, Slack or a developer blog, or want to pay ${inr(STD_INR.month_price)} a month in rupees.`,
  },
  {
    q: 'Can Hookpost post to Mastodon or Threads?',
    a: 'Mastodon, no. Threads is built but waiting on Meta app approval, so new accounts cannot connect it yet. The same applies to Instagram and Facebook. Typefully supports both Mastodon and Threads today.',
  },
  {
    q: 'Does Hookpost have an API and MCP server?',
    a: `Yes, on Standard and above. Claude, Cursor and other MCP clients can list your channels and schedule posts. Unlike Typefully, the free plan does not include them.`,
  },
];

export const metadata: Metadata = {
  title: 'Typefully Alternative & Pricing Compared | Hookpost',
  description:
    'Typefully costs $99/year for Creator and $18 per social set on Business. How Hookpost compares on price, free plan limits and networks, checked Sep 2026.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Typefully alternative: pricing and networks compared - Hookpost',
    description: 'Typefully is writing-first for X, LinkedIn, Threads, Bluesky and Mastodon. Hookpost covers 13 networks at a flat price.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Typefully alternative - Hookpost' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typefully alternative: pricing and networks compared - Hookpost',
    description: 'Typefully is writing-first for X, LinkedIn, Threads, Bluesky and Mastodon. Hookpost covers 13 networks at a flat price.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function TypefullyAlternativePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${CANONICAL}#app`,
        name: 'Hookpost',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Android',
        url: 'https://hookpost.hookstep.in/',
        description: 'Social media scheduler for X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram and developer blogs, with a visual calendar.',
        offers: [
          { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'INR', url: 'https://hookpost.hookstep.in/pricing' },
          { '@type': 'Offer', name: 'Standard', price: String(STD_INR.month_price), priceCurrency: 'INR', url: 'https://hookpost.hookstep.in/pricing' },
          { '@type': 'Offer', name: 'Pro', price: String(PRO_INR.month_price), priceCurrency: 'INR', url: 'https://hookpost.hookstep.in/pricing' },
        ],
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
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://hookpost.hookstep.in/alternatives' },
          { '@type': 'ListItem', position: 3, name: 'Typefully alternative', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Alternatives · Typefully</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          A Typefully alternative for more than X and LinkedIn
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Typefully is a writing-first tool for X, LinkedIn, Threads, Bluesky, Mastodon and Substack Notes, and it does that well. Hookpost is
          a scheduler that also publishes to YouTube, Discord, Slack, Telegram and developer blogs, at a flat{' '}
          <strong className="text-white">{inr(STD_INR.month_price)} a month</strong> for {STD_INR.channel} channels. Here is where each one is
          the better pick.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Start free
          </Link>
          <Link href="/pricing" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            See every plan limit
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Typefully pricing today</h2>
        <p className="mt-3 max-w-[70ch] text-white/60">
          Read off{' '}
          <a href={TF_PRICING} rel="nofollow noopener" target="_blank" className="text-[#FF4CE2] underline">typefully.com/pricing</a>{' '}
          on {TYPEFULLY_CHECKED}. Prices change; follow the link to confirm.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 text-white/80">
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Free, $0.</strong> 1 social set, 1 user, 10 posts a month, limited media uploads. Includes the
            API, MCP server and AI agent integrations. No AI writing or analytics.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Creator, $99 a year.</strong> Annual billing only. 1 social set, 1 user, 1,000 posts a month, AI
            writing features, X analytics and unlimited media uploads.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Business, $18 per social set a month</strong> billed yearly, or $20 monthly. Up to 50 social sets,
            unlimited users, 1,500 posts a month, team roles and Slack notifications.
          </li>
        </ul>
        <p className="mt-6 max-w-[70ch] text-white/60">
          A{' '}
          <a href={TF_SOCIAL_SETS} rel="nofollow noopener" target="_blank" className="text-[#FF4CE2] underline">social set</a>{' '}
          groups the accounts of one person or brand across Typefully&apos;s networks. Every plan can publish to all of them, including{' '}
          <a href={TF_SUBSTACK} rel="nofollow noopener" target="_blank" className="text-[#FF4CE2] underline">Substack Notes</a>.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Typefully and Hookpost side by side</h2>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <caption className="sr-only">Typefully and Hookpost compared</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold"></th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Typefully</th>
                  <th scope="col" className="py-3 font-semibold">Hookpost</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, tf, hp]) => (
                  <tr key={label} className="border-b border-white/10">
                    <th scope="row" className="py-4 pe-4 font-bold">{label}</th>
                    <td className="py-4 pe-4 text-white/80">{tf}</td>
                    <td className="py-4 text-white/80">{hp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10 grid gap-10 md:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight font-jakarta text-balance">Where Typefully is stronger</h2>
            <ul className="mt-5 flex flex-col gap-3 text-white/75 list-disc ps-6">
              <li>Its free plan includes the API and MCP server. Hookpost&apos;s free plan does not.</li>
              <li>Mastodon and Substack Notes. Hookpost publishes to neither.</li>
              <li>Threads works today. Hookpost&apos;s Threads, Instagram and Facebook are waiting on Meta app approval.</li>
              <li>X analytics, a writing assistant built around threads, and shared drafts with comments.</li>
              <li>Business has unlimited users. For one writer on X and LinkedIn, Creator at $99 a year is cheaper than Hookpost Standard.</li>
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight font-jakarta text-balance">Where Hookpost is stronger</h2>
            <ul className="mt-5 flex flex-col gap-3 text-white/75 list-disc ps-6">
              <li>Ten networks Typefully does not publish to (listed below), on the same calendar as X, LinkedIn and Bluesky.</li>
              <li>A bigger free plan: {FREE.posts_per_month} posts a month on {FREE.channel} channels, against 10 posts on Typefully Free.</li>
              <li>Flat plans. Standard is {STD_INR.channel} channels for one price, not a fee per social set.</li>
              <li>Monthly billing on every paid plan, where Typefully Creator is annual only.</li>
              <li>Rupee pricing with UPI for Indian customers.</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1100px] px-5 pb-16 sm:px-10">
          <h3 className="text-xl font-bold font-jakarta">Networks on Hookpost that Typefully does not cover</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {HOOKPOST_ONLY.map(([name, href]) => (
              <li key={href}>
                <Link href={href} className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm hover:border-[#FF4CE2]">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[70ch] text-sm text-white/55">
            Hookpost&apos;s LinkedIn support covers personal profiles, not Company Pages. X threads are supported.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">From India</h2>
          <p className="mt-6 max-w-[70ch] text-white/75">
            When we loaded Typefully&apos;s pricing page from India on {TYPEFULLY_CHECKED}, it showed prices in US dollars, so you pay by
            international card at your bank&apos;s exchange rate. Hookpost bills Indian customers in rupees through Razorpay:{' '}
            {inr(STD_INR.month_price)} a month for Standard or {inr(STD_INR.year_price)} a year, with UPI, cards and net banking.
          </p>
          <p className="mt-4 text-white/60">
            More on{' '}
            <Link href="/social-media-scheduler-india" className="text-[#FF4CE2] underline">rupee pricing and UPI Autopay</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Questions</h2>
          <dl className="mt-8 flex flex-col gap-8">
            {FAQ.map((f) => (
              <div key={f.q} className="min-w-0">
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-white/60">
            Other comparisons:{' '}
            <Link href="/alternatives/buffer" className="text-[#FF4CE2] underline">Buffer</Link>,{' '}
            <Link href="/alternatives/publer" className="text-[#FF4CE2] underline">Publer</Link>,{' '}
            <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">free schedulers</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
