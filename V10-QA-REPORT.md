# MaterialYardage v10 QA report

## Changes inspected
- Concrete slab page: FAQ answers populated; wording cleaned up; worked example clarifies net volume versus 5% allowance.
- Concrete slab script: bag count uses the same approximate yields shown in the page (0.022 yd³ per 80 lb bag; 0.017 yd³ per 60 lb bag).
- Fabric calculator: validates input ranges, handles custom fabric width, reports a clear error if a piece cannot fit across the fabric, calculates rows and yardage, and sends a `calculator_complete` GA4 event when calculated.
- SEO/discovery: self-canonical fabric URL, homepage resource link, Vercel rewrite and sitemap URL added.

## Deployment verification still required
This package was checked locally only. It has not been deployed or live-tested from this environment. After deployment, test all listed URLs in a browser and Search Console.
