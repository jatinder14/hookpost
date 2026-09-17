const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Navigating to Linked Accounts Instagram...');
  await session.navigate('https://www.facebook.com/settings/?tab=linked_instagram');
  await session.sleep(3000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_linked_instagram.png');
  const info = await session.eval(`(() => {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 400)
    };
  })()`);
  console.log('Linked Instagram info:', JSON.stringify(info, null, 2));

  session.close();
}

run().catch(console.error);
