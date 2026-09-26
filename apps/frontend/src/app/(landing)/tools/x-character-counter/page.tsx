import { Metadata } from 'next';
import Link from 'next/link';
import { SingleNetworkCounter } from '../_lib/single-counter';
import { Rules, SITE, ToolPage, toolJsonLd, type Faq } from '../_lib/tool-page';

// Targets "twitter character counter", "x character counter", "tweet length
// checker". Rules verified against docs.x.com/fundamentals/counting-characters
// and help.x.com (Premium longer posts, 25,000) on 2026-09-26.
const CANONICAL = `${SITE}/tools/x-character-counter`;

const FAQ: Faq[] = [
  {
    q: 'What is the character limit on X (Twitter)?',
    a: '280 characters for a standard post. X Premium subscribers can write longer posts of up to 25,000 characters, which anyone can read but only Premium accounts can create.',
  },
  {
    q: 'How does X count links?',
    a: 'Every link is wrapped in X\'s t.co shortener and counts as 23 characters, whether the original URL is 15 characters or 200.',
  },
  {
    q: 'Do emoji count as two characters on X?',
    a: 'Yes. Every emoji counts as 2, including emoji with a skin tone and combined emoji such as a family, even though those are built from several code points.',
  },
  {
    q: 'Why does Hindi or Japanese text use up the limit differently?',
    a: 'X counts Latin letters, digits, punctuation and Devanagari as 1 per code point, so a Hindi vowel sign counts as its own character: नमस्ते is 6. Chinese, Japanese and Korean characters count as 2 each, so a post in those scripts fits about 140 characters.',
  },
  {
    q: 'Do photos, videos or @mentions count toward the 280?',
    a: 'Attached photos and videos count as 0. The @mentions X adds automatically at the start of a reply do not count; any @mention you type yourself counts like normal text.',
  },
];

export const metadata: Metadata = {
  title: 'X (Twitter) Character Counter: Tweet Length Checker',
  description:
    'Free X character counter that counts like X does: links as 23, emoji as 2, CJK as 2. See what is left of 280 and the 25,000 Premium limit as you type.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free X (Twitter) character counter',
    description: 'Counts links as 23 and emoji as 2, the way X does. Shows 280 and the 25,000 Premium limit.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'X character counter' }],
  },
};

export default function XCharacterCounterPage() {
  return (
    <ToolPage
      jsonLd={toolJsonLd({ canonical: CANONICAL, toolName: 'X (Twitter) character counter', crumb: 'X character counter', faq: FAQ })}
      h1="X (Twitter) character counter"
      intro={
        <p>
          Check a tweet&apos;s length before you post it. This counter uses X&apos;s own weighting, so links, emoji and CJK
          text are counted the way X counts them, and anything past 280 is highlighted.
        </p>
      }
      tool={<SingleNetworkCounter network="x" />}
      howTitle="How X counts characters"
      how={
        <Rules
          items={[
            <>A standard post allows <strong className="text-white">280</strong> weighted characters. X Premium allows <strong className="text-white">25,000</strong>.</>,
            <>Every link counts as <strong className="text-white">23</strong>, however long it is, because X shortens it with t.co. This tool detects links that start with http:// or https://.</>,
            <>Every emoji counts as <strong className="text-white">2</strong>, including skin-tone and combined emoji.</>,
            <>Latin letters, digits, common punctuation and Indian scripts such as Devanagari count as <strong className="text-white">1</strong> per code point.</>,
            <>Chinese, Japanese, Korean and most other scripts count as <strong className="text-white">2</strong> per character.</>,
            <>Attached media counts as 0. Text is normalised (Unicode NFC) before counting, as X does.</>,
          ]}
        />
      }
      cta={
        <p>
          Over the limit? Break it into a thread with the{' '}
          <Link href="/tools/thread-splitter" className="text-[#FF4CE2] underline">thread splitter</Link>, then{' '}
          <Link href="/channels/x" className="text-[#FF4CE2] underline">schedule the thread with Hookpost</Link>. Checking
          other networks too? Use the{' '}
          <Link href="/tools/character-counter" className="text-[#FF4CE2] underline">all-network character counter</Link> or{' '}
          <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">schedule posts free</Link>.
        </p>
      }
      faq={FAQ}
    />
  );
}
