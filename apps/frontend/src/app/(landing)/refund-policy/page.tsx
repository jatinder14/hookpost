import { Metadata } from 'next';
import Link from 'next/link';

// Razorpay's page-compliance check requires four distinct URLs: terms, privacy,
// refund and cancellation. The refund terms already existed inside /terms, but
// there was no dedicated page, and /refund-policy was not in proxy.ts's
// allowlist so it 307'd to /auth. This page restates the existing policy
// verbatim in substance - it does not introduce new commercial terms.
export const metadata: Metadata = {
  title: 'Refund Policy | Hookpost',
  description:
    'Hookpost refund policy: subscription fees, billing cycles, and how refunds are handled for the Hookpost social media scheduling service.',
  alternates: { canonical: 'https://hookpost.hookstep.in/refund-policy' },
};

const SUPPORT_EMAIL = 'support@hookstep.in';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-dm">
      <div className="mx-auto w-full max-w-[820px] px-5 py-20 sm:px-10 sm:py-28">
        <Link
          href="/"
          className="text-sm text-white/50 transition-colors hover:text-[#FF4CE2]"
        >
          ← Hookpost
        </Link>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight font-jakarta sm:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-4 text-[15px] text-white/50">
          Operated by JR Consulting Co. Last updated 8 September 2026.
        </p>

        <div className="mt-12 space-y-8 text-[16px] leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              Free plan
            </h2>
            <p className="mt-3">
              Hookpost has a free tier that does not expire and needs no card.
              Nothing is charged on it, so nothing is refundable. You can
              evaluate the product on the free plan for as long as you like
              before paying anything.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              Paid subscriptions
            </h2>
            <p className="mt-3">
              Subscription fees are non-refundable once an active billing cycle
              has commenced, because compute, storage and third-party API
              allocation are provisioned to your account immediately on payment.
              This is the same term set out in our{' '}
              <Link href="/terms" className="text-[#FF4CE2] hover:underline">
                Terms of Service
              </Link>
              .
            </p>
            <p className="mt-3">
              This does not limit any refund you are entitled to under
              applicable consumer law, which takes precedence over this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              Duplicate and failed charges
            </h2>
            <p className="mt-3">
              If you are charged twice for the same billing period, or charged
              after cancelling, that is an error on our side and we refund it in
              full. Email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#FF4CE2] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              with the payment reference and we will process it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              How refunds are paid
            </h2>
            <p className="mt-3">
              Approved refunds are returned to the original payment method
              through Razorpay. Once we initiate a refund it typically reaches
              your account within 5–7 working days, though the exact time
              depends on your bank or card issuer and is outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              Stopping future charges
            </h2>
            <p className="mt-3">
              Cancelling stops all future recurring charges. See the{' '}
              <Link
                href="/cancellation-policy"
                className="text-[#FF4CE2] hover:underline"
              >
                cancellation policy
              </Link>{' '}
              for how to cancel and what happens to your data.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p>
              Questions about a specific charge? Email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#FF4CE2] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              . Include the payment reference and we will look it up.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
