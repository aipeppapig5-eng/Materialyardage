import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  adClient?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = '1234567890',
  format = 'auto',
  className = '',
  adClient = 'ca-pub-2650221548917155', // Google AdSense Publisher Client ID
  label = 'Advertisement',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // AdSense push errors caught gracefully
    }
  }, []);

  return (
    <div className={`w-full my-6 text-center select-none overflow-hidden ${className}`}>
      {/* Policy compliant advertisement label */}
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center justify-center gap-2">
        <span className="w-8 h-px bg-slate-200"></span>
        <span>{label}</span>
        <span className="w-8 h-px bg-slate-200"></span>
      </div>

      {/* AdSense ins tag */}
      <div className="min-h-[90px] w-full bg-slate-50 border border-slate-200/90 rounded-xl p-2 flex flex-col items-center justify-center relative shadow-2xs">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Compliant Ad placeholder fallback when script is blocked or offline */}
        <div className="py-4 px-6 text-center space-y-1">
          <div className="text-xs font-semibold text-slate-700 flex items-center justify-center gap-2">
            <span>Google AdSense Display Unit</span>
            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              {format === 'auto' ? 'Responsive Banner (728×90 / 320×50)' : '300×250 Medium Rectangle'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            High-converting contextual ad placement slot for material suppliers, fabric retailers, and local tool rentals.
          </p>
        </div>
      </div>
    </div>
  );
};
