# Hookpost infrastructure

Last verified: 2026-09-07.

## What runs where

| Piece | Where | Scales? |
|---|---|---|
| Next.js frontend (:4200) | `hookpost-prod` VM, under PM2 | No — fixed VM |
| NestJS backend (:3000) | same VM, PM2 | No |
| Temporal server (:7233) | same VM, PM2 — **Postgres on Cloud SQL** | Not yet, but no longer blocked |
| Temporal worker (orchestrator) | same VM, PM2 | No |
| NGINX reverse proxy | same VM | No |
| Postgres | Neon (serverless) | Yes, managed |
| Redis | Upstash (serverless) | Yes, managed |
| Object storage | Cloudflare R2 | Yes, managed |
| CDN / DNS | Cloudflare | Yes, managed |

`hookpost-prod`: e2-medium (2 vCPU, 4 GB), `asia-southeast1-b`.
External IP `<origin-ip>` is **reserved** as `hookpost-prod-ip`. It used to be
ephemeral, which meant any stop of the VM would have lost the address and
broken the A record for `hookpost.hookstep.in`.

## Temporal

Runs the real `temporal-server` v1.31.2 from `/home/flexiple_jr/temporal-server-dist`,
config at `config/production.yaml`, persisting to **Cloud SQL** — instance
`hookpost-temporal`, PostgreSQL 16, db-f1-micro, `asia-southeast1`, reached on
the **private IP 10.100.0.3**. The instance has no public IP.

It used to be `temporal server start-dev --db-filename temporal.db`: the
development server on a single SQLite file. One writer, so a second Temporal
could never run against it, and the only copy of every scheduled post lived in
one unbacked-up 2.1 MB file.

It spent a few hours on Neon in between, which was a mistake worth recording:

- Temporal holds connections open permanently, so Neon's compute could never
  scale to zero. Neon's free plan includes **100 compute-hours per project**;
  always-on needs roughly 182 a month. Splitting it into a second Neon project
  would not have helped, because the allowance is per project.
- It also shared a compute endpoint with the production app database, so
  Temporal's load could have degraded the live app.

Both problems disappear on a dedicated Cloud SQL instance, at roughly half the
cost of Neon's Launch plan.

Things worth knowing:

- Temporal binds `10.148.0.2:7233`, not loopback, so the VPC can reach it. Not
  public: the only firewall rule covering 7233 is `default-allow-internal`
  (10.128.0.0/9). Only 22, 80 and 443 are open to the internet.
- `TEMPORAL_ADDRESS` in `.env` is therefore `10.148.0.2:7233`.
- Private IP needs VPC peering to `servicenetworking`. The allocated range is
  `google-managed-services-default` (10.100.0.0/16) — it has to sit outside
  10.128.0.0/9, which the auto-mode default VPC already claims.
- `maxConns` is **per internal service**. One binary runs frontend, matching,
  history and worker, each with its own pool, so 15 would allow up to 60
  against one database. Currently 5/2 and 3/1.
- `numHistoryShards: 4` is fixed at cluster creation and cannot be changed
  without wiping state.
- A fresh cluster has no namespaces; `default` is registered by hand with 168h
  retention. `start-dev` used to create it implicitly.
- Cloud SQL takes automated daily backups at 19:30, 14 retained.
- Lost the database password? Reset it rather than hunting:
  `gcloud sql users set-password temporal --instance=hookpost-temporal`
- `/home/flexiple_jr/temporal.db` is still on disk, frozen at the original
  cutover, as a last-resort rollback.

## Backups

There were none of any kind before 2026-09-07 — no snapshots, no schedule.

- `hookpost-daily-snapshots` resource policy on the boot disk, daily at 19:00,
  14-day retention.
- Hourly cron running `/home/flexiple_jr/backup-temporal.sh`, which takes a
  consistent `sqlite3 .backup` copy into `~/backups/` on a 7-day rotation and
  runs `PRAGMA integrity_check`. This is now vestigial — Temporal's state lives
  in Neon, which has its own history retention — but it is left in place while
  the SQLite file remains the rollback path.

## The VM does not autoscale

It is a single instance, not a managed instance group. Nothing about it grows
under load. The Cloud Run services in the same project do autoscale; this one
does not. When it runs out of memory it swaps, then the kernel starts killing
processes — that is what produced the orchestrator's 19,402 restarts.

## Measured load (2026-09-07)

CPU 9–14% of two cores. Memory 38% of 4 GB, zero swap in use, ~2.1 GB free.
Roughly: Temporal server ~840 MB, NestJS ~530 MB, Next.js ~150 MB, worker
~160 MB.

At 10 organisations and 16 posts, the constraint has been memory, never CPU or
request volume. Sizing was the problem; autoscaling was not the fix.

## When to scale, and how

The `Hookpost VM memory above 85%` alert is the trigger. Do not scale on a
hunch — that alert exists so the decision is made on data.

**Vertical first** (minutes, no architecture change):

```
gcloud compute instances stop hookpost-prod --zone=asia-southeast1-b
gcloud compute instances set-machine-type hookpost-prod \
  --machine-type=e2-standard-2 --zone=asia-southeast1-b
gcloud compute instances start hookpost-prod --zone=asia-southeast1-b
```

e2-medium (4 GB) → e2-standard-2 (8 GB). About 3 minutes of downtime. The
reserved IP survives it. This is the right move until a single box genuinely
cannot hold the working set.

**Horizontal, when vertical stops being enough:**

Split the stateless tiers off and let them autoscale:

- Next.js frontend → Cloud Run. Stateless, no Temporal dependency; it reaches
  the backend over the public `/api` path, so it needs no VPC wiring.
- NestJS backend → Cloud Run. Needs to reach Temporal on `:7233`, so it needs
  Direct VPC egress into the VM's network. Do not expose Temporal publicly.
- Temporal server and its worker stay on an always-on VM. Neither fits a
  scale-to-zero runtime: the server is stateful and the worker must keep
  polling. Temporal Cloud removes this VM entirely if the cost is ever worth it.

The `Dockerfile` at the repo root builds a **single image containing all of
them** behind PM2. That mirrors upstream Postiz and is fine for self-hosters,
but it is the wrong shape for Cloud Run — splitting the tiers means separate
images, not this one.

## Monitoring

- Uptime check `hookpost.hookstep.in is up` — every 5 min from Asia, Europe, US.
- Alert `Hookpost is DOWN` — fires when checks fail from more than two regions.
- Alert `Hookpost VM memory above 85%` — 15-minute window, carries the scale
  runbook in its documentation field.
- Alert `Temporal unhealthy - scheduled posts will not publish` — driven by
  `scripts/check-temporal.sh`, which runs every 5 minutes on the VM and writes
  a JSON entry to the `hookpost-health` log. Temporal listens on a private IP,
  so a Cloud Monitoring uptime check cannot reach it; without this, Temporal
  dying is invisible until a post misses its slot. Verified firing.
- All notify `Hookpost alerts` (email).
- Guest memory and disk metrics come from the Ops Agent, installed on the VM.

## Cost

Compute Engine plus Persistent Disk was about ₹280/month at e2-small; e2-medium
is roughly double. Neon, Upstash, R2 and Resend are all inside free tiers at
current volume. The rest of the `jr-consulting-co` bill belongs to other
products sharing the project — read it grouped by service, not as one number.
