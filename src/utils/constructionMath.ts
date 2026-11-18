import { BedShape, MulchResult, AggregateResult, ConcreteResult } from '../types';

/**
 * Calculates area in square feet based on shape geometry
 */
export function calculateAreaSqFt(
  shape: BedShape,
  dim1: number, // length / diameter / outer diameter / base / direct area
  dim2: number = 0, // width / inner diameter / height
): number {
  switch (shape) {
    case 'rectangle':
      return Math.max(0, dim1 * dim2);
    case 'circle': {
      const radius = dim1 / 2;
      return Math.max(0, Math.PI * radius * radius);
    }
    case 'ring': {
      const rOuter = dim1 / 2;
      const rInner = dim2 / 2;
      const area = Math.PI * (rOuter * rOuter - rInner * rInner);
      return Math.max(0, area);
    }
    case 'triangle':
      return Math.max(0, 0.5 * dim1 * dim2);
    case 'direct_area':
      return Math.max(0, dim1);
    default:
      return 0;
  }
}

/**
 * Mulch & Soil Volume, Weight, and Bag calculation
 */
export function calculateMulch(
  areaSqFt: number,
  depthInches: number,
  tonsPerCuYd: number = 0.40,
  wasteOrCompactionPercent: number = 5
): MulchResult {
  const depthFeet = depthInches / 12;
  const rawVolumeCuFt = areaSqFt * depthFeet;
  const factor = 1 + (wasteOrCompactionPercent || 0) / 100;
  const volumeCuFt = rawVolumeCuFt * factor;
  const volumeCuYd = volumeCuFt / 27;

  // Metric equivalents
  const areaSqM = areaSqFt * 0.092903;
  const volumeCuM = volumeCuYd * 0.764555;

  const weightTons = volumeCuYd * tonsPerCuYd;
  const weightTonnes = weightTons * 0.907185;

  // Retail bags rounded up to nearest whole bag
  const bags1CuFt = Math.ceil(volumeCuFt / 1.0);
  const bags1_5CuFt = Math.ceil(volumeCuFt / 1.5);
  const bags2CuFt = Math.ceil(volumeCuFt / 2.0);
  const bags3CuFt = Math.ceil(volumeCuFt / 3.0);
  // 40-lb retail topsoil / compost bags (~0.75 cu ft each)
  const bags40lb = Math.ceil(volumeCuFt / 0.75);

  return {
    areaSqFt,
    areaSqM,
    volumeCuFt,
    volumeCuYd,
    volumeCuM,
    weightTons,
    weightTonnes,
    bags1CuFt,
    bags1_5CuFt,
    bags2CuFt,
    bags3CuFt,
    bags40lb,
  };
}

/**
 * Generates a coverage comparison matrix for 2", 3", 4", and 5" depths
 */
export function generateCoverageMatrix(areaSqFt: number, tonsPerCuYd: number = 0.40) {
  const depths = [1.5, 2, 3, 4, 5];
  return depths.map(depth => {
    const res = calculateMulch(areaSqFt, depth, tonsPerCuYd, 0);
    return {
      depth,
      cuYd: res.volumeCuYd,
      bags2CuFt: res.bags2CuFt,
      bags3CuFt: res.bags3CuFt,
      weightTons: res.weightTons,
    };
  });
}

/**
 * Gravel, Sand & Crushed Aggregates
 */
export function calculateAggregate(
  areaSqFt: number,
  depthInches: number,
  tonsPerCuYd: number = 1.40,
  compactionPercent: number = 10
): AggregateResult {
  const depthFeet = depthInches / 12;
  const factor = 1 + (compactionPercent || 0) / 100;
  const volumeCuFt = areaSqFt * depthFeet * factor;
  const volumeCuYd = volumeCuFt / 27;
  const volumeCuM = volumeCuYd * 0.764555;

  const weightTons = volumeCuYd * tonsPerCuYd;
  const weightTonnes = weightTons * 0.907185;

  // 50 lb retail bags: 1 ton = 2000 lbs = 40 bags of 50 lb
  const totalLbs = weightTons * 2000;
  const bags50lb = Math.ceil(totalLbs / 50);

  // Standard tandem dump truck carries ~10 cubic yards
  const truckLoads10Yd = Math.ceil(volumeCuYd / 10 * 10) / 10;

  return {
    volumeCuYd,
    volumeCuM,
    volumeCuFt,
    weightTons,
    weightTonnes,
    bags50lb,
    truckLoads10Yd,
  };
}

