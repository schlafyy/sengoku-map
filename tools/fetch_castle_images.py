"""Adds a photo for each castle in data/places.js (its Wikipedia article's lead image, public domain or Creative
Commons only) to images/ and data/images.js. Then run tools/shrink_images.py. Run: python tools/fetch_castle_images.py"""
import json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_images import page_images, file_info, download, OK_LICENCE

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def main():
    js = "const fs=require('fs'),vm=require('vm'),c={};vm.createContext(c);vm.runInContext(fs.readFileSync('data/places.js','utf8'),c);" \
         "console.log(vm.runInContext('JSON.stringify(CASTLES)',c))"
    castles = json.loads(subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, encoding="utf8").stdout)
    path = os.path.join(ROOT, "data", "images.js")
    text = open(path, encoding="utf8").read()
    images = json.loads(text[text.index("{"):text.rindex("}") + 1])
    want = {c["id"]: c["wiki"] for c in castles if c["wiki"] and "castle:" + c["id"] not in images}
    files = page_images(sorted(set(want.values())))
    for cid, title in want.items():
        name = files.get(title)
        if not name or name.lower().endswith((".svg", ".gif")):
            print("skip", cid, name or "no image")
            continue
        info = file_info(name)
        if not info or not OK_LICENCE.match(info["licence"]):
            print("skip", cid, name, info and info["licence"])
            continue
        local = "castle_" + cid + os.path.splitext(name)[1].lower().replace(".jpeg", ".jpg")
        if download(info["thumb"], os.path.join(ROOT, "images", local)):
            images["castle:" + cid] = {"src": "images/" + local, "file": name, "page": info["page"], "licence": info["licence"],
                                       "artist": info["artist"], "w": info["w"], "h": info["h"], "desc": info["desc"]}
            print("ok  ", cid, "<-", name, "|", info["licence"])
    head = text[:text.index("const IMAGES")]
    open(path, "w", encoding="utf8").write(head + "const IMAGES = " + json.dumps(images, ensure_ascii=False, indent=1) + ";\n")


if __name__ == "__main__":
    main()
