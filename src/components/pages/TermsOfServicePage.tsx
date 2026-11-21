import React from 'react';
import { FileText, Scale, AlertCircle, Shield } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800">
      {/* Page Header */}
      <header className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wide">
          <Scale className="w-4 h-4" />
          <span>Legal Terms &amp; Usage Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: November 19, 2026 · Effective Date: January 1, 2026
        </p>
      </header>

      {/* Introduction */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <p>
          Welcome to <strong>Material Yardage</strong> (<span className="font-mono text-xs text-emerald-800">https://www.materialyardage.com</span>). By accessing or using our online material calculators, 2D cutting planners, reference guides, Bill of Materials (BOM) exporter, or embeddable widgets (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the Service.
        </p>
      </section>

      {/* Key Terms Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Free Planning Access</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All calculators and reference guides are free for personal, homeowner, craft, and commercial contractor estimation.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 text-emerald-700" />
            <span>Estimation Only</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Outputs are mathematical planning estimates and must be confirmed against supplier specifications before ordering.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Local Browser Storage</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Project lists and unit preferences remain in your browser&apos;s localStorage without requiring user accounts.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">1. Use of Calculators &amp; Tools</h2>
        <p>
          You may use Material Yardage calculators, unit converters, printable job specification sheets, and CSV BOM exports for personal DIY projects, residential remodeling, landscaping, textile workrooms, and commercial bid preparation. You agree not to:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Scrape, mirror, or automatically harvest site calculators or database tables in a manner that degrades server stability.</li>
          <li>Attempt to bypass security controls, reverse-engineer proprietary client scripts for redistribution, or frame pages outside our official Embed Widget tool.</li>
          <li>Use automated bots to generate artificial ad impressions or fraudulent clicks on partner advertisements.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">2. Intellectual Property &amp; Embeddable Widgets</h2>
        <p>
          All original calculator logic, 2D bin-packing visualizers, written reference guides, structural tables, photography, and interface designs on Material Yardage are protected under applicable copyright and intellectual property laws. Publishers and bloggers who embed our calculators using the built-in Embed Widget snippet are granted a non-exclusive, revocable license to display the widget provided attribution links back to Material Yardage remain intact.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">3. Accuracy &amp; No Engineering Warranty</h2>
        <p>
          While our formulas are calibrated against standard civil engineering, agricultural, and textile references, Material Yardage provides all tools on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, express or implied. Real-world variables including sub-base settlement, material moisture content, compaction ratios, fabric shrinkage, and regional supplier bag weights vary by location. Please review our full <a href="/disclaimer" className="text-emerald-800 underline font-semibold">Engineering &amp; Estimation Disclaimer</a> before placing material orders.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">4. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, Material Yardage and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages—including surplus material costs, re-delivery freight charges, project delays, or property damage—arising out of your use of or reliance on any calculation output or guide article.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">5. Third-Party Links &amp; Advertising</h2>
        <p>
          Material Yardage displays third-party advertisements (including Google AdSense) and may reference external standards organizations or suppliers. We do not control and are not responsible for the content, privacy practices, pricing, or fulfillment terms of third-party websites. Your privacy rights regarding ad cookies are detailed in our <a href="/privacy-policy" className="text-emerald-800 underline font-semibold">Privacy Policy</a>.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-slate-900">6. Modifications &amp; Governing Law</h2>
        <p>
          We reserve the right to update calculators, material density presets, or these Terms of Service at any time without prior notice. Continued use of the website after updates are posted constitutes acceptance of the revised terms.
        </p>
      </section>

      {/* Contact */}
      <section className="p-5 bg-slate-100 rounded-xl space-y-2 text-xs text-slate-600">
        <h3 className="font-bold text-slate-900 text-sm">Questions Regarding These Terms</h3>
        <p>
          If you have any questions about these Terms of Service or widget licensing, contact our team at <strong className="text-slate-900">support@materialyardage.com</strong> or visit our <a href="/contact" className="text-emerald-800 underline font-semibold">Contact page</a>.
        </p>
      </section>
    </main>
  );
};
