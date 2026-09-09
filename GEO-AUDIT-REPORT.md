# GEO Audit Report: Hookpost

**Audit Date:** September 5, 2026
**URL:** https://hookpost.hookstep.in
**Business Type:** SaaS (open-source AI social media scheduler)
**Pages Analyzed:** 20+ (homepage, alternatives/*, vs/*, for/*, guides/*, channels/*, about, legal)

---

## Executive Summary

**Overall GEO Score: 52/100 (Poor)**

Hookpost's on-site GEO foundation is genuinely strong — SSR content, permissive AI-crawler access, a quality llms.txt, citable pricing tables, and broad schema coverage. What drags the score into "Poor" is a single dimension: **the brand has zero third-party footprint**. No indexed GitHub repo, no Reddit, no directories, no Product Hunt, no founder presence — so AI engines cannot verify Hookpost exists, and worse, the names "Hookstep"/"Hookpost" collide with an unrelated dance app and the competitor "Hookle". Off-site entity building is now the entire ballgame.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 78/100 | 25% | 19.5 |
| Brand Authority | 8/100 | 20% | 1.6 |
| Content E-E-A-T | 54/100 | 20% | 10.8 |
| Technical GEO | 85/100 | 15% | 12.8 |
| Schema & Structured Data | 62/100 | 10% | 6.2 |
| Platform Optimization | 10/100 | 10% | 1.0 |
| **Overall GEO Score** | | | **52/100** |

---

## ✅ Fixed During This Audit (already live in production)

1. **Broken `og:image`** — every page pointed at `/banner.png` (HTTP 404), so every Facebook/LinkedIn/Slack/WhatsApp link preview had no image. All 9 references now point at the working `/og-image.png` (200).
2. **Fabricated `aggregateRating` (4.9★, 128 ratings) removed** — the app isn't even live on Play yet; fake structured-data ratings are a Google spam-policy violation that can invalidate rich results site-wide. Re-add only with real Play Store numbers.
3. **Duplicate/conflicting Organization on /about** — the page re-declared the Organization with a *different* X handle (`hookstep_in` vs sitewide `hookstep`), making the entity ambiguous. Now an `AboutPage` referencing the canonical `#organization`.
4. **TechArticle on the flagship guide** — added required `image` and `mainEntityOfPage` for Article rich-result eligibility.

---

## Critical Issues (Fix Immediately)

### 1. Zero third-party brand presence
- **Issue:** No indexed mention of Hookpost anywhere: GitHub, Reddit, alternativeto.net, Product Hunt, LinkedIn, YouTube — all absent. Postiz (the upstream) has 29K+ GitHub stars and dominates every "alternatives" surface.
- **Observation:** 7 web searches returned zero Hookpost results; "hookstep" resolves to an unrelated dance app.
- **Recommended fix:** (a) publish the public GitHub repo under a `hookpost` org with README first line "Hookpost is an open-source AI social media scheduler by JR Consulting Co. — a lighter alternative to Postiz, Buffer and Hootsuite", topics `postiz-alternative`, `social-media-scheduler`; (b) submit to alternativeto.net as alternative to Postiz/Buffer/Hootsuite; (c) Product Hunt launch + Show HN + r/selfhosted post; (d) LinkedIn company page + Mohan Bhanushali personal profile stating "Founder of Hookpost".
- **Failure check:** In 30 days, `"Hookpost" social media scheduler` on Google/Bing still returns no owned third-party result.
- **Leading indicator:** alternativeto.net listing approved; GitHub repo indexed (site:github.com hookpost).

### 2. Likely not indexed in Bing (= invisible to ChatGPT search)
- **Issue:** No search-index evidence of hookpost.hookstep.in in Bing; ChatGPT's browsing rides on Bing.
- **Recommended fix:** Register in Bing Webmaster Tools, submit sitemap.xml, enable IndexNow. Verify Google Search Console coverage while at it.
- **Failure check:** `site:hookpost.hookstep.in` empty on Bing after 2 weeks.

---

## High Priority Issues

### 3. Anonymous authorship on 2 of 3 guides (E-E-A-T)
- Guides credited to faceless "DevOps Team"/"Engineering Team". Add Mohan Bhanushali bylines linking to an author bio with photo + personal GitHub/LinkedIn.

### 4. Zero outbound citations in all guides
- No links to Meta API docs, Anthropic MCP spec, or even the Postiz repo being critiqued. Add authoritative external links — the single biggest authority gap.

### 5. Unverifiable superlatives dilute machine trust
- "World's First Native Open-Source Social Media MCP Server", "Join thousands of creators", "99.99% uptime" (no status page link), "Save up to 70%" (no methodology). Replace with checkable numbers (GitHub stars, published-post counts) or link proof.

## Medium Priority Issues

6. **/vs/buffer has no definitional answer block** — add "Hookpost is… / Buffer is…" 2-sentence block with real Buffer pricing ($6/channel/mo) so AI comparing the two doesn't have to cite Buffer's own site.
7. **/for/creators has no entity facts** — insert one paragraph naming Hookpost, open-source license, company, 30+ platforms; convert emoji pseudo-headings to real H3s.
8. **Homepage SoftwareApplication offers are USD-only** — add the ₹699 INR Offer (UPI positioning is a differentiator).
9. **1-year edge cache on HTML** (`s-maxage=31536000`) — stale-content risk for crawlers; drop to hours/days with stale-while-revalidate.
10. **Company identity gaps** — no registered address/jurisdiction on /about; add DPDP Act (India) language alongside GDPR in privacy policy.

## Low Priority Issues

11. TL;DR stat box at top of /guides/why-we-rewrote-postiz (memory 1,900→640 MB etc. — the stats exist but are buried).
12. Real artifacts (screenshots, profiler output) for the rewrite guide's claims.
13. Thin FAQ (2 Q&As) on /channels/* pages; no page-level SoftwareApplication for "[platform] scheduler" intent.
14. MCP page: put the `npx` install command in the first 100 words.

---

## Quick Wins (This Week)

1. ~~Fix og:image~~ ✅ done
2. ~~Remove fabricated rating~~ ✅ done
3. Bing Webmaster Tools + IndexNow (30 min, unblocks ChatGPT visibility)
4. alternativeto.net submission (30 min, highest citation leverage)
5. LinkedIn company page + founder profile (1 hr)
6. Add Buffer answer block on /vs/buffer + entity paragraph on /for/creators (1 hr)

## 30-Day Action Plan

**Week 1 — Entity foundation:** Bing/IndexNow, GitHub repo public + README, alternativeto listing, LinkedIn pages, fix /vs/buffer + /for/creators copy.
**Week 2 — Authority:** author bios + bylines on all guides, outbound citations, INR schema offer, status page link for uptime claim.
**Week 3 — Launch surfaces:** Product Hunt launch, Show HN, r/selfhosted + r/opensource posts (genuine, not spam), YouTube demo video.
**Week 4 — Measure & iterate:** check Bing/Google indexation, ask ChatGPT/Claude/Perplexity "best Postiz alternatives" and record citations, refresh llms.txt with any new facts, publish pricing-comparison methodology page.

---

# ASO: Google Play Listing (in.hookstep.hookpost.twa)

Listing is **still in review (404 on Play)**. Ready-to-paste optimized draft:

**Title (29/30 chars):** `Hookpost: AI Social Scheduler`

**Short description (80/80):** `AI social media scheduler: plan & auto-post to X, Instagram, LinkedIn & 30+ apps`

**Full description:** first 3 lines carry the money keywords (AI social media scheduler, content planner, schedule, auto-publish, 30+ networks); feature bullets for AI agents, calendar, MCP, team roles, ₹ pricing "far cheaper than Buffer, Hootsuite, or Later"; closing keyword paragraph covering "[platform] scheduler" long-tails. (Full 1,700-char draft in the session transcript — paste-ready.)

**Keyword targets:** social media scheduler, ai social media, social media manager, schedule posts, auto post, content planner, social media calendar, cross posting app, schedule instagram posts, X/twitter scheduler, linkedin scheduler, buffer alternative, open source social media, threads scheduler.

**Screenshots story order:** composer with network toggles → AI caption generation → month calendar → auto-publish queue → 30+ network logo grid → pricing comparison → open-source/MCP angle. Feature graphic: phone mockup + network logos + "AI Social Media Scheduler — 30+ Platforms".

**Ratings strategy:** trigger Play In-App Review only after the user's first *successfully published* scheduled post (never on cold open); reply to every 1–3★ review within 24h; listing experiments only after ~4.4+ stable.

---

## Appendix: Category Notes

- **Citability 78:** homepage definition paragraph and pricing tables are excellent; comparison pages have strong FAQ answers; weakest pages are /vs/buffer and /for/creators.
- **Brand 8:** floor score — no third-party signal of any kind; name-collision risk with "HookStep" dance app and "Hookle".
- **E-E-A-T 54:** trust (privacy policy, no fake testimonials) is the strength; anonymous authorship and zero citations are the weaknesses.
- **Technical 85:** SSR ✓, robots.txt AI-crawler allowlist ✓, llms.txt + llms-full.txt ✓, max-snippet:-1 ✓, TTFB ~0.3s ✓; Bing indexation unverified; long edge-cache TTL flagged.
- **Schema 62 (→ ~75 after today's fixes):** wide coverage with proper @graph/@id linking; fixed: fake rating, duplicate Org, TechArticle fields, og:image.
