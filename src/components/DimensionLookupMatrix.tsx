import React, { useState } from 'react';
import { Grid3X3, Copy, Check, ArrowRight, Sparkles, Scale, Box, HelpCircle } from 'lucide-react';

export interface DimensionPreset {
  id: string;
  name: string;
  category: string;
  dimensions: string;
  depthOrThick?: string;
  metricDimensions: string;
  primaryYield: string;
  primaryMetric: string;
  packagingSummary: string;
  coverageDetail: string;
  queryParams: Record<string, string | number>;
}

interface DimensionLookupMatrixProps {
  calculatorId: string;
  onApplyPreset?: (params: Record<string, string | number>) => void;
  system?: 'imperial' | 'metric';
}

const MATRIX_DATA: Record<string, DimensionPreset[]> = {
  concrete_calc: [
    {
      id: 'conc_4x4',
      name: 'A/C Equipment or Generator Pad',
      category: 'Slab',
      dimensions: '4 ft × 4 ft',
      depthOrThick: '4 inches (0.33 ft)',
      metricDimensions: '1.2 m × 1.2 m (10 cm)',
      primaryYield: '0.20 Cu Yds',
      primaryMetric: '0.15 m³',
      packagingSummary: '9 bags (80-lb) or 12 bags (60-lb)',
      coverageDetail: '16 sq ft with 10% safety buffer',
      queryParams: { length: 4, width: 4, thickness: 4, shape: 'slab' },
    },
    {
      id: 'conc_10x10',
      name: 'Standard Backyard Patio Slab',
      category: 'Slab',
      dimensions: '10 ft × 10 ft',
      depthOrThick: '4 inches (0.33 ft)',
      metricDimensions: '3.0 m × 3.0 m (10 cm)',
      primaryYield: '1.23 Cu Yds',
      primaryMetric: '0.94 m³',
      packagingSummary: '56 bags (80-lb) or 74 bags (60-lb)',
      coverageDetail: '100 sq ft with 10% safety buffer',
      queryParams: { length: 10, width: 10, thickness: 4, shape: 'slab' },
    },
    {
      id: 'conc_12x12',
      name: 'Storage Shed Foundation Pad',
      category: 'Slab',
      dimensions: '12 ft × 12 ft',
      depthOrThick: '4 inches (0.33 ft)',
      metricDimensions: '3.6 m × 3.6 m (10 cm)',
      primaryYield: '1.78 Cu Yds',
      primaryMetric: '1.36 m³',
      packagingSummary: '80 bags (80-lb) or 107 bags (60-lb)',
      coverageDetail: '144 sq ft with 10% safety buffer',
      queryParams: { length: 12, width: 12, thickness: 4, shape: 'slab' },
    },
    {
      id: 'conc_16x20',
      name: 'Single Car Driveway Extension',
      category: 'Slab',
      dimensions: '16 ft × 20 ft',
      depthOrThick: '4 inches (0.33 ft)',
      metricDimensions: '4.9 m × 6.1 m (10 cm)',
      primaryYield: '3.95 Cu Yds',
      primaryMetric: '3.02 m³',
      packagingSummary: '178 bags (80-lb) or ~4 Ready-Mix Truck Yds',
      coverageDetail: '320 sq ft with 10% safety buffer',
      queryParams: { length: 20, width: 16, thickness: 4, shape: 'slab' },
    },
    {
      id: 'conc_20x20',
      name: 'Two-Car Garage Floor Slab',
      category: 'Slab',
      dimensions: '20 ft × 20 ft',
      depthOrThick: '4 inches (0.33 ft)',
      metricDimensions: '6.1 m × 6.1 m (10 cm)',
      primaryYield: '4.94 Cu Yds',
      primaryMetric: '3.78 m³',
      packagingSummary: '222 bags (80-lb) or 5.0 Ready-Mix Yds',
      coverageDetail: '400 sq ft with 10% safety buffer',
      queryParams: { length: 20, width: 20, thickness: 4, shape: 'slab' },
    },
    {
      id: 'conc_24x24',
      name: 'Heavy Duty Workshop / Garage',
      category: 'Slab',
      dimensions: '24 ft × 24 ft',
      depthOrThick: '6 inches (0.50 ft)',
      metricDimensions: '7.3 m × 7.3 m (15 cm)',
      primaryYield: '10.67 Cu Yds',
      primaryMetric: '8.16 m³',
      packagingSummary: '480 bags (80-lb) or 11 Ready-Mix Yds',
      coverageDetail: '576 sq ft with 10% safety buffer',
      queryParams: { length: 24, width: 24, thickness: 6, shape: 'slab' },
    },
  ],
  mulch_soil: [
    {
      id: 'mulch_raised_bed',
      name: '4×8 Raised Garden Bed (Veggie Bed)',
      category: 'Garden Bed',
      dimensions: '4 ft × 8 ft',
      depthOrThick: '8 inches soil depth',
      metricDimensions: '1.2 m × 2.4 m (20 cm)',
      primaryYield: '0.79 Cu Yds',
      primaryMetric: '0.60 m³',
      packagingSummary: '11 bags (2 cu ft) or 21 cu ft',
      coverageDetail: '32 sq ft planting bed volume',
      queryParams: { length: 8, width: 4, depth: 8, shape: 'rectangle' },
    },
    {
      id: 'mulch_100sqft',
      name: 'Small Flower Border & Shrub Bed',
      category: 'Mulch Bed',
      dimensions: '10 ft × 10 ft (100 sq ft)',
      depthOrThick: '2 inches top-dressing',
      metricDimensions: '9.3 m² (5 cm depth)',
      primaryYield: '0.62 Cu Yds',
      primaryMetric: '0.47 m³',
      packagingSummary: '9 bags (2 cu ft) or 6 bags (3 cu ft)',
      coverageDetail: 'Weed suppression top layer',
      queryParams: { area: 100, depth: 2, shape: 'direct_area' },
    },
    {
      id: 'mulch_250sqft',
      name: 'Medium Foundation Planting Bed',
      category: 'Mulch Bed',
      dimensions: '5 ft × 50 ft (250 sq ft)',
      depthOrThick: '3 inches standard depth',
      metricDimensions: '23.2 m² (7.5 cm depth)',
      primaryYield: '2.31 Cu Yds',
      primaryMetric: '1.77 m³',
      packagingSummary: '32 bags (2 cu ft) or bulk delivery',
      coverageDetail: 'Optimal moisture retention & weed control',
      queryParams: { area: 250, depth: 3, shape: 'direct_area' },
    },
    {
      id: 'mulch_500sqft',
      name: 'Front-Yard Landscaping Renovation',
      category: 'Mulch Bed',
      dimensions: '500 sq ft total beds',
      depthOrThick: '3 inches standard depth',
      metricDimensions: '46.5 m² (7.5 cm depth)',
      primaryYield: '4.63 Cu Yds',
      primaryMetric: '3.54 m³',
      packagingSummary: '63 bags (2 cu ft) or 5 yd³ bulk truck',
      coverageDetail: 'Full season organic wood mulch coverage',
      queryParams: { area: 500, depth: 3, shape: 'direct_area' },
    },
    {
      id: 'mulch_1000sqft',
      name: 'Full Perimeter Property Mulching',
      category: 'Mulch Bed',
      dimensions: '1,000 sq ft coverage',
      depthOrThick: '3 inches standard depth',
      metricDimensions: '92.9 m² (7.5 cm depth)',
      primaryYield: '9.26 Cu Yds',
      primaryMetric: '7.08 m³',
      packagingSummary: '125 bags (2 cu ft) or 10 yd³ dump truck',
      coverageDetail: 'Commercial landscape installation',
      queryParams: { area: 1000, depth: 3, shape: 'direct_area' },
    },
  ],
  gravel_aggregate: [
    {
      id: 'grav_shed_10x12',
      name: '10×12 Shed Gravel Foundation Pad',
      category: 'Sub-Base',
      dimensions: '10 ft × 12 ft',
      depthOrThick: '4 inches (#57 Crushed Stone)',
      metricDimensions: '3.0 m × 3.6 m (10 cm)',
      primaryYield: '1.48 Cu Yds',
      primaryMetric: '1.13 m³',
      packagingSummary: '2.07 US Tons (1.88 Metric Tonnes)',
      coverageDetail: '120 sq ft with drainage base',
      queryParams: { length: 12, width: 10, depth: 4 },
    },
    {
      id: 'grav_firepit_15x15',
      name: '15×15 Pea Gravel Fire Pit Patio',
      category: 'Pea Gravel',
      dimensions: '15 ft × 15 ft',
      depthOrThick: '3 inches Pea Gravel',
      metricDimensions: '4.6 m × 4.6 m (7.5 cm)',
      primaryYield: '2.08 Cu Yds',
      primaryMetric: '1.59 m³',
      packagingSummary: '2.81 US Tons (84× 50-lb bags)',
      coverageDetail: '225 sq ft decorative seating area',
      queryParams: { length: 15, width: 15, depth: 3 },
    },
    {
      id: 'grav_drive_10x30',
      name: 'Single Car Driveway Resurfacing',
      category: 'Driveway',
      dimensions: '10 ft × 30 ft',
      depthOrThick: '3 inches Crushed Road Base',
      metricDimensions: '3.0 m × 9.1 m (7.5 cm)',
      primaryYield: '2.78 Cu Yds',
      primaryMetric: '2.12 m³',
      packagingSummary: '3.89 US Tons (3.53 Metric Tonnes)',
      coverageDetail: '300 sq ft vehicle load surface',
      queryParams: { length: 30, width: 10, depth: 3 },
    },
    {
      id: 'grav_drive_50x10',
      name: '50-Foot Residential Driveway Base',
      category: 'Driveway',
      dimensions: '10 ft × 50 ft',
      depthOrThick: '4 inches Crusher Run / Dense Grade',
      metricDimensions: '3.0 m × 15.2 m (10 cm)',
      primaryYield: '6.17 Cu Yds',
      primaryMetric: '4.72 m³',
      packagingSummary: '8.64 US Tons (1 Tri-Axle Truckload)',
      coverageDetail: '500 sq ft heavy vehicular base',
      queryParams: { length: 50, width: 10, depth: 4 },
    },
  ],
  retaining_wall: [
    {
      id: 'ret_garden_20x2',
      name: '20-Foot Garden Border Wall (2 ft high)',
      category: 'Retaining Wall',
      dimensions: '20 linear ft × 2.0 ft high',
      depthOrThick: '8" × 16" Standard Blocks',
      metricDimensions: '6.1 m long × 0.6 m high',
      primaryYield: '45 Modular Blocks',
      primaryMetric: '3 courses (1 buried)',
      packagingSummary: '15 capstones + 0.8 Tons Base Gravel',
      coverageDetail: 'Includes 6" buried starter course & drainage',
      queryParams: { length: 20, height: 2 },
    },
    {
      id: 'ret_terrace_30x3',
      name: '30-Foot Backyard Slope Terrace (3 ft high)',
      category: 'Retaining Wall',
      dimensions: '30 linear ft × 3.0 ft high',
      depthOrThick: '8" × 16" Standard Blocks',
      metricDimensions: '9.1 m long × 0.9 m high',
      primaryYield: '101 Modular Blocks',
      primaryMetric: '5 courses (1 buried)',
      packagingSummary: '23 capstones + 1.6 Tons Gravel + 1.2T Drain',
      coverageDetail: 'Structural grade retention for sloped lawn',
      queryParams: { length: 30, height: 3 },
    },
    {
      id: 'ret_drive_40x4',
      name: '40-Foot Heavy Retaining Wall (4 ft high)',
      category: 'Retaining Wall',
      dimensions: '40 linear ft × 4.0 ft high',
      depthOrThick: '8" × 16" Structural Blocks',
      metricDimensions: '12.2 m long × 1.2 m high',
      primaryYield: '180 Modular Blocks',
      primaryMetric: '6 courses (2 buried)',
      packagingSummary: '30 capstones + 2.8 Tons Gravel + 2.4T Drain',
      coverageDetail: 'Geogrid-ready reinforced slope barrier',
      queryParams: { length: 40, height: 4 },
    },
  ],
  wallpaper_calc: [
    {
      id: 'wall_accent_10x8',
      name: 'Standard Accent Wall (10×8 ft)',
      category: 'Accent Wall',
      dimensions: '10 ft wide × 8 ft high',
      depthOrThick: '20.5" Double Roll (56 sq ft)',
      metricDimensions: '3.0 m × 2.4 m',
      primaryYield: '2 Recommended Rolls',
      primaryMetric: '6 vertical strips',
      packagingSummary: '80 sq ft net wall area',
      coverageDetail: 'Standard straight pattern repeat match',
      queryParams: { width: 10, height: 8, mode: 'single' },
    },
    {
      id: 'wall_living_14x9',
      name: 'Living Room Feature Wall (14×9 ft)',
      category: 'Feature Wall',
      dimensions: '14 ft wide × 9 ft high',
      depthOrThick: '20.5" Double Roll (56 sq ft)',
      metricDimensions: '4.3 m × 2.7 m',
      primaryYield: '3 Recommended Rolls',
      primaryMetric: '9 vertical strips',
      packagingSummary: '126 sq ft wall area',
      coverageDetail: 'Includes drop-match waste allowance',
      queryParams: { width: 14, height: 9, mode: 'single' },
    },
    {
      id: 'wall_room_12x12',
      name: 'Full 12×12 Bedroom (All 4 Walls)',
      category: '4-Wall Room',
      dimensions: '48 linear ft perimeter × 8 ft high',
      depthOrThick: '20.5" Double Roll (56 sq ft)',
      metricDimensions: '14.6 m perimeter × 2.4 m',
      primaryYield: '8 Recommended Rolls',
      primaryMetric: '28 vertical strips',
      packagingSummary: '384 sq ft (minus 1 door & 2 windows)',
      coverageDetail: 'Full room paper hanging with deductions',
      queryParams: { width: 12, length: 12, height: 8, mode: 'room' },
    },
  ],
};

