import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateConcrete, ConcreteParams, ConcreteType } from '../../utils/constructionMath';
import { ShoppingCart, Printer } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface ConcreteCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const ConcreteCalc: React.FC<ConcreteCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);
  const [concreteType, setConcreteType] = useState<ConcreteType>(
    initialParams.type === 'column' || initialParams.type === 'steps' ? initialParams.type : 'slab'
  );

  // Slab
  const [slabLength, setSlabLength] = useState<number>(Number(initialParams.l) || 20);
  const [slabWidth, setSlabWidth] = useState<number>(Number(initialParams.w) || 10);
  const [slabThickness, setSlabThickness] = useState<number>(Number(initialParams.t) || 4);

  // Column / Pier
  const [colDiameter, setColDiameter] = useState<number>(Number(initialParams.dia) || 12);
  const [colDepth, setColDepth] = useState<number>(Number(initialParams.depth) || 48);
  const [colCount, setColCount] = useState<number>(Number(initialParams.count) || 6);

  // Steps
  const [stepCount, setStepCount] = useState<number>(3);
  const [stepWidth, setStepWidth] = useState<number>(4);
  const [treadInches, setTreadInches] = useState<number>(12);
  const [riserInches, setRiserInches] = useState<number>(7);

  // Allowance & Cost
  const [spillageWaste, setSpillageWaste] = useState<number>(10);
  const [pricePerCuYd, setPricePerCuYd] = useState<number>(145);

  const params: ConcreteParams = {
    type: concreteType,
    lengthFt: slabLength,
    widthFt: slabWidth,
    thicknessInches: slabThickness,
    diameterInches: colDiameter,
    depthInches: colDepth,
    columnCount: colCount,
    stepCount,
    stepWidthFt: stepWidth,
    treadInches,
    riserInches,
    spillageWastePercent: spillageWaste,
  };

  const res = useMemo(() => calculateConcrete(params), [params]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'concrete_calc',
      concreteType,
      slabLength,
      slabWidth,
      slabThickness,
      colDiameter,
      colDepth,
      colCount,
      stepCount,
      stepWidth,
      volumeCuYd: res.volumeCuYd,
      bags80lb: res.bags80lb,
      bags60lb: res.bags60lb,
      weightTons: Number((res.volumeCuYd * 2.025).toFixed(2)),
      spillageWaste,
      unitPrice: pricePerCuYd,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: "10' × 10' Patio",
      sublabel: '4" thick · 1.2 yd³',
      active: concreteType === 'slab' && slabLength === 10 && slabWidth === 10 && slabThickness === 4,
      onClick: () => {
        setConcreteType('slab');
        setSlabLength(10);
        setSlabWidth(10);
        setSlabThickness(4);
      },
    },
    {
      label: "12' × 12' Shed Slab",
      sublabel: '4" thick · 1.8 yd³',
      active: concreteType === 'slab' && slabLength === 12 && slabWidth === 12 && slabThickness === 4,
      onClick: () => {
        setConcreteType('slab');
        setSlabLength(12);
        setSlabWidth(12);
        setSlabThickness(4);
      },
    },
    {
      label: "20' × 20' Driveway",
      sublabel: '4" thick · 4.9 yd³',
      active: concreteType === 'slab' && slabLength === 20 && slabWidth === 20 && slabThickness === 4,
      onClick: () => {
        setConcreteType('slab');
        setSlabLength(20);
        setSlabWidth(20);
        setSlabThickness(4);
      },
    },
    {
      label: "24' × 24' 2-Car Garage",
      sublabel: '5" thick · 8.9 yd³',
      active: concreteType === 'slab' && slabLength === 24 && slabWidth === 24 && slabThickness === 5,
      onClick: () => {
        setConcreteType('slab');
        setSlabLength(24);
        setSlabWidth(24);
        setSlabThickness(5);
      },
    },
    {
      label: '4x Sonotubes (12" Ø)',
      sublabel: '48" depth',
      active: concreteType === 'column' && colCount === 4 && colDiameter === 12 && colDepth === 48,
      onClick: () => {
        setConcreteType('column');
        setColCount(4);
        setColDiameter(12);
        setColDepth(48);
      },
    },
  ];

  const handleAddEstimateToBOM = () => {
    let desc = '';
    if (concreteType === 'slab') desc = `Slab ${slabLength}'×${slabWidth}'×${slabThickness}"`;
    else if (concreteType === 'column') desc = `${colCount}x Sonotube Columns (${colDiameter}" Ø × ${colDepth}" depth)`;
    else desc = `${stepCount} Concrete Steps (${stepWidth}' wide)`;

    onAddToBOM({
      name: `Concrete (${desc})`,
      category: 'construction',
      calculatorType: 'Concrete Calculator',
      primaryQuantity: Number(res.volumeCuYd.toFixed(2)),
      primaryUnit: 'cu yards',
      secondarySummary: `${res.bags80lb} bags (80 lb) or ${res.bags60lb} bags (60 lb) · ${res.volumeCuM.toFixed(2)} m³`,
      unitPrice: pricePerCuYd,
      notes: `Includes ${spillageWaste}% ordering allowance. 1:2:4 Mix: ${res.portlandBags94lb} bags Portland, ${res.sandCuFt} cu ft sand, ${res.gravelCuFt} cu ft stone.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Long-Tail Concrete Projects"
        presets={presets}
        canonicalPath="/concrete-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Concrete Pour Structure
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'slab', label: 'Flat Slab / Patio' },
                { id: 'column', label: 'Column / Pier' },
                { id: 'steps', label: 'Stairs & Steps' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConcreteType(t.id as ConcreteType)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    concreteType === t.id
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slab Form */}
          {concreteType === 'slab' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Slab Length (feet)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={slabLength}
                  onChange={e => setSlabLength(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Slab Width (feet)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={slabWidth}
                  onChange={e => setSlabWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Thickness (inches)
                </label>
                <select
                  value={slabThickness}
                  onChange={e => setSlabThickness(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value={3.5}>3.5" (2x4 form / Sidewalk)</option>
                  <option value={4}>4.0" (Standard Patio/Pad)</option>
                  <option value={5}>5.0" (Heavy Vehicle Driveway)</option>
                  <option value={6}>6.0" (Commercial / RV Pad)</option>
                </select>
              </div>
            </div>
          )}

          {/* Column Form */}
          {concreteType === 'column' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sonotube Diameter (inches)
                </label>
                <select
                  value={colDiameter}
                  onChange={e => setColDiameter(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value={8}>8" Sonotube</option>
                  <option value={10}>10" Sonotube</option>
                  <option value={12}>12" Sonotube (Standard Pier)</option>
                  <option value={16}>16" Commercial Footing</option>
                  <option value={18}>18" Heavy Footing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hole Depth (inches)
                </label>
                <input
                  type="number"
                  min="12"
                  step="2"
                  value={colDepth}
                  onChange={e => setColDepth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
                <span className="text-[10px] text-slate-500 font-mono">
                  {(colDepth / 12).toFixed(1)} feet deep
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Number of Piers / Columns
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={colCount}
                  onChange={e => setColCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          )}

          {/* Steps Form */}
          {concreteType === 'steps' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Step Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stepCount}
                  onChange={e => setStepCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Stair Width (feet)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={stepWidth}
                  onChange={e => setStepWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tread / Run (inches)
                </label>
                <input
                  type="number"
                  min="6"
                  step="0.5"
                  value={treadInches}
                  onChange={e => setTreadInches(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Riser Height (inches)
                </label>
                <input
                  type="number"
                  min="4"
                  step="0.5"
                  value={riserInches}
                  onChange={e => setRiserInches(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Spillage & Form Waste Allowance (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="1"
                value={spillageWaste}
                onChange={e => setSpillageWaste(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Standard practice is 10% extra for sub-base grade dips, form deflection, and spillage.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ready-Mix Delivery Price ($/yd³)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={pricePerCuYd}
                  onChange={e => setPricePerCuYd(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <ProjectPhotoPreview
              calculatorId="concrete_calc"
              title="Concrete Pour Diagram"
              metricsOverlay={{
                primaryValue: `${res.volumeCuYd.toFixed(2)} yd³`,
                primaryLabel: 'Calculated Volume',
                secondaryValue: `${res.bags80lb} bags`,
                secondaryLabel: '80lb Ready-Mix',
              }}
            >
              <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center relative h-52">
                {concreteType === 'slab' && (
                  <div className="relative w-44 h-28 border-2 border-slate-600 bg-slate-200/90 rounded flex flex-col items-center justify-center shadow-inner">
                    <div className="w-full h-2 bg-slate-400 absolute top-0 border-b border-slate-500" />
                    <span className="text-xs font-bold text-slate-800">Concrete Slab</span>
                    <span className="text-[10px] font-mono text-slate-600">
                      {slabLength}' × {slabWidth}' ({slabThickness}" thick)
                    </span>
                    <div className="absolute -bottom-5 text-[10px] font-mono text-slate-600">
                      Area: {slabLength * slabWidth} sq ft
                    </div>
                  </div>
                )}

                {concreteType === 'column' && (
                  <div className="flex items-center gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-9 h-3 rounded-full border border-slate-700 bg-slate-300" />
                        <div className="w-9 h-28 border-x border-b border-slate-700 bg-slate-200 rounded-b-sm flex items-center justify-center">
                          <span className="text-[8px] font-mono text-slate-600 rotate-90">{colDepth}"</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-500">
                      + {colCount - 3 > 0 ? `${colCount - 3} more` : ''}
                    </div>
                  </div>
                )}

                {concreteType === 'steps' && (
                  <div className="flex flex-col items-end">
                    {Array.from({ length: Math.min(4, stepCount) }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-slate-600 bg-slate-300 h-6 flex items-center justify-center text-[9px] font-mono text-slate-700"
                        style={{ width: `${(i + 1) * 36}px` }}
                      >
                        Step {stepCount - i}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ProjectPhotoPreview>

            <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
              <p>• Volume: <strong className="text-slate-800 font-mono">{res.volumeCuYd.toFixed(2)} yd³</strong> ({res.volumeCuM.toFixed(2)} m³)</p>
              <p>• Ready-Mix trucks carry ~9 to 10 yards.</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={handleAddEstimateToBOM}
              className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Concrete to Project BOM</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-job-sheet-modal'));
                }
              }}
              className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Job-Site Spec Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Ready-Mix Volume</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {res.volumeCuYd.toFixed(2)} yd³
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
            {res.volumeCuM.toFixed(2)} m³ · {res.volumeCuFt.toFixed(1)} ft³
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">80 lb Pre-Mix Bags</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {res.bags80lb} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Or {res.bags60lb} bags of 60 lb
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">1:2:4 On-Site Mix</p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {res.portlandBags94lb} bags cement
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            +{res.sandCuFt} ft³ sand, {res.gravelCuFt} ft³ stone
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Ready-Mix Truck Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            ${(res.volumeCuYd * pricePerCuYd).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            @ ${pricePerCuYd}/yd³ delivered
          </p>
        </div>
      </div>
    </div>
  );
};
