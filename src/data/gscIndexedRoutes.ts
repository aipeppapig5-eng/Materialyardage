export interface GSCIndexedRoute {
  path: string; // e.g. 'concrete/slab'
  fullUrl: string; // e.g. 'https://www.materialyardage.com/concrete/slab'
  lastCrawled: string; // e.g. '2026-11-04'
  title: string;
  metaDescription: string;
  h1: string;
  targetCalculator: string; // e.g. 'concrete_calc'
  category: 'construction' | 'fabric' | 'company' | 'guide';
  subType?: string; // e.g. 'slab', 'topsoil', 'brick', 'mortar', 'cmu'
  guideSlug?: string;
  isModalTrigger?: 'converter' | 'reference' | 'comparison';
  breadcrumbs: { name: string; url: string }[];
}

export const GSC_INDEXED_ROUTES: Record<string, GSCIndexedRoute> = {
  // 1. Fabric Yardage Calculator
  'fabric-yardage-calculator': {
    path: 'fabric-yardage-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric-yardage-calculator',
    lastCrawled: '2026-11-07',
    title: 'Fabric Yardage Calculator — 2D Cut Layout & Piece Planner',
    metaDescription: 'Free fabric yardage calculator with 2D cutting layout visualizer. Estimate yardage from piece dimensions, bolt width (44"-60"), and pattern repeats with zero waste.',
    h1: 'Fabric Yardage Calculator & 2D Cutting Layout Planner',
    targetCalculator: 'fabric_cut',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric Yardage Calculator', url: '/fabric-yardage-calculator' },
    ],
  },

  // 2. Guide: Mulch Depth and Coverage Guide
  'guides/mulch-depth-and-coverage-guide': {
    path: 'guides/mulch-depth-and-coverage-guide',
    fullUrl: 'https://www.materialyardage.com/guides/mulch-depth-and-coverage-guide',
    lastCrawled: '2026-11-07',
    title: 'Mulch Depth & Coverage Guide — How Many Bags or Yards Do I Need?',
    metaDescription: 'Complete landscaping guide to mulch depth and coverage. Learn when to use 2", 3", or 4" layers, retail bag conversions, and cubic yard coverage charts.',
    h1: 'Mulch Depth & Coverage Calculation Guide',
    targetCalculator: 'guide_detail',
    guideSlug: 'mulch-depth-and-coverage-guide',
    category: 'guide',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Guides Library', url: '/guides' },
      { name: 'Mulch Depth Guide', url: '/guides/mulch-depth-and-coverage-guide' },
    ],
  },

  // 3. Topsoil Calculator
  'topsoil-calculator': {
    path: 'topsoil-calculator',
    fullUrl: 'https://www.materialyardage.com/topsoil-calculator',
    lastCrawled: '2026-11-06',
    title: 'Topsoil Calculator — Cubic Yards, Tons & Garden Soil Mix',
    metaDescription: 'Free topsoil calculator. Calculate cubic yards and tons of screened loam, garden blend, or compost for lawn grading, raised planter beds, and lawn top-dressing.',
    h1: 'Topsoil & Screened Loam Volume Calculator',
    targetCalculator: 'mulch_soil',
    category: 'construction',
    subType: 'topsoil',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Topsoil Calculator', url: '/topsoil-calculator' },
    ],
  },

  // 4. Landscaping Sod
  'landscaping/sod': {
    path: 'landscaping/sod',
    fullUrl: 'https://www.materialyardage.com/landscaping/sod',
    lastCrawled: '2026-11-06',
    title: 'Sod & Turfgrass Calculator — Rolls, Pallets & Lawn Square Footage',
    metaDescription: 'Calculate sod rolls and pallets for lawn installation. Accounts for standard 2x5 ft turf rolls, 450-500 sq ft pallets, and edge trimming waste allowances.',
    h1: 'Lawn Sod & Turfgrass Quantity Calculator',
    targetCalculator: 'sod_turf',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Landscaping', url: '/landscaping/sod' },
      { name: 'Sod Calculator', url: '/landscaping/sod' },
    ],
  },

  // 5. Masonry Mortar
  'masonry/mortar': {
    path: 'masonry/mortar',
    fullUrl: 'https://www.materialyardage.com/masonry/mortar',
    lastCrawled: '2026-11-05',
    title: 'Mortar Calculator — Type N & S Bags for Brick & Block Walls',
    metaDescription: 'Estimate 80lb mortar mix bags for brick masonry and CMU block construction. Calculates exact mortar volume per 100 blocks or 1,000 modular bricks.',
    h1: 'Brick & Block Masonry Mortar Calculator',
    targetCalculator: 'paver_masonry',
    category: 'construction',
    subType: 'mortar',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Masonry', url: '/masonry' },
      { name: 'Mortar Calculator', url: '/masonry/mortar' },
    ],
  },

  // 6. Homepage
  '': {
    path: '',
    fullUrl: 'https://www.materialyardage.com/',
    lastCrawled: '2026-11-05',
    title: 'Material Yardage — Construction & Fabric Material Estimators',
    metaDescription: 'Precision material yardage calculators for construction, landscaping, and textiles. 2D cutting layout visualizer, cubic yard converters, and interactive BOM estimator.',
    h1: 'Precision Material & Fabric Yardage Calculators',
    targetCalculator: 'fabric_cut',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
    ],
  },

  // 7. Guides Hub
  'guides': {
    path: 'guides',
    fullUrl: 'https://www.materialyardage.com/guides',
    lastCrawled: '2026-11-04',
    title: 'Material Guides & Formulas Library — Material Yardage',
    metaDescription: 'Comprehensive material estimation knowledge base. Explore step-by-step calculation formulas, density charts, and trade guidance for landscaping, masonry, and textiles.',
    h1: 'Material & Fabric Calculation Guides Library',
    targetCalculator: 'guides',
    category: 'guide',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Guides Library', url: '/guides' },
    ],
  },

  // 8. Gravel Calculator
  'gravel-calculator': {
    path: 'gravel-calculator',
    fullUrl: 'https://www.materialyardage.com/gravel-calculator',
    lastCrawled: '2026-11-04',
    title: 'Gravel Calculator — Crushed Stone, Pea Gravel & Road Base Tons',
    metaDescription: 'Free gravel calculator for driveways, paths, and french drains. Calculate cubic yards, US tons, metric tonnes, and truckloads from length, width, and depth.',
    h1: 'Gravel, Aggregate & Crushed Stone Calculator',
    targetCalculator: 'gravel_aggregate',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Gravel Calculator', url: '/gravel-calculator' },
    ],
  },

  // 9. Guide Alias: Mulch Depth Guide
  'guides/mulch-depth-guide': {
    path: 'guides/mulch-depth-guide',
    fullUrl: 'https://www.materialyardage.com/guides/mulch-depth-guide',
    lastCrawled: '2026-11-04',
    title: 'Mulch Depth Guide — Recommended Thickness for Landscape Beds',
    metaDescription: 'How deep should mulch be? Expert guidance on 2" vs 3" vs 4" depth for weed prevention, tree root safety, and moisture retention.',
    h1: 'Mulch Depth & Thickness Guide',
    targetCalculator: 'guide_detail',
    guideSlug: 'mulch-depth-and-coverage-guide',
    category: 'guide',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Guides', url: '/guides' },
      { name: 'Mulch Depth Guide', url: '/guides/mulch-depth-guide' },
    ],
  },

  // 10. Landscaping Compost Mix
  'landscaping/compost-mix': {
    path: 'landscaping/compost-mix',
    fullUrl: 'https://www.materialyardage.com/landscaping/compost-mix',
    lastCrawled: '2026-11-04',
    title: 'Compost & Organic Soil Blend Calculator — Raised Bed Yardage',
    metaDescription: 'Calculate organic compost and garden soil blends for raised beds and turf top-dressing. Convert cubic feet to yards with bulk weight estimates.',
    h1: 'Compost & Raised Bed Soil Blend Calculator',
    targetCalculator: 'mulch_soil',
    category: 'construction',
    subType: 'compost',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Landscaping', url: '/landscaping/compost-mix' },
      { name: 'Compost Calculator', url: '/landscaping/compost-mix' },
    ],
  },

  // 11. Reference Material Density Chart
  'reference/material-density-chart': {
    path: 'reference/material-density-chart',
    fullUrl: 'https://www.materialyardage.com/reference/material-density-chart',
    lastCrawled: '2026-11-04',
    title: 'Material Density & Weight Chart — Tons per Cubic Yard Table',
    metaDescription: 'Bulk material density reference table. Verify weight per cubic yard and cubic meter for gravel, sand, topsoil, mulch, concrete, and crushed stone.',
    h1: 'Bulk Material Density & Weight Conversion Chart',
    targetCalculator: 'gravel_aggregate',
    category: 'construction',
    isModalTrigger: 'reference',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Reference', url: '/reference/material-density-chart' },
    ],
  },

  // 12. Reference Conversion Tables
  'reference/conversion-tables': {
    path: 'reference/conversion-tables',
    fullUrl: 'https://www.materialyardage.com/reference/conversion-tables',
    lastCrawled: '2026-11-04',
    title: 'Material Conversion Tables — Cubic Yards, Feet, Meters & Tons',
    metaDescription: 'Interactive material conversion calculator. Instantly convert cubic yards, cubic feet, cubic meters, tons, tonnes, and linear fabric yards.',
    h1: 'Material & Yardage Unit Conversion Tables',
    targetCalculator: 'fabric_cut',
    category: 'construction',
    isModalTrigger: 'converter',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Reference', url: '/reference/conversion-tables' },
    ],
  },

  // 13. Materials Aggregate
  'materials/aggregate': {
    path: 'materials/aggregate',
    fullUrl: 'https://www.materialyardage.com/materials/aggregate',
    lastCrawled: '2026-11-04',
    title: 'Crushed Stone & Aggregate Calculator — Base Course & #57 Stone',
    metaDescription: 'Estimate tons and cubic yards of dense graded base, crushed stone, and washed gravel for civil foundations, road beds, and drainage ditches.',
    h1: 'Crushed Stone & Base Aggregate Calculator',
    targetCalculator: 'gravel_aggregate',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Materials', url: '/materials' },
      { name: 'Aggregates', url: '/materials/aggregate' },
    ],
  },

  // 14. Guide Alias: Paver Calculator Guide
  'guides/paver-calculator-guide': {
    path: 'guides/paver-calculator-guide',
    fullUrl: 'https://www.materialyardage.com/guides/paver-calculator-guide',
    lastCrawled: '2026-11-04',
    title: 'Paver Patio Calculator Guide — Sub-base, Sand & Edge Restraint',
    metaDescription: 'Step-by-step guide to calculating patio pavers, 4" crushed stone road base, 1" setting bed sand, and polymeric jointing sand bags.',
    h1: 'Paver Patio & Walkway Calculation Guide',
    targetCalculator: 'guide_detail',
    guideSlug: 'paver-patio-base-and-sand-depth-guide',
    category: 'guide',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Guides', url: '/guides' },
      { name: 'Paver Guide', url: '/guides/paver-calculator-guide' },
    ],
  },

  // 15. Paving Paver
  'paving/paver': {
    path: 'paving/paver',
    fullUrl: 'https://www.materialyardage.com/paving/paver',
    lastCrawled: '2026-11-04',
    title: 'Interlocking Paver Calculator — Patio, Walkway & Driveway Pavers',
    metaDescription: 'Calculate brick pavers, bedding sand, and polymeric joint sand for patios and walkways. Includes 4x8, 6x6, 6x9, and herringbone pattern waste factors.',
    h1: 'Interlocking Brick Paver Quantity Calculator',
    targetCalculator: 'paver_masonry',
    category: 'construction',
    subType: 'pavers',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Paving', url: '/paving/paver' },
      { name: 'Paver Calculator', url: '/paving/paver' },
    ],
  },

  // 16. Concrete Slab
  'concrete/slab': {
    path: 'concrete/slab',
    fullUrl: 'https://www.materialyardage.com/concrete/slab',
    lastCrawled: '2026-11-04',
    title: 'Concrete Slab Calculator — Ready-Mix Yards, 80lb Bags & Rebar',
    metaDescription: 'Calculate concrete volume for residential patios, driveways, sidewalks, and garage slabs. Includes ready-mix cubic yards, bag counts (40/60/80 lb), and rebar grid.',
    h1: 'Concrete Patio & Driveway Slab Calculator',
    targetCalculator: 'concrete_calc',
    category: 'construction',
    subType: 'slab',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Concrete', url: '/concrete' },
      { name: 'Slab Calculator', url: '/concrete/slab' },
    ],
  },

  // 17. Masonry Block
  'masonry/block': {
    path: 'masonry/block',
    fullUrl: 'https://www.materialyardage.com/masonry/block',
    lastCrawled: '2026-11-04',
    title: 'Concrete Block (CMU) Calculator — 8x8x16 Blocks & Mortar',
    metaDescription: 'Calculate standard 8x8x16 cinder blocks (CMU) and mortar mix for foundation walls, retaining walls, and partition structures with 8% waste.',
    h1: 'CMU Concrete Block Wall Calculator',
    targetCalculator: 'paver_masonry',
    category: 'construction',
    subType: 'cmu',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Masonry', url: '/masonry' },
      { name: 'Block Calculator', url: '/masonry/block' },
    ],
  },

  // 18. Contact
  'contact': {
    path: 'contact',
    fullUrl: 'https://www.materialyardage.com/contact',
    lastCrawled: '2026-11-04',
    title: 'Contact Us — Material Yardage Support & Feedback',
    metaDescription: 'Get in touch with the Material Yardage engineering team for trade inquiries, calculator feature requests, and partnership support.',
    h1: 'Contact Material Yardage',
    targetCalculator: 'contact',
    category: 'company',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' },
    ],
  },

  // 19. Privacy Policy
  'privacy-policy': {
    path: 'privacy-policy',
    fullUrl: 'https://www.materialyardage.com/privacy-policy',
    lastCrawled: '2026-11-04',
    title: 'Privacy Policy — Material Yardage',
    metaDescription: 'Material Yardage privacy policy. Details our data handling practices, cookie policies, Google AdSense compliance, and GDPR/CCPA protections.',
    h1: 'Privacy Policy',
    targetCalculator: 'privacy',
    category: 'company',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy' },
    ],
  },

  // 20. Materials Overview
  'materials': {
    path: 'materials',
    fullUrl: 'https://www.materialyardage.com/materials',
    lastCrawled: '2026-11-04',
    title: 'Construction & Landscaping Materials Directory — Material Yardage',
    metaDescription: 'Browse all supported bulk construction and landscaping materials including concrete, crushed stone, mulch, soil, sand, pavers, and turf.',
    h1: 'Bulk Construction & Landscaping Materials Directory',
    targetCalculator: 'mulch_soil',
    category: 'construction',
    isModalTrigger: 'comparison',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Materials Directory', url: '/materials' },
    ],
  },

  // 21. Fabric Unit Converter
  'fabric/unit-converter': {
    path: 'fabric/unit-converter',
    fullUrl: 'https://www.materialyardage.com/fabric/unit-converter',
    lastCrawled: '2026-11-03',
    title: 'Fabric Unit Converter — Yards, Inches, Centimeters & Meters',
    metaDescription: 'Convert sewing measurements seamlessly between inches, linear yards, centimeters, and meters. Built for seamstresses, quilters, and drapery designers.',
    h1: 'Textile & Sewing Measurement Unit Converter',
    targetCalculator: 'fabric_cut',
    category: 'fabric',
    isModalTrigger: 'converter',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Unit Converter', url: '/fabric/unit-converter' },
    ],
  },

  // 22. Masonry Hub
  'masonry': {
    path: 'masonry',
    fullUrl: 'https://www.materialyardage.com/masonry',
    lastCrawled: '2026-11-02',
    title: 'Masonry Calculators — Brick, CMU Block, Pavers & Mortar',
    metaDescription: 'Suite of professional masonry calculators. Estimate brick courses, concrete masonry units (CMU), mortar bags, and patio pavers accurately.',
    h1: 'Brick, Block & Stone Masonry Calculators',
    targetCalculator: 'paver_masonry',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Masonry', url: '/masonry' },
    ],
  },

  // 23. Fabric Yardage Calculator (Categorized)
  'fabric/yardage-calculator': {
    path: 'fabric/yardage-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric/yardage-calculator',
    lastCrawled: '2026-11-02',
    title: 'Fabric Yardage Calculator — 2D Pattern Piece Bin-Packing',
    metaDescription: 'Calculate how many yards of fabric you need. Input cut dimensions on 44", 54", or 60" bolt widths with visual 2D roll nesting diagrams.',
    h1: 'Fabric Yardage & Pattern Piece Calculator',
    targetCalculator: 'fabric_cut',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Yardage Calculator', url: '/fabric/yardage-calculator' },
    ],
  },

  // 24. Fabric Hub
  'fabric': {
    path: 'fabric',
    fullUrl: 'https://www.materialyardage.com/fabric',
    lastCrawled: '2026-10-31',
    title: 'Fabric & Sewing Calculators — Yardage, Drapes, Quilts & Upholstery',
    metaDescription: 'Collection of precision sewing and fabric yardage calculators. Features 2D roll nesting, curtain fullness multipliers, quilt backing seams, and box cushions.',
    h1: 'Fabric & Textile Yardage Calculators',
    targetCalculator: 'fabric_cut',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric Calculators', url: '/fabric' },
    ],
  },

  // 25. Fabric Curtain Calculator
  'fabric/curtain-calculator': {
    path: 'fabric/curtain-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric/curtain-calculator',
    lastCrawled: '2026-10-31',
    title: 'Curtain & Drapery Fabric Calculator — Fullness, Hems & Pattern Repeats',
    metaDescription: 'Calculate yardage for custom pinch pleat, grommet, and rod pocket drapery panels. Handles 1.5x–2.5x fullness, double hems, headings, and pattern repeats.',
    h1: 'Curtain & Drapery Fabric Yardage Calculator',
    targetCalculator: 'curtains_drapery',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Curtain Calculator', url: '/fabric/curtain-calculator' },
    ],
  },

  // 26. About
  'about': {
    path: 'about',
    fullUrl: 'https://www.materialyardage.com/about',
    lastCrawled: '2026-10-29',
    title: 'About Material Yardage — Engineering Precision Estimators',
    metaDescription: 'Learn about the mission, engineering algorithms, and verified material density standards behind Material Yardage trade calculators.',
    h1: 'About Material Yardage',
    targetCalculator: 'about',
    category: 'company',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about' },
    ],
  },

  // 27. Fabric Upholstery Calculator
  'fabric/upholstery-calculator': {
    path: 'fabric/upholstery-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric/upholstery-calculator',
    lastCrawled: '2026-10-28',
    title: 'Upholstery & Cushion Fabric Calculator — Box Foam & Welted Piping',
    metaDescription: 'Calculate yardage for custom box cushions, sofa seating, foam inserts, boxing strips, and bias welting piping cord with zero waste.',
    h1: 'Upholstery & Box Cushion Fabric Calculator',
    targetCalculator: 'upholstery_cushions',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Upholstery Calculator', url: '/fabric/upholstery-calculator' },
    ],
  },

  // 28. Fabric Cutting Layout Calculator
  'fabric/cutting-layout-calculator': {
    path: 'fabric/cutting-layout-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric/cutting-layout-calculator',
    lastCrawled: '2026-10-27',
    title: 'Fabric 2D Cutting Layout Planner — Bolt Optimization',
    metaDescription: 'Visual 2D fabric cut layout optimizer. Generates interactive cut plans for sewing pieces across standard fabric bolt widths with offcut diagrams.',
    h1: 'Fabric 2D Cutting Layout Optimizer',
    targetCalculator: 'fabric_cut',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Cutting Layout Calculator', url: '/fabric/cutting-layout-calculator' },
    ],
  },

  // 29. Concrete Hub
  'concrete': {
    path: 'concrete',
    fullUrl: 'https://www.materialyardage.com/concrete',
    lastCrawled: '2026-10-26',
    title: 'Concrete Calculators — Slabs, Footings, Ready-Mix & Bags',
    metaDescription: 'Professional concrete calculators for residential construction. Calculate slabs, Sonotube columns, stairs, footings, and bag requirements.',
    h1: 'Concrete Slabs, Columns & Footings Calculators',
    targetCalculator: 'concrete_calc',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Concrete', url: '/concrete' },
    ],
  },

  // 30. Quilt Backing & Binding Calculator
  'fabric/quilt-backing-binding-calculator': {
    path: 'fabric/quilt-backing-binding-calculator',
    fullUrl: 'https://www.materialyardage.com/fabric/quilt-backing-binding-calculator',
    lastCrawled: '2026-10-25',
    title: 'Quilt Backing & Binding Fabric Calculator — Seam Layouts & Strips',
    metaDescription: 'Calculate quilt backing yardage, horizontal vs vertical seam layouts, 108" wide-back comparisons, and continuous binding strips with mitered corners.',
    h1: 'Quilt Backing & Binding Yardage Calculator',
    targetCalculator: 'quilt_backing',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Fabric', url: '/fabric' },
      { name: 'Quilt Backing Calculator', url: '/fabric/quilt-backing-binding-calculator' },
    ],
  },

  // 31. Concrete Cement
  'concrete/cement': {
    path: 'concrete/cement',
    fullUrl: 'https://www.materialyardage.com/concrete/cement',
    lastCrawled: '2026-10-11',
    title: 'Cement & Concrete Bag Calculator — 40lb, 60lb & 80lb Bags',
    metaDescription: 'Calculate how many bags of pre-mixed concrete (40 lb, 60 lb, 80 lb) or Portland cement you need for slabs, fence posts, and masonry repairs.',
    h1: 'Pre-Mixed Concrete Bag & Portland Cement Calculator',
    targetCalculator: 'concrete_calc',
    category: 'construction',
    subType: 'bags',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Concrete', url: '/concrete' },
      { name: 'Cement & Bags', url: '/concrete/cement' },
    ],
  },

  // 32. Concrete Mix Proportions
  'concrete/mix-proportions': {
    path: 'concrete/mix-proportions',
    fullUrl: 'https://www.materialyardage.com/concrete/mix-proportions',
    lastCrawled: '2026-10-11',
    title: 'Concrete Mix Proportions Calculator — 1:2:4 Cement, Sand & Gravel',
    metaDescription: 'Calculate scratch concrete batches using standard 1:2:3 and 1:2:4 mix ratios. Determine exact Portland cement bags, sand cubic feet, gravel, and water gallons.',
    h1: 'Concrete Batch Mix Proportions Calculator (1:2:4 Ratio)',
    targetCalculator: 'concrete_calc',
    category: 'construction',
    subType: 'mix',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Concrete', url: '/concrete' },
      { name: 'Mix Proportions', url: '/concrete/mix-proportions' },
    ],
  },

  // 33. Retaining Wall Calculator
  'retaining-wall-calculator': {
    path: 'retaining-wall-calculator',
    fullUrl: 'https://www.materialyardage.com/retaining-wall-calculator',
    lastCrawled: '2026-11-08',
    title: 'Retaining Wall Calculator — Blocks, Capstones, Gravel & Geogrid',
    metaDescription: 'Free retaining wall calculator. Estimate total wall blocks, buried base course, wall capstones, 6" leveling trench gravel, 12" drainage stone, and geogrid.',
    h1: 'Retaining Wall & Gravity Block Calculator',
    targetCalculator: 'retaining_wall',
    category: 'construction',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retaining Wall Calculator', url: '/retaining-wall-calculator' },
    ],
  },

  // 34. Wallpaper Calculator
  'wallpaper-calculator': {
    path: 'wallpaper-calculator',
    fullUrl: 'https://www.materialyardage.com/wallpaper-calculator',
    lastCrawled: '2026-11-08',
    title: 'Wallpaper Calculator — Rolls, Pattern Repeat Drops & Paste',
    metaDescription: 'Free wallpaper calculator for accent walls and full rooms. Accounts for pattern repeat drops (straight & half-drop match), window deductions, and adhesive paste.',
    h1: 'Wallpaper & Wallcovering Quantity Calculator',
    targetCalculator: 'wallpaper_calc',
    category: 'fabric',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Wallpaper Calculator', url: '/wallpaper-calculator' },
    ],
  },
};

/**
 * Resolves any incoming path (with or without slashes) against the Google Search Console index registry
 */
export function resolveGSCPath(pathname: string): GSCIndexedRoute | null {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  // 1. Direct match
  if (GSC_INDEXED_ROUTES[clean]) {
    return GSC_INDEXED_ROUTES[clean];
  }

  // 2. Trailing slash or prefix normalization
  for (const [routeKey, routeData] of Object.entries(GSC_INDEXED_ROUTES)) {
    if (routeKey === clean || routeData.path === clean) {
      return routeData;
    }
  }

  // 3. Fallback matching for partial directory matches
  if (clean.startsWith('guides/')) {
    const slug = clean.replace(/^guides\//, '');
    if (slug === 'mulch-depth-guide') {
      return GSC_INDEXED_ROUTES['guides/mulch-depth-guide'];
    }
    if (slug === 'paver-calculator-guide') {
      return GSC_INDEXED_ROUTES['guides/paver-calculator-guide'];
    }
  }

  return null;
}
