import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { calculateRetainingWall } from '../../utils/constructionMath';
import { ShoppingCart, Layers, ShieldAlert, Sparkles, Scale, Info, Check } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface RetainingWallCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

const BLOCK_PRESETS = [
  {
    id: 'garden_12x4x8',
    name: '12" × 4" × 8" Garden Wall Block',
    widthInches: 12,
    heightInches: 4,
    depthInches: 8,
    weightLbs: 25,
    unitPrice: 2.85,
    maxHeightFt: 3.0,
    desc: 'Lightweight landscape block ideal for curved garden borders and flower bed terraces up to 3 ft tall.',
  },
  {
    id: 'heavy_16x6x12',
    name: '16" × 6" × 12" Structural Anchor Block',
    widthInches: 16,
    heightInches: 6,
    depthInches: 12,
    weightLbs: 58,
    unitPrice: 5.75,
    maxHeightFt: 6.0,
    desc: 'Heavy-duty commercial block with rear alignment lip for structural grade retention up to 6 ft tall.',
  },
  {
    id: 'jumbo_18x8x12',
    name: '18" × 8" × 12" Jumbo Split-Face Block',
    widthInches: 18,
    heightInches: 8,
    depthInches: 12,
    weightLbs: 78,
    unitPrice: 8.50,
    maxHeightFt: 8.0,
    desc: 'Deep setback split-face gravity block designed for steep slope retention and engineered soil walls.',
  },
  {
    id: 'custom',
    name: 'Custom Dimension Block',
    widthInches: 12,
    heightInches: 4,
    depthInches: 8,
    weightLbs: 30,
    unitPrice: 3.50,
    maxHeightFt: 4.0,
    desc: 'User-specified block dimensions for specialty or architectural units.',
  },
];

