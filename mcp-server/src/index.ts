#!/usr/bin/env node
/**
 * Hookpost MCP server (stdio).
 *
 * Every tool is a thin wrapper over one endpoint of the Hookpost public API
 * (apps/backend/src/public-api/routes/v1/public.integrations.controller.ts).
 * Listing tools needs no credentials; calling one needs HOOKPOST_API_KEY.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const VERSION = '0.1.0';
const DEFAULT_API_URL = 'https://hookpost.hookstep.in/api/public/v1';
const MISSING_KEY =
  'Set HOOKPOST_API_KEY - create one in Hookpost under Settings → Developers.';

const apiUrl = (process.env.HOOKPOST_API_URL || DEFAULT_API_URL).replace(/\/+$/, '');

type ToolResult = {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
};

class HookpostError extends Error {}

function ok(data: unknown): ToolResult {
  return {
    content: [
      { type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) },
    ],
  };
}

function fail(message: string): ToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

async function call(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  options: { query?: Record<string, string | undefined>; body?: unknown } = {}
): Promise<unknown> {
  const key = process.env.HOOKPOST_API_KEY?.trim();
  if (!key) throw new HookpostError(MISSING_KEY);

  const url = new URL(apiUrl + path);
  for (const [k, v] of Object.entries(options.query || {})) {
    if (v !== undefined && v !== '') url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = {
    // The public API takes the raw key, with no "Bearer" prefix.
    Authorization: key,
    Accept: 'application/json',
    'User-Agent': `hookpost-mcp/${VERSION}`,
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    throw new HookpostError(
      `Could not reach Hookpost at ${apiUrl}: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const text = await res.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON body, keep as text */
  }

  if (!res.ok) {
    const detail =
      data && typeof data === 'object'
        ? JSON.stringify(data)
        : String(data || res.statusText);
    const hint =
      res.status === 401
        ? ' (check HOOKPOST_API_KEY; "No subscription found" means the organisation needs an active plan)'
        : res.status === 429
          ? ' (rate limited - try again later)'
          : '';
    throw new HookpostError(`Hookpost API ${method} ${path} failed with HTTP ${res.status}${hint}: ${detail}`);
  }
  return data;
}

/** Wraps a handler so API/credential problems come back as MCP tool errors. */
function run<A>(fn: (args: A) => Promise<unknown>) {
  return async (args: A): Promise<ToolResult> => {
    try {
      // Checked before any argument validation so a missing key is always the first thing reported.
      if (!process.env.HOOKPOST_API_KEY?.trim()) throw new HookpostError(MISSING_KEY);
      return ok(await fn(args));
    } catch (err) {
      return fail(err instanceof Error ? err.message : String(err));
    }
  };
}

const server = new McpServer({ name: 'hookpost', version: VERSION });

