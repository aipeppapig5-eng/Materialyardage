from pathlib import Path
import re, html, json, shutil

root=Path('/mnt/data/v25work')
base='https://www.materialyardage.com'

def page(title, desc, path, h1, intro, body, faq=None, section='Guide'):
    url=base+path
    faq_json=''
    if faq:
        faq_json=',\n'+json.dumps({"@type":"FAQPage","@id":url+'#faq',"mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faq]}, ensure_ascii=False, separators=(',',':'))
    return f'''<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>{html.escape(title)}</title>\n<meta name="description" content="{html.escape(desc)}">\n<meta name="robots" content="index, follow, max-image-preview:large">\n<link rel="canonical" href="{url}">\n<meta property="og:type" content="article">\n<meta property="og:title" content="{html.escape(title)}">\n<meta property="og:description" content="{html.escape(desc)}">\n<meta property="og:url" content="{url}">\n<link rel="stylesheet" href="/assets/css/styles.css">\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-08MTZ3F4Q1"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-08MTZ3F4Q1');</script>\n<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Article","headline":title,"description":desc,"url":url,"dateModified":"2026-09-29","author":{"@type":"Organization","name":"MaterialYardage"},"publisher":{"@type":"Organization","name":"MaterialYardage"}}, ensure_ascii=False)}{faq_json}</script>\n</head>\n<body>\n<header class="site-header"><div class="wrap header-inner">\n<a class="brand" href="/">Material<span>Yardage</span></a>\n<nav class="nav" aria-label="Primary"><a href="/calculators">Calculators</a><a href="/guides/topsoil-depth-guide">Guides</a><a href="/reference/material-density-chart">Reference</a><a href="/about">About</a><a href="/methodology">Methodology</a><a href="/contact">Contact</a></nav>\n</div></header>\n<main><div class="wrap narrow">\n<div class="crumbs"><a href="/">Home</a> / <a href="/calculators">Calculators</a> / {html.escape(section)} / {html.escape(h1)}</div>\n<span class="pill">Updated September 2026 · Free reference guide</span>\n<h1 style="margin-top:.7rem">{html.escape(h1)}</h1>\n<p class="lede">{html.escape(intro)}</p>\n{body}\n</div></main>\n<footer class="site-footer"><div class="wrap"><nav class="footer-nav" aria-label="Footer"><a href="/">Home</a><a href="/calculators">Calculators</a><a href="/guides/topsoil-depth-guide">Guides</a><a href="/reference/material-density-chart">Reference</a><a href="/about">About</a><a href="/methodology">Methodology</a><a href="/contact">Contact</a><a href="/privacy-policy">Privacy Policy</a></nav><p>© <span id="year">2026</span> MaterialYardage. Calculation estimates are provided for planning purposes.</p></div></footer>\n<script src="/assets/js/main.js"></script>\n</body></html>'''

guides={
'guides/topsoil-depth-guide.html': page(
'Topsoil Depth Guide: How Deep Should Topsoil Be? | MaterialYardage',
'Learn practical topsoil depth ranges for lawns, planting beds, raised beds and lawn top-dressing, plus a simple volume example and ordering tips.',
'/guides/topsoil-depth-guide','Topsoil Depth Guide: How Deep Should Topsoil Be?',
'The right topsoil depth depends on what you are building. Use the ranges below as planning guidance, then calculate the volume with the Topsoil Calculator.',
'''<section class="block"><h2>Typical topsoil depths</h2><div class="table-scroll"><table><thead><tr><th>Project</th><th>Typical depth</th><th>Planning note</th></tr></thead><tbody>
<tr><td>Existing lawn top-dressing</td><td>¼–½ in</td><td>Use a thin, even layer so existing grass remains exposed.</td></tr>
<tr><td>New lawn / turf preparation</td><td>4–6 in</td><td>Use enough quality soil to establish a workable root zone.</td></tr>
<tr><td>Flower and planting beds</td><td>6–12 in</td><td>Depth varies with existing soil and the plants being installed.</td></tr>
<tr><td>Vegetable / raised beds</td><td>8–12 in+</td><td>Deeper beds may be appropriate for crops with larger root systems.</td></tr>
</tbody></table></div></section>
<section class="block"><h2>How depth changes the quantity</h2><p>For a rectangular area, calculate square feet first, then multiply by depth in feet. Divide cubic feet by 27 to convert to cubic yards.</p><div class="formula">Cubic feet = length × width × (depth in inches ÷ 12)<br>Cubic yards = cubic feet ÷ 27</div><p>Example: a 20 ft × 10 ft bed at 6 inches deep is 100 cubic feet, or about 3.70 cubic yards before any allowance.</p></section>
<section class="block"><h2>Should you order extra?</h2><p>Loose soil can settle after spreading, watering and traffic. A planning allowance of roughly 5–10% can be useful where the existing grade is uneven or the material will settle. Do not use a generic allowance as a substitute for site measurements.</p></section>
<section class="block"><h2>Related calculator</h2><ul><li><a href="/">Topsoil Calculator</a> for cubic yards, cubic meters, estimated weight and bag equivalents.</li><li><a href="/landscaping/compost-mix">Compost &amp; Soil Mix Calculator</a> for blended raised-bed material.</li><li><a href="/reference/material-density-chart">Material Density Chart</a> for approximate weight conversions.</li></ul></section>''',
[('How deep should topsoil be for a new lawn?','A common planning range is about 4 to 6 inches, subject to the site, existing soil and turf requirements.'),('How deep should topsoil be in a planting bed?','About 6 to 12 inches is a common planning range, but plant type and existing soil conditions can change the requirement.'),('Should I add extra topsoil for settling?','A modest 5–10% planning allowance can help with settling and uneven areas, but supplier and site conditions should guide the final order.')]),
'Guides'),
'guides/mulch-depth-guide.html': page(
'Mulch Depth Guide: How Many Inches of Mulch Do You Need? | MaterialYardage',
'Compare common mulch depths, calculate cubic yards and understand how depth affects weed suppression, moisture retention and material quantity.',
'/guides/mulch-depth-guide','Mulch Depth Guide: How Many Inches of Mulch Do You Need?',
'Mulch depth controls both coverage and material cost. This guide gives practical planning ranges and shows how to convert bed dimensions into cubic yards.',
'''<section class="block"><h2>Common mulch depth ranges</h2><div class="table-scroll"><table><thead><tr><th>Use</th><th>Typical depth</th><th>Planning note</th></tr></thead><tbody><tr><td>Light decorative refresh</td><td>1–2 in</td><td>Useful where an existing mulch layer remains.</td></tr><tr><td>General landscape beds</td><td>2–3 in</td><td>A common range for a new or refreshed mulch layer.</td></tr><tr><td>Deep organic mulch layer</td><td>3–4 in</td><td>Use care around plant stems and trunks.</td></tr></tbody></table></div></section>
<section class="block"><h2>Mulch quantity formula</h2><p>Measure the bed in feet and depth in inches. Convert depth to feet, multiply by area and divide by 27.</p><div class="formula">Cubic yards = length (ft) × width (ft) × depth (in) ÷ 12 ÷ 27</div><p>For irregular beds, split the space into rectangles or estimate separate sections and add the results.</p></section>
<section class="block"><h2>Bulk mulch vs bags</h2><p>Bulk mulch is normally ordered by cubic yard, while retail mulch is sold by bag volume. To compare them, convert the bag size to cubic feet and divide 27 cubic feet by the bag volume. Always check the actual bag volume printed on the product because package sizes vary.</p></section>
<section class="block"><h2>Related calculator</h2><ul><li><a href="/mulch-calculator">Mulch Calculator</a> for bulk volume, bags and estimated weight.</li><li><a href="/landscaping/mulch">Mulch Coverage Matrix</a> for coverage planning.</li><li><a href="/reference/coverage-tables">Coverage Tables</a> for quick area-to-volume references.</li></ul></section>''',
[('How deep should mulch be?','A 2–3 inch layer is a common planning range for landscape beds. Deeper layers are sometimes used, but avoid piling mulch against plant stems or tree trunks.'),('How many cubic yards of mulch do I need?','Multiply length by width by depth in inches, convert inches to feet and divide cubic feet by 27. For irregular beds, calculate separate sections and add them.'),('Should mulch touch tree trunks?','Avoid creating a deep mulch mound against trunks or stems. Keep the immediate base of the plant clear enough to avoid trapping persistent moisture against the bark.')]),
'Guides'),
'guides/gravel-driveway-guide.html': page(
'Gravel Driveway Calculator Guide: Depth, Volume and Ordering | MaterialYardage',
'Learn how to estimate gravel for a driveway, choose a planning depth, account for waste and convert cubic yards to approximate tons.',
'/guides/gravel-driveway-guide','Gravel Driveway Guide: Depth, Volume and Ordering',
'Gravel driveways are usually built in layers. The quantity depends on the driveway area, the depth of each material layer and the aggregate density.',
'''<section class="block"><h2>Measure the driveway</h2><p>For a rectangular driveway, multiply length by width to get square feet. If the driveway widens or curves, divide it into sections and calculate each section separately. Measure depth in inches and convert it to feet before calculating volume.</p><div class="formula">Cubic feet = area (ft²) × depth (in) ÷ 12<br>Cubic yards = cubic feet ÷ 27</div></section>
<section class="block"><h2>Typical planning depths</h2><p>There is no single correct driveway depth because subgrade, traffic, drainage and the aggregate specification matter. A common planning approach is to estimate each layer separately rather than treating the whole driveway as one material.</p><ul><li>Sub-base / road base: often several inches where site conditions require a structural foundation.</li><li>Intermediate aggregate: depth depends on the driveway design and local practice.</li><li>Surface gravel: often a thinner finish layer that can be replenished over time.</li></ul><p>Use project specifications or local engineering guidance for heavy vehicles, poor soils and drainage-sensitive sites.</p></section>
<section class="block"><h2>Convert gravel volume to tons</h2><p>Weight depends strongly on rock type, grading, moisture and compaction. If your supplier quotes a density in tons per cubic yard, multiply the calculated cubic yards by that density. MaterialYardage uses approximate reference densities rather than supplier-certified weights.</p></section>
<section class="block"><h2>Ordering allowance</h2><p>A modest allowance can account for irregular edges, spreading losses and grade variation. Keep the allowance separate from the base calculation so you can see exactly what is being added.</p></section>
<section class="block"><h2>Related tools</h2><ul><li><a href="/gravel-calculator">Gravel Calculator</a></li><li><a href="/landscaping/gravel">Gravel &amp; Road Base Calculator</a></li><li><a href="/reference/material-density-chart">Material Density Chart</a></li><li><a href="/reference/coverage-tables">Coverage Tables</a></li></ul></section>''',
[('How deep should a gravel driveway be?','Depth depends on subgrade, drainage, traffic and the specified layer structure. Estimate each layer separately and follow the project specification for structural requirements.'),('How do I calculate tons of gravel?','Calculate cubic yards first, then multiply by the supplier or project density expressed in tons per cubic yard. Density varies by material and moisture.'),('Should a gravel driveway have multiple layers?','Many driveway designs use more than one aggregate layer so the base and surface perform different functions. The exact design depends on site and traffic conditions.')]),
'Guides'),
'guides/concrete-calculator-guide.html': page(
'Concrete Calculator Guide: Slabs, Footings and Waste Allowance | MaterialYardage',
'Learn how to estimate concrete volume for rectangular slabs and similar pours, convert cubic feet to yards and account for ordering allowance.',
'/guides/concrete-calculator-guide','Concrete Calculator Guide: Volume, Depth and Ordering',
'Concrete quantity is fundamentally a volume calculation. The difficult part is measuring each shape correctly and allowing for the difference between calculated volume and the amount actually ordered.',
'''<section class="block"><h2>Basic concrete volume</h2><p>For a rectangular slab, multiply length, width and thickness after converting all three dimensions to the same unit.</p><div class="formula">Cubic feet = length (ft) × width (ft) × thickness (ft)<br>Cubic yards = cubic feet ÷ 27</div><p>If thickness is given in inches, divide it by 12 before multiplying.</p></section>
<section class="block"><h2>Example</h2><div class="example"><p><strong>Slab:</strong> 20 ft × 10 ft × 4 in</p><p>Thickness = 4 ÷ 12 = 0.333 ft.</p><p>Volume = 20 × 10 × 0.333 ≈ 66.67 ft³.</p><p>Volume ≈ 2.47 yd³ before an ordering allowance.</p></div></section>
<section class="block"><h2>Why add an allowance?</h2><p>Forms are not perfectly dimensionless, ground conditions can change, and small losses occur during placement. A planning allowance is commonly added to the calculated volume, but the appropriate amount depends on the pour and supplier practice.</p></section>
<section class="block"><h2>Important for structural work</h2><p>This calculator estimates quantity; it does not design structural concrete. Reinforcement, strength class, water-cement ratio, exposure, aggregate grading and placement requirements should come from the project specification or qualified professional.</p></section>
<section class="block"><h2>Related tools</h2><ul><li><a href="/concrete/calculator">Concrete Calculator</a></li><li><a href="/concrete/slab">Concrete Slab Calculator</a></li><li><a href="/concrete/mix-proportions">Concrete Mix Proportions</a></li><li><a href="/materials/material-cost">Material Cost Calculator</a></li></ul></section>''',
[('How do I calculate concrete for a slab?','Multiply slab length, width and thickness using consistent units, then divide cubic feet by 27 to get cubic yards.'),('How much extra concrete should I order?','A planning allowance can cover measurement and placement losses, but the appropriate allowance depends on the project and supplier. Keep the allowance visible rather than hiding it in the base calculation.'),('Does this calculator design concrete strength?','No. It estimates quantity only. Structural mix design and reinforcement should follow the project specification and applicable standards.')]),
'Guides'),
'guides/paver-calculator-guide.html': page(
'Paver Calculator Guide: Patio Area, Paver Count and Waste | MaterialYardage',
'Learn how to calculate paver quantities from patio area, paver dimensions and cutting waste, with a worked example.',
'/guides/paver-calculator-guide','Paver Calculator Guide: Area, Quantity and Waste',
'Paver quantity starts with the finished surface area and the face area of one paver. The final order should include a cutting and breakage allowance appropriate to the pattern.',
'''<section class="block"><h2>Calculate the surface area</h2><p>For a rectangular patio, multiply length by width. For an irregular patio, split it into rectangles or other simple shapes and add the areas.</p></section>
<section class="block"><h2>Convert paver dimensions to area</h2><p>Use the same unit for both the patio and paver dimensions. For example, if a paver is 6 in × 6 in, its face area is 36 square inches. Convert either the paver or the patio area so both are expressed in the same square unit before dividing.</p><div class="formula">Pavers required ≈ project area ÷ one-paver face area<br>Order quantity = pavers required × (1 + waste allowance)</div></section>
<section class="block"><h2>Choosing a waste allowance</h2><p>Simple running-bond layouts may need less cutting than diagonal, herringbone or highly irregular layouts. Add more allowance when the design has many cuts, borders or fragile materials.</p></section>
<section class="block"><h2>What the calculator does not include</h2><p>Paver quantity does not automatically determine the amount of bedding sand, jointing material, base aggregate or edge restraint required. Those materials should be calculated separately from the project design.</p></section>
<section class="block"><h2>Related tools</h2><ul><li><a href="/paving/paver">Paver Calculator</a></li><li><a href="/reference/conversion-tables">Conversion Tables</a></li><li><a href="/materials/material-cost">Material Cost Calculator</a></li></ul></section>''',
[('How do I calculate how many pavers I need?','Calculate the finished area, divide by the face area of one paver using consistent units, then add an allowance for cuts and breakage.'),('How much paver waste should I allow?','The allowance depends on the laying pattern, borders, cuts and material. Simple layouts can require less waste than diagonal or complex patterns.'),('Does paver quantity include sand and base material?','No. Pavers, bedding material, jointing material and base aggregate are separate quantities and should be estimated independently.')]),
'Guides'),
}

