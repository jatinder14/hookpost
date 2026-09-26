import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "open source social media scheduler", "self hosted social media
// scheduler", "self hosted buffer alternative", "postiz self hosted" and
// "mixpost alternative". Stars, licence, last push and language were read from
// the GitHub API (api.github.com/repos/OWNER/REPO) on REPOS_CHECKED; hosted
// prices were read off each vendor's own pricing page the same day. Re-check
// every row before bumping the date - star counts move weekly.
const CANONICAL = 'https://hookpost.hookstep.in/open-source-social-media-scheduler';
const REPOS_CHECKED = '26 September 2026';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const REPOS: {
  name: string;
  repo: string;
  licence: string;
  stars: string;
  pushed: string;
  language: string;
  selfHost: string;
  hosted: string;
  hostedSource: string;
  highlight?: boolean;
}[] = [
  {
    name: 'Hookpost',
    repo: 'https://github.com/jatinder14/hookpost',
    licence: 'AGPL-3.0',
    stars: '1',
    pushed: '26 Sep 2026',
    language: 'TypeScript',
    selfHost: 'Docker Compose',
    hosted: `Yes. Free plan, then ${inr(STANDARD.month_price)}/month flat for ${STANDARD.channel} channels`,
    hostedSource: '/pricing',
    highlight: true,
  },
  {
    name: 'Postiz',
    repo: 'https://github.com/gitroomhq/postiz-app',
    licence: 'AGPL-3.0',
    stars: '36,330',
    pushed: '25 Sep 2026',
    language: 'TypeScript',
    selfHost: 'Docker, Coolify, Railway or any VPS',
    hosted: 'Yes. $29/month for 5 channels ($23/month billed yearly), 7-day trial',
    hostedSource: 'https://postiz.com/pricing',
  },
  {
    name: 'Mixpost',
    repo: 'https://github.com/inovector/mixpost',
    licence: 'MIT (Lite edition)',
    stars: '3,738',
    pushed: '16 Mar 2026',
    language: 'Vue (Laravel package)',
    selfHost: 'Docker, Laravel package or manual install',
    hosted: 'No. Self-hosted only; Pro licence is $299 one-time',
    hostedSource: 'https://mixpost.app/pricing',
  },
];

const FAQ = [
  {
    q: 'What is the best open source social media scheduler?',
    a: 'For most people who want to self-host, Postiz. It has the largest community of the three (36,330 GitHub stars on 26 September 2026), at least 100 commits between 22 and 25 September 2026, and an AGPL-3.0 licence with no features held back. Mixpost Lite suits teams already running Laravel. Hookpost is a fork of Postiz, so choose it for its hosted plan priced in rupees rather than for the self-hosted code.',
  },
  {
    q: 'Is Hookpost built on Postiz?',
    a: 'Yes. Hookpost is a modified fork of Postiz by Gitroom Inc. and the Postiz contributors, forked on 19 August 2026 and kept under the same AGPL-3.0 licence. The NOTICE file in the repository records the upstream commit. Hookpost is not affiliated with or endorsed by Postiz.',
  },
  {
    q: 'Can I self-host Hookpost for free?',
    a: 'Yes. Clone the repository, copy .env.example to .env and start the stack with Docker Compose. You pay nothing to Hookpost, but you run PostgreSQL, Redis and Temporal yourself and register your own developer apps with each social network.',
  },
  {
    q: 'Is there a self-hosted Buffer alternative?',
    a: 'Buffer itself is closed source and cannot be self-hosted. Postiz, Hookpost and Mixpost Lite all can, and all three give you a calendar, scheduled publishing and multiple networks on your own server.',
  },
  {
    q: 'What does the AGPL-3.0 licence mean for me?',
    a: 'You can run, change and share the code for free, including commercially. If you modify it and let other people use your modified version over a network, you must offer them its source code. Running it unmodified for your own team has no such duty.',
  },
];

