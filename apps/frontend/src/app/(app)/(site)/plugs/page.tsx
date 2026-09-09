import { Plugs } from '@hookpost/frontend/components/plugs/plugs';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Plugs`,
  description: '',
};
export default async function Index() {
  return <Plugs />;
}
