import { Metadata } from 'next';
import Link from 'next/link';
import { SingleNetworkCounter } from '../_lib/single-counter';
import { Rules, SITE, ToolPage, toolJsonLd, type Faq } from '../_lib/tool-page';

// Targets "bluesky character limit", "bluesky character counter". Limits come
// from the app.bsky.feed.post lexicon (text: maxGraphemes 300, maxLength 3000)
// and atproto.com/specs/lexicon (maxLength is UTF-8 bytes), checked 2026-09-26.
const CANONICAL = `${SITE}/tools/bluesky-character-counter`;

const FAQ: Faq[] = [
  {
    q: 'What is the Bluesky character limit?',
    a: 'A Bluesky post allows 300 characters. Bluesky counts graphemes, meaning what a reader sees as one character, so an emoji counts as 1.',
  },
  {
    q: 'What is a grapheme?',
    a: 'A grapheme is one visible character: a letter, a digit, a punctuation mark or an emoji. A family emoji is built from seven code points but is still one grapheme, so it counts as 1 toward the 300.',
  },
  {
    q: 'Does Bluesky also have a byte limit?',
    a: 'Yes. Post text is also capped at 3,000 bytes of UTF-8. Ordinary text reaches 300 characters long before that, but long emoji sequences can hit it first: a family emoji alone is 25 bytes.',
  },
  {
    q: 'Do links count toward the 300?',
    a: 'Yes, a link counts like any other text in the post. Hookpost posts the link exactly as you write it, so the full URL counts, and a long link is usually the easiest thing to trim.',
  },
  {
    q: 'How do I post something longer than 300 characters on Bluesky?',
    a: 'Split it into a thread of replies. The free thread splitter breaks long text into 300-character posts at sentence boundaries, and Hookpost can publish the result as a Bluesky reply thread.',
  },
];

export const metadata: Metadata = {
  title: 'Bluesky Character Counter: 300 Character Limit',
  description:
    'Free Bluesky character counter. Counts graphemes the way Bluesky does, shows what is left of the 300-character limit and highlights anything past it.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free Bluesky character counter',
    description: 'See what is left of Bluesky\'s 300-character limit as you type, counted the way Bluesky counts.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'Bluesky character counter' }],
  },
};

export default function BlueskyCharacterCounterPage() {
  return (
    <ToolPage
      jsonLd={toolJsonLd({ canonical: CANONICAL, toolName: 'Bluesky character counter', crumb: 'Bluesky character counter', faq: FAQ })}
      h1="Bluesky character counter"
      intro={
        <p>
          Bluesky posts are limited to 300 characters. Type or paste a post to see how many you have left, with anything past
          the limit highlighted.
        </p>
      }
      tool={<SingleNetworkCounter network="bluesky" />}
      howTitle="How Bluesky counts characters"
      how={
        <Rules
          items={[
            <>A post allows <strong className="text-white">300</strong> graphemes: each visible character counts once.</>,
            <>Emoji count as <strong className="text-white">1</strong>, including skin-tone and combined emoji.</>,
            <>Links, @mentions and hashtags count at the length they appear in the text.</>,
            <>Post text is also capped at <strong className="text-white">3,000 bytes</strong> of UTF-8, which only matters for emoji-heavy posts.</>,
          ]}
        />
      }
      cta={
        <p>
          Too long for one post? Split it with the{' '}
          <Link href="/tools/thread-splitter" className="text-[#FF4CE2] underline">thread splitter</Link>, then{' '}
          <Link href="/channels/bluesky" className="text-[#FF4CE2] underline">schedule the thread with Hookpost</Link>. For
          every network at once, use the{' '}
          <Link href="/tools/character-counter" className="text-[#FF4CE2] underline">all-network character counter</Link> or{' '}
          <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">schedule posts free</Link>.
        </p>
      }
      faq={FAQ}
    />
  );
}
