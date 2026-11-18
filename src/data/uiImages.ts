import concreteImg from '../assets/images/concrete_slab_pour_1794161317532.jpg';
import mulchImg from '../assets/images/hardwood_mulch_bed_1794161332174.jpg';
import gravelImg from '../assets/images/gravel_pathway_stone_1794161348512.jpg';
import paverImg from '../assets/images/paver_patio_herringbone_1794161363142.jpg';
import sodImg from '../assets/images/sod_turf_rolls_1794161378448.jpg';
import fabricCutImg from '../assets/images/fabric_cutting_table_1794161392311.jpg';
import draperyImg from '../assets/images/drapery_curtains_room_1794161406022.jpg';
import quiltImg from '../assets/images/patchwork_quilt_table_1794161420282.jpg';
import upholsteryImg from '../assets/images/upholstery_cushions_sofa_1794161432665.jpg';
import retainingWallImg from '../assets/images/retaining_wall_garden_1794163613551.jpg';
import wallpaperImg from '../assets/images/wallpaper_accent_wall_1794163613094.jpg';
import topsoilImg from '../assets/images/topsoil_lawn_pile_1795024666576.jpg';
import raisedBedImg from '../assets/images/raised_bed_garden_1795024667423.jpg';
import pottingSoilImg from '../assets/images/potting_mix_pots_1795024667092.jpg';
import compostImg from '../assets/images/organic_compost_garden_1795024667741.jpg';
import fillDirtImg from '../assets/images/fill_dirt_grading_1795024669085.jpg';
import lawnSandImg from '../assets/images/lawn_leveling_sand_1795024669309.jpg';
import peaGravelImg from '../assets/images/pea_gravel_walkway_1795024669168.jpg';
import crushedStoneImg from '../assets/images/crushed_stone_driveway_1795024670136.jpg';
import decomposedGraniteImg from '../assets/images/decomposed_granite_path_1795024670911.jpg';
import riverRockImg from '../assets/images/river_rock_creek_1795024685451.jpg';
import paverBaseImg from '../assets/images/paver_base_sand_1795024684929.jpg';
import playgroundMulchImg from '../assets/images/playground_wood_chips_1795024685431.jpg';
import pineStrawImg from '../assets/images/pine_straw_needles_1795024685696.jpg';
import grassSeedImg from '../assets/images/grass_seed_lawn_1795024686313.jpg';
import fencePostImg from '../assets/images/fence_post_concrete_1795024687265.jpg';
import cmuBlockImg from '../assets/images/cmu_block_wall_1795024688265.jpg';
import unitConverterImg from '../assets/images/tailor_tape_measure_1795024687868.jpg';

export interface CalculatorImageMeta {
  id: string;
  calculatorId: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  badge: string;
  category: 'fabric' | 'construction';
  materialTips: string[];
}

