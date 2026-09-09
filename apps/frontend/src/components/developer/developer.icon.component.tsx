'use client';

import { FC } from 'react';
import { useModals } from '@hookpost/frontend/components/layout/new-modal';
import { useT } from '@hookpost/react/translation/get.transation.service.client';
import { DeveloperComponent } from '@hookpost/frontend/components/developer/developer.component';

export const DeveloperIconComponent: FC = () => {
  const modals = useModals();
  const t = useT();

  return (
    <div
      className="hover:text-newTextColor cursor-pointer"
      data-tooltip-id="tooltip"
      data-tooltip-content={t('developer', 'Developer')}
      onClick={() => {
        modals.openModal({
          title: t('developer', 'Developer'),
          size: '80%',
          children: <DeveloperComponent />,
        });
      }}
    >
      Developers
    </div>
  );
};
