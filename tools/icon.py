"""Renders icon.png (256 px) and icon.ico for the exe from an SVG drawn in the app's own world:
indigo cloth, a disc dyed in two clans' colours as kasuri stripes, and a sashiko ring.
Run: python tools/icon.py"""
import os
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
<defs>
  <radialGradient id="g" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#2a3170"/><stop offset="1" stop-color="#13152f"/></radialGradient>
  <pattern id="k" patternUnits="userSpaceOnUse" width="44" height="44" patternTransform="rotate(38)">
    <rect width="22" height="44" fill="#dc9a2a"/><rect x="22" width="22" height="44" fill="#3d7a58"/>
  </pattern>
  <clipPath id="c"><rect width="256" height="256" rx="52"/></clipPath>
</defs>
<g clip-path="url(#c)">
  <rect width="256" height="256" fill="url(#g)"/>
  <circle cx="128" cy="128" r="74" fill="url(#k)"/>
  <circle cx="128" cy="128" r="94" fill="none" stroke="#efe6d3" stroke-width="7" stroke-dasharray="17 12" stroke-linecap="round"/>
</g></svg>"""

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": 256, "height": 256})
    pg.set_content(f"<body style='margin:0;background:transparent'>{SVG}</body>")
    pg.locator("svg").screenshot(path=os.path.join(ROOT, "icon.png"), omit_background=True)
    # the phone's Home Screen icons: square and full-bleed (the phone rounds the corners itself), drawn at 512
    pg = b.new_page(viewport={"width": 256, "height": 256}, device_scale_factor=2)
    square = SVG.replace(' rx="52"', '')
    pg.set_content(f"<body style='margin:0'>{square}</body>")
    pg.locator("svg").screenshot(path=os.path.join(ROOT, "icon-512.png"))
    b.close()
img = Image.open(os.path.join(ROOT, "icon.png"))
img.save(os.path.join(ROOT, "icon.ico"), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
Image.open(os.path.join(ROOT, "icon-512.png")).convert("RGB").resize((180, 180), Image.LANCZOS).save(os.path.join(ROOT, "icon-180.png"))
print("icon.png, icon.ico, icon-512.png, icon-180.png")