export const CALCULATOR_IMAGES: Record<string, CalculatorImageMeta> = {
  concrete_calc: {
    id: 'concrete_calc',
    calculatorId: 'concrete_calc',
    title: 'Ready-Mix Concrete Slab Installation',
    caption: 'Clean screeded concrete slab with wood formwork, reinforcing rebar grid, and smooth float finish.',
    src: concreteImg,
    alt: 'Freshly poured residential concrete slab with wood forms and leveling screed',
    badge: 'Ready-Mix 4,000 PSI',
    category: 'construction',
    materialTips: [
      'Pour at least 4" thickness for residential patios and sidewalks; 5–6" for driveways.',
      'Always add 10% waste for sub-base grade variations and spillage.',
      'Control joints should be cut within 24 hours at intervals equal to 2–3× the thickness in feet (e.g. 8–10 ft for a 4" slab).'
    ]
  },
  mulch_soil: {
    id: 'mulch_soil',
    calculatorId: 'mulch_soil',
    title: 'Hardwood Bark & Premium Soil Bed',
    caption: 'Dark natural shredded hardwood bark mulch contoured around lush perennial shrubs with clean edging.',
    src: mulchImg,
    alt: 'Dark shredded bark mulch bed surrounding green shrubs with curved stone border',
    badge: 'Triple-Shredded Hardwood',
    category: 'construction',
    materialTips: [
      'Maintain 2" to 3" depth for weed suppression and soil moisture retention.',
      'Avoid "mulch volcanos" piled against tree trunks to prevent bark decay and pests.',
      '1 cubic yard covers 108 sq ft at 3" depth or 162 sq ft at 2" depth.'
    ]
  },
  gravel_aggregate: {
    id: 'gravel_aggregate',
    calculatorId: 'gravel_aggregate',
    title: 'Crushed Stone & Pea Gravel Driveway',
    caption: 'Compacted crusher-run base topped with washed pea gravel and neat steel edging.',
    src: gravelImg,
    alt: 'Compacted gravel pathway and driveway with crushed decorative stone and landscape edging',
    badge: 'Washed Pea Stone #57',
    category: 'construction',
    materialTips: [
      'Always lay a 4" compacted road-base (crusher run) beneath driveway gravel.',
      'Top decorative aggregate layer should be 2" to 3" deep to avoid deep tire rutting.',
      'Standard gravel weighs approximately 1.35 to 1.45 US tons per cubic yard.'
    ]
  },
  paver_masonry: {
    id: 'paver_masonry',
    calculatorId: 'paver_masonry',
    title: 'Interlocking Herringbone Paver Patio',
    caption: 'Architectural concrete pavers installed in a 45° herringbone pattern with polymeric sand joints.',
    src: paverImg,
    alt: 'Interlocking concrete patio pavers in herringbone pattern with fire pit and outdoor seating',
    badge: 'Architectural Paver',
    category: 'construction',
    materialTips: [
      'Base requires 4–6" of compacted #21A crushed stone plus exactly 1" screeded bedding sand.',
      'Herringbone pattern provides the highest interlock and resistance to vehicular and foot shear.',
      'Plan for 10% cutting waste for straight borders; 12–15% for curved borders.'
    ]
  },
  sod_turf: {
    id: 'sod_turf',
    calculatorId: 'sod_turf',
    title: 'Fresh Sod Turf Rolls & Pallets',
    caption: 'Healthy green Kentucky Bluegrass and Tall Fescue turf rolls delivered fresh on wood pallets.',
    src: sodImg,
    alt: 'Lush green sod rolls neatly stacked on wooden pallets and laid across graded rich loam lawn',
    badge: 'Commercial Turfgrass',
    category: 'construction',
    materialTips: [
      'Standard sod roll measures 2 ft × 5 ft (10 sq ft); standard pallet holds 450 to 500 sq ft.',
      'Install immediately within 24 hours of delivery to prevent root heat damage.',
      'Water thoroughly twice daily for the first 10–14 days until roots firmly take hold.'
    ]
  },
  fabric_cut: {
    id: 'fabric_cut',
    calculatorId: 'fabric_cut',
    title: 'Professional Cutting Studio & Bolt Layout',
    caption: 'Precision rotary cutting grid with yard bolts, straight-edge acrylic rulers, and tailored patterns.',
    src: fabricCutImg,
    alt: 'Sewing studio cutting mat with bolts of linen and cotton fabric, rotary cutter, shears, and pattern pieces',
    badge: '44" / 54" Bolt Layout',
    category: 'fabric',
    materialTips: [
      'Align cutting grainlines parallel to the fabric selvedge to prevent garment twisting.',
      'Account for vertical and horizontal pattern repeats when cutting plaids, stripes, or florals.',
      'Always pre-wash washable natural fibers (cotton, linen) before cutting to pre-shrink.'
    ]
  },
  curtains_drapery: {
    id: 'curtains_drapery',
    calculatorId: 'curtains_drapery',
    title: 'Floor-to-Ceiling Tailored Linen Drapery',
    caption: 'Custom pinch-pleated drapery panels with double hems, puddle allowance, and blackout lining.',
    src: draperyImg,
    alt: 'High-ceiling living room with floor-to-ceiling tailored pinch-pleat linen curtains and natural daylight',
    badge: 'Pinch Pleat 2.0× Fullness',
    category: 'fabric',
    materialTips: [
      'Standard residential fullness is 2.0× for tailored drape; 2.5× for luxurious pinch pleats.',
      'Always allow 8" per panel for a 4" double bottom hem and 4" per panel for top heading buckram.',
      'Mount drapery rods 4–8" above the window frame or near the ceiling line to visually expand the room height.'
    ]
  },
  quilt_backing: {
    id: 'quilt_backing',
    calculatorId: 'quilt_backing',
    title: 'Patchwork Quilt Top & Backing Studio',
    caption: 'Handcrafted geometric quilt blocks with cut border yardage, seam layouts, and matching binding strips.',
    src: quiltImg,
    alt: 'Artisan patchwork quilt top spread on cutting table with fabric bolts, rotary cutter, and quilting rulers',
    badge: 'Seam Alignment & Binding',
    category: 'fabric',
    materialTips: [
      'Quilt backing and batting must be 4" to 8" larger than quilt top on all four sides for longarm machine loading.',
      'Horizontal seams require less fabric for wide quilts; vertical seams are preferred for narrow twin/throw quilts.',
      'Wide-back 108" fabrics eliminate center seams entirely for queen and king projects.'
    ]
  },
  upholstery_cushions: {
    id: 'upholstery_cushions',
    calculatorId: 'upholstery_cushions',
    title: 'Custom Box Cushions & Welted Piping',
    caption: 'Tailored sofa box cushions with high-resiliency foam inserts, matching boxing strips, and piped welting.',
    src: upholsteryImg,
    alt: 'Crisp upholstered sectional sofa with tailored box cushions, welted contrast piping, and decorative throw pillows',
    badge: 'High-Density Foam & Welting',
    category: 'fabric',
    materialTips: [
      'Box cushions require top/bottom plates, boxing strip (cushion depth + 1" seam allowance), and zipper strip.',
      'Welting/piping cord requires bias strips cut 1.5" to 2" wide depending on cord thickness (usually 5/32" or 4/32").',
      'High-resiliency (HR) foam with Dacron batting wrap gives a smooth, crowned, wrinkle-free look.'
    ]
  },
  retaining_wall: {
    id: 'retaining_wall',
    calculatorId: 'retaining_wall',
    title: 'Segmental Stone Retaining Wall & Drainage',
    caption: 'Interlocking split-face stone block retaining wall with gravel leveling trench, drainage zone, and smooth capstones.',
    src: retainingWallImg,
    alt: 'Terraced stone block retaining wall with gravel backfill and colorful garden landscaping',
    badge: 'Segmental Retaining Wall (SRW)',
    category: 'construction',
    materialTips: [
      'Bury at least 1 full course (or 1" per 1 ft of wall height) below finished grade on a 6" compacted crushed rock base.',
      'Always install a 12" wide clean drainage aggregate (#57 stone) chimney behind the wall with a 4" perforated drain tile.',
      'Walls over 3 ft tall (0.9 m) require geogrid soil reinforcement layers extended horizontally into the backfill slope.'
    ]
  },
  wallpaper_calc: {
    id: 'wallpaper_calc',
    calculatorId: 'wallpaper_calc',
    title: 'Designer Wallpaper Accent Wall Installation',
    caption: 'Patterned botanical wallcovering installed with seamless pattern repeats, smoothed seams, and precision trim edges.',
    src: wallpaperImg,
    alt: 'Contemporary living room featuring dark botanical wallpaper accent wall with professional installer smoothing edges',
    badge: 'Pattern Repeat & Drop Match',
    category: 'fabric',
    materialTips: [
      'Measure wall height at multiple points and add 4" (10 cm) trimming allowance to every cut strip.',
      'For straight or half-drop patterns, round up each strip length to the nearest multiple of the vertical repeat.',
      'Always purchase +1 extra roll from the exact same dye lot / run number for repair patches or pattern accidents.'
    ]
  },
  raised_bed_soil: {
    id: 'raised_bed_soil',
    calculatorId: 'raised_bed_soil',
    title: 'Raised Garden Bed Soil & Mel’s Mix Blend',
    caption: 'Balanced blend of screened topsoil, organic compost, and coarse aeration (perlite/vermiculite) for cedar and galvanized raised beds.',
    src: raisedBedImg,
    alt: 'Cedar raised garden beds filled with fresh topsoil, compost, and perlite blend',
    badge: '50/30/20 Garden Blend',
    category: 'construction',
    materialTips: [
      'Standard 4×8 ft raised beds at 12" deep hold 32 cubic feet (~1.19 cubic yards) of garden soil mix.',
      'Blending topsoil, compost, and coarse perlite prevents compaction in deep container beds.',
      'Allow 5%–10% extra volume for initial watering settlement after filling.'
    ]
  },
  potting_soil: {
    id: 'potting_soil',
    calculatorId: 'potting_soil',
    title: 'Container Planters, Tapered Pots & Grow Bags',
    caption: 'Dry quarts and gallons of lightweight container potting mix calculated accurately using frustum geometry for tapered pots.',
    src: pottingSoilImg,
    alt: 'Terracotta flower pots, window boxes, and fabric grow bags filled with aerated potting mix',
    badge: 'Dry Quarts & Gallons',
    category: 'construction',
    materialTips: [
      'Use lightweight soilless potting mix (peat/coir + perlite) in containers—never heavy backyard topsoil.',
      '1 cubic foot of potting mix equals 25.71 dry quarts (~6.43 dry gallons).',
      'Leave 1 inch of watering headspace below the container rim so mulch and soil do not wash over.'
    ]
  },
  pine_straw: {
    id: 'pine_straw',
    calculatorId: 'pine_straw',
    title: 'Southern Pine Straw & Longleaf Needle Mulching',
    caption: 'Fresh golden-brown longleaf pine needles tucked neatly along shrub beds, shade borders, and natural tree islands.',
    src: pineStrawImg,
    alt: 'Crisp pine straw needle ground cover tucked cleanly along curved azalea border',
    badge: 'Standard & Jumbo Bales',
    category: 'construction',
    materialTips: [
      'Standard square bales cover 35–40 sq ft at 3" settled depth; longleaf jumbo bales cover 60–70 sq ft.',
      'Tuck a rolled edge into a 2" perimeter trench to prevent wind uplift and create a clean lawn border.',
      'Budget +10% extra bales for thick edge tucking and slope coverage.'
    ]
  },
  grass_seed: {
    id: 'grass_seed',
    calculatorId: 'grass_seed',
    title: 'New Lawn Seeding & Fall Turf Overseeding',
    caption: 'Precision seed application across Tall Fescue, Kentucky Bluegrass, Perennial Ryegrass, and Bermuda grass lawns.',
    src: grassSeedImg,
    alt: 'Green turfgrass lawn with rotary grass seed spreader beside freshly seeded patch',
    badge: 'New Lawn vs Overseed',
    category: 'construction',
    materialTips: [
      'New bare lawns require roughly double the pounds per 1,000 sq ft compared to overseeding existing turf.',
      'Apply half the seed north-to-south and half east-to-west with a broadcast spreader for streak-free germination.',
      'Keep the top 0.5 inch of soil consistently moist with light daily watering for 14–21 days.'
    ]
  },
  fence_post: {
    id: 'fence_post',
    calculatorId: 'fence_post',
    title: 'Wood Privacy Fence Posts, Rails & Footings',
    caption: 'Complete lumber bill of materials with 4×4 posts, 2×4 horizontal rails, dog-ear pickets, and concrete footing bags.',
    src: fencePostImg,
    alt: 'Pressure-treated fence posts set in concrete footings with horizontal rails and pickets',
    badge: 'Posts, Pickets & 50-lb Bags',
    category: 'construction',
    materialTips: [
      'Always pour 4–6" of crushed gravel at the bottom of wooden post holes for end-grain drainage.',
      'Slope the top of each concrete footing slightly away from the wood post to shed rainwater.',
      'Standard 10" wide × 30" deep holes around a 4×4 post require ~2.5 to 3 bags of 50-lb fast-setting concrete.'
    ]
  },
  topsoil_calc: {
    id: 'topsoil_calc',
    calculatorId: 'mulch_soil',
    title: 'Screened Loam Topsoil & Lawn Grading',
    caption: 'Dark screened loam topsoil staged on residential turf for lawn leveling, low-spot patching, and planting bed grading.',
    src: topsoilImg,
    alt: 'Screened dark loam topsoil pile beside wheelbarrow and shovel on residential lawn',
    badge: 'Screened Loam Soil',
    category: 'construction',
    materialTips: [
      'Standard topsoil weighs roughly 1.15 tons (2,300 lbs) per cubic yard dry, or 1.30 tons damp.',
      'Topdressing an existing lawn should stay at 0.25" to 0.5" so grass blades stay exposed.',
      '1 cubic yard equals 27 cubic feet and covers 108 sq ft at 3 inches deep.'
    ]
  },
  compost_calc: {
    id: 'compost_calc',
    calculatorId: 'mulch_soil',
    title: 'Rich Organic Compost & Soil Amendment',
    caption: 'Aged crumbly humus compost ready for turf topdressing, vegetable soil enrichment, and raised bed blending.',
    src: compostImg,
    alt: 'Hands holding dark crumbly organic compost over green vegetable garden seedlings',
    badge: 'Aged Humus Compost',
    category: 'construction',
    materialTips: [
      'Topdress lawns with 0.25" to 0.5" of screened fine compost after core aeration.',
      'Blend 20% to 30% compost into native garden soil rather than planting in 100% pure compost.',
      'Finished compost weighs approximately 0.75 to 0.85 US tons per cubic yard.'
    ]
  },
  fill_dirt: {
    id: 'fill_dirt',
    calculatorId: 'mulch_soil',
    title: 'Compacted Subsoil Fill Dirt & Yard Grading',
    caption: 'Clean structural fill dirt graded cleanly along residential slopes and foundation backfills.',
    src: fillDirtImg,
    alt: 'Compacted brown subsoil fill dirt graded across a backyard lot slope with landscape rake',
    badge: '15% Compaction Buffer',
    category: 'construction',
    materialTips: [
      'Always order 15% to 20% extra loose fill dirt when compacting in 4–6" lifts.',
      'Use clean fill dirt for deeper grade build-up, then cap the top 3–4" with screened topsoil for grass.',
      'Uncompacted fill dirt weighs roughly 1.22 US tons per cubic yard.'
    ]
  },
  lawn_leveling_sand: {
    id: 'lawn_leveling_sand',
    calculatorId: 'gravel_aggregate',
    title: 'Washed Masonry Sand & Lawn Topdressing',
    caption: 'Fine washed masonry leveling sand brushed into turf canopies with a leveling lute to smooth bumpy yards.',
    src: lawnSandImg,
    alt: 'Fine light-tan masonry leveling sand spread across green grass lawn with metal leveling rake',
    badge: '0.25"–0.5" Leveling',
    category: 'construction',
    materialTips: [
      'Always use washed coarse concrete or masonry sand—avoid fine play sand which can seal clay soils.',
      'Keep topdressing applications at 0.25" to 0.5" per pass so healthy turf blades breathe.',
      '1 cubic yard of washed masonry sand weighs roughly 1.30 US tons.'
    ]
  },
  pea_gravel: {
    id: 'pea_gravel',
    calculatorId: 'gravel_aggregate',
    title: 'Rounded Pea Gravel Walkway & Dog Run',
    caption: 'Smooth multi-toned rounded pea gravel pebbles contained neatly inside steel landscape edging.',
    src: peaGravelImg,
    alt: 'Curved backyard pathway filled with smooth rounded pea gravel bordered by dark steel edging',
    badge: '3/8" Washed Pea Stone',
    category: 'construction',
    materialTips: [
      'Install 2" to 3" depth for walkways and dog runs; deeper pea gravel shifts underfoot.',
      'Always install rigid aluminum, steel, or timber edging to keep round pebbles contained.',
      'Pea gravel weighs approximately 1.35 US tons per cubic yard.'
    ]
  },
  crushed_stone: {
    id: 'crushed_stone',
    calculatorId: 'gravel_aggregate',
    title: 'Angular #57 Crushed Limestone & Driveway Rock',
    caption: 'Sharp fractured #57 crushed stone that locks tightly together under vehicle loads and drains fast in French drains.',
    src: crushedStoneImg,
    alt: 'Angular grey number 57 crushed stone aggregate spread across a residential driveway',
    badge: '#57 Crushed Limestone',
    category: 'construction',
    materialTips: [
      'Use angular #57 stone for driveways, shed pads, and French drain trenches—it locks better than round stone.',
      'Plan 4" depth for shed pads and 4–6" over compacted crusher run for residential driveways.',
      '#57 crushed limestone weighs approximately 1.40 US tons per cubic yard.'
    ]
  },
  decomposed_granite: {
    id: 'decomposed_granite',
    calculatorId: 'gravel_aggregate',
    title: 'Compacted Decomposed Granite (DG) Pathway',
    caption: 'Golden-tan decomposed granite tamped into a firm natural patio and garden path finish.',
    src: decomposedGraniteImg,
    alt: 'Compacted golden-tan decomposed granite courtyard patio and garden path lined with stone',
    badge: '18% Compaction Factor',
    category: 'construction',
    materialTips: [
      'Decomposed granite settles 15%–20% when watered and compacted with a vibratory plate compactor.',
      'Use stabilized DG with organic binder on sloped paths or patio seating zones.',
      'Compacted DG weighs roughly 1.50 US tons per loose cubic yard ordered.'
    ]
  },
  river_rock: {
    id: 'river_rock',
    calculatorId: 'gravel_aggregate',
    title: 'Decorative River Rock Dry Creek Bed',
    caption: 'Smooth 1"–3" natural river cobbles and accent boulders installed over heavy-duty geotextile fabric.',
    src: riverRockImg,
    alt: 'Dry creek drainage bed lined with multicolored smooth river rocks and garden boulders',
    badge: '1"–3" River Cobble',
    category: 'construction',
    materialTips: [
      'Install river rock at a depth of 1.5× the largest stone diameter (3"–4") for full coverage.',
      'Lay woven permeable landscape fabric beneath river rock to prevent stones from sinking into soil.',
      'Decorative river cobble weighs approximately 1.45 US tons per cubic yard.'
    ]
  },
  paver_base: {
    id: 'paver_base',
    calculatorId: 'paver_masonry',
    title: 'Compacted Paver Base & Screeded Bedding Sand',
    caption: 'Multi-layer patio construction showing #21A crusher run stone base, screed rails, and 1" bedding sand.',
    src: paverBaseImg,
    alt: 'Patio installation with compacted gravel base layer, screeded 1-inch bedding sand, and pavers',
    badge: '4"–6" Base + 1" Sand',
    category: 'construction',
    materialTips: [
      'Compact crushed stone base in 2" lifts using a plate compactor (4" for patios, 6–8" for driveways).',
      'Screed coarse concrete bedding sand to exactly 1 inch thick—never thicker than 1.5 inches.',
      'Sweep polymeric joint sand into dry paver joints and mist gently to lock pavers together.'
    ]
  },
  playground_mulch: {
    id: 'playground_mulch',
    calculatorId: 'mulch_soil',
    title: 'ASTM Engineered Wood Fiber Playground Chips',
    caption: 'Thick impact-absorbing engineered wood fiber surfacing installed beneath outdoor playground equipment.',
    src: playgroundMulchImg,
    alt: 'Public park swing set surrounded by clean cushion layer of natural engineered wood fiber playground chips',
    badge: '6"–12" Fall Safety Depth',
    category: 'construction',
    materialTips: [
      'ASTM F1292 recommends 9"–12" of engineered wood chips for playsets 5–10 feet tall.',
      'Allow for ~20% natural settling during the first few weeks of active play.',
      'Recycled rubber mulch achieves equivalent impact rating at ~6 inches depth.'
    ]
  },
  cmu_block: {
    id: 'cmu_block',
    calculatorId: 'paver_masonry',
    title: 'Standard 8×8×16 Concrete Masonry Unit (CMU) Wall',
    caption: 'Modular concrete block courses laid plumb with Type S mortar joints and mason level.',
    src: cmuBlockImg,
    alt: 'Straight grey concrete masonry unit CMU block wall with mortar joints, mason trowel, and level',
    badge: '8×8×16 CMU & Mortar',
    category: 'construction',
    materialTips: [
      'Standard 8×8×16 CMU blocks cover 0.89 sq ft of wall face (1.125 blocks per sq ft).',
      'Budget ~1 bag of 80-lb Type S or N mortar per 12–13 standard concrete blocks.',
      'Order 8% extra blocks for half-cuts, corner returns, and job-site breakage.'
    ]
  },
  unit_converter: {
    id: 'unit_converter',
    calculatorId: 'fabric_cut',
    title: 'Material & Textile Measurement Converter',
    caption: 'Convert seamlessly between linear yards, meters, inches, cubic yards, cubic meters, and short tons.',
    src: unitConverterImg,
    alt: 'Tailor measuring tape, brass ruler, steel yardstick, and folded linen fabric swatches',
    badge: 'Imperial & Metric Tables',
    category: 'fabric',
    materialTips: [
      '1 linear yard equals 36 inches, 3 feet, or 0.9144 meters.',
      '1 cubic yard equals 27 cubic feet or 0.7646 cubic meters.',
      '1 US short ton equals 2,000 pounds or 0.9072 metric tonnes.'
    ]
  }
};
