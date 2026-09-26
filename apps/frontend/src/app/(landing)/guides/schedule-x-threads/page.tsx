import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "schedule twitter thread", "schedule a thread on x", "how to schedule
// threads on twitter" and "x thread scheduler". Every behaviour described here
// is read from the code:
//   - integrations/social/x.provider.ts (maxLength 280 / 4,000 when the
//     Verified flag is set, @Rules 4 images or 1 video, comment() replies with
//     in_reply_to_tweet_id = previous post, reply settings + community only on
//     the first post, draft articles cannot have replies)
//   - dtos/posts/providers-settings/x.dto.ts + new-launch/providers/x/* (who can
//     reply, community URL, Made with AI, Paid partnership, post type)
//   - new-launch/editor.tsx, add.post.button.tsx, delay.component.tsx (Add post,
//     reorder, delete, per-post delay 1m to 2h or custom)
//   - orchestrator post.workflow.v1.1.3.ts (replies posted in order, delay slept,
//     a failed reply stops the rest)
//   - posts.repository.ts countPostsFromDay (every post row counts, replies too)
//   - thread_finisher is registered by the composer but no provider publishes it
// X's own behaviour is cited from help.x.com pages checked on 2026-09-26.
// If any of these change, this page has to change with it.
const CANONICAL = 'https://hookpost.hookstep.in/guides/schedule-x-threads';
const DELAYS = '1, 2, 5, 10, 15 or 30 minutes, 1 or 2 hours, or a custom number of minutes';
const REPLY_OPTIONS = 'Everyone, Accounts you follow, Mentioned accounts, Subscribers or Verified accounts';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const STEPS: { name: string; text: string }[] = [
  {
    name: 'Connect your X account',
    text: 'Click Add Channel and choose X, then approve Hookpost for the account you are logged into on X.',
  },
  {
    name: 'Write the first post',
    text: 'Create a post and select your X channel. The counter under the editor shows how much of the 280-character limit you have used.',
  },
  {
    name: 'Add the rest of the thread',
    text: 'Click Add post under the last box to add the next post. Repeat for every post in the thread. Use the arrows beside a post to move it up or down, and the bin icon to delete it.',
  },
  {
    name: 'Space the replies out, if you want',
    text: `Every post after the first has a delay control. Leave it empty to post the whole thread back to back, or wait ${DELAYS} before that post goes out.`,
  },
  {
    name: 'Set who can reply',
    text: `Open Settings for the X channel and choose who can reply: ${REPLY_OPTIONS}. You can also paste an X community URL here.`,
  },
  {
    name: 'Pick a time and schedule',
    text: 'Set the date and time and click Add to calendar. Hookpost checks every post in the thread against the limit first, then publishes from its servers at that time.',
  },
];

const FAQ = [
  {
    q: 'Can X schedule a thread by itself?',
    a: "X's Help Center explains scheduling a single post from the calendar icon in the compose box, and says Media Studio cannot create threads and schedules one post at a time. None of those pages describes scheduling a whole thread. Hookpost schedules the first post and every reply together.",
  },
  {
    q: 'Will the posts show up as a real thread?',
    a: 'Yes. Hookpost posts the first tweet, then sends each next post as a reply to the one before it. On X that is a normal connected thread from your account.',
  },
  {
    q: 'How long can each post in the thread be?',
    a: '280 characters, counted the way X counts them: a link counts as 23 characters and most emoji count as 2. If Verified is switched on for the channel in Additional Settings, Hookpost allows 4,000.',
  },
  {
    q: 'Can I post the replies over an hour instead of all at once?',
    a: `Yes. Set a delay on each follow-up post: ${DELAYS}. Hookpost waits that long after the previous post before sending it.`,
  },
  {
    q: 'Is scheduling X threads free?',
    a: `Yes. X is on the Free plan: ${FREE.channel} channels and ${FREE.posts_per_month} posts a month for ${inr(0)}. Each post in a thread counts as one post. Standard is ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels and ${STANDARD.posts_per_month} posts.`,
  },
];