export const metadata: Metadata = {
  title: 'Open Source Social Media Scheduler, Self-Hosted | Hookpost',
  description:
    'Open source, self-hosted social media schedulers compared: Hookpost, Postiz and Mixpost by licence, GitHub stars, last push, self-host method and hosted price.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Open source social media schedulers compared - Hookpost',
    description: 'Hookpost, Postiz and Mixpost compared by licence, GitHub stars, last commit and hosted price.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Open source social media schedulers compared' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open source social media schedulers compared - Hookpost',
    description: 'Hookpost, Postiz and Mixpost compared by licence, GitHub stars, last commit and hosted price.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function OpenSourceSchedulerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${CANONICAL}#app`,
        name: 'Hookpost',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, Linux (Docker)',
        url: 'https://hookpost.hookstep.in/',
        license: 'https://www.gnu.org/licenses/agpl-3.0.html',
        isBasedOn: 'https://github.com/gitroomhq/postiz-app',
        codeRepository: 'https://github.com/jatinder14/hookpost',
        description: 'Open source (AGPL-3.0) social media scheduler, self-hostable with Docker Compose, with a hosted plan priced in rupees.',
        offers: {
          '@type': 'Offer',
          name: 'Free plan',
          price: '0',
          priceCurrency: 'INR',
          url: 'https://hookpost.hookstep.in/pricing',
          description: `${FREE.channel} channels, ${FREE.posts_per_month} posts per month on the hosted plan.`,
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
          { '@type': 'ListItem', position: 2, name: 'Open source social media scheduler', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">AGPL-3.0 · self-hostable</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Open source social media schedulers you can self-host
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Three open source schedulers are actively used for self-hosting: <strong className="text-white">Postiz</strong>,{' '}
          <strong className="text-white">Mixpost</strong> and <strong className="text-white">Hookpost</strong>. Hookpost is a fork of
          Postiz, so the two share most of their code. Below is how they compare on licence, activity and hosting, with numbers taken
          from GitHub on {REPOS_CHECKED}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/guides/docker-self-hosting" className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Self-host with Docker
          </Link>
          <Link href="/auth" prefetch={false} className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Use the hosted plan free
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What &quot;open source&quot; actually buys you</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 text-white/80">
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">A licence you can read.</strong> Postiz and Hookpost are AGPL-3.0; the Mixpost Lite repository is
            MIT. You can use either commercially. AGPL adds one duty: if you modify the code and serve it to other people, you publish your changes.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Self-hosting.</strong> The scheduler runs on your own server, so there is no per-channel fee and no
            vendor that can raise prices or shut down under you.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Data ownership.</strong> Posts, drafts, media and the OAuth tokens for your accounts sit in your own
            database instead of a third party&apos;s.
          </li>
        </ul>
        <p className="mt-6 max-w-[70ch] text-white/60">
          The cost is upkeep. You run PostgreSQL and Redis (plus Temporal for Postiz and Hookpost), apply updates, and register your own
          developer app with every network you post to. Some networks, such as Meta&apos;s, review that app before it can publish for anyone.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Self-hostable schedulers compared</h2>
          <p className="mt-3 max-w-[70ch] text-white/60">
            Stars, licence, last push and language read from the GitHub API, and hosted prices from each vendor&apos;s own pricing page,
            checked {REPOS_CHECKED}. Follow the links to confirm.
          </p>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <caption className="sr-only">Open source social media schedulers compared</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold">Project</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Licence</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">GitHub stars</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Last push</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Language</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Self-host method</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Hosted plan</th>
                  <th scope="col" className="py-3 font-semibold">Sources</th>
                </tr>
              </thead>
              <tbody>
                {REPOS.map((row) => (
                  <tr key={row.name} className={`border-b border-white/10 ${row.highlight ? 'bg-[#FF4CE2]/[0.06]' : ''}`}>
                    <th scope="row" className="py-4 pe-4 font-bold">{row.name}</th>
                    <td className="py-4 pe-4 text-white/80">{row.licence}</td>
                    <td className="py-4 pe-4 text-white/80">{row.stars}</td>
                    <td className="py-4 pe-4 text-white/80">{row.pushed}</td>
                    <td className="py-4 pe-4 text-white/80">{row.language}</td>
                    <td className="py-4 pe-4 text-white/80">{row.selfHost}</td>
                    <td className="py-4 pe-4 text-white/80">{row.hosted}</td>
                    <td className="py-4 text-white/80">
                      <a href={row.repo} className="text-[#FF4CE2] underline" rel="nofollow noopener" target="_blank">
                        repo
                      </a>
                      {' · '}
                      <a
                        href={row.hostedSource}
                        className="text-[#FF4CE2] underline"
                        {...(row.hostedSource.startsWith('http') ? { rel: 'nofollow noopener', target: '_blank' } : {})}
                      >
                        pricing
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[70ch] text-white/70">
            The honest summary: Postiz is the project with the momentum. It has 36,330 stars to Hookpost&apos;s 1, it pushed at least
            100 commits between 22 and 25 September 2026, and it already offers an MCP server for AI agents. Mixpost&apos;s open source repository is the Lite edition of
            a commercial product, and its last push was in March 2026. Hookpost is new and has a single star.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Where Hookpost comes from, and how it differs</h2>
          <p className="mt-6 max-w-[70ch] text-white/75">
            Hookpost is a modified fork of{' '}
            <a href="https://github.com/gitroomhq/postiz-app" className="text-[#FF4CE2] underline" rel="noopener" target="_blank">
              Postiz
            </a>
            , built by Gitroom Inc. and the Postiz contributors. It was forked on 19 August 2026, keeps the AGPL-3.0 licence, and credits
            the upstream commit in its NOTICE file. The scheduling engine, the calendar, the MCP server and the list of 36 network
            integrations all come from Postiz. We are not affiliated with the Postiz team, and the good parts of Hookpost are largely their work.
          </p>
          <p className="mt-4 max-w-[70ch] text-white/75">
            What Hookpost changes is the hosted plan. Hookpost Cloud has a Free plan with {FREE.channel} channels and{' '}
            {FREE.posts_per_month} posts a month, then Standard at {inr(STANDARD.month_price)} a month flat for {STANDARD.channel}{' '}
            channels. It bills in rupees through Razorpay, with UPI Autopay, cards and NetBanking. Postiz Cloud starts at $29 a month ($23 a month billed yearly) for
            the same {STANDARD.channel} channels. If you plan to self-host, the code difference is small and Postiz is the safer upstream to track.
          </p>
          <p className="mt-4 text-white/60">
            Deeper comparisons:{' '}
            <Link href="/alternatives/postiz" className="text-[#FF4CE2] underline">Hookpost vs Postiz</Link>,{' '}
            <Link href="/alternatives/mixpost" className="text-[#FF4CE2] underline">Hookpost vs Mixpost</Link>,{' '}
            <Link href="/alternatives/buffer" className="text-[#FF4CE2] underline">Hookpost vs Buffer</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Self-host Hookpost in three commands</h2>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            <li><strong className="text-white">Clone the repository</strong> from github.com/jatinder14/hookpost.</li>
            <li><strong className="text-white">Copy the environment template</strong> (.env.example to .env) and set your database, Redis, URLs and secrets.</li>
            <li><strong className="text-white">Start the stack</strong> with Docker Compose. It brings up the app, PostgreSQL, Redis and Temporal.</li>
          </ol>
          <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-xs text-white/85">
            <pre>{`git clone https://github.com/jatinder14/hookpost.git
cd hookpost
cp .env.example .env
docker compose -f docker-compose.dev.yaml up -d`}</pre>
          </div>
          <p className="mt-6 text-white/60">
            The full walkthrough, including a reverse proxy and SSL, is in the{' '}
            <Link href="/guides/docker-self-hosting" className="text-[#FF4CE2] underline">Docker self-hosting guide</Link>. Would rather not
            run servers? The <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">free hosted plan</Link> needs no card.
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
            Using AI agents? See the{' '}
            <Link href="/guides/claude-mcp-social-media" className="text-[#FF4CE2] underline">MCP setup guide</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
