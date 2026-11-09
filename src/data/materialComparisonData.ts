import mulchImg from '../assets/images/hardwood_mulch_bed_1794161332174.jpg';
import gravelImg from '../assets/images/gravel_pathway_stone_1794161348512.jpg';
import concreteImg from '../assets/images/concrete_slab_pour_1794161317532.jpg';
import paverImg from '../assets/images/paver_patio_herringbone_1794161363142.jpg';
import sodImg from '../assets/images/sod_turf_rolls_1794161378448.jpg';
import fabricCutImg from '../assets/images/fabric_cutting_table_1794161392311.jpg';

export interface MaterialComparisonOption {
  id: string;
  name: string;
  shortName: string;
  category: 'mulch_soil' | 'aggregates' | 'fabric' | 'pavers';
  defaultPricePerUnit: number;
  unitLabel: string;
  tonsPerCuYd: number; // Density
  recommendedDepthInches: number;
  durabilityYears: string;
  description: string;
  pros: string[];
  cons: string[];
  imageSrc?: string;
  bestFor: string;
  bagSizeLabel: string;
  bagsPerCuYd: number;
}

export const MATERIAL_COMPARISONS: Record<string, MaterialComparisonOption[]> = {
  mulch_soil: [
    {
      id: 'bark_nuggets',
      name: 'Pine Bark Nuggets (Medium)',
      shortName: 'Pine Bark',
      category: 'mulch_soil',
      defaultPricePerUnit: 42,
      unitLabel: 'yd³',
      tonsPerCuYd: 0.28,
      recommendedDepthInches: 3.5,
      durabilityYears: '2 to 3 years',
      description: 'Coarse, slow-decomposing coniferous bark nuggets that retain rich dark color and stay aerated.',
      pros: ['Slowest decomposition among organic mulches', 'Lightweight for easy handling & spreading', 'Acid-loving plant friendly (azaleas, blueberries)'],
      cons: ['Can float or shift during torrential downpours', 'Not ideal on steep slopes'],
      imageSrc: mulchImg,
      bestFor: 'Flat garden beds, acid-loving shrubs, perennial borders',
      bagSizeLabel: '2 cu ft bags',
      bagsPerCuYd: 13.5,
    },
    {
      id: 'bark_cedar',
      name: 'Shredded Cedar Mulch',
      shortName: 'Cedar Mulch',
      category: 'mulch_soil',
      defaultPricePerUnit: 46,
      unitLabel: 'yd³',
      tonsPerCuYd: 0.35,
      recommendedDepthInches: 3.0,
      durabilityYears: '1.5 to 2 years',
      description: 'Aromatic, golden-honey shredded mulch with natural thujaplicin oils that deter termites and pests.',
      pros: ['Natural insect & termite deterrence', 'Interlocking fibers resist wind & slope washouts', 'Slow decay with rich natural fragrance'],
      cons: ['Slightly higher initial investment', 'Can temporarily tie up soil surface nitrogen'],
      imageSrc: mulchImg,
      bestFor: 'Foundation landscaping near home walls, hill slopes, ornamental beds',
      bagSizeLabel: '2 cu ft bags',
      bagsPerCuYd: 13.5,
    },
    {
      id: 'topsoil_screened',
      name: 'Screened Loam Topsoil',
      shortName: 'Screened Topsoil',
      category: 'mulch_soil',
      defaultPricePerUnit: 34,
      unitLabel: 'yd³',
      tonsPerCuYd: 1.10,
      recommendedDepthInches: 4.0,
      durabilityYears: 'Permanent mineral base',
      description: 'Finely screened rich native loam free of rocks and debris, engineered for grading, lawn seeding, and deep fills.',
      pros: ['Economical bulk pricing for high-volume fills', 'Excellent moisture & nutrient holding capacity', 'Essential foundation for new turf and grade transitions'],
      cons: ['High hauling weight (1.1 tons/yd³)', 'No decorative groundcover aesthetic on surface'],
      imageSrc: sodImg,
      bestFor: 'Lawn seeding, regrading low spots, flower bed foundation soil',
      bagSizeLabel: '1 cu ft bags (or bulk delivery)',
      bagsPerCuYd: 27,
    },
    {
      id: 'bark_shredded',
      name: 'Shredded Hardwood Bark Mulch',
      shortName: 'Hardwood Mulch',
      category: 'mulch_soil',
      defaultPricePerUnit: 38,
      unitLabel: 'yd³',
      tonsPerCuYd: 0.40,
      recommendedDepthInches: 3.0,
      durabilityYears: '1 to 2 years',
      description: 'Dark brown, double-shredded oak and hardwood bark that forms a dense interlocking weed barrier.',
      pros: ['Excellent moisture conservation & weed barrier', 'Matts down tightly on slopes', 'Neutralizes alkaline soil as it breaks down'],
      cons: ['Needs annual refresh top-coat', 'Can compact tightly if spread over 4" deep'],
      imageSrc: mulchImg,
      bestFor: 'Sloped gardens, mixed perennial beds, residential front yards',
      bagSizeLabel: '2 cu ft bags',
      bagsPerCuYd: 13.5,
    },
    {
      id: 'compost_organic',
      name: 'Aged Organic Leaf & Mushroom Compost',
      shortName: 'Organic Compost',
      category: 'mulch_soil',
      defaultPricePerUnit: 44,
      unitLabel: 'yd³',
      tonsPerCuYd: 0.55,
      recommendedDepthInches: 2.0,
      durabilityYears: 'Annual biological cycle',
      description: 'Biologically active, nutrient-dense organic humus that enriches micro-biome, aerates clay, and feeds roots.',
      pros: ['Rich in microbial life & essential plant nutrients', 'Improves soil structure and water retention', 'Lower required depth (only 1.5–2" needed)'],
      cons: ['Decomposes faster than wood bark mulches', 'Requires regular replenishment'],
      imageSrc: mulchImg,
      bestFor: 'Vegetable gardens, annual flower beds, shrub top-dressing',
      bagSizeLabel: '1 cu ft bags',
      bagsPerCuYd: 27,
    },
    {
      id: 'rubber_mulch',
      name: 'Recycled Rubber Playground Mulch',
      shortName: 'Rubber Mulch',
      category: 'mulch_soil',
      defaultPricePerUnit: 115,
      unitLabel: 'yd³',
      tonsPerCuYd: 0.60,
      recommendedDepthInches: 3.0,
      durabilityYears: '10+ years',
      description: 'Non-decomposing shredded tire rubber with UV-stable dye, providing ASTM fall-cushioning safety.',
      pros: ['Never decomposes or rots', 'Does not attract termites, carpenter ants, or pests', 'Superior shock absorption for playground play areas'],
      cons: ['Highest upfront cost', 'Does not improve underlying biological soil health'],
      imageSrc: mulchImg,
      bestFor: 'Play sets, gym zones, zero-maintenance modern shrub rings',
      bagSizeLabel: '1.5 cu ft bags',
      bagsPerCuYd: 18,
    },
  ],

  aggregates: [
    {
      id: 'pea_gravel',
      name: 'Washed Pea Gravel (3/8" Smooth River Pebble)',
      shortName: 'Pea Gravel',
      category: 'aggregates',
      defaultPricePerUnit: 58,
      unitLabel: 'yd³',
      tonsPerCuYd: 1.35,
      recommendedDepthInches: 2.5,
      durabilityYears: 'Permanent stone',
      description: 'Naturally rounded multicolored river stones comfortable under bare feet and paws.',
      pros: ['Pleasant texture and crunch underfoot', 'Excellent surface drainage', 'Gentle on pets and dog runs'],
      cons: ['Can shift under heavy vehicle tires without stabilization grid', 'Requires rigid border edging'],
      imageSrc: gravelImg,
      bestFor: 'Garden walkways, fire pit circles, dog runs, patio accents',
      bagSizeLabel: '50 lb bags',
      bagsPerCuYd: 54,
    },
    {
      id: 'crushed_stone_57',
      name: '#57 Crushed Limestone (3/4" Angular)',
      shortName: '#57 Crushed Stone',
      category: 'aggregates',
      defaultPricePerUnit: 52,
      unitLabel: 'yd³',
      tonsPerCuYd: 1.40,
      recommendedDepthInches: 3.0,
      durabilityYears: 'Permanent stone',
      description: 'Angular mechanical fractured stone that locks together firmly under vehicular pressure.',
      pros: ['Superior vehicle traction & tire lock', 'Resists rutting and washouts on driveways', 'High-flow rate for French drains and septic fields'],
      cons: ['Sharp edges — not comfortable for barefoot walking', 'Dusty during initial placement before rain wash'],
      imageSrc: gravelImg,
      bestFor: 'Driveway top surfaces, French drainage trenches, shed pads',
      bagSizeLabel: '50 lb bags',
      bagsPerCuYd: 56,
    },
    {
      id: 'road_base',
      name: 'Crusher Run / Road Base (Gravel with Fines)',
      shortName: 'Road Base (Crusher Run)',
      category: 'aggregates',
      defaultPricePerUnit: 46,
      unitLabel: 'yd³',
      tonsPerCuYd: 1.60,
      recommendedDepthInches: 4.0,
      durabilityYears: 'Permanent sub-base',
      description: 'Engineered mixture of angular 3/4" rock blended with stone dust fines that compact into concrete-like density.',
      pros: ['Highest compaction strength and weight bearing', 'Economical cost per cubic yard', 'Prevents base settling under pavers and slabs'],
      cons: ['Poor vertical drainage (holds water rather than free-draining)', 'Becomes muddy if left uncompacted or unsealed'],
      imageSrc: gravelImg,
      bestFor: 'Sub-base under pavers, concrete patio base, heavy equipment pads',
      bagSizeLabel: '50 lb bags',
      bagsPerCuYd: 64,
    },
  ],

  fabric: [
    {
      id: 'cotton_44',
      name: 'Quilting Cotton Standard (44" Bolt)',
      shortName: '44" Cotton',
      category: 'fabric',
      defaultPricePerUnit: 12,
      unitLabel: 'yd',
      tonsPerCuYd: 0,
      recommendedDepthInches: 0,
      durabilityYears: 'Washable textile',
      description: 'Standard 44/45" medium-weight 100% woven cotton bolt, ideal for patchwork and crafts.',
      pros: ['Huge selection of designer prints & colors', 'Very stable grainline for cutting precision', 'Affordable per linear yard'],
      cons: ['Requires seaming for quilts wider than 40 inches', 'Higher cutting waste on wide items'],
      imageSrc: fabricCutImg,
      bestFor: 'Quilt blocks, apparel, pillow cases, small accessories',
      bagSizeLabel: 'Linear yards',
      bagsPerCuYd: 1,
    },
    {
      id: 'decor_54',
      name: 'Home Decor & Linen (54" Bolt)',
      shortName: '54" Decor Linen',
      category: 'fabric',
      defaultPricePerUnit: 24,
      unitLabel: 'yd',
      tonsPerCuYd: 0,
      recommendedDepthInches: 0,
      durabilityYears: 'Heavy duty',
      description: 'Versatile 54" wide home furnishing textile with substantial drape and abrasion resistance.',
      pros: ['Fewer seam joins on drapery panels & sofa cushions', 'Higher rub count (Wyzenbeek 15,000+)', 'Tailored luxury finish'],
      cons: ['Higher cost per yard than craft cotton', 'Requires sharper shears/rotary blades'],
      imageSrc: fabricCutImg,
      bestFor: 'Curtains, sofa cushions, slipcovers, Roman shades',
      bagSizeLabel: 'Linear yards',
      bagsPerCuYd: 1,
    },
    {
      id: 'wide_108',
      name: 'Extra-Wide Quilt Backing (108" Bolt)',
      shortName: '108" Wide-Back',
      category: 'fabric',
      defaultPricePerUnit: 22,
      unitLabel: 'yd',
      tonsPerCuYd: 0,
      recommendedDepthInches: 0,
      durabilityYears: 'Heirloom bedding',
      description: 'Double-wide 108" fabric that covers full, queen, and king quilts in a single unbroken sheet.',
      pros: ['Zero center seams across the back of the quilt', 'Saves significant piecing and pressing labor', 'Lower total yardage required for large quilts'],
      cons: ['Bulkier roll to handle on home cutting tables', 'Limited pattern options compared to 44" cotton'],
      imageSrc: fabricCutImg,
      bestFor: 'Queen and King size quilt backings, seamless table drapes',
      bagSizeLabel: 'Linear yards',
      bagsPerCuYd: 1,
    },
  ],
};

