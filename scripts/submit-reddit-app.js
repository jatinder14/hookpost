const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Typing name, description, about url...');
  await session.eval(`(() => {
    const form = document.querySelector('form.create-app-form') || document.querySelector('form');
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) {
      nameInput.value = 'Hookpost App';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const descInput = form.querySelector('textarea[name="description"]');
    if (descInput) {
      descInput.value = 'Social media scheduler and automation tool for creators';
      descInput.dispatchEvent(new Event('input', { bubbles: true }));
      descInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const aboutInput = form.querySelector('input[name="about_url"]');
    if (aboutInput) {
      aboutInput.value = 'https://hookpost.hookstep.in';
      aboutInput.dispatchEvent(new Event('input', { bubbles: true }));
      aboutInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  })()`);

  await session.sleep(1000);

  console.log('Clicking create app button...');
  await session.eval(`(() => {
    const btn = document.querySelector('button[type="submit"]') || 
                Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('create app'));
    if (btn) btn.click();
  })()`);

  console.log('Waiting for Reddit to create the app...');
  await session.sleep(6000);

  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_app_created_success.png');

  const pageText = await session.eval(`(() => {
    return {
      title: document.title,
      url: window.location.href,
      apps: Array.from(document.querySelectorAll('.app, .developer-app, tr, div')).map(e => e.innerText).filter(t => t && (t.includes('secret') || t.includes('Hookpost'))).slice(0, 10)
    };
  })()`);
  console.log('Created App Info:', JSON.stringify(pageText, null, 2));

  session.close();
}

run().catch(console.error);
