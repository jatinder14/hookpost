// Server-rendered shell shared by the single-network tool pages. Matches the
// layout and styling of tools/character-counter/page.tsx: hero, tool, "how it
// counts", FAQ, related links, plus WebApplication + FAQPage + BreadcrumbList
// JSON-LD.
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';

export const SITE = 'https://hookpost.hookstep.in';

export type Faq = { q: string; a: string };

export const toolJsonLd = (opts: { canonical: string; toolName: string; crumb: string; faq: Faq[] }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${opts.canonical}#tool`,
      name: opts.toolName,
      url: opts.canonical,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      publisher: { '@type': 'Organization', name: 'Hookpost', url: `${SITE}/` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${opts.canonical}#faq`,
      mainEntity: opts.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Character counter', item: `${SITE}/tools/character-counter` },
        { '@type': 'ListItem', position: 3, name: opts.crumb, item: opts.canonical },
      ],
    },
  ],
});

export function ToolPage(props: {
  jsonLd: object;
  h1: string;
  intro: ReactNode;
  tool: ReactNode;
  howTitle: string;
  how: ReactNode;
  faq: Faq[];
  cta: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1200px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Free tool</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">{props.h1}</h1>
        <div className="mt-4 max-w-[70ch] text-lg text-white/70">{props.intro}</div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-10">{props.tool}</section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">{props.howTitle}</h2>
          <div className="mt-6 max-w-[70ch] text-white/70">{props.how}</div>
          <div className="mt-6 max-w-[70ch] text-white/70">{props.cta}</div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Questions</h2>
          <dl className="mt-8 flex flex-col gap-8">
            {props.faq.map((f) => (
              <div key={f.q} className="min-w-0">
                <dt className="text-lg font-bold font-jakarta">{f.q}</dt>
                <dd className="mt-2 max-w-[70ch] text-white/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-10">
          <h2 className="text-xl font-extrabold tracking-tight font-jakarta">More free tools</h2>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {[
              ['Character counter (all networks)', '/tools/character-counter'],
              ['X character counter', '/tools/x-character-counter'],
              ['Bluesky character counter', '/tools/bluesky-character-counter'],
              ['LinkedIn character counter', '/tools/linkedin-character-counter'],
              ['Thread splitter', '/tools/thread-splitter'],
              ['Free social media scheduler', '/free-social-media-scheduler'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block rounded-full border border-white/15 px-4 py-2 text-white/80 hover:border-[#FF4CE2] hover:text-[#FF4CE2]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

// Bulleted rule list used in each page's "how it counts" section.
export function Rules({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-[#FF4CE2]">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
