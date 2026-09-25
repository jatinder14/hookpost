'use client';

import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useT } from '@hookpost/react/translation/get.transation.service.client';

export interface AppliedCoupon {
  code: string;
  percentOff: number | null;
  freeMonths: number | null;
}

/** Price after a percent-off coupon, to the paisa. */
export const discounted = (price: number, coupon?: AppliedCoupon | null) =>
  coupon?.percentOff ? Math.round(price * (100 - coupon.percentOff)) / 100 : price;

/** ₹539.1 reads like a typo; money always shows both decimals when it has any. */
export const formatMoney = (value: number, locale = 'en-IN') =>
  value.toLocaleString(locale, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Website coupon entry, shared by the plan screen and the Settings billing
 * tab. Collapsed to a link by default so it does not compete with the checkout
 * button for people who have no code. Validation goes through
 * /billing/coupon/validate; the parent owns the applied coupon because it has
 * to send it with /billing/embedded.
 */
export const CouponField: FC<{
  applied: AppliedCoupon | null;
  onChange: (coupon: AppliedCoupon | null) => void;
  /** Undiscounted price of the selected plan, for the savings line. */
  price?: number;
  symbol?: string;
  period?: string;
  className?: string;
}> = ({ applied, onChange, price, symbol = '₹', period, className }) => {
  const t = useT();
  const fetch = useFetch();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const apply = useCallback(async () => {
    const value = code.trim();
    if (!value || checking) return;
    setChecking(true);
    setError('');
    try {
      const res = await (
        await fetch(`/billing/coupon/validate?code=${encodeURIComponent(value)}`)
      ).json();
      if (!res?.valid) {
        setError(res?.reason || t('coupon_invalid', 'This coupon code is not valid.'));
        return;
      }
      onChange({ code: res.code, percentOff: res.percentOff, freeMonths: res.freeMonths });
    } catch {
      setError(t('coupon_check_failed', 'Could not check the coupon. Try again.'));
    } finally {
      setChecking(false);
    }
  }, [code, checking, fetch, onChange, t]);

  if (applied) {
    const after = price != null ? discounted(price, applied) : undefined;
    return (
      <div
        role="status"
        className={clsx(
          'flex items-center gap-[12px] rounded-[14px] border border-[#FC69FF]/40 bg-gradient-to-r from-[#FC69FF]/[0.12] to-[#AA0FA4]/[0.08] px-[16px] py-[12px]',
          className
        )}
      >
        <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#FC69FF]/20 text-[#FC69FF]">
          <TagIcon />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-[8px] text-[14px] font-[600]">
            <span className="tracking-wider">{applied.code}</span>
            <span className="rounded-[6px] bg-[#FC69FF] px-[6px] py-[1px] text-[12px] font-[700] text-black">
              {applied.percentOff
                ? `${applied.percentOff}% OFF`
                : `${applied.freeMonths} ${applied.freeMonths === 1 ? 'MONTH' : 'MONTHS'} FREE`}
            </span>
          </div>
          <div className="mt-[2px] text-[13px] text-textItemBlur">
            {applied.percentOff && price != null && after != null ? (
              <>
                <span className="line-through opacity-70">
                  {symbol}
                  {formatMoney(price)}
                </span>{' '}
                <span className="font-[600] text-newTextColor">
                  {symbol}
                  {formatMoney(after)}
                </span>
                {period ? ` / ${period}` : ''} · {t('coupon_you_save', 'you save')} {symbol}
                {formatMoney(Math.round((price - after) * 100) / 100)}
              </>
            ) : applied.freeMonths ? (
              t('coupon_free_months_note', 'Your first charge moves out by the free months.')
            ) : (
              t('coupon_applied_note', 'Applied at checkout.')
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setCode('');
          }}
          aria-label={t('coupon_remove', 'Remove coupon')}
          className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-textItemBlur transition-colors hover:bg-white/10 hover:text-newTextColor"
        >
          ×
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          'inline-flex w-fit items-center gap-[8px] text-[14px] text-textItemBlur transition-colors hover:text-[#FC69FF]',
          className
        )}
      >
        <TagIcon />
        <span className="underline decoration-dotted underline-offset-4">
          {t('coupon_have_code', 'Have a coupon code?')}
        </span>
      </button>
    );
  }

  return (
    <div className={clsx('flex flex-col gap-[6px]', className)}>
      <div
        className={clsx(
          'flex h-[48px] items-center gap-[8px] rounded-[14px] border bg-newBgColorInner ps-[14px] pe-[5px] transition-colors focus-within:border-[#FC69FF]',
          error ? 'border-red-400/70' : 'border-newColColor'
        )}
      >
        <span className="text-textItemBlur">
          <TagIcon />
        </span>
        <input
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase().replace(/\s/g, ''));
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          placeholder={t('coupon_enter_code', 'Enter coupon code')}
          maxLength={40}
          aria-label="Coupon code"
          aria-invalid={!!error}
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-[600] uppercase tracking-wider outline-none placeholder:font-[400] placeholder:normal-case placeholder:tracking-normal placeholder:text-textItemBlur"
        />
        <button
          type="button"
          onClick={apply}
          disabled={checking || !code.trim()}
          className="h-[38px] shrink-0 rounded-[10px] bg-[#FC69FF] px-[18px] text-[14px] font-[700] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {checking ? t('checking', 'Checking...') : t('apply', 'Apply')}
        </button>
      </div>
      {!!error && (
        <div role="alert" className="ps-[4px] text-[13px] text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};
