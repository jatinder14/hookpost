import DOMPurify from 'isomorphic-dompurify';

// Inert formatting only - no script/style/iframe/form, no event handlers.
// Editors are inconsistent about which tag they emit for the same button
// (<strong> vs <b>, <em> vs <i>), so both spellings are allowed: a missing one
// does not fail loudly, it silently drops the user's formatting from every
// preview.
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'span',
];

const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'class',
  'data-mention-id',
  'data-mention-label',
];

// ALLOWED_URI_REGEXP makes DOMPurify treat EVERY allowed attribute as a URI
// candidate, so `target="_blank"` and `rel` were being stripped off the links
// it kept - shared previews and notifications opened external links in the
// same tab. Put them back after sanitising instead of loosening the href
// check, and force the tabnabbing-safe rel while we are there. This is the
// only DOMPurify consumer in the repo, so the global hook is not shared with
// anything else.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer nofollow');
  }
});

export const sanitizePostContent = (value: unknown): string => {
  if (typeof value !== 'string' || !value) {
    return '';
  }

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/|#)/i,
  });
};

// The agent chat turns markers in the message into <video>/<img> before it is
// injected as HTML, so it needs a wider allowlist than a post body. Everything
// else stays identical: no scripts, no event handlers, and only http(s)/mailto
// or same-origin URLs.
const RICH_TAGS = [...ALLOWED_TAGS, 'div', 'img', 'video', 'source'];

const RICH_ATTR = [
  ...ALLOWED_ATTR,
  'src',
  'alt',
  'type',
  'controls',
  'width',
  'height',
];

export const sanitizeRichContent = (value: unknown): string => {
  if (typeof value !== 'string' || !value) {
    return '';
  }

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: RICH_TAGS,
    ALLOWED_ATTR: RICH_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/|#)/i,
  });
};
