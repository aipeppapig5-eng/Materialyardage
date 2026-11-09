import React, { useState, useMemo } from 'react';
import { FabricCutPiece, BOMItem, MeasurementSystem } from '../../types';
import { FABRIC_WIDTH_PRESETS } from '../../data/materialsData';
import { calculateFabricPacking } from '../../utils/fabricMath';
import { FabricCutVisualizer } from '../FabricCutVisualizer';
import { Plus, Trash2, ShoppingCart, HelpCircle } from 'lucide-react';
import { useDynamicCalculatorSEO, readCalculatorQueryParams } from '../../utils/dynamicSEO';
import { DynamicSEOPresets } from '../DynamicSEOPresets';
import { ProjectPhotoPreview } from '../ProjectPhotoPreview';

interface FabricYardageCalcProps {
  system: MeasurementSystem;
  onAddToBOM: (item: Omit<BOMItem, 'id' | 'timestamp'>) => void;
}

export const FabricYardageCalc: React.FC<FabricYardageCalcProps> = ({
  system,
  onAddToBOM,
}) => {
  const units = system === 'imperial' ? 'in' : 'cm';
  const initialParams = useMemo(() => readCalculatorQueryParams(), []);

  // Usable fabric width
  const [selectedWidthPreset, setSelectedWidthPreset] = useState<number>(
    Number(initialParams.bolt) || 54
  );
  const [customWidth, setCustomWidth] = useState<number>(Number(initialParams.bolt) || 54);
  const [isCustomWidth, setIsCustomWidth] = useState<boolean>(false);

  // Allowances & Repeats
  const [seamAllowance, setSeamAllowance] = useState<number>(0.5); // inches or cm
  const [rowBuffer, setRowBuffer] = useState<number>(0.5);
  const [wastePercent, setWastePercent] = useState<number>(8); // extra purchase margin %
  const [verticalRepeat, setVerticalRepeat] = useState<number>(0); // pattern repeat

  // Piece inventory
  const [pieces, setPieces] = useState<FabricCutPiece[]>([
    { id: '1', label: 'Main Body Panel', length: 32, width: 22, quantity: 2, allowRotation: false, color: '#2563EB' },
    { id: '2', label: 'Seat Cushion Top', length: 24, width: 24, quantity: 2, allowRotation: true, color: '#059669' },
    { id: '3', label: 'Side Boxing Strip', length: 18, width: 6, quantity: 4, allowRotation: true, color: '#D97706' },
  ]);

  // Form for adding a new piece
  const [newLabel, setNewLabel] = useState<string>('');
  const [newLength, setNewLength] = useState<number>(20);
  const [newWidth, setNewWidth] = useState<number>(15);
  const [newQty, setNewQty] = useState<number>(1);
  const [newAllowRot, setNewAllowRot] = useState<boolean>(true);

  // Unit price for budgeting
  const [pricePerYard, setPricePerYard] = useState<number>(24);

  const activeWidth = isCustomWidth ? customWidth : selectedWidthPreset;

  const result = useMemo(() => {
    return calculateFabricPacking(
      pieces,
      activeWidth,
      seamAllowance,
      rowBuffer,
      wastePercent,
      verticalRepeat
    );
  }, [pieces, activeWidth, seamAllowance, rowBuffer, wastePercent, verticalRepeat]);

  const totalPiecesCount = useMemo(() => pieces.reduce((s, p) => s + p.quantity, 0), [pieces]);

  // Dynamically generate and inject long-tail SEO metadata
  const dynamicSEO = useDynamicCalculatorSEO(
    {
      calculatorId: 'fabric_cut',
      usableWidth: activeWidth,
      totalPieces: totalPiecesCount,
      totalYards: result.yardsNeeded,
      wastePercent,
      unitPrice: pricePerYard,
    },
    { updateUrlQuery: true }
  );

  const presets = [
    {
      label: '6 Chair Cushions (54" Bolt)',
      sublabel: '6 pieces · 2.3 yds',
      active: pieces.length === 1 && pieces[0]?.label === 'Chair Cushion',
      onClick: () => {
        setIsCustomWidth(false);
        setSelectedWidthPreset(54);
        setPieces([
          { id: '1', label: 'Chair Cushion', length: 22, width: 20, quantity: 6, allowRotation: true, color: '#2563EB' },
        ]);
      },
    },
    {
      label: 'Tote Bag Pattern Set (44" Bolt)',
      sublabel: '5 pieces · 1.6 yds',
      active: pieces.length === 3 && pieces[0]?.label === 'Tote Body',
      onClick: () => {
        setIsCustomWidth(false);
        setSelectedWidthPreset(44);
        setPieces([
          { id: '1', label: 'Tote Body', length: 18, width: 16, quantity: 2, allowRotation: false, color: '#2563EB' },
          { id: '2', label: 'Lining Panel', length: 18, width: 16, quantity: 2, allowRotation: false, color: '#059669' },
          { id: '3', label: 'Shoulder Strap', length: 30, width: 4, quantity: 2, allowRotation: true, color: '#D97706' },
        ]);
      },
    },
    {
      label: 'Pillow Trio (18" & 20")',
      sublabel: '6 panels · 2.1 yds',
      active: pieces.length === 2 && pieces[0]?.label === '20" Pillow Top',
      onClick: () => {
        setIsCustomWidth(false);
        setSelectedWidthPreset(54);
        setPieces([
          { id: '1', label: '20" Pillow Top', length: 20, width: 20, quantity: 2, allowRotation: true, color: '#2563EB' },
          { id: '2', label: '18" Accent Pillow', length: 18, width: 18, quantity: 4, allowRotation: true, color: '#7C3AED' },
        ]);
      },
    },
  ];

  const handleAddPiece = () => {
    if (!newLabel.trim() || newLength <= 0 || newWidth <= 0 || newQty <= 0) return;
    const newPiece: FabricCutPiece = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      length: Number(newLength),
      width: Number(newWidth),
      quantity: Number(newQty),
      allowRotation: newAllowRot,
    };
    setPieces([...pieces, newPiece]);
    setNewLabel('');
  };

  const handleRemovePiece = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  const handleAddEstimateToBOM = () => {
    const qty = system === 'imperial' ? result.yardsNeeded : result.metersNeeded;
    const unitName = system === 'imperial' ? 'yards' : 'meters';
    onAddToBOM({
      name: `Fabric (${activeWidth}" Bolt, ${pieces.reduce((s, p) => s + p.quantity, 0)} pieces)`,
      category: 'fabric',
      calculatorType: 'Fabric Yardage & Cut Planner',
      primaryQuantity: Number(qty.toFixed(2)),
      primaryUnit: unitName,
      secondarySummary: `${result.placedPieces.length} cuts, ${result.wastePercentage.toFixed(1)}% waste`,
      unitPrice: pricePerYard,
      notes: `${pieces.map(p => `${p.quantity}x ${p.label} (${p.length}x${p.width}${units})`).join(', ')}`,
    });
  };

  return (
    <div className="space-y-6">
      <DynamicSEOPresets
        presetsTitle="Popular Pattern Cuts & Long-Tail Sewing Projects"
        presets={presets}
        canonicalPath="/fabric-yardage-calculator"
        currentQuery={dynamicSEO?.queryString}
        currentSummary={dynamicSEO?.h1Context}
      />

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bolt Width & Pattern Repeat */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
            1. Fabric Bolt Specs
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Usable Bolt Width ({units})
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {FABRIC_WIDTH_PRESETS.slice(0, 4).map(preset => {
                const val = system === 'imperial' ? preset.widthInches : preset.widthCm;
                const isSelected = !isCustomWidth && selectedWidthPreset === val;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedWidthPreset(val);
                      setIsCustomWidth(false);
                    }}
                    className={`px-2.5 py-2 text-xs rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-bold">{val} {units}</div>
                    <div className="text-[10px] text-slate-500 truncate">{preset.typicalUses}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="customWidthCheck"
                checked={isCustomWidth}
                onChange={e => setIsCustomWidth(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="customWidthCheck" className="text-xs text-slate-700 font-medium">
                Custom Bolt Width:
              </label>
              {isCustomWidth && (
                <input
                  type="number"
                  min="10"
                  max="150"
                  step="0.5"
                  value={customWidth}
                  onChange={e => setCustomWidth(Number(e.target.value))}
                  className="w-24 px-2.5 py-1 text-xs border border-slate-300 rounded-md font-mono"
                />
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Vertical Pattern Repeat ({units})
                </label>
                <span className="text-[11px] text-slate-500 font-mono">0 for plain/solid</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.25"
                value={verticalRepeat}
                onChange={e => setVerticalRepeat(Math.max(0, Number(e.target.value)))}
                placeholder="e.g. 18 or 24 for plaids/florals"
                className="w-full mt-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Seam Allowance ({units})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.125"
                  value={seamAllowance}
                  onChange={e => setSeamAllowance(Math.max(0, Number(e.target.value)))}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Purchase Margin (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={wastePercent}
                  onChange={e => setWastePercent(Math.max(0, Number(e.target.value)))}
                  className="w-full mt-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">
                Price per {system === 'imperial' ? 'Yard' : 'Meter'} ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={pricePerYard}
                onChange={e => setPricePerYard(Math.max(0, Number(e.target.value)))}
                className="w-full mt-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md font-mono"
              />
            </div>
          </div>
        </div>

        {/* Middle & Right: Pieces Inventory & Adding Pieces */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                2. Project Cut Pieces
              </h2>
              <p className="text-xs text-slate-500">
                Enter all individual panels or patterns. The algorithm automatically arranges them to minimize fabric purchase.
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
              {pieces.reduce((s, p) => s + p.quantity, 0)} total cuts
            </span>
          </div>

          {/* Pieces Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Color</th>
                  <th className="py-2.5 px-3">Piece Label</th>
                  <th className="py-2.5 px-3">Cut Length ({units})</th>
                  <th className="py-2.5 px-3">Cut Width ({units})</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Rotate 90°</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pieces.map((piece) => (
                  <tr key={piece.id} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3">
                      <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: piece.color || '#2563EB' }} />
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">{piece.label}</td>
                    <td className="py-2 px-3 font-mono tabular-nums">{piece.length} {units}</td>
                    <td className="py-2 px-3 font-mono tabular-nums">{piece.width} {units}</td>
                    <td className="py-2 px-3 font-mono tabular-nums font-semibold">{piece.quantity}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[11px] px-1.5 py-0.5 rounded ${piece.allowRotation ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {piece.allowRotation ? 'Allowed' : 'Locked Grain'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleRemovePiece(piece.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Add Piece Form */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3">
            <span className="text-xs font-semibold text-slate-700 mb-2 block">
              + Add Another Cut Piece
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Piece Name (e.g. Back Panel)"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder={`Length (${units})`}
                  value={newLength}
                  onChange={e => setNewLength(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder={`Width (${units})`}
                  value={newWidth}
                  onChange={e => setNewWidth(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={newQty}
                  onChange={e => setNewQty(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddPiece}
                  className="w-full py-1.5 px-3 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="newAllowRotCheck"
                checked={newAllowRot}
                onChange={e => setNewAllowRot(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="newAllowRotCheck" className="text-[11px] text-slate-600 select-none">
                Can rotate 90° across fabric (uncheck if fabric has directional nap, stripe, or grain)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards & Results Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-200 font-medium">Estimated Purchase Yardage</p>
          <p className="text-2xl font-bold font-mono tracking-tight mt-1">
            {system === 'imperial' ? `${result.yardsNeeded.toFixed(2)} yd` : `${result.metersNeeded.toFixed(2)} m`}
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-0.5 font-mono">
            = {result.totalLengthNeeded.toFixed(1)} {units} total length
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Cut Efficiency & Waste</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {(100 - result.wastePercentage).toFixed(1)}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Off-cut waste: <span className="font-mono">{result.wastePercentage.toFixed(1)}%</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Cuts Placed</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {result.placedPieces.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Across {activeWidth}{units} bolt width
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Estimated Material Cost</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
              ${(result.yardsNeeded * pricePerYard).toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleAddEstimateToBOM}
            className="w-full mt-2 py-1.5 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Project BOM</span>
          </button>
        </div>
      </div>

      {/* Interactive 2D Visualizer with Real Photo Toggle */}
      <ProjectPhotoPreview
        calculatorId="fabric_cut"
        title="Interactive Cut Diagram & Cutting Studio Photo"
        metricsOverlay={{
          primaryValue: system === 'imperial' ? `${result.yardsNeeded.toFixed(2)} yd` : `${result.metersNeeded.toFixed(2)} m`,
          primaryLabel: 'Required Fabric',
          secondaryValue: `${(100 - result.wastePercentage).toFixed(0)}%`,
          secondaryLabel: 'Yield Efficiency',
        }}
      >
        <FabricCutVisualizer
          usableWidth={activeWidth}
          totalLength={result.totalLengthNeeded}
          placedPieces={result.placedPieces}
          wastePercentage={result.wastePercentage}
          verticalRepeat={verticalRepeat}
          units={units}
        />
      </ProjectPhotoPreview>

      {/* Helpful Instructions */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Professional Cutting Tips</span>
        </div>
        <p>
          • <strong>Selvedge Edges:</strong> Always exclude 0.5" to 1" of outer woven fringe selvedge on both sides from your usable bolt width.
        </p>
        <p>
          • <strong>Directional Nap & Velvet:</strong> Fabrics like velvet, corduroy, and directional prints must always run in the same orientation. Keep "Rotate 90°" unchecked for these textiles.
        </p>
        <p>
          • <strong>Shrinkage Allowance:</strong> Natural fibers like linen, cotton, and wool typically shrink 3% to 6% during pre-washing. A 8% purchase margin is factored in by default.
        </p>
      </div>
    </div>
  );
};
