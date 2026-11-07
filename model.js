// Pure functions over the history data: who holds what in a given year, the era name, the rankings.
// Loaded by the page after data/*.js, and by test.js in Node.

const holders = h => (h == null ? [] : Array.isArray(h) ? h.filter(Boolean) : [h]);

// every year's map, computed once: STATES[y - START] = {province: holder}
function buildStates(base, changes, start, end) {
  const states = [], cur = { ...base };
  let i = 0;
  for (let y = start; y <= end; y++) {
    while (i < changes.length && changes[i][0] === y) { cur[changes[i][1]] = changes[i][2]; i++; }
    states.push({ ...cur });
  }
  return states;
}

// provinces held per clan; a split province counts half to each side
function counts(state) {
  const n = {};
  for (const h of Object.values(state)) {
    const hs = holders(h), share = Array.isArray(h) ? 0.5 : 1;
    for (const c of hs) n[c] = (n[c] || 0) + share;
  }
  return n;
}

function eraOf(year, eras) {
  let e = eras[0];
  for (const x of eras) if (x[0] <= year) e = x;
  return { en: e[1], ja: e[2], n: year - e[0] + 1 };
}

const KANJI_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
// 1 -> 元 (the first year of an era), 23 -> 二十三
function kanjiYear(n) {
  if (n === 1) return '元';
  const t = Math.floor(n / 10), u = n % 10;
  return (t ? (t > 1 ? KANJI_NUM[t] : '') + '十' : '') + KANJI_NUM[u];
}

function phaseOf(year, phases) {
  let p = phases[0];
  for (const x of phases) if (x[0] <= year) p = x;
  return { en: p[1], ja: p[2] };
}

if (typeof module !== 'undefined') module.exports = { holders, buildStates, counts, eraOf, kanjiYear, phaseOf };
