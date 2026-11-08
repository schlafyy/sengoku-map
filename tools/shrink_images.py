"""Turns the fetched pictures into JPEGs at most 640 px wide (PNGs on the cream mount colour), and updates
data/images.js. Run after tools/fetch_images.py: python tools/shrink_images.py"""
import json, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
DROP = {"clan:satake"}  # a head-viewing ceremony: not a picture to open a clan's story with

js = open("data/images.js", encoding="utf8").read()
data = json.loads(js[js.index("{"):js.rindex("}") + 1])
for k in DROP:
    data.pop(k, None)
keep = {"relief.jpg"}  # made by tools/relief.py, not listed in images.js
for v in data.values():
    im = Image.open(v["src"])
    if v["src"].endswith(".jpg") and im.width <= 640:
        # already small: re-saving would lose quality and the embedded origin
        v["w"], v["h"] = im.width, im.height
        keep.add(os.path.basename(v["src"]))
        continue
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (233, 224, 204))
        bg.paste(im, mask=im.split()[3])
        im = bg
    else:
        im = im.convert("RGB")
    if im.width > 640:
        im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
    out = os.path.splitext(v["src"])[0] + ".jpg"
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    v["src"], v["w"], v["h"] = out.replace(os.sep, "/"), im.width, im.height
    keep.add(os.path.basename(out))
for f in os.listdir("images"):
    if f not in keep:
        os.remove(os.path.join("images", f))
head = js[:js.index("const IMAGES")]
open("data/images.js", "w", encoding="utf8").write(head + "const IMAGES = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
print(len(data), "images")
