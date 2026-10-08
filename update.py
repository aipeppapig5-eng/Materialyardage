from pathlib import Path
import re, json, shutil
root=Path('/mnt/data/my29')
calc=(root/'calculators.html').read_text()
# Build new homepage from calculators hub
s=calc
s=s.replace('<title>Construction &amp; Landscaping Calculators | MaterialYardage</title>', '<title>Construction &amp; Landscaping Calculators | MaterialYardage</title>')
s=s.replace('Free construction and landscaping calculators for topsoil, mulch, gravel, concrete, masonry, compost, sod and material quantities. Includes formulas and planning guidance.', 'Free construction and landscaping calculators for topsoil, mulch, gravel, concrete, masonry, compost, sod, pavers and material costs, with practical explanations and planning guidance.')
s=s.replace('https://www.materialyardage.com/calculators', 'https://www.materialyardage.com/')
# Remove breadcrumb from homepage
s=re.sub(r'<nav aria-label="Breadcrumb" class="crumbs">.*?</nav>\s*', '', s, count=1, flags=re.S)
# Primary and footer calculator links point to homepage
s=s.replace('aria-current="page" href="/calculators"', 'aria-current="page" href="/"')
s=s.replace('<a href="/calculators">Calculators</a>', '<a href="/">Calculators</a>')
# Topsoil card now has its own dedicated URL
s=s.replace('<a href="/"><strong>Topsoil Calculator</strong>', '<a href="/topsoil-calculator"><strong>Topsoil Calculator</strong>')
# Improve homepage intro
old='<p class="lede">Free quantity estimators for common landscaping, concrete and masonry projects. Enter your dimensions, review the assumptions, and use the result as a planning estimate before ordering material.</p>'
new='''<p class="lede">Free quantity calculators for landscaping and construction projects. Estimate cubic yards, cubic feet, cubic meters, bags, approximate weight, paver counts and material costs from your project dimensions. Each calculator includes practical assumptions so you can understand the estimate before ordering.</p>
<p>MaterialYardage brings common material-estimating tasks into one place: topsoil for lawns and planting beds, mulch and gravel for landscaping, concrete for slabs and small projects, masonry quantities, paving materials, sand and aggregate, plus a simple material-cost estimator. Use the calculator that matches your project, then follow the related guide or reference table for more detailed planning.</p>'''
s=s.replace(old,new)
# Insert detailed explanations before Planning guides
marker='<section class="block"><h2>Planning guides</h2>'
explain='''<section class="block calculator-explanations">
<h2>What each calculator helps you plan</h2>
<p>These tools are designed for preliminary quantity planning. The result is based on the dimensions and assumptions you enter; actual delivered quantities can vary with material density, moisture, compaction, product size, cutting waste and supplier packaging.</p>
<h3>Landscaping calculators</h3>
<div class="content-grid">
<a class="resource-card" href="/topsoil-calculator"><h3>Topsoil Calculator</h3><p>Estimate topsoil volume for lawns, planting beds and raised beds. The calculator converts length, width and depth into cubic yards, cubic meters and cubic feet, then provides an approximate weight and bag equivalent for planning an order.</p></a>
<a class="resource-card" href="/mulch-calculator"><h3>Mulch Calculator</h3><p>Calculate the bulk mulch needed for garden beds, borders and landscape areas at your chosen depth. Results include volume and retail bag estimates so you can compare bulk delivery with packaged mulch.</p></a>
<a class="resource-card" href="/gravel-calculator"><h3>Gravel Calculator</h3><p>Estimate gravel or decorative stone volume from project dimensions and convert the result to cubic yards, cubic meters and an approximate tonnage. Use it for landscape areas, paths and other non-structural material planning.</p></a>
<a class="resource-card" href="/landscaping/compost-mix"><h3>Compost &amp; Soil Mix Calculator</h3><p>Plan a custom soil blend by estimating the total volume first and then dividing it between topsoil, compost and other components. This is useful for raised beds, planting areas and soil-amendment projects.</p></a>
<a class="resource-card" href="/landscaping/sod"><h3>Sod Calculator</h3><p>Estimate the lawn area that needs sod and allow for cutting and installation waste. The result helps you translate measured lawn dimensions into a practical number of rolls, pieces or pallets based on the selected product.</p></a>
<a class="resource-card" href="/landscaping/gravel"><h3>Gravel &amp; Road Base Calculator</h3><p>Estimate aggregate quantities for driveways, paths and base layers. Review volume and approximate weight while considering the difference between loose material, compacted layers and the supplier's stated density.</p></a>
<a class="resource-card" href="/landscaping/mulch"><h3>Mulch Coverage Matrix</h3><p>Compare how much bulk or bagged mulch is required at common depths. It is useful when deciding between different bag sizes or checking how far a bulk delivery should spread across several landscape beds.</p></a>
</div>
<h3>Concrete calculators</h3>
<div class="content-grid">
<a class="resource-card" href="/concrete/slab"><h3>Concrete Slab Calculator</h3><p>Estimate concrete volume for a rectangular slab from length, width and thickness. Review cubic-yard volume, bagged-concrete equivalents and an ordering allowance, while treating structural design and reinforcement as separate engineering requirements.</p></a>
<a class="resource-card" href="/concrete/mix-proportions"><h3>Concrete Mix Proportions</h3><p>Explore a nominal 1:2:4 volumetric relationship between cement, sand and coarse aggregate for early quantity planning. It is not a structural mix-design tool and should not replace a specified concrete mix.</p></a>
<a class="resource-card" href="/concrete/calculator"><h3>Concrete Calculator</h3><p>Calculate rectangular concrete volume and compare the requirement with retail bag yields or a ready-mix order. Use the result for budgeting and preliminary ordering, then confirm the final quantity with the supplier.</p></a>
<a class="resource-card" href="/concrete/cement"><h3>Cement Calculator</h3><p>Estimate cement-bag quantities from a project volume and an adjustable cement-content factor. The factor should reflect the intended product or mix specification rather than being treated as a universal structural recipe.</p></a>
</div>
<h3>Masonry calculators</h3>
<div class="content-grid">
<a class="resource-card" href="/masonry/brick"><h3>Brick Wall Calculator</h3><p>Estimate the number of bricks required for a wall using its dimensions, brick profile and waste allowance. Openings, mortar joints, brick size and the actual laying pattern can change the final quantity.</p></a>
<a class="resource-card" href="/masonry/block"><h3>Concrete Block Calculator</h3><p>Estimate concrete masonry units for a wall area and allow for waste. The tool is intended for preliminary ordering and should be adjusted for openings, bond pattern, block dimensions and the manufacturer's packaging.</p></a>
<a class="resource-card" href="/masonry/mortar"><h3>Mortar Calculator</h3><p>Estimate mortar quantity for masonry work using wall dimensions and joint assumptions. Actual yield depends on joint thickness, unit dimensions, workmanship, wall openings and the mortar product selected.</p></a>
</div>
<h3>Material, paving and cost calculators</h3>
<div class="content-grid">
<a class="resource-card" href="/materials/sand"><h3>Sand Calculator</h3><p>Estimate sand volume and approximate weight for applications such as bedding, leveling and material-mix planning. Because sand density changes with moisture and grading, supplier data is preferred for tonnage-based orders.</p></a>
<a class="resource-card" href="/materials/aggregate"><h3>Aggregate Calculator</h3><p>Estimate crushed stone, gravel or aggregate volume and approximate weight. Use the result to plan base layers and material orders, while checking the exact grading and bulk density supplied for the project.</p></a>
<a class="resource-card" href="/paving/paver"><h3>Paver Calculator</h3><p>Estimate the number of paving units needed from the project area and paver dimensions, including a cutting and waste allowance. Layout pattern, borders, curves and the manufacturer's dimensions can affect the final count.</p></a>
<a class="resource-card" href="/materials/material-cost"><h3>Material Cost Calculator</h3><p>Turn a calculated quantity into a preliminary project budget by combining material price, delivery and tax. Enter the supplier's actual billing unit and quote so the estimate reflects the price you are being offered.</p></a>
</div>
</section>
'''
s=s.replace(marker, explain+marker)
(root/'index.html').write_text(s)

