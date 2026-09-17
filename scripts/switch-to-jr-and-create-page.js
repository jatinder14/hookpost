const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Switching to JR Gupta profile...');
  const res = await session.eval(`(() => {
    // Find JR Gupta button/div
    const items = Array.from(document.querySelectorAll('div[role="button"], span, div'));
    const jrGuptaEl = items.find(el => el.innerText && el.innerText.trim() === 'JR Gupta');
    if (jrGuptaEl) {
      jrGuptaEl.click();
      return 'Clicked JR Gupta';
    }
    return 'JR Gupta element not found';
  })()`);
  console.log('Switch result:', res);

  await session.sleep(5000);
  console.log('Now navigating to https://www.facebook.com/pages/create/ ...');
  await session.navigate('https://www.facebook.com/pages/create/');
  await session.sleep(3000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_create_2.png');
  console.log('URL now:', await session.eval('window.location.href'));

  session.close();
}

run().catch(console.error);
