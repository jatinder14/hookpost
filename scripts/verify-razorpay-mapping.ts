/**
 * Checks for scheduledCancelAt(), the mapping from a Razorpay subscription
 * entity to the DB's `cancelAt` column.
 *
 * This is subtle enough to be worth pinning down: Razorpay always populates
 * `end_at` (the point at which all total_count cycles complete), whereas the
 * column means "this subscription is going away". Confusing the two makes every
 * healthy subscriber look like they are cancelling years from now.
 *
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' \
 *        scripts/verify-razorpay-mapping.ts
 */
import {
  scheduledCancelAt,
  buildPlanKey,
  parsePlanKey,
} from '../libraries/nestjs-libraries/src/services/razorpay.mapping';

let failures = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
  } catch (e) {
    failures++;
    console.error(`  FAIL  ${name}\n        ${e}`);
  }
}
function assertEq(actual: unknown, expected: unknown, what: string) {
  if (actual !== expected) {
    throw new Error(`${what}: expected ${expected}, got ${actual}`);
  }
}

const cancelAt = scheduledCancelAt;

const NOW = 1_800_000_000; // fixed instant; the function must not read the clock
const MONTH = 30 * 86400;

console.log('\nscheduledCancelAt mapping');

check('healthy monthly subscription -> null (does NOT leak end_at)', () => {
  // The realistic shape: 120 monthly cycles, so end_at is ~10 years out.
  assertEq(
    cancelAt({
      status: 'active',
      current_start: NOW,
      current_end: NOW + MONTH,
      end_at: NOW + 120 * MONTH,
    }),
    null,
    'active subscription'
  );
});

check('cancel_at_cycle_end -> end of current cycle', () => {
  // Razorpay pulls end_at back to the current cycle end.
  assertEq(
    cancelAt({
      status: 'active',
      current_start: NOW,
      current_end: NOW + MONTH,
      end_at: NOW + MONTH,
    }),
    NOW + MONTH,
    'cycle-end cancellation'
  );
});

check('already ended -> ended_at wins', () => {
  assertEq(
    cancelAt({
      status: 'cancelled',
      ended_at: NOW - 100,
      current_end: NOW + MONTH,
      end_at: NOW + 120 * MONTH,
    }),
    NOW - 100,
    'ended subscription'
  );
});

check('terminal status without ended_at -> end_at', () => {
  assertEq(
    cancelAt({ status: 'expired', end_at: NOW + 5 }),
    NOW + 5,
    'expired subscription'
  );
});

check('no end_at at all -> null', () => {
  assertEq(cancelAt({ status: 'active' }), null, 'missing end_at');
});

check('authenticated (trial, not yet charged) -> null', () => {
  assertEq(
    cancelAt({
      status: 'authenticated',
      current_end: NOW + MONTH,
      end_at: NOW + 120 * MONTH,
    }),
    null,
    'trialing subscription'
  );
});

check('undefined entity -> null, no throw', () => {
  assertEq(cancelAt(undefined), null, 'undefined subscription');
});

console.log('\nPlan key round-trip');

check('round-trips tier and period', () => {
  const key = buildPlanKey('PRO', 'MONTHLY', 329900, 'INR');
  const parsed = parsePlanKey(key);
  assertEq(parsed?.billing, 'PRO', 'billing');
  assertEq(parsed?.period, 'MONTHLY', 'period');
});

check('amount is part of the key, so a price change yields a new key', () => {
  // Razorpay plans are immutable; a repriced tier must not reuse the old plan.
  const before = buildPlanKey('PRO', 'MONTHLY', 329900, 'INR');
  const after = buildPlanKey('PRO', 'MONTHLY', 349900, 'INR');
  if (before === after) throw new Error('price change produced the same key');
});

check('currency is part of the key', () => {
  const inr = buildPlanKey('PRO', 'MONTHLY', 329900, 'INR');
  const usd = buildPlanKey('PRO', 'MONTHLY', 329900, 'USD');
  if (inr === usd) throw new Error('currency change produced the same key');
});

check('normalises case on parse', () => {
  assertEq(parsePlanKey('pro|monthly|1|INR')?.billing, 'PRO', 'billing case');
  assertEq(parsePlanKey('pro|monthly|1|INR')?.period, 'MONTHLY', 'period case');
});

check('returns null for unparseable input rather than guessing', () => {
  assertEq(parsePlanKey(undefined), null, 'undefined');
  assertEq(parsePlanKey(''), null, 'empty');
  assertEq(parsePlanKey('PRO'), null, 'no delimiter');
  assertEq(parsePlanKey('|MONTHLY'), null, 'empty tier');
});

console.log(
  failures === 0
    ? '\nAll mapping checks passed.\n'
    : `\n${failures} check(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