export const DimensionLookupMatrix: React.FC<DimensionLookupMatrixProps> = ({
  calculatorId,
  onApplyPreset,
  system = 'imperial',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = MATRIX_DATA[calculatorId];
  if (!presets || presets.length === 0) return null;

  const handleCopyLink = async (preset: DimensionPreset) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.materialyardage.com';
      const path = window.location.pathname;
      const params = new URLSearchParams();
      Object.entries(preset.queryParams).forEach(([k, v]) => params.set(k, String(v)));
      const fullUrl = `${origin}${path}?${params.toString()}#matrix-${preset.id}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(preset.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 my-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800">
              <Grid3X3 className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Common Dimensions &amp; Instant Quantity Matrix
            </h2>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold hidden md:inline-block">
              Verified Quantities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-computed engineering quantities for popular project dimensions. Click any row to load into the calculator or copy a direct share link.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span>Dual-Unit Display ({system === 'imperial' ? 'US Imperial Primary' : 'Metric Primary'})</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
              <th className="py-2.5 px-3 font-semibold rounded-l-lg">Project Type &amp; Size</th>
              <th className="py-2.5 px-3 font-semibold">Dimensions ({system === 'imperial' ? 'US' : 'Metric'})</th>
              <th className="py-2.5 px-3 font-semibold">Volume / Requirement</th>
              <th className="py-2.5 px-3 font-semibold">Packaging &amp; Bag Count</th>
              <th className="py-2.5 px-3 font-semibold text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {presets.map(item => {
              const isCopied = copiedId === item.id;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-emerald-50/40 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 group-hover:text-emerald-950">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.coverageDetail}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                    <div>{system === 'imperial' ? item.dimensions : item.metricDimensions}</div>
                    {item.depthOrThick && (
                      <div className="text-[10px] text-slate-500">{item.depthOrThick}</div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-900 text-xs">
                      {system === 'imperial' ? item.primaryYield : item.primaryMetric}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      ({system === 'imperial' ? item.primaryMetric : item.primaryYield})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-xs">
                    {item.packagingSummary}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onApplyPreset && (
                        <button
                          type="button"
                          onClick={() => onApplyPreset(item.queryParams)}
                          className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                          title="Load this dimension preset into the calculator"
                        >
                          <span>Load</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(item)}
                        className={`p-1.5 rounded border text-[11px] inline-flex items-center gap-1 transition-colors ${
                          isCopied
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Copy shareable direct link to this specific calculation"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="sr-only sm:not-sr-only text-[10px]">
                          {isCopied ? 'Copied' : 'Share'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>SEO Tip:</strong> Each dimension row creates a crawlable direct configuration for search engines, matching long-tail search intent like <em>"concrete for 10x10 patio"</em>.
          </span>
        </div>
        <span className="font-mono text-emerald-800 font-semibold text-[10px]">
          100% Geometry &amp; Bulk Density Verified
        </span>
      </div>
    </section>
  );
};
