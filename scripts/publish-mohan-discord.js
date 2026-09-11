const jwt = require('/home/flexiple_jr/hookpost/node_modules/jsonwebtoken');
require('/home/flexiple_jr/hookpost/node_modules/dotenv').config({ path: '/home/flexiple_jr/hookpost/.env' });

async function main() {
  const userId = '1c340590-52fe-4605-be3e-543d16948bbf';
  const orgId = '15764a35-de5b-4a23-877b-849aebc96527';
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  
  const promoImage = {
    id: '616c3cd8-2402-42bb-a3cd-67ab01a13275',
    path: 'https://media.hookstep.in/vPudzJ7ynp.png'
  };

  const textContent = "Supercharge your social presence with Hookpost! 🚀\n\nSchedule, manage, and automate your posts across LinkedIn, X, Facebook, Threads, Instagram, Slack, and Discord from one unified visual calendar.\n\n✨ Built for creators, agencies & modern growth teams:\n• Visual content calendar & automated scheduling\n• Native Claude/Cursor MCP integration & CLI\n• Multi-currency pricing now live (₹ INR & $ USD)\n\nTry it free today: https://hookpost.hookstep.in";

  const postsConfig = [
    // LinkedIn (Mohan Bhanushali)
    {
      integration: { id: 'cmtwoj33t000h3e7ezpm3iuey' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        __type: 'linkedin',
        post_as_images_carousel: false
      }
    },
    // Discord (HookStep - channel: #general)
    {
      integration: { id: 'cmtwu5dwr00013e9dr356bpma' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        __type: 'discord',
        channel: '1547921913001672809' // #general
      }
    }
  ];

  const payload = {
    type: 'now',
    shortLink: false,
    date: new Date().toISOString(),
    tags: [],
    posts: postsConfig
  };

  console.log('Publishing promotional post to Mohan Bhanushali (LinkedIn) and Discord (#general)...');
  const response = await fetch('http://127.0.0.1:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth': token,
      'showorg': orgId
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  console.log('Response Status:', response.status);
  console.log('Result:', JSON.stringify(resJson, null, 2));

  // Poll for post statuses
  if (resJson && resJson.id) {
    console.log('\nTracking post execution group:', resJson.id);
    for (let i = 0; i < 8; i++) {
      await new Promise(r => setTimeout(r, 2500));
      const checkRes = await fetch(`http://127.0.0.1:3000/posts/${resJson.id}`, {
        headers: { 'auth': token, 'showorg': orgId }
      });
      const checkData = await checkRes.json();
      console.log(`\n--- Status Poll ${i + 1} ---`);
      if (Array.isArray(checkData)) {
        for (const p of checkData) {
          console.log(`[${p.integration?.providerIdentifier?.toUpperCase()}] (${p.integration?.name}) -> Status: ${p.status} | Release ID: ${p.releaseId || 'pending'}`);
        }
        const allDone = checkData.every(p => p.status === 'PUBLISHED' || p.status === 'ERROR');
        if (allDone) {
          console.log('\nAll targeted posts finished processing!');
          break;
        }
      }
    }
  }
}

main().catch(console.error);
