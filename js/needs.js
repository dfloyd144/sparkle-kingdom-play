/* Sims-style needs for the princess: food, potty, sleep, clean, fun, friends.
   They drift down slowly while she plays and are filled by doing things in the kingdom.
   Kid-friendly: nothing bad ever happens — the princess just looks a bit sad and asks for help. */
(function () {
  const A = K.art, I = A.icons;
  const NEEDS = [
    { id: 'hunger', word: 'food', icon: 'apple', scene: 'bakery', low: "I'm hungry! Can we cook something healthy?", mins: 12 },
    { id: 'potty', word: 'potty', icon: 'toilet', scene: 'bath', low: 'I need to go potty!', mins: 10 },
    { id: 'energy', word: 'sleep', icon: 'moon', scene: 'bedtime', low: "Yawn! I'm so sleepy.", mins: 25 },
    { id: 'clean', word: 'bath', icon: 'tub', scene: 'bath', low: 'I feel a little messy. Bath time?', mins: 16 },
    { id: 'fun', word: 'play', icon: 'ball', scene: 'unicorn', low: 'I want to play! Can we play with Sparkle?', mins: 9 },
    { id: 'friends', word: 'friends', icon: 'hug', scene: 'tea', low: 'I miss my friends! Can we have a tea party?', mins: 14 },
  ];
  const N = (K.needs = { NEEDS });

  const st = () => {
    const S = K.save.data;
    if (!S.needs || typeof S.needs !== 'object') S.needs = {};
    NEEDS.forEach((n) => { if (typeof S.needs[n.id] !== 'number') S.needs[n.id] = 80; });
    return S.needs;
  };
  N.enabled = () => K.save.data.settings.needs !== false;
  N.get = (id) => st()[id];
  N.lowest = () => NEEDS.reduce((lo, n) => (st()[n.id] < st()[lo.id] ? n : lo), NEEDS[0]);
  N.mood = () => { const v = st()[N.lowest().id]; return v >= 50 ? 'happy' : v >= 25 ? 'ok' : 'sad'; };
  N.add = (id, amt) => {
    const s = st();
    const before = s[id];
    s[id] = K.clamp(s[id] + amt, 0, 100);
    if (before < 40 && s[id] >= 60 && N.enabled()) {
      K.wait(1200).then(() => K.voice.say(K.pick(['Thank you! I feel much better!', 'Ahh, that’s better!', 'Yay! I feel happy now!'])));
    }
    K.save.write();
    refresh(true);
  };

  /* ---------- what fills each need ---------- */
  N.onEvent = (ev, d = {}) => {
    switch (ev) {
      case 'eat': N.add('hunger', d.amount || 30); break;
      case 'potty': N.add('potty', 100); break;
      case 'wash': N.add('clean', 15); break;
      case 'bath': N.add('clean', 100); break;
      case 'slept': N.add('energy', 100); N.add('potty', -30); N.add('hunger', -20); break;
      case 'unicorn': N.add('fun', d.act === 'ride' ? 20 : 8); if (d.act === 'wash' || d.act === 'brush') N.add('friends', 4); break;
      case 'dance': N.add('fun', 6); N.add('friends', 3); break;
      case 'firework': N.add('fun', 4); break;
      case 'teaGuest': N.add('friends', 15); break;
      case 'teaDrink': N.add('friends', 4); break;
      case 'cheers': N.add('friends', d.full ? 25 : 8); N.add('fun', 5); break;
      case 'chef': N.add('friends', 8); N.add('fun', 5); break;
      case 'baked': N.add('fun', 8); break;
      case 'word': case 'spelled': N.add('fun', 15); break;
      case 'read': case 'counted': case 'missing': case 'math': N.add('fun', 8); break;
      case 'decorate': N.add('fun', 5); break;
      case 'roomAdd': case 'dress': N.add('fun', 3); break;
      case 'hands': N.add('fun', 10); break;
      case 'pet': N.add('fun', 8); N.add('friends', 5); break;
      case 'adopt': N.add('fun', 20); N.add('friends', 20); break;
      case 'tapWord': N.add('fun', 2); break;
    }
  };
  const prevEmit = K.emit;
  K.emit = (ev, d = {}) => { try { N.onEvent(ev, d); } catch (e) { console.error(e); } prevEmit(ev, d); };

  /* ---------- HUD button: the princess's mood ---------- */
  const btn = document.getElementById('needsBtn');
  let lastMood = '', lastLook = '';
  function refresh(bump) {
    if (!btn) return;
    btn.style.display = N.enabled() ? '' : 'none';
    const mood = N.mood(), look = JSON.stringify(K.me());
    if (mood !== lastMood || look !== lastLook) {
      lastMood = mood; lastLook = look;
      const face = mood === 'happy' ? '<path d="M-10 4 Q0 14 10 4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>'
        : mood === 'ok' ? '<path d="M-9 8 H9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'
          : '<path d="M-10 10 Q0 1 10 10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>';
      const col = mood === 'happy' ? '#5fc48a' : mood === 'ok' ? '#ffb84d' : '#ff6f91';
      btn.innerHTML = `<svg viewBox="-44 -44 88 88"><g transform="translate(0 4) scale(.42)">${A.princessHead(K.me())}</g>
        <g transform="translate(22 24)"><circle r="16" fill="${col}" stroke="#fff" stroke-width="3"/><circle cx="-5" cy="-3" r="2.4" fill="#fff"/><circle cx="5" cy="-3" r="2.4" fill="#fff"/><g transform="translate(0 -1) scale(.7)">${face}</g></g></svg>`;
    }
    btn.classList.toggle('low', mood === 'sad');
    if (bump) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
  }
  N.refresh = refresh;
  if (btn) btn.addEventListener('pointerdown', (e) => { e.preventDefault(); K.audio.unlock(); K.audio.sfx('pop'); N.open(); });

  /* ---------- needs card ---------- */
  const card = document.getElementById('needsCard');
  N.open = () => {
    const s = st(), name = K.myName();
    const cell = (n) => {
      const v = Math.round(s[n.id]);
      const col = v >= 50 ? '#5fc48a' : v >= 25 ? '#ffb84d' : '#ff6f91';
      return `<button class="nd" data-id="${n.id}"><svg viewBox="-44 -44 88 88">${I[n.icon]}</svg>
        <span class="nw"><b>${n.word[0]}</b>${n.word.slice(1)}</span><span class="bar"><i style="width:${Math.max(6, v)}%;background:${col}"></i></span></button>`;
    };
    card.innerHTML = `<div class="nd-panel"><div class="nd-head"><svg viewBox="-44 -44 88 88"><g transform="translate(0 4) scale(.45)">${A.princessHead(K.me())}</g></svg><span>${name}</span>
      <button class="nd-close" aria-label="Close"><svg viewBox="-30 -30 60 60"><path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/></svg></button></div>
      <div class="nd-grid">${NEEDS.map(cell).join('')}</div></div>`;
    card.classList.remove('hidden');
    const low = NEEDS.filter((n) => s[n.id] < 40);
    K.voice.say(low.length ? `${name} needs ${low.map((n) => n.word).join(' and ')}. Tap a picture to help!` : `${name} feels great!`, { force: true });
    card.querySelector('.nd-close').addEventListener('pointerdown', (e) => { e.preventDefault(); N.close(); });
    card.querySelectorAll('.nd').forEach((b) => b.addEventListener('pointerdown', (e) => {
      e.preventDefault(); K.audio.sfx('tap');
      const n = NEEDS.find((x) => x.id === b.dataset.id);
      N.close();
      if (K.curName !== n.scene) K.go(n.scene); else K.voice.say(n.low);
    }));
  };
  /** Tapping the princess (any scene) shows how she feels. If she needs something she doesn't act happy. */
  K.onPlayerTap = (el) => {
    if (!N.enabled() || ['hands', 'spellbook'].includes(K.curName)) return false;
    const sad = N.mood() !== 'happy';
    if (sad) { const a = el.querySelector('.anim'); if (a) K.replay(a, 'a-wiggle', 600); K.audio.sfx('boing'); }
    K.wait(sad ? 300 : 800).then(() => N.open());
    return sad;
  };
  N.close = () => { card.classList.add('hidden'); card.innerHTML = ''; };
  if (card) card.addEventListener('pointerdown', (e) => { if (e.target === card) N.close(); });

  /* ---------- time passing (only while playing) ---------- */
  let saveT = 0, lastNag = performance.now(), moodT = 0;
  K.every((dt) => {
    if (!K.curName || document.hidden || !N.enabled()) return;
    if (K.curName === 'bedtime' && K.needs.sleeping) return;
    if (K.curName === 'spellbook') return;
    const s = st();
    NEEDS.forEach((n) => { s[n.id] = Math.max(5, s[n.id] - (100 / (n.mins * 60)) * dt); });
    saveT += dt; moodT += dt;
    if (saveT > 5) { saveT = 0; K.save.write(); }
    if (moodT > 1) {
      moodT = 0;
      refresh();
      const sad = N.mood() === 'sad' && K.curName !== 'hands';
      document.querySelectorAll('#scene .princess.player').forEach((el) => el.classList.toggle('sad', sad));
      // a gentle reminder now and then (never during the activity that fixes it)
      const lo = N.lowest();
      if (s[lo.id] < 25 && K.curName !== lo.scene && performance.now() - lastNag > 80000 && !K.busy) {
        lastNag = performance.now();
        // only talk about needs at the castle (kingdom); elsewhere just wiggle the needs button so games aren't interrupted
        if (K.curName === 'kingdom') K.voice.say(lo.low, { pitch: 1.25 });
        if (btn) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
      }
    }
  }, true);
  refresh();
})();
