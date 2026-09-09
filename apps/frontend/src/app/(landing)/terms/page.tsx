import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CHANNEL_COUNT } from '../channels/channel-count';

export const metadata: Metadata = {
  title: 'Terms of Service | Hookpost & JR Consulting Co.',
  description: 'Hookpost Terms of Service. Understand your rights and responsibilities when using Hookpost social media management tools operated by JR Consulting Co.',
  alternates: {
    canonical: 'https://hookpost.hookstep.in/terms',
  },
};

export default function TermsOfServicePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://hookpost.hookstep.in/terms" },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Top Banner */}
      <div className="w-full bg-[#FF4CE2] text-black text-center font-medium text-sm py-1.5 px-4 font-sans">
        Hookpost — Unified Social Media Scheduling, Publishing &amp; Analytics Platform
      </div>

      {/* Navigation Header */}
      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
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
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="max-w-[840px] mx-auto px-5 sm:px-8 text-[#d1d1d1] text-[17px] sm:text-[18px] leading-[1.8] space-y-8">
          
          {/* Header Title */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-[38px] sm:text-[64px] font-black text-white tracking-tight leading-[1.15]">
              Terms of Service
            </h1>
            <p className="text-[#888] text-base italic">Last updated: August 23, 2026</p>
          </div>

          <p>
            Welcome to <strong>Hookpost</strong> (the &quot;Service&quot;), a social media scheduling, publishing, analytics, and team-collaboration platform available at <a href="https://hookpost.hookstep.in" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">hookpost.hookstep.in</a> and related sub-domains (the &quot;Site&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Service. By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>

          {/* 1. Operating Entity */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              1. The Company Behind Hookpost
            </h2>
            <p>
              Hookpost is operated by <strong>JR Consulting Co.</strong> JR Consulting Co. is the contracting party for paid subscriptions, the counterparty for billing and invoicing, and the entity holding the developer accounts and OAuth registrations with connected third-party social media platforms.
            </p>
          </section>

          {/* 2. Eligibility & Accounts */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              2. Eligibility &amp; Account Responsibilities
            </h2>
            <p>
              You must be at least 18 years old and capable of entering into a binding legal contract to use the Service. You are responsible for safeguarding your login credentials, for all activity occurring under your account, and for maintaining accurate account information. Notify us promptly at <a href="mailto:support@hookstep.in" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">support@hookstep.in</a> if you suspect unauthorized account access.
            </p>
          </section>

          {/* 3. The Service */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              3. The Service &amp; Features
            </h2>
            <p>
              Hookpost provides software tools to schedule, publish, analyze, and manage content across {CHANNEL_COUNT} social-media and messaging channels (including Pinterest, YouTube, Meta, X, LinkedIn, Discord, Telegram, Bluesky, and WordPress). We may add, modify, or deprecate features or integrations from time to time, including when a third-party platform modifies its API.
            </p>
          </section>

          {/* 4. Subscriptions, Fees & Billing */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              4. Subscriptions, Fees &amp; Billing
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-[#ccc]">
              <li><strong>Recurring Billing:</strong> Subscriptions renew automatically at the end of each billing period (monthly or annual) at the applicable rate unless cancelled prior to renewal.</li>
              <li><strong>Payment Processing:</strong> Transactions are processed securely via authorized payment gateways (including Razorpay). Prices are listed in INR or indicated currencies.</li>
              <li><strong>Refund Policy:</strong> Due to immediate resource provisioning and API allocation, subscription fees are non-refundable once an active billing cycle has commenced, except where mandated by applicable consumer law. Cancelling stops future recurring charges.</li>
            </ul>
          </section>

          {/* 5. Your Content */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              5. Your Content &amp; Intellectual Property
            </h2>
            <p>
              You retain 100% ownership and all intellectual property rights in the text, media, graphics, and videos you upload or publish through Hookpost (&quot;Your Content&quot;). You grant Hookpost a non-exclusive, worldwide, royalty-free license solely to host, format, and transmit Your Content to the third-party platforms you select.
            </p>
            <p>
              You represent and warrant that you own or have all necessary rights in Your Content, and that publishing it does not violate any third-party copyright, trademark, or privacy rights.
            </p>
          </section>

          {/* 6. Acceptable Use */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              6. Acceptable Use Policy
            </h2>
            <p>You agree not to use Hookpost to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
              <li>Distribute unlawful, defamatory, harassing, sexually explicit, or abusive content.</li>
              <li>Engage in automated spam, coordinated inauthentic behavior, or violate third-party platform developer rules.</li>
              <li>Attempt to reverse engineer, scrape, bypass rate limits, or disrupt the Service infrastructure.</li>
            </ul>
          </section>

          {/* 7. Third-Party Platforms */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              7. Third-Party Platforms &amp; API Terms
            </h2>
            <p>
              Hookpost connects to third-party social networks. By connecting an account, you agree to comply with the terms of the respective platform:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
              <li><strong>YouTube:</strong> Subject to <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Google Privacy Policy</a>.</li>
              <li><strong>Pinterest:</strong> Subject to Pinterest Terms of Service and Developer Policies.</li>
              <li><strong>Meta Platforms (Facebook, Instagram, Threads):</strong> Subject to Meta Platform Terms.</li>
              <li><strong>X / Twitter, LinkedIn:</strong> Subject to their respective Terms of Service.</li>
            </ul>
            <p className="text-sm text-[#aaa]">
              You can disconnect any social platform at any time from your settings. Hookpost is not liable for platform-side outages or policy enforcement enacted independently by third-party networks.
            </p>
          </section>

          {/* 8. AI Features */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              8. AI-Assisted Features
            </h2>
            <p>
              AI-generated suggestions (captions, hashtags, copy) are generated probabilistically. You are solely responsible for reviewing and validating all AI outputs prior to scheduling or publishing.
            </p>
          </section>

          {/* 9. Disclaimer of Warranties */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-sm text-[#aaa]">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          {/* 10. Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              10. Limitation of Liability
            </h2>
            <p className="text-sm text-[#aaa]">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JR CONSULTING CO. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </section>

          {/* 11. Governing Law */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              11. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts of Punjab, India.
            </p>
          </section>

          {/* 12. Contact */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              12. Contact Information
            </h2>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 text-sm text-[#ccc] space-y-1 mt-4">
              <p className="font-semibold text-white">HookStep Support &amp; Legal</p>
              <p>Email: <a href="mailto:support@hookstep.in" className="text-[#FF4CE2]">support@hookstep.in</a></p>
              <p>Website: <a href="https://hookpost.hookstep.in" className="text-[#FF4CE2]">https://hookpost.hookstep.in</a></p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer CTA */}
      <div className="w-full bg-[#141414] border-t border-[#262626] py-12 px-6 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-white">Ready to grow your social media presence?</h3>
        <p className="text-[#888] max-w-md mx-auto">Schedule, analyze, and manage all your accounts from one dashboard.</p>
        <Link
          href="/auth"
          className="inline-block bg-white text-black hover:bg-[#FF4CE2] hover:text-white font-bold text-sm px-8 py-3 rounded-full transition-all"
        >
          Start with Hookpost
        </Link>
        <div className="pt-8 text-xs text-[#666]">
          &copy; 2026 JR Consulting Co. / Hookpost. All rights reserved. &bull; <Link href="/privacy" className="hover:underline text-[#888]">Privacy Policy</Link>
        </div>
      </div>

    </div>
  );
}
