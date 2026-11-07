"""Screenshots of the app in headless Chrome: python tools/shots.py <out dir> [width height]"""
import functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = sys.argv[1]
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1360, 860)
os.makedirs(out, exist_ok=True)
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{srv.server_address[1]}/index.html"

with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: m.type == "error" and errors.append(m.text))
    pg.goto(url)
    pg.wait_for_timeout(1200)
    pg.screenshot(path=f"{out}/1467.png")

    def year(y):  # through the slider's keyboard, like a user
        pg.focus("#loom")
        pg.keyboard.press("Home")
        for _ in range(y - 1467):
            pg.keyboard.press("ArrowRight")
        pg.wait_for_timeout(1500)
    year(1560)
    pg.screenshot(path=f"{out}/1560.png")
    pg.keyboard.press("PageUp"); pg.keyboard.press("PageUp"); pg.wait_for_timeout(300)
    for _ in range(2):
        pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=f"{out}/1582.png")
    pg.click(".roster button")  # the top clan
    pg.wait_for_timeout(300)
    pg.click(".more")
    pg.wait_for_timeout(300)
    pg.screenshot(path=f"{out}/clan.png")
    pg.click(".battle")
    pg.wait_for_timeout(400)
    pg.screenshot(path=f"{out}/event.png")
    pg.click(".back")
    pg.focus("#loom")
    for _ in range(18):
        pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=f"{out}/1600.png")
    box = pg.eval_on_selector('.prov[data-p="owari"]', "g => { const r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }")
    pg.mouse.move(*box); pg.wait_for_timeout(200)
    pg.mouse.click(*box); pg.wait_for_timeout(400)
    pg.screenshot(path=f"{out}/province.png")
    # play: the soak and the flash, mid-animation
    pg.keyboard.press("Escape")
    pg.focus("#loom"); pg.keyboard.press("Home")
    for _ in range(1559 - 1467):
        pg.keyboard.press("ArrowRight")
    pg.click("#play")
    pg.wait_for_timeout(1150)
    pg.screenshot(path=f"{out}/play-soak.png")
    pg.click("#play")
    pg.focus("#loom"); pg.keyboard.press("Home")
    for _ in range(1567 - 1467):
        pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(1500)
    pg.keyboard.press("ArrowRight")  # 1568: Nobunaga marches on Kyoto, six provinces change hands
    pg.wait_for_timeout(400)
    pg.screenshot(path=f"{out}/mid-soak.png")
    pg.wait_for_timeout(1500)
    # following a life: Nobunaga in 1575, the year of Nagashino
    pg.keyboard.press("Escape")
    pg.focus("#loom"); pg.keyboard.press("Home")
    for _ in range(1575 - 1467):
        pg.keyboard.press("ArrowRight")
    pg.wait_for_timeout(1200)
    pg.click('.lives button[data-follow="nobunaga"]')
    pg.wait_for_timeout(1000)
    pg.screenshot(path=f"{out}/follow.png")
    pg.click('.back[data-act="unfollow"]')
    pg.wait_for_timeout(300)
    # a castle's story
    pg.click('.castle[data-c="odawara"]')
    pg.wait_for_timeout(700)
    pg.screenshot(path=f"{out}/castle.png")
    # later years: jump by clicking the band where the year sits
    pg.keyboard.press("Escape")
    def jump(y):
        x = pg.evaluate(f"(() => {{ const r = document.querySelector('#weave').getBoundingClientRect(); const h = document.querySelector('#head'); return null; }})()")
        pg.focus("#loom"); pg.keyboard.press("End")
        for _ in range(1945 - y):
            pg.keyboard.press("ArrowLeft")
        pg.wait_for_timeout(1300)
    jump(1868); pg.screenshot(path=f"{out}/1868.png")
    jump(1945); pg.screenshot(path=f"{out}/1945.png")
    # zoom into the Kinai, around Kyoto, in 1582
    jump(1582)
    box = pg.eval_on_selector('.prov[data-p="yamashiro"]', "g => { const r = g.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }")
    for _ in range(6):
        pg.mouse.move(*box); pg.mouse.wheel(0, -300); pg.wait_for_timeout(120)
    pg.wait_for_timeout(800)
    pg.screenshot(path=f"{out}/zoom.png")
    print("errors:", errors or "none")
    b.close()
