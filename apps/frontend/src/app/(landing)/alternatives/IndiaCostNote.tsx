import Link from 'next/link';
import { pricingINR } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';
import { COMPETITOR_FACTS, FACTS_CHECKED } from '../compare/competitor-facts';

// "What it costs from India" block for the /alternatives pages. Reads the same
// verified vendor facts as /compare, so the two can never disagree. It says
// plainly when a competitor already shows rupee prices - several do - because
// the honest difference is UPI Autopay and flat pricing, not the currency.
export const IndiaCostNote = ({ slug }: { slug: string }) => {
  const c = COMPETITOR_FACTS[slug];
  if (!c) return null;
  const { STANDARD, FREE } = pricingINR;
  const p = c.cheapestPaid;
  const sym = p?.currency === 'USD' ? '$' : p?.currency === 'EUR' ? '€' : '';
  const perChannel = c.pricingModel === 'per channel' && p?.usdMonthly != null;
  const fiveCh = perChannel ? Math.round(p!.usdMonthly! * STANDARD.channel * 100) / 100 : null;

  return (
    <section className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        {c.name} vs Hookpost from India
      </h2>
      <ul className="space-y-2 text-[#bbb] leading-relaxed list-disc ps-5">
        <li>
          <strong className="text-white">{c.name}:</strong>{' '}
          {p
            ? `cheapest paid plan ${sym}${p.price} ${p.billing === 'one-time' ? 'one-time' : `per ${p.per.replace('/month', ' per month')}`}${p.billing === 'annual' ? ', billed annually' : ''}`
            : 'no published price'}
          {fiveCh != null ? `, so ${STANDARD.channel} channels come to ${sym}${fiveCh} a month` : ''}.{' '}
          {c.inr
            ? 'Its pricing page shows rupee prices to Indian visitors.'
            : 'Its pricing page shows US dollars, so you need a card that allows international payments.'}{' '}
          {c.freePlan ? `Free plan: ${c.freePlan}.` : c.freeTrialDays ? `No free plan; ${c.freeTrialDays}-day trial.` : 'No free plan.'}
        </li>
        <li>
          <strong className="text-white">Hookpost:</strong> ₹{STANDARD.month_price} a month flat for {STANDARD.channel} channels,
          billed in rupees with UPI Autopay, cards or NetBanking. Free plan: {FREE.channel} channels and {FREE.posts_per_month} posts
          a month.
        </li>
      </ul>
      <p className="text-sm text-white/50">
        {c.name} figures read from its pricing page on {FACTS_CHECKED}; prices can differ by country.{' '}
        <Link href="/social-media-scheduler-india" className="text-[#FF4CE2] underline">
          More on paying from India
        </Link>
        .
      </p>
    </section>
  );
};
