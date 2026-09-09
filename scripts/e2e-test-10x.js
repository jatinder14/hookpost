import https from 'https';
import http from 'http';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

import dotenv from 'dotenv';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'https://hookpost.hookstep.in';
const REDIS_URL = process.env.REDIS_URL;
const DATABASE_URL = process.env.DATABASE_URL;

// NEVER hardcode a fallback secret here. Live Neon/Upstash credentials were
// once committed as `process.env.X || '<real url>'` fallbacks and leaked to
// the public git history. Require the env vars and fail loudly instead.
if (!REDIS_URL || !DATABASE_URL) {
  console.error(
    'Missing REDIS_URL and/or DATABASE_URL. Set them in .env — do NOT add inline fallbacks.'
  );
  process.exit(1);
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

async function runIteration(iteration) {
  console.log(`\n======================================================`);
  console.log(`🚀 STARTING COMPREHENSIVE E2E TEST RUN [ITERATION ${iteration}/10]`);
  console.log(`======================================================`);

  const results = [];

  // 1. Frontend Landing & SEO Routes
  const frontendRoutes = ['/', '/alternatives/postiz', '/alternatives/buffer', '/privacy', '/terms', '/sitemap.xml', '/robots.txt'];
  for (const route of frontendRoutes) {
    const start = Date.now();
    const res = await fetchUrl(`${BACKEND_URL}${route}`);
    const duration = Date.now() - start;
    if (res.statusCode === 200) {
      results.push(`✅ [Suite 1: Frontend] ${route} returned HTTP 200 (${duration}ms)`);
    } else {
      results.push(`❌ [Suite 1: Frontend] ${route} returned HTTP ${res.statusCode}`);
    }
  }

  // 2. Static Assets & Image Verification
  const assets = [
    '/brand-logo.png',
    '/favicon.png',
    '/favicon.ico',
    '/svgs/menu-open.svg',
    '/svgs/features/planning.svg',
    '/svgs/features/creating.svg',
    '/svgs/features/analytics.svg',
    '/svgs/features/organizing.svg'
  ];
  for (const asset of assets) {
    const start = Date.now();
    const res = await fetchUrl(`${BACKEND_URL}${asset}`);
    const duration = Date.now() - start;
    if (res.statusCode === 200) {
      results.push(`✅ [Suite 2: Assets] ${asset} served successfully (${duration}ms)`);
    } else {
      results.push(`❌ [Suite 2: Assets] ${asset} returned HTTP ${res.statusCode}`);
    }
  }

  let prisma = null;
  // 3. Database Connection & Schema Verification
  if (DATABASE_URL) {
    prisma = new PrismaClient({ datasourceUrl: DATABASE_URL });
    try {
      const userCount = await prisma.user.count();
      const orgCount = await prisma.organization.count();
      const subCount = await prisma.subscription.count();
      results.push(`✅ [Suite 3: Neon DB] Connection active! Records: Users=${userCount}, Orgs=${orgCount}, Subs=${subCount}`);
    } catch (err) {
      results.push(`❌ [Suite 3: Neon DB] Connection failed: ${err.message}`);
    }
  } else {
    results.push(`ℹ️ [Suite 3: Neon DB] Skipped (DATABASE_URL not set)`);
  }

  // 4. Redis Upstash Read/Write/Delete/Ping
  if (REDIS_URL) {
    const redis = new Redis(REDIS_URL, { connectTimeout: 5000, maxRetriesPerRequest: 1 });
    try {
      const testKey = `e2e:test:${Date.now()}`;
      await redis.set(testKey, 'hookpost-ok', 'EX', 30);
      const val = await redis.get(testKey);
      await redis.del(testKey);
      const ping = await redis.ping();
      if (val === 'hookpost-ok' && ping === 'PONG') {
        results.push(`✅ [Suite 4: Upstash Redis] Ping/Set/Get/Del passed (Ping: ${ping})`);
      } else {
        results.push(`❌ [Suite 4: Upstash Redis] Value mismatch: ${val}`);
      }
    } catch (err) {
      results.push(`❌ [Suite 4: Upstash Redis] Failed: ${err.message}`);
    } finally {
      await redis.quit();
    }
  } else {
    results.push(`ℹ️ [Suite 4: Upstash Redis] Skipped (REDIS_URL not set)`);
  }

  // 5. Backend Auth Endpoints
  try {
    const res = await fetchUrl(`${BACKEND_URL}/api/auth/can-register`);
    if (res.statusCode === 200 && res.body.includes('register')) {
      results.push(`✅ [Suite 5: Backend Auth] /api/auth/can-register returned HTTP 200 (${res.body.trim()})`);
    } else {
      results.push(`❌ [Suite 5: Backend Auth] /api/auth/can-register returned HTTP ${res.statusCode}`);
    }
  } catch (err) {
    results.push(`❌ [Suite 5: Backend Auth] Failed: ${err.message}`);
  }

  // 6. SuperAdmin User & Organization Role Integrity
  if (prisma) {
    try {
      const superAdmin = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
      if (superAdmin) {
        results.push(`✅ [Suite 6: Multi-Tenancy] SuperAdmin verified: ${superAdmin.email}`);
      } else {
        results.push(`ℹ️ [Suite 6: Multi-Tenancy] No superadmin registered yet in current database`);
      }
    } catch (err) {
      results.push(`❌ [Suite 6: Multi-Tenancy] Check failed: ${err.message}`);
    } finally {
      await prisma.$disconnect();
    }
  } else {
    results.push(`ℹ️ [Suite 6: Multi-Tenancy] Skipped (DATABASE_URL not set)`);
  }

  for (const r of results) {
    console.log(r);
  }

  const failures = results.filter(r => r.startsWith('❌'));
  if (failures.length > 0) {
    throw new Error(`Iteration ${iteration} failed with ${failures.length} errors.`);
  }
}

async function main() {
  console.log('🚀 Initiating 10-Iteration End-to-End Test Suite for Hookpost...');
  for (let i = 1; i <= 10; i++) {
    await runIteration(i);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('\n======================================================');
  console.log('🏁 ALL 10 E2E RUNS COMPLETE! 10/10 PASSED PERFECTLY!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('\n💥 E2E Test Suite Error:', err.message);
  process.exit(1);
});
