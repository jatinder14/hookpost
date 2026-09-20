const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const APPLIED_FILE = path.join(__dirname, 'applied-jobs.json');
const LOG_FILE = path.join(__dirname, 'auto-apply.log');

// Target High-Paying Searches (Remote + Visa Relocation with Easy Apply filter f_AL=true)
const SEARCH_QUERIES = [
  // Worldwide Remote High-Pay Staff/Lead/Principal
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Staff%20Software%20Engineer&location=Worldwide',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Principal%20Engineer&location=Worldwide',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Lead%20AI%20Engineer&location=Worldwide',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Senior%20Backend%20Engineer%20Node&location=Worldwide',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Founding%20Engineer%20Remote&location=Worldwide',
  // Europe Relocation / Remote Visa
  'https://www.linkedin.com/jobs/search/?f_AL=true&keywords=software%20engineer%20visa%20sponsorship&location=Germany',
  'https://www.linkedin.com/jobs/search/?f_AL=true&keywords=relocation%20software%20engineer&location=Netherlands',
  'https://www.linkedin.com/jobs/search/?f_AL=true&keywords=software%20engineer%20relocation&location=European%20Union',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Staff%20Software%20Engineer&location=United%20Kingdom',
  // US High-Paying Remote
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Staff%20Engineer%20150k&location=United%20States',
  'https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=Lead%20Backend%20Engineer%20Remote&location=United%20States',
];

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_FILE, line + '\n');
  } catch (e) {}
}

