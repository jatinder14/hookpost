'use client';

import { useEffect } from 'react';

// Read at module scope: NEXT_PUBLIC_* is only inlined there (a read inside a
// function silently came back undefined once before - see ViewContent).
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Google One Tap: the "Continue as <name>" card Google shows in the top-right
 * for a visitor signed in to Google. Picking the account posts Google's ID
 * token to /auth/oauth/google/one-tap, which logs the user in (or registers
 * them) and sets the same cookies as the normal Google login.
 *
 * Renders nothing. Skips itself when the visitor is already logged in, when
 * no client id is configured, or when Google declines to show the prompt.
 */
export function GoogleOneTap({ autoSelect = false }: { autoSelect?: boolean }): null {
  useEffect(() => {
    if (!CLIENT_ID || !BACKEND) return;
    if (document.cookie.split('; ').some((c) => c === 'hp_logged_in=1')) return;

    let cancelled = false;

    const start = () => {
      if (cancelled || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        auto_select: autoSelect,
        cancel_on_tap_outside: true,
        context: 'signin',
        itp_support: true,
        use_fedcm_for_prompt: true,
        callback: async ({ credential }: { credential?: string }) => {
          if (!credential) return;
          try {
            const res = await fetch(`${BACKEND}/auth/oauth/google/one-tap`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential }),
            });
            if (res.ok) {
              window.location.href = '/launches';
            }
          } catch {
            // Leave the page as it is; the normal login buttons still work.
          }
        },
      });
      window.google.accounts.id.prompt();
    };

    const load = () => {
      if (cancelled) return;
      const existing = document.getElementById('google-gsi-client');
      if (existing) {
        if (window.google?.accounts?.id) start();
        else existing.addEventListener('load', start, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = start;
      document.head.appendChild(script);
    };

    // The GSI client is a third-party script. Marketing pages score 100 on
    // Lighthouse and were trimmed by 70KB to get there, so it loads only once
    // the page is idle, never in the critical path.
    const w = window as any;
    const idle = w.requestIdleCallback
      ? w.requestIdleCallback(load, { timeout: 4000 })
      : window.setTimeout(load, 2500);

    return () => {
      cancelled = true;
      if (w.cancelIdleCallback && w.requestIdleCallback) w.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.google?.accounts?.id?.cancel?.();
    };
  }, [autoSelect]);

  return null;
}
