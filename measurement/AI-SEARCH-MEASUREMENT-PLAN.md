# MaterialYardage V12 — Search and AI citation measurement

## 1. Search Console baseline
Record the date range and export Search results (Performance) by page and query. Keep Search type = Web, compare the last 28 days with the previous 28 days, and note clicks, impressions, CTR and average position. Search Console does not currently provide a complete, reliable per-citation report for every AI assistant, so do not label ordinary search impressions as AI citations.

## 2. Indexing review
For each canonical URL in sitemap.xml, record: indexed status, last crawl, Google-selected canonical, sitemap discovery, and any reason shown under Page indexing. Test the live URL before requesting indexing. A URL that intentionally redirects should not be treated as a standalone index target.

## 3. GA4 review
In GA4, open Reports → Acquisition → Traffic acquisition and use Session source/medium. Review landing pages and engagement for organic search. If referrals from an AI product appear, record the exact source/medium as shown rather than assuming all unlabelled direct traffic came from AI. Avoid treating small samples as statistically conclusive.

## 4. Monthly citation check
Use the fixed query set in `ai-query-tracker.csv`. Run each prompt in ChatGPT Search, Perplexity, Google AI Overviews/AI Mode when available, and Claude Search. Record date, region/language, whether MaterialYardage was cited, the exact cited URL, competitors cited, and what information was used. Keep prompts consistent month to month; use separate rows for each engine. Do not claim visibility from a plain chat answer if search was not enabled.

## 5. Decision rules
- Impressions rising, clicks flat: review query intent, title and meta description; do not rewrite solely to chase CTR.
- Indexed but no impressions after a meaningful observation window: improve internal links, differentiation and query coverage; check demand before adding more copy.
- Citations absent: compare the page's original data, reproducible examples, visible methodology and topical fit with pages that are cited. No schema, crawler rule or wording trick guarantees citations.
- Thin or duplicative pages: improve them materially, consolidate overlapping pages, or noindex/remove pages that do not merit a search landing page.

## 6. Privacy and integrity
Do not create fake author credentials, fabricated field tests, unverifiable supplier claims, fake citations or generated review data. Mark estimates and assumptions clearly.