/**
 * Concrete Calculations (Slab, Sonotube Cylinder Pier, and Steps)
 */
export type ConcreteType = 'slab' | 'column' | 'steps';

export interface ConcreteParams {
  type: ConcreteType;
  // Slab params:
  lengthFt: number;
  widthFt: number;
  thicknessInches: number;
  // Column params:
  diameterInches: number;
  depthInches: number;
  columnCount: number;
  // Step params:
  stepCount: number;
  stepWidthFt: number;
  treadInches: number;
  riserInches: number;
  // Common:
  spillageWastePercent: number; // usually 5% - 10%
}

export function calculateConcrete(p: ConcreteParams): ConcreteResult {
  let rawVolumeCuFt = 0;

  if (p.type === 'slab') {
    rawVolumeCuFt = p.lengthFt * p.widthFt * (p.thicknessInches / 12);
  } else if (p.type === 'column') {
    const radiusFt = (p.diameterInches / 2) / 12;
    const depthFt = p.depthInches / 12;
    const singlePierVolume = Math.PI * radiusFt * radiusFt * depthFt;
    rawVolumeCuFt = singlePierVolume * p.columnCount;
  } else if (p.type === 'steps') {
    // Steps are nested blocks: sum of i * tread * riser * width for i = 1 to stepCount
    const treadFt = p.treadInches / 12;
    const riserFt = p.riserInches / 12;
    let sumStepAreas = 0;
    for (let i = 1; i <= p.stepCount; i++) {
      sumStepAreas += i * (treadFt * riserFt);
    }
    rawVolumeCuFt = sumStepAreas * p.stepWidthFt;
  }

  const factor = 1 + (p.spillageWastePercent || 0) / 100;
  const volumeCuFt = rawVolumeCuFt * factor;
  const volumeCuYd = volumeCuFt / 27;

  // Bag yields:
  // 40 lb bag yields ~0.30 cu ft
  // 60 lb bag yields ~0.45 cu ft
  // 80 lb bag yields ~0.60 cu ft
  const bags40lb = Math.ceil(volumeCuFt / 0.30);
  const bags60lb = Math.ceil(volumeCuFt / 0.45);
  const bags80lb = Math.ceil(volumeCuFt / 0.60);

  // 1:2:4 Volumetric Mix (Cement : Sand : Coarse Stone)
  // Per 1 cubic yard (27 cu ft):
  // ~5.5 bags (94 lb each) Portland cement
  // ~14 cu ft sand
  // ~21 cu ft stone
  // ~30 gallons water
  const portlandBags94lb = Math.ceil(volumeCuYd * 5.5);
  const sandCuFt = Math.round(volumeCuYd * 14 * 10) / 10;
  const gravelCuFt = Math.round(volumeCuYd * 21 * 10) / 10;
  const waterGallons = Math.round(volumeCuYd * 30);

  return {
    volumeCuYd,
    volumeCuM: volumeCuYd * 0.764555,
    volumeCuFt,
    bags40lb,
    bags60lb,
    bags80lb,
    portlandBags94lb,
    sandCuFt,
    gravelCuFt,
    waterGallons,
  };
}

/**
 * Paver Patio & Walkway calculation
 */
export function calculatePavers(
  areaSqFt: number,
  paverLengthInches: number,
  paverWidthInches: number,
  jointGapInches: number = 0.125,
  wastePercent: number = 10
) {
  const paverSqFt = ((paverLengthInches + jointGapInches) * (paverWidthInches + jointGapInches)) / 144;
  const rawCount = areaSqFt / paverSqFt;
  const totalPavers = Math.ceil(rawCount * (1 + wastePercent / 100));

  // Bedding sand: 1 inch uniform depth over the area
  const beddingSandCuYd = (areaSqFt * (1 / 12)) / 27;
  const beddingSandTons = beddingSandCuYd * 1.30;

  // Polymeric joint sand: approx 1 x 50lb bag per 60 sq ft for standard 2.375" pavers with 1/8" joints
  const polymericSandBags = Math.ceil(areaSqFt / 60);

  // Compacted base gravel (road base 4" depth recommended)
  const baseGravelCuYd = (areaSqFt * (4 / 12)) / 27 * 1.15; // 15% compaction
  const baseGravelTons = baseGravelCuYd * 1.60;

  return {
    paverSqFt,
    totalPavers,
    beddingSandCuYd,
    beddingSandTons,
    polymericSandBags,
    baseGravelCuYd,
    baseGravelTons,
  };
}

