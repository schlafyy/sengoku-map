---
name: Sengoku 戦国
description: Japan from 1467 to 1945 as one length of indigo-dyed cotton; each clan a dye, conquest a dye soaking across the cloth, and a second face that prints the land and its landmarks.
colors:
  kachi: "#13152f"
  kon: "#1a1e47"
  hanada: "#33478a"
  lining: "#16193a"
  coast-indigo: "#3a4f95"
  cream: "#efe6d3"
  muted: "#adb2d2"
  faint: "#8489ad"
  undyed: "#e2d9c5"
  undyed-fleck: "#b9ae97"
  undyed-thread: "#d8cfba"
  war: "#ff5b3f"
  war-under: "#b8402b"
  war-sheen: "#ffb29e"
  mount: "#e9e0cc"
  mount-caption: "#5d5a66"
  dye-fuji: "#9a86c0"
  dye-matsuba: "#3d7a58"
  dye-bengara: "#93412f"
  dye-kaki: "#c06a2c"
  dye-uguisu: "#8c8a3a"
  dye-suo: "#8e3a5c"
  dye-beni: "#cf6f80"
  dye-asagi: "#4f9cab"
  dye-yamabuki: "#dc9a2a"
  dye-kihada: "#d8c75e"
  dye-akane: "#82263a"
  dye-tobi: "#7d5038"
  dye-murasaki: "#6a4a92"
  dye-yomogi: "#6f8f4a"
  dye-kariyasu: "#c8a43a"
  dye-kuchiba: "#b5874a"
  dye-shikon: "#5a3f7a"
  dye-hiwa: "#a5b04f"
  dye-ume: "#b0607a"
  dye-rikyu: "#8a907c"
  terrain-moegi: "#9fb26e"
  terrain-hiwa: "#b6bb73"
  terrain-kariyasu: "#d0bf7c"
  terrain-kaki-shibu: "#c49a68"
  terrain-kurumi: "#9d7c5a"
  terrain-peak: "#e8e0cf"
typography:
  display:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "clamp(64px, 9.5vw, 128px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontFeature: "lnum, tnum"
  headline:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "clamp(30px, 4.4vw, 60px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.15
  title-sm:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.25
  tategaki:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.32em"
  reading:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.62
  reading-long:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.7
  name:
    fontFamily: "Shippori, Yu Mincho, Hiragino Mincho ProN, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Zen, Yu Gothic UI, Hiragino Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Zen, Yu Gothic UI, Hiragino Sans, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
  numeral:
    fontFamily: "Zen, Yu Gothic UI, Hiragino Sans, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  thread: "2px"
  cloth: "3px"
  pill-inner: "18px"
  pill: "22px"
  round: "50%"
spacing:
  hair: "2px"
  stitch: "6px"
  row: "11px"
  gutter: "22px"
  panel: "26px"
components:
  roster-row:
    textColor: "{colors.cream}"
    typography: "{typography.name}"
    rounded: "{rounded.cloth}"
    padding: "6px 6px 6px 3px"
  roster-row-fallen:
    textColor: "{colors.faint}"
  play-button:
    textColor: "{colors.cream}"
    rounded: "{rounded.round}"
    size: "54px"
  swatch:
    rounded: "{rounded.thread}"
    size: "22px"
  chip-clan:
    textColor: "{colors.cream}"
    rounded: "{rounded.cloth}"
    padding: "3px 8px 3px 3px"
  tooltip:
    backgroundColor: "{colors.kachi}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    rounded: "{rounded.cloth}"
    padding: "0.35rem 0.65rem 0.45rem"
  plate:
    backgroundColor: "{colors.mount}"
    textColor: "{colors.mount-caption}"
    padding: "7px"
  side-panel:
    backgroundColor: "{colors.lining}"
    textColor: "{colors.cream}"
    padding: "26px 26px 22px 30px"
  band:
    backgroundColor: "{colors.kachi}"
    padding: "10px 26px 12px 20px"
  mode-switch:
    rounded: "{rounded.pill}"
    padding: "3px"
  mode-option:
    textColor: "{colors.muted}"
    rounded: "{rounded.pill-inner}"
    padding: "7px 14px"
  mode-option-active:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.kachi}"
  zoom-button:
    textColor: "{colors.cream}"
    rounded: "{rounded.round}"
    size: "36px"
  play-life:
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "8px 14px 8px 12px"
  portrait:
    backgroundColor: "{colors.mount}"
    width: "34px"
    height: "40px"
  portrait-big:
    backgroundColor: "{colors.mount}"
    width: "54px"
    height: "64px"
  landmark-row:
    textColor: "{colors.cream}"
    rounded: "{rounded.cloth}"
    padding: "5px 6px 5px 22px"
