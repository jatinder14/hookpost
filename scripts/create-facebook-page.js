const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  console.log('Navigating to Facebook Pages Create...');
  const { session, tab } = await getOrOpenTab('facebook.com', 'https://www.facebook.com/pages/create/');
  
  await session.navigate('https://www.facebook.com/pages/create/');
  console.log('Navigated. Current URL:', await session.eval('window.location.href'));
  await session.sleep(3000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_create_1.png');

  // Check inputs on the page
  const pageState = await session.eval(`(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map(el => ({
      tagName: el.tagName,
      type: el.type,
      name: el.name,
      placeholder: el.placeholder,
      ariaLabel: el.getAttribute('aria-label'),
      value: el.value,
      rect: el.getBoundingClientRect()
    }));
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button')).map(b => ({
      text: b.innerText,
      ariaLabel: b.getAttribute('aria-label'),
      disabled: b.getAttribute('aria-disabled')
    }));
    return { title: document.title, url: window.location.href, inputs, buttons: buttons.slice(0, 20) };
  })()`);

  console.log('Page State:', JSON.stringify(pageState, null, 2));

  session.close();
}

run().catch(e => {
  console.error('Error running FB page script:', e);
  process.exit(1);
});
