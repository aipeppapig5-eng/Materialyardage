import React from 'react';
import {
  ArrowRight,
  Calculator,
  Scissors,
  TreePine,
  Layers,
  Sparkles,
  Grid,
  CheckCircle,
} from 'lucide-react';
import { SEO_PAGES } from '../data/seoData';

interface RelatedCalculatorsProps {
  currentId: string;
  onSelectCalculator: (calculatorId: string) => void;
}

interface CalculatorMeta {
  id: string;
  name: string;
  badge: string;
  slug: string;
  category: 'fabric' | 'construction';
  description: string;
  bestPairedWith: string[]; // Calculator IDs commonly used together
  metrics: string;
}

const ALL_CALCULATORS: CalculatorMeta[] = [
  {
    id: 'fabric_cut',
    name: '2D Fabric Cut & Bolt Planner',
    badge: 'Sewing & Crafting',
    slug: 'fabric-yardage-calculator',
    category: 'fabric',
    description: 'Calculate usable linear yardage from pattern piece dimensions, 44"–60" bolt widths, and repeat alignments.',
    bestPairedWith: ['upholstery_cushions', 'curtains_drapery', 'quilt_backing'],
    metrics: 'Piece packing, offcut waste %, pattern repeats',
  },
  {
    id: 'curtains_drapery',
    name: 'Curtains & Drapery Calculator',
    badge: 'Window Treatments',
    slug: 'curtain-fabric-calculator',
    category: 'fabric',
    description: 'Estimate curtain yardage, panel widths, fullness ratios (1.5x–2.5x), double bottom hems, and header allowances.',
    bestPairedWith: ['fabric_cut', 'upholstery_cushions'],
    metrics: 'Fullness multiplier, rod drop, double hems',
  },
  {
    id: 'quilt_backing',
    name: 'Quilt Backing & Binding Calculator',
    badge: 'Quilting & Patchwork',
    slug: 'quilt-backing-binding-calculator',
    category: 'fabric',
    description: 'Determine quilt backing yardage with horizontal or vertical seams, 108" wide-backs, and continuous binding strips.',
    bestPairedWith: ['fabric_cut', 'curtains_drapery'],
    metrics: 'Horizontal vs vertical seams, mitered binding',
  },
  {
    id: 'upholstery_cushions',
    name: 'Upholstery & Box Cushion Estimator',
    badge: 'Furniture & Decor',
    slug: 'upholstery-cushion-calculator',
    category: 'fabric',
    description: 'Compute fabric yards for box cushions, foam thickness, boxing perimeter strips, and welt piping cord yardage.',
    bestPairedWith: ['fabric_cut', 'curtains_drapery'],
    metrics: 'Boxing strips, zipper plaques, piping cord',
  },
  {
    id: 'mulch_soil',
    name: 'Mulch & Garden Soil Calculator',
    badge: 'Landscaping & Beds',
    slug: 'mulch-calculator',
    category: 'construction',
    description: 'Calculate cubic yards and 2 or 3 cu ft retail bags for garden beds, tree rings, and raised planter boxes.',
    bestPairedWith: ['sod_turf', 'gravel_aggregate', 'paver_masonry'],
    metrics: 'Cubic yards, retail bags, depth coverage matrix',
  },
  {
    id: 'gravel_aggregate',
    name: 'Gravel & Crushed Stone Tonnage',
    badge: 'Driveways & Drainage',
    slug: 'gravel-calculator',
    category: 'construction',
    description: 'Estimate crushed stone, pea gravel, road base, and river rock with density conversion from cubic yards to tons.',
    bestPairedWith: ['paver_masonry', 'concrete_calc', 'mulch_soil'],
    metrics: 'US tons, metric tonnes, standard dump truckloads',
  },
  {
    id: 'concrete_calc',
    name: 'Concrete Slabs, Footings & Bags',
    badge: 'Masonry & Foundations',
    slug: 'concrete-calculator',
    category: 'construction',
    description: 'Accurately size concrete slabs, Sonotube columns, stairs, 40/60/80lb ready-mix bags, and 1:2:4 batch ratios.',
    bestPairedWith: ['gravel_aggregate', 'paver_masonry'],
    metrics: 'Cubic yards, 80lb bags, rebar grid, sand & gravel',
  },
  {
    id: 'paver_masonry',
    name: 'Paver Patios & Retaining Walls',
    badge: 'Hardscaping & Patios',
    slug: 'paver-calculator',
    category: 'construction',
    description: 'Calculate paver unit quantities, compacted gravel base, bedding sand depth, and polymeric joint sand bags.',
    bestPairedWith: ['gravel_aggregate', 'concrete_calc', 'sod_turf'],
    metrics: 'Paver count, bedding sand, polymeric joint sand',
  },
  {
    id: 'sod_turf',
    name: 'Sod & Turf Grass Pallet Calculator',
    badge: 'Lawns & Turf',
    slug: 'sod-calculator',
    category: 'construction',
    description: 'Estimate square footage of sod rolls (2\'×5\'), full pallets, cutting waste allowances, and soil amendment needs.',
    bestPairedWith: ['mulch_soil', 'paver_masonry', 'gravel_aggregate'],
    metrics: 'Lawn square footage, 2\'×5\' rolls, whole pallets',
  },
];

