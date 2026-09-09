import Link from 'next/link';

/**
 * The pricing tables, shared by the homepage section and the /pricing page.
 *
 * Every number here comes from pricing.ts. Do not edit them in isolation - the
 * posts_per_month and ai_generation_count values are real gates enforced in
 * permissions.service.ts, and advertising a number the code does not honour is
 * how the free tier once ended up unable to publish at all.
 *
 * This used to be inline in the homepage, which is why /pricing did not exist
 * and the nav's "Pricing" link was the fragment "#pricing" - dead on all ~70
 * marketing pages that are not the homepage.
 */
const PLANS = [
  {
    name: "Free",
    inr: "₹0",
    usd: "$0",
    blurb: "Enough to see whether it fits.",
    features: ["2 channels", "30 posts / month", "Visual calendar", "Public API"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Standard",
    inr: "₹699",
    usd: "$9",
    blurb: "For a solo creator or a small brand.",
    features: [
      "5 channels",
      "500 posts / month",
      "500 AI text generations",
      "20 AI images · 3 AI videos",
      "2 webhooks",
    ],
    cta: "Start 7-day trial",
    featured: true,
  },
  {
    name: "Team",
    inr: "₹1,499",
    usd: "$19",
    blurb: "When more than one person posts.",
    features: [
      "10 channels",
      "1,500 posts / month",
      "1,500 AI text generations",
      "100 AI images · 10 AI videos",
      "Unlimited team members",
    ],
    cta: "Choose Team",
    featured: false,
  },
  {
    name: "Pro",
    inr: "₹2,299",
    usd: "$29",
    blurb: "For agencies running many brands.",
    features: [
      // NOT CHANNEL_COUNT. This is the Pro plan's channel ALLOWANCE, which
      // pricing.ts sets to 30 and permissions.service.ts enforces - a different
      // quantity from the number of supported networks, which happens to have
      // been 30 too before the count was corrected to 18. Substituting
      // CHANNEL_COUNT here understated the plan by 12 channels and contradicted
      // the table further down /pricing, which reads 30 from pricing.ts.
      "30 channels",
      "5,000 posts / month",
      "2,500 AI text generations",
      "300 AI images · 30 AI videos",
      "30 webhooks",
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
                <p className="mt-1 text-sm text-white/60 tabular-nums">{p.usd} USD</p>

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
            Ultimate is ₹4,499 / $59 for 100 channels and 15,000 posts a month.
            Each connected profile or page counts as one channel.
          </p>
        </div>
      </section>
);

export default PricingPlans;