/**
 * Calculates live comparison metrics between a baseline and candidate materials
 */
export function calculateMaterialComparisonMetrics(
  candidate: MaterialComparisonOption,
  baseline: {
    volumeCuYd: number;
    areaSqFt: number;
    depthInches: number;
    unitPrice: number;
  }
) {
  // Volume adjustment: if candidate has a specific recommended depth and area is known
  let adjustedVolumeCuYd = baseline.volumeCuYd;
  if (baseline.areaSqFt > 0 && candidate.recommendedDepthInches > 0) {
    adjustedVolumeCuYd = (baseline.areaSqFt * (candidate.recommendedDepthInches / 12)) / 27;
  }

  const baselineTotalCost = baseline.volumeCuYd * baseline.unitPrice;
  const candidateTotalCost = adjustedVolumeCuYd * candidate.defaultPricePerUnit;
  const costDifference = candidateTotalCost - baselineTotalCost;
  const costPercentDiff = baselineTotalCost > 0 ? (costDifference / baselineTotalCost) * 100 : 0;

  const totalWeightTons = adjustedVolumeCuYd * candidate.tonsPerCuYd;
  const totalWeightLbs = totalWeightTons * 2000;
  const estimatedBags = Math.ceil(adjustedVolumeCuYd * candidate.bagsPerCuYd);

  return {
    adjustedVolumeCuYd: Number(adjustedVolumeCuYd.toFixed(2)),
    unitPrice: candidate.defaultPricePerUnit,
    totalCost: Number(candidateTotalCost.toFixed(2)),
    costDifference: Number(costDifference.toFixed(2)),
    costPercentDiff: Number(costPercentDiff.toFixed(1)),
    totalWeightTons: Number(totalWeightTons.toFixed(2)),
    totalWeightLbs: Math.round(totalWeightLbs),
    estimatedBags,
  };
}
