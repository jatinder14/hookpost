'use client';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useVariables } from '@hookpost/react/helpers/variable.context';
import { OrganizationSelector } from '@hookpost/frontend/components/layout/organization.selector';
import { LanguageComponent } from '@hookpost/frontend/components/layout/language.component';
import { AttachToFeedbackIcon } from '@hookpost/frontend/components/new-layout/sentry.feedback.component';
import NotificationComponent from '@hookpost/frontend/components/notifications/notification.component';
import dynamic from 'next/dynamic';
import { LogoTextComponent } from '@hookpost/frontend/components/ui/logo-text.component';
import { capitalize } from 'lodash';
import {
  pricing,
  getPricing,
  getCurrencyConfig,
  SupportedCurrency,
  CURRENCY_SYMBOL,
} from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import clsx from 'clsx';
import { LoadingComponent } from '@hookpost/frontend/components/layout/loading';
import { CheckIconComponent } from '@hookpost/frontend/components/ui/check.icon.component';
import {
  FAQComponent,
  FAQSection,
} from '@hookpost/frontend/components/billing/faq.component';
import { useT } from '@hookpost/react/translation/get.transation.service.client';
import { useUser } from '@hookpost/frontend/components/layout/user.context';
import { useDubClickId } from '@hookpost/frontend/components/layout/dubAnalytics';
import SafeImage from '@hookpost/react/helpers/safe.image';
import { useModals } from '@hookpost/frontend/components/layout/new-modal';
import useCookie from 'react-use-cookie';
import { LogoutComponent } from '@hookpost/frontend/components/layout/logout.component';
import { DeveloperIconComponent } from '@hookpost/frontend/components/developer/developer.icon.component';

const ModeComponent = dynamic(
  () => import('@hookpost/frontend/components/layout/mode.component'),
  {
    ssr: false,
  }
);

const RazorpayBilling = dynamic(
  () =>
    import('@hookpost/frontend/components/billing/razorpay.billing').then(
      (mod) => mod.RazorpayBilling
    ),
  {
    ssr: false,
  }
);

