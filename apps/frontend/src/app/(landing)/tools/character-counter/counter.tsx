'use client';

import { useMemo, useState } from 'react';
import { COUNTER_NETWORKS } from './networks';

const URL_RE = /https?:\/\/[^\s]+/g;

const graphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s: any) => s.segment as string);
  }
  return Array.from(text);
};

// X's weighted count (twitter-text v3): code points in the Latin and general
// punctuation ranges (which include Devanagari) weigh 1 per code point, CJK
// and other scripts weigh 2, an emoji weighs 2, and a URL counts as 23.
const xWeight = (text: string) => {
  const urls = text.match(URL_RE) || [];
  const rest = text.replace(URL_RE, '');
  let n = urls.length * 23;
  for (const g of graphemes(rest)) {
    if (/\p{Extended_Pictographic}/u.test(g)) {
      n += 2;
      continue;
    }
    for (const ch of g) {
      const cp = ch.codePointAt(0) || 0;
      const light =
        (cp >= 0 && cp <= 4351) ||
        (cp >= 8192 && cp <= 8205) ||
        (cp >= 8208 && cp <= 8223) ||
        (cp >= 8242 && cp <= 8247);
      n += light ? 1 : 2;
    }
  }
  return n;
};

export function CharacterCounter() {
  const [text, setText] = useState('');

  const counts = useMemo(() => {
    const plain = graphemes(text).length;
    return COUNTER_NETWORKS.map((n) => {
      const used = n.key === 'x' ? xWeight(text) : plain;
      return { ...n, used, left: n.limit - used };
    });
  }, [text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="min-w-0">
        <label htmlFor="post-text" className="block text-sm font-semibold text-white/70">
          Paste or type your post
        </label>
        <textarea
          id="post-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Write your post here..."
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-base text-white outline-none focus:border-[#FF4CE2]"
        />
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/60" aria-live="polite">
          <span>{graphemes(text).length.toLocaleString()} characters</span>
          <span>{words.toLocaleString()} words</span>
          <span>{text ? text.split('\n').length : 0} lines</span>
        </div>
      </div>
      <ul className="flex min-w-0 flex-col gap-2" aria-label="Characters left per network">
        {counts.map((c) => {
          const over = c.left < 0;
          const pct = Math.min(100, (c.used / c.limit) * 100);
          return (
            <li key={c.key} className="rounded-xl border border-white/10 p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{c.name}</span>
                <span className={`text-sm tabular-nums ${over ? 'text-red-400 font-bold' : 'text-white/70'}`}>
                  {over ? `${Math.abs(c.left).toLocaleString()} over` : `${c.left.toLocaleString()} left`}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full ${over ? 'bg-red-500' : 'bg-[#FF4CE2]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {c.note ? <div className="mt-1 text-xs text-white/45">{c.note}</div> : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
