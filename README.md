# Sengoku 戦国

An interactive map of Japan from the Ōnin War (1467) to the end of the Second World War (1945), drawn as a length of indigo-dyed cotton. Each clan is a dye, and when a province changes hands the new dye soaks across it from the conqueror's side. The heart of it is the Sengoku period (1467–1603); the Tokugawa peace, the fall of the shogunate, the Meiji state and the wars to 1945 follow, with the quiet stretches squeezed. Press play to watch it all, or drag the woven band along the bottom.

## Run it

- **Windows app:** `dist\Sengoku.exe` (one file; uses the Edge WebView2 runtime that ships with Windows 11).
- **In a browser:** serve the folder (`python -m http.server`) and open `index.html`.

## Using it

- **Play** runs 1467→1945. It holds on the turning points: Ōnin, Okehazama, Honnō-ji, Odawara, Sekigahara, the black ships, Meiji and 1945. Quiet decades pass in seconds. Space plays and pauses.
- **The woven band:** each year is a column of 68 threads, one per province, in its holder's dye. Busy years get more room than quiet ones. Click or drag anywhere on it to jump. With it focused, ←/→ move a year, PageUp/PageDown ten, Home/End to either end.
- **Zoom:** scroll wheel or pinch, drag to pan, or the buttons at bottom left (+, −, show all). Keys: `+`, `-`, `0`. Close in, each province shows its name.
- **Click a province** to see who held it over the whole period. **Click a clan** in the roster for its story, key people, alliances, battles and crest. **Click a red cross-stitch** for a battle, or a cream knot for another turning point; marks for events abroad sit out at sea in their direction. **Click a stitched square** for a castle, with its photo. Esc closes the story.
- **Landmarks 名所 (the switch at the top right of the map; bottom right on a phone):** the same cloth with the wars and dynasties taken off. The land is coloured by height like an atlas, in flat bands of dye colour with the cloth's weave over them: moegi-green plains, hiwa and kariyasu hills, kaki-shibu uplands, kurumi-brown mountains, bare cotton on the high peaks. The view frames all of Hokkaido. On it sit 13 great cities (◎, named in English and kanji; on a phone some names wait until you zoom in) and 53 landmarks, each kind with its own small stencil: mountains, nature, shrines, temples, castles, gardens, towns, memorials. Click one, or pick it from the list in the panel, for its photo and story (cities also give their population), and for the battles fought in the same province (clicking one takes you back to History at that year). At the full view a mark under a city's name fades back; close in, every mark and province shows its name.
- **Japanese touches:** seigaiha waves printed faintly over the sea, the period's name in vertical kanji beside the year, asanoha (hemp-leaf) pattern on the panel lining, and kanji on the panel headings.
- **Follow a life:** pick one of ten portraits at the top of the panel (Nobunaga, Hideyoshi, Ieyasu, Shingen, Kenshin, Motonari, Masamune, Mitsunari, Yoshinobu, Saigō). The map dims everything that wasn't theirs, the band marks their lifespan, and "Play this life" runs from birth to death.
- **Reading the cloth:**
  - Solid dye: one power held the province.
  - Diagonal kasuri stripes: split between two powers.
  - Undyed, flecked cotton: many small lords.
  - Cream silhouettes on a clan's land: its family crest (kamon).
  - Cream running stitches: alliances.
  - Red cross-stitches: battles. A cream diamond knot: another turning point (a treaty, a fire, an eruption).
  - Stitched squares: castles.
  - In 1600 and 1868 the provinces are dyed by side (Sekigahara; the Boshin War). From 1871 Japan is one state.

## How it's built

| File | What it does |
|---|---|
| `index.html` | Layout and all styles |
| `app.js` | The map (dyes, soak, crests, castles, battles, alliances, labels), zoom and pan, the panel (roster, clan, province, event, castle, person), the band, playback |
| `model.js` | Pure functions: the map for each year, province counts, era names (`node test.js` tests them) |
| `data/history.js` | 1467–1603, written for this app: the clans, the 1467 starting map, changes of hands with notes, battles and turning points, alliances, the 1600 armies |
| `data/modern.js` | 1604–1945, added to the same lists: era names, phases, the band's weights for quiet years, the Boshin War sides, the Empire of Japan, events to 1945, Ezo's status, later castles and lives |
| `data/places.js` | Castles (where, when, a short history) and the lives you can follow |
| `data/landmarks.js` | The cities and landmarks: kind, latitude/longitude, a short text, the Wikipedia article for the photo (or a Commons file picked by hand), population for cities (2020 census, rounded), and the old province where the position alone would pick the wrong one |
| `data/georef.js` | Converts longitude/latitude to map positions (a quadratic fitted on the provinces' centres by `tools/georef.py`; median error 3.8 map units) |
| `data/relief.js`, `images/relief.jpg` | Natural Earth shaded relief (public domain), warped onto the map by `tools/relief.py`; the input for the terrain |
| `images/terrain.jpg` | The Landmarks view's land: heights from the open Terrain Tiles on AWS (SRTM, GMTED2010 and other public data) coloured in dye colours and shaded with the relief, by `tools/terrain.py` (on the relief's grid) |
| `data/provinces.js` | Province shapes, generated by `tools/build_provinces.py`; don't edit by hand |
| `data/images.js`, `images/` | One picture per battle, clan and castle, from Wikimedia Commons, public domain or Creative Commons only |
| `data/crests.js`, `crests/` | Clan crests (SVG) from Wikimedia Commons, same licence rule |
| `main.py`, `build.bat` | The exe: pywebview window, built with PyInstaller (`build.bat` runs the tests first) |
| `tools/` | Province extraction, Wikipedia fact check, picture and crest fetching, font subsetting, icon, screenshots |

