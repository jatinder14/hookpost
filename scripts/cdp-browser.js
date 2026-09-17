const WebSocket = require('ws');
const fs = require('fs');

class CdpSession {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.id && this.callbacks.has(msg.id)) {
            const { resolve, reject } = this.callbacks.get(msg.id);
            this.callbacks.delete(msg.id);
            if (msg.error) {
              reject(new Error(msg.error.message || JSON.stringify(msg.error)));
            } else {
              resolve(msg.result);
            }
          }
        } catch (e) {
          console.error('WS parse error:', e);
        }
      });
    });
  }

  async send(method, params = {}) {
    const msgId = ++this.id;
    return new Promise((resolve, reject) => {
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval exception');
    }
    return res.result ? res.result.value : undefined;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await this.sleep(3000);
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot to:', filePath);
  }

  async sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function getOrOpenTab(urlMatch, openUrlIfNotFound) {
  const tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  let tab = tabs.find((t) => t.type === 'page' && (!urlMatch || t.url.includes(urlMatch)));
  if (!tab && openUrlIfNotFound) {
    tab = await (
      await fetch(
        `http://127.0.0.1:9222/json/new?${encodeURIComponent(openUrlIfNotFound)}`,
        { method: 'PUT' }
      )
    ).json();
    await new Promise((r) => setTimeout(r, 2000));
  }
  if (!tab) {
    throw new Error('Tab not found and could not be created');
  }
  const session = new CdpSession(tab.webSocketDebuggerUrl);
  await session.connect();
  return { tab, session };
}

module.exports = { CdpSession, getOrOpenTab };