---

# Design System: Sengoku 戦国

## Overview

**Creative North Star: "Indigo Cloth"**

Japan is one length of indigo-dyed cotton, made in the katazome and aizome tradition. The ground is the vat itself: near-black kachi-iro at the cloth's edge, kon in the open sea, and lighter hanada where the resist paste kept the dye from biting at the coasts. Every clan is a natural dye with a small stencil motif, and every province is a resist-dyed field outlined by a pale resist line. Conquest is not shown by redrawing a border. The new dye soaks across the province from the conqueror's side while the old dye lingers as a ghost and fades. A clan's crest is resist-dyed into its largest province, so it reads as cotton the dye never reached.

The map leads and the interface recedes. The side panel is the same cloth folded under, lined with a faint asanoha (hemp-leaf) pattern and joined to the cloth by a sashiko seam. The timeline is a woven band in which each year from 1467 to 1945 is a column of 68 threads, one per province, dyed by its holder. Everything that marks something is a textile act: alliances are running stitches, battles are red cross-stitches, other turning points are cream diamond knots, castles are small cream squares around a knot, focus and selection are dashed stitch lines, and pictures are prints stitched onto the lining. Seigaiha waves are printed faintly over the sea, and the period's name runs in vertical kanji beside the year. A little busy is acceptable. Gilt, parchment, strategy-game chrome and the flat legend-box atlas are not.

The same cloth has a second face, Landmarks 名所. The wars and dynasties are taken off and the land is printed by height in flat bands of dye colour, with the cloth's weave multiplied over it. Cities and landmarks are small drawn stencils in indigo on a halo of bare cotton. A dashed pill switch at the top right of the map (bottom right on a phone) turns between the two.

**Key Characteristics:**
- An indigo ground with a visible cotton weave (1px lines on a 3px pitch) on the cloth, the lining and the band, and multiplied over the land in Landmarks.
- One job per colour: indigo for ground, natural dyes for clans, undyed cotton for local lords, red thread for battles, cream for text, stitches, knots and resist figures.
- Mincho for every name, kanji, the year and reading text; a quiet gothic for UI; kanji beside every panel heading.
- Dashed lines read as stitches and carry every selection, focus, alliance, seam, mount, switch and the vertical phase rule.
- Marks and labels keep their reading size when zooming: marks scale by zoom^-0.7, labels by zoom^-0.8, the waves stay fixed on screen.
- Motion is dye and thread: a soak, a stitch drawn in, a mark that pulses once, the land sinking back when following a life.

## Colors

A deep indigo ground carries a ring of natural vegetable dyes. One red is brighter than any dye and belongs to battles alone.

### Primary
- **The Indigo Vat** (kachi, kon, hanada, lining): kachi is the cloth's edge, the page background, the band and the tooltip. Kon is the sea, the middle of a radial grade from a lighter centre (#252c63) out to kachi. Hanada is the lighter indigo of the coasts, and it is also used for text selection and the panel scrollbar. Lining is the side panel, the same cloth folded under. A coast-indigo halo (stroke 10, displaced by turbulence and blurred) makes the land glow out of the sea. In Landmarks, kon becomes the printing ink: the landmark stencils, the province resist lines (at .16) and the province names (at .62) are kon; city stencils and city names are kachi.

### Secondary
- **The Dye Ring** (dye-*, 20 natural dyes): fuji, matsuba, bengara, kaki, uguisu, suo, beni, asagi, yamabuki, kihada, akane, tobi, murasaki, yomogi, kariyasu, kuchiba, shikon, hiwa, ume, and rikyū-nezumi, the grey-green of the modern state from 1871 (added in `data/modern.js`). These are clans and powers only. Each clan is a unique dye + motif pair (motif one of plain, dots, kikko, hishi, uroko, printed in the same dye 22-25% darker at .75 opacity). `DYES` in `data/history.js` (extended in `data/modern.js`) is the source of truth.
- **The Height Bands** (terrain-*, Landmarks only): moegi plains (below 100m), hiwa hills (100m), kariyasu hills (400m), kaki-shibu uplands (900m), kurumi mountains (1600m) and bare cotton on the peaks (2150m and up). Each band is one flat dye, shaded by the relief and baked into `images/terrain.jpg` by `tools/terrain.py`; the `BANDS` list there is the source of truth. They appear only in Landmarks, where no clan is shown.

