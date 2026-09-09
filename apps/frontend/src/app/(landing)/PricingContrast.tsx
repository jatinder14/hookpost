// The block that sits directly above the pricing cards, to frame how someone
// reads the numbers below it: the question is not "how much per month" but
// "what happens to this number as I grow".
//
// Every right-hand claim here is checkable against pricing.ts and
// permissions.service.ts, deliberately. The version this was drafted from said
// "Connect your profiles under one flat rate" and "experiment and expand
// freely", and neither is true - plans include a fixed number of channels (2 /
// 5 / 10 / 30 / 100) and hitting that number blocks you until you upgrade. So
// the rows below say the narrower thing that is actually true, which also
// happens to be the more credible thing: there is no per-profile fee and no
// overage billing anywhere in the product, and the channel allowance is a
// limit rather than a surcharge.
//
// The left-hand column is about per-channel billing generally, which
// /alternatives/buffer substantiates with Buffer's own published prices.

import { pricing } from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

// Read straight from pricing.ts so this cannot drift from what we charge.
const ALLOWANCE = (['STANDARD', 'TEAM', 'PRO', 'ULTIMATE'] as const)
  .map((tier) => `${tier.charAt(0)}${tier.slice(1).toLowerCase()} ${pricing[tier].channel}`)
  .join(', ');

const ROWS: { them: string; us: string }[] = [
  {
    them: 'Charges you extra for every profile you connect.',
    us: `Every channel your plan includes is covered by the one price — ${ALLOWANCE}.`,
  },
  {
    them: 'Bills scale up aggressively as your brand grows.',
    us: 'The price is the price. Connecting another channel inside your plan changes nothing on your invoice.',
  },
  {
    them: 'Surprise overages for adding new social networks.',
    us: 'There is no overage billing in Hookpost at all. Your channel allowance is a limit, not a surcharge — if you need more, you upgrade, and you pick when.',
  },
];

export function PricingContrast() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pt-20 sm:px-10">
      <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
        Priced per plan, not per profile
      </h2>
      <p className="mt-3 max-w-[62ch] text-white/60">
        Most schedulers charge for each social account you add, so the bill you
        agree to on day one is not the bill you get six months later. Hookpost
        does not work that way.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
        <div
          className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2"
          role="table"
          aria-label="How per-channel billing compares to Hookpost's pricing"
        >
          {/*
            The two headers must sit inside a role="row" exactly as the data
            rows below do. Without it the ARIA tree is invalid twice over -
            columnheader has no required row parent, and table has children it
            does not allow - which cost 20 accessibility points and, more to the
            point, leaves a screen reader unable to associate a column with its
            heading. `contents` keeps the grid layout identical.
          */}
          <div className="contents" role="row">
            <div className="bg-[#0d0d0d] px-6 py-4" role="columnheader">
              {/* white/40 is 3.66:1 on black; AA wants 4.5:1. */}
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                Traditional platforms
              </p>
            </div>
            <div className="bg-[#FF4CE2]/[0.06] px-6 py-4" role="columnheader">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF4CE2]">
                The Hookpost way
              </p>
            </div>
          </div>

          {ROWS.map((row) => (
            // Each pair is one logical row. On mobile the two cells stack, so
            // the "them" cell keeps its ✕ to stay readable once the column
            // header has scrolled away.
            <div key={row.them} className="contents" role="row">
              <div
                className="flex gap-3 bg-[#0d0d0d] px-6 py-5 text-[15px] leading-relaxed text-white/55"
                role="cell"
              >
                <span aria-hidden="true" className="mt-px shrink-0 text-red-400">
                  ✕
                </span>
                <span>{row.them}</span>
              </div>
              <div
                className="bg-[#FF4CE2]/[0.04] px-6 py-5 text-[15px] font-medium leading-relaxed text-white/90"
                role="cell"
              >
                {row.us}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
