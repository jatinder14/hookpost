const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  for (let i = 0; i < 4; i++) {
    console.log(`Clicking Next / Done button (step ${i+1})...`);
    await session.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
      const btn = buttons.find(b => {
        const t = (b.innerText || '').trim().toLowerCase();
        return t === 'next' || t === 'done' || t === 'skip';
      });
      if (btn) {
        btn.click();
        return 'Clicked ' + btn.innerText;
      }
      return 'No next button found';
    })()`);
    await session.sleep(3000);
  }

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_ready.png');
  const finalState = await session.eval(`(() => {
    return { url: window.location.href, title: document.title };
  })()`);
  console.log('Final Page State:', finalState);

  session.close();
}

run().catch(console.error);
