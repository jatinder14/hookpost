import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "free social media scheduler" and its variants. Every Hookpost number
// on this page is read from pricing.ts; competitor numbers were read off their
// own pricing pages on COMPETITORS_CHECKED and must be re-checked before that
// date is bumped. A comparison table with one stale figure is worse than none.
const CANONICAL = 'https://hookpost.hookstep.in/free-social-media-scheduler';
const COMPETITORS_CHECKED = '25 September 2026';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

// Networks a brand-new user can connect and publish to today. Instagram,
// Facebook and Threads are left out on purpose while the Meta app is
// unpublished - see channel-specs.ts for the full list and its caveats.
const FREE_NETWORKS = [
  ['X (Twitter)', '/channels/x'],
  ['LinkedIn', '/channels/linkedin'],
  ['YouTube', '/channels/youtube'],
  ['Bluesky', '/channels/bluesky'],
  ['Discord', '/channels/discord'],
  ['Slack', '/channels/slack'],
  ['Telegram', '/channels/telegram'],
  ['WordPress', '/channels/wordpress'],
  ['Hashnode', '/channels/hashnode'],
  ['Dev.to', '/channels/devto'],
] as const;

const COMPARISON: {
  name: string;
  free: string;
  paid: string;
  source: string;
  highlight?: boolean;
}[] = [
  {
    name: 'Hookpost',
    free: `${FREE.channel} channels, ${FREE.posts_per_month} posts a month, X and LinkedIn included`,
    paid: `${inr(STANDARD.month_price)}/month flat for ${STANDARD.channel} channels`,
    source: '/pricing',
    highlight: true,
  },
  {
    name: 'Buffer',
    free: '3 channels, 10 scheduled posts per channel',
    paid: '$5 per channel per month ($60/year per channel)',
    source: 'https://buffer.com/pricing',
  },
  {
    name: 'Metricool',
    free: '1 brand, 20 posts a month, no X or LinkedIn',
    paid: 'Starter from $20/month',
    source: 'https://metricool.com/pricing/',
  },
  {
    name: 'Hootsuite',
    free: 'No free plan (14-day trial)',
    paid: 'Standard $99/month, billed annually',
    source: 'https://www.hootsuite.com/plans',
  },
  {
    name: 'Later',
    free: 'No free plan (14-day trial)',
    paid: 'Starter $18.75/month, billed yearly',
    source: 'https://later.com/pricing/',
  },
];

const FAQ = [
  {
    q: 'Is Hookpost really free?',
    a: `Yes. The Free plan costs ${inr(0)} with no time limit and no card. It includes ${FREE.channel} connected channels and ${FREE.posts_per_month} scheduled posts a month on the visual calendar. It does not include the AI writing assistant or API access.`,
  },
  {
    q: 'What is the best free social media scheduler?',
    a: `It depends on which networks you post to. Buffer's free plan allows 3 channels but only 10 queued posts per channel. Metricool's free plan excludes X and LinkedIn. Hookpost's free plan allows ${FREE.posts_per_month} posts a month across ${FREE.channel} channels, including X and LinkedIn. Hootsuite and Later have no free plan.`,
  },
  {
    q: 'Which networks can I schedule for free?',
    a: 'X, LinkedIn, YouTube, Bluesky, Discord, Slack, Telegram, WordPress, Dev.to, Hashnode, Lemmy, Nostr and Listmonk. Instagram, Facebook and Threads are built and waiting on Meta app approval, so new accounts cannot connect them yet.',
  },
  {
    q: 'What happens when I need more than the free plan?',
    a: `Standard is ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels and ${STANDARD.posts_per_month} posts, with AI writing, the REST API and the MCP server. It is one flat price, not a fee per channel, and it has a 7-day free trial.`,
  },
  {
    q: 'Can I schedule posts from ChatGPT or Claude?',
    a: 'Yes, on Standard and above. Hookpost runs an MCP server, so Claude Desktop, Claude Code, Cursor and other MCP clients can list your channels and schedule posts for you.',
  },
];

