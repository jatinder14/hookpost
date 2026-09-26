'use client';

// Single-network counter used by the X, Bluesky and LinkedIn tool pages.
// All counting logic lives in ./count (a plain module) so it stays in step
// with the thread splitter and is testable outside React.
import { useMemo, useState } from 'react';
import {
  BLUESKY_LIMIT,
  BLUESKY_MAX_BYTES,
  LINKEDIN_LIMIT,
  X_LIMIT,
  X_PREMIUM_LIMIT,
  graphemeTokens,
  splitAtLimit,
  utf8Bytes,
  wordCount,
  xTokens,
} from './count';

export type CounterNetwork = 'x' | 'bluesky' | 'linkedin';

const CONFIG: Record<CounterNetwork, { name: string; limit: number; placeholder: string }> = {
  x: { name: 'X', limit: X_LIMIT, placeholder: 'Write your post here...' },
  bluesky: { name: 'Bluesky', limit: BLUESKY_LIMIT, placeholder: 'Write your Bluesky post here...' },
  linkedin: { name: 'LinkedIn', limit: LINKEDIN_LIMIT, placeholder: 'Write your LinkedIn post here...' },
};

function Meter({ label, used, limit, note }: { label: string; used: number; limit: number; note?: string }) {
  const left = limit - used;
  const over = left < 0;
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <li className="rounded-xl border border-white/10 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold">{label}</span>
        <span className={`text-sm tabular-nums ${over ? 'text-red-400 font-bold' : 'text-white/70'}`}>
          {over ? `${Math.abs(left).toLocaleString()} over` : `${left.toLocaleString()} left`}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${over ? 'bg-red-500' : 'bg-[#FF4CE2]'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-white/45 tabular-nums">
        {used.toLocaleString()} / {limit.toLocaleString()}
        {note ? ` · ${note}` : ''}
      </div>
    </li>
  );
}

export function SingleNetworkCounter({ network }: { network: CounterNetwork }) {
  const [text, setText] = useState('');
  const cfg = CONFIG[network];

  const stats = useMemo(() => {
    const tokens = network === 'x' ? xTokens(text) : graphemeTokens(text);
    const used = tokens.reduce((n, t) => n + t.weight, 0);
    return {
      tokens,
      used,
      chars: network === 'x' ? graphemeTokens(text).length : tokens.length,
      links: tokens.filter((t) => t.url).length,
      emoji: tokens.filter((t) => t.emoji).length,
      bytes: network === 'bluesky' ? utf8Bytes(text) : 0,
      split: splitAtLimit(tokens, cfg.limit),
    };
  }, [text, network, cfg.limit]);

  const words = wordCount(text);
  const overLimit = stats.split.over.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="min-w-0">
        <label htmlFor="post-text" className="block text-sm font-semibold text-white/70">
          Paste or type your {cfg.name} post
        </label>
        <textarea
          id="post-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder={cfg.placeholder}
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-base text-white outline-none focus:border-[#FF4CE2]"
        />
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/60" aria-live="polite">
          <span>{stats.chars.toLocaleString()} characters</span>
          <span>{words.toLocaleString()} words</span>
          <span>{text ? text.split('\n').length : 0} lines</span>
          {network === 'x' ? (
            <>
              <span>{stats.links} links</span>
              <span>{stats.emoji} emoji</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <ul className="flex flex-col gap-2" aria-label={`Characters left on ${cfg.name}`}>
          {network === 'x' ? (
            <>
              <Meter label="X standard post" used={stats.used} limit={X_LIMIT} note="weighted count" />
              <Meter label="X Premium post" used={stats.used} limit={X_PREMIUM_LIMIT} />
            </>
          ) : network === 'bluesky' ? (
            <>
              <Meter label="Bluesky post" used={stats.used} limit={BLUESKY_LIMIT} note="characters (graphemes)" />
              <Meter label="Bluesky byte limit" used={stats.bytes} limit={BLUESKY_MAX_BYTES} note="UTF-8 bytes" />
            </>
          ) : (
            <Meter label="LinkedIn post" used={stats.used} limit={LINKEDIN_LIMIT} />
          )}
        </ul>

        <div className="rounded-xl border border-white/10 p-3">
          <div className="text-sm font-semibold text-white/70">
            {overLimit
              ? `Text past ${cfg.limit.toLocaleString()} is highlighted`
              : `Preview: text past ${cfg.limit.toLocaleString()} will be highlighted`}
          </div>
          <div className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words text-sm text-white/80 [overflow-wrap:anywhere]">
            {text ? (
              <>
                <span>{stats.split.fit}</span>
                {overLimit ? (
                  <mark className="rounded-sm bg-red-500/30 text-red-200">{stats.split.over}</mark>
                ) : null}
              </>
            ) : (
              <span className="text-white/35">Nothing yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
