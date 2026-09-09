/**
 * Standalone checks for the Razorpay signature logic.
 *
 * These two HMACs are the security boundary of the billing integration: get
 * either wrong and you either reject every real webhook or accept forged ones.
 * The repo has no jest project wired up for nestjs-libraries, so this runs
 * directly under ts-node:
 *
 *   npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     scripts/verify-razorpay-crypto.ts
 */
import * as crypto from 'crypto';
import { RazorpayClient, RazorpayConfigError } from '../libraries/nestjs-libraries/src/services/razorpay.client';

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
function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}
function assertThrows(fn: () => void, msg: string) {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error(`expected a throw: ${msg}`);
}

const WEBHOOK_SECRET = 'whsec_test_abc123';
const KEY_SECRET = 'keysecret_test_xyz789';

process.env.RAZORPAY_KEY_ID = 'rzp_test_key';
process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;

const client = new RazorpayClient();

console.log('\nWebhook signature verification');

check('accepts a correctly signed body', () => {
  const body = Buffer.from(JSON.stringify({ event: 'subscription.charged' }));
  const sig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  assert(
    client.verifyWebhook(body, sig, WEBHOOK_SECRET) === true,
    'valid signature was rejected'
  );
});

check('rejects a tampered body', () => {
  const body = Buffer.from(JSON.stringify({ event: 'subscription.charged' }));
  const sig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  const tampered = Buffer.from(JSON.stringify({ event: 'subscription.halted' }));
  assertThrows(
    () => client.verifyWebhook(tampered, sig, WEBHOOK_SECRET),
    'tampered body accepted'
  );
});

check('rejects a signature made with the wrong secret', () => {
  const body = Buffer.from('{"event":"x"}');
  const sig = crypto.createHmac('sha256', 'wrong').update(body).digest('hex');
  assertThrows(
    () => client.verifyWebhook(body, sig, WEBHOOK_SECRET),
    'wrong-secret signature accepted'
  );
});

check('rejects a truncated signature without throwing on length', () => {
  const body = Buffer.from('{"event":"x"}');
  const sig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
    .slice(0, 10);
  // timingSafeEqual throws a TypeError on length mismatch; we must surface a
  // clean rejection instead.
  assertThrows(
    () => client.verifyWebhook(body, sig, WEBHOOK_SECRET),
    'truncated signature accepted'
  );
});

check('refuses to verify when no secret is configured', () => {
  const body = Buffer.from('{}');
  let err: any;
  try {
    client.verifyWebhook(body, 'abc', '');
  } catch (e) {
    err = e;
  }
  assert(
    err instanceof RazorpayConfigError,
    'missing secret should raise RazorpayConfigError, not silently pass'
  );
});

check('rejects a missing signature header', () => {
  assertThrows(
    () => client.verifyWebhook(Buffer.from('{}'), '', WEBHOOK_SECRET),
    'empty signature accepted'
  );
});

console.log('\nCheckout handshake verification');

check('accepts payment_id|subscription_id in the correct order', () => {
  const subId = 'sub_ABC123';
  const payId = 'pay_XYZ789';
  const sig = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${payId}|${subId}`)
    .digest('hex');
  assert(
    client.verifySubscriptionPayment(subId, payId, sig) === true,
    'valid handshake rejected'
  );
});

check('rejects the reversed operand order', () => {
  // Subscriptions sign payment|subscription; orders sign order|payment. Using
  // the order convention here must not validate.
  const subId = 'sub_ABC123';
  const payId = 'pay_XYZ789';
  const reversed = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${subId}|${payId}`)
    .digest('hex');
  assert(
    client.verifySubscriptionPayment(subId, payId, reversed) === false,
    'reversed operand order was accepted'
  );
});

check('rejects an empty signature', () => {
  assert(
    client.verifySubscriptionPayment('sub_1', 'pay_1', '') === false,
    'empty handshake signature accepted'
  );
});

console.log(
  failures === 0
    ? '\nAll signature checks passed.\n'
    : `\n${failures} check(s) FAILED.\n`
);
process.exit(failures === 0 ? 0 : 1);
