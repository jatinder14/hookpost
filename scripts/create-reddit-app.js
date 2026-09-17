const { getOrOpenTab } = require('./cdp-browser');

async function run() {
  const { session } = await getOrOpenTab('reddit.com');

  console.log('Clicking "are you a developer? create an app..."');
  await session.eval(`(() => {
    const btns = Array.from(document.querySelectorAll('button, a, input[type="button"]'));
    const devBtn = btns.find(b => b.innerText && b.innerText.includes('create an app'));
    if (devBtn) devBtn.click();
    else if (document.getElementById('create-app-button')) document.getElementById('create-app-button').click();
  })()`);

  await session.sleep(2000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_app_form.png');

  // Inspect form inputs
  const formFields = await session.eval(`(() => {
    return Array.from(document.querySelectorAll('form input, form textarea')).map(el => ({
      name: el.name,
      type: el.type,
      id: el.id,
      value: el.value
    }));
  })()`);
  console.log('Reddit Form Fields:', JSON.stringify(formFields, null, 2));

  // Fill the form:
  // name: Hookpost
  // app_type: web app
  // description: Social scheduler for creators and developers
  // about url: https://hookpost.hookstep.in
  // redirect uri: https://hookpost.hookstep.in/integrations/social/reddit
  console.log('Filling Reddit App Form...');
  const fillRes = await session.eval(`(() => {
    const form = document.querySelector('form.create-app-form') || document.querySelector('form');
    if (!form) return 'No form found';

    // name
    const nameInput = form.querySelector('input[name="name"]');
    if (nameInput) nameInput.value = 'Hookpost App';

    // web app radio
    const webAppRadio = form.querySelector('input[value="web app"]') || form.querySelector('input[name="app_type"][value="web"]');
    if (webAppRadio) {
      webAppRadio.checked = true;
      webAppRadio.click();
    }

    // description
    const descInput = form.querySelector('textarea[name="description"]') || form.querySelector('input[name="description"]');
    if (descInput) descInput.value = 'Social media scheduler and automation tool';

    // about url
    const aboutInput = form.querySelector('input[name="about_url"]');
    if (aboutInput) aboutInput.value = 'https://hookpost.hookstep.in';

    // redirect uri
    const redirectInput = form.querySelector('input[name="redirect_uri"]');
    if (redirectInput) redirectInput.value = 'https://hookpost.hookstep.in/integrations/social/reddit';

    return 'Form filled';
  })()`);
  console.log('Fill result:', fillRes);

  await session.sleep(1500);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_form_filled.png');

  // Click create app submit button
  console.log('Submitting Reddit App Form...');
  const submitRes = await session.eval(`(() => {
    const btn = document.querySelector('form.create-app-form button[type="submit"]') || 
                Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.toLowerCase().includes('create app'));
    if (btn) {
      btn.click();
      return 'Clicked ' + btn.innerText;
    }
    return 'Submit button not found';
  })()`);
  console.log('Submit result:', submitRes);

  await session.sleep(5000);
  await session.screenshot('/Users/flexiple_jr/Desktop/hookpost/reddit_app_created.png');

  // Extract client ID and secret
  const appDetails = await session.eval(`(() => {
    const text = document.body.innerText;
    // Client ID is typically displayed under the app title or web app text
    const clientSecretEl = document.querySelector('span.secret, td.secret, input.secret') || 
                           Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('secret') && el.innerText.length > 20);
    return {
      title: document.title,
      textSnippet: text.slice(0, 1000)
    };
  })()`);
  console.log('Created App Details:', JSON.stringify(appDetails, null, 2));

  session.close();
}

run().catch(console.error);
