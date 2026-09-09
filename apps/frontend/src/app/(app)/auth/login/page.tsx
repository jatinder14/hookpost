export const dynamic = 'force-dynamic';
import { Login } from '@hookpost/frontend/components/auth/login';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Hookpost Login | Sign In',
  description: 'Log in to your Hookpost workspace to manage and publish scheduled social content.',
};
export default async function Auth() {
  return <Login />;
}
