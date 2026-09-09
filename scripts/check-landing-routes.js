#!/usr/bin/env node
/**
 * Every page under (landing) must be reachable by an anonymous visitor.
 *
 * Adding a marketing route is two steps: create the directory, and add a prefix
 * to the allowlist in proxy.ts. Nothing enforced step two, so a route that
 * looked finished would 307 every logged-out visitor - and a crawler, and a
 * payment reviewer - straight to /auth.
 *
 * It has now happened three times: /refund-policy, /shipping-policy, and
 * /pricing. The last one was the expensive one. Razorpay's banking partner
 * clicked Pricing in the footer, hit a login wall, and moved 19 netbanking
 * banks plus Diners Club to ACTION REQUIRED with the note "there is no option
 * to proceed to the checkout page or complete a transaction". They were right
 * about what they could see.
 *
 * Run: node scripts/check-landing-routes.js
 */
const fs = require('fs');
const path = require('path');

const LANDING = path.join(__dirname, '..', 'apps/frontend/src/app/(landing)');
const PROXY = path.join(__dirname, '..', 'apps/frontend/src/proxy.ts');

const proxy = fs.readFileSync(PROXY, 'utf8');
// Collect every literal used with startsWith/=== in the allowlist.
const allowed = [...proxy.matchAll(/(?:startsWith|===)\(?\s*'([^']+)'/g)]
  .map((m) => m[1])
  // Drop the bare '/' entry. It is an exact-match check for the homepage, but
  // as a startsWith prefix it matches every path in existence - which made the
  // first version of this script pass unconditionally. It reported "all 46
  // routes reachable" while /pricing was 307ing in production. Verified by
  // deleting the /pricing line and confirming the check now fails.
  .filter((a) => a !== '/');

// Match on segment boundaries: '/price' must not satisfy '/pricing'.
const isAllowed = (route) =>
  allowed.some((a) => route === a || route.startsWith(a.endsWith('/') ? a : a + '/'));

function routes(dir, prefix = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    // Route groups (x) do not appear in the URL; [dynamic] segments are covered
    // by their parent prefix.
    if (e.name.startsWith('(')) {
      out.push(...routes(path.join(dir, e.name), prefix));
      continue;
    }
    if (e.name.startsWith('[') || e.name.startsWith('_')) continue;
    const p = `${prefix}/${e.name}`;
    if (fs.existsSync(path.join(dir, e.name, 'page.tsx'))) out.push(p);
    out.push(...routes(path.join(dir, e.name), p));
  }
  return out;
}

const missing = routes(LANDING).filter((r) => !isAllowed(r));

if (missing.length) {
  console.error('These (landing) routes are NOT allowlisted in proxy.ts and will');
  console.error('307 anonymous visitors to /auth:\n');
  for (const m of missing) console.error(`  ${m}`);
  console.error('\nAdd a startsWith() entry for each in apps/frontend/src/proxy.ts.');
  process.exit(1);
}
console.log(`✓ all ${routes(LANDING).length} (landing) routes are publicly reachable`);
