import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConverterCategory = 'length' | 'area' | 'volume' | 'weight';

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [category, setCategory] = useState<ConverterCategory>('volume');
  const [val, setVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('cuyard');
  const [toUnit, setToUnit] = useState<string>('cuft');

  if (!isOpen) return null;

  // Conversion logic
  const convert = (value: number, cat: ConverterCategory, from: string, to: string): number => {
    if (isNaN(value)) return 0;
    if (from === to) return value;

    if (cat === 'volume') {
      // Base: cubic feet
      const toBase: Record<string, number> = {
        cuin: 1 / 1728,
        cuft: 1,
        cuyard: 27,
        cumeter: 35.3147,
        gallon: 0.133681,
        liter: 0.0353147,
      };
      const baseVal = value * (toBase[from] || 1);
      return baseVal / (toBase[to] || 1);
    }

    if (cat === 'length') {
      // Base: inches
      const toBase: Record<string, number> = {
        in: 1,
        ft: 12,
        yard: 36,
        cm: 0.393701,
        meter: 39.3701,
      };
      const baseVal = value * (toBase[from] || 1);
      return baseVal / (toBase[to] || 1);
    }

    if (cat === 'area') {
      // Base: sq feet
      const toBase: Record<string, number> = {
        sqin: 1 / 144,
        sqft: 1,
        sqyard: 9,
        sqmeter: 10.7639,
        acre: 43560,
      };
      const baseVal = value * (toBase[from] || 1);
      return baseVal / (toBase[to] || 1);
    }

    if (cat === 'weight') {
      // Base: pounds (lbs)
      const toBase: Record<string, number> = {
        oz: 1 / 16,
        lb: 1,
        ton: 2000, // US Short Ton
        kg: 2.20462,
        tonne: 2204.62, // Metric tonne
      };
      const baseVal = value * (toBase[from] || 1);
      return baseVal / (toBase[to] || 1);
    }

    return value;
  };

  const convertedValue = convert(val, category, fromUnit, toUnit);

  const unitOptions: Record<ConverterCategory, { id: string; label: string }[]> = {
    volume: [
      { id: 'cuyard', label: 'Cubic Yards (yd³)' },
      { id: 'cuft', label: 'Cubic Feet (ft³)' },
      { id: 'cumeter', label: 'Cubic Meters (m³)' },
      { id: 'gallon', label: 'US Gallons (gal)' },
      { id: 'liter', label: 'Liters (L)' },
      { id: 'cuin', label: 'Cubic Inches (in³)' },
    ],
    length: [
      { id: 'yard', label: 'Yards (yd)' },
      { id: 'meter', label: 'Meters (m)' },
      { id: 'ft', label: 'Feet (ft)' },
      { id: 'in', label: 'Inches (in)' },
      { id: 'cm', label: 'Centimeters (cm)' },
    ],
    area: [
      { id: 'sqft', label: 'Square Feet (ft²)' },
      { id: 'sqyard', label: 'Square Yards (yd²)' },
      { id: 'sqmeter', label: 'Square Meters (m²)' },
      { id: 'acre', label: 'Acres' },
      { id: 'sqin', label: 'Square Inches (in²)' },
    ],
    weight: [
      { id: 'ton', label: 'US Short Tons (2,000 lbs)' },
      { id: 'tonne', label: 'Metric Tonnes (1,000 kg)' },
      { id: 'lb', label: 'Pounds (lbs)' },
      { id: 'kg', label: 'Kilograms (kg)' },
      { id: 'oz', label: 'Ounces (oz)' },
    ],
  };

  const handleCategoryChange = (c: ConverterCategory) => {
    setCategory(c);
    const opts = unitOptions[c];
    setFromUnit(opts[0].id);
    setToUnit(opts[1].id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Universal Unit Converter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Category Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['volume', 'length', 'area', 'weight'] as ConverterCategory[]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  category === cat
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Quantity to Convert</label>
            <input
              type="number"
              step="any"
              value={val}
              onChange={e => setVal(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-base border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Unit Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">From Unit</label>
              <select
                value={fromUnit}
                onChange={e => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium"
              >
                {unitOptions[category].map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">To Unit</label>
              <select
                value={toUnit}
                onChange={e => setToUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-medium"
              >
                {unitOptions[category].map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversion Output Card */}
          <div className="bg-emerald-950 text-white rounded-xl p-5 text-center space-y-1">
            <span className="text-xs text-emerald-300/90 font-medium">Converted Result</span>
            <div className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
              {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </div>
            <div className="text-xs text-emerald-200">
              {val} {unitOptions[category].find(o => o.id === fromUnit)?.label} = {convertedValue.toFixed(4)} {unitOptions[category].find(o => o.id === toUnit)?.label}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
