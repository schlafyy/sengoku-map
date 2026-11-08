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

  let year = START, sel = null; // sel: {type: 'clan'|'province'|'event'|'castle'|'landmark', id}
  let landMode = false; // the landmarks view: no wars or dynasties, the land itself

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
  // crests come as black drawings; this keeps their dark parts as cream cotton the dye never reached
  {
    const f = el('filter', { id: 'resist', 'color-interpolation-filters': 'sRGB' }, defs);
    el('feColorMatrix', { type: 'matrix', values: '0 0 0 0 .937  0 0 0 0 .902  0 0 0 0 .827  -.33 -.33 -.33 1 0' }, f);
    // for crests drawn white on a dark ground: only the light parts resist; green alone keeps grey figures and drops coloured grounds like Mori's red
    const g = el('filter', { id: 'resist-inv', 'color-interpolation-filters': 'sRGB' }, defs);
    el('feColorMatrix', { type: 'matrix', values: '0 0 0 0 .937  0 0 0 0 .902  0 0 0 0 .827  0 2.2 0 0 -.45' }, g);
    // for crests cut as holes in a dark square: the holes resist; the region stops at the image's own box
    const h = el('filter', { id: 'resist-holes', x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' }, defs);
    el('feColorMatrix', { type: 'matrix', values: '0 0 0 0 .937  0 0 0 0 .902  0 0 0 0 .827  0 0 0 -1 1' }, h);
  }
  const crestOf = c => (typeof CRESTS !== 'undefined' && CRESTS[c]) || null;
  const resist = cr => `url(#resist${cr.invert === 'holes' ? '-holes' : cr.invert ? '-inv' : ''})`;
  // the swatch for a clan in the panel, as a tiny svg using the same pattern idea at a bigger scale; the crest on it
  function swatch(c, cls = 'swatch') {
    if (!c) return `<svg class="${cls}" viewBox="0 0 22 22" aria-hidden="true"><rect width="22" height="22" fill="#e2d9c5"/></svg>`;
    const k = CLANS[c], m = MOTIF[k.motif], col = DYES[k.dye];
    const motif = m ? `<pattern id="sw-${c}" patternUnits="userSpaceOnUse" width="${m.w * 1.4}" height="${m.h * 1.4}"><path d="${m.d}" transform="scale(1.4)" fill="${m.fill ? shade(col, -.22) : 'none'}" stroke="${m.fill ? 'none' : shade(col, -.25)}" stroke-width=".6" opacity=".8"/></pattern>` : '';
    const cr = crestOf(c);
    return `<svg class="${cls}" viewBox="0 0 22 22" aria-hidden="true"><defs>${motif}</defs><rect width="22" height="22" fill="${col}"/>${m ? `<rect width="22" height="22" fill="url(#sw-${c})"/>` : ''}` +
      `${cr ? `<image href="${cr.src}" x="3" y="3" width="16" height="16" filter="${resist(cr)}"/>` : ''}</svg>`;
  }

  // ---------- the map ----------

  // every shape once in <defs>, then used by the coast glow, the land, the dye mottling and the soak overlays
  const shapeIds = {}; // province -> [shape ids]
  let n = 0;
  const addShape = s => { const id = 's' + n++; el('path', { id, d: s.d, transform: `matrix(${s.m.join(' ')})`, 'vector-effect': 'non-scaling-stroke' }, defs); return id; };
  for (const p of PIDS) shapeIds[p] = P[p].shapes.map(addShape);
  const ezoIds = GEO.ezo.map(addShape), lakeIds = GEO.lakes.map(addShape);
  const allLand = [...PIDS.flatMap(p => shapeIds[p]), ...ezoIds];

  // the indigo is lighter near the coasts, where the resist paste kept the dye from biting deep
  const glow = el('filter', { id: 'glow', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: .035, numOctaves: 2, seed: 4, result: 'n' }, glow);
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 16, result: 'd' }, glow);
  el('feGaussianBlur', { in: 'd', stdDeviation: 6 }, glow);
  // seigaiha: the blue-sea-waves stencil, faintly resist-printed over the whole sea (a mask, so each row of scales hides the one behind)
  {
    const R = 14, pat = el('pattern', { id: 'seigaiha', patternUnits: 'userSpaceOnUse', width: R * 2, height: R }, defs);
    for (const [x, y] of [[0, -R / 2], [R * 2, -R / 2], [R, 0], [0, R / 2], [R * 2, R / 2], [R, R], [0, R * 1.5], [R * 2, R * 1.5]])
      for (const k of [1, .75, .5, .25]) el('circle', { cx: x, cy: y, r: R * k - .4, fill: k === 1 ? '#000' : 'none', stroke: '#fff', 'stroke-width': .7 }, pat);
    const mask = el('mask', { id: 'waves', maskUnits: 'userSpaceOnUse', x: -2000, y: -2000, width: 5000, height: 5000 }, defs);
    el('rect', { x: -2000, y: -2000, width: 5000, height: 5000, fill: 'url(#seigaiha)' }, mask);
    el('rect', { id: 'sea-waves', x: -2000, y: -2000, width: 5000, height: 5000, fill: '#efe6d3', mask: 'url(#waves)' }, svg);
  }
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
  const castlesG = el('g', { id: 'castles' }, svg);
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

  // ---------- zoom and pan ----------
  const HOME = (v => ({ x: v.x, y: v.y, width: v.width, height: v.height }))(svg.viewBox.baseVal);
  const vb = { x: HOME.x, y: HOME.y, w: HOME.width, h: HOME.height };
  let zoom = 1, repaintQueued = false;
  const MAX_ZOOM = 6;
  const toMap = (cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
  function applyView() {
    // keep the view over the map: no panning off into empty sea
    vb.x = Math.min(Math.max(vb.x, HOME.x - vb.w * .25), HOME.x + HOME.width - vb.w * .75);
    vb.y = Math.min(Math.max(vb.y, HOME.y - vb.h * .25), HOME.y + HOME.height - vb.h * .75);
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    zoom = HOME.width / vb.w;
    document.body.classList.toggle('zoomed', zoom > 1.05);
    if (!repaintQueued) { repaintQueued = true; requestAnimationFrame(() => { repaintQueued = false; paintStitches(); paintBattles(); paintCastles(); paintLandmarks(); paintLabels(); }); }
  }
  function zoomAt(f, cx, cy) {
    const pt = toMap(cx, cy), w = Math.min(HOME.width, Math.max(HOME.width / MAX_ZOOM, vb.w / f)), k = w / vb.w;
    vb.x = pt.x - (pt.x - vb.x) * k; vb.y = pt.y - (pt.y - vb.y) * k; vb.w = w; vb.h *= k;
    applyView();
  }
  const zoomBy = f => { const r = svg.getBoundingClientRect(); zoomAt(f, r.left + r.width / 2, r.top + r.height / 2); };
  const zoomHome = () => { Object.assign(vb, { x: HOME.x, y: HOME.y, w: HOME.width, h: HOME.height }); applyView(); };
  svg.addEventListener('wheel', e => { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * .0016), e.clientX, e.clientY); }, { passive: false });
  // drag to pan, pinch to zoom; a drag never counts as a click
  const pointers = new Map();
  let dragged = false, pinchFrom = 0;
  svg.addEventListener('pointerdown', e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY });
    dragged = false;
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinchFrom = Math.hypot(a.x - b.x, a.y - b.y); }
  });
  svg.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    if (pointers.size === 2) {
      p.x = e.clientX; p.y = e.clientY;
      const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchFrom) zoomAt(d / pinchFrom, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinchFrom = d; dragged = true;
      return;
    }
    if (!dragged && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < 5) return;
    if (!dragged) { dragged = true; svg.setPointerCapture(e.pointerId); svg.classList.add('panning'); tip.classList.remove('on'); }
    const k = 1 / svg.getScreenCTM().a; // screen px to map units
    vb.x -= (e.clientX - p.x) * k; vb.y -= (e.clientY - p.y) * k;
    p.x = e.clientX; p.y = e.clientY;
    applyView();
  });
  const release = e => { pointers.delete(e.pointerId); pinchFrom = 0; svg.classList.remove('panning'); };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  const ezoTip = (() => { // Hakodate, on the Oshima peninsula at Ezo's south-western tip
    const big = [...ezo.children].map(u => u.getBBox()).sort((a, b) => b.width * b.height - a.width * a.height)[0];
    return big ? [big.x + big.width * .2, big.y + big.height * .93] : [0, 0];
  })();
  function markAt(e) {
    if (e.at === 'ezo') return ezoTip;
    const [x, y] = center(e.at);
    if (e.abroad === 'west') return [x - 46, y + (e.dy || 0)];
    if (e.abroad === 'east') return [x + 80, y + 30 + (e.dy || 0)];
    if (e.abroad === 'south') return [x - 6, y + 52];
    return [x + (e.dx || 0), y + (e.dy || 0)];
  }

  // ---------- painting a year ----------

  let shown = {}; // province -> fill currently painted
  const ghosts = {}; // province -> the soak still running over it
  function paintMap(animate) {
    const st = stateAt(year), prev = stateAt(Math.max(START, year - 1));
    let ezoHolder = null;
    for (const [y, h] of EZO_HOLDERS) if (y <= year) ezoHolder = h;
    for (const u of ezo.children) u.style.fill = ezoHolder ? fillOf(ezoHolder) : '';
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

  // each clan's crest, resist-dyed into the largest province it holds, for every clan with a crest and two provinces
  const crestsG = el('g', { id: 'crests' });
  land.after(crestsG);
  // the landmarks view: the land coloured by height like an atlas, in dye colours (tools/terrain.py, on the relief's grid)
  const reliefG = el('g', { id: 'relief', 'clip-path': 'url(#allclip)' });
  land.before(reliefG); // under the provinces, which go clear in this view so their borders print over it
  {
    const clip = el('clipPath', { id: 'allclip' }, defs);
    for (const id of allLand) el('use', { href: '#' + id }, clip);
    el('image', { href: 'images/terrain.jpg', x: RELIEF.x, y: RELIEF.y, width: RELIEF.width, height: RELIEF.height, preserveAspectRatio: 'none' }, reliefG);
  }
  const provArea = {};
  function paintCrests(st, realm) {
    crestsG.replaceChildren();
    const best = {};
    for (const p of PIDS) {
      if (Array.isArray(st[p]) || !st[p] || !crestOf(st[p])) continue;
      const b = provArea[p] ||= provG[p].getBBox(), a = b.width * b.height;
      if (!best[st[p]] || a > best[st[p]].a) best[st[p]] = { p, a, b };
    }
    const cnt = counts(st);
    for (const [c, { p, b }] of Object.entries(best)) {
      if ((cnt[c] || 0) < 2) continue;
      const size = Math.min(26, Math.max(9, Math.min(b.width, b.height) * .5));
      el('image', { href: crestOf(c).src, x: P[p].cx - size / 2, y: P[p].cy - size / 2, width: size, height: size, filter: resist(crestOf(c)),
                    class: 'crest' + (realm && !realm.clans.includes(c) ? ' dim' : '') }, crestsG);
    }
  }
  const realm0 = () => followRealm();

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
    // the overlays drawn over the map (the year, the zoom buttons) are no-go areas for labels
    for (const id of ['#when', '#zoom', '#mode']) {
      const r = $(id).getBoundingClientRect(), a = toMap(r.left, r.top), b = toMap(r.right, r.bottom);
      placed.push({ x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y });
    }
    const scale = svg.getScreenCTM()?.a || 1; // map units to screen pixels
    // close in, each province shows its own name where there is room
    const provinceNames = () => {
      if (zoom < 2.2) return;
      const fs = 12.5 / scale;
      for (const p of PIDS) {
        const t = el('text', { class: 'prov-label', x: P[p].cx, y: P[p].cy, 'text-anchor': 'middle', 'font-size': fs, 'stroke-width': fs * .3 }, labels);
        t.textContent = P[p].en + ' ';
        const j = el('tspan', { 'font-size': fs * .95 }, t);
        j.textContent = P[p].ja;
        const b = t.getBBox();
        if (placed.some(q => hits(b, q))) t.remove(); else placed.push(b);
      }
    };
    if (landMode) { // landmark names beside their marks once there is room, then the provinces
      const mk = 6.5 * markScale();
      const pts = LANDMARKS.map(l => [l, lmAt(l)]), isCity = ([l]) => l.kind === 'city';
      const box = ([, [x, y]]) => ({ x: x - mk, y: y - mk, width: mk * 2, height: mk * 2 });
      // the cities are always named, in English and kanji, and may cover a smaller mark's corner; the rest once there is room
      const others = pts.filter(q => !isCity(q)).map(box);
      for (const q of pts.filter(isCity)) placed.push(box(q));
      const label = ([l, [x, y]], strictness) => {
        const city = l.kind === 'city', fs = (city ? 13.5 : 12) / scale, gap = mk + 2 / scale;
        for (const strict of strictness) for (const [dx, dy, anchor] of [[gap, 0, 'start'], [-gap, 0, 'end'], [0, -gap - fs * .4, 'middle'], [0, gap + fs * .9, 'middle']]) {
          const t = el('text', { class: 'prov-label lm-label' + (city ? ' city-label' : ''), x: x + dx, y: y + dy + fs * .35, 'text-anchor': anchor, 'font-size': fs, 'stroke-width': fs * (city ? .24 : .3) }, labels);
          t.textContent = l.en;
          if (city) { const j = el('tspan', { 'font-size': fs * .82, dx: fs * .3, 'font-weight': 400 }, t); j.textContent = l.ja; }
          const b = t.getBBox();
          if (!placed.some(p => hits(b, p)) && !(strict && others.some(p => hits(b, p)))) { placed.push(b); if (!strict) over.push(b); return; }
          t.remove();
        }
      };
      // the cities are always named, in English and kanji, clear of other marks if they can be; the rest once there is room
      const over = []; // city names that had to sit on a smaller mark: that mark fades back under the name
      for (const q of pts.filter(isCity)) label(q, [true, false]);
      for (const g of landmarksG.querySelectorAll('.landmark:not(.city)')) {
        const l = LANDMARKS.find(x => x.id === g.dataset.l);
        g.classList.toggle('under', over.some(b => hits(box([l, lmAt(l)]), b)));
      }
      placed.push(...others);
      if (zoom >= 1.6) for (const q of pts.filter(q => !isCity(q))) label(q, [true]);
      provinceNames();
      return;
    }
    paintCrests(st, realm0());
    const mk = 7 * markScale();
    for (const b of [...battles.children, ...castlesG.children]) { const [, x, y] = b.getAttribute('transform').match(/([-\d.]+) ([-\d.]+)/).map(Number); placed.push({ x: x - mk, y: y - mk, width: mk * 2, height: mk * 2 }); }
    for (const s of stitches.querySelectorAll('.stitch:not(.under)')) {
      const len = s.getTotalLength();
      for (let d = 0; d < len; d += 8) { const q = s.getPointAtLength(d); placed.push({ x: q.x - 2, y: q.y - 2, width: 4, height: 4 }); }
    }
    const realm = followRealm();
    const zs = Math.pow(zoom, -.8); // zoomed in, labels shrink against the map so more of them fit
    for (const [c, s] of Object.entries(sums).sort((a, b) => b[1].n - a[1].n)) {
      if (s.n < (zoom > 1.8 ? 1 : 2)) continue;
      const size = Math.min(17, 7 + Math.sqrt(s.n) * 2.6) * zs, x = s.x / s.n;
      const g = el('g', { class: 'clan-mark' + (realm && !realm.clans.includes(c) ? ' dim' : '') }, labels);
      const t = el('text', { class: 'clan-label', x, y: 0, 'text-anchor': 'middle', 'font-size': size, 'stroke-width': size * .32, 'font-weight': 700 }, g);
      t.textContent = CLANS[c].en.replace(/ \(.*/, '');
      const kanji = Math.max(size * .6, 10.5 / scale); // at least 10.5 px on screen, or not at all
      if (kanji <= size * .85) {
        const j = el('tspan', { x, dy: size * .7 + kanji * .9, 'font-size': kanji, 'font-weight': 400, 'letter-spacing': kanji * .14 }, t);
        j.textContent = CLANS[c].ja;
      }
      const tryAt = offsets => {
        const local = g.getBBox();
        for (const dy of offsets) {
          const y = s.y / s.n + dy, b = { x: local.x, y: local.y + y, width: local.width, height: local.height };
          if (!placed.some(q => hits(b, q))) { g.setAttribute('transform', `translate(0 ${y})`); placed.push(b); return true; }
        }
        return false;
      };
      const ok = tryAt([0, -size * 1.3, size * 1.3, -size * 2.4, size * 2.4]);
      if (!ok) g.remove(); // no room: the roster still names it
    }
    provinceNames();
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
      for (const q of pts) el('circle', { cx: q[0], cy: q[1], r: 1.6 * markScale(), fill: '#efe6d3' }, stitches);
    }
    drawnAlliances = active.map(a => a[0]).join();
  }

  // battles of the last few years, as red cross-stitches; the newest is boldest
  function paintBattles() {
    battles.replaceChildren();
    for (const e of EVENTS) {
      if (e.year > year || year - e.year > 3) continue;
      const age = year - e.year, [X, Y] = markAt(e);
      const g = el('g', { class: 'battle' + (age === 0 ? ' now' : '') + (sel?.type === 'event' && sel.id === e.id ? ' sel' : ''), transform: `translate(${X} ${Y}) scale(${markScale()})`, opacity: [1, .75, .55, .4][age], tabindex: 0, role: 'button', 'aria-label': `${e.en}, ${e.year}` }, battles);
      g.dataset.e = e.id;
      el('circle', { class: 'ring', r: 2 }, g);
      el('circle', { class: 'hit', r: 10 }, g);
      g.insertAdjacentHTML('beforeend', stitchMark(e.kind === 'battle' ? 6 : 4.4));
    }
  }

  const markScale = () => Math.pow(zoom, -.7); // zoomed in, marks grow a little but not with the map

  // castles: a small square of running stitch around a knot, for the years the castle stood
  function paintCastles() {
    castlesG.replaceChildren();
    for (const k of CASTLES) {
      if (k.from > year || k.to < year) continue;
      const [x, y] = center(k.at);
      const g = el('g', { class: 'castle' + (sel?.type === 'castle' && sel.id === k.id ? ' sel' : ''), transform: `translate(${x + k.dx} ${y + k.dy}) scale(${markScale()})`, tabindex: 0, role: 'button', 'aria-label': k.en }, castlesG);
      g.dataset.c = k.id;
      el('rect', { class: 'hit', x: -7, y: -7, width: 14, height: 14 }, g);
      el('rect', { class: 'keep', x: -3.4, y: -3.4, width: 6.8, height: 6.8 }, g);
      el('circle', { class: 'knot', r: 1.1 }, g);
    }
  }

  // ---- following a life: the map dims everything that wasn't theirs ----
  let follow = null, lifeEnd = 0;
  const person = () => PEOPLE.find(p => p.id === follow);
  function roleAt(p, y) { return p.roles.find(([a, b]) => a <= y && y <= b) || null; }
  function followRealm() {
    const p = follow && person();
    if (!p || year < p.born || year > p.died) return null;
    const r = roleAt(p, year);
    return { clans: r ? [r[2]] : [], how: r ? r[3] : null };
  }
  function paintFollow() {
    const realm = followRealm(), st = stateAt(year);
    svg.classList.toggle('following', !!realm);
    for (const p of PIDS) provG[p].classList.toggle('dim', !!realm && !holders(st[p]).some(c => realm.clans.includes(c)));
    const life = $('#life'), pp = follow && person();
    life.hidden = !pp;
    if (pp) {
      const a = Math.max(START, pp.born), b = Math.min(END, pp.died);
      life.style.left = xOf(a) * 100 + '%';
      life.style.width = (xOf(b) - xOf(a)) * 100 + '%';
      life.innerHTML = pp.life.filter(([y]) => y >= START && y <= END).map(([y]) => `<i style="left:${(xOf(y) - xOf(a)) / Math.max(.001, xOf(b) - xOf(a)) * 100}%"></i>`).join('');
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
    if (landMode) {
      $('#year').innerHTML = '<span lang="ja">名所</span>';
      $('#era').innerHTML = '<span class="roman" style="margin:0">Meisho · the famous places of Japan</span>';
      $('#phase').textContent = `${LANDMARKS.filter(l => l.kind === 'city').length} cities and ${LANDMARKS.filter(l => l.kind !== 'city').length} landmarks`;
      $('#tate').textContent = '山河と名所';
      document.title = 'Landmarks · Sengoku 戦国';
      return;
    }
    $('#year').textContent = year;
    const era = eraOf(year, ERAS), ph = phaseOf(year, PHASES);
    $('#era').innerHTML = `<span lang="ja">${era.ja}${kanjiYear(era.n)}年</span><span class="roman">${era.en} ${era.n}</span>`;
    $('#phase').innerHTML = `${esc(ph.en)}`;
    $('#tate').textContent = ph.ja;
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
    const ABSORBED = ['east', 'imperial', 'shogunate']; // sides that became the settlement or the state, not houses that fell
    const fallen = Object.keys(seenBy).filter(c => seenBy[c] <= year && lastHeld(c) < year && !inCamp(c) && !ABSORBED.includes(c)).sort((a, b) => lastHeld(b) - lastHeld(a));
    const local = Object.values(stateAt(year)).filter(h => h == null || (Array.isArray(h) && h.includes(null))).length;
    const members = c => CAMPS_1600[c] && year === 1600 ? `<li><ul class="members" aria-label="Houses of the ${CLANS[c].en}">${CAMPS_1600[c].map(m => `<li><button data-clan="${m}">${swatch(m)}${esc(CLANS[m].en)}</button></li>`).join('')}</ul></li>` : '';
    const row = (c, gone) => `<li><button data-clan="${c}" class="${gone ? 'gone' : ''}">${gone ? '<span class="swatch empty" aria-hidden="true"></span>' : swatch(c)}<span class="name">${clanName(c)}</span><span class="n">${gone ? lastHeld(c) : fmt(cnt[c])}</span></button></li>${gone ? '' : members(c)}`;
    const lives = `<div class="lives"><p class="sep">Follow a life <span lang="ja">生涯</span></p><ul>${PEOPLE.map(p => `<li><button data-follow="${p.id}" title="${esc(p.en)}, ${p.born}–${p.died}">${portrait(p, 'face')}<span>${esc(p.call || p.en.split(' ').slice(-1)[0])}</span></button></li>`).join('')}</ul></div>`;
    side.innerHTML = `<h2>${year >= 1871 ? 'One state <span lang="ja">国家</span>' : year === 1868 || year === 1600 ? 'The two sides <span lang="ja">両軍</span>' : 'The great houses <span lang="ja">群雄</span>'}<span class="count">${year}</span></h2>
      <ol class="roster" aria-label="Clans ranked by provinces held">${now.map(c => row(c, false)).join('')}</ol>
      ${local ? `<p class="local"><span class="swatch none" aria-hidden="true"></span>${local} of 68 provinces split among local lords</p>` : ''}
      ${year === 1600 ? '<p class="local">In 1600 the provinces are dyed by the side their lords took at Sekigahara.</p>' : ''}
      ${year === 1868 ? '<p class="local">In 1868 the provinces are dyed by the side their domains took in the Boshin War.</p>' : ''}
      ${year >= 1871 ? '<p class="local">From 1871 the domains are gone: Japan is one state, governed through prefectures. The old provinces stay on the map as names.</p>' : ''}
      ${lives}
      ${fallen.length ? `<p class="sep">Fallen, with the last year they held land <span lang="ja">滅亡</span></p><ol class="roster">${fallen.map(c => row(c, true)).join('')}</ol>` : ''}
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
  const plate = (key, note) => {
    const im = typeof IMAGES !== 'undefined' && IMAGES[key];
    if (!im) return '';
    const tall = im.h > im.w * 1.1;
    return `<figure class="plate${tall ? ' tall' : ''}"><img src="${im.src}" alt="${esc(im.desc || im.file.replace(/\.\w+$/, '').replace(/_/g, ' '))}" width="${im.w}" height="${im.h}" loading="lazy" decoding="async">` +
      `<figcaption>${note ? `<span class="photo-note">${esc(note)}</span>` : ''}${esc(im.artist || 'Unknown')} · ${esc(im.licence)} · Wikimedia Commons</figcaption></figure>`;
  };

  const portrait = (p, cls) => { const im = IMAGES[p.portrait]; return im ? `<img class="${cls}" src="${im.src}" alt="" width="${im.w}" height="${im.h}" loading="lazy">` : `<span class="${cls} blank" lang="ja" aria-hidden="true">${p.ja[0]}</span>`; };
  const followFor = name => PEOPLE.find(p => p.en === name.split(' (')[0]);

  function renderPerson() {
    const p = person(), age = year - p.born, r = roleAt(p, year), n = r ? counts(stateAt(year))[r[2]] || 0 : 0;
    const status = year < p.born ? `Not yet born: born in ${p.born}` : year > p.died ? `Died in ${p.died}` :
      `${year} · aged about ${age} · ` + (!r ? 'no land of his own yet' : r[3] === 'leads' ? `leads the ${CLANS[r[2]].en}${n ? `: ${fmt(n)} province${n === 1 ? '' : 's'}` : ''}` : r[2] === 'imagawa' ? 'a hostage of the Imagawa' : `serves the ${CLANS[r[2]].en}`);
    const im = IMAGES[p.portrait];
    side.innerHTML = `<button class="back" data-act="unfollow"><svg viewBox="0 0 8 10" aria-hidden="true"><path d="M8 0v10L0 5z"/></svg>Stop following</button>
      <div class="head person-head">${portrait(p, 'face big')}<h3>${esc(p.en)}<span lang="ja">${p.ja}</span></h3></div>
      <p class="sub">${p.born}–${p.died} · ${status}</p>
      <p class="lede">${esc(p.short)}</p>
      <button class="play-life" data-act="playlife"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.2v13.6L15.5 9z"/></svg>Play this life, ${Math.max(START, p.born)}–${Math.min(END, p.died)}</button>
      <div class="block"><h4>His life <span lang="ja">生涯</span></h4><ul class="links">${p.life.map(([y, text, ev]) => `<li><button ${ev ? `data-event="${ev}"` : `data-year="${y}"`} class="${ev ? 'war ' : ''}${y <= year ? 'now' : ''}"><span class="y">${y}</span><span>${esc(text)}</span></button></li>`).join('')}</ul></div>
      ${im ? `<p class="note">Portrait: ${esc(im.artist)} · ${esc(im.licence)} · Wikimedia Commons</p>` : ''}`;
  }

  function renderCastle(id) {
    const k = CASTLES.find(c => c.id === id), st = stateAt(year)[k.at];
    side.innerHTML = `${back()}
      <div class="head"><svg class="swatch castle-mark" viewBox="-10 -10 20 20" aria-hidden="true"><rect class="keep" x="-6" y="-6" width="12" height="12"/><circle class="knot" r="2"/></svg><h3>${esc(k.en)}<span lang="ja">${k.ja}</span></h3></div>
      ${plate('castle:' + k.id, k.photo)}
      <p class="sub">${esc(P[k.at].en)} <span lang="ja">${P[k.at].ja}</span> · stands ${k.from <= START ? 'from before ' + START : 'from ' + k.from}${k.to >= END ? '' : ' to ' + k.to}</p>
      <p class="lede">${esc(k.short)}</p>
      <p class="local" style="margin-top:1rem">${swatch(holders(st)[0] || null)}<span>In ${year}: ${holderText(st)}</span></p>`;
  }

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
      <div class="block"><h4>Key people <span lang="ja">人物</span></h4><ul class="people">${k.people.map(([en, ja, life, note]) => `<li><b>${esc(en)}</b><span lang="ja">${ja}</span><span class="life">${life}</span><p>${esc(note)}</p>${followFor(en) ? `<button class="follow" data-follow="${followFor(en).id}">Follow this life</button>` : ''}</li>`).join('')}</ul></div>
      ${als.length ? `<div class="block"><h4>Alliances <span lang="ja">同盟</span></h4><ul class="links">${als.map(a => `<li><button data-year="${a[1]}" class="${a[1] <= year && year <= a[2] ? 'now' : ''}"><span class="y">${a[1]}</span><span>${esc(a[4])} <span lang="ja" style="color:var(--muted)">${a[5]}</span>, ${a[1]}–${a[2]}: ${esc(a[6])}</span></button></li>`).join('')}</ul></div>` : ''}
      ${evs.length ? `<div class="block"><h4>Battles and turning points <span lang="ja">合戦</span></h4><ul class="links">${evs.map(e => `<li><button data-event="${e.id}" class="war"><span class="y">${e.year}</span><span>${esc(e.en)}</span></button></li>`).join('')}</ul></div>` : ''}
      ${crestOf(c) ? `<p class="note">Crest: ${esc(crestOf(c).file.replace(/_/g, ' '))}${crestOf(c).artist ? ' by ' + esc(crestOf(c).artist) : ''} · ${esc(crestOf(c).licence)} · Wikimedia Commons</p>` : ''}`;
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
      ${CASTLES.some(k => k.at === p) ? `<div class="block"><h4>Castles <span lang="ja">城</span></h4><ul class="links">${CASTLES.filter(k => k.at === p).map(k => `<li><button data-castle="${k.id}" class="${k.from <= year && year <= k.to ? 'now' : ''}"><span class="y">${k.from <= START ? 'older' : k.from}</span><span>${esc(k.en)} <span lang="ja" style="color:var(--muted)">${k.ja}</span></span></button></li>`).join('')}</ul></div>` : ''}
      ${EVENTS.some(e => e.at === p) ? `<div class="block"><h4>Fought here <span lang="ja">合戦</span></h4><ul class="links">${EVENTS.filter(e => e.at === p).map(e => `<li><button data-event="${e.id}" class="war"><span class="y">${e.year}</span><span>${esc(e.en)}</span></button></li>`).join('')}</ul></div>` : ''}`;
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
    if (landMode) { if (sel?.type === 'landmark') renderLandmark(sel.id); else renderLand(); }
    else if (!sel && follow) renderPerson();
    else if (!sel) renderRoster();
    else if (sel.type === 'castle') renderCastle(sel.id);
    else if (sel.type === 'clan') renderClan(sel.id);
    else if (sel.type === 'province') renderProvince(sel.id);
    else renderEvent(sel.id);
    for (const g of land.querySelectorAll('.prov.sel')) g.classList.remove('sel');
    if (sel?.type === 'province') provG[sel.id].classList.add('sel');
  }

  // ---------- the landmarks view ----------

  const landmarksG = el('g', { id: 'landmarks' }, svg);
  const lmAt = (() => { // longitude/latitude to the map, through the fitted quadratic (data/georef.js)
    const memo = {};
    return l => memo[l.id] ||= GEOREF.toMap.map(r => r.reduce((s, k, i) => s + k * [1, l.lon, l.lat, l.lon * l.lat, l.lon * l.lon, l.lat * l.lat][i], 0));
  })();
  // each kind a small stencil, printed in indigo with a halo of bare cotton; drawn, never a font glyph (no 卍 for temples)
  const KINDS = {
    city: { en: 'Cities', one: 'City', ja: '都市', d: 'M0-5.8a5.8 5.8 0 1 0 .01 0ZM0-4.2a4.2 4.2 0 1 1-.01 0ZM0-2.5a2.5 2.5 0 1 0 .01 0Z', rule: 'evenodd' },
    mountain: { en: 'Mountains', one: 'Mountain', ja: '山', d: 'M-5.6 4.2L0-5.2L5.6 4.2Z' },
    nature: { en: 'Nature', one: 'Nature', ja: '自然', d: 'M0-4.2a4.2 4.2 0 1 0 .01 0Z' },
    shrine: { en: 'Shrines', one: 'Shrine', ja: '神社', d: 'M-5.8-4.6Q0-3.6 5.8-4.6V-3.1Q0-2.2-5.8-3.1ZM-4.4-1.5H4.4V-.4H-4.4ZM-3.5-3H-2.2V5H-3.5ZM2.2-3H3.5V5H2.2Z' },
    temple: { en: 'Temples', one: 'Temple', ja: '寺', d: 'M-6.2-.6L0-5.2L6.2-.6ZM-4.2.5H4.2V4.8H-4.2Z' },
    castle: { en: 'Castles', one: 'Castle', ja: '城', d: 'M-4-4H4V4H-4ZM-2.3-2.3V2.3H2.3V-2.3Z', rule: 'evenodd' },
    garden: { en: 'Gardens', one: 'Garden', ja: '庭園', d: 'M0-4.6a2 2 0 1 0 .01 0ZM-3 .7a2 2 0 1 0 .01 0ZM3 .7a2 2 0 1 0 .01 0Z' },
    town: { en: 'Towns', one: 'Town', ja: '町並み', d: 'M0-4.8L4.8 0L0 4.8L-4.8 0Z' },
    memorial: { en: 'Memorials', one: 'Memorial', ja: '記念碑', d: 'M-1.9-5.2H1.9V3.4H-1.9ZM-3.8 3.4H3.8V5.2H-3.8Z' },
  };
  const glyph = k => ['lm-halo', 'lm-ink'].map(c => `<path class="${c}" d="${KINDS[k].d}" fill-rule="${KINDS[k].rule || 'nonzero'}"/>`).join('');
  const glyphIcon = (k, cls = 'lm-icon') => `<svg class="${cls}" viewBox="-7 -7 14 14" aria-hidden="true">${glyph(k)}</svg>`;
  function paintLandmarks() {
    landmarksG.replaceChildren();
    if (!landMode) return;
    for (const l of [...LANDMARKS].sort((a, b) => (a.kind === 'city') - (b.kind === 'city'))) {
      const [x, y] = lmAt(l);
      const g = el('g', { class: 'landmark' + (l.kind === 'city' ? ' city' : '') + (sel?.type === 'landmark' && sel.id === l.id ? ' sel' : ''), transform: `translate(${x} ${y}) scale(${markScale()})`, tabindex: 0, role: 'button', 'aria-label': `${l.en}, ${KINDS[l.kind].one.toLowerCase()}` }, landmarksG);
      g.dataset.l = l.id;
      el('circle', { class: 'hit', r: 9 }, g);
      el('circle', { class: 'ring', r: 8.4 }, g);
      g.insertAdjacentHTML('beforeend', `<g class="lm-body">${glyph(l.kind)}</g>`);
    }
  }
  // which old province a point falls in: the shapes are kept in defs with their own transforms
  const provinceOf = (() => {
    const memo = {};
    return l => {
      if (l.id in memo) return memo[l.id];
      if (l.at) return (memo[l.id] = l.at);
      const [x, y] = lmAt(l);
      for (const p of PIDS) for (const id of shapeIds[p]) {
        const path = document.getElementById(id), m = path.transform.baseVal.consolidate()?.matrix;
        const q = m ? new DOMPoint(x, y).matrixTransform(m.inverse()) : new DOMPoint(x, y);
        if (path.isPointInFill(q)) return (memo[l.id] = p);
      }
      return (memo[l.id] = null); // Ezo, or just off the coast
    };
  })();
  const lmProvince = l => { const p = provinceOf(l); return p ? `${esc(P[p].en)} <span lang="ja">${P[p].ja}</span>` : l.lat > 41.4 ? 'Ezo <span lang="ja">蝦夷</span>, now Hokkaido' : ''; };

  function renderLand() {
    const groups = Object.keys(KINDS).map(k => [k, LANDMARKS.filter(l => l.kind === k)]).filter(([, ls]) => ls.length);
    side.innerHTML = `<h2>Landmarks <span lang="ja">名所</span><span class="count">${LANDMARKS.length}</span></h2>
      <p class="intro">The country itself, without the wars or the dynasties: its great cities, mountains, shrines, temples, castles, gardens and towns, over the shape of the land.</p>
      ${groups.map(([k, ls]) => `<div class="block"><h4>${glyphIcon(k)}${KINDS[k].en} <span lang="ja">${KINDS[k].ja}</span></h4>
        <ul class="lm-list">${ls.map(l => `<li><button data-landmark="${l.id}"><span class="name">${esc(l.en)}</span><span lang="ja">${l.ja}</span></button></li>`).join('')}</ul></div>`).join('')}
      <p class="note">Each mark is placed from its latitude and longitude: close, not surveyed. Heights: Terrain Tiles on AWS (SRTM, GMTED2010 and other public data). Shaded relief: Natural Earth, public domain. Photos: Wikimedia Commons, credited with each landmark.</p>`;
  }
  function renderLandmark(id) {
    const l = LANDMARKS.find(x => x.id === id), p = provinceOf(l);
    const here = p ? EVENTS.filter(e => e.at === p && !e.abroad) : [];
    side.innerHTML = `<button class="back" data-act="back"><svg viewBox="0 0 8 10" aria-hidden="true"><path d="M8 0v10L0 5z"/></svg>All landmarks</button>
      <div class="head">${glyphIcon(l.kind, 'swatch lm-swatch')}<h3>${esc(l.en)}<span lang="ja">${l.ja}</span></h3></div>
      ${plate('landmark:' + l.id)}
      <p class="sub">${KINDS[l.kind].one}${lmProvince(l) ? ' · ' + lmProvince(l) : ''}${l.pop ? ` · population ${esc(l.pop)}, 2020` : ''}</p>
      <p class="lede">${esc(l.short)}</p>
      ${here.length ? `<div class="block"><h4>History in ${esc(P[p].en)}</h4><ul class="links">${here.map(e => `<li><button data-event="${e.id}" class="war"><span class="y">${e.year}</span><span>${esc(e.en)}</span></button></li>`).join('')}</ul></div>` : ''}`;
  }

  // the switch between the two maps
  function setMode(toLand) {
    if (toLand === landMode) return;
    stop();
    landMode = toLand; sel = null;
    document.body.classList.toggle('land', landMode);
    $('#mode-history').setAttribute('aria-pressed', !landMode);
    $('#mode-land').setAttribute('aria-pressed', landMode);
    svg.setAttribute('aria-label', landMode ? 'Japan\'s landmarks over the shape of the land' : 'The provinces of Japan, dyed by who held them');
    paintWhen(); refresh(); side.scrollTop = 0;
    requestAnimationFrame(() => { // the band comes and goes, so the map has resized
      if (!landMode) { drawWeave(); tidyBand(); }
      paintLandmarks(); paintLabels();
    });
  }
  $('#mode-history').addEventListener('click', () => setMode(false));
  $('#mode-land').addEventListener('click', () => setMode(true));
  landmarksG.addEventListener('pointermove', e => {
    const g = e.target.closest('.landmark'); if (!g) return;
    const l = LANDMARKS.find(x => x.id === g.dataset.l), r = cloth.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(l.en)}</b><span class="ja" lang="ja">${l.ja}</span><span class="who">${KINDS[l.kind].one}</span>`;
    tip.style.left = Math.min(e.clientX - r.left + 16, r.width - tip.offsetWidth - 8) + 'px'; tip.style.top = (e.clientY - r.top + 18) + 'px';
    tip.classList.add('on');
  });
  landmarksG.addEventListener('pointerleave', () => tip.classList.remove('on'));

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
  // each year's share of the band: busy times get room, quiet stretches are squeezed (BAND_WEIGHTS)
  const WEIGHT = STATES.map((_, i) => { const y = START + i, r = BAND_WEIGHTS.find(([a, b]) => a <= y && y <= b); return r ? r[2] : 1; });
  const CUM = WEIGHT.reduce((a, w) => (a.push(a[a.length - 1] + w), a), [0]), TOTAL = CUM[CUM.length - 1];
  const xOf = y => (CUM[y - START] + WEIGHT[y - START] / 2) / TOTAL;
  const colX = (i, W) => Math.round(CUM[i] / TOTAL * W); // left edge of year i's column on a band W wide
  function drawWeave() {
    const r = weave.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    weave.width = Math.round(r.width * dpr); weave.height = Math.round(r.height * dpr);
    const cx = weave.getContext('2d'), W = weave.width, H = weave.height, cols = END - START + 1;
    for (let i = 0; i < cols; i++) {
      const x0 = colX(i, W), x1 = Math.max(x0 + 1, colX(i + 1, W));
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
      const x0 = colX(i, W), x1 = Math.max(x0 + 1, colX(i + 1, W)), h = STATES[i][p];
      const parts = Array.isArray(h) ? h : [h];
      parts.forEach((c, j) => { cx.fillStyle = c ? clanColor(c) : '#d8cfba'; cx.fillRect(x0, j * H / parts.length, x1 - x0, H / parts.length + .5); });
    }
    const xh = Math.round(xOf(year) * W);
    cx.fillStyle = '#efe6d3'; cx.fillRect(xh - dpr, 0, 2 * dpr, H);
  }
  {
    let ticks = '';
    for (const y of [1470, 1500, 1530, 1560, 1600, 1700, 1853, 1868, 1900]) ticks += `<span class="${[1500, 1600, 1868, 1945].includes(y) ? '' : 'minor'}" style="left:${xOf(y) * 100}%">${y}</span>`;
    $('#ticks').innerHTML = ticks;
    let marks = '';
    const named = { kamigoryo: 'Ōnin', okehazama: 'Okehazama', honnoji: 'Honnō-ji', odawara: 'Odawara', sekigahara: 'Sekigahara', perry: 'Black ships', toba: 'Meiji', surrender: '1945' };
    for (const e of EVENTS) if (e.kind === 'battle') marks += `<i class="w" style="left:${xOf(e.year) * 100}%"></i>`;
    for (const e of EVENTS) if (e.threshold) marks += `<span class="t" style="left:${xOf(e.year) * 100}%">${named[e.id]}</span>`;
    $('#marks').innerHTML = marks;
  }
  // band labels: the last one hangs left of its mark, and a label that would run into its neighbour steps aside
  function tidyBand() {
    for (const box of ['#ticks', '#marks']) {
      const items = [...document.querySelectorAll(box + ' span')];
      items.forEach(t => { t.style.visibility = ''; t.style.transform = ''; });
      const last = items[items.length - 1];
      if (last) last.style.transform = 'translateX(-100%)';
      let right = -Infinity;
      for (const t of items) {
        if (getComputedStyle(t).display === 'none') continue;
        const r = t.getBoundingClientRect();
        if (r.left < right + 6 || r.right > t.parentElement.getBoundingClientRect().right + 2) t.style.visibility = 'hidden';
        else right = r.right;
      }
    }
  }

  // ---------- moving through time ----------

  function setYear(y, animate = false) {
    y = Math.max(START, Math.min(END, y));
    if (y === year && shown.owari) return;
    const step = y - year;
    year = y;
    paintMap(animate && step > 0 && step <= 3);
    paintStitches(); paintBattles(); paintCastles(); paintFollow(); paintLabels(); paintWhen(); // paintLabels also lays the crests
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
    if (year >= (lifeEnd || END)) return stop();
    setYear(year + 1, true);
    const hit = EVENTS.find(e => e.year === year && e.threshold) || EVENTS.find(e => e.year === year && e.kind === 'battle');
    if (hit) flash(hit);
    // thresholds hold the moment; ordinary years pass quickly
    timer = setTimeout(tick, EVENTS.some(e => e.year === year && e.threshold) ? 3200 : hit ? 1500 : Math.max(90, 760 * WEIGHT[year - START]));
  }
  function play() {
    if (year >= END) setYear(START);
    document.body.classList.add('started');
    document.body.classList.add('playing', 'started');
    $('#play').setAttribute('aria-label', 'Pause');
    timer = setTimeout(tick, 400);
  }
  function stop() {
    clearTimeout(timer); timer = 0; lifeEnd = 0;
    document.body.classList.remove('playing');
    $('#play').setAttribute('aria-label', 'Play the period');
  }
  $('#play').addEventListener('click', () => (timer ? stop() : play()));

  // scrub the band
  const yearAtX = x => {
    const r = weave.getBoundingClientRect(), f = Math.max(0, Math.min(1, (x - r.left) / r.width)) * TOTAL;
    let i = 0;
    while (i < WEIGHT.length - 1 && CUM[i + 1] <= f) i++;
    return START + i;
  };
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
    if (e.key === ' ' && !e.target.closest('button') && !landMode) { e.preventDefault(); timer ? stop() : play(); }
    if ((e.key === '+' || e.key === '=') && !e.ctrlKey) zoomBy(1.4);
    if (e.key === '-' && !e.ctrlKey) zoomBy(1 / 1.4);
    if (e.key === '0' && !e.ctrlKey) zoomHome();
    if (e.key === 'Escape' && (sel || (follow && !landMode))) { if (sel) sel = null; else follow = null; refresh(); }
  });

  // ---------- pointing at things ----------

  const tip = $('#tip'), cloth = $('#cloth');
  land.addEventListener('pointermove', e => {
    const g = e.target.closest('.prov');
    if (!g) return;
    const p = g.dataset.p, h = stateAt(year)[p], r = cloth.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(P[p].en)}</b><span class="ja" lang="ja">${P[p].ja}</span>` + (landMode ? '<span class="who">Province</span>' : `<span class="who">${holderText(h)}</span>`);
    const x = Math.min(e.clientX - r.left + 16, r.width - tip.offsetWidth - 8);
    tip.style.left = x + 'px'; tip.style.top = (e.clientY - r.top + 18) + 'px';
    tip.classList.add('on');
  });
  land.addEventListener('pointerleave', () => tip.classList.remove('on'));
  castlesG.addEventListener('pointermove', e => {
    const g = e.target.closest('.castle'); if (!g) return;
    const k = CASTLES.find(c => c.id === g.dataset.c), r = cloth.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(k.en)}</b><span class="ja" lang="ja">${k.ja}</span><span class="who">${holderText(stateAt(year)[k.at])}</span>`;
    tip.style.left = Math.min(e.clientX - r.left + 16, r.width - tip.offsetWidth - 8) + 'px'; tip.style.top = (e.clientY - r.top + 18) + 'px';
    tip.classList.add('on');
  });
  castlesG.addEventListener('pointerleave', () => tip.classList.remove('on'));
  // repaint what depends on the selection and on who is followed
  function refresh() { renderSide(); paintBattles(); paintCastles(); paintFollow(); paintLandmarks(); paintLabels(); }
  svg.addEventListener('click', e => {
    if (dragged) { dragged = false; return; }
    if (landMode) { const l = e.target.closest('.landmark'); sel = l ? { type: 'landmark', id: l.dataset.l } : null; refresh(); if (l) side.scrollTop = 0; return; }
    const b = e.target.closest('.battle'), k = e.target.closest('.castle'), g = e.target.closest('.prov');
    sel = b ? { type: 'event', id: b.dataset.e } : k ? { type: 'castle', id: k.dataset.c } : g ? { type: 'province', id: g.dataset.p } : null;
    refresh();
  });
  for (const layer of [battles, castlesG, landmarksG]) layer.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  side.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.act === 'back') { sel = null; refresh(); return; }
    if (b.dataset.act === 'unfollow') { follow = null; refresh(); return; }
    if (b.dataset.act === 'playlife') {
      const p = person(); stop(); setYear(Math.max(START, p.born)); lifeEnd = Math.min(END, p.died);
      document.body.classList.add('playing', 'started'); $('#play').setAttribute('aria-label', 'Pause'); timer = setTimeout(tick, 600);
      return;
    }
    if (b.dataset.follow) { follow = b.dataset.follow; sel = null; const p = person(); stop(); if (year < p.born || year > p.died) setYear(Math.max(START, p.born)); refresh(); side.scrollTop = 0; return; }
    if (b.dataset.act === 'more') {
      const long = side.querySelector('.long'); long.hidden = !long.hidden;
      b.setAttribute('aria-expanded', !long.hidden); b.textContent = long.hidden ? 'Read the full story' : 'Show less';
      return;
    }
    if (b.dataset.clan) { sel = { type: 'clan', id: b.dataset.clan }; renderSide(); side.scrollTop = 0; return; }
    if (b.dataset.castle) { const k = CASTLES.find(c => c.id === b.dataset.castle); sel = { type: 'castle', id: k.id }; if (year < k.from || year > k.to) setYear(k.from <= START ? START : k.from); refresh(); side.scrollTop = 0; return; }
    if (b.dataset.landmark) { sel = { type: 'landmark', id: b.dataset.landmark }; refresh(); side.scrollTop = 0; return; }
    if (b.dataset.event) { setMode(false); stop(); const ev = EVENTS.find(x => x.id === b.dataset.event); sel = { type: 'event', id: ev.id }; setYear(ev.year); refresh(); side.scrollTop = 0; return; }
    if (b.dataset.year) { stop(); setYear(+b.dataset.year); }
  });

  $('#zoom-in').addEventListener('click', () => zoomBy(1.5));
  $('#zoom-out').addEventListener('click', () => zoomBy(1 / 1.5));
  $('#zoom-home').addEventListener('click', zoomHome);
  addEventListener('resize', () => { drawWeave(); tidyBand(); paintLabels(); if (sel?.type === 'province') renderSide(); });
  document.fonts.ready.then(() => { drawWeave(); tidyBand(); setYear(START); });
  drawWeave();
  year = START; setYear(START);
})();