/**
 * Brick & CMU Block Wall calculation
 */
export function calculateMasonry(
  wallLengthFt: number,
  wallHeightFt: number,
  type: 'brick' | 'cmu',
  wastePercent: number = 8
) {
  const wallAreaSqFt = wallLengthFt * wallHeightFt;

  if (type === 'brick') {
    // Standard modular brick with 3/8" mortar joint: ~6.85 bricks per sq ft
    const bricksNeeded = Math.ceil(wallAreaSqFt * 6.85 * (1 + wastePercent / 100));
    // Mortar: ~7.5 bags of Type N or S mortar mix (80 lb) per 1,000 bricks
    const mortarBags80lb = Math.ceil((bricksNeeded / 1000) * 7.5);
    return {
      wallAreaSqFt,
      unitCount: bricksNeeded,
      unitName: 'Modular Bricks',
      mortarBags80lb,
    };
  } else {
    // Standard nominal 8x8x16 CMU block: ~1.125 blocks per sq ft
    const blocksNeeded = Math.ceil(wallAreaSqFt * 1.125 * (1 + wastePercent / 100));
    // Mortar: ~3 bags (80 lb) per 100 blocks
    const mortarBags80lb = Math.ceil((blocksNeeded / 100) * 3);
    return {
      wallAreaSqFt,
      unitCount: blocksNeeded,
      unitName: '8"×8"×16" CMU Blocks',
      mortarBags80lb,
    };
  }
}

/**
 * Sod & Turf Lawn calculation
 */
export function calculateSod(
  lawnAreaSqFt: number,
  rollWidthFt: number = 2,
  rollLengthFt: number = 5,
  palletSqFt: number = 450,
  cuttingWastePercent: number = 8
) {
  const totalAreaWithWaste = lawnAreaSqFt * (1 + cuttingWastePercent / 100);
  const singleRollSqFt = rollWidthFt * rollLengthFt;
  const rollsNeeded = Math.ceil(totalAreaWithWaste / singleRollSqFt);
  const palletsNeeded = Math.ceil((totalAreaWithWaste / palletSqFt) * 10) / 10;
  const wholePallets = Math.ceil(totalAreaWithWaste / palletSqFt);

  return {
    lawnAreaSqFt,
    totalAreaWithWaste,
    singleRollSqFt,
    rollsNeeded,
    palletsNeeded,
    wholePallets,
  };
}

export interface RetainingWallResult {
  wallLengthFt: number;
  wallHeightFt: number;
  exposedSqFt: number;
  totalSqFt: number;
  blockWidthInches: number;
  blockHeightInches: number;
  blockDepthInches: number;
  blocksPerCourse: number;
  exposedCourses: number;
  buriedCourses: number;
  totalCourses: number;
  totalWallBlocks: number;
  capstonesCount: number;
  adhesiveTubes: number;
  baseTrenchGravelCuYd: number;
  baseTrenchGravelTons: number;
  drainageStoneCuYd: number;
  drainageStoneTons: number;
  drainPipeLinearFt: number;
  geogridSqYd: number;
  geogridLayers: number;
}

/**
 * Segmental Retaining Wall (SRW) calculation
 */
