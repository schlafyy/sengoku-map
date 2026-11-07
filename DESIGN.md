---
name: Sengoku 戦国
description: Japan's Sengoku period as one length of indigo-dyed cotton; each clan a dye, conquest a dye soaking across the cloth.
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
  dye-bengara: "#a8452f"
  dye-kaki: "#c06a2c"
  dye-uguisu: "#8c8a3a"
  dye-suo: "#8e3a5c"
  dye-beni: "#cf6f80"
  dye-asagi: "#4f9cab"
  dye-yamabuki: "#dc9a2a"
  dye-kihada: "#d8c75e"
  dye-akane: "#9a2638"
  dye-tobi: "#7d5038"
  dye-murasaki: "#6a4a92"
  dye-yomogi: "#6f8f4a"
  dye-kariyasu: "#c8a43a"
  dye-kuchiba: "#b5874a"
  dye-shikon: "#5a3f7a"
  dye-hiwa: "#a5b04f"
  dye-ume: "#b0607a"
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
---

# Design System: Sengoku 戦国

## Overview

**Creative North Star: "Indigo Cloth"**

Japan is one length of indigo-dyed cotton, made in the katazome and aizome tradition. The ground is the vat itself: near-black kachi-iro at the cloth's edge, kon in the open sea, and lighter hanada where the resist paste kept the dye from biting at the coasts. Every clan is a natural dye with a small stencil motif, and every province is a resist-dyed field outlined by a pale resist line. Conquest is not shown by redrawing a border. The new dye soaks across the province from the conqueror's side while the old dye lingers as a ghost and fades.

The map leads and the interface recedes. The side panel is the same cloth folded under, with a sashiko seam between them. The timeline is a woven band in which each year is a column of 68 threads, one per province, dyed by its holder. Everything that marks something is a textile act: alliances are running stitches, battles are red cross-stitches, focus and selection are dashed stitch lines, and pictures are prints stitched onto the lining. A little busy is acceptable. Gilt, parchment, strategy-game chrome and the flat legend-box atlas are not.

**Key Characteristics:**
- An indigo ground with a visible cotton weave (1px lines on a 3px pitch) on the cloth, the lining and the band.
- One job per colour: indigo for ground, natural dyes for clans, undyed cotton for local lords, red thread for war, cream for text and stitches.
- Mincho for every name, kanji, the year and reading text; a quiet gothic for UI.
- Dashed lines read as stitches and carry every selection, focus, alliance, seam and mount.
- Motion is dye and thread: a soak, a stitch drawn in, a mark that pulses once.

## Colors

A deep indigo ground carries a ring of natural vegetable dyes. One red is brighter than any dye and belongs to war alone.

### Primary
- **The Indigo Vat** (kachi, kon, hanada, lining): kachi is the cloth's edge, the page background, the band and the tooltip. Kon is the sea, the middle of a radial grade from a lighter centre (#252c63) out to kachi. Hanada is the lighter indigo of the coasts, and it is also used for text selection and the panel scrollbar. Lining is the side panel, the same cloth folded under. A coast-indigo halo (stroke 10, displaced by turbulence and blurred) makes the land glow out of the sea.

### Secondary
- **The Dye Ring** (dye-*, 19 natural dyes): fuji, matsuba, bengara, kaki, uguisu, suo, beni, asagi, yamabuki, kihada, akane, tobi, murasaki, yomogi, kariyasu, kuchiba, shikon, hiwa, ume. These are clans only. Each clan is a unique dye + motif pair (motif one of plain, dots, kikko, hishi, uroko, printed in the same dye 22-25% darker at .75 opacity). `DYES` in `data/history.js` is the source of truth.

### Tertiary
- **Red Thread** (war): battles and only battles. It is used for the cross-stitch on the map, the pulse ring on the newest battle, the diamonds on the band and the diamonds beside battle links in the panel. It has a darker under-thread (war-under) and a highlight (war-sheen) used only inside the stitch mark.

