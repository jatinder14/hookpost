import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from './contact-form';

// There was no contact page at all - /contact 307'd to the login screen. The
// support address existed only inside the terms, privacy and data-deletion
// pages, which is not where anyone looks for it.
export const metadata: Metadata = {
  title: 'Contact Hookpost | Support & Sales',
  description:
    'Get in touch with the Hookpost team at support@hookstep.in — support, billing, self-hosting, API access, and press.',
  alternates: { canonical: 'https://hookpost.hookstep.in/contact' },
};

const SUPPORT_EMAIL = 'support@hookstep.in';
const LINKEDIN = 'https://www.linkedin.com/company/hookpost';

const REASONS = [
  {
    title: 'Support',
    body: 'A channel that will not connect, a post that did not publish, anything behaving oddly. Include the channel and the scheduled time and we can find it in the logs.',
  },
  {
    title: 'Billing',
    body: 'Invoices, plan changes, refunds, or UPI and card payment questions. Billing runs through Razorpay.',
  },
  {
    title: 'Self-hosting & source',
    body: 'Hookpost is licensed under AGPL-3.0. The public source release is not out yet, so ask here and we will share the repository.',
  },
  {
    title: 'API & partnerships',
    body: 'Building on the public API, OAuth for your own users, or something we have not thought of.',
  },
];

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Hookpost',
    url: 'https://hookpost.hookstep.in/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Hookpost',
      legalName: 'JR Consulting Co.',
      email: SUPPORT_EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '221 Arya Samaj Gali, Sujanpur',
        addressLocality: 'Pathankot',
        addressRegion: 'Punjab',
        postalCode: '145023',
        addressCountry: 'IN',
      },
      sameAs: [LINKEDIN],
      contactPoint: {
        '@type': 'ContactPoint',
        email: SUPPORT_EMAIL,
        contactType: 'Customer Support',
        availableLanguage: ['English', 'Hindi', 'Punjabi'],
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-dm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-[900px] px-5 py-20 sm:px-10 sm:py-28">
        <Link
          href="/"
          className="text-sm text-white/50 transition-colors hover:text-[#FF4CE2]"
        >
          ← Hookpost
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl text-balance">
          Talk to us
        </h1>
        <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-white/60">
          One inbox, read by the people who build Hookpost. We reply in English,
          Hindi or Punjabi.
        </p>

        {/* primary contact */}
        <div className="mt-12 rounded-2xl border border-[#FF4CE2]/30 bg-[#FF4CE2]/[0.06] p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
            Email us
          </span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-3 block break-words text-2xl font-bold font-jakarta hover:underline sm:text-3xl"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-4 text-[15px] text-white/60">
            Support, billing, self-hosting and partnerships all go here.
          </p>
        </div>

        {/* Razorpay's banking partners require a complete Indian operating
            address - street, city, state and PIN - to be published on the site
            before they will enable payment methods. It was on none of our
            pages, which held up 19 netbanking requests. It is also the address
            on our GST and IEC registrations, so it must match those exactly. */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-white/50">
            Registered office
          </span>
          <address className="mt-3 not-italic text-[15px] leading-relaxed text-white/70">
            JR Consulting Co.
            <br />
            221 Arya Samaj Gali, Sujanpur
            <br />
            Pathankot, Punjab 145023
            <br />
            India
          </address>
          <p className="mt-4 text-[15px] text-white/50">
            Hookpost is an online service and this office does not take walk-in
            visitors. Please use email or the form below.
          </p>
        </div>

        {/* The form. The email address above stays as the fallback for anyone
            who would rather use their own client. */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h2 className="text-xl font-bold font-jakarta">Or write to us here</h2>
          <p className="mt-2 mb-7 text-[15px] text-white/60">
            Goes to the same inbox. We reply to the address you give.
          </p>
          <ContactForm />
        </div>

        {/* what to write about */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold font-jakarta">What we can help with</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="font-bold font-jakarta">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* elsewhere */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold font-jakarta">Elsewhere</h2>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-6 py-4 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="font-semibold">LinkedIn</span>
              <span className="text-sm text-white/50">
                /company/hookpost&nbsp;↗
              </span>
            </a>
            <Link
              href="/about"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-6 py-4 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="font-semibold">About the company</span>
              <span className="text-sm text-white/50">JR Consulting Co.</span>
            </Link>
            <Link
              href="/docs/public-api"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-6 py-4 transition-colors hover:border-[#FF4CE2]/40"
            >
              <span className="font-semibold">API reference</span>
              <span className="text-sm text-white/50">For developers</span>
            </Link>
          </div>
        </div>

        {/* legal-adjacent, kept plain */}
        <div className="mt-14 border-t border-white/10 pt-8 text-[15px] leading-relaxed text-white/50">
          <p>
            Hookpost is operated by <strong className="text-white/70">JR Consulting Co.</strong>{' '}
            To delete your account and data, follow the steps on the{' '}
            <Link href="/data-deletion" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              data deletion
            </Link>{' '}
            page. Our{' '}
            <Link href="/privacy" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              privacy policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">
              terms
            </Link>{' '}
            set out how we handle your data.
          </p>
        </div>
      </div>
    </div>
  );
}
