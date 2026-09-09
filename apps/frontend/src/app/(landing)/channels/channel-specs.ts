import { PUBLISH_PENDING } from '@hookpost/nestjs-libraries/integrations/social/publish-caveats';

// Only channels a signed-up user can actually connect appear here.
//
// The site previously carried spec pages for TikTok, Reddit, Dribbble, Mastodon,
// Google Business, Whop, Twitch, Skool, Kick, Warpcast, VK, Mewe and Tumblr -
// every one of them telling a visitor how to schedule posts and promising
// "Connect once with OAuth". None of them are connectable: reddit and tiktok are
// commented out in integration.manager.ts (Reddit's API app is blocked by the
// Responsible Builder Policy, TikTok cannot be API-approved from India), and the
// rest are in HIDDEN_PROVIDERS so they never appear on the add-channel screen.
//
// A visitor could read the page, sign up, and find nothing to connect. If any of
// these becomes available, remove it from HIDDEN_PROVIDERS and restore its entry
// here - in that order, so the page never leads the product.

// Per-channel specifications.
//
// These are the limits and rules Hookpost actually enforces, read out of each
// provider in libraries/nestjs-libraries/src/integrations/social/. Character
// limits come from that provider's maxLength(); the rules are the conditions
// its checkValidity() rejects, rewritten to read as capabilities rather than
// error messages.
//
// This exists because the 30 channel pages were templated - all within 20
// words of each other, with nothing on them a reader could not have guessed.
// Real per-network constraints are the one thing these pages can say that a
// competitor's cannot.
//
// If a provider's limits change, update them here too.
export interface ChannelSpec {
  limit: string;
  auth: string;
  rules: string[];
  /**
   * Set when the channel can be CONNECTED but cannot yet PUBLISH - a platform
   * approval is outstanding. Rendered prominently on the channel page so the
   * page never promises something the product will fail at. Remove it the day
   * approval lands, not before.
   */
  pending?: string;
}

export const CHANNEL_SPECS: Record<string, ChannelSpec> = {
  'instagram': { limit: '2,200 characters', auth: 'Connect once with OAuth', rules: ["At least one image or video per post", "Carousels up to 10 items", "Reels: one video, no mixing with images", "Business or Creator account required"] },
  'pinterest': { limit: '500 characters', auth: 'Connect once with OAuth', pending: PUBLISH_PENDING.pinterest, rules: ["At least one image or video per Pin", "Up to 5 media items", "Video Pins need a cover image as the second item"] },
  'youtube': { limit: '5,000 characters', auth: 'Connect once with OAuth', rules: ["One video per upload", "Title and visibility set per post", "Video only — images are not accepted"] },
  'linkedin': { limit: '3,000 characters', auth: 'Connect once with OAuth', rules: ["Carousels need 2+ images and no video", "One media item when posting video", "Comments are text only"] },
  'facebook': { limit: '63,206 characters', auth: 'Connect once with OAuth', rules: ["Stories require at least one media item", "Posts to a Page, not a personal profile"] },
  'threads': { limit: '500 characters', auth: 'Connect once with OAuth', rules: ["Text, image or video"] },
  'x': { limit: '280 characters (25,000 on Premium)', auth: 'Connect once with OAuth', rules: ["Threads supported", "Articles accept images only"] },
  'bluesky': { limit: '300 characters', auth: 'Connect with your own credentials', rules: ["Up to 4 images per post", "One video per post", "Connects with an App Password, not your account password"] },
  'discord': { limit: '1,980 characters', auth: 'Connect once with OAuth', rules: ["Posts to a channel in your server", "Bot must be invited to the server"] },
  'slack': { limit: 'No practical limit', auth: 'Connect once with OAuth', rules: ["Posts to a channel your app is added to"] },
  'telegram': { limit: '4,096 characters per message', auth: 'Connect once with OAuth', rules: ["Posts to a channel or group", "No practical character limit"] },
  'lemmy': { limit: '10,000 characters', auth: 'Connect with your own credentials', rules: ["Posts to a community on your instance"] },
  'nostr': { limit: 'No practical limit', auth: 'Connect with your own credentials', rules: ["Connects with a HEX private key"] },
  'listmonk': { limit: 'No practical limit', auth: 'Connect with your own credentials', rules: ["Sends to a mailing list, not a social feed"] },
  'wordpress': { limit: 'No practical limit', auth: 'Connect with your own credentials', rules: ["Publishes a full post, not a status update", "Connects with an application password"] },
  'medium': { limit: 'No practical limit', auth: 'Connect with your own credentials', rules: ["Publishes a full article", "Connects with an integration token"] },
  'hashnode': { limit: '10,000 characters', auth: 'Connect with your own credentials', rules: ["Publishes a full article to your blog"] },
  'devto': { limit: 'No practical limit', auth: 'Connect with your own credentials', rules: ["Publishes a full article", "Connects with an API key"] },
};
