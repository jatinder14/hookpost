// Shared, framework-free counting helpers for the free tool pages. Deliberately
// NOT a 'use client' module: server pages import the constants from here, and
// client components import the functions. Logic mirrors
// tools/character-counter/counter.tsx (left untouched) so the two agree.
//
// `_lib` is a private folder, so Next never treats it as a route.

export const X_LIMIT = 280;
export const X_PREMIUM_LIMIT = 25000;
export const X_URL_WEIGHT = 23;
export const BLUESKY_LIMIT = 300;
// app.bsky.feed.post lexicon: text has maxGraphemes 300 and maxLength 3000,
// and lexicon maxLength is measured in UTF-8 bytes.
export const BLUESKY_MAX_BYTES = 3000;
export const LINKEDIN_LIMIT = 3000;

export type Token = { text: string; weight: number; url?: boolean; emoji?: boolean };

const URL_RE = /https?:\/\/\S+/g;
// Trailing punctuation after a link is not part of the link on X.
const URL_TRAIL_RE = /[.,!?;:'")\]}]+$/;

// Created once: the splitter calls this thousands of times per keystroke.
let segmenter: any;
export const graphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    segmenter ??= new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s: any) => s.segment as string);
  }
  return Array.from(text);
};

export const graphemeCount = (text: string): number => graphemes(text).length;

const encoder = new TextEncoder();
export const utf8Bytes = (text: string): number => encoder.encode(text).length;

export const wordCount = (text: string): number => (text.trim() ? text.trim().split(/\s+/).length : 0);

const isEmoji = (g: string) => /\p{Extended_Pictographic}/u.test(g);

// twitter-text v3 weights: code points in these ranges weigh 1, everything
// else weighs 2. Devanagari (U+0900-U+097F) sits inside 0-4351, so Hindi is 1
// per code point; CJK is outside, so it is 2.
const codePointWeight = (cp: number) =>
  (cp >= 0 && cp <= 4351) ||
  (cp >= 8192 && cp <= 8205) ||
  (cp >= 8208 && cp <= 8223) ||
  (cp >= 8242 && cp <= 8247)
    ? 1
    : 2;

const pushPlain = (text: string, out: Token[]) => {
  for (const g of graphemes(text)) {
    if (isEmoji(g)) {
      out.push({ text: g, weight: 2, emoji: true });
      continue;
    }
    let w = 0;
    for (const ch of g) w += codePointWeight(ch.codePointAt(0) || 0);
    out.push({ text: g, weight: w });
  }
};

// Splits text into weighted tokens the way X counts it: each link is one
// token of weight 23, each emoji weighs 2, other graphemes weigh the sum of
// their code points. X normalises to NFC before counting, so we do too.
export const xTokens = (input: string): Token[] => {
  const text = input.normalize('NFC');
  const out: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    const start = m.index ?? 0;
    const raw = m[0];
    const trail = raw.match(URL_TRAIL_RE)?.[0] || '';
    const url = trail ? raw.slice(0, raw.length - trail.length) : raw;
    pushPlain(text.slice(last, start), out);
    if (url.length > 'https://'.length) {
      out.push({ text: url, weight: X_URL_WEIGHT, url: true });
      pushPlain(trail, out);
    } else {
      pushPlain(raw, out);
    }
    last = start + raw.length;
  }
  pushPlain(text.slice(last), out);
  return out;
};

export const xWeight = (text: string): number => xTokens(text).reduce((n, t) => n + t.weight, 0);

// Plain grapheme tokens (weight 1 each) for networks that count visible
// characters, such as Bluesky and LinkedIn.
export const graphemeTokens = (text: string): Token[] =>
  graphemes(text).map((g) => ({ text: g, weight: 1, emoji: isEmoji(g) }));

// Splits tokens into the part that fits within `limit` and the overflow.
export const splitAtLimit = (tokens: Token[], limit: number): { fit: string; over: string } => {
  let used = 0;
  let i = 0;
  for (; i < tokens.length; i++) {
    if (used + tokens[i].weight > limit) break;
    used += tokens[i].weight;
  }
  return {
    fit: tokens.slice(0, i).map((t) => t.text).join(''),
    over: tokens.slice(i).map((t) => t.text).join(''),
  };
};
