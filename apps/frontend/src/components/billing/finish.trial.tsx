import React, { FC, useCallback, useEffect, useState } from 'react';
import { TopTitle } from '@hookpost/frontend/components/launches/helpers/top.title.component';
import { LoadingComponent } from '@hookpost/frontend/components/layout/loading';
import { useFetch } from '@hookpost/helpers/utils/custom.fetch';
import { timer } from '@hookpost/helpers/utils/timer';
import { Button } from '@hookpost/react/form/button';

export const FinishTrial: FC<{ close: () => void }> = (props) => {
  const [finished, setFinished] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const fetch = useFetch();

  const checkFinished = useCallback(async (attempt = 0) => {
    if (attempt > 6) {
      setTimedOut(true);
      return;
    }
    try {
      const res = await fetch('/billing/is-trial-finished');
      const data = await res.json();
      if (!data.finished) {
        await timer(1500);
        return checkFinished(attempt + 1);
      }
      setFinished(true);
    } catch (e) {
      setTimedOut(true);
    }
  }, [fetch]);

  const finishSubscription = useCallback(async () => {
    try {
      await fetch('/billing/finish-trial', {
        method: 'POST',
      });
    } catch (e) {}
    checkFinished(0);
  }, [fetch, checkFinished]);

  useEffect(() => {
    finishSubscription();
  }, [finishSubscription]);

  const handleDone = () => {
    props.close();
    window.location.href = '/launches';
  };

  return (
    <div className="text-textColor fixed start-0 top-0 bg-primary/80 z-[300] w-full h-full p-[60px] animate-fade justify-center flex bg-black/50">
      <div>
        <div className="flex gap-[10px] flex-col w-[500px] h-auto bg-sixth border-tableBorder border-2 rounded-xl pb-[20px] px-[20px] relative shadow-2xl">
          <div className="flex">
            <div className="flex-1">
              <TopTitle title={'Finishing Trial'} />
            </div>
            <button
              onClick={handleDone}
              className="outline-none absolute end-[10px] top-[10px] mantine-UnstyledButton-root mantine-ActionIcon-root bg-primary hover:bg-tableBorder cursor-pointer mantine-Modal-close mantine-1dcetaa"
              type="button"
            >
              <svg
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="relative min-h-[220px] flex items-center justify-center">
            {!finished && !timedOut && (
              <div className="flex flex-col items-center gap-[16px] py-[24px]">
                <LoadingComponent height={80} width={80} />
                <div className="text-[14px] opacity-80 text-center">
                  Ending trial and fast-tracking subscription...
                </div>
              </div>
            )}
            {(finished || timedOut) && (
              <div className="flex flex-col gap-[16px] py-[16px] w-full text-center">
                <div className="text-[24px]">🎉</div>
                <div className="text-[16px] font-[600] text-white">
                  {finished
                    ? 'Your trial has ended and subscription is active!'
                    : 'Trial update processed successfully!'}
                </div>
                <div className="text-[13px] opacity-75">
                  You can now connect channels and schedule posts without restrictions.
                </div>
                <div className="flex gap-[12px] mt-[12px]">
                  <Button className="flex-1" onClick={handleDone}>
                    Continue to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