export const metadata: Metadata = {
  title: 'Free Social Media Scheduler for X & LinkedIn | Hookpost',
  description: `Schedule ${FREE.posts_per_month} posts a month to X, LinkedIn, YouTube and Bluesky free, no card. Compared with the free plans of Buffer, Metricool and Hootsuite.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free social media scheduler - Hookpost',
    description: `${FREE.channel} channels, ${FREE.posts_per_month} posts a month, X and LinkedIn included. No card needed.`,
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Hookpost free social media scheduler' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free social media scheduler - Hookpost',
    description: `${FREE.channel} channels, ${FREE.posts_per_month} posts a month, X and LinkedIn included.`,
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function FreeSchedulerPage() {
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
        description: 'Free social media scheduler for X, LinkedIn, YouTube, Bluesky and more, with a visual calendar.',
        offers: {
          '@type': 'Offer',
          name: 'Free plan',
          price: '0',
          priceCurrency: 'INR',
          url: CANONICAL,
          description: `${FREE.channel} channels, ${FREE.posts_per_month} posts per month.`,
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
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hookpost.hookstep.in/' },
          { '@type': 'ListItem', position: 2, name: 'Free social media scheduler', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Free plan · no card</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          A free social media scheduler that includes X and LinkedIn
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Hookpost&apos;s Free plan lets you schedule <strong className="text-white">{FREE.posts_per_month} posts a month</strong> across{' '}
          <strong className="text-white">{FREE.channel} channels</strong> for {inr(0)}, with no time limit and no card. You plan
          everything on one visual calendar and Hookpost publishes at the time you pick.
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
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What the free plan includes</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
          <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">{FREE.channel} connected channels.</strong> Any two of the networks below, for example one X account and one LinkedIn profile.</li>
          <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">{FREE.posts_per_month} scheduled posts a month.</strong> Counted across all channels and reset every billing month. The limit is enforced in code, so it is exactly what you get.</li>
          <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">Visual calendar.</strong> Drag posts between days, preview them per network, and see what goes out when.</li>
          <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">Per-network checks before publishing.</strong> Character limits and media rules are validated before a post is queued, not after it fails.</li>
        </ul>
        <p className="mt-6 max-w-[70ch] text-white/60">
          Not included on Free: the AI writing assistant, AI images, the REST API and the MCP server. Those start on Standard at{' '}
          {inr(STANDARD.month_price)} a month.
        </p>

        <h3 className="mt-12 text-xl font-bold font-jakarta">Networks you can schedule for free</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {FREE_NETWORKS.map(([name, href]) => (
            <li key={href}>
              <Link href={href} className="inline-block rounded-full border border-white/15 px-4 py-2 text-sm hover:border-[#FF4CE2]">
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[70ch] text-sm text-white/55">
          Instagram, Facebook and Threads are built and waiting on Meta app approval, so new accounts cannot connect them yet.
          We would rather say so here than have you find out after signing up.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Free plans compared</h2>
          <p className="mt-3 max-w-[70ch] text-white/60">
            Read off each company&apos;s own pricing page on {COMPETITORS_CHECKED}. Prices change; follow the source link to confirm.
          </p>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <caption className="sr-only">Free social media scheduler plans compared</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold">Tool</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Free plan</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Cheapest paid plan</th>
                  <th scope="col" className="py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.name} className={`border-b border-white/10 ${row.highlight ? 'bg-[#FF4CE2]/[0.06]' : ''}`}>
                    <th scope="row" className="py-4 pe-4 font-bold">{row.name}</th>
                    <td className="py-4 pe-4 text-white/80">{row.free}</td>
                    <td className="py-4 pe-4 text-white/80">{row.paid}</td>
                    <td className="py-4">
                      <a
                        href={row.source}
                        className="text-[#FF4CE2] underline"
                        {...(row.source.startsWith('http') ? { rel: 'nofollow noopener', target: '_blank' } : {})}
                      >
                        {row.source.startsWith('http') ? 'pricing page' : 'our pricing'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[70ch] text-white/70">
            The honest summary: Buffer gives you one more channel and its AI assistant for free, but caps each channel at 10 queued posts. Metricool leaves
            out X and LinkedIn entirely. If X or LinkedIn is where you post, Hookpost&apos;s free plan goes further. When you outgrow
            it, you pay one flat price instead of a fee per channel.
          </p>
          <p className="mt-4 text-white/60">
            Detailed comparisons:{' '}
            <Link href="/alternatives/buffer" className="text-[#FF4CE2] underline">Buffer</Link>,{' '}
            <Link href="/alternatives/metricool" className="text-[#FF4CE2] underline">Metricool</Link>,{' '}
            <Link href="/alternatives/hootsuite" className="text-[#FF4CE2] underline">Hootsuite</Link>,{' '}
            <Link href="/alternatives/later" className="text-[#FF4CE2] underline">Later</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Schedule your first post in three steps</h2>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            <li><strong className="text-white">Sign up</strong> with Google or email. Choose &quot;Continue with Free Plan&quot; on the plan screen.</li>
            <li><strong className="text-white">Connect a channel</strong>, for example your X account or LinkedIn profile. Most networks connect with one OAuth click.</li>
            <li><strong className="text-white">Write the post, pick a date and time</strong>, and add it to the calendar. Hookpost publishes it then, even if your laptop is closed.</li>
          </ol>
          <p className="mt-6 text-white/60">
            Checking length first? Use the free{' '}
            <Link href="/tools/character-counter" className="text-[#FF4CE2] underline">character counter</Link>{' '}
            to test a post against every network&apos;s limit.
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
            In India? See{' '}
            <Link href="/social-media-scheduler-india" className="text-[#FF4CE2] underline">rupee pricing and UPI Autopay</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
