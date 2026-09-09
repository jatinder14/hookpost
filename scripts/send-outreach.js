const https = require('https');

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "HookStep Support <support@hookstep.in>";

// Targeted growth agencies, marketing studios, and freelance social media consultants
const PROSPECTS = [
  { to: "hello@growthhackers.com", name: "GrowthHackers Team", company: "GrowthHackers" },
  { to: "contact@socialpilot.co", name: "Agency Partnerships", company: "Social Agency Hub" },
  { to: "info@digitallywired.com", name: "Digital Studio", company: "Digitally Wired" },
  { to: "growth@hyperscale.agency", name: "Hyperscale Growth", company: "Hyperscale Agency" },
  { to: "team@socialtrend.agency", name: "SocialTrend Team", company: "SocialTrend" },
  { to: "hello@contentstudio.io", name: "Content Studio Lead", company: "Content Studio" },
  { to: "partners@growthcollective.com", name: "Growth Collective", company: "Growth Collective" },
  { to: "info@socialmediaexaminer.com", name: "Editorial Team", company: "Social Media Examiner" },
  { to: "contact@marketermilk.com", name: "MarketerMilk Team", company: "MarketerMilk" },
  { to: "marketing@startupgrowth.agency", name: "Startup Growth Lead", company: "Startup Growth Agency" },
  { to: "hello@nexusgrowth.io", name: "Nexus Media", company: "Nexus Growth" },
  { to: "contact@elevatesocial.co", name: "Elevate Social", company: "Elevate Social" },
  { to: "info@viralbrands.io", name: "ViralBrands Team", company: "ViralBrands" },
  { to: "growth@pulseagency.com", name: "Pulse Agency Lead", company: "Pulse Agency" },
  { to: "team@amplifygrowth.co", name: "Amplify Growth", company: "Amplify Growth" },
  { to: "support@hookstep.in", name: "HookStep Admin Verification", company: "HookStep Internal" }
];

async function sendOutreachEmail({ to, name, company }) {
  const subject = `Scaling ${company || 'your'} social scheduling & AI automation with Hookpost`;
  
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
      <div style="margin-bottom: 20px; border-bottom: 2px solid #FF4CE2; padding-bottom: 12px;">
        <h2 style="color: #FF4CE2; margin: 0 0 4px 0; font-size: 24px;">Hookpost 🚀</h2>
        <p style="font-size: 13px; color: #6b7280; margin: 0; font-weight: 500;">Open-Source Social Media Management & Multi-Agent AI Copilot</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #111827;">Hi ${name || 'there'},</p>

      <p style="font-size: 15px; line-height: 1.6; color: #374151;">
        If your agency manages content across multiple platforms, tools like Buffer and Hootsuite can quickly cost $150–$300/month for basic features without modern AI automation.
      </p>

      <p style="font-size: 15px; line-height: 1.6; color: #374151;">
        We just launched <strong>Hookpost</strong> (<a href="https://hookpost.hookstep.in" style="color: #FF4CE2; text-decoration: none; font-weight: 600;">hookpost.hookstep.in</a>) — an open-source, all-in-one scheduler built for growth teams and creators:
      </p>

      <div style="background-color: #f9fafb; border-left: 4px solid #FF4CE2; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <ul style="font-size: 14px; line-height: 1.7; color: #374151; margin: 0; padding-left: 18px;">
          <li><strong>30+ Networks</strong>: LinkedIn, X (Twitter), Instagram, TikTok, YouTube, Threads, Bluesky, Reddit, Telegram, etc.</li>
          <li><strong>Multi-Agent AI Copilot</strong>: Prompt Claude, ChatGPT, Codex, or OpenClaw directly via CLI & MCP server to synthesize copy and schedule posts.</li>
          <li><strong>Workspace Multi-Tenancy</strong>: Separate client brands, custom tags, and unified analytics.</li>
          <li><strong>70% Lower Cost</strong>: Transparent pricing (₹699 – ₹4,499 / $9 – $59/mo) with instant Razorpay / Stripe billing.</li>
        </ul>
      </div>

      <div style="margin: 28px 0; text-align: center;">
        <a href="https://hookpost.hookstep.in/auth" style="background-color: #FF4CE2; color: #ffffff; padding: 14px 28px; font-weight: 600; font-size: 15px; text-decoration: none; border-radius: 9999px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 76, 226, 0.3);">
          Start Your 7-Day Free Trial ($0) &rarr;
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
        You can also inspect our open-source repo or self-host via Docker: <a href="https://github.com/jatinder14/hookpost" style="color: #FF4CE2; text-decoration: none;">github.com/jatinder14/hookpost</a>.
      </p>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <p style="font-size: 12px; color: #9ca3af; margin: 0;">
        Hookpost by HookStep Technologies • support@hookstep.in • <a href="https://hookpost.hookstep.in/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> • <a href="https://hookpost.hookstep.in/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
      </p>
    </div>
  `;

  const payload = JSON.stringify({
    from: FROM_EMAIL,
    to: [to],
    subject: subject,
    html: html,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ [${res.statusCode}] Sent outreach to: ${to} (ID: ${parsed.id})`);
            resolve(parsed);
          } else {
            console.warn(`⚠️ [${res.statusCode}] Skipped/Error for ${to}:`, parsed.message || parsed);
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`⚠️ Network error for ${to}:`, err.message);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

async function runCampaign() {
  console.log(`🚀 Starting Automated Outbound Email Campaign (${PROSPECTS.length} Prospects)...`);
  let successCount = 0;
  
  for (const prospect of PROSPECTS) {
    const res = await sendOutreachEmail(prospect);
    if (res) successCount++;
    // Sleep 1s between sends to stay well within rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`🏁 Outreach Campaign Complete: ${successCount} emails dispatched successfully from ${FROM_EMAIL}`);
}

runCampaign();
