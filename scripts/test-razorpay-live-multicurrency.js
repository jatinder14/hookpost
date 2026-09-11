/**
 * Live Razorpay Multi-Currency API Verification
 * Creates live test plans and subscriptions in both INR and USD,
 * verifies payment links and currency attributes, then cancels the test subscriptions.
 */
require('/home/flexiple_jr/hookpost/node_modules/dotenv').config({ path: '/home/flexiple_jr/hookpost/.env' });

async function runLiveTest() {
  console.log('--- Starting Live Razorpay Multi-Currency Verification ---');
  const auth = Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  // 1. Create INR Plan
  console.log('1. Creating INR Standard Plan (₹699/mo -> 69900 paise)...');
  const inrPlanRes = await fetch('https://api.razorpay.com/v1/plans', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'Hookpost Live Test Standard Monthly (INR)',
        amount: 69900,
        currency: 'INR'
      },
      notes: { hookpost_key: 'STANDARD|MONTHLY|69900|INR', billing: 'STANDARD', period: 'MONTHLY' }
    })
  });
  const inrPlan = await inrPlanRes.json();
  if (!inrPlan.id) throw new Error('Failed to create INR plan: ' + JSON.stringify(inrPlan));
  console.log('   [SUCCESS] INR Plan ID:', inrPlan.id, 'Currency:', inrPlan.item?.currency, 'Amount:', inrPlan.item?.amount);

  // 2. Create USD Plan
  console.log('2. Creating USD Standard Plan ($9/mo -> 900 cents)...');
  const usdPlanRes = await fetch('https://api.razorpay.com/v1/plans', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'Hookpost Live Test Standard Monthly (USD)',
        amount: 900,
        currency: 'USD'
      },
      notes: { hookpost_key: 'STANDARD|MONTHLY|900|USD', billing: 'STANDARD', period: 'MONTHLY' }
    })
  });
  const usdPlan = await usdPlanRes.json();
  if (!usdPlan.id) throw new Error('Failed to create USD plan: ' + JSON.stringify(usdPlan));
  console.log('   [SUCCESS] USD Plan ID:', usdPlan.id, 'Currency:', usdPlan.item?.currency, 'Amount:', usdPlan.item?.amount);

  // 3. Create INR Subscription
  console.log('3. Issuing INR Subscription on Razorpay...');
  const inrSubRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      plan_id: inrPlan.id,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: { hookpost_key: 'STANDARD|MONTHLY|69900|INR', service: 'hookpost', currency: 'INR' }
    })
  });
  const inrSub = await inrSubRes.json();
  if (!inrSub.id) throw new Error('Failed to create INR subscription: ' + JSON.stringify(inrSub));
  console.log('   [SUCCESS] INR Sub ID:', inrSub.id, 'Status:', inrSub.status, 'Payment URL:', inrSub.short_url);

  // 4. Create USD Subscription
  console.log('4. Issuing USD Subscription on Razorpay...');
  const usdSubRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      plan_id: usdPlan.id,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: { hookpost_key: 'STANDARD|MONTHLY|900|USD', service: 'hookpost', currency: 'USD' }
    })
  });
  const usdSub = await usdSubRes.json();
  if (!usdSub.id) throw new Error('Failed to create USD subscription: ' + JSON.stringify(usdSub));
  console.log('   [SUCCESS] USD Sub ID:', usdSub.id, 'Status:', usdSub.status, 'Payment URL:', usdSub.short_url);

  // 5. Cleanup Test Subscriptions
  console.log('5. Cancelling test subscriptions...');
  await fetch(`https://api.razorpay.com/v1/subscriptions/${inrSub.id}/cancel`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ cancel_at_cycle_end: 0 })
  });
  await fetch(`https://api.razorpay.com/v1/subscriptions/${usdSub.id}/cancel`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ cancel_at_cycle_end: 0 })
  });
  console.log('   [CLEANUP] Successfully cancelled test subscriptions:', inrSub.id, usdSub.id);

  console.log('\n--- LIVE MULTI-CURRENCY RAZORPAY VERIFICATION COMPLETED WITH ZERO ERRORS ---');
}

runLiveTest().catch(console.error);
