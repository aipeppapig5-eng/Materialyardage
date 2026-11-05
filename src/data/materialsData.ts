export interface MaterialDensity {
  id: string;
  name: string;
  category: 'mulch' | 'soil' | 'gravel' | 'sand' | 'stone';
  tonsPerCuYd: number; // US short tons per cubic yard
  tonnesPerCuM: number;
  description: string;
  recommendedDepthInches?: number;
}

export const LANDSCAPE_MATERIALS: MaterialDensity[] = [
  {
    id: 'bark_shredded',
    name: 'Shredded Hardwood Bark Mulch',
    category: 'mulch',
    tonsPerCuYd: 0.40,
    tonnesPerCuM: 0.47,
    description: 'Fine, interlocking shreds that stay in place on slopes and retain moisture well.',
    recommendedDepthInches: 3,
  },
  {
    id: 'bark_cedar',
    name: 'Shredded Cedar Mulch',
    category: 'mulch',
    tonsPerCuYd: 0.35,
    tonnesPerCuM: 0.41,
    description: 'Aromatic, naturally rot and insect resistant, light golden-brown tint.',
    recommendedDepthInches: 3,
  },
  {
    id: 'bark_nuggets',
    name: 'Pine Bark Nuggets (Medium)',
    category: 'mulch',
    tonsPerCuYd: 0.28,
    tonnesPerCuM: 0.33,
    description: 'Chunky bark nuggets that decompose slowly, ideal for flat garden beds.',
    recommendedDepthInches: 3.5,
  },
  {
    id: 'wood_chips',
    name: 'Arborist Wood Chips',
    category: 'mulch',
    tonsPerCuYd: 0.45,
    tonnesPerCuM: 0.53,
    description: 'Fresh mixed tree chips; economical for pathways and woodland perimeters.',
    recommendedDepthInches: 4,
  },
  {
    id: 'rubber_mulch',
    name: 'Recycled Rubber Playground Mulch',
    category: 'mulch',
    tonsPerCuYd: 0.60,
    tonnesPerCuM: 0.71,
    description: 'Non-decomposing shock-absorbing surface for play areas and tree surrounds.',
    recommendedDepthInches: 3,
  },
  {
    id: 'topsoil_screened',
    name: 'Screened Loam Topsoil',
    category: 'soil',
    tonsPerCuYd: 1.10,
    tonnesPerCuM: 1.30,
    description: 'Rich organic loam free of stones, ideal for lawn seeding and grade fill.',
    recommendedDepthInches: 4,
  },
  {
    id: 'compost_organic',
    name: 'Aged Organic Compost',
    category: 'soil',
    tonsPerCuYd: 0.55,
    tonnesPerCuM: 0.65,
    description: 'Nutrient-rich decomposed organic matter for soil amendment and top dressing.',
    recommendedDepthInches: 2,
  },
  {
    id: 'garden_blend',
    name: 'Raised Bed Soil Mix (50/50 Soil & Compost)',
    category: 'soil',
    tonsPerCuYd: 0.85,
    tonnesPerCuM: 1.00,
    description: 'Well-draining premium blend optimized for raised planter boxes and vegetables.',
    recommendedDepthInches: 8,
  },
  {
    id: 'pea_gravel',
    name: 'Pea Gravel (3/8" Smooth River Rock)',
    category: 'gravel',
    tonsPerCuYd: 1.35,
    tonnesPerCuM: 1.60,
    description: 'Rounded pebbles comfortable underfoot for pathways, dog runs, and drainage.',
    recommendedDepthInches: 2.5,
  },
  {
    id: 'crushed_stone_57',
    name: '#57 Crushed Stone (3/4" Angular)',
    category: 'gravel',
    tonsPerCuYd: 1.40,
    tonnesPerCuM: 1.66,
    description: 'Angular limestone/granite that interlocks tightly for driveways and French drains.',
    recommendedDepthInches: 3,
  },
  {
    id: 'road_base',
    name: 'Crusher Run / Road Base (Gravel with Fines)',
    category: 'gravel',
    tonsPerCuYd: 1.60,
    tonnesPerCuM: 1.90,
    description: 'Compacts into an extremely solid sub-base for patios, pavers, and shed pads.',
    recommendedDepthInches: 4,
  },
  {
    id: 'decomposed_granite',
    name: 'Decomposed Granite (DG)',
    category: 'gravel',
    tonsPerCuYd: 1.50,
    tonnesPerCuM: 1.78,
    description: 'Natural golden compacted pathway material with fines, creates rustic firm trails.',
    recommendedDepthInches: 3,
  },
  {
    id: 'mason_sand',
    name: 'Masonry / Paver Bedding Sand',
    category: 'sand',
    tonsPerCuYd: 1.30,
    tonnesPerCuM: 1.54,
    description: 'Washed concrete sand for paver bedding layer (screeded to 1" uniform depth).',
    recommendedDepthInches: 1,
  },
  {
    id: 'river_rock_large',
    name: 'River Rock (1"-3" Decorative Cobble)',
    category: 'stone',
    tonsPerCuYd: 1.45,
    tonnesPerCuM: 1.72,
    description: 'Decorative dry creek beds, erosion control, and high-impact border accents.',
    recommendedDepthInches: 3,
  },
];

