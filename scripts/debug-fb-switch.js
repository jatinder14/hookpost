const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Opening profile menu...');
  await session.eval(`document.querySelector('div[aria-label="Your profile"]').click()`);
  await session.sleep(2000);

  const switchDetails = await session.eval(`(() => {
    const dialog = document.querySelector('div[role="dialog"]') || document.body;
    const elements = Array.from(dialog.querySelectorAll('*')).filter(el => {
      const text = el.innerText || '';
      return text.includes('JR Gupta') || text.includes('See all profiles') || text.includes('Switch');
    }).map(el => ({
      tagName: el.tagName,
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      innerText: el.innerText.split('\\n')[0],
      rect: el.getBoundingClientRect()
    }));
    return elements;
  })()`);

  console.log('Switch elements:', JSON.stringify(switchDetails, null, 2));

  // Let's find the exact clickable button for switching to JR Gupta
  const clickRes = await session.eval(`(() => {
    // In Facebook, switching account is done via an element with role="button" or an svg switch button
    const buttons = Array.from(document.querySelectorAll('div[role="button"], div[role="menuitem"], a'));
    for (const b of buttons) {
      if (b.innerText && b.innerText.includes('JR Gupta')) {
        b.click();
        return 'Clicked button containing JR Gupta';
      }
    }
    // Also look for "See all profiles"
    for (const b of buttons) {
      if (b.innerText && b.innerText.includes('See all profiles')) {
        b.click();
        return 'Clicked See all profiles';
      }
    }
    return 'None found';
  })()`);
  console.log('Click action:', clickRes);

  await session.sleep(4000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_after_switch_click.png');

  session.close();
}

run().catch(console.error);
