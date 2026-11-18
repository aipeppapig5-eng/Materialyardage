import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateRaisedBedSoil, RaisedBedMixPreset } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';
import { VisualShapePreview } from '../VisualShapePreview';

interface RaisedBedSoilCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const RaisedBedSoilCalc: React.FC<RaisedBedSoilCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const [lengthFt, setLengthFt] = useState<number>(8);
  const [widthFt, setWidthFt] = useState<number>(4);
  const [depthInches, setDepthInches] = useState<number>(12);
  const [bedCount, setBedCount] = useState<number>(2);
  const [mixPreset, setMixPreset] = useState<RaisedBedMixPreset>('garden_50_30_20');
  const [settlementPercent, setSettlementPercent] = useState<number>(5);
  const [pricePerCuYd, setPricePerCuYd] = useState<number>(52);

  const res = useMemo(() => {
    return calculateRaisedBedSoil(
      lengthFt,
      widthFt,
      depthInches,
      bedCount,
      mixPreset,
      settlementPercent
    );
  }, [lengthFt, widthFt, depthInches, bedCount, mixPreset, settlementPercent]);

  const presets = [
    {
      label: '4×4 ft Bed (12" Tall)',
      sublabel: '16 cu ft · 0.62 yd³',
      active: lengthFt === 4 && widthFt === 4 && depthInches === 12 && bedCount === 1,
      onClick: () => {
        setLengthFt(4);
        setWidthFt(4);
        setDepthInches(12);
        setBedCount(1);
      },
    },
    {
      label: '4×8 ft Bed (12" Tall)',
      sublabel: '32 cu ft · 1.24 yd³',
      active: lengthFt === 8 && widthFt === 4 && depthInches === 12 && bedCount === 1,
      onClick: () => {
        setLengthFt(8);
        setWidthFt(4);
        setDepthInches(12);
        setBedCount(1);
      },
    },
    {
      label: '2× (4×8 ft) Deep Veggie Beds',
      sublabel: '12" depth · 2.49 yd³',
      active: lengthFt === 8 && widthFt === 4 && depthInches === 12 && bedCount === 2,
      onClick: () => {
        setLengthFt(8);
        setWidthFt(4);
        setDepthInches(12);
        setBedCount(2);
      },
    },
    {
      label: '4×8 ft Tall Bed (18" High)',
      sublabel: '48 cu ft · 1.87 yd³',
      active: lengthFt === 8 && widthFt === 4 && depthInches === 18 && bedCount === 1,
      onClick: () => {
        setLengthFt(8);
        setWidthFt(4);
        setDepthInches(18);
        setBedCount(1);
      },
    },
  ];

  const mixInfo = {
    garden_50_30_20: {
      label: 'Standard Veggie Mix (50% Topsoil / 30% Compost / 20% Aeration)',
      part1: 'Screened Topsoil (50%)',
      part2: 'Aged Compost (30%)',
      part3: 'Coarse Perlite / Pine Fines (20%)',
    },
    mels_mix: {
      label: "Mel's Square-Foot Mix (1/3 Peat-Coir / 1/3 Compost / 1/3 Vermiculite)",
      part1: 'Peat Moss or Coco Coir (33.3%)',
      part2: 'Blended Compost (33.3%)',
      part3: 'Coarse Vermiculite (33.3%)',
    },
    loam_compost_60_40: {
      label: 'Simple 60/40 Loam & Compost Blend',
      part1: 'Screened Garden Loam (60%)',
      part2: 'Organic Compost (40%)',
      part3: 'Aeration (0% - Optional)',
    },
  }[mixPreset];

  const handleAddToBOM = () => {
    onAddToBOM({
      name: `Raised Bed Soil Blend (${bedCount}× ${lengthFt}'×${widthFt}' @ ${depthInches}")`,
      category: 'construction',
      calculatorType: 'Raised Bed Soil Calculator',
      primaryQuantity: Number(res.volumeCuYd.toFixed(2)),
      primaryUnit: 'cu yards',
      secondarySummary: `${res.volumeCuFt.toFixed(1)} ft³ · ${res.bags2CuFt} bags (2 cu ft)`,
      unitPrice: pricePerCuYd,
      notes: `${mixInfo.label}. Settlement allowance: ${settlementPercent}%.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Standard Raised Bed Sizes"
        presets={presets}
        canonicalPath="/raised-bed-soil-calculator"
        currentSummary={`${bedCount}× (${lengthFt}' × ${widthFt}' × ${depthInches}") = ${res.volumeCuYd.toFixed(2)} yd³`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Raised Bed Dimensions &amp; Mix Ratio
            </h2>
            <span className="text-xs text-slate-500">
              Total Planting Area: <strong className="font-mono text-slate-800">{res.totalSqFt.toFixed(0)} sq ft</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bed Length (ft)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={lengthFt}
                onChange={e => setLengthFt(Math.max(0.5, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bed Width (ft)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={widthFt}
                onChange={e => setWidthFt(Math.max(0.5, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Soil Depth (in)
              </label>
              <input
                type="number"
                min="4"
                max="36"
                step="1"
                value={depthInches}
                onChange={e => setDepthInches(Math.max(2, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Number of Beds
              </label>
              <input
                type="number"
                min="1"
                max="50"
                step="1"
                value={bedCount}
                onChange={e => setBedCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Recommended Soil Mix Formula
              </label>
              <select
                value={mixPreset}
                onChange={e => setMixPreset(e.target.value as RaisedBedMixPreset)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="garden_50_30_20">Standard Raised Bed Mix (50% Topsoil / 30% Compost / 20% Aeration)</option>
                <option value="mels_mix">Mel's Square-Foot Garden Mix (1/3 Peat or Coir / 1/3 Compost / 1/3 Vermiculite)</option>
                <option value="loam_compost_60_40">Classic Vegetable Blend (60% Screened Loam / 40% Compost)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bulk Price / yd³ ($)
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
                <span className="text-[11px] text-slate-500">Settling buffer:</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={settlementPercent}
                  onChange={e => setSettlementPercent(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 text-[11px] border border-slate-300 rounded font-mono text-center"
                />
                <span className="text-[11px] text-slate-500">%</span>
              </div>
            </div>
          </div>

          {/* Ingredient Mix Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800">
              Ingredient Volume Breakdown ({res.volumeCuFt.toFixed(1)} cu ft total)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{mixInfo.part1}</span>
                <strong className="text-base font-mono text-slate-900 tabular-nums">
                  {res.topsoilCuFt.toFixed(1)} cu ft
                </strong>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {(res.topsoilCuFt / 27).toFixed(2)} yd³
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{mixInfo.part2}</span>
                <strong className="text-base font-mono text-slate-900 tabular-nums">
                  {res.compostCuFt.toFixed(1)} cu ft
                </strong>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {(res.compostCuFt / 27).toFixed(2)} yd³
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{mixInfo.part3}</span>
                <strong className="text-base font-mono text-slate-900 tabular-nums">
                  {res.aerationCuFt.toFixed(1)} cu ft
                </strong>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {(res.aerationCuFt / 27).toFixed(2)} yd³
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual & BOM */}
        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="mulch_soil"
            title="Raised Planter Geometry"
            metricsOverlay={{
              primaryValue: `${res.volumeCuYd.toFixed(2)} yd³`,
              primaryLabel: `${bedCount} Bed${bedCount > 1 ? 's' : ''} Total`,
              secondaryValue: `${res.bags2CuFt} bags`,
              secondaryLabel: '2 cu ft Bags',
            }}
          >
            <VisualShapePreview
              shape="rectangle"
              dim1={lengthFt}
              dim2={widthFt}
              depthInches={depthInches}
              materialName="Raised Bed Mix"
              units={system}
            />
          </ProjectPhotoPreview>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between flex-1 space-y-3">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">Retail Bag vs. Bulk Comparison</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-slate-500 block">1.5 cu ft bags</span>
                  <strong className="text-sm font-mono text-slate-900 tabular-nums">{res.bags1_5CuFt} bags</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="text-slate-500 block">2.0 cu ft bags</span>
                  <strong className="text-sm font-mono text-slate-900 tabular-nums">{res.bags2CuFt} bags</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Ordering bulk garden mix saves ~35% once volume exceeds 1.5 cubic yards ({res.bags2CuFt} retail bags).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToBOM}
              className="w-full py-2 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Raised Bed Soil to BOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Soil Volume</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1 tabular-nums">
            {res.volumeCuYd.toFixed(2)} yd³
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono tabular-nums">
            {res.volumeCuFt.toFixed(1)} ft³ · {res.volumeCuM.toFixed(2)} m³
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">2 cu ft Garden Bags</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.bags2CuFt} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Or {res.bags1_5CuFt} × 1.5 cu ft bags</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Weight</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.estimatedWeightTons.toFixed(2)} tons
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">~1,700 lbs per cubic yard blend</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Bulk Cost Estimate</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${(res.volumeCuYd * pricePerCuYd).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">@ ${pricePerCuYd}/yd³ quote</p>
        </div>
      </div>
    </div>
  );
};
