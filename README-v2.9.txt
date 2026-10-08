MaterialYardage v2.9 — SEO Home / Calculators Hub + AdSense Content Quality

Purpose
-------
The production homepage at https://www.materialyardage.com/ is now the full
Construction & Landscaping Calculators hub instead of the Topsoil Calculator.
This change is intended to broaden the site's topical relevance beyond the
Topsoil keyword and give search engines a clear overview of all calculator
categories from the root URL.

Key changes
-----------
1. / is now the calculators hub.
2. Topsoil Calculator moved to /topsoil-calculator.
3. /calculators permanently redirects to /.
4. Sitemap replaces /calculators with /topsoil-calculator and remains at 38 URLs.
5. Homepage title/description now target construction + landscaping calculators.
6. Homepage contains brief, useful explanations for all 18 calculators.
7. Homepage includes ItemList structured data for the 18 calculators.
8. Existing calculator, guide, reference, AdSense, Analytics and CSS/JS assets are preserved.
9. Internal Calculators navigation now points to /.
10. No calculator formulas were changed.

SEO intent
----------
The root page is now a broad topical hub. Topsoil remains a dedicated page with
its own canonical URL, title, description, breadcrumb and structured data.
This avoids making the homepage itself a Topsoil-only landing page.

Deployment
----------
Deploy the contents of this ZIP as the Vercel project root.
The existing custom domain remains https://www.materialyardage.com/.
Do not submit /calculators as a sitemap URL; it redirects permanently to /.

AdSense
-------
Do not request an AdSense review immediately after deployment. Allow Google
to crawl the new homepage and the dedicated Topsoil URL, then monitor GSC
indexing before requesting another review.
