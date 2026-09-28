# MaterialYardage v2.4 QA Report

Date: 2026-09-28

## Scope
- Existing calculators: Topsoil, Mulch, Gravel, Compost & Soil Mix, Sod, Concrete Slab, Concrete Mix Proportions, Brick, Block, Mortar.
- New calculators: Concrete, Cement, Sand, Aggregate, Paver, Material Cost.
- SEO: canonical URL consistency, clean URLs, sitemap uniqueness.
- JavaScript: syntax validation and DOM-target presence checks.

## Known reference calculations
| Calculator | Test input | Expected planning result |
|---|---|---|
| Topsoil | 20 × 10 ft × 6 in | 3.70 yd³; ~4.07 tons at 1.1 tons/yd³; 134 × 0.75-ft³ bags |
| Mulch | 20 × 15 ft × 3 in | 2.78 yd³; 38 × 2-ft³ bags; ~1.11 tons at 0.4 tons/yd³ |
| Gravel | 40 × 10 ft × 4 in | 4.94 yd³; ~6.91 tons at 1.4 tons/yd³ |
| Compost mix | 12 × 4 ft × 12 in + 10% | 1.96 yd³ gross; 1.37 yd³ soil + 0.59 yd³ compost |
| Concrete | 20 × 10 ft × 4 in + 10% | 2.74 yd³ order quantity |
| Pavers | 20 × 10 ft; 12 × 6 in; 10% | 440 units |

## QA status
- No placeholder AdSense slot IDs found.
- No duplicate sitemap URLs.
- Sitemap contains only canonical clean URLs.
- New calculator scripts use DOMContentLoaded and validate non-negative numeric input.
- Compost Mix uses the corrected standalone JS engine and calculates on page load and input changes.
- Sod output formatting was corrected to use integer locale formatting.

## Limitations
This is a static-source QA pass. It does not replace browser testing after deployment, especially for Vercel clean-URL routing, AdSense loading, mobile rendering and real supplier data.