refs={
'reference/material-density-chart.html': page(
'Material Density Chart: Tons per Cubic Yard | MaterialYardage',
'Approximate material density reference for topsoil, mulch, gravel, sand and aggregates. Use supplier-specific density when available.',
'/reference/material-density-chart','Material Density Chart: Approximate Tons per Cubic Yard',
'Density converts a volume estimate into an approximate weight. Actual bulk density varies with moisture, grading, compaction and product composition, so supplier data should take priority when available.',
'''<section class="block"><h2>Approximate bulk density</h2><div class="table-scroll"><table><thead><tr><th>Material</th><th>Approx. tons/yd³</th><th>Use with</th></tr></thead><tbody>
<tr><td>Unscreened topsoil</td><td>1.10</td><td>Topsoil weight estimate</td></tr><tr><td>Screened topsoil</td><td>1.00</td><td>Topsoil weight estimate</td></tr><tr><td>Garden soil / blend</td><td>0.90</td><td>Soil blend planning</td></tr><tr><td>Compost</td><td>0.60</td><td>Compost volume planning</td></tr><tr><td>Shredded bark mulch</td><td>0.40</td><td>Mulch weight estimate</td></tr><tr><td>Wood chip mulch</td><td>0.45</td><td>Mulch weight estimate</td></tr><tr><td>Pine straw / bark nuggets</td><td>0.30</td><td>Light organic material</td></tr><tr><td>Rubber mulch</td><td>0.60</td><td>Manufactured mulch</td></tr><tr><td>Pea gravel</td><td>1.35</td><td>Aggregate planning</td></tr><tr><td>River rock</td><td>1.35</td><td>Aggregate planning</td></tr><tr><td>Crushed stone</td><td>1.40</td><td>Aggregate planning</td></tr><tr><td>Crusher run / road base</td><td>1.50</td><td>Base-course planning</td></tr><tr><td>Decomposed granite</td><td>1.30</td><td>Aggregate planning</td></tr>
</tbody></table></div></section>
<section class="block"><h2>How to use the table</h2><p>First calculate cubic yards. Then multiply by the selected approximate density.</p><div class="formula">Estimated tons = cubic yards × tons per cubic yard</div><p>For example, 5 yd³ of a material using 1.40 tons/yd³ gives an estimate of 7.0 tons. This is a planning calculation, not a certified shipment weight.</p></section>
<section class="block"><h2>Why density varies</h2><p>Two loads sold under the same material name can have different weights because of moisture content, particle size, void space, organic content and compaction. For delivery and freight planning, use the density supplied by the quarry, landscape supplier or manufacturer whenever possible.</p></section>
<section class="block"><h2>Related calculators</h2><ul><li><a href="/gravel-calculator">Gravel Calculator</a></li><li><a href="/">Topsoil Calculator</a></li><li><a href="/mulch-calculator">Mulch Calculator</a></li><li><a href="/materials/sand">Sand Calculator</a></li><li><a href="/materials/aggregate">Aggregate Calculator</a></li></ul></section>''',
[('Are these material densities exact?','No. They are approximate planning values. Moisture, grading, composition and compaction can materially change bulk density.'),('How do I convert cubic yards to tons?','Multiply cubic yards by the applicable tons-per-cubic-yard density. Use supplier-specific density when available.'),('Why can wet soil weigh more than dry soil?','Water adds mass and changes the bulk density of the material. The same nominal volume can therefore have a different delivered weight.')]),
'Reference'),
'reference/conversion-tables.html': page(
'Construction Material Conversion Tables | Cubic Yards, Feet, Meters and Tons | MaterialYardage',
'Quick reference for cubic feet, cubic yards, cubic meters, inches, feet, meters and approximate volume-to-weight conversions.',
'/reference/conversion-tables','Construction Material Conversion Tables',
'Use these conversions when a supplier quote, calculator or project drawing uses different units from your measurements.',
'''<section class="block"><h2>Volume conversions</h2><div class="table-scroll"><table><thead><tr><th>From</th><th>Equivalent</th></tr></thead><tbody><tr><td>1 cubic yard</td><td>27 cubic feet</td></tr><tr><td>1 cubic yard</td><td>0.7646 cubic meters</td></tr><tr><td>1 cubic meter</td><td>35.3147 cubic feet</td></tr><tr><td>1 cubic meter</td><td>1.30795 cubic yards</td></tr></tbody></table></div></section>
<section class="block"><h2>Length and depth</h2><div class="table-scroll"><table><thead><tr><th>From</th><th>Equivalent</th></tr></thead><tbody><tr><td>12 inches</td><td>1 foot</td></tr><tr><td>1 foot</td><td>0.3048 meter</td></tr><tr><td>1 meter</td><td>3.28084 feet</td></tr><tr><td>1 centimeter</td><td>0.3937 inch</td></tr></tbody></table></div></section>
<section class="block"><h2>Useful formulas</h2><div class="formula">Cubic yards = cubic feet ÷ 27<br>Cubic meters = cubic feet ÷ 35.3147<br>Cubic feet = cubic yards × 27</div><p>For material weight, multiply volume by a density appropriate to the material. Do not use a generic density for a supplier-certified load.</p></section>
<section class="block"><h2>Area conversions</h2><div class="table-scroll"><table><thead><tr><th>From</th><th>Equivalent</th></tr></thead><tbody><tr><td>1 square meter</td><td>10.7639 square feet</td></tr><tr><td>1 square foot</td><td>0.092903 square meter</td></tr></tbody></table></div></section>
<section class="block"><h2>Related tools</h2><ul><li><a href="/calculators">All Calculators</a></li><li><a href="/reference/material-density-chart">Material Density Chart</a></li><li><a href="/reference/coverage-tables">Coverage Tables</a></li></ul></section>''',
[('How many cubic feet are in a cubic yard?','There are exactly 27 cubic feet in one cubic yard.'),('How many cubic yards are in a cubic meter?','One cubic meter is approximately 1.30795 cubic yards.'),('How many feet are in a meter?','One meter equals exactly 3.28084 feet by the standard conversion.')]),
'Reference'),
'reference/coverage-tables.html': page(
'Material Coverage Tables: Topsoil, Mulch and Gravel | MaterialYardage',
'Quick coverage references showing how many square feet one cubic yard covers at common depths for topsoil, mulch and gravel.',
'/reference/coverage-tables','Material Coverage Tables',
'Coverage is controlled by depth. These tables help you sanity-check a calculator result before ordering material.',
'''<section class="block"><h2>Square feet covered by 1 cubic yard</h2><div class="table-scroll"><table><thead><tr><th>Depth</th><th>Coverage from 1 yd³</th></tr></thead><tbody><tr><td>1 inch</td><td>324 ft²</td></tr><tr><td>2 inches</td><td>162 ft²</td></tr><tr><td>3 inches</td><td>108 ft²</td></tr><tr><td>4 inches</td><td>81 ft²</td></tr><tr><td>6 inches</td><td>54 ft²</td></tr><tr><td>8 inches</td><td>40.5 ft²</td></tr><tr><td>12 inches</td><td>27 ft²</td></tr></tbody></table></div><p>These values are mathematical volume relationships before settling, compaction or installation losses.</p></section>
<section class="block"><h2>How the table is calculated</h2><p>One cubic yard contains 27 cubic feet. At a depth of 3 inches, the depth is 0.25 feet, so 27 ÷ 0.25 = 108 square feet.</p><div class="formula">Coverage (ft²) = 27 ÷ depth (ft)</div></section>
<section class="block"><h2>Bagged material</h2><p>Bag coverage depends on the volume printed on the bag. Convert the bag volume to cubic feet, then use the same area formula. A 2 ft³ bag at 3 inches deep covers about 8 square feet before settling and installation losses.</p></section>
<section class="block"><h2>Important ordering note</h2><p>Actual coverage can differ because material settles, is spread unevenly, contains moisture, or is installed around irregular edges. Use these tables as a cross-check, not as a replacement for measuring the site.</p></section>
<section class="block"><h2>Related calculators</h2><ul><li><a href="/">Topsoil Calculator</a></li><li><a href="/mulch-calculator">Mulch Calculator</a></li><li><a href="/gravel-calculator">Gravel Calculator</a></li><li><a href="/reference/material-density-chart">Material Density Chart</a></li></ul></section>''',
[('How much area does one cubic yard cover?','It depends on depth. At 3 inches, one cubic yard mathematically covers 108 square feet; at 6 inches, it covers 54 square feet.'),('Does one cubic yard always cover the same area?','No. Coverage changes directly with installation depth. Settling and site conditions also affect real-world coverage.'),('How much does a 2 cubic foot bag cover?','At 3 inches deep, a 2 cubic foot bag covers about 8 square feet before settling or installation losses.')]),
'Reference')
}

