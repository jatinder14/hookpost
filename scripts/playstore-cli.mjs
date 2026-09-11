#!/usr/bin/env node

/**
 * ==============================================================================
 * Hookpost Google Play Store CLI & Automation Controller
 * Package: in.hookstep.hookpost.twa
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const PACKAGE_NAME = 'in.hookstep.hookpost.twa';
const ASSETS_DIR = '/Users/flexiple_jr/Downloads/Hookpost-PlayStore';

// Authenticates directly using your user credentials (jatinder1901243@gmail.com) via ADC
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const play = google.androidpublisher({
  version: 'v3',
  auth,
});

async function checkStatus() {
  console.log(`Checking Google Play Developer API access for package: ${PACKAGE_NAME}...`);
  try {
    const edit = await play.edits.insert({
      packageName: PACKAGE_NAME,
    });
    console.log(`✅ SUCCESS: API Access Verified! Active Edit ID: ${edit.data.id}`);
    await play.edits.delete({
      packageName: PACKAGE_NAME,
      editId: edit.data.id,
    });
    return true;
  } catch (err) {
    if (err.message && err.message.includes('404')) {
      console.log(`⚠️ Note: Package "${PACKAGE_NAME}" is not yet created in Play Console, or the app draft needs initial creation.`);
    } else if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
      console.log(`❌ PERMISSION REQUIRED: The service account is created, but needs permission in Google Play Console.`);
      console.log(`Go to Play Console -> API access -> Find "google-play-deployer@jr-consulting-co.iam.gserviceaccount.com" -> Click "Grant access" -> Invite user.`);
    } else {
      console.error('API Response:', err.message);
    }
    return false;
  }
}

async function uploadAab(editId) {
  const aabPath = path.join(ASSETS_DIR, 'Hookpost.aab');
  if (!fs.existsSync(aabPath)) {
    throw new Error(`AAB not found at ${aabPath}`);
  }

  console.log(`Checking existing bundles or uploading ${aabPath}...`);
  try {
    const res = await play.edits.bundles.upload({
      packageName: PACKAGE_NAME,
      editId,
      media: {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(aabPath),
      },
    });
    const versionCode = res.data.versionCode;
    console.log(`✅ Uploaded AAB successfully! Version Code: ${versionCode}`);
    return versionCode;
  } catch (err) {
    if (err.message && err.message.includes('already been used')) {
      console.log('ℹ️ Version code 1 is already uploaded in Google Play Console. Listing existing bundles...');
      const bundles = await play.edits.bundles.list({ packageName: PACKAGE_NAME, editId });
      const latest = bundles.data.bundles?.[bundles.data.bundles.length - 1];
      const versionCode = latest ? latest.versionCode : 1;
      console.log(`✅ Using existing uploaded bundle with Version Code: ${versionCode}`);
      return versionCode;
    }
    throw err;
  }
}

async function updateStoreListing(editId, language = 'en-US') {
  console.log(`Updating store listing metadata for language: ${language}...`);
  await play.edits.listings.update({
    packageName: PACKAGE_NAME,
    editId,
    language,
    requestBody: {
      title: 'Hookpost: Social Scheduler',
      shortDescription: 'Plan, create, and schedule posts across all your social networks effortlessly.',
      fullDescription: `Hookpost is a modern social media management tool and content planner built for creators, marketing agencies, and teams. Plan, draft, and schedule your posts across multiple social networks from a unified visual calendar.

Key Features:

• Multi-Platform Publishing:
Schedule content seamlessly to Instagram, YouTube, X, Facebook, LinkedIn, Threads, Bluesky, Mastodon, Telegram, and Discord.

• Visual Content Calendar:
Organize weeks of social content in advance. View scheduled posts at a glance, adjust publishing times with intuitive rescheduling, and manage cross-channel campaigns.

• Media & Video Publishing:
Upload images and short-form video directly from your device. Preview posts before they go live to ensure consistent formatting across channels.

• AI Writing Assistant:
Draft engaging captions, generate relevant hashtags, and refine your social copy directly inside the post editor.

• Workspace & Team Collaboration:
Collaborate with team members across separate workspaces with role-based permissions and structured publishing workflows.

• Developer & API Tools:
Connect with the Hookpost API, CLI, and Model Context Protocol (MCP) integrations for automated workflows.

Manage your social media presence with Hookpost.`,
    },
  });
  console.log('✅ Store listing metadata updated with policy-compliant ASO copy!');
}

async function uploadImages(editId, language = 'en-US') {
  console.log('Uploading store listing graphics...');

  // 1. App Icon (512x512)
  const iconPath = path.join(ASSETS_DIR, 'app-icon-512x512.png');
  if (fs.existsSync(iconPath)) {
    console.log('Uploading 512x512 icon...');
    await play.edits.images.upload({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'icon',
      media: { mimeType: 'image/png', body: fs.createReadStream(iconPath) },
    });
    console.log('✅ Icon uploaded!');
  }

  // 2. Feature Graphic (1024x500)
  const featPath = path.join(ASSETS_DIR, 'feature-graphic-1024x500.png');
  if (fs.existsSync(featPath)) {
    console.log('Uploading 1024x500 feature graphic...');
    await play.edits.images.upload({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'featureGraphic',
      media: { mimeType: 'image/png', body: fs.createReadStream(featPath) },
    });
    console.log('✅ Feature graphic uploaded!');
  }

  // 3. Screenshots
  try {
    await play.edits.images.deleteall({
      packageName: PACKAGE_NAME,
      editId,
      language,
      imageType: 'phoneScreenshots',
    });
  } catch (e) {
    // Ignore if no existing screenshots
  }

  const screenshots = [
    'screenshot-1-calendar.png',
    'screenshot-2-ai-writer.png',
    'screenshot-3-channels.png',
  ];

  for (const shot of screenshots) {
    const shotPath = path.join(ASSETS_DIR, shot);
    if (fs.existsSync(shotPath)) {
      console.log(`Uploading screenshot: ${shot}...`);
      await play.edits.images.upload({
        packageName: PACKAGE_NAME,
        editId,
        language,
        imageType: 'phoneScreenshots',
        media: { mimeType: 'image/png', body: fs.createReadStream(shotPath) },
      });
      console.log(`✅ ${shot} uploaded!`);
    }
  }
}

async function fullDeploy() {
  console.log(`Starting automated Play Store deployment for ${PACKAGE_NAME}...`);
  const edit = await play.edits.insert({ packageName: PACKAGE_NAME });
  const editId = edit.data.id;
  console.log(`Created active edit transaction: ${editId}`);

  try {
    const versionCode = await uploadAab(editId);

    const languages = ['en-GB', 'en-US'];
    for (const lang of languages) {
      try {
        await updateStoreListing(editId, lang);
      } catch (e) {
        console.log(`Note on listing update for ${lang}:`, e.message);
      }

      try {
        await uploadImages(editId, lang);
      } catch (e) {
        console.log(`Note on images update for ${lang}:`, e.message);
      }
    }

    console.log('Assigning release to Production track...');
    await play.edits.tracks.update({
      packageName: PACKAGE_NAME,
      editId,
      track: 'production',
      requestBody: {
        releases: [
          {
            name: `1.0.0 (${versionCode})`,
            versionCodes: [versionCode.toString()],
            status: 'draft',
            releaseNotes: languages.map(lang => ({
              language: lang,
              text: 'Initial release of Hookpost: Open-source AI social media scheduler across 20+ platforms with visual calendar and native MCP copilot.',
            })),
          },
        ],
      },
    });

    console.log('Committing release edit transaction...');
    await play.edits.commit({
      packageName: PACKAGE_NAME,
      editId,
    });

    console.log('🎉 SUCCESS: App Bundle and Production Release Draft successfully committed to Google Play Console!');
  } catch (err) {
    console.error('Deployment error:', err.message);
    await play.edits.delete({ packageName: PACKAGE_NAME, editId }).catch(() => {});
    throw err;
  }
}

async function main() {
  const command = process.argv[2] || 'status';

  switch (command) {
    case 'status':
      await checkStatus();
      break;
    case 'deploy':
    case 'upload':
      await fullDeploy();
      break;
    default:
      console.log('Usage: node scripts/playstore-cli.mjs [status|deploy]');
      break;
  }
}

main().catch((err) => {
  console.error('Fatal Error:', err.message);
  process.exit(1);
});
