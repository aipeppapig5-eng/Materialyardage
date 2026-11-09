import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateBoxCushions, CushionParams } from '../../utils/fabricMath';
import { ShoppingCart } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface UpholsteryCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const UpholsteryCalc: React.FC<UpholsteryCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const units = system === 'imperial' ? 'in' : 'cm';
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  const [cushionWidth, setCushionWidth] = useState<number>(Number(initialParams.w) || 24);
  const [cushionDepth, setCushionDepth] = useState<number>(Number(initialParams.d) || 24);
  const [foamThickness, setFoamThickness] = useState<number>(Number(initialParams.t) || 4);
  const [cushionCount, setCushionCount] = useState<number>(Number(initialParams.count) || 4);
  const [fabricWidth, setFabricWidth] = useState<number>(54);
  const [includePiping, setIncludePiping] = useState<boolean>(true);
  const [pricePerYard, setPricePerYard] = useState<number>(36);

  const params: CushionParams = {
    cushionWidthInches: cushionWidth,
    cushionDepthInches: cushionDepth,
    foamThicknessInches: foamThickness,
    cushionCount,
    fabricWidthInches: fabricWidth,
    seamAllowanceInches: 0.5,
    includePiping,
  };

  const res = useMemo(() => calculateBoxCushions(params), [params]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'upholstery_cushions',
      cushionWidth,
      cushionDepth,
      foamThickness,
      cushionCount,
      fabricWidth,
      totalFabricYards: res.totalFabricYards,
      pipingCordYards: res.pipingYardsOfCord,
      unitPrice: pricePerYard,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: '2 Dining Cushions',
      sublabel: '18" × 18" × 2" · 2.5 yds',
      active: cushionCount === 2 && cushionWidth === 18 && cushionDepth === 18 && foamThickness === 2,
      onClick: () => {
        setCushionCount(2);
        setCushionWidth(18);
        setCushionDepth(18);
        setFoamThickness(2);
      },
    },
    {
      label: '4 Standard Cushions',
      sublabel: '20" × 20" × 3" · 4.8 yds',
      active: cushionCount === 4 && cushionWidth === 20 && cushionDepth === 20 && foamThickness === 3,
      onClick: () => {
        setCushionCount(4);
        setCushionWidth(20);
        setCushionDepth(20);
        setFoamThickness(3);
      },
    },
    {
      label: '4 Deep Lounge Cushions',
      sublabel: '24" × 24" × 4" · 7.5 yds',
      active: cushionCount === 4 && cushionWidth === 24 && cushionDepth === 24 && foamThickness === 4,
      onClick: () => {
        setCushionCount(4);
        setCushionWidth(24);
        setCushionDepth(24);
        setFoamThickness(4);
      },
    },
    {
      label: '6 Sectional Cushions',
      sublabel: '26" × 26" × 5" · 11.2 yds',
      active: cushionCount === 6 && cushionWidth === 26 && cushionDepth === 26 && foamThickness === 5,
      onClick: () => {
        setCushionCount(6);
        setCushionWidth(26);
        setCushionDepth(26);
        setFoamThickness(5);
      },
    },
    {
      label: '1 Long Entry Bench',
      sublabel: '48" × 18" × 3" · 2.2 yds',
      active: cushionCount === 1 && cushionWidth === 48 && cushionDepth === 18 && foamThickness === 3,
      onClick: () => {
        setCushionCount(1);
        setCushionWidth(48);
        setCushionDepth(18);
        setFoamThickness(3);
      },
    },
  ];

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `Upholstery Cushions (${cushionCount}x Box Cushions ${cushionWidth}"×${cushionDepth}"×${foamThickness}")`,
      category: 'fabric',
      calculatorType: 'Upholstery & Box Cushion',
      primaryQuantity: Number(res.totalFabricYards.toFixed(2)),
      primaryUnit: 'yards',
      secondarySummary: `${cushionCount * 2} plates + ${res.boxingStripsCount} boxing strips${includePiping ? ` + ${res.pipingYardsOfCord.toFixed(1)} yd piping cord` : ''}`,
      unitPrice: pricePerYard,
      notes: `Plate size: ${res.plateW}"×${res.plateH}". Boxing height: ${res.boxingHeight}". ${includePiping ? `Welting cord: ${res.pipingYardsOfCord.toFixed(1)} yd.` : ''}`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Long-Tail Box Cushion Sizes"
        presets={presets}
        canonicalPath="/upholstery-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Box Cushion Dimensions & Style
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cushion Width ({units})
              </label>
              <input
                type="number"
                min="6"
                step="0.5"
                value={cushionWidth}
                onChange={e => setCushionWidth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cushion Depth ({units})
              </label>
              <input
                type="number"
                min="6"
                step="0.5"
                value={cushionDepth}
                onChange={e => setCushionDepth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Foam Thickness ({units})
              </label>
              <select
                value={foamThickness}
                onChange={e => setFoamThickness(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={2}>2" (Dining Chair Pad)</option>
                <option value={3}>3" (Bench Cushion)</option>
                <option value={4}>4" (Standard Sofa Seat)</option>
                <option value={5}>5" (Plush Lounge)</option>
                <option value={6}>6" (Deep Daybed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cushion Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={cushionCount}
                onChange={e => setCushionCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Upholstery Fabric Bolt Width
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '54" Standard Decor', val: 54 },
                  { label: '60" Heavy Canvas', val: 60 },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFabricWidth(opt.val)}
                    className={`py-2 px-2 text-xs rounded-md border text-center transition-colors ${
                      fabricWidth === opt.val
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={includePiping}
                  onChange={e => setIncludePiping(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-800 font-semibold">
                  Include Welting / Piping Cord
                </span>
              </label>
              <p className="text-[11px] text-slate-500 ml-5 mt-0.5">
                Adds bias-cut strips & calculates total yards of piping cord needed for top and bottom seams.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600">
              Each cushion yields: <strong className="text-slate-900 font-mono">2 plates ({res.plateW}"×{res.plateH}")</strong> + <strong className="text-slate-900 font-mono">{res.boxingHeight}"</strong> boxing strip
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Price / yd:</span>
              <div className="relative">
                <span className="absolute left-2 top-1 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricePerYard}
                  onChange={e => setPricePerYard(Number(e.target.value))}
                  className="w-20 pl-5 pr-2 py-1 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Isometric Box Cushion Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <ProjectPhotoPreview
              calculatorId="upholstery_cushions"
              title="Isometric Cushion & Upholstery Photo"
              metricsOverlay={{
                primaryValue: `${res.totalFabricYards.toFixed(2)} yd`,
                primaryLabel: 'Required Fabric',
                secondaryValue: `${cushionCount} cushions`,
                secondaryLabel: 'Box Cushions',
              }}
            >
              <div className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center relative h-52">
                <svg width="200" height="150" viewBox="0 0 200 150" className="overflow-visible select-none">
                  {/* Top plate */}
                  <polygon
                    points="100,20 170,50 100,80 30,50"
                    fill="#d1fae5"
                    stroke="#059669"
                    strokeWidth="2"
                  />
                  {/* Front Left boxing */}
                  <polygon
                    points="30,50 100,80 100,120 30,90"
                    fill="#a7f3d0"
                    stroke="#047857"
                    strokeWidth="1.5"
                  />
                  {/* Front Right boxing */}
                  <polygon
                    points="100,80 170,50 170,90 100,120"
                    fill="#6ee7b7"
                    stroke="#047857"
                    strokeWidth="1.5"
                  />
                  {/* Piping welt lines */}
                  {includePiping && (
                    <>
                      <polyline points="30,50 100,80 170,50" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,2" />
                      <polyline points="30,90 100,120 170,90" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,2" />
                    </>
                  )}
                  {/* Dimension callouts */}
                  <text x="145" y="32" fontSize="9" fontWeight="600" fill="#065f46" fontFamily="monospace">{cushionWidth}"</text>
                  <text x="52" y="32" fontSize="9" fontWeight="600" fill="#065f46" fontFamily="monospace">{cushionDepth}"</text>
                  <text x="180" y="75" fontSize="9" fontWeight="600" fill="#047857" fontFamily="monospace">{foamThickness}" box</text>
                </svg>
              </div>
            </ProjectPhotoPreview>

            <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
              <p>• Plates required: <strong className="text-slate-800 font-mono">{cushionCount * 2} plates</strong> ({res.plateRows} fabric rows)</p>
              {includePiping && (
                <p>• Welting cord: <strong className="text-red-700 font-mono">{res.pipingYardsOfCord.toFixed(1)} yards</strong> of 5/32" cord</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleAddEstimateToBOM}
              className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Cushions to Project BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Upholstery Fabric</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.totalFabricYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5">
            Includes 10% pattern safety margin
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Plates & Boxing Yardage</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.baseFabricYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {cushionCount * 2} cushion plates
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Piping Welting Fabric</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {includePiping ? `${res.pipingFabricYards.toFixed(2)} yd` : '0 yd'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {includePiping ? `${res.pipingYardsOfCord.toFixed(1)} yd cord needed` : 'No welting'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Fabric Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.totalFabricYards * pricePerYard).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerYard}/yard
          </p>
        </div>
      </div>
    </div>
  );
};
