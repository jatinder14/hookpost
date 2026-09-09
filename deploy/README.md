# Deploying Hookpost

Hookpost is a social media scheduling platform with Razorpay billing, operated
by JR Consulting Co. This document covers deploying it.

Licensing and attribution are in [`../NOTICE`](../NOTICE) and the
Attribution & License section of the root [`README`](../README.md), including
your obligations under AGPL section 13 if you host this for others.

---

## What the stack actually needs

The app container bundles three Node processes (Next.js frontend `:4200`, NestJS
backend `:3000`, Temporal orchestrator) behind nginx. It cannot run alone — it
requires three stateful services:

| Service | Why | Managed option |
|---|---|---|
| PostgreSQL 17 | primary datastore | Cloud SQL |
| Redis 7 | BullMQ queues | Memorystore |
| Temporal | **every scheduled post** goes through it | Temporal Cloud (no GCP equivalent) |

Temporal is not optional. `libraries/.../posts.service.ts` calls it directly to
schedule posts; there is no fallback path. This is the single fact that decides
your deployment shape.

---

## Deployment Architecture Status

### Primary Production Architecture (Active & Recommended)
Hookpost is currently deployed natively on a Google Compute Engine VM (`hookpost-prod` at `<origin-ip>`) in Singapore (`asia-southeast1-b`) directly co-located with Neon Serverless PostgreSQL (`ap-southeast-1` at **14 ms** round-trip latency) and Upstash Redis.
- **Process Manager**: PM2 running native Node.js 24 LTS processes (`hookpost-backend`, `hookpost-frontend`, `hookpost-orchestrator`) and a lightweight standalone Go Temporal daemon (`hookpost-temporal` consuming ~78MB RAM vs ~800MB Docker).
- **Reverse Proxy & Cache**: High-performance Nginx with HTTP/2, Let's Encrypt SSL, and Linux kernel zero-copy file caching (`sendfile`, `open_file_cache max=10000`) for sub-millisecond static file delivery.
- **Automated Deployment**:
  - **Terminal**: Run `./scripts/deploy.sh` to compile the backend, sync files, regenerate Prisma client, and execute zero-downtime rolling reloads across all microservices (~30 seconds).
  - **CI/CD**: Automatically triggered on `git push origin main` via `.github/workflows/deploy-prod.yml`.

---

### Fallback / Deprecated Option: All-in-One Docker Compose (Preserved for Future Reference)
> [!NOTE]
> The all-in-one Docker Compose topology below is preserved in `deploy/vm/` as an emergency fallback or for self-hosting setups requiring bundled local PostgreSQL and Elasticsearch containers. It is currently deprecated in favor of the cloud-native PM2 architecture above.

Everything in one `docker compose` stack: app, Postgres, Redis, Temporal, and Caddy for automatic TLS:

- **Cost:** ~$50/month (`e2-standard-2`, 2 vCPU / 8 GB) + ~$6 disk
- **Pros:** completely self-contained; single compose file.
- **Cons:** ~1.2 GB idle RAM overhead for Docker daemon and Java Elasticsearch; local database containers.

```bash
./deploy/vm/provision.sh          # static IP + VM + firewall
cp .env.production.example .env.production && $EDITOR .env.production
./deploy/vm/release.sh            # push config, pull image, start stack
```

`release.sh` refuses to run while any `<<< FILL ME >>>` placeholder remains.

### Elasticsearch is mandatory

Temporal runs with Elasticsearch for visibility, matching upstream. This is not
optional: with `ENABLE_ES=false` Temporal uses SQL visibility, which allows at
most **3 Text search attributes**, and the backend registers more than that
during `onModuleInit`. It then dies before listening on `:3000`, and nginx
serves 502s with the frontend looking healthy — a confusing failure worth
recognising.

The heap is capped at 256 MB (`ES_JAVA_OPTS=-Xms256m -Xmx256m`), so the whole
stack fits comfortably in the 8 GB of an `e2-standard-2`.

---

## Option B — Cloud Run app tier

Viable, but it is a hybrid: Cloud Run hosts only the stateless container, and
you still pay for Cloud SQL, Memorystore, **and** Temporal Cloud.

- **Cost:** meaningfully higher than Option A (three managed services + an
  always-on Cloud Run instance), and Temporal Cloud is billed separately
- **Use it when:** you want managed data and autoscaling, and already have
  Temporal Cloud

### Why the flags matter

The container runs three processes under pm2, so it needs CPU between requests.
A default Cloud Run service throttles CPU when idle, which silently stops the
scheduler. You must set:

- `--no-cpu-throttling` — keep CPU allocated outside requests
- `--min-instances 1` — never scale to zero, or scheduled posts stop firing
- `--memory 4Gi --cpu 2` — three Node processes in one container
- `--port 8080` — Cloud Run injects `$PORT`; the entrypoint templates nginx to it

### Steps

```bash
gcloud services enable run.googleapis.com sqladmin.googleapis.com \
  redis.googleapis.com secretmanager.googleapis.com vpcaccess.googleapis.com \
  --project jr-consulting-co
```

