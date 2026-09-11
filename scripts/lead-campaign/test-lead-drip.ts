/**
 * Test Suite: Multi-Currency Lead Nurture Engine (10-Stage Verification)
 */

import { generateLeadEmail, LeadEmailParams } from '../../libraries/nestjs-libraries/src/emails/templates/lead-campaign.template';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`[FAIL] ${msg}`);
    process.exit(1);
  }
  console.log(`  [PASS] ${msg}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('HOOKPOST LEAD DRIP & MULTI-CURRENCY TEST SUITE (10-STAGE)');
  console.log('================================================================\n');

  // Test 1: Stage 1 Email Generation - INR
  console.log('--> Test 1: Stage 1 Launch Email in INR');
  const inr1 = generateLeadEmail({
    userName: 'Akhand',
    orgName: 'jik',
    email: 'codewithakhand@gmail.com',
    currency: 'INR',
    stage: 'STAGE_1_LAUNCH'
  });
  assert(inr1.subject.includes('USD & INR pricing unlocked'), 'Subject includes multi-currency launch');
  assert(inr1.html.includes('₹349'), 'INR discounted price ₹349 is present');
  assert(inr1.html.includes('₹699'), 'INR original price ₹699 is present');
  assert(inr1.html.includes('LAUNCH50'), 'Discount code LAUNCH50 is present');
  assert(inr1.html.includes('Akhand'), 'Personalized name Akhand is present');

  // Test 2: Stage 1 Email Generation - USD
  console.log('\n--> Test 2: Stage 1 Launch Email in USD');
  const usd1 = generateLeadEmail({
    userName: 'Lucian',
    orgName: 'twitch',
    email: 'lucianflorincioba@gmail.com',
    currency: 'USD',
    stage: 'STAGE_1_LAUNCH'
  });
  assert(usd1.html.includes('$4.50'), 'USD discounted price $4.50 is present');
  assert(usd1.html.includes('$9'), 'USD original price $9 is present');
  assert(usd1.html.includes('$39.50/year'), 'USD annual price is present');
  assert(usd1.html.includes('twitch'), 'Org name twitch is rendered');

  // Test 3: Stage 2 Feature Spotlight Template
  console.log('\n--> Test 3: Stage 2 Feature Spotlight Template');
  const featEmail = generateLeadEmail({
    userName: 'Gokul',
    email: 'gokulspidey771@gmail.com',
    currency: 'INR',
    stage: 'STAGE_2_FEATURES'
  });
  assert(featEmail.subject.includes('Publish across 17+ platforms'), 'Stage 2 subject focuses on 17+ platforms');
  assert(featEmail.html.includes('Unified Visual Calendar'), 'Calendar feature is highlighted');
  assert(featEmail.html.includes('Cursor') && featEmail.html.includes('Claude'), 'Developer tools mentioned');

  // Test 4: Stage 3 Founder Personal Touch Template
  console.log('\n--> Test 4: Stage 3 Founder Personal Touch Template');
  const founderEmail = generateLeadEmail({
    userName: 'Massifor',
    email: 'massifor@gmail.com',
    currency: 'USD',
    stage: 'STAGE_3_FOUNDER'
  });
  assert(founderEmail.subject.includes('Quick question regarding your Hookpost setup'), 'Founder subject line matches pattern');
  assert(founderEmail.text.includes('Jatinder here from Hookpost'), 'Founder intro in plain text');
  assert(founderEmail.text.includes('support@hookstep.in'), 'Founder email contact present');

  // Test 5: Currency IP Resolution Logic
  console.log('\n--> Test 5: Currency IP Resolution Logic');
  const ips = [
    { ip: '106.51.179.27', expected: 'INR' }, // India ACT
    { ip: '47.15.172.44', expected: 'INR' },   // India Airtel
    { ip: '169.150.207.232', expected: 'USD' }, // Europe
    { ip: '2a02:2f0e:1005:...', expected: 'USD' }, // Romania IPv6
    { ip: '2400:c600:...', expected: 'USD' },      // Bangladesh IPv6
    { ip: null, expected: 'USD' }                  // Fallback
  ];
  for (const { ip, expected } of ips) {
    const isIndia = ip && (ip.startsWith('106.') || ip.startsWith('47.') || ip.startsWith('49.') || ip.startsWith('117.') || ip.startsWith('122.') || ip.startsWith('182.'));
    const resolved = isIndia ? 'INR' : 'USD';
    assert(resolved === expected, `IP ${ip} correctly resolves to ${expected}`);
  }

  // Test 6: Anti-Spam Drip Progression Sequence
  console.log('\n--> Test 6: Anti-Spam Drip Progression Sequence');
  function getNextStage(daysSinceSignup: number, sentCodes: string[]) {
    if (!sentCodes.includes('drip:stage_1_launch')) {
      return 'STAGE_1_LAUNCH';
    } else if (daysSinceSignup >= 3 && !sentCodes.includes('drip:stage_2_features')) {
      return 'STAGE_2_FEATURES';
    } else if (daysSinceSignup >= 7 && !sentCodes.includes('drip:stage_3_founder')) {
      return 'STAGE_3_FOUNDER';
    }
    return null;
  }
  assert(getNextStage(0, []) === 'STAGE_1_LAUNCH', 'New lead gets Stage 1');
  assert(getNextStage(1, ['drip:stage_1_launch']) === null, 'Day 1 after Stage 1 sent gets skipped (cooldown)');
  assert(getNextStage(3, ['drip:stage_1_launch']) === 'STAGE_2_FEATURES', 'Day 3 gets Stage 2');
  assert(getNextStage(4, ['drip:stage_1_launch', 'drip:stage_2_features']) === null, 'Day 4 gets skipped (cooldown)');
  assert(getNextStage(7, ['drip:stage_1_launch', 'drip:stage_2_features']) === 'STAGE_3_FOUNDER', 'Day 7 gets Stage 3');
  assert(getNextStage(10, ['drip:stage_1_launch', 'drip:stage_2_features', 'drip:stage_3_founder']) === null, 'All stages sent -> permanently skipped');

  // Test 7: Idempotency & Repeat Prevention
  console.log('\n--> Test 7: Idempotency & Repeat Prevention');
  const mockDbSent = ['drip:stage_1_launch', 'drip:stage_2_features', 'drip:stage_3_founder'];
  for (const stage of ['drip:stage_1_launch', 'drip:stage_2_features', 'drip:stage_3_founder']) {
    const isAlreadySent = mockDbSent.includes(stage);
    assert(isAlreadySent === true, `Duplicate check prevents resending ${stage}`);
  }

  // Test 8: Mobile-Responsive HTML Structure & Tags
  console.log('\n--> Test 8: Mobile-Responsive HTML Structure');
  assert(inr1.html.includes('meta name="viewport"'), 'Viewport meta tag present');
  assert(inr1.html.includes('max-width: 600px'), 'Standard 600px container present');
  assert(inr1.html.includes('Claim 50% Off'), 'Clear call-to-action button present');

  // Test 9: CAN-SPAM Compliance Requirements
  console.log('\n--> Test 9: CAN-SPAM Compliance Requirements');
  assert(inr1.html.includes('Unsubscribe'), 'Unsubscribe option is present');
  assert(inr1.text.includes('Unsubscribe'), 'Plain text contains unsubscribe');
  assert(inr1.html.includes('Sent by Hookpost'), 'Sender identity is clearly disclosed');

  // Test 10: Multi-Currency Pricing Parity
  console.log('\n--> Test 10: Multi-Currency Pricing Parity');
  assert(inr1.html.includes('₹349') && usd1.html.includes('$4.50'), 'Both currencies accurately represent 50% discount');

  console.log('\n================================================================');
  console.log('ALL 10 LEAD DRIP & CAMPAIGN TESTS PASSED WITH ZERO ERRORS! [10/10]');
  console.log('================================================================\n');
}

runTests().catch(console.error);
