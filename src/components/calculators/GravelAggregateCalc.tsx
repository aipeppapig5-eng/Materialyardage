import React, { useState, useMemo } from 'react';
import { BedShape, BOMItem, MeasurementSystem } from '../../types';
import { LANDSCAPE_MATERIALS } from '../../data/materialsData';
import { calculateAreaSqFt, calculateAggregate } from '../../utils/constructionMath';
import { VisualShapePreview } from '../VisualShapePreview';
import { ShoppingCart } from 'lucide-react';

interface GravelAggregateCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const GravelAggregateCalc: React.FC<GravelAggregateCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const [shape, setShape] = useState<BedShape>('rectangle');
  const [dim1, setDim1] = useState<number>(30); // length or diameter
  const [dim2, setDim2] = useState<number>(10); // width or height
  const [depthInches, setDepthInches] = useState<number>(3);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('crushed_stone_57');
  const [compactionPercent, setCompactionPercent] = useState<number>(12);
  const [pricePerTon, setPricePerTon] = useState<number>(45);

  const aggregates = useMemo(() => {
    return LANDSCAPE_MATERIALS.filter(m => m.category === 'gravel' || m.category === 'sand' || m.category === 'stone');
  }, []);

  const activeMaterial = useMemo(() => {
    return aggregates.find(m => m.id === selectedMaterialId) || aggregates[0];
  }, [aggregates, selectedMaterialId]);

  const areaSqFt = useMemo(() => {
    return calculateAreaSqFt(shape, dim1, dim2);
  }, [shape, dim1, dim2]);

  const res = useMemo(() => {
    return calculateAggregate(areaSqFt, depthInches, activeMaterial.tonsPerCuYd, compactionPercent);
  }, [areaSqFt, depthInches, activeMaterial, compactionPercent]);

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `${activeMaterial.name} (${areaSqFt.toFixed(0)} sq ft @ ${depthInches}" depth)`,
      category: 'construction',
      calculatorType: 'Gravel & Aggregate Calculator',
      primaryQuantity: Number(res.weightTons.toFixed(2)),
      primaryUnit: 'tons',
      secondarySummary: `${res.volumeCuYd.toFixed(2)} yd³ · ${res.bags50lb} bags (50 lb) · ${res.truckLoads10Yd} truckloads`,
      unitPrice: pricePerTon,
      notes: `Compacted base layer. Bulk density ~${activeMaterial.tonsPerCuYd} tons/yd³.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Pathway or Driveway Dimensions
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'rectangle', label: 'Rectangle' },
                { id: 'circle', label: 'Circle' },
                { id: 'triangle', label: 'Triangle' },
                { id: 'direct_area', label: 'Direct Area' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id as BedShape)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Length (feet)
                  </label>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Width (feet)
                  </label>
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

            {shape === 'circle' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Diameter (feet)
                </label>
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

            {shape === 'triangle' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Base (feet)
                  </label>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Height (feet)
                  </label>
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

            {shape === 'direct_area' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Measured Area (sq ft)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={dim1}
                  onChange={e => setDim1(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Compacted Depth (inches)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={depthInches}
                onChange={e => setDepthInches(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Aggregate or Stone Type
              </label>
              <select
                value={selectedMaterialId}
                onChange={e => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-sans"
              >
                {aggregates.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (~{m.tonsPerCuYd} tons/yd³)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">{activeMaterial.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price per Ton ($)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricePerTon}
                  onChange={e => setPricePerTon(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500">Compaction settlement:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={compactionPercent}
                  onChange={e => setCompactionPercent(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 text-[11px] border border-slate-300 rounded font-mono text-center"
                />
                <span className="text-[11px] text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual & Deliveries */}
        <div className="flex flex-col gap-4">
          <VisualShapePreview
            shape={shape}
            dim1={dim1}
            dim2={dim2}
            depthInches={depthInches}
            materialName={activeMaterial.name.split(' ')[0]}
            units={system}
          />

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between flex-1">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">Delivery & Packaging</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">50 lb Bag Yield</span>
                  <strong className="text-sm font-mono text-slate-900">{res.bags50lb} bags</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">Tandem Trucks</span>
                  <strong className="text-sm font-mono text-slate-900">{res.truckLoads10Yd} loads</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                1 ton of gravel equals 2,000 lbs (40 x 50-lb bags). Tandem trucks haul up to ~10-12 tons.
              </p>
            </div>

            <button
              onClick={handleAddEstimateToBOM}
              className="w-full mt-4 py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Aggregate to Project BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Estimated Weight</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.weightTons.toFixed(2)} tons
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
            {res.weightTonnes.toFixed(2)} metric tonnes
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Bulk Volume Required</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.volumeCuYd.toFixed(2)} yd³
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {res.volumeCuM.toFixed(2)} m³ · {res.volumeCuFt.toFixed(0)} ft³
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">50 lb Bags (Retail)</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.bags50lb} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            For small DIY pickup
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Material Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.weightTons * pricePerTon).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerTon}/ton quote
          </p>
        </div>
      </div>
    </div>
  );
};
