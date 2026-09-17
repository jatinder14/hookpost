const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Refilling form...');
  await session.eval(`(() => {
    const form = document.querySelector('form.create-app-form') || document.querySelector('form');
    if (!form) return;
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) nameInput.value = 'Hookpost App';

    const webAppRadio = document.getElementById('app_type_web');
    if (webAppRadio) {
      webAppRadio.checked = true;
      webAppRadio.click();
    }

    const descInput = form.querySelector('textarea[name="description"]');
    if (descInput) descInput.value = 'Social media scheduler and automation tool';

    const aboutInput = form.querySelector('input[name="about_url"]');
    if (aboutInput) aboutInput.value = 'https://hookpost.hookstep.in';

    const redirectInput = document.getElementById('redirect_uri');
    if (redirectInput) redirectInput.value = 'https://hookpost.hookstep.in/integrations/social/reddit';
  })()`);

  // Locate the iframe element on screen
  const rect = await session.eval(`(() => {
    const f = document.querySelector('iframe[title="reCAPTCHA"]');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  })()`);
  console.log('reCAPTCHA iframe rect:', rect);

  if (rect) {
    const clickX = Math.round(rect.x + 28);
    const clickY = Math.round(rect.y + 38);
    console.log(`Clicking reCAPTCHA checkbox at (${clickX}, ${clickY})...`);
    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: clickX,
      y: clickY,
      button: 'left',
      clickCount: 1
    });
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: clickX,
      y: clickY,
      button: 'left',
      clickCount: 1
    });

    await session.sleep(3000);
    await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_recaptcha_clicked.png');
  }

  session.close();
}

run().catch(console.error);