### Neutral
- **Unbleached Cotton** (cream): all primary text, resist lines between provinces, alliance stitches, the playhead, focus outlines and every dashed stitch border. Translucent cream (.06 to .6 alpha) is the only hover wash and border tint.
- **Undyed Cotton** (undyed with undyed-fleck): land held by no single power. On the map it is flecked like raw cloth (6px tile, two 0.8px flecks). The local-lords swatch uses it too. undyed-thread is the same meaning inside the woven band and the per-province strip.
- **Indigo-tinted Greys** (muted, faint): muted is used for kanji beside names, secondary text and threshold names. faint is used for fine print, tick years, section labels and fallen clans.
- **The Mount** (mount, mount-caption): a warmer cream card behind a mounted picture, with its credit line in a dark grey-violet.

### Named Rules
**The One Job Rule.** Every colour has exactly one meaning. Indigo is ground, sea and panel. Dyes are clans. Undyed cotton means many local lords. Red is war. Cream is text, resist lines and stitches. A new element takes the colour of its meaning or no colour at all.

**The Neighbour Rule.** Two clans that share a dye may never hold neighbouring provinces in the same year (province centres closer than 60 map units). `test.js` enforces this together with dye + motif uniqueness. A new clan gets a dye + motif pair that passes both checks.

**The Brightest Thread Rule.** Red thread is brighter and more saturated than any dye, so a battle reads over any province. No dye may approach it.

## Typography

**Display Font:** Shippori Mincho B1, self-hosted subset as "Shippori" 400/700 (with Yu Mincho, Hiragino Mincho ProN, serif)
**Body Font:** Zen Kaku Gothic New, self-hosted subset as "Zen" 400/500 (with Yu Gothic UI, Hiragino Sans, sans-serif)

**Character:** A brushed, high-contrast Mincho carries the history (names, kanji, the year, the stories). A soft gothic stays out of its way and handles counts, labels and controls.

### Hierarchy
- **Display** (700, clamp(64px, 9.5vw, 128px), 0.9): the year only, set large in the empty Sea of Japan with lining tabular numerals. Under it the era sits in Mincho 1.1rem with .08em tracking, followed by its romanized form in gothic.
- **Headline** (700, clamp(30px, 4.4vw, 60px), 1.04): a decisive moment's name flashed across the sea for 2.9s, with its kanji above in Mincho 400 and .14em tracking.
- **Title** (700, 1.6rem, 1.15): the detail heading for a clan, province or battle. Its kanji sits on its own line at 1.05rem, muted, with .14em tracking. Title-sm (1.2rem) is the panel heading.
- **Reading** (400, 1.05rem, 1.62): the short story. Reading-long (0.98rem, 1.7) is the full account. Both are Mincho.
- **Name** (400, 1rem, 1.25): clan names in the roster. Kanji follows at .86rem, muted.
- **Body** (400, 15px, 1.6, gothic): notes, tooltips and UI prose.
- **Label** (500, 0.66-0.8rem, .08-.13em tracking, uppercase, gothic): section headings in the panel, the phase line under the era, the metadata line under a title and the "Won" badge.
- **Numeral** (500, gothic, tabular): province counts, life dates and tick years.

### Named Rules
**The English-then-Kanji Rule.** Every name is the romanized English followed by its kanji in the same Mincho at a smaller size and in muted colour, for example "Oda 織田".

**The Kanji Floor Rule.** On the map, a clan label's kanji is at least 10.5px on screen (max(size × .6, 10.5px ÷ screen scale)). If that would exceed .85 × the label size, the kanji is dropped instead of shrunk. Map labels are Mincho 700 with a .32 × size dark halo (paint-order stroke). A label that collides with a battle, a stitch or another label is removed, because the roster still names it.

## Layout

