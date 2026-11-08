"""Adds a photo for each castle in data/places.js and each landmark in data/landmarks.js (its Wikipedia article's lead
image, public domain or Creative Commons only) to images/ and data/images.js. Then run tools/shrink_images.py.
Run: python tools/fetch_castle_images.py"""
import json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_images import page_images, file_info, download, OK_LICENCE

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PATH = os.path.join(ROOT, "data", "images.js")


def save(text, images):  # after every picture, so a throttled run keeps what it got
    head = text[:text.index("const IMAGES")]
    open(PATH, "w", encoding="utf8").write(head + "const IMAGES = " + json.dumps(images, ensure_ascii=False, indent=1) + ";\n")


def fetch(src, name, prefix):
    js = ("const fs=require('fs'),vm=require('vm'),c={};vm.createContext(c);"
          f"vm.runInContext(fs.readFileSync('data/{src}','utf8'),c);console.log(vm.runInContext('JSON.stringify({name})',c))")
    places = json.loads(subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, encoding="utf8").stdout)
    text = open(PATH, encoding="utf8").read()
    images = json.loads(text[text.index("{"):text.rindex("}") + 1])
    want = {c["id"]: c["wiki"] for c in places if c.get("wiki") and prefix + ":" + c["id"] not in images}
    chosen = {c["id"]: c["file"] for c in places if c.get("file")}  # a Commons file picked by hand, where the article's lead image is wrong
    files = page_images(sorted(set(want.values())))
    for cid, title in want.items():
        name = chosen.get(cid) or files.get(title)
        if not name or name.lower().endswith((".svg", ".gif")):
            print("skip", prefix, cid, name or "no image", flush=True)
            continue
        info = file_info(name)
        if not info or not OK_LICENCE.match(info["licence"]):
            print("skip", prefix, cid, name, info and info["licence"], flush=True)
            continue
        local = prefix + "_" + cid + os.path.splitext(name)[1].lower().replace(".jpeg", ".jpg")
        if download(info["thumb"], os.path.join(ROOT, "images", local)):
            images[prefix + ":" + cid] = {"src": "images/" + local, "file": name, "page": info["page"], "licence": info["licence"],
                                          "artist": info["artist"], "w": info["w"], "h": info["h"], "desc": info["desc"]}
            save(text, images)
            print("ok  ", prefix, cid, "<-", name, "|", info["licence"], flush=True)


def main():
    sys.stdout.reconfigure(encoding="utf8")  # file names with macrons, when the log is redirected on Windows
    for src, name, prefix in (("places.js", "CASTLES", "castle"), ("landmarks.js", "LANDMARKS", "landmark")):
        fetch(src, name, prefix)


if __name__ == "__main__":
    main()
