import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import {
  calculateWallpaper,
  WALLPAPER_ROLL_SPECS,
  WallpaperRollType,
  PatternMatchType,
  WallpaperCutoutInput,
} from '../../utils/fabricMath';
import {
  ShoppingCart,
  Maximize2,
  Sparkles,
  Scale,
  Plus,
  Trash2,
  Check,
  Info,
  Layers,
} from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface WallpaperCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const WallpaperCalc: React.FC<WallpaperCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  // Wall configuration
  const [wallMode, setWallMode] = useState<'single' | 'room'>('single');
  const [singleWidth, setSingleWidth] = useState<number>(Number(initialParams.w) || 14);
  const [singleHeight, setSingleHeight] = useState<number>(Number(initialParams.h) || 9);

  // 4-room walls
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [roomHeight, setRoomHeight] = useState<number>(9);

  // Cutouts (Windows & Doors)
  const [cutouts, setCutouts] = useState<WallpaperCutoutInput[]>([
    { id: 'win1', name: 'Standard Window', widthFt: 3, heightFt: 4.5, count: 1 },
    { id: 'door1', name: 'Interior Door', widthFt: 2.67, heightFt: 6.67, count: 1 },
  ]);

  // Roll & Pattern Specs
  const [rollType, setRollType] = useState<WallpaperRollType>('double_roll_us');
  const [patternMatch, setPatternMatch] = useState<PatternMatchType>('straight');
  const [patternRepeat, setPatternRepeat] = useState<number>(21); // 21 inches standard
  const [rollPrice, setRollPrice] = useState<number>(45.0);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [addedItemSuccess, setAddedItemSuccess] = useState<string | null>(null);

  // Build active wall inputs
  const walls = useMemo(() => {
    if (wallMode === 'single') {
      return [{ id: 'w1', name: 'Accent Wall', widthFt: singleWidth, heightFt: singleHeight }];
    } else {
      return [
        { id: 'w1', name: 'North Wall', widthFt: roomLength, heightFt: roomHeight },
        { id: 'w2', name: 'South Wall', widthFt: roomLength, heightFt: roomHeight },
        { id: 'w3', name: 'East Wall', widthFt: roomWidth, heightFt: roomHeight },
        { id: 'w4', name: 'West Wall', widthFt: roomWidth, heightFt: roomHeight },
      ];
    }
  }, [wallMode, singleWidth, singleHeight, roomLength, roomWidth, roomHeight]);

  // Execute calculation
  const result = useMemo(() => {
    return calculateWallpaper(
      walls,
      cutouts,
      rollType,
      patternMatch,
      patternRepeat,
      wastePercent
    );
  }, [walls, cutouts, rollType, patternMatch, patternRepeat, wastePercent]);

  const selectedRollSpec = WALLPAPER_ROLL_SPECS[rollType];

  // Dynamic SEO
  useDynamicCalculatorSEO(
    {
      calculatorId: 'wallpaper_calc',
      subType: wallMode,
      wallWidth: singleWidth,
      wallHeight: singleHeight,
      netSqFt: result.netAreaSqFt,
      totalStrips: result.totalStripsNeeded,
      rollsNeeded: result.rollsNeeded,
      recommendedRolls: result.recommendedRolls,
      patternType: patternMatch,
      rollType: selectedRollSpec.label,
      unitPrice: rollPrice,
    },
    { updateUrlQuery: true }
  );

  const handleAddCutout = () => {
    setCutouts(prev => [
      ...prev,
      {
        id: `cut_${Date.now()}`,
        name: 'Window Opening',
        widthFt: 3,
        heightFt: 4,
        count: 1,
      },
    ]);
  };

  const handleRemoveCutout = (id: string) => {
    setCutouts(prev => prev.filter(c => c.id !== id));
  };

  const handleAddAllToBOM = () => {
    // 1. Wallpaper Rolls
    onAddToBOM({
      name: `Designer Wallpaper (${selectedRollSpec.label})`,
      category: 'fabric',
      calculatorType: 'Wallpaper Calculator',
      primaryQuantity: result.recommendedRolls,
      primaryUnit: 'rolls',
      secondarySummary: `${result.netAreaSqFt.toFixed(0)} sq ft net area · ${result.totalStripsNeeded} vertical strips (${patternMatch} match @ ${patternRepeat}" repeat) with +1 dye-lot safety roll`,
      unitPrice: rollPrice,
      notes: `${selectedRollSpec.widthInches}" W × ${selectedRollSpec.lengthFt} ft L (${selectedRollSpec.nominalSqFt} sq ft per roll)`,
    });

    // 2. Wallpaper Paste / Adhesive
    onAddToBOM({
      name: 'Heavy-Duty Wallpaper Paste (1-Gallon Pail)',
      category: 'fabric',
      calculatorType: 'Wallpaper Calculator',
      primaryQuantity: result.adhesivePastePails,
      primaryUnit: 'pails',
      secondarySummary: 'Pre-mixed clear non-staining wallcovering adhesive',
      unitPrice: 28,
      notes: 'Covers ~250–300 sq ft per gallon',
    });

    // 3. Primer
    onAddToBOM({
      name: 'Acrylic Wallcovering Sizing & Primer',
      category: 'fabric',
      calculatorType: 'Wallpaper Calculator',
      primaryQuantity: result.primerGallons,
      primaryUnit: 'gallons',
      secondarySummary: 'Seals drywall surface and ensures clean strippable removal',
      unitPrice: 32,
      notes: 'Covers ~350–400 sq ft per gallon',
    });

    setAddedItemSuccess('Wallpaper & Installation Kit added to Project BOM!');
    setTimeout(() => setAddedItemSuccess(null), 3000);
  };

  const presets = [
    {
      label: "Accent Wall 14' × 9'",
      sublabel: '126 sq ft · 3 Double Rolls',
      active: wallMode === 'single' && singleWidth === 14 && singleHeight === 9,
      onClick: () => {
        setWallMode('single');
        setSingleWidth(14);
        setSingleHeight(9);
      },
    },
    {
      label: "Dining Room 14' × 12'",
      sublabel: '4 Walls · 468 sq ft · 10 Rolls',
      active: wallMode === 'room' && roomLength === 14 && roomWidth === 12,
      onClick: () => {
        setWallMode('room');
        setRoomLength(14);
        setRoomWidth(12);
        setRoomHeight(9);
      },
    },
    {
      label: "Powder Room 6' × 5'",
      sublabel: 'Feature Space · 4 Rolls',
      active: wallMode === 'room' && roomLength === 6 && roomWidth === 5,
      onClick: () => {
        setWallMode('room');
        setRoomLength(6);
        setRoomWidth(5);
        setRoomHeight(8);
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
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
                <Maximize2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Wallpaper & Accent Wall Covering Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Estimate wallpaper rolls, vertical drop strips, pattern match waste (straight/half-drop), window & door deductions, and paste/primer gallons.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const event = new CustomEvent('open-compare-modal', {
                  detail: {
                    item: {
                      id: 'compare_wallpaper',
                      name: 'Wallpaper Wallcovering',
                      category: 'fabric',
                      calculatorType: 'Wallpaper Calculator',
                      primaryQuantity: result.recommendedRolls,
                      primaryUnit: 'rolls',
                      secondarySummary: `${result.netAreaSqFt.toFixed(0)} sq ft wall`,
                      unitPrice: rollPrice,
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
          <DynamicSEOPresets presets={presets} canonicalPath="/wallpaper-calculator" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Wall Mode & Dimensions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                1. Wall Scope & Dimensions
              </h3>
              <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setWallMode('single')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    wallMode === 'single'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Single Accent Wall
                </button>
                <button
                  type="button"
                  onClick={() => setWallMode('room')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    wallMode === 'room'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full 4-Wall Room
                </button>
              </div>
            </div>

            {wallMode === 'single' ? (
              <div className="space-y-4">
                {/* Wall Width */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Wall Width</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="2"
                        max="80"
                        step="0.5"
                        value={singleWidth}
                        onChange={e => setSingleWidth(Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-slate-500 text-xs font-medium">ft</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    step="0.5"
                    value={singleWidth}
                    onChange={e => setSingleWidth(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Wall Height */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-700">Wall Height (Floor to Ceiling)</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="24"
                        step="0.5"
                        value={singleHeight}
                        onChange={e => setSingleHeight(Math.max(4, Number(e.target.value)))}
                        className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-slate-500 text-xs font-medium">ft</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="14"
                    step="0.5"
                    value={singleHeight}
                    onChange={e => setSingleHeight(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Room Length (ft)
                  </label>
                  <input
                    type="number"
                    value={roomLength}
                    onChange={e => setRoomLength(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Room Width (ft)
                  </label>
                  <input
                    type="number"
                    value={roomWidth}
                    onChange={e => setRoomWidth(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-bold">
                    Ceiling Height (ft)
                  </label>
                  <input
                    type="number"
                    value={roomHeight}
                    onChange={e => setRoomHeight(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Roll Type & Pattern Repeat */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
              2. Roll Format & Pattern Repeat
            </h3>

            {/* Roll Type Selection */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 text-xs block">Roll Packaging Format</label>
              <select
                value={rollType}
                onChange={e => setRollType(e.target.value as WallpaperRollType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {Object.entries(WALLPAPER_ROLL_SPECS).map(([k, s]) => (
                  <option key={k} value={k}>
                    {s.label} ({s.widthInches}" × {s.lengthFt}' · {s.nominalSqFt} sq ft)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">{selectedRollSpec.desc}</p>
            </div>

            {/* Pattern Match Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 text-xs block">Pattern Match Style</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'random', label: 'Random Match', desc: 'No pattern repeat (Textures, Grasscloth)' },
                  { id: 'straight', label: 'Straight Match', desc: 'Motifs line up directly horizontally' },
                  { id: 'half_drop', label: 'Half-Drop Match', desc: 'Motif drops 1/2 repeat on next strip' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPatternMatch(m.id as PatternMatchType)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      patternMatch === m.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-[11px]">{m.label}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Repeat Distance (inches) */}
            {patternMatch !== 'random' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700">Vertical Pattern Repeat (Inches)</label>
                  <span className="font-mono font-bold text-indigo-700">{patternRepeat} in</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="36"
                  step="1"
                  value={patternRepeat}
                  onChange={e => setPatternRepeat(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Small Motif (6")</span>
                  <span>Standard Drop (21")</span>
                  <span>Large Mural (36")</span>
                </div>
              </div>
            )}

            {/* Roll Price */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Estimated Price per Roll ($)</span>
              <input
                type="number"
                step="1"
                value={rollPrice}
                onChange={e => setRollPrice(Number(e.target.value))}
                className="w-24 px-2 py-1 text-right bg-slate-50 border border-slate-300 rounded-md font-mono text-xs font-semibold"
              />
            </div>
          </div>

          {/* Cutout Deductions (Windows & Doors) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                3. Openings & Cutouts (Deductions)
              </h3>
              <button
                type="button"
                onClick={handleAddCutout}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Opening</span>
              </button>
            </div>

            <div className="space-y-2">
              {cutouts.map(c => (
                <div
                  key={c.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={e => {
                        const val = e.target.value;
                        setCutouts(prev => prev.map(x => (x.id === c.id ? { ...x, name: val } : x)));
                      }}
                      className="w-28 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-medium"
                    />
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                      <span>{c.widthFt}'W × {c.heightFt}'H</span>
                      <span className="text-slate-400">({(c.widthFt * c.heightFt * c.count).toFixed(0)} sq ft)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={c.count}
                        onChange={e => {
                          const val = Math.max(1, Number(e.target.value));
                          setCutouts(prev => prev.map(x => (x.id === c.id ? { ...x, count: val } : x)));
                        }}
                        className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-center text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCutout(c.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output & Visualization Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Calculation Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">
                  Precision Yardage & Roll Calculation
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Wallpaper Requirement Summary
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-400 font-mono">
                  {result.recommendedRolls}
                </span>
                <span className="text-xs text-slate-400 block">Recommended Rolls (with safety)</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Net Surface Area</span>
                <span className="text-base font-bold text-white">{result.netAreaSqFt.toFixed(0)} sq ft</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({result.cutoutAreaSqFt.toFixed(0)} sq ft cutouts)
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Vertical Strips</span>
                <span className="text-base font-bold text-emerald-400">
                  {result.totalStripsNeeded} Strips
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  @{selectedRollSpec.widthInches}" strip width
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Cut Drop Length</span>
                <span className="text-base font-bold text-sky-400">
                  {result.cutDropLengthInches}" per strip
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {result.stripsPerRoll} strips per roll
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Exact Rolls Needed</span>
                <span className="text-base font-bold text-indigo-300">
                  {result.rollsNeeded} {result.rollsNeeded === 1 ? 'Roll' : 'Rolls'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  +{result.recommendedRolls - result.rollsNeeded} dye-lot backup
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Wallpaper Paste</span>
                <span className="text-base font-bold text-amber-300">
                  {result.adhesivePastePails} Gallon
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Heavy-duty adhesive</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase">Wall Primer/Sizing</span>
                <span className="text-base font-bold text-amber-300">
                  {result.primerGallons} Gallon
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Acrylic pre-wall sizing</span>
              </div>
            </div>

            {/* Estimated Total Price */}
            <div className="p-3 bg-indigo-950/60 border border-indigo-700/50 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-200">
                Estimated Material Cost ({result.recommendedRolls} rolls @ ${rollPrice}/ea):
              </span>
              <span className="text-base font-bold text-indigo-300">
                ${(result.recommendedRolls * rollPrice).toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToBOM}
                className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Wallpaper & Kit to BOM</span>
              </button>
            </div>

            {addedItemSuccess && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-lg text-xs flex items-center gap-2 font-medium animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{addedItemSuccess}</span>
              </div>
            )}
          </div>

          {/* 2D Wall Strip Elevation Visualizer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Vertical Wallpaper Strip Layout Elevation</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {result.totalStripsNeeded} Strips · {patternMatch} match
              </span>
            </div>

            {/* SVG Strip Diagram */}
            <div className="w-full bg-slate-950 rounded-xl p-4 flex items-center justify-center border border-slate-800 overflow-hidden">
              <svg viewBox="0 0 540 240" className="w-full max-w-lg h-auto select-none">
                {/* Wall Outline */}
                <rect x="20" y="20" width="500" height="190" fill="#1e1e2e" stroke="#313244" strokeWidth="2" rx="4" />

                {/* Vertical Wallpaper Strips */}
                {(() => {
                  const stripCount = Math.min(18, result.totalStripsNeeded);
                  const stripW = 500 / stripCount;
                  return [...Array(stripCount)].map((_, i) => {
                    const x = 20 + i * stripW;
                    const isEven = i % 2 === 0;
                    return (
                      <g key={i}>
                        {/* Strip Body */}
                        <rect
                          x={x}
                          y="20"
                          width={stripW}
                          height="190"
                          fill={isEven ? '#313244' : '#262738'}
                          stroke="#45475a"
                          strokeWidth="1"
                        />
                        {/* Strip Number Badge */}
                        <text
                          x={x + stripW / 2}
                          y="38"
                          fill="#cdd6f4"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          #{i + 1}
                        </text>
                        {/* Pattern Repeat Alignment lines */}
                        {patternMatch !== 'random' && (
                          <g stroke="#89b4fa" strokeWidth="1" strokeDasharray="3,3" opacity="0.6">
                            <line x1={x + 2} y1="75" x2={x + stripW - 2} y2="75" />
                            <line x1={x + 2} y1="130" x2={x + stripW - 2} y2="130" />
                            <line x1={x + 2} y1="185" x2={x + stripW - 2} y2="185" />
                          </g>
                        )}
                      </g>
                    );
                  });
                })()}

                {/* Example Window Cutout */}
                <rect
                  x="140"
                  y="65"
                  width="110"
                  height="90"
                  fill="#11111b"
                  stroke="#f38ba8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  rx="2"
                />
                <text x="195" y="115" fill="#f38ba8" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                  Window Cutout
                </text>

                {/* Floor / Skirting Line */}
                <rect x="20" y="210" width="500" height="8" fill="#45475a" />
                <text x="270" y="230" fill="#a6adc8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Floor Baseboard Line · 2" Lower Trimming Allowance
                </text>
              </svg>
            </div>
          </div>

          {/* Project Photo Preview */}
          <ProjectPhotoPreview calculatorId="wallpaper_calc" />
        </div>
      </div>
    </div>
  );
};