1. **Cloud SQL** — create a `POSTGRES_17` instance (`db-g1-small` is enough to
   start), a `hookpost` database, and a `hookpost` user. Store the password in
   Secret Manager; do not put it in an env var.

2. **Memorystore** — a 1 GB `redis_7_0` instance on the `default` network. Cloud
   Run reaches it via Direct VPC egress (`--network default --subnet default
   --vpc-egress private-ranges-only`).

3. **Temporal** — sign up for Temporal Cloud, create a namespace, and mint an
   API key. You need `TEMPORAL_ADDRESS`, `TEMPORAL_TLS=true`,
   `TEMPORAL_NAMESPACE`, `TEMPORAL_API_KEY`.

4. **Secrets** — create one Secret Manager entry per credential, each holding
   your own value:
   `hookpost-jwt-secret`, `hookpost-razorpay-key-id`,
   `hookpost-razorpay-key-secret`, `hookpost-razorpay-webhook-secret`,
   `hookpost-db-password`, `hookpost-database-url`.

5. **Deploy** with the flags above, attaching `--add-cloudsql-instances` and
   `--set-secrets`. `DATABASE_URL` must use the Cloud SQL unix socket:

   ```
   postgresql://hookpost:PASSWORD@localhost/hookpost?host=/cloudsql/PROJECT:REGION:hookpost-pg
   ```

6. **Domain** — `gcloud run domain-mappings create --service hookpost --domain
   hookpost.hookstep.in`, then add the CNAME it prints to GoDaddy.

### The build-time gotcha

`NEXT_PUBLIC_*` values are compiled into the frontend bundle by Next.js, so
setting those at deploy time does nothing.

The Razorpay **key id** is exempt: the layouts read `RAZORPAY_KEY_ID` (the plain
runtime variable) first and fall back to `NEXT_PUBLIC_RAZORPAY_KEY_ID`. They are
`force-dynamic` server components, so turning billing on is a config change plus
a restart -- no rebuild.

`NEXT_PUBLIC_BACKEND_URL` is not exempt. If the public URL changes you must
rebuild:

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=SHORT_SHA=$(git rev-parse --short HEAD),\
_PUBLIC_URL=https://hookpost.hookstep.in,_RAZORPAY_KEY_ID=rzp_live_xxxx
```

Only the publishable key id is baked in. The key **secret** and webhook secret
are runtime-only and never enter the image.

---

## Razorpay setup

1. Dashboard → Settings → API Keys → generate live keys.
2. Dashboard → Settings → Webhooks → add
   `https://hookpost.hookstep.in/api/razorpay` with a secret you choose. That
   secret goes in `RAZORPAY_WEBHOOK_SECRET` — it is **not** the API key secret;
   mixing them up makes every webhook fail signature validation.
3. Subscribe to these events:
   `subscription.activated`, `subscription.charged`, `subscription.updated`,
   `subscription.cancelled`, `subscription.completed`, `subscription.pending`,
   `subscription.halted`.
4. Optional: create an Offer for retention discounts and set `RAZORPAY_OFFER_ID`.
   Razorpay offers cannot be created over the API, only in the dashboard.

### Billing kill switch

`RAZORPAY_KEY_ID` doubles as the "billing enabled" flag, inherited from how
upstream used `STRIPE_PUBLISHABLE_KEY`. Leave it **and** `RAZORPAY_KEY_SECRET`
blank and the instance runs in unlimited self-hosted mode with no paywall. Set
them and the tiers in
`libraries/nestjs-libraries/src/database/prisma/subscriptions/pricing.ts` apply.

---

## Pricing

Denominated in INR because Razorpay settles in INR for standard Indian merchant
accounts. Yearly is 10x monthly (two months free).

| Tier | Hookpost /mo | Postiz /mo | Channels |
|---|---|---|---|
| Standard | ₹1,799 | $29 | 5 |
| Team | ₹2,499 | $39 | 10 |
| Pro | ₹3,299 | $49 | 30 |
| Ultimate | ₹5,999 | $99 | 100 |

To switch currency, set `BILLING_CURRENCY`, `NEXT_PUBLIC_BILLING_CURRENCY`, and
`NEXT_PUBLIC_BILLING_CURRENCY_SYMBOL` — **and restate every amount** in
`pricing.ts`. The numbers are bare units with no currency attached, so changing
the symbol alone would mislabel prices rather than convert them.

---

## Operations

```bash
# logs
gcloud compute ssh hookpost-prod --zone asia-south1-a --tunnel-through-iap \
  --command 'cd /opt/hookpost && docker compose logs -f hookpost'

# redeploy a new image
IMAGE_TAG=$(git rev-parse --short HEAD) ./deploy/vm/release.sh

# database shell
gcloud compute ssh hookpost-prod --zone asia-south1-a --tunnel-through-iap \
  --command 'docker exec -it hookpost-postgres psql -U hookpost hookpost'
```

Keep `.deploy-secrets` (generated on first release). It holds the Postgres and
Temporal database passwords; losing it means losing access to the data volumes.
