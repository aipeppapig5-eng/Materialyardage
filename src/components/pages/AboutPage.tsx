import React from 'react';
import { Target, Award, CheckCircle2, ShieldCheck, Calculator, Compass } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>About Us</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About Material Yardage
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          The precision engineering resource built for homeowners, landscape contractors, civil builders, quilters, and professional upholsterers.
        </p>
      </div>

      {/* Our Mission */}
      <section className="space-y-4 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-700" />
          <span>Our Mission: Eliminate Costly Estimation Errors</span>
        </h2>
        <p>
          Every year, millions of dollars are wasted across construction jobsites and sewing workrooms due to flawed material estimation. Over-ordering leads to excess inventory, non-refundable freight fees, and landfill scrap; under-ordering halts projects mid-pour or mid-stitch, requiring costly secondary delivery fees and risking mismatched dye lots.
        </p>
        <p>
          <strong>Material Yardage</strong> was engineered to bridge the gap between abstract academic formulas and real-world purchasing. Traditional web calculators rely on oversimplified geometry and ignore crucial variables like <em>soil settlement factors</em>, <em>crushed stone compaction</em>, <em>fabric selvedges</em>, and <em>vertical pattern repeats</em>. Our platform gives you visual, verified, and transparent math so you can order with absolute confidence.
        </p>
      </section>

      {/* Pillars of Engineering Excellence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2D Packing & Algorithmic Geometry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than dividing raw square inches by bolt width, our 2D bin-packing visualizer simulates genuine roll layout, rotation permissions, and off-cut waste mapping.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Calibrated Bulk Densities</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We cross-reference commercial quarry delivery slips and agricultural testing standards to supply authentic weight-to-volume ratios across mulches, soils, gravels, and sands.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Open & Free Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No forced registrations, no hidden paywalls, and no client-side tracking. Instant results with exportable Bills of Materials and CSV spreadsheets.
          </p>
        </div>
      </div>

      {/* Editorial & Testing Methodology */}
      <section className="space-y-4 text-sm leading-relaxed text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Our Calculation & Verification Standards</h2>
        <p>
          Every calculator on Material Yardage is developed through a rigorous 3-step verification process:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">1. Mathematical & Volumetric Proofing:</strong> Formulas are verified against civil engineering standards (American Concrete Institute ACI-318, ASTM C33 for concrete aggregates) and textile manufacturing tolerances (ASTM D3774).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">2. Real-World Field Calibration:</strong> We consult licensed landscape contractors, certified master gardeners, ready-mix dispatchers, and professional master quilters to validate loss margins and compaction percentages.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">3. Continuous User Review:</strong> We actively adjust default bulk densities based on feedback from local quarry operators and regional soil suppliers nationwide.
            </div>
          </div>
        </div>
      </section>

      {/* Accuracy & Professional Engineering Disclaimer */}
      <section className="space-y-2 text-xs leading-relaxed text-slate-500 border-t border-slate-200 pt-6">
        <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Accuracy & Structural Disclaimer</h3>
        <p>
          Estimates provided by Material Yardage are intended strictly for planning and budgetary purposes. Because real-world material compaction, moisture saturation, sub-base unevenness, fabric distortion, and supplier packaging variations are beyond our direct control, always confirm final quantities with your local supplier or project engineer prior to placing non-refundable orders.
        </p>
      </section>
    </div>
  );
};
