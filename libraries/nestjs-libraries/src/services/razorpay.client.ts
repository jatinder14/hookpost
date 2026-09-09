import * as crypto from 'crypto';

const RAZORPAY_BASE = 'https://api.razorpay.com/v1';

export class RazorpayConfigError extends Error {}

/**
 * Thin typed wrapper over the Razorpay REST API.
 *
 * We talk to the REST API directly rather than pulling in the `razorpay` SDK:
 * the SDK ships very loose typings and wraps every response in `any`, which
 * hides exactly the kind of shape drift that breaks billing silently.
 */
export class RazorpayClient {
  private readonly keyId = process.env.RAZORPAY_KEY_ID || '';
  private readonly keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  get configured() {
    return !!(this.keyId && this.keySecret);
  }

  private authHeader() {
    if (!this.configured) {
      throw new RazorpayConfigError(
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      );
    }
    return (
      'Basic ' +
      Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')
    );
  }

  async request<T = any>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    body?: Record<string, any>
  ): Promise<T> {
    const res = await fetch(`${RAZORPAY_BASE}${path}`, {
      method,
      headers: {
        Authorization: this.authHeader(),
        'Content-Type': 'application/json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await res.text();
    const parsed = text ? safeJson(text) : {};

    if (!res.ok) {
      const description =
        parsed?.error?.description || parsed?.error?.reason || text;
      throw new Error(
        `Razorpay ${method} ${path} failed (${res.status}): ${description}`
      );
    }
    return parsed as T;
  }

  /**
   * Verify a Razorpay webhook. Razorpay signs the *raw* request body with the
   * webhook secret (which is distinct from the API key secret), so the caller
   * must hand us the untouched Buffer -- re-serialising the parsed JSON will
   * not reproduce the same bytes and the check will fail.
   */
  verifyWebhook(rawBody: Buffer | string, signature: string, secret: string) {
    if (!secret) {
      throw new RazorpayConfigError(
        'RAZORPAY_WEBHOOK_SECRET is not set; refusing to trust webhook.'
      );
    }
    if (!signature) {
      throw new Error('Missing x-razorpay-signature header.');
    }
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    // timingSafeEqual throws on length mismatch, so gate on it first.
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new Error('Invalid Razorpay webhook signature.');
    }
    return true;
  }

  /**
   * Verify the handshake returned by Razorpay Checkout for a subscription.
   * Note the operand order here is (subscription_id + '|' + payment_id), which
   * is the reverse of the order used for one-off orders. Getting this backwards
   * yields a valid-looking HMAC that never matches.
   */
  verifySubscriptionPayment(
    subscriptionId: string,
    razorpayPaymentId: string,
    signature: string
  ) {
    const expected = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${razorpayPaymentId}|${subscriptionId}`)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature || '', 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
