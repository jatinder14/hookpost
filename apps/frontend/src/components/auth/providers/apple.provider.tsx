'use client';

import { useCallback } from 'react';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useT } from '@hookpost/react/translation/get.transation.service.client';
export const AppleProvider = () => {
  const fetch = useFetch();
  const t = useT();
  const gotoLogin = useCallback(async () => {
    try {
      const res = await fetch('/auth/oauth/APPLE');
      if (res.ok) {
        const link = await res.text();
        if (link && (link.startsWith('https://') || link.startsWith('http://'))) {
          window.location.href = link;
          return;
        }
      }
    } catch (e) {
      console.warn('Configured fetch failed, falling back to direct API', e);
    }

    try {
      const directRes = await window.fetch('/api/auth/oauth/APPLE');
      if (directRes.ok) {
        const link = await directRes.text();
        if (link && (link.startsWith('https://') || link.startsWith('http://'))) {
          window.location.href = link;
        }
      }
    } catch (err) {
      console.error('Failed to get Apple OAuth link:', err);
    }
  }, [fetch]);
  return (
    <div
      onClick={gotoLogin}
      className={`cursor-pointer flex-1 bg-white h-[52px] rounded-[10px] flex justify-center items-center text-[#0E0E0E] gap-[5px]`}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="21px"
          height="21px"
        >
          <path
            fill="#000000"
            d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
          />
        </svg>
      </div>
      <div className="block xs:hidden">{t('apple', 'Apple')}</div>
    </div>
  );
};
