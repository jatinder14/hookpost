#!/usr/bin/env node
/**
 * Push every URL in the sitemap to IndexNow after a deploy.
 *
 * IndexNow is Microsoft's instant-indexing protocol: instead of waiting for a
 * crawler to come back, you tell Bing (and Yandex, Seznam, Naver - they share
 * one endpoint) that a URL changed. It is the one Bing-specific lever that
 * actually moves indexation speed, and it is free.
 *
 * It matters more than it looks: ChatGPT's retrieval runs on Bing's index, not
 * Google's. A page Bing has not crawled cannot be cited in ChatGPT search, no
 * matter how well it ranks on Google.
 *
 * Ownership is proved by hosting the key as a plain text file at the site root
 * whose body is the key itself - that is what KEY_FILE below serves.
 */
const KEY = '797a4171deca65014e8a7999a7aa6154';
const HOST = 'hookpost.hookstep.in';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (!urls.length) {
    console.error('IndexNow: sitemap had no <loc> entries, nothing to submit');
    process.exit(1);
  }

  // The endpoint caps a batch at 10,000 URLs; this sitemap is far under that,
  // but chunk anyway so a growing sitemap never silently truncates.
  const CHUNK = 10000;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const body = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls.slice(i, i + CHUNK),
    };
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    // 200 and 202 both mean accepted. 422 means the key file did not validate.
    console.log(`IndexNow: ${body.urlList.length} urls -> HTTP ${res.status}`);
    if (res.status === 422) {
      console.error(`IndexNow: key not validated. Check ${KEY_LOCATION} serves exactly the key.`);
      process.exit(1);
    }
    if (!res.ok && res.status !== 202) process.exit(1);
  }
}

main().catch((e) => {
  console.error('IndexNow failed:', e.message);
  process.exit(1);
});
