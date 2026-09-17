const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com', 'https://www.facebook.com/settings/?tab=linked_instagram');
  await session.navigate('https://www.facebook.com/settings/?tab=linked_instagram');
  await session.sleep(3000);

  console.log('Clicking "Connect account" button...');
  const res = await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const btn = buttons.find(b => b.innerText && b.innerText.includes('Connect account'));
    if (btn) {
      btn.click();
      return 'Clicked Connect account';
    }
    return 'Not found';
  })()`);
  console.log('Result:', res);

  await session.sleep(3000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_connect_ig_modal.png');

  // Inspect modal buttons
  const modalInfo = await session.eval(`(() => {
    const dialog = document.querySelector('div[role="dialog"]') || document.body;
    const buttons = Array.from(dialog.querySelectorAll('div[role="button"], button')).map(b => b.innerText);
    return {
      text: dialog.innerText.slice(0, 500),
      buttons
    };
  })()`);
  console.log('Modal Info:', JSON.stringify(modalInfo, null, 2));

  session.close();
}

run().catch(console.error);
