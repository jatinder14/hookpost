import { MediaLayoutComponent } from '@hookpost/frontend/components/new-layout/layout.media.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Hookpost' : 'Gitroom'} Media`,
  description: '',
};

export default async function Page() {
  return <MediaLayoutComponent />
}
