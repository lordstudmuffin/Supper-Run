// ---------- Supper Run: state, rules, screens ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const money = n => '$' + (Math.round(n * 4) / 4).toFixed(2).replace(/\.00$/, '');
const LS = 'supperrun.v1';

function fresh() {
  return { v: 1, at: 0, chefs: ['Robert', ''], prefs: { ok: false, al: [], diets: [], no: [] }, pantry: [], log: [], cur: null };
}
const STANDALONE = !window.claude;
let S = fresh();
let pgroup = 0;
let view = 'home', open = null, draft = null, lastResult = null, rescueCat = null;
let db = null, ref = null, follower = false, cloud = 'local', pushing = false, pushQueued = false, pushTimer = 0;

// ---------- words and the allergy filter ----------
function stems(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter(Boolean).map(w =>
    w.length > 3 && w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.length > 3 && w.endsWith('oes') ? w.slice(0, -2) : w.length > 2 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
}
const AL_SYN = { milk: 'milk dairy lactose', egg: 'egg', fish: 'fish seafood', shellfish: 'shellfish seafood', treenut: 'nut tree', peanut: 'peanut nut', wheat: 'wheat gluten', soy: 'soy soya', sesame: 'sesame' };
const WORDSETS = {}; for (const k in AL_WORDS) WORDSETS[k] = new Set(stems(AL_WORDS[k]));
const KINDSETS = {}; for (const k in KIND_WORDS) KINDSETS[k] = new Set(stems(KIND_WORDS[k]));
// Anything typed by hand becomes an ingredient-shaped object, with allergens guessed from its words.
function custom(name) {
  const w = stems(name), al = [], t = [];
  for (const k in WORDSETS) if (w.some(x => WORDSETS[k].has(x))) al.push(k);
  let kind = 'other', s = '';
  for (const k in KINDSETS) if (w.some(x => KINDSETS[k].has(x))) { kind = k; break; }
  if (['poultry', 'beef', 'pork', 'lamb'].includes(kind)) t.push('meat');
  if (kind === 'fish' || kind === 'shellfish') t.push('seafood');
  if (kind === 'poultry') s = 'poultry'; else if (kind === 'fish') s = 'fish'; else if (kind === 'shellfish') s = 'shellfish'; else if (kind === 'egg') s = 'egg';
  else if (['beef', 'pork', 'lamb'].includes(kind)) s = w.includes('ground') || w.includes('sausage') || w.includes('hamburger') ? 'ground' : 'whole';
  return { id: null, n: name, e: '🥫', k: kind, c: 0, al, t, s, lv: 0, st: false, a: [] };
}
function lookup(name) {
  const key = stems(name).join(' ');
  if (!key) return null;
  for (const id in ING) { const g = ING[id]; if (stems(g.n).join(' ') === key || g.a.some(a => stems(a).join(' ') === key)) return g; }
  return null;
}
const resolve = x => (typeof x === 'string' ? ING[x] || lookup(x) || custom(x) : x.id && ING[x.id] ? ING[x.id] : lookup(x.n) || custom(x.n));
// The one gate every card, mystery ingredient, pantry item and rescue hint goes through.
function blocked(g, p = S.prefs) {
  if (g.al.some(a => p.al.includes(a))) return true;
  const d = p.diets;
  const flesh = MEATS.includes(g.k) || g.t.includes('meat') || g.t.includes('seafood') || g.al.includes('fish') || g.al.includes('shellfish');
  if ((d.includes('veg') || d.includes('vegan')) && (flesh || g.t.includes('gelatin'))) return true;
  if (d.includes('pesc') && (['poultry', 'beef', 'pork', 'lamb'].includes(g.k) || g.t.includes('meat') || g.t.includes('gelatin'))) return true;
  if (d.includes('noredmeat') && (['beef', 'pork', 'lamb'].includes(g.k) || g.t.includes('beef'))) return true;
  if (d.includes('vegan') && (g.k === 'dairy' || g.k === 'egg' || g.al.includes('milk') || g.al.includes('egg') || g.t.includes('honey'))) return true;
  if (d.includes('nopork') && g.k === 'pork') return true;
  if (d.includes('nobeef') && (g.k === 'beef' || g.t.includes('beef'))) return true;
  if (!p.no.length) return false;
  const nameW = stems(g.n), words = new Set([...nameW, ...stems(g.t.join(' ')), ...stems(g.k), ...stems(g.a.join(' ')), ...stems(g.al.map(a => AL_SYN[a]).join(' '))]);
  for (const term of p.no) {
    const tw = stems(term); if (!tw.length) continue;
    if (tw.every(w => words.has(w))) return true;
    if (nameW.length && nameW.every(w => tw.includes(w))) return true;
  }
  return false;
}
const allowed = x => !blocked(resolve(x));

// ---------- progression ----------
const xpTotal = () => S.log.reduce((a, r) => a + (r.xp || 0), 0);
const need = L => 90 + 30 * L;
function levelInfo(xp = xpTotal()) { let L = 1; while (xp >= need(L)) { xp -= need(L); L++; } return { L, into: xp, need: need(L) }; }
const titleFor = L => TITLES.filter(t => t[0] <= L).pop()[1];
function unlocksAt(L) {
  return [...THEMES.filter(t => t.lv === L).map(t => ['Theme', t.n]), ...MODS.filter(m => m.lv === L).map(m => ['Modifier', m.n]),
    ...BOSSES.filter(b => b.lv === L).map(b => ['Boss round', b.n]), ...Object.values(ING).filter(g => g.lv === L).map(g => ['Rare card', g.n])];
}
const headNow = () => (S.log.length + (S.flip || 0)) % 2;
const chef = i => S.chefs[i] || (i ? 'Chef two' : 'Chef one');
function bossReady() {
  const L = levelInfo().L; if (L < 3) return false;
  let since = 0; for (let i = S.log.length - 1; i >= 0 && !S.log[i].boss; i--) since++;
  return since >= 3;
}

// ---------- drawing a challenge ----------
function card(g, src) { return { id: g.id, n: g.n, e: g.e, c: src === 'pantry' ? 0 : g.c, s: g.s, k: g.k, src, rare: g.lv > 0, have: src === 'pantry' }; }
function deck(L) { return Object.values(ING).filter(g => !g.st && g.lv <= L && !blocked(g)); }
// The usable cards in one slot of a dish, for this level and avoid list.
const slotPool = (slot, L) => slot.map(id => ING[id]).filter(g => g && !g.st && g.lv <= L && !blocked(g));
const dishOf = id => DISHES.find(d => d.id === id);
function dishesFor(themeId) { return DISHES.filter(d => d.th.includes(themeId) || (['mono', 'finale', 'potluck'].includes(themeId) && d.id !== 'dessert' && d.id !== 'starter')); }
// Pick one card per slot (or `counts[i]` cards from slot i), all different, under the price cap.
function fillDish(d, L, counts, cap, fixed) {
  const pools = d.s.map(slot => slotPool(slot, L));
  for (let i = 0; i < 3; i++) if (!fixed[i] && pools[i].length < counts[i]) return null;
  let best = null;
  for (let t = 0; t < 80; t++) {
    const used = new Set(fixed.filter(Boolean).map(g => g.id)), picks = [];
    let ok = true;
    for (let i = 0; i < 3 && ok; i++) {
      if (fixed[i]) { picks.push([fixed[i], true]); continue; }
      const opts = shuffle(pools[i].filter(g => !used.has(g.id)));
      if (opts.length < counts[i]) { ok = false; break; }
      for (const g of opts.slice(0, counts[i])) { used.add(g.id); picks.push([g, false]); }
    }
    if (!ok) continue;
    const cost = picks.reduce((a, [g, own]) => a + (own ? 0 : g.c), 0);
    if (cost <= cap) return picks;
    if (!best || cost < best.cost) best = Object.assign(picks, { cost });
  }
  return best;
}
// Pantry mode: find dishes where your pantry fills two slots, then buy one cheap thing for the last slot.
function pantryDish(L, themeIds) {
  const mine = S.pantry.map(resolve).filter(g => g && g.id && !g.st && !blocked(g));
  const options = [];
  for (const d of DISHES) {
    if (d.id === 'dessert' || d.id === 'starter') continue;
    const slotHas = d.s.map(slot => mine.filter(g => slot.includes(g.id)));
    // try every way of covering two slots with two different pantry items
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) for (const x of slotHas[a]) for (const y of slotHas[b]) if (x.id !== y.id) {
      const rest = 3 - a - b, cheap = slotPool(d.s[rest], L).filter(g => g.c <= 4 && g.id !== x.id && g.id !== y.id && !mine.some(m => m.id === g.id));
      if (cheap.length) options.push({ d, fixed: { [a]: x, [b]: y }, rest, cheap, fits: d.th.some(t => themeIds.includes(t)) });
    }
  }
  if (!options.length) return null;
  const fit = options.filter(o => o.fits), o = pick(fit.length ? fit : options);
  const cards = [0, 1, 2].map(i => i === o.rest ? card(pick(o.cheap), 'mystery') : card(o.fixed[i], 'pantry'));
  return { d: o.d, cards };
}
function draw(mode, bossId) {
  if (!S.prefs.ok) return null;
  const L = levelInfo().L, boss = bossId ? BOSSES.find(b => b.id === bossId) : null;
  const themes = THEMES.filter(t => t.lv <= L), last = S.log.length ? S.log[S.log.length - 1].theme : '';
  const fresh = themes.filter(t => t.id !== last && (!S.cur || t.id !== S.cur.theme));
  let cards = null, dish = null, theme = null, idea = '';
  if (boss && boss.id === 'three') {
    // one card per course: a starter bite, a main, a dessert fruit
    const parts = [['starter', 1, 'Starter'], [null, 0, 'Main'], ['dessert', 0, 'Dessert']];
    cards = [];
    for (const [id, slot, role] of parts) {
      const d = id ? dishOf(id) : pick(DISHES.filter(x => !['starter', 'dessert', 'pancakes', 'scramble', 'bsandwich', 'hash', 'mac'].includes(x.id) && slotPool(x.s[0], L).length));
      const opts = slotPool(d.s[slot], L).filter(g => !cards.some(c => c.id === g.id));
      if (!opts.length) return null;
      cards.push(Object.assign(card(pick(opts), 'deck'), { role }));
    }
    theme = pick(fresh.length ? fresh : themes); idea = 'A starter, a main and a dessert';
  } else if (mode === 'pantry') {
    const r = pantryDish(L, fresh.map(t => t.id)); if (!r) return null;
    cards = r.cards; dish = r.d;
  } else {
    const counts = boss && boss.cards === 5 ? [1, 2, 2] : [1, 1, 1], cap = boss && boss.cards === 5 ? 20 : 15;
    for (const t of shuffle(fresh.length ? fresh : themes)) {
      for (const d of shuffle(dishesFor(t.id))) {
        const p = fillDish(d, L, counts, cap, []);
        if (p && p.cost === undefined) { cards = p.map(([g]) => card(g, 'deck')); dish = d; theme = t; break; }
      }
      if (cards) break;
    }
    if (!cards) { // the avoid list emptied every themed dish: take any dish that still works
      for (const d of shuffle(DISHES.filter(x => x.id !== 'dessert'))) { const p = fillDish(d, L, counts, cap + 10, []); if (p) { cards = p.map(([g]) => card(g, 'deck')); dish = d; break; } }
      if (!cards) return null;
    }
  }
  if (cards.some(c => blocked(resolve(c)))) return null; // belt and braces: never deal a blocked card
  if (!theme) { const fits = fresh.filter(t => dish.th.includes(t.id)); theme = pick(fits.length ? fits : (fresh.length ? fresh : themes)); }
  if (dish) idea = dish.n;
  const mpool = MODS.filter(m => m.lv <= L), m1 = pick(mpool), mods = [m1.id];
  if (L >= 4) { const m2 = pick(mpool.filter(m => m.id !== m1.id && !(m.min && m1.min))); mods.push(m2.id); }
  return { id: 'r' + Date.now().toString(36), stage: 'drawn', mode, boss: bossId || null, theme: theme.id, dish: '', idea, cards, mods, head: headNow(),
    redraws: S.cur && S.cur.stage === 'drawn' ? 0 : 1, rescue: null, timer: null, started: 0, r: [[0, 0, 0], [0, 0, 0]], ings: '', steps: '', epi: '', epiT: '', force: null };
}
const estCost = c => c.cards.reduce((a, x) => a + (x.have ? 0 : x.c), 0);
const themeOf = id => THEMES.find(t => t.id === id) || THEMES[0];
const modOf = id => MODS.find(m => m.id === id);
const avgOf = r => { const v = r.flat(); return v.reduce((a, b) => a + b, 0) / v.length; };
const rated = c => c.r.flat().every(v => v > 0);
function verdict(c) { return c.force != null ? c.force : avgOf(c.r) >= 3; }
function epitaph(c) {
  const cs = c.cards.filter(x => allowed(x));
  return pick(EPITAPHS).replace('{c}', cs.length ? pick(cs).n : 'Dinner');
}
const epiText = c => c.epi || (c.epiT || '').replace('{d}', c.dish.trim() || 'the Nameless Dish');
function scoreXp(c, win) {
  let xp = 30 + Math.round(avgOf(c.r) * 12) + c.mods.length * 10 + (c.rescue ? 0 : 10) + (win ? 20 : 15);
  if (c.boss) xp *= 2;
  return xp;
}

