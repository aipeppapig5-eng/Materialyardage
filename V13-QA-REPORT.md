# V13 QA Report

## Scope
Built from the supplied V10 source ZIP, with the substantive reference-table and five guide updates ported from V12. This avoids silently replacing the V10 site with V12's differently packaged file set.

## Automated checks
- ZIP integrity: checked after packaging.
- Sitemap XML: parsed successfully; all sitemap URLs checked against matching HTML files in this package.
- Vercel configuration: JSON parsed successfully.
- ads.txt: publisher line retained.
- Required homepage/About/methodology brand copy and V12 guide/reference pages: present.
- Corrected methodology URL in mulch calculator.

## Not verified
- No live website requests or production deployment performed.
- Interactive calculator arithmetic has not been exhaustively browser-tested in this packaging pass.
- Google indexing, AI-platform brand recognition, AdSense review and traffic outcomes cannot be guaranteed.