export interface FabricWidthPreset {
  name: string;
  widthInches: number;
  widthCm: number;
  typicalUses: string;
}

export const FABRIC_WIDTH_PRESETS: FabricWidthPreset[] = [
  {
    name: 'Quilting Cotton / Apparel Standard (44"-45")',
    widthInches: 44,
    widthCm: 112,
    typicalUses: 'Quilts, blouses, dresses, crafts, patchwork',
  },
  {
    name: 'Home Decor & Linen (54")',
    widthInches: 54,
    widthCm: 137,
    typicalUses: 'Curtains, slipcovers, throw pillows, Roman shades, light upholstery',
  },
  {
    name: 'Heavy Duty & Canvas (60")',
    widthInches: 60,
    widthCm: 152,
    typicalUses: 'Duck canvas, outdoor marine fabric, awnings, heavy drapery',
  },
  {
    name: 'Wide Utility / Backing (72")',
    widthInches: 72,
    widthCm: 183,
    typicalUses: 'Tablecloths, utility blankets, wide banner fabric',
  },
  {
    name: 'Extra-Wide Quilt Backing (108")',
    widthInches: 108,
    widthCm: 274,
    typicalUses: 'Seamless king/queen quilt backings, bed canopies',
  },
  {
    name: 'Wide Sheer Voile (118")',
    widthInches: 118,
    widthCm: 300,
    typicalUses: 'Seamless floor-to-ceiling sheer drapery panels',
  },
];

export interface PaverPreset {
  id: string;
  name: string;
  lengthInches: number;
  widthInches: number;
  depthInches: number;
}

export const PAVER_PRESETS: PaverPreset[] = [
  { id: 'holland_4x8', name: 'Holland Brick Paver (4" × 8")', lengthInches: 8, widthInches: 4, depthInches: 2.375 },
  { id: 'square_6x6', name: 'Cobble Square (6" × 6")', lengthInches: 6, widthInches: 6, depthInches: 2.375 },
  { id: 'rectangle_6x9', name: 'Cobble Rectangle (6" × 9")', lengthInches: 9, widthInches: 6, depthInches: 2.375 },
  { id: 'flag_12x12', name: 'Architectural Slab (12" × 12")', lengthInches: 12, widthInches: 12, depthInches: 2 },
  { id: 'large_16x16', name: 'Patio Stepper (16" × 16")', lengthInches: 16, widthInches: 16, depthInches: 1.75 },
  { id: 'modern_24x24', name: 'Modern Porcelain/Concrete Slab (24" × 24")', lengthInches: 24, widthInches: 24, depthInches: 2 },
];
