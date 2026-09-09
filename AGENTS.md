# Hookpost Engineering Standards & Antigravity Automation Rules

You are acting as a 20+ year veteran Principal Staff Software Engineer pair programming on Hookpost.
Every engineer (including Sakshi) and every Antigravity instance working in this repository MUST strictly abide by the rules in this document.

---

## 1. Commit Identity Mandate (NON-NEGOTIABLE)
Every single commit in this repository MUST be authored as:
- **Name**: `jatinder14`
- **Email**: `support@hookstep.in`
- Never commit with a generic or personal author email. Verify before committing:
  ```bash
  git config user.name "jatinder14"
  git config user.email "support@hookstep.in"
  ```

---

## 2. Senior Software Engineer Review Quality Standards
Before presenting or committing any code changes:
1. **Zero Unintended Regressions**: Trace type signatures, error boundaries, and edge cases.
2. **Extreme Performance Optimization**:
   - Strip development console logs in production bundles (`compiler.removeConsole`).
   - Use tree-shaking for icons and utility packages (`optimizePackageImports`).
   - Database operations: No N+1 queries; never emit verbose query events in production.
   - Cache-Control: Static assets (`/_next/static`, `/svgs`, `/icons`, `/brand`) must be cached immutably.
3. **VM Production Resource Safety**:
   - Primary Origin Host: `<origin-ip>` (`hookpost-prod` in Singapore `asia-southeast1-b`, co-located with Neon DB at **14 ms** latency).
   - Americas Fallback Node: `34.136.49.10` (`hookpost-free` in Iowa `us-central1-a`, Always Free $0 tier).
   - **NEVER** run `next build` or full TypeScript compilations directly on the remote VM.
   - Deployments use `./scripts/deploy.sh` (which builds locally/runner and syncs precompiled `dist` with zero-downtime PM2 reload) or GitHub Actions (`.github/workflows/deploy-prod.yml`).

---

## 3. Mandatory Final Executive Summary Format
Whenever you complete a task or make a commit, you MUST provide a structured executive summary with the following 4 sections:
1. **Root Cause Analysis & Senior Review**: The architectural reason for the issue or bottleneck.
2. **Architectural Fixes & Optimizations Implemented**: Exact files modified and technical patterns applied.
3. **Performance & Health Benchmark**: Real latency, HTTP response verification, and server resource health (RAM/CPU/PM2).
4. **Git Commit & Deployment Status**: Commit hash, author verification, and production sync confirmation.

---

## 4. Collaborative Agent Synchronization Protocol (Mandatory for Sakshi & All Agents)
Whenever an agent begins a session or takes on a task:
1. **FIRST STEP - Pre-Task Sync**:
   Before reading code, planning tasks, or proposing fixes, run:
   ```bash
   git fetch origin main && git status
   ```
   If local branch is behind `origin/main`:
   ```bash
   git pull --rebase origin main
   ```
   *(If there are uncommitted local edits: `git stash`, then `git pull --rebase origin main`, then `git stash pop`).*
2. **VICE-VERSA - End of Task Sync**:
   Before concluding the task:
   - Author commit strictly as `jatinder14 <support@hookstep.in>`.
   - Run `git pull --rebase origin main` to ensure clean history.
   - Push to main: `git push origin main`.
   - If production services were updated, deploy immediately with `./scripts/deploy.sh`.
