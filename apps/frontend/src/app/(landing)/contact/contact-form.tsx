'use client';

import { useState } from 'react';

// A form rather than only a mailto link: on mobile a mailto often opens
// nothing at all, and the people most likely to write in are the ones least
// likely to have a mail client configured. The address stays on the page as
// the fallback.
const TOPICS = ['Support', 'Billing', 'Self-hosting', 'API & partnerships'];

// In production NGINX maps /api/ onto the backend root, so this resolves to
// https://hookpost.hookstep.in/api/public/contact. Locally the env var points
// straight at :3000. Do not hardcode /api — it 404s against the dev server.
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || '/api';

export const ContactForm = () => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setState('sending');

    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch(`${BACKEND}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          topic: f.get('topic'),
          message: f.get('message'),
          website: f.get('website'), // honeypot
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setState('sent');
      } else {
        setError(data?.error || 'Could not send. Write to support@hookstep.in.');
        setState('idle');
      }
    } catch {
      setError('Could not reach the server. Write to support@hookstep.in.');
      setState('idle');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-[#FF4CE2]/30 bg-[#FF4CE2]/[0.06] p-8">
        <h3 className="text-xl font-bold text-white">Thanks — that reached us.</h3>
        <p className="mt-2 text-[15px] text-white/70">
          We reply to the address you gave, usually within a working day.
        </p>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF4CE2]/60';

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">Name</span>
          <input name="name" type="text" autoComplete="name" placeholder="Optional" className={field} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">
            Email <span className="text-[#FF4CE2]">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/70">What is it about?</span>
        <select name="topic" defaultValue="Support" className={field}>
          {TOPICS.map((t) => (
            <option key={t} value={t} className="bg-black">
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/70">
          Message <span className="text-[#FF4CE2]">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={10}
          placeholder="For a publishing problem, tell us the channel and the time it was scheduled for — that is enough to find it in the logs."
          className={field + ' resize-y'}
        />
      </label>

      {/* Honeypot. Hidden from people, filled by bots. */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error && (
        <p role="alert" className="text-sm text-[#ff8b7c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-2 self-start rounded-full bg-[#FF4CE2] px-7 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
};