### Tertiary
- **Red Thread** (war): battles and only battles. It is used for the cross-stitch on the map, the pulse ring on the newest battle, the diamonds on the band and the solid diamonds beside battle links in the panel. It has a darker under-thread (war-under) and a highlight (war-sheen) used only inside the stitch mark. Treaties, fires, eruptions and other turning points are never red; they are cream knots.

### Neutral
- **Unbleached Cotton** (cream): all primary text, resist lines between provinces, alliance stitches, turning-point knots, castle squares, crests, the seigaiha waves, the playhead, the life line, focus outlines and every dashed stitch border. Translucent cream (.06 to .6 alpha) is the only hover wash and border tint. The active side of the mode switch is solid cream with kachi text.
- **Undyed Cotton** (undyed with undyed-fleck): land held by no single power. On the map it is flecked like raw cloth (6px tile, two 0.8px flecks). The local-lords swatch uses it too. undyed-thread is the same meaning inside the woven band and the per-province strip. In Landmarks, undyed is the halo of bare cotton around each stencil and the halo behind landmark and province names.
- **Indigo-tinted Greys** (muted, faint): muted is used for kanji beside names, secondary text, threshold names, the vertical phase name and inactive switch options. faint is used for fine print, tick years, section labels and fallen clans.
- **The Mount** (mount, mount-caption): a warmer cream card behind a mounted picture and behind each portrait, with the credit line in a dark grey-violet.

### Named Rules
**The One Job Rule.** Every colour has exactly one meaning. Indigo is ground, sea and panel (and the printing ink in Landmarks). Dyes are clans. Undyed cotton means many local lords. Red is battle. Cream is text, resist figures and stitches. A new element takes the colour of its meaning or no colour at all.

**The Neighbour Rule.** Two clans that share a dye may never hold neighbouring provinces in the same year (province centres closer than 60 map units). `test.js` enforces this together with dye + motif uniqueness. A new clan gets a dye + motif pair that passes both checks.

**The Brightest Thread Rule.** Red thread is brighter and more saturated than any dye, so a battle reads over any province. No dye may approach it, and nothing that is not a battle may wear it.

**The Two Faces Rule.** History and Landmarks never share a layer. In Landmarks the crests, soak, stitches, castles, battles, flash, approximation note and band are all removed and the provinces go clear; in History the height bands and landmark stencils are hidden. Height-band colours never appear in History.

## Typography

**Display Font:** Shippori Mincho B1, self-hosted subset as "Shippori" 400/700 (with Yu Mincho, Hiragino Mincho ProN, serif)
**Body Font:** Zen Kaku Gothic New, self-hosted subset as "Zen" 400/500 (with Yu Gothic UI, Hiragino Sans, sans-serif)

**Character:** A brushed, high-contrast Mincho carries the history (names, kanji, the year, the stories). A soft gothic stays out of its way and handles counts, labels and controls.

### Hierarchy
- **Display** (700, clamp(64px, 9.5vw, 128px), 0.9): the year only, set large in the empty Sea of Japan with lining tabular numerals. In Landmarks the same slot holds 名所 (tracking .06em). Under it the era sits in Mincho 1.1rem with .08em tracking, followed by its romanized form in gothic.
- **Tategaki** (Mincho 400, 1.3rem, line-height 1, .32em tracking, muted, writing-mode vertical-rl): the current phase's name in vertical kanji to the right of the year block, set off by a 1.5px dashed cream rule at .3 on its left with .7rem padding. The year block reserves 3.2rem on its right for it. In Landmarks it reads 山河と名所.
- **Headline** (700, clamp(30px, 4.4vw, 60px), 1.04): a decisive moment's name flashed across the sea for 2.9s, with its kanji above in Mincho 400 and .14em tracking.
- **Title** (700, 1.6rem, 1.15): the detail heading for a clan, province, battle, castle, person or landmark. Its kanji sits on its own line at 1.05rem, muted, with .14em tracking. Title-sm (1.2rem) is the panel heading, with its kanji in Mincho 400 .95rem muted and .1em tracking.
- **Reading** (400, 1.05rem, 1.62): the short story. Reading-long (0.98rem, 1.7) is the full account and the Landmarks introduction. Both are Mincho.
- **Name** (400, 1rem, 1.25): clan names in the roster. Kanji follows at .86rem, muted. Landmark rows use Mincho .98rem with kanji at .84rem.
- **Body** (400, 15px, 1.6, gothic): notes, tooltips and UI prose.
- **Label** (500, 0.66-0.8rem, .08-.13em tracking, uppercase, gothic): section headings in the panel, the phase line under the era, the metadata line under a title and the "Won" badge. Kanji after a label is Mincho, muted, .1em tracking and never uppercased.
- **Numeral** (500, gothic, tabular): province counts, life dates and tick years.

