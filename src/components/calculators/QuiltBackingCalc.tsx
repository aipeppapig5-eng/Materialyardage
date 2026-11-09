import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateQuiltBacking, QuiltParams } from '../../utils/fabricMath';
import { ShoppingCart } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface QuiltBackingCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const QuiltBackingCalc: React.FC<QuiltBackingCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const units = system === 'imperial' ? 'in' : 'cm';
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  const [topWidth, setTopWidth] = useState<number>(Number(initialParams.w) || 60);
  const [topLength, setTopLength] = useState<number>(Number(initialParams.l) || 80);
  const [overhang, setOverhang] = useState<number>(4); // 4" on all sides
  const [fabricWidth, setFabricWidth] = useState<number>(Number(initialParams.bolt) || 44);
  const [bindingWidth, setBindingWidth] = useState<number>(2.5);
  const [pricePerYard, setPricePerYard] = useState<number>(14);

  const params: QuiltParams = {
    topWidthInches: topWidth,
    topLengthInches: topLength,
    overhangInches: overhang,
    fabricWidthInches: fabricWidth,
    bindingWidthInches: bindingWidth,
    miterSeamAllowanceInches: 12,
  };

  const res = useMemo(() => calculateQuiltBacking(params), [params]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'quilt_backing',
      topWidthInches: topWidth,
      topLengthInches: topLength,
      fabricWidthInches: fabricWidth,
      totalYards: res.totalProjectYards,
      backingYards: res.backingYards,
      bindingYards: res.bindingYards,
      seamOrientation: res.seamOrientation,
      unitPrice: pricePerYard,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: 'Baby / Crib (36" × 52")',
      sublabel: '2.5 yds on 44"',
      active: topWidth === 36 && topLength === 52,
      onClick: () => {
        setTopWidth(36);
        setTopLength(52);
      },
    },
    {
      label: 'Throw Quilt (60" × 80")',
      sublabel: '5.6 yds on 44"',
      active: topWidth === 60 && topLength === 80,
      onClick: () => {
        setTopWidth(60);
        setTopLength(80);
      },
    },
    {
      label: 'Twin Quilt (70" × 90")',
      sublabel: '6.2 yds on 44"',
      active: topWidth === 70 && topLength === 90,
      onClick: () => {
        setTopWidth(70);
        setTopLength(90);
      },
    },
    {
      label: 'Queen Quilt (90" × 108")',
      sublabel: '9.2 yds on 44"',
      active: topWidth === 90 && topLength === 108,
      onClick: () => {
        setTopWidth(90);
        setTopLength(108);
      },
    },
    {
      label: 'King Quilt (110" × 108")',
      sublabel: '10.1 yds on 44"',
      active: topWidth === 110 && topLength === 108,
      onClick: () => {
        setTopWidth(110);
        setTopLength(108);
      },
    },
  ];

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `Quilt Backing & Binding (${topWidth}" × ${topLength}" Quilt Top)`,
      category: 'fabric',
      calculatorType: 'Quilt Backing & Binding',
      primaryQuantity: Number(res.totalProjectYards.toFixed(2)),
      primaryUnit: 'yards',
      secondarySummary: `${res.backingYards.toFixed(2)} yd backing (${res.seamOrientation} seam) + ${res.bindingYards.toFixed(2)} yd binding`,
      unitPrice: pricePerYard,
      notes: `${res.panelsNeeded} backing panels on ${fabricWidth}" fabric. ${res.stripsNeeded} binding strips (${bindingWidth}" wide).`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Standard Quilt Size Dimensions"
        presets={presets}
        canonicalPath="/quilt-backing-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Quilt Dimensions & Fabric
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Quilt Top Width ({units})
              </label>
              <input
                type="number"
                min="10"
                step="1"
                value={topWidth}
                onChange={e => setTopWidth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Quilt Top Length ({units})
              </label>
              <input
                type="number"
                min="10"
                step="1"
                value={topLength}
                onChange={e => setTopLength(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Longarm Overhang ({units})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={overhang}
                onChange={e => setOverhang(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Backing Fabric Bolt Width
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '42" Quilting', val: 42 },
                  { label: '44" Standard', val: 44 },
                  { label: '108" Wide-Back', val: 108 },
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

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Binding Strip Width ({units})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '2.25" French', val: 2.25 },
                  { label: '2.5" Standard', val: 2.5 },
                  { label: '3.0" Wide', val: 3.0 },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setBindingWidth(opt.val)}
                    className={`py-2 px-2 text-xs rounded-md border text-center transition-colors ${
                      bindingWidth === opt.val
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600">
              Total required backing size: <strong className="text-slate-900 font-mono">{res.totalWidthNeeded}" × {res.totalLengthNeeded}"</strong> (includes {overhang}" borders)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Price / yd:</span>
              <div className="relative">
                <span className="absolute left-2 top-1 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={pricePerYard}
                  onChange={e => setPricePerYard(Number(e.target.value))}
                  className="w-20 pl-5 pr-2 py-1 text-xs border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <ProjectPhotoPreview
              calculatorId="quilt_backing"
              title="Backing Seams & Quilt Studio Photo"
              metricsOverlay={{
                primaryValue: `${res.backingYards.toFixed(2)} yd`,
                primaryLabel: 'Backing Yardage',
                secondaryValue: `${res.bindingYards.toFixed(2)} yd`,
                secondaryLabel: 'Binding Yardage',
              }}
            >
              <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center relative h-52">
                {/* Backing Area */}
                <div className="w-48 h-40 border-2 border-dashed border-emerald-500 bg-emerald-50/50 relative flex items-center justify-center">
                  {/* Quilt Top inside */}
                  <div className="w-36 h-28 border border-slate-700 bg-white shadow-xs flex flex-col items-center justify-center text-center p-1">
                    <span className="text-xs font-semibold text-slate-800">Quilt Top</span>
                    <span className="text-[10px] font-mono text-slate-500">{topWidth}" × {topLength}"</span>
                  </div>

                  {/* Seam line */}
                  {res.seamOrientation === 'vertical' && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-400 border-r border-dashed border-red-600" />
                  )}
                  {res.seamOrientation === 'horizontal' && (
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-400 border-b border-dashed border-red-600" />
                  )}
                </div>
              </div>
            </ProjectPhotoPreview>

            <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
              <p>• Backing layout: <strong className="text-emerald-800 font-medium capitalize">{res.seamOrientation}</strong> seam ({res.panelsNeeded} {res.panelsNeeded === 1 ? 'panel' : 'panels'})</p>
              <p>• Perimeter: <span className="font-mono">{res.perimeterInches}"</span> ({res.stripsNeeded} binding strips)</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleAddEstimateToBOM}
              className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Quilt to Project BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Backing Yardage</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.backingYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5">
            {res.panelsNeeded} panel(s) of {fabricWidth}" fabric
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Binding Yardage</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.bindingYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {res.stripsNeeded} strips @ {bindingWidth}" width
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Project Fabric</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.totalProjectYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Backing + Binding combined
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Fabric Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.totalProjectYards * pricePerYard).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerYard}/yard
          </p>
        </div>
      </div>
    </div>
  );
};
