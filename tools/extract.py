"""Match each province label in the Commons SVG to the shape under it; dump shapes with flattened transforms."""
import json, os, sys
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": 1600, "height": 1700})
    pg.goto("file:///" + HERE.replace("\\", "/") + "/named.svg")
    out = pg.evaluate("""() => {
      const svg = document.querySelector('svg');
      const paths = [...document.querySelectorAll('path')].filter(p => {
        const f = getComputedStyle(p).fill; return f && f !== 'none';
      });
      const info = paths.map((p, i) => {
        const m = p.getCTM(), bb = p.getBBox();
        const pt = svg.createSVGPoint(); pt.x = bb.x + bb.width / 2; pt.y = bb.y + bb.height / 2;
        const c = pt.matrixTransform(m);
        return { i, id: p.id, parent: p.parentNode.id, fill: getComputedStyle(p).fill, stroke: getComputedStyle(p).stroke,
                 d: p.getAttribute('d'), m: [m.a, m.b, m.c, m.d, m.e, m.f], cx: c.x, cy: c.y, w: bb.width * m.a, h: bb.height * m.d };
      });
      const labels = [...document.querySelectorAll('text')].map(t => {
        const bb = t.getBBox(), m = t.getCTM(), pt = svg.createSVGPoint();
        pt.x = bb.x + bb.width / 2; pt.y = bb.y + bb.height / 2;
        const c = pt.matrixTransform(m);
        // which filled path contains the label's centre (in that path's own coordinates)
        const hits = paths.filter(p => { const q = c.matrixTransform(p.getCTM().inverse()); const sp = svg.createSVGPoint(); sp.x = q.x; sp.y = q.y; return p.isPointInFill(sp); }).map(p => paths.indexOf(p));
        return { text: t.textContent.trim(), x: c.x, y: c.y, hits };
      });
      return { info, labels };
    }""")
    b.close()
json.dump(out, open(os.path.join(HERE, "raw.json"), "w", encoding="utf8"), ensure_ascii=False)
for l in out["labels"]:
    print(l["text"], [ (h, out["info"][h]["fill"], out["info"][h]["parent"]) for h in l["hits"]])
print("filled paths:", len(out["info"]))
