"""Fetches Wikipedia's summaries for every event, clan and person in data/history.js, for fact-checking.
Writes tools/wiki_check.json and prints a digest. Run: python tools/wiki_check.py"""
import json, os, re, subprocess, time, urllib.parse, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
UA = {"User-Agent": "SengokuMap/0.1 (personal history map; fact-checking)"}
API = "https://en.wikipedia.org/w/api.php"

# search terms where the event's own name isn't the article title
EVENT_TITLES = {
    "kamigoryo": "Ōnin War", "kaga": "Kaga Rebellion", "meio": "Meiō incident", "izu": "Hōjō Sōun",
    "kawagoe": "Siege of Kawagoe Castle (1545)", "taineiji": "Tainei-ji incident", "itsukushima": "Battle of Itsukushima",
    "okehazama": "Battle of Okehazama", "kawanakajima": "Battles of Kawanakajima", "konodai": "Battle of Kōnodai (1564)",
    "gassantoda": "Siege of Gassantoda Castle (1565)", "inabayama": "Siege of Inabayama Castle", "kyoto1568": "Ashikaga Yoshiaki",
    "anegawa": "Battle of Anegawa", "honganji": "Ishiyama Hongan-ji War", "hiei": "Siege of Mount Hiei",
    "mikatagahara": "Battle of Mikatagahara", "end_muromachi": "Ashikaga Yoshiaki", "nagashino": "Battle of Nagashino",
    "tedorigawa": "Battle of Tedorigawa", "mimigawa": "Battle of Mimigawa", "tottori": "Siege of Tottori",
    "tenmokuzan": "Battle of Tenmokuzan", "honnoji": "Honnō-ji Incident", "yamazaki": "Battle of Yamazaki",
    "shizugatake": "Battle of Shizugatake", "komaki": "Battle of Komaki and Nagakute", "okitanawate": "Battle of Okitanawate",
    "shikoku": "Invasion of Shikoku (1585)", "kyushu": "Kyūshū Campaign", "suriagehara": "Battle of Suriagehara",
    "odawara": "Siege of Odawara (1590)", "korea": "Japanese invasions of Korea (1592–1598)",
    "hideyoshi_dies": "Toyotomi Hideyoshi", "sekigahara": "Battle of Sekigahara", "shogun": "Tokugawa shogunate",
}
CLAN_TITLES = {"wtakeda": "Wakasa-Takeda clan", "ikko": "Ikkō-ikki", "hojo": "Late Hōjō clan", "east": None, "west": None,
               "tozama": "Tozama daimyō", "ashikaga": "Ashikaga shogunate", "takeda": "Takeda clan", "uesugi": "Uesugi clan"}


def get(params):
    url = API + "?" + urllib.parse.urlencode({"format": "json", "formatversion": 2, **params})
    for attempt in range(6):
        time.sleep(1.5)  # Wikipedia answers 429 to anything faster
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.load(r)
        except Exception:
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(url)


def extracts(titles, sentences=None):
    """{asked title: (resolved title, text)} in batches of 20."""
    out = {}
    for i in range(0, len(titles), 20):
        batch = titles[i:i + 20]
        params = {"action": "query", "prop": "extracts", "explaintext": 1, "redirects": 1, "titles": "|".join(batch)}
        params.update({"exsentences": sentences} if sentences else {"exintro": 1})
        d = get(params)["query"]
        alias = {n["from"]: n["to"] for n in d.get("normalized", []) + d.get("redirects", [])}
        pages = {p["title"]: p.get("extract", "") for p in d["pages"] if not p.get("missing")}
        for t in batch:
            r = alias.get(alias.get(t, t), alias.get(t, t))
            if r in pages:
                out[t] = (r, pages[r])
        time.sleep(0.5)
    return out


def search(term):
    try:
        d = get({"action": "query", "list": "search", "srsearch": term, "srlimit": 1})
    except RuntimeError:
        return None
    hits = d["query"]["search"]
    return hits[0]["title"] if hits else None


def load_history():
    js = "const fs=require('fs'),vm=require('vm'),c={};vm.createContext(c);vm.runInContext(fs.readFileSync('data/history.js','utf8'),c);" \
         "console.log(vm.runInContext('JSON.stringify({CLANS,EVENTS})',c))"
    return json.loads(subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, encoding="utf8").stdout)


def main():
    h = load_history()
    ev_titles = [EVENT_TITLES.get(e["id"], e["en"]) for e in h["EVENTS"]]
    clan_titles = [CLAN_TITLES.get(k, f"{c['en']} clan") for k, c in h["CLANS"].items()]
    people = sorted({p[0].split(" (")[0] for c in h["CLANS"].values() for p in c["people"]})
    res = {"events": extracts(ev_titles), "clans": extracts([t for t in clan_titles if t]), "people": extracts(people, 2)}
    for group, titles in (("events", ev_titles), ("clans", [t for t in clan_titles if t]), ("people", people)):
        for t in titles:  # not found under that name: take the search's best match
            if t not in res[group]:
                s = search(t)
                if s:
                    res[group].update({t: v for v in extracts([s], 2 if group == "people" else None).values()})
    json.dump(res, open(os.path.join(ROOT, "tools", "wiki_check.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
    for group, limit in (("events", 1100), ("clans", 700), ("people", 260)):
        print(f"\n===== {group} =====")
        for asked, (title, text) in res[group].items():
            print(f"\n## {asked} -> {title}\n" + re.sub(r"\s+", " ", text)[:limit])
    missing = [t for g, ts in (("events", ev_titles), ("people", people)) for t in ts if t not in res[g]]
    print("\nNOT FOUND:", missing)


if __name__ == "__main__":
    main()