export const metadata: Metadata = {
  title: 'How to Schedule a Thread on X (Twitter) | Hookpost',
  description:
    'Schedule a whole X (Twitter) thread: write every post, add images, space replies out, choose who can reply and publish at a set time. Free plan included.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'How to schedule a thread on X (Twitter) - Hookpost',
    description: 'Write every post of the thread, set a delay between replies, pick who can reply and schedule it. Posts are chained as real replies.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Schedule X threads with Hookpost' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to schedule a thread on X (Twitter) - Hookpost',
    description: 'Write every post of the thread, set a delay between replies and schedule it.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function ScheduleXThreadsGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${CANONICAL}#article`,
        headline: 'How to schedule a thread on X (Twitter)',
        url: CANONICAL,
        inLanguage: 'en',
        dateModified: '2026-09-26',
        author: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        publisher: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        about: [{ '@type': 'Thing', name: 'X (Twitter)' }],
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
          { '@type': 'ListItem', position: 3, name: 'Schedule X threads', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Guide · X (Twitter)</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          How to schedule a thread on X (Twitter)
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          In Hookpost you write the whole thread in one place, set a time, and it goes out as a real X thread: the first post, then each
          next post as a reply to the one before. Every post can carry its own images or video, and you can space the replies out over
          minutes or hours.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Schedule a thread free
          </Link>
          <Link href="/tools/thread-splitter" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Split long text into posts
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What X lets you schedule on its own</h2>
        <p className="mt-6 max-w-[70ch] text-white/75">
          X&apos;s Help Center describes scheduling one post: select the calendar icon in the compose box, pick a date and time, and
          confirm (
          <a href="https://help.x.com/en/using-x/how-to-post" className="text-[#FF4CE2] underline" rel="noopener">How to post</a>). Its
          Media Studio FAQ says threads with multiple posts are not supported there and you can schedule one post at a time per account (
          <a href="https://help.x.com/en/using-x/media-studio-faqs" className="text-[#FF4CE2] underline" rel="noopener">Media Studio FAQ</a>
          ), and the Premium page says longer posts cannot yet be scheduled (
          <a href="https://help.x.com/en/using-x/x-premium-how-to" className="text-[#FF4CE2] underline" rel="noopener">X Premium</a>).
          None of these pages describes scheduling a whole thread.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What each post in the thread can contain</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">280 characters, counted like X.</strong> A link counts as 23 and most emoji as 2. Check a draft
              with the <Link href="/tools/x-character-counter" className="text-[#FF4CE2] underline">X character counter</Link>.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">4,000 on Premium.</strong> Hookpost reads the Verified flag from X when you connect. If it is on
              (you can change it in the channel&apos;s Additional Settings), each post can be up to 4,000 characters.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Up to 4 images or 1 video per post.</strong> Each post in the thread gets its own media, uploaded
              to X before that post is sent.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Checked before it is queued.</strong> Every post is measured against the limit when you schedule,
              and an over-length post is flagged with the channel name.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Schedule an X thread step by step</h2>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            {STEPS.map((s) => (
              <li key={s.name}>
                <strong className="text-white">{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-white/60">
            Have the thread as one long draft already? Paste it into the{' '}
            <Link href="/tools/thread-splitter" className="text-[#FF4CE2] underline">thread splitter</Link> to cut it into numbered posts that
            fit, then paste each one into its own box. The X settings also include Made with AI and Paid partnership labels, and a Post type
            switch for long-form X Articles.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Limitations to know first</h2>
          <ul className="mt-6 flex flex-col gap-3 max-w-[70ch] text-white/75 list-disc ps-6">
            <li>
              <strong className="text-white">Reply settings and community apply to the first post.</strong> Who can reply and the community
              URL are set on the opening post. The replies in the thread are sent without them.
            </li>
            <li>
              <strong className="text-white">A failed post stops the thread.</strong> If X rejects one post, for example for duplicate text,
              the posts before it stay live and the rest are not sent. Hookpost shows the reason in a notification.
            </li>
            <li>
              <strong className="text-white">4,000 is the Premium cap in Hookpost.</strong> X allows longer posts on Premium, but Hookpost
              stops at 4,000 characters per post.
            </li>
            <li>
              <strong className="text-white">Draft articles cannot have replies.</strong> When Post type is Article and it is saved as a
              draft, remove the follow-up posts or set it to publish.
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
            Full X specs: <Link href="/channels/x" className="text-[#FF4CE2] underline">X channel page</Link>. Posting the same thread to
            Bluesky too? See <Link href="/guides/cross-post-x-bluesky" className="text-[#FF4CE2] underline">cross-post to X and Bluesky</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
