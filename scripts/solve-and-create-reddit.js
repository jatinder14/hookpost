const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Clicking reCAPTCHA...');
  const rect = await session.eval(`(() => {
    const f = document.querySelector('iframe[title="reCAPTCHA"]');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y };
  })()`);

  if (rect) {
    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: Math.round(rect.x + 28),
      y: Math.round(rect.y + 38),
      button: 'left',
      clickCount: 1
    });
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: Math.round(rect.x + 28),
      y: Math.round(rect.y + 38),
      button: 'left',
      clickCount: 1
    });
    console.log('Clicked checkbox. Waiting 3.5s for captcha checkmark...');
    await session.sleep(3500);
  }

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_captcha_status.png');

  console.log('Clicking create app button...');
  await session.eval(`(() => {
    const btn = document.querySelector('button[type="submit"]') || 
                Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('create app'));
    if (btn) btn.click();
  })()`);

  await session.sleep(6000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_app_result.png');

  session.close();
}

run().catch(console.error);
