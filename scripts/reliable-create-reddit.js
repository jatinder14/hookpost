const { getOrOpenTab } = require('./cdp-browser');

async function typeInto(session, selector, text) {
  await session.eval(`document.querySelector('${selector}').focus()`);
  await session.eval(`document.querySelector('${selector}').value = ''`);
  for (const char of text) {
    await session.send('Input.dispatchKeyEvent', { type: 'keyDown', text: char, unmodifiedText: char });
    await session.send('Input.dispatchKeyEvent', { type: 'keyUp' });
    await session.sleep(20);
  }
}

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Typing name...');
  await typeInto(session, 'input[name="name"]', 'Hookpost App');

  console.log('Typing description...');
  await typeInto(session, 'textarea[name="description"]', 'Hookpost social scheduler');

  console.log('Typing about url...');
  await typeInto(session, 'input[name="about_url"]', 'https://hookpost.hookstep.in');

  console.log('Checking redirect_uri...');
  const uri = await session.eval(`document.getElementById('redirect_uri').value`);
  if (!uri || !uri.includes('reddit')) {
    await typeInto(session, '#redirect_uri', 'https://hookpost.hookstep.in/integrations/social/reddit');
  }

  await session.sleep(1000);

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
    console.log('Waiting 3s for reCAPTCHA validation...');
    await session.sleep(3000);
  }

  console.log('Clicking create app button...');
  await session.eval(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('create app'));
    if (btn) btn.click();
  })()`);

  await session.sleep(6000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_final_app.png');

  const appsList = await session.eval(`(() => {
    return Array.from(document.querySelectorAll('.app, tr, div')).map(e => e.innerText).filter(t => t && t.includes('secret')).slice(0, 10);
  })()`);
  console.log('Apps with secret:', appsList);

  session.close();
}

run().catch(console.error);
