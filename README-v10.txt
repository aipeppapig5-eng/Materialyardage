MaterialYardage v10 — SEO, calculator QA and fabric yardage addition

Base: MaterialYardage v2.9 static/Vercel package.

Changes:
- Improved Concrete Slab Calculator wording and completed the FAQ answers.
- Clarified the 20 ft × 15 ft × 4 in example: 3.70 yd³ net; approximately 3.89 yd³ with a 5% planning allowance.
- Aligned bag-count estimates with the displayed approximate bag yields (0.022 yd³ per 80 lb bag and 0.017 yd³ per 60 lb bag). Always verify manufacturer yield.
- Added Fabric Yardage Calculator at /fabric-yardage-calculator. It estimates fabric yards using piece count, cut length/width, usable fabric width and an extra length allowance per row.
- Added homepage discovery link, Vercel rewrite and sitemap entry for the fabric calculator.
- Preserved the v2.9 homepage, topsoil calculator, existing calculators, policy pages, analytics ID, ads.txt, and existing redirect configuration.

Deploy: upload the contents of this ZIP to the existing Vercel project and deploy. After deployment, test /, /concrete/slab, /fabric-yardage-calculator, /sitemap.xml, /robots.txt, and /ads.txt. Run functional tests and request indexing for the new fabric calculator after its live URL test passes.

Important: fabric yardage is a basic planning estimate and does not optimize complex pattern layouts. Concrete bag yields are illustrative assumptions and must be checked against product labels.