export function calculateRetainingWall(
  wallLengthFt: number,
  wallHeightFt: number, // exposed height
  blockWidthInches: number = 12,
  blockHeightInches: number = 4,
  blockDepthInches: number = 8,
  buriedCoursesCount?: number,
  includeCapstones: boolean = true,
  capstoneLengthInches: number = 12,
  wastePercent: number = 8
): RetainingWallResult {
  const exposedSqFt = wallLengthFt * wallHeightFt;
  const exposedCourses = Math.max(1, Math.ceil((wallHeightFt * 12) / blockHeightInches));

  // Minimum 1 buried course, or 1 course per 3 ft of wall height
  const buriedCourses = buriedCoursesCount !== undefined
    ? buriedCoursesCount
    : Math.max(1, Math.ceil(wallHeightFt / 3));

  const totalCourses = exposedCourses + buriedCourses;
  const totalHeightFt = (totalCourses * blockHeightInches) / 12;
  const totalSqFt = wallLengthFt * totalHeightFt;

  const blocksPerCourse = Math.ceil((wallLengthFt * 12) / blockWidthInches);
  const totalWallBlocks = Math.ceil(blocksPerCourse * totalCourses * (1 + wastePercent / 100));

  // Capstones
  const capstonesCount = includeCapstones
    ? Math.ceil(((wallLengthFt * 12) / capstoneLengthInches) * 1.05)
    : 0;

  // Adhesive tubes: 1 x 10oz tube per ~25-30 linear ft of double bead
  const adhesiveTubes = includeCapstones
    ? Math.ceil((wallLengthFt * 2) / 25)
    : Math.ceil(wallLengthFt / 25);

  // Base trench: 6" depth of compacted gravel, width = blockDepth + 8" (min 18")
  const trenchWidthFt = Math.max(1.5, (blockDepthInches + 8) / 12);
  const baseTrenchCuFt = wallLengthFt * trenchWidthFt * 0.5;
  const baseTrenchGravelCuYd = (baseTrenchCuFt / 27) * 1.15; // 15% compaction
  const baseTrenchGravelTons = baseTrenchGravelCuYd * 1.45;

  // Drainage chimney stone: 12" (1 ft) clean #57 stone chimney behind wall
  const drainageStoneCuFt = wallLengthFt * 1.0 * totalHeightFt;
  const drainageStoneCuYd = (drainageStoneCuFt / 27) * 1.05;
  const drainageStoneTons = drainageStoneCuYd * 1.40;

  // 4" Perforated drain pipe
  const drainPipeLinearFt = Math.ceil(wallLengthFt + 10);

  // Geogrid soil reinforcement: recommended for walls 3.5 ft and higher
  let geogridLayers = 0;
  let geogridSqYd = 0;
  if (totalHeightFt >= 3.5) {
    geogridLayers = Math.max(1, Math.floor(exposedCourses / 2));
    const embedmentLengthFt = Math.max(4, totalHeightFt * 0.8);
    geogridSqYd = Math.ceil((wallLengthFt * embedmentLengthFt * geogridLayers) / 9);
  }

  return {
    wallLengthFt,
    wallHeightFt,
    exposedSqFt,
    totalSqFt,
    blockWidthInches,
    blockHeightInches,
    blockDepthInches,
    blocksPerCourse,
    exposedCourses,
    buriedCourses,
    totalCourses,
    totalWallBlocks,
    capstonesCount,
    adhesiveTubes,
    baseTrenchGravelCuYd,
    baseTrenchGravelTons,
    drainageStoneCuYd,
    drainageStoneTons,
    drainPipeLinearFt,
    geogridSqYd,
    geogridLayers,
  };
}

/**
 * Raised Garden Bed Soil & Blend calculation
 */
export type RaisedBedMixPreset = 'garden_50_30_20' | 'mels_mix' | 'loam_compost_60_40';

