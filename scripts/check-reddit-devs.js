const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Navigating to https://developers.reddit.com ...');
  await session.navigate('https://developers.reddit.com');
  await session.sleep(3000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_developers_home.png');

  const info = await session.eval(`(() => {
    return {
      title: document.title,
      url: window.location.href,
      text: document.body.innerText.slice(0, 500)
    };
  })()`);
  console.log('Reddit Developers Info:', JSON.stringify(info, null, 2));

  session.close();
}

run().catch(console.error);
