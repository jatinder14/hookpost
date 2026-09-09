const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../apps/frontend/public');

// 1. High-Res Vector Icon (Glowing Cyan & Purple Gradient Hookpost Bolt/Hook)
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e17"/>
      <stop offset="50%" stop-color="#05070a"/>
      <stop offset="100%" stop-color="#020305"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffe6"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" stroke="url(#glowGrad)" stroke-width="8"/>

  <!-- Subtle Inner Grid Glow -->
  <circle cx="256" cy="256" r="180" fill="none" stroke="#00ffe6" stroke-width="1.5" stroke-opacity="0.15" stroke-dasharray="8 8"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-opacity="0.2"/>

  <!-- Hookpost Dynamic Symbol (H + Modern Geometric Link/Lightning/Rocket Hybrid) -->
  <g filter="url(#neonGlow)">
    <!-- Main Left Stem -->
    <path d="M160 140 C160 128 170 120 182 120 L204 120 C216 120 226 128 226 140 L226 372 C226 384 216 392 204 392 L182 392 C170 392 160 384 160 372 Z" fill="url(#glowGrad)"/>
    
    <!-- Connected Bridge & Hook Arc -->
    <path d="M226 230 L290 230 C320 230 346 254 346 284 L346 304 C346 334 322 358 292 358 L256 358 C242 358 232 348 232 334 L232 326 C232 312 242 302 256 302 L284 302 C293 302 300 295 300 286 L300 282 C300 273 293 266 284 266 L226 266 Z" fill="url(#glowGrad)"/>

    <!-- Right Upward Arrow/Post Signal -->
    <path d="M306 140 C306 128 316 120 328 120 L350 120 C362 120 372 128 372 140 L372 230 C372 242 362 250 350 250 L328 250 C316 250 306 242 306 230 Z" fill="url(#accentGrad)"/>

    <!-- Top Spark Accent -->
    <circle cx="340" cy="90" r="14" fill="#00ffe6" filter="url(#neonGlow)"/>
  </g>
</svg>
`;

// 2. High-Res 1200x630 OpenGraph Banner
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a10"/>
      <stop offset="50%" stop-color="#040609"/>
      <stop offset="100%" stop-color="#020305"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00ffe6"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <filter id="blurGlow">
      <feGaussianBlur stdDeviation="80" result="blur" />
    </filter>
  </defs>

  <!-- Deep Dark Canvas -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Ambient Glow Orbs -->
  <circle cx="150" cy="150" r="220" fill="#00ffe6" opacity="0.12" filter="url(#blurGlow)"/>
  <circle cx="1050" cy="450" r="260" fill="#8b5cf6" opacity="0.15" filter="url(#blurGlow)"/>
  <circle cx="600" cy="300" r="180" fill="#ec4899" opacity="0.08" filter="url(#blurGlow)"/>

  <!-- Subtle Border Card -->
  <rect x="40" y="40" width="1120" height="550" rx="32" fill="none" stroke="#1e293b" stroke-width="2"/>

  <!-- Top Badge -->
  <g transform="translate(80, 85)">
    <rect width="320" height="42" rx="21" fill="#0f172a" stroke="#00ffe6" stroke-width="1.5" stroke-opacity="0.4"/>
    <circle cx="22" cy="21" r="6" fill="#00ffe6"/>
    <text x="38" y="27" fill="#00ffe6" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="1">#1 OPEN SOURCE ALTERNATIVE</text>
  </g>

  <!-- Brand Title -->
  <text x="80" y="210" fill="url(#textGrad)" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5">
    Hook<tspan fill="url(#cyanGrad)">post</tspan>
  </text>

  <!-- Subheadline -->
  <text x="80" y="275" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" letter-spacing="-0.5">
    Global Social Media Management &amp; AI Scheduler
  </text>

  <text x="80" y="325" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400">
    The modern, open-source Postiz &amp; Buffer alternative for 20+ social networks.
  </text>

  <!-- Feature Pills -->
  <g transform="translate(80, 390)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="220" height="48" rx="24" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="30" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">⚡ 20+ Social Networks</text>

    <!-- Pill 2 -->
    <rect x="235" y="0" width="220" height="48" rx="24" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="260" y="30" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">🤖 AI Content Agent</text>

    <!-- Pill 3 -->
    <rect x="470" y="0" width="240" height="48" rx="24" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="495" y="30" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">🌐 Free Forever Tier</text>

    <!-- Pill 4 -->
    <rect x="725" y="0" width="220" height="48" rx="24" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <text x="750" y="30" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">🔒 100% Self-Hosted</text>
  </g>

  <!-- Footer Link -->
  <text x="80" y="525" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">
    👉 https://hookpost.hookstep.in
  </text>
</svg>
`;

async function generateAssets() {
  console.log('Generating high-res Hookpost brand assets...');

  // 1. 512x512 Brand Logo
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'brand-logo.png'));
  console.log('✔ brand-logo.png (512x512)');

  // 2. 180x180 Apple Touch Icon
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✔ apple-touch-icon.png (180x180)');

  // 3. 48x48 Favicon PNG
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✔ favicon.png (48x48)');

  // 4. 32x32 / 48x48 Favicon ICO
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('✔ favicon.ico (48x48)');

  // 5. 1200x630 OpenGraph Banner
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✔ og-image.png (1200x630)');

  // 6. site.webmanifest for PWA & Browser Search integration
  const manifest = {
    name: 'Hookpost Social Media Scheduler',
    short_name: 'Hookpost',
    description: 'The #1 Open-Source Social Media Scheduler & AI Growth Platform (Postiz Alternative).',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#05070a',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        src: '/brand-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✔ site.webmanifest');
}

generateAssets().catch(console.error);
