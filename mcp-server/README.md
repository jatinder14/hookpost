# Hookpost MCP server

A small stdio [Model Context Protocol](https://modelcontextprotocol.io) server for [Hookpost](https://hookpost.hookstep.in), the social media scheduler. It lets Claude, Cursor and other MCP clients list your connected channels, upload media, and schedule, list and delete posts.

Every tool is a thin wrapper over one endpoint of the [Hookpost public API](https://hookpost.hookstep.in/docs/public-api), authenticated with your own API key. The server starts and answers `initialize` / `tools/list` without a key; tool calls need one.

## Tools

| Tool | Public API endpoint | What it does |
|------|---------------------|--------------|
| `list_channels` | `GET /integrations` | Connected channels (id, name, provider, group) |
| `list_groups` | `GET /groups` | Customer groups |
| `get_channel_settings` | `GET /integration-settings/:id` | Rules, max length and required settings for a channel |
| `find_free_slot` | `GET /find-slot/:id` | Next free time in a channel's posting schedule |
| `upload_media_from_url` | `POST /upload-from-url` | Import an image/video (.png .jpg .jpeg .gif .webp .mp4) from a public HTTPS URL |
| `create_post` | `POST /posts` | Schedule, publish now, or save a draft on one or more channels |
| `list_posts` | `GET /posts` | Posts in a date range |
| `delete_post` | `DELETE /posts/:id` | Delete a post (and its copies on the other channels) |

Typical flow: `list_channels` → optionally `upload_media_from_url` and `find_free_slot` → `create_post`. If a post is rejected for missing settings (YouTube title, Pinterest board and so on), call `get_channel_settings` and pass the fields as `settings`.

## Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `HOOKPOST_API_KEY` | For tool calls | none. Create one in Hookpost under **Settings → Developers**. |
| `HOOKPOST_API_URL` | No | `https://hookpost.hookstep.in/api/public/v1`. Set it to `https://your-host/api/public/v1` if you self-host. |

The public API needs an active paid plan; a key on an organisation without one returns `401 No subscription found`.

## Use with Claude Desktop, Cursor and others

> npm publication of `hookpost-mcp` is pending. Until it is live, use the remote endpoint below, or build from source (`npm ci && npm run build`, then point `command` at `node` with `args: ["/path/to/mcp-server/dist/index.js"]`).

```json
{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "hookpost-mcp"],
      "env": {
        "HOOKPOST_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

Claude Desktop: `claude_desktop_config.json`. Cursor: `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project).

### Alternative: hosted remote endpoint

Hookpost also runs a hosted MCP endpoint. Any client that speaks stdio can reach it through `mcp-remote`:

```json
{
  "mcpServers": {
    "hookpost": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://hookpost.hookstep.in/api/mcp/YOUR_API_KEY"]
    }
  }
}
```

## Docker

```sh
docker build -t hookpost-mcp .
docker run -i --rm -e HOOKPOST_API_KEY=YOUR_API_KEY hookpost-mcp
```

## Rate limits

Creating posts (`POST /posts`, i.e. `create_post`) is limited per organisation per hour; on a self-hosted instance the limit is the `API_LIMIT` environment variable. A limited request returns HTTP 429, which the server reports as a tool error. The other endpoints are not throttled.

## License

AGPL-3.0, same as Hookpost.
