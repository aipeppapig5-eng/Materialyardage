import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateGrassSeed } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface GrassSeedCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

const GRASS_SPECIES = [
  { id: 'tall_fescue', name: 'Tall Fescue / Turf-Type Fescue', newRate: 8, overseedRate: 4, sun: 'Sun / Partial Shade' },
  { id: 'kentucky_bluegrass', name: 'Kentucky Bluegrass', newRate: 3, overseedRate: 1.5, sun: 'Full Sun Cool-Season' },
  { id: 'perennial_ryegrass', name: 'Perennial Ryegrass', newRate: 8, overseedRate: 4, sun: 'Fast Germination / Cool-Season' },
  { id: 'fine_fescue', name: 'Fine Fescue Shade Blend', newRate: 5, overseedRate: 3, sun: 'Dense Shade' },
  { id: 'bermuda', name: 'Bermuda Grass (Hulled)', newRate: 2.5, overseedRate: 1.5, sun: 'Hot Southern Sun' },
  { id: 'zoysia', name: 'Zoysia Grass Seed', newRate: 2, overseedRate: 1, sun: 'Warm-Season Drought Tolerant' },
];

export const GrassSeedCalc: React.FC<GrassSeedCalcProps> = ({
  onAddToBOM,
}) => {
  const [lawnLength, setLawnLength] = useState<number>(60);
  const [lawnWidth, setLawnWidth] = useState<number>(40);
  const [seedMode, setSeedMode] = useState<'new_lawn' | 'overseed'>('new_lawn');
  const [speciesId, setSpeciesId] = useState<string>('tall_fescue');
  const [wastePercent, setWastePercent] = useState<number>(5);
  const [pricePerLb, setPricePerLb] = useState<number>(4.5);

  const areaSqFt = lawnLength * lawnWidth;
  const activeSpecies = useMemo(
    () => GRASS_SPECIES.find(g => g.id === speciesId) || GRASS_SPECIES[0],
    [speciesId]
  );

  const ratePer1000 = seedMode === 'new_lawn' ? activeSpecies.newRate : activeSpecies.overseedRate;

  const res = useMemo(
    () => calculateGrassSeed(areaSqFt, ratePer1000, wastePercent),
    [areaSqFt, ratePer1000, wastePercent]
  );

  const presets = [
    {
      label: '1,000 Sq Ft Yard Patch',
      sublabel: 'New Tall Fescue · 8.4 lbs',
      active: lawnLength === 40 && lawnWidth === 25 && seedMode === 'new_lawn',
      onClick: () => {
        setLawnLength(40);
        setLawnWidth(25);
        setSeedMode('new_lawn');
      },
    },
    {
      label: '5,000 Sq Ft Suburban Lawn',
      sublabel: 'Overseeding · 21 lbs Fescue',
      active: lawnLength === 100 && lawnWidth === 50 && seedMode === 'overseed',
      onClick: () => {
        setLawnLength(100);
        setLawnWidth(50);
        setSeedMode('overseed');
      },
    },
    {
      label: '10,000 Sq Ft Quarter Acre',
      sublabel: 'New Lawn · 84 lbs Tall Fescue',
      active: lawnLength === 100 && lawnWidth === 100 && seedMode === 'new_lawn',
      onClick: () => {
        setLawnLength(100);
        setLawnWidth(100);
        setSeedMode('new_lawn');
      },
    },
  ];

  const handleAddToBOM = () => {
    onAddToBOM({
      name: `${activeSpecies.name} Seed (${seedMode === 'new_lawn' ? 'New Lawn' : 'Overseed'})`,
      category: 'construction',
      calculatorType: 'Grass Seed Coverage Calculator',
      primaryQuantity: Number(res.totalLbs.toFixed(1)),
      primaryUnit: 'lbs',
      secondarySummary: `${areaSqFt.toLocaleString()} sq ft @ ${ratePer1000} lbs/1,000 sq ft · +${res.starterFertilizerLbs} lbs starter fertilizer`,
      unitPrice: pricePerLb,
      notes: `Recommended retail packaging: ${res.bags25lb} × 25-lb bags or ${res.bags10lb} × 10-lb bags.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Lawn Seeding Scenarios"
        presets={presets}
        canonicalPath="/grass-seed-calculator"
        currentSummary={`${areaSqFt.toLocaleString()} sq ft (${seedMode === 'new_lawn' ? 'New Lawn' : 'Overseeding'}) = ${res.totalLbs.toFixed(1)} lbs`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Lawn Size, Grass Species &amp; Seeding Rate
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSeedMode('new_lawn')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  seedMode === 'new_lawn' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                }`}
              >
                New Bare Soil Lawn
              </button>
              <button
                type="button"
                onClick={() => setSeedMode('overseed')}
                className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  seedMode === 'overseed' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600'
                }`}
              >
                Overseeding Existing Turf
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Lawn Length (ft)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={lawnLength}
                onChange={e => setLawnLength(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Lawn Width (ft)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={lawnWidth}
                onChange={e => setLawnWidth(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Seed Margin (%)</label>
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                value={wastePercent}
                onChange={e => setWastePercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Grass Seed Species</label>
              <select
                value={speciesId}
                onChange={e => setSpeciesId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                {GRASS_SPECIES.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({seedMode === 'new_lawn' ? g.newRate : g.overseedRate} lbs / 1,000 sq ft)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {activeSpecies.sun} · Active rate: {ratePer1000} lbs per 1,000 sq ft
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Price per lb ($)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={pricePerLb}
                  onChange={e => setPricePerLb(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="sod_turf"
            title="Grass Seed Bag Breakdown"
            metricsOverlay={{
              primaryValue: `${res.totalLbs.toFixed(1)} lbs`,
              primaryLabel: seedMode === 'new_lawn' ? 'New Lawn Rate' : 'Overseeding Rate',
              secondaryValue: `${areaSqFt.toLocaleString()} sq ft`,
              secondaryLabel: `${ratePer1000} lbs/1k sq ft`,
            }}
          >
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">5-lb Bags:</span>
                <strong className="font-mono text-slate-900">{res.bags5lb} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">10-lb Bags:</span>
                <strong className="font-mono text-slate-900">{res.bags10lb} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">25-lb Contractor Bags:</span>
                <strong className="font-mono text-emerald-800">{res.bags25lb} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Starter Fertilizer Needed:</span>
                <strong className="font-mono text-emerald-800">{res.starterFertilizerLbs} lbs</strong>
              </div>
            </div>
          </ProjectPhotoPreview>

          <button
            type="button"
            onClick={handleAddToBOM}
            className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Grass Seed to BOM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Seed Required</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1 tabular-nums">
            {res.totalLbs.toFixed(1)} lbs
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono tabular-nums">
            {res.totalKg.toFixed(1)} kg total
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Recommended 25-lb Bags</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.bags25lb} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Or {res.bags10lb} × 10-lb bags</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Starter Fertilizer</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.starterFertilizerLbs} lbs
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Standard 3.5 lbs / 1,000 sq ft</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Seed Cost Estimate</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${(res.totalLbs * pricePerLb).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">@ ${pricePerLb}/lb average</p>
        </div>
      </div>
    </div>
  );
};
