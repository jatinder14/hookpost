// Pure thread-splitting logic for /tools/thread-splitter. No React, no
// 'use client', so it can be unit-tested with plain Node.
import {
  BLUESKY_LIMIT,
  BLUESKY_MAX_BYTES,
  X_LIMIT,
  graphemeCount,
  graphemes,
  utf8Bytes,
  xTokens,
  xWeight,
} from './count';

export type ThreadNetwork = 'x' | 'bluesky';

export const THREAD_LIMITS: Record<ThreadNetwork, number> = { x: X_LIMIT, bluesky: BLUESKY_LIMIT };

export const postLength = (text: string, network: ThreadNetwork): number =>
  network === 'x' ? xWeight(text) : graphemeCount(text);

const fitsFor = (network: ThreadNetwork) =>
  network === 'x'
    ? (s: string) => xWeight(s) <= X_LIMIT
    : (s: string) => graphemeCount(s) <= BLUESKY_LIMIT && utf8Bytes(s) <= BLUESKY_MAX_BYTES;

let sentenceSeg: any;
const sentences = (line: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    sentenceSeg ??= new (Intl as any).Segmenter(undefined, { granularity: 'sentence' });
    return Array.from(sentenceSeg.segment(line), (s: any) => (s.segment as string).trim()).filter(Boolean);
  }
  return (line.match(/[^.!?…]+(?:[.!?…]+["'”’)\]]*|$)\s*/g) || [line])
    .map((s) => s.trim())
    .filter(Boolean);
};

// Greedy packer: keeps whole sentences together, falls back to whole words,
// and only cuts inside a word when a single word is longer than a post.
const pack = (text: string, fits: (s: string) => boolean, network: ThreadNetwork): string[] => {
  const chunks: string[] = [];
  let cur = '';

  const flush = () => {
    if (cur) chunks.push(cur);
    cur = '';
  };

  const hardSplit = (word: string, sep: string) => {
    // Links stay whole on X (they weigh 23 whatever their length).
    const pieces = network === 'x' ? xTokens(word).map((t) => t.text) : graphemes(word);
    let first = true;
    for (const p of pieces) {
      const joiner = first ? sep : '';
      first = false;
      if (cur && fits(cur + joiner + p)) {
        cur += joiner + p;
      } else {
        flush();
        cur = p;
      }
    }
  };

  const addWord = (word: string, sep: string) => {
    if (cur && fits(cur + sep + word)) {
      cur += sep + word;
      return;
    }
    flush();
    if (fits(word)) cur = word;
    else hardSplit(word, '');
  };

  const addSentence = (sentence: string, sep: string) => {
    if (cur && fits(cur + sep + sentence)) {
      cur += sep + sentence;
      return;
    }
    if (fits(sentence)) {
      flush();
      cur = sentence;
      return;
    }
    // Sentence alone is too long: fill the current post word by word.
    sentence.split(/\s+/).forEach((w, i) => addWord(w, i === 0 ? sep : ' '));
  };

  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  paragraphs.forEach((para, pi) => {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, li) => {
      sentences(line).forEach((s, si) => {
        const sep = si > 0 ? ' ' : li > 0 ? '\n' : pi > 0 ? '\n\n' : '';
        addSentence(s, sep);
      });
    });
  });
  flush();
  return chunks;
};

// Splits `text` into posts that each fit the network's limit. With
// `numbering`, each post gets a " i/n" suffix that is counted inside the
// limit: we reserve the widest suffix for the current guess of n and repeat
// until the number of digits in n stops growing.
export const splitThread = (text: string, network: ThreadNetwork, numbering: boolean): string[] => {
  const clean = text.replace(/\r\n?/g, '\n').trim();
  if (!clean) return [];
  const fits = fitsFor(network);

  const plain = pack(clean, fits, network);
  if (!numbering || plain.length <= 1) return plain;

  let n = plain.length;
  for (let attempt = 0; attempt < 8; attempt++) {
    const suffix = ` ${n}/${n}`;
    const chunks = pack(clean, (s) => fits(s + suffix), network);
    if (String(chunks.length).length <= String(n).length) {
      return chunks.map((c, i) => `${c} ${i + 1}/${chunks.length}`);
    }
    n = chunks.length;
  }
  const chunks = pack(clean, (s) => fits(`${s} ${n}/${n}`), network);
  return chunks.map((c, i) => `${c} ${i + 1}/${chunks.length}`);
};
