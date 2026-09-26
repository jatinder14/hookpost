import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "schedule discord messages", "discord message scheduler", "schedule
// discord announcements", "discord scheduled message bot" and "schedule discord
// integration". Every behaviour described here is read from the code:
//   - discord.provider.ts (OAuth scopes, bot permissions, channel types,
//     1,980-char limit, attachments, thread replies, mentions, errors)
//   - dtos/posts/providers-settings/discord.dto.ts (channel is the only setting)
//   - new-launch/providers/discord/* (channel picker, max characters)
//   - launches/repeat.component.tsx + post workflow (repeat intervals apply to
//     every provider, Discord included)
// If the provider changes, this page has to change with it.
const CANONICAL = 'https://hookpost.hookstep.in/guides/schedule-discord-announcements';
const MAX_CHARS = '1,980';
const REPEAT_OPTIONS = 'every day, every 2 to 6 days, every week, every two weeks, or every 30 days';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const STEPS: { name: string; text: string }[] = [
  {
    name: 'Add Discord as a channel',
    text: 'In Hookpost, click Add Channel and choose Discord. Discord opens its authorisation screen, where you pick the server and approve the Hookpost bot.',
  },
  {
    name: 'Write the message',
    text: `Create a post and select your Discord server. Write up to ${MAX_CHARS} characters in Markdown, and attach images or other files if you need them.`,
  },
  {
    name: 'Pick the channel',
    text: 'In the Discord settings for the post, choose the text or announcement channel from the Select Channel list. The post cannot be scheduled without one.',
  },
  {
    name: 'Choose a date and time, and optionally a repeat',
    text: `Set when it should go out. To post it again automatically, open Repeat Post Every and choose ${REPEAT_OPTIONS}.`,
  },
  {
    name: 'Add it to the calendar',
    text: 'Hookpost sends the message at that time from its servers, so your computer does not need to be on. Once it is sent, Hookpost keeps a link to the published Discord message.',
  },
];

const FAQ = [
  {
    q: 'Can Discord schedule messages on its own?',
    a: 'Discord has scheduled events, but no built-in way to schedule a normal channel message. You need a bot. Hookpost connects its bot to your server and sends the message at the time you set.',
  },
  {
    q: 'Do I need to be a server admin?',
    a: 'You need permission to add bots to the server, which Discord gives to members with Manage Server (owners and admins have it). If the server does not appear in the authorisation screen, ask an admin to connect it.',
  },
  {
    q: 'How long can a scheduled Discord message be?',
    a: `${MAX_CHARS} characters. Hookpost checks the length in the composer before the post is queued, so an over-length message is caught before it is scheduled.`,
  },
  {
    q: 'Can I schedule recurring Discord announcements?',
    a: `Yes. Use Repeat Post Every on the post and choose ${REPEAT_OPTIONS}. Repeat works the same way for Discord as for every other network.`,
  },
  {
    q: 'Can I post to a Discord forum channel?',
    a: 'Not reliably. Forum channels show up in the channel list, but Hookpost sends an ordinary channel message and does not create a forum post, which is what a forum channel expects. Use a text or announcement channel.',
  },
  {
    q: 'Is scheduling Discord messages free?',
    a: `Yes. Discord is available on the Free plan: ${FREE.channel} channels and ${FREE.posts_per_month} posts a month for ${inr(0)}. Standard is ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels.`,
  },
];

