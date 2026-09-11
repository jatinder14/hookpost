/**
 * Hookpost Automated Lead Nurture Drip Engine
 *
 * Implements a strict anti-spam 3-stage drip sequence (Day 1, Day 3, Day 7)
 * with dynamic currency detection (INR vs USD) and persistent idempotency checks
 * in PostgreSQL to guarantee zero duplicate emails.
 */

const { PrismaClient } = require('/home/flexiple_jr/hookpost/node_modules/@prisma/client');
const { Resend } = require('/home/flexiple_jr/hookpost/node_modules/resend');
require('/home/flexiple_jr/hookpost/node_modules/dotenv').config({ path: '/home/flexiple_jr/hookpost/.env' });

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Import template generator logic
function buildTemplate(params) {
  const {
    userName,
    orgName,
    email,
    currency,
    stage,
    discountCode = 'LAUNCH50',
    appUrl = 'https://hookpost.hookstep.in'
  } = params;

  const displayName = userName || (email ? email.split('@')[0] : 'there');
  const isINR = currency === 'INR';
  
  const originalMonthly = isINR ? '₹699' : '$9';
  const discountedMonthly = isINR ? '₹349' : '$4.50';
  const originalYearly = isINR ? '₹6,999' : '$79';
  const discountedYearly = isINR ? '₹3,499' : '$39.50';

  if (stage === 'STAGE_3_FOUNDER') {
    const subject = 'Quick question regarding your Hookpost setup';
    const text = `Hey ${displayName},\n\nJatinder here from Hookpost.\n\nI noticed you created an account on Hookpost recently (${orgName ? `for ${orgName}` : 'to automate your social channels'}), but haven't had a chance to launch your first post yet.\n\nAre you looking to manage your personal brand, or client accounts across multiple platforms?\n\nIf you ran into any friction during setup or have questions about our multi-platform scheduling (LinkedIn, X, Instagram, Facebook, Threads, Slack, Discord), just reply directly to this email. I read and respond to every note personally.\n\nBest,\nJatinder Mahajan\nFounder, Hookpost\nsupport@hookstep.in`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 24px; }
    p { margin-bottom: 16px; font-size: 15px; }
    .footer { margin-top: 32px; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 16px; }
  </style>
</head>
<body>
  <p>Hey ${displayName},</p>
  <p>Jatinder here from Hookpost.</p>
  <p>I noticed you created an account on Hookpost recently${orgName ? ` for <strong>${orgName}</strong>` : ''}, but haven't had a chance to launch your first post yet.</p>
  <p>Are you looking to manage your personal brand, or client accounts across multiple social platforms?</p>
  <p>If you ran into any friction during setup or have questions about our multi-platform scheduling (LinkedIn, X, Instagram, Facebook, Threads, Slack, Discord), just reply directly to this email. I read and respond to every message personally.</p>
  <p>Looking forward to hearing your thoughts,</p>
  <p><strong>Jatinder Mahajan</strong><br>Founder, Hookpost<br><a href="${appUrl}">hookpost.hookstep.in</a></p>
  <div class="footer">
    Sent by Hookpost, Singapore & India.<br>
    To update your email preferences or unsubscribe, please reply with "Unsubscribe".
  </div>
</body>
</html>`;
    return { subject, html, text };
  }

  if (stage === 'STAGE_2_FEATURES') {
    const subject = 'Publish across 17+ platforms in 1 click (Feature Spotlight) 🚀';
    const text = `Hey ${displayName},\n\nManaging multiple social media accounts doesn't have to be a full-time chore.\n\nWith Hookpost, you get:\n• 1-Click Multi-Posting across LinkedIn, X/Twitter, Instagram, Threads, Facebook, Slack, and Discord.\n• Unified Visual Calendar: Drag-and-drop scheduling with optimal posting slots.\n• AI Caption Engine: Craft platform-native hooks and threads in seconds.\n• Developer-First Tools: Cursor and Claude native MCP server + CLI.\n\nActivate your access with 50% off using code ${discountCode}:\n${appUrl}\n\nBest,\nThe Hookpost Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hookpost Features</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #F3F4F6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 12px; overflow: hidden; }
    .header { padding: 32px 24px; text-align: center; background: linear-gradient(180deg, #1E1B4B 0%, #111827 100%); border-bottom: 1px solid #374151; }
    .badge { display: inline-block; background-color: rgba(99, 102, 241, 0.15); color: #818CF8; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.05em; }
    .content { padding: 32px 24px; }
    .feature-card { background-color: #1F2937; border: 1px solid #374151; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .feature-title { font-size: 15px; font-weight: 600; color: #E0E7FF; margin-bottom: 4px; }
    .feature-desc { font-size: 13px; color: #9CA3AF; margin: 0; }
    .btn { display: inline-block; background-color: #4F46E5; color: #FFFFFF !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-align: center; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #1F2937; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="container">
      <div class="header">
        <div class="badge">Feature Spotlight</div>
        <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 16px 0 8px 0;">Publish to 17+ Channels in 1 Click</h1>
        <p style="color: #9CA3AF; font-size: 14px; margin: 0;">Save 10+ hours every week with automated scheduling.</p>
      </div>
      <div class="content">
        <p style="font-size: 15px; color: #D1D5DB; line-height: 1.6;">Hey <strong>${displayName}</strong>,</p>
        <p style="font-size: 14px; color: #9CA3AF; line-height: 1.6;">Switching between 6 different tabs to post the same update is a massive time sink. Hookpost unifies your entire publishing stack into one lightning-fast dashboard.</p>
        
        <div class="feature-card">
          <div class="feature-title">📅 Unified Visual Calendar</div>
          <p class="feature-desc">Drag-and-drop posts, visualize scheduling cadence, and preview exact layouts for LinkedIn, X, Instagram, and Discord.</p>
        </div>

        <div class="feature-card">
          <div class="feature-title">🤖 AI Caption & Thread Generator</div>
          <p class="feature-desc">Transform a single raw thought into high-engagement platform-specific posts, threads, and hashtags.</p>
        </div>

        <div class="feature-card">
          <div class="feature-title">⚡ Developer CLI & Native Cursor/Claude MCP</div>
          <p class="feature-desc">Schedule posts directly from your IDE or terminal without ever opening a browser.</p>
        </div>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="${appUrl}" class="btn">Explore Hookpost Features →</a>
        </div>
        <p style="text-align: center; font-size: 13px; color: #818CF8; margin: 0;">Use launch code <strong>${discountCode}</strong> for 50% off any plan.</p>
      </div>
      <div class="footer">
        © 2026 Hookpost. Built for creators & growth teams.<br>
        <a href="${appUrl}/privacy" style="color: #6B7280; text-decoration: underline;">Privacy</a> • <a href="${appUrl}/terms" style="color: #6B7280; text-decoration: underline;">Terms</a>
      </div>
    </div>
  </div>
</body>
</html>`;
    return { subject, html, text };
  }

  // STAGE_1_LAUNCH
  const subject = `Hookpost is live: USD & INR pricing unlocked + 50% Launch Access 🚀`;
  const text = `Hey ${displayName},\n\nWe noticed you signed up for Hookpost${orgName ? ` (${orgName})` : ''} recently!\n\nWe have just rolled out a major platform update:\n• Multi-Currency Support: Live in both INR (₹) and USD ($).\n• Standard Plan now starting at just ${discountedMonthly}/month (50% off with code ${discountCode})!\n• 1-Click cross-platform publishing across LinkedIn, X/Twitter, Instagram, Threads, Facebook, Slack & Discord.\n• Native Claude/Cursor MCP integration and developer CLI.\n\nClaim your 50% launch discount here:\n${appUrl}\n\nBest regards,\nJatinder & The Hookpost Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hookpost Launch Offer</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090D16; color: #F3F4F6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1F2937; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { padding: 36px 24px; text-align: center; background: radial-gradient(circle at top, rgba(79, 70, 229, 0.25) 0%, #111827 80%); border-bottom: 1px solid #1F2937; }
    .badge { display: inline-block; background-color: rgba(99, 102, 241, 0.15); color: #A5B4FC; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.08em; }
    .content { padding: 32px 28px; }
    .pricing-box { background: linear-gradient(180deg, #1F2937 0%, #171F2E 100%); border: 1px solid #374151; border-radius: 10px; padding: 24px; margin: 24px 0; text-align: center; }
    .price-strike { font-size: 18px; color: #9CA3AF; text-decoration: line-through; margin-right: 8px; }
    .price-active { font-size: 36px; font-weight: 800; color: #60A5FA; }
    .price-period { font-size: 14px; color: #9CA3AF; }
    .coupon-pill { display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px dashed #10B981; color: #34D399; font-family: monospace; font-size: 15px; font-weight: 700; padding: 6px 16px; border-radius: 6px; margin: 12px 0 4px 0; }
    .btn { display: block; background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%); color: #FFFFFF !important; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 24px; border-radius: 8px; text-align: center; margin-top: 16px; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.4); }
    .features-list { list-style: none; padding: 0; margin: 20px 0; }
    .features-list li { font-size: 14px; color: #D1D5DB; margin-bottom: 10px; display: flex; align-items: center; }
    .features-list li span { color: #10B981; margin-right: 10px; font-weight: bold; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #1F2937; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="container">
      <div class="header">
        <div class="badge">✨ MULTI-CURRENCY LIVE &amp; 50% LAUNCH DISCOUNT</div>
        <h1 style="color: #FFFFFF; font-size: 26px; font-weight: 800; margin: 16px 0 8px 0;">Unlock Your Full Social Workflow</h1>
        <p style="color: #9CA3AF; font-size: 14px; margin: 0;">Publish across LinkedIn, X, Instagram, Facebook, Slack &amp; Discord.</p>
      </div>
      <div class="content">
        <p style="font-size: 15px; color: #E5E7EB; line-height: 1.6;">Hey <strong>${displayName}</strong>,</p>
        <p style="font-size: 14px; color: #9CA3AF; line-height: 1.6;">You created an account on Hookpost${orgName ? ` for <strong>${orgName}</strong>` : ''} recently. We've just introduced international multi-currency pricing (<strong>${isINR ? '₹ INR' : '$ USD'}</strong>) and wanted to welcome you with an exclusive <strong>50% launch discount</strong>.</p>
        
        <div class="pricing-box">
          <div style="font-size: 12px; font-weight: 700; color: #818CF8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Standard Creator Tier</div>
          <div>
            <span class="price-strike">${originalMonthly}</span>
            <span class="price-active">${discountedMonthly}</span>
            <span class="price-period">/ month</span>
          </div>
          <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">or ${discountedYearly}/year with annual billing</div>
          <div>
            <div class="coupon-pill">CODE: ${discountCode}</div>
          </div>
          <a href="${appUrl}" class="btn">Claim 50% Off &amp; Start Publishing →</a>
        </div>

        <ul class="features-list">
          <li><span>✓</span> <strong>Connect 5-10 Social Channels:</strong> LinkedIn, X, Instagram, Threads, Facebook, Slack, Discord.</li>
          <li><span>✓</span> <strong>500+ Scheduled Posts / Month:</strong> Never miss peak engagement hours with automated queueing.</li>
          <li><span>✓</span> <strong>AI Caption Generator:</strong> Generate tailored hooks, hashtags, and carousels automatically.</li>
          <li><span>✓</span> <strong>Cursor &amp; Claude MCP Support:</strong> Schedule directly from your favorite AI coding assistant.</li>
        </ul>

        <p style="font-size: 13px; color: #6B7280; text-align: center; margin-top: 24px;">Need assistance or a custom agency tier? Simply reply directly to this email.</p>
      </div>
      <div class="footer">
        Sent by Hookpost • <a href="${appUrl}" style="color: #6366F1; text-decoration: none;">hookpost.hookstep.in</a><br>
        To unsubscribe from promotional updates, reply with "Unsubscribe".
      </div>
    </div>
  </div>
</body>
</html>`;

  return { subject, html, text };
}

function resolveCurrency(user) {
  const ip = user.ip || '';
  // Indian IP ranges: 106.*, 47.*, 49.*, 117.*, 122.*, 182.*, 157.32.*-157.51.*
  if (
    ip.startsWith('106.') ||
    ip.startsWith('47.') ||
    ip.startsWith('49.') ||
    ip.startsWith('117.') ||
    ip.startsWith('122.') ||
    ip.startsWith('182.')
  ) {
    return 'INR';
  }
  // International IPs or IPv6 (2a02:... Romania, 169.150:... Europe, 2400:... Bangladesh)
  return 'USD';
}

async function runLeadDrip(options = {}) {
  const { dryRun = false, targetEmail = null } = options;
  console.log(`\n======================================================`);
  console.log(`🚀 HOOKPOST AUTOMATED LEAD DRIP ENGINE`);
  console.log(`Mode: ${dryRun ? 'DRY-RUN (Simulated)' : 'LIVE SENDING'}`);
  console.log(`======================================================\n`);

  // Query all users without active subscriptions (tier = FREE)
  const users = await prisma.user.findMany({
    where: {
      isSuperAdmin: false,
      ...(targetEmail ? { email: targetEmail } : {})
    },
    include: {
      organizations: {
        include: {
          organization: {
            include: {
              subscription: true,
              usedCodes: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  const now = new Date();
  const summary = { processed: 0, sent: 0, skipped: 0, errors: 0 };

  for (const user of users) {
    const org = user.organizations[0]?.organization;
    if (!org) continue;

    // Only target leads who have NO active paid subscription
    const hasActiveSubscription =
      org.subscription &&
      ['STANDARD', 'TEAM', 'PRO', 'ULTIMATE'].includes(org.subscription.subscriptionTier);

    if (hasActiveSubscription) {
      continue;
    }

    // Filter out internal fixtures
    if (
      user.email.includes('reviewer@hookstep.in') ||
      user.email === 'test@hookstep.in'
    ) {
      continue;
    }

    summary.processed++;
    const daysSinceSignup = Math.floor((now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
    const currency = resolveCurrency(user);

    // Check last drip send time to enforce minimum 24-hour cooldown between emails
    const dripHistory = (org.usedCodes || [])
      .filter(c => c.code.startsWith('drip:'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (dripHistory.length > 0) {
      const lastDripTime = new Date(dripHistory[0].createdAt);
      const hoursSinceLastDrip = (now - lastDripTime) / (1000 * 60 * 60);
      if (hoursSinceLastDrip < 24) {
        console.log(`[COOLDOWN] ${user.email} (Org: ${org.name}) -> Last drip sent ${hoursSinceLastDrip.toFixed(1)}h ago. Waiting 24h before next stage.`);
        summary.skipped++;
        continue;
      }
    }

    const sentCodes = (org.usedCodes || []).map(c => c.code);
    
    let targetStage = null;
    let stageCode = null;

    if (!sentCodes.includes('drip:stage_1_launch')) {
      targetStage = 'STAGE_1_LAUNCH';
      stageCode = 'drip:stage_1_launch';
    } else if (daysSinceSignup >= 3 && !sentCodes.includes('drip:stage_2_features')) {
      targetStage = 'STAGE_2_FEATURES';
      stageCode = 'drip:stage_2_features';
    } else if (daysSinceSignup >= 7 && !sentCodes.includes('drip:stage_3_founder')) {
      targetStage = 'STAGE_3_FOUNDER';
      stageCode = 'drip:stage_3_founder';
    }

    if (!targetStage) {
      console.log(`[SKIP] ${user.email} (Org: ${org.name}) -> Already up to date for Day ${daysSinceSignup} stage.`);
      summary.skipped++;
      continue;
    }

    console.log(`\n--> Target: ${user.email} (Org: ${org.name})`);
    console.log(`    Days since signup: ${daysSinceSignup}`);
    console.log(`    Resolved Currency: ${currency} (IP: ${user.ip || 'none'})`);
    console.log(`    Selected Stage: ${targetStage} (${stageCode})`);

    const emailPayload = buildTemplate({
      userName: user.name,
      orgName: org.name,
      email: user.email,
      currency,
      stage: targetStage
    });

    console.log(`    Subject: "${emailPayload.subject}"`);

    if (dryRun) {
      console.log(`    [DRY-RUN] Would send email via Resend and record ${stageCode} in UsedCodes.`);
      summary.sent++;
      continue;
    }

    try {
      const sendRes = await resend.emails.send({
        from: 'HookStep Support <support@hookstep.in>',
        to: user.email,
        reply_to: 'support@hookstep.in',
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text
      });

      console.log(`    [SUCCESS] Delivered via Resend. Email ID:`, sendRes.data?.id || sendRes.id);

      // Record in UsedCodes for permanent idempotency
      await prisma.usedCodes.create({
        data: {
          code: stageCode,
          orgId: org.id
        }
      });
      console.log(`    [AUDIT] Recorded ${stageCode} in UsedCodes for org ${org.id}.`);
      summary.sent++;

      // Small delay between sends to avoid burst throttling
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`    [ERROR] Failed to send to ${user.email}:`, err.message || err);
      summary.errors++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`SUMMARY: Processed: ${summary.processed} | Sent: ${summary.sent} | Skipped: ${summary.skipped} | Errors: ${summary.errors}`);
  console.log(`======================================================\n`);
  return summary;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetArg = args.find(a => a.startsWith('--target='));
  const targetEmail = targetArg ? targetArg.split('=')[1] : null;

  runLeadDrip({ dryRun, targetEmail })
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runLeadDrip, buildTemplate, resolveCurrency };
