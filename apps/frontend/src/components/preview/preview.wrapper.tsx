'use client';

import useSWR from 'swr';
import { ContextWrapper } from '@hookpost/frontend/components/layout/user.context';
import { ReactNode, useCallback } from 'react';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { Toaster } from '@hookpost/react/toaster/toaster';
import { MantineWrapper } from '@hookpost/react/helpers/mantine.wrapper';
import { useVariables } from '@hookpost/react/helpers/variable.context';
import { CopilotKit } from '@copilotkit/react-core';
import { ToolTip } from '@hookpost/frontend/components/layout/top.tip';
export const PreviewWrapper = ({ children }: { children: ReactNode }) => {
  const fetch = useFetch();
  const { backendUrl } = useVariables();
  const load = useCallback(async (path: string) => {
    return await (await fetch(path)).json();
  }, []);
  const { data: user } = useSWR('/user/self', load, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
  });
  return (
    <ContextWrapper user={user}>
      <CopilotKit
        credentials="include"
        runtimeUrl={backendUrl + '/copilot/chat'}
        showDevConsole={false}
      >
        <MantineWrapper>
          <Toaster />
          <ToolTip />
          {children}
        </MantineWrapper>
      </CopilotKit>
    </ContextWrapper>
  );
};
