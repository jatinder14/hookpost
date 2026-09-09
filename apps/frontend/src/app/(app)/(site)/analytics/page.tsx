export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@hookpost/frontend/components/platform-analytics/platform.analytics';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Analytics`,
  description: '',
};
export default async function Index() {
  return <PlatformAnalytics />;
}
