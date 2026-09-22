# What Postiz shipped in the last month, and what is worth taking

**Compared:** `gitroomhq/postiz-app@901f84ff` against `hookpost@a4762368`
**Window:** 21 Aug – 21 Sep 2026 · **98 non-merge commits upstream**, ~40 tagged `feat`

---

## How this was checked, and why it is slower than it sounds

`git merge-base HEAD upstream/main` returns **nothing**. Our repo and Postiz share
no common ancestor — the fork was made by copying files, not by forking git history.
So there is no version to diff against and no "commits we are behind" number.

Everything below was therefore checked **by content**: for each upstream commit, take
a distinctive line it added and grep our file for it. That matters, because the
cheaper checks lie:

- **Grepping for a keyword lies.** `grep -r reminder` hits five of our files — every
  one of them a marketing landing page using the word "reminders" as sales copy.
  Nothing to do with the feature.
- **Checking the file exists lies too.** `streak.workflow.ts` and
  `onboarding.modal.tsx` both exist here, so a file-existence check calls both
  features present. Diffing the contents shows neither change is in them.

Two of my own first-pass answers were wrong for exactly these reasons and are
corrected below.

---

## Already ours — nothing to do

| Feature | Evidence |
|---|---|
| Farcaster / Neynar managed signers | `integrations/social/farcaster.provider.ts` present |
| Wallet rejection handling | `wallet.provider.tsx` contains `wallet.disconnect().catch(...)` |
| "Other agents" (nanoclaw etc.) | `mcp.client.icons.tsx` references `/icons/third-party/nanoclaw.png` |
| MCP server itself | `libraries/nestjs-libraries/src/chat/start.mcp.ts` present |

---

## Missing, and free to take

No new environment variables, no new npm dependencies. Verified by diffing each
commit's `.env.example` and `package.json` changes — all four came back empty.

| Feature | Commit | Size | What it does |
|---|---|---|---|
| **MCP upload widget** | `2c29ea3e` | 14 files, 692 lines | Lets someone in Claude or ChatGPT upload a local file straight into Hookpost. We already run the MCP server, so this plugs into something that exists. |
| **`x-postiz-org` override + debug endpoints** | `facc77d8` `a1db9359` `9485ca50` | 10 files, 338 lines | Support tooling: look at any org's state through the public API, including soft-deleted rows. This is the thing that would have answered "why is this post stuck" without a psql session. |
| **`client_secret_basic` on the OAuth token endpoint** | `f22d8c82` | 5 files, 64 lines | Standards compliance. Some MCP clients only send credentials this way and currently cannot authenticate at all. |
| **ChatGPT app on `/mcp-oauth-chatgpt`** | `48490b81` | 1 file, 11 lines | Separate issuer path so ChatGPT's connector works alongside the DCR one. |

---

## Missing, and expensive to take

### Clipping — `9aad99cd` (+ `fc14ff16`, `dac36eda`)
**52 files, 2,865 lines.** Takes a YouTube video, transcribes it, cuts captioned
vertical clips, and drops them in as draft posts. Reaches into the backend, a new
Temporal workflow and activity, three MCP tools, a widget, Prisma schema, and
`pricing.ts` (it is plan-gated).

It needs **three vendors we do not currently pay**, from its own `.env.example`:

- `RUNPOD_INGEST_ENDPOINT_ID` and `RUNPOD_CLIPPER_ENDPOINT_ID` — RunPod Serverless,
  one CPU endpoint and one **GPU** endpoint
- `DEEPGRAM_API_KEY` — transcription for videos with no usable captions
- an **Oxylabs** account, which the GPU endpoint needs to fetch from YouTube

`STORAGE_PROVIDER="cloudflare"` and `OPENAI_API_KEY` it already has from us.

### RunPod media normalization — `e2d5b9c5`
**22 files, 756 lines.** Transcodes web uploads to 1080p h264 in the background.
Needs `RUNPOD_API_KEY` + `RUNPOD_ENDPOINT_ID`. Same RunPod image as clipping, so in
practice these two arrive together.

---

## Missing, small, and probably not worth it

- **Reminders** — `b2e438f5`, one file. Our `streak.workflow.ts` lacks the `patched`
  import from `@temporalio/workflow`. Worth knowing *why*: upstream versions
  workflows with Temporal's `patched()` API, we version them by filename
  (`post.workflow.v1.1.3.ts`). Porting single commits across that difference is
  where a silent break would come from.
- **Better onboarding** — `4f296fc0`. Our `onboarding.modal.tsx` has diverged; this
  would be a merge, not a copy.

---

## What I would actually do

**Take the four free ones. Leave clipping alone for now.**

Clipping is the best-looking feature on this list and the worst fit for this month.
It adds three recurring vendors — including GPU time — to a product that yesterday
moved off GCP specifically to get infrastructure from ₹2,900 to ₹1,098 a month, and
that currently has 19 users, 5 subscriptions and ₹699 collected last week. A GPU
endpoint is not a ₹100 line item.

There is also a sequencing problem. Every signup from the last five days has **zero
connected channels** — including the one that came from a paid ad. Adding a feature
on top of a product nobody has finished setting up does not convert anyone. The Meta
app being unpublished blocks Instagram and Facebook connection entirely, and that is
the thing standing between the ads and a customer.

Of the four free ones, the **debug endpoints** are the one I would take first — not
because users see it, but because we have twice this month opened a psql session to
answer a question that endpoint answers. The **upload widget** is second: it is real
new capability, it costs nothing, and it works with MCP we already run.

Revisit clipping when there is revenue to justify a GPU bill, or when someone
actually asks for it.
