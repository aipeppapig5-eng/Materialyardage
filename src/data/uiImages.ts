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
  }
};
