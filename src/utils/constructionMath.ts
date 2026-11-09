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