# Update the dedicated topsoil page copied from the old homepage
p=root/'topsoil-calculator.html'
t=p.read_text()
t=t.replace('<link href="https://www.materialyardage.com/" rel="canonical"/>','<link href="https://www.materialyardage.com/topsoil-calculator" rel="canonical"/>')
t=t.replace('"url":"https://www.materialyardage.com/"','"url":"https://www.materialyardage.com/topsoil-calculator"')
t=t.replace('"@id":"https://www.materialyardage.com/#calculator"','"@id":"https://www.materialyardage.com/topsoil-calculator#calculator"')
t=t.replace('"@id":"https://www.materialyardage.com/#faq"','"@id":"https://www.materialyardage.com/topsoil-calculator#faq"')
t=t.replace('"@id":"https://www.materialyardage.com/#website"','"@id":"https://www.materialyardage.com/#website"')
t=t.replace('https://www.materialyardage.com/#calculator','https://www.materialyardage.com/topsoil-calculator#calculator')
t=t.replace('https://www.materialyardage.com/#faq','https://www.materialyardage.com/topsoil-calculator#faq')
t=t.replace('"item":"https://www.materialyardage.com/"}]}</script>','"item":"https://www.materialyardage.com/topsoil-calculator"}]}</script>')
t=t.replace('<meta content="Topsoil Calculator | How Many Yards of Soil Do I Need? | MaterialYardage" name="twitter:title"/>','<meta content="Topsoil Calculator | How Many Yards of Soil Do I Need? | MaterialYardage" name="twitter:title"/>')
t=t.replace('<meta content="https://www.materialyardage.com/" property="og:url"/>','<meta content="https://www.materialyardage.com/topsoil-calculator" property="og:url"/>')
t=t.replace('<nav aria-label="Primary" class="nav"><a aria-current="page" href="/calculators">Calculators</a>','<nav aria-label="Primary" class="nav"><a aria-current="page" href="/">Calculators</a>')
t=t.replace('<a href="/calculators">Calculators</a>','<a href="/">Calculators</a>')
# Add proper breadcrumb inside main; replace old JSON-LD breadcrumb script with correct URL
# The existing breadcrumb script has same root URL for both items.
t=t.replace('<a class="brand" href="/">Material<span>Yardage</span></a>','<a class="brand" href="/">Material<span>Yardage</span></a>')
# Add visible breadcrumb before first section
needle='<main class="wrap" id="main-content">\n'
t=t.replace(needle, needle+'<nav aria-label="Breadcrumb" class="crumbs"><a href="/">Home</a> / Topsoil Calculator</nav>\n',1)
# ensure visible nav doesn't claim calculator page is root through breadcrumb JSON
# Update homepage-related og/twitter URL only
p.write_text(t)

