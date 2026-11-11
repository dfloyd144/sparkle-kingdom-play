/* Rest time: a gentle end to play. After the grown-up's chosen minutes the princess
   yawns, the lullaby plays and a goodnight screen shows. It stays for an hour unless a
   grown-up presses and holds the moon button. Pets always rest happy when play stops. */
(function () {
  const REST_MS = 60 * 60 * 1000;   // goodnight screen lasts an hour
  const AWAY_MS = 60 * 60 * 1000;   // an hour away starts a fresh play time
  const S = () => K.save.data;
  let shown = false, warned = false;

  // pets go to sleep cozy, so nothing ever feels neglected while she is away
  function tuckInPets() {
    if (!K.pets || !K.pets.list) return;
    K.pets.list().forEach((p) => { p.hunger = Math.max(p.hunger, 60); p.fun = Math.max(p.fun, 60); p.love = Math.max(p.love, 60); });
    K.save.write();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) tuckInPets(); });
  addEventListener('pagehide', tuckInPets);

  const css = document.createElement('style');
  css.textContent = `#rest{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2vmin;
    background:radial-gradient(ellipse at 50% 30%,#4b3f8f 0%,#2a2560 60%,#1d1a45 100%);color:#fff6d8;text-align:center;font-family:var(--font);opacity:0;transition:opacity 1.5s}
    #rest.on{opacity:1}#rest svg.art{width:min(70vw,60vh);height:auto}#rest h1{font-size:clamp(34px,8vmin,64px);margin:0}
    #rest p{font-size:clamp(16px,3.6vmin,26px);margin:0;max-width:80vw;color:#d9d0ff}
    #restWake{margin-top:3vmin;width:clamp(64px,13vmin,96px);height:clamp(64px,13vmin,96px);border-radius:50%;border:4px solid #fff6d8;background:#3a3478;position:relative;touch-action:none}
    #restWake svg{width:60%;height:60%}#restWake.holding{background:#5a4fb0;transition:background 2s}
    #rest small{font-size:clamp(12px,2.4vmin,16px);color:#9a90d0}`;
  document.head.appendChild(css);

  function art() {
    const A = K.art, me = K.me();
    const stars = Array.from({ length: 14 }, (_, i) => `<path d="${A.star(4 + (i % 3) * 2)}" transform="translate(${(i * 83) % 600 - 300} ${((i * 47) % 160) - 200})" fill="#fff6b0" opacity=".8"/>`).join('');
    return `<svg class="art" viewBox="-300 -230 600 400" xmlns="http://www.w3.org/2000/svg">${stars}
      <circle cx="200" cy="-150" r="44" fill="#fff6d8"/><circle cx="220" cy="-165" r="40" fill="#2f2a68"/>
      <path d="M-200 150 Q-200 40 -110 40 H150 Q210 40 210 150Z" fill="#c9a6ff" stroke="#fff" stroke-width="6"/>
      <rect x="-200" y="70" width="410" height="90" rx="30" fill="#ffd1e8" stroke="#fff" stroke-width="6"/>
      <ellipse cx="-120" cy="60" rx="70" ry="34" fill="#fff"/>
      <g transform="translate(-120 30) scale(.62)">${A.princessHead(me)}</g>
      <rect x="-60" y="58" width="260" height="70" rx="28" fill="#9fd2ff" stroke="#fff" stroke-width="6"/>
      <text x="-30" y="-40" font-size="40" fill="#fff6d8" opacity=".9">z</text><text x="0" y="-80" font-size="54" fill="#fff6d8" opacity=".8">z</text><text x="40" y="-128" font-size="68" fill="#fff6d8" opacity=".7">Z</text></svg>`;
  }

  function show(fresh) {
    if (shown) return;
    shown = true;
    meter();
    if (fresh) { S().restAt = Date.now(); tuckInPets(); }
    const name = (S().names && S().names[0]) || 'Princess';
    const el = document.createElement('div');
    el.id = 'rest';
    el.innerHTML = `${art()}<h1>Time to rest</h1><p>${name} and all the pets are cozy and sleeping. Come back later to play again!</p>
      <button id="restWake" aria-label="Grown-ups: press and hold"><svg viewBox="-30 -30 60 60"><path d="M8 -22 A22 22 0 1 0 22 8 A16 16 0 1 1 8 -22Z" fill="#fff6d8"/></svg></button><small>grown-ups: press and hold the moon</small>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('on'));
    try { K.audio.setTrack('lullaby'); } catch (e) { /* audio not ready */ }
    if (fresh) K.voice.say(`Yawn! Time to rest. ${name} and the pets are cozy and sleeping. Come back later to play again!`, { force: true });
    const w = el.querySelector('#restWake');
    let t = null;
    const end = () => { clearTimeout(t); w.classList.remove('holding'); };
    w.addEventListener('pointerdown', (e) => { e.preventDefault(); w.classList.add('holding'); t = setTimeout(() => { end(); wake(el); }, 2000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => w.addEventListener(ev, end));
  }
  function wake(el) {
    S().restAt = 0; S().playSec = 0; K.save.write();
    shown = false; warned = false;
    el.remove();
    meter();
    try { K.audio.setTrack(K.audio.song || 'kingdom'); } catch (e) { /* ignore */ }
  }

  // count real play time (only while the game is on screen and started)
  setInterval(() => {
    const s = S();
    if (!s || shown || document.hidden) return;
    const mins = limit();
    const started = document.getElementById('start') && document.getElementById('start').classList.contains('gone');
    if (!mins || !started) return;
    const now = Date.now();
    if (now - (s.lastPlay || 0) > AWAY_MS) s.playSec = 0;
    s.lastPlay = now;
    s.playSec = (s.playSec || 0) + 5;
    const left = mins * 60 - s.playSec;
    if (left <= 120 && left > 0 && !warned) { warned = true; K.voice.say('Two more minutes to play, then it will be time to rest!', { force: true }); if (K.hint) K.hint('Two more minutes, then rest time!'); }
    if (left <= 0) show(true);
    if (s.playSec % 30 === 0) K.save.write();
    meter();
  }, 5000);

  // still resting from earlier? show the goodnight screen again
  function limit() { const st = S().settings; return st.restOff ? 0 : Math.min(30, Math.max(1, +st.playMins || 20)); }

  /* the sky meter by the stars: the sun slides toward the moon as play time runs out */
  function meter() {
    const el = document.getElementById('restMeter');
    if (!el) return;
    const s = S(), mins = limit();
    if (!mins || shown) { el.hidden = true; return; }
    el.hidden = false;
    const f = Math.min(1, (s.playSec || 0) / (mins * 60)), left = mins * 60 - (s.playSec || 0);
    const x = 26 + f * 148;
    el.classList.toggle('soon', left <= 180);
    el.innerHTML = `<svg viewBox="0 0 200 52" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rmSky" x1="0" x2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset=".55" stop-color="#ffc2dc"/><stop offset="1" stop-color="#4b3f8f"/></linearGradient></defs>
      <rect x="3" y="3" width="194" height="46" rx="23" fill="#fff" stroke="#e3d3f5" stroke-width="4"/>
      <rect x="7" y="7" width="${Math.max(40, x + 16)}" height="38" rx="19" fill="url(#rmSky)"/>
      <g transform="translate(174 26)"><circle r="15" fill="#fff6b0" stroke="#e6c34a" stroke-width="2"/><circle cx="6" cy="-5" r="13" fill="${f > 0.9 ? '#4b3f8f' : '#fff'}"/></g>
      <g transform="translate(${x} 26)"><circle r="16" fill="#ffd166" stroke="#f0a92e" stroke-width="3"/><circle cx="-5" cy="-2" r="2" fill="#7a4a12"/><circle cx="5" cy="-2" r="2" fill="#7a4a12"/><path d="M-5 5 Q0 9 5 5" stroke="#7a4a12" stroke-width="2" fill="none" stroke-linecap="round"/></g></svg>`;
  }
  setTimeout(meter, 300);
  K.rest = { check() { const s = S(); meter(); if (s && s.restAt && Date.now() - s.restAt < REST_MS && limit()) show(false); }, show, meter };
})();
