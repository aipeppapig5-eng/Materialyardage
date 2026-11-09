export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: 'construction' | 'fabric';
  categoryLabel: string;
  readTime: string;
  calculatorId: string;
  calculatorName: string;
  summary: string;
  keyTakeaways: string[];
  content: {
    heading: string;
    text: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    callout?: {
      title: string;
      body: string;
    };
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const GUIDES_DATA: Record<string, GuideArticle> = {
  'how-to-calculate-cubic-yards': {
    id: 'how-to-calculate-cubic-yards',
    slug: 'how-to-calculate-cubic-yards',
    title: 'How to Calculate Cubic Yards for Mulch, Soil, Sand & Gravel',
    metaTitle: 'How to Calculate Cubic Yards Formula & Calculator Guide',
    metaDescription: 'Learn the exact formula to calculate cubic yards for landscaping, concrete, and soil. Includes step-by-step examples, depth conversion tables, and tips.',
    category: 'construction',
    categoryLabel: 'Landscaping & Aggregates',
    readTime: '6 min read',
    calculatorId: 'mulch_soil',
    calculatorName: 'Mulch & Soil Mix Calculator',
    summary: 'A cubic yard (yd³) is the standard commercial unit of volume in North America for ordering bulk mulch, topsoil, sand, gravel, and concrete. One cubic yard equals 27 cubic feet.',
    keyTakeaways: [
      '1 Cubic Yard = 27 Cubic Feet = 36" × 36" × 36" (approx. 0.765 m³).',
      'Formula: Length (ft) × Width (ft) × [Depth (in) ÷ 12] ÷ 27 = Cubic Yards.',
      'Always round up by 5%–10% to account for ground compaction, slope variances, and wheelbarrow spillage.',
      'One cubic yard will cover 324 sq ft at 1 inch depth, 162 sq ft at 2 inches, and 108 sq ft at 3 inches.',
    ],
    content: [
      {
        heading: '1. The Standard Cubic Yard Formula',
        text: [
          'Whether you are laying cedar mulch in flower beds or pouring a patio slab, bulk suppliers sell materials by the cubic yard. To calculate volume accurately:',
          'Step 1: Measure length and width of the area in feet to get total square footage (sq ft = length × width).',
          'Step 2: Convert desired depth from inches into feet by dividing by 12 (e.g., 3 inches = 3 ÷ 12 = 0.25 ft).',
          'Step 3: Multiply square feet by depth in feet to get cubic feet.',
          'Step 4: Divide cubic feet by 27 because there are 27 cubic feet in one cubic yard.',
        ],
        callout: {
          title: 'Master Rule of Thumb Formula',
          body: 'Cubic Yards = (Square Footage × Depth in Inches) ÷ 324',
        },
      },
      {
        heading: '2. Depth Coverage Quick Reference Table',
        text: [
          'Use this standard commercial coverage table to quickly determine how many square feet one cubic yard will cover at varying depths:',
        ],
        table: {
          headers: ['Target Depth (Inches)', 'Coverage per 1 cu yd (sq ft)', 'Coverage per 2 cu yd (sq ft)', 'Coverage per 5 cu yd (sq ft)'],
          rows: [
            ['1 Inch', '324 sq ft', '648 sq ft', '1,620 sq ft'],
            ['2 Inches', '162 sq ft', '324 sq ft', '810 sq ft'],
            ['3 Inches (Standard Mulch)', '108 sq ft', '216 sq ft', '540 sq ft'],
            ['4 Inches (Standard Slabs/Gravel)', '81 sq ft', '162 sq ft', '405 sq ft'],
            ['6 Inches (Heavy Driveways)', '54 sq ft', '108 sq ft', '270 sq ft'],
          ],
        },
      },
      {
        heading: '3. Bagged Material vs. Bulk Delivery',
        text: [
          'Retail garden centers sell mulch and soil in bags of 1.5, 2.0, or 3.0 cubic feet. Here is how bags convert to 1 cubic yard (27 cu ft):',
          '• 2.0 cu ft bags: 27 ÷ 2.0 = 13.5 bags (buy 14 bags per cubic yard).',
          '• 3.0 cu ft bags: 27 ÷ 3.0 = 9 bags (buy 9 bags per cubic yard).',
          'When needing more than 2 cubic yards, bulk truck delivery is usually 30% to 50% cheaper than purchasing individual bags.',
        ],
      },
    ],
    faq: [
      {
        question: 'How do I calculate cubic yards for irregular or round flower beds?',
        answer: 'For circular beds: measure radius in feet. Area = 3.1416 × (radius × radius). Multiply by depth in feet and divide by 27. For irregular curves: break the area into smaller rectangles and triangles, sum their areas, and apply the formula.',
      },
      {
        question: 'How many tons is 1 cubic yard of gravel or dirt?',
        answer: 'Weight depends on moisture and density. 1 cubic yard of dry topsoil weighs ~1.1 tons (2,200 lbs). 1 cubic yard of crushed gravel stone weighs ~1.4 to 1.5 tons (2,800 to 3,000 lbs).',
      },
    ],
  },
  'concrete-bag-calculator-guide': {
    id: 'concrete-bag-calculator-guide',
    slug: 'concrete-bag-calculator-guide',
    title: 'How Many Bags of Concrete Do I Need? 40lb, 60lb & 80lb Yield Chart',
    metaTitle: 'How Many Bags of Concrete Do I Need? Yield Chart & Formula',
    metaDescription: 'Find out exactly how many 40lb, 60lb, or 80lb bags of concrete you need for slabs, footings, and fence posts. Complete bag yield formulas and rules of thumb.',
    category: 'construction',
    categoryLabel: 'Concrete & Masonry',
    readTime: '5 min read',
    calculatorId: 'concrete_calc',
    calculatorName: 'Concrete Slabs & Footings Calculator',
    summary: 'Concrete pre-mix bags are measured by weight, but concrete is poured by volume. Knowing the exact cubic foot yield of 40lb, 60lb, and 80lb bags prevents mid-pour shortages.',
    keyTakeaways: [
      'An 80 lb bag yields 0.60 cu ft (45 bags per cubic yard).',
      'A 60 lb bag yields 0.45 cu ft (60 bags per cubic yard).',
      'A 40 lb bag yields 0.30 cu ft (90 bags per cubic yard).',
      'For a standard 10x10 ft patio at 4" depth, you need 1.23 cu yds or 56 eighty-pound bags.',
    ],
    content: [
      {
        heading: '1. Standard Concrete Bag Yield Specifications',
        text: [
          'Pre-blended dry concrete bags (like Quikrete or Sakrete) combine Portland cement, sand, and coarse aggregates. When water is added, the volume expands into wet concrete.',
          'Always use 80-pound bags for larger projects because they cost significantly less per cubic foot. Use 60-pound bags if loading and lifting bags alone.',
        ],
        table: {
          headers: ['Bag Weight', 'Dry Weight', 'Wet Volume Yield (cu ft)', 'Bags Needed for 1 Cubic Yard (27 cu ft)'],
          rows: [
            ['80 lb Bag', '36.3 kg', '0.60 cu ft', '45 bags'],
            ['60 lb Bag', '27.2 kg', '0.45 cu ft', '60 bags'],
            ['50 lb Fast-Setting', '22.7 kg', '0.37 cu ft', '73 bags'],
            ['40 lb Bag', '18.1 kg', '0.30 cu ft', '90 bags'],
          ],
        },
      },
      {
        heading: '2. Slab Concrete Bag Calculator Matrix',
        text: [
          'Here is the exact bag count needed for common DIY patio, shed base, and walkway dimensions at the standard residential depth of 4 inches (0.333 ft):',
        ],
        table: {
          headers: ['Slab Dimensions (4" Thick)', 'Total Cubic Feet', 'Cubic Yards', '80 lb Bags Needed (+10% buffer)'],
          rows: [
            ['4 ft × 4 ft (Small Pad)', '5.33 cu ft', '0.20 cu yd', '10 bags'],
            ['6 ft × 6 ft (Tool Shed)', '12.00 cu ft', '0.44 cu yd', '22 bags'],
            ['8 ft × 8 ft (Hot Tub Base)', '21.33 cu ft', '0.79 cu yd', '39 bags'],
            ['10 ft × 10 ft (Patio)', '33.33 cu ft', '1.23 cu yd', '61 bags'],
            ['12 ft × 12 ft (Large Patio)', '48.00 cu ft', '1.78 cu yd', '88 bags'],
          ],
        },
      },
    ],
    faq: [
      {
        question: 'When is it cheaper to order ready-mix concrete delivery truck over bags?',
        answer: 'Generally, once your project exceeds 1.5 to 2.0 cubic yards (approx. 70 to 90 eighty-pound bags), ready-mix delivery from a transit mixer truck becomes faster, stronger, and more cost-effective.',
      },
      {
        question: 'How much water do I add per 80 lb bag of concrete?',
        answer: 'Most standard 80lb bags require 3.0 to 4.5 quarts (0.75 to 1.1 gallons) of clean water. Adding too much water weakens concrete compressive strength (PSI).',
      },
    ],
  },
  'mulch-depth-and-coverage-guide': {
    id: 'mulch-depth-and-coverage-guide',
    slug: 'mulch-depth-and-coverage-guide',
    title: 'Complete Mulch Depth, Square Footage & Weed Barrier Guide',
    metaTitle: 'How Deep Should Mulch Be? Depth & Coverage Guide',
    metaDescription: 'Find out the optimal mulch depth for flower beds, vegetable gardens, trees, and walkways. Prevent root suffocation and weed growth with proper layering.',
    category: 'construction',
    categoryLabel: 'Landscaping & Beds',
    readTime: '5 min read',
    calculatorId: 'mulch_soil',
    calculatorName: 'Mulch & Soil Mix Calculator',
    summary: 'Applying mulch at the correct depth protects plant root systems from drought and extreme temperatures while suppressing weeds. Too little mulch lets weeds through; too much suffocates roots.',
    keyTakeaways: [
      'Standard flower beds require 2 to 3 inches of organic bark or hardwood mulch.',
      'Existing beds with old mulch only need a 1-inch annual refresh layer.',
      'Never pile mulch against tree trunks ("mulch volcanoes"); maintain a 3-inch gap around tree bark.',
      'Playgrounds and heavy-traffic pathways require 4 to 6 inches of engineered wood fiber.',
    ],
    content: [
      {
        heading: '1. Recommended Depth by Landscape Application',
        text: [
          'Different garden zones and plant varieties require distinct mulch depths for optimal soil aeration and moisture retention:',
        ],
        table: {
          headers: ['Application', 'Recommended Depth', 'Mulch Type', 'Replacement Frequency'],
          rows: [
            ['Flower & Perennial Beds', '2 to 3 inches', 'Shredded Hardwood, Pine Bark', 'Every 12–18 months'],
            ['Vegetable Gardens', '1.5 to 2 inches', 'Clean Straw, Shredded Leaves', 'Seasonal'],
            ['Tree Rings', '3 inches', 'Woodchips, Coarse Bark', 'Every 18–24 months'],
            ['Garden Walkways', '3 to 4 inches', 'Cedar Chips, Nuggets', 'Every 24 months'],
            ['Playgrounds', '6 to 9 inches', 'Certified Engineered Wood Fiber', 'Top off annually'],
          ],
        },
      },
      {
        heading: '2. Avoiding Mulch Volcanoes and Disease',
        text: [
          'The number one mistake made by homeowners and amateur landscapers is piling mulch up against tree trunks. This holds moisture against the trunk, causing fungal rot, bark decay, and inviting boring pests.',
          'Always form a "donut" shape around trees: 3 inches of mulch over root zones, tapering down to bare ground 3 to 6 inches away from the trunk base.',
        ],
      },
    ],
    faq: [
      {
        question: 'Should I lay landscape fabric before spreading mulch?',
        answer: 'Landscape fabric is recommended under rock, gravel, and playground mulch. However, in organic mulch beds, landscape fabric prevents the mulch from decomposing naturally into the topsoil and weeds will eventually sprout on top of the fabric.',
      },
    ],
  },
  'gravel-tonnage-and-density-guide': {
    id: 'gravel-tonnage-and-density-guide',
    slug: 'gravel-tonnage-and-density-guide',
    title: 'Gravel & Crushed Stone Tonnage: Density Chart for Driveways & Drainage',
    metaTitle: 'Gravel Tonnage Calculator & Density Conversion Chart',
    metaDescription: 'How to convert cubic yards of gravel into tons. Comprehensive density reference for crushed stone #57, pea gravel, crusher run, and river rock.',
    category: 'construction',
    categoryLabel: 'Aggregates & Hardscaping',
    readTime: '6 min read',
    calculatorId: 'gravel_aggregate',
    calculatorName: 'Gravel & Aggregates Calculator',
    summary: 'Commercial quarries sell aggregates by the ton, but project contractors measure trenches and driveways in cubic yards. Density conversion is vital to avoid truck overloads.',
    keyTakeaways: [
      'Standard crushed stone (#57 limestone) weighs ~1.40 tons per cubic yard.',
      'Dense crusher run / road base with stone dust weighs up to 1.60 tons per cubic yard.',
      'Pea gravel weighs approximately 1.35 to 1.40 tons per cubic yard.',
      'A standard tandem dump truck carries 12 to 14 tons of gravel per load.',
    ],
    content: [
      {
        heading: '1. Aggregate Density Reference Table',
        text: [
          'Aggregates have distinct bulk weights depending on particle gradation, compaction, and moisture content:',
        ],
        table: {
          headers: ['Aggregate Grade', 'Common Uses', 'Tons / Cubic Yard', 'Cubic Yards per Ton'],
          rows: [
            ['Crusher Run / Road Base', 'Driveway foundations, paver subbase', '1.50 – 1.60 tons', '0.65 yd³'],
            ['#57 Crushed Stone (3/4")', 'French drains, concrete, driveways', '1.35 – 1.45 tons', '0.72 yd³'],
            ['Pea Gravel (3/8" round)', 'Walkways, patios, dog runs', '1.30 – 1.40 tons', '0.74 yd³'],
            ['River Rock / Cobble', 'Decorative swales, landscape beds', '1.30 – 1.45 tons', '0.73 yd³'],
            ['Decomposed Granite (DG)', 'Patios, pathways, xeriscaping', '1.45 – 1.55 tons', '0.67 yd³'],
          ],
        },
      },
    ],
    faq: [
      {
        question: 'How thick should gravel be for a residential driveway?',
        answer: 'A long-lasting gravel driveway should have a total depth of 6 to 8 inches: a 4–6 inch base of compacted #3 or #4 heavy stone, topped with 2–3 inches of compacted crusher run or #57 gravel.',
      },
    ],
  },
  'fabric-bolt-widths-and-yardage-guide': {
    id: 'fabric-bolt-widths-and-yardage-guide',
    slug: 'fabric-bolt-widths-and-yardage-guide',
    title: 'Standard Fabric Bolt Widths Explained (44", 54", 60" & 108" Wide)',
    metaTitle: 'Standard Fabric Bolt Widths & Usable Width Guide',
    metaDescription: 'Complete reference for standard fabric bolt widths. Understand selvedge allowances, usable cutting widths, and how to convert yardage between different roll sizes.',
    category: 'fabric',
    categoryLabel: 'Sewing & Crafting',
    readTime: '5 min read',
    calculatorId: 'fabric_cut',
    calculatorName: '2D Fabric Cut Planner',
    summary: 'Fabric is wound onto flat cardboard bolts or rolled on heavy cardboard tubes. Understanding nominal width versus usable cutting width prevents pattern shortfall.',
    keyTakeaways: [
      'Quilting cotton is universally 44" to 45" wide (usable cutting width: 42"–43").',
      'Home decor and upholstery textiles are standardized at 54" wide.',
      'Apparel fabrics, athletic knits, and suitings are standard 58" to 60" wide.',
      'Always trim off the outer 0.5" to 1.0" woven selvedges (selvage) before cutting.',
    ],
    content: [
      {
        heading: '1. Standard Bolt Width Classifications',
        text: [
          'Fabric yardage is sold by linear length along the bolt roll, meaning a wider roll provides more square inches of usable material per linear yard purchased:',
        ],
        table: {
          headers: ['Fabric Classification', 'Nominal Width', 'Usable Cut Width', 'Sq Inches per Linear Yard'],
          rows: [
            ['Quilting Cotton & Calico', '44" – 45"', '42" – 43"', '1,584 sq in'],
            ['Home Decor & Upholstery', '54"', '52" – 53"', '1,944 sq in (22% more)'],
            ['Apparel, Knits & Suiting', '58" – 60"', '56" – 58"', '2,160 sq in (36% more)'],
            ['Extra-Wide Quilt Backing', '108"', '104" – 106"', '3,888 sq in (145% more)'],
          ],
        },
      },
    ],
    faq: [
      {
        question: 'What is the selvedge (selvage) and why cannot it be used in finished seams?',
        answer: 'The selvedge is the tightly woven border on both edges of the fabric roll. It has denser weave tension and manufacturer printing. If sewn into a garment or cushion, it shrinks differently during washing and causes seam puckering.',
      },
    ],
  },
  'curtain-fullness-and-measurement-guide': {
    id: 'curtain-fullness-and-measurement-guide',
    slug: 'curtain-fullness-and-measurement-guide',
    title: 'Curtain Fullness, Hem Rules & Drop Measurement Master Guide',
    metaTitle: 'How to Calculate Curtain Fullness Ratios & Fabric Yardage',
    metaDescription: 'Complete drapery calculation guide: 1.5x, 2.0x, and 2.5x fullness multipliers, double bottom hems, header allowances, and puddling standards.',
    category: 'fabric',
    categoryLabel: 'Drapery & Decor',
    readTime: '6 min read',
    calculatorId: 'curtains_drapery',
    calculatorName: 'Curtains & Drapery Calculator',
    summary: 'Flat fabric hung across a window looks thin and uninviting. Fullness refers to gathering or pleating extra width to give curtains luxurious ripples and professional drape.',
    keyTakeaways: [
      '1.5x Fullness: Tailored, modern minimal look or sheer inner curtains.',
      '2.0x Fullness: Standard decorator standard for eyelet/grommet and pencil pleat panels.',
      '2.5x Fullness: Luxury custom pinch pleats and heavy thermal blackout drapes.',
      'Always add 8 inches for double bottom hems (folds 4" then 4") to weight the curtain.',
    ],
    content: [
      {
        heading: '1. Understanding Curtain Fullness Ratios',
        text: [
          'Fullness represents the ratio of total ungathered fabric panel width to the finished rod or track length.',
          'Formula: Total Flat Fabric Width = Rod Width × Fullness Multiplier.',
          'For example: A 72-inch wide curtain rod with standard 2.0x fullness requires 144 inches of flat fabric (approx. three 54-inch panels joined together).',
        ],
      },
      {
        heading: '2. Header & Hem Allowance Cheat Sheet',
        text: [
          'Never order fabric based only on finished window height. You must include vertical fabric allowances for seams:',
          '• Top Heading Allowance: Add 4" for simple rod pockets; add 6" for custom buckram pinch pleat headings.',
          '• Bottom Double Hem Allowance: Add 8" (essential 4" double fold to give draperies clean vertical hang).',
          '• Floor Brush vs Puddling: Add 0" for 0.5" floor clearance, add 2" for soft brush, add 4"–6" for traditional luxury puddle.',
        ],
      },
    ],
    faq: [
      {
        question: 'How do I handle pattern repeat matching across multiple curtain panels?',
        answer: 'When joining multiple widths of patterned fabric, each cut length must be rounded up to the next full vertical repeat measurement so horizontal motifs align seamlessly across window panels.',
      },
    ],
  },
  'paver-patio-base-and-sand-depth-guide': {
    id: 'paver-patio-base-and-sand-depth-guide',
    slug: 'paver-patio-base-and-sand-depth-guide',
    title: 'Paver Patio Base Depth: Compacted Gravel, Bedding Sand & Polymeric Joints',
    metaTitle: 'How Deep to Dig for Paver Patio Base & Sand Layers',
    metaDescription: 'Step-by-step paver patio excavation depth guide. Calculate compacted gravel subbase, screeded bedding sand, and polymeric joint sand bags.',
    category: 'construction',
    categoryLabel: 'Hardscaping & Masonry',
    readTime: '5 min read',
    calculatorId: 'paver_masonry',
    calculatorName: 'Paver Patios & CMU Walls Calculator',
    summary: 'Over 90% of paver patio failures (sunken pavers, rutting, shifting) stem from inadequate gravel subbase depth and improper sand screeding.',
    keyTakeaways: [
      'Excavation depth = Paver thickness (typically 2-3/8") + 1" Bedding Sand + 4"–6" Gravel Base.',
      'Residential pedestrian patios require 4 to 6 inches of compacted crushed stone road base.',
      'Vehicular driveways require 8 to 12 inches of compacted road base.',
      'Bedding sand must be coarse concrete sand (ASTM C-33), never limestone screenings or play sand.',
    ],
    content: [
      {
        heading: '1. The Anatomical Cross-Section of a Durable Paver Patio',
        text: [
          'Layer 1 (Bottom): Compacted subgrade native soil covered with non-woven geotextile fabric to prevent subsoil migration.',
          'Layer 2 (Foundation): 4 to 6 inches of crushed stone road base (crusher run / dense grade aggregate) compacted in 2-inch lifts.',
          'Layer 3 (Bedding): Exactly 1.0 inch of screeded coarse bedding sand (ASTM C33). Do not compact until pavers are set.',
          'Layer 4 (Surface): Interlocking concrete pavers (standard 60mm / 2-3/8" thickness).',
          'Layer 5 (Locking): Polymeric sand swept into joints and activated with water mist.',
        ],
      },
    ],
    faq: [
      {
        question: 'Why can I not use stone dust or masonry sand for the paver bedding layer?',
        answer: 'Stone dust and fine sand hold trapped moisture that undergoes freeze-thaw cycles in winter, leading to paver heave. Coarse concrete sand allows proper drainage and interlocks paver bottom ribs.',
      },
    ],
  },
  'upholstery-fabric-yardage-guide': {
    id: 'upholstery-fabric-yardage-guide',
    slug: 'upholstery-fabric-yardage-guide',
    title: 'How Much Fabric for Reupholstering Chairs, Cushions & Sofas',
    metaTitle: 'Upholstery Yardage Chart for Chairs, Sofas & Cushions',
    metaDescription: 'Complete furniture reupholstery yardage guide. Estimated fabric requirements for dining chairs, wingbacks, club chairs, 2-seat loveseats, and 3-seat sofas.',
    category: 'fabric',
    categoryLabel: 'Furniture & Decor',
    readTime: '6 min read',
    calculatorId: 'upholstery_cushions',
    calculatorName: 'Upholstery & Cushions Calculator',
    summary: 'Reupholstering furniture restores vintage pieces and customized interior palettes. Estimate accurate fabric requirements based on furniture frame type, cushion counts, and pattern repeats.',
    keyTakeaways: [
      'Dining chair slip seat (cushion only): 0.75 yards per 2 chairs on 54" fabric.',
      'Wingback or Club chair: 6 to 8 yards of solid 54" upholstery fabric.',
      'Standard 3-cushion sofa: 14 to 18 yards of solid 54" upholstery fabric.',
      'Add 15%–25% extra yardage if using patterned fabric with large vertical repeats.',
    ],
    content: [
      {
        heading: '1. Standard Furniture Reupholstery Yardage Chart (54" Fabric)',
        text: [
          'Yardage values below assume standard 54" decorator fabric without pattern match loss:',
        ],
        table: {
          headers: ['Furniture Type', 'Cushion Details', 'Solid Fabric Needed (54")', 'With 6"-12" Pattern Repeat'],
          rows: [
            ['Dining Chair (Drop-in Seat)', 'Seat pad only', '0.75 yds (for 2 chairs)', '1.0 yd'],
            ['Dining Chair (Padded Back)', 'Padded seat & back', '1.5 – 2.0 yds', '2.5 yds'],
            ['Armchair / Accent Chair', 'Attached seat', '4.5 – 5.5 yds', '6.0 – 7.0 yds'],
            ['Classic Wingback Chair', 'Loose seat cushion', '6.5 – 8.0 yds', '9.0 – 10.0 yds'],
            ['2-Cushion Loveseat (60")', '2 seat + 2 back cushions', '10.0 – 13.0 yds', '13.0 – 16.0 yds'],
            ['3-Cushion Sofa (84")', '3 seat + 3 back cushions', '14.0 – 18.0 yds', '18.0 – 22.0 yds'],
          ],
        },
      },
    ],
    faq: [
      {
        question: 'How do I calculate welting / piping cord fabric yardage?',
        answer: 'Welting is cut on a 45-degree true bias (approx. 1.5" to 2" wide strips). Generally, 1 linear yard of 54" fabric yields approximately 20 to 24 yards of continuous bias welting strips.',
      },
    ],
  },
};

// GSC Crawled Guide Aliases
GUIDES_DATA['mulch-depth-guide'] = GUIDES_DATA['mulch-depth-and-coverage-guide'];
GUIDES_DATA['paver-calculator-guide'] = GUIDES_DATA['paver-patio-base-and-sand-depth-guide'];
