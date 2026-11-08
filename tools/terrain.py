"""Colours the land by height for the landmarks view, the way a physical atlas does, in Japanese dye colours, shaded
with images/relief.jpg. Heights come from the open Terrain Tiles on AWS (Mapzen's Terrarium tiles: SRTM, GMTED2010,
ETOPO1 and other public data), downloaded once into a cache folder.
Writes images/terrain.jpg on the same grid as the relief (data/relief.js gives its placement).
Run: python tools/terrain.py <cache folder>"""
import io, json, math, os, sys, time, urllib.request
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
Z = 7  # about 100 px per degree, a little finer than the map needs
TILE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
LON0, LON1, LAT0, LAT1 = 126.0, 148.0, 29.0, 47.0
# height (m) -> colour: moegi lowlands, hiwa and kariyasu hills, ōdo uplands, kurumi and nibi mountains, snow at the top
RAMP = [(0, "#9db26c"), (150, "#b3bd74"), (400, "#cbc17e"), (800, "#d2b77c"), (1300, "#bf9a66"),
        (1900, "#9a7a58"), (2500, "#8a7d72"), (3000, "#d9d2c4"), (3800, "#f3eee4")]


def tile_xy(lon, lat):
    n = 2 ** Z
    return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n


def mosaic(cache):
    os.makedirs(cache, exist_ok=True)
    (x0, y0), (x1, y1) = tile_xy(LON0, LAT1), tile_xy(LON1, LAT0)
    xs, ys = range(int(x0), int(x1) + 1), range(int(y0), int(y1) + 1)
    out = np.zeros((len(ys) * 256, len(xs) * 256), np.float32)
    for a, x in enumerate(xs):
        for b, y in enumerate(ys):
            path = os.path.join(cache, f"{Z}-{x}-{y}.png")
            if not os.path.exists(path):
                req = urllib.request.Request(TILE.format(z=Z, x=x, y=y), headers={"User-Agent": "SengokuMap/1.0 (personal project)"})
                open(path, "wb").write(urllib.request.urlopen(req, timeout=60).read())
                time.sleep(.2)
            px = np.asarray(Image.open(path).convert("RGB"), np.float32)
            out[b * 256:(b + 1) * 256, a * 256:(a + 1) * 256] = px[..., 0] * 256 + px[..., 1] + px[..., 2] / 256 - 32768
    return out, xs[0], ys[0]


def ramp(h):
    hs = np.array([r[0] for r in RAMP], np.float32)
    cs = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for _, c in RAMP], np.float32)
    return np.stack([np.interp(h, hs, cs[:, k]) for k in range(3)], -1)


def main(cache):
    elev, tx0, ty0 = mosaic(cache)
    js = open(os.path.join(ROOT, "data", "georef.js"), encoding="utf8").read()
    inv = json.loads(js[js.index("{"):js.rindex("}") + 1])["toLonLat"]
    rel = json.loads(open(os.path.join(ROOT, "data", "relief.js"), encoding="utf8").read().split("RELIEF = ")[1].rstrip(";\n"))
    shade = np.asarray(Image.open(os.path.join(ROOT, rel["src"])).convert("L"), np.float32)
    H, W = shade.shape
    xs, ys = np.meshgrid(np.linspace(rel["x"], rel["x"] + rel["width"], W), np.linspace(rel["y"], rel["y"] + rel["height"], H))
    t = np.stack([np.ones_like(xs), xs, ys, xs * ys, xs * xs, ys * ys])
    lon = np.tensordot(inv[0], t, axes=1); lat = np.tensordot(inv[1], t, axes=1)
    n = 2 ** Z
    u = np.clip(((lon + 180) / 360 * n - tx0) * 256, 0, elev.shape[1] - 1).astype(int)
    v = np.clip(((1 - np.arcsinh(np.tan(np.radians(lat))) / np.pi) / 2 * n - ty0) * 256, 0, elev.shape[0] - 1).astype(int)
    h = np.maximum(elev[v, u], 0)
    # the relief's level ground is 185: darker than that is shadow, lighter is a lit slope
    k = np.clip(shade / 185, .45, 1.3)[..., None]
    c = ramp(h)
    out = np.where(k < 1, c * k, c + (255 - c) * (k - 1) * 1.2)
    path = os.path.join(ROOT, "images", "terrain.jpg")
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(path, "JPEG", quality=84, optimize=True, progressive=True)
    print("wrote", path, f"{W}x{H}", os.path.getsize(path) // 1024, "KB; highest", int(h.max()), "m")


if __name__ == "__main__":
    main(sys.argv[1])
