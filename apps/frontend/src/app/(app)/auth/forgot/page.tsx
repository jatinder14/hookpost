export const dynamic = 'force-dynamic';
import { Forgot } from '@hookpost/frontend/components/auth/forgot';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Hookpost Forgot Password',
  description: 'Reset your Hookpost account password.',
};
export default async function Auth() {
  return <Forgot />;
}
