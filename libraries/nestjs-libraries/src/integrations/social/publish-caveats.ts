/**
 * Channels a user can connect but that cannot publish yet.
 *
 * This exists because the marketing site and the product disagreed. On
 * 2026-09-08 we added `pending` to Pinterest's entry in channel-specs.ts, which
 * put an amber "Not publishing yet" banner on /channels/pinterest and made
 * PUBLISHABLE_CHANNEL_COUNT (17) differ from CHANNEL_COUNT (18). But
 * channel-specs.ts is imported by exactly two landing pages and nothing else -
 * so the product never learned. Pinterest stayed fully selectable in the
 * composer with no badge and no warning.
 *
 * The failure itself is handled correctly: pinterest.provider.ts recognises
 * Pinterest's Trial-access rejection, the workflow marks the post ERROR, and the
 * user gets an in-app notification and a failure email. So nothing vanishes
 * silently. The problem is timing - the customer finds out after the scheduled
 * time passes, having planned a campaign around a Pin that was never going to
 * go out. Telling them at compose time costs us nothing and costs them a lot
 * less.
 *
 * Both surfaces read this map, so the disclosure cannot drift again.
 *
 * WHEN APPROVAL LANDS: delete the channel's entry here. That one deletion
 * removes the marketing banner, restores the publishable count, and removes the
 * composer badge and tooltip - there is nothing else to remember.
 */
export const PUBLISH_PENDING: Record<string, string> = {
  pinterest:
    'Publishing to Pinterest is awaiting Pinterest Standard access approval. You can connect a Pinterest account today, but scheduled Pins will not publish until that approval lands.',
};

/** Short form for a badge tooltip or an inline label. */
export function publishPendingFor(identifier?: string): string | undefined {
  if (!identifier) return undefined;
  return PUBLISH_PENDING[identifier.toLowerCase()];
}
