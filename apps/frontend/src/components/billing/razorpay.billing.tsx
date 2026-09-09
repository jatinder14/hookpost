'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useT } from '@hookpost/react/translation/get.transation.service.client';
import { Button } from '@hookpost/react/form/button';
import { LoadingComponent } from '@hookpost/frontend/components/layout/loading';
import { CURRENCY_SYMBOL } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Loads Razorpay's checkout.js once per page and resolves when it is ready.
 * Concurrent callers share the same in-flight load.
 */
let scriptPromise: Promise<boolean> | null = null;
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SCRIPT}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface RazorpayCheckoutOptions {
  /** Razorpay subscription id created server-side. */
  subscriptionId: string;
  keyId?: string;
  currency?: string;
  /** Human-readable amount, shown in the modal's description line. */
  amountLabel?: string;
  /** POSTs /razorpay/verify. Passed in so this stays free of React hooks. */
  verify: (response: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }) => Promise<void>;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

/**
 * Opens Razorpay's in-page Checkout modal for an existing subscription.
 *
 * This is the only payment surface we should ever send a customer to. The
 * alternative - redirecting to the `short_url` Razorpay returns with the
 * subscription - goes to Razorpay's hosted subscription page, and on 2026-09-08
 * that page answered "Hosted page is not available. Please contact the merchant
 * for further details." for every plan on this account. The /billing plans grid
 * used it and so had no working path to payment at all, which is what Razorpay's
 * own onboarding review was asking us to fix. Checkout.js does not depend on
 * that page.
 *
 * Returns false when checkout.js could not load, so the caller can decide what
 * to do rather than being silently redirected somewhere broken.
 */
export async function openRazorpayCheckout(
  opts: RazorpayCheckoutOptions
): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay || !opts.subscriptionId) {
    return false;
  }

  const rzp = new window.Razorpay({
    key: opts.keyId,
    subscription_id: opts.subscriptionId,
    name: 'HookStep',
    description: opts.amountLabel,
    image: 'https://hookpost.hookstep.in/brand-logo.png',
    currency: opts.currency || 'INR',
    theme: {
      color: '#FF4CE2',
    },
    handler: async (response: any) => {
      try {
        // The webhook is authoritative for entitlements; this call just lets us
        // fail fast in the UI if the handshake is bad.
        await opts.verify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature,
        });
        opts.onSuccess?.();
        window.location.reload();
      } catch (e) {
        opts.onError?.(
          'We could not confirm the payment. If you were charged, it will apply shortly.'
        );
      }
    },
    modal: {
      ondismiss: () => opts.onClose?.(),
    },
  });

  rzp.on('payment.failed', (resp: any) => {
    opts.onClose?.();
    opts.onError?.(
      resp?.error?.description || 'Payment failed. Please try again.'
    );
  });

  rzp.open();
  return true;
}

export const RazorpayBilling: FC<{
  /** Razorpay subscription id created server-side. */
  subscriptionId?: string;
  /** Hosted-checkout fallback URL, used when checkout.js cannot load. */
  url?: string;
  keyId?: string;
  currency?: string;
  amountLabel?: string;
  allowTrial?: boolean;
  onSuccess?: () => void;
}> = ({ subscriptionId, url, keyId, currency, amountLabel, allowTrial, onSuccess }) => {
  const t = useT();
  const fetch = useFetch();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRazorpayScript().then(setReady);
  }, []);

  const pay = useCallback(async () => {
    setError(null);
    setBusy(true);

    const opened = await openRazorpayCheckout({
      subscriptionId: subscriptionId!,
      keyId,
      currency,
      amountLabel,
      verify: async (payload) => {
        await fetch('/razorpay/verify', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      },
      onSuccess,
      onError: (message) => {
        setBusy(false);
        setError(message);
      },
      onClose: () => setBusy(false),
    });

    if (opened) {
      return;
    }

    // checkout.js blocked or offline. The hosted page is the only thing left,
    // and it has been known to be unavailable on this account - so say so
    // rather than dropping the customer on an error screen with no context.
    setBusy(false);
    if (url) {
      window.location.href = url;
      return;
    }
    setError(
      t('billing_checkout_unavailable', 'Checkout is currently unavailable.')
    );
  }, [subscriptionId, keyId, currency, url, amountLabel, onSuccess]);

  if (!ready && !url) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-[16px] mt-[24px]">
      <Button onClick={pay} loading={busy} disabled={busy}>
        {allowTrial
          ? `Start 7-Day Free Trial (₹0 Today, then ${amountLabel || '₹699'})`
          : amountLabel
          ? `${t('billing_subscribe_for', 'Subscribe for')} ${amountLabel}`
          : t('billing_subscribe', 'Subscribe')}
      </Button>
      <div className="flex justify-center items-center gap-2 mt-1">
        <a
          href="/launches"
          className="text-[14px] text-[#A0A0B0] hover:text-white underline cursor-pointer transition-colors"
        >
          Or continue with Free Plan ($0/month) →
        </a>
      </div>
      {error ? (
        <div className="text-[14px] text-red-400" role="alert">
          {error}
        </div>
      ) : null}
      <div className="text-[11px] text-customColor18/90 bg-white/5 border border-white/10 rounded-lg p-2.5 leading-relaxed text-center">
        💡 <strong>Note:</strong> Per RBI guidelines, a temporary ₹5.00 refundable auth check is done to set up UPI Autopay and is refunded to your account immediately.
      </div>
      <div className="text-[12px] text-customColor18 text-center">
        {t('billing_powered_by_razorpay', 'Secure payments processed by')}{' '}
        Razorpay (UPI, NetBanking, Cards)
      </div>
    </div>
  );
};