There is one screen. A two-column grid holds the cloth (1fr) and the panel (clamp(300px, 26vw, 380px)), with the woven band full width beneath them. The page never scrolls on desktop; only the panel scrolls. The map frames Kyushu to Mutsu with Ezo's southern tip showing and is centred with `meet`. The year block sits top-left in the sea (clamp(20px, 3vw, 44px) in). Battle flashes sit bottom-right at up to 58% of the cloth's width.

Panel rhythm: 26px padding (30px on the seam side), 11px between swatch, name and count in roster rows, 1.7rem between detail blocks, and 1.5rem above a section label. Band: 22px between the play button and the loom. The loom is 96px tall: a 24px marks row, a 46px weave and an 18px tick row.

Under 860px the grid becomes a single column: the map at 62vh, then the band, then the panel, and the page scrolls. The seam is hidden, minor ticks and threshold names are dropped, and battle diamonds shrink to 4px.

## Elevation & Depth

The cloth is flat; depth comes from dye and thread, not from lift. There are no drop shadows. Depth is conveyed by the indigo radial grade, the blurred coastal glow, a multiplied mottle over all land (a 256px value-noise tile at .5 opacity, because dye never takes evenly) and stitches that sit on a darker under-stroke. Box-shadows exist only as zero-offset rings that separate a thread from the ground: a 1px cream inset on swatches, a kachi ring around band diamonds, and the playhead's halo.

### Named Rules
**The Sunk Thread Rule.** Anything stitched on the cloth sits on a darker under-stroke instead of casting a shadow. Alliance stitches use a 3.4px kachi under-thread at .55. Battle marks use a kachi under-cross at .85. Nothing floats above the cloth.

## Shapes

The forms are textile: square fields, dashed stitches and woven columns. Corners are barely softened, 2px for anything thread- or swatch-sized and 3px for hover fields, chips and the tooltip. The only full circle is the play button, ringed by a dashed stitch. Selection and focus are always dashed, never solid: a selected province gets a 4/3 dash at 2.2px, focus is a 1.5px dashed cream outline offset 3px, and the "Read the full story" link uses a dashed underline. Small war markers are 6px squares rotated 45°.

## Components

### Buttons
- **Play:** a 54px circle with a 1.5px dashed cream border at .6. On hover the border turns full cream with a .07 cream wash. It holds a cream SVG triangle that becomes two bars while playing.
- **Text actions** ("Read the full story", "All clans in …"): gothic 500 at .82-.85rem with no box. The first has a dashed underline offset 5px. The second has a small SVG triangle and moves from muted to cream on hover.
- **Rows and chips:** the whole row is the button, and hover is a 3px-rounded .06 cream wash.

### Chips
- **Clan chip:** a swatch (18px), the name and kanji in Mincho .95rem, and a 3px radius. The winner carries a "Won" badge: gothic 500 .66rem uppercase with .12em tracking in a 1px dashed cream border at .5.

### Cards / Containers
- **Side panel:** lining indigo with the cotton weave and no border. It is separated from the cloth by the sashiko seam (a 2px running stitch, 7px on and 6px off, cream at .32, 12px inside the panel).
- **The plate:** a picture mounted like a print stitched onto the lining. The image (max 300px tall, cover; 340px and contain when it is tall) sits on the mount colour with 7px padding. A 1.5px dashed cream stitch at .4 runs 6px outside the mount. The caption under it is gothic .7rem, "author · licence · Wikimedia Commons", and every plate carries one.
- **Tooltip:** kachi with a 1px dashed cream border at .45 and a 3px radius. The province name is in Mincho 700, followed by its kanji and its holder in muted.

### Navigation
- **Clan roster:** an ordered list ranked by provinces held. Each row has a 22px dye swatch, Mincho name and kanji, and a tabular count (halves shown as ½). Below a "Fallen" label, clans that have fallen show an empty dashed swatch and faint text with the last year they held land. Local lords get the undyed swatch and a count sentence.
- **Detail:** a back action, then the swatch (40px) and title, the plate, a metadata label, the short story, then "Read the full story". Key people, alliances and battles follow as labelled blocks. Year links use a 3.3em tabular year column, and battle links carry a red diamond.

