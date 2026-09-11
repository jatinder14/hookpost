const jwt = require('/home/flexiple_jr/hookpost/node_modules/jsonwebtoken');
const { PrismaClient } = require('/home/flexiple_jr/hookpost/node_modules/@prisma/client');
const prisma = new PrismaClient();

require('/home/flexiple_jr/hookpost/node_modules/dotenv').config({ path: '/home/flexiple_jr/hookpost/.env' });

async function main() {
  const userId = '1c340590-52fe-4605-be3e-543d16948bbf';
  const orgId = '15764a35-de5b-4a23-877b-849aebc96527';
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  
  const promoImage = {
    id: '616c3cd8-2402-42bb-a3cd-67ab01a13275',
    path: 'https://media.hookstep.in/vPudzJ7ynp.png'
  };

  const textContent = "Supercharge your social presence with Hookpost! 🚀\n\nSchedule, manage, and automate your posts across X, LinkedIn, Facebook, Threads, Instagram, Slack, and Discord from one unified dashboard.\n\n✨ Built for creators, founders & teams:\n• Unified visual content calendar\n• Developer CLI & MCP Server (Claude/Cursor native)\n• Seamless multi-platform publishing\n\nGet started free: https://hookpost.hookstep.in";

  const postsConfig = [
    // X / Twitter
    {
      integration: { id: 'cmtqy6le200013eym84zjej1e' },
      value: [{
        content: "Supercharge your social presence with Hookpost! 🚀\n\nSchedule, automate, and publish across X, LinkedIn, Facebook, Threads, Slack & Discord from one unified dashboard.\n\n✨ CLI, MCP & Web app\nTry free: https://hookpost.hookstep.in",
        image: [promoImage]
      }],
      settings: {
        who_can_reply_post: 'everyone',
        post_type: 'post'
      }
    },
    // LinkedIn (Jatinder S)
    {
      integration: { id: 'cmtwofh0d00093e7ep4jpqyhy' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        post_as_images_carousel: false
      }
    },
    // Facebook (GodHand Developers)
    {
      integration: { id: 'cmtqwr35i00013ere51x8gnp3' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        post_type: 'post'
      }
    },
    // Threads (sacredsmilesbhakti)
    {
      integration: { id: 'cmtrblz5n00013ekkd6kosjwp' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {}
    },
    // Instagram (Sacred Smiles Bhakti)
    {
      integration: { id: 'cmtr76v7f00043ec40me2ajpy' },
      value: [{
        content: "Supercharge your social presence with Hookpost! 🚀\n\nSchedule, manage, and publish across 17+ channels in one visual calendar.\n\nLink in bio / explore at hookpost.hookstep.in\n\n#Hookpost #ContentCreator #BuildInPublic #SocialMediaManagement",
        image: [promoImage]
      }],
      settings: {
        post_type: 'post'
      }
    },
    // Slack (Hookpost - channel: social)
    {
      integration: { id: 'cmtwozimw000l3e7eixbef4le' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        channel: 'C0BV3GLM89H'
      }
    },
    // Discord (HookStep - channel: general)
    {
      integration: { id: 'cmtwu5dwr00013e9dr356bpma' },
      value: [{
        content: textContent,
        image: [promoImage]
      }],
      settings: {
        channel: '1546109264911663168'
      }
    },
    // Pinterest (jatinder1901243)
    {
      integration: { id: 'cmtq1ajd200033eghnga7bmfs' },
      value: [{
        content: "Supercharge your social media workflow with Hookpost. Plan, schedule, and automate across 17 platforms from one unified dashboard.",
        image: [promoImage]
      }],
      settings: {
        board: '1106548639635452777',
        title: 'Hookpost | Social Media Schedular & Creator Automation',
        link: 'https://hookpost.hookstep.in'
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

  console.log('Sending createPost request with ' + postsConfig.length + ' platforms...');
  const response = await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth': token,
      'showorg': orgId
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  console.log('API Response status:', response.status, JSON.stringify(resJson));

  if (Array.isArray(resJson)) {
    const postIds = resJson.map(p => p.postId);
    console.log('Created post IDs:', postIds);
    console.log('Waiting 15 seconds for background publishing workers...');
    await new Promise(r => setTimeout(r, 15000));
    
    const publishedPosts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: {
        id: true,
        state: true,
        releaseURL: true,
        integration: { select: { providerIdentifier: true, name: true } }
      }
    });
    console.log('Publish status:');
    for (const p of publishedPosts) {
      console.log(`- [${p.state}] ${p.integration?.providerIdentifier} (${p.integration?.name}): ${p.releaseURL || 'No URL'}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
