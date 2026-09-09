'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const PIXEL = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL;

export const FacebookComponent = () => {
  const pathname = usePathname();
  // The init snippet already fires the first PageView, so the very first run of
  // this effect must not fire a second one for the same page.
  const firstRun = useRef(true);

  useEffect(() => {
    if (!PIXEL) {
      return;
    }
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    // App Router navigations never reload the document, so without this a
    // visitor who lands on an ad page and then browses the rest of the site
    // counts as a single page view.
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }, [pathname]);

  if (!PIXEL) {
    return null;
  }

  return (
    // lazyOnload, not afterInteractive: /f.js is a 523KB library and nothing on
    // the page waits for it. afterInteractive had it competing with the page's
    // own chunks during load. It still fires PageView - just after the content.
    <Script strategy="lazyOnload" id="fb-pixel">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'/f.js');
fbq('init', '${PIXEL}');
fbq('track', 'PageView');
`}
    </Script>
  );
};
