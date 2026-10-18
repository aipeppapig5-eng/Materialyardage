# MaterialYardage V16 QA Report

## Scope
V16 was built from the V15.1 Fabric Hub Fix package. This is a shared UI refresh, not a calculator-engine rewrite.

## Changes
- Updated shared visual system to an evergreen dark palette with softer green accents and more consistent contrast.
- Improved typography hierarchy, spacing, navigation states, calculator/resource cards, form controls, tables, focus indicators and reduced-motion handling.
- Added a structured homepage intro/promise panel and highlighted the Fabric & Sewing section.
- Preserved existing content pages, fabric paths, sitemap, analytics/AdSense snippets and Vercel routing configuration.

## Offline checks
- HTML files scanned: 48
- HTML parser errors: 0
- Inline JavaScript syntax errors (Node --check): 0
- Sitemap parsed: yes (45 URL entries)
- Vercel JSON parsed: yes
- Unresolved local links after accounting for Vercel rewrites: 0
- ZIP integrity: passed
- ZIP files: 94
- ZIP bytes: 188779
- SHA-256: `de22256447955216b6be32e0692598daed245822ee2c58fb0435a18d336522cc`

## Limitations
These checks are static/offline. No browser screenshot testing, mobile device testing, live production fetch, calculator input/output regression test, or AdSense review was performed. Deploy to Vercel Preview and test key pages before promoting to production.
