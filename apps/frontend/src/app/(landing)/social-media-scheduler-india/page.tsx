import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "social media scheduler India", "... in INR", "... with UPI". No
// competitor in the category mentions INR, UPI or Razorpay on its pricing page
// (GEO research, 8 Sep 2026), which makes this the least contested query set
// Hookpost can honestly win. Prices come from pricing.ts; Buffer's figure was
// read off buffer.com/pricing on 25 Sep 2026. Hootsuite, Zoho, Publer and
// SocialPilot DO localise to INR for Indian visitors (checked 26 Sep 2026), so
// never claim 'they all bill in dollars' - the true gap is UPI and flat pricing.
const CANONICAL = 'https://hookpost.hookstep.in/social-media-scheduler-india';

const { FREE, STANDARD, PRO } = pricingINR;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;
const BUFFER_PER_CHANNEL_USD = 5;

const FAQ = [
  {
    q: 'Is there a social media scheduler that charges in rupees?',
    a: `Yes. Hookpost bills in Indian rupees through Razorpay. Standard is ${inr(STANDARD.month_price)} a month and Pro is ${inr(PRO.month_price)} a month, and there is a free plan. You can pay with UPI Autopay, a debit or credit card, or NetBanking.`,
  },
  {
    q: 'Can I pay for a social media tool with UPI Autopay?',
    a: 'Yes. When you subscribe, Razorpay sets up a UPI Autopay mandate from your UPI app (Google Pay, PhonePe, Paytm and others). Per RBI rules a small refundable authorisation is taken to set it up. After that the plan renews automatically, and you can cancel from Settings.',
  },
  {
    q: 'Does the price change after I subscribe?',
    a: 'No. A UPI Autopay mandate fixes the amount at signup, so the price you subscribe at is the price you keep.',
  },
  {
    q: 'Why not just use Buffer or Hootsuite?',
    a: `You can. Buffer bills in US dollars and per channel: $${BUFFER_PER_CHANNEL_USD} per channel per month, so ${STANDARD.channel} channels cost $${BUFFER_PER_CHANNEL_USD * STANDARD.channel} a month on a card that allows international payments. Hootsuite does show rupee prices in India, but its cheapest plan is ₹1,999 per user per month and there is no free plan. Neither offers UPI. Hookpost Standard covers ${STANDARD.channel} channels for one flat ${inr(STANDARD.month_price)} with UPI Autopay.`,
  },
  {
    q: 'Is there a free trial?',
    a: `Standard has a 7-day free trial, and the Free plan (${FREE.channel} channels, ${FREE.posts_per_month} posts a month) has no time limit.`,
  },
  {
    q: 'Is Hookpost an Indian company?',
    a: 'Yes. Hookpost is built by JR Consulting Co., based in India. Support and billing are handled in India.',
  },
];