export const FirstBillingComponent = () => {
  const { razorpayKeyId } = useVariables();
  const user = useUser();
  const dub = useDubClickId();
  const [tier, setTier] = useState('STANDARD');
  const [period, setPeriod] = useState('MONTHLY');
  const fetch = useFetch();
  const modals = useModals();
  const t = useT();
  const [datafast_visitor_id] = useCookie('datafast_visitor_id', '');
  const [datafast_session_id] = useCookie('datafast_session_id', '');

  const [currency, setCurrency] = useState<SupportedCurrency>('INR');

  useEffect(() => {
    const saved =
      typeof window !== 'undefined'
        ? (localStorage.getItem('hookpost_currency') ||
            document.cookie
              .split('; ')
              .find((row) => row.startsWith('hookpost_currency='))
              ?.split('=')[1])
        : null;
    if (saved === 'USD' || saved === 'INR') {
      setCurrency(saved as SupportedCurrency);
    }
  }, []);

  const changeCurrency = (c: SupportedCurrency) => {
    setCurrency(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hookpost_currency', c);
      document.cookie = `hookpost_currency=${c}; path=/; max-age=2592000; SameSite=Lax`;
    }
  };

  const activePricing = useMemo(() => getPricing(currency), [currency]);
  const currencySymbol = useMemo(() => getCurrencyConfig(currency).symbol, [currency]);

  const loadCheckout = useCallback(async () => {
    return (
      await fetch('/billing/embedded', {
        method: 'POST',
        body: JSON.stringify({
          billing: tier,
          period: period,
          currency: currency,
          ...(datafast_visitor_id && datafast_session_id
            ? { datafast_visitor_id, datafast_session_id }
            : {}),
          ...(dub ? { dub } : {}),
        }),
      })
    ).json();
  }, [tier, period, currency]);

  const showYouTube = () => {
    modals.openModal({
      title: 'Grow Fast With Hookpost (Play the video)',
      children: (
        <iframe
          className="h-full aspect-video min-w-[800px]"
          src={`https://www.youtube.com/embed/${process.env.NEXT_PUBLIC_DEMO_VIDEO_ID}?autoplay=1`}
          title="Hookpost Tutorial"
          allow="autoplay"
          allowFullScreen
        />
      ),
    });
  };

  const { data, isLoading } = useSWR(
    `/billing-${tier}-${period}-${currency}`,
    loadCheckout,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
    }
  );

  const price = useMemo(
    () => Object.entries(activePricing).filter(([key, value]) => key !== 'FREE'),
    [activePricing]
  );

  const JoinOver = () => {
    return (
      <>
        <div className="text-[46px] font-[600] leading-[110%] tablet:text-[36px] mobile:!text-[30px] whitespace-pre-line text-balance">
          {t('billing_join_over', 'Built for')}{' '}
          <span className="text-[#FC69FF]">
            {t('billing_entrepreneurs_count', 'teams and creators')}
          </span>{' '}
          {t('billing_who_use', 'who use')}{' '}
          {t(
            'billing_hookpost_grow_social',
            'Hookpost To Grow Their Social Presence'
          )}
        </div>

        {/*
          Shown only when NEXT_PUBLIC_DEMO_VIDEO_ID names your own demo video.
          Upstream embedded Postiz's promo clip here; after the rebrand that
          presented their video as ours, so the whole block is gated rather than
          left pointing at someone else's content.
        */}
        {process.env.NEXT_PUBLIC_DEMO_VIDEO_ID ? (
          <div className="flex" onClick={showYouTube}>
            <div className="tablet:mb-[32px] cursor-pointer mt-[32px] flex gap-[10px] items-center underline hover:font-[700]">
              <div>
                <SafeImage
                  className="text-[12px]"
                  src="/icons/platforms/youtube.svg"
                  width={22.5}
                  height={16}
                  alt="YouTube"
                />
              </div>
              <div>See how Hookpost works</div>
            </div>
          </div>
        ) : null}

        {!!user?.allowTrial && (
          <div className="flex mt-[32px] mb-[10px] gap-[15px] tablet:mt-[32px] tablet:mb-[32px] text-[16px] font-[500] mobile:flex-col">
            <div className="flex gap-[8px]">
              <div>
                <CheckIconComponent />
              </div>
              <div>{t('billing_no_risk_trial', '100% No-Risk Free Trial')}</div>
            </div>
            <div className="flex-1 flex gap-[8px] justify-center mobile:justify-start">
              <div>
                <CheckIconComponent />
              </div>
              <div>
                {t(
                  'billing_pay_nothing_7_days',
                  'Pay NOTHING for the first 7-days'
                )}
              </div>
            </div>
            <div className="flex gap-[8px]">
              <div>
                <CheckIconComponent />
              </div>
              <div>
                {t('billing_cancel_anytime', 'Cancel anytime, from settings')}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="blurMe flex flex-1 flex-col bg-newBgColorInner pb-[60px] mobile:pb-[100px]">
      <div className="h-[92px] px-[80px] tablet:px-[32px] mobile:!px-[16px] py-[20px] flex border-b border-newColColor">
        <div className="flex-1 flex items-center text-textColor">
          <LogoTextComponent />
        </div>
        <div className="flex items-center">
          <div className="flex gap-[20px] text-textItemBlur">
            <OrganizationSelector />
            <div className="hover:text-newTextColor">
              <ModeComponent />
            </div>
            <div className="w-[1px] h-[20px] bg-blockSeparator" />
            <LanguageComponent />
            <div className="w-[1px] h-[20px] bg-blockSeparator" />
            <AttachToFeedbackIcon />
            <DeveloperIconComponent />
            {/*<NotificationComponent />*/}
            <div className="hover:text-newTextColor">
              {user?.tier.current === 'FREE' && (
                <LogoutComponent isIcon={true} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-[80px] tablet:px-[32px] mobile:!px-[16px] flex-1 flex-row tablet:flex-none tablet:flex-col-reverse">
        <div className="flex-1 py-[40px] tablet:pt-[80px] flex flex-col pe-[40px] tablet:pe-0">
          <div className="block tablet:hidden">
            <JoinOver />
          </div>
          {data?.blocked ? (
            <div className="mt-[24px] p-[24px] rounded-[20px] border-[1.5px] border-newColColor text-[16px] font-[500]">
              {t(
                'billing_other_account_subscribed',
                'Another account with this email already has an active subscription. Please log off and sign in to that account to manage your subscription.'
              )}
            </div>
          ) : !isLoading && data ? (
            <RazorpayBilling
              subscriptionId={data.subscriptionId}
              url={data.url}
              keyId={data.keyId || razorpayKeyId}
              currency={data.currency || currency}
              amountLabel={`${getCurrencyConfig(data.currency || currency).symbol}${
                period === 'MONTHLY'
                  ? activePricing[tier]?.month_price
                  : activePricing[tier]?.year_price
              }`}
              allowTrial={!!user?.allowTrial}
            />
          ) : (
            <LoadingComponent />
          )}
        </div>
        <div className="flex flex-col ps-[40px] tablet:!ps-[0] border-l border-newColColor py-[40px] mobile:!pt-[24px] tablet:border-none tablet:pb-0">
          <div className="top-[20px] sticky">
            <div className="hidden tablet:block">
              <JoinOver />
            </div>
            <div className="flex mb-[24px] mobile:flex-col justify-between items-start mobile:items-stretch gap-4">
              <div className="text-[24px] font-[700]">
                {t('billing_choose_plan', 'Choose a Plan')}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Currency Switcher */}
                <div className="inline-flex items-center rounded-lg border border-newColColor bg-boxFocused/40 p-1 text-[13px] font-semibold">
                  <button
                    type="button"
                    onClick={() => changeCurrency('INR')}
                    className={clsx(
                      'px-2.5 py-1 rounded-[4px] transition-colors',
                      currency === 'INR'
                        ? 'bg-[#FF4CE2] text-black font-bold shadow-sm'
                        : 'text-white/60 hover:text-white'
                    )}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => changeCurrency('USD')}
                    className={clsx(
                      'px-2.5 py-1 rounded-[4px] transition-colors',
                      currency === 'USD'
                        ? 'bg-[#FF4CE2] text-black font-bold shadow-sm'
                        : 'text-white/60 hover:text-white'
                    )}
                  >
                    $ USD
                  </button>
                </div>

                <div className="h-[44px] px-[6px] mobile:px-0 flex items-center justify-center mobile:justify-start gap-[12px] border border-newColColor rounded-[12px] select-none">
                  <div
                    className={clsx(
                      'h-[32px] mobile:flex-1 rounded-[6px] text-[16px] px-[12px] flex justify-center items-center',
                      period === 'MONTHLY'
                        ? 'bg-boxFocused text-textItemFocused'
                        : 'cursor-pointer'
                    )}
                    onClick={() => setPeriod('MONTHLY')}
                  >
                    {t('billing_monthly', 'Monthly')}
                  </div>
                  <div
                    className={clsx(
                      'gap-[10px] h-[32px] mobile:flex-1 rounded-[6px] text-[16px] px-[12px] flex justify-center items-center',
                      period === 'YEARLY'
                        ? 'bg-boxFocused text-textItemFocused'
                        : 'cursor-pointer'
                    )}
                    onClick={() => setPeriod('YEARLY')}
                  >
                    <div>{t('billing_yearly', 'Yearly')}</div>
                    <div className="bg-[#AA0FA4] text-[white] px-[8px] rounded-[4px] mobile:hidden">
                      {t('billing_20_percent_off', '2 months free')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[12px] mobile:grid-cols-2 tablet:grid-cols-2 w-full">
              {price.map(
                ([key, value]) => (
                  <div
                    onClick={() => setTier(key)}
                    key={key}
                    className={clsx(
                      'cursor-pointer select-none w-full min-h-[130px] p-[20px] mobile:p-[14px] rounded-[20px] flex flex-col justify-between transition-all',
                      key === tier
                        ? 'border-[1.5px] border-[#618DFF] bg-[#618DFF]/10 shadow-lg'
                        : 'border-[1.5px] border-newColColor hover:border-white/30'
                    )}
                  >
                    <div className="text-[18px] mobile:text-[15px] font-[600] text-white">
                      {capitalize(key)}
                    </div>
                    <div className="flex items-baseline gap-[4px] flex-wrap mt-[6px]">
                      <span className="text-[32px] mobile:text-[22px] font-[700] leading-none text-white tracking-tight">
                        {currencySymbol}
                        {
                          value[
                            period === 'MONTHLY' ? 'month_price' : 'year_price'
                          ]
                        }
                      </span>
                      <span className="text-[14px] mobile:text-[12px] font-[400] text-gray-400 whitespace-nowrap">
                        {period === 'MONTHLY'
                          ? t('billing_per_month', '/ month')
                          : t('billing_per_year', '/ year')}
                      </span>
                    </div>
                  </div>
                ),
                []
              )}
            </div>
            <div className="flex flex-col mt-[54px] gap-[24px] tablet:mt-[40px]">
              <div className="text-[24px] font-[700]">
                {t('billing_features', 'Features')}
              </div>
              <BillingFeatures tier={tier} />
            </div>
            <div className="flex flex-col mobile:hidden tablet:hidden">
              {/*<div>asd</div>*/}
              <FAQComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type FeatureItem = {
  key: string;
  defaultValue: string;
  prefix?: string | number;
};

export const BillingFeatures: FC<{ tier: string }> = ({ tier }) => {
  const t = useT();
  const features = useMemo(() => {
    const currentPricing = pricing[tier];
    const channelsOr = currentPricing.channel;
    const list: FeatureItem[] = [];

    list.push({
      key: channelsOr === 1 ? 'billing_channel' : 'billing_channels',
      defaultValue: channelsOr === 1 ? 'channel' : 'channels',
      prefix: channelsOr,
    });

    list.push({
      key: 'billing_posts_per_month',
      defaultValue: 'posts per month',
      prefix:
        currentPricing.posts_per_month > 10000
          ? 'unlimited'
          : currentPricing.posts_per_month,
    });

    if (currentPricing.team_members) {
      list.push({
        key: 'billing_unlimited_team_members',
        defaultValue: 'Unlimited team members',
      });
    }
    if (currentPricing?.ai) {
      list.push({
        key: 'billing_ai_auto_complete',
        defaultValue: 'AI auto-complete',
      });
      list.push({ key: 'billing_ai_copilots', defaultValue: 'AI copilots' });
      list.push({
        key: 'billing_ai_autocomplete',
        defaultValue: 'AI Autocomplete',
      });
    }
    list.push({
      key: 'billing_advanced_picture_editor',
      defaultValue: 'Advanced Picture Editor',
    });
    if (currentPricing?.image_generator) {
      list.push({
        key: 'billing_ai_images_per_month',
        defaultValue: 'AI Images per month',
        prefix: currentPricing?.image_generation_count,
      });
    }
    if (currentPricing?.generate_videos) {
      list.push({
        key: 'billing_ai_videos_per_month',
        defaultValue: 'AI Videos per month',
        prefix: currentPricing?.generate_videos,
      });
    }
    return list;
  }, [tier]);

  const renderFeature = (feature: FeatureItem) => {
    const translatedText = t(feature.key, feature.defaultValue);
    if (feature.prefix === 'unlimited') {
      return `${t('billing_unlimited', 'Unlimited')} ${translatedText}`;
    }
    if (feature.prefix !== undefined) {
      return `${feature.prefix} ${translatedText}`;
    }
    return translatedText;
  };

  return (
    <div className="grid grid-cols-2 mobile:grid-cols-1 gap-y-[8px] gap-x-[32px]">
      {features.map((feature) => (
        <div key={feature.key} className="flex items-center gap-[8px]">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M11.825 0H4.84167C1.80833 0 0 1.80833 0 4.84167V11.8167C0 14.8583 1.80833 16.6667 4.84167 16.6667H11.8167C14.85 16.6667 16.6583 14.8583 16.6583 11.825V4.84167C16.6667 1.80833 14.8583 0 11.825 0ZM12.3167 6.41667L7.59167 11.1417C7.475 11.2583 7.31667 11.325 7.15 11.325C6.98333 11.325 6.825 11.2583 6.70833 11.1417L4.35 8.78333C4.10833 8.54167 4.10833 8.14167 4.35 7.9C4.59167 7.65833 4.99167 7.65833 5.23333 7.9L7.15 9.81667L11.4333 5.53333C11.675 5.29167 12.075 5.29167 12.3167 5.53333C12.5583 5.775 12.5583 6.16667 12.3167 6.41667Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>{renderFeature(feature)}</div>
        </div>
      ))}
    </div>
  );
};
