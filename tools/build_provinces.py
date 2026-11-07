"""Builds data/provinces.js from the Commons map "Provinces of Japan with names.svg" (Ash_Crow, CC BY 2.5).

Input: raw.json from tools/extract.py (every filled shape with its transform, every label with the shapes under it).
Labels that sit off their shape (leader lines) and the unlabelled islands are placed by hand below, checked
against their neighbours' positions. Run: python tools/build_provinces.py <raw.json>
"""
import json, sys, os

# label as printed on the map -> (id, romanized name, kanji); fixes the map's typos (Kasuza, Wasaka, Ibana...)
PROVINCES = {
    "Mutsu": ("mutsu", "Mutsu", "陸奥"), "Dewa": ("dewa", "Dewa", "出羽"), "Sado": ("sado", "Sado", "佐渡"),
    "Echigo": ("echigo", "Echigo", "越後"), "Noto": ("noto", "Noto", "能登"), "Shimotsuke": ("shimotsuke", "Shimotsuke", "下野"),
    "Hitachi": ("hitachi", "Hitachi", "常陸"), "Shimofusa": ("shimosa", "Shimōsa", "下総"), "Kasuza": ("kazusa", "Kazusa", "上総"),
    "Kōzuke": ("kozuke", "Kōzuke", "上野"), "Musashi": ("musashi", "Musashi", "武蔵"), "Etchū": ("etchu", "Etchū", "越中"),
    "Shinano": ("shinano", "Shinano", "信濃"), "Kai": ("kai", "Kai", "甲斐"), "Izu": ("izu", "Izu", "伊豆"),
    "Sagami": ("sagami", "Sagami", "相模"), "Suruga": ("suruga", "Suruga", "駿河"), "Tōtomi": ("totomi", "Tōtōmi", "遠江"),
    "Kaga": ("kaga", "Kaga", "加賀"), "Hida": ("hida", "Hida", "飛騨"), "Echizen": ("echizen", "Echizen", "越前"),
    "Mino": ("mino", "Mino", "美濃"), "Mikawa": ("mikawa", "Mikawa", "三河"), "Owari": ("owari", "Owari", "尾張"),
    "Shima": ("shima", "Shima", "志摩"), "Iga": ("iga", "Iga", "伊賀"), "Ise": ("ise", "Ise", "伊勢"),
    "Yamato": ("yamato", "Yamato", "大和"), "Kii": ("kii", "Kii", "紀伊"), "Ōmi": ("omi", "Ōmi", "近江"),
    "Kawa": ("kawachi", "Kawachi", "河内"), "Izumi": ("izumi", "Izumi", "和泉"), "Yamashiro": ("yamashiro", "Yamashiro", "山城"),
    "Wasaka": ("wakasa", "Wakasa", "若狭"), "Settsu": ("settsu", "Settsu", "摂津"), "Tanba": ("tanba", "Tanba", "丹波"),
    "Tango": ("tango", "Tango", "丹後"), "Tajima": ("tajima", "Tajima", "但馬"), "Harima": ("harima", "Harima", "播磨"),
    "Ibana": ("inaba", "Inaba", "因幡"), "Hōki": ("hoki", "Hōki", "伯耆"), "Oki": ("oki", "Oki", "隠岐"),
    "Mimakasa": ("mimasaka", "Mimasaka", "美作"), "Bizen": ("bizen", "Bizen", "備前"), "Awaji": ("awaji", "Awaji", "淡路"),
    "Bitchū": ("bitchu", "Bitchū", "備中"), "Sanuki": ("sanuki", "Sanuki", "讃岐"), "Bingo": ("bingo", "Bingo", "備後"),
    "Izumo": ("izumo", "Izumo", "出雲"), "Iwami": ("iwami", "Iwami", "石見"), "Aki": ("aki", "Aki", "安芸"),
    "Suwo": ("suo", "Suō", "周防"), "Nagato": ("nagato", "Nagato", "長門"), "Iyo": ("iyo", "Iyo", "伊予"),
    "Tosa": ("tosa", "Tosa", "土佐"), "Buzen": ("buzen", "Buzen", "豊前"), "Bungo": ("bungo", "Bungo", "豊後"),
    "Chizuken": ("chikuzen", "Chikuzen", "筑前"), "Hizen": ("hizen", "Hizen", "肥前"), "Chikugo": ("chikugo", "Chikugo", "筑後"),
    "Higo": ("higo", "Higo", "肥後"), "Hyūga": ("hyuga", "Hyūga", "日向"), "Ōsumi": ("osumi", "Ōsumi", "大隅"),
    "Satsuma": ("satsuma", "Satsuma", "薩摩"),
    "Iki": ("iki", "Iki", "壱岐"), "Tsushima": ("tsushima", "Tsushima", "対馬"),
}
# two provinces called Awa: the map's first "Awa" label is the Bōsō one, the second the Shikoku one
AWA = [("awa_boso", "Awa", "安房"), ("awa_shikoku", "Awa", "阿波")]
# shapes whose label sits off them, and the unlabelled islands: shape index -> label (positions checked by hand)
BY_HAND = {9: "Chikugo", 19: "Iki", 20: "Tsushima", 21: "Tsushima", 32: "Bitchū", 39: "Oki", 40: "Oki",
           46: "Izumi", 48: "Yamashiro", 49: "Kawa", 50: "Wasaka", 59: "Shima"}
