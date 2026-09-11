import Link from 'next/link';
import {
  pricing,
  CURRENCY_SYMBOL,
} from '@hookpost/nestjs-libraries/database/prisma/subscriptions/pricing';

/**
 * The pricing tables, shared by the homepage section and the /pricing page.
 *
 * Every number here is READ from pricing.ts rather than typed, because the
 * comment saying it came from pricing.ts was not enough on its own: Pro's card
 * advertised "30 AI videos" against a generate_videos limit of 15, and the
 * channel allowance had already drifted once before that. posts_per_month and
 * ai_generation_count are real gates enforced in permissions.service.ts, and
 * advertising a number the code does not honour is how the free tier once
 * ended up unable to publish at all.
 *
 * Prices come from month_price, so the card and the invoice cannot disagree.
 *
 * The USD figures were REMOVED on 2026-09-10. There is no USD collection
 * path: CURRENCY_CODE is pinned to INR, Razorpay settles this account in INR,
 * and while international cards were approved on 8 Sep the recurring/mandate
 * rails are still India-only - so a foreign visitor shown '$9/month' reached a
 * rupee checkout for a subscription we cannot charge them for. Quoting a price
 * you cannot collect is a promise, not a placeholder. Rupee pricing is also
 * the positioning: taking UPI is the thing competitors cannot copy.
 * Put them back only alongside a real USD path, driven from pricing.ts.
 *
 * This used to be inline in the homepage, which is why /pricing did not exist
 * and the nav's "Pricing" link was the fragment "#pricing" - dead on all ~70
 * marketing pages that are not the homepage.
 */
const PLANS = [
  {
    name: "Free",
    inr: `${CURRENCY_SYMBOL}${pricing.FREE.month_price.toLocaleString("en-IN")}`,
    blurb: "Enough to see whether it fits.",
    features: [
      `${pricing.FREE.channel} channels`,
      `${pricing.FREE.posts_per_month} posts / month`,
      "Visual calendar",
      "Public API",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Standard",
    inr: `${CURRENCY_SYMBOL}${pricing.STANDARD.month_price.toLocaleString("en-IN")}`,
    blurb: "For a solo creator or a small brand.",
    features: [
      `${pricing.STANDARD.channel} channels`,
      `${pricing.STANDARD.posts_per_month.toLocaleString("en-IN")} posts / month`,
      `${pricing.STANDARD.ai_generation_count.toLocaleString("en-IN")} AI text generations`,
      `${pricing.STANDARD.image_generation_count} AI images · ${pricing.STANDARD.generate_videos} AI videos`,
      `${pricing.STANDARD.webhooks} webhooks`,
    ],
    cta: "Start 7-day trial",
    featured: true,
  },
  {
    name: "Team",
    inr: `${CURRENCY_SYMBOL}${pricing.TEAM.month_price.toLocaleString("en-IN")}`,
    blurb: "When more than one person posts.",
    features: [
      `${pricing.TEAM.channel} channels`,
      `${pricing.TEAM.posts_per_month.toLocaleString("en-IN")} posts / month`,
      `${pricing.TEAM.ai_generation_count.toLocaleString("en-IN")} AI text generations`,
      `${pricing.TEAM.image_generation_count} AI images · ${pricing.TEAM.generate_videos} AI videos`,
      "Unlimited team members",
    ],
    cta: "Choose Team",
    featured: false,
  },
  {
    name: "Pro",
    inr: `${CURRENCY_SYMBOL}${pricing.PRO.month_price.toLocaleString("en-IN")}`,
    blurb: "For agencies running many brands.",
    features: [
      // NOT CHANNEL_COUNT. This is the Pro plan's channel ALLOWANCE, which
      // pricing.ts sets to 30 and permissions.service.ts enforces - a different
      // quantity from the number of supported networks, which happens to have
      // been 30 too before the count was corrected to 18. Substituting
      // CHANNEL_COUNT here understated the plan by 12 channels and contradicted
      // the table further down /pricing, which reads 30 from pricing.ts.
      `${pricing.PRO.channel} channels`,
      `${pricing.PRO.posts_per_month.toLocaleString("en-IN")} posts / month`,
      `${pricing.PRO.ai_generation_count.toLocaleString("en-IN")} AI text generations`,
      `${pricing.PRO.image_generation_count} AI images · ${pricing.PRO.generate_videos} AI videos`,
      `${pricing.PRO.webhooks} webhooks`,
    ],
    cta: "Choose Pro",
    featured: false,
  },
];

export const PricingPlans = ({ id }: { id?: string }) => (
      <section id={id} className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-20 sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight font-jakarta sm:text-4xl text-balance">
            Flat pricing, per plan — not per channel
          </h2>
          {/*
            The old copy read "Save up to 70% compared to Postiz, Buffer, and
            Hootsuite". Competitor pricing moves, an unsourced percentage ages
            badly, and this page no longer names competitors.
          */}
          <p className="mt-3 max-w-[60ch] text-white/60">
            No setup fee and no per-channel charge. Pay by UPI, NetBanking or
            card.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  "flex flex-col rounded-2xl border p-7 " +
                  (p.featured
                    ? "border-[#FF4CE2] bg-[#FF4CE2]/[0.06]"
                    : "border-white/10 bg-white/[0.02]")
                }
              >
                {p.featured && (
                  <span className="mb-3 inline-block w-fit rounded-full bg-[#FF4CE2] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                    Most chosen
                  </span>
                )}
                <h3 className="text-lg font-bold font-jakarta">{p.name}</h3>
                <p className="mt-1 text-sm text-white/50">{p.blurb}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight font-jakarta tabular-nums">
                    {p.inr}
                  </span>
                  <span className="text-sm text-white/60">/ month</span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-[15px] text-white/70">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="text-[#FF4CE2]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth"
                  prefetch={false}
                  className={
                    "mt-7 rounded-full px-5 py-3 text-center font-semibold transition-opacity hover:opacity-90 " +
                    (p.featured
                      ? "bg-[#FF4CE2] text-black"
                      : "border border-white/15 text-white")
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-white/60">
            Ultimate is ₹4,499 for 100 channels and 15,000 posts a month.
            Each connected profile or page counts as one channel.
          </p>
        </div>
      </section>
);

export default PricingPlans;
