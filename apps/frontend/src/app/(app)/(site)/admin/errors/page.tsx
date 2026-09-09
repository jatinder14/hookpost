export const dynamic = 'force-dynamic';
import { AdminErrorsComponent } from '@hookpost/frontend/components/admin/admin-errors.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Admin Errors`,
  description: '',
};

export default async function Page() {
  return (
    <div className="bg-newBgColorInner flex-1 flex-col flex p-[20px] gap-[12px]">
      <AdminErrorsComponent />
    </div>
  );
}
