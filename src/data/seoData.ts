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
};