// ---------- saving and sharing ----------
function saveLocal() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } }
function loadLocal() { try { const j = JSON.parse(localStorage.getItem(LS)); if (j && j.v === 1) S = Object.assign(fresh(), j); } catch (e) { } }
function mutate(fn, quiet) {
  if (follower) { toast('This phone is following along. Changes happen on the main phone.'); return false; }
  fn(S); S.at = Math.max(Date.now(), (S.at || 0) + 1); saveLocal(); schedulePush(); if (!quiet) render(); return true;
}
function schedulePush() { if ((!ref && !linked()) || follower) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, 500); }
async function push() {
  if ((!ref && !linked()) || follower) return;
  if (pushing) { pushQueued = true; return; }
  pushing = true; pushTimer = 0;
  try {
    if (ref) await ref.set({ blob: JSON.stringify(S), at: S.at });
    else { const r = await supa('POST', '?on_conflict=party,path', [{ party: code, path: 'kitchen', body: S }], 'resolution=merge-duplicates,return=minimal'); if (!r.ok) throw { code: 'http' + r.status }; }
    cloud = 'shared';
  }
  catch (e) {
    if (e && e.code === 'invalid_argument') { follower = true; cloud = 'follow'; toast('This phone can read the shared kitchen but not change it.'); }
    else cloud = 'error';
  }
  pushing = false; statusLine();
  if (pushQueued) { pushQueued = false; push(); }
}
function adopt(R) {
  if (!R || R.v !== 1) return;
  if (follower) { S = Object.assign(fresh(), R); saveLocal(); render(); return; }
  if (R.at > S.at) {
    const have = new Set(R.log.map(x => x.id)), extra = S.log.filter(x => !have.has(x.id) && !(R.cur && R.cur.id === x.id)), L = S.cur;
    S = Object.assign(fresh(), R);
    let touched = false;
    if (extra.length) { S.log = [...S.log, ...extra].sort((a, b) => a.date < b.date ? -1 : 1); touched = true; }
    // both phones rating at once: keep whichever chef's stars were set most recently
    if (L && S.cur && L.id === S.cur.id && L.rt) { const rt = S.cur.rt || [0, 0]; for (const i of [0, 1]) if ((L.rt[i] || 0) > (rt[i] || 0)) { S.cur.r[i] = L.r[i]; rt[i] = L.rt[i]; touched = true; } S.cur.rt = rt; }
    if (touched) { S.at = Math.max(Date.now(), S.at + 1); schedulePush(); }
    saveLocal(); render();
  } else if (R.at < S.at) {
    // our copy is newer overall, but the other phone may still hold stars we have not seen
    const C = S.cur, O = R.cur;
    if (C && O && C.id === O.id && O.rt) { const rt = C.rt || [0, 0]; let got = false; for (const i of [0, 1]) if ((O.rt[i] || 0) > (rt[i] || 0)) { C.r[i] = O.r[i]; rt[i] = O.rt[i]; got = true; } C.rt = rt; if (got) { S.at = Math.max(Date.now(), S.at + 1); saveLocal(); render(); } }
    schedulePush();
  }
}
// ---- live sync outside Claude: one row in the Supabase "docs" table, guarded by the kitchen link code ----
const CFG = window.SR_CONFIG && window.SR_CONFIG.url && window.SR_CONFIG.key ? window.SR_CONFIG : null;
let code = null; try { code = localStorage.getItem(LS + '.code'); } catch (e) { }
const linked = () => !!(CFG && code);
const CODE_RE = /^sr-[a-z2-9]{4}(-[a-z2-9]{4}){3}$/;
function newCode() { const a = 'abcdefghjkmnpqrstuvwxyz23456789', r = new Uint32Array(16); crypto.getRandomValues(r); let o = 'sr'; r.forEach((v, i) => { o += (i % 4 ? '' : '-') + a[v % a.length]; }); return o; }
function supa(method, query, body, prefer) {
  const h = { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key, 'x-party': code, 'Content-Type': 'application/json' }; if (prefer) h.Prefer = prefer;
  return fetch(CFG.url.replace(/\/+$/, '') + '/rest/v1/docs' + query, { method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
}
let pulling = false;
async function pull(joining) {
  if (!linked() || pulling) return; pulling = true;
  try {
    const r = await supa('GET', '?party=eq.' + encodeURIComponent(code) + '&path=eq.kitchen&select=body'); if (!r.ok) throw 0;
    const rows = await r.json(), R = rows.length ? rows[0].body : null; cloud = 'shared';
    if (R && R.v === 1) { if (joining) S.at = Math.min(S.at, R.at - 1); if (!pushTimer && !pushing) adopt(R); }
    else if (S.at) schedulePush();
  } catch (e) { cloud = 'error'; }
  pulling = false; statusLine();
}
function setCode(c) { code = c; try { c ? localStorage.setItem(LS + '.code', c) : localStorage.removeItem(LS + '.code'); } catch (e) { } cloud = c ? 'wait' : 'local'; }
function startSync() {
  const m = /^#k=(sr-[a-z2-9-]+)$/.exec(location.hash || '');
  if (m && CODE_RE.test(m[1]) && CFG) { setCode(m[1]); try { history.replaceState(null, '', location.pathname); } catch (e) { } pull(true); }
  else if (linked()) { cloud = 'wait'; pull(); }
  setInterval(() => { if (linked() && document.visibilityState === 'visible') pull(); }, 4000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull(); });
}
async function connect() {
  const c = window.claude; if (!c || !c.use) { startSync(); statusLine(); return; }
  let d = null, u = null;
  try { [d, u] = await Promise.all([c.use('db'), c.use('user')]); } catch (e) { }
  if (!d) { cloud = 'local'; statusLine(); return; }
  db = d; let cw = null; try { cw = u ? await u.can('data.write') : null; } catch (e) { }
  if (cw === false) follower = true;
  cloud = 'wait'; statusLine();
  const slow = setTimeout(() => { if (cloud === 'wait') { cloud = 'slow'; statusLine(); } }, 10000);
  ref = db.doc('kitchen/save');
  ref.onSnapshot(snap => {
    clearTimeout(slow);
    if (snap.metadata && snap.metadata.hasPendingWrites) return;
    cloud = follower ? 'follow' : 'shared';
    if (!snap.exists) { if (!follower && S.at) schedulePush(); render(); return; }
    let R = null; try { R = JSON.parse(snap.data().blob); } catch (e) { }
    adopt(R); statusLine();
  }, () => { clearTimeout(slow); cloud = 'error'; statusLine(); });
}
const CLOUD_TEXT = {
  local: STANDALONE ? 'Saved on this phone only. Link your phones under "How saving and sharing works" to share one kitchen.' : 'Saved on this phone only. Sign in to Claude on both phones to share one kitchen.',
  wait: 'Connecting to your shared kitchen…', slow: 'The shared kitchen is slow to answer. Showing what this phone has saved.',
  shared: STANDALONE ? 'Linked. Both phones share one kitchen and update within a few seconds.' : 'Saved to your shared kitchen. Any phone signed in with access sees the same book.',
  follow: 'Following the shared kitchen. This phone can look but not change things.',
  error: 'Could not reach the shared kitchen. Your changes are safe on this phone and will sync when it is back.'
};
function statusLine() { const el = $('#status'); if (el) el.textContent = CLOUD_TEXT[cloud]; }
let toastT = 0;
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3200); }

