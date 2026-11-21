import React from 'react';
import { AlertTriangle, HardHat, Scale, CheckCircle2 } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <header className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide">
          <AlertTriangle className="w-4 h-4" />
          <span>Calculation &amp; Engineering Notice</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: November 19, 2026 · Material Yardage Editorial &amp; Engineering Standards
        </p>
      </header>

      {/* Overview */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          All calculators, 2D cutting planners, volume-to-tonnage conversions, and instructional guides published on <strong>Material Yardage</strong> (<span className="font-mono text-xs text-emerald-800">https://www.materialyardage.com</span>) are provided strictly for informational, budgeting, and preliminary project planning purposes.
        </p>
      </section>

      {/* Core Notice Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <HardHat className="w-4 h-4 text-emerald-700" />
            <span>Not Licensed Engineering Advice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Results for concrete slabs, footings, retaining walls, geogrid reinforcement, and fence post embeds do not replace site-specific soil testing, structural blueprints, or local building code inspections. Always consult a licensed structural engineer or building official for load-bearing structures or retaining walls exceeding local height limits.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Bulk Material &amp; Weight Variances</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bulk aggregates, soils, and mulches vary significantly by quarry geology, organic fiber composition, and moisture saturation. A cubic yard of damp topsoil or crushed limestone can weigh 10% to 25% more than dry stock. Always confirm exact truckload weights and bag coverage with your local landscape yard or supplier before delivery.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">1. Sub-Base Grading, Compaction &amp; Site Waste</h2>
        <p>
          Real-world excavations are rarely geometrically flat. Low spots in sub-grades, irregular trench walls, aggregate compaction under plate compactors (commonly 15%–20% for decomposed granite and road base), and spillage during placement routinely increase actual consumption beyond theoretical volume. We recommend reviewing the built-in waste allowance slider in each calculator and confirming order quantities with your installer.
        </p>
      </section>

      {/* Section 2 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">2. Textile, Upholstery &amp; Wallpaper Tolerances</h2>
        <p>
          Our 2D fabric cutting diagrams and drapery estimators assume accurate measurements of usable fabric width inside selvedges. Manufacturers may vary bolt width by ±0.5 to 1 inch, and natural fibers such as cotton, linen, and canvas may shrink upon pre-washing. Always verify dye-lot consistency, directional nap orientation, and pattern repeat intervals prior to cutting yardage.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">3. Cost Estimates &amp; Retail Pricing</h2>
        <p>
          Any unit prices, bag prices, freight estimates, or tax rates displayed or entered in the Bill of Materials (BOM) calculator are user-editable placeholders for personal budgeting. Material Yardage does not guarantee supplier pricing, stock availability, or regional delivery rates.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>4. Advertising &amp; Affiliate Disclosure</span>
        </h2>
        <p>
          Material Yardage is supported in part by third-party display advertisements served through Google AdSense. Sponsored advertisements are clearly separated from editorial formulas and calculator results, and advertisers have no influence over our engineering density presets or calculation methodologies. See our <a href="/privacy-policy" className="text-emerald-800 underline font-semibold">Privacy Policy</a> and <a href="/terms-of-service" className="text-emerald-800 underline font-semibold">Terms of Service</a> for additional legal details.
        </p>
      </section>

      {/* Contact */}
      <section className="p-5 bg-slate-100 rounded-xl space-y-2 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm">Report a Specification or Formula Correction</h3>
        <p>
          Notice a regional material density or retail bag yield that needs updating? Reach our editorial engineering team at <strong className="text-slate-900">support@materialyardage.com</strong> or via our <a href="/contact" className="text-emerald-800 underline font-semibold">Contact page</a>.
        </p>
      </section>
    </main>
  );
};