### Woven Band (signature)
Each year is a column of 68 threads, one per province (a split province gives two half threads). Threads are grouped by clan in the order the clans first held land and dyed with the clan's dye, or undyed-thread for local lords. Every other column is darkened by a weft shade (.16), and a warp line runs every 3px (.13). Threshold names (Ōnin, Okehazama, Honnō-ji, Odawara, Sekigahara) sit in the marks row with a 6px cream tick, and battle diamonds sit on the weave's top edge. The playhead is a 2px cream line with a 10px knob that starts below the threshold names, so it never covers them. Dragging or using the arrow keys scrubs the band (it is a slider from 1467 to 1603). During play, ordinary years take 760ms, battle years 1500ms and thresholds 3200ms. The province detail repeats the band as a 22px strip with a cream year line.

### Dye Soak (signature motion)
When the year moves forward by one to three steps, each changed province takes its new dye at once. The old dye is laid over it as a ghost and masked away by a circle that grows from the nearest province the conqueror already held. The mask's edge is feathered from 72% and displaced by fractal turbulence so the front wicks through the fibres. Over 1600ms the circle grows cubic-out (1 − (1 − k)³), and the ghost holds full strength until 45% of the duration, then fades. Backward steps and jumps paint instantly. At most 30 soaks run at once. Under prefers-reduced-motion the soak is off and every CSS animation is cut to .01ms.

### Kasuri Split
A province held by two powers is a 22-unit kasuri tile rotated 38°. The first holder's dyed pattern is the ground, and the second holder's band runs across it in eight thread-steps. Each step's left and right edge jumps sideways out of register, and a half-dyed feather at .55 runs past each edge.

### Stitch Marks
- **Alliance:** a sashiko running stitch (cream 1.7px, dash 6/5) on its kachi under-thread, with a 1.6 cream knot at each ally's centre. Two allies are joined by a slack thread that bows toward the open sea (up to 60 units). Three or more allies form a closed stitched ring. A new alliance draws itself in over 1.4s.
- **Battle:** a cross-stitch in red thread. The top stitch is whole. The under stitch is broken where it passes beneath and drawn in war-under. Both sit on a wider kachi under-cross, with a war-sheen highlight on the top stitch and a kachi needle hole at each of the four ends. A battle is size 6 and another event 4.4, and the detail heading uses size 13. Marks fade over three years (1, .75, .55, .4). The newest pulses one red ring (1.6s). On hover or selection the under-cross turns cream.

## Do's and Don'ts

### Do:
- **Do** give every new clan a dye from `DYES` and a motif, as a dye + motif pair no other clan uses and one that passes the neighbour test in `test.js`.
- **Do** draw any new marker on the cloth as a textile act (a stitch, a dye or a resist line) with a darker under-stroke rather than a shadow.
- **Do** set every name as English then kanji in Mincho, and keep map kanji at or above 10.5px on screen or drop it.
- **Do** use dashed cream for selection, focus and borders; they read as stitches.
- **Do** mount every picture on the cream mount with its dashed stitch and an author · licence caption.
- **Do** keep the playhead below the threshold names on the band.
- **Do** keep motion to dye and thread (soak, stitch draw-in, one pulse) on the shared ease cubic-bezier(.16, 1, .3, 1), and switch it off under reduced motion.

### Don't:
- **Don't** use red for anything but war, and don't use a dye for anything but a clan.
- **Don't** fill land with indigo or with any colour that is not a clan dye or undyed cotton.
- **Don't** let a split or contested province read as solid; it is kasuri or undyed.
- **Don't** use gilt, parchment, campaign-map chrome or a legend box; the roster is the legend.
- **Don't** add drop shadows or offset shadows; depth is the dye and the under-thread.
- **Don't** let two neighbouring clans share a dye in the same year.
