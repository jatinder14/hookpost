---
description: Mandatory pre-task git sync and post-task vice-versa synchronization rule for Sakshi and all collaborating AI agents
globs: *
---

# Agent Collaborative Synchronization Protocol

Whenever an AI agent (including Sakshi's agent or any Antigravity/Cursor/Claude agent) begins a session or takes on a user request, it MUST execute this protocol:

## 1. Pre-Task Initialization (First Step Before Any Work)
Before analyzing code, planning, answering questions, or writing implementations:
1. **Pull Latest Code & Architectural Changes**:
   ```bash
   git fetch origin main
   git status
   ```
   If local branch is behind `origin/main`:
   ```bash
   git pull --rebase origin main
   ```
   *(If there are uncommitted local modifications, stash them with `git stash`, run `git pull --rebase origin main`, and restore with `git stash pop`).*
2. **Review Recent Architectural Context**:
   - Primary Origin VM: Singapore `<origin-ip>` (Neon PostgreSQL co-located at 14ms latency).
   - Runtime: Bare-metal Node.js 24 + PM2 (`hookpost-backend`, `hookpost-frontend`, `hookpost-orchestrator`, `hookpost-temporal`).
   - Caching: Nginx zero-copy direct disk delivery (`/apps/frontend/public`).
   - Secrets: Stored in remote cloud (`Neon` + `Upstash`). No local Postgres/Redis containers.

---

## 2. Vice-Versa Synchronization (Before Completing Any Task)
When finishing work or implementing fixes:
1. **Identity Standard**: Author all git commits strictly as `jatinder14 <support@hookstep.in>`.
2. **Pre-Push Rebase**:
   ```bash
   git pull --rebase origin main
   ```
3. **Publish Changes**:
   ```bash
   git push origin main
   ```
4. **Deploy to Production**:
   If changes affect backend, frontend, or shared libraries, sync production immediately via:
   ```bash
   ./scripts/deploy.sh
   ```
   This ensures zero-downtime rolling reload on PM2 without VM memory thrashing.
