# Changelog

All notable changes to Hookpost are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [semantic versioning](https://semver.org/).

## [1.0.0] - 2026-09-26

First tagged release of Hookpost, an open-source social media scheduler built on the AGPL-3.0 Postiz codebase (see `NOTICE`).

### Publishing
- Schedule and publish to X (posts and threads), LinkedIn (profiles and company pages), YouTube (videos and Shorts), Bluesky, Discord, Slack, Telegram, WordPress, Hashnode, Dev.to, Lemmy, Nostr and Listmonk.
- Instagram, Facebook and Threads providers are included; on the hosted version they wait on Meta app approval. Pinterest connects but cannot publish until Pinterest grants Standard API access. Medium works only for accounts that already hold an integration token (Medium stopped issuing new ones in January 2025).
- Per-network validation (character limits, media rules) before a post is queued; repeat posting on supported channels.

### AI and automation
- MCP server exposing channel listing, per-channel settings, media upload from URL, and post scheduling and listing, for Claude Desktop, Claude Code, Cursor and other MCP clients.
- REST public API with API-key and OAuth authorisation, webhooks, a CLI (`npx hookpost`) and an n8n community node (`n8n-nodes-hookpost`).
- AI writing and image generation in the composer.

### Hosting and billing
- Self-host with Docker Compose (Next.js frontend, NestJS backend, Temporal, PostgreSQL, Redis).
- Hosted version at https://hookpost.hookstep.in with a free plan and flat monthly plans billed in rupees through Razorpay (UPI Autopay, cards, NetBanking).

[1.0.0]: https://github.com/jatinder14/hookpost/releases/tag/hookpost-v1.0.0