export const metadata: Metadata = {
  title: 'Schedule Discord Messages & Announcements | Hookpost',
  description: `Schedule Discord messages and announcements with the Hookpost bot: pick a channel, attach files, mention roles and repeat posts daily or weekly.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'How to schedule Discord messages and announcements - Hookpost',
    description: 'Invite the bot, pick a channel, write up to 1,980 characters and set a time. Repeats and thread replies included.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Schedule Discord messages with Hookpost' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to schedule Discord messages and announcements - Hookpost',
    description: 'Invite the bot, pick a channel, write up to 1,980 characters and set a time.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function ScheduleDiscordGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${CANONICAL}#article`,
        headline: 'How to schedule Discord messages and announcements',
        url: CANONICAL,
        inLanguage: 'en',
        dateModified: '2026-09-26',
        author: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        publisher: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        about: [{ '@type': 'Thing', name: 'Discord' }],
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
          { '@type': 'ListItem', position: 3, name: 'Schedule Discord announcements', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Guide · Discord</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          How to schedule Discord messages and announcements
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Discord cannot schedule a channel message by itself, so you need a bot. Hookpost&apos;s bot joins your server, and you write the
          message, pick the channel and set a time on one calendar. Messages can be up to <strong className="text-white">{MAX_CHARS} characters</strong>{' '}
          with file attachments, and can repeat on a schedule.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Connect Discord free
          </Link>
          <Link href="/channels/discord" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Discord channel details
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">How the Discord bot connects</h2>
        <p className="mt-6 max-w-[70ch] text-white/75">
          Connecting runs Discord&apos;s own OAuth flow. You choose one server, and Discord adds the Hookpost bot to it. Discord only lists
          servers where you are allowed to add bots, which means the Manage Server permission. In practice that means the owner or an admin.
          Each server you connect counts as one Hookpost channel.
        </p>
        <p className="mt-4 max-w-[70ch] text-white/75">
          The invite asks for four permissions: Send Messages, Send Messages in Threads, and Create Public and Private Threads. Everything
          Hookpost publishes is sent by that bot, so it has to stay in the server and be able to see and post in the channel you choose.
          You can rename the bot in your server from the channel menu in Hookpost (Change Bot Nickname).
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Private channels.</strong> If a channel is hidden from the bot&apos;s role, the post fails with
            &quot;Bot doesn&apos;t have access to this channel&quot;. Add the bot&apos;s role to the channel first.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Files and @everyone.</strong> The invite does not request Attach Files or Mention @everyone. If
            your server does not already grant those to the bot&apos;s role, grant them, or attachments fail and @everyone will not ping.
          </li>
        </ul>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What a scheduled Discord message can contain</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-white/80">
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Up to {MAX_CHARS} characters of Markdown.</strong> The composer counts as you type and blocks a
              longer message before it is queued.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Attachments.</strong> Images and other files are uploaded to Discord as real attachments on the
              message, not pasted as links. Discord&apos;s own file-size limit applies, and a file over it fails with a clear error.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Mentions.</strong> Type @ to search members and roles on the server, plus @here and @everyone.
              They are converted to real Discord mentions when the message is sent.
            </li>
            <li className="rounded-2xl border border-white/10 p-5">
              <strong className="text-white">Follow-ups in a thread.</strong> Add comments to the post and Hookpost opens a thread on the
              original message and posts them inside it, so the channel shows one announcement.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Schedule a Discord message step by step</h2>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            {STEPS.map((s) => (
              <li key={s.name}>
                <strong className="text-white">{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-white/60">
            The same post can go to X, LinkedIn, Telegram or Slack at the same time. Each network gets its own settings and length check. See
            the <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">free social media scheduler</Link> for everything
            the Free plan covers.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Limitations to know first</h2>
          <ul className="mt-6 flex flex-col gap-3 max-w-[70ch] text-white/75 list-disc ps-6">
            <li>
              <strong className="text-white">Forum channels.</strong> They appear in the channel list, but Hookpost sends a plain channel message
              and does not create forum posts. Use a text or announcement channel.
            </li>
            <li>
              <strong className="text-white">Announcement channels are not auto-published.</strong> The message is posted in the channel, but
              Hookpost does not press Publish, so servers that follow your announcement channel do not receive it until someone does.
            </li>
            <li>
              <strong className="text-white">One channel per post.</strong> Each post goes to a single channel on a single server. To reach two
              channels, create a second post.
            </li>
            <li>
              <strong className="text-white">No embeds.</strong> Hookpost sends text and attachments, not custom embed cards. Discord still shows
              its normal link previews.
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
            Full Discord specs:{' '}
            <Link href="/channels/discord" className="text-[#FF4CE2] underline">Discord channel page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