LAND_FILL = "rgb(252, 245, 227)"
WATER_FILL = "rgb(218, 240, 253)"


def main(raw_path, out_path):
    raw = json.load(open(raw_path, encoding="utf8"))
    info, own, awa = raw["info"], {}, iter(AWA)
    for lab in raw["labels"]:
        for h in lab["hits"]:
            own[h] = next(awa) if lab["text"] == "Awa" else lab["text"]
    for i, name in BY_HAND.items():
        assert i not in own, (i, own.get(i))
        own[i] = name
    groups = {info[i]["parent"]: own[i] for i in own if info[i]["parent"] != "layer1"}  # islands drawn in a province's group
    provinces, ezo, lakes = {}, [], []
    for i, p in enumerate(info):
        shape = {"d": p["d"], "m": [round(v, 5) for v in p["m"]]}
        if p["w"] < 0.5 or p["fill"] not in (LAND_FILL, WATER_FILL):
            continue  # the scale bar's dot and empty shapes
        if p["fill"] == WATER_FILL:
            lakes.append(shape)
            continue
        name = own.get(i) or groups.get(p["parent"])
        if name == "Ezo" or (name is None and p["cy"] < 300):  # Hokkaido and its islands: not part of the realm yet
            ezo.append(shape)
            continue
        assert name, f"unassigned shape {i} at {p['cx']:.0f},{p['cy']:.0f}"
        pid, en, ja = name if isinstance(name, tuple) else PROVINCES[name]
        prov = provinces.setdefault(pid, {"en": en, "ja": ja, "shapes": [], "cx": 0, "cy": 0, "area": 0})
        prov["shapes"].append(shape)
        a = p["w"] * p["h"]  # label point: the biggest shape's centre
        if a > prov["area"]:
            prov.update(cx=round(p["cx"], 1), cy=round(p["cy"], 1), area=a)
    for prov in provinces.values():
        del prov["area"]
    assert len(provinces) == 68, sorted(provinces)
    data = {"source": "Provinces of Japan with names.svg by Ash_Crow, Wikimedia Commons, CC BY 2.5",
            "provinces": provinces, "ezo": ezo, "lakes": lakes}
    with open(out_path, "w", encoding="utf8") as f:
        f.write("// Generated by tools/build_provinces.py: don't edit by hand.\n")
        f.write("// Province shapes: " + data["source"] + "\n")
        f.write("const GEO = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(len(provinces), "provinces,", len(ezo), "Ezo shapes,", len(lakes), "lakes ->", out_path)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1], os.path.join(here, "..", "data", "provinces.js"))