export const metadata: Metadata = {
  title: `Social Media Scheduler in India, ${inr(STANDARD.month_price)}/mo with UPI | Hookpost`,
  description: `Schedule posts to X, LinkedIn and YouTube, billed in rupees. Free plan, then ${inr(STANDARD.month_price)}/month flat for ${STANDARD.channel} channels with UPI Autopay.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Social media scheduler for India - pay in rupees with UPI',
    description: `Free plan, then ${inr(STANDARD.month_price)}/month flat. UPI Autopay, cards, NetBanking.`,
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Hookpost social media scheduler for India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social media scheduler for India - pay in rupees with UPI',
    description: `Free plan, then ${inr(STANDARD.month_price)}/month flat for ${STANDARD.channel} channels.`,
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function IndiaSchedulerPage() {
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
        areaServed: { '@type': 'Country', name: 'India' },
        offers: [FREE, STANDARD, PRO].map((t) => ({
          '@type': 'Offer',
          name: `${t.current.charAt(0)}${t.current.slice(1).toLowerCase()} plan`,
          price: String(t.month_price),
          priceCurrency: 'INR',
          url: 'https://hookpost.hookstep.in/pricing',
          description: `${t.channel} channels, ${t.posts_per_month} posts per month.`,
        })),
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
          { '@type': 'ListItem', position: 2, name: 'Social media scheduler for India', item: CANONICAL },
        ],
      },
    ],
  };

  const plans = [
    { name: 'Free', t: FREE, extra: 'Calendar scheduling. No AI or API.' },
    { name: 'Standard', t: STANDARD, extra: `${STANDARD.ai_generation_count} AI captions, ${STANDARD.image_generation_count} AI images, API and MCP. 7-day free trial.` },
    { name: 'Pro', t: PRO, extra: `${PRO.ai_generation_count.toLocaleString('en-IN')} AI captions, ${PRO.image_generation_count} AI images, up to ${PRO.team_member_limit} team members.` },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Made in India · billed in ₹</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          The social media scheduler you can pay for with UPI
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Hookpost schedules posts to X, LinkedIn, YouTube, Bluesky, Telegram and more, and bills in rupees. Start on the free
          plan, then pay <strong className="text-white">{inr(STANDARD.month_price)} a month flat for {STANDARD.channel} channels</strong>{' '}
          through Razorpay with UPI Autopay, a card or NetBanking. No fee per channel, and no international card needed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Start free
          </Link>
          <Link href="/pricing" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Full pricing
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Plans in rupees</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {plans.map(({ name, t, extra }) => (
            <div key={name} className="rounded-2xl border border-white/10 p-6">
              <div className="text-lg font-bold font-jakarta">{name}</div>
              <div className="mt-2 text-3xl font-extrabold">
                {inr(t.month_price)}
                <span className="text-base font-normal text-white/60">/month</span>
              </div>
              {t.year_price ? (
                <div className="text-sm text-white/55">or {inr(t.year_price)}/year</div>
              ) : null}
              <ul className="mt-4 flex flex-col gap-1 text-sm text-white/75">
                <li>{t.channel} channels</li>
                <li>{t.posts_per_month.toLocaleString('en-IN')} posts a month</li>
                <li>{extra}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Rupees vs dollars, for 5 channels</h2>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <caption className="sr-only">Monthly cost for five channels</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold"> </th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Hookpost Standard</th>
                  <th scope="col" className="py-3 font-semibold">Buffer Essentials</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/10">
                  <th scope="row" className="py-4 pe-4 font-semibold text-white">5 channels, monthly</th>
                  <td className="py-4 pe-4">{inr(STANDARD.month_price)} flat</td>
                  <td className="py-4">${BUFFER_PER_CHANNEL_USD * 5} (${BUFFER_PER_CHANNEL_USD} × 5 channels)</td>
                </tr>
                <tr className="border-b border-white/10">
                  <th scope="row" className="py-4 pe-4 font-semibold text-white">Currency</th>
                  <td className="py-4 pe-4">Indian rupees</td>
                  <td className="py-4">US dollars</td>
                </tr>
                <tr className="border-b border-white/10">
                  <th scope="row" className="py-4 pe-4 font-semibold text-white">UPI Autopay</th>
                  <td className="py-4 pe-4">Yes</td>
                  <td className="py-4">No, international card needed</td>
                </tr>
                <tr className="border-b border-white/10">
                  <th scope="row" className="py-4 pe-4 font-semibold text-white">Adding a 6th channel</th>
                  <td className="py-4 pe-4">Move to Pro (20 channels)</td>
                  <td className="py-4">+${BUFFER_PER_CHANNEL_USD}/month per channel</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-white/55">
            Buffer&apos;s price from{' '}
            <a href="https://buffer.com/pricing" rel="nofollow noopener" target="_blank" className="underline">buffer.com/pricing</a>, checked 25 September 2026.
            Full comparison: <Link href="/alternatives/buffer" className="text-[#FF4CE2] underline">Hookpost vs Buffer</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Built for how Indian teams post</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
            <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">Schedule in IST.</strong> The calendar follows your browser&apos;s time zone by default (you can change it in Settings), so a 9 AM post goes out at 9 AM India time.</li>
            <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">LinkedIn pages and profiles.</strong> Post to a personal profile and a company page from the same calendar.</li>
            <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">YouTube uploads and Shorts.</strong> Title, description and visibility set per post.</li>
            <li className="rounded-2xl border border-white/10 p-5"><strong className="text-white">Telegram channels and groups.</strong> Broadcast to a Telegram channel on the same schedule as everything else.</li>
          </ul>
          <p className="mt-6 max-w-[70ch] text-sm text-white/55">
            Instagram, Facebook and Threads are built and waiting on Meta app approval, so new accounts cannot connect them yet.
          </p>
          <p className="mt-6 text-white/60">
            Who uses it:{' '}
            <Link href="/for/small-business" className="text-[#FF4CE2] underline">small businesses</Link>,{' '}
            <Link href="/for/agencies" className="text-[#FF4CE2] underline">agencies</Link>,{' '}
            <Link href="/for/creators" className="text-[#FF4CE2] underline">creators</Link>,{' '}
            <Link href="/for/solopreneurs-freelancers" className="text-[#FF4CE2] underline">freelancers</Link>.
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
            Just want to try it?{' '}
            <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">What the free plan includes</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