export function calculateRaisedBedSoil(
  lengthFt: number,
  widthFt: number,
  depthInches: number,
  bedCount: number = 1,
  mixPreset: RaisedBedMixPreset = 'garden_50_30_20',
  settlementPercent: number = 5
) {
  const singleBedSqFt = Math.max(0, lengthFt * widthFt);
  const totalSqFt = singleBedSqFt * Math.max(1, bedCount);
  const rawCuFt = totalSqFt * (depthInches / 12);
  const volumeCuFt = rawCuFt * (1 + settlementPercent / 100);
  const volumeCuYd = volumeCuFt / 27;
  const volumeCuM = volumeCuYd * 0.764555;

  let topsoilRatio = 0.50;
  let compostRatio = 0.30;
  let aerationRatio = 0.20;
  if (mixPreset === 'mels_mix') {
    topsoilRatio = 1 / 3; // peat moss / coco coir base
    compostRatio = 1 / 3;
    aerationRatio = 1 / 3; // coarse vermiculite
  } else if (mixPreset === 'loam_compost_60_40') {
    topsoilRatio = 0.60;
    compostRatio = 0.40;
    aerationRatio = 0;
  }

  const topsoilCuFt = volumeCuFt * topsoilRatio;
  const compostCuFt = volumeCuFt * compostRatio;
  const aerationCuFt = volumeCuFt * aerationRatio;

  const bags1_5CuFt = Math.ceil(volumeCuFt / 1.5);
  const bags2CuFt = Math.ceil(volumeCuFt / 2.0);
  const estimatedWeightTons = volumeCuYd * 0.85;

  return {
    singleBedSqFt,
    totalSqFt,
    volumeCuFt,
    volumeCuYd,
    volumeCuM,
    topsoilCuFt,
    compostCuFt,
    aerationCuFt,
    bags1_5CuFt,
    bags2CuFt,
    estimatedWeightTons,
  };
}

/**
 * Potting Mix & Planter Container Volume calculation
 */
export type PlanterShape = 'tapered_pot' | 'cylinder_growbag' | 'window_box';

export function calculatePottingSoil(
  shape: PlanterShape,
  topDiameterOrLengthIn: number,
  bottomDiameterOrWidthIn: number,
  heightIn: number,
  potCount: number = 1,
  fillRatio: number = 0.92
) {
  let volumeCuInSingle = 0;
  if (shape === 'tapered_pot') {
    const r1 = topDiameterOrLengthIn / 2;
    const r2 = bottomDiameterOrWidthIn / 2;
    // Frustum of a cone: (1/3) * pi * h * (r1^2 + r1*r2 + r2^2)
    volumeCuInSingle = (Math.PI * heightIn * (r1 * r1 + r1 * r2 + r2 * r2)) / 3;
  } else if (shape === 'cylinder_growbag') {
    const r = topDiameterOrLengthIn / 2;
    volumeCuInSingle = Math.PI * r * r * heightIn;
  } else {
    volumeCuInSingle = topDiameterOrLengthIn * bottomDiameterOrWidthIn * heightIn;
  }

  const usableCuIn = Math.max(0, volumeCuInSingle * fillRatio) * Math.max(1, potCount);
  const totalCuFt = usableCuIn / 1728;
  // 1 US dry quart = 67.2006 cu in; 1 US trade/liquid gallon ≈ 231 cu in (soil bags commonly list dry quarts & cu ft)
  const dryQuarts = usableCuIn / 67.2006;
  const gallons = usableCuIn / 231;
  const liters = usableCuIn * 0.0163871;

  const bags8Qt = Math.ceil(dryQuarts / 8);
  const bags16Qt = Math.ceil(dryQuarts / 16);
  const bags32Qt = Math.ceil(dryQuarts / 32);
  const bags2CuFt = Math.ceil(totalCuFt / 2.0); // ~51.4 dry quarts

  return {
    totalCuFt,
    dryQuarts,
    gallons,
    liters,
    bags8Qt,
    bags16Qt,
    bags32Qt,
    bags2CuFt,
  };
}

/**
 * Pine Straw Bale calculation
 */
export type PineStrawBaleType = 'standard_square' | 'longleaf_jumbo';

export function calculatePineStraw(
  areaSqFt: number,
  depthInches: number = 3,
  baleType: PineStrawBaleType = 'standard_square',
  wastePercent: number = 10
) {
  // Base coverage at 3" settled depth: Standard square bale (~14"x18"x36") covers ~38 sq ft;
  // Longleaf Jumbo bale / roll covers ~65 sq ft. Scales inversely with target depth.
  const baseCoverageAt3In = baleType === 'standard_square' ? 38 : 65;
  const depthAdjustedCoverage = baseCoverageAt3In * (3 / Math.max(1.5, depthInches));
  const rawBales = areaSqFt / depthAdjustedCoverage;
  const totalBales = Math.ceil(rawBales * (1 + wastePercent / 100));
  const baleWeightLbs = baleType === 'standard_square' ? 20 : 34;
  const totalWeightLbs = totalBales * baleWeightLbs;

  return {
    areaSqFt,
    coveragePerBaleSqFt: depthAdjustedCoverage,
    totalBales,
    totalWeightLbs,
  };
}

