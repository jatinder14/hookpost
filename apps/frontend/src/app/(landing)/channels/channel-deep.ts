// Long-form content for the channels worth ranking for.
//
// The other channel pages carry the specification block and nothing more,
// which is honest but shallow. The channels here get real depth: the post
// types the provider genuinely supports, the settings it exposes per post, and
// the constraint that most often trips someone up. Channels with no settings
// DTO list the per-post controls the composer actually sends instead.
//
// Everything below is checked against the provider and its settings DTO. If a
// capability is added or removed there, update it here too — a page that
// promises a post type the provider cannot send is worse than a thin one.

export interface DeepSection {
  intro: string;
  publish: { title: string; body: string }[];
  perPost: string[];
  gotcha: { title: string; body: string };
}

export const CHANNEL_DEEP: Record<string, DeepSection> = {
  instagram: {
    intro:
      'Instagram publishing runs through the Content Publishing API, so a scheduled post goes live on its own. There is no push notification asking you to finish it by hand, which is how most tools that call themselves Instagram schedulers actually work.',
    publish: [
      {
        title: 'Feed posts and Reels',
        body: 'A single image, or a video that Instagram treats as a Reel. Caption up to 2,200 characters, counted as you type so a post that would be rejected never leaves the calendar.',
      },
      {
        title: 'Carousels up to 10 items',
        body: 'Each slide is uploaded as its own container and the carousel is published as one atomic action, so a partial upload never leaves you with half a carousel on the profile.',
      },
      {
        title: 'Stories',
        body: 'Published as a Story rather than to the grid. Chosen per post, so the same draft can go to either.',
      },
    ],
    perPost: [
      'Post / Reel or Story',
      'Collaborators — invite another account to co-author',
      'Trial Reel, shown first to non-followers',
      'Graduation strategy: publish manually, or automatically on performance',
      'Audio selection',
    ],
    gotcha: {
      title: 'It has to be a Business or Creator account',
      body: 'Meta only exposes publishing for Business and Creator accounts linked to a Facebook Page. Personal accounts cannot be scheduled by any tool, including this one — if a connection fails, that is almost always why.',
    },
  },

  linkedin: {
    intro:
      'LinkedIn takes 3,000 characters and treats documents differently from images, which is where most scheduling tools quietly give up. Hookpost posts to your personal profile; Company Pages are not available yet.',
    publish: [
      {
        title: 'Text and single media',
        body: 'Up to 3,000 characters with one image or one video. Video posts accept exactly one media item — LinkedIn rejects a mixed attachment set.',
      },
      {
        title: 'Image carousels',
        body: 'Two or more images published as a swipeable carousel with its own title. Videos cannot be mixed into a carousel; the post is rejected before it is sent rather than after.',
      },
    ],
    perPost: [
      'Post as an image carousel, with a carousel name',
      'Visibility — public feed',
    ],
    gotcha: {
      title: 'Comments are text only',
      body: 'LinkedIn will not accept media on a comment. If you schedule a first comment with an image attached, the comment fails while the parent post succeeds — so Hookpost blocks it up front instead.',
    },
  },

  youtube: {
    intro:
      'YouTube uploads are a video plus the metadata that decides whether anyone finds it. Hookpost sets all of it at schedule time, so the upload does not need you present.',
    publish: [
      {
        title: 'Videos and Shorts',
        body: 'One video per upload. A vertical video under the length YouTube treats as a Short is published as one automatically — there is no separate Shorts setting to get wrong.',
      },
      {
        title: 'Full metadata on upload',
        body: 'Title, description up to 5,000 characters, tags and a custom thumbnail all go up with the video rather than being added afterwards.',
      },
      {
        title: 'Scheduled visibility',
        body: 'Upload privately and switch to public at the scheduled minute, or publish straight away.',
      },
    ],
    perPost: [
      'Title (required)',
      'Visibility: public, private or unlisted',
      'Tags',
      'Custom thumbnail',
      'Made for kids declaration (required by YouTube)',
    ],
    gotcha: {
      title: 'Video only, and the title is mandatory',
      body: 'YouTube rejects an upload with no title, and it will not take images. Both are checked before the post is queued, so a scheduled upload does not fail silently at 3am.',
    },
  },

  x: {
    intro:
      'X is the channel where the settings matter most: who can reply, whether it is a thread, whether it belongs to a Community. Hookpost exposes all of them per post rather than assuming a default.',
    publish: [
      {
        title: 'Posts and threads',
        body: 'A single post, or a thread written as one draft and published in order. Each part carries its own media.',
      },
      {
        title: 'Articles',
        body: 'Long-form articles with a cover image and a title, publishable or saved as a draft. Articles accept images only — video is rejected before sending.',
      },
      {
        title: 'Community posts',
        body: 'Publish into an X Community rather than your main timeline, chosen per post.',
      },
    ],
    perPost: [
      'Who can reply: everyone, people you follow, mentioned users, subscribers, or verified accounts',
      'Post, thread, or article',
      'Community to post into',
      'Paid partnership disclosure',
      'Made-with-AI label',
    ],
    gotcha: {
      title: 'A draft article cannot carry thread replies',
      body: 'X treats the two as different objects. Attach replies to a draft article and the whole post fails — Hookpost catches that combination at compose time and tells you which one to drop.',
    },
  },

  pinterest: {
    intro:
      'Every Pin needs a board and an image, and a Pin without a destination link is a wasted one. Hookpost asks for all three at schedule time.',
    publish: [
      {
        title: 'Image Pins',
        body: 'Up to five media items per Pin, each pinned to a board you choose per post. Description up to 500 characters.',
      },
      {
        title: 'Video Pins',
        body: 'A video plus a cover image as the second item — Pinterest requires the cover and rejects the Pin without it, so Hookpost requires it too.',
      },
      {
        title: 'Destination links',
        body: 'Each Pin carries the URL it should send traffic to, which is the whole point of Pinterest as a channel and the field most schedulers bury.',
      },
    ],
    perPost: [
      'Board (required)',
      'Pin title',
      'Destination link',
      'Dominant colour',
    ],
    gotcha: {
      title: 'A video Pin is exactly two items',
      body: 'The video and its cover image, in that order. Add a third and Pinterest rejects the Pin; Hookpost blocks it before the upload rather than after.',
    },
  },

  bluesky: {
    intro:
      'Bluesky posts are published over the AT Protocol with your handle and an App Password. The service defaults to bsky.social, and a self-hosted PDS address can be entered instead.',
    publish: [
      {
        title: 'Text posts up to 300 characters',
        body: 'Links and @mentions in the text are turned into clickable facets before the post is created, the same way the Bluesky app does it.',
      },
      {
        title: 'Up to four images, or one video',
        body: 'Images carry their alt text and aspect ratio, and any image over roughly 976 KB is scaled down to fit Bluesky’s blob limit. A video is processed by Bluesky’s video service first, and the post is only created once processing finishes.',
      },
      {
        title: 'Threads',
        body: 'Follow-up entries are published as replies to the one before, so a multi-part draft lands as a single thread under the first post.',
      },
    ],
    perPost: [
      'Alt text on each image',
      'Follow-up posts, published as a reply thread',
      'Mentions of other Bluesky accounts',
    ],
    gotcha: {
      title: 'Use an App Password, not your account password',
      body: 'Create one in Bluesky under Settings > Privacy and Security > App Passwords and paste that in. It works with two-factor authentication left switched on, so there is no need to turn 2FA off.',
    },
  },

  telegram: {
    intro:
      'Telegram posts are sent by the Hookpost bot into a group or channel you add it to. To connect, you add the bot to the chat and send the /connect code Hookpost gives you there.',
    publish: [
      {
        title: 'Text messages',
        body: 'Up to 4,096 characters. Bold, underline and paragraph breaks are kept; other formatting is stripped before sending.',
      },
      {
        title: 'Photos, videos and files',
        body: 'One attachment is sent as a photo, video or document depending on its type. Several are sent as an album of up to 10, and anything beyond that goes out as a further album.',
      },
      {
        title: 'Replies',
        body: 'Follow-up entries are posted as replies to the original message, so they stay attached to it in the chat.',
      },
    ],
    perPost: [
      'Bold and underlined text',
      'Photos, videos or files',
      'Follow-up messages, posted as replies',
    ],
    gotcha: {
      title: 'Captions stop at 1,024 characters',
      body: 'A text-only message can run to 4,096 characters, but once media is attached Telegram treats the text as a caption and caps it at 1,024. Keep long copy for text-only posts.',
    },
  },

  discord: {
    intro:
      'Discord posts are sent by the Hookpost bot into a channel on your server. Connecting runs Discord’s OAuth flow, which is where you pick the server and invite the bot to it.',
    publish: [
      {
        title: 'Messages up to 1,980 characters',
        body: 'Written in Markdown and sent to the text or announcement channel you pick on each post.',
      },
      {
        title: 'Attachments',
        body: 'Images and other media are uploaded to Discord as file attachments on the message, not posted as links.',
      },
      {
        title: 'Replies in a thread',
        body: 'Follow-up entries open a thread on the original message and are posted inside it, so the channel itself stays to one message.',
      },
    ],
    perPost: [
      'Channel (required)',
      'Mentions of members and roles, plus @here and @everyone',
      'Follow-up messages, posted in a thread',
    ],
    gotcha: {
      title: 'The bot needs access to the channel',
      body: 'Messages come from the Hookpost bot, so it has to stay in the server and be allowed to see and post in the chosen channel. If a channel’s permissions shut it out, the post fails with a missing-access or missing-permission error.',
    },
  },

  slack: {
    intro:
      'Slack posts are sent by the Hookpost app into a channel in your workspace. Connecting installs the app through Slack’s OAuth flow; each post goes to the channel you choose.',
    publish: [
      {
        title: 'Messages',
        body: 'Text is sent in Slack’s mrkdwn format, shown under the name and picture of the connected channel in Hookpost.',
      },
      {
        title: 'Images',
        body: 'Attached images are added to the message as image blocks. There is no video upload.',
      },
      {
        title: 'Thread replies',
        body: 'Follow-up entries are posted as replies in the original message’s thread.',
      },
    ],
    perPost: [
      'Channel (required)',
      'Follow-up messages, posted in the thread',
    ],
    gotcha: {
      title: 'Private channels need an invite',
      body: 'Hookpost joins a public channel automatically just before posting. It cannot join a private channel on its own, so invite the app to it in Slack first.',
    },
  },

  wordpress: {
    intro:
      'WordPress gets a full post, not a status update. Hookpost connects to your site’s REST API with your domain, username and an application password, and creates the post there directly.',
    publish: [
      {
        title: 'Posts, pages and custom types',
        body: 'Any post type your site exposes through the REST API can be chosen per post. The body is sent as HTML and the slug is generated from the title.',
      },
      {
        title: 'Published, draft, pending or private',
        body: 'Publish at the scheduled minute, or send it in as a draft, as pending review, or as a private post for someone to finish in WordPress.',
      },
      {
        title: 'Featured image, categories and tags',
        body: 'The cover picture is uploaded to your media library and set as the featured image. Categories and tags are read from your site, so you pick existing ones rather than typing them.',
      },
    ],
    perPost: [
      'Title (required)',
      'Post type (required)',
      'Status: publish, draft, pending or private',
      'Categories and tags',
      'Cover picture, set as the featured image',
    ],
    gotcha: {
      title: 'It needs an application password',
      body: 'Create one under Users > Profile in WordPress and use it instead of your login password. If the site still rejects it, a security plugin or server setting is usually blocking the REST API or stripping the Authorization header.',
    },
  },

  medium: {
    intro:
      'Medium gets a full article, not a short post. Hookpost connects with a Medium integration token and sends the article as Markdown, either to your own profile or to a publication you belong to.',
    publish: [
      {
        title: 'Articles on your profile',
        body: 'Published publicly at the scheduled time, with the title and body you wrote in Markdown.',
      },
      {
        title: 'Publication submissions',
        body: 'Pick a publication on the post and the article is submitted to it instead of your profile.',
      },
      {
        title: 'Canonical links',
        body: 'An article first published elsewhere can point back to the original, so Medium carries the canonical URL.',
      },
    ],
    perPost: [
      'Title (required)',
      'Canonical link',
      'Publication',
      'Topics',
    ],
    gotcha: {
      title: 'Publication posts arrive as drafts',
      body: 'Only articles sent to your own profile go live on schedule. An article sent to a publication is created as a draft there, and someone still has to publish it in Medium.',
    },
  },

  hashnode: {
    intro:
      'Hashnode gets a full article on your blog, not a status update. Hookpost connects with a Hashnode personal access token and publishes the article as Markdown to the publication you choose.',
    publish: [
      {
        title: 'Markdown articles',
        body: 'Published straight to your Hashnode blog at the scheduled time, with a title and an optional subtitle.',
      },
      {
        title: 'Cover images',
        body: 'A cover picture can be set on each article and is sent with it.',
      },
      {
        title: 'Canonical links',
        body: 'An article first published elsewhere can point back to the original URL.',
      },
    ],
    perPost: [
      'Title, at least six characters (required)',
      'Publication (required)',
      'At least one tag (required)',
      'Subtitle',
      'Cover picture',
      'Canonical link',
    ],
    gotcha: {
      title: 'Articles are capped at 10,000 characters',
      body: 'That is roughly 1,500 words of Markdown, and the composer stops you going past it. A longer piece needs trimming or splitting before it can be scheduled here.',
    },
  },

  devto: {
    intro:
      'dev.to gets a full article, not a status update. Hookpost connects with a dev.to API key and publishes the article as Markdown under your account or an organization.',
    publish: [
      {
        title: 'Markdown articles',
        body: 'Title, body and a cover image, published under your name at the scheduled time.',
      },
      {
        title: 'Up to four tags',
        body: 'Chosen from dev.to’s own tag list, so a tag that does not exist there cannot be added.',
      },
      {
        title: 'Canonical links',
        body: 'An article first published elsewhere can point back to the original. dev.to accepts each canonical URL only once, so a second article with the same one is rejected.',
      },
    ],
    perPost: [
      'Title (required)',
      'Cover picture',
      'Tags, up to four',
      'Organization — lists the ones you have already published under',
      'Canonical link',
    ],
    gotcha: {
      title: 'It goes live, not to drafts',
      body: 'Every article is sent to dev.to as published. There is no draft option, so the scheduled article is public the moment it goes out.',
    },
  },

  lemmy: {
    intro:
      'Lemmy posts go to communities, logged in with your username and password on your own instance. The instance defaults to lemmy.world and can be changed to wherever your account lives.',
    publish: [
      {
        title: 'Community posts',
        body: 'A title and a body of up to 10,000 characters, posted to a community you find by searching from your instance.',
      },
      {
        title: 'Several communities at once',
        body: 'One draft can go to more than one community, each with its own title and an optional link.',
      },
      {
        title: 'Comments',
        body: 'Follow-up entries are posted as comments on every community post the draft created.',
      },
    ],
    perPost: [
      'Communities, at least one (required)',
      'Title for each community (required)',
      'Link for each community',
      'One image, used as the post’s thumbnail',
    ],
    gotcha: {
      title: 'Connect to the instance your account is on',
      body: 'Hookpost logs in at the service address you enter, which starts as lemmy.world. If your account lives on another instance, change it there first or the login is rejected as invalid credentials.',
    },
  },

  nostr: {
    intro:
      'Nostr posts are signed with your private key and published as text notes to five public relays: nos.lol, relay.damus.io, relay.snort.social, temp.iris.to and vault.iris.to.',
    publish: [
      {
        title: 'Text notes',
        body: 'Published as a standard note, the kind every Nostr client shows in its feed.',
      },
      {
        title: 'Media as links',
        body: 'Attached images and videos are added to the end of the note as URLs, which most clients render inline. Nothing is uploaded to a relay.',
      },
      {
        title: 'Reply chains',
        body: 'Follow-up entries are published as replies, each one pointing at the note before it.',
      },
    ],
    perPost: [
      'Media, appended as links',
      'Follow-up notes, published as replies',
    ],
    gotcha: {
      title: 'It wants the HEX key, not nsec',
      body: 'Paste the hexadecimal form of your private key. The nsec1… form many clients show will not decode correctly, so convert it to HEX before connecting.',
    },
  },

  listmonk: {
    intro:
      'Listmonk sends an email campaign to a mailing list, not a post to a feed. Hookpost connects to your own Listmonk install with its URL, a username and a password.',
    publish: [
      {
        title: 'HTML email campaigns',
        body: 'The post body becomes the email, sent as a regular campaign with the subject you set.',
      },
      {
        title: 'Inbox preview text',
        body: 'A short preview line is added as a hidden preheader, which is what most inboxes show next to the subject.',
      },
      {
        title: 'Your own templates',
        body: 'Pick any template from your Listmonk install, or leave it on the default.',
      },
    ],
    perPost: [
      'Subject (required)',
      'Preview text',
      'List to send to',
      'Template',
    ],
    gotcha: {
      title: 'It sends, it does not save a draft',
      body: 'At the scheduled time Hookpost creates the campaign and starts it straight away, so the email goes to everyone on the list. Each post sends to one list.',
    },
  },
};
