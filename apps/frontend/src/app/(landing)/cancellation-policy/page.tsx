import { Metadata } from 'next';
import Link from 'next/link';

// Fourth of the four URLs Razorpay's page-compliance check requires. The
// substance already existed in /terms ("Subscriptions renew automatically ...
// unless cancelled prior to renewal", "Cancelling stops future recurring
// charges"); this gives it a dedicated, linkable page.
export const metadata: Metadata = {
  title: 'Cancellation Policy | Hookpost',
  description:
    'How to cancel your Hookpost subscription, when cancellation takes effect, and what happens to your scheduled posts and connected channels.',
  alternates: { canonical: 'https://hookpost.hookstep.in/cancellation-policy' },
};

const SUPPORT_EMAIL = 'support@hookstep.in';

export default function CancellationPolicyPage() {
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
          Cancellation Policy
        </h1>
        <p className="mt-4 text-[15px] text-white/50">
          Operated by JR Consulting Co. Last updated 8 September 2026.
        </p>

        <div className="mt-12 space-y-8 text-[16px] leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              How to cancel
            </h2>
            <p className="mt-3">
              Cancel at any time from <strong className="text-white/90">Settings → Billing</strong>{' '}
              inside your account. There is no cancellation fee, no notice
              period, and no need to contact us first. If you would rather we
              did it for you, email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#FF4CE2] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              from the address on the account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              When it takes effect
            </h2>
            <p className="mt-3">
              Subscriptions renew automatically at the end of each billing
              period unless cancelled before renewal. Cancelling stops all
              future recurring charges immediately.
            </p>
            <p className="mt-3">
              You keep paid access until the end of the period you have already
              paid for. We do not cut off access on the day you cancel, and we
              do not refund the remainder of the current period — see the{' '}
              <Link
                href="/refund-policy"
                className="text-[#FF4CE2] hover:underline"
              >
                refund policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              What happens to your content
            </h2>
            <p className="mt-3">
              When the paid period ends your account moves to the free plan
              rather than being deleted. Posts already published stay published
              on the social networks they went to — those are your accounts and
              we have no control over them.
            </p>
            <p className="mt-3">
              Scheduled posts that exceed the free plan&apos;s limits will not
              publish. If you intend to cancel and have posts queued, either
              publish them beforehand or export what you need first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-jakarta text-white">
              Deleting your account entirely
            </h2>
            <p className="mt-3">
              Cancelling a subscription is not the same as deleting your
              account. To remove your account and data, follow the{' '}
              <Link
                href="/data-deletion"
                className="text-[#FF4CE2] hover:underline"
              >
                data deletion
              </Link>{' '}
              process.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p>
              Anything unclear, or a cancellation that did not go through? Email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#FF4CE2] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