/**
 * Grass Seed Coverage calculation
 */
export function calculateGrassSeed(
  areaSqFt: number,
  ratePer1000SqFt: number,
  wastePercent: number = 5
) {
  const effectiveAreaSqFt = areaSqFt * (1 + wastePercent / 100);
  const totalLbs = (effectiveAreaSqFt / 1000) * ratePer1000SqFt;
  const totalKg = totalLbs * 0.453592;
  const bags5lb = Math.ceil(totalLbs / 5);
  const bags10lb = Math.ceil(totalLbs / 10);
  const bags25lb = Math.ceil(totalLbs / 25);
  const bags50lb = Math.ceil(totalLbs / 50);
  // Standard starter fertilizer application rate ~3.5 lbs per 1,000 sq ft
  const starterFertilizerLbs = Math.ceil((effectiveAreaSqFt / 1000) * 3.5);

  return {
    areaSqFt,
    totalLbs,
    totalKg,
    bags5lb,
    bags10lb,
    bags25lb,
    bags50lb,
    starterFertilizerLbs,
  };
}

/**
 * Fence Post, Lumber & Concrete Bag calculation
 */
export function calculateFenceProject(
  linearFeet: number,
  postSpacingFt: number = 8,
  fenceHeightFt: number = 6,
  railsPerSection: number = 3,
  picketWidthInches: number = 5.5,
  picketGapInches: number = 0.25,
  holeDiameterInches: number = 10,
  holeDepthInches: number = 30,
  extraEndCornerPosts: number = 2
) {
  const sectionsCount = Math.max(1, Math.ceil(linearFeet / Math.max(4, postSpacingFt)));
  const totalPosts = sectionsCount + 1 + Math.max(0, extraEndCornerPosts);
  const totalRails = sectionsCount * railsPerSection;

  const effectivePicketStepInches = picketWidthInches + picketGapInches;
  const totalPickets = Math.ceil(((linearFeet * 12) / effectivePicketStepInches) * 1.05);

  // Cylindrical post hole volume minus displaced 4x4 wood post (3.5" x 3.5")
  const holeRadiusIn = holeDiameterInches / 2;
  const holeVolumeCuIn = Math.PI * holeRadiusIn * holeRadiusIn * holeDepthInches;
  const postDisplacementCuIn = 3.5 * 3.5 * Math.max(0, holeDepthInches - 4); // assume 4" gravel at bottom
  const concreteCuInPerHole = Math.max(0, holeVolumeCuIn - postDisplacementCuIn);
  const concreteCuFtPerHole = concreteCuInPerHole / 1728;
  const totalConcreteCuFt = concreteCuFtPerHole * totalPosts * 1.08; // 8% waste
  const totalConcreteCuYd = totalConcreteCuFt / 27;

  const bags50lbPerPost = Math.ceil((concreteCuFtPerHole / 0.375) * 10) / 10;
  const bags50lbTotal = Math.ceil(totalConcreteCuFt / 0.375);
  const bags60lbTotal = Math.ceil(totalConcreteCuFt / 0.45);
  const bags80lbTotal = Math.ceil(totalConcreteCuFt / 0.60);

  // 4" crushed gravel drainage pocket per post hole
  const gravelPerHoleCuFt = (Math.PI * holeRadiusIn * holeRadiusIn * 4) / 1728;
  const totalGravelCuFt = gravelPerHoleCuFt * totalPosts;

  return {
    sectionsCount,
    totalPosts,
    totalRails,
    totalPickets,
    fenceHeightFt,
    concreteCuFtPerHole,
    totalConcreteCuFt,
    totalConcreteCuYd,
    bags50lbPerPost,
    bags50lbTotal,
    bags60lbTotal,
    bags80lbTotal,
    totalGravelCuFt,
  };
}
