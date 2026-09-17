const WebSocket = require('ws');
const fs = require('fs');

async function main() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/24A772A6BEF83FB40C274551D4F46713');
  await new Promise(r => ws.on('open', r));
  
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === curId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const row = document.querySelector('[data-testid="entity-item-row-TRwgfx1CMNBps6"]');
        if (row) {
          row.click();
          return "Clicked row TRwgfx1CMNBps6";
        }
        return "Not found";
      })()
    `,
    returnByValue: true
  });
  console.log("Click result:", res);

  await new Promise(r => setTimeout(r, 3000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('razorpay_row_clicked.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved razorpay_row_clicked.png');

  const text = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('button, a, span, div, h1, h2, h3'))
          .map(e => e.innerText ? e.innerText.trim() : '')
          .filter(t => t.length > 2 && t.length < 50);
        return [...new Set(els)];
      })()
    `,
    returnByValue: true
  });
  console.log("Screen texts:", text.result.value.slice(0, 30));

  ws.close();
}

main().catch(console.error);
