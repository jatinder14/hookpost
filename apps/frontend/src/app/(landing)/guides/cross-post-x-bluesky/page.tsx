import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "cross post twitter to bluesky", "post to bluesky and x at the same
// time" and "bluesky crossposter". Every behaviour described here is read from
// the code:
//   - new-launch/select.current.tsx + editor.tsx (global editor behind the globe
//     icon, per-channel avatars, "Edit content" to customise one network,
//     "Back to global" is irreversible, Add post / delay for threads)
//   - manage.modal.tsx + posts.service.ts (every post checked per channel against
//     that channel's own limit before it is queued, shortlink prompt)
//   - helpers/utils/count.length.ts (X = twitter-text weighted length; Bluesky =
//     JavaScript string length, so emoji can count as 2)
//   - integrations/social/x.provider.ts (280 / 4,000 Verified, 4 images or 1
//     video, replies chained with in_reply_to_tweet_id)
//   - integrations/social/bluesky.provider.ts (maxLength 300, 4 images or 1
//     video, images shrunk under ~976 KB with alt text, RichText.detectFacets,
//     no external link embed, App Password custom fields + public HTTPS service,
//     replies set root = first post and parent = previous post)
//   - neither provider publishes thread_finisher
// If any of these change, this page has to change with it.
const CANONICAL = 'https://hookpost.hookstep.in/guides/cross-post-x-bluesky';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const STEPS: { name: string; text: string }[] = [
  {
    name: 'Connect X',
    text: 'Click Add Channel and choose X, then approve Hookpost for the account you are logged into on X.',
  },
  {
    name: 'Connect Bluesky with an App Password',
    text: 'Choose Bluesky, keep the Service as https://bsky.social (or enter your own server), type your handle as the Identifier and paste an App Password.',
  },
  {
    name: 'Write the post once',
    text: 'Create a post and select both channels. With the globe icon selected you are editing the shared version that goes to both networks.',
  },
  {
    name: 'Adjust one network if needed',
    text: 'Click the X or Bluesky avatar above the editor and press Edit content. That channel gets its own copy of the text, media and thread, and the other keeps the shared version.',
  },
  {
    name: 'Add follow-up posts for a thread',
    text: 'Click Add post to add the next post. The same thread goes to both networks unless you customised one of them.',
  },
  {
    name: 'Schedule',
    text: 'Pick a date and time and click Add to calendar. Each network is checked against its own limit first, then both publish at the same time.',
  },
];

const FAQ = [
  {
    q: 'Can I post to Bluesky and X at the same time?',
    a: 'Yes. Select both channels on one post and schedule it. Hookpost publishes to each network at the time you set, with each one checked against its own character and media rules.',
  },
  {
    q: 'Why does Bluesky ask for an App Password?',
    a: 'Hookpost signs in to Bluesky with the credentials you give it, and Bluesky wants an App Password for that, not your account password. Create one under Settings > Privacy and Security > App Passwords. Two-factor authentication can stay on.',
  },
  {
    q: 'Do links work on Bluesky?',
    a: 'Yes. Links, mentions and hashtags are turned into clickable parts of the post (Bluesky calls them facets). Hookpost does not attach a link preview card on Bluesky, and the full link counts toward the 300 characters.',
  },
  {
    q: 'Can I cross-post a thread?',
    a: 'Yes. On X each post is sent as a reply to the one before. On Bluesky each reply points to the first post as the thread root and to the previous post as its parent, so both show a normal thread.',
  },
  {
    q: 'Is it free?',
    a: `Yes. The Free plan has ${FREE.channel} channels, enough for X and Bluesky, and ${FREE.posts_per_month} posts a month for ${inr(0)}. Each network counts separately, so one post to both uses 2. Standard is ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels and ${STANDARD.posts_per_month} posts.`,
  },
];

