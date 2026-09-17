const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  console.log('Navigating to Reddit Apps prefs...');
  const { session } = await getOrOpenTab('reddit.com', 'https://old.reddit.com/prefs/apps/');
  await session.navigate('https://old.reddit.com/prefs/apps/');
  await session.sleep(3000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_apps_1.png');

  const redditState = await session.eval(`(() => {
    return {
      title: document.title,
      url: window.location.href,
      loggedIn: document.body.innerText.includes('logout') || !document.body.innerText.includes('login'),
      text: document.body.innerText.slice(0, 500)
    };
  })()`);

  console.log('Reddit State:', JSON.stringify(redditState, null, 2));
  session.close();
}

run().catch(console.error);
