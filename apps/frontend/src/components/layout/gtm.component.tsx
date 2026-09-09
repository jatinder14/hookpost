'use client';

import Script from 'next/script';
import { FC, useEffect } from 'react';
import { useUser } from '@hookpost/frontend/components/layout/user.context';
import { useVariables } from '@hookpost/react/helpers/variable.context';

export const TrialTracker: FC = () => {
  const user = useUser();
  const { googleAdsId, googleAdsTrialTracking } = useVariables();
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !user?.id ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      !window.gtag ||
      !googleAdsId ||
      !googleAdsTrialTracking
    )
      return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('trialStart') !== 'true') return;
    const key = `gtm_start_trial_${user?.id}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    gtag('event', 'conversion', {
      send_to: `${googleAdsId}/${googleAdsTrialTracking}`,
      transaction_id: user.id,
    });
  }, [user]);
  return null;
};

export const GoogleTagManagerComponent: FC<{
  gtmId?: string;
  googleAdsId?: string;
}> = ({ gtmId, googleAdsId }) => {
  if (!gtmId && !googleAdsId) {
    return null;
  }

  // Two different Google products share this one env var, and they are not
  // interchangeable. A GTM container ("GTM-...") is loaded by gtm.js and reads
  // dataLayer; gtag.js takes a Google Ads ("AW-...") or GA4 ("G-...") id and
  // rejects a container id. Passing a container to gtag('config') silently
  // measures nothing, which is what this component used to do.
  // A container and a Google Ads id are not alternatives - a live container
  // with no tags inside it measures nothing, which is the state this account
  // is in ("Container quality: No recent data", and Google Ads reports the tag
  // as URGENT / not detected). So render both when both are configured: the
  // container for anything configured in the GTM UI, and gtag for Google Ads.
  const container = gtmId && gtmId.startsWith('GTM-') ? gtmId : undefined;
  // If NEXT_PUBLIC_GTM_ID itself holds an AW-/G- id, that is the gtag id.
  const tagId = googleAdsId || (!container ? gtmId : undefined);

  return (
    <>
      {container ? (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${container}');
  `}
        </Script>
      ) : null}

      {!tagId ? null : (
      <>
      {/* This used to be <Script src="/g.js" />, but no such file exists in
          public/ and the live URL 404s, so gtag never loaded and every
          conversion was dropped. Load it from Google directly. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
        strategy="afterInteractive"
      />

      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${tagId}');
  `}
      </Script>
      </>
      )}
    </>
  );
};