for rel, content in {**guides, **refs}.items():
    p=root/rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

# Add guide/reference links to every existing primary nav and footer nav.
for p in root.rglob('*.html'):
    if p.name=='404.html':
        continue
    s=p.read_text(encoding='utf-8')
    s=re.sub(r'<nav class="nav"[^>]*>.*?</nav>', '<nav class="nav" aria-label="Primary"><a href="/calculators">Calculators</a><a href="/guides/topsoil-depth-guide">Guides</a><a href="/reference/material-density-chart">Reference</a><a href="/about">About</a><a href="/methodology">Methodology</a><a href="/contact">Contact</a></nav>', s, count=1, flags=re.S)
    s=re.sub(r'<nav class="footer-nav"[^>]*>.*?</nav>', '<nav class="footer-nav" aria-label="Footer"><a href="/">Home</a><a href="/calculators">Calculators</a><a href="/guides/topsoil-depth-guide">Guides</a><a href="/reference/material-density-chart">Reference</a><a href="/about">About</a><a href="/methodology">Methodology</a><a href="/contact">Contact</a><a href="/privacy-policy">Privacy Policy</a></nav>', s, count=1, flags=re.S)
    p.write_text(s, encoding='utf-8')

# Enrich calculators hub with guide/reference sections before Before you order.
cp=root/'calculators.html'
s=cp.read_text(encoding='utf-8')
marker='<section class="block"><h2>Before you order</h2>'
insert='''<section class="block"><h2>Planning guides</h2><ul class="cards three">\n<li><a href="/guides/topsoil-depth-guide"><strong>Topsoil Depth Guide</strong><span>Choose practical depths and convert them into cubic yards.</span></a></li>\n<li><a href="/guides/mulch-depth-guide"><strong>Mulch Depth Guide</strong><span>Compare mulch depths, bulk volume and bag coverage.</span></a></li>\n<li><a href="/guides/gravel-driveway-guide"><strong>Gravel Driveway Guide</strong><span>Estimate driveway layers, volume and approximate tonnage.</span></a></li>\n<li><a href="/guides/concrete-calculator-guide"><strong>Concrete Calculator Guide</strong><span>Understand slab volume, allowances and ordering.</span></a></li>\n<li><a href="/guides/paver-calculator-guide"><strong>Paver Calculator Guide</strong><span>Calculate paver quantity and cutting waste.</span></a></li>\n</ul></section>\n\n<section class="block"><h2>Reference tables</h2><ul class="cards three">\n<li><a href="/reference/material-density-chart"><strong>Material Density Chart</strong><span>Approximate tons per cubic yard for common materials.</span></a></li>\n<li><a href="/reference/conversion-tables"><strong>Conversion Tables</strong><span>Cubic yards, feet, meters, inches and area conversions.</span></a></li>\n<li><a href="/reference/coverage-tables"><strong>Coverage Tables</strong><span>Quick area coverage at common material depths.</span></a></li>\n</ul></section>\n\n'''
if marker in s and 'Planning guides' not in s:
    s=s.replace(marker, insert+marker)
