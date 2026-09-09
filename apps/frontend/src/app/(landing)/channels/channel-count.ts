import { CHANNEL_SPECS } from './channel-specs';

/**
 * The number of channels the marketing site is allowed to claim.
 *
 * Do NOT hardcode this anywhere. A typed number drifted four ways in a single
 * day - the live site said 30, one pending commit said 20, channel-specs held
 * 18, and the og-image said 30 hours after it stopped being true. Nobody
 * reading the repo could check it, because the real figure is 32 registered
 * providers minus HIDDEN_PROVIDERS, and that is a server environment variable.
 *
 * channel-specs.ts states its own invariant - "only channels a signed-up user
 * can actually connect appear here" - so deriving from it means the claim
 * cannot outrun the product. Delete a spec entry and every count on the site
 * follows automatically.
 *
 * One known gap, stated rather than hidden: moltbook is connectable but has no
 * spec entry, so this undercounts by one. Undercounting is the safe direction
 * for a marketing claim; add its spec entry to fix it properly.
 */
export const CHANNEL_COUNT = Object.keys(CHANNEL_SPECS).length;

/**
 * The number of channels Hookpost can actually PUBLISH to.
 *
 * Not the same as CHANNEL_COUNT, and the difference matters. A spec entry with
 * `pending` set is connectable today but cannot publish yet - Pinterest is one,
 * awaiting Pinterest Standard access - so "publishes to 18 networks" was wrong
 * by one while "connect 18 networks" was right. We spent 2026-09-08 removing
 * exactly this class of claim from the marketing pages, so the count follows the
 * verb: use CHANNEL_COUNT for connect/support copy, this for publish copy.
 *
 * When a pending channel is approved, delete its `pending` string and both
 * numbers converge on their own.
 */
export const PUBLISHABLE_CHANNEL_COUNT = Object.values(CHANNEL_SPECS).filter(
  (spec) => !spec.pending
).length;
