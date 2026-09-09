export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@hookpost/frontend/components/auth/after.activate';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Hookpost - Activate your account',
  description: 'Activate your Hookpost workspace.',
};
export default async function Auth() {
  return <AfterActivate />;
}
