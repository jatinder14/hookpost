'use client';

import { FC, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TrackEnum } from '@hookpost/nestjs-libraries/user/track.enum';

// Pathnames already sent during this page load. usePathname changes on
// client-side navigation between marketing pages and React re-runs effects in
// StrictMode, so without this one view posts the event two or three times and
// inflates the top of the funnel the bidding optimises against.
const fired = new Set<string>();

/**
 * TrackEnum.ViewContent existed but nothing ever sent it - the only events
 * reaching Meta were CompleteRegistration, InitiateCheckout, StartTrial and
 * Purchase, all at or past signup. That left the pixel with no top-of-funnel
 * signal: no audience of people who read a landing page and left, so no
 * retargeting, and nothing for the algorithm to learn from but the handful who
 * converted.
 *
 * This deliberately does not use useTrack. useTrack reads facebookPixel from
 * VariableContext and posts through useFetch, and the (landing) tree wraps
 * neither - useVariables() returns the context default '' and useFetch()
 * returns a client whose baseUrl is '', so a call from a marketing page fails
 * the pixel guard and, past it, would POST to the frontend origin instead of
 * the API. Both failures are silent. (app)/(provider)/(extension) do wrap both,
 * which is why the existing signup and checkout events work.
 *
 * Mounted in (landing) only. Every route under (app) is a logged-in screen and
 * a ViewContent on each one would swamp the marketing signal.
 */
export const ViewContentTracker: FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Inlined at build time. Empty when the pixel is not configured, which
    // keeps this inert rather than posting events nothing can receive.
    const pixel = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!pixel || !backend || !pathname || fired.has(pathname)) {
      return;
    }
    fired.add(pathname);

    const additional = { content_name: pathname };

    const sendEvent = async () => {
      try {
        // credentials: 'include' so the backend can set and then reuse its
        // `track` cookie. That cookie is the event id shared with the browser
        // pixel below, and it is what lets Meta collapse the server event and
        // the browser event into one instead of counting the view twice.
        const res = await fetch(`${backend}/public/t`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tt: TrackEnum.ViewContent, additional }),
        });
        const { track: uq } = await res.json();
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'ViewContent', additional, {
            eventID: uq,
          });
        }
      } catch (e) {
        // Never let a blocked or failed tracking call break a landing page.
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(sendEvent, { timeout: 2000 });
    } else {
      setTimeout(sendEvent, 1000);
    }
  }, [pathname]);

  return null;
};

export default ViewContentTracker;