### Named Rules
**The English-then-Kanji Rule.** Every name is the romanized English followed by its kanji in the same Mincho at a smaller size and in muted colour, for example "Oda 織田". Panel headings, section labels and the mode switch carry their kanji the same way ("Follow a life 生涯", "Landmarks 名所").

**The Kanji Floor Rule.** On the map, a clan label's kanji is at least 10.5px on screen (max(size × .6, 10.5px ÷ screen scale)). If that would exceed .85 × the label size, the kanji is dropped instead of shrunk. Map labels are Mincho 700 with a .32 × size dark halo (paint-order stroke). A label that collides with a crest, a battle, a castle, a stitch, another label or the overlays (year block, zoom buttons, switch) is removed, because the roster still names it.

**The Screen-Size Rule.** Map type is sized for the screen, not the map. Clan labels are min(17, 7 + √provinces × 2.6) × zoom^-0.8; clans with one province are labelled only past zoom 1.8. Province names (12.5px on screen, kanji at .95) appear only from zoom 2.2. In Landmarks, city names are 13.5px on screen (11px under 600px wide) with kanji at .82 and a .24 halo, and other landmark names are 12px (10.5px) from zoom 1.6.

**The Named City Rule.** In Landmarks the cities are named first, in English and kanji, kachi on a cream .95 halo: clear of other marks if possible, over a smaller mark if not, and never over the overlays or another city's name. On a wide screen all 13 show at the full view; on a phone a name with no room appears when you zoom in. A smaller mark that a city name has to cover fades to .28 and returns on hover or selection.

## Layout

There is one screen. A two-column grid holds the cloth (1fr) and the panel (clamp(300px, 26vw, 380px)), with the woven band full width beneath them. The page never scrolls on desktop; only the panel scrolls. In History the map frames Kyushu to Mutsu with Ezo's southern tip showing and is centred with `meet`; Landmarks reframes to include all of Ezo (Hokkaido), and the band is removed so the cloth takes its height. The year block sits top-left in the sea (clamp(20px, 3vw, 44px) in). The mode switch sits top-right (clamp(16px, 2.4vw, 32px) in). The zoom buttons sit bottom-left in a column with 8px gaps. Battle flashes sit bottom-right at up to 58% of the cloth's width.

Panel rhythm: 26px padding (30px on the seam side), 11px between swatch, name and count in roster rows, 1.7rem between detail blocks, and 1.5rem above a section label. Sixteen portraits sit in a five-column grid (8px row gap, 4px column gap) under "Follow a life". Band: 22px between the play button and the loom. The loom is 96px tall: a 24px marks row, a 46px weave and an 18px tick row; quiet years are given less width than busy ones.

Zoom runs from the whole view to 6×, by wheel, pinch, drag or the buttons. While zoomed the approximation note and the start hint fade out.

Under 860px the grid becomes a single column: the map at 62vh, then the band, then the panel, and the page scrolls. The seam is hidden, minor ticks and threshold names are dropped, battle diamonds shrink to 4px, and the mode switch moves to the bottom-right corner of the map (16px in), hidden while playing so battle names can take that corner.

## Elevation & Depth

The cloth is flat; depth comes from dye and thread, not from lift. There are no drop shadows. Depth is conveyed by the indigo radial grade, the blurred coastal glow, a multiplied mottle over all land (a 256px value-noise tile at .5 opacity, .35 in Landmarks, because dye never takes evenly) and stitches that sit on a darker under-stroke. In Landmarks the shaded relief inside the height bands gives the land its form, and the cotton weave (kachi lines at .07 and .06 on a 3px pitch) is multiplied over everything so the atlas still reads as dyed cotton. Box-shadows exist only as zero-offset rings that separate a thread from the ground: a 1px cream inset on swatches, a kachi ring around band diamonds, and the playhead's halo.

