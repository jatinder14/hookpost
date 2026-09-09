# Hookpost — deployment status

Snapshot of what exists right now, and the exact commands left to run.

## Live infrastructure (already created in `jr-consulting-co`)

| Resource | Value |
|---|---|
| VM | `hookpost-prod`, `e2-standard-2` (2 vCPU / 8 GB), Ubuntu 24.04, zone `asia-south1-a` (Mumbai) |
| Static IP | **34.93.100.154** |
| Firewall | `hookpost-allow-web` — tcp:80, tcp:443 only |
| Artifact Registry | `us-central1-docker.pkg.dev/jr-consulting-co/hookpost/hookpost` |
| Image tag | `25ea49c` (and `:latest`) |

**The stack is deployed, running, and live at https://hookpost.hookstep.in.**
All 7 containers are up and the app container reports `healthy`.

### Payment lifecycle — verified against the live database

Driven with correctly signed webhooks (the exact payloads Razorpay sends), so no
money moved:

| Step | Result |
|---|---|
| Razorpay customer created via API | `cust_...` stored on Organization.paymentId |
| Plan + subscription created | `POST /billing/embedded` -> 201 |
| Forged webhook signature | rejected, HTTP 400 |
| Activation -> tier granted | `STANDARD`, 5 channels |
| Upgrade -> tier changed | `PRO`, channels 5 -> 30 |
| Scheduled cancel | `cancelAt` = one billing cycle out |
| Hard cancel | entitlement removed, 0 active subscriptions |

Two fixes proved themselves here rather than only in unit tests: `cancelAt`
stayed NULL on a healthy subscription whose Razorpay `end_at` was ten years out,
and the channel limit tracked the tier on upgrade.

**Not covered:** entering card or UPI details into Razorpay's checkout modal.
That is the one manual step; everything either side of it is verified.

### Other verified flows

| Flow | Result |
|---|---|
| Public landing page at `/` | 200 |
| Registration | 200, user persisted |
| Login / session | `/user/self` 200 |
| Authenticated app pages | load |
| Temporal scheduler | connected, workers RUNNING |
| Startup ordering | `backend listening on :3000 after 51s`, then the rest |
| HTTPS | Let's Encrypt, valid to 18 Nov 2026 |
| Key secret in browser | absent |

### Known gaps

- **Social publishing is untested end to end.** Each channel needs its own
  developer app (client id + secret) registered under your accounts. The
  scheduler is verified connected; it has nothing to publish to yet.
- **AI copilot returns 504** -- `OPENAI_API_KEY` is unset.
- A test account (`e2e-test-20260820@hookpost.test`) remains in the database.

Internal checks:

```
frontend :4200 -> HTTP 307   (redirect to login)
backend  :3000 -> HTTP 200
nginx    :5000 -> HTTP 307
/api/           -> HTTP 200
caddy    :80   -> HTTP 308   (redirect to HTTPS)
```

The one thing missing is the DNS record, so Caddy cannot obtain a TLS
certificate and the site is not reachable from the internet yet.

## Step 1 — DNS (only you can do this)

`hookstep.in` is on GoDaddy nameservers (`ns13/ns14.domaincontrol.com`), not
Cloud DNS, so this record has to be added in the GoDaddy control panel:

```
Type: A    Name: hookpost    Value: 34.93.100.154    TTL: 600
```

Let's Encrypt is currently returning, verbatim:

> DNS problem: NXDOMAIN looking up A for hookpost.hookstep.in — check that a
> DNS record exists for this domain

That is the only thing standing between the running stack and a live site.

Caddy will not issue a TLS certificate until `hookpost.hookstep.in` resolves to
that IP. Verify with:

```bash
dig +short hookpost.hookstep.in
```

## Step 2 — Start the stack (already done)

`.env.production` holds a freshly generated 96-char `JWT_SECRET`. Billing is
intentionally **off** (blank Razorpay keys), so the instance runs in unlimited
self-hosted mode — a working app you can log into.

Re-run this after any config or image change:

```bash
cd ~/Desktop/hookpost && ./deploy/vm/release.sh
```

It uploads config, authenticates Docker to Artifact Registry, pulls the image and
runs `docker compose up -d`. First boot takes 1–2 minutes because the entrypoint
pushes the Prisma schema before the app accepts traffic.

After adding DNS, Caddy retries on its own within ~20 minutes. To make it retry
immediately:

```bash
gcloud compute ssh hookpost-prod --zone asia-south1-a --tunnel-through-iap \
  --command 'cd /opt/hookpost && docker compose restart caddy'
```

Note: Caddy has been failing validation repeatedly against a non-existent
record, and Let's Encrypt rate-limits failed validations. If the certificate does
not appear soon after the DNS change, wait an hour and restart Caddy again.

## Step 3 — Confirm it is healthy

```bash
gcloud compute ssh hookpost-prod --zone asia-south1-a --tunnel-through-iap \
  --command 'cd /opt/hookpost && docker compose ps && curl -sI localhost:5000 | head -1'
```

Expect all services `Up` and the `hookpost` container `healthy`. If it is
restarting:

```bash
gcloud compute ssh hookpost-prod --zone asia-south1-a --tunnel-through-iap \
  --command 'cd /opt/hookpost && docker compose logs --tail=80 hookpost'
```

## Step 4 — Turn billing on (when you have Razorpay keys)

1. Razorpay Dashboard → Settings → API Keys → generate live keys.
2. Settings → Webhooks → add `https://hookpost.hookstep.in/api/razorpay`,
   choose a webhook secret, and subscribe to:
   `subscription.activated`, `subscription.charged`, `subscription.updated`,
   `subscription.cancelled`, `subscription.completed`, `subscription.pending`,
   `subscription.halted`.
3. Put the three values in `.env.production`:
   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
4. Re-run `./deploy/vm/release.sh`.

No image rebuild is needed: the billing layouts read `RAZORPAY_KEY_ID` at
runtime. A rebuild is only required if the **public URL** changes, because
`NEXT_PUBLIC_BACKEND_URL` is compiled into the frontend bundle.

The webhook secret is **not** the API key secret. Mixing them up makes every
webhook fail signature verification, which means paid subscriptions never
activate.

## Before you take real payments

- **Publish the source.** AGPL section 13: anyone using this over a network is
  entitled to the corresponding source of your modified version. Push this repo
  somewhere public and put the URL in `NOTICE` (it currently says
  `<<< SET THIS >>>`).
- **Test in Razorpay test mode first.** Run one full upgrade and one
  cancellation and confirm the tier in the database matches what was charged.
- Consider snapshot backups on the VM's disk; the Postgres volume is the only
  copy of your data.

## Not done

- **Cloud Run deployment.** Documented in `deploy/README.md` but not executed.
  It needs Temporal Cloud credentials, which only you can create — Temporal
  schedules every post and has no managed GCP equivalent. The VM path above does
  not have this dependency.
- **Social provider OAuth apps.** Every channel (X, LinkedIn, Instagram, …)
  needs its own developer app registered under your accounts. Blank credentials
  simply mean that channel is unavailable.
