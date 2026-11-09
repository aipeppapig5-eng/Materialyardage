import { useEffect, useRef } from 'react';

/**
 * Union types for all calculator dynamic SEO inputs
 */
export type ConcreteSEOInput = {
  calculatorId: 'concrete_calc';
  concreteType: 'slab' | 'column' | 'steps';
  // Slab
  slabLength?: number;
  slabWidth?: number;
  slabThickness?: number;
  // Column
  colDiameter?: number;
  colDepth?: number;
  colCount?: number;
  // Steps
  stepCount?: number;
  stepWidth?: number;
  // Results
  volumeCuYd: number;
  bags80lb: number;
  bags60lb: number;
  weightTons?: number;
  spillageWaste?: number;
  unitPrice?: number;
};

export type MulchSoilSEOInput = {
  calculatorId: 'mulch_soil';
  materialName: string;
  shape: string;
  dim1: number;
  dim2?: number;
  areaSqFt: number;
  depthInches: number;
  volumeCuYd: number;
  bags2CuFt: number;
  weightTons: number;
  unitPrice?: number;
};

export type GravelAggregateSEOInput = {
  calculatorId: 'gravel_aggregate';
  materialName: string;
  shape: string;
  dim1: number;
  dim2?: number;
  areaSqFt: number;
  depthInches: number;
  weightTons: number;
  volumeCuYd: number;
  bags50lb: number;
  truckloads?: number;
  unitPrice?: number;
};

export type PaverMasonrySEOInput = {
  calculatorId: 'paver_masonry';
  subType: 'pavers' | 'masonry';
  // Paver
  patioLength?: number;
  patioWidth?: number;
  patioAreaSqFt?: number;
  paverName?: string;
  totalPavers?: number;
  beddingSandTons?: number;
  polymericSandBags?: number;
  // Masonry
  wallLength?: number;
  wallHeight?: number;
  masonryType?: 'brick' | 'cmu';
  totalUnits?: number;
  mortarBags?: number;
  unitPrice?: number;
};

export type SodTurfSEOInput = {
  calculatorId: 'sod_turf';
  lawnLength: number;
  lawnWidth: number;
  areaSqFt: number;
  palletSizeSqFt: number;
  wholePallets: number;
  rollsNeeded: number;
  totalAreaWithWaste: number;
  unitPrice?: number;
};

export type CurtainDraperySEOInput = {
  calculatorId: 'curtains_drapery';
  trackWidthInches: number;
  finishedDropInches: number;
  fullness: number;
  pairOfCurtains: boolean;
  fabricWidthInches: number;
  totalYards: number;
  totalWidthsNeeded: number;
  includeLining?: boolean;
  unitPrice?: number;
};

export type FabricYardageSEOInput = {
  calculatorId: 'fabric_cut';
  usableWidth: number;
  totalPieces: number;
  totalYards: number;
  primaryPieceSummary?: string;
  wastePercent?: number;
  unitPrice?: number;
};

export type QuiltBackingSEOInput = {
  calculatorId: 'quilt_backing';
  topWidthInches: number;
  topLengthInches: number;
  fabricWidthInches: number;
  totalYards: number;
  backingYards: number;
  bindingYards: number;
  seamOrientation?: string;
  unitPrice?: number;
};

export type UpholsterySEOInput = {
  calculatorId: 'upholstery_cushions';
  cushionWidth: number;
  cushionDepth: number;
  foamThickness: number;
  cushionCount: number;
  fabricWidth: number;
  totalFabricYards: number;
  pipingCordYards?: number;
  unitPrice?: number;
};

export type WallpaperSEOInput = {
  calculatorId: 'wallpaper_calc';
  subType: string;
  wallWidth: number;
  wallHeight: number;
  netSqFt: number;
  totalStrips: number;
  rollsNeeded: number;
  recommendedRolls: number;
  patternType: string;
  rollType: string;
  unitPrice?: number;
};

