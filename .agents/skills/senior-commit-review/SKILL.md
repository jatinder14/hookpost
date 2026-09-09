---
name: senior-commit-review
description: >-
  Enforces 20-year principal staff software engineer code reviews, performance optimizations,
  strict commit author verification (jatinder14 <support@hookstep.in>), and mandatory
  executive summary reporting for every change in this repository.
---

# Senior Principal Staff Engineer Commit & Quality Review Skill

This skill governs all code modifications, quality validations, performance engineering, and git commits across the Hookpost monorepo.

---

## 1. Core Engineering Principles (20+ Years Experience Standards)

1. **Zero Unintended Side Effects**: Every change must be verified against surrounding logic, types, and dependencies. Never break existing contracts.
2. **Extreme Performance Optimization**:
   - Minimize bundle size: tree-shake imports, strip dev logs (`removeConsole`), lazy-load non-critical client modules.
   - Database efficiency: Never perform N+1 queries. Always select only required fields in Prisma.
   - Resource safety: Never lock the event loop or perform heavy unbounded operations.
3. **Commit Identity Mandate**:
   - Author Name: `jatinder14`
   - Author Email: `support@hookstep.in`
   - Strict Conventional Commits (`feat(...)`, `fix(...)`, `perf(...)`, `refactor(...)`).
4. **Production VM Safety Rule**:
   - The production VM (`34.136.49.10`) is an `e2-micro` with **1 GB of RAM**.
   - **NEVER** run `next build` or `pnpm build` directly on the VM.
   - Synchronize tested code via `rsync` over SSH and execute graceful `pm2 reload` / `pm2 restart`.

---

## 2. Pre-Commit Review Checklist

Before committing any change to this repository:
- [ ] **Type & Syntax Integrity**: Code must compile without new lint or type errors.
- [ ] **Performance Audit**: Does this change add unnecessary bundle weight or slow down critical-path rendering?
- [ ] **Exact Author Verification**: Run `git config user.name` (`jatinder14`) and `git config user.email` (`support@hookstep.in`).
- [ ] **Clean Working Directory**: Verify `git status` to ensure zero unintended files or debug logs are left behind.

---

## 3. Mandatory Final Executive Summary Format

After completing any fix, optimization, or feature implementation, Antigravity MUST deliver an executive summary with the following structured sections:

1. **Root Cause Analysis & Senior Review**:
   - Technical breakdown of why the issue existed or where the performance bottleneck was.
2. **Architectural Fixes & Optimizations Implemented**:
   - Specific files modified and exact technical mechanisms applied (e.g. caching, query reduction, bundle pruning).
3. **Performance & Health Benchmark**:
   - Verification of HTTP status codes, latency, and host resource utilization (RAM, CPU, PM2 status).
4. **Git Commit Parity**:
   - Commit hash, author verification, and deployment status.
