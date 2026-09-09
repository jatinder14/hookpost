import { Metadata } from 'next';
import { ReactNode } from 'react';

/**
 * /home-v1 is the superseded homepage, kept for reference. It was returning
 * 200, was absent from sitemap.xml and was not disallowed in robots.txt, so it
 * was fully indexable - a near-duplicate of "/" competing with it, still
 * linking to /agent, /news and /blog, none of which exist.
 *
 * Worse for AI search: it renders <SeoSchemas />, so the Organization, WebSite
 * and SoftwareApplication nodes were being published from two different URLs
 * under the same @id values. Two URLs asserting the same entity id is exactly
 * what makes an engine unsure which page represents the entity, and this site
 * already has a brand-name collision to fight.
 *
 * noindex rather than a robots.txt Disallow on purpose: a Disallow stops
 * crawlers fetching the page, which means they never see the noindex and an
 * already-indexed URL can linger. Blocking crawl is not the same as removal.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://hookpost.hookstep.in/' },
};

export default function HomeV1Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
