const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Clicking bright blue Create Page button...');
  const res = await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const btn = buttons.find(b => b.innerText && b.innerText.trim() === 'Create Page' && b.getAttribute('aria-disabled') !== 'true');
    if (btn) {
      btn.click();
      return 'Clicked active Create Page button';
    }
    return 'Not found';
  })()`);
  console.log('Result:', res);

  console.log('Waiting for Facebook page creation...');
  await session.sleep(8000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_created_step2.png');
  const pageInfo = await session.eval(`(() => {
    return {
      url: window.location.href,
      title: document.title,
      bodySnippet: document.body.innerText.slice(0, 300)
    };
  })()`);
  console.log('Page Info:', JSON.stringify(pageInfo, null, 2));

  session.close();
}

run().catch(console.error);