export const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({
  currentId,
  onSelectCalculator,
}) => {
  const currentCalc = ALL_CALCULATORS.find((c) => c.id === currentId);
  const currentCategory = currentCalc ? currentCalc.category : 'construction';

  // 1. Identify primary recommendations (frequently used together)
  const pairedIds = currentCalc?.bestPairedWith || [];
  const primaryRelated = ALL_CALCULATORS.filter(
    (c) => c.id !== currentId && pairedIds.includes(c.id)
  );

  // 2. Identify secondary recommendations from same category to complete grid
  const sameCategoryRemaining = ALL_CALCULATORS.filter(
    (c) => c.id !== currentId && c.category === currentCategory && !pairedIds.includes(c.id)
  );

  // 3. Complementary tools from opposite domain
  const oppositeCategory = ALL_CALCULATORS.filter(
    (c) => c.category !== currentCategory
  ).slice(0, 3);

  // Combined priority list (up to 4 primary cards + 3 complementary cards)
  const displayList = [...primaryRelated, ...sameCategoryRemaining].slice(0, 4);

  return (
    <section
      aria-label="Related Material Calculators"
      className="mt-12 pt-10 border-t border-slate-200"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Up Next & Related Estimation Tools</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Commonly Paired Calculators for Your Project
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Contractors and DIYers frequently combine these calculations to build a consolidated Bill of Materials (BOM) with accurate delivery tonnage and zero waste.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
            <CheckCircle className="w-3 h-3" />
            <span>SEO Internal Hub</span>
          </span>
        </div>
      </div>

      {/* Primary Recommended Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayList.map((item) => {
          const isFabric = item.category === 'fabric';
          return (
            <a
              key={item.id}
              href={`/${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCalculator(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                    {item.badge}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
                    {isFabric ? (
                      <Scissors className="w-3.5 h-3.5" />
                    ) : (
                      <TreePine className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors truncate max-w-[150px]">
                  {item.metrics}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Cross-Domain Exploration Banner */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-800 shadow-2xs shrink-0">
            {currentCategory === 'fabric' ? (
              <TreePine className="w-5 h-5" />
            ) : (
              <Scissors className="w-5 h-5" />
            )}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">
              {currentCategory === 'fabric'
                ? 'Also Planning Outdoor Renovations?'
                : 'Also Working on Interior Decor or Sewing?'}
            </h5>
            <p className="text-[11px] text-slate-500">
              {currentCategory === 'fabric'
                ? 'Calculate mulch cubic yards, concrete bags, gravel tonnage, and paver counts in our Landscaping Suite.'
                : 'Plan fabric yardage, curtains with drop allowances, quilt backing seams, and box cushions.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
          {oppositeCategory.map((opp) => (
            <a
              key={opp.id}
              href={`/${opp.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCalculator(opp.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-800 text-slate-700 transition-colors shadow-2xs"
            >
              {opp.name.split(' ')[0]} {opp.name.split(' ')[1] || ''}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
