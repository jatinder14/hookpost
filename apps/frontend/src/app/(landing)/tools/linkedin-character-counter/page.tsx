import { Metadata } from 'next';
import Link from 'next/link';
import { SingleNetworkCounter } from '../_lib/single-counter';
import { Rules, SITE, ToolPage, toolJsonLd, type Faq } from '../_lib/tool-page';

// Targets "linkedin character counter", "linkedin post character limit".
// 3,000 is from LinkedIn Help (answer a528176), checked 2026-09-26. The
// "...see more" fold is deliberately not drawn: LinkedIn publishes no figure
// for it, it is cut by lines not characters, and third-party estimates
// disagree (roughly 140 to 210), so any marker would be a guess.
const CANONICAL = `${SITE}/tools/linkedin-character-counter`;

const FAQ: Faq[] = [
  {
    q: 'What is the LinkedIn post character limit?',
    a: 'A LinkedIn post allows up to 3,000 characters, according to LinkedIn\'s help centre. For anything longer, LinkedIn suggests writing an article instead.',
  },
  {
    q: 'Where does LinkedIn cut a post off with "see more"?',
    a: 'LinkedIn does not publish a character count for it. The feed shows the first few lines, so where the cut falls depends on screen width and on your line breaks. Put the point of the post in the first line.',
  },
  {
    q: 'Do spaces and line breaks count toward the 3,000?',
    a: 'Yes. Spaces and line breaks are characters, so a post with lots of short lines uses up the limit faster than it looks.',
  },
  {
    q: 'Does this tool store what I type?',
    a: 'No. The counting runs in your browser and nothing you type is sent to Hookpost.',
  },
];

export const metadata: Metadata = {
  title: 'LinkedIn Character Counter: 3,000 Character Limit',
  description:
    'Free LinkedIn character counter. See how much of the 3,000-character post limit you have left as you type, with any text past the limit highlighted.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'Free LinkedIn character counter',
    description: 'See how much of LinkedIn\'s 3,000-character post limit you have left as you type.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'website',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'LinkedIn character counter' }],
  },
};

export default function LinkedInCharacterCounterPage() {
  return (
    <ToolPage
      jsonLd={toolJsonLd({ canonical: CANONICAL, toolName: 'LinkedIn character counter', crumb: 'LinkedIn character counter', faq: FAQ })}
      h1="LinkedIn character counter"
      intro={
        <p>
          LinkedIn posts allow up to 3,000 characters. Paste your draft to see how much room is left, with anything past the
          limit highlighted so you know exactly what to cut.
        </p>
      }
      tool={<SingleNetworkCounter network="linkedin" />}
      howTitle="How this counter counts"
      how={
        <Rules
          items={[
            <>A LinkedIn post allows <strong className="text-white">3,000</strong> characters.</>,
            <>Every visible character counts once: letters, digits, punctuation, spaces and line breaks.</>,
            <>An emoji counts as one character here, because it shows as one.</>,
            <>Only the first few lines show in the feed before &ldquo;see more&rdquo;, so lead with the point.</>,
          ]}
        />
      }
      cta={
        <p>
          Posting the same update to X or Bluesky as well? Check every network with the{' '}
          <Link href="/tools/character-counter" className="text-[#FF4CE2] underline">all-network character counter</Link>.
          Hookpost lets you write a shorter version per network and{' '}
          <Link href="/free-social-media-scheduler" className="text-[#FF4CE2] underline">schedule posts free</Link>.
        </p>
      }
      faq={FAQ}
    />
  );
}