### Named Rules
**The Sunk Thread Rule.** Anything stitched on the cloth sits on a darker under-stroke instead of casting a shadow. Alliance stitches use a 3.4px kachi under-thread at .55. Battle marks and turning-point knots use a kachi under-stroke at .85; the battle cross also has a cream halo at .5 outside it so it never sinks into a red dye. Castle squares are filled with kachi at .78. Nothing floats above the cloth.

**The Resist Rule.** Crests are not printed on the cloth; they are where the dye did not take. Every crest is turned into a cream figure (#efe6d3) by one of three resist filters chosen per crest in `data/crests.js`: dark-on-light keeps the dark parts; white-on-dark keeps the light parts using the green channel alone (so a coloured ground such as Mōri's red drops out); holes keeps the holes cut in a dark square, with the filter region inset 2.5% so the square's soft edge does not become a frame. The crest is then screened over the dye at .78.

## Shapes

The forms are textile: square fields, dashed stitches and woven columns. Corners are barely softened, 2px for anything thread- or swatch-sized and 3px for hover fields, chips and the tooltip. Full circles are the play button and the 36px zoom buttons, each ringed by a dashed stitch. The only pills are the mode switch (22px outer, 18px inner) and "Play this life" (22px). Selection and focus are always dashed, never solid: a selected province gets a 4/3 dash at 2.2px, a selected landmark a 3/2.4 kon dashed ring, focus is a 1.5px dashed cream outline offset 3px, and text actions use a dashed underline. Small markers are diamonds rotated 45°: solid red for battles, a 1.5px cream outline for other turning points.

The landmark stencils are drawn shapes, never font glyphs: ◎ three rings for a city, a triangle for a mountain, a dot for nature, a torii for a shrine, a roof over a hall for a temple, a hollow square for a castle, three stones for a garden, a diamond for a town, a stele on a base for a memorial, an awning over a shopfront for a convenience store. Each is indigo ink on a 2.6 halo of bare cotton, and grows to 1.3× on hover or selection.

## Components

### Buttons
- **Play:** a 54px circle with a 1.5px dashed cream border at .6. On hover the border turns full cream with a .07 cream wash. It holds a cream SVG triangle that becomes two bars while playing.
- **Zoom:** three 36px circles (in, out, show all) on kachi at .55 with a 1.5px dashed cream border at .5; hover goes to full cream and kachi .85. "Show all" sits at .45 until the map is zoomed.
- **Mode switch:** a pill (1.5px dashed cream at .5, kachi .72 ground, 3px inner padding) holding "History 歴史" and "Landmarks 名所" in gothic 500 .82rem with Mincho kanji. The pressed option is solid cream with kachi text; the other is muted and turns cream on hover.
- **Play this life:** a 22px-radius pill with a 1.5px dashed cream border at .55, a cream triangle and gothic 500 .85rem; hover is full cream with a .06 wash.
- **Text actions** ("Read the full story", "Follow this life", "All clans in …"): gothic 500 at .78-.85rem with no box. The first two have a dashed underline at .5. The last has a small SVG triangle and moves from muted to cream on hover.
- **Rows and chips:** the whole row is the button, and hover is a 3px-rounded .06 cream wash.

### Chips
- **Clan chip:** a swatch (18px), the name and kanji in Mincho .95rem, and a 3px radius. The winner carries a "Won" badge: gothic 500 .66rem uppercase with .12em tracking in a 1px dashed cream border at .5.

### Cards / Containers
- **Side panel:** lining indigo with the cotton weave and an asanoha lattice (36 × 62.35px tile, cream .05 lines at .7) and no border. It is separated from the cloth by the sashiko seam (a 2px running stitch, 7px on and 6px off, cream at .32, 12px inside the panel).
- **The plate:** a picture mounted like a print stitched onto the lining. The image (max 300px tall, cover; 340px and contain when it is tall) sits on the mount colour with 7px padding. A 1.5px dashed cream stitch at .4 runs 6px outside the mount. The caption under it is gothic .7rem, "author · licence · Wikimedia Commons", and every plate carries one. Castles and landmarks get a plate like clans and battles. Clicking a plate (cursor zoom-in) lifts the same print off the lining into a `<dialog>`: the mount, stitch and caption unchanged, the image at its stored size (640px wide, at most 90vw by 80vh), over the lining colour at .9. A click anywhere or Escape puts it back, and Escape there leaves the panel's selection alone.
- **Portrait:** a small mounted print, 34 × 40px cropped at 50% 15% inside a 3px mount border (54 × 64px with 4px in a person's heading). A person without a picture shows the first kanji of the name in Mincho on the mount.
- **Tooltip:** kachi with a 1px dashed cream border at .45 and a 3px radius. The name is in Mincho 700, followed by its kanji and, below in muted, its holder (or the landmark's kind). On touch screens there is no tooltip.

### Navigation
- **Clan roster:** an ordered list ranked by provinces held. Each row has a 22px dye swatch carrying the crest, Mincho name and kanji, and a tabular count (halves shown as ½). Below a "Fallen" label, clans that have fallen show an empty dashed swatch and faint text with the last year they held land. Local lords get the undyed swatch and a count sentence.
- **Detail:** a back action, then the swatch (40px) and title, the plate, a metadata label, the short story, then "Read the full story". Key people, alliances and battles follow as labelled blocks with kanji. Year links use a 3.3em tabular year column; battle links carry a solid red diamond, other turning points an outlined cream one.
- **Search:** a pill at the top of the panel, above whatever the panel shows: a 1px dashed cream border at .32 (.5 on hover; cream and still dashed on focus, with a .08 wash), a lens drawn in SVG at 13px from the left, gothic .9rem, placeholder "Search · 検索" in faint, and a dashed `/` key hint that hides once the field has focus or text. The results fold down over the panel as a list on kachi with the tooltip's border (1px dashed cream at .45, 3px radius, no shadow). Each row is the Mincho name with its muted kanji kept whole, a faint gothic .74rem note below, and the kind in gothic small caps on the right (war red for battles only). The keyboard's row gets a .09 wash and a 1.5px dashed cream stitch inside its edge. It is an ARIA combobox and listbox; a hidden status line announces the count, and a pick moves the focus to the heading of what opened.
- **Landmarks list:** the panel in Landmarks groups the places by kind under a label carrying the kind's stencil in cream (14px), the kind's name and its kanji. Each row is Mincho .98rem with muted kanji, indented 22px to sit under the label text.

### Woven Band (signature)
Each year from 1467 to 1945 is a column of 68 threads, one per province (a split province gives two half threads). Threads are grouped by clan in the order the clans first held land and dyed with the clan's dye, or undyed-thread for local lords. Every other column is darkened by a weft shade (.16), and a warp line runs every 3px (.13). Threshold names (Ōnin, Okehazama, Honnō-ji, Odawara, Sekigahara, Black ships, Meiji, 1945) sit in the marks row with a 6px cream tick, and a name that would overlap its neighbour is hidden; and red diamonds for battles only sit on the weave's top edge. The playhead is a 2px cream line with a 10px knob that starts below the threshold names, so it never covers them. Dragging or using the arrow keys scrubs the band. During play, ordinary years take 760ms scaled by the year's weight (never under 90ms), battle years 1500ms and thresholds 3200ms. The province detail repeats the band as a 22px strip with a cream year line.

### Following a Life
Picking a portrait follows that person; in the panel their big portrait opens in the picture viewer like a plate, with its author and licence as the caption. Every province not held by their house sinks to .3 opacity, other clans' labels to .35 and other crests to .2, over .6s on the shared ease. Under the weave (72px down the loom) a 2px dashed cream life line (6px on, 4px off, at .85) spans birth to death, with a 4 × 6px cream tick at each year of their life story. "Play this life" plays only that span.

### Dye Soak (signature motion)
When the year moves forward by one to three steps, each changed province takes its new dye at once. The old dye is laid over it as a ghost and masked away by a circle that grows from the nearest province the conqueror already held. The mask's edge is feathered from 72% and displaced by fractal turbulence so the front wicks through the fibres. Over 1600ms the circle grows cubic-out (1 − (1 − k)³), and the ghost holds full strength until 45% of the duration, then fades. Backward steps and jumps paint instantly. At most 30 soaks run at once. Under prefers-reduced-motion the soak is off and every CSS animation is cut to .01ms.

### Kasuri Split
A province held by two powers is a 14-unit kasuri tile rotated 38°. The first holder's dyed pattern is the ground, and the second holder's band runs across it in eight thread-steps. Each step's left and right edge jumps sideways out of register, some steps are broken by a short gap, and a half-dyed feather at .55 runs past each edge. An undyed wash at .16 takes both dyes partway back toward cotton.

### Crests
Each clan that holds two or more provinces has its crest resist-dyed into the largest single (unsplit) province it holds, centred, at half the province's shorter side (9 to 26 map units). Crests are placed before labels, and labels give way to them. See the Resist Rule.

### Stitch Marks
- **Alliance:** a sashiko running stitch (cream 1.7px, dash 6/5) on its kachi under-thread, with a 1.6 cream knot at each ally's centre. Two allies are joined by a slack thread that bows toward the open sea (up to 60 units). Three or more allies form a closed stitched ring. A new alliance draws itself in over 1.4s.
- **Battle:** a cross-stitch in red thread. The top stitch is whole. The under stitch is broken where it passes beneath and drawn in war-under. Both sit on a wider kachi under-cross inside a cream .5 halo, with a war-sheen highlight on the top stitch and a kachi needle hole at each of the four ends. The newest pulses one red ring (1.6s). On hover or selection the under-cross turns cream.
- **Turning point:** a cream diamond knot (a cream diamond outline on a wider kachi under-stroke at .85, with a cream knot in the middle), at .8 of a battle mark's size. Its pulse ring is cream.
- **Castle:** a 6.8-unit square outlined in 1.4px cream (non-scaling) around a 1.1 cream knot, filled kachi at .78; hover or selection fills it kachi and thickens the line to 2px. Shown only for the years the castle stood.
- **Scale and age:** marks are drawn at size 6 and scaled by zoom^-0.7, so they grow a little when zooming but not with the map. Event marks fade over three years (1, .75, .55, .4).

### Ryukyu Insets
The Ryukyu islands lie south of the province sheet, so they are boxed off as an atlas does, in the sea south of Shikoku: Okinawa and Amami in one frame, the Sakishima islands in a smaller one beside it, both at about nine-tenths of the main map's scale. Each frame is a running stitch (1px cream at .5, dashed 5/3, non-scaling) with no fill, so the sea and its waves run through it. Its name sits inside the top-left corner in Mincho with the kanji, held at 11.5px on screen with the kachi halo of every map label; on a phone only the larger frame is named. The islands carry the cream resist edge (.7 at .4) the provinces have, because at this size they would vanish without it: undyed indigo outside the realm until 1879, Amami in Satsuma's holder from 1609, lowland green (#a3b16f) in Landmarks, where the terrain sheet does not reach. Names from the main map never enter a frame; a name for a place on the islands stays inside its own frame and slides back in if it overhangs.

### Seigaiha
Concentric wave scales (radius 14, four rings, .7 stroke) are used as a mask to print cream over the whole sea at .055 (.075 in Landmarks). The pattern is counter-scaled by 1/zoom so the waves keep their size on screen.

## Do's and Don'ts

### Do:
- **Do** give every new clan a dye from `DYES` and a motif, as a dye + motif pair no other clan uses and one that passes the neighbour test in `test.js`.
- **Do** draw any new marker on the cloth as a textile act (a stitch, a knot, a dye or a resist line) with a darker under-stroke rather than a shadow, and scale it by zoom^-0.7.
- **Do** set every name as English then kanji in Mincho, and keep map kanji at or above 10.5px on screen or drop it.
- **Do** use dashed cream for selection, focus and borders; they read as stitches.
- **Do** mount every picture and portrait on the cream mount, and give every plate its dashed stitch and an author · licence caption.
- **Do** bring a crest in through one of the three resist filters so it lands as a cream figure, never as the drawing's own colours.
- **Do** draw a new landmark kind as a small stencil path in the same 14-unit box, indigo on a bare-cotton halo.
- **Do** keep the playhead below the threshold names on the band.
- **Do** keep motion to dye and thread (soak, stitch draw-in, one pulse, the dim) on the shared ease cubic-bezier(.16, 1, .3, 1), and switch it off under reduced motion.

### Don't:
- **Don't** use red for anything but battles, and don't use a dye for anything but a clan.
- **Don't** fill History's land with indigo or with any colour that is not a clan dye or undyed cotton; height bands belong to Landmarks only.
- **Don't** let a split or contested province read as solid; it is kasuri or undyed.
- **Don't** use gilt, parchment, campaign-map chrome or a legend box; the roster is the legend.
- **Don't** add drop shadows or offset shadows; depth is the dye and the under-thread.
- **Don't** use a font glyph as a map symbol; every stencil is drawn.
- **Don't** let two neighbouring clans share a dye in the same year.
