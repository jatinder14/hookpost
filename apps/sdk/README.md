# @hookpost/node

Official Node.js SDK for [Hookpost](https://hookpost.hookstep.in) — schedule and publish social media posts across 30+ networks.

## Install

```bash
npm install @hookpost/node
```

## Usage

```typescript
import Hookpost from '@hookpost/node';

const hookpost = new Hookpost('your api key');
const channels = await hookpost.integrations();
```

CommonJS works too:

```javascript
const Hookpost = require('@hookpost/node');
```

Find your API key in the app under **Settings → Public API**. An OAuth access token (`pos_…`) works anywhere an API key does.

Self-hosting? Pass your own base URL as the second argument, or set `HOOKPOST_API_URL`:

```typescript
const hookpost = new Hookpost('your api key', 'https://your-instance.example.com/api');
```

## Methods

| Method | Returns |
|---|---|
| `post(posts)` | Parsed JSON — creates a post (schedule, publish now, or draft) |
| `postList(filters)` | Parsed JSON — posts in a date range |
| `upload(file, extension)` | Parsed JSON — uploads a Buffer as `png`, `jpg` or `gif` |
| `integrations()` | Parsed JSON — your connected channels |
| `deletePost(id)` | The raw `Response` — check `res.ok` yourself |

Note that `deletePost` is the one method that hands back the undecoded response rather than parsed JSON.

## Creating a post

```typescript
const channels = await hookpost.integrations();

await hookpost.post({
  type: 'schedule',              // 'schedule' | 'now' | 'draft'
  date: '2026-09-10T09:00:00.000Z',
  shortLink: false,
  tags: [],
  posts: [
    {
      integration: { id: channels[0].id },
      value: [{ content: 'Shipped something small today.', image: [] }],
    },
  ],
});
```

Some channels reject a post without extra settings — YouTube wants a title and visibility, Pinterest wants a board, X wants a reply audience. Pass them as `settings` on the post, and call `/public/v1/integration-settings/:id` to see what a given channel expects.

## Security

The API key grants full access to your organisation's channels and posts. Keep it server-side — never ship it in a browser bundle, a mobile app, or a public repo.

## Documentation

- [Public API reference](https://hookpost.hookstep.in/docs/public-api)
- [OAuth apps](https://hookpost.hookstep.in/docs/oauth) — for acting on other people's accounts

## Licence

AGPL-3.0
