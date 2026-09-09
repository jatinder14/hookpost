export const dynamic = 'force-dynamic';
import { ForgotReturn } from '@hookpost/frontend/components/auth/forgot-return';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'Hookpost Reset Password',
  description: 'Set a new password for your Hookpost account.',
};
export default async function Auth(params: {
  params: Promise<{
    token: string;
  }>;
}) {
  return <ForgotReturn token={(await params.params).token} />;
}
