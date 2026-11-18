import React, { useState, useMemo } from 'react';
import { BedShape, BOMItem, MeasurementSystem } from '../../types';
import { calculateAreaSqFt, calculatePineStraw, PineStrawBaleType } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';
import { VisualShapePreview } from '../VisualShapePreview';

interface PineStrawCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const PineStrawCalc: React.FC<PineStrawCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const [shape, setShape] = useState<BedShape>('rectangle');
  const [dim1, setDim1] = useState<number>(30);
  const [dim2, setDim2] = useState<number>(12);
  const [depthInches, setDepthInches] = useState<number>(3);
  const [baleType, setBaleType] = useState<PineStrawBaleType>('standard_square');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerBale, setPricePerBale] = useState<number>(7.5);

  const areaSqFt = useMemo(() => calculateAreaSqFt(shape, dim1, dim2), [shape, dim1, dim2]);
  const res = useMemo(
    () => calculatePineStraw(areaSqFt, depthInches, baleType, wastePercent),
    [areaSqFt, depthInches, baleType, wastePercent]
  );

  const presets = [
    {
      label: '360 Sq Ft Front Bed',
      sublabel: '3" depth · ~11 standard bales',
      active: shape === 'rectangle' && dim1 === 30 && dim2 === 12 && baleType === 'standard_square',
      onClick: () => {
        setShape('rectangle');
        setDim1(30);
        setDim2(12);
        setDepthInches(3);
      },
    },
    {
      label: '1,000 Sq Ft Natural Area',
      sublabel: '3" depth · ~29 standard bales',
      active: shape === 'direct_area' && dim1 === 1000 && depthInches === 3,
      onClick: () => {
        setShape('direct_area');
        setDim1(1000);
        setDepthInches(3);
      },
    },
    {
      label: '16 Ft Tree Ring Surround',
      sublabel: 'Outer Ø 16\', Inner Ø 4\'',
      active: shape === 'ring' && dim1 === 16 && dim2 === 4,
      onClick: () => {
        setShape('ring');
        setDim1(16);
        setDim2(4);
        setDepthInches(3);
      },
    },
  ];

  const handleAddToBOM = () => {
    onAddToBOM({
      name: `Pine Straw (${baleType === 'longleaf_jumbo' ? 'Longleaf Jumbo' : 'Standard Square'} Bales)`,
      category: 'construction',
      calculatorType: 'Pine Straw Bale Calculator',
      primaryQuantity: res.totalBales,
      primaryUnit: 'bales',
      secondarySummary: `${areaSqFt.toFixed(0)} sq ft @ ${depthInches}" depth · ~${res.totalWeightLbs} lbs`,
      unitPrice: pricePerBale,
      notes: `Coverage: ~${res.coveragePerBaleSqFt.toFixed(0)} sq ft/bale + ${wastePercent}% margin.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Pine Needle Bed Presets"
        presets={presets}
        canonicalPath="/pine-straw-calculator"
        currentSummary={`${areaSqFt.toFixed(0)} sq ft = ${res.totalBales} Bales`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Bed Dimensions &amp; Pine Straw Bale Type
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'rectangle', label: 'Rectangle' },
                { id: 'ring', label: 'Tree Ring' },
                { id: 'circle', label: 'Circle' },
                { id: 'direct_area', label: 'Direct Sq Ft' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id as BedShape)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    shape === s.id
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shape === 'rectangle' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={dim1}
                    onChange={e => setDim1(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={dim2}
                    onChange={e => setDim2(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </>
            )}

            {shape === 'ring' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Outer Diameter (ft)</label>
                  <input
                    type="number"
                    min="2"
                    step="0.5"
                    value={dim1}
                    onChange={e => setDim1(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tree Trunk Dia. (ft)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={dim2}
                    onChange={e => setDim2(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </>
            )}

            {shape === 'circle' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Circle Diameter (ft)</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={dim1}
                  onChange={e => setDim1(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            )}

            {shape === 'direct_area' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Bed Area (sq ft)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={dim1}
                  onChange={e => setDim1(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Depth</label>
              <select
                value={depthInches}
                onChange={e => setDepthInches(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              >
                <option value={2}>2" Light Top Refresh</option>
                <option value={3}>3" Standard New Bed</option>
                <option value={4}>4" Heavy Slope / Erosion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Bale Format</label>
              <select
                value={baleType}
                onChange={e => setBaleType(e.target.value as PineStrawBaleType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="standard_square">Standard Square Bale (~35–40 sq ft @ 3" depth)</option>
                <option value="longleaf_jumbo">Longleaf Jumbo Bale / Roll (~65 sq ft @ 3" depth)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Price per Bale ($)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={pricePerBale}
                  onChange={e => setPricePerBale(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500">Edge tuck/waste:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={wastePercent}
                  onChange={e => setWastePercent(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 text-[11px] border border-slate-300 rounded font-mono text-center"
                />
                <span className="text-[11px] text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="mulch_soil"
            title="Pine Straw Coverage Preview"
            metricsOverlay={{
              primaryValue: `${res.totalBales} Bales`,
              primaryLabel: baleType === 'longleaf_jumbo' ? 'Jumbo Longleaf' : 'Standard Square',
              secondaryValue: `${areaSqFt.toFixed(0)} sq ft`,
              secondaryLabel: `@ ${depthInches}" depth`,
            }}
          >
            <VisualShapePreview
              shape={shape}
              dim1={dim1}
              dim2={dim2}
              depthInches={depthInches}
              materialName="Pine Straw"
              units={system}
            />
          </ProjectPhotoPreview>

          <button
            type="button"
            onClick={handleAddToBOM}
            className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Pine Straw Bales to BOM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Bales Required</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1 tabular-nums">
            {res.totalBales} bales
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5">
            Includes {wastePercent}% border tuck margin
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Coverage Per Bale</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.coveragePerBaleSqFt.toFixed(0)} sq ft
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">At {depthInches}" settled thickness</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Total Weight</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.totalWeightLbs} lbs
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Dry clean needle load</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Bale Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${(res.totalBales * pricePerBale).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">@ ${pricePerBale}/bale</p>
        </div>
      </div>
    </div>
  );
};