// ---------- screen pieces ----------
function safetyHTML(cards, full) {
  const keys = [...new Set(cards.map(c => resolve(c).s).filter(Boolean))];
  const hot = keys.filter(k => SAFETY[k]), notes = keys.filter(k => SAFE_NOTE[k]);
  const rows = Object.keys(SAFETY).filter(k => full || hot.includes(k)).sort((a, b) => hot.includes(b) - hot.includes(a));
  if (!full && !rows.length && !notes.length) return '';
  return `<div class="safe"><h3>Cook it safe</h3>
    ${hot.length ? `<p class="small"><b>Tonight's cards need a thermometer check.</b> The rows in bold are yours.</p>` : full && !notes.length ? `<p class="small">No meat, eggs or fish on tonight's cards. If you add any, here are the numbers.</p>` : ''}
    <ul class="temps">${rows.map(k => `<li class="${hot.includes(k) ? 'hot' : ''}"><span>${SAFETY[k][0]}</span><span>${SAFETY[k][1]}</span></li>`).join('')}</ul>
    ${notes.map(k => `<p class="small">${SAFE_NOTE[k]}</p>`).join('')}
    ${full ? `<ul class="basics">${BASICS.map(b => `<li>${b}</li>`).join('')}</ul><p class="small soft">Temperatures are the USDA safe minimums, measured inside the food.</p>` : `<p class="small soft">USDA safe minimums. The full chart stays on screen while you cook.</p>`}
  </div>`;
}
const ideaHTML = c => c.idea ? `<p class="idea"><span class="eyebrow">These cards make</span><br><b>${esc(c.idea)}</b> <span class="small soft">That is the starting point. Twist it to fit the theme.</span></p>` : '';
function cardsHTML(c, editable) {
  return `<div class="deal">${c.cards.map((x, i) => `<div class="ing ${x.rare ? 'rare' : ''} ${x.src === 'mystery' ? 'mystery' : ''}">
    <span class="e">${x.e}</span><b>${esc(x.n)}</b>
    <span class="tag">${x.role ? x.role : x.src === 'pantry' ? 'Pantry' : x.src === 'mystery' ? 'Mystery' : x.rare ? 'Rare' : 'Card'}</span>
    ${x.src === 'pantry' ? '' : editable ? `<button class="have" data-act="have" data-i="${i}" aria-pressed="${x.have}">${x.have ? 'Have it' : '~' + money(x.c)}</button>` : ''}
  </div>`).join('')}</div>`;
}
function challengeHTML(c) {
  const t = themeOf(c.theme), b = c.boss && BOSSES.find(x => x.id === c.boss);
  return `${b ? `<div class="banner">${b.e} Boss round: <b>${b.n}</b>. ${b.d}</div>` : ''}
    <div><p class="eyebrow">Tonight's theme</p><h2>${t.e} ${esc(t.n)}</h2><p class="soft">${esc(t.d)}</p></div>`;
}
const modsHTML = c => c.mods.map(id => { const m = modOf(id); return `<div class="mod"><b>${m.n}</b><br><span class="small soft">${m.d}</span></div>`; }).join('');
const rolesHTML = c => `<p><b>${esc(chef(c.head))}</b> is head chef and makes the calls. <b>${esc(chef(1 - c.head))}</b> is sous chef and keeps everything moving.</p>`;
const bar = (title, back = 'home') => `<div class="top"><button class="btn ghost" data-go="${back}">Back</button><h2>${title}</h2></div>`;
const starsHTML = (ci, ki, v) => `<div class="stars" role="group">${[1, 2, 3, 4, 5].map(n => `<button class="${n <= v ? 'on' : ''}" data-act="rate" data-c="${ci}" data-k="${ki}" data-v="${n}" aria-label="${n} of 5">★</button>`).join('')}</div>`;

