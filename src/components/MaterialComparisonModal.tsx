import React, { useState, useMemo } from 'react';
import {
  MATERIAL_COMPARISONS,
  MaterialComparisonOption,
  calculateMaterialComparisonMetrics,
} from '../data/materialComparisonData';
import { BOMItem } from '../types';
import {
  X,
  Scale,
  Check,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  ShoppingBag,
  Sparkles,
  Info,
  DollarSign,
  Weight,
  Package,
  Clock,
} from 'lucide-react';

interface MaterialComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
  // If editing/comparing an existing BOM item:
  targetBOMItem?: BOMItem | null;
  onReplaceBOMItem?: (id: string, updated: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const MaterialComparisonModal: React.FC<MaterialComparisonModalProps> = ({
  isOpen,
  onClose,
  onAddToBOM,
  targetBOMItem,
  onReplaceBOMItem,
}) => {
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState<string>('mulch_soil');

  // Dimension & Volume inputs
  const [areaSqFt, setAreaSqFt] = useState<number>(() => {
    if (targetBOMItem?.primaryQuantity && targetBOMItem.primaryUnit.includes('yard')) {
      // Approximate 3" depth: 1 yd³ ≈ 108 sq ft
      return Math.round(targetBOMItem.primaryQuantity * 108);
    }
    return 500;
  });

  const [baseDepthInches, setBaseDepthInches] = useState<number>(3);
  const [customVolumeCuYd, setCustomVolumeCuYd] = useState<number>(() => {
    return targetBOMItem?.primaryQuantity || 4.63;
  });
  const [inputMode, setInputMode] = useState<'area' | 'volume'>('area');

  // Baseline material ID for delta comparisons
  const options = MATERIAL_COMPARISONS[selectedCategory] || [];
  const [baselineId, setBaselineId] = useState<string>(() => {
    if (targetBOMItem?.name.toLowerCase().includes('cedar')) return 'bark_cedar';
    if (targetBOMItem?.name.toLowerCase().includes('topsoil')) return 'topsoil_screened';
    return 'bark_nuggets'; // Default to Pine Bark Nuggets
  });

  // Selected comparison candidates for multi-toggle
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([
    'bark_nuggets',
    'bark_cedar',
    'topsoil_screened',
  ]);

  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // Derive active volume based on input mode
  const effectiveVolumeCuYd = useMemo(() => {
    if (inputMode === 'volume') {
      return customVolumeCuYd;
    }
    return (areaSqFt * (baseDepthInches / 12)) / 27;
  }, [inputMode, customVolumeCuYd, areaSqFt, baseDepthInches]);

  const baselineOption = options.find(o => o.id === baselineId) || options[0];

  // Calculate metrics for all options
  const comparisons = useMemo(() => {
    if (!baselineOption) return [];

    return options.map(option => {
      const metrics = calculateMaterialComparisonMetrics(option, {
        volumeCuYd: effectiveVolumeCuYd,
        areaSqFt: inputMode === 'area' ? areaSqFt : effectiveVolumeCuYd * 108,
        depthInches: baseDepthInches,
        unitPrice: baselineOption.defaultPricePerUnit,
      });

      return {
        option,
        metrics,
        isBaseline: option.id === baselineOption.id,
      };
    });
  }, [options, baselineOption, effectiveVolumeCuYd, inputMode, areaSqFt, baseDepthInches]);

  if (!isOpen) return null;

  const handleApplyMaterial = (option: MaterialComparisonOption, metrics: ReturnType<typeof calculateMaterialComparisonMetrics>) => {
    const newBOMData: Omit<BOMItem, 'id' | 'timestamp'> = {
      name: `${option.name} (${effectiveVolumeCuYd.toFixed(2)} yd³ @ ${option.recommendedDepthInches}" depth)`,
      category: 'construction',
      calculatorType: 'Material Comparison Tool',
      primaryQuantity: metrics.adjustedVolumeCuYd,
      primaryUnit: option.unitLabel === 'yd' ? 'linear yards' : 'cu yards',
      secondarySummary: `${metrics.estimatedBags} ${option.bagSizeLabel} · ${metrics.totalWeightTons} tons · ${option.durabilityYears}`,
      unitPrice: option.defaultPricePerUnit,
      notes: `Replaced via Material Comparison. Recommended depth: ${option.recommendedDepthInches}". Best for: ${option.bestFor}.`,
    };

    if (targetBOMItem && onReplaceBOMItem) {
      onReplaceBOMItem(targetBOMItem.id, newBOMData);
      setAddedItemNotification(`Replaced "${targetBOMItem.name}" with "${option.shortName}" in BOM!`);
    } else {
      onAddToBOM(newBOMData);
      setAddedItemNotification(`Added ${metrics.adjustedVolumeCuYd} yd³ of ${option.shortName} to BOM!`);
    }

    setTimeout(() => {
      setAddedItemNotification(null);
    }, 2800);
  };

  const toggleCandidate = (id: string) => {
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl shadow-2xs">
              <Scale className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Material Comparison & Volume Adjustments</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Cost & Density Delta
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Instantly compare Pine Bark, Cedar Mulch, Topsoil, and Aggregates to evaluate cost differences, weight, and coverage depth.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {addedItemNotification && (
          <div className="bg-emerald-900 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{addedItemNotification}</span>
            </div>
            <span className="text-[10px] text-emerald-200 uppercase tracking-wider">BOM Updated</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls Bar: Category, Quick Presets & Dimensions */}
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Category Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Material Family:</span>
                <div className="inline-flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('mulch_soil');
                      setBaselineId('bark_nuggets');
                      setSelectedCandidateIds(['bark_nuggets', 'bark_cedar', 'topsoil_screened']);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedCategory === 'mulch_soil'
                        ? 'bg-emerald-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mulch & Soil Blends
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('aggregates');
                      setBaselineId('pea_gravel');
                      setSelectedCandidateIds(['pea_gravel', 'crushed_stone_57', 'road_base']);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedCategory === 'aggregates'
                        ? 'bg-emerald-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Gravel & Aggregates
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('fabric');
                      setBaselineId('cotton_44');
                      setSelectedCandidateIds(['cotton_44', 'decor_54', 'wide_108']);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedCategory === 'fabric'
                        ? 'bg-emerald-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fabric & Bolt Widths
                  </button>
                </div>
              </div>

              {/* Baseline Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Baseline Reference:</span>
                <select
                  value={baselineId}
                  onChange={e => setBaselineId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {options.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.shortName} (${opt.defaultPricePerUnit}/{opt.unitLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Presets Ribbon */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Popular Scenarios:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('mulch_soil');
                    setAreaSqFt(500);
                    setBaseDepthInches(3);
                    setInputMode('area');
                    setBaselineId('bark_nuggets');
                    setSelectedCandidateIds(['bark_nuggets', 'bark_cedar', 'topsoil_screened']);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 shadow-2xs"
                >
                  🌲 Pine Bark vs Cedar vs Topsoil (500 sq ft)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('mulch_soil');
                    setAreaSqFt(1000);
                    setBaseDepthInches(2);
                    setInputMode('area');
                    setBaselineId('bark_shredded');
                    setSelectedCandidateIds(['bark_shredded', 'compost_organic', 'bark_nuggets']);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 shadow-2xs"
                >
                  🏡 1,000 Sq Ft Flower Bed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('aggregates');
                    setAreaSqFt(400);
                    setBaseDepthInches(3);
                    setInputMode('area');
                    setBaselineId('pea_gravel');
                    setSelectedCandidateIds(['pea_gravel', 'crushed_stone_57', 'road_base']);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-emerald-500 rounded-lg text-slate-700 shadow-2xs"
                >
                  🚗 Driveway Stone vs Road Base
                </button>
              </div>

              {/* Area / Volume Toggle Inputs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium">Area:</span>
                  <input
                    type="number"
                    min="10"
                    step="25"
                    value={areaSqFt}
                    onChange={e => {
                      setAreaSqFt(Math.max(1, Number(e.target.value)));
                      setInputMode('area');
                    }}
                    className="w-20 px-2 py-1 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 text-center shadow-2xs"
                  />
                  <span className="text-[11px] text-slate-500">sq ft</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-600 font-medium">Depth:</span>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    step="0.5"
                    value={baseDepthInches}
                    onChange={e => {
                      setBaseDepthInches(Math.max(0.5, Number(e.target.value)));
                      setInputMode('area');
                    }}
                    className="w-14 px-2 py-1 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 text-center shadow-2xs"
                  />
                  <span className="text-[11px] text-slate-500">inches</span>
                </div>

                <div className="text-xs font-mono font-extrabold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                  = {effectiveVolumeCuYd.toFixed(2)} yd³
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {comparisons.map(({ option, metrics, isBaseline }) => {
              const isSelected = selectedCandidateIds.includes(option.id);
              const isMoreExpensive = metrics.costDifference > 0;
              const isLessExpensive = metrics.costDifference < 0;

              return (
                <div
                  key={option.id}
                  className={`relative rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs ${
                    isBaseline
                      ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/20'
                      : isSelected
                      ? 'border-slate-300 bg-white hover:border-slate-400'
                      : 'border-slate-200 bg-slate-50/60 opacity-75'
                  }`}
                >
                  {/* Card Header & Photo */}
                  <div>
                    {option.imageSrc && (
                      <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                        <img
                          src={option.imageSrc}
                          alt={option.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {isBaseline && (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-700 text-white rounded shadow-xs">
                              Current Baseline
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-black/60 text-slate-200 rounded backdrop-blur-xs">
                            {option.shortName}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                          <p className="text-xs font-bold leading-tight drop-shadow-md text-white">
                            {option.name}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-4">
                      {/* Price & Delta Banner */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Total Estimated Cost
                          </span>
                          <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                            ${metrics.totalCost.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-mono">
                            ${option.defaultPricePerUnit.toFixed(2)} / {option.unitLabel}
                          </span>
                        </div>

                        {/* Cost Delta Pill */}
                        <div className="text-right">
                          {isBaseline ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                              Base Reference
                            </span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span
                                className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                  isMoreExpensive
                                    ? 'bg-rose-100 text-rose-800'
                                    : isLessExpensive
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {isMoreExpensive && <TrendingUp className="w-3.5 h-3.5" />}
                                {isLessExpensive && <TrendingDown className="w-3.5 h-3.5" />}
                                <span>
                                  {isMoreExpensive ? '+' : ''}
                                  ${metrics.costDifference.toFixed(2)}
                                </span>
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                {isMoreExpensive ? '+' : ''}
                                {metrics.costPercentDiff}% vs baseline
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Key Metric Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 block font-medium flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>Required Volume</span>
                          </span>
                          <strong className="text-sm font-mono text-slate-900 block mt-0.5">
                            {metrics.adjustedVolumeCuYd} yd³
                          </strong>
                          <span className="text-[10px] text-slate-500">
                            @ {option.recommendedDepthInches}" rec. depth
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 block font-medium flex items-center gap-1">
                            <Weight className="w-3 h-3 text-slate-400" />
                            <span>Total Hauling Weight</span>
                          </span>
                          <strong className="text-sm font-mono text-slate-900 block mt-0.5">
                            {metrics.totalWeightTons} tons
                          </strong>
                          <span className="text-[10px] text-slate-500">
                            ({metrics.totalWeightLbs.toLocaleString()} lbs)
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block font-medium flex items-center gap-1">
                              <Package className="w-3 h-3 text-slate-400" />
                              <span>Packaged Bag Yield</span>
                            </span>
                            <strong className="text-xs font-mono text-slate-900">
                              {metrics.estimatedBags} {option.bagSizeLabel}
                            </strong>
                          </div>
                          <div className="text-right text-[11px] text-slate-500">
                            <span className="block font-medium">Durability</span>
                            <span className="font-semibold text-emerald-800">{option.durabilityYears}</span>
                          </div>
                        </div>
                      </div>

                      {/* Best Use & Features */}
                      <div className="space-y-1.5 text-xs">
                        <div className="text-[11px] text-slate-600">
                          <strong>Best Application:</strong> {option.bestFor}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Pros & Cons */}
                      <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px]">
                        {option.pros.slice(0, 2).map((pro, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-emerald-800">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleApplyMaterial(option, metrics)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                        isBaseline
                          ? 'bg-emerald-900 hover:bg-emerald-950 text-white'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {targetBOMItem ? `Replace with ${option.shortName} in BOM` : `Add ${option.shortName} to BOM`}
                      </span>
                    </button>

                    {!isBaseline && (
                      <button
                        type="button"
                        onClick={() => setBaselineId(option.id)}
                        className="w-full py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        Set as Reference Baseline
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Insights Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Key Contractor Comparison Insights (Pine Bark vs. Cedar vs. Topsoil)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <strong className="text-slate-900 block mb-0.5">1. Hauling Weight Differential:</strong>
                <span>
                  Topsoil weighs nearly 4× more than Pine Bark (1.10 tons/yd³ vs. 0.28 tons/yd³). Ordering topsoil for raised beds often requires tandem dump trucks and higher delivery fees.
                </span>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">2. Recommended Layer Depth:</strong>
                <span>
                  Pine bark nuggets require 3.5" depth to prevent light penetration to weed seeds. Screened topsoil requires at least 4" for root systems, whereas cedar mulch provides full shade coverage at 3".
                </span>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">3. Lifetime Replacement Frequency:</strong>
                <span>
                  Cedar mulch naturally repels wood-boring insects and lasts 18–24 months. Pine bark nuggets break down in 2–3 years. Topsoil is a permanent mineral base that only needs annual compost top-dressing.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Clicking "Replace in BOM" updates your existing project line item and adjusts budget totals instantly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
