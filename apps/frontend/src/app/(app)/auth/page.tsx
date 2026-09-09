import { internalFetch } from '@hookpost/helpers/utils/internal.fetch';
export const dynamic = 'force-dynamic';
import { Register } from '@hookpost/frontend/components/auth/register';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@hookpost/helpers/utils/is.general.server.side';
import Link from 'next/link';
import { getT } from '@hookpost/react/translation/get.translation.service.backend';
import { LoginWithOidc } from '@hookpost/frontend/components/auth/login.with.oidc';
export const metadata: Metadata = {
  title: 'Hookpost Register | Sign Up Free',
  description: 'Create your free Hookpost account to schedule and automate social media across 30+ channels with AI.',
};
export default async function Auth(params: {searchParams: Promise<{provider: string}>}) {
  const t = await getT();
  if (process.env.DISABLE_REGISTRATION === 'true') {
    const canRegister = (
      await (await internalFetch('/auth/can-register')).json()
    ).register;
    if (!canRegister && !(await params?.searchParams)?.provider) {
      return (
        <>
          <LoginWithOidc />
          <div className="text-center">
            {t('registration_is_disabled', 'Registration is disabled')}
            <br />
            <Link className="underline hover:font-bold" href="/auth/login">
              {t('login_instead', 'Login instead')}
            </Link>
          </div>
        </>
      );
    }
  }
  return <Register />;
}
