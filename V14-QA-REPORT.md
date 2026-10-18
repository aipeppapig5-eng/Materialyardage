# V14 QA Report — Fabric & Sewing Calculator Expansion

## Scope
Built from V13. Adds a fabric hub and six tools: fabric yardage (updated for imperial/metric units), quilt backing & binding, curtain fabric, upholstery, rectangular cutting layout, and unit conversion. Adds Vercel clean-URL rewrites and sitemap entries, and links the fabric hub from the homepage.

## Automated checks
- Sitemap XML parses: 45 unique URLs
- Vercel JSON parses: 23 rewrites
- Metadata and embedded JavaScript syntax checked on all 7 fabric pages
- Representative formula test cases computed independently: fabric yardage (4 pieces; 36x20in; 44in width; 2in row allowance; 5%) = 2.2167, quilt backing (60x50in; 4in overhang; 42in width; 10%) = 4.1556, curtain estimate (72in track; 2x fullness; 84in drop; 10in hems; 54in width; 10%) = 8.6167, cutting layout (12 pieces 18x12in; 44in width; 5%) = 2.1000, unit conversion (3 yd to metres) = 2.7432
- Internal links in fabric pages checked against files and rewrites

## Result
**PASS** — no structural or JavaScript syntax errors detected by offline checks.

## Limitations
- Checks were performed offline; no live HTTP/browser test was performed.
- Formula tests validate representative examples, not every possible input combination.
- Calculators use simplified planning models; verify actual pattern/cutting layouts before purchasing fabric.
- Google indexing, AI visibility and AdSense approval are not guaranteed.
