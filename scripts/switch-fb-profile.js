const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Clicking top right profile icon...');
  const clicked = await session.eval(`(() => {
    const profileBtn = document.querySelector('div[aria-label="Your profile"]');
    if (profileBtn) {
      profileBtn.click();
      return 'Clicked Your profile';
    }
    return 'Profile button not found';
  })()`);
  console.log('Result:', clicked);

  await session.sleep(2000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_switch_menu.png');

  const menuItems = await session.eval(`(() => {
    return Array.from(document.querySelectorAll('div[role="menuitem"], div[role="button"], span')).map(e => e.innerText).filter(t => t && t.length > 2 && t.length < 50);
  })()`);
  console.log('Menu items:', menuItems.slice(0, 30));

  session.close();
}

run().catch(console.error);
