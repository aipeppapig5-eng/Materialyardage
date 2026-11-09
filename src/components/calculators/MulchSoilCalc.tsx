import React, { useState, useMemo } from 'react';
import { BedShape, BOMItem, MeasurementSystem } from '../../types';
import { LANDSCAPE_MATERIALS } from '../../data/materialsData';
import { calculateAreaSqFt, calculateMulch, generateCoverageMatrix } from '../../utils/constructionMath';
import { VisualShapePreview } from '../VisualShapePreview';
import { ShoppingCart, Scale } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface MulchSoilCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const MulchSoilCalc: React.FC<MulchSoilCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);
  const [shape, setShape] = useState<BedShape>(
    (initialParams.shape as BedShape) || 'rectangle'
  );
  const [dim1, setDim1] = useState<number>(Number(initialParams.l || initialParams.dim1) || 20); // Length, Diameter, or Base
  const [dim2, setDim2] = useState<number>(Number(initialParams.w || initialParams.dim2) || 15); // Width, Inner Diameter, or Height
  const [depthInches, setDepthInches] = useState<number>(Number(initialParams.depth) || 3);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    initialParams.mat || 'bark_shredded'
  );
  const [compactionPercent, setCompactionPercent] = useState<number>(5);
  const [pricePerCuYd, setPricePerCuYd] = useState<number>(38);

  const materials = useMemo(() => {
    return LANDSCAPE_MATERIALS.filter(m => m.category === 'mulch' || m.category === 'soil');
  }, []);

  const activeMaterial = useMemo(() => {
    return materials.find(m => m.id === selectedMaterialId) || materials[0];
  }, [materials, selectedMaterialId]);

  const areaSqFt = useMemo(() => {
    return calculateAreaSqFt(shape, dim1, dim2);
  }, [shape, dim1, dim2]);

  const res = useMemo(() => {
    return calculateMulch(areaSqFt, depthInches, activeMaterial.tonsPerCuYd, compactionPercent);
  }, [areaSqFt, depthInches, activeMaterial, compactionPercent]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'mulch_soil',
      materialName: activeMaterial.name,
      shape,
      dim1,
      dim2,
      areaSqFt,
      depthInches,
      volumeCuYd: res.volumeCuYd,
      bags2CuFt: res.bags2CuFt,
      weightTons: res.weightTons,
      unitPrice: pricePerCuYd,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: '100 Sq Ft Flowerbed',
      sublabel: '3" depth · 0.9 yd³',
      active: shape === 'rectangle' && dim1 === 10 && dim2 === 10 && depthInches === 3,
      onClick: () => {
        setShape('rectangle');
        setDim1(10);
        setDim2(10);
        setDepthInches(3);
      },
    },
    {
      label: '250 Sq Ft Island Bed',
      sublabel: '3" depth · 2.3 yd³',
      active: shape === 'rectangle' && dim1 === 25 && dim2 === 10 && depthInches === 3,
      onClick: () => {
        setShape('rectangle');
        setDim1(25);
        setDim2(10);
        setDepthInches(3);
      },
    },
    {
      label: '500 Sq Ft Yard Border',
      sublabel: '3" depth · 4.6 yd³',
      active: shape === 'rectangle' && dim1 === 50 && dim2 === 10 && depthInches === 3,
      onClick: () => {
        setShape('rectangle');
        setDim1(50);
        setDim2(10);
        setDepthInches(3);
      },
    },
    {
      label: '1,000 Sq Ft Landscape',
      sublabel: '2" depth · 6.2 yd³',
      active: shape === 'rectangle' && dim1 === 50 && dim2 === 20 && depthInches === 2,
      onClick: () => {
        setShape('rectangle');
        setDim1(50);
        setDim2(20);
        setDepthInches(2);
      },
    },
    {
      label: '14 Ft Tree Ring Bed',
      sublabel: 'Outer Ø 14\', Inner Ø 4\'',
      active: shape === 'ring' && dim1 === 14 && dim2 === 4,
      onClick: () => {
        setShape('ring');
        setDim1(14);
        setDim2(4);
        setDepthInches(3);
      },
    },
  ];

  const coverageMatrix = useMemo(() => {
    return generateCoverageMatrix(areaSqFt, activeMaterial.tonsPerCuYd);
  }, [areaSqFt, activeMaterial]);

  const handleAddEstimateToBOM = () => {
    onAddToBOM({
      name: `${activeMaterial.name} (${areaSqFt.toFixed(0)} sq ft @ ${depthInches}" depth)`,
      category: 'construction',
      calculatorType: 'Mulch & Soil Calculator',
      primaryQuantity: Number(res.volumeCuYd.toFixed(2)),
      primaryUnit: 'cu yards',
      secondarySummary: `${res.bags2CuFt} bags (2 cu ft) · ${res.weightTons.toFixed(2)} tons · ${res.volumeCuM.toFixed(2)} m³`,
      unitPrice: pricePerCuYd,
      notes: `Shape: ${shape}. Area: ${areaSqFt.toFixed(1)} sq ft. Compaction factor: ${compactionPercent}%.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Long-Tail Mulch & Soil Projects"
        presets={presets}
        canonicalPath="/mulch-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Controls */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Bed Geometry & Dimensions
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'rectangle', label: 'Rectangle' },
                { id: 'circle', label: 'Circle' },
                { id: 'ring', label: 'Ring / Donut' },
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

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {shape === 'rectangle' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Bed Length (feet)
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
                    Bed Width (feet)
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
                  Bed Diameter (feet)
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

            {shape === 'ring' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Outer Diameter (feet)
                  </label>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Inner Diameter (Tree/Pit feet)
                  </label>
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

            {shape === 'triangle' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Base Length (feet)
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
                    Height / Altitude (feet)
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
                  Total Measured Area (sq ft)
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
                Target Depth (inches)
              </label>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={depthInches}
                onChange={e => setDepthInches(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Quick Depth Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Standard Depths:</span>
            {[
              { d: 2, label: '2" (Top Dressing)' },
              { d: 3, label: '3" (Standard Beds)' },
              { d: 4, label: '4" (Weed Suppression)' },
              { d: 6, label: '6" (Playground/Fill)' },
            ].map(dp => (
              <button
                key={dp.d}
                type="button"
                onClick={() => setDepthInches(dp.d)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  depthInches === dp.d
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>

          {/* Material & Pricing Select */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mulch or Soil Type (with typical bulk density)
              </label>
              <select
                value={selectedMaterialId}
                onChange={e => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-sans"
              >
                {materials.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (~{m.tonsPerCuYd} tons/yd³)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">{activeMaterial.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price per Cubic Yard ($)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pricePerCuYd}
                  onChange={e => setPricePerCuYd(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500">Compaction factor:</span>
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

        {/* Right Column: Visual Preview & BOM trigger */}
        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="mulch_soil"
            title="Bed Shape & Field Photo"
            metricsOverlay={{
              primaryValue: `${res.volumeCuYd.toFixed(2)} yd³`,
              primaryLabel: 'Required Volume',
              secondaryValue: `${res.bags2CuFt} bags`,
              secondaryLabel: '2 cu ft Bags',
            }}
          >
            <VisualShapePreview
              shape={shape}
              dim1={dim1}
              dim2={dim2}
              depthInches={depthInches}
              materialName={activeMaterial.name.split(' ')[0]}
              units={system}
            />
          </ProjectPhotoPreview>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between flex-1">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">Retail Bag Breakdown</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">2 cu ft bags</span>
                  <strong className="text-sm font-mono text-slate-900">{res.bags2CuFt} bags</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">3 cu ft bags</span>
                  <strong className="text-sm font-mono text-slate-900">{res.bags3CuFt} bags</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Rule of thumb: 1 cubic yard = 13.5 bags (2 cu ft) or 9 bags (3 cu ft).
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-material-comparison', {
                      detail: {
                        item: {
                          id: 'temp_mulch_compare',
                          name: `${activeMaterial.name} (${areaSqFt.toFixed(0)} sq ft @ ${depthInches}" depth)`,
                          category: 'construction',
                          calculatorType: 'Mulch & Soil Calculator',
                          primaryQuantity: Number(res.volumeCuYd.toFixed(2)),
                          primaryUnit: 'cu yards',
                          secondarySummary: `${res.bags2CuFt} bags (2 cu ft) · ${res.weightTons.toFixed(2)} tons`,
                          unitPrice: pricePerCuYd,
                          timestamp: Date.now(),
                        },
                      },
                    })
                  );
                }}
                className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                title="Compare Pine Bark vs Cedar vs Topsoil costs & volume adjustments"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Compare Materials (Pine vs Cedar vs Topsoil)</span>
              </button>

              <button
                onClick={handleAddEstimateToBOM}
                className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add Mulch to Project BOM</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Outputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Volume Required</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.volumeCuYd.toFixed(2)} yd³
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
            {res.volumeCuM.toFixed(2)} m³ · {res.volumeCuFt.toFixed(0)} ft³
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Standard Bags Needed</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.bags2CuFt} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Based on standard 2 cu ft retail bags
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Weight</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.weightTons.toFixed(2)} tons
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {res.weightTonnes.toFixed(2)} metric tonnes
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Bulk Material Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.volumeCuYd * pricePerCuYd).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerCuYd}/yd³ bulk quote
          </p>
        </div>
      </div>

      {/* Coverage Depth Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-semibold text-slate-900 mb-1">
          Coverage Depth Comparison Matrix for {areaSqFt.toFixed(0)} sq ft
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Compare how much material and how many bags you need if you change depth:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-y border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Depth</th>
                <th className="py-2.5 px-3">Cubic Yards</th>
                <th className="py-2.5 px-3">2 cu ft Bags</th>
                <th className="py-2.5 px-3">3 cu ft Bags</th>
                <th className="py-2.5 px-3">Est. Weight</th>
                <th className="py-2.5 px-3">Best Recommended Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coverageMatrix.map(row => (
                <tr
                  key={row.depth}
                  className={row.depth === depthInches ? 'bg-emerald-50/70 font-semibold text-emerald-950' : 'hover:bg-slate-50'}
                >
                  <td className="py-2 px-3 font-mono">{row.depth}"</td>
                  <td className="py-2 px-3 font-mono">{row.cuYd.toFixed(2)} yd³</td>
                  <td className="py-2 px-3 font-mono">{row.bags2CuFt} bags</td>
                  <td className="py-2 px-3 font-mono">{row.bags3CuFt} bags</td>
                  <td className="py-2 px-3 font-mono">{row.weightTons.toFixed(2)} tons</td>
                  <td className="py-2 px-3 text-slate-600 font-normal">
                    {row.depth === 1.5 && 'Light annual color refresh over existing mulch'}
                    {row.depth === 2 && 'Top dressing around annuals and shallow-root perennials'}
                    {row.depth === 3 && 'Optimal weed suppression and moisture conservation for trees & shrubs'}
                    {row.depth === 4 && 'Woodland pathways, heavy weed mitigation'}
                    {row.depth === 5 && 'Deep playground shock absorption or new construction grade'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
