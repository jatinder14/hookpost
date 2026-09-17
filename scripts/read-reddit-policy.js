const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Navigating to Responsible Builder Policy article...');
  await session.navigate('https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy');
  await session.sleep(3000);

  const text = await session.eval(`(() => {
    return {
      title: document.title,
      content: document.querySelector('article, main, .article-body')?.innerText?.slice(0, 1500) || document.body.innerText.slice(0, 1500)
    };
  })()`);
  console.log('Policy Article:', JSON.stringify(text, null, 2));

  session.close();
}

run().catch(console.error);
