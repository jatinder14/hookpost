'use client';

import { useEffect, useState } from 'react';

/**
 * Google refuses OAuth inside embedded/in-app browsers (it answers
 * `disallowed_useragent` and shows "This browser or app may not be secure").
 * Every Meta ad opens its link in Facebook's in-app browser, so the whole of
 * our paid traffic lands in exactly the one place Google sign-in cannot work.
 *
 * Measured on the live NGINX logs, 18-20 Sep 2026:
 *   2,008 of 2,250 Meta ad requests (89%) carried FB_IAB/FBAV
 *   6 people tapped "Continue with Google" - all 6 from FB_IAB
 *   0 of them ever reached the OAuth callback
 *   two of them tapped it 3 and 2 times in under a minute, because nothing
 *   visibly happened
 *
 * That was the entire reason a campaign with 431 landing visits and 81 people
 * reaching this page produced zero signups. The OAuth client, redirect URI and
 * consent screen were all verified correct.
 *
 * So: detect the embedded browser and tell the user the two things that work -
 * open in a real browser, or use the email form right below.
 */
const IN_APP_PATTERNS = [
  'FB_IAB', 'FBAN', 'FBAV', 'FB4A', // Facebook
  'Instagram',
  'Line/',
  'Twitter',
  'MicroMessenger', // WeChat
  'Snapchat',
];

export const useIsInAppBrowser = () => {
  const [isInApp, setIsInApp] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || '';
    setIsInApp(IN_APP_PATTERNS.some((p) => ua.includes(p)));
  }, []);
  return isInApp;
};

export const InAppBrowserNotice = () => {
  const isInApp = useIsInAppBrowser();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent || ''));
  }, []);

  if (!isInApp) return null;

  return (
    <div
      role="status"
      className="mb-[16px] rounded-[8px] border border-amber-500/40 bg-amber-500/10 px-[14px] py-[12px] text-[13px] leading-[1.5] text-amber-100"
    >
      <div className="font-[600] mb-[4px]">
        Google sign-in won&apos;t work in this browser
      </div>
      <div className="opacity-90">
        You opened this from an app, and Google blocks sign-in here. Either{' '}
        <span className="font-[600]">
          {isIOS
            ? 'tap the ••• menu and choose “Open in Safari”'
            : 'tap the ⋮ menu and choose “Open in browser”'}
        </span>
        , or just sign up with your email below — that works fine right here.
      </div>
    </div>
  );
};