**Load order** (`index.html`, `test.js`): provinces, history, images, crests, places, modern, georef, relief, landmarks. `modern.js` extends lists made by the files before it.

**Crests** come from Commons drawn three ways, and `data/crests.js` says which (`tools/fetch_crests.py` keeps the lists): black on light (the default), white on a dark ground (`"invert": true`), or cut as holes in a dark square (`"invert": "holes"`). Each way has its own resist filter in `app.js`, so every crest comes out as a cream figure on the dye.

**Checked against Wikipedia on 2026-11-07** for 1467–1603 (`tools/wiki_check.py` fetches the summaries of every battle, clan and person). That check fixed the following; where English Wikipedia and Japanese histories disagree, the app says so instead of picking a side.
- Seven birth and death years.
- Nobunaga's age at Okehazama.
- How Tedorigawa was fought.
- How long Tottori lasted.
- The Satake's and the Sō's sides in 1600.

Smaller notes were also added: the Mount Hiei excavations and the Portuguese guns at Okitanawate.

**1604–1945 checked on 2026-11-08** the same way, plus the people and later castles. Fixed: Toba–Fushimi lasted four days; the shogunate sent some 125,000 men to Shimabara; 46 of the rōnin were ordered to commit seppuku; the Mukden bomb barely damaged the track; the Tokyo raid killed 90,000 to over 100,000; Saigō's second exile was to Okinoerabu; Odawara was pulled down from 1870.

**Territory is an approximation.** Each of the 68 old provinces (令制国) shows the power that dominated it; many were shared among small lords. Years are rounded to the year of the main event. To change the history, edit the data files and run `node test.js`. The test checks:
- every province, clan, castle, person and picture reference exists;
- the years are in order;
- each dye and stencil pair is used once;
- no two clans sharing a dye sit side by side in the same year.

**Changing text:** the fonts are cut down to the characters the app uses. After adding new text (especially kanji), run `python tools/subset_fonts.py <folder with the full fonts>`. The full fonts come from github.com/google/fonts (`ofl/shipporiminchob1`, `ofl/zenkakugothicnew`). Then rebuild with `build.bat`.

**Fetching from Wikimedia:** it throttles automated downloads (HTTP 429). The fetch scripts resume where they stopped and wait 5 seconds between requests. If they get blocked, let them rest for half an hour before trying again.

## Where we left off (2026-11-08, midday)

Done tonight:
- the late downloads processed (34 pictures, 10 crests, all with their origin embedded); crests drawn white-on-black now come out right
- the Wikipedia check of 1604–1945 (see above)
- the Landmarks view with atlas-coloured terrain, 13 cities and 53 landmarks, every one with a photo
- the Japanese touches; the exe rebuilt with all of it
- a finish review of everything since the first build, and two rounds of its fixes: red thread only for battles (other turning points are a cream knot), finer kasuri, waves that keep their size when zooming, all of Hokkaido framed in Landmarks, the terrain in flat bands of dye colour with the weave over it, crest and label collisions, every city named on phones (captures in `.impeccable/review/round6/`)
- DESIGN.md brought up to date with all of the above
- the landmark and city texts checked against Wikipedia (`tools/wiki_check.py` now covers `data/landmarks.js`): populations all match the 2020 census; five small fixes (Hikone, Ginkaku-ji, Tottori, Dejima, Nagoya), and Sado now points at the right article and has its photo

Open, in order:
1. **A formal last verdict** from the finish reviewer on `.impeccable/review/round6/` (its last pass listed three items, all fixed since).
2. **Ideas not started:** a search box; a phone version (Home Screen, like the reading app); Okinawa is off the map's southern edge.

## Credits

- Province map: "Provinces of Japan with names" by Ash_Crow, Wikimedia Commons, CC BY 2.5. The label typos in that file (Kasuza, Wasaka, Ibana…) are corrected in `tools/build_provinces.py`, and the provinces with off-shape labels were matched by hand.
- Typefaces: Shippori Mincho B1 and Zen Kaku Gothic New, SIL Open Font License (licences in `fonts/`).
- Heights: Terrain Tiles on AWS (Mapzen Terrarium; SRTM, GMTED2010, ETOPO1 and other public data). Shaded relief: Natural Earth, public domain.
- Pictures and crests: from Wikimedia Commons, each credited with its author and licence in the app; the full source page is in `data/images.js` and `data/crests.js`, and embedded in each picture file.
