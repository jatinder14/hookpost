import { getT } from '@hookpost/react/translation/get.translation.service.backend';

export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { TestimonialComponent } from '@hookpost/frontend/components/auth/testimonial.component';
import { LogoTextComponent } from '@hookpost/frontend/components/ui/logo-text.component';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <div className="bg-[#0E0E0E] flex flex-1 p-[12px] gap-[12px] min-h-screen w-screen text-white">
      {/*<style>{`html, body {overflow-x: hidden;}`}</style>*/}
      <ReturnUrlComponent />
      <div className="flex flex-col py-[40px] px-[20px] flex-1 lg:w-[600px] lg:flex-none rounded-[12px] text-white p-[12px] bg-[#1A1919]">
        <div className="w-full max-w-[440px] mx-auto justify-center gap-[20px] h-full flex flex-col text-white">
          <LogoTextComponent />
          <div className="flex">{children}</div>
        </div>
      </div>
      {/*
        Upstream asserted "Over 20,000+ Entrepreneurs use <product>". This
        deployment has no basis for a user count, so it states what the product
        does instead. TestimonialComponent renders nothing until real, consented
        quotes are added -- see helpers/testomonials.tsx.
      */}
      <div className="text-[36px] font-[500] flex-1 pt-[88px] hidden lg:flex flex-col items-center">
        <div className="text-center max-w-[550px] leading-[1.25] -tracking-[0.8px] mb-[20px]">
          Join Forward-Thinking <span className="text-[#FC69FF] font-[600]">Creators & Teams</span> Growing Their Social Presence with Hookpost
        </div>
        <TestimonialComponent />
      </div>
    </div>
  );
}
