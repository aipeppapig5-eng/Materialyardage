import React, { useState } from 'react';
import { GuideArticle } from '../../data/guidesData';
import {
  BookOpen,
  ArrowLeft,
  Calculator,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
} from 'lucide-react';
import { AdSlot } from '../AdSlot';
import { CALCULATOR_IMAGES } from '../../data/uiImages';

interface GuideDetailPageProps {
  guide: GuideArticle;
  onBackToGuides: () => void;
  onOpenCalculator: (calculatorId: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  guide,
  onBackToGuides,
  onOpenCalculator,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToGuides}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900">
            {guide.categoryLabel}
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readTime}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Updated for 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed font-normal">
          {guide.summary}
        </p>

        {/* Real-World Application Photo */}
        {CALCULATOR_IMAGES[guide.calculatorId] && (
          <div className="relative aspect-video sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 group">
            <img
              src={CALCULATOR_IMAGES[guide.calculatorId].src}
              alt={CALCULATOR_IMAGES[guide.calculatorId].alt}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-100 border border-emerald-500/40 backdrop-blur-xs">
                {CALCULATOR_IMAGES[guide.calculatorId].badge}
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <p className="text-sm font-bold text-white drop-shadow-md">
                {CALCULATOR_IMAGES[guide.calculatorId].title}
              </p>
              <p className="text-xs text-slate-200 drop-shadow-xs line-clamp-1 mt-0.5">
                {CALCULATOR_IMAGES[guide.calculatorId].caption}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Tool Banner Callout */}
        <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
              <Calculator className="w-4 h-4" />
              <span>Interactive Companion Tool</span>
            </div>
            <div className="text-sm font-bold text-white">
              Calculate exact quantities with our free {guide.calculatorName}
            </div>
          </div>
          <button
            onClick={() => onOpenCalculator(guide.calculatorId)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            Launch Calculator Now
          </button>
        </div>
      </header>

      {/* Key Takeaways Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Key Rules of Thumb & Takeaways</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
          {guide.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mid-article Advertisement Placement */}
      <AdSlot slotId="4819203948" format="auto" label="Sponsored Contractor Supplies" />

      {/* Main Guide Content */}
      <div className="space-y-8 text-slate-800 text-sm leading-relaxed">
        {guide.content.map((block, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              {block.heading}
            </h2>
            {block.text.map((p, pIdx) => (
              <p key={pIdx} className="text-slate-600 leading-relaxed text-sm">
                {p}
              </p>
            ))}

            {block.callout && (
              <div className="bg-slate-900 text-white rounded-xl p-4 my-3 font-mono text-xs border-l-4 border-emerald-500">
                <div className="text-emerald-400 font-bold text-[11px] mb-1 uppercase tracking-wider">
                  {block.callout.title}
                </div>
                <div className="text-white text-sm font-bold">
                  {block.callout.body}
                </div>
              </div>
            )}

            {block.table && (
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs my-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      {block.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="py-2.5 px-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {block.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-3 ${cIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      {guide.faq && guide.faq.length > 0 && (
        <section className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {guide.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-3 px-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-800 transition-colors"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Tool CTA Card */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900">
            Ready to calculate your job?
          </h3>
          <p className="text-xs text-slate-600">
            Switch to the {guide.calculatorName} to enter your exact project measurements.
          </p>
        </div>
        <button
          onClick={() => onOpenCalculator(guide.calculatorId)}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Open {guide.calculatorName}
        </button>
      </div>

      {/* Bottom Ad */}
      <AdSlot slotId="8492019382" format="horizontal" label="Advertisement" />
    </article>
  );
};
