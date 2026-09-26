import { Metadata } from 'next';
import Link from 'next/link';
import { ThreadSplitter } from './splitter';
import { Rules, SITE, ToolPage, toolJsonLd, type Faq } from '../_lib/tool-page';

// Targets "twitter thread maker", "thread splitter", "split text into tweets".
// Splitting logic is in ../_lib/thread.ts and runs entirely in the browser.
const CANONICAL = `${SITE}/tools/thread-splitter`;

const FAQ: Faq[] = [
  {
    q: 'How does the thread splitter decide where to break?',
    a: 'It fills each post with whole sentences. If one sentence is longer than a post, it breaks between words, and it only cuts inside a word when that single word is longer than a whole post. Paragraph and line breaks are kept.',
  },
  {
    q: 'Does the 1/n numbering count toward the character limit?',
    a: 'Yes. The " 1/5" style suffix is added to every post and counted inside the 280 or 300, so each numbered post is ready to publish as it is.',
  },
  {
    q: 'Which limits does it use for X and Bluesky?',
    a: 'X posts are capped at 280 using X\'s weighted count: links count as 23, emoji and Chinese, Japanese or Korean characters as 2. Bluesky posts are capped at 300 visible characters and 3,000 bytes.',
  },
  {
    q: 'Can I schedule the thread instead of posting it by hand?',
    a: 'Yes. Hookpost publishes X threads and Bluesky reply threads, so you can schedule the whole thread to go out at once.',
  },
  {
    q: 'Is my text sent anywhere?',
    a: 'No. Splitting runs in your browser and nothing you paste is sent to Hookpost.',
  },
];

export const metadata: Metadata = {
  title: 'Thread Splitter: Split Text Into Tweets & Bluesky Posts',
  description:
    'Free thread maker: paste long text and split it into numbered X (280) or Bluesky (300) posts at sentence breaks, with a copy button for every post.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free thread splitter for X and Bluesky',
    description: 'Split long text into numbered X or Bluesky posts at sentence breaks, then copy each post.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'Thread splitter' }],
  },
};

export default function ThreadSplitterPage() {
  return (
    <ToolPage
      jsonLd={toolJsonLd({ canonical: CANONICAL, toolName: 'Thread splitter for X and Bluesky', crumb: 'Thread splitter', faq: FAQ })}
      h1="Thread splitter for X and Bluesky"
      intro={
        <p>
          Paste a long post and get a ready-to-publish thread. Posts break at sentence ends, stay inside the limit including
          the 1/n numbering, and each one has its own copy button.
        </p>
      }
      tool={<ThreadSplitter />}
      howTitle="How the splitter counts"
      how={
        <Rules
          items={[
            <>X: <strong className="text-white">280</strong> per post, weighted the way X counts. Links are 23, emoji are 2, Chinese, Japanese and Korean characters are 2.</>,
            <>Bluesky: <strong className="text-white">300</strong> visible characters per post (an emoji is 1), and no more than 3,000 bytes.</>,
            <>Breaks fall at sentence ends first, then between words. A word is only cut if it is longer than a whole post.</>,
            <>With numbering on, the &ldquo; 1/n&rdquo; suffix is counted inside every post&apos;s limit.</>,
          ]}
        />
      }
      cta={
        <p>
          Schedule the thread with Hookpost on{' '}
          <Link href="/channels/x" className="text-[#FF4CE2] underline">X</Link> or{' '}
          <Link href="/channels/bluesky" className="text-[#FF4CE2] underline">Bluesky</Link>, or{' '}
          <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">start scheduling free</Link>. Need
          to check a single post against every network? Use the{' '}
          <Link href="/tools/character-counter" className="text-[#FF4CE2] underline">all-network character counter</Link>.
        </p>
      }
      faq={FAQ}
    />
  );
}
