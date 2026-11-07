// Checks the history data and the model: node test.js
const fs = require('fs'), assert = require('assert'), vm = require('vm');
const ctx = {};
vm.createContext(ctx);
for (const f of ['data/provinces.js', 'data/history.js', 'data/images.js', 'data/places.js', 'data/modern.js']) vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx);
// through JSON: arrays made inside the vm context fail deepStrictEqual against this realm's arrays
const { GEO, START, END, ERAS, PHASES, DYES, CLANS, BASE, BASE_NOTES, CHANGES, EVENTS, ALLIANCES, CAMPS_1600, BAND_WEIGHTS, EZO_HOLDERS } = JSON.parse(
  vm.runInContext('JSON.stringify({GEO, START, END, ERAS, PHASES, DYES, CLANS, BASE, BASE_NOTES, CHANGES, EVENTS, ALLIANCES, CAMPS_1600, BAND_WEIGHTS, EZO_HOLDERS})', ctx));
for (const [a, b, w] of BAND_WEIGHTS) assert(a <= b && w > 0 && w <= 1, `band weight ${a}`);
for (const [y, h] of EZO_HOLDERS) assert(y >= START && (h === null || h in CLANS), `Ezo ${y}`);
const M = require('./model.js');

const provs = Object.keys(GEO.provinces);
assert.strictEqual(provs.length, 68);
assert.deepStrictEqual(Object.keys(BASE).sort(), provs.slice().sort(), 'BASE must name every province once');
const clanOk = c => c === null || c in CLANS;
const holderOk = h => h === null || (Array.isArray(h) ? h.length === 2 && h.every(clanOk) && h[0] !== h[1] : clanOk(h));
for (const [p, h] of Object.entries(BASE)) assert(holderOk(h), `BASE ${p}: ${h}`);
for (const p of Object.keys(BASE_NOTES)) assert(provs.includes(p), p);

let last = START;
const seen = new Set();
for (const [y, p, h, note] of CHANGES) {
  assert(y >= last && y <= END, `CHANGES out of order at ${y} ${p}`);
  last = y;
  assert(provs.includes(p), `unknown province ${p}`);
  assert(holderOk(h), `${y} ${p}: bad holder ${JSON.stringify(h)}`);
  assert(!seen.has(y + p), `two changes for ${p} in ${y}`);
  seen.add(y + p);
  assert(note === null || typeof note === 'string');
}

const pairs = new Set();
for (const [id, c] of Object.entries(CLANS)) {
  assert(c.dye in DYES, `${id}: dye ${c.dye}`);
  assert(['plain', 'dots', 'kikko', 'hishi', 'uroko'].includes(c.motif), `${id}: motif ${c.motif}`);
  assert(!pairs.has(c.dye + c.motif), `${id}: dye and motif already used`);
  pairs.add(c.dye + c.motif);
  for (const k of ['en', 'ja', 'title', 'short', 'long']) assert(c[k], `${id}: missing ${k}`);
  for (const p of c.people) assert(p.length === 4, `${id}: person ${p[0]}`);
}

for (const e of EVENTS) {
  assert(e.year >= START && e.year <= END && (provs.includes(e.at) || e.at === 'ezo'), `event ${e.id}`);
  assert(!e.abroad || ['west', 'east', 'south'].includes(e.abroad), `event ${e.id}: abroad`);
  for (const s of e.sides || []) assert(s === null || s in CLANS, `event ${e.id}: side ${s}`);
  assert(!e.winner || e.winner in CLANS, `event ${e.id}: winner`);
  assert(e.short && e.long && e.en && e.ja, `event ${e.id}: text`);
}
assert.deepStrictEqual(EVENTS.filter(e => e.threshold).map(e => e.year), [1467, 1560, 1582, 1590, 1600, 1853, 1868, 1945]);
for (const [id, from, to, clans, en, ja, short] of ALLIANCES) {
  assert(from <= to && clans.every(c => c in CLANS) && en && ja && short, `alliance ${id}`);
}

for (const [k, m] of Object.entries(CAMPS_1600)) assert(k in CLANS && m.every(c => c in CLANS), `CAMPS_1600.${k}`);