cp.write_text(s, encoding='utf-8')

# Update homepage intro with guide links, preserving calculator content.
ip=root/'index.html'; s=ip.read_text(encoding='utf-8')
marker='  <section class="block">\n    <h2>How the cubic yard calculation works</h2>'
insert='''  <section class="block">\n    <h2>Topsoil planning guides</h2>\n    <p>Need more than the volume? Use the <a href="/guides/topsoil-depth-guide">topsoil depth guide</a> to choose a practical installation depth, or check the <a href="/reference/material-density-chart">material density chart</a> when converting volume to approximate weight.</p>\n  </section>\n\n'''
if marker in s and 'Topsoil planning guides' not in s:
    s=s.replace(marker, insert+marker)
ip.write_text(s, encoding='utf-8')

# Update sitemap with existing pages + new content pages, unique sorted.
urls=[]
for p in root.rglob('*.html'):
    if p.name=='404.html': continue
    rel=p.relative_to(root).as_posix()
    if rel.startswith('assets/'): continue
    path='/' if rel=='index.html' else '/'+rel[:-5]  # strip .html for cleanUrls
    urls.append(path)
urls=sorted(set(urls), key=lambda x: (x!='/', x))
priority={
'/':'1.0','/calculators':'0.9','/mulch-calculator':'0.9','/gravel-calculator':'0.9',
'/guides/topsoil-depth-guide':'0.8','/guides/mulch-depth-guide':'0.8','/guides/gravel-driveway-guide':'0.8','/guides/concrete-calculator-guide':'0.8','/guides/paver-calculator-guide':'0.8',
'/reference/material-density-chart':'0.8','/reference/conversion-tables':'0.8','/reference/coverage-tables':'0.8',
'/about':'0.6','/methodology':'0.6','/contact':'0.5','/privacy-policy':'0.3'}
change={u:('weekly' if u in ['/','/mulch-calculator','/gravel-calculator'] else 'monthly') for u in urls}
lines=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls:
    lines += [f'<url><loc>{base}{u}</loc><lastmod>2026-09-29</lastmod><changefreq>{change[u]}</changefreq><priority>{priority.get(u,"0.7")}</priority></url>']
