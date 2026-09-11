/**
 * High-Converting Multi-Currency Lead Nurture Email Templates
 * Designed for maximum deliverability, mobile responsiveness, and dark-mode compatibility.
 */

export interface LeadEmailParams {
  userName?: string | null;
  orgName?: string | null;
  email: string;
  currency: 'INR' | 'USD';
  stage: 'STAGE_1_LAUNCH' | 'STAGE_2_FEATURES' | 'STAGE_3_FOUNDER';
  discountCode?: string;
  appUrl?: string;
}

export function generateLeadEmail(params: LeadEmailParams): { subject: string; html: string; text: string } {
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
  
  // Pricing config
  const originalMonthly = isINR ? '₹699' : '$9';
  const discountedMonthly = isINR ? '₹349' : '$4.50';
  const originalYearly = isINR ? '₹6,999' : '$79';
  const discountedYearly = isINR ? '₹3,499' : '$39.50';
  const currencySymbol = isINR ? '₹' : '$';

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

  const subject = `Hookpost is live: USD & INR pricing unlocked + 50% Launch Access 🚀`;
  const text = `Hey ${displayName},\n\nWe noticed you signed up for Hookpost${orgName ? ` (${orgName})` : ''} recently!\n\nWe have just rolled out a major platform update:\n• Multi-Currency Support: Live in both INR (₹) and USD ($).\n• Standard Plan now starting at just ${discountedMonthly}/month (50% off with code ${discountCode})!\n• 1-Click cross-platform publishing across LinkedIn, X/Twitter, Instagram, Threads, Facebook, Slack & Discord.\n• Native Claude/Cursor MCP integration and developer CLI.\n\nClaim your 50% launch discount here:\n${appUrl}\n\nBest regards,\nJatinder & The Hookpost Team\n\nTo unsubscribe from promotional updates, reply with "Unsubscribe".`;

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
