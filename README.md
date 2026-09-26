<div align="center">
  <img src="apps/frontend/public/brand-logo.png" alt="Hookpost Logo" width="80" height="80" style="margin-bottom: 12px;"/>
  <h1>Hookpost</h1>
  <p><strong>The All-in-One Open-Source Social Media Scheduler & Multi-Agent AI Copilot</strong></p>
  <p><em>Schedule to X, LinkedIn, YouTube, Bluesky, Discord, Telegram and more from one calendar &mdash; or straight from Claude, Cursor and Windsurf.</em></p>

  <p>
    <a href="https://hookpost.hookstep.in"><img src="https://img.shields.io/badge/🌐_Cloud_App-hookpost.hookstep.in-FF4CE2?style=for-the-badge" alt="Cloud App"/></a>
    <a href="https://opensource.org/license/agpl-v3"><img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg?style=for-the-badge" alt="License: AGPL 3.0"/></a>
    <a href="https://hub.docker.com"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready"/></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/></a>
  </p>

  <p>
    <a href="https://hookpost.hookstep.in/auth"><strong>Get Started for Free (Cloud) »</strong></a> •
    <a href="#-quick-start-self-hosted"><strong>Self-Host with Docker »</strong></a> •
    <a href="https://hookpost.hookstep.in/docs/public-api"><strong>Documentation »</strong></a>
  </p>
</div>

---

## ⚡ What is Hookpost?

**Hookpost** is an open-source social media scheduler: write a post once, schedule it on one visual calendar, and it publishes to every network at the time you pick. It is also built for AI agents, with an MCP server so Claude, Cursor and other MCP clients can list your channels and schedule posts for you.

A free, self-hostable alternative to **Buffer**, **Hootsuite**, **Later** and **Postiz**, with a hosted cloud version at [hookpost.hookstep.in](https://hookpost.hookstep.in).

### 🌐 Networks that publish today

X (Twitter) · LinkedIn (profiles and company pages) · YouTube (videos and Shorts) · Bluesky · Discord · Slack · Telegram · WordPress · Hashnode · Dev.to · Lemmy · Nostr · Listmonk (email)

Instagram, Facebook and Threads are built and waiting on Meta app approval for the cloud version. Pinterest connects but cannot publish until Pinterest grants Standard API access. Medium stopped issuing new API tokens in January 2025, so only accounts with an older token can connect.

### 🌟 Features

* 🤖 **MCP server for AI agents**: connect Claude Desktop, Claude Code, Cursor or Windsurf and let the assistant draft and schedule posts. [Setup guide](https://hookpost.hookstep.in/guides/claude-mcp-social-media)
* 📅 **Visual calendar**: drag-and-drop planning, per-network previews, and character limits checked before a post is queued.
* ✍️ **AI writing and images** inside the composer.
* 🔌 **REST API, webhooks, CLI (`npx hookpost`) and an n8n node** ([`n8n-nodes-hookpost`](https://www.npmjs.com/package/n8n-nodes-hookpost)).
* 💳 **Flat pricing in rupees** on the cloud version: a free plan, then one price per plan instead of a fee per channel, with UPI Autopay via Razorpay.
* 🛡️ **Open source (AGPL-3.0) and self-hostable** with Docker Compose.

### 🔎 Compare

* [Free social media scheduler: free plans compared](https://hookpost.hookstep.in/free-social-media-scheduler)
* [Hookpost vs Buffer](https://hookpost.hookstep.in/alternatives/buffer) · [vs Postiz](https://hookpost.hookstep.in/alternatives/postiz) · [vs Hootsuite](https://hookpost.hookstep.in/alternatives/hootsuite) · [vs Later](https://hookpost.hookstep.in/alternatives/later)
* [Social media character counter](https://hookpost.hookstep.in/tools/character-counter) (free tool)

---

## 🚀 Quick Start (Self-Hosted)

Run Hookpost on your local machine or VPS in under 60 seconds with Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/jatinder14/hookpost.git
cd hookpost

# 2. Copy the environment template
cp .env.example .env

# 3. Start the stack
docker compose -f docker-compose.dev.yaml up -d
```

Once started, open your browser and navigate to:
* **Frontend UI**: [http://localhost:4007](http://localhost:4007)
* **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Hookpost Cloud (Managed SaaS)

Don't want to manage Docker, Redis, PostgreSQL, and OAuth app verification yourself?

👉 **[Try Hookpost Cloud with a 7-Day Free Trial](https://hookpost.hookstep.in/auth)**

* Free plan, no card needed.
* Flat monthly plans in rupees, no per-channel fee.
* Payments through Razorpay: UPI Autopay, cards, NetBanking.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, TurboPack
* **Backend**: NestJS, TypeScript, Prisma ORM
* **Database**: PostgreSQL (Neon-ready)
* **Cache / Queue**: Redis (Upstash / Local Redis BullMQ)
* **Workflows**: Temporal
* **AI**: Model Context Protocol (MCP) server, OpenAI SDK

---

## 📜 License

Hookpost is licensed under **AGPL-3.0**. The full licence text is in [`LICENSE`](./LICENSE).

This is a modified derivative work; upstream attribution, the fork point and the
list of modified components are recorded in [`NOTICE`](./NOTICE), as AGPL-3.0
section 5(a) requires. Hookpost is an independent project and is not affiliated
with, endorsed by or sponsored by any upstream author.

Under AGPL-3.0 section 13, the complete source for Hookpost is publicly
maintained and free for anyone to use and inspect.

---

<div align="center">
  <p>Built with ❤️ by the HookStep Team • <a href="https://hookpost.hookstep.in">hookpost.hookstep.in</a></p>
</div>
