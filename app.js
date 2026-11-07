// The Sengoku map: draws the cloth, the woven band, the roster and the stories, and moves through the years.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const $ = s => document.querySelector(s);
  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.append(e);
    return e;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STATES = buildStates(BASE, CHANGES, START, END);
  const stateAt = y => STATES[y - START];
  const P = GEO.provinces, PIDS = Object.keys(P);
  const changeAt = {}; // "year:province" -> note
  for (const [y, p, , note] of CHANGES) changeAt[y + ':' + p] = note;

  let year = START, sel = null; // sel: {type: 'clan'|'province'|'event', id}

  // ---------- dyes and stencils ----------

  const svg = $('#map'), defs = el('defs', {}, svg);
  const shade = (hex, k) => { // k < 0 darker, > 0 lighter
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255];
    return '#' + c.map(v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k).toString(16).padStart(2, '0')).join('');
  };
  // the stencil motifs, drawn in a deeper tone of the dye over it
  const MOTIF = {
    plain: null,
    dots: { w: 7, h: 7, d: 'M1.75 1.75m-.75 0a.75 .75 0 1 0 1.5 0a.75 .75 0 1 0-1.5 0M5.25 5.25m-.75 0a.75 .75 0 1 0 1.5 0a.75 .75 0 1 0-1.5 0', fill: true },
    kikko: { w: 9, h: 5.196, d: 'M0 2.598L1.5 0H4.5L6 2.598L4.5 5.196H1.5ZM6 2.598H9', fill: false },
    hishi: { w: 7, h: 7, d: 'M3.5 0L7 3.5L3.5 7L0 3.5Z', fill: false },
    uroko: { w: 8, h: 7, d: 'M0 7L4 0L8 7Z', fill: true },
  };
  function dyePattern(id, color, motif, scale = 1) {
    const m = MOTIF[motif];
    const pat = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: (m ? m.w : 8) * scale, height: (m ? m.h : 8) * scale }, defs);
    el('rect', { width: '100%', height: '100%', fill: color }, pat);
    if (m) el('path', { d: m.d, transform: `scale(${scale})`, fill: m.fill ? shade(color, -.22) : 'none', stroke: m.fill ? 'none' : shade(color, -.25), 'stroke-width': .6, opacity: .75 }, pat);
    return `url(#${id})`;
  }
  const clanColor = c => DYES[CLANS[c].dye];
  for (const [id, c] of Object.entries(CLANS)) dyePattern('dye-' + id, DYES[c.dye], c.motif);
  // undyed cotton: land held by no single power, flecked like raw cloth
  {
    const pat = el('pattern', { id: 'dye-none', patternUnits: 'userSpaceOnUse', width: 6, height: 6 }, defs);
    el('rect', { width: 6, height: 6, fill: '#e2d9c5' }, pat);
    el('path', { d: 'M1 1h.8v.8H1zM4 3.5h.8v.8H4z', fill: '#b9ae97', opacity: .8 }, pat);
  }
  // a split province: kasuri stripes of the two holders
  const splitIds = new Map();
  function fillOf(h) {
    if (h == null) return 'url(#dye-none)';
    if (!Array.isArray(h)) return `url(#dye-${h})`;
    const key = h.map(x => x || 'none').join('-');
    if (!splitIds.has(key)) {
      const id = 'split-' + key;
      const W = 22, pat = el('pattern', { id, patternUnits: 'userSpaceOnUse', width: W, height: W, patternTransform: 'rotate(38)' }, defs);
      el('rect', { width: W, height: W, fill: `url(#dye-${h[0] || 'none'})` }, pat);
      // each band of threads was dyed out of register: the edge jumps sideways every few threads, and a half-dyed
      // feather runs past it, the blur that gives kasuri its name
      const L = [0, 2.6, .8, 3.2, 1.4, 2.9, .3, 2], R = [1.8, 0, 3, 1, 2.4, .5, 3.2, 1.2], step = W / 8;
      let d = '', f = '';
      for (let i = 0; i < 8; i++) {
        const y0 = i * step, y1 = y0 + step + .03, l = 9.5 + L[i], r = 19.5 + R[i];
        d += `M${l} ${y0}H${r}V${y1}H${l}Z`;
        f += `M${l - 1.6} ${y0 + step * .3}H${l}V${y0 + step * .7}H${l - 1.6}ZM${r} ${y0 + step * .2}H${r + 1.8}V${y0 + step * .6}H${r}Z`;
      }
      el('path', { d: f, fill: `url(#dye-${h[1] || 'none'})`, opacity: .55 }, pat);
      el('path', { d, fill: `url(#dye-${h[1] || 'none'})` }, pat);
      splitIds.set(key, `url(#${id})`);
    }
    return splitIds.get(key);
  }
  // the swatch for a clan in the panel, as a tiny svg using the same pattern idea at a bigger scale
  function swatch(c, cls = 'swatch') {
    if (!c) return `<svg class="${cls}" viewBox="0 0 22 22" aria-hidden="true"><rect width="22" height="22" fill="#e2d9c5"/></svg>`;
    const k = CLANS[c], m = MOTIF[k.motif], col = DYES[k.dye];
    const motif = m ? `<pattern id="sw-${c}" patternUnits="userSpaceOnUse" width="${m.w * 1.4}" height="${m.h * 1.4}"><path d="${m.d}" transform="scale(1.4)" fill="${m.fill ? shade(col, -.22) : 'none'}" stroke="${m.fill ? 'none' : shade(col, -.25)}" stroke-width=".6" opacity=".8"/></pattern>` : '';
    return `<svg class="${cls}" viewBox="0 0 22 22" aria-hidden="true"><defs>${motif}</defs><rect width="22" height="22" fill="${col}"/>${m ? `<rect width="22" height="22" fill="url(#sw-${c})"/>` : ''}</svg>`;
  }

  // ---------- the map ----------

  // every shape once in <defs>, then used by the coast glow, the land, the dye mottling and the soak overlays
  const shapeIds = {}; // province -> [shape ids]
  let n = 0;
  const addShape = s => { const id = 's' + n++; el('path', { id, d: s.d, transform: `matrix(${s.m.join(' ')})` }, defs); return id; };
  for (const p of PIDS) shapeIds[p] = P[p].shapes.map(addShape);
  const ezoIds = GEO.ezo.map(addShape), lakeIds = GEO.lakes.map(addShape);
  const allLand = [...PIDS.flatMap(p => shapeIds[p]), ...ezoIds];

  // the indigo is lighter near the coasts, where the resist paste kept the dye from biting deep
  const glow = el('filter', { id: 'glow', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: .035, numOctaves: 2, seed: 4, result: 'n' }, glow);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 16, result: 'd' }, glow);
  el('feGaussianBlur', { in: 'd', stdDeviation: 6 }, glow);
  const coast = el('g', { id: 'coast', filter: 'url(#glow)', opacity: .9 }, svg);
  for (const id of allLand) el('use', { href: '#' + id, fill: 'none', stroke: '#3a4f95', 'stroke-width': 10 }, coast);
  const ezo = el('g', { id: 'ezo' }, svg);
  for (const id of ezoIds) el('use', { href: '#' + id }, ezo);

  const land = el('g', { id: 'land' }, svg), provG = {};
  for (const p of PIDS) {
    const g = el('g', { class: 'prov', 'data-p': p }, land);
    for (const id of shapeIds[p]) el('use', { href: '#' + id }, g);
    provG[p] = g;
  }
  // dye never takes evenly: a mottled noise over all the land, multiplied in
  {
    const cv = document.createElement('canvas'), N = 256;
    cv.width = cv.height = N;
    const cx = cv.getContext('2d'), img = cx.createImageData(N, N);
    const octave = cells => { // a wrapping grid of random values, smoothly interpolated
      const g = Array.from({ length: cells * cells }, Math.random), at = (i, j) => g[(j % cells) * cells + (i % cells)];
      return (x, y) => {
        const fx = x / N * cells, fy = y / N * cells, i = Math.floor(fx), j = Math.floor(fy);
        const u = (fx - i) ** 2 * (3 - 2 * (fx - i)), v = (fy - j) ** 2 * (3 - 2 * (fy - j));
        return (at(i, j) * (1 - u) + at(i + 1, j) * u) * (1 - v) + (at(i, j + 1) * (1 - u) + at(i + 1, j + 1) * u) * v;
      };
    };
    const o = [octave(4), octave(9), octave(23), octave(64)], w = [.45, .3, .17, .08];
    for (let i = 0; i < N * N; i++) {
      const x = i % N, y = i / N | 0, v = 178 + 77 * o.reduce((s, f, k) => s + f(x, y) * w[k], 0);
      img.data.set([v, v, v, 255], i * 4);
    }
    cx.putImageData(img, 0, 0);
    const pat = el('pattern', { id: 'mottle-pat', patternUnits: 'userSpaceOnUse', width: 230, height: 230 }, defs);
    el('image', { href: cv.toDataURL(), width: 230, height: 230 }, pat);
    const clip = el('clipPath', { id: 'landclip' }, defs);
    for (const p of PIDS) for (const id of shapeIds[p]) el('use', { href: '#' + id }, clip);
    el('rect', { id: 'mottle', x: -100, y: -100, width: 1000, height: 1000, fill: 'url(#mottle-pat)', 'clip-path': 'url(#landclip)' }, svg);
  }
  const soak = el('g', { id: 'soak' }, svg);
  const lakes = el('g', { id: 'lakes' }, svg);
  for (const id of lakeIds) el('use', { href: '#' + id }, lakes);
  const stitches = el('g', { id: 'stitches' }, svg);
  const labels = el('g', { id: 'labels' }, svg);
  const battles = el('g', { id: 'battles' }, svg);

  // frame the realm: Kyushu to Mutsu, with Ezo's southern tip just showing
  {
    const b = land.getBBox();
    const pad = 18;
    svg.setAttribute('viewBox', `${b.x - pad - 130} ${b.y - 40} ${b.width + pad * 2 + 130} ${b.height + 70}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  const center = p => [P[p].cx, P[p].cy];

  // ---------- painting a year ----------

  let shown = {}; // province -> fill currently painted
  const ghosts = {}; // province -> the soak still running over it
  function paintMap(animate) {
    const st = stateAt(year), prev = stateAt(Math.max(START, year - 1));
    for (const p of PIDS) {
      const f = fillOf(st[p]);
      if (shown[p] === f) continue;
      ghosts[p]?.();
      const old = shown[p];
      for (const u of provG[p].children) u.setAttribute('fill', f);
      shown[p] = f;
      if (animate && old && !reduced && Object.keys(ghosts).length < 30) soakIn(p, old, prev, st[p]);
    }
  }
  // the dye front wicks through the fibres instead of drawing a clean circle
  {
    const wick = el('filter', { id: 'wick', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: .09, numOctaves: 3, seed: 9, result: 'n' }, wick);
    el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 11 }, wick);
  }

  // the signature: the new dye soaks across the province from the conqueror's side; ahead of the front the old dye
  // lingers as a ghost, fading as it goes
  function soakIn(p, oldFill, prev, holder) {
    const conq = (Array.isArray(holder) ? holder : [holder]).find(c => c && !holders(prev[p]).includes(c));
    let src = center(p), best = Infinity;
    if (conq) for (const q of PIDS) {
      if (q === p || !holders(prev[q]).includes(conq)) continue;
      const d = Math.hypot(P[q].cx - P[p].cx, P[q].cy - P[p].cy);
      if (d < best) { best = d; src = center(q); }
    }
    const id = 'mask-' + p + '-' + Date.now();
    const mask = el('mask', { id, maskUnits: 'userSpaceOnUse', x: -200, y: -200, width: 1200, height: 1200 }, defs);
    const grad = el('radialGradient', { id: id + 'g' }, defs);
    el('stop', { offset: '72%', 'stop-color': '#000' }, grad);
    el('stop', { offset: '100%', 'stop-color': '#000', 'stop-opacity': 0 }, grad);
    el('rect', { x: -200, y: -200, width: 1200, height: 1200, fill: '#fff' }, mask);
    const circ = el('circle', { cx: src[0], cy: src[1], r: 0, fill: `url(#${id}g)`, filter: 'url(#wick)' }, mask);
    const g = el('g', { mask: `url(#${id})` }, soak);
    for (const s of shapeIds[p]) el('use', { href: '#' + s, fill: oldFill }, g);
    const box = provG[p].getBBox();
    const far = Math.max(...[[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
      .map(([x, y]) => Math.hypot(x - src[0], y - src[1]))) * 1.3;
    const near = best === Infinity ? 0 : Math.max(0, Math.hypot(P[p].cx - src[0], P[p].cy - src[1]) - Math.max(box.width, box.height) * .7);
    const t0 = performance.now(), dur = 1600;
    const end = () => { g.remove(); mask.remove(); grad.remove(); if (ghosts[p] === end) delete ghosts[p]; };
    ghosts[p] = end;
    const step = t => {
      if (!g.isConnected) return;
      const k = Math.min(1, Math.max(0, (t - t0) / dur)) /* the first frame's time can predate t0 */, e = 1 - (1 - k) ** 3; // dye spreads fast, then slowly
      circ.setAttribute('r', near + (far - near) * e);
      g.setAttribute('opacity', k < .45 ? 1 : 1 - (k - .45) / .55); // the old dye fades as the new one takes
      if (k < 1) return requestAnimationFrame(step);
      end();
    };
    requestAnimationFrame(step);
  }

  function paintLabels() {
    labels.replaceChildren();
    const st = stateAt(year), sums = {};
    for (const p of PIDS) {
      const hs = holders(st[p]), w = Array.isArray(st[p]) ? .5 : 1;
      for (const c of hs) {
        const s = sums[c] ||= { x: 0, y: 0, n: 0 };
        s.x += P[p].cx * w; s.y += P[p].cy * w; s.n += w;
      }
    }
    const placed = [], hits = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    for (const b of battles.children) { const [, x, y] = b.getAttribute('transform').match(/([-\d.]+) ([-\d.]+)/).map(Number); placed.push({ x: x - 7, y: y - 7, width: 14, height: 14 }); }
    for (const s of stitches.querySelectorAll('.stitch:not(.under)')) {
      const len = s.getTotalLength();
      for (let d = 0; d < len; d += 8) { const q = s.getPointAtLength(d); placed.push({ x: q.x - 2, y: q.y - 2, width: 4, height: 4 }); }
    }
    const scale = svg.getScreenCTM()?.a || 1; // map units to screen pixels
    for (const [c, s] of Object.entries(sums).sort((a, b) => b[1].n - a[1].n)) {
      if (s.n < 2) continue;
      const size = Math.min(17, 7 + Math.sqrt(s.n) * 2.6), x = s.x / s.n;
      const t = el('text', { class: 'clan-label', x, 'text-anchor': 'middle', 'font-size': size, 'stroke-width': size * .32, 'font-weight': 700 }, labels);
      t.textContent = CLANS[c].en.replace(/ \(.*/, '');
      const kanji = Math.max(size * .6, 10.5 / scale); // at least 10.5 px on screen, or not at all
      if (kanji <= size * .85) {
        const j = el('tspan', { x, dy: size * .7 + kanji * .9, 'font-size': kanji, 'font-weight': 400, 'letter-spacing': kanji * .14 }, t);
        j.textContent = CLANS[c].ja;
      }
      let ok = false;
      for (const dy of [0, -size * 1.3, size * 1.3, -size * 2.4, size * 2.4]) {
        t.setAttribute('y', s.y / s.n + dy);
        const b = t.getBBox();
        if (!placed.some(q => hits(b, q))) { placed.push(b); ok = true; break; }
      }
      if (!ok) t.remove(); // no room: the roster still names it
    }
  }

  // alliances as sashiko running stitches between the allies' lands; three or more as a stitched ring
  let drawnAlliances = '';
  function paintStitches() {
    const st = stateAt(year), active = ALLIANCES.filter(a => a[1] <= year && year <= a[2]);
    const anchors = c => {
      let x = 0, y = 0, k = 0;
      for (const p of PIDS) if (holders(st[p]).includes(c)) { x += P[p].cx; y += P[p].cy; k++; }
      return k ? [x / k, y / k] : null;
    };
    const fresh = new Set(active.map(a => a[0]).filter(id => !drawnAlliances.split(',').includes(id)));
    stitches.replaceChildren();
    for (const a of active) {
      const pts = a[3].map(anchors).filter(Boolean);
      if (pts.length < 2) continue;
      let d;
      if (pts.length === 2) {
        const [[x1, y1], [x2, y2]] = pts, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, len = Math.hypot(x2 - x1, y2 - y1);
        const bow = Math.min(60, len * .35); // a slack thread bows toward the open sea
        d = `M${x1} ${y1}Q${mx + (y2 - y1) / len * bow} ${my - (x2 - x1) / len * bow} ${x2} ${y2}`;
      } else {
        const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
        pts.sort((u, v) => Math.atan2(u[1] - cy, u[0] - cx) - Math.atan2(v[1] - cy, v[0] - cx));
        const mid = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
        const m0 = mid(pts[pts.length - 1], pts[0]);
        d = `M${m0[0]} ${m0[1]}` + pts.map((q, i) => { const m = mid(q, pts[(i + 1) % pts.length]); return `Q${q[0]} ${q[1]} ${m[0]} ${m[1]}`; }).join('') + 'Z';
      }
      el('path', { d, class: 'stitch under', 'stroke-width': 3.4, 'stroke-dasharray': '6 5', 'vector-effect': 'non-scaling-stroke' }, stitches);
      const s = el('path', { d, class: 'stitch', 'stroke-width': 1.7, 'stroke-dasharray': '6 5', 'vector-effect': 'non-scaling-stroke' }, stitches);
      if (fresh.has(a[0]) && !reduced) { s.style.setProperty('--len', s.getTotalLength()); s.classList.add('draw'); }
      for (const q of pts) el('circle', { cx: q[0], cy: q[1], r: 1.6, fill: '#efe6d3' }, stitches);
    }
    drawnAlliances = active.map(a => a[0]).join();
  }

  // battles of the last few years, as red cross-stitches; the newest is boldest
  function paintBattles() {
    battles.replaceChildren();
    for (const e of EVENTS) {
      if (e.year > year || year - e.year > 3) continue;
      const age = year - e.year, [x, y] = center(e.at), X = x + (e.dx || 0), Y = y + (e.dy || 0);
      const g = el('g', { class: 'battle' + (age === 0 ? ' now' : '') + (sel?.type === 'event' && sel.id === e.id ? ' sel' : ''), transform: `translate(${X} ${Y})`, opacity: [1, .75, .55, .4][age], tabindex: 0, role: 'button', 'aria-label': `${e.en}, ${e.year}` }, battles);
      g.dataset.e = e.id;
      el('circle', { class: 'ring', r: 2 }, g);
      el('circle', { class: 'hit', r: 10 }, g);
      g.insertAdjacentHTML('beforeend', stitchMark(e.kind === 'battle' ? 6 : 4.4));
    }
  }

  // a cross-stitch in red thread: the top stitch whole, the under stitch broken where it passes beneath, a sheen on each
  function stitchMark(s) {
    const top = `M${-s} ${-s * .82}L${s} ${s * .9}`;
    const under = `M${s * .92} ${-s}L${s * .22} ${-s * .18}M${-s * .2} ${s * .22}L${-s * .88} ${s * .95}`;
    const sheen = d => `<path d="${d}" stroke="#ffb29e" stroke-width="${s * .12}" stroke-linecap="round" opacity=".75" transform="translate(${-s * .08} ${-s * .08})"/>`;
    // where the thread goes down into the cloth: a small hole at each end of each stitch
    const holes = [[-s, -s * .82], [s, s * .9], [s * .92, -s], [-s * .88, s * .95]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${s * .2}" fill="#13152f"/>`).join('');
    return `<path class="x-under" d="${top}${under}" stroke-width="${s * .78}"/>` +
      `<path class="x" d="${under}" stroke-width="${s * .42}" style="stroke:#b8402b"/>` +
      `<path class="x" d="${top}" stroke-width="${s * .42}"/>${sheen(top)}${holes}`;
  }

  function paintWhen() {
    $('#year').textContent = year;
    const era = eraOf(year, ERAS), ph = phaseOf(year, PHASES);
    $('#era').innerHTML = `<span lang="ja">${era.ja}${kanjiYear(era.n)}年</span><span class="roman">${era.en} ${era.n}</span>`;
    $('#phase').innerHTML = `${esc(ph.en)}`;
    document.title = `${year} · Sengoku 戦国`;
  }

  // ---------- the side panel ----------

  const side = $('#side');
  const fmt = v => (v % 1 ? (Math.floor(v) || '') + '½' : String(v));
  const clanName = c => c ? `${esc(CLANS[c].en)} <span lang="ja">${CLANS[c].ja}</span>` : 'Local lords';
  const holderText = h => h == null ? 'No single power: many local lords' : holders(h).length < (Array.isArray(h) ? 2 : 1) ? `${clanName(holders(h)[0])} and local lords` : holders(h).map(clanName).join(' / ');
  const seenBy = {}; // clan -> first year it held land
  STATES.forEach((s, i) => { for (const h of Object.values(s)) for (const c of holders(h)) if (!(c in seenBy)) seenBy[c] = START + i; });

  function renderRoster() {
    const cnt = counts(stateAt(year));
    const now = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || CLANS[a].en.localeCompare(CLANS[b].en));
    const inCamp = c => year === 1600 && Object.values(CAMPS_1600).flat().includes(c);
    const fallen = Object.keys(seenBy).filter(c => seenBy[c] <= year && lastHeld(c) < year && !inCamp(c)).sort((a, b) => lastHeld(b) - lastHeld(a));
    const local = Object.values(stateAt(year)).filter(h => h == null || (Array.isArray(h) && h.includes(null))).length;
    const members = c => CAMPS_1600[c] && year === 1600 ? `<li><ul class="members" aria-label="Houses of the ${CLANS[c].en}">${CAMPS_1600[c].map(m => `<li><button data-clan="${m}">${swatch(m)}${esc(CLANS[m].en)}</button></li>`).join('')}</ul></li>` : '';
    const row = (c, gone) => `<li><button data-clan="${c}" class="${gone ? 'gone' : ''}">${gone ? '<span class="swatch empty" aria-hidden="true"></span>' : swatch(c)}<span class="name">${clanName(c)}</span><span class="n">${gone ? lastHeld(c) : fmt(cnt[c])}</span></button></li>${gone ? '' : members(c)}`;
    side.innerHTML = `<h2>The great houses<span class="count">${year}</span></h2>
      <ol class="roster" aria-label="Clans ranked by provinces held">${now.map(c => row(c, false)).join('')}</ol>
      <p class="local"><span class="swatch none" aria-hidden="true"></span>${local} of 68 provinces split among local lords</p>
      ${year === 1600 ? '<p class="local">In 1600 the provinces are dyed by the side their lords took at Sekigahara.</p>' : ''}
      ${fallen.length ? `<p class="sep">Fallen, with the last year they held land</p><ol class="roster">${fallen.map(c => row(c, true)).join('')}</ol>` : ''}
      <p class="note">Each province is dyed for the power that dominated it; many were shared among small lords, so this is an approximation. Click a province, a clan or a red cross for its story.<br><br>Province map: “Provinces of Japan with names” by Ash_Crow, Wikimedia Commons, CC BY 2.5. Typefaces: Shippori Mincho B1 and Zen Kaku Gothic New, SIL Open Font License.</p>`;
  }
  const lastHeldCache = {};
  function lastHeld(c) {
    if (c in lastHeldCache) return lastHeldCache[c];
    let last = null;
    STATES.forEach((s, i) => { if (Object.values(s).some(h => holders(h).includes(c))) last = START + i; });
    if (Object.values(CAMPS_1600).flat().includes(c) && last === 1599) last = 1600; // held land under an army in 1600
    return (lastHeldCache[c] = last);
  }

  // a picture from the article, mounted like a print stitched onto the lining, with its author and licence
  const plate = key => {
    const im = typeof IMAGES !== 'undefined' && IMAGES[key];
    if (!im) return '';
    const tall = im.h > im.w * 1.1;
    return `<figure class="plate${tall ? ' tall' : ''}"><img src="${im.src}" alt="${esc(im.desc || im.file.replace(/\.\w+$/, '').replace(/_/g, ' '))}" width="${im.w}" height="${im.h}" loading="lazy" decoding="async">` +
      `<figcaption>${esc(im.artist || 'Unknown')} · ${esc(im.licence)} · Wikimedia Commons</figcaption></figure>`;
  };

  const back = () => `<button class="back" data-act="back"><svg viewBox="0 0 8 10" aria-hidden="true"><path d="M8 0v10L0 5z"/></svg>All clans in ${year}</button>`;

  function renderClan(c) {
    const k = CLANS[c], cnt = counts(stateAt(year))[c] || 0;
    const evs = EVENTS.filter(e => (e.sides || []).includes(c));
    const als = ALLIANCES.filter(a => a[3].includes(c));
    side.innerHTML = `${back()}
      <div class="head">${swatch(c)}<h3>${esc(k.en)}<span lang="ja">${k.ja}</span></h3></div>
      ${plate('clan:' + c)}
      <p class="sub">${esc(k.title)} · ${cnt ? `${fmt(cnt)} province${cnt === 1 ? '' : 's'} in ${year}` : seenBy[c] && seenBy[c] > year ? `holds land from ${seenBy[c]}` : lastHeld(c) ? `last held land in ${lastHeld(c)}` : 'no land of its own'}</p>
      <p class="lede">${esc(k.short)}</p>
      <button class="more" data-act="more" aria-expanded="false">Read the full story</button>
      <div class="long" hidden>${esc(k.long)}</div>
      <div class="block"><h4>Key people</h4><ul class="people">${k.people.map(([en, ja, life, note]) => `<li><b>${esc(en)}</b><span lang="ja">${ja}</span><span class="life">${life}</span><p>${esc(note)}</p></li>`).join('')}</ul></div>
      ${als.length ? `<div class="block"><h4>Alliances</h4><ul class="links">${als.map(a => `<li><button data-year="${a[1]}" class="${a[1] <= year && year <= a[2] ? 'now' : ''}"><span class="y">${a[1]}</span><span>${esc(a[4])} <span lang="ja" style="color:var(--muted)">${a[5]}</span>, ${a[1]}–${a[2]}: ${esc(a[6])}</span></button></li>`).join('')}</ul></div>` : ''}
      ${evs.length ? `<div class="block"><h4>Battles and turning points</h4><ul class="links">${evs.map(e => `<li><button data-event="${e.id}" class="war"><span class="y">${e.year}</span><span>${esc(e.en)}</span></button></li>`).join('')}</ul></div>` : ''}`;
  }

  function renderProvince(p) {
    const st = stateAt(year)[p], hist = CHANGES.filter(x => x[1] === p);
    let lastNote = BASE_NOTES[p] || null;
    for (const x of hist) if (x[0] <= year && x[3]) lastNote = x[3];
    side.innerHTML = `${back()}
      <div class="head">${swatch(Array.isArray(st) ? holders(st)[0] : st)}<h3>${esc(P[p].en)}<span lang="ja">${P[p].ja}</span></h3></div>
      <p class="sub">${year} · ${holderText(st)}</p>
      ${lastNote ? `<p class="lede">${esc(lastNote)}</p>` : ''}
      <div class="block"><h4>Who held ${esc(P[p].en)}, ${START}–${END}</h4><canvas class="strip" data-p="${p}"></canvas>
      <ul class="links"><li><button data-year="${START}" class="${year >= START ? 'now' : ''}"><span class="y">${START}</span><span>${holderText(BASE[p])}${BASE_NOTES[p] ? '. ' + esc(BASE_NOTES[p]) : ''}</span></button></li>
      ${hist.map(x => `<li><button data-year="${x[0]}" class="${x[0] <= year ? 'now' : ''}"><span class="y">${x[0]}</span><span>${holderText(x[2])}${x[3] ? '. ' + esc(x[3]) : ''}</span></button></li>`).join('')}</ul></div>
      ${EVENTS.some(e => e.at === p) ? `<div class="block"><h4>Fought here</h4><ul class="links">${EVENTS.filter(e => e.at === p).map(e => `<li><button data-event="${e.id}" class="war"><span class="y">${e.year}</span><span>${esc(e.en)}</span></button></li>`).join('')}</ul></div>` : ''}`;
    drawStrip(side.querySelector('canvas.strip'), p);
  }

  function renderEvent(id) {
    const e = EVENTS.find(x => x.id === id), era = eraOf(e.year, ERAS);
    const sides = [...new Set((e.sides || []).filter(Boolean))];
    side.innerHTML = `${back()}
      <div class="head"><svg class="swatch mark" viewBox="-20 -20 40 40" aria-hidden="true" style="box-shadow:none">${stitchMark(13)}</svg><h3>${esc(e.en)}<span lang="ja">${e.ja}</span></h3></div>
      ${plate('event:' + e.id)}
      <p class="sub">${e.year} · ${era.en} ${era.n} · ${esc(P[e.at].en)} <span lang="ja">${P[e.at].ja}</span></p>
      ${sides.length ? `<div class="sides">${sides.map(c => `<button class="chip" data-clan="${c}">${swatch(c)}${clanName(c)}${e.winner === c ? '<span class="won">Won</span>' : ''}</button>`).join('')}</div>` : ''}
      <p class="lede">${esc(e.short)}</p>
      <div class="long" style="margin-top:1rem">${esc(e.long)}</div>`;
  }

  function renderSide() {
    if (!sel) renderRoster();
    else if (sel.type === 'clan') renderClan(sel.id);
    else if (sel.type === 'province') renderProvince(sel.id);
    else renderEvent(sel.id);
    for (const g of land.querySelectorAll('.prov.sel')) g.classList.remove('sel');
    if (sel?.type === 'province') provG[sel.id].classList.add('sel');
  }

  // ---------- the woven band ----------

  // each year a column of 68 threads, one per province, grouped by clan in the order the clans first held land
  const order = Object.keys(seenBy).sort((a, b) => seenBy[a] - seenBy[b] || CLANS[a].en.localeCompare(CLANS[b].en));
  const rank = c => (c == null ? 1e3 : order.indexOf(c));
  function threadsOf(st) {
    const t = [];
    for (const h of Object.values(st)) {
      if (Array.isArray(h)) t.push([h[0], .5], [h[1], .5]);
      else t.push([h, 1]);
    }
    return t.sort((a, b) => rank(a[0]) - rank(b[0]));
  }
  const weave = $('#weave'), loom = $('#loom');
  const xOf = y => (y - START + .5) / (END - START + 1);
  function drawWeave() {
    const r = weave.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    weave.width = Math.round(r.width * dpr); weave.height = Math.round(r.height * dpr);
    const cx = weave.getContext('2d'), W = weave.width, H = weave.height, cols = END - START + 1;
    for (let i = 0; i < cols; i++) {
      const x0 = Math.round(i / cols * W), x1 = Math.round((i + 1) / cols * W);
      let y = 0;
      for (const [c, w] of threadsOf(STATES[i])) {
        const h = w / 68 * H;
        cx.fillStyle = c ? clanColor(c) : '#d8cfba';
        cx.fillRect(x0, y, x1 - x0, h + .6);
        y += h;
      }
      // the weft: every other column a shade darker, like threads passing under
      if (i % 2) { cx.fillStyle = 'rgba(19,21,47,.16)'; cx.fillRect(x0, 0, x1 - x0, H); }
    }
    for (let y = 0; y < H; y += 3 * dpr) { cx.fillStyle = 'rgba(19,21,47,.13)'; cx.fillRect(0, y, W, dpr); } // the warp
  }
  function drawStrip(cv, p) {
    const r = cv.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    const cx = cv.getContext('2d'), W = cv.width, H = cv.height, cols = END - START + 1;
    for (let i = 0; i < cols; i++) {
      const x0 = Math.round(i / cols * W), x1 = Math.round((i + 1) / cols * W), h = STATES[i][p];
      const parts = Array.isArray(h) ? h : [h];
      parts.forEach((c, j) => { cx.fillStyle = c ? clanColor(c) : '#d8cfba'; cx.fillRect(x0, j * H / parts.length, x1 - x0, H / parts.length + .5); });
    }
    const xh = Math.round(xOf(year) * W);
    cx.fillStyle = '#efe6d3'; cx.fillRect(xh - dpr, 0, 2 * dpr, H);
  }
  {
    let ticks = '';
    for (let y = 1470; y <= 1600; y += 10) ticks += `<span class="${y % 50 ? 'minor' : ''}" style="left:${xOf(y) * 100}%">${y}</span>`;
    $('#ticks').innerHTML = ticks;
    let marks = '';
    const named = { kamigoryo: 'Ōnin', okehazama: 'Okehazama', honnoji: 'Honnō-ji', odawara: 'Odawara', sekigahara: 'Sekigahara' };
    for (const e of EVENTS) if (e.kind === 'battle') marks += `<i class="w" style="left:${xOf(e.year) * 100}%"></i>`;
    for (const e of EVENTS) if (e.threshold) marks += `<span class="t" style="left:${xOf(e.year) * 100}%">${named[e.id]}</span>`;
    $('#marks').innerHTML = marks;
  }

  // ---------- moving through time ----------

  function setYear(y, animate = false) {
    y = Math.max(START, Math.min(END, y));
    if (y === year && shown.owari) return;
    const step = y - year;
    year = y;
    paintMap(animate && step > 0 && step <= 3);
    paintStitches(); paintBattles(); paintLabels(); paintWhen();
    $('#head').style.left = xOf(year) * 100 + '%';
    loom.setAttribute('aria-valuenow', year);
    loom.setAttribute('aria-valuetext', `${year}, ${phaseOf(year, PHASES).en}`);
    renderSide();
  }

  let timer = 0;
  function flash(e) {
    const f = $('#flash');
    f.querySelector('.ja').textContent = e.ja;
    f.querySelector('.en').textContent = e.en;
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  }
  function tick() {
    if (year >= END) return stop();
    setYear(year + 1, true);
    const hit = EVENTS.find(e => e.year === year && e.threshold) || EVENTS.find(e => e.year === year && e.kind === 'battle');
    if (hit) flash(hit);
    // thresholds hold the moment; ordinary years pass quickly
    timer = setTimeout(tick, EVENTS.some(e => e.year === year && e.threshold) ? 3200 : hit ? 1500 : 760);
  }
  function play() {
    if (year >= END) setYear(START);
    document.body.classList.add('started');
    document.body.classList.add('playing', 'started');
    $('#play').setAttribute('aria-label', 'Pause');
    timer = setTimeout(tick, 400);
  }
  function stop() {
    clearTimeout(timer); timer = 0;
    document.body.classList.remove('playing');
    $('#play').setAttribute('aria-label', 'Play the period');
  }
  $('#play').addEventListener('click', () => (timer ? stop() : play()));

  // scrub the band
  const yearAtX = x => { const r = weave.getBoundingClientRect(); return START + Math.floor((x - r.left) / r.width * (END - START + 1)); };
  loom.addEventListener('pointerdown', e => {
    stop(); document.body.classList.add('started'); loom.setPointerCapture(e.pointerId); setYear(yearAtX(e.clientX));
    const move = ev => setYear(yearAtX(ev.clientX), true); // scrubbing forward soaks the dye in too
    const up = () => { loom.removeEventListener('pointermove', move); loom.removeEventListener('pointerup', up); };
    loom.addEventListener('pointermove', move); loom.addEventListener('pointerup', up);
  });
  loom.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
    if (d) { stop(); document.body.classList.add('started'); setYear(year + d, Math.abs(d) === 1 && d > 0); e.preventDefault(); }
    if (e.key === 'Home') { stop(); setYear(START); e.preventDefault(); }
    if (e.key === 'End') { stop(); setYear(END); e.preventDefault(); }
  });
  addEventListener('keydown', e => {
    if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); timer ? stop() : play(); }
    if (e.key === 'Escape' && sel) { sel = null; renderSide(); paintBattles(); paintLabels(); }
  });

  // ---------- pointing at things ----------

  const tip = $('#tip'), cloth = $('#cloth');
  land.addEventListener('pointermove', e => {
    const g = e.target.closest('.prov');
    if (!g) return;
    const p = g.dataset.p, h = stateAt(year)[p], r = cloth.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(P[p].en)}</b><span class="ja" lang="ja">${P[p].ja}</span><span class="who">${holderText(h)}</span>`;
    const x = Math.min(e.clientX - r.left + 16, r.width - tip.offsetWidth - 8);
    tip.style.left = x + 'px'; tip.style.top = (e.clientY - r.top + 18) + 'px';
    tip.classList.add('on');
  });
  land.addEventListener('pointerleave', () => tip.classList.remove('on'));
  svg.addEventListener('click', e => {
    const b = e.target.closest('.battle'), g = e.target.closest('.prov');
    sel = b ? { type: 'event', id: b.dataset.e } : g ? { type: 'province', id: g.dataset.p } : null;
    renderSide(); paintBattles(); paintLabels();
  });
  battles.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  side.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.act === 'back') { sel = null; renderSide(); paintBattles(); paintLabels(); return; }
    if (b.dataset.act === 'more') {
      const long = side.querySelector('.long'); long.hidden = !long.hidden;
      b.setAttribute('aria-expanded', !long.hidden); b.textContent = long.hidden ? 'Read the full story' : 'Show less';
      return;
    }
    if (b.dataset.clan) { sel = { type: 'clan', id: b.dataset.clan }; renderSide(); side.scrollTop = 0; return; }
    if (b.dataset.event) { stop(); const ev = EVENTS.find(x => x.id === b.dataset.event); sel = { type: 'event', id: ev.id }; setYear(ev.year); side.scrollTop = 0; return; }
    if (b.dataset.year) { stop(); setYear(+b.dataset.year); }
  });

  addEventListener('resize', () => { drawWeave(); paintLabels(); if (sel?.type === 'province') renderSide(); });
  document.fonts.ready.then(() => { drawWeave(); setYear(START); });
  drawWeave();
  year = START; setYear(START);
})();
