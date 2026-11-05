import React, { useState } from 'react';
import { PageSEO } from '../data/seoData';
import { ChevronDown, ChevronUp, BookOpen, Calculator, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface SEOGuideSectionProps {
  seo: PageSEO;
}

export const SEOGuideSection: React.FC<SEOGuideSectionProps> = ({ seo }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  return (
    <section className="mt-12 space-y-8 border-t border-slate-200 pt-10 text-slate-800">
      {/* Mid-content AdSlot (AdSense ready) */}
      <AdSlot slotId="3492817456" format="auto" label="Sponsored Construction & Textile Partners" />

      {/* Guide Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Calculation Methodology & Guide</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          How to Calculate {seo.h1}
        </h2>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          {seo.lead}
        </p>
      </div>

      {/* Formula & Worked Example Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mathematical Formula Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>{seo.formula.title}</span>
          </div>
          <div className="p-3.5 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto select-all">
            {seo.formula.expression}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {seo.formula.explanation}
          </p>
        </div>

        {/* Worked Real-World Example Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{seo.workedExample.title}</span>
          </div>
          <p className="text-xs text-slate-700 font-medium">
            <strong>Scenario:</strong> {seo.workedExample.scenario}
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            {seo.workedExample.steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ul>
          <div className="pt-2 border-t border-slate-200 text-xs font-bold text-emerald-950 font-mono">
            {seo.workedExample.result}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQPage Schema target for Google Rich Snippets) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <h3>Frequently Asked Questions</h3>
        </div>
        <p className="text-xs text-slate-500">
          Answers to common questions regarding measuring, ordering allowances, and material specifications.
        </p>

        <div className="space-y-3">
          {seo.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-800 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Leaderboard AdSlot */}
      <AdSlot slotId="8923741029" format="horizontal" label="Advertisement" />
    </section>
  );
};
