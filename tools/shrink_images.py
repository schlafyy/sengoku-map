"""Turns the fetched pictures into JPEGs at most WIDTH px wide (PNGs on the cream mount colour), and updates
data/images.js. Run after tools/fetch_images.py: python tools/shrink_images.py"""
import json, os
from PIL import Image

WIDTH = 1280  # as in fetch_images.py

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
DROP = {"clan:satake",  # a head-viewing ceremony: not a picture to open a clan's story with
        "event:uedahara"}  # the article's lead picture is a modern railway platform


def stamp(path, v):
    """Writes where the picture came from into the JPEG's comment, without re-encoding, unless it is there already."""
    b = open(path, "rb").read()
    if b"origin: Wikimedia Commons" in b:  # Pillow shows only the last comment; some files carry their own too
        return
    c = (f"impeccable:prompt\0origin: Wikimedia Commons file {v['file']} by {v['artist']}, {v['licence']}, {v['page']} "
         f"(resized to {v['w']} px)").encode("utf8")[:65000]
    open(path, "wb").write(b[:2] + b"\xff\xfe" + (len(c) + 2).to_bytes(2, "big") + c + b[2:])  # a COM segment right after SOI


js = open("data/images.js", encoding="utf8").read()
data = json.loads(js[js.index("{"):js.rindex("}") + 1])
for k in DROP:
    data.pop(k, None)
keep = {"relief.jpg", "terrain.jpg"}  # made by tools/relief.py and tools/terrain.py, not listed in images.js
for v in data.values():
    im = Image.open(v["src"])
    if v["src"].endswith(".jpg") and im.width <= WIDTH:
        # already small: re-saving would lose quality and the embedded origin
        v["w"], v["h"] = im.width, im.height
        keep.add(os.path.basename(v["src"]))
        stamp(v["src"], v)
        continue
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (233, 224, 204))
        bg.paste(im, mask=im.split()[3])
        im = bg
    else:
        im = im.convert("RGB")
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    out = os.path.splitext(v["src"])[0] + ".jpg"
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    v["src"], v["w"], v["h"] = out.replace(os.sep, "/"), im.width, im.height
    keep.add(os.path.basename(out))
    stamp(out, v)
for f in os.listdir("images"):
    if f not in keep:
        os.remove(os.path.join("images", f))
head = js[:js.index("const IMAGES")]
open("data/images.js", "w", encoding="utf8").write(head + "const IMAGES = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
print(len(data), "images")
