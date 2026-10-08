from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import re, json, xml.etree.ElementTree as ET
root=Path('/mnt/data/my29')
htmls=list(root.rglob('*.html'))
errors=[]
# JSON-LD
for f in htmls:
    s=f.read_text(errors='ignore')
    for m in re.finditer(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',s,re.S|re.I):
        try: json.loads(m.group(1))
        except Exception as e: errors.append((f,'JSON-LD',str(e)))
# sitemap
sm=(root/'sitemap.xml').read_text()
urls=re.findall(r'<loc>(.*?)</loc>',sm)
# canonical map
cans=[]
for f in htmls:
    s=f.read_text(errors='ignore')
    m=re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)',s,re.I)
    if not m:
        # alternate attr order
        m=re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']',s,re.I)
    if m: cans.append((f,m.group(1)))
# JS files basic bracket syntax not possible; just check files exist
print('HTML files:',len(htmls))
print('Sitemap URLs:',len(urls))
print('JSON-LD errors:',len(errors))
print('Canonical tags:',len(cans))
print('Root canonical:',dict(cans).get(root/'index.html'))
print('Topsoil canonical:',dict(cans).get(root/'topsoil-calculator.html'))
print('Sitemap contains root:', 'https://www.materialyardage.com/' in urls)
print('Sitemap contains calculators:', 'https://www.materialyardage.com/calculators' in urls)
print('Sitemap contains topsoil:', 'https://www.materialyardage.com/topsoil-calculator' in urls)
print('Old /calculators hrefs:',sum(f.read_text(errors='ignore').count('href="/calculators"') for f in htmls))
print('Legacy calculator path references:',sum(f.read_text(errors='ignore').count('/calculators') for f in htmls))
if errors:
    print(errors[:10])
