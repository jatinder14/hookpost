import { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '../../site-nav';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Targets "cross post dev.to hashnode", "publish to dev.to and hashnode at
// once", "schedule dev.to posts", "crosspost blog to dev.to" and "canonical url
// dev.to hashnode". Every behaviour described here is read from the code:
//   - integrations/social/{dev.to,hashnode,wordpress}.provider.ts (how each
//     connects, what is sent, always-published vs status, error messages)
//   - dtos/posts/providers-settings/{dev.to.settings,hashnode.settings,wordpress}.dto.ts
//     (required fields, minimum title lengths, tag counts, canonical validation)
//   - new-launch/providers/{devto,hashnode,wordpress}/* (composer fields and
//     maximum characters: 100,000 / 10,000 / 100,000)
//   - react-shared-libraries/form/canonical.tsx + posts.service.ts updateTags
//     (the post picker stores "(post:id)" and swaps in that post's releaseURL
//     at publish time, or an empty string if it has none yet)
// Medium: help.medium.com/hc/en-us/articles/213480228-API-Importing says no new
// integration tokens; the 1 Jan 2025 date is from integrators (Hyve Labs help).
// If a provider changes, this page has to change with it.
const CANONICAL = 'https://hookpost.hookstep.in/guides/cross-post-dev-articles';
const MEDIUM_HELP = 'https://help.medium.com/hc/en-us/articles/213480228-API-Importing';

const FREE = pricingINR.FREE;
const STANDARD = pricingINR.STANDARD;
const inr = (v: number) => `₹${v.toLocaleString('en-IN')}`;

const SETTINGS: [string, string, string, string][] = [
  ['Title', 'Required, 2+ characters', 'Required, 6+ characters', 'Required, 2+ characters (also becomes the slug)'],
  ['Subtitle', '-', 'Optional', '-'],
  ['Canonical URL', 'Yes', 'Yes (sent as the original article URL)', 'No field'],
  ['Cover image', 'Yes', 'Yes', 'Yes, uploaded as the featured image'],
  ['Tags', 'Up to 4, from Dev.to’s tag list', '1 to 4, required', 'Optional, from your site’s tags'],
  ['Categories', '-', '-', 'Optional'],
  ['Where it goes', 'Your profile or an organisation', 'A publication (required)', 'A post type (required)'],
  ['Status', 'Always published', 'Always published', 'Publish, draft, pending or private'],
  ['Format', 'Markdown', 'Markdown', 'HTML'],
  ['Length', '100,000 characters', '10,000 characters', '100,000 characters'],
];

const STEPS: { name: string; text: string }[] = [
  {
    name: 'Schedule the original first',
    text: 'Create the WordPress post, choose the post type, status, categories and cover image, and set a time, for example 09:00. This is the version search engines should treat as the original.',
  },
  {
    name: 'Create one post for Dev.to and Hashnode',
    text: 'Start a second post and select both channels. Both use Markdown, so one body works for both. Fill in each channel’s title, tags and cover image, and pick the Hashnode publication.',
  },
  {
    name: 'Point the canonical link at the original',
    text: 'In Canonical Link on each channel, paste the original article’s URL, or click the lightning icon next to the label and pick the WordPress post. Hookpost swaps in that post’s live URL at the moment the copy publishes.',
  },
  {
    name: 'Schedule the copies after the original',
    text: 'Set a later time, such as 09:30. The picker only lists posts dated at or before this one, and if the original has not published yet when the copy goes out, there is no URL to insert and the canonical link is left empty.',
  },
];

const FAQ = [
  {
    q: 'Can I publish to Dev.to and Hashnode at once?',
    a: 'Yes. Select both channels in one post. They share the Markdown body, and each has its own title, tags, cover image and canonical link. The composer checks both length limits before the post is queued, and Hashnode’s 10,000 characters is the tighter one.',
  },
  {
    q: 'Does Hookpost set a canonical URL on Dev.to and Hashnode?',
    a: 'Yes. Dev.to receives it as the article’s canonical URL and Hashnode as the original article URL. WordPress has no canonical field in Hookpost, so publish the original there, or on your own site, and point the other two at it.',
  },
  {
    q: 'Can I schedule a Dev.to or Hashnode article as a draft?',
    a: 'No. Hookpost publishes Dev.to and Hashnode articles live at the scheduled time. Only WordPress lets you choose draft, pending review or private instead of publish.',
  },
  {
    q: 'Why is my Dev.to organisation missing from the list?',
    a: 'Hookpost builds the list from organisations you have already published articles under on Dev.to. If you have never posted under an organisation, publish there once on Dev.to and it will appear.',
  },
  {
    q: 'Can I cross-post to Medium?',
    a: 'Not with a new account. Medium no longer issues API integration tokens. Tokens created earlier still work, but there is no way to get a new one through Hookpost or any other tool.',
  },
  {
    q: 'Is it free?',
    a: `The Free plan includes ${FREE.channel} channels and ${FREE.posts_per_month} posts a month for ${inr(0)}, so it covers two of the three platforms. All three need Standard, ${inr(STANDARD.month_price)} a month for ${STANDARD.channel} channels.`,
  },
];

export const metadata: Metadata = {
  title: 'Cross-Post to Dev.to, Hashnode & WordPress | Hookpost',
  description:
    'Schedule one article to Dev.to, Hashnode and WordPress with a canonical URL, cover image and tags. What each platform supports, read from the code.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'How to cross-post articles to Dev.to, Hashnode and WordPress - Hookpost',
    description: 'Publish the original on WordPress, then schedule Dev.to and Hashnode copies that point back to it with a canonical link.',
    url: CANONICAL,
    siteName: 'Hookpost',
    type: 'article',
    images: [{ url: 'https://hookpost.hookstep.in/og-image.png', width: 1200, height: 630, alt: 'Cross-post articles to Dev.to, Hashnode and WordPress with Hookpost' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to cross-post articles to Dev.to, Hashnode and WordPress - Hookpost',
    description: 'Publish the original on WordPress, then schedule Dev.to and Hashnode copies with a canonical link.',
    images: ['https://hookpost.hookstep.in/og-image.png'],
  },
};

export default function CrossPostDevArticlesGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${CANONICAL}#article`,
        headline: 'How to cross-post articles to Dev.to, Hashnode and WordPress',
        url: CANONICAL,
        inLanguage: 'en',
        dateModified: '2026-09-26',
        author: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        publisher: { '@type': 'Organization', name: 'Hookpost', url: 'https://hookpost.hookstep.in/' },
        about: [
          { '@type': 'Thing', name: 'Dev.to' },
          { '@type': 'Thing', name: 'Hashnode' },
          { '@type': 'Thing', name: 'WordPress' },
          { '@type': 'Thing', name: 'Canonical link' },
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
          { '@type': 'ListItem', position: 3, name: 'Cross-post to Dev.to, Hashnode and WordPress', item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm selection:bg-[#FF4CE2] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <section className="mx-auto w-full max-w-[1100px] px-5 pt-16 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FF4CE2]">Guide · Dev.to · Hashnode · WordPress</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          How to cross-post articles to Dev.to, Hashnode and WordPress
        </h1>
        <p className="mt-5 max-w-[70ch] text-lg text-white/75">
          Hookpost publishes full articles, not status updates, to Dev.to, Hashnode and WordPress, on a schedule. Dev.to and Hashnode both
          accept a <strong className="text-white">canonical URL</strong>, so you can publish the original on your blog and have the copies
          tell search engines where it came from.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth" prefetch={false} className="rounded-full bg-[#FF4CE2] px-6 py-3 font-semibold text-black hover:opacity-90">
            Start free
          </Link>
          <Link href="/channels/devto" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:border-[#FF4CE2]">
            Dev.to channel details
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">How each platform connects</h2>
        <p className="mt-6 max-w-[70ch] text-white/75">
          None of the three use a sign-in popup. You paste credentials once, Hookpost checks them against the platform straight away, and
          they do not need refreshing afterwards. Each connected account counts as one Hookpost channel.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 text-white/80">
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Dev.to.</strong> An API key generated in your Dev.to account settings. Hookpost verifies it by
            reading your profile.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">Hashnode.</strong> A personal access token from Hashnode&apos;s developer settings, pasted into
            the API key field.
          </li>
          <li className="rounded-2xl border border-white/10 p-5">
            <strong className="text-white">WordPress.</strong> Your site URL, username and an Application Password, created under Users
            &rarr; Profile. The account needs permission to create posts.
          </li>
        </ul>
        <p className="mt-6 max-w-[70ch] text-white/60">
          If WordPress rejects the login, check for a security plugin or server setting that blocks the REST API or strips the
          Authorization header, as well as the username and Application Password.
        </p>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Per-article settings on each platform</h2>
          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <caption className="sr-only">Article settings Hookpost supports on Dev.to, Hashnode and WordPress</caption>
              <thead>
                <tr className="border-b border-white/15 text-white/60">
                  <th scope="col" className="py-3 pe-4 font-semibold">Setting</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Dev.to</th>
                  <th scope="col" className="py-3 pe-4 font-semibold">Hashnode</th>
                  <th scope="col" className="py-3 font-semibold">WordPress</th>
                </tr>
              </thead>
              <tbody>
                {SETTINGS.map(([name, dev, hash, wp]) => (
                  <tr key={name} className="border-b border-white/10">
                    <th scope="row" className="py-3 pe-4 font-bold">{name}</th>
                    <td className="py-3 pe-4 text-white/80">{dev}</td>
                    <td className="py-3 pe-4 text-white/80">{hash}</td>
                    <td className="py-3 text-white/80">{wp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[70ch] text-white/70">
            There is no series field on either Dev.to or Hashnode. The Dev.to organisation list only shows organisations you have already
            published under, and the WordPress category and tag lists load the first 100 of each from your site.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">Schedule one article to all three with a canonical link</h2>
          <p className="mt-4 max-w-[70ch] text-white/70">
            WordPress takes HTML and the other two take Markdown, so the original and the copies are two posts on the same calendar.
          </p>
          <ol className="mt-6 flex flex-col gap-4 text-white/80 list-decimal ps-6">
            {STEPS.map((s) => (
              <li key={s.name}>
                <strong className="text-white">{s.name}.</strong> {s.text}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-white/60">
            Dev.to allows each canonical URL on only one of your articles. If you reuse one, the post fails with &quot;Canonical URL already
            exists&quot;.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta text-balance">What about Medium?</h2>
          <p className="mt-6 max-w-[70ch] text-white/75">
            Medium has closed its API to new integrations. Its help centre says it{' '}
            <a href={MEDIUM_HELP} rel="nofollow noopener" target="_blank" className="text-[#FF4CE2] underline">
              will not issue new integration tokens
            </a>
            , and tokens created earlier keep working. A new account cannot connect Medium to Hookpost or to any other scheduler. Medium&apos;s
            own import tool, which copies an existing web page into your account, still works.
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
            Full specs:{' '}
            <Link href="/channels/devto" className="text-[#FF4CE2] underline">Dev.to</Link>,{' '}
            <Link href="/channels/hashnode" className="text-[#FF4CE2] underline">Hashnode</Link>,{' '}
            <Link href="/channels/wordpress" className="text-[#FF4CE2] underline">WordPress</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
