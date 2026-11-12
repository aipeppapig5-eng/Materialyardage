import React, { useState } from 'react';
import { X, Code2, Copy, Check, ExternalLink, Globe, Sparkles, Shield, Monitor } from 'lucide-react';

interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCalculator?: string;
}

export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({
  isOpen,
  onClose,
  defaultCalculator = 'concrete_calc',
}) => {
  const [selectedTool, setSelectedTool] = useState<string>(defaultCalculator);
  const [widgetHeight, setWidgetHeight] = useState<number>(680);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toolEndpoints: Record<string, { label: string; path: string }> = {
    concrete_calc: { label: 'Concrete Slabs & Footings', path: 'concrete-calculator' },
    mulch_soil: { label: 'Mulch & Soil Mix Estimator', path: 'topsoil-calculator' },
    gravel_aggregate: { label: 'Gravel & Aggregate Ton Calculator', path: 'gravel-calculator' },
    paver_masonry: { label: 'Paver Patio & CMU Wall Calculator', path: 'paver-patio-calculator' },
    fabric_cut: { label: '2D Fabric Cut Planner & Yardage', path: 'fabric-yardage-calculator' },
    wallpaper_calc: { label: 'Wallpaper Roll & Strip Calculator', path: 'wallpaper-calculator' },
  };

  const currentTool = toolEndpoints[selectedTool] || toolEndpoints['concrete_calc'];
  const embedUrl = `https://www.materialyardage.com/${currentTool.path}?embed=true`;

  const embedCode = `<!-- Start Material Yardage Embed Widget -->
<div style="width: 100%; max-width: 900px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
  <iframe
    src="${embedUrl}"
    width="100%"
    height="${widgetHeight}"
    style="border: none; display: block;"
    title="Material Yardage — ${currentTool.label}"
    loading="lazy"
  ></iframe>
  <div style="padding: 10px 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-family: sans-serif; font-size: 12px; color: #64748b;">
    Free calculation tools provided by <a href="https://www.materialyardage.com" target="_blank" rel="noopener" style="color: #059669; font-weight: 600; text-decoration: none;">Material Yardage</a>
  </div>
</div>
<!-- End Material Yardage Embed Widget -->`.trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/90 text-white flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Embed Calculator on Your Website</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60 font-mono uppercase">
                  Free Backlink Asset
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Give your readers instant material quantities without leaving your blog, client portal, or contractor site.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Calculator Tool
              </label>
              <select
                value={selectedTool}
                onChange={e => setSelectedTool(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {Object.entries(toolEndpoints).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Widget Display Height (px)
              </label>
              <input
                type="number"
                min="500"
                max="1000"
                step="20"
                value={widgetHeight}
                onChange={e => setWidgetHeight(Number(e.target.value) || 680)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* HTML Code Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>HTML Embed Code (Copy &amp; Paste into WordPress, Wix, Squarespace, or HTML)</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Embed Code'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 overflow-x-auto max-h-44 leading-relaxed">
                {embedCode}
              </pre>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Free &amp; Ad-Free</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Embedded widgets display a clean calculation viewport without external popups or disruptive banners.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mobile Responsive</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Adapts seamlessly to phones, tablets, and desktop sidebars with fluid CSS width scaling.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Dual Imperial &amp; Metric</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Supports yards, cubic feet, cubic metres, 80lb bags, and metric tonnes out of the box.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>Attribution link is included to comply with terms of use.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
