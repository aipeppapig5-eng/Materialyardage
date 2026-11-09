import { FabricCutPiece, PlacedPiece, FabricLayoutResult } from '../types';

const PIECE_PALETTE = [
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Violet
  '#DC2626', // Red
  '#0891B2', // Cyan
  '#DB2777', // Pink
  '#4F46E5', // Indigo
  '#EA580C', // Orange
];

/**
 * 2D Shelf/Guillotine bin-packing algorithm for continuous fabric rolls.
 * Takes pieces, sorts them by height/length (First Fit Decreasing Height),
 * and places them across usable roll width.
 */
export function calculateFabricPacking(
  pieces: FabricCutPiece[],
  usableWidth: number,
  seamAllowance: number = 0,
  rowBuffer: number = 0,
  purchaseWastePercent: number = 5,
  verticalRepeat: number = 0
): FabricLayoutResult {
  // Expand pieces by quantity and include seam allowance in effective cut dimension
  interface WorkItem {
    id: string;
    label: string;
    width: number;
    height: number;
    allowRotation: boolean;
    color: string;
  }

  const items: WorkItem[] = [];
  pieces.forEach((p, pIdx) => {
    const effW = p.width + seamAllowance * 2;
    let effH = p.length + seamAllowance * 2;

    // If vertical pattern repeat exists and is > 0, round height up to nearest repeat
    if (verticalRepeat > 0) {
      const repeatsNeeded = Math.ceil(effH / verticalRepeat);
      effH = repeatsNeeded * verticalRepeat;
    }

    const color = p.color || PIECE_PALETTE[pIdx % PIECE_PALETTE.length];
    for (let q = 0; q < p.quantity; q++) {
      items.push({
        id: `${p.id}_${q}`,
        label: p.quantity > 1 ? `${p.label} #${q + 1}` : p.label,
        width: effW,
        height: effH,
        allowRotation: p.allowRotation,
        color,
      });
    }
  });

  if (items.length === 0) {
    return {
      usableWidth,
      totalLengthNeeded: 0,
      yardsNeeded: 0,
      metersNeeded: 0,
      totalFabricArea: 0,
      usedArea: 0,
      wasteArea: 0,
      wastePercentage: 0,
      placedPieces: [],
      unplacedCount: 0,
    };
  }

  // Shelf-packing algorithm:
  // Sort items primarily by height descending
  items.sort((a, b) => b.height - a.height);

  interface Shelf {
    y: number;
    height: number;
    currentX: number;
  }

  const shelves: Shelf[] = [];
  const placedPieces: PlacedPiece[] = [];
  let unplacedCount = 0;

  for (const item of items) {
    // Check orientation: normal vs rotated
    const orientations = [{ w: item.width, h: item.height, rot: false }];
    if (item.allowRotation && item.width !== item.height) {
      orientations.push({ w: item.height, h: item.width, rot: true });
    }

    let placed = false;

    // Try to fit on existing shelf
    for (const shelf of shelves) {
      for (const orient of orientations) {
        if (orient.w <= usableWidth - shelf.currentX) {
          placedPieces.push({
            pieceId: item.id,
            label: item.label,
            x: shelf.currentX,
            y: shelf.y,
            width: orient.w,
            height: orient.h,
            rotated: orient.rot,
            color: item.color,
          });
          shelf.currentX += orient.w;
          if (orient.h > shelf.height) {
            shelf.height = orient.h;
          }
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    // If not placed, start a new shelf
    if (!placed) {
      let bestOrient = orientations[0];
      // Pick rotation that fits width if one doesn't
      if (bestOrient.w > usableWidth && orientations.length > 1 && orientations[1].w <= usableWidth) {
        bestOrient = orientations[1];
      }

      if (bestOrient.w <= usableWidth) {
        const lastShelf = shelves[shelves.length - 1];
        const newY = lastShelf ? lastShelf.y + lastShelf.height + rowBuffer : 0;
        const newShelf: Shelf = {
          y: newY,
          height: bestOrient.h,
          currentX: bestOrient.w,
        };
        shelves.push(newShelf);

        placedPieces.push({
          pieceId: item.id,
          label: item.label,
          x: 0,
          y: newY,
          width: bestOrient.w,
          height: bestOrient.h,
          rotated: bestOrient.rot,
          color: item.color,
        });
      } else {
        unplacedCount++;
      }
    }
  }

  // Calculate total length reached
  let rawLength = 0;
  placedPieces.forEach(p => {
    const bottom = p.y + p.height;
    if (bottom > rawLength) {
      rawLength = bottom;
    }
  });

  const totalLengthNeeded = rawLength * (1 + (purchaseWastePercent || 0) / 100);
  const usedArea = placedPieces.reduce((acc, p) => acc + p.width * p.height, 0);
  const totalFabricArea = usableWidth * totalLengthNeeded;
  const wasteArea = Math.max(0, totalFabricArea - usedArea);
  const wastePercentage = totalFabricArea > 0 ? (wasteArea / totalFabricArea) * 100 : 0;

  return {
    usableWidth,
    totalLengthNeeded,
    yardsNeeded: totalLengthNeeded / 36,
    metersNeeded: (totalLengthNeeded * 2.54) / 100, // assuming inches base; if metric, handles correctly
    totalFabricArea,
    usedArea,
    wasteArea,
    wastePercentage,
    placedPieces,
    unplacedCount,
  };
}

/**
 * Drapery / Curtain Calculator
 */
export interface CurtainParams {
  trackWidthInches: number;
  finishedDropInches: number;
  pairOfCurtains: boolean; // 2 panels vs 1 panel
  fullness: number; // 1.5, 2.0, 2.5
  fabricWidthInches: number;
  headerAllowanceInches: number; // e.g., 4" - 6"
  bottomHemInches: number; // e.g., 8" double hem
  puddleInches: number; // 0 for floor touch, 2"-4" for romantic puddle
  verticalRepeatInches: number;
}

export function calculateCurtains(p: CurtainParams) {
  const totalGatheredWidth = p.trackWidthInches * p.fullness;
  const panelsCount = p.pairOfCurtains ? 2 : 1;
  const targetWidthPerPanel = totalGatheredWidth / panelsCount;

  // Number of fabric widths per panel
  const widthsPerPanel = Math.ceil(targetWidthPerPanel / p.fabricWidthInches);
  const totalWidthsNeeded = widthsPerPanel * panelsCount;

  // Base cut length per width
  const baseCutLength = p.finishedDropInches + p.headerAllowanceInches + p.bottomHemInches + p.puddleInches;

  // Pattern repeat adjustment
  let adjustedCutLength = baseCutLength;
  if (p.verticalRepeatInches > 0) {
    const repeatsPerCut = Math.ceil(baseCutLength / p.verticalRepeatInches);
    adjustedCutLength = repeatsPerCut * p.verticalRepeatInches;
  }

  // Lead cut adjustment: extra 1 repeat to position first pattern identically
  const totalLinearInches = adjustedCutLength * totalWidthsNeeded + (p.verticalRepeatInches > 0 ? p.verticalRepeatInches : 0);
  const totalYards = totalLinearInches / 36;
  const totalMeters = (totalLinearInches * 2.54) / 100;

  return {
    totalGatheredWidth,
    panelsCount,
    widthsPerPanel,
    totalWidthsNeeded,
    baseCutLength,
    adjustedCutLength,
    totalLinearInches,
    totalYards,
    totalMeters,
    liningYards: (baseCutLength * totalWidthsNeeded) / 36,
  };
}

/**
 * Quilt Backing & Binding Calculator
 */
export interface QuiltParams {
  topWidthInches: number;
  topLengthInches: number;
  overhangInches: number; // standard 4" per side for longarm quilters
  fabricWidthInches: number; // 42, 44, or 108
  bindingWidthInches: number; // 2.25" or 2.5"
  miterSeamAllowanceInches: number; // usually 10-15" extra for joining strips
}

export function calculateQuiltBacking(p: QuiltParams) {
  const totalWidthNeeded = p.topWidthInches + p.overhangInches * 2;
  const totalLengthNeeded = p.topLengthInches + p.overhangInches * 2;

  // Check if seamless with wide-back fabric
  const isSeamless = p.fabricWidthInches >= totalWidthNeeded;

  let backingYards = 0;
  let seamOrientation: 'horizontal' | 'vertical' | 'seamless' = 'seamless';
  let panelsNeeded = 1;

  if (isSeamless) {
    backingYards = totalLengthNeeded / 36;
    seamOrientation = 'seamless';
  } else {
    // Option A: Vertical seam (panels run top to bottom)
    const vertPanels = Math.ceil(totalWidthNeeded / p.fabricWidthInches);
    const vertYards = (vertPanels * totalLengthNeeded) / 36;

    // Option B: Horizontal seam (panels run left to right)
    const horizPanels = Math.ceil(totalLengthNeeded / p.fabricWidthInches);
    const horizYards = (horizPanels * totalWidthNeeded) / 36;

    if (horizYards < vertYards) {
      backingYards = horizYards;
      seamOrientation = 'horizontal';
      panelsNeeded = horizPanels;
    } else {
      backingYards = vertYards;
      seamOrientation = 'vertical';
      panelsNeeded = vertPanels;
    }
  }

  // Quilt Binding
  const perimeterInches = (p.topWidthInches + p.topLengthInches) * 2;
  const totalBindingLengthNeeded = perimeterInches + p.miterSeamAllowanceInches;
  const stripsNeeded = Math.ceil(totalBindingLengthNeeded / p.fabricWidthInches);
  const bindingInches = stripsNeeded * p.bindingWidthInches;
  const bindingYards = bindingInches / 36;

  return {
    totalWidthNeeded,
    totalLengthNeeded,
    isSeamless,
    seamOrientation,
    panelsNeeded,
    backingYards,
    perimeterInches,
    stripsNeeded,
    bindingYards,
    totalProjectYards: backingYards + bindingYards,
  };
}

/**
 * Upholstery & Cushion Calculator
 */
export interface CushionParams {
  cushionWidthInches: number;
  cushionDepthInches: number;
  foamThicknessInches: number;
  cushionCount: number;
  fabricWidthInches: number;
  seamAllowanceInches: number; // usually 0.5"
  includePiping: boolean;
}

export function calculateBoxCushions(p: CushionParams) {
  // Each cushion requires:
  // 1 top plate: (width + 2*seam) x (depth + 2*seam)
  // 1 bottom plate: same
  // Boxing strip length: 2 * (width + depth) + 4" seam/zipper allowance
  // Boxing strip height: foamThickness + 2*seam
  const plateW = p.cushionWidthInches + p.seamAllowanceInches * 2;
  const plateH = p.cushionDepthInches + p.seamAllowanceInches * 2;
  const boxingHeight = p.foamThicknessInches + p.seamAllowanceInches * 2;
  const perimeterPerCushion = 2 * (p.cushionWidthInches + p.cushionDepthInches);
  const totalBoxingPerCushion = perimeterPerCushion + 4; // join allowances

  // Number of plates = 2 * cushionCount
  // Plates across fabric width
  const platesAcross = Math.max(1, Math.floor(p.fabricWidthInches / plateW));
  const plateRows = Math.ceil((p.cushionCount * 2) / platesAcross);
  const plateLengthInches = plateRows * plateH;

  // Boxing strips: how many widths of fabric needed to get total boxing length
  const totalBoxingLengthAll = totalBoxingPerCushion * p.cushionCount;
  const boxingStripsCount = Math.ceil(totalBoxingLengthAll / p.fabricWidthInches);
  const boxingLengthInches = boxingStripsCount * boxingHeight;

  // Welting / Piping cord: 2 loops per cushion (top welt + bottom welt)
  let pipingYardsOfCord = 0;
  let pipingFabricYards = 0;
  if (p.includePiping) {
    const totalPipingInches = perimeterPerCushion * 2 * p.cushionCount + 12 * p.cushionCount;
    pipingYardsOfCord = totalPipingInches / 36;
    // 1.5" bias strips: 1 yard of 54" fabric yields ~36 yards of 1.5" bias tape
    pipingFabricYards = Math.max(0.5, Math.ceil((pipingYardsOfCord / 30) * 4) / 4);
  }

  const baseFabricInches = plateLengthInches + boxingLengthInches;
  const baseFabricYards = baseFabricInches / 36;
  const totalFabricYards = baseFabricYards + pipingFabricYards;

  return {
    plateW,
    plateH,
    boxingHeight,
    plateRows,
    boxingStripsCount,
    pipingYardsOfCord,
    pipingFabricYards,
    baseFabricYards,
    totalFabricYards: totalFabricYards * 1.1, // 10% safety margin for matching & cutting
  };
}

export type WallpaperRollType = 'double_roll_us' | 'single_roll_us' | 'euro_metric' | 'commercial_54';
export type PatternMatchType = 'random' | 'straight' | 'half_drop';

export interface WallpaperWallInput {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
}

export interface WallpaperCutoutInput {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
  count: number;
}

export interface WallpaperResult {
  grossAreaSqFt: number;
  cutoutAreaSqFt: number;
  netAreaSqFt: number;
  rollWidthInches: number;
  rollLengthFt: number;
  rollNominalSqFt: number;
  totalStripsNeeded: number;
  cutDropLengthInches: number;
  stripsPerRoll: number;
  usableSqFtPerRoll: number;
  rollsNeeded: number;
  recommendedRolls: number;
  primerGallons: number;
  adhesivePastePails: number;
}

export const WALLPAPER_ROLL_SPECS: Record<
  WallpaperRollType,
  { label: string; widthInches: number; lengthFt: number; nominalSqFt: number; desc: string }
> = {
  double_roll_us: {
    label: 'US Double Roll (Bolt)',
    widthInches: 20.5,
    lengthFt: 33,
    nominalSqFt: 56.4,
    desc: 'Standard American packaging: 20.5" wide × 33 ft long (sold as double roll bolts)',
  },
  single_roll_us: {
    label: 'US Single Roll',
    widthInches: 20.5,
    lengthFt: 16.5,
    nominalSqFt: 28.2,
    desc: 'Traditional single roll unit: 20.5" wide × 16.5 ft long',
  },
  euro_metric: {
    label: 'European Metric Roll',
    widthInches: 20.8,
    lengthFt: 33,
    nominalSqFt: 57.3,
    desc: 'European standard (Euro-roll): 53 cm (20.8") wide × 10.05 m (33 ft) long',
  },
  commercial_54: {
    label: 'Commercial 54" Vinyl Bolt',
    widthInches: 54,
    lengthFt: 30,
    nominalSqFt: 135,
    desc: 'Wide-format contract vinyl: 54" wide × 10 yard (30 ft) bolt',
  },
};

/**
 * Wallpaper, Borders & Wallcovering calculation
 */
export function calculateWallpaper(
  walls: WallpaperWallInput[],
  cutouts: WallpaperCutoutInput[] = [],
  rollType: WallpaperRollType = 'double_roll_us',
  patternMatch: PatternMatchType = 'straight',
  patternRepeatInches: number = 21,
  wasteBufferPercent: number = 10
): WallpaperResult {
  const spec = WALLPAPER_ROLL_SPECS[rollType] || WALLPAPER_ROLL_SPECS.double_roll_us;
  const rollWidthInches = spec.widthInches;
  const rollLengthFt = spec.lengthFt;
  const rollNominalSqFt = spec.nominalSqFt;

  // Gross area & strip counts per wall
  let grossAreaSqFt = 0;
  let totalStripsNeeded = 0;
  let maxHeightFt = 0;

  walls.forEach(w => {
    grossAreaSqFt += w.widthFt * w.heightFt;
    maxHeightFt = Math.max(maxHeightFt, w.heightFt);
    const stripsForWall = Math.ceil((w.widthFt * 12) / rollWidthInches);
    totalStripsNeeded += stripsForWall;
  });

  // Cutout area deductions
  let cutoutAreaSqFt = 0;
  cutouts.forEach(c => {
    cutoutAreaSqFt += c.widthFt * c.heightFt * c.count;
  });

  const netAreaSqFt = Math.max(0, grossAreaSqFt - cutoutAreaSqFt);

  // Strip cut drop length calculation based on pattern repeat
  const wallHeightInches = (maxHeightFt || 8) * 12;
  const trimmingAllowanceInches = 4; // 2" top + 2" bottom trim

  let cutDropLengthInches = wallHeightInches + trimmingAllowanceInches;
  if (patternMatch !== 'random' && patternRepeatInches > 0) {
    if (patternMatch === 'straight') {
      const repeatsNeeded = Math.ceil(cutDropLengthInches / patternRepeatInches);
      cutDropLengthInches = repeatsNeeded * patternRepeatInches;
    } else if (patternMatch === 'half_drop') {
      // Half-drop shifts half repeat distance every alternating strip
      const halfDropRepeat = patternRepeatInches / 2;
      const repeatsNeeded = Math.ceil((cutDropLengthInches + halfDropRepeat) / patternRepeatInches);
      cutDropLengthInches = repeatsNeeded * patternRepeatInches;
    }
  }

  // Strips per roll
  const rollLengthInches = rollLengthFt * 12;
  const stripsPerRoll = Math.max(1, Math.floor(rollLengthInches / cutDropLengthInches));
  const usableSqFtPerRoll = (stripsPerRoll * (wallHeightInches / 12) * (rollWidthInches / 12));

  // Rolls needed based on strip requirements
  const baseRollsNeeded = Math.ceil(totalStripsNeeded / stripsPerRoll);
  const rollsNeededWithWaste = Math.ceil(baseRollsNeeded * (1 + wasteBufferPercent / 100));
  const rollsNeeded = Math.max(1, rollsNeededWithWaste);

  // Recommended rolls (+1 safety roll for matching cuts / dye-lot guarantee)
  const recommendedRolls = rollsNeeded + 1;

  // Wallpaper primer & heavy-duty paste estimates
  const primerGallons = Math.max(1, Math.ceil(netAreaSqFt / 350));
  const adhesivePastePails = Math.max(1, Math.ceil(netAreaSqFt / 250));

  return {
    grossAreaSqFt,
    cutoutAreaSqFt,
    netAreaSqFt,
    rollWidthInches,
    rollLengthFt,
    rollNominalSqFt,
    totalStripsNeeded,
    cutDropLengthInches,
    stripsPerRoll,
    usableSqFtPerRoll,
    rollsNeeded,
    recommendedRolls,
    primerGallons,
    adhesivePastePails,
  };
}