export const RetainingWallCalc: React.FC<RetainingWallCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  // Dimensions
  const [wallLength, setWallLength] = useState<number>(Number(initialParams.l) || 25);
  const [wallHeight, setWallHeight] = useState<number>(Number(initialParams.h) || 3.5); // exposed height
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    initialParams.block || 'garden_12x4x8'
  );

  // Custom block dimensions
  const [customWidth, setCustomWidth] = useState<number>(12);
  const [customHeight, setCustomHeight] = useState<number>(4);
  const [customDepth, setCustomDepth] = useState<number>(8);
  const [customPrice, setCustomPrice] = useState<number>(3.25);

  // Options
  const [includeCapstones, setIncludeCapstones] = useState<boolean>(true);
  const [capstonePrice, setCapstonePrice] = useState<number>(3.80);
  const [wastePercent, setWastePercent] = useState<number>(8);
  const [addedItemSuccess, setAddedItemSuccess] = useState<string | null>(null);

  const selectedPreset = useMemo(() => {
    return BLOCK_PRESETS.find(b => b.id === selectedBlockId) || BLOCK_PRESETS[0];
  }, [selectedBlockId]);

  const blockW = selectedBlockId === 'custom' ? customWidth : selectedPreset.widthInches;
  const blockH = selectedBlockId === 'custom' ? customHeight : selectedPreset.heightInches;
  const blockD = selectedBlockId === 'custom' ? customDepth : selectedPreset.depthInches;
  const blockPrice = selectedBlockId === 'custom' ? customPrice : selectedPreset.unitPrice;

  // Calculation
  const result = useMemo(() => {
    return calculateRetainingWall(
      wallLength,
      wallHeight,
      blockW,
      blockH,
      blockD,
      undefined, // auto buried
      includeCapstones,
      12, // 12" capstone
      wastePercent
    );
  }, [wallLength, wallHeight, blockW, blockH, blockD, includeCapstones, wastePercent]);

  // Dynamic SEO
  useDynamicCalculatorSEO(
    {
      calculatorId: 'retaining_wall',
      wallLength,
      wallHeight,
      exposedSqFt: result.exposedSqFt,
      totalBlocks: result.totalWallBlocks,
      capstonesCount: result.capstonesCount,
      baseGravelTons: result.baseTrenchGravelTons,
      drainageStoneTons: result.drainageStoneTons,
      blockName: selectedPreset.name,
      unitPrice: blockPrice,
    },
    { updateUrlQuery: true }
  );

  const handleAddAllToBOM = () => {
    // 1. Blocks
    onAddToBOM({
      name: `Retaining Wall Blocks (${selectedPreset.name})`,
      category: 'construction',
      calculatorType: 'Retaining Wall Calculator',
      primaryQuantity: result.totalWallBlocks,
      primaryUnit: 'blocks',
      secondarySummary: `${result.totalCourses} courses (${result.exposedCourses} exposed, ${result.buriedCourses} buried base) for ${wallLength}ft × ${wallHeight}ft wall (${wastePercent}% waste)`,
      unitPrice: blockPrice,
      notes: `${blockW}"W × ${blockH}"H × ${blockD}"D units`,
    });

    // 2. Capstones
    if (includeCapstones && result.capstonesCount > 0) {
      onAddToBOM({
        name: 'Retaining Wall Capstones (12" Double-Sided)',
        category: 'construction',
        calculatorType: 'Retaining Wall Calculator',
        primaryQuantity: result.capstonesCount,
        primaryUnit: 'caps',
        secondarySummary: `Wall top cap course with 5% cutting allowance and 2-sided split texture`,
        unitPrice: capstonePrice,
        notes: `Requires ~${result.adhesiveTubes} tubes of heavy-duty polyurethane landscape adhesive`,
      });
    }

    // 3. Base Gravel
    onAddToBOM({
      name: 'Crushed Stone Leveling Base (#57 or 21A)',
      category: 'construction',
      calculatorType: 'Retaining Wall Calculator',
      primaryQuantity: Number(result.baseTrenchGravelTons.toFixed(2)),
      primaryUnit: 'tons',
      secondarySummary: `6" deep compacted trench base course (${result.baseTrenchGravelCuYd.toFixed(2)} cu yd)`,
      unitPrice: 42,
      notes: 'Compact with vibratory plate in 2-inch lifts prior to first buried course',
    });

    // 4. Drainage Aggregate
    onAddToBOM({
      name: 'Clean Drainage Stone (#57 Washed Gravel)',
      category: 'construction',
      calculatorType: 'Retaining Wall Calculator',
      primaryQuantity: Number(result.drainageStoneTons.toFixed(2)),
      primaryUnit: 'tons',
      secondarySummary: `12" drainage chimney zone directly behind wall (${result.drainageStoneCuYd.toFixed(2)} cu yd)`,
      unitPrice: 46,
      notes: 'Prevents hydrostatic water pressure buildup behind wall face',
    });

    setAddedItemSuccess('Complete Retaining Wall System added to Project BOM!');
    setTimeout(() => setAddedItemSuccess(null), 3000);
  };

  const presets = [
    {
      label: "20' × 3' Terrace",
      sublabel: '60 sq ft · Garden Wall',
      active: wallLength === 20 && wallHeight === 3,
      onClick: () => {
        setWallLength(20);
        setWallHeight(3);
        setSelectedBlockId('garden_12x4x8');
      },
    },
    {
      label: "35' × 4' Stepped Slope",
      sublabel: '140 sq ft · Structural Block',
      active: wallLength === 35 && wallHeight === 4,
      onClick: () => {
        setWallLength(35);
        setWallHeight(4);
        setSelectedBlockId('heavy_16x6x12');
      },
    },
    {
      label: "50' × 5' Heavy Gravity",
      sublabel: '250 sq ft · Geogrid Reinforcement',
      active: wallLength === 50 && wallHeight === 5,
      onClick: () => {
        setWallLength(50);
        setWallHeight(5);
        setSelectedBlockId('jumbo_18x8x12');
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Retaining Wall & Gravity Block Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Calculate total blocks, buried base course, wall capstones, 6" leveling trench gravel, 12" drainage rock chimney, and geogrid soil reinforcement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const event = new CustomEvent('open-compare-modal', {
                  detail: {
                    item: {
                      id: 'compare_wall',
                      name: 'Retaining Wall Block System',
                      category: 'construction',
                      calculatorType: 'Retaining Wall Calculator',
                      primaryQuantity: result.totalWallBlocks,
                      primaryUnit: 'blocks',
                      secondarySummary: `${wallLength}ft × ${wallHeight}ft wall`,
                      unitPrice: blockPrice,
                      timestamp: Date.now(),
                    },
                  },
                });
                window.dispatchEvent(event);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compare Materials</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <DynamicSEOPresets presets={presets} canonicalPath="/masonry/retaining-wall" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
              1. Wall Dimensions
            </h3>

            {/* Wall Length Slider & Number */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">Wall Length (Linear Feet)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    step="1"
                    value={wallLength}
                    onChange={e => setWallLength(Math.max(1, Number(e.target.value)))}
                    className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-slate-500 text-xs font-medium">ft</span>
                </div>
              </div>
              <input
                type="range"
                min="4"
                max="100"
                step="1"
                value={wallLength}
                onChange={e => setWallLength(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Wall Height Slider & Number */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-700">
                  Exposed Wall Height (Above Ground)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.25"
                    value={wallHeight}
                    onChange={e => setWallHeight(Math.max(0.5, Number(e.target.value)))}
                    className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-slate-500 text-xs font-medium">ft</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.25"
                value={wallHeight}
                onChange={e => setWallHeight(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.0 ft (Low Garden)</span>
                <span>3.5 ft (Max Unreinforced)</span>
                <span>8.0 ft (Engineered)</span>
              </div>
            </div>

            {/* Height Warning Callout */}
            {wallHeight >= 4.0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Engineering Code Notice:</span> Walls over 4 ft (1.2m) tall generally require structural permits, geotechnical geogrid soil reinforcement layers, and local municipal inspection.
                </div>
              </div>
            )}
          </div>

          {/* Block Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
              2. Segmental Block Type
            </h3>

            <div className="space-y-2">
              {BLOCK_PRESETS.map(b => (
                <label
                  key={b.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedBlockId === b.id
                      ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="blockPreset"
                    checked={selectedBlockId === b.id}
                    onChange={() => setSelectedBlockId(b.id)}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.name}</span>
                      <span className="font-mono text-slate-600 font-semibold">
                        ${b.unitPrice.toFixed(2)}/ea
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>Dimensions: {b.widthInches}" × {b.heightInches}" × {b.depthInches}"</span>
                      <span>Weight: ~{b.weightLbs} lbs</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedBlockId === 'custom' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Width (Inches)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={e => setCustomWidth(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Height (Inches)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={e => setCustomHeight(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Depth (Inches)
                  </label>
                  <input
                    type="number"
                    value={customDepth}
                    onChange={e => setCustomDepth(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Price ($ / Block)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={customPrice}
                    onChange={e => setCustomPrice(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Options & Accessories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
              3. Caps & Waste Allowance
            </h3>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Include Top Capstones</span>
                <span className="text-[11px] text-slate-500">
                  Finished caps with adhesive bonding bead
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeCapstones}
                onChange={e => setIncludeCapstones(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Cutting & Split Waste Buffer</span>
                <span className="font-mono font-bold text-amber-700">{wastePercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="1"
                value={wastePercent}
                onChange={e => setWastePercent(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">
                Recommended 8% for straight walls; 12–15% for curved terraces with block cuts
              </span>
            </div>
          </div>
        </div>

        {/* Right Output & Visualization Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Calculations Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                  Comprehensive Material Estimate
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Retaining Wall Bill of Materials
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {result.totalWallBlocks}
                </span>
                <span className="text-xs text-slate-400 block">Total Wall Blocks</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Exposed Area</span>
                <span className="text-base font-bold text-white">{result.exposedSqFt} sq ft</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {result.exposedCourses} visible courses
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Buried Base Course</span>
                <span className="text-base font-bold text-emerald-400">
                  {result.buriedCourses} course ({result.blocksPerCourse * result.buriedCourses} blk)
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Below finished grade</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Wall Capstones</span>
                <span className="text-base font-bold text-sky-400">
                  {includeCapstones ? `${result.capstonesCount} caps` : 'None'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ~{result.adhesiveTubes} adhesive tubes
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Leveling Base Gravel</span>
                <span className="text-base font-bold text-amber-300">
                  {result.baseTrenchGravelTons.toFixed(1)} US Tons
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  6" depth ({result.baseTrenchGravelCuYd.toFixed(2)} cu yd)
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">12" Drainage Stone</span>
                <span className="text-base font-bold text-amber-300">
                  {result.drainageStoneTons.toFixed(1)} US Tons
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  #57 Rock ({result.drainageStoneCuYd.toFixed(2)} cu yd)
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Drain Tile Pipe</span>
                <span className="text-base font-bold text-white">
                  {result.drainPipeLinearFt} lin ft
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">4" Perforated pipe</span>
              </div>
            </div>

            {/* Geogrid info if applicable */}
            {result.geogridSqYd > 0 && (
              <div className="p-3 bg-purple-950/60 border border-purple-700/50 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="font-semibold text-purple-200">
                    Geogrid Soil Reinforcement Required:
                  </span>
                </div>
                <span className="font-mono font-bold text-purple-300 text-sm">
                  {result.geogridSqYd} sq yds ({result.geogridLayers} layers)
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToBOM}
                className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Complete Retaining Wall Kit to BOM</span>
              </button>
            </div>

            {addedItemSuccess && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-lg text-xs flex items-center gap-2 font-medium animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{addedItemSuccess}</span>
              </div>
            )}
          </div>

          {/* 2D Architectural Cross-Section Diagram */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Structural Cross-Section Elevation Schematic</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                12" Drainage Chimney · Base Trench
              </span>
            </div>

            {/* Interactive SVG Diagram */}
            <div className="w-full bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-800 overflow-hidden">
              <svg viewBox="0 0 520 300" className="w-full max-w-lg h-auto select-none">
                {/* Background Sky / Ground split */}
                <rect x="0" y="0" width="520" height="300" fill="#0f172a" />

                {/* Sub-grade Soil Base */}
                <rect x="0" y="210" width="520" height="90" fill="#1e293b" />
                <line x1="0" y1="210" x2="520" y2="210" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
                <text x="15" y="235" fill="#64748b" fontSize="10" fontFamily="monospace">Native Soil Sub-grade</text>

                {/* 6" Compacted Base Gravel Trench */}
                <rect x="90" y="210" width="130" height="40" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
                <text x="96" y="234" fill="#cbd5e1" fontSize="9" fontFamily="monospace">6" Compacted Gravel</text>

                {/* 12" Drainage Rock Chimney behind wall */}
                <rect x="180" y="70" width="100" height="140" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                {/* Pebble dots in drainage rock */}
                {[...Array(24)].map((_, i) => (
                  <circle
                    key={i}
                    cx={195 + (i % 4) * 22}
                    cy={85 + Math.floor(i / 4) * 20}
                    r="3"
                    fill="#64748b"
                  />
                ))}
                <text x="190" y="145" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  12" #57 Stone
                </text>
                <text x="190" y="158" fill="#64748b" fontSize="8" fontFamily="sans-serif">
                  Drainage Chimney
                </text>

                {/* 4" Perforated Drain Tile pipe */}
                <circle cx="230" cy="190" r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="230" cy="190" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                <text x="250" y="194" fill="#38bdf8" fontSize="9" fontFamily="monospace">4" Drain Tile</text>

                {/* Geogrid horizontal reinforcement line */}
                {result.geogridSqYd > 0 && (
                  <g>
                    <line x1="170" y1="130" x2="440" y2="130" stroke="#a855f7" strokeWidth="3" strokeDasharray="6,3" />
                    <text x="320" y="122" fill="#c084fc" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      Geogrid Soil Layer
                    </text>
                  </g>
                )}

                {/* Retaining Wall Blocks Stack with backward batter */}
                {/* Course 1 (Buried Base) */}
                <rect x="100" y="180" width="75" height="30" fill="#52525b" stroke="#71717a" strokeWidth="1.5" rx="1" />
                <text x="108" y="198" fill="#e4e4e7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                  Buried Course
                </text>

                {/* Course 2 */}
                <rect x="103" y="150" width="75" height="30" fill="#71717a" stroke="#a1a1aa" strokeWidth="1.5" rx="1" />
                {/* Course 3 */}
                <rect x="106" y="120" width="75" height="30" fill="#71717a" stroke="#a1a1aa" strokeWidth="1.5" rx="1" />
                {/* Course 4 */}
                <rect x="109" y="90" width="75" height="30" fill="#71717a" stroke="#a1a1aa" strokeWidth="1.5" rx="1" />

                {/* Capstone Course on top */}
                {includeCapstones && (
                  <g>
                    <rect x="108" y="74" width="83" height="16" fill="#a1a1aa" stroke="#d4d4d8" strokeWidth="1.5" rx="2" />
                    <text x="120" y="86" fill="#18181b" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                      Cap Course
                    </text>
                  </g>
                )}

                {/* Grade Line in front of wall */}
                <line x1="0" y1="180" x2="100" y2="180" stroke="#22c55e" strokeWidth="2.5" />
                <text x="15" y="174" fill="#22c55e" fontSize="9" fontFamily="sans-serif">Finished Grade</text>

                {/* Retained Slope behind drainage rock */}
                <path d="M 280,110 Q 380,80 520,60" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                <text x="400" y="75" fill="#22c55e" fontSize="9" fontFamily="sans-serif">Retained Slope</text>

                {/* Exposed Height Arrow Callout */}
                <line x1="80" y1="90" x2="80" y2="180" stroke="#f59e0b" strokeWidth="1.5" />
                <polyline points="76,98 80,90 84,98" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <polyline points="76,172 80,180 84,172" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="25" y="140" fill="#f59e0b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  {wallHeight} ft Exposed
                </text>
              </svg>
            </div>
          </div>

          {/* Project Photo Preview */}
          <ProjectPhotoPreview calculatorId="retaining_wall" />
        </div>
      </div>
    </div>
  );
};
