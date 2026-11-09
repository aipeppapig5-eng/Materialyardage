import React, { useState } from 'react';
import { CALCULATOR_IMAGES, CalculatorImageMeta } from '../data/uiImages';
import { Camera, Compass, Maximize2, X, CheckCircle2, Info } from 'lucide-react';

interface ProjectPhotoPreviewProps {
  calculatorId: string;
  activeView?: 'schematic' | 'photo';
  onViewChange?: (view: 'schematic' | 'photo') => void;
  metricsOverlay?: {
    primaryValue: string;
    primaryLabel: string;
    secondaryValue?: string;
    secondaryLabel?: string;
  };
  children?: React.ReactNode; // The 2D schematic diagram when 'schematic' is active
  title?: string;
}

export const ProjectPhotoPreview: React.FC<ProjectPhotoPreviewProps> = ({
  calculatorId,
  activeView: controlledActiveView,
  onViewChange,
  metricsOverlay,
  children,
  title,
}) => {
  const [internalView, setInternalView] = useState<'schematic' | 'photo'>('schematic');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const currentView = controlledActiveView ?? internalView;
  const setView = (v: 'schematic' | 'photo') => {
    if (onViewChange) {
      onViewChange(v);
    } else {
      setInternalView(v);
    }
  };

  const imageMeta: CalculatorImageMeta | undefined = CALCULATOR_IMAGES[calculatorId];

  if (!imageMeta) {
    return <>{children}</>;
  }

  return (
    <div className="w-full">
      {/* Top Header / View Toggle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 truncate">
          <span>{title || 'Visual Project Preview'}</span>
        </h3>

        {/* View Switcher Tabs */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setView('schematic')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
              currentView === 'schematic'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3 h-3 text-emerald-700" />
            <span>2D Diagram</span>
          </button>
          <button
            type="button"
            onClick={() => setView('photo')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
              currentView === 'photo'
                ? 'bg-white text-emerald-950 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3 h-3 text-emerald-700" />
            <span>Real Photo</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {currentView === 'schematic' ? (
        <div className="transition-opacity duration-150">{children}</div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-slate-200/90 bg-slate-900 group shadow-2xs transition-all">
          <div className="relative aspect-video sm:h-52 w-full overflow-hidden">
            <img
              src={imageMeta.src}
              alt={imageMeta.alt}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-900/90 text-emerald-100 rounded backdrop-blur-xs border border-emerald-500/40 shadow-xs">
                {imageMeta.badge}
              </span>
            </div>

            {/* Top Right Zoom Button */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
              title="Expand High-Resolution Image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Bottom Live Metrics & Caption */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-3 text-white">
              <div className="max-w-[70%]">
                <p className="text-xs font-bold leading-tight drop-shadow-md text-white">
                  {imageMeta.title}
                </p>
                <p className="text-[10px] text-slate-200 line-clamp-1 drop-shadow-xs mt-0.5">
                  {imageMeta.caption}
                </p>
              </div>

              {metricsOverlay && (
                <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-right border border-white/40 shadow-sm shrink-0">
                  <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                    {metricsOverlay.primaryLabel}
                  </span>
                  <span className="block text-xs font-mono font-extrabold text-emerald-950">
                    {metricsOverlay.primaryValue}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips Ribbon below Photo */}
          <div className="bg-slate-900 text-slate-300 px-3 py-2 text-[11px] flex items-center justify-between border-t border-slate-800">
            <span className="truncate pr-2">
              💡 {imageMeta.materialTips[0]}
            </span>
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold text-[10px] whitespace-nowrap flex items-center gap-0.5"
            >
              <Info className="w-3 h-3" />
              <span>{showTips ? 'Hide' : 'Tips'}</span>
            </button>
          </div>

          {showTips && (
            <div className="bg-slate-850 p-3 border-t border-slate-800 text-[11px] text-slate-200 space-y-1.5">
              <span className="font-semibold text-emerald-400 block mb-1">
                Field Installation Guidelines:
              </span>
              {imageMeta.materialTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-white">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{imageMeta.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-200">
                    {imageMeta.badge}
                  </span>
                </h4>
                <p className="text-xs text-slate-400">{imageMeta.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={imageMeta.src}
                alt={imageMeta.alt}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
              {metricsOverlay && (
                <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white text-right">
                  <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {metricsOverlay.primaryLabel}
                  </span>
                  <span className="block text-base font-mono font-extrabold text-white">
                    {metricsOverlay.primaryValue}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              {imageMeta.materialTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
