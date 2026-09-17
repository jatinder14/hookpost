const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Focusing category input and typing...');
  await session.eval(`(() => {
    const catInput = document.querySelector('input[aria-label="Category (required)"]') || document.getElementById('_r_2q_');
    if (catInput) {
      catInput.focus();
      catInput.value = '';
    }
  })()`);

  // We can use CDP Input.dispatchKeyEvent to realistically type "Religious"
  const word = 'Religious organization';
  for (const char of word) {
    await session.send('Input.dispatchKeyEvent', { type: 'keyDown', text: char, unmodifiedText: char });
    await session.send('Input.dispatchKeyEvent', { type: 'keyUp' });
    await session.sleep(50);
  }

  await session.sleep(2000);

  // Take screenshot to see the dropdown
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_cat_dropdown.png');

  // Select the first suggestion
  const clickedOpt = await session.eval(`(() => {
    const items = Array.from(document.querySelectorAll('div[role="option"], li[role="option"], ul li, div[role="listbox"] div'));
    const valid = items.filter(el => el.innerText && el.innerText.toLowerCase().includes('religious'));
    if (valid.length > 0) {
      valid[0].click();
      return 'Clicked: ' + valid[0].innerText;
    }
    // Fallback to any option in listbox
    const anyOpt = document.querySelector('div[role="option"]');
    if (anyOpt) {
      anyOpt.click();
      return 'Clicked first option: ' + anyOpt.innerText;
    }
    return 'No option found, found elements: ' + items.slice(0, 10).map(e => e.innerText).join(' | ');
  })()`);
  console.log('Category click result:', clickedOpt);

  await session.sleep(1500);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_cat_selected.png');

  // Now click Create Page
  console.log('Clicking Create Page...');
  const res = await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const btn = buttons.find(b => b.innerText && b.innerText.trim() === 'Create Page' && b.getAttribute('aria-disabled') !== 'true');
    if (btn) {
      btn.click();
      return 'Clicked active Create Page button';
    }
    return 'Button not active yet: ' + buttons.map(b => b.innerText + ' (' + b.getAttribute('aria-disabled') + ')').join(', ');
  })()`);
  console.log('Create Page click result:', res);

  await session.sleep(8000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_created_final.png');

  session.close();
}

run().catch(console.error);
