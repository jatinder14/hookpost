const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Clicking Done button...');
  await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const btn = buttons.find(b => b.innerText && b.innerText.trim() === 'Done');
    if (btn) btn.click();
  })()`);

  await session.sleep(6000);

  // If a "Welcome to your new Page / Take tour" modal appears, dismiss it
  await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const notNowBtn = buttons.find(b => {
      const t = (b.innerText || '').toLowerCase();
      return t.includes('not now') || t.includes('skip') || t.includes('close');
    });
    if (notNowBtn) notNowBtn.click();
  })()`);

  await session.sleep(3000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_done.png');

  const pageDetails = await session.eval(`(() => {
    return {
      url: window.location.href,
      title: document.title,
    };
  })()`);
  console.log('Created Page Details:', JSON.stringify(pageDetails, null, 2));

  session.close();
}

run().catch(console.error);