lines.append('</urlset>')
(root/'sitemap.xml').write_text('\n'.join(lines)+'\n',encoding='utf-8')

# README / report
report=f'''# MaterialYardage v2.5 — SEO / Content Expansion\n\nDate: 2026-09-29\n\n## Added guide pages\n- /guides/topsoil-depth-guide\n- /guides/mulch-depth-guide\n- /guides/gravel-driveway-guide\n- /guides/concrete-calculator-guide\n- /guides/paver-calculator-guide\n\n## Added reference pages\n- /reference/material-density-chart\n- /reference/conversion-tables\n- /reference/coverage-tables\n\n## Site-wide content improvements\n- Added Guides and Reference navigation to all HTML pages.\n- Expanded the calculator directory with planning guides and reference tables.\n- Added contextual links from the Topsoil page.\n- Standardized sitemap to clean URLs and refreshed lastmod to 2026-09-29.\n- Added Article and FAQ structured data to the new editorial pages.\n\n## Sitemap\n- Unique indexable URLs: {len(urls)}\n- 404 excluded.\n- All URLs use https://www.materialyardage.com and clean URL paths.\n\n## Editorial approach\nThe new pages are written as practical calculation references. They explain formulas, assumptions, examples and limitations instead of being thin keyword pages.\n'''
(root/'SEO-CONTENT-REPORT-v2.5.md').write_text(report,encoding='utf-8')

# Simple quality checks
bad=[]
for p in root.rglob('*.html'):
    s=p.read_text(encoding='utf-8', errors='ignore')
    if s.count('<html')!=1 or s.count('</html>')!=1: bad.append((str(p),'html-count'))
    if 'YOUR_AD_UNIT_ID' in s or '[YOUR-' in s or '[OWNER NAME]' in s: bad.append((str(p),'placeholder'))
print('pages',len(list(root.rglob('*.html'))),'sitemap',len(urls),'bad',bad)
print('\n'.join(urls))