export type RetainingWallSEOInput = {
  calculatorId: 'retaining_wall';
  wallLength: number;
  wallHeight: number;
  exposedSqFt: number;
  totalBlocks: number;
  capstonesCount: number;
  baseGravelTons: number;
  drainageStoneTons: number;
  blockName: string;
  unitPrice?: number;
};

export type CalculatorSEOInput =
  | ConcreteSEOInput
  | MulchSoilSEOInput
  | GravelAggregateSEOInput
  | PaverMasonrySEOInput
  | SodTurfSEOInput
  | CurtainDraperySEOInput
  | FabricYardageSEOInput
  | QuiltBackingSEOInput
  | UpholsterySEOInput
  | WallpaperSEOInput
  | RetainingWallSEOInput;

export interface DynamicSEOResult {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalPath: string;
  queryString: string;
  h1Context: string;
  calculatedValues: Record<string, string | number>;
}

/**
 * Generates bespoke dynamic long-tail title, description, and keywords
 * based on user inputs and calculated results.
 */
export function generateDynamicSEO(input: CalculatorSEOInput): DynamicSEOResult {
  switch (input.calculatorId) {
    case 'concrete_calc': {
      if (input.concreteType === 'slab') {
        const l = input.slabLength || 20;
        const w = input.slabWidth || 10;
        const t = input.slabThickness || 4;
        const cuYd = input.volumeCuYd.toFixed(2);
        const bags = input.bags80lb;

        return {
          title: `${l}' × ${w}' Concrete Slab (${t}" Deep) — ${cuYd} Cu Yds & ${bags} Bags | Material Yardage`,
          metaDescription: `Calculate concrete for a ${l}' × ${w}' slab at ${t}" depth: requires ${cuYd} cubic yards (${bags} 80-lb bags or ${input.bags60lb} 60-lb bags) with ${input.spillageWaste ?? 10}% waste buffer on Material Yardage.`,
          keywords: [
            `${l}x${w} concrete slab calculator`,
            `how much concrete for ${l} by ${w} slab ${t} inches`,
            `${l}x${w} concrete slab cubic yards`,
            `how many 80lb bags of concrete for ${l}x${w} slab`,
            `${l} by ${w} slab ${t} inches deep concrete`,
            'concrete slab yardage calculator',
            'ready mix concrete calculator',
          ],
          canonicalPath: '/concrete-calculator',
          queryString: `type=slab&l=${l}&w=${w}&t=${t}`,
          h1Context: `${l}' × ${w}' Slab (${t}" Thickness)`,
          calculatedValues: {
            lengthFt: l,
            widthFt: w,
            thicknessIn: t,
            cubicYards: cuYd,
            bags80lb: bags,
          },
        };
      } else if (input.concreteType === 'column') {
        const dia = input.colDiameter || 12;
        const depth = input.colDepth || 48;
        const count = input.colCount || 6;
        const cuYd = input.volumeCuYd.toFixed(2);

        return {
          title: `${count} Sonotube Columns (${dia}" Ø × ${depth}" Depth) — ${cuYd} Cu Yds | Material Yardage`,
          metaDescription: `Concrete footing calculator for ${count} circular piers/Sonotubes (${dia}" diameter × ${depth}" depth): requires ${cuYd} cubic yards (${input.bags80lb} 80-lb bags).`,
          keywords: [
            `${dia} inch sonotube concrete calculator`,
            `${count} concrete footings ${dia} inch diameter`,
            `concrete pier calculator ${depth} inches deep`,
            'post hole concrete yardage calculator',
            'sonotube cubic yards',
          ],
          canonicalPath: '/concrete-calculator',
          queryString: `type=column&dia=${dia}&depth=${depth}&count=${count}`,
          h1Context: `${count}× Sonotubes (${dia}" Ø × ${depth}" Depth)`,
          calculatedValues: {
            diameterIn: dia,
            depthIn: depth,
            columnCount: count,
            cubicYards: cuYd,
            bags80lb: input.bags80lb,
          },
        };
      } else {
        const steps = input.stepCount || 3;
        const width = input.stepWidth || 4;
        const cuYd = input.volumeCuYd.toFixed(2);

        return {
          title: `${steps} Concrete Steps (${width}' Wide) — ${cuYd} Cu Yds | Material Yardage`,
          metaDescription: `Concrete steps calculator for ${steps} steps at ${width} ft width: requires ${cuYd} cubic yards (${input.bags80lb} bags) with uniform rise and tread.`,
          keywords: [
            'concrete steps calculator',
            `${steps} concrete steps yardage`,
            `how much concrete for ${steps} steps ${width} feet wide`,
            'concrete stairs cubic yards',
          ],
          canonicalPath: '/concrete-calculator',
          queryString: `type=steps&steps=${steps}&width=${width}`,
          h1Context: `${steps} Steps (${width}' Wide)`,
          calculatedValues: {
            stepCount: steps,
            stepWidthFt: width,
            cubicYards: cuYd,
            bags80lb: input.bags80lb,
          },
        };
      }
    }

    case 'mulch_soil': {
      const area = Math.round(input.areaSqFt);
      const depth = input.depthInches;
      const cuYd = input.volumeCuYd.toFixed(2);
      const bags = input.bags2CuFt;
      const mat = input.materialName || 'Mulch';

      return {
        title: `${mat} Calculator: ${area} Sq Ft at ${depth}" Depth — ${cuYd} Cu Yds | Material Yardage`,
        metaDescription: `Calculate ${mat.toLowerCase()} for a ${area} sq ft garden bed at ${depth}" depth: requires ${cuYd} cubic yards (${bags} bags of 2 cu ft or ${input.weightTons.toFixed(2)} tons).`,
        keywords: [
          `how much mulch for ${area} sq ft`,
          `${area} sq ft mulch calculator ${depth} inches deep`,
          `how many bags of mulch for ${area} sq ft`,
          `${mat.toLowerCase()} calculator cubic yards`,
          `${area} sq ft ${depth} inch depth mulch bags`,
          'garden soil volume calculator',
        ],
        canonicalPath: '/mulch-calculator',
        queryString: `area=${area}&depth=${depth}&shape=${input.shape}`,
        h1Context: `${area} Sq Ft Bed at ${depth}" Depth (${mat})`,
        calculatedValues: {
          areaSqFt: area,
          depthInches: depth,
          cubicYards: cuYd,
          bags2CuFt: bags,
          weightTons: input.weightTons.toFixed(2),
        },
      };
    }

    case 'gravel_aggregate': {
      const area = Math.round(input.areaSqFt);
      const depth = input.depthInches;
      const tons = input.weightTons.toFixed(2);
      const cuYd = input.volumeCuYd.toFixed(2);
      const mat = input.materialName || 'Gravel';

      return {
        title: `${mat} Calculator: ${area} Sq Ft (${depth}" Deep) — ${tons} Tons | Material Yardage`,
        metaDescription: `Calculate ${mat.toLowerCase()} for ${area} sq ft at ${depth}" depth: requires ${tons} US tons (${cuYd} cu yds or ${input.bags50lb} 50-lb bags) with compaction buffer.`,
        keywords: [
          `how many tons of gravel for ${area} sq ft`,
          `${area} sq ft gravel calculator ${depth} inches`,
          `how much ${mat.toLowerCase()} do i need for ${area} sq ft`,
          `${area} sq ft driveway gravel tons`,
          'crushed stone yardage and tonnage calculator',
        ],
        canonicalPath: '/gravel-calculator',
        queryString: `area=${area}&depth=${depth}&shape=${input.shape}`,
        h1Context: `${area} Sq Ft at ${depth}" Depth (${mat})`,
        calculatedValues: {
          areaSqFt: area,
          depthInches: depth,
          tons,
          cubicYards: cuYd,
          bags50lb: input.bags50lb,
        },
      };
    }

    case 'paver_masonry': {
      if (input.subType === 'pavers') {
        const l = input.patioLength || 20;
        const w = input.patioWidth || 15;
        const area = input.patioAreaSqFt || l * w;
        const total = input.totalPavers?.toLocaleString() || '0';
        const paver = input.paverName || '4"×8" Pavers';
        const sand = (input.beddingSandTons ?? 0).toFixed(2);

        return {
          title: `${l}' × ${w}' Paver Patio (${area} Sq Ft) — ${total} Pavers | Material Yardage`,
          metaDescription: `Calculate pavers for a ${l}' × ${w}' patio (${area} sq ft): requires ${total} ${paver.toLowerCase()}, ${sand} tons bedding sand, and ${input.polymericSandBags ?? 0} bags polymeric sand.`,
          keywords: [
            `${l}x${w} paver patio calculator`,
            `how many pavers for ${l} by ${w} patio`,
            `${area} sq ft paver calculator`,
            `how much bedding sand for ${area} sq ft patio`,
            'paver walkway quantity estimator',
          ],
          canonicalPath: '/paver-calculator',
          queryString: `type=pavers&l=${l}&w=${w}&area=${area}`,
          h1Context: `${l}' × ${w}' Patio (${area} Sq Ft)`,
          calculatedValues: {
            patioLength: l,
            patioWidth: w,
            areaSqFt: area,
            totalPavers: input.totalPavers || 0,
            beddingSandTons: sand,
          },
        };
      } else {
        const l = input.wallLength || 30;
        const h = input.wallHeight || 4;
        const total = input.totalUnits?.toLocaleString() || '0';
        const mat = input.masonryType === 'brick' ? 'Standard Bricks' : 'CMU Concrete Blocks (8×8×16)';

        return {
          title: `${l}' × ${h}' ${mat} Wall — ${total} Units & Mortar | Material Yardage`,
          metaDescription: `Calculate masonry blocks for a ${l} ft long × ${h} ft high wall: requires ${total} ${mat.toLowerCase()} and ${input.mortarBags ?? 0} bags of mortar mix.`,
          keywords: [
            `${l}x${h} block wall calculator`,
            `how many cmu blocks for ${l} foot wall ${h} feet high`,
            'masonry block wall calculator',
            'mortar bags for cmu wall',
          ],
          canonicalPath: '/paver-calculator',
          queryString: `type=masonry&l=${l}&h=${h}&m=${input.masonryType || 'cmu'}`,
          h1Context: `${l}' × ${h}' Wall (${mat})`,
          calculatedValues: {
            wallLength: l,
            wallHeight: h,
            totalUnits: input.totalUnits || 0,
          },
        };
      }
    }

    case 'sod_turf': {
      const area = Math.round(input.areaSqFt);
      const pallets = input.wholePallets;
      const rolls = input.rollsNeeded;
      const palletYield = input.palletSizeSqFt;

      return {
        title: `${area.toLocaleString()} Sq Ft Lawn Sod Calculator — ${pallets} Pallets & ${rolls} Rolls | Material Yardage`,
        metaDescription: `Calculate turf grass for a ${area.toLocaleString()} sq ft lawn: requires ${pallets} pallets (${palletYield} sq ft/pallet) or ${rolls} rolls (2'×5') with cutting waste.`,
        keywords: [
          `how many pallets of sod for ${area} sq ft`,
          `${area} sq ft sod calculator`,
          `how many rolls of sod for ${area} sq ft lawn`,
          'turf grass pallet calculator',
          'lawn sod square footage estimator',
        ],
        canonicalPath: '/sod-calculator',
        queryString: `area=${area}&pallets=${pallets}`,
        h1Context: `${area.toLocaleString()} Sq Ft Lawn (${pallets} Pallets)`,
        calculatedValues: {
          areaSqFt: area,
          pallets,
          rolls,
          palletSizeSqFt: palletYield,
        },
      };
    }

    case 'curtains_drapery': {
      const drop = input.finishedDropInches;
      const rod = input.trackWidthInches;
      const fullness = input.fullness;
      const yards = input.totalYards.toFixed(2);
      const widths = input.totalWidthsNeeded;

      return {
        title: `Curtains: ${drop}" Drop × ${rod}" Rod (${fullness}x Fullness) — ${yards} Yards | Material Yardage`,
        metaDescription: `Calculate drapery fabric for a ${drop}" drop and ${rod}" rod with ${fullness}x fullness: requires ${yards} linear yards (${widths} widths of ${input.fabricWidthInches}" fabric).`,
        keywords: [
          `how much fabric for ${drop} inch curtains`,
          `curtain yardage calculator ${drop} drop`,
          `how many yards of fabric for ${rod} inch window rod`,
          `${fullness}x fullness drapery fabric calculator`,
          'curtain panel width and hem calculator',
        ],
        canonicalPath: '/curtain-fabric-calculator',
        queryString: `drop=${drop}&rod=${rod}&fullness=${fullness}`,
        h1Context: `${drop}" Drop × ${rod}" Rod (${fullness}x Fullness)`,
        calculatedValues: {
          finishedDrop: drop,
          trackWidth: rod,
          fullness,
          totalYards: yards,
          widthsNeeded: widths,
        },
      };
    }

    case 'fabric_cut': {
      const width = input.usableWidth;
      const pieces = input.totalPieces;
      const yards = input.totalYards.toFixed(2);

      return {
        title: `Fabric Cut Planner: ${pieces} Pieces on ${width}" Fabric — ${yards} Yards | Material Yardage`,
        metaDescription: `2D roll cutting layout for ${pieces} pattern pieces on ${width}" fabric bolt: requires ${yards} linear yards with optimized guillotine cut packing and low waste.`,
        keywords: [
          `fabric cut layout calculator ${width} inch bolt`,
          `how many yards of fabric for ${pieces} pieces`,
          '2d fabric roll cutting planner',
          'sewing yardage calculator with cutting layout',
          'fabric bolt width yardage optimizer',
        ],
        canonicalPath: '/fabric-yardage-calculator',
        queryString: `bolt=${width}&pieces=${pieces}`,
        h1Context: `${pieces} Pieces on ${width}" Fabric Roll`,
        calculatedValues: {
          boltWidth: width,
          pieceCount: pieces,
          totalYards: yards,
        },
      };
    }

    case 'quilt_backing': {
      const w = input.topWidthInches;
      const l = input.topLengthInches;
      const bolt = input.fabricWidthInches;
      const totalYards = input.totalYards.toFixed(2);
      const backingYds = input.backingYards.toFixed(2);
      const bindingYds = input.bindingYards.toFixed(2);

      return {
        title: `Quilt Backing: ${w}" × ${l}" Quilt (${bolt}" Fabric) — ${totalYards} Yards | Material Yardage`,
        metaDescription: `Calculate quilt backing and binding for a ${w}" × ${l}" quilt top on ${bolt}" fabric: requires ${backingYds} yd backing + ${bindingYds} yd binding (${totalYards} yd total).`,
        keywords: [
          `quilt backing calculator ${w}x${l}`,
          `how much fabric for ${w} by ${l} quilt backing`,
          `quilt binding yardage for ${w}x${l} quilt`,
          `${w}x${l} quilt on ${bolt} inch fabric`,
          'quilt backing yardage and seam planner',
        ],
        canonicalPath: '/quilt-backing-calculator',
        queryString: `w=${w}&l=${l}&bolt=${bolt}`,
        h1Context: `${w}" × ${l}" Quilt Top (${bolt}" Fabric)`,
        calculatedValues: {
          quiltWidth: w,
          quiltLength: l,
          boltWidth: bolt,
          totalYards,
          backingYards: backingYds,
          bindingYards: bindingYds,
        },
      };
    }

    case 'upholstery_cushions': {
      const count = input.cushionCount;
      const w = input.cushionWidth;
      const d = input.cushionDepth;
      const thick = input.foamThickness;
      const yards = input.totalFabricYards.toFixed(2);

      return {
        title: `${count} Box Cushions (${w}" × ${d}" × ${thick}") — ${yards} Yds Upholstery | Material Yardage`,
        metaDescription: `Calculate upholstery fabric for ${count} box cushions (${w}" × ${d}" × ${thick}"): requires ${yards} yards of ${input.fabricWidth}" decorator fabric with boxing strips and welting cord.`,
        keywords: [
          `upholstery fabric for ${count} box cushions`,
          `box cushion yardage calculator ${w}x${d}x${thick}`,
          `how many yards of fabric for ${count} cushions`,
          'cushion foam and boxing strip fabric calculator',
          'furniture reupholstery fabric yardage',
        ],
        canonicalPath: '/upholstery-calculator',
        queryString: `count=${count}&w=${w}&d=${d}&t=${thick}`,
        h1Context: `${count}× Cushions (${w}" × ${d}" × ${thick}")`,
        calculatedValues: {
          cushionCount: count,
          cushionWidth: w,
          cushionDepth: d,
          foamThickness: thick,
          totalYards: yards,
        },
      };
    }

    case 'wallpaper_calc': {
      const w = input.wallWidth || 12;
      const h = input.wallHeight || 9;
      const sqft = input.netSqFt.toFixed(1);
      const rolls = input.recommendedRolls;
      const strips = input.totalStrips;

      return {
        title: `${w}' × ${h}' Wall Wallpaper Calculator (${sqft} Sq Ft) — ${rolls} Rolls Needed | Material Yardage`,
        metaDescription: `How many rolls of wallpaper for a ${w}' × ${h}' wall? Requires ${rolls} rolls (${strips} vertical strips, ${sqft} sq ft net coverage) with pattern repeat matching on Material Yardage.`,
        keywords: [
          `${w}x${h} wallpaper calculator`,
          `how many rolls of wallpaper for ${w} by ${h} wall`,
          `wallpaper roll estimator ${sqft} sq ft`,
          `wallpaper drop match pattern calculator`,
        ],
        canonicalPath: '/wallpaper-calculator',
        queryString: `w=${w}&h=${h}&rolls=${rolls}`,
        h1Context: `${w}' × ${h}' Wall (${rolls} Rolls Needed)`,
        calculatedValues: {
          wallWidth: w,
          wallHeight: h,
          netSqFt: sqft,
          rollsNeeded: rolls,
          stripsNeeded: strips,
        },
      };
    }

    case 'retaining_wall': {
      const l = input.wallLength || 25;
      const h = input.wallHeight || 3;
      const blocks = input.totalBlocks;
      const gravel = input.baseGravelTons.toFixed(1);
      const drain = input.drainageStoneTons.toFixed(1);

      return {
        title: `${l}' × ${h}' Retaining Wall Calculator — ${blocks} Blocks, ${gravel}T Base Gravel | Material Yardage`,
        metaDescription: `Calculate concrete blocks and materials for a ${l}ft long by ${h}ft high retaining wall: requires ${blocks} modular blocks, ${gravel} tons leveling gravel, and ${drain} tons drainage backfill on Material Yardage.`,
        keywords: [
          `${l}x${h} retaining wall calculator`,
          `how many retaining wall blocks for ${l} foot wall`,
          `retaining wall base gravel and drainage calculator`,
          `retaining wall block estimator`,
        ],
        canonicalPath: '/masonry/retaining-wall',
        queryString: `l=${l}&h=${h}&blocks=${blocks}`,
        h1Context: `${l}' × ${h}' Wall (${blocks} Blocks & Base Kit)`,
        calculatedValues: {
          wallLength: l,
          wallHeight: h,
          totalBlocks: blocks,
          baseGravelTons: gravel,
          drainageStoneTons: drain,
        },
      };
    }
  }
}

