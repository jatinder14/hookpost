const https = require('https');

const host = "hookpost.hookstep.in";
// Three key files sit in apps/frontend/public/. Only this one is the key Bing
// actually has on record for this host - submitting with either of the others
// returns 403 UserForbiddedToAccessSite, which is what made IndexNow look
// broken. All three files serve 200 and are reachable by bingbot, so the key
// file was never the problem; the wrong key was being sent.
const key = "56f6b8bac4c0a3c46b398c49b660fb4e";
const keyLocation = `https://${host}/${key}.txt`;
// Pull the live sitemap instead of a hand-maintained list of seven URLs -
// that list went stale the moment the sitemap changed, and IndexNow accepts
// up to 10,000 URLs per request.
const urlList = require('child_process')
  .execSync(`curl -s -m 25 https://${host}/sitemap.xml`)
  .toString()
  .match(/<loc>([^<]*)<\/loc>/g)
  .map((m) => m.replace(/<\/?loc>/g, ''));

const payload = JSON.stringify({
  host: host,
  key: key,
  keyLocation: keyLocation,
  urlList: urlList
});

console.log("🚀 Pinging IndexNow (Bing & Search Engines) with URLs:", urlList);

const req = https.request({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`✅ IndexNow HTTP Status: ${res.statusCode} (${res.statusMessage})`);
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log("🎉 Successfully submitted all Hookpost URLs to IndexNow search engine crawler network!");
    } else {
      console.log("Response:", data);
    }
  });
});

req.on('error', console.error);
req.write(payload);
req.end();