// ---------- screens ----------
const V = {};
V.home = () => {
  const li = levelInfo(), wins = S.log.filter(r => r.win).length, fails = S.log.length - wins;
  const usable = S.pantry.filter(p => { const g = resolve(p); return !g.st && !blocked(g); }).length;
  let main;
  if (!S.prefs.ok) main = follower
    ? `<div class="sheet"><h2>Waiting for the main phone</h2><p class="soft">Once the kitchen is set up on the main phone, the challenge and your Recipe Book show up here.</p></div>`
    : `<div class="sheet"><h2>Before the first challenge</h2><p>Tell the game who is cooking and what to keep off the table. Nothing is dealt until this is done.</p><button class="btn primary wide" data-go="prefs">Set up our kitchen</button></div>`;
  else if (S.cur) { const t = themeOf(S.cur.theme); main = `<div class="sheet"><p class="eyebrow">Round ${S.log.length + 1} in progress</p><h2>${t.e} ${esc(t.n)}</h2><div class="chips">${S.cur.cards.map(x => `<span class="chip">${x.e} ${esc(x.n)}</span>`).join('')}</div><button class="btn primary wide" data-go="${S.cur.stage === 'drawn' ? 'draw' : S.cur.stage}">Back to the round</button></div>`; }
  else main = `<div class="sheet"><p class="eyebrow">Round ${S.log.length + 1}</p>
      <p>Head chef: <b>${esc(chef(headNow()))}</b>. Sous chef: <b>${esc(chef(1 - headNow()))}</b>.</p>
      <p class="small soft">You take turns: the roles flip after every finished round. <button class="link" data-act="flip">Swap for this round</button></p>
      <button class="btn primary wide" data-act="draw" data-mode="deck">Draw a challenge</button>
      <button class="btn wide" data-act="draw" data-mode="pantry" ${usable < 2 ? 'disabled' : ''}>Draw from our pantry</button>
      ${usable < 2 ? `<p class="small soft">Pantry mode needs at least two usable items in your pantry.</p>` : ''}
      ${bossReady() ? `<button class="btn yolk wide" data-go="boss">A boss round is waiting</button>` : ''}</div>`;
  return `<header class="plain"><h1>Supper Run</h1>
      <p class="hand">${esc(chef(0))} &amp; ${esc(chef(1))}, ${titleFor(li.L)}</p>
      <div class="row small"><b>Level ${li.L}</b><div class="bar grow" role="img" aria-label="${li.into} of ${li.need} XP"><i style="width:${Math.round(100 * li.into / li.need)}%"></i></div><span class="soft">${li.into} / ${li.need} XP</span></div></header>
    ${main}
    <div class="tiles">
      <button class="tile" data-go="book"><b>Recipe Book</b><span>${wins} ${wins === 1 ? 'win' : 'wins'} worth repeating</span></button>
      <button class="tile" data-go="hall"><b>Hall of Legendary Failures</b><span>${fails} laid to rest</span></button>
      <button class="tile" data-go="pantry"><b>Pantry</b><span>${S.pantry.length} ${S.pantry.length === 1 ? 'item' : 'items'} on the shelf</span></button>
      <button class="tile" data-go="unlocks"><b>Unlocks</b><span>Themes, rare cards, bosses</span></button>
      <button class="tile" data-go="safety"><b>Food safety chart</b><span>Safe temperatures and basics</span></button>
      <button class="tile" data-go="prefs"><b>Chefs and allergies</b><span>${S.prefs.ok ? 'Names and what to avoid' : 'Not set yet'}</span></button>
    </div>
    <p class="status" id="status">${CLOUD_TEXT[cloud]}</p>
    <p class="status"><button class="link" data-go="share">How saving and sharing works</button></p>`;
};
V.prefs = () => {
  if (!draft) draft = { chefs: S.chefs.slice(), al: S.prefs.al.slice(), diets: S.prefs.diets.slice(), no: S.prefs.no.join(', ') };
  const p = { al: draft.al, diets: draft.diets, no: draft.no.split(',').map(s => s.trim()).filter(Boolean) };
  const out = Object.values(ING).filter(g => !g.st && blocked(g, p));
  return `${bar(S.prefs.ok ? 'Chefs and allergies' : 'Set up our kitchen')}
    <div class="sheet"><h3>Who is cooking?</h3>
      <label class="small" for="chef0">Chef one</label><input type="text" id="chef0" data-d="chef0" value="${esc(draft.chefs[0])}" maxlength="24" autocomplete="off">
      <label class="small" for="chef1">Chef two</label><input type="text" id="chef1" data-d="chef1" value="${esc(draft.chefs[1])}" maxlength="24" autocomplete="off" placeholder="Her name"></div>
    <div class="sheet"><h3>Allergies</h3><p class="small soft">Tick anything either of you is allergic to. Those ingredients never appear on a card, as a mystery ingredient, or in a rescue hint.</p>
      <div class="cks">${ALLERGENS.map(([k, n]) => `<label class="ck"><input type="checkbox" id="al-${k}" data-act="tick" data-set="al" data-k="${k}" ${draft.al.includes(k) ? 'checked' : ''}>${n}</label>`).join('')}</div>
      <h3>How you eat</h3>
      <div class="cks">${DIETS.map(([k, n]) => `<label class="ck"><input type="checkbox" id="di-${k}" data-act="tick" data-set="diets" data-k="${k}" ${draft.diets.includes(k) ? 'checked' : ''}>${n}</label>`).join('')}</div>
      <h3>Other allergies</h3><div class="chips">${OTHER_AL.map(t => termChip(t, p.no)).join('')}</div>
      <h3>Foods you would rather skip</h3><p class="small soft">Tap anything either of you dislikes.</p><div class="chips">${DISLIKES.map(t => termChip(t, p.no)).join('')}</div>
      <h3>Anything not listed</h3><p class="small soft">Type other allergies or dislikes, separated by commas. Your taps show up here too.</p>
      <input type="text" id="nolist" data-d="no" value="${esc(draft.no)}" autocomplete="off" placeholder="mushrooms, olives">
      <div class="small" id="lockout">${lockoutText(out)}</div>
      <p class="note">The game only knows the cards in its own deck. For anything in a packet or jar, read the label yourselves, every time.</p>
      <button class="btn primary wide" data-act="saveprefs">${p.al.length || p.diets.length || p.no.length ? 'Save and lock these out' : 'Nothing to avoid. Save'}</button></div>`;
};
const lockoutText = out => out.length ? `<details><summary><b>${out.length} of ${Object.values(ING).filter(g => !g.st).length} cards locked out.</b> Tap to see them</summary>${out.map(g => esc(g.n)).join(', ')}.</details>` : 'No cards are locked out right now.';
const termKey = t => stems(t).join(' ');
const termChip = (t, list) => { const on = list.some(x => termKey(x) === termKey(t)); return `<button class="chip pickc ${on ? 'on' : ''}" data-act="noterm" data-t="${esc(t)}" aria-pressed="${on}">${esc(t)}</button>`; };
V.pantry = () => {
  const inP = g => S.pantry.findIndex(p => p.id === g.id);
  const items = Object.values(ING).filter(g => GROUPS[pgroup][1].includes(g.k)).sort((a, b) => a.n.localeCompare(b.n));
  return `${bar('Pantry')}
  <div class="sheet"><h3>On your shelf (${S.pantry.length})</h3>
    <div class="chips">${S.pantry.length ? S.pantry.map((p, i) => { const g = resolve(p), no = blocked(g); return `<span class="chip ${no ? 'no' : ''}">${g.e} ${esc(p.n)}${no ? ' (avoided)' : ''}<button data-act="pdel" data-i="${i}" aria-label="Remove ${esc(p.n)}">×</button></span>`; }).join('') : '<span class="soft small">Nothing yet. Tap items below to add them.</span>'}</div>
    <p class="small soft">Pantry mode deals two of these and adds one or two cheap mystery ingredients to buy. Basics like salt and oil are never dealt as cards.</p></div>
  <div class="sheet"><h3>Tap what you have</h3>
    <div class="chips">${GROUPS.map((g, i) => `<button class="chip pickc tab ${i === pgroup ? 'on' : ''}" data-act="pgroup" data-i="${i}">${g[0]}</button>`).join('')}</div>
    <div class="chips">${items.map(g => { const no = blocked(g), on = inP(g) >= 0; return `<button class="chip pickc ${on ? 'on' : ''} ${no ? 'no' : ''}" data-act="ptoggle" data-id="${g.id}" aria-pressed="${on}" ${no ? 'disabled' : ''}>${g.e} ${esc(g.n)}</button>`; }).join('')}</div>
    <p class="small soft">Crossed-out items are on your avoid list.</p></div>
  <div class="sheet"><h3>Something else</h3>
    <div class="row"><input type="text" class="grow" id="pantryadd" list="inglist" placeholder="Type an item, e.g. leftover chili" autocomplete="off" maxlength="40"><button class="btn" data-act="padd">Add</button></div>
    <datalist id="inglist">${Object.values(ING).map(g => `<option value="${esc(g.n)}">`).join('')}</datalist></div>`;
};
V.boss = () => {
  const L = levelInfo().L, hall = S.log.some(r => !r.win);
  return `${bar('Boss rounds')}<p class="soft">Boss rounds are harder and pay double XP. One becomes available every few rounds.</p>
    ${BOSSES.filter(b => b.lv <= L).map(b => { const no = b.id === 'rematch' && !hall; return `<div class="sheet"><h3>${b.e} ${b.n}</h3><p>${b.d}</p>${no ? '<p class="small soft">Needs at least one dish in the Hall of Legendary Failures.</p>' : ''}<button class="btn yolk wide" data-act="draw" data-mode="deck" data-boss="${b.id}" ${no || !bossReady() ? 'disabled' : ''}>Take it on</button></div>`; }).join('')}`;
};
V.draw = () => {
  const c = S.cur; if (!c) return V.home();
  const cost = estCost(c);
  return `${bar('Round ' + (S.log.length + 1))}
    <div class="sheet">${challengeHTML(c)}
      <p class="eyebrow">You must use</p>${cardsHTML(c, true)}${ideaHTML(c)}
      <p class="eyebrow">${c.mods.length > 1 ? 'Modifiers' : 'Modifier'}</p>${modsHTML(c)}
      <p class="eyebrow">Roles</p>${rolesHTML(c)}
      <p><b>Estimated groceries: about ${money(cost)}.</b> <span class="small soft">A rough guess at US prices for the cards you still need to buy. Tap a price if you already have that card.</span></p>
    </div>
    ${safetyHTML(c.cards, false)}
    <button class="btn primary wide" data-act="start">Aprons on. Let's cook</button>
    <button class="btn wide" data-act="redraw" ${c.redraws ? '' : 'disabled'}>${c.redraws ? 'Redraw everything (1 left)' : 'No redraws left'}</button>
    <button class="link" data-act="abandon">Put this challenge back</button>`;
};
const timerMod = c => c.mods.map(modOf).find(m => m.min);
function clockText(c) {
  const tm = timerMod(c), now = Date.now();
  if (tm && c.timer) { const left = Math.max(0, Math.round((c.timer - now) / 1000)); return (left ? '' : 'Time! ') + String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); }
  if (tm) return tm.min + ':00';
  const s = Math.max(0, Math.round((now - c.started) / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
V.cook = () => {
  const c = S.cur; if (!c) return V.home();
  const tm = timerMod(c), swap = c.mods.includes('swap');
  let resc;
  if (c.rescue) resc = `<p class="eyebrow">Rescue used: ${RESCUE[c.rescue.cat][0]}</p><p class="hand">${esc(c.rescue.hint)}</p>`;
  else if (rescueCat === 'pick') resc = `<p>What is going wrong?</p><div class="chips">${Object.entries(RESCUE).map(([k, v]) => `<button class="btn ghost" data-act="rescue" data-cat="${k}">${v[0]}</button>`).join('')}</div><button class="link" data-act="rescueclose">Never mind, we have got this</button>`;
  else resc = `<p class="small soft">One rescue per round. Skip it and earn 10 bonus XP.</p><button class="btn yolk wide" data-act="rescueopen">Use our rescue</button>`;
  return `${bar('Cooking', 'home')}
    <div class="sheet">${challengeHTML(c)}<div class="chips">${c.cards.map(x => `<span class="chip">${x.e} ${esc(x.n)}</span>`).join('')}</div>${ideaHTML(c)}${modsHTML(c)}${rolesHTML(c)}</div>
    <div class="sheet"><p class="eyebrow">${tm ? tm.n : 'Time in the kitchen'}</p><div class="timer" id="clock">${clockText(c)}</div>
      ${tm && !c.timer ? `<button class="btn wide" data-act="timer">Start the ${tm.min}-minute clock</button>` : ''}
      ${swap ? `<p class="small" id="swapmsg">${tm ? 'The game calls the swap at the halfway mark.' : 'Call the swap yourselves when you are about halfway.'}</p>` : ''}</div>
    ${safetyHTML(c.cards, true)}
    <div class="sheet"><h3>Rescue</h3>${resc}</div>
    <button class="btn primary wide" data-act="tojudge">Dinner is served</button>`;
};
V.judge = () => {
  const c = S.cur; if (!c) return V.home();
  const ok = rated(c), win = ok && verdict(c), avg = ok ? avgOf(c.r) : 0;
  return `${bar('The verdict', 'cook')}
    <div class="sheet"><label class="eyebrow" for="dish">Give it a dramatic name</label><input type="text" class="dish" id="dish" data-b="dish" value="${esc(c.dish)}" maxlength="60" placeholder="The Midnight Skillet of Regret" autocomplete="off"></div>
    ${[0, 1].map(ci => `<div class="sheet"><h3>${esc(chef(ci))} rates it</h3><div class="rate">${['Taste', 'Looks', 'Creativity'].map((k, ki) => `<span class="small">${k}</span>${starsHTML(ci, ki, c.r[ci][ki])}`).join('')}</div></div>`).join('')}
    ${!ok ? `<p class="note">Both chefs rate all three before the verdict comes in. Pass the phone if you are sharing one.</p>` : win
      ? `<div class="sheet ruled"><p class="eyebrow">Average ${avg.toFixed(1)} of 5. It is a win</p><h3>How to make it again</h3>
          <label class="small" for="ings">What went in</label><textarea id="ings" data-b="ings">${esc(c.ings)}</textarea>
          <label class="small" for="steps">What you did, in order</label><textarea id="steps" data-b="steps" placeholder="Write it while you still remember.">${esc(c.steps)}</textarea></div>
         <button class="btn primary wide" data-act="finish">Add it to the Recipe Book</button>
         <button class="link" data-act="force" data-v="0">Honestly, it was a disaster</button>`
      : `<div class="tomb"><p class="eyebrow">Average ${avg.toFixed(1)} of 5. A legendary failure</p><p class="hand" id="epi">${esc(epiText(c))}</p>
          <div class="row" style="justify-content:center"><button class="btn ghost" data-act="epi">Another epitaph</button></div>
          <label class="small" for="epiedit">Or write your own</label><input type="text" id="epiedit" data-b="epi" value="${esc(c.epi)}" maxlength="140" autocomplete="off" placeholder="Here lies..."></div>
         <button class="btn primary wide" data-act="finish">Bury it in the Hall of Failures</button>
         <button class="link" data-act="force" data-v="1">Actually, we would eat that again</button>`}`;
};
V.result = () => {
  const r = lastResult; if (!r) return V.home();
  const li = levelInfo();
  return `<div class="sheet" style="text-align:center"><p class="eyebrow">${r.win ? 'Into the Recipe Book' : 'Into the Hall of Legendary Failures'}</p>
      <p class="hand" style="font-size:2rem">${esc(r.name)}</p><p class="big">+${r.xp} XP</p>
      ${r.up ? `<p><b>Level ${li.L}!</b> You are now the ${titleFor(li.L)}.</p>` : `<p class="soft">Level ${li.L}, ${li.into} / ${li.need} XP</p>`}
      <div class="bar"><i style="width:${Math.round(100 * li.into / li.need)}%"></i></div></div>
    ${r.unlocks.length ? `<div class="sheet"><h3>New in your kitchen</h3><div class="chips">${r.unlocks.map(u => `<span class="chip"><b>${u[0]}:</b> ${esc(u[1])}</span>`).join('')}</div></div>` : ''}
    <p style="text-align:center">Next round, <b>${esc(chef(headNow()))}</b> is head chef.</p>
    <button class="btn primary wide" data-go="home">Back to the kitchen</button>`;
};
const dateOf = r => new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const entryMeta = r => `<p class="small soft">${dateOf(r)} · ${esc(themeOf(r.theme).n)} · head chef ${esc(r.headName)} · ${r.avg.toFixed(1)} of 5${r.boss ? ' · boss round' : ''}</p>`;
V.book = () => {
  const wins = S.log.filter(r => r.win).reverse();
  return `${bar('Recipe Book')}${wins.length ? wins.map(r => open === r.id
    ? `<div class="sheet ruled"><p class="hand">${esc(r.name)}</p>${entryMeta(r)}
        <div class="chips">${r.cards.map(x => `<span class="chip">${x.e} ${esc(x.n)}</span>`).join('')}</div>
        <p class="small soft">${r.mods.map(id => modOf(id).n).join(' · ')}</p>
        <p class="small">Taste ${r.r[0][0]} and ${r.r[1][0]} · Looks ${r.r[0][1]} and ${r.r[1][1]} · Creativity ${r.r[0][2]} and ${r.r[1][2]}</p>
        <label class="small" for="e-ings">What went in</label><textarea id="e-ings" data-e="ings" data-id="${r.id}">${esc(r.ings)}</textarea>
        <label class="small" for="e-steps">How to make it again</label><textarea id="e-steps" data-e="steps" data-id="${r.id}">${esc(r.steps)}</textarea>
        <button class="link" data-act="open" data-id="">Close</button></div>`
    : `<button class="tile entry" data-act="open" data-id="${r.id}"><b class="hand">${esc(r.name)}</b><span>${dateOf(r)} · ${esc(themeOf(r.theme).n)} · ${r.avg.toFixed(1)} of 5</span></button>`).join('')
    : `<div class="sheet ruled"><p class="hand">No recipes yet.</p><p class="soft">Dishes that average 3 of 5 or better land here, with your notes on how to make them again.</p></div>`}`;
};
V.hall = () => {
  const f = S.log.filter(r => !r.win).reverse();
  return `${bar('Hall of Legendary Failures')}${f.length ? f.map(r => `<div class="tomb"><p class="eyebrow">${dateOf(r)}</p><h3>${esc(r.name)}</h3><p class="hand">${esc(r.epi)}</p>
      <p class="small soft">${esc(themeOf(r.theme).n)} · ${r.cards.map(x => esc(x.n)).join(', ')} · ${r.avg.toFixed(1)} of 5</p></div>`).join('')
    : `<div class="tomb"><h3>Nobody here yet</h3><p class="hand">The Hall is patient.</p><p class="small soft">Disasters still earn XP, and each one gets an epitaph.</p></div>`}`;
};
V.unlocks = () => {
  const L = levelInfo().L, rows = [];
  for (let l = 2; l <= 12; l++) { const u = unlocksAt(l); if (u.length) rows.push([l, u]); }
  return `${bar('Unlocks')}<div class="sheet"><p>You are level ${L}, the <b>${titleFor(L)}</b>. Next title: ${(TITLES.find(t => t[0] > L) || [0, 'you have them all'])[1]}.</p>
    <ul class="ladder">${rows.map(([l, u]) => `<li class="${l > L ? 'locked' : ''}"><span class="lv">Lv ${l}</span><span>${l > L ? u.map(x => x[0]).join(', ') + ' (locked)' : u.map(x => `<b>${x[0]}:</b> ${esc(x[1])}`).join('<br>')}</span></li>`).join('')}</ul></div>`;
};
V.safety = () => `${bar('Food safety chart')}${safetyHTML([], true).replace(/<p class="small">No meat[^<]*<\/p>/, '')}`;
V.share = () => `${bar('Saving and sharing')}
  <div class="sheet"><h3>Where your kitchen is saved</h3><p id="status">${CLOUD_TEXT[cloud]}</p>
    <p class="small soft">${STANDALONE ? 'Everything (levels, Recipe Book, Hall, pantry, the round in progress) is saved on this phone and works offline. ' + (linked() ? 'This phone is linked, so the other linked phone sees every change within a few seconds.' : 'Link your two phones below and they share one kitchen, live.') : 'When a phone is signed in to Claude and has access to this page, the whole kitchen (levels, Recipe Book, Hall, pantry, the round in progress) is kept in one shared save. A phone that is invited as a viewer sees everything update but cannot change it, so ratings are entered on the main phone. A phone that is not signed in keeps its own separate save.'}</p></div>
  ${STANDALONE && CFG ? (linked()
    ? `<div class="sheet"><h3>Your phones are linked</h3><p class="small soft">On the other phone, open Supper Run, come to this screen, and paste this link code. Keep it between the two of you: anyone with the code can see and change your kitchen.</p>
        <input type="text" id="linkcode" readonly value="${esc(code)}"><button class="btn wide" data-act="copylink">Copy link code</button>
        <button class="link" data-act="unlink">${open === 'unlink' ? 'Yes, unlink this phone (the kitchen stays on it)' : 'Unlink this phone'}</button></div>`
    : `<div class="sheet"><h3>Link your two phones</h3><p class="small soft">One of you starts a shared kitchen and sends the link code to the other. After that, both phones show the same challenge, ratings and Recipe Book.</p>
        <button class="btn primary wide" data-act="linknew">Start a shared kitchen with this phone</button>
        <label class="small" for="joincode">Or paste the code from the other phone</label><input type="text" id="joincode" placeholder="sr-xxxx-xxxx-xxxx-xxxx" autocomplete="off" autocapitalize="none" spellcheck="false">
        <button class="btn wide" data-act="linkjoin">Join that kitchen</button></div>`) : ''}
  <div class="sheet"><h3>Move a kitchen by hand</h3><p class="small soft">Copy this code and paste it on another phone to load the same kitchen there. It is a snapshot, so it does not stay in sync afterwards.</p>
    <textarea id="code" readonly>${esc(btoa(unescape(encodeURIComponent(JSON.stringify(S)))))}</textarea>
    <button class="btn wide" data-act="copy">Copy kitchen code</button>
    <label class="small" for="incode">Paste a code to load it here</label><textarea id="incode" placeholder="Paste a kitchen code"></textarea>
    <button class="btn wide" data-act="import">${open === 'import' ? 'Yes, replace this phone\'s kitchen' : 'Load pasted kitchen'}</button></div>`;

function render() {
  if (!V[view]) view = 'home';
  const a = document.activeElement, id = a && a.id, pos = a && a.selectionStart;
  $('#app').innerHTML = V[view]();
  if (id) { const el = document.getElementById(id); if (el && /INPUT|TEXTAREA/.test(el.tagName)) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { } } }
}
function go(v) { view = v; open = null; rescueCat = null; if (v !== 'prefs') draft = null; render(); window.scrollTo(0, 0); }

// ---------- actions ----------
const A = {
  draw(d) {
    const c = draw(d.mode, d.boss);
    if (!c) return toast(!S.prefs.ok ? 'Set up allergies first.' : d.mode === 'pantry' ? 'Your pantry does not make a dish yet. Add a main ingredient and a base, like chicken and rice, or eggs and bread.' : 'Not enough cards to deal with the current avoid list.');
    if (mutate(s => { s.cur = c; }, true)) go('draw');
  },
  redraw() { const o = S.cur; if (!o || !o.redraws) return; const c = draw(o.mode, o.boss); if (c) { c.redraws = 0; mutate(s => { s.cur = c; }); } },
  abandon() { if (mutate(s => { s.cur = null; }, true)) go('home'); },
  have(d) { mutate(s => { const x = s.cur.cards[+d.i]; x.have = !x.have; }); },
  start() { if (mutate(s => { s.cur.stage = 'cook'; s.cur.started = Date.now(); s.cur.ings = s.cur.cards.map(x => x.n).join(', '); }, true)) go('cook'); },
  timer() { const tm = timerMod(S.cur); mutate(s => { s.cur.timer = Date.now() + tm.min * 60000; }); },
  rescueopen() { if (follower) return toast('Rescues are picked on the main phone.'); rescueCat = 'pick'; render(); },
  rescueclose() { rescueCat = null; render(); },
  rescue(d) {
    const hints = RESCUE[d.cat][1].filter(h => h[1].every(allowed)); // drop any hint that names an avoided food
    const h = pick(hints); rescueCat = null;
    mutate(s => { s.cur.rescue = { cat: d.cat, hint: h[0] }; });
  },
  tojudge() { if (mutate(s => { s.cur.stage = 'judge'; if (!s.cur.epiT) s.cur.epiT = epitaph(s.cur); }, true)) go('judge'); },
  rate(d) { mutate(s => { s.cur.r[+d.c][+d.k] = +d.v; s.cur.force = null; s.cur.rt = s.cur.rt || [0, 0]; s.cur.rt[+d.c] = Date.now(); }); },
  epi() { mutate(s => { s.cur.epiT = epitaph(s.cur); s.cur.epi = ''; }); },
  force(d) { mutate(s => { s.cur.force = d.v === '1'; }); },
  finish() {
    const c = S.cur; if (!c || !rated(c)) return;
    const win = verdict(c), before = levelInfo().L, xp = scoreXp(c, win), name = c.dish.trim() || (win ? 'The Untitled Triumph' : 'The Nameless Dish');
    const entry = { id: c.id, date: new Date().toISOString(), theme: c.theme, cards: c.cards, mods: c.mods, boss: c.boss, head: c.head, headName: chef(c.head), name, r: c.r, avg: avgOf(c.r), win, ings: c.ings, steps: c.steps, epi: win ? '' : (c.epi || (c.epiT || epitaph(c)).replace('{d}', name)), rescue: c.rescue ? c.rescue.cat : null, xp };
    if (!mutate(s => { s.log.push(entry); s.cur = null; }, true)) return;
    const after = levelInfo().L, unlocks = []; for (let l = before + 1; l <= after; l++) unlocks.push(...unlocksAt(l));
    lastResult = { name, xp, win, up: after > before, unlocks: unlocks.filter(u => u[0] !== 'Rare card' || allowed(Object.values(ING).find(g => g.n === u[1]))) };
    go('result');
  },
  tick(d, el) { const set = draft[d.set], i = set.indexOf(d.k); if (el.checked && i < 0) set.push(d.k); if (!el.checked && i >= 0) set.splice(i, 1); render(); },
  saveprefs() {
    const no = draft.no.split(',').map(s => s.trim()).filter(Boolean), dr = draft;
    const ok = mutate(s => {
      s.chefs = [dr.chefs[0].trim() || 'Chef one', dr.chefs[1].trim() || 'Chef two'];
      s.prefs = { ok: true, al: dr.al.slice(), diets: dr.diets.slice(), no };
      if (s.cur && s.cur.cards.some(c => blocked(resolve(c), s.prefs))) { s.cur = null; toast('The challenge on the table used something you now avoid, so it was put back.'); }
    }, true);
    if (ok) go('home');
  },
  padd() {
    const el = $('#pantryadd'), n = el.value.trim(); if (!n) return;
    if (S.pantry.some(p => stems(p.n).join(' ') === stems(n).join(' '))) return toast('That is already on the shelf.');
    const g = lookup(n); if (blocked(g || custom(n))) toast('Added, but it is on your avoid list so it will never be dealt.');
    mutate(s => { s.pantry.push({ n: g ? g.n : n, id: g ? g.id : null }); }); $('#pantryadd').focus();
  },
  pdel(d) { mutate(s => { s.pantry.splice(+d.i, 1); }); },
  pgroup(d) { pgroup = +d.i; render(); },
  ptoggle(d) { const g = ING[d.id]; if (!g || blocked(g)) return; mutate(s => { const i = s.pantry.findIndex(p => p.id === g.id); if (i >= 0) s.pantry.splice(i, 1); else s.pantry.push({ n: g.n, id: g.id }); }); },
  flip() { mutate(s => { s.flip = s.flip ? 0 : 1; }); },
  noterm(d) { const list = draft.no.split(',').map(x => x.trim()).filter(Boolean), i = list.findIndex(x => termKey(x) === termKey(d.t)); if (i >= 0) list.splice(i, 1); else list.push(d.t); draft.no = list.join(', '); render(); },
  open(d) { open = d.id || null; render(); },
  linknew() { setCode(newCode()); if (!S.at) S.at = Date.now(); schedulePush(); render(); toast('Shared kitchen started. Send the link code to the other phone.'); },
  linkjoin() {
    const c = $('#joincode').value.trim().toLowerCase().replace(/\s+/g, ''); if (!CODE_RE.test(c)) return toast('That does not look like a link code. It starts with sr- and has four groups of four.');
    setCode(c); render(); pull(true).then(() => { toast(cloud === 'shared' ? 'Linked. This phone now shares that kitchen.' : 'Saved the code, but could not reach the shared kitchen yet.'); render(); });
  },
  unlink() { if (open !== 'unlink') { open = 'unlink'; return render(); } setCode(null); open = null; render(); },
  copylink() { const t = $('#linkcode'); try { navigator.clipboard.writeText(t.value).then(() => toast('Link code copied.'), () => { t.select(); toast('Select and copy the code above.'); }); } catch (e) { t.select(); toast('Select and copy the code above.'); } },
  copy() { const t = $('#code'); const done = () => toast('Kitchen code copied.'); try { navigator.clipboard.writeText(t.value).then(done, () => { t.select(); toast('Select and copy the code above.'); }); } catch (e) { t.select(); toast('Select and copy the code above.'); } },
  import() {
    let j = null; try { j = JSON.parse(decodeURIComponent(escape(atob($('#incode').value.trim())))); } catch (e) { }
    if (!j || j.v !== 1 || !Array.isArray(j.log)) return toast('That does not look like a kitchen code.');
    if (open !== 'import') { const keep = $('#incode').value; open = 'import'; render(); $('#incode').value = keep; return; }
    if (mutate(s => { Object.assign(s, fresh(), j); }, true)) { toast('Kitchen loaded.'); go('home'); }
  }
};
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) return go(g.dataset.go);
  const b = e.target.closest('[data-act]'); if (b && b.type !== 'checkbox' && A[b.dataset.act]) A[b.dataset.act](b.dataset, b);
});
document.addEventListener('change', e => { const b = e.target; if (b.type === 'checkbox' && b.dataset.act) A[b.dataset.act](b.dataset, b); });
document.addEventListener('input', e => {
  const el = e.target, d = el.dataset;
  if (d.d) { if (d.d === 'no') { draft.no = el.value; const p = { al: draft.al, diets: draft.diets, no: el.value.split(',').map(s => s.trim()).filter(Boolean) }; $('#lockout').innerHTML = lockoutText(Object.values(ING).filter(g => !g.st && blocked(g, p))); } else draft.chefs[+d.d.slice(4)] = el.value; }
  else if (d.b && S.cur) { if (!mutate(s => { s.cur[d.b] = el.value; }, true)) return; const p = $('#epi'); if (p) p.textContent = epiText(S.cur); }
  else if (d.e) mutate(s => { const r = s.log.find(x => x.id === d.id); if (r) r[d.e] = el.value; }, true);
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'pantryadd') A.padd(); });
let swapCalled = null, timeCalled = null;
setInterval(() => {
  const c = S.cur, el = $('#clock'); if (!c || c.stage !== 'cook') return;
  if (el) el.textContent = clockText(c);
  const tm = timerMod(c); if (!tm || !c.timer) return;
  const left = c.timer - Date.now();
  if (c.mods.includes('swap') && left <= tm.min * 30000 && swapCalled !== c.id) { swapCalled = c.id; toast('Halfway! Swap roles now.'); const m = $('#swapmsg'); if (m) m.innerHTML = '<b>Halfway. Swap roles now.</b>'; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { } }
  if (left <= 0 && timeCalled !== c.id) { timeCalled = c.id; toast('Time is up. Hands off the food!'); try { navigator.vibrate && navigator.vibrate(600); } catch (e) { } }
}, 1000);

loadLocal(); render(); connect();
window.__sr = { get S() { return S; }, get cloud() { return cloud; }, get code() { return code; }, blocked, resolve, allowed, draw, deck, ING, RESCUE, levelInfo, custom, stems };