# Update every page's Calculators nav/footer link from /calculators to /
for f in root.rglob('*.html'):
    txt=f.read_text()
    txt=txt.replace('<a href="/calculators">Calculators</a>', '<a href="/">Calculators</a>')
    txt=txt.replace('<a aria-current="page" href="/calculators">Calculators</a>', '<a aria-current="page" href="/">Calculators</a>')
    f.write_text(txt)

# Update calculators.html to become a compatibility page with canonical root? It will be redirected by Vercel.
# Keep source content intact except its links should point to root and topsoil dedicated URL.
c=root/'calculators.html'
ct=c.read_text().replace('<a href="/"><strong>Topsoil Calculator</strong>', '<a href="/topsoil-calculator"><strong>Topsoil Calculator</strong>')
ct=ct.replace('<a href="/calculators">Calculators</a>', '<a href="/">Calculators</a>')
c.write_text(ct)

# Sitemap: replace calculators URL with dedicated topsoil URL, preserving 38 URLs.
sm=root/'sitemap.xml'
st=sm.read_text()
st=st.replace('  <url><loc>https://www.materialyardage.com/calculators</loc></url>\n','')
st=st.replace('  <url><loc>https://www.materialyardage.com/methodology</loc></url>','  <url><loc>https://www.materialyardage.com/methodology</loc></url>\n  <url><loc>https://www.materialyardage.com/topsoil-calculator</loc></url>')
sm.write_text(st)

# Vercel: redirect old /calculators URL to root; add topsoil clean URL rewrite.
vp=root/'vercel.json'
v=json.loads(vp.read_text())
v['redirects']=[
    {"source":"/calculators","destination":"/","permanent":True},
    {"source":"/calculators.html","destination":"/","permanent":True}
]
# Add topsoil rewrite at beginning
rw=v['rewrites']
if not any(x.get('source')=='/topsoil-calculator' for x in rw):
    rw.insert(0,{"source":"/topsoil-calculator","destination":"/topsoil-calculator.html"})
vp.write_text(json.dumps(v,indent=2)+"\n")