// GET /integrations
server.registerTool(
  'list_channels',
  {
    title: 'List channels',
    description:
      'List the social channels (integrations) connected to your Hookpost organisation. Returns each channel\'s id, name, provider identifier (e.g. "x", "linkedin", "instagram"), picture, disabled flag and customer group. Use the id when creating posts.',
    inputSchema: {
      group: z
        .string()
        .optional()
        .describe('Only return channels in this customer group id (see list_groups).'),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  run(async ({ group }: { group?: string }) =>
    call('GET', '/integrations', { query: { group } })
  )
);

// GET /groups
server.registerTool(
  'list_groups',
  {
    title: 'List customer groups',
    description: 'List the customer groups in your organisation (id and name). Groups are used to organise channels per client.',
    inputSchema: {},
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  run(async () => call('GET', '/groups'))
);

// GET /integration-settings/:id
server.registerTool(
  'get_channel_settings',
  {
    title: 'Get channel settings schema',
    description:
      'Get the posting rules, maximum post length and the settings schema for one channel. Some providers require settings on every post (e.g. YouTube needs a title and visibility, Pinterest needs a board); pass them as `settings` in create_post.',
    inputSchema: {
      channelId: z.string().min(1).describe('Channel id from list_channels.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  run(async ({ channelId }: { channelId: string }) =>
    call('GET', `/integration-settings/${encodeURIComponent(channelId)}`)
  )
);

// GET /find-slot/:id
server.registerTool(
  'find_free_slot',
  {
    title: 'Find next free slot',
    description:
      'Find the next free time slot in the posting schedule for a channel. Returns { date } as an ISO 8601 UTC timestamp you can pass to create_post.',
    inputSchema: {
      channelId: z.string().min(1).describe('Channel id from list_channels.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  run(async ({ channelId }: { channelId: string }) =>
    call('GET', `/find-slot/${encodeURIComponent(channelId)}`)
  )
);

// POST /upload-from-url
server.registerTool(
  'upload_media_from_url',
  {
    title: 'Upload media from URL',
    description:
      'Import an image or video into your Hookpost media library from a public HTTPS URL. The URL path must end in .png, .jpg, .jpeg, .gif, .webp or .mp4. Returns { id, path, ... }; pass { id, path } in a create_post message\'s media list.',
    inputSchema: {
      url: z.string().url().describe('Public HTTPS URL of the image or video.'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  run(async ({ url }: { url: string }) => call('POST', '/upload-from-url', { body: { url } }))
);

const mediaSchema = z.object({
  id: z.string().min(1).describe('Media id returned by upload_media_from_url.'),
  path: z.string().min(1).describe('Media path returned by upload_media_from_url.'),
  alt: z.string().optional().describe('Alt text.'),
});

const messageSchema = z.object({
  content: z
    .string()
    .describe('Post text. Plain text or simple HTML (<p>, <strong>, <a> ...). May be empty only if media is attached.'),
  media: z.array(mediaSchema).optional().describe('Media attached to this message.'),
});

const channelPostSchema = z.object({
  channelId: z.string().min(1).describe('Channel id from list_channels.'),
  messages: z
    .array(messageSchema)
    .min(1)
    .describe('The first item is the post itself; any further items are posted as a thread / follow-up comments where the provider supports it.'),
  settings: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Provider-specific settings (see get_channel_settings), e.g. { "title": "...", "type": "public" } for YouTube.'),
});

type CreatePostArgs = {
  type: 'schedule' | 'now' | 'draft';
  date?: string;
  posts: z.infer<typeof channelPostSchema>[];
  shortLink?: boolean;
  tags?: string[];
};

// POST /posts
server.registerTool(
  'create_post',
  {
    title: 'Create post',
    description:
      'Create a post on one or more channels. type "schedule" queues it for `date`, "now" publishes immediately, "draft" saves without publishing. Content can differ per channel. Attach media by first calling upload_media_from_url.',
    inputSchema: {
      type: z.enum(['schedule', 'now', 'draft']).describe('schedule, now or draft.'),
      date: z
        .string()
        .datetime({ offset: true })
        .optional()
        .describe('ISO 8601 publish time, e.g. 2026-10-01T09:00:00.000Z. Required for "schedule"; defaults to the current time otherwise.'),
      posts: z.array(channelPostSchema).min(1).describe('One entry per channel.'),
      shortLink: z.boolean().optional().describe('Shorten links in the content. Default false.'),
      tags: z.array(z.string()).optional().describe('Names of existing tags in your organisation. Unknown names are ignored.'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  run(async (args: CreatePostArgs) => {
    if (args.type === 'schedule' && !args.date) {
      throw new HookpostError('`date` is required when type is "schedule" (use find_free_slot to pick one).');
    }
    const body = {
      type: args.type,
      date: args.date ? new Date(args.date).toISOString() : new Date().toISOString(),
      shortLink: args.shortLink ?? false,
      tags: (args.tags || []).map((t) => ({ value: t, label: t })),
      posts: args.posts.map((p) => ({
        integration: { id: p.channelId },
        value: p.messages.map((m) => ({
          content: m.content,
          image: (m.media || []).map((i) => ({ id: i.id, path: i.path, ...(i.alt ? { alt: i.alt } : {}) })),
        })),
        ...(p.settings ? { settings: p.settings } : {}),
      })),
    };
    return call('POST', '/posts', { body });
  })
);

// GET /posts
server.registerTool(
  'list_posts',
  {
    title: 'List posts',
    description:
      'List posts whose publish date falls between startDate and endDate (ISO 8601). Returns { posts: [...] } with each post\'s id, group, content, publishDate, state, releaseURL and channel (integration).',
    inputSchema: {
      startDate: z.string().datetime({ offset: true }).describe('Range start, ISO 8601.'),
      endDate: z.string().datetime({ offset: true }).describe('Range end, ISO 8601.'),
      customer: z.string().optional().describe('Only posts for this customer group id.'),
      includeAttachments: z.boolean().optional().describe('Include media attachments. Default false.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  run(
    async (args: { startDate: string; endDate: string; customer?: string; includeAttachments?: boolean }) =>
      call('GET', '/posts', {
        query: {
          startDate: args.startDate,
          endDate: args.endDate,
          customer: args.customer,
          includeAttachments:
            args.includeAttachments === undefined ? undefined : String(args.includeAttachments),
        },
      })
  )
);

// DELETE /posts/:id
server.registerTool(
  'delete_post',
  {
    title: 'Delete post',
    description:
      'Delete a post by id. This deletes its whole group (the same post on every channel it was created for) from Hookpost and cancels any pending publish. A post that is already live is not removed from the social network.',
    inputSchema: {
      postId: z.string().min(1).describe('Post id from list_posts or create_post.'),
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
  },
  run(async ({ postId }: { postId: string }) =>
    call('DELETE', `/posts/${encodeURIComponent(postId)}`)
  )
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdout is the protocol channel; log to stderr only.
  console.error(`hookpost-mcp ${VERSION} running on stdio (API: ${apiUrl})`);
}

main().catch((err) => {
  console.error('hookpost-mcp failed to start:', err);
  process.exit(1);
});
