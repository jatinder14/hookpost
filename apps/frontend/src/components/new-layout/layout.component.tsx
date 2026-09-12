'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Logo } from '@hookpost/frontend/components/new-layout/logo';
import { Plus_Jakarta_Sans } from 'next/font/google';
const ModeComponent = dynamic(
  () => import('@hookpost/frontend/components/layout/mode.component'),
  {
    ssr: false,
  }
);

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { useVariables } from '@hookpost/react/helpers/variable.context';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { CheckPayment } from '@hookpost/frontend/components/layout/check.payment';
import { ToolTip } from '@hookpost/frontend/components/layout/top.tip';
import { ShowMediaBoxModal } from '@hookpost/frontend/components/media/media.component';
import { ShowLinkedinCompany } from '@hookpost/frontend/components/launches/helpers/linkedin.component';
import { MediaSettingsLayout } from '@hookpost/frontend/components/launches/helpers/media.settings.component';
import { Toaster } from '@hookpost/react/toaster/toaster';
import { ShowPostSelector } from '@hookpost/frontend/components/post-url-selector/post.url.selector';
import { NewSubscription } from '@hookpost/frontend/components/layout/new.subscription';
import { Support } from '@hookpost/frontend/components/layout/support';
import { ContinueProvider } from '@hookpost/frontend/components/layout/continue.provider';
import { ContextWrapper } from '@hookpost/frontend/components/layout/user.context';
import { CopilotKit } from '@copilotkit/react-core';
import { MantineWrapper } from '@hookpost/react/helpers/mantine.wrapper';
import { Impersonate } from '@hookpost/frontend/components/layout/impersonate';
import { AnnouncementBanner } from '@hookpost/frontend/components/layout/announcement.banner';
import { Title } from '@hookpost/frontend/components/layout/title';
import { TopMenu } from '@hookpost/frontend/components/layout/top.menu';
import { LanguageComponent } from '@hookpost/frontend/components/layout/language.component';
import { ChromeExtensionComponent } from '@hookpost/frontend/components/layout/chrome.extension.component';
import NotificationComponent from '@hookpost/frontend/components/notifications/notification.component';
import { OrganizationSelector } from '@hookpost/frontend/components/layout/organization.selector';
import { StreakComponent } from '@hookpost/frontend/components/layout/streak.component';
import { PreConditionComponent } from '@hookpost/frontend/components/layout/pre-condition.component';
import { AttachToFeedbackIcon } from '@hookpost/frontend/components/new-layout/sentry.feedback.component';
import { FirstBillingComponent } from '@hookpost/frontend/components/billing/first.billing.component';
import { TrialTracker } from '@hookpost/frontend/components/layout/gtm.component';
import { setSentryUser } from '@hookpost/react/sentry/initialize.sentry.client';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['600', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export const LayoutComponent = ({ children }: { children: ReactNode }) => {
  const fetch = useFetch();

  const { backendUrl, billingEnabled, isGeneral } = useVariables();

  // Feedback icon component attaches Sentry feedback to a top-bar icon when DSN is present
  const searchParams = useSearchParams();
  const load = useCallback(async (path: string) => {
    return await (await fetch(path)).json();
  }, []);
  const { data: user, mutate } = useSWR('/user/self', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });

  useEffect(() => {
    setSentryUser(
      user ? { id: user.id, email: user.email, orgId: user.orgId } : null
    );
  }, [user]);

  const [continueFree, setContinueFree] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isFree =
        localStorage.getItem('hookpost_continue_free') === 'true' ||
        document.cookie.includes('hookpost_continue_free=true');
      if (isFree) {
        setContinueFree(true);
      }
    }
  }, []);

  if (!user) return null;

  return (
    <ContextWrapper user={user}>
      <CopilotKit
        credentials="include"
        runtimeUrl={backendUrl + '/copilot/chat'}
        showDevConsole={false}
      >
        <MantineWrapper>
          <ToolTip />
          <Toaster />
          <TrialTracker />
          <CheckPayment check={searchParams.get('check') || ''} mutate={mutate}>
            <ShowMediaBoxModal />
            <ShowLinkedinCompany />
            <MediaSettingsLayout />
            <ShowPostSelector />
            <PreConditionComponent />
            <NewSubscription />
            <ContinueProvider />
            <div
              className={clsx(
                'flex flex-col min-h-screen min-w-screen text-newTextColor p-[12px]',
                jakartaSans.className
              )}
            >
              <div>{user?.admin ? <Impersonate /> : <div />}</div>
              {user.tier === 'FREE' && isGeneral && billingEnabled && !user?.admin && !continueFree ? (
                <FirstBillingComponent />
              ) : (
                <>
                  <AnnouncementBanner />
                  <div className="flex-1 flex gap-[8px]">
                    <Support />
                    <div className="flex flex-col bg-newBgColorInner w-[66px] md:w-[80px] shrink-0 rounded-[12px]">
                      <div
                        id="left-menu"
                        className={clsx(
                          'fixed h-full w-[58px] md:w-[64px] start-[8px] md:start-[17px] flex flex-1 top-0',
                          user?.admin && 'pt-[60px] max-h-[1000px]:w-[500px]'
                        )}
                      >
                        <div className="flex flex-col h-full gap-[32px] flex-1 py-[12px]">
                          <Logo />
                          <TopMenu />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 bg-newBgLineColor rounded-[12px] overflow-hidden flex flex-col gap-[1px] blurMe">
                      <div className="flex bg-newBgColorInner h-[80px] px-[12px] md:px-[20px] items-center gap-[8px] min-w-0">
                        <div className="text-[18px] md:text-[24px] font-[600] flex flex-1 min-w-0 truncate">
                          <Title />
                        </div>
                        <div className="flex items-center gap-[8px] md:gap-[20px] text-textItemBlur shrink-0">
                          <div className="hidden sm:flex"><StreakComponent /></div>
                          <div className="w-[1px] h-[20px] bg-blockSeparator" />
                          <OrganizationSelector />
                          <div className="hover:text-newTextColor">
                            <ModeComponent />
                          </div>
                          <div className="w-[1px] h-[20px] bg-blockSeparator" />
                          <LanguageComponent />
                          <div className="hidden sm:flex"><ChromeExtensionComponent /></div>
                          <div className="w-[1px] h-[20px] bg-blockSeparator" />
                          <AttachToFeedbackIcon />
                          <NotificationComponent />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row flex-1 gap-[1px] min-w-0">{children}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CheckPayment>
        </MantineWrapper>
      </CopilotKit>
    </ContextWrapper>
  );
};
