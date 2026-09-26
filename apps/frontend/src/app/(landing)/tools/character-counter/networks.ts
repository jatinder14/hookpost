// Limits Hookpost's own providers enforce (maxLength() in each provider under
// libraries/nestjs-libraries/src/integrations/social/). Keep in step with
// channels/channel-specs.ts.
export const COUNTER_NETWORKS: { key: string; name: string; limit: number; note?: string }[] = [
  { key: 'x', name: 'X (Twitter)', limit: 280, note: 'Links count as 23, emoji as 2. Premium: 25,000 on X, 4,000 via Hookpost.' },
  { key: 'bluesky', name: 'Bluesky', limit: 300 },
  { key: 'threads', name: 'Threads', limit: 500 },
  { key: 'pinterest', name: 'Pinterest', limit: 500, note: 'Pin description.' },
  { key: 'discord', name: 'Discord', limit: 1980 },
  { key: 'instagram', name: 'Instagram', limit: 2200, note: 'Caption.' },
  { key: 'linkedin', name: 'LinkedIn', limit: 3000 },
  { key: 'telegram', name: 'Telegram', limit: 4096, note: 'Per message; 1,024 with media.' },
  { key: 'youtube', name: 'YouTube', limit: 5000, note: 'Description.' },
  { key: 'lemmy', name: 'Lemmy', limit: 10000 },
  { key: 'facebook', name: 'Facebook', limit: 63206 },
];

