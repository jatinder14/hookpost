'use client';

import Link from 'next/link';
import { useState } from 'react';

// The only interactive thing on the homepage was this menu toggle, and one
// useState was forcing the whole 588-line page to ship as a client component.
// Isolating it here lets the page render on the server, so none of the marketing
// copy, pricing tables or channel lists reach the browser as JavaScript.
const LINKS: [string, string][] = [
  ['AI agents & MCP', '/mcp'],
  ['Channels', '/channels'],
  ['Developers', '/docs/public-api'],
  // Was the bare fragment '#pricing', which is dead on every landing page
  // that is not the homepage - about 70 of them.
  ['Pricing', '/pricing'],
  ['Support', '/contact'],
  // Public since 2026-09-09. The homepage carries an
  // "OPEN SOURCE - AGPL-3.0" badge, so there needs to be somewhere to
  // click through to; before this the only GitHub links on the site
  // pointed at the org, which does not hold this repository.
  ['GitHub', 'https://github.com/jatinder14/hookpost'],
];

export const SiteNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[9999] w-full bg-black/90 backdrop-blur border-b border-white/10">
      <nav className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-10">
        <Link href="/" aria-label="Hookpost home" className="flex items-center gap-2.5">
          {/* Explicit dimensions: without them this is an unsized image and the
              logo can shift the header as it decodes. */}
          <img
            /* brand-logo.png is 512x512 / 89KB and renders at 36px here - the
               header was paying 89KB for a 36px mark. The full-size file stays
               for the Organization schema logo, which wants >=112px. */
            src="/brand-logo-96.png"
            /* Decorative: the word "Hookpost" sits next to it in the wordmark,
               and the link already carries aria-label="Hookpost home". A screen
               reader would otherwise announce the name three times. */
            alt=""
            width={36}
            height={36}
            fetchPriority="high"
            className="h-8 w-auto max-h-[36px] object-contain"
          />
          <span className="font-extrabold text-xl tracking-tight">Hookpost</span>
        </Link>

        {/*
          /agent, /news and /blog used to sit in this nav. None of them exists —
          all three 307 to /auth, so a visitor clicking "Blog" landed on a login
          form. They are gone until there is something behind them.
        */}
        <ul className="hidden items-center gap-9 lg:flex text-[15px]">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              {href.startsWith('#') ? (
                <a href={href} className="hover:text-[#FF4CE2] transition-colors">
                  {label}
                </a>
              ) : href.startsWith('http') ? (
                // Leaves the site, so it needs target and rel - next/link would
                // render it but would not add either.
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#FF4CE2] transition-colors"
                >
                  {label}
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="opacity-70"
                  >
                    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.7.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
                  </svg>
                </a>
              ) : (
                <Link href={href} className="hover:text-[#FF4CE2] transition-colors">
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/auth/login" className="text-[15px] hover:text-[#FF4CE2] transition-colors">
            Log in
          </Link>
          <Link
            href="/auth"
            className="rounded-full bg-[#FF4CE2] px-5 py-2.5 text-[15px] font-semibold text-black transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-md p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4CE2]"
        >
          <span className="block h-0.5 w-6 bg-white mb-1.5" />
          <span className="block h-0.5 w-6 bg-white mb-1.5" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-black px-5 pb-5 pt-3">
          <ul className="flex flex-col gap-1 text-[15px]">
            {[...LINKS, ['Log in', '/auth/login'] as [string, string]].map(([label, href]) => (
              <li key={href}>
                {/*
                  Same LINKS array as the desktop nav, so it has to handle an
                  external href too - otherwise the GitHub entry opens in the
                  same tab on a phone and drops rel="noopener".
                */}
                {href.startsWith('http') ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-white/5"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 hover:bg-white/5"
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/auth"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-[#FF4CE2] px-5 py-3 text-center font-semibold text-black"
          >
            Start free
          </Link>
        </div>
      )}
    </header>
  );
};