/**
 * Injects dynamic SEO metadata directly into document head
 */
export function injectDynamicSEO(
  seo: DynamicSEOResult,
  options: { updateUrl?: boolean } = {}
): void {
  if (typeof document === 'undefined') return;

  // 1. Update <title>
  document.title = seo.title;

  // 2. Helper to set/create <meta> tags
  const setMeta = (name: string, content: string, isProperty: boolean = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Meta description and long-tail keywords
  setMeta('description', seo.metaDescription);
  if (seo.keywords.length > 0) {
    setMeta('keywords', seo.keywords.join(', '));
  }

  // 4. OpenGraph tags
  setMeta('og:title', seo.title, true);
  setMeta('og:description', seo.metaDescription, true);
  setMeta('og:type', 'website', true);
  setMeta('og:site_name', 'Material Yardage', true);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${seo.canonicalPath}${seo.queryString ? `?${seo.queryString}` : ''}`
    : `https://www.materialyardage.com${seo.canonicalPath}`;

  setMeta('og:url', fullUrl, true);

  // 5. Twitter cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', seo.metaDescription);

  // 6. Canonical link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${window.location.origin}${seo.canonicalPath}`);

  // 7. Inject / Update Schema.org JSON-LD structured data with long-tail item details
  try {
    let scriptEl = document.getElementById('seo-schema-script') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'seo-schema-script';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemaGraph = [
      {
        '@type': 'WebApplication',
        '@id': `${fullUrl}#app`,
        name: seo.title,
        url: fullUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript and HTML5',
        description: seo.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'ItemPage',
        '@id': `${fullUrl}#calculation`,
        name: seo.title,
        description: seo.metaDescription,
        mainEntity: {
          '@type': 'QuantitativeValue',
          name: seo.h1Context,
          value: JSON.stringify(seo.calculatedValues),
        },
      },
    ];

    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph,
    });
  } catch {
    // Graceful fallback if DOM is not ready
  }

  // 8. Optionally update URL query string without reloading page
  if (options.updateUrl && typeof window !== 'undefined' && seo.queryString) {
    const newUrl = `${seo.canonicalPath}?${seo.queryString}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }
}

// Active calculation store for Job-Site Print Modal and PDF export
let activeCalculationState: CalculatorSEOInput | null = null;
const calcListeners = new Set<(calc: CalculatorSEOInput | null) => void>();

export function getActiveCalculation(): CalculatorSEOInput | null {
  return activeCalculationState;
}

export function subscribeToActiveCalculation(callback: (calc: CalculatorSEOInput | null) => void) {
  calcListeners.add(callback);
  callback(activeCalculationState);
  return () => {
    calcListeners.delete(callback);
  };
}

/**
 * React hook that dynamically generates and injects SEO metadata
 * debounced as user adjusts calculator inputs.
 */
export function useDynamicCalculatorSEO(
  input: CalculatorSEOInput | null,
  options: { debounceMs?: number; updateUrlQuery?: boolean } = {}
): DynamicSEOResult | null {
  const { debounceMs = 200, updateUrlQuery = false } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultRef = useRef<DynamicSEOResult | null>(null);

  useEffect(() => {
    if (!input) return;

    // Update active calculation store for print modal & spec sheet generator
    activeCalculationState = input;
    calcListeners.forEach(listener => {
      try {
        listener(input);
      } catch (err) {
        console.error('Error notifying calculation listener:', err);
      }
    });

    const seo = generateDynamicSEO(input);
    resultRef.current = seo;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      injectDynamicSEO(seo, { updateUrl: updateUrlQuery });
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [JSON.stringify(input), debounceMs, updateUrlQuery]);

  return resultRef.current;
}

/**
 * Helper to parse query parameters for URL hydration / deep-linking
 */
export function readCalculatorQueryParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((val, key) => {
    result[key] = val;
  });
  return result;
}
