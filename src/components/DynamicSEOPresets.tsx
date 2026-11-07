import React, { useState } from 'react';
import { Share2, Check, Sparkles, Printer } from 'lucide-react';

export interface PresetOption {
  label: string;
  sublabel?: string;
  onClick: () => void;
  active?: boolean;
}

interface DynamicSEOPresetsProps {
  presetsTitle?: string;
  presets: PresetOption[];
  currentQuery?: string;
  canonicalPath: string;
  currentSummary?: string;
  onOpenPrintSheet?: () => void;
}

export const DynamicSEOPresets: React.FC<DynamicSEOPresetsProps> = ({
  presetsTitle = 'Popular Dimensions & Common Sizes',
  presets,
  currentQuery,
  canonicalPath,
  currentSummary,
  onOpenPrintSheet,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const fullUrl = `${window.location.origin}${canonicalPath}${currentQuery ? `?${currentQuery}` : ''}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API not permitted
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 mb-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 tracking-wide uppercase">
            {presetsTitle}
          </span>
          {currentSummary && (
            <span className="hidden md:inline-block text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
              {currentSummary}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              if (onOpenPrintSheet) {
                onOpenPrintSheet();
              } else if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-job-sheet-modal'));
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Print clean job-site specification sheet"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Sheet</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Copy direct shareable link to this exact calculation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Size</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={preset.onClick}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all border text-left cursor-pointer ${
              preset.active
                ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="font-medium">{preset.label}</span>
            {preset.sublabel && (
              <span
                className={`ml-1.5 text-[11px] ${
                  preset.active ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                ({preset.sublabel})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
