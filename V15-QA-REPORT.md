# MaterialYardage V15 QA Report

## Release scope
- Based on the V14 deployment package.
- Reorganized the seven Fabric & Sewing pages under the physical `fabric/` folder.
- Added a Fabric & Sewing section directly below Construction materials on the homepage.
- Added fabric calculator links and practical measurement guidance to Guides and Reference pages.
- Updated clean URL routing, canonical tags, sitemap URLs, and legacy URL redirects.
- Retained the existing calculator pages, assets, analytics/AdSense configuration and other site files from V14.

## Target URL structure
- `/fabric` → `fabric/fabric.html`
- `/fabric/yardage-calculator` → `fabric/yardage-calculator.html`
- `/fabric/curtain-calculator` → `fabric/curtain-calculator.html`
- `/fabric/upholstery-calculator` → `fabric/upholstery-calculator.html`
- `/fabric/quilt-backing-binding-calculator` → `fabric/quilt-backing-binding-calculator.html`
- `/fabric/cutting-layout-calculator` → `fabric/cutting-layout-calculator.html`
- `/fabric/unit-converter` → `fabric/unit-converter.html`

## Automated checks
- Expected fabric pages present: 7/7
- Sitemap XML parsed: PASS; URLs: 45; duplicates: 0
- Vercel JSON parsed and required rewrites checked: PASS
- Inline JavaScript syntax checks: 62 scripts checked
- Internal links scanned: 1077
- Internal links to legacy fabric tool paths: none expected
- Errors found: 0

All automated static checks passed.

## Manual checks still required
- Deploy to a Vercel Preview and test all seven fabric pages in a browser.
- Confirm each calculator's results using representative imperial and metric inputs.
- Verify old URLs issue permanent redirects to the new clean paths after deployment.
- Verify production-domain canonical responses, mobile layout, analytics events and ad placements.
- Submit the updated sitemap in Google Search Console only after production deployment.

Static validation cannot guarantee calculation correctness for every input or live production behavior.
