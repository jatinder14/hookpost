// Long-form content for the channels worth ranking for.
//
// The other channel pages carry the specification block and nothing more,
// which is honest but shallow. These five are the ones people actually search
// for and the ones that are live and connectable today, so they get real
// depth: the post types the provider genuinely supports, the settings it
// exposes per post, and the constraint that most often trips someone up.
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
      'LinkedIn takes 3,000 characters and treats documents differently from images, which is where most scheduling tools quietly give up. Hookpost posts to a personal profile or, separately, to a Company Page.',
    publish: [
      {
        title: 'Text and single media',
        body: 'Up to 3,000 characters with one image or one video. Video posts accept exactly one media item — LinkedIn rejects a mixed attachment set.',
      },
      {
        title: 'Image carousels',
        body: 'Two or more images published as a swipeable carousel with its own title. Videos cannot be mixed into a carousel; the post is rejected before it is sent rather than after.',
      },
      {
        title: 'Company Pages',
        body: 'A separate channel type from your personal profile, so a page and a person can be scheduled independently in the same calendar.',
      },
    ],
    perPost: [
      'Post as an image carousel, with a carousel name',
      'Visibility — public feed',
      'Personal profile or Company Page',
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
};
