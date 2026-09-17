const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Clicking Religious organization option...');
  // Click at the exact coordinates of "Religious organization" dropdown item
  await session.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: 80,
    y: 525,
    button: 'left',
    clickCount: 1
  });
  await session.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: 80,
    y: 525,
    button: 'left',
    clickCount: 1
  });

  await session.sleep(2000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_after_cat_click.png');

  console.log('Checking Create Page button status...');
  const btnStatus = await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const btn = buttons.find(b => b.innerText && b.innerText.trim() === 'Create Page');
    if (!btn) return 'Not found';
    return {
      text: btn.innerText,
      ariaDisabled: btn.getAttribute('aria-disabled'),
      rect: btn.getBoundingClientRect()
    };
  })()`);
  console.log('Button status:', JSON.stringify(btnStatus, null, 2));

  if (btnStatus && btnStatus.ariaDisabled !== 'true') {
    console.log('Clicking Create Page button at center of rect...');
    const x = Math.round(btnStatus.rect.x + btnStatus.rect.width / 2);
    const y = Math.round(btnStatus.rect.y + btnStatus.rect.height / 2);
    await session.send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
    await session.send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1
    });

    console.log('Waiting for Page creation...');
    await session.sleep(7000);
    await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_created_success.png');
    console.log('Final URL:', await session.eval('window.location.href'));
  }

  session.close();
}

run().catch(console.error);
