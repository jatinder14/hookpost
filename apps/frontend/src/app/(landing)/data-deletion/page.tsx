import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion Instructions | Hookpost',
  description: 'Hookpost user data deletion instructions. Follow step-by-step guidance to remove connected social accounts and purge historical workspace data.',
  alternates: {
    canonical: 'https://hookpost.hookstep.in/data-deletion',
  },
};

export default function DataDeletionPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hookpost.hookstep.in" },
      { "@type": "ListItem", position: 2, name: "Data Deletion", item: "https://hookpost.hookstep.in/data-deletion" },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#FF4CE2] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto h-[70px] px-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Hook<span className="text-[#FF4CE2]">post</span>
          </span>
        </Link>
      </header>

      <main className="pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="max-w-[840px] mx-auto px-5 sm:px-8 text-[#d1d1d1] text-[17px] sm:text-[18px] leading-[1.8] space-y-6">
          <h1 className="text-[36px] sm:text-[54px] font-black text-white tracking-tight leading-[1.15]">
            User Data Deletion Instructions
          </h1>
          <p className="text-[#888] text-base italic">Last updated: August 23, 2026</p>

          <p>
            Hookpost (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) values your privacy. In compliance with Meta Platform Terms, GDPR, and data protection regulations, you can request the complete deletion of all data associated with your Facebook, Instagram, Threads, or other social media accounts at any time.
          </p>

          <h2 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight pt-4">
            How to Request Data Deletion:
          </h2>

          <div className="space-y-4">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-white">Method 1: Directly inside Hookpost</h3>
              <p className="text-sm text-[#ccc]">
                1. Log in to your Hookpost dashboard at <a href="https://hookpost.hookstep.in" className="text-[#FF4CE2]">https://hookpost.hookstep.in</a>.<br/>
                2. Navigate to <strong>Settings &rarr; Integrations</strong>.<br/>
                3. Click <strong>Disconnect</strong> on Facebook or Instagram. All stored access tokens and platform metadata will be immediately deleted from our database.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-white">Method 2: Remove Hookpost via Facebook App Settings</h3>
              <p className="text-sm text-[#ccc]">
                1. Go to your Facebook profile &rarr; <strong>Settings &amp; Privacy &rarr; Settings &rarr; Apps and Websites</strong>.<br/>
                2. Find <strong>Hookpost</strong> and click <strong>Remove</strong>.<br/>
                3. Click &quot;Send Request&quot; to automatically notify our server to purge all historical data.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-white">Method 3: Email Our Data Protection Officer</h3>
              <p className="text-sm text-[#ccc]">
                Send an email with your account email address to <a href="mailto:support@hookstep.in" className="text-[#FF4CE2]">support@hookstep.in</a> with the subject <strong>&quot;Data Deletion Request&quot;</strong>. We will permanently purge all workspace data and connected tokens within 48 hours and send a confirmation email.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#141414] border-t border-[#262626] py-8 text-center text-xs text-[#666]">
        &copy; 2026 JR Consulting Co. / Hookpost. All rights reserved. &bull; <Link href="/privacy" className="text-[#888] hover:underline">Privacy Policy</Link>
      </footer>
    </div>
  );
}
