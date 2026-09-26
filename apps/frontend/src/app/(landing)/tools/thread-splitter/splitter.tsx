'use client';

import { useMemo, useState } from 'react';
import { THREAD_LIMITS, ThreadNetwork, postLength, splitThread } from '../_lib/thread';
import { wordCount } from '../_lib/count';

const NETWORKS: { key: ThreadNetwork; label: string }[] = [
  { key: 'x', label: 'X (280)' },
  { key: 'bluesky', label: 'Bluesky (300)' },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ThreadSplitter() {
  const [text, setText] = useState('');
  const [network, setNetwork] = useState<ThreadNetwork>('x');
  const [numbering, setNumbering] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const posts = useMemo(() => splitThread(text, network, numbering), [text, network, numbering]);
  const limit = THREAD_LIMITS[network];

  const onCopy = async (id: string, value: string) => {
    if (await copyText(value)) {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <div role="radiogroup" aria-label="Network" className="inline-flex rounded-full border border-white/15 p-1">
            {NETWORKS.map((n) => (
              <button
                key={n.key}
                type="button"
                role="radio"
                aria-checked={network === n.key}
                onClick={() => setNetwork(n.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  network === n.key ? 'bg-[#FF4CE2] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={numbering}
              onChange={(e) => setNumbering(e.target.checked)}
              className="h-4 w-4 accent-[#FF4CE2]"
            />
            Add 1/n numbering
          </label>
        </div>

        <label htmlFor="thread-text" className="mt-4 block text-sm font-semibold text-white/70">
          Paste your long text
        </label>
        <textarea
          id="thread-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          placeholder="Paste a long post, article intro or notes here..."
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-base text-white outline-none focus:border-[#FF4CE2]"
        />
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/60" aria-live="polite">
          <span>{wordCount(text).toLocaleString()} words</span>
          <span>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white/70">Your thread</h2>
          {posts.length > 1 ? (
            <button
              type="button"
              onClick={() => onCopy('all', posts.join('\n\n'))}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 hover:border-[#FF4CE2] hover:text-[#FF4CE2]"
            >
              {copied === 'all' ? 'Copied' : 'Copy all'}
            </button>
          ) : null}
        </div>
        {posts.length === 0 ? (
          <p className="mt-2 rounded-xl border border-white/10 p-4 text-sm text-white/40">
            Your numbered posts will appear here.
          </p>
        ) : (
          <ol className="mt-2 flex flex-col gap-2" aria-label="Thread posts">
            {posts.map((p, i) => {
              const id = String(i);
              const used = postLength(p, network);
              return (
                <li key={i} className="rounded-xl border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">Post {i + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs tabular-nums ${used > limit ? 'text-red-400 font-bold' : 'text-white/50'}`}>
                        {used} / {limit}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopy(id, p)}
                        aria-label={`Copy post ${i + 1}`}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 hover:border-[#FF4CE2] hover:text-[#FF4CE2]"
                      >
                        {copied === id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-white/80 [overflow-wrap:anywhere]">{p}</p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
