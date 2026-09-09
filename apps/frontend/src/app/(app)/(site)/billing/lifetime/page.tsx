import { LifetimeDeal } from '@hookpost/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Lifetime deal`,
  description: '',
};
export default async function Page() {
  return <LifetimeDeal />;
}