export const metadata: Metadata = {
  title: 'Cross-Post to X and Bluesky at the Same Time | Hookpost',
  description:
    'Post to X (Twitter) and Bluesky at once: write one post or thread, edit each network separately, and respect 280 vs 300 characters. Works on the Free plan.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'How to cross-post to X and Bluesky at the same time - Hookpost',
    description: 'One post or thread, two networks. Per-network edits, separate limits, Bluesky App Password login, threads on both.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Cross-post to X and Bluesky with Hookpost' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to cross-post to X and Bluesky at the same time - Hookpost',
    description: 'One post or thread, two networks, per-network edits and separate limits.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function CrossPostXBlueskyGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${CANONICAL}#article`,
        headline: 'How to cross-post to X and Bluesky at the same time',
        url: CANONICAL,
        inLanguage: 'en',
        dateModified: '2026-09-26',
        author: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        publisher: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        about: [
          { '@type': 'Thing', name: 'X (Twitter)' },
          { '@type': 'Thing', name: 'Bluesky' },
        ],
        step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
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
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://hookpost.hookstep.in/guides' },
          { '@type': 'ListItem', position: 3, name: 'Cross-post to X and Bluesky', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Guide · X and Bluesky</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          How to cross-post to X and Bluesky at the same time
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Select both channels on one post and Hookpost publishes it to X and Bluesky at the time you set. Write it once, change the
          wording for one network when you need to, and each version is checked against that network&apos;s own limits:{' '}
          <strong className="text-white">280 characters on X, 300 on Bluesky</strong>. Threads work on both.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Connect X and Bluesky free
          </Link>
          <Link href="/channels/bluesky" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Bluesky channel details
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">One post, two versions when you need them</h2>
        <p className="mt-6 max-w-[70ch] text-white/75">
          The composer opens on a shared version, shown by the globe icon above the editor. Whatever you write there goes to every selected
          channel. Next to the globe are the avatars of your channels. Click Bluesky, press Edit content, and Bluesky gets its own copy that
          you can shorten, re-tag or give different images, while X keeps the shared text. Back to global throws the custom copy away and
          cannot be undone, so Hookpost asks first.
        </p>
        <p className="mt-4 max-w-[70ch] text-white/75">
          When you schedule, each channel is checked separately. If the text fits X but not Bluesky, the warning names Bluesky and takes you
          to it.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Where X and Bluesky differ</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">X: 280, weighted.</strong> A link counts as 23 characters and most emoji as 2. Accounts marked
              Verified (Premium) get 4,000. Try the{' '}
              <Link href="/tools/x-character-counter" className="text-[#FF4CE2] underline">X character counter</Link>.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Bluesky: 300.</strong> Links count in full. Bluesky counts graphemes, but the Hookpost composer
              counts some emoji as 2, so it is slightly stricter, never looser. Try the{' '}
              <Link href="/tools/bluesky-character-counter" className="text-[#FF4CE2] underline">Bluesky character counter</Link>.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Media: 4 images or 1 video on both.</strong> On Bluesky, Hookpost shrinks images under about 976
              KB before upload and keeps your alt text.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Links on Bluesky become facets.</strong> Links, mentions and hashtags are detected and made
              clickable. There is no link preview card.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Cross-post step by step</h2>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            {STEPS.map((s) => (
              <li key={s.name}>
                <strong className="text-white">{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-white/60">
            For a thread, every post after the first has its own delay, so replies can go out minutes or hours apart. Splitting a long draft?
            The <Link href="/tools/thread-splitter" className="text-[#FF4CE2] underline">thread splitter</Link> cuts it for X and Bluesky
            limits. More on X threads in{' '}
            <Link href="/guides/schedule-x-threads" className="text-[#FF4CE2] underline">how to schedule a thread on X</Link>.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Limitations to know first</h2>
          <ul className="mt-6 flex flex-col gap-3 max-w-[70ch] text-white/75 list-disc ps-6">
            <li>
              <strong className="text-white">No link cards on Bluesky.</strong> The link is clickable, but Hookpost does not attach a preview
              card. Add an image if the post needs a visual.
            </li>
            <li>
              <strong className="text-white">Long links cost more on Bluesky.</strong> X counts every link as 23; Bluesky counts every
              character. If Hookpost offers to shorten links when you schedule, accepting helps the Bluesky version fit.
            </li>
            <li>
              <strong className="text-white">Your own Bluesky server must be public HTTPS.</strong> A self-hosted server works if it is on a
              public HTTPS address; private or plain-HTTP addresses are refused.
            </li>
            <li>
              <strong className="text-white">Each network counts as a post.</strong> One post to both networks uses 2 of your monthly posts,
              and each post in a thread counts too.
            </li>
          </ul>
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
            Full specs: <Link href="/channels/bluesky" className="text-[#FF4CE2] underline">Bluesky channel page</Link> and{' '}
            <Link href="/channels/x" className="text-[#FF4CE2] underline">X channel page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
