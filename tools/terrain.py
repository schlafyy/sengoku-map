"""Colours the land by height for the landmarks view, the way a physical atlas does, in bands of Japanese dye colours, shaded
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
# height bands, each one flat dye as in a stencil-dyed map: moegi plains, hiwa and kariyasu hills, kaki-shibu uplands,
# kurumi mountains, bare cotton on the high peaks. (lower edge in metres, colour)
BANDS = [(-1e9, "#9fb26e"), (100, "#b6bb73"), (400, "#d0bf7c"), (900, "#c49a68"), (1600, "#9d7c5a"), (2150, "#e8e0cf")]
SHADE = .6  # how much of the relief's light and shadow to keep


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


def bands(h):
    edges = np.array([b[0] for b in BANDS[1:]], np.float32)
    cs = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for _, c in BANDS], np.float32)
    return cs[np.digitize(h, edges)]


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
    for _ in range(2):  # soften the heights a little so the band edges run smooth instead of in stair-steps
        p = np.pad(h, 2, mode="edge")
        h = sum(p[i:i + h.shape[0], j:j + h.shape[1]] for i in range(5) for j in range(5)) / 25
    # the relief's level ground is 185: darker than that is shadow, lighter is a lit slope
    k = (1 + (np.clip(shade / 185, .45, 1.3) - 1) * SHADE)[..., None]
    c = bands(h)
    out = np.where(k < 1, c * k, c + (255 - c) * (k - 1) * 1.2)
    path = os.path.join(ROOT, "images", "terrain.jpg")
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(path, "JPEG", quality=84, optimize=True, progressive=True)
    print("wrote", path, f"{W}x{H}", os.path.getsize(path) // 1024, "KB; highest", int(h.max()), "m")


if __name__ == "__main__":
    main(sys.argv[1])
