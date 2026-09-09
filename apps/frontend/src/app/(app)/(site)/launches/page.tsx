export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@hookpost/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost Calendar' : 'Gitroom Launches'}`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
