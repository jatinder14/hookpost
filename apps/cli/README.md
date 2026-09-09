# hookpost

Schedule and publish social media posts from your terminal, powered by [Hookpost](https://hookpost.hookstep.in).

## Install

```bash
npm install -g hookpost
```

## Sign in

```bash
hookpost auth login
```

It asks for your API key — find it in Hookpost under **Settings → Public API** — verifies it before saving, and stores it at `~/.hookpost/config.json` with owner-only permissions.

In CI, skip the login and set an environment variable instead:

```bash
export HOOKPOST_API_KEY="your_key"
```

## Commands

```
auth login              Store your API key
auth status             Show who you are signed in as
auth logout             Remove the stored key

channels                List your connected channels
posts [--days N]        List upcoming posts (default 7 days)
post <text>             Create a post
delete <postId>         Delete a post
slot [channelId]        Show the next free slot
```

### Creating posts

```bash
# Schedule into your next free slot
hookpost post "Shipped something small today." --channel abc123

# Pick an exact time
hookpost post "Launch day" --channel abc123 --at 2026-09-10T09:00:00Z

# Publish immediately
hookpost post "Live now" --channel abc123 --now

# Save a draft
hookpost post "Rough idea" --channel abc123 --draft
```

Run `hookpost channels` to get channel ids.

Omit `--at` on a scheduled post and the CLI asks Hookpost for the next free slot in your posting schedule — the same default the web app uses.

### Channel settings

Some channels need extra fields. YouTube wants a title and visibility:

```bash
hookpost post "New video" --channel abc123 --now \
  --settings '{"__type":"youtube","title":"My video","type":"private","selfDeclaredMadeForKids":"no"}'
```

Call `/public/v1/integration-settings/:id` to see what a given channel expects.

## Environment

| Variable | Purpose |
|---|---|
| `HOOKPOST_API_KEY` | Use instead of `auth login` — handy in CI |
| `HOOKPOST_API_URL` | Override the API host when self-hosting |

## Security

The API key grants full access to your organisation's channels and posts. Keep it out of shared shells and public repos; prefer `HOOKPOST_API_KEY` from a secret store in automation.

## Documentation

- [Public API reference](https://hookpost.hookstep.in/docs/public-api)
- [OAuth apps](https://hookpost.hookstep.in/docs/oauth) — for acting on other people's accounts

## Licence

AGPL-3.0
