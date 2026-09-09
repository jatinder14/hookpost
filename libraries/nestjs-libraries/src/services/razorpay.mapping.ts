/**
 * Pure mapping helpers for Razorpay plan and subscription entities.
 *
 * Deliberately free of NestJS and Prisma imports so it can be reasoned about --
 * and tested -- without standing up the DI graph.
 */

/** Razorpay subscription states in which the customer is currently paying. */
export const LIVE_STATES = [
  'active',
  'authenticated',
  'pending',
  'halted',
  'created',
];

/** States from which a subscription will never bill again. */
const TERMINAL_STATES = ['cancelled', 'completed', 'expired'];

/**
 * Work out whether a subscription is actually scheduled to stop, in unix
 * seconds, or null if it will keep renewing.
 *
 * This is NOT simply Razorpay's `end_at`. Unlike Stripe's `cancel_at`, which is
 * null unless a cancellation is pending, Razorpay always populates `end_at` with
 * the point at which all `total_count` cycles complete -- roughly ten years out
 * for a monthly plan. Persisting that verbatim would make every healthy
 * subscriber appear to be cancelling a decade from now.
 *
 * A stop is genuinely scheduled when either:
 *   - the subscription has already terminated (`ended_at` is set), or
 *   - it will not renew past the current cycle, i.e. `end_at` is at or before
 *     `current_end` -- which is what cancel_at_cycle_end=1 produces.
 *
 * Reads no clock, so it is deterministic and safe to unit test.
 */
export function scheduledCancelAt(subscription: any): number | null {
  if (subscription?.ended_at) return subscription.ended_at;

  const endAt = subscription?.end_at;
  const currentEnd = subscription?.current_end;
  if (!endAt) return null;
  if (currentEnd && endAt <= currentEnd) return endAt;
  if (TERMINAL_STATES.includes(subscription?.status)) return endAt;

  return null;
}

/**
 * Build the stable identity we stamp onto a Razorpay plan's notes.
 *
 * The amount and currency are part of the key on purpose: Razorpay plans are
 * immutable, so a price change must provision a NEW plan rather than silently
 * reprice existing subscribers. Including the amount makes that automatic.
 */
export function buildPlanKey(
  billing: string,
  period: string,
  amountMinor: number,
  currency: string
): string {
  return `${billing}|${period}|${amountMinor}|${currency}`;
}

/**
 * Parse a plan key back into its tier and period.
 *
 * This is how webhook reconciliation learns which tier a subscription is really
 * on. It must be preferred over the subscription's own `notes`: on an upgrade we
 * change the subscription's plan_id, but Razorpay keeps the original notes, so
 * trusting notes would under-entitle a customer who just paid for a higher tier.
 *
 * Returns null for anything unparseable rather than guessing.
 */
export function parsePlanKey(
  key: string | undefined | null
): { billing: string; period: string } | null {
  if (!key) return null;
  const parts = String(key).split('|');
  if (parts.length < 2) return null;
  const [billing, period] = parts;
  if (!billing || !period) return null;
  return { billing: billing.toUpperCase(), period: period.toUpperCase() };
}
