export const dynamic = 'force-dynamic';
import { AdminUsersComponent } from '@hookpost/frontend/components/admin/admin-users.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Admin Users & Billing`,
  description: 'Master Super Admin directory for users, workspaces, Razorpay billing, and subscription management.',
};

export default async function Page() {
  return (
    <div className="bg-newBgColorInner flex-1 min-w-0 flex-col flex p-[20px] gap-[12px]">
      <AdminUsersComponent />
    </div>
  );
}
