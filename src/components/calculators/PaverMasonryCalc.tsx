import React, { useState, useMemo } from 'react';
import { BOMItem, MeasurementSystem } from '../../types';
import { PAVER_PRESETS } from '../../data/materialsData';
import { calculatePavers, calculateMasonry } from '../../utils/constructionMath';
import { ShoppingCart } from 'lucide-react';

interface PaverMasonryCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const PaverMasonryCalc: React.FC<PaverMasonryCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const [activeTab, setActiveTab] = useState<'pavers' | 'masonry'>('pavers');

  // Pavers
  const [patioLength, setPatioLength] = useState<number>(20);
  const [patioWidth, setPatioWidth] = useState<number>(15);
  const [selectedPaverId, setSelectedPaverId] = useState<string>('holland_4x8');
  const [jointGap, setJointGap] = useState<number>(0.125); // 1/8"
  const [paverWaste, setPaverWaste] = useState<number>(10);
  const [paverCostPerUnit, setPaverCostPerUnit] = useState<number>(0.85);

  // Masonry
  const [wallLength, setWallLength] = useState<number>(30);
  const [wallHeight, setWallHeight] = useState<number>(4);
  const [masonryType, setMasonryType] = useState<'brick' | 'cmu'>('cmu');
  const [masonryWaste, setMasonryWaste] = useState<number>(8);

  const selectedPaver = useMemo(() => {
    return PAVER_PRESETS.find(p => p.id === selectedPaverId) || PAVER_PRESETS[0];
  }, [selectedPaverId]);

  const patioAreaSqFt = patioLength * patioWidth;

  const paverRes = useMemo(() => {
    return calculatePavers(
      patioAreaSqFt,
      selectedPaver.lengthInches,
      selectedPaver.widthInches,
      jointGap,
      paverWaste
    );
  }, [patioAreaSqFt, selectedPaver, jointGap, paverWaste]);

  const masonryRes = useMemo(() => {
    return calculateMasonry(wallLength, wallHeight, masonryType, masonryWaste);
  }, [wallLength, wallHeight, masonryType, masonryWaste]);

  const handleAddPaversToBOM = () => {
    onAddToBOM({
      name: `${selectedPaver.name} (${patioAreaSqFt} sq ft patio)`,
      category: 'construction',
      calculatorType: 'Paver Patio & Walkway',
      primaryQuantity: paverRes.totalPavers,
      primaryUnit: 'pavers',
      secondarySummary: `${paverRes.beddingSandTons.toFixed(2)} tons bedding sand · ${paverRes.polymericSandBags} bags polymeric sand · ${paverRes.baseGravelTons.toFixed(2)} tons base`,
      unitPrice: paverCostPerUnit,
      notes: `Includes ${paverWaste}% cutting waste. Bedding sand: 1" screeded layer. Base rock: 4" compacted.`,
    });
  };

  const handleAddMasonryToBOM = () => {
    onAddToBOM({
      name: `${masonryRes.unitName} (${wallLength}' × ${wallHeight}' Wall)`,
      category: 'construction',
      calculatorType: 'Brick & CMU Masonry',
      primaryQuantity: masonryRes.unitCount,
      primaryUnit: masonryType === 'brick' ? 'bricks' : 'blocks',
      secondarySummary: `${masonryRes.mortarBags80lb} bags (80 lb) mortar mix · ${masonryRes.wallAreaSqFt} sq ft face`,
      unitPrice: masonryType === 'brick' ? 0.75 : 2.50,
      notes: `Includes ${masonryWaste}% waste allowance. Wall area: ${masonryRes.wallAreaSqFt} sq ft.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-mode tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('pavers')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'pavers'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Paver Patio & Walkways
        </button>
        <button
          onClick={() => setActiveTab('masonry')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'masonry'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Brick & Concrete Block (CMU) Walls
        </button>
      </div>

      {activeTab === 'pavers' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Patio Dimensions & Paver Selection
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patio Length (feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={patioLength}
                    onChange={e => setPatioLength(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Patio Width (feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={patioWidth}
                    onChange={e => setPatioWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Standard Paver Sizes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PAVER_PRESETS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPaverId(p.id)}
                      className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                        selectedPaverId === p.id
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.lengthInches}" × {p.widthInches}" ({p.depthInches}" thick)
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Joint Sand Gap (inches)
                  </label>
                  <select
                    value={jointGap}
                    onChange={e => setJointGap(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  >
                    <option value={0.0625}>1/16" (Tight Joint)</option>
                    <option value={0.125}>1/8" (Standard)</option>
                    <option value={0.25}>1/4" (Permeable/Wide)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cutting Waste (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="25"
                    step="1"
                    value={paverWaste}
                    onChange={e => setPaverWaste(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cost per Paver ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.05"
                      value={paverCostPerUnit}
                      onChange={e => setPaverCostPerUnit(Number(e.target.value))}
                      className="w-full pl-6 pr-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Base Sub-layers Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Base Layers & Sand Breakdown</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-600">Patio Area:</span>
                    <strong className="font-mono text-slate-900">{patioAreaSqFt} sq ft</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-600">1" Bedding Sand:</span>
                    <strong className="font-mono text-emerald-800">{paverRes.beddingSandCuYd.toFixed(2)} yd³ ({paverRes.beddingSandTons.toFixed(2)} tons)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-600">Polymeric Sand:</span>
                    <strong className="font-mono text-emerald-800">{paverRes.polymericSandBags} bags (50 lb)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">4" Compacted Base:</span>
                    <strong className="font-mono text-emerald-800">{paverRes.baseGravelTons.toFixed(2)} tons crusher run</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Proper base preparation prevents settling, rutting, and weed growth between joints.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={handleAddPaversToBOM}
                  className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add Pavers to Project BOM</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
              <p className="text-xs text-emerald-200 font-medium">Total Pavers Needed</p>
              <p className="text-2xl font-bold font-mono tracking-tight mt-1">
                {paverRes.totalPavers} units
              </p>
              <p className="text-[11px] text-emerald-300/90 mt-0.5">
                Includes {paverWaste}% cutting waste
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Bedding Sand (1" Depth)</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {paverRes.beddingSandTons.toFixed(2)} tons
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                {paverRes.beddingSandCuYd.toFixed(2)} cubic yards
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Polymeric Joint Sand</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {paverRes.polymericSandBags} bags
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                50 lb bags for 1/8" joints
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Estimated Paver Cost</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                ${(paverRes.totalPavers * paverCostPerUnit).toFixed(2)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                @ ${paverCostPerUnit}/paver
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Masonry Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
                Masonry Wall Dimensions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Wall Length (feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={wallLength}
                    onChange={e => setWallLength(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Wall Height (feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={wallHeight}
                    onChange={e => setWallHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Unit Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMasonryType('cmu')}
                    className={`p-3 text-xs rounded-lg border text-left transition-colors ${
                      masonryType === 'cmu'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">8" × 8" × 16" Concrete CMU Block</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Standard foundation or retaining block (~1.125 blocks per sq ft)
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMasonryType('brick')}
                    className={`p-3 text-xs rounded-lg border text-left transition-colors ${
                      masonryType === 'brick'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">Standard Modular Clay Brick</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      3-5/8" × 2-1/4" × 7-5/8" (~6.85 bricks per sq ft single wythe)
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Waste & Breakage Allowance (%)
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  step="1"
                  value={masonryWaste}
                  onChange={e => setMasonryWaste(Number(e.target.value))}
                  className="w-full sm:w-1/3 px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Wall Summary</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-600">Wall Face Area:</span>
                    <strong className="font-mono text-slate-900">{masonryRes.wallAreaSqFt} sq ft</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-600">{masonryRes.unitName}:</span>
                    <strong className="font-mono text-emerald-800">{masonryRes.unitCount} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type N/S Mortar:</span>
                    <strong className="font-mono text-emerald-800">{masonryRes.mortarBags80lb} bags (80 lb)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={handleAddMasonryToBOM}
                  className="w-full py-2 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add Masonry to Project BOM</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
              <p className="text-xs text-emerald-200 font-medium">Total Units Required</p>
              <p className="text-2xl font-bold font-mono tracking-tight mt-1">
                {masonryRes.unitCount} {masonryType === 'brick' ? 'bricks' : 'blocks'}
              </p>
              <p className="text-[11px] text-emerald-300/90 mt-0.5">
                Includes {masonryWaste}% waste allowance
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Mortar Mix (80 lb Bags)</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {masonryRes.mortarBags80lb} bags
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Type S or Type N masonry cement
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Wall Surface Area</p>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {masonryRes.wallAreaSqFt} sq ft
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {wallLength}' long × {wallHeight}' high
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
