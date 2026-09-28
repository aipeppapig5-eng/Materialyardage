MaterialYardage v2.1 — Quality & SEO Cleanup
=============================================
Deployment-ready static package.

Key corrections:
- Corrected canonical URLs to https://www.materialyardage.com/<path>
- Rebuilt sitemap using the actual HTML pages
- Added methodology.html for calculation transparency
- Added a noindex 404.html
- Corrected Google Analytics and AdSense script URLs in the newer calculator pages
- Removed the contact-page placeholder email
- Standardized navigation links to explicit .html paths
- Kept existing calculator logic and content while improving technical consistency
- Shared CSS remains local; no Tailwind/CDN dependency

Before production:
1. Upload the folder contents to Vercel.
2. Confirm /robots.txt and /sitemap.xml return HTTP 200.
3. Test every calculator on desktop and mobile.
4. Test https://www.materialyardage.com/ads.txt.
5. Re-submit the sitemap in Google Search Console if the URL set changed.

AdSense:
Do not add invented data-ad-slot values. Use the publisher script only on pages where your AdSense configuration calls for it.