const IMAGES = JSON.parse(vm.runInContext('JSON.stringify(IMAGES)', ctx));
for (const [k, im] of Object.entries(IMAGES)) {
  const [type, id] = k.split(':');
  const castleIds = JSON.parse(vm.runInContext('JSON.stringify(CASTLES.map(c => c.id))', ctx));
  assert(type === 'clan' ? id in CLANS : type === 'castle' ? castleIds.includes(id) : EVENTS.some(e => e.id === id), `image for unknown ${k}`);
  assert(fs.existsSync(__dirname + '/' + im.src) && im.licence && im.artist, `image ${k}: file, licence and author`);
}

const { CASTLES, PEOPLE } = JSON.parse(vm.runInContext('JSON.stringify({CASTLES, PEOPLE})', ctx));
for (const c of CASTLES) assert(provs.includes(c.at) && c.from <= c.to && c.short && c.en && c.ja, `castle ${c.id}`);
for (const p of PEOPLE) {
  assert(p.born < p.died && p.portrait && p.short, `person ${p.id}`); // the portrait may still be downloading: the app shows the name alone
  for (const [from, to, clan, how] of p.roles) assert(from <= to && clan in CLANS && ['leads', 'serves'].includes(how), `${p.id} role ${clan}`);
  for (const [y, text, ev] of p.life) assert(y >= p.born && y <= p.died && text && (!ev || EVENTS.some(e => e.id === ev)), `${p.id} life ${y}`);
}

// the model
const states = M.buildStates(BASE, CHANGES, START, END);
assert.strictEqual(states.length, END - START + 1);
const at = y => states[y - START];
assert.strictEqual(at(1560).owari, 'oda');
assert.strictEqual(at(1560).mikawa, 'imagawa');
assert.strictEqual(at(1561).mikawa, 'tokugawa');
assert.strictEqual(at(1589).musashi, 'hojo');
assert.strictEqual(at(1590).musashi, 'tokugawa');
assert.deepStrictEqual(at(1600).higo, ['east', 'west']);
const n = M.counts(at(1590));
assert(n.toyotomi > n.tokugawa && n.tokugawa >= 6, JSON.stringify(n));
assert.strictEqual(M.counts({ a: ['x', 'y'], b: 'x', c: null }).x, 1.5);
assert.deepStrictEqual(M.eraOf(1560, ERAS), { en: 'Eiroku', ja: '永禄', n: 3 });
assert.deepStrictEqual(M.eraOf(1573, ERAS), { en: 'Tenshō', ja: '天正', n: 1 });
assert.strictEqual(M.kanjiYear(1), '元');
assert.strictEqual(M.kanjiYear(3), '三');
assert.strictEqual(M.kanjiYear(10), '十');
assert.strictEqual(M.kanjiYear(23), '二十三');
assert.strictEqual(M.phaseOf(1582, PHASES).en, 'Hideyoshi unites the realm');
assert.deepStrictEqual(M.eraOf(1868, ERAS), { en: 'Meiji', ja: '明治', n: 1 });
assert.deepStrictEqual(M.eraOf(1945, ERAS), { en: 'Shōwa', ja: '昭和', n: 20 });
assert.strictEqual(at(1700).settsu, 'tokugawa');
assert.strictEqual(at(1900).satsuma, 'empire');
// every clan appears somewhere: on the map, in an event or an alliance
const used = new Set(states.flatMap(s => Object.values(s).flatMap(M.holders)));
for (const e of EVENTS) (e.sides || []).forEach(c => c && used.add(c));
for (const a of ALLIANCES) a[3].forEach(c => used.add(c));
for (const id of Object.keys(CLANS)) assert(used.has(id), `clan ${id} never appears`);
// clans that share a dye are never neighbours in the same year (centres closer than 60 map units count as neighbours)
const near = (a, b) => Math.hypot(GEO.provinces[a].cx - GEO.provinces[b].cx, GEO.provinces[a].cy - GEO.provinces[b].cy) < 60;
states.forEach((s, i) => {
  for (const a of provs) for (const b of provs) if (a < b && near(a, b))
    for (const x of M.holders(s[a])) for (const y of M.holders(s[b]))
      assert(x === y || CLANS[x].dye !== CLANS[y].dye, `${x} and ${y} share ${CLANS[x].dye} side by side in ${START + i}`);
});
console.log('ok:', CHANGES.length, 'changes,', EVENTS.length, 'events,', Object.keys(CLANS).length, 'clans');
