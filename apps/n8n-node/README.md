# n8n-nodes-hookpost

An [n8n](https://n8n.io) community node for [Hookpost](https://hookpost.hookstep.in) — schedule and publish social media posts across 30+ networks from your workflows.

## Installation

In n8n: **Settings → Community Nodes → Install**, then enter:

```
n8n-nodes-hookpost
```

Or install manually into your n8n instance:

```bash
npm install n8n-nodes-hookpost
```

## Credentials

Create a **Hookpost API** credential:

| Field | Value |
|---|---|
| **API Key** | From Hookpost → **Settings → Public API**. An OAuth access token (`pos_…`) also works. |
| **Base URL** | `https://hookpost.hookstep.in/api` (change only if you self-host) |

Press **Test** — it calls `/public/v1/is-connected` to confirm the key before you build anything with it.

> Keep the key server-side. It grants full access to your organisation's channels and posts.

## Operations

| Operation | What it does |
|---|---|
| **Create Post** | Schedule, publish now, or save as a draft |
| **List Posts** | List posts between two dates |
| **Delete Post** | Delete a post by id |
| **List Channels** | List your connected channels |
| **Find Free Slot** | Next free slot in your posting schedule |
| **Upload From URL** | Add media from a public URL |

The channel dropdown loads your real connected channels — no need to look up ids by hand.

## Notes

**Scheduling.** Leave **Date** empty on a scheduled post and the node asks Hookpost for the next free slot in your posting schedule, matching what the app does when you press Create Post.

**Channel settings.** Some channels need extra fields — YouTube wants a title and visibility, Pinterest wants a board. Put them in **Additional Fields → Channel Settings (JSON)**:

```json
{
  "__type": "youtube",
  "title": "My video",
  "type": "private",
  "selfDeclaredMadeForKids": "no"
}
```

Call `/public/v1/integration-settings/:id` to see what a given channel expects.

**Errors.** Enable *Continue On Fail* on the node to pass errors downstream as `{ "error": "..." }` instead of stopping the workflow.

## Documentation

- [Public API reference](https://hookpost.hookstep.in/docs/public-api)
- [OAuth apps](https://hookpost.hookstep.in/docs/oauth) — for integrations acting on other people's accounts

## Licence

AGPL-3.0
