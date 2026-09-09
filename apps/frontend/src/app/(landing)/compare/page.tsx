import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SectionFaq } from "../SectionFaq";

export const metadata: Metadata = {
  title: "Compare Social Media Schedulers (2026) | Hookpost Matrix",
  description:
    "Compare top social media schedulers side-by-side: Hookpost vs Postiz, Buffer, Hootsuite & Later in pricing, features, AI, and open-source self-hosting.",
  keywords: [
    "compare social media schedulers",
    "postiz vs buffer vs hootsuite",
    "best social media management software",
    "social media tool comparison 2026",
    "hookpost vs postiz",
  ],
  alternates: {
    canonical: "https://hookpost.hookstep.in/compare",
  },
};

export default function ComparePage() {
  const tools = [
    { name: "Hookpost", price: "Free / $29", channels: "30", ai: "✅ Included", openSource: "✅ Yes", payments: "Razorpay (UPI, Cards)", selfHost: "✅ Yes" },
    { name: "Postiz", price: "Free / $29", channels: "30", ai: "✅ Included", openSource: "✅ Yes", payments: "Credit Cards Only", selfHost: "✅ Yes" },
    { name: "Buffer", price: "$6 / channel", channels: "8", ai: "⚠️ Extra Cost", openSource: "❌ No", payments: "Credit Cards", selfHost: "❌ No" },
    { name: "Hootsuite", price: "$99 / month", channels: "10", ai: "⚠️ Addon", openSource: "❌ No", payments: "Credit Cards", selfHost: "❌ No" },
    { name: "Later", price: "$25 / month", channels: "5", ai: "⚠️ Limited", openSource: "❌ No", payments: "Credit Cards", selfHost: "❌ No" },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://hookpost.hookstep.in/compare" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does Hookpost differ from Buffer and Hootsuite?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike Buffer which charges $6 per channel and Hootsuite which starts at $99/month, Hookpost provides unlimited multi-channel scheduling with AI copy generation, Docker self-hosting, and domestic UPI payments starting at $0.",
        },
      },
      {
        "@type": "Question",
        name: "Is Hookpost completely open-source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hookpost is licensed under the AGPL-3.0 license, allowing full self-hosting with Docker Compose and complete data ownership.",
        },
      },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — 2026 Social Media Management Software Comparison
      </div>

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <img alt="Hookpost" src="/brand-logo-96.webp" width="96" height="96" className="h-8 md:h-10 w-auto max-h-[38px] object-contain" />
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white hover:text-[#FF4CE2] transition-colors px-4 py-2 border border-white/20 rounded-full hover:border-[#FF4CE2]"
          >
            Log In
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium bg-white text-black hover:bg-[#FF4CE2] hover:text-white transition-all px-5 py-2 rounded-full font-semibold"
          >
            Start Free for $0
          </Link>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 pt-8 pb-24 space-y-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-[#FF4CE2] font-semibold">Compare</li>
          </ol>
        </nav>

        <div className="text-center space-y-4">
          <div className="inline-block bg-[#FF4CE2]/10 border border-[#FF4CE2]/30 text-[#FF4CE2] text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Market Comparison Matrix
          </div>
          <h1 className="text-[36px] sm:text-[60px] font-black tracking-tight text-white leading-[1.15]">
            Compare the Top Social Media Management Tools
          </h1>
          <p className="text-[#aaa] text-lg sm:text-xl max-w-[760px] mx-auto leading-relaxed">
            See how Hookpost stacks up against Postiz, Buffer, Hootsuite, and Later in features, pricing, open-source freedom, and payment flexibility.
          </p>
        </div>

        {/* Featured Snippet Definition Box (Position 0 Target) */}
        <div className="bg-[#161616] border border-[#FF4CE2]/30 rounded-2xl p-6 max-w-[900px] mx-auto text-left shadow-[0_0_30px_rgba(255,76,226,0.1)]">
          <p className="text-xs uppercase tracking-widest text-[#FF4CE2] font-bold mb-2">Social Scheduler Comparison Summary</p>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            <strong>Hookpost</strong> is an open-source alternative to Buffer, Postiz, and Hootsuite offering multi-channel social media scheduling across 18 networks, self-hosted Docker deployment, and native UPI/Razorpay payments. Unlike Buffer ($6/channel) or Hootsuite ($99/month), Hookpost provides a $0 forever free tier with included AI copy generation and team collaboration.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto border border-[#262626] rounded-2xl bg-[#0e0e0e]">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#161616]">
                <th className="p-4 sm:p-5 font-bold text-white">Platform</th>
                <th className="p-4 sm:p-5 font-bold text-white">Starting Price</th>
                <th className="p-4 sm:p-5 font-bold text-white">Channels</th>
                <th className="p-4 sm:p-5 font-bold text-white">AI Tools</th>
                <th className="p-4 sm:p-5 font-bold text-white">Open Source</th>
                <th className="p-4 sm:p-5 font-bold text-white">Payment Options</th>
                <th className="p-4 sm:p-5 font-bold text-white">Self-Hostable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {tools.map((t, idx) => (
                <tr key={idx} className={t.name === "Hookpost" ? "bg-[#FF4CE2]/5 font-semibold text-white" : "hover:bg-white/[0.02] text-[#888]"}>
                  <td className="p-4 sm:p-5 font-bold text-white flex items-center gap-2">
                    {t.name === "Hookpost" && <span className="text-[#FF4CE2]">★</span>}
                    {t.name}
                  </td>
                  <td className="p-4 sm:p-5">{t.price}</td>
                  <td className="p-4 sm:p-5">{t.channels}</td>
                  <td className="p-4 sm:p-5">{t.ai}</td>
                  <td className="p-4 sm:p-5">{t.openSource}</td>
                  <td className="p-4 sm:p-5">{t.payments}</td>
                  <td className="p-4 sm:p-5">{t.selfHost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionFaq items={faqSchema.mainEntity} />

        {/* CTA */}
        <div className="bg-gradient-to-b from-[#181818] to-[#0a0a0a] border border-[#333] rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Choose the Smarter Social Media Tool
          </h2>
          <p className="text-[#888] max-w-lg mx-auto text-base">
            Switch in minutes. The free tier needs no credit card and does not expire.
          </p>
          <Link
            href="/auth"
            className="inline-block bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-base px-10 py-4 rounded-full transition-all"
          >
            Get Started Free ($0) &rarr;
          </Link>
        </div>
      </main>

      <footer className="w-full bg-[#141414] border-t border-[#262626] py-10 px-6 text-center text-xs text-[#666] space-y-2">
        <p>&copy; 2026 JR Consulting Co. / Hookpost. All rights reserved.</p>
        <div className="space-x-4">
          <Link href="/privacy" className="hover:underline text-[#888]">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:underline text-[#888]">Terms of Service</Link>
          <span>&bull;</span>
          <Link href="/about" className="hover:underline text-[#888]">About</Link>
          <span>&bull;</span>
          <Link href="/channels" className="hover:underline text-[#888]">Channels</Link>
          <span>&bull;</span>
          <Link href="/alternatives" className="hover:underline text-[#888]">Alternatives</Link>
        </div>
      </footer>
    </div>
  );
}
