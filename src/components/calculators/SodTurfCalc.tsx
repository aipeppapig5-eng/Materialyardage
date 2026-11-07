import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateSod } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';

interface SodTurfCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const SodTurfCalc: React.FC<SodTurfCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);
  const [lawnLength, setLawnLength] = useState<number>(Number(initialParams.l) || 50);
  const [lawnWidth, setLawnWidth] = useState<number>(Number(initialParams.w) || 30);
  const [palletSizeSqFt, setPalletSizeSqFt] = useState<number>(Number(initialParams.yield) || 450);
  const [cuttingWaste, setCuttingWaste] = useState<number>(8);
  const [costPerPallet, setCostPerPallet] = useState<number>(250);

  const rawArea = lawnLength * lawnWidth;
  const res = useMemo(() => {
    return calculateSod(rawArea, 2, 5, palletSizeSqFt, cuttingWaste);
  }, [rawArea, palletSizeSqFt, cuttingWaste]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'sod_turf',
      lawnLength,
      lawnWidth,
      areaSqFt: rawArea,
      palletSizeSqFt,
      wholePallets: res.wholePallets,
      rollsNeeded: res.rollsNeeded,
      totalAreaWithWaste: res.totalAreaWithWaste,
      unitPrice: costPerPallet,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: '500 Sq Ft Front Lawn',
      sublabel: '2 pallets · 54 rolls',
      active: lawnLength === 25 && lawnWidth === 20,
      onClick: () => {
        setLawnLength(25);
        setLawnWidth(20);
      },
    },
    {
      label: '1,000 Sq Ft Lawn',
      sublabel: '3 pallets · 108 rolls',
      active: lawnLength === 40 && lawnWidth === 25,
      onClick: () => {
        setLawnLength(40);
        setLawnWidth(25);
      },
    },
    {
      label: "1,500 Sq Ft (50'×30')",
      sublabel: '4 pallets · 162 rolls',
      active: lawnLength === 50 && lawnWidth === 30,
      onClick: () => {
        setLawnLength(50);
        setLawnWidth(30);
      },
    },
    {
      label: '2,500 Sq Ft Back Lawn',
      sublabel: '6 pallets · 270 rolls',
      active: lawnLength === 50 && lawnWidth === 50,
      onClick: () => {
        setLawnLength(50);
        setLawnWidth(50);
      },
    },
    {
      label: '5,000 Sq Ft Large Lot',
      sublabel: '12 pallets · 540 rolls',
      active: lawnLength === 100 && lawnWidth === 50,
      onClick: () => {
        setLawnLength(100);
        setLawnWidth(50);
      },
    },
  ];

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `Sod / Turf Grass (${rawArea} sq ft lawn)`,
      category: 'construction',
      calculatorType: 'Sod & Turf Lawn Calculator',
      primaryQuantity: res.wholePallets,
      primaryUnit: 'pallets',
      secondarySummary: `${res.rollsNeeded} rolls (2'×5') · ${res.totalAreaWithWaste.toFixed(0)} sq ft total`,
      unitPrice: costPerPallet,
      notes: `Includes ${cuttingWaste}% perimeter cutting waste. Pallet yield: ${palletSizeSqFt} sq ft.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Long-Tail Lawn Sizes"
        presets={presets}
        canonicalPath="/sod-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            Lawn Dimensions & Pallet Sizes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Lawn Length (feet)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={lawnLength}
                onChange={e => setLawnLength(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Lawn Width (feet)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={lawnWidth}
                onChange={e => setLawnWidth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pallet Size (Square Feet)
              </label>
              <select
                value={palletSizeSqFt}
                onChange={e => setPalletSizeSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={450}>450 sq ft (Standard East/Midwest)</option>
                <option value={500}>500 sq ft (Standard West/South)</option>
                <option value={400}>400 sq ft (Heavy Kentucky Bluegrass)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Curved/Edge Cutting Waste (%)
              </label>
              <input
                type="number"
                min="3"
                max="20"
                step="1"
                value={cuttingWaste}
                onChange={e => setCuttingWaste(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Cost per Pallet ($)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={costPerPallet}
                  onChange={e => setCostPerPallet(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual and info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Lawn Area & Roll Layout</h3>
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-600">Net Measured Lawn:</span>
                <strong className="font-mono text-slate-900">{rawArea} sq ft</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-600">Total with {cuttingWaste}% Waste:</span>
                <strong className="font-mono text-emerald-800">{res.totalAreaWithWaste.toFixed(0)} sq ft</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-600">Single Roll Size:</span>
                <span className="font-mono text-slate-700">2' × 5' (10 sq ft)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pallets (Rounded Up):</span>
                <strong className="font-mono text-emerald-800">{res.wholePallets} pallets ({res.palletsNeeded} exact)</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Sod must be installed within 24–48 hours of delivery to prevent root drying and heating damage.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleAddEstimateToBOM}
              className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Sod to Project BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Whole Pallets to Order</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.wholePallets} pallets
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5">
            Exact: {res.palletsNeeded.toFixed(1)} pallets
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Individual Rolls (2' × 5')</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.rollsNeeded} rolls
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            10 sq ft per roll
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Area with Waste</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.totalAreaWithWaste.toFixed(0)} sq ft
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {cuttingWaste}% allowance included
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Sod Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.wholePallets * costPerPallet).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${costPerPallet}/pallet
          </p>
        </div>
      </div>
    </div>
  );
};
