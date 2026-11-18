import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculatePottingSoil, PlanterShape } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface PottingSoilCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const PottingSoilCalc: React.FC<PottingSoilCalcProps> = ({
  onAddToBOM,
}) => {
  const [shape, setShape] = useState<PlanterShape>('tapered_pot');
  const [dim1, setDim1] = useState<number>(14); // top diameter or length (in)
  const [dim2, setDim2] = useState<number>(10); // bottom diameter or width (in)
  const [heightIn, setHeightIn] = useState<number>(12);
  const [potCount, setPotCount] = useState<number>(4);
  const [pricePer32QtBag, setPricePer32QtBag] = useState<number>(16);

  const res = useMemo(() => {
    return calculatePottingSoil(shape, dim1, dim2, heightIn, potCount, 0.92);
  }, [shape, dim1, dim2, heightIn, potCount]);

  const presets = [
    {
      label: '12" Standard Flower Pot',
      sublabel: '~13 dry quarts / pot',
      active: shape === 'tapered_pot' && dim1 === 12 && dim2 === 9 && heightIn === 11,
      onClick: () => {
        setShape('tapered_pot');
        setDim1(12);
        setDim2(9);
        setHeightIn(11);
      },
    },
    {
      label: '5-Gallon Fabric Grow Bag',
      sublabel: '12" Ø × 10" H (~15.5 qts)',
      active: shape === 'cylinder_growbag' && dim1 === 12 && heightIn === 10,
      onClick: () => {
        setShape('cylinder_growbag');
        setDim1(12);
        setDim2(12);
        setHeightIn(10);
      },
    },
    {
      label: '10-Gallon Tomato Grow Bag',
      sublabel: '16" Ø × 12" H (~33 qts)',
      active: shape === 'cylinder_growbag' && dim1 === 16 && heightIn === 12,
      onClick: () => {
        setShape('cylinder_growbag');
        setDim1(16);
        setDim2(16);
        setHeightIn(12);
      },
    },
    {
      label: '36" Deck Window Box',
      sublabel: '36"×8"×8" (~31.5 qts)',
      active: shape === 'window_box' && dim1 === 36 && dim2 === 8 && heightIn === 8,
      onClick: () => {
        setShape('window_box');
        setDim1(36);
        setDim2(8);
        setHeightIn(8);
      },
    },
  ];

  const handleAddToBOM = () => {
    onAddToBOM({
      name: `Potting Mix (${potCount}× ${shape.replace('_', ' ')} planters)`,
      category: 'construction',
      calculatorType: 'Potting Mix & Planter Calculator',
      primaryQuantity: res.bags32Qt,
      primaryUnit: 'bags (32-qt)',
      secondarySummary: `${res.dryQuarts.toFixed(1)} dry quarts · ${res.gallons.toFixed(1)} gal · ${res.totalCuFt.toFixed(2)} cu ft`,
      unitPrice: pricePer32QtBag,
      notes: `Includes ~8% top watering rim headroom.`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Common Container & Grow Bag Presets"
        presets={presets}
        canonicalPath="/potting-soil-calculator"
        currentSummary={`${potCount}× Containers = ${res.dryQuarts.toFixed(1)} Dry Quarts (${res.totalCuFt.toFixed(2)} cu ft)`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h2 className="text-base font-semibold text-slate-900">
              Planter Shape &amp; Container Dimensions
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'tapered_pot', label: 'Round Tapered Pot' },
                { id: 'cylinder_growbag', label: 'Grow Bag / Cylinder' },
                { id: 'window_box', label: 'Window Box / Trough' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id as PlanterShape)}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {shape === 'window_box' ? 'Box Length (in)' : shape === 'tapered_pot' ? 'Top Diameter (in)' : 'Diameter (in)'}
              </label>
              <input
                type="number"
                min="2"
                step="0.5"
                value={dim1}
                onChange={e => setDim1(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            {shape !== 'cylinder_growbag' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {shape === 'window_box' ? 'Box Width (in)' : 'Base Diameter (in)'}
                </label>
                <input
                  type="number"
                  min="2"
                  step="0.5"
                  value={dim2}
                  onChange={e => setDim2(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Container Height (in)
              </label>
              <input
                type="number"
                min="2"
                step="0.5"
                value={heightIn}
                onChange={e => setHeightIn(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Number of Pots
              </label>
              <input
                type="number"
                min="1"
                max="200"
                step="1"
                value={potCount}
                onChange={e => setPotCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price per 32-Qt Potting Soil Bag ($)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={pricePer32QtBag}
                  onChange={e => setPricePer32QtBag(Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center">
              Calculations include an 8% top watering rim allowance (~1" below top edge).
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProjectPhotoPreview
            calculatorId="mulch_soil"
            title="Potting Mix Bag Sizing"
            metricsOverlay={{
              primaryValue: `${res.dryQuarts.toFixed(1)} Dry Qt`,
              primaryLabel: 'Total Mix Volume',
              secondaryValue: `${res.gallons.toFixed(1)} gal`,
              secondaryLabel: `${res.liters.toFixed(1)} Liters`,
            }}
          >
            <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">8-Quart Bags (Houseplants):</span>
                <strong className="font-mono text-slate-900">{res.bags8Qt} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">16-Quart Bags:</span>
                <strong className="font-mono text-slate-900">{res.bags16Qt} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">32-Quart Bags (Standard):</span>
                <strong className="font-mono text-emerald-800">{res.bags32Qt} bags</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">2 Cu Ft Large Bags (~51 qt):</span>
                <strong className="font-mono text-emerald-800">{res.bags2CuFt} bags</strong>
              </div>
            </div>
          </ProjectPhotoPreview>

          <button
            type="button"
            onClick={handleAddToBOM}
            className="w-full py-2.5 px-3 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Potting Mix to BOM</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Total Dry Quarts</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1 tabular-nums">
            {res.dryQuarts.toFixed(1)} qt
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono tabular-nums">
            {res.liters.toFixed(1)} L · {res.totalCuFt.toFixed(2)} cu ft
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Container Gallons</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.gallons.toFixed(1)} gal
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {potCount} container{potCount > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">32-Qt Potting Bags</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {res.bags32Qt} bags
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Or {res.bags2CuFt} × 2 cu ft bags</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Cost</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${(res.bags32Qt * pricePer32QtBag).toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">@ ${pricePer32QtBag}/32-qt bag</p>
        </div>
      </div>
    </div>
  );
};
