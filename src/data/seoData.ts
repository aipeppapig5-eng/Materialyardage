export interface PageSEO {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalPath: string;
  category: 'fabric' | 'construction' | 'legal' | 'company';
  h1: string;
  lead: string;
  formula: {
    title: string;
    expression: string;
    explanation: string;
  };
  workedExample: {
    title: string;
    scenario: string;
    steps: string[];
    result: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const SEO_PAGES: Record<string, PageSEO> = {
  fabric_cut: {
    slug: 'fabric-yardage-calculator',
    title: 'Fabric Yardage Calculator — 2D Cut Layout & Piece Planner',
    metaDescription: 'Free fabric yardage calculator with 2D cutting layout visualizer. Estimate yardage from piece dimensions, bolt width (44"-60"), and pattern repeats with zero waste.',
    keywords: ['fabric yardage calculator', 'sewing yardage calculator', 'fabric cut layout planner', 'how much fabric do i need', 'fabric bolt width calculator'],
    canonicalPath: '/fabric-yardage-calculator',
    category: 'fabric',
    h1: 'Fabric Yardage Calculator & 2D Cutting Layout Planner',
    lead: 'Enter your individual pattern pieces, usable bolt width, seam allowances, and pattern repeats to generate an optimized 2D cutting diagram with exact yardage and offcut waste calculations.',
    formula: {
      title: 'Fabric Yardage Formula',
      expression: 'Total Linear Yards = [Number of Rows × (Piece Length + Row Allowance) × (1 + Purchase Margin %)] ÷ 36',
      explanation: 'Pieces across fabric width = floor(Usable Width ÷ Effective Cut Width). Total rows = ceil(Total Piece Quantity ÷ Pieces Across).',
    },
    workedExample: {
      title: 'Worked Example: 6 Dining Seat Cushions on 54" Fabric',
      scenario: 'You need 6 cushion top panels measuring 22" length × 20" width on 54" usable decorator fabric with 0.5" seam allowances.',
      steps: [
        'Calculate effective cut size with seams: 23" length × 21" width.',
        'Determine pieces fitting across width: floor(54" ÷ 21") = 2 pieces across.',
        'Calculate rows needed: ceil(6 pieces ÷ 2 per row) = 3 rows.',
        'Calculate total length: 3 rows × 23" = 69 inches.',
        'Add 10% cutting/shrinkage buffer: 69" × 1.10 = 75.9 inches.',
        'Convert to linear yards: 75.9" ÷ 36 = 2.11 yards (round to 2.25 yd).',
      ],
      result: 'Total Fabric Required: 2.25 Linear Yards (approx. 2.06 meters).',
    },
    faqs: [
      {
        question: 'How do I calculate how many yards of fabric I need?',
        answer: 'To calculate fabric yardage: measure each cut piece length and width (including seam allowances). Divide the usable fabric bolt width (e.g., 44" or 54") by your cut width to find how many pieces fit across the roll. Divide total pieces needed by this number to get rows, multiply rows by cut length, and divide by 36 to convert inches to yards.',
      },
      {
        question: 'What is the standard width of fabric on a bolt?',
        answer: 'Quilting cottons and apparel fabrics typically measure 44 to 45 inches wide. Home decor, drapery, and upholstery fabrics are standardized at 54 inches. Heavy canvas and duck fabrics are 60 inches, while seamless wide-back quilt fabrics are 108 inches wide.',
      },
      {
        question: 'How much extra fabric should I purchase for shrinkage or waste?',
        answer: 'For plain solid fabrics, adding 8% to 10% extra is standard to account for pre-washing shrinkage and cutting squaring. If your fabric has a directional pattern, velvet nap, or vertical repeat (plaids/florals), add 15% to 20% extra.',
      },
      {
        question: 'How does vertical pattern repeat affect fabric yardage?',
        answer: 'When working with patterned textiles, each cut length must be rounded up to the next full increment of the vertical repeat so that matching motifs line up across panels or seams. For example, a 30" cut with an 18" repeat requires 36" (2 full repeats) of fabric.',
      },
    ],
  },

  curtains_drapery: {
    slug: 'curtain-fabric-calculator',
    title: 'Curtain Fabric Calculator — Drapery Yardage, Fullness & Hems',
    metaDescription: 'Calculate curtain and drapery fabric yardage. Includes fullness factor presets (1.5x-2.5x), header allowances, double hems, puddling, and pattern repeat matching.',
    keywords: ['curtain fabric calculator', 'drapery yardage calculator', 'how much curtain fabric do i need', 'curtain fullness calculator', 'drapery hem allowance'],
    canonicalPath: '/curtain-fabric-calculator',
    category: 'fabric',
    h1: 'Curtain Fabric & Drapery Yardage Calculator',
    lead: 'Calculate total linear yards and widths of fabric required for single or paired curtain panels based on window rod width, finished drop, fullness multipliers, and pattern repeats.',
    formula: {
      title: 'Curtain Drapery Formula',
      expression: 'Total Yards = [(Finished Drop + Header + Double Hem + Puddle) rounded to Pattern Repeat × Total Widths] ÷ 36',
      explanation: 'Total Gathered Width = Rod Width × Fullness Factor (1.5x to 2.5x). Widths per panel = ceil((Gathered Width ÷ Panels) ÷ Fabric Width).',
    },
    workedExample: {
      title: 'Worked Example: Pair of 84" Living Room Curtains on 72" Rod',
      scenario: 'You want a pair of pinch pleat curtains for a 72" wide window rod, 84" finished drop, 2.0x fullness on 54" fabric, 6" header, 8" double bottom hem, and no puddle.',
      steps: [
        'Calculate total gathered width: 72" rod × 2.0 fullness = 144" total gathered width.',
        'Split between 2 panels: 144" ÷ 2 = 72" per panel.',
        'Calculate fabric widths needed per panel: ceil(72" ÷ 54") = 2 widths per panel (4 total widths).',
        'Calculate cut drop per width: 84" drop + 6" header + 8" double hem = 98" cut length.',
        'Calculate total inches: 98" × 4 widths = 392 inches.',
        'Convert to yards: 392" ÷ 36 = 10.89 linear yards (order 11 yards).',
      ],
      result: 'Total Drapery Fabric Required: 11 Yards of 54" fabric (plus 11 yards of lining).',
    },
    faqs: [
      {
        question: 'What fullness factor should I use for curtains?',
        answer: 'Standard fullness is 2.0x the rod width for everyday drapery and grommets. A 1.5x fullness gives a casual, relaxed look for sheer or lightweight fabrics, while 2.5x fullness creates a luxurious, deep fold custom look preferred for pinch pleats and formal velvet curtains.',
      },
      {
        question: 'How much hem allowance do custom curtains need?',
        answer: 'Professional drapery uses an 8-inch double hem at the bottom (folding up 4 inches, then another 4 inches) to provide weight so curtains hang straight. For the top heading, allow 4 inches for rod pockets or 6 inches for buckram-stiffened pinch pleats.',
      },
      {
        question: 'What is curtain puddling and how much fabric does it take?',
        answer: 'Puddling is when the fabric extends onto the floor. A "break" touches the floor with 0.5" to 1" extra. A medium puddle adds 2 to 4 inches of length, while a dramatic romantic pooling adds 6 to 8 inches of fabric.',
      },
    ],
  },

  quilt_backing: {
    slug: 'quilt-backing-binding-calculator',
    title: 'Quilt Backing & Binding Calculator — Yardage & Seam Layout',
    metaDescription: 'Free quilt backing and binding calculator. Estimate backing yardage for 42", 44", and 108" wide-back fabric, with seam orientation and binding strip counts.',
    keywords: ['quilt backing calculator', 'quilt binding calculator', 'how much quilt backing fabric', 'quilt yardage calculator', 'binding strips calculator'],
    canonicalPath: '/quilt-backing-binding-calculator',
    category: 'fabric',
    h1: 'Quilt Backing & Binding Calculator',
    lead: 'Determine exact yardage for quilt backings with longarm overage, compare horizontal vs. vertical seam layouts, and calculate the exact number of binding strips required.',
    formula: {
      title: 'Quilt Backing & Binding Formula',
      expression: 'Backing Yards = [Number of Panels × (Top Length + 2 × Overhang)] ÷ 36',
      explanation: 'Binding Strips = ceil([(2 × Top Width + 2 × Top Length) + 12" join] ÷ Usable Fabric Width). Total Binding Yards = (Strips × Strip Width) ÷ 36.',
    },
    workedExample: {
      title: 'Worked Example: Queen Size Quilt Top (60" × 80")',
      scenario: 'You have a 60" × 80" quilt top needing 4" longarm borders on all sides using standard 44" cotton, with 2.5" binding strips.',
      steps: [
        'Calculate backing dimensions needed: (60 + 8) × (80 + 8) = 68" wide × 88" long.',
        'With 44" fabric, 2 panels are required: 2 × 88" = 176 inches = 4.89 yards of backing.',
        'Calculate quilt perimeter: 2 × (60 + 80) = 280 inches + 12" joining allowance = 292 inches.',
        'Calculate binding strips: ceil(292" ÷ 44") = 7 strips of 2.5" = 17.5 inches = 0.5 yards.',
      ],
      result: 'Total Project Fabric: 5.4 Yards (4.89 yd backing + 0.5 yd binding).',
    },
    faqs: [
      {
        question: 'Why do quilters add 4 inches of overhang to backing?',
        answer: 'Longarm machine quilters require at least 4 inches of extra backing and batting on all four sides (8 inches total to width and length) so the quilt clamps have fabric to grip without interfering with the quilting foot.',
      },
      {
        question: 'Should quilt backing seams be horizontal or vertical?',
        answer: 'Horizontal seams are often preferred for bed quilts because the stress when hanging or pulling is evenly distributed, and it reduces fabric waste on rectangular quilts where the length exceeds the width.',
      },
      {
        question: 'How many binding strips do I need for my quilt?',
        answer: 'Measure the perimeter of your quilt (2 × width + 2 × length), add 12 to 15 inches for corner miters and joining tails, then divide by the usable width of your binding fabric (usually 42 inches). Round up to the next whole strip.',
      },
    ],
  },

  upholstery_cushions: {
    slug: 'upholstery-cushion-calculator',
    title: 'Upholstery Fabric Calculator — Box Cushions & Welting Cord',
    metaDescription: 'Calculate fabric yardage for box cushions, bench seats, and chair pads. Includes foam thickness, boxing strips, plate layouts, and welting/piping cord yards.',
    keywords: ['upholstery fabric calculator', 'cushion yardage calculator', 'box cushion fabric calculator', 'how much fabric for cushions', 'welting cord yardage'],
    canonicalPath: '/upholstery-cushion-calculator',
    category: 'fabric',
    h1: 'Upholstery & Box Cushion Fabric Calculator',
    lead: 'Plan fabric quantities for custom box cushions, sofa seats, and window benches with seam allowances, continuous boxing strips, and welting/piping cord requirements.',
    formula: {
      title: 'Box Cushion Fabric Formula',
      expression: 'Total Yards = (Plate Rows × Plate Length + Boxing Rows × Boxing Height + Piping Yards) ÷ 36 × 1.10',
      explanation: 'Each cushion requires 2 plates (top & bottom) plus boxing strips equal to the cushion perimeter (2 × Width + 2 × Depth + 4" join allowance).',
    },
    workedExample: {
      title: 'Worked Example: 4 Outdoor Dining Cushions (24" × 24" × 4")',
      scenario: 'You are making 4 box cushions measuring 24" wide × 24" deep with 4" foam on 54" upholstery fabric with welting cord.',
      steps: [
        'Calculate plate size with 0.5" seams: 25" × 25". Two fit side-by-side across 54" width.',
        'For 8 plates (4 cushions × 2), 4 rows at 25" = 100 inches.',
        'Boxing perimeter per cushion: 2 × (24 + 24) = 96" + 4" join = 100". Total boxing for 4 = 400".',
        'Boxing strips needed: ceil(400" ÷ 54") = 8 strips at 5" height = 40 inches.',
        'Welting cord: 2 loops per cushion = 8 loops × 96" = 768" = 21.3 yards of cord (approx 0.75 yd bias fabric).',
        'Total fabric: 100" + 40" + 27" = 167" ÷ 36 = 4.64 yards × 1.10 buffer = 5.1 yards.',
      ],
      result: 'Total Upholstery Fabric: 5.25 Yards of 54" fabric and 22 yards of 5/32" piping cord.',
    },
    faqs: [
      {
        question: 'What is the difference between knife-edge and box cushions?',
        answer: 'A knife-edge cushion consists of just a front and back piece sewn together at the perimeter edges, creating a tapered pillow. A box cushion has distinct top and bottom plates separated by vertical sidewalls called "boxing" strips to accommodate thick foam (typically 3 to 6 inches).',
      },
      {
        question: 'What size piping cord is standard for furniture cushions?',
        answer: 'Standard upholstery welt uses 5/32-inch cotton or cellulose piping cord wrapped in 1.5-inch wide bias-cut fabric strips. For thicker marine or outdoor cushions, 6/32-inch or 1/4-inch cord is common.',
      },
    ],
  },

  mulch_soil: {
    slug: 'mulch-calculator',
    title: 'Mulch Calculator — How Many Bags or Yards of Mulch Do I Need?',
    metaDescription: 'Free mulch calculator. Calculate how many cubic yards or bags of mulch (2 & 3 cu ft) you need for rectangular, circular, or ring beds at 2", 3", or 4" depth.',
    keywords: ['mulch calculator', 'how many bags of mulch do i need', 'how many yards of mulch', 'mulch coverage calculator', 'cubic yards of mulch'],
    canonicalPath: '/mulch-calculator',
    category: 'construction',
    h1: 'Mulch Calculator: Bags, Cubic Yards & Weight Estimator',
    lead: 'Enter your garden bed dimensions and desired depth to instantly calculate required cubic yards, cubic meters, retail bag quantities (1, 1.5, 2, and 3 cu ft), and estimated tonnage.',
    formula: {
      title: 'Mulch Volume Formula',
      expression: 'Cubic Yards = [Area (sq ft) × (Depth (inches) ÷ 12)] ÷ 27 × (1 + Compaction %)',
      explanation: 'One cubic yard equals 27 cubic feet. A standard 2 cubic foot bag covers 12 sq ft at 2" deep, 8 sq ft at 3" deep, and 6 sq ft at 4" deep.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Flowerbed at 3 Inches Deep',
      scenario: 'You want to mulch a rectangular front landscape bed measuring 20 feet long by 15 feet wide with shredded cedar mulch at the recommended 3-inch depth.',
      steps: [
        'Calculate bed area: 20 ft × 15 ft = 300 square feet.',
        'Convert depth from inches to feet: 3 inches ÷ 12 = 0.25 feet.',
        'Calculate cubic feet volume: 300 sq ft × 0.25 ft = 75 cubic feet.',
        'Add 5% settling/compaction allowance: 75 cu ft × 1.05 = 78.75 cubic feet.',
        'Convert to cubic yards: 78.75 cu ft ÷ 27 = 2.92 cubic yards (order 3 yards bulk).',
        'Convert to 2 cu ft retail bags: 78.75 ÷ 2 = 39.38 bags (buy 40 bags).',
        'Estimate weight: 2.92 yd³ × 0.35 tons/yd³ = 1.02 US tons.',
      ],
      result: 'Requirement: 3.0 Cubic Yards bulk delivery, or 40 Bags of 2 cu ft mulch (~1.0 ton).',
    },
    faqs: [
      {
        question: 'How many bags of mulch are in a cubic yard?',
        answer: 'Since a cubic yard contains 27 cubic feet of volume, it takes 13.5 bags of 2 cubic foot mulch or 9 bags of 3 cubic foot mulch to equal one cubic yard.',
      },
      {
        question: 'How deep should mulch be applied?',
        answer: 'A depth of 2 to 3 inches is optimal for most garden and landscape beds. This depth prevents weed germination, retains soil moisture, and moderates temperature. Avoid applying more than 4 inches, and always keep mulch 2 to 3 inches away from tree trunks (avoid "mulch volcanoes").',
      },
      {
        question: 'How much area does one cubic yard of mulch cover?',
        answer: 'One cubic yard of mulch covers approximately 324 square feet at 1 inch deep, 162 square feet at 2 inches deep, 108 square feet at 3 inches deep, and 81 square feet at 4 inches deep.',
      },
      {
        question: 'When does bulk mulch delivery make more sense than bagged mulch?',
        answer: 'Bulk delivery is significantly more economical once your project requires 2 or more cubic yards (roughly 27+ bags). Purchasing bulk saves between 30% and 50% compared to retail bagged mulch and eliminates plastic bag waste.',
      },
    ],
  },

  gravel_aggregate: {
    slug: 'gravel-calculator',
    title: 'Gravel Calculator — Tons, Cubic Yards & Truck Loads Estimator',
    metaDescription: 'Free gravel and crushed stone calculator. Estimate tons, cubic yards, and dump truck loads for driveways, pathways, pea gravel, and road base sub-layers.',
    keywords: ['gravel calculator', 'crushed stone calculator', 'how many tons of gravel', 'pea gravel calculator', 'gravel driveway calculator'],
    canonicalPath: '/gravel-calculator',
    category: 'construction',
    h1: 'Gravel, Sand & Aggregate Calculator',
    lead: 'Calculate cubic yards and exact tonnage for gravel, crushed limestone (#57 stone), crusher run, and pea gravel based on project dimensions and calibrated material densities.',
    formula: {
      title: 'Gravel Tonnage Formula',
      expression: 'US Tons = [Area (sq ft) × (Depth (inches) ÷ 12)] ÷ 27 × Density (tons/yd³) × (1 + Compaction %)',
      explanation: 'Compacted gravel sub-bases typically compact by 10% to 15%. Average aggregate weight is ~1.4 tons per cubic yard (2,800 lbs/yd³).',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 10 ft Gravel Driveway at 3 Inches Deep',
      scenario: 'You need #57 crushed limestone (density 1.40 tons/yd³) for a 30 ft long by 10 ft wide driveway extension at 3" compacted depth with 12% compaction factor.',
      steps: [
        'Calculate area: 30 ft × 10 ft = 300 square feet.',
        'Convert depth: 3 inches ÷ 12 = 0.25 feet.',
        'Raw volume: 300 sq ft × 0.25 ft = 75 cubic feet.',
        'Factor 12% compaction: 75 cu ft × 1.12 = 84 cubic feet = 3.11 cubic yards.',
        'Convert to weight: 3.11 yd³ × 1.40 tons/yd³ = 4.35 US tons (approx. 3.95 metric tonnes).',
        'Retail 50 lb bags: (4.35 tons × 2,000 lbs) ÷ 50 lbs = 174 bags.',
      ],
      result: 'Requirement: 3.11 Cubic Yards / 4.35 Tons of crushed stone (ordered as 4.5 tons bulk).',
    },
    faqs: [
      {
        question: 'How much does a cubic yard of gravel weigh?',
        answer: 'On average, one cubic yard of standard crushed stone or gravel weighs approximately 1.35 to 1.45 US tons (2,700 to 2,900 pounds). Dense road base with stone dust (crusher run) weighs up to 1.6 tons per cubic yard.',
      },
      {
        question: 'How many tons of gravel are in a dump truck load?',
        answer: 'A standard single-axle dump truck carries about 5 tons (approx. 3.5 yd³). A tandem dump truck carries 10 to 14 tons (7 to 10 yd³), and a large tri-axle truck delivers 18 to 22 tons (12 to 15 yd³).',
      },
      {
        question: 'What depth of gravel is needed for a patio or pathway?',
        answer: 'For pedestrian walkways and decorative beds, 2 to 3 inches of gravel is adequate. For driveways and parking pads, a 4-inch compacted gravel base over landscape fabric with a 2-inch surface stone layer is recommended.',
      },
    ],
  },

  concrete_calc: {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator — Slabs, Footings & 40/60/80lb Bags',
    metaDescription: 'Free concrete calculator. Calculate cubic yards and exact bag counts (40lb, 60lb, 80lb) for slabs, Sonotube columns, footings, steps, and 1:2:4 mix designs.',
    keywords: ['concrete calculator', 'how many bags of concrete', 'concrete slab calculator', 'cubic yards of concrete', 'concrete footing calculator'],
    canonicalPath: '/concrete-calculator',
    category: 'construction',
    h1: 'Concrete Slab, Footing & Bag Calculator',
    lead: 'Calculate cubic yards and meters for concrete slabs, Sonotube columns, and stairs. Includes exact bag yields for 40, 60, and 80 lb ready-mix bags plus 1:2:4 volumetric ratios.',
    formula: {
      title: 'Concrete Volume Formula',
      expression: 'Cubic Yards = [Length (ft) × Width (ft) × (Thickness (in) ÷ 12)] ÷ 27 × 1.10 (spillage)',
      explanation: 'For round Sonotube piers: Volume = π × Radius² × Depth. 1 cu yd yields ~45 bags of 80 lb, 60 bags of 60 lb, or 90 bags of 40 lb pre-mix concrete.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 10 ft Patio Slab (4 Inches Thick)',
      scenario: 'You are pouring a 20 ft by 10 ft backyard patio slab 4 inches thick with a 10% allowance for form deflection and uneven ground.',
      steps: [
        'Calculate area: 20 ft × 10 ft = 200 square feet.',
        'Convert thickness: 4 inches ÷ 12 = 0.333 feet.',
        'Raw volume: 200 sq ft × 0.333 ft = 66.67 cubic feet.',
        'Add 10% ordering allowance: 66.67 cu ft × 1.10 = 73.33 cubic feet.',
        'Convert to cubic yards: 73.33 ÷ 27 = 2.72 cubic yards (order 3.0 yd³ ready-mix).',
        'Bag calculation (80 lb bags @ 0.60 cu ft yield): 73.33 ÷ 0.60 = 123 bags of 80 lb.',
      ],
      result: 'Requirement: 2.72 Cubic Yards delivered, or 123 bags of 80-lb pre-mixed concrete.',
    },
    faqs: [
      {
        question: 'How many 80 lb bags of concrete make one cubic yard?',
        answer: 'It takes 45 bags of 80 lb concrete to make one cubic yard. Each 80-lb bag yields approximately 0.60 cubic feet of mixed concrete. (27 cubic feet ÷ 0.60 = 45 bags).',
      },
      {
        question: 'How many 60 lb bags of concrete make one cubic yard?',
        answer: 'It takes 60 bags of 60 lb concrete to equal one cubic yard. Each 60-lb bag yields approximately 0.45 cubic feet of mixed concrete.',
      },
      {
        question: 'How thick should a concrete patio or driveway slab be?',
        answer: 'Walkways and light patios are typically poured 3.5 to 4 inches thick (using 2x4 form boards). Driveways and garage floors accommodating passenger cars should be 4 to 5 inches thick with rebar or wire mesh reinforcement. Heavy RV pads require 6 inches of 4,000 PSI concrete.',
      },
    ],
  },

  paver_masonry: {
    slug: 'paver-calculator',
    title: 'Paver Calculator — Patio Pavers, Bedding Sand & CMU Walls',
    metaDescription: 'Free paver and masonry calculator. Estimate pavers with cutting waste, bedding sand tons, polymeric joint sand bags, and concrete CMU / brick wall counts.',
    keywords: ['paver calculator', 'patio paver calculator', 'paver sand calculator', 'brick calculator', 'cmu block calculator'],
    canonicalPath: '/paver-calculator',
    category: 'construction',
    h1: 'Paver Patio & Masonry Wall Calculator',
    lead: 'Calculate total pavers required with cutting allowances, 1" screeded bedding sand volume, polymeric joint sand bags, and concrete block (CMU) masonry quantities.',
    formula: {
      title: 'Paver Count Formula',
      expression: 'Total Pavers = [Patio Area (sq ft) ÷ Single Paver Area (sq ft)] × (1 + Cutting Waste %)',
      explanation: 'Bedding Sand Volume = Area × (1" ÷ 12) ÷ 27 cubic yards. 1 bag (50 lb) polymeric sand covers ~50-70 sq ft of standard pavers.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Patio with 4" × 8" Holland Pavers',
      scenario: 'You are installing a 300 sq ft patio using standard 4" × 8" rectangular Holland pavers with 10% cutting waste and 1" sand bedding.',
      steps: [
        'Single paver area: (4" × 8") ÷ 144 = 0.222 sq ft per paver (4.5 pavers per sq ft).',
        'Raw count: 300 sq ft × 4.5 = 1,350 pavers.',
        'Add 10% cutting waste: 1,350 × 1.10 = 1,485 pavers.',
        'Bedding sand (1" deep): 300 sq ft × (1/12) ÷ 27 = 0.93 cu yd × 1.30 tons/yd³ = 1.2 tons.',
        'Polymeric sand: 300 sq ft ÷ 60 = 5 bags (50 lb each).',
      ],
      result: 'Requirement: 1,485 Pavers, 1.2 Tons Bedding Sand, and 5 Bags Polymeric Sand.',
    },
    faqs: [
      {
        question: 'How much cutting waste should I factor for patio pavers?',
        answer: 'For simple rectangular patios with running bond or herringbone patterns, allow 10% cutting waste. For curved perimeters, circular patios, or diagonal layouts with intricate edge cuts, allow 15% to 20% extra.',
      },
      {
        question: 'How deep should bedding sand be under pavers?',
        answer: 'Bedding sand must be screeded to a uniform depth of exactly 1 inch (never more than 1.5 inches). Excess bedding sand depth leads to uneven settling and rutting under traffic.',
      },
    ],
  },

  sod_turf: {
    slug: 'sod-calculator',
    title: 'Sod Calculator — Lawn Square Footage, Rolls & Pallets',
    metaDescription: 'Free sod and turf grass calculator. Calculate lawn square footage, standard 2\'×5\' rolls, and whole pallets (450-500 sq ft) with edge cutting waste allowances.',
    keywords: ['sod calculator', 'turf calculator', 'how many pallets of sod do i need', 'sod rolls calculator', 'lawn sod coverage'],
    canonicalPath: '/sod-calculator',
    category: 'construction',
    h1: 'Sod & Turf Lawn Quantity Calculator',
    lead: 'Estimate exact pallets and rolls of sod needed for new lawns and overseeding projects, accounting for curved boundaries and perimeter cutting scrap.',
    formula: {
      title: 'Sod Pallet Formula',
      expression: 'Pallets Needed = [Lawn Area (sq ft) × (1 + Cutting Waste %)] ÷ Pallet Coverage (sq ft)',
      explanation: 'Standard rolls are 2 ft × 5 ft (10 sq ft). Most regional sod farms stack 450 to 500 sq ft per pallet (45 to 50 rolls).',
    },
    workedExample: {
      title: 'Worked Example: 50 ft × 30 ft Lawn (1,500 sq ft)',
      scenario: 'You are laying fresh sod on a 1,500 sq ft lawn using standard 450 sq ft pallets with 8% perimeter cutting waste.',
      steps: [
        'Total area with 8% waste: 1,500 sq ft × 1.08 = 1,620 sq ft.',
        'Individual 10 sq ft rolls: 1,620 ÷ 10 = 162 rolls.',
        'Pallets required (450 sq ft per pallet): 1,620 ÷ 450 = 3.6 pallets.',
        'Round up to whole pallets: Order 4 pallets (1,800 sq ft total).',
      ],
      result: 'Requirement: 4 Pallets of Sod (or 162 individual 2\'×5\' rolls).',
    },
    faqs: [
      {
        question: 'How many square feet are on a pallet of sod?',
        answer: 'In the eastern and midwestern US, a standard pallet holds 450 square feet (45 rolls of 10 sq ft). In southern and western regions, pallets typically hold 500 square feet (50 rolls of 10 sq ft). Heavy Kentucky bluegrass may come on 400 sq ft pallets.',
      },
      {
        question: 'How soon must sod be installed after delivery?',
        answer: 'Sod should be installed within 24 to 48 hours of delivery. Because sod rolls are rolled tightly and decompose organically, internal heat will build up on the pallet and kill root systems within 36 hours in warm weather.',
      },
    ],
  },

  retaining_wall: {
    slug: 'retaining-wall-calculator',
    title: 'Retaining Wall Calculator — Blocks, Capstones, Gravel & Geogrid',
    metaDescription: 'Free retaining wall calculator. Estimate total wall blocks, buried base course, wall capstones, 6" leveling trench gravel, 12" drainage stone, and geogrid soil reinforcement.',
    keywords: ['retaining wall calculator', 'retaining wall block calculator', 'how many retaining wall blocks do i need', 'retaining wall drainage gravel calculator', 'retaining wall capstones'],
    canonicalPath: '/retaining-wall-calculator',
    category: 'construction',
    h1: 'Retaining Wall & Gravity Block Calculator',
    lead: 'Calculate total concrete blocks, buried base courses, crushed rock leveling trenches, 12" aggregate drainage chimneys, and geogrid reinforcement for residential landscape walls and commercial terraces.',
    formula: {
      title: 'Retaining Wall Block Formula',
      expression: 'Total Blocks = [Ceil((Wall Length × 12) ÷ Block Width) × (Exposed Courses + Buried Base Courses)] × (1 + Waste %)',
      explanation: 'Exposed courses = Ceil((Exposed Height × 12) ÷ Block Height). Minimum 1 buried course (or 1 course per 3 ft of wall height) for lateral shear stability.',
    },
    workedExample: {
      title: 'Worked Example: 25 ft Long × 3.5 ft High Garden Wall (12"×4"×8" blocks)',
      scenario: 'You are building a 25 ft long retaining wall with 3.5 ft exposed height using 12"×4"×8" blocks, 1 buried base course, 12" capstones, and 8% cutting waste.',
      steps: [
        'Blocks per course: (25 ft × 12) ÷ 12" = 25 blocks per course.',
        'Exposed courses: (3.5 ft × 12) ÷ 4" = 11 courses.',
        'Buried courses: 1 course below grade (total = 12 courses).',
        'Raw block count: 25 blocks/course × 12 courses = 300 blocks.',
        'Add 8% waste: 300 × 1.08 = 324 blocks.',
        'Capstones (12" width): 25 ft × 1.05 = 27 capstones + 2 adhesive tubes.',
        'Base trench gravel (6" deep × 20" wide): ~1.2 tons of compacted crushed stone.',
        'Drainage stone (12" chimney): ~3.5 tons of washed #57 stone behind wall.',
      ],
      result: 'Requirement: 324 Wall Blocks, 27 Capstones, 1.2 Tons Base Gravel, and 3.5 Tons Drainage Stone.',
    },
    faqs: [
      {
        question: 'How deep should the buried base course be for a retaining wall?',
        answer: 'The first course of retaining wall blocks must always be buried below finished grade to prevent kick-out under lateral soil pressure. As a standard rule of thumb, bury at least 1 full course (minimum 4 to 6 inches) for walls up to 3 feet tall, plus an additional 1 inch of embedment per foot of wall height beyond 3 feet.',
      },
      {
        question: 'Why do I need a 12" gravel drainage zone behind a retaining wall?',
        answer: 'Hydrostatic pressure from trapped rainwater is the number one cause of retaining wall failure. A 12-inch chimney of clean, free-draining crushed stone (#57 gravel) wrapped in filter fabric allows water to drop rapidly to a perforated 4" drain pipe rather than pushing against the back of the wall.',
      },
      {
        question: 'When is geogrid soil reinforcement required in a retaining wall?',
        answer: 'Segmental retaining walls taller than 3.5 to 4 feet (or any wall supporting a sloped surcharge, driveway, or patio) require geogrid structural mesh sheets laid horizontally between block courses and extending back into compacted backfill soil to mechanically stabilize the slope.',
      },
    ],
  },

  wallpaper_calc: {
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator — Rolls, Pattern Repeat Drops & Paste',
    metaDescription: 'Free wallpaper calculator for accent walls and full rooms. Accounts for pattern repeat drops (straight & half-drop match), window deductions, and adhesive paste.',
    keywords: ['wallpaper calculator', 'how many rolls of wallpaper do i need', 'wallpaper pattern repeat calculator', 'accent wall wallpaper calculator', 'wallpaper double roll calculator'],
    canonicalPath: '/wallpaper-calculator',
    category: 'fabric',
    h1: 'Wallpaper & Wallcovering Quantity Calculator',
    lead: 'Calculate exact rolls of wallpaper needed for single accent walls or complete rooms, factoring in roll widths (20.5" or 54"), vertical pattern repeat waste, door/window cutout deductions, and adhesive gallons.',
    formula: {
      title: 'Wallpaper Roll Formula',
      expression: 'Rolls Needed = Ceil(Total Strips Needed ÷ Usable Strips Per Roll) × (1 + Safety Margin %)',
      explanation: 'Strips Needed = Ceil((Wall Width × 12) ÷ Roll Width). Strip Cut Drop = Wall Height + 4" Trimming Allowance rounded up to nearest Pattern Repeat.',
    },
    workedExample: {
      title: 'Worked Example: 14 ft Wide × 9 ft High Accent Wall (21" Repeat)',
      scenario: 'You want to cover a 14 ft × 9 ft wall with a designer botanical wallpaper sold in US Double Rolls (20.5" wide × 33 ft long) featuring a 21" straight pattern repeat.',
      steps: [
        'Calculate vertical strips needed: (14 ft × 12) ÷ 20.5" = 8.2 → 9 strips across.',
        'Calculate strip cut length: 108" wall height + 4" trim = 112" raw cut length.',
        'Adjust for 21" repeat: ceil(112" ÷ 21") = 6 repeats × 21" = 126" cut drop per strip.',
        'Roll length in inches: 33 ft × 12 = 396 inches per double roll.',
        'Usable strips per roll: floor(396" ÷ 126") = 3 strips per double roll.',
        'Rolls needed: 9 strips ÷ 3 strips/roll = 3 double rolls.',
        'Add 1 spare safety roll for future dye-lot matching / cutting errors: Order 4 double rolls.',
      ],
      result: 'Requirement: 4 Double Rolls (approx. 225 sq ft nominal), 1 Gallon Wallpaper Paste, and 1 Gallon Primer.',
    },
    faqs: [
      {
        question: 'What is the difference between a single roll and a double roll of wallpaper?',
        answer: 'In North America, wallpaper is priced by the single roll (usually 20.5" wide × 16.5 ft long = ~28 sq ft) but is packaged and shipped as a continuous "double roll bolt" (20.5" wide × 33 ft long = ~56 sq ft) to minimize waste and allow longer continuous drops.',
      },
      {
        question: 'How does a half-drop pattern match affect wallpaper waste?',
        answer: 'In a half-drop pattern match, the motif on strip #2 shifts vertically by half the repeat distance compared to strip #1. This alternating alignment introduces an additional half-repeat of trimming scrap per strip, which is why half-drop patterns require factoring 15% to 20% waste instead of the standard 10%.',
      },
      {
        question: 'Why should I always order one extra roll of wallpaper?',
        answer: 'Wallpaper is printed in specific manufacturing dye lots or run batches. If you run short by even one strip, subsequent rolls ordered weeks later may have noticeable color or sheen variances. Purchasing +1 extra roll guarantees dye-lot consistency and provides repair pieces for future gouges.',
      },
    ],
  },

  topsoil_calc: {
    slug: 'topsoil-calculator',
    title: 'Topsoil Calculator — Cubic Yards, Tons & 40-lb Bags',
    metaDescription: 'Free topsoil calculator. Estimate cubic yards, US short tons, and 40-lb retail bags of screened loam topsoil for lawn leveling, grading, and garden beds.',
    keywords: ['topsoil calculator', 'how much topsoil do i need', '40 lb bags of topsoil per yard', 'screened loam calculator'],
    canonicalPath: '/topsoil-calculator',
    category: 'construction',
    h1: 'Topsoil Volume, Tonnage & 40-lb Bag Calculator',
    lead: 'Calculate exact cubic yards, delivered bulk tons, and 40-lb retail bag counts for screened topsoil grading, lawn patching, and garden bed filling.',
    formula: {
      title: 'Topsoil Volume & Weight Formula',
      expression: 'Cubic Yards = [Area (sq ft) × (Depth (in) ÷ 12)] ÷ 27 × (1 + Compaction %)',
      explanation: 'Screened loam weighs ~1.10 US tons (2,200 lbs) per cubic yard. One cubic yard equals ~36 bags of 40-lb topsoil (0.75 cu ft each).',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Lawn Grade @ 4" Topsoil',
      scenario: 'You are topdressing and re-grading a 300 sq ft yard area at 4 inches deep with 5% compaction buffer.',
      steps: [
        'Calculate area: 20 ft × 15 ft = 300 sq ft.',
        'Convert depth to feet: 4" ÷ 12 = 0.333 ft.',
        'Raw volume: 300 × 0.333 = 100 cu ft × 1.05 = 105 cu ft.',
        'Convert to cubic yards: 105 ÷ 27 = 3.89 cu yds.',
        'Estimate weight: 3.89 yd³ × 1.10 tons/yd³ = 4.28 US tons.',
      ],
      result: 'Requirement: 3.89 Cubic Yards (4.28 Tons) bulk, or 140 bags (40-lb).',
    },
    faqs: [
      {
        question: 'How many 40 lb bags of topsoil equal 1 cubic yard?',
        answer: 'A typical 40-lb retail bag of topsoil holds roughly 0.75 cubic feet. Since 1 cubic yard equals 27 cubic feet, you need 36 bags of 40-lb topsoil per cubic yard.',
      },
      {
        question: 'How much does a cubic yard of topsoil weigh?',
        answer: 'Dry screened loam topsoil weighs approximately 2,000 to 2,200 lbs (1.0 to 1.1 US tons) per cubic yard. Damp or clay-heavy topsoil can weigh up to 2,600 lbs (1.3 tons).',
      },
    ],
  },

  raised_bed_soil: {
    slug: 'raised-bed-soil-calculator',
    title: 'Raised Garden Bed Soil Calculator — 4×4, 4×8 Mix & Yardage',
    metaDescription: 'Calculate soil volume for 4x4 and 4x8 raised garden beds. Outputs exact cubic yards, 2 cu ft bags, and a balanced topsoil, compost, and aeration mix breakdown.',
    keywords: ['raised bed soil calculator', '4x8 raised bed soil calculator', 'mels mix calculator', 'how much soil for raised garden bed'],
    canonicalPath: '/raised-bed-soil-calculator',
    category: 'construction',
    h1: 'Raised Garden Bed Soil & Mix Ratio Calculator',
    lead: 'Select standard 4×4 or 4×8 raised planter presets or custom dimensions to calculate cubic yards, bag counts, and exact topsoil, compost, and aeration mix proportions.',
    formula: {
      title: 'Raised Bed Blend Formula',
      expression: 'Total Soil (cu ft) = Beds × Length (ft) × Width (ft) × (Depth (in) ÷ 12) × 1.05',
      explanation: 'Recommended vegetable blend uses 50% screened topsoil, 30% aged compost, and 20% coarse aeration (perlite/vermiculite/pine fines).',
    },
    workedExample: {
      title: 'Worked Example: Two 4 ft × 8 ft Beds at 12" Deep',
      scenario: 'You are filling two 4×8 cedar raised garden beds 12 inches deep with a 50/30/20 vegetable mix.',
      steps: [
        'Single bed area: 4 ft × 8 ft = 32 sq ft (2 beds = 64 sq ft).',
        'Depth conversion: 12" ÷ 12 = 1.0 ft -> 64 cu ft raw × 1.05 settling = 67.2 cu ft.',
        'Total cubic yards: 67.2 ÷ 27 = 2.49 cubic yards.',
        'Mix breakdown: 33.6 cu ft topsoil + 20.2 cu ft compost + 13.4 cu ft aeration.',
      ],
      result: 'Requirement: 2.49 Cubic Yards total (or 34 bags of 2 cu ft soil).',
    },
    faqs: [
      {
        question: 'How many cubic feet of soil does a 4×8 raised bed need?',
        answer: 'A 4×8 ft raised garden bed needs 21.3 cu ft at 8 inches deep, 26.7 cu ft at 10 inches deep, and 32 cu ft (1.19 cubic yards) at 12 inches deep.',
      },
      {
        question: 'What is the best soil ratio for vegetable raised beds?',
        answer: 'For deep-rooted vegetables, mix 50% screened garden loam topsoil, 30% aged compost, and 20% aeration material (perlite, coarse vermiculite, or pine bark fines) to prevent compaction.',
      },
    ],
  },

  potting_soil: {
    slug: 'potting-soil-calculator',
    title: 'Potting Mix & Planter Volume Calculator — Quarts & Gallons',
    metaDescription: 'Calculate exact dry quarts, gallons, and bags of potting soil for tapered flower pots, fabric grow bags, and rectangular window boxes.',
    keywords: ['potting soil calculator', 'planter volume calculator', 'quarts of potting mix for pot', '5 gallon grow bag soil calculator'],
    canonicalPath: '/potting-soil-calculator',
    category: 'construction',
    h1: 'Potting Mix & Planter Volume Calculator',
    lead: 'Convert round tapered flower pots, cylindrical grow bags, and window boxes into dry quarts, gallons, liters, and retail potting mix bag counts.',
    formula: {
      title: 'Tapered Planter Frustum Formula',
      expression: 'Volume (cu in) = (π × H ÷ 3) × (r₁² + r₁·r₂ + r₂²) × 0.92 Fill Factor',
      explanation: '1 US dry quart = 67.2 cu in; 1 US gallon = 231 cu in. A 92% fill factor leaves ~1 inch of watering lip below the rim.',
    },
    workedExample: {
      title: 'Worked Example: Four 14" Tapered Patio Pots',
      scenario: 'Filling 4 pots with 14" top diameter, 10" bottom diameter, and 12" height.',
      steps: [
        'Frustum volume per pot: (3.1416 × 12 ÷ 3) × (7² + 7×5 + 5²) = 1,369.7 cu in.',
        'Apply 92% watering rim fill: 1,260.1 cu in/pot × 4 pots = 5,040.5 cu in.',
        'Convert to dry quarts: 5,040.5 ÷ 67.2 = 75.0 dry quarts.',
      ],
      result: 'Requirement: 75 Dry Quarts (~21.8 Gallons), or 3 bags of 32-qt potting mix.',
    },
    faqs: [
      {
        question: 'How many quarts of potting soil fit in a 5-gallon grow bag?',
        answer: 'One liquid gallon equals about 3.44 dry quarts, so a 5-gallon fabric grow bag or nursery container holds roughly 16 to 18 dry quarts (approx. 0.67 cu ft) of potting mix.',
      },
      {
        question: 'Should I put gravel at the bottom of flower pots for drainage?',
        answer: 'No. Horticultural research shows adding gravel at the bottom raises the perched water table and reduces root aeration. Use clean potting mix containing perlite or pumice directly above unobstructed drainage holes.',
      },
    ],
  },

  compost_calc: {
    slug: 'compost-calculator',
    title: 'Compost Calculator — Lawn Topdressing & Soil Amendment Yards',
    metaDescription: 'Free compost calculator for lawn topdressing and garden soil amendment. Calculate cubic yards, tons, and 2 cu ft bags based on bed area and depth.',
    keywords: ['compost calculator', 'how much compost for lawn topdressing', 'cubic yards of compost', 'organic compost calculator'],
    canonicalPath: '/compost-calculator',
    category: 'construction',
    h1: 'Compost Topdressing & Amendment Calculator',
    lead: 'Estimate exact cubic yards and retail bags of screened organic compost for garden bed tilling, raised planter beds, and spring/fall lawn topdressing.',
    formula: {
      title: 'Compost Volume Formula',
      expression: 'Cubic Yards = [Area (sq ft) × (Depth (in) ÷ 12)] ÷ 27 × 1.05',
      explanation: 'Aged screened compost weighs ~0.55 US tons (1,100 lbs) per cubic yard. 1 cu yd covers ~648 sq ft at a 0.5" lawn topdressing depth.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Bed @ 2" Organic Compost',
      scenario: 'Topdressing a 300 sq ft perennial garden bed with 2 inches of aged compost.',
      steps: [
        'Area: 20 ft × 15 ft = 300 sq ft.',
        'Depth conversion: 2" ÷ 12 = 0.167 ft -> 50 cu ft × 1.05 = 52.5 cu ft.',
        'Cubic yards: 52.5 ÷ 27 = 1.94 cu yds (~1.07 US tons).',
      ],
      result: 'Requirement: 1.94 Cubic Yards bulk, or 27 bags (2 cu ft).',
    },
    faqs: [
      {
        question: 'How deep should I apply compost for lawn topdressing?',
        answer: 'When topdressing an established lawn after core aeration, apply 0.25 to 0.5 inches of finely screened compost so grass blades remain exposed to sunlight.',
      },
      {
        question: 'How much compost do I need to amend a new garden bed?',
        answer: 'Spread a 2- to 3-inch layer of aged compost across the garden bed surface and till or broadfork it into the top 6 to 8 inches of native soil.',
      },
    ],
  },

  fill_dirt: {
    slug: 'fill-dirt-calculator',
    title: 'Fill Dirt Calculator — Cubic Yards, Tons & Compaction Factor',
    metaDescription: 'Calculate fill dirt cubic yards, US tons, and dump truckloads for hole filling, yard grading, sloping, and foundation backfilling.',
    keywords: ['fill dirt calculator', 'how many yards of fill dirt', 'clean fill dirt tonnage', 'yard grading dirt calculator'],
    canonicalPath: '/fill-dirt-calculator',
    category: 'construction',
    h1: 'Clean Fill Dirt & Yard Grading Calculator',
    lead: 'Estimate cubic yards, heavy tonnage, and tandem dump truckloads for clean subsoil fill dirt with a 15% compaction and tamping buffer.',
    formula: {
      title: 'Fill Dirt & Compaction Formula',
      expression: 'Tons Required = [Area (sq ft) × (Depth (in) ÷ 12) ÷ 27] × 1.22 tons/yd³ × (1 + Compaction %)',
      explanation: 'Loose fill dirt settles 15%–20% once compacted with a plate compactor or rainfall. Average clay-loam subsoil weighs ~1.22 US tons per yd³.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Low Yard Depression @ 6" Deep',
      scenario: 'Filling and compacting a 300 sq ft low yard area at 6 inches deep with 15% tamping compaction.',
      steps: [
        'Area: 20 ft × 15 ft = 300 sq ft; depth = 0.5 ft (150 cu ft raw).',
        'Add 15% compaction factor: 150 × 1.15 = 172.5 cu ft.',
        'Convert to cubic yards: 172.5 ÷ 27 = 6.39 cubic yards.',
        'Estimate weight: 6.39 yd³ × 1.22 tons/yd³ = 7.80 US tons.',
      ],
      result: 'Requirement: 6.39 Cubic Yards (~7.8 US Tons) of clean fill dirt.',
    },
    faqs: [
      {
        question: 'What is the difference between fill dirt and topsoil?',
        answer: 'Fill dirt is dense subsoil excavated below the organic topsoil horizon. Because it contains minimal decomposing organic matter, it will not shrink over time—making it ideal for structural leveling and backfilling, whereas topsoil is used for the top 3–4" growing layer.',
      },
      {
        question: 'How much does fill dirt compact after placement?',
        answer: 'Uncompacted excavated fill dirt typically settles by 15% to 20% after plate tamping or heavy rain. Always order at least 15% extra loose yards when leveling low areas.',
      },
    ],
  },

  lawn_leveling_sand: {
    slug: 'lawn-leveling-sand-calculator',
    title: 'Lawn Leveling Sand & Topdressing Calculator — Yards & Tons',
    metaDescription: 'Calculate washed masonry sand or leveling mix needed at 0.25", 0.5", or 1" depth to smooth bumpy lawns and turf low spots.',
    keywords: ['lawn leveling sand calculator', 'sand topdressing calculator', 'how much sand to level lawn', 'masonry sand calculator'],
    canonicalPath: '/lawn-leveling-sand-calculator',
    category: 'construction',
    h1: 'Lawn Leveling Sand & Topdressing Calculator',
    lead: 'Calculate exact cubic yards, US tons, and 50-lb bags of washed masonry sand or sand-compost topdressing mix for smoothing bumpy lawns.',
    formula: {
      title: 'Lawn Topdressing Sand Formula',
      expression: 'Cubic Yards = [Lawn Sq Ft × (Topdress Depth (in) ÷ 12)] ÷ 27 × 1.05',
      explanation: 'Masonry leveling sand weighs ~1.30 tons/yd³. At 0.5" topdressing depth, 1 cubic yard covers ~648 sq ft.',
    },
    workedExample: {
      title: 'Worked Example: 1,000 Sq Ft Lawn Topdressed @ 0.5" Sand',
      scenario: 'Leveling a bumpy 1,000 sq ft Bermuda or Fescue lawn with 0.5" washed concrete/masonry sand.',
      steps: [
        'Volume: 1,000 sq ft × (0.5 ÷ 12) = 41.67 cu ft × 1.05 = 43.75 cu ft.',
        'Cubic yards: 43.75 ÷ 27 = 1.62 cubic yards.',
        'Tonnage: 1.62 yd³ × 1.30 tons/yd³ = 2.11 US tons (~85 bags of 50 lb).',
      ],
      result: 'Requirement: 1.62 Cubic Yards / 2.11 Tons of washed masonry sand.',
    },
    faqs: [
      {
        question: 'What kind of sand should I use for lawn leveling?',
        answer: 'Always use washed coarse masonry sand or USGA topdressing sand (often blended 70/30 with screened compost). Avoid fine play sand, which packs tightly and slows turf water drainage.',
      },
      {
        question: 'How deep can I topdress grass with sand at one time?',
        answer: 'Apply no more than 0.25 to 0.5 inches across healthy turf in a single pass so grass tips stay above the sand surface. Deep ruts over 1 inch should be filled in stages 3–4 weeks apart.',
      },
    ],
  },

  pea_gravel: {
    slug: 'pea-gravel-calculator',
    title: 'Pea Gravel Calculator — Cubic Yards, Tons & 50-lb Bags',
    metaDescription: 'Free pea gravel calculator for garden pathways, dog runs, patios, and play areas. Calculate cubic yards, US tons (1.35 tons/yd³), and 50-lb retail bags.',
    keywords: ['pea gravel calculator', 'how much pea gravel do i need', 'pea gravel weight per yard', 'pea gravel path calculator'],
    canonicalPath: '/pea-gravel-calculator',
    category: 'construction',
    h1: 'Pea Gravel Volume, Tonnage & Bag Calculator',
    lead: 'Estimate rounded 3/8" river pea gravel volume, weight (1.35 tons/yd³), and 50-lb retail bags for walkways, dog runs, fire pits, and patios.',
    formula: {
      title: 'Pea Gravel Tonnage Formula',
      expression: 'Tons = [Area (sq ft) × (Depth (in) ÷ 12) ÷ 27] × 1.35 tons/yd³ × 1.10',
      explanation: 'Rounded 3/8" pea gravel weighs ~2,700 lbs (1.35 US tons) per cubic yard. 1 ton covers ~80 sq ft at 3" depth.',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 10 ft Pea Gravel Path @ 2.5" Depth',
      scenario: 'Installing a 300 sq ft pea gravel walkway at 2.5" depth with 10% edge settlement.',
      steps: [
        'Raw volume: 300 sq ft × (2.5 ÷ 12) = 62.5 cu ft.',
        'Add 10% settlement: 62.5 × 1.10 = 68.75 cu ft = 2.55 cu yds.',
        'Convert to tonnage: 2.55 yd³ × 1.35 tons/yd³ = 3.44 US tons.',
      ],
      result: 'Requirement: 2.55 Cubic Yards (~3.44 Tons) or 138 bags (50-lb).',
    },
    faqs: [
      {
        question: 'How deep should pea gravel be for a walkway or dog run?',
        answer: 'Use a 2- to 3-inch depth over compacted landscape fabric for pedestrian walkways and dog runs. Avoid going deeper than 3 inches, as rounded pebbles shift underfoot and feel like walking in deep sand.',
      },
      {
        question: 'How much does 1 cubic yard of pea gravel weigh?',
        answer: 'Dry washed 3/8-inch pea gravel weighs roughly 2,700 lbs (1.35 US short tons) per cubic yard, or about 1.60 metric tonnes per cubic meter.',
      },
    ],
  },

  crushed_stone: {
    slug: 'crushed-stone-calculator',
    title: 'Crushed Stone & #57 Gravel Calculator — Driveway & French Drain Tons',
    metaDescription: 'Calculate crushed limestone, #57 drainage stone, and crusher run tonnage for gravel driveways, French drains, shed pads, and sub-bases.',
    keywords: ['crushed stone calculator', '57 stone calculator', 'crushed limestone calculator', 'french drain gravel calculator'],
    canonicalPath: '/crushed-stone-calculator',
    category: 'construction',
    h1: 'Crushed Stone & #57 Gravel Tonnage Calculator',
    lead: 'Calculate exact cubic yards, US tons (1.40–1.60 tons/yd³), and dump truckloads for angular #57 crushed stone, driveway stone, and crusher run sub-bases.',
    formula: {
      title: 'Crushed Stone Tonnage Formula',
      expression: 'Tons = [Area (sq ft) × (Depth (in) ÷ 12) ÷ 27] × 1.40 tons/yd³ × (1 + Compaction %)',
      explanation: 'Angular #57 crushed stone weighs ~1.40 tons/yd³ (2,800 lbs); dense crusher run road base with fines weighs ~1.60 tons/yd³.',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 10 ft Shed Pad @ 4" #57 Stone',
      scenario: 'Laying a 4-inch compacted #57 crushed stone foundation pad for a shed or driveway extension.',
      steps: [
        'Area: 30 × 10 = 300 sq ft at 4" (0.333 ft) = 100 cu ft raw.',
        'Factor 12% compaction: 112 cu ft = 4.15 cubic yards.',
        'Weight (#57 stone @ 1.40 tons/yd³): 4.15 × 1.40 = 5.81 US tons.',
      ],
      result: 'Requirement: 4.15 Cubic Yards / 5.81 Tons of #57 crushed stone.',
    },
    faqs: [
      {
        question: 'What is the difference between #57 stone and crusher run?',
        answer: '#57 crushed stone is clean 3/4-inch washed angular rock with no dust—ideal for French drains, shed pads, and driveway top coats. Crusher run mixes angular stone with fine limestone dust so it compacts rock-solid beneath pavers or concrete slabs.',
      },
      {
        question: 'How deep should crushed stone be for a gravel driveway?',
        answer: 'Construct a residential gravel driveway in two lifts: a 4-inch compacted base layer of crusher run (#21A), topped with 2 to 3 inches of clean #57 crushed stone.',
      },
    ],
  },

  decomposed_granite: {
    slug: 'decomposed-granite-calculator',
    title: 'Decomposed Granite (DG) Calculator — Patio & Pathway Tonnage',
    metaDescription: 'Free decomposed granite (DG) calculator factoring in 15%–20% compaction. Estimate cubic yards and tons for natural trails, bocce courts, and patios.',
    keywords: ['decomposed granite calculator', 'dg gravel calculator', 'decomposed granite compaction calculator', 'dg patio tons'],
    canonicalPath: '/decomposed-granite-calculator',
    category: 'construction',
    h1: 'Decomposed Granite (DG) Compaction & Tonnage Calculator',
    lead: 'Calculate bulk cubic yards and US short tons (1.50 tons/yd³) of natural or stabilized decomposed granite with built-in 15%–20% tamping compaction.',
    formula: {
      title: 'Compacted DG Formula',
      expression: 'Tons = [Area (sq ft) × (Compacted Depth (in) ÷ 12) ÷ 27] × 1.50 tons/yd³ × 1.18',
      explanation: 'Decomposed granite contains fine mineral dust that compresses tightly by 15% to 20% when watered and compacted with a vibratory plate compactor.',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 10 ft DG Garden Path @ 3" Compacted',
      scenario: 'Installing a 300 sq ft compacted decomposed granite walkway at 3" finished thickness with 18% compaction.',
      steps: [
        'Compacted volume: 300 sq ft × (3" ÷ 12) = 75 cu ft.',
        'Adjust +18% for pre-tamp loose depth: 75 × 1.18 = 88.5 cu ft = 3.28 cu yds.',
        'Weight (@ 1.50 tons/yd³): 3.28 × 1.50 = 4.92 US tons.',
      ],
      result: 'Requirement: 3.28 Loose Cubic Yards / 4.92 US Tons of Decomposed Granite.',
    },
    faqs: [
      {
        question: 'How much extra decomposed granite should I order for compaction?',
        answer: 'Order 15% to 20% extra loose volume when calculating for finished compacted depth. Moisture-conditioned DG compresses substantially under a vibratory plate compactor.',
      },
      {
        question: 'Should I use stabilized or unstabilized DG for a patio?',
        answer: 'Use stabilized DG (blended with organic plantain binder or polymer resin) for patios, ADA walkways, and sloped paths to resist rain erosion and tracking indoors.',
      },
    ],
  },

  river_rock: {
    slug: 'river-rock-calculator',
    title: 'River Rock & Landscaping Stone Calculator — Dry Creek Bed Tons',
    metaDescription: 'Calculate tons and cubic yards of 1"-3" decorative river rock and landscaping cobbles for dry creek beds, garden borders, and drainage swales.',
    keywords: ['river rock calculator', 'landscaping rock calculator', 'dry creek bed rock calculator', 'tons of river rock'],
    canonicalPath: '/river-rock-calculator',
    category: 'construction',
    h1: 'River Rock & Decorative Landscaping Stone Calculator',
    lead: 'Calculate bulk cubic yards and US tons (1.45 tons/yd³) of smooth 1"–3" river rock and cobbles for dry creek beds, foundation borders, and erosion swales.',
    formula: {
      title: 'River Rock Tonnage Formula',
      expression: 'Tons = [Area (sq ft) × (Depth (in) ÷ 12) ÷ 27] × 1.45 tons/yd³ × 1.08',
      explanation: 'Decorative 1"–3" river cobble weighs ~1.45 tons/yd³ (2,900 lbs). Apply at least 3 inches deep (approx. 1.5× stone diameter) so landscape fabric never shows through.',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 10 ft Dry Creek Border @ 3" River Rock',
      scenario: 'Covering a 300 sq ft landscape border or drainage swale with 1"-3" river rock at 3" depth.',
      steps: [
        'Volume: 300 × (3 ÷ 12) = 75 cu ft × 1.08 buffer = 81 cu ft = 3.0 cu yds.',
        'Weight (@ 1.45 tons/yd³): 3.0 × 1.45 = 4.35 US tons.',
      ],
      result: 'Requirement: 3.00 Cubic Yards (~4.35 US Tons) of decorative river rock.',
    },
    faqs: [
      {
        question: 'How deep should river rock be installed?',
        answer: 'Install decorative river rock at a depth equal to at least 1.5× the largest stone size—typically 3 inches for 1"–2" pebbles and 4 inches for 2"–3" cobbles—over heavy-duty woven landscape fabric.',
      },
      {
        question: 'How much area does 1 ton of river rock cover?',
        answer: 'One ton of river rock (~0.69 cubic yards) covers roughly 110 sq ft at 2 inches deep or 75 sq ft at 3 inches deep.',
      },
    ],
  },

  paver_base: {
    slug: 'paver-base-calculator',
    title: 'Paver Base & Bedding Sand Calculator — Gravel Sub-Base & Sand',
    metaDescription: 'Calculate compacted gravel sub-base (4"-6" crusher run) and 1-inch bedding sand tons plus polymeric joint sand bags for interlocking paver patios.',
    keywords: ['paver base calculator', 'paver sand calculator', 'gravel base under pavers', 'patio sub base calculator'],
    canonicalPath: '/paver-base-calculator',
    category: 'construction',
    h1: 'Paver Base Gravel & Bedding Sand Calculator',
    lead: 'Calculate both your compacted crushed-stone sub-base (4" patio / 6" driveway crusher run) and 1-inch screeded concrete bedding sand alongside total pavers and polymeric joint sand.',
    formula: {
      title: 'Dual-Layer Paver Base & Sand Formula',
      expression: 'Base Tons = [Area × (Base Depth ÷ 12) ÷ 27 × 1.15] × 1.60; Bedding Sand Tons = [Area × (1 ÷ 12) ÷ 27] × 1.30',
      explanation: 'Paver foundations require two distinct aggregate layers: 4"–6" compacted crusher run (#21A) base plus exactly 1" screeded coarse concrete sand.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Paver Driveway/Patio Base',
      scenario: 'Installing a 300 sq ft paver patio over a 6" compacted gravel base and 1" screeded bedding sand.',
      steps: [
        '6" Compacted Base (+15% compaction): 300 × 0.5 ÷ 27 × 1.15 = 6.39 yd³ × 1.60 = 10.22 tons crusher run.',
        '1" Bedding Sand: 300 × (1/12) ÷ 27 = 0.93 yd³ × 1.30 = 1.20 tons masonry sand.',
        'Polymeric joint sand: 300 ÷ 60 = 5 bags (50 lb).',
      ],
      result: 'Requirement: 10.22 Tons Gravel Base, 1.20 Tons Bedding Sand, and 5 Bags Polymeric Sand.',
    },
    faqs: [
      {
        question: 'How deep should the gravel base be under patio pavers?',
        answer: 'Excavate for a minimum 4-inch compacted crusher run gravel base for pedestrian patios and walkways, or 6 to 8 inches for driveways carrying passenger vehicles.',
      },
      {
        question: 'Why must bedding sand under pavers be exactly 1 inch deep?',
        answer: 'Bedding sand levels minor variations in paver thickness and seats the paver bottoms, but thicker sand (>1.5") shifts under loads and causes wavy rutting.',
      },
    ],
  },

  playground_mulch: {
    slug: 'playground-mulch-calculator',
    title: 'Playground Wood Chips & Rubber Mulch Calculator — Safety Fall Depth',
    metaDescription: 'Calculate ASTM safety-compliant cubic yards and bags of engineered wood fiber chips or recycled rubber mulch at 6", 9", or 12" fall-height depths.',
    keywords: ['playground mulch calculator', 'rubber mulch calculator', 'wood chips fall height depth', 'astm playground mulch'],
    canonicalPath: '/playground-mulch-calculator',
    category: 'construction',
    h1: 'Playground Wood Chips & Rubber Mulch Safety Calculator',
    lead: 'Size engineered wood fiber chips or recycled rubber mulch with ASTM playground fall-height depth presets (6", 9", and 12") for safe backyard and park play zones.',
    formula: {
      title: 'Playground Safety Surfacing Formula',
      expression: 'Cubic Yards = [Play Zone Area (sq ft) × (Safety Depth (in) ÷ 12)] ÷ 27 × 1.05',
      explanation: 'ASTM F1292 recommends 9"–12" of engineered wood chips or 6" of recycled rubber mulch beneath play structures over 4–7 feet tall.',
    },
    workedExample: {
      title: 'Worked Example: 20 ft × 15 ft Swing Zone @ 9" Safety Depth',
      scenario: 'Surfacing a 300 sq ft swing and slide play area to 9 inches compressed wood chip depth.',
      steps: [
        'Area: 20 ft × 15 ft = 300 sq ft.',
        'Depth: 9" ÷ 12 = 0.75 ft -> 225 cu ft × 1.05 buffer = 236.25 cu ft.',
        'Convert to cubic yards: 236.25 ÷ 27 = 8.75 cubic yards.',
      ],
      result: 'Requirement: 8.75 Cubic Yards of Playground Wood Chips (~3.9 tons).',
    },
    faqs: [
      {
        question: 'How deep should playground mulch be under a swingset?',
        answer: 'Install at least 9 inches of engineered wood fiber (compacting to ~6–7 inches) for equipment up to 7 feet high, or 12 inches for tall playsets up to 10 feet. Recycled rubber mulch requires 6 inches of depth for equivalent 10-foot impact absorption.',
      },
      {
        question: 'Can I use regular landscape bark mulch on a playground?',
        answer: 'Standard shredded landscape bark decomposes rapidly, harbors splinters, and loses shock-absorbing bounce. Always use ASTM-certified Engineered Wood Fiber (EWF) or recycled rubber nuggets.',
      },
    ],
  },

  pine_straw: {
    slug: 'pine-straw-calculator',
    title: 'Pine Straw Bale Calculator — Standard & Longleaf Jumbo Bales',
    metaDescription: 'Free pine straw calculator. Convert garden bed square footage into standard square bales (~38 sq ft) or longleaf jumbo bales (~65 sq ft) at 2"-4" depths.',
    keywords: ['pine straw calculator', 'how many bales of pine straw do i need', 'longleaf pine straw coverage', 'pine needle mulch calculator'],
    canonicalPath: '/pine-straw-calculator',
    category: 'construction',
    h1: 'Pine Straw & Longleaf Needle Bale Calculator',
    lead: 'Calculate exact bale counts for Southern pine straw ground cover using square footage, 2"–4" settled thickness, and standard square vs. longleaf jumbo bale yields.',
    formula: {
      title: 'Pine Straw Bale Formula',
      expression: 'Bales Needed = Ceil([Bed Sq Ft ÷ Depth-Adjusted Coverage] × (1 + Edge Tuck Margin %))',
      explanation: 'At a standard 3" settled depth, a regular square bale covers ~35–40 sq ft and a longleaf jumbo roll/bale covers ~60–70 sq ft.',
    },
    workedExample: {
      title: 'Worked Example: 30 ft × 12 ft Shrub Bed @ 3" Standard Bales',
      scenario: 'Mulching a 360 sq ft garden bed with 3" settled pine needles using standard square bales and 10% edge tuck.',
      steps: [
        'Bed area: 30 ft × 12 ft = 360 sq ft.',
        'Raw bales @ 38 sq ft/bale: 360 ÷ 38 = 9.47 bales.',
        'Add 10% tucking allowance along bed edges: 9.47 × 1.10 = 10.4 -> 11 bales.',
      ],
      result: 'Requirement: 11 Standard Pine Straw Bales (or 7 Longleaf Jumbo Bales).',
    },
    faqs: [
      {
        question: 'How many square feet does one bale of pine straw cover?',
        answer: 'A standard square pine straw bale covers 35 to 40 square feet at a fresh 3-inch depth (up to 50 sq ft for light annual refreshing). Longleaf jumbo bales or round rolls cover 60 to 70 square feet.',
      },
      {
        question: 'Why tuck pine straw along bed edges?',
        answer: 'Tucking a rolled edge into a 2-inch trench along lawn borders keeps wind from blowing loose needles onto grass and gives a crisp, tailored landscape line—budget roughly 10% extra bales for tucking.',
      },
    ],
  },

  grass_seed: {
    slug: 'grass-seed-calculator',
    title: 'Grass Seed Coverage Calculator — New Lawn vs. Overseeding Rates',
    metaDescription: 'Calculate pounds of grass seed and retail bag counts for new bare lawns vs overseeding existing turf across Tall Fescue, Bluegrass, Ryegrass, and Bermuda.',
    keywords: ['grass seed calculator', 'how much grass seed do i need', 'overseeding grass seed rate', 'fescue seeding calculator'],
    canonicalPath: '/grass-seed-calculator',
    category: 'construction',
    h1: 'Grass Seed Coverage & Bag Calculator',
    lead: 'Compare exact pounds of grass seed and 5/10/25-lb retail bags needed for new bare-soil lawns versus overseeding existing turf across popular cool- and warm-season grasses.',
    formula: {
      title: 'Grass Seed Weight Formula',
      expression: 'Seed Lbs = [(Lawn Sq Ft × 1.05) ÷ 1,000] × Species Rate (lbs per 1,000 sq ft)',
      explanation: 'Example Tall Fescue uses 8 lbs/1,000 sq ft for new lawns vs. 4 lbs/1,000 sq ft when overseeding established turf.',
    },
    workedExample: {
      title: 'Worked Example: 5,000 Sq Ft Overseed with Tall Fescue',
      scenario: 'Fall aerating and overseeding a 5,000 sq ft lawn (100 ft × 50 ft) with Turf-Type Tall Fescue at 4 lbs/1,000 sq ft.',
      steps: [
        'Lawn area: 100 ft × 50 ft = 5,000 sq ft.',
        'Apply 5% overlap margin: 5,250 effective sq ft.',
        'Calculate seed: (5,250 ÷ 1,000) × 4 lbs = 21.0 lbs of seed.',
        'Starter fertilizer (@ 3.5 lbs/1,000 sq ft): 19 lbs.',
      ],
      result: 'Requirement: 21 lbs of Tall Fescue Seed (1× 25-lb Bag) + 19 lbs Starter Fertilizer.',
    },
    faqs: [
      {
        question: 'What is the difference between new lawn and overseeding grass seed rates?',
        answer: 'Bare soil new-lawn rates are typically double the overseeding rate because no existing turf roots are present to fill coverage gaps. Applying full new-lawn rates over thick grass wastes seed and causes overcrowded, weak seedlings.',
      },
      {
        question: 'When is the best time to overseed Fescue vs. Bermuda?',
        answer: 'Seed cool-season grasses (Tall Fescue, Kentucky Bluegrass, Perennial Ryegrass) in early fall when soil temperatures are 50°F–65°F. Seed warm-season grasses (Bermuda, Zoysia) in late spring once daytime highs consistently exceed 75°F.',
      },
    ],
  },

  fence_post: {
    slug: 'fence-post-calculator',
    title: 'Fence Post & Concrete Bag Calculator — Posts, Rails, Pickets & Bags',
    metaDescription: 'Free fence calculator. Calculate fence posts, horizontal 2x4 rails, wood pickets, drainage gravel, and 50-lb/80-lb concrete bags by linear feet.',
    keywords: ['fence post calculator', 'how much concrete for fence posts', 'fence picket calculator', 'fence material calculator'],
    canonicalPath: '/fence-post-calculator',
    category: 'construction',
    h1: 'Fence Post, Lumber & Concrete Bag Calculator',
    lead: 'Calculate exact fence posts, 2×4 horizontal rails, dog-ear pickets, post-hole drainage gravel, and 50-lb/80-lb concrete bags from your total linear footage.',
    formula: {
      title: 'Fence Posts & Post-Hole Concrete Formula',
      expression: 'Posts = Ceil(Linear Ft ÷ Spacing) + 1 + Extra Gate/Corner Posts; Concrete/Hole = π·r²·Depth − Post Volume',
      explanation: 'A standard 10" wide × 30" deep post hole around a 4×4 post requires ~1.14 cu ft of concrete (approx. 2.5 to 3 bags of 50-lb fast-set concrete).',
    },
    workedExample: {
      title: 'Worked Example: 120 Linear Ft Privacy Fence (8\' Spacing)',
      scenario: 'Building a 120 ft, 6 ft high wood privacy fence with 8\' bays, 3 rails/bay, 10"×30" post holes, and 2 extra gate posts.',
      steps: [
        'Fence bays: 120 ÷ 8 = 15 sections (16 line posts + 2 extra gate posts = 18 total posts).',
        'Horizontal rails (3 per bay): 15 × 3 = 45 rails (8 ft long).',
        '5.5" Dog-ear pickets (+5% waste): 270 pickets.',
        'Concrete per hole (~1.14 cu ft) × 18 posts × 1.08 buffer = 22.1 cu ft -> 59 bags (50-lb) or 37 bags (80-lb).',
      ],
      result: 'Requirement: 18 Posts, 45 Rails, 270 Pickets, and 59× 50-lb Concrete Bags.',
    },
    faqs: [
      {
        question: 'How many bags of concrete do I need per fence post?',
        answer: 'For standard 4×4 posts in a 10" wide by 30" deep hole, plan on 2.5 to 3 bags of 50-lb fast-setting concrete (or 2 bags of 80-lb mix) per post. Deeper 36"–42" frost-line holes or wider 12" gate-post holes require 3.5 to 4.5 bags per post.',
      },
      {
        question: 'Should I put gravel at the bottom of a wooden fence post hole?',
        answer: 'Yes. Pouring 4 to 6 inches of crushed gravel at the bottom of each post hole promotes drainage away from the end grain of pressure-treated lumber, extending post lifespan and reducing frost heave.',
      },
    ],
  },
};


