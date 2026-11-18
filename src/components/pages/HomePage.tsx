import React, { useMemo, useState } from 'react';
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Scale,
  ArrowRightLeft,
  Box,
  Printer,
  FolderKanban,
  ShoppingBag,
  Calculator,
  Compass,
  Code2,
} from 'lucide-react';
import { CALCULATOR_IMAGES } from '../../data/uiImages';
import { GUIDES_DATA } from '../../data/guidesData';
import { AdSlot } from '../AdSlot';

export interface HomePageProps {
  onSelectCalculator: (calculatorId: string, customRoutePath?: string, subType?: string) => void;
  onSelectGuide: (slug: string) => void;
  onOpenConverter: () => void;
  onOpenReference: () => void;
  onOpenComparison: () => void;
  onOpen3DPreview: () => void;
  onOpenPrintSheet: () => void;
  onOpenBOM: () => void;
  onOpenProjectManager: () => void;
  onOpenEmbed: () => void;
  bomCount: number;
  projectsCount: number;
}

interface HomeCardItem {
  id: string;
  calculatorId: string;
  title: string;
  subtitle: string;
  href: string;
  routePath: string;
  subType?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  keywords: string;
  actionType?: 'converter';
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCalculator,
  onSelectGuide,
  onOpenConverter,
  onOpenReference,
  onOpenComparison,
  onOpen3DPreview,
  onOpenPrintSheet,
  onOpenBOM,
  onOpenProjectManager,
  onOpenEmbed,
  bomCount,
  projectsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const soilGardenCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'topsoil',
        calculatorId: 'mulch_soil',
        title: 'Topsoil Calculator',
        subtitle: 'Cubic yards, tons and 40-lb bags for lawn leveling',
        href: '/topsoil-calculator',
        routePath: 'topsoil-calculator',
        subType: 'topsoil',
        imageSrc: CALCULATOR_IMAGES.mulch_soil.src,
        imageAlt: 'Screened loam topsoil pile spread across garden lawn bed',
        imagePosition: 'object-center',
        keywords: 'topsoil dirt loam soil leveling grading 40lb bags cubic yards',
      },
      {
        id: 'raised_bed_soil',
        calculatorId: 'raised_bed_soil',
        title: 'Raised Garden Bed Soil Calculator',
        subtitle: '4×4, 4×8 presets & topsoil/compost/aeration mix',
        href: '/raised-bed-soil-calculator',
        routePath: 'raised-bed-soil-calculator',
        imageSrc: CALCULATOR_IMAGES.raised_bed_soil.src,
        imageAlt: 'Raised wooden garden bed filled with topsoil, compost, and perlite blend',
        imagePosition: 'object-bottom',
        keywords: 'raised garden bed soil 4x4 4x8 mels mix topsoil compost aeration perlite',
      },
      {
        id: 'potting_soil',
        calculatorId: 'potting_soil',
        title: 'Potting Mix & Planter Volume',
        subtitle: 'Quarts and gallons for round pots, window boxes & grow bags',
        href: '/potting-soil-calculator',
        routePath: 'potting-soil-calculator',
        imageSrc: CALCULATOR_IMAGES.potting_soil.src,
        imageAlt: 'Flower pots, fabric grow bags, and planter boxes filled with potting mix',
        imagePosition: 'object-top',
        keywords: 'potting soil mix planter pot grow bag window box quarts gallons liters',
      },
      {
        id: 'compost',
        calculatorId: 'mulch_soil',
        title: 'Compost Calculator',
        subtitle: 'Lawn topdressing volume and organic soil amendments',
        href: '/compost-calculator',
        routePath: 'compost-calculator',
        subType: 'compost',
        imageSrc: CALCULATOR_IMAGES.sod_turf.src,
        imageAlt: 'Rich organic compost spread across prepared turf soil and garden bed',
        imagePosition: 'object-bottom',
        keywords: 'compost organic blend topdressing soil amendment raised planter bed',
      },
      {
        id: 'fill_dirt',
        calculatorId: 'mulch_soil',
        title: 'Fill Dirt Calculator',
        subtitle: 'Heavy grading, hole filling & foundation backfilling',
        href: '/fill-dirt-calculator',
        routePath: 'fill-dirt-calculator',
        subType: 'fill_dirt',
        imageSrc: CALCULATOR_IMAGES.gravel_aggregate.src,
        imageAlt: 'Clean compacted fill dirt and grading subsoil for site leveling',
        imagePosition: 'object-bottom',
        keywords: 'fill dirt subsoil heavy grading hole filling backfill compaction yardage',
      },
      {
        id: 'lawn_sand',
        calculatorId: 'gravel_aggregate',
        title: 'Sand & Topdressing Calculator',
        subtitle: 'Masonry or play sand for leveling bumpy lawns',
        href: '/lawn-leveling-sand-calculator',
        routePath: 'lawn-leveling-sand-calculator',
        subType: 'lawn_sand',
        imageSrc: CALCULATOR_IMAGES.sod_turf.src,
        imageAlt: 'Leveling sand topdressing brushed evenly across healthy residential turf',
        imagePosition: 'object-top',
        keywords: 'lawn leveling sand topdressing masonry play sand quarter inch half inch',
      },
    ],
    []
  );

  const gravelStoneCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'pea_gravel',
        calculatorId: 'gravel_aggregate',
        title: 'Pea Gravel Calculator',
        subtitle: 'Walkways, dog runs & play areas in cubic yards and tons',
        href: '/pea-gravel-calculator',
        routePath: 'pea-gravel-calculator',
        subType: 'pea_gravel',
        imageSrc: CALCULATOR_IMAGES.gravel_aggregate.src,
        imageAlt: 'Rounded pea gravel pathway bordered by clean steel landscape edging',
        imagePosition: 'object-center',
        keywords: 'pea gravel walkway dog run play area tons cubic yards 50lb bags',
      },
      {
        id: 'crushed_stone',
        calculatorId: 'gravel_aggregate',
        title: 'Crushed Stone & #57 Gravel',
        subtitle: 'Driveways, French drains & shed gravel foundations',
        href: '/crushed-stone-calculator',
        routePath: 'crushed-stone-calculator',
        subType: 'crushed_stone',
        imageSrc: CALCULATOR_IMAGES.gravel_aggregate.src,
        imageAlt: 'Angular #57 crushed stone aggregate for driveways and French drains',
        imagePosition: 'object-top',
        keywords: 'crushed stone 57 gravel driveway french drain shed foundation crusher run',
      },
      {
        id: 'decomposed_granite',
        calculatorId: 'gravel_aggregate',
        title: 'Decomposed Granite (DG) Calculator',
        subtitle: 'Includes 15%–20% compaction factor for paths & patios',
        href: '/decomposed-granite-calculator',
        routePath: 'decomposed-granite-calculator',
        subType: 'decomposed_granite',
        imageSrc: CALCULATOR_IMAGES.paver_masonry.src,
        imageAlt: 'Compacted decomposed granite garden pathway and outdoor patio floor',
        imagePosition: 'object-bottom',
        keywords: 'decomposed granite dg stabilized pathway patio compaction factor tons',
      },
      {
        id: 'river_rock',
        calculatorId: 'gravel_aggregate',
        title: 'River Rock & Landscaping Stone',
        subtitle: 'Tonnage for decorative dry creek beds and borders',
        href: '/river-rock-calculator',
        routePath: 'river-rock-calculator',
        subType: 'river_rock',
        imageSrc: CALCULATOR_IMAGES.gravel_aggregate.src,
        imageAlt: 'Smooth decorative river rock cobbles lining a dry creek drainage bed',
        imagePosition: 'object-bottom',
        keywords: 'river rock landscaping stone dry creek bed cobble border tons',
      },
      {
        id: 'paver_base',
        calculatorId: 'paver_masonry',
        title: 'Paver Base & Sand Calculator',
        subtitle: 'Compacted gravel base layer & 1-inch bedding sand',
        href: '/paver-base-calculator',
        routePath: 'paver-base-calculator',
        subType: 'paver_base',
        imageSrc: CALCULATOR_IMAGES.paver_masonry.src,
        imageAlt: 'Interlocking patio pavers set over compacted gravel base and 1-inch bedding sand',
        imagePosition: 'object-center',
        keywords: 'paver base bedding sand gravel sub base polymeric sand patio pavers',
      },
      {
        id: 'retaining_wall',
        calculatorId: 'retaining_wall',
        title: 'Retaining Wall & Backfill Gravel',
        subtitle: 'Wall blocks, capstones & drainage gravel behind the wall',
        href: '/retaining-wall-calculator',
        routePath: 'retaining-wall-calculator',
        imageSrc: CALCULATOR_IMAGES.retaining_wall.src,
        imageAlt: 'Interlocking segmental stone retaining wall with gravel drainage backfill',
        imagePosition: 'object-center',
        keywords: 'retaining wall srw blocks capstones drainage gravel backfill geogrid',
      },
    ],
    []
  );

  const mulchGroundCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'mulch',
        calculatorId: 'mulch_soil',
        title: 'Mulch Calculator',
        subtitle: 'Cubic yards and standard 2 cu ft bags for flower beds',
        href: '/mulch-calculator',
        routePath: 'mulch-calculator',
        subType: 'mulch',
        imageSrc: CALCULATOR_IMAGES.mulch_soil.src,
        imageAlt: 'Dark shredded hardwood bark mulch surrounding perennial garden beds',
        imagePosition: 'object-bottom',
        keywords: 'mulch bark cedar hardwood 2 cu ft bags cubic yards flower bed depth',
      },
      {
        id: 'playground_mulch',
        calculatorId: 'mulch_soil',
        title: 'Playground Wood Chips & Rubber Mulch',
        subtitle: 'Fall-height safety depth recommendations (6" to 12")',
        href: '/playground-mulch-calculator',
        routePath: 'playground-mulch-calculator',
        subType: 'playground',
        imageSrc: CALCULATOR_IMAGES.mulch_soil.src,
        imageAlt: 'Engineered wood fiber playground mulch installed at safe fall-height depth',
        imagePosition: 'object-top',
        keywords: 'playground mulch wood chips rubber mulch fall height safety depth 6 9 12 inch',
      },
      {
        id: 'pine_straw',
        calculatorId: 'pine_straw',
        title: 'Pine Straw Bale Calculator',
        subtitle: 'Converts square footage into standard or jumbo bales',
        href: '/pine-straw-calculator',
        routePath: 'pine-straw-calculator',
        imageSrc: CALCULATOR_IMAGES.pine_straw.src,
        imageAlt: 'Fresh longleaf pine straw needle ground cover tucked cleanly in garden beds',
        imagePosition: 'object-center',
        keywords: 'pine straw bales longleaf jumbo square bales needles southern mulch',
      },
    ],
    []
  );

  const lawnFenceCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'sod_turf',
        calculatorId: 'sod_turf',
        title: 'Sod Pallet & Roll Calculator',
        subtitle: 'Lawn square footage, rolls & 450/500 sq ft pallets',
        href: '/sod-calculator',
        routePath: 'sod-calculator',
        imageSrc: CALCULATOR_IMAGES.sod_turf.src,
        imageAlt: 'Fresh green sod turf rolls stacked neatly on wooden delivery pallets',
        imagePosition: 'object-center',
        keywords: 'sod turf grass lawn rolls 450 500 sq ft pallets fescue bluegrass',
      },
      {
        id: 'grass_seed',
        calculatorId: 'grass_seed',
        title: 'Grass Seed Coverage Calculator',
        subtitle: 'New lawn vs. overseeding rates by grass species',
        href: '/grass-seed-calculator',
        routePath: 'grass-seed-calculator',
        imageSrc: CALCULATOR_IMAGES.grass_seed.src,
        imageAlt: 'Lush seeded green lawn comparing new lawn seeding and fall overseeding',
        imagePosition: 'object-bottom',
        keywords: 'grass seed coverage new lawn overseeding tall fescue bluegrass rye bermuda',
      },
      {
        id: 'fence_post',
        calculatorId: 'fence_post',
        title: 'Fence Post & Concrete Bag Calculator',
        subtitle: 'Post count, rails, pickets & 50-lb/80-lb concrete bags',
        href: '/fence-post-calculator',
        routePath: 'fence-post-calculator',
        imageSrc: CALCULATOR_IMAGES.fence_post.src,
        imageAlt: 'Fence post concrete footings, horizontal rails, and dog-ear privacy pickets',
        imagePosition: 'object-center',
        keywords: 'fence post calculator rails pickets 50lb 80lb concrete bags linear feet',
      },
    ],
    []
  );

  const constructionCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'concrete',
        calculatorId: 'concrete_calc',
        title: 'Concrete Calculators',
        subtitle: 'Slabs, footings, columns, 80lb bags and mix ratios',
        href: '/concrete-calculator',
        routePath: 'concrete-calculator',
        imageSrc: CALCULATOR_IMAGES.concrete_calc.src,
        imageAlt: 'Crew screeding freshly poured residential concrete slab with wood forms',
        imagePosition: 'object-center',
        keywords: 'concrete slab footing pier column steps 40lb 60lb 80lb bags cement 1:2:4',
      },
      {
        id: 'gravel_hub',
        calculatorId: 'gravel_aggregate',
        title: 'Gravel & Aggregates Hub',
        subtitle: 'Custom bulk stone densities, truckloads and metric tonnes',
        href: '/gravel-calculator',
        routePath: 'gravel-calculator',
        imageSrc: CALCULATOR_IMAGES.gravel_aggregate.src,
        imageAlt: 'Bulk crushed stone aggregate and sand stockpiles for construction foundations',
        imagePosition: 'object-top',
        keywords: 'gravel aggregate road base crusher run limestone drainage french drain',
      },
      {
        id: 'masonry_paver',
        calculatorId: 'paver_masonry',
        title: 'Masonry & Paver Patio Calculator',
        subtitle: 'Patio pavers, herringbone layouts and polymeric joints',
        href: '/paving/paver',
        routePath: 'paving/paver',
        subType: 'pavers',
        imageSrc: CALCULATOR_IMAGES.paver_masonry.src,
        imageAlt: 'Interlocking concrete patio pavers installed in a herringbone pattern',
        imagePosition: 'object-center',
        keywords: 'paver patio walkway driveway herringbone polymeric sand bedding',
      },
      {
        id: 'block_brick',
        calculatorId: 'paver_masonry',
        title: 'Block, Brick & Mortar Tools',
        subtitle: 'CMU concrete blocks, brick courses and mortar bags',
        href: '/masonry/block',
        routePath: 'masonry/block',
        subType: 'cmu',
        imageSrc: CALCULATOR_IMAGES.retaining_wall.src,
        imageAlt: 'Modular concrete masonry block and split-face stone wall construction',
        imagePosition: 'object-bottom',
        keywords: 'cmu block cinder brick wall mortar type n type s 8x8x16 masonry',
      },
    ],
    []
  );

  const fabricCards: HomeCardItem[] = useMemo(
    () => [
      {
        id: 'fabric_yardage',
        calculatorId: 'fabric_cut',
        title: 'Fabric Yardage',
        subtitle: '2D bolt cut planner, offcuts and pattern repeats',
        href: '/fabric-yardage-calculator',
        routePath: 'fabric-yardage-calculator',
        imageSrc: CALCULATOR_IMAGES.fabric_cut.src,
        imageAlt: 'Fabric bolt layout with measuring tape, shears, and sewing pattern pieces',
        imagePosition: 'object-center',
        keywords: 'fabric yardage 2d cut planner bolt width 44 54 60 sewing pattern repeats',
      },
      {
        id: 'curtain',
        calculatorId: 'curtains_drapery',
        title: 'Curtain Calculator',
        subtitle: 'Window drop, fullness 1.5x–2.5x and double hems',
        href: '/curtain-fabric-calculator',
        routePath: 'curtain-fabric-calculator',
        imageSrc: CALCULATOR_IMAGES.curtains_drapery.src,
        imageAlt: 'Sheer linen drapery panels hanging cleanly beside sunlit window',
        imagePosition: 'object-center',
        keywords: 'curtain drapery window panel fullness pinch pleat hem header puddle',
      },
      {
        id: 'upholstery',
        calculatorId: 'upholstery_cushions',
        title: 'Upholstery Calculator',
        subtitle: 'Box cushions, foam inserts, boxing and piping cord',
        href: '/upholstery-cushion-calculator',
        routePath: 'upholstery-cushion-calculator',
        imageSrc: CALCULATOR_IMAGES.upholstery_cushions.src,
        imageAlt: 'Tailored upholstery box cushions and textured furniture fabric bolts',
        imagePosition: 'object-center',
        keywords: 'upholstery box cushion sofa foam boxing strips welting piping cord',
      },
      {
        id: 'quilt',
        calculatorId: 'quilt_backing',
        title: 'Quilt Calculator',
        subtitle: 'Backing seams, 108" wide-back and mitered binding',
        href: '/quilt-backing-binding-calculator',
        routePath: 'quilt-backing-binding-calculator',
        imageSrc: CALCULATOR_IMAGES.quilt_backing.src,
        imageAlt: 'Colorful patchwork quilt top sewn on quilting table',
        imagePosition: 'object-center',
        keywords: 'quilt backing binding strips 108 wide back horizontal vertical seams',
      },
      {
        id: 'wallpaper',
        calculatorId: 'wallpaper_calc',
        title: 'Wallpaper & Decor Calculator',
        subtitle: 'Accent walls, pattern repeat drops and paste',
        href: '/wallpaper-calculator',
        routePath: 'wallpaper-calculator',
        imageSrc: CALCULATOR_IMAGES.wallpaper_calc.src,
        imageAlt: 'Patterned designer wallpaper accent wall in contemporary living space',
        imagePosition: 'object-center',
        keywords: 'wallpaper wallcovering rolls straight match half drop repeat paste rooms',
      },
      {
        id: 'unit_converter',
        calculatorId: 'fabric_cut',
        title: 'Material & Fabric Unit Converter',
        subtitle: 'Yards, meters, inches, cubic yards and tons',
        href: '/fabric/unit-converter',
        routePath: 'fabric/unit-converter',
        actionType: 'converter',
        imageSrc: CALCULATOR_IMAGES.fabric_cut.src,
        imageAlt: 'Tailor tape measure and textile swatch grid for unit conversions',
        imagePosition: 'object-left',
        keywords: 'unit converter yards meters inches feet cubic yards square feet tons tonnes',
      },
    ],
    []
  );

  const allCards = useMemo(
    () => [
      ...soilGardenCards,
      ...gravelStoneCards,
      ...mulchGroundCards,
      ...lawnFenceCards,
      ...constructionCards,
      ...fabricCards,
    ],
    [
      soilGardenCards,
      gravelStoneCards,
      mulchGroundCards,
      lawnFenceCards,
      constructionCards,
      fabricCards,
    ]
  );

  const allGuides = useMemo(() => Object.values(GUIDES_DATA), []);

  const query = searchQuery.trim().toLowerCase();

  const matchingCards = useMemo(() => {
    if (!query) return [];
    return allCards.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.subtitle.toLowerCase().includes(query) ||
        c.keywords.toLowerCase().includes(query)
    );
  }, [allCards, query]);

  const matchingGuides = useMemo(() => {
    if (!query) return [];
    return allGuides.filter(
      (g) =>
        g.title.toLowerCase().includes(query) ||
        g.summary.toLowerCase().includes(query) ||
        g.categoryLabel.toLowerCase().includes(query)
    );
  }, [allGuides, query]);

  const handleCardClick = (e: React.MouseEvent, card: HomeCardItem) => {
    e.preventDefault();
    if (card.actionType === 'converter') {
      onOpenConverter();
      return;
    }
    onSelectCalculator(card.calculatorId, card.routePath, card.subType);
  };

  const renderCard = (card: HomeCardItem) => {
    const imgBroken = failedImages[card.id];
    return (
      <a
        key={card.id}
        href={card.href}
        onClick={(e) => handleCardClick(e, card)}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl"
      >
        <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90 transition-colors group-hover:border-emerald-600/60">
          {!imgBroken ? (
            <img
              src={card.imageSrc}
              alt={card.imageAlt}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setFailedImages((prev) => ({ ...prev, [card.id]: true }))}
              className={`w-full h-full object-cover ${
                card.imagePosition || 'object-center'
              } transition-transform duration-300 group-hover:scale-[1.03]`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-emerald-50 flex flex-col items-center justify-center p-4 text-center">
              <Calculator className="w-7 h-7 text-emerald-700 mb-1.5" />
              <span className="text-xs font-semibold text-slate-700">{card.title}</span>
            </div>
          )}
        </div>
        <div className="mt-2.5 px-0.5">
          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between gap-2">
            <span>{card.title}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-emerald-700 transition-all shrink-0" />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{card.subtitle}</p>
        </div>
      </a>
    );
  };

  return (
    <main className="flex-1 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Centered Hero & Instant Search */}
        <section className="text-center space-y-4">
          <p className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-tight">
            MaterialYardage.com
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Free Material Calculators for Every Project
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate material quantities, estimate project costs and plan your next project with confidence.
          </p>

          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search calculators, materials and guides..."
                aria-label="Search calculators, materials and guides"
                className="w-full pl-11 pr-10 py-3 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-700 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/15 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Live Search Results Mode */}
        {query ? (
          <section className="space-y-8 border-t border-slate-200 pt-8" aria-label="Search results">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                Search Results for "{searchQuery.trim()}"
              </h2>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
              >
                Show all sections
              </button>
            </div>

            {matchingCards.length === 0 && matchingGuides.length === 0 ? (
              <div className="py-12 px-6 text-center border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
                <p className="text-sm font-semibold text-slate-800">
                  No matching calculators or guides found.
                </p>
                <p className="text-xs text-slate-500">
                  Try searching for topsoil, raised bed, pea gravel, pine straw, grass seed, fence post, concrete, or curtains.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  Browse All Calculators
                </button>
              </div>
            ) : (
              <>
                {matchingCards.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 tracking-wide">
                      Calculators ({matchingCards.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                      {matchingCards.map(renderCard)}
                    </div>
                  </div>
                )}

                {matchingGuides.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 tracking-wide">
                      Project Guides ({matchingGuides.length})
                    </h3>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {matchingGuides.map((guide) => (
                        <a
                          key={guide.id}
                          href={`/guides/${guide.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectGuide(guide.slug);
                          }}
                          className="block p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{guide.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">
                                {guide.categoryLabel} · {guide.readTime}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            {/* 1. Bulk Soil & Garden Beds */}
            <section id="landscaping-materials" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  1. Bulk Soil &amp; Garden Beds
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">6 calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {soilGardenCards.map(renderCard)}
              </div>
            </section>

            {/* 2. Gravel, Stone & Hardscaping */}
            <section id="gravel-hardscaping" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  2. Gravel, Stone &amp; Hardscaping
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">6 calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {gravelStoneCards.map(renderCard)}
              </div>
            </section>

            {/* 3. Mulch & Ground Cover */}
            <section id="mulch-ground-cover" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  3. Mulch &amp; Ground Cover
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">3 calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {mulchGroundCards.map(renderCard)}
              </div>
            </section>

            {/* 4. Lawn, Sod & Fencing */}
            <section id="lawn-sod-fencing" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  4. Lawn, Sod &amp; Fencing
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">3 calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {lawnFenceCards.map(renderCard)}
              </div>
            </section>

            {/* 5. Concrete & Masonry Construction */}
            <section id="construction-materials" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  5. Concrete &amp; Masonry Construction
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">4 calculators</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {constructionCards.map(renderCard)}
              </div>
            </section>

            {/* 6. Fabric & Sewing */}
            <section id="fabric-sewing" className="border-t border-slate-200 pt-8 space-y-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  6. Fabric &amp; Sewing
                </h2>
                <span className="text-xs text-slate-500 whitespace-nowrap">6 tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {fabricCards.map(renderCard)}
              </div>
            </section>

            {/* Responsive Mid-Page AdSense Placement */}
            <div className="pt-2">
              <AdSlot slotId="5928371920" format="auto" label="Sponsored Suppliers & Equipment" />
            </div>

            {/* 7. Material Reference Centre */}
            <section id="reference-centre" className="border-t border-slate-200 pt-8 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  7. Material Reference Centre
                </h2>
                <span className="text-xs text-slate-500">Engineering tables &amp; workspace tools</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/reference/material-density-chart"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenReference();
                  }}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        Material Density &amp; Weight Chart
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Tons per cubic yard and tonnes per cubic meter
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </a>

                <a
                  href="/reference/conversion-tables"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenConverter();
                  }}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        Unit Conversion Tables
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Cubic yards, cubic feet, liters, meters and bags
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </a>

                <a
                  href="/materials"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenComparison();
                  }}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Calculator className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        Side-by-Side Material Comparison
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Compare pine bark, cedar mulch, gravel, soil and sand
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={onOpen3DPreview}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Box className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        3D Project Layer Schematic
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Inspect base depth, bedding sand and structural layers
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenBOM}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ShoppingBag className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        Multi-Zone Project BOM ({bomCount} items)
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Combined cost sheet, delivery estimator and CSV export
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenPrintSheet}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-600/60 hover:bg-slate-50/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Printer className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        Print Job-Site Specification Sheet
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        Clean supplier order checklist across {projectsCount} saved projects
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>
            </section>

            {/* 8. Project Planning Guides */}
            <section id="project-guides" className="border-t border-slate-200 pt-8 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  8. Project Planning Guides
                </h2>
                <a
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCalculator('guides', 'guides');
                  }}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 whitespace-nowrap flex items-center gap-1"
                >
                  <span>Browse all guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {allGuides.slice(0, 6).map((guide) => (
                  <a
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectGuide(guide.slug);
                    }}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{guide.summary}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{guide.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{guide.readTime}</span>
                      </div>
                    </div>
                    <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </section>

            {/* 9. How Our Calculations Work */}
            <section id="how-calculations-work" className="border-t border-slate-200 pt-8 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  9. How Our Calculations Work
                </h2>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCalculator('about', 'about');
                  }}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 whitespace-nowrap flex items-center gap-1"
                >
                  <span>Engineering methodology</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">Calibrated Bulk Densities</h3>
                  <p>
                    Bulk weight conversions cross-reference commercial quarry and agricultural standards so cubic yards convert accurately into US short tons and metric tonnes.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">2D Bolt &amp; Pattern Nesting</h3>
                  <p>
                    Textile calculators model real bolt widths (44", 54", 60", 108"), grainline constraints, seam allowances, and vertical pattern repeat rounding.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">Compaction &amp; Waste Buffers</h3>
                  <p>
                    Construction and masonry estimates include configurable sub-base settlement, concrete pour spillage margins, and mitered corner or edge cut allowances.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={onOpenProjectManager}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-emerald-800 cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Saved Projects ({projectsCount})</span>
                </button>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={onOpenEmbed}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-emerald-800 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Embed Free Calculator Widget</span>
                </button>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCalculator('about', 'about');
                  }}
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-emerald-800"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  <span>About &amp; Standards</span>
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};
