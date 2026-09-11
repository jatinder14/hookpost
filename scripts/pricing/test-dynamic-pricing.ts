/**
 * Automated Test Suite: Multi-Currency Geo-Pricing & Anti-INR Leak Engine
 */

import {
  resolveCountryToCurrency,
  isIndianRegion,
  getPricing,
  pricingINR,
  pricingUSD,
  pricingEUR,
  pricingGBP,
  CURRENCY_CONFIG,
} from '../../libraries/nestjs-libraries/src/database/prisma/subscriptions/pricing';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`  [PASS] ${message}`);
}

async function runTests() {
  console.log('================================================================');
  console.log('DYNAMIC GEO-PRICING & ANTI-INR LEAK ENGINE TEST SUITE');
  console.log('================================================================\n');

  // Test 1: Country Code to Currency Resolution
  console.log('--> Test 1: Country Code to Regional Currency Mapping');
  assert(resolveCountryToCurrency('IN') === 'INR', 'India (IN) maps strictly to INR');
  assert(resolveCountryToCurrency('US') === 'USD', 'United States (US) maps strictly to USD');
  assert(resolveCountryToCurrency('CA') === 'USD', 'Canada (CA) maps to USD');
  assert(resolveCountryToCurrency('AU') === 'USD', 'Australia (AU) maps to USD');
  assert(resolveCountryToCurrency('GB') === 'GBP', 'Great Britain (GB) maps strictly to GBP');
  assert(resolveCountryToCurrency('DE') === 'EUR', 'Germany (DE) maps to EUR');
  assert(resolveCountryToCurrency('FR') === 'EUR', 'France (FR) maps to EUR');
  assert(resolveCountryToCurrency('ES') === 'EUR', 'Spain (ES) maps to EUR');
  assert(resolveCountryToCurrency('') === 'USD', 'Empty/unidentified country defaults safely to USD (NOT INR)');
  assert(resolveCountryToCurrency(undefined) === 'USD', 'Undefined country defaults safely to USD');

  // Test 2: Timezone Fallback Resolution
  console.log('\n--> Test 2: Browser Timezone Fallback Resolution');
  assert(resolveCountryToCurrency(undefined, 'Asia/Kolkata') === 'INR', 'Asia/Kolkata resolves to INR');
  assert(resolveCountryToCurrency(undefined, 'Asia/Calcutta') === 'INR', 'Asia/Calcutta resolves to INR');
  assert(resolveCountryToCurrency(undefined, 'America/New_York') === 'USD', 'America/New_York resolves to USD');
  assert(resolveCountryToCurrency(undefined, 'Europe/London') === 'GBP', 'Europe/London resolves to GBP');
  assert(resolveCountryToCurrency(undefined, 'Europe/Berlin') === 'EUR', 'Europe/Berlin resolves to EUR');
  assert(resolveCountryToCurrency(undefined, 'Asia/Tokyo') === 'USD', 'Asia/Tokyo defaults to global USD');

  // Test 3: Strict Anti-INR Leakage Isolation
  console.log('\n--> Test 3: Anti-INR Leakage Validation');
  assert(isIndianRegion('IN') === true, 'India is recognized as Indian region');
  assert(isIndianRegion('US') === false, 'United States is NOT in Indian region');
  assert(isIndianRegion('GB') === false, 'United Kingdom is NOT in Indian region');
  assert(isIndianRegion('DE') === false, 'Germany is NOT in Indian region');
  assert(isIndianRegion('') === false, 'Unknown origin is NOT in Indian region');

  // Test 4: New US SaaS Pricing Benchmark Rates ($19 / $39 / $79 / $159)
  console.log('\n--> Test 4: New US SaaS Benchmark Pricing Rates');
  assert(pricingUSD.FREE.month_price === 0, 'USD Free tier is $0');
  assert(pricingUSD.STANDARD.month_price === 19, 'USD Standard is $19/mo (was underpriced at $9)');
  assert(pricingUSD.TEAM.month_price === 39, 'USD Team is $39/mo (was underpriced at $19)');
  assert(pricingUSD.PRO.month_price === 79, 'USD Pro is $79/mo (was underpriced at $29)');
  assert(pricingUSD.ULTIMATE.month_price === 159, 'USD Ultimate is $159/mo (was underpriced at $59)');

  // Test 5: EUR & GBP Regional Rates
  console.log('\n--> Test 5: European & British Regional Pricing Cards');
  assert(pricingEUR.STANDARD.month_price === 19, 'EUR Standard is €19/mo');
  assert(pricingEUR.TEAM.month_price === 39, 'EUR Team is €39/mo');
  assert(pricingGBP.STANDARD.month_price === 16, 'GBP Standard is £16/mo');
  assert(pricingGBP.TEAM.month_price === 34, 'GBP Team is £34/mo');

  // Test 6: INR Base Rates Preserved
  console.log('\n--> Test 6: Indian Base Rates Preservation');
  assert(pricingINR.STANDARD.month_price === 699, 'INR Standard remains ₹699');
  assert(pricingINR.TEAM.month_price === 1499, 'INR Team remains ₹1,499');
  assert(pricingINR.PRO.month_price === 2299, 'INR Pro remains ₹2,299');
  assert(pricingINR.ULTIMATE.month_price === 4499, 'INR Ultimate remains ₹4,499');

  // Test 7: Currency Config Symbols & Labels
  console.log('\n--> Test 7: Currency Configurations');
  assert(CURRENCY_CONFIG.USD.symbol === '$', 'USD symbol is $');
  assert(CURRENCY_CONFIG.INR.symbol === '₹', 'INR symbol is ₹');
  assert(CURRENCY_CONFIG.EUR.symbol === '€', 'EUR symbol is €');
  assert(CURRENCY_CONFIG.GBP.symbol === '£', 'GBP symbol is £');

  // Test 8: getPricing lookup safety
  console.log('\n--> Test 8: getPricing Dynamic Retrieval');
  assert(getPricing('USD').STANDARD.month_price === 19, 'getPricing("USD") returns $19 Standard');
  assert(getPricing('INR').STANDARD.month_price === 699, 'getPricing("INR") returns ₹699 Standard');
  assert(getPricing('EUR').STANDARD.month_price === 19, 'getPricing("EUR") returns €19 Standard');
  assert(getPricing('GBP').STANDARD.month_price === 16, 'getPricing("GBP") returns £16 Standard');
  assert(getPricing('INVALID').STANDARD.month_price === 19, 'getPricing with invalid currency safely defaults to USD ($19)');

  console.log('\n================================================================');
  console.log('ALL DYNAMIC GEO-PRICING & ANTI-LEAK TESTS PASSED! [8/8]');
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
