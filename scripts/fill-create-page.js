const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('facebook.com');

  console.log('Inspecting inputs on Create Page screen...');
  const inputsInfo = await session.eval(`(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea')).map((el, i) => ({
      index: i,
      tagName: el.tagName,
      type: el.type,
      placeholder: el.placeholder,
      ariaLabel: el.getAttribute('aria-label'),
      id: el.id
    }));
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button')).map(b => ({
      text: b.innerText,
      ariaLabel: b.getAttribute('aria-label')
    }));
    return { inputs, buttons: buttons.filter(b => b.text && b.text.includes('Create')) };
  })()`);
  console.log('Inputs info:', JSON.stringify(inputsInfo, null, 2));

  // Fill Page Name: Sacred Smiles Bhakti
  console.log('Filling Page Name...');
  await session.eval(`(() => {
    // Page name is the first text input or textarea
    const pageNameInput = Array.from(document.querySelectorAll('input[type="text"], input:not([type])')).find(i => {
      const label = i.closest('label');
      return label && label.innerText.includes('Page name');
    }) || document.querySelector('input[type="text"]');
    
    if (pageNameInput) {
      pageNameInput.focus();
      document.execCommand('insertText', false, 'Sacred Smiles Bhakti');
      pageNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      pageNameInput.dispatchEvent(new Event('change', { bubbles: true }));
      return 'Filled Page Name';
    }
    return 'Page name input not found';
  })()`);

  await session.sleep(1000);

  // Fill Category: Religious organization
  console.log('Filling Category...');
  await session.eval(`(() => {
    const catInput = Array.from(document.querySelectorAll('input[type="text"], input:not([type])')).find(i => {
      const label = i.closest('label');
      return label && label.innerText.includes('Category');
    });
    if (catInput) {
      catInput.focus();
      document.execCommand('insertText', false, 'Religious organization');
      catInput.dispatchEvent(new Event('input', { bubbles: true }));
      catInput.dispatchEvent(new Event('change', { bubbles: true }));
      return 'Filled Category';
    }
    return 'Category input not found';
  })()`);

  await session.sleep(2000);

  // Click the suggested category dropdown option
  console.log('Selecting category from suggestion dropdown...');
  const catSelected = await session.eval(`(() => {
    const listbox = document.querySelector('ul[role="listbox"], div[role="listbox"]') || document.body;
    const options = Array.from(listbox.querySelectorAll('li, div[role="option"], span'));
    const opt = options.find(o => o.innerText && o.innerText.toLowerCase().includes('religious organization'));
    if (opt) {
      opt.click();
      return 'Clicked ' + opt.innerText;
    }
    return 'Option not found, options were: ' + options.slice(0, 5).map(o => o.innerText).join(', ');
  })()`);
  console.log('Category selection:', catSelected);

  await session.sleep(1000);

  // Fill Bio: Daily Bhakti, mantras, spiritual inspiration, and wisdom.
  console.log('Filling Bio...');
  await session.eval(`(() => {
    const bioTextarea = document.querySelector('textarea');
    if (bioTextarea) {
      bioTextarea.focus();
      document.execCommand('insertText', false, 'Daily Bhakti, mantras, spiritual inspiration, and wisdom.');
      bioTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      bioTextarea.dispatchEvent(new Event('change', { bubbles: true }));
      return 'Filled Bio';
    }
    return 'Bio textarea not found';
  })()`);

  await session.sleep(1500);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_form_filled.png');

  // Click Create Page button
  console.log('Clicking Create Page button...');
  const clickCreate = await session.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
    const createBtn = buttons.find(b => b.innerText && b.innerText.trim().startsWith('Create') && b.innerText.includes('Page'));
    if (createBtn) {
      createBtn.click();
      return 'Clicked Create Page: ' + createBtn.innerText;
    }
    return 'Create Page button not found';
  })()`);
  console.log('Click create result:', clickCreate);

  await session.sleep(6000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/fb_page_created_result.png');
  console.log('Current URL after create:', await session.eval('window.location.href'));

  session.close();
}

run().catch(console.error);
