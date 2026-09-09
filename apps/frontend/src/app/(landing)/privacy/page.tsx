import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Hookpost & JR Consulting Co.',
  description: 'Hookpost Privacy Policy. Understand how JR Consulting Co. collects, protects, and handles personal data and connected social media tokens.',
  alternates: {
    canonical: 'https://hookpost.hookstep.in/privacy',
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://hookpost.hookstep.in/privacy" },
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
              Privacy Policy
            </h1>
            <p className="text-[#888] text-base italic">Last updated: August 23, 2026</p>
          </div>

          <p>
            This Privacy Policy explains how <strong>Hookpost</strong> (&quot;Hookpost&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated by <strong>JR Consulting Co.</strong>, collects, uses, shares, and protects personal data in connection with the Hookpost social-media scheduling, publishing, analytics, and team-collaboration platform (the &quot;Service&quot;), the website at <a href="https://hookpost.hookstep.in" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">hookpost.hookstep.in</a> and related sub-domains (the &quot;Site&quot;). It applies to visitors to the Site, account holders, members of customer workspaces, and anyone else who interacts with us. By using the Site or the Service, you acknowledge this Policy. For our contractual terms, see our <Link href="/terms" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Terms of Service</Link>.
          </p>

          {/* 1. Who We Are */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              1. Who We Are (Data Controllers)
            </h2>
            <p>
              Hookpost is owned and operated by <strong>JR Consulting Co.</strong> JR Consulting Co. is the contracting party for paid subscriptions, the recipient of subscription revenue, and the primary data controller for account, billing, customer-support, marketing, and Service-usage data.
            </p>
            <p>
              JR Consulting Co. also holds the developer accounts, OAuth integrations, and platform-side approvals with third-party social media platforms whose APIs the Service uses (including X / Twitter, Meta / Facebook / Instagram / Threads, LinkedIn, YouTube, Pinterest, Bluesky, Discord, Slack, Telegram, and GitHub).
            </p>
            <p>
              For all privacy questions, requests, and data inquiries, you can reach us at <a href="mailto:support@hookstep.in" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2] font-medium">support@hookstep.in</a>.
            </p>
          </section>

          {/* 2. The Service in Brief */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              2. The Service in Brief
            </h2>
            <p>
              Hookpost lets you connect multiple social-media and chat channels to centrally schedule, publish, analyze, and collaborate on content. The platform includes a visual content calendar, media storage engine, publishing queue, analytics dashboards, AI-assisted content optimization, team permissions, and third-party integrations.
            </p>
          </section>

          {/* 3. The Data We Collect */}
          <section className="space-y-5">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              3. The Data We Collect
            </h2>

            <div className="space-y-3">
              <h3 className="text-[20px] font-semibold text-white">3.1 Account &amp; Identity Data</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
                <li>Name, email address, password (stored solely as a cryptographically salted one-way hash), profile picture, workspace name, role, language, and timezone preferences.</li>
                <li>If you sign in via a social-login provider (e.g., Google or GitHub), the basic profile fields and email address returned by that provider.</li>
                <li>Workspace membership, invitations sent/accepted, and permissions granted within an organization.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-[20px] font-semibold text-white">3.2 Connected Platform Data</h3>
              <p>When you connect a third-party social or messaging account to Hookpost, we receive and store via authorized APIs:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
                <li>OAuth access &amp; refresh tokens (encrypted at rest using AES-256), the scopes granted, platform username, user IDs, page IDs, channel IDs, and profile avatars.</li>
                <li>Content and engagement data needed to provide the Service: scheduled posts, published posts, comments, post-level analytics (impressions, reach, clicks, engagement metrics), and aggregate audience data exposed by platform APIs.</li>
                <li>
                  <strong>For YouTube specifically:</strong> The Service uses YouTube API Services. Your use of those features is subject to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Google Privacy Policy</a>. You can revoke Hookpost&apos;s access to your Google data at any time via <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2]">Google Security Settings</a>.
                </li>
                <li>
                  <strong>For Pinterest specifically:</strong> We access your Pinterest user boards and profile solely to create Pins on your behalf in compliance with Pinterest Developer Policies.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-[20px] font-semibold text-white">3.3 Content You Upload</h3>
              <p>Text, images, video, audio, captions, links, hashtags, schedules, prompts, notes, and calendar metadata you upload to or generate within the Service.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[20px] font-semibold text-white">3.4 Billing Data</h3>
              <p>Plan tier, subscription status, invoice history, billing email, and transaction IDs. Card numbers and banking details are processed directly by our PCI-compliant payment gateways (including Razorpay); Hookpost never stores your raw card credentials.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[20px] font-semibold text-white">3.5 Logs, Usage &amp; Device Data</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
                <li>IP address, browser user-agent, operating system, referrer URL, and approximate geographic location derived from IP.</li>
                <li>Application telemetry: pages visited, features used, post dispatch logs, error reports, and performance metrics.</li>
              </ul>
            </div>
          </section>

          {/* 4. How We Use Data */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              4. How We Use the Data &amp; Legal Bases
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-[#ccc]">
              <li><strong>Provide the Service:</strong> Authenticate users, manage workspaces, store media, publish content across connected social channels, and generate analytics dashboards. (<em>Performance of contract</em>)</li>
              <li><strong>Billing &amp; Subscriptions:</strong> Process subscriptions, issue invoices, prevent payment fraud, and fulfill tax requirements. (<em>Performance of contract; legal obligation</em>)</li>
              <li><strong>Security &amp; Abuse Prevention:</strong> Detect and mitigate unauthorized account access, DDoS attacks, spamming, and platform policy violations. (<em>Legitimate interests</em>)</li>
              <li><strong>Improve the Service:</strong> Debug issues, monitor uptime, and optimize application performance. (<em>Legitimate interests</em>)</li>
              <li><strong>Transactional Communications:</strong> Send critical notifications regarding failed posts, security alerts, and account changes. (<em>Performance of contract</em>)</li>
            </ul>
            <p className="text-[#aaa] text-sm">We do not use your private posts or messages to serve third-party advertising, and we do not sell your personal data.</p>
          </section>

          {/* 5. AI Features */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              5. AI-Assisted Features
            </h2>
            <p>
              The Service offers optional AI tools to generate or refine captions, hashtags, and copywriting. Prompts and drafted text are transmitted securely to sub-processor model providers (such as OpenAI). We enforce contractual terms requiring that your data is <strong>not used to train</strong> public foundation models. AI outputs are probabilistic; you remain responsible for reviewing content before publishing.
            </p>
          </section>

          {/* 6. Controller vs Processor */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              6. Controller vs. Processor
            </h2>
            <p>
              For account, billing, site telemetry, and security data, Hookpost acts as a <strong>data controller</strong>. For the content you schedule and the audience metrics fetched on your behalf, Hookpost acts as a <strong>data processor</strong> operating under your instructions.
            </p>
          </section>

          {/* 7. Who We Share Data With */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              7. Who We Share Data With
            </h2>
            <p>We do not sell personal data. We share data only with:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
              <li><strong>Connected Third-Party Platforms:</strong> Transmitting scheduled posts and media to the platforms you choose (Pinterest, YouTube, Meta, X, LinkedIn, etc.).</li>
              <li><strong>Infrastructure &amp; Hosting Sub-processors:</strong> Secure cloud infrastructure (Google Cloud Platform), Redis, PostgreSQL, and transactional email providers (Resend).</li>
              <li><strong>Workspace Collaborators:</strong> Team members assigned to your Hookpost organization based on their designated roles.</li>
              <li><strong>Legal Authorities:</strong> When required by valid legal process, court order, or regulatory mandate.</li>
            </ul>
          </section>

          {/* 8. Data Retention */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              8. Data Retention
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-[#ccc]">
              <li><strong>Account &amp; Workspace Data:</strong> Retained while your account is active. Upon account deletion, data is purged or anonymized within 30 days.</li>
              <li><strong>OAuth Tokens:</strong> Retained while connected. Disconnecting a platform immediately purges active tokens from our database.</li>
              <li><strong>Scheduled Content:</strong> Retained until published or manually deleted by the user.</li>
              <li><strong>Billing Invoices:</strong> Retained as required under statutory financial and taxation regulations.</li>
            </ul>
          </section>

          {/* 9. Security */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              9. Security
            </h2>
            <p>
              We implement comprehensive technical and organizational measures: TLS 1.3 encryption in transit, AES-256 encryption for stored tokens, cryptographic password hashing, isolated database networks, and automated intrusion monitoring.
            </p>
          </section>

          {/* 10. Your Rights */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              10. Your Rights (GDPR / CCPA / Global)
            </h2>
            <p>You have the right to access, rectify, or erase personal data, object to or restrict processing, and export your content. To exercise these rights, email <a href="mailto:support@hookstep.in" className="text-[#FF4CE2] underline underline-offset-2 decoration-[#FF4CE2]/40 hover:decoration-[#FF4CE2] font-medium">support@hookstep.in</a>.</p>
          </section>

          {/* 11. Contact Us */}
          <section className="space-y-4">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight pt-4">
              11. Contact Us
            </h2>
            <p>For questions or privacy requests, contact:</p>
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 text-sm space-y-1 text-[#bbb]">
              <p className="font-bold text-white text-base">JR Consulting Co. (Hookpost)</p>
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
          &copy; 2026 JR Consulting Co. / Hookpost. All rights reserved. &bull; <Link href="/terms" className="hover:underline text-[#888]">Terms of Service</Link>
        </div>
      </div>

    </div>
  );
}