function loadApplied() {
  if (fs.existsSync(APPLIED_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(APPLIED_FILE, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveApplied(appliedList) {
  fs.writeFileSync(APPLIED_FILE, JSON.stringify(appliedList, null, 2), 'utf8');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runInTab(jsCode) {
  const cleanCode = jsCode.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const script = `
tell application "Google Chrome"
    repeat with w in every window
        repeat with t in every tab of w
            if URL of t contains "linkedin.com/jobs" then
                return execute t javascript "${cleanCode}"
            end if
        end repeat
    end repeat
    return "NO_TAB"
end tell
`;
  try {
    const res = execSync('osascript', { input: script, encoding: 'utf8', timeout: 20000 });
    return res.trim();
  } catch (err) {
    return 'ERROR: ' + err.message;
  }
}

function navigateTab(url) {
  const script = `
tell application "Google Chrome"
    repeat with w in every window
        repeat with t in every tab of w
            if URL of t contains "linkedin.com/jobs" then
                set URL of t to "${url}"
                return "NAVIGATED"
            end if
        end repeat
    end repeat
    return "NO_TAB"
end tell
`;
  try {
    const res = execSync('osascript', { input: script, encoding: 'utf8', timeout: 15000 });
    return res.trim();
  } catch (err) {
    return 'ERROR: ' + err.message;
  }
}

// Scrapes job IDs from the current search results page
function getJobIdsFromSearchPage() {
  const code = `(() => {
    const links = Array.from(document.querySelectorAll('a.job-card-list__title--link, a.job-card-container__link, div[data-job-id], li[data-occludable-job-id]'));
    const ids = new Set();
    for (const el of links) {
      const id = el.getAttribute('data-job-id') || el.getAttribute('data-occludable-job-id');
      if (id) {
        ids.add(id);
        continue;
      }
      const href = el.href || '';
      const match = href.match(/\\/jobs\\/view\\/([0-9]+)/);
      if (match) ids.add(match[1]);
    }
    return JSON.stringify(Array.from(ids));
  })()`;
  const res = runInTab(code);
  try {
    return JSON.parse(res);
  } catch (e) {
    return [];
  }
}

// Inspects the current job page
function getJobInfo() {
  const code = `(() => {
    const title = document.querySelector('h1')?.innerText?.trim() || document.title;
    const company = document.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name')?.innerText?.trim() || '';
    const bodyText = document.body.innerText;
    const hasEasyApply = !!Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().includes('Easy Apply'));
    const isAlreadyApplied = bodyText.includes('Applied') || bodyText.includes('Application submitted');
    return JSON.stringify({ title, company, hasEasyApply, isAlreadyApplied });
  })()`;
  const res = runInTab(code);
  try {
    return JSON.parse(res);
  } catch (e) {
    return { title: '', company: '', hasEasyApply: false, isAlreadyApplied: false };
  }
}

// Solves one step of the Easy Apply modal
function solveModalStep() {
  const code = `(() => {
    // 1. Check if Submit button exists and is enabled
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText && b.innerText.trim() === 'Submit application');
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.click();
      return { status: 'SUBMITTED' };
    }

    // 2. Fill Phone & Country Code if present
    const phoneInput = document.querySelector('input[type="tel"], input[id*="phoneNumber"]');
    if (phoneInput && !phoneInput.value) {
      phoneInput.value = '9781948706';
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const selects = Array.from(document.querySelectorAll('select'));
    const countrySelect = selects.find(s => Array.from(s.options).some(o => o.text.includes('+91') || o.value.toLowerCase() === 'in'));
    if (countrySelect && countrySelect.value !== 'in') {
      const indOption = Array.from(countrySelect.options).find(o => o.text.includes('+91') || o.value.toLowerCase() === 'in');
      if (indOption) {
        countrySelect.value = indOption.value;
        countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // 3. Make sure latest resume is selected if resume radio list is present
    const resumeRadios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => {
      const parent = r.closest('li, div');
      return parent && (parent.innerText.includes('.pdf') || parent.innerText.includes('Resume'));
    });
    if (resumeRadios.length > 0 && !resumeRadios.some(r => r.checked)) {
      resumeRadios[0].click();
      resumeRadios[0].checked = true;
      resumeRadios[0].dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 4. Handle text inputs / textareas / questions
    const textInputs = Array.from(document.querySelectorAll('input[type="text"]:not([placeholder="Search"]), textarea'));
    for (const input of textInputs) {
      if (!input.value) {
        const parentText = (input.closest('.jobs-easy-apply-form-element, div') || input.parentElement)?.innerText?.toLowerCase() || '';
        let answer = '7'; // default senior/staff years
        if (parentText.includes('salary') || parentText.includes('compensation') || parentText.includes('rate')) {
          answer = '$150,000 USD';
        } else if (parentText.includes('location') || parentText.includes('where are you') || parentText.includes('city') || parentText.includes('country')) {
          answer = 'India (Remote / Relocation)';
        } else if (parentText.includes('notice') || parentText.includes('how soon') || parentText.includes('start date')) {
          answer = 'Immediately';
        } else if (parentText.includes('kinesis') || parentText.includes('kafka') || parentText.includes('streaming')) {
          answer = '4';
        } else if (parentText.includes('aws') || parentText.includes('cloud') || parentText.includes('docker') || parentText.includes('kubernetes')) {
          answer = '5';
        } else if (parentText.includes('typescript')) {
          answer = '6';
        } else if (parentText.includes('node') || parentText.includes('backend') || parentText.includes('api') || parentText.includes('coding') || parentText.includes('programming') || parentText.includes('software')) {
          answer = '7';
        }
        input.value = answer;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // 5. Handle Radio Button Groups (Yes/No questions)
    const radioGroups = {};
    Array.from(document.querySelectorAll('input[type="radio"]')).forEach(r => {
      const name = r.name || 'unnamed';
      if (!radioGroups[name]) radioGroups[name] = [];
      radioGroups[name].push(r);
    });

    for (const [name, radios] of Object.entries(radioGroups)) {
      if (radios.some(r => r.checked)) continue;
      // Find question text
      const container = radios[0].closest('fieldset, .jobs-easy-apply-form-element, div');
      const qText = container ? container.innerText.toLowerCase() : '';
      
      let chooseIndex = 0; // Default to first radio (usually Yes)
      if (qText.includes('authorized to work in the united states') && !qText.includes('sponsorship')) {
        // If US authorization is strictly asked, select No (offshore/needs sponsorship)
        chooseIndex = radios.length > 1 ? 1 : 0;
      } else if (qText.includes('require sponsorship')) {
        // Require sponsorship -> Yes
        chooseIndex = 0;
      } else if (qText.includes('criminal') || qText.includes('felony') || qText.includes('fired')) {
        // Disqualification questions -> No
        chooseIndex = radios.length > 1 ? 1 : 0;
      }

      if (radios[chooseIndex]) {
        radios[chooseIndex].click();
        radios[chooseIndex].checked = true;
        radios[chooseIndex].dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // 6. Next or Review button
    const nextBtn = buttons.find(b => b.innerText && (b.innerText.trim() === 'Next' || b.innerText.trim() === 'Review'));
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      return { status: 'NEXT', btn: nextBtn.innerText.trim() };
    }

    return { status: 'STUCK' };
  })()`;
  const res = runInTab(code);
  try {
    return JSON.parse(res);
  } catch (e) {
    return { status: 'ERROR', message: res };
  }
}

// Dismiss modal if cancelled or done
function dismissModal() {
  const code = `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const doneBtn = buttons.find(b => b.innerText && b.innerText.trim() === 'Done');
    if (doneBtn) {
      doneBtn.click();
      return 'DISMISSED_DONE';
    }
    const dismissBtn = buttons.find(b => b.getAttribute('aria-label') === 'Dismiss' || (b.innerText && b.innerText.includes('Dismiss')));
    if (dismissBtn) {
      dismissBtn.click();
      return 'CLICKED_DISMISS';
    }
    return 'NO_DISMISS';
  })()`;
  return runInTab(code);
}

// Discards unsaved application if stuck
function discardModal() {
  const code = `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const discardBtn = buttons.find(b => b.innerText && b.innerText.trim() === 'Discard');
    if (discardBtn) {
      discardBtn.click();
      return 'DISCARDED';
    }
    return 'NO_DISCARD';
  })()`;
  return runInTab(code);
}

async function applyToJob(jobId) {
  const applied = loadApplied();
  if (applied.some((a) => a.id === jobId)) {
    log(`Job ${jobId} already applied previously. Skipping.`);
    return false;
  }

  log(`Navigating to job view: ${jobId}`);
  navigateTab(`https://www.linkedin.com/jobs/view/${jobId}/`);
  await sleep(4000);

  const info = getJobInfo();
  log(`Job info: "${info.title}" at "${info.company}" | EasyApply: ${info.hasEasyApply} | AlreadyApplied: ${info.isAlreadyApplied}`);

  if (info.isAlreadyApplied) {
    applied.push({ id: jobId, title: info.title, company: info.company, status: 'already_applied', date: new Date().toISOString() });
    saveApplied(applied);
    return false;
  }

  if (!info.hasEasyApply) {
    log(`No Easy Apply for ${jobId}. Skipping.`);
    return false;
  }

  // Click Easy Apply
  const clickEasyCode = `(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim().includes('Easy Apply'));
    if (btn) {
      btn.click();
      return 'CLICKED';
    }
    return 'NOT_FOUND';
  })()`;
  const clickRes = runInTab(clickEasyCode);
  log(`Clicked Easy Apply: ${clickRes}`);
  await sleep(2500);

  // Step loop (max 10 steps)
  let step = 0;
  let success = false;
  while (step < 10) {
    step++;
    const stepResult = solveModalStep();
    log(`Step ${step} result: ${JSON.stringify(stepResult)}`);

    if (stepResult.status === 'SUBMITTED') {
      log(`>>> SUCCESS! Application successfully submitted for ${jobId} (${info.title}) <<<`);
      await sleep(2500);
      dismissModal();
      success = true;
      applied.push({
        id: jobId,
        title: info.title,
        company: info.company,
        status: 'submitted',
        date: new Date().toISOString(),
        url: `https://www.linkedin.com/jobs/view/${jobId}/`,
      });
      saveApplied(applied);
      break;
    }

    if (stepResult.status === 'NEXT') {
      await sleep(2500);
      continue;
    }

    if (stepResult.status === 'STUCK' || stepResult.status === 'ERROR') {
      log(`Stuck or unsupported form on step ${step}. Aborting application.`);
      dismissModal();
      await sleep(1000);
      discardModal();
      break;
    }
  }

  await sleep(4000); // Friendly pacing
  return success;
}

async function runAutoApply() {
  log('========================================================');
  log('Starting LinkedIn Autonomous Bulk Application Daemon');
  log('Target: $100k-$250k / Staff / Principal / Lead / Relocation');
  log('========================================================');

  let totalAppliedSession = 0;

  for (const query of SEARCH_QUERIES) {
    log(`Searching: ${query}`);
    navigateTab(query);
    await sleep(5000);

    const jobIds = getJobIdsFromSearchPage();
    log(`Found ${jobIds.length} jobs on search page.`);

    for (const jobId of jobIds) {
      try {
        const applied = await applyToJob(jobId);
        if (applied) {
          totalAppliedSession++;
          log(`Total applied in this session: ${totalAppliedSession}`);
        }
      } catch (err) {
        log(`Error processing job ${jobId}: ${err.message}`);
        dismissModal();
        await sleep(1000);
        discardModal();
      }
    }

    log(`Finished query. Resting 6 seconds before next query rotation...`);
    await sleep(6000);
  }

  log(`Batch run complete. Total applications submitted: ${totalAppliedSession}`);
}

runAutoApply().catch((err) => log('Fatal error: ' + err.message));
