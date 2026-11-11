/* Learning tracker: remembers what she gets right and wrong so school can bring back tricky
   items and ease off when she is struggling. Also counts routines and powers the grown-up
   progress page. Everything stays on this device. */
(function () {
  const L = (K.learn = {});
  const D = () => {
    const S = K.save.data;
    if (!S.learn) S.learn = { items: {}, recent: {}, ev: {}, since: Date.now() };
    return S.learn;
  };

  /** Record one answer. ok = right on the first try. */
  L.record = (kind, key, ok) => {
    const d = D(), k = (d.items[kind] = d.items[kind] || {});
    const it = (k[key] = k[key] || { r: 0, w: 0 });
    if (ok) it.r++; else it.w++;
    it.t = Date.now();
    const rc = (d.recent[kind] = d.recent[kind] || []);
    rc.push(ok ? 1 : 0);
    if (rc.length > 6) rc.shift();
    schoolRotation(kind);
    K.save.write();
  };
  /* School rotation: after a run of one school game, that game rests until she plays others.
     Numbers are how many answers in a row before a rest (spelling words and stories take longer). */
  const RUN = { read: 8, spell: 4, story: 2, trace: 5, math: 8, clock: 8, coins: 8, missing: 8 };
  const WAKE = 4; // answers in other games before a resting game wakes up
  function schoolRotation(kind) {
    if (!RUN[kind]) return;
    const sc = K.save.data.school;
    if (!sc) return;
    sc.resting = sc.resting || {};
    Object.keys(sc.resting).forEach((m) => { if (m !== kind && --sc.resting[m] <= 0) delete sc.resting[m]; });
    sc.run = sc.runKind === kind ? (sc.run || 0) + 1 : 1;
    sc.runKind = kind;
    if (sc.run >= RUN[kind]) { sc.run = 0; sc.resting[kind] = WAKE; if (K.schoolRest) K.schoolRest(kind); }
  }
  /** Two of the last three wrong: make the next ones easier. */
  L.struggling = (kind) => { const last = (D().recent[kind] || []).slice(-3); return last.length === 3 && last.filter((x) => !x).length >= 2; };
  const weight = (kind, key) => { const it = (D().items[kind] || {})[key]; if (!it) return 2; return 1 + Math.max(0, it.w * 2 - it.r); };
  /** Weighted pick: tricky and new items come up more often. */
  L.pick = (kind, list) => {
    const ws = list.map((k) => weight(kind, k)), tot = ws.reduce((a, b) => a + b, 0);
    let r = Math.random() * tot;
    for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  };
  L.tricky = (kind) => Object.entries(D().items[kind] || {}).filter(([, v]) => v.w > 0 && v.w * 2 > v.r).sort((a, b) => (b[1].w - b[1].r) - (a[1].w - a[1].r)).map(([k]) => k);
  L.mastered = (kind) => Object.entries(D().items[kind] || {}).filter(([, v]) => v.r >= 2 && v.r > v.w * 2).map(([k]) => k);
  L.items = (kind) => D().items[kind] || {};

  // count every activity event (potty, slept, hands...) for the progress page
  const prev = K.emit;
  K.emit = (ev, d = {}) => { try { const e = D().ev; e[ev] = (e[ev] || 0) + 1; } catch (x) { /* save not ready */ } prev(ev, d); };

  /* ---------- grown-up progress page ---------- */
  const css = document.createElement('style');
  css.textContent = `#progress{position:absolute;inset:0;z-index:30;background:rgba(80,40,110,.45);display:flex;align-items:center;justify-content:center;touch-action:auto}
    #progress .pg{background:#fffaf6;border-radius:22px;width:min(640px,94vw);max-height:90vh;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px 20px 22px;color:#4a3366;font:16px/1.4 var(--font);box-shadow:0 10px 40px rgba(60,20,90,.35)}
    #progress h2{margin:0 0 4px;font-size:24px;color:#6d4a92}#progress h3{margin:16px 0 6px;font-size:18px;color:#8f63d6}
    #progress .sub{color:#8a77a6;font-size:13px;margin:0 0 6px}#progress .chips{display:flex;flex-wrap:wrap;gap:6px}
    #progress .chip{background:#efe6fb;border-radius:999px;padding:3px 10px;font-size:14px}#progress .chip.t{background:#ffe0ea;color:#a83a62}
    #progress .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}
    #progress .stat{background:#f4eefc;border-radius:14px;padding:8px 10px}#progress .stat b{display:block;font-size:24px;color:#6d4a92}
    #progress button.close{float:right;border:0;background:#8f63d6;color:#fff;border-radius:999px;padding:8px 16px;font:700 15px var(--font)}
    #progress .none{color:#a59ac0;font-size:14px}`;
  document.head.appendChild(css);

  const chips = (list, cls = '') => (list.length ? `<div class="chips">${list.map((x) => `<span class="chip ${cls}">${x}</span>`).join('')}</div>` : '<div class="none">nothing yet</div>');
  const lc = (w) => String(w).toLowerCase();
  L.openProgress = () => {
    const S = K.save.data, d = D(), SC = S.school || {}, ev = d.ev || {};
    const spellDone = (S.spell && S.spell.done) || [];
    const stories = Object.entries(SC.storiesRead || {});
    const traced = Object.keys(SC.traceDone || {});
    const countMax = Math.max(0, ...Object.keys(L.items('count')).filter((k) => L.items('count')[k].r > 0).map(Number));
    const tricky = [...L.tricky('read').map(lc), ...L.tricky('spell').map(lc), ...L.tricky('math'), ...L.tricky('clock'), ...L.tricky('coins').map((c) => c + '¢'), ...L.tricky('trace'), ...L.tricky('missing').map(lc)].slice(0, 14);
    const since = new Date(d.since || Date.now()).toLocaleDateString();
    const stat = (label, n) => `<div class="stat"><b>${n || 0}</b>${label}</div>`;
    const el = document.createElement('div');
    el.id = 'progress';
    el.innerHTML = `<div class="pg"><button class="close">Close</button><h2>Learning progress</h2><p class="sub">Right and wrong answers are tracked since ${since}. Everything stays on this device.</p>
      <h3>Practice together</h3><p class="sub">Things she has missed more than she got right. School shows these more often.</p>${chips(tricky, 't')}
      <h3>Reading</h3><p class="sub">Words read right again and again</p>${chips(L.mastered('read').map(lc))}
      <h3>Spelling</h3><p class="sub">Words spelled in the magic book</p>${chips(spellDone.map(lc))}
      <h3>Stories read</h3>${chips(stories.map(([id, n]) => `${(K.storyTitle && K.storyTitle(id)) || id}${n > 1 ? ' ×' + n : ''}`))}
      <h3>Letters and numbers traced</h3>${chips(traced)}
      <h3>Numbers</h3><div class="grid">${stat('missing letters found', SC.missRight)}${stat('math facts mastered', L.mastered('math').length)}${stat('math answers right', SC.mathRight)}${stat('clock times right', SC.clockRight)}${stat('coin questions right', SC.coinRight)}</div>
      <h3>Routines in the game</h3><div class="grid">${stat('potty trips', ev.potty)}${stat('hand washes', ev.wash)}${stat('baths', ev.bath)}${stat('nights in own bed', ev.slept)}${stat('happy hands', ev.hands)}${stat('meals cooked for Chef', ev.chef)}</div></div>`;
    document.getElementById('app').appendChild(el);
    el.querySelector('.close').addEventListener('click', () => el.remove());
  };
})();
