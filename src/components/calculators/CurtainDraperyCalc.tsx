import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateCurtains, CurtainParams } from '../../utils/fabricMath';
import { ShoppingCart } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';

interface CurtainDraperyCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const CurtainDraperyCalc: React.FC<CurtainDraperyCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const units = system === 'imperial' ? 'in' : 'cm';
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  const [trackWidth, setTrackWidth] = useState<number>(Number(initialParams.rod) || 72);
  const [finishedDrop, setFinishedDrop] = useState<number>(Number(initialParams.drop) || 84);
  const [pairOfCurtains, setPairOfCurtains] = useState<boolean>(true);
  const [fullness, setFullness] = useState<number>(Number(initialParams.fullness) || 2.0);
  const [fabricWidth, setFabricWidth] = useState<number>(Number(initialParams.bolt) || 54);
  const [headerAllowance, setHeaderAllowance] = useState<number>(6);
  const [bottomHem, setBottomHem] = useState<number>(8);
  const [puddle, setPuddle] = useState<number>(0);
  const [verticalRepeat, setVerticalRepeat] = useState<number>(0);
  const [includeLining, setIncludeLining] = useState<boolean>(true);
  const [pricePerYard, setPricePerYard] = useState<number>(28);

  const params: CurtainParams = {
    trackWidthInches: trackWidth,
    finishedDropInches: finishedDrop,
    pairOfCurtains,
    fullness,
    fabricWidthInches: fabricWidth,
    headerAllowanceInches: headerAllowance,
    bottomHemInches: bottomHem,
    puddleInches: puddle,
    verticalRepeatInches: verticalRepeat,
  };

  const res = useMemo(() => calculateCurtains(params), [params]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'curtains_drapery',
      trackWidthInches: trackWidth,
      finishedDropInches: finishedDrop,
      fullness,
      pairOfCurtains,
      fabricWidthInches: fabricWidth,
      totalYards: res.totalYards,
      totalWidthsNeeded: res.totalWidthsNeeded,
      includeLining,
      unitPrice: pricePerYard,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: '63" Sill Drop (72" Rod)',
      sublabel: '2x Fullness · 8.3 yds',
      active: finishedDrop === 63 && trackWidth === 72,
      onClick: () => {
        setFinishedDrop(63);
        setTrackWidth(72);
        setFullness(2.0);
      },
    },
    {
      label: '84" Floor Drop (72" Rod)',
      sublabel: '2x Fullness · 10.9 yds',
      active: finishedDrop === 84 && trackWidth === 72,
      onClick: () => {
        setFinishedDrop(84);
        setTrackWidth(72);
        setFullness(2.0);
      },
    },
    {
      label: '96" High Ceiling (72" Rod)',
      sublabel: '2x Fullness · 12.2 yds',
      active: finishedDrop === 96 && trackWidth === 72,
      onClick: () => {
        setFinishedDrop(96);
        setTrackWidth(72);
        setFullness(2.0);
      },
    },
    {
      label: '108" Luxury Puddle (96" Rod)',
      sublabel: '2.5x Fullness · 20.3 yds',
      active: finishedDrop === 108 && trackWidth === 96 && fullness === 2.5,
      onClick: () => {
        setFinishedDrop(108);
        setTrackWidth(96);
        setFullness(2.5);
      },
    },
  ];

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `Curtain Fabric (${pairOfCurtains ? 'Pair' : 'Single'} - ${finishedDrop}" Drop × ${fullness}x Fullness)`,
      category: 'fabric',
      calculatorType: 'Curtains & Drapery Yardage',
      primaryQuantity: Number(res.totalYards.toFixed(2)),
      primaryUnit: 'yards',
      secondarySummary: `${res.totalWidthsNeeded} widths of fabric, ${res.adjustedCutLength}" cut length`,
      unitPrice: pricePerYard,
      notes: `${includeLining ? `Includes ${res.liningYards.toFixed(2)} yd lining. ` : ''}${verticalRepeat > 0 ? `Matched to ${verticalRepeat}" vertical repeat.` : 'Plain solid fabric.'}`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Long-Tail Curtain Drops & Rod Sizes"
        presets={presets}
        canonicalPath="/curtain-fabric-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Inputs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Curtain & Window Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Track / Rod Width ({units})
              </label>
              <input
                type="number"
                min="10"
                step="1"
                value={trackWidth}
                onChange={e => setTrackWidth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Finished Drop / Length ({units})
              </label>
              <input
                type="number"
                min="10"
                step="1"
                value={finishedDrop}
                onChange={e => setFinishedDrop(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Fullness & Panel configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Fullness Multiplier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '1.5x (Light)', val: 1.5 },
                  { label: '2.0x (Standard)', val: 2.0 },
                  { label: '2.5x (Luxury)', val: 2.5 },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFullness(opt.val)}
                    className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                      fullness === opt.val
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
                Panel Configuration
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPairOfCurtains(true)}
                  className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                    pairOfCurtains
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Pair (2 Panels)
                </button>
                <button
                  type="button"
                  onClick={() => setPairOfCurtains(false)}
                  className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors ${
                    !pairOfCurtains
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  Single Panel
                </button>
              </div>
            </div>
          </div>

          {/* Allowances & Repeats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Fabric Width ({units})
              </label>
              <select
                value={fabricWidth}
                onChange={e => setFabricWidth(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              >
                <option value={44}>44" Standard Cotton</option>
                <option value={54}>54" Decor / Linen</option>
                <option value={60}>60" Wide Drapery</option>
                <option value={118}>118" Extra-Wide Voile</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Header ({units})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={headerAllowance}
                onChange={e => setHeaderAllowance(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Bottom Hem ({units})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={bottomHem}
                onChange={e => setBottomHem(Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Pattern Repeat ({units})
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={verticalRepeat}
                onChange={e => setVerticalRepeat(Number(e.target.value))}
                placeholder="0 if solid"
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeLiningCheck"
                checked={includeLining}
                onChange={e => setIncludeLining(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="includeLiningCheck" className="text-xs text-slate-700 font-medium">
                Include blackout / thermal lining yardage ({res.liningYards.toFixed(2)} yd)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Price / yd:</span>
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

        {/* Right Column: Visual Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Window & Panel Diagram</h3>
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center relative overflow-hidden h-52">
              {/* Rod */}
              <div className="w-4/5 h-2 bg-slate-700 rounded-full relative mb-1 flex items-center justify-between px-1">
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full -ml-2" />
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full -mr-2" />
              </div>

              {/* Window Frame */}
              <div className="w-3/5 h-36 border-4 border-slate-300 bg-sky-50/50 relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-slate-300 absolute top-1/2" />
                <div className="h-full w-0.5 bg-slate-300 absolute left-1/2" />

                {/* Left Curtain */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-700/80 border-r border-emerald-900 shadow-sm flex flex-col justify-between"
                  style={{ width: pairOfCurtains ? '45%' : '90%' }}
                >
                  {/* Folds */}
                  <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(0,0,0,0.4)_6px,rgba(0,0,0,0.4)_12px)]" />
                </div>

                {/* Right Curtain (if pair) */}
                {pairOfCurtains && (
                  <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-emerald-700/80 border-l border-emerald-900 shadow-sm">
                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(0,0,0,0.4)_6px,rgba(0,0,0,0.4)_12px)]" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
              <p>• {res.widthsPerPanel} fabric {res.widthsPerPanel === 1 ? 'width' : 'widths'} joined per panel</p>
              <p>• Raw cut drop: <strong className="text-slate-700 font-mono">{res.adjustedCutLength}"</strong> per width</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleAddEstimateToBOM}
              className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Curtains to Project BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Fabric Required</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.totalYards.toFixed(2)} yd
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
            {res.totalMeters.toFixed(2)} meters
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Fabric Widths Required</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.totalWidthsNeeded} widths
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {res.widthsPerPanel} per panel × {res.panelsCount} panels
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Cut Length Per Width</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.adjustedCutLength}"
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Base {res.baseCutLength}" {verticalRepeat > 0 ? `+ pattern repeat` : ''}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Fabric Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.totalYards * pricePerYard).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerYard}/yard
          </p>
        </div>
      </div>
    </div>
  );
};
