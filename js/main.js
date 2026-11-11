/* Boot: layers, HUD, start screen, grown-up corner */
(function () {
  const A = K.art, S = K.save;
  K.stage = document.getElementById('stage');
  document.getElementById('defs').innerHTML = A.defs;
  K.layers = { scene: document.getElementById('scene'), fx: document.getElementById('fx') };

  /* On wide screens (phones held sideways) trim the empty sky band at the top so
     everything draws bigger; the top buttons move into the side margins (see CSS). */
  function fitStage() {
    const wide = innerWidth / innerHeight > 1.62;
    K.stage.setAttribute('viewBox', wide ? '0 64 1200 736' : '0 0 1200 800');
    document.body.classList.toggle('wide', wide);
    document.body.classList.toggle('tall', innerHeight > innerWidth * 1.05);
  }
  fitStage();
  addEventListener('resize', fitStage);
  addEventListener('orientationchange', () => setTimeout(fitStage, 250));

  const iconSvg = (icon, vb = '-44 -44 88 88') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${icon}</svg>`;
  const $ = (id) => document.getElementById(id);
  $('homeBtn').innerHTML = iconSvg(A.icons.castle);
  $('helpBtn').innerHTML = iconSvg(A.icons.speaker);
  $('musicBtn').innerHTML = iconSvg(A.icons.music);
  document.querySelector('#starJar .jar-icon').innerHTML = iconSvg(A.icons.star, '-36 -36 72 72');
  $('starJar').insertAdjacentHTML('beforeend', `<span class="jar-shop">${iconSvg('<path d="M-22 -8 H22 L18 28 H-18Z" fill="#ff7fb2" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M-11 -8 V-16 A11 11 0 0 1 11 -16 V-8" fill="none" stroke="#ff7fb2" stroke-width="5"/><path d="' + A.star(9) + '" transform="translate(0 10)" fill="#fff"/>', '-30 -30 60 64')}</span>`);

  K.updateStars = (bump) => {
    $('starCount').textContent = S.data.stars;
    if (bump) { const j = $('starJar'); j.classList.remove('bump'); void j.offsetWidth; j.classList.add('bump'); }
  };
  K.updateStars();

  const applySettings = () => {
    const st = S.data.settings;
    K.voice.on = !!st.voice;
    K.voice.name = st.voiceName || '';
    K.voice.pitch = st.voicePitch || 1.2;
    K.voice.rate = st.voiceRate || 1;
    K.voice.refresh && K.voice.refresh();
    const songs = K.audio.SONGS;
    K.audio.song = songs.some((x) => x.id === st.song) ? st.song : songs[0].id;
    if (K.curName && K.curName !== 'ball' && K.curName !== 'bedtime') K.audio.setTrack(K.audio.song);
    K.audio.setMusic(!!st.music);
    $('musicBtn').classList.toggle('off', !st.music);
  };
  applySettings();

  const hudPress = (el, fn) => el.addEventListener('pointerdown', (e) => { e.preventDefault(); K.audio.unlock(); fn(); });
  hudPress($('homeBtn'), () => { K.audio.sfx('tap'); K.go('kingdom', { from: K.curName }); });
  hudPress($('helpBtn'), () => { K.audio.sfx('tap'); K.voice.say(K.hintText || 'Tap anything!', { force: true }); });
  // music button: each tap plays the next song; after the last song the music turns off
  hudPress($('musicBtn'), () => {
    const st = S.data.settings, songs = K.audio.SONGS;
    K.audio.sfx('tap');
    if (!st.music) { st.music = true; st.song = songs[0].id; }
    else {
      const i = songs.findIndex((x) => x.id === st.song);
      if (i >= songs.length - 1) st.music = false; else st.song = songs[i + 1].id;
    }
    S.write(); applySettings();
    K.voice.say(st.music ? songs.find((x) => x.id === st.song).name : 'music off', { force: true });
  });
  $('starJar').addEventListener('pointerdown', (e) => {
    e.preventDefault(); K.audio.unlock();
    K.audio.sfx('pop');
    K.shop.open();
  });

  /* ---------- grown-up corner: press and hold 2 seconds ---------- */
  const gb = $('grownBtn');
  let holdT = null;
  const endHold = () => { clearTimeout(holdT); gb.classList.remove('holding'); };
  gb.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    gb.classList.add('holding');
    holdT = setTimeout(() => { endHold(); openParent(); }, 2000);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => gb.addEventListener(ev, endHold));
  function openParent() {
    $('pNames').innerHTML = S.data.looks.map((l, i) => `<label class="pn"><svg viewBox="-60 -70 120 130" aria-hidden="true"><g transform="translate(0 6) scale(.5)">${A.princessHead(l)}</g></svg><input data-i="${i}" maxlength="14" autocomplete="off" aria-label="Princess ${i + 1} name" value="${(S.data.names[i] || '').replace(/"/g, '&quot;')}"></label>`).join('');
    const st = S.data.settings;
    const vs = K.voice.list ? K.voice.list() : [];
    $('voicePick').innerHTML = '<option value="">Best available</option>' + vs.map((v) => `<option value="${v.name.replace(/"/g, '&quot;')}">${v.name} (${v.lang})</option>`).join('');
    $('voicePick').value = st.voiceName || '';
    $('voicePitch').value = st.voicePitch || 1.2;
    $('voiceRate').value = st.voiceRate || 1;
    $('gName').value = S.data.settings.goodnight || 'Mommy and Daddy';
    $('uName').value = S.data.unicorn.name;
    $('voiceToggle').checked = !!S.data.settings.voice;
    $('needsToggle').checked = S.data.settings.needs !== false;
    $('restOn').checked = !S.data.settings.restOff;
    $('playMins').value = String(Math.min(30, Math.max(1, S.data.settings.playMins || 20)));
    $('playMinsLbl').textContent = $('playMins').value;
    $('playMinsRow').style.opacity = $('restOn').checked ? 1 : 0.4;
    $('musicToggle').checked = !!S.data.settings.music;
    $('parent').classList.remove('hidden');
  }
  $('closeParent').addEventListener('click', () => {
    const un = $('uName').value.trim(), gn = $('gName').value.trim();
    document.querySelectorAll('#pNames input').forEach((inp) => { const v = inp.value.trim(); if (v) S.data.names[+inp.dataset.i] = v.slice(0, 14); });
    drawPicker();
    if (gn) S.data.settings.goodnight = gn.slice(0, 30);
    readVoiceFields();
    if (un) S.data.unicorn.name = un.slice(0, 14);
    S.data.settings.voice = $('voiceToggle').checked;
    S.data.settings.needs = $('needsToggle').checked;
    const restOff = !$('restOn').checked, pm = +$('playMins').value;
    if (pm !== +(S.data.settings.playMins || 0) || restOff !== !!S.data.settings.restOff) { S.data.settings.playMins = pm; S.data.settings.restOff = restOff; S.data.playSec = 0; }
    if (K.rest) K.rest.meter();
    K.needs && K.needs.refresh();
    S.data.settings.music = $('musicToggle').checked;
    S.write(); applySettings();
    $('parent').classList.add('hidden');
    K.go(K.curName || 'kingdom');
  });
  $('playMins').addEventListener('input', () => { $('playMinsLbl').textContent = $('playMins').value; });
  $('restOn').addEventListener('change', () => { $('playMinsRow').style.opacity = $('restOn').checked ? 1 : 0.4; });
  $('progressBtn').addEventListener('click', () => K.learn.openProgress());
  function readVoiceFields() {
    const st = S.data.settings;
    st.voiceName = $('voicePick').value;
    st.voicePitch = +$('voicePitch').value;
    st.voiceRate = +$('voiceRate').value;
  }
  $('voiceTest').addEventListener('click', () => {
    readVoiceFields(); applySettings();
    K.voice.say(`Hello! I'm Princess ${S.data.names[S.data.cur]}. Let's play in the Sparkle Kingdom!`, { force: true });
  });
  // two-tap confirmation (pop-up confirm dialogs are blocked in some app views)
  let resetArmed = 0;
  $('resetBtn').addEventListener('click', () => {
    const btn = $('resetBtn');
    if (Date.now() - resetArmed > 5000) {
      resetArmed = Date.now();
      btn.textContent = 'Tap again to erase everything';
      setTimeout(() => { if (Date.now() - resetArmed >= 5000) btn.textContent = 'Start over…'; }, 5100);
      return;
    }
    resetArmed = 0; btn.textContent = 'Start over…';
    S.reset(); S.write(); applySettings(); K.updateStars();
    $('parent').classList.add('hidden');
    K.go('kingdom');
  });
  // let inputs in the parent panel scroll/select normally
  $('parent').addEventListener('pointerdown', (e) => e.stopPropagation());

  // iOS: block pinch zoom & double-tap zoom in the play area
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  /* ---------- start screen ---------- */
  const art = $('startArt');
  art.innerHTML = `${A.skyRect()}<g transform="translate(980 120)">${A.sun()}</g>
    <g class="drift" style="animation-duration:80s"><g transform="translate(200 140)">${A.cloud(0.9)}</g></g>
    <g transform="translate(600 470)">${A.rainbow(420, 22, 0.55)}</g>
    ${A.hills(470)}${A.groundRect(520)}
    <g transform="translate(0 40)">${A.castle()}</g>
    <g id="startPrincess" transform="translate(330 640) scale(1.1)"><g class="anim">${A.princess(K.me())}</g></g>
    <g transform="translate(880 650) scale(.85) scale(-1 1)">${A.unicorn(S.data.unicorn)}</g>
    <g transform="translate(600 120)"><text text-anchor="middle" font-size="84" fill="#fff" stroke="#e86fa6" stroke-width="14" paint-order="stroke" stroke-linejoin="round">Sparkle Kingdom</text></g>
    ${A.sparkle4(200, 260, 14)}${A.sparkle4(1000, 300, 12)}${A.sparkle4(760, 80, 10, '#fff08a')}`;
  $('playBtn').innerHTML = `<svg viewBox="-60 -60 120 120"><path d="M-14 -26 L30 0 L-14 26Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/></svg>`;
  /* "Who are you?" — pick your princess right on the start screen */
  function drawPicker() {
    const row = $('pickRow');
    row.innerHTML = S.data.looks.map((l, i) => `<button class="pk${i === S.data.cur ? ' on' : ''}" data-i="${i}" aria-label="${S.data.names[i]}">
      <svg viewBox="-60 -70 120 130"><g transform="translate(0 6) scale(.5)">${A.princessHead(l)}</g></svg><span>${S.data.names[i]}</span></button>`).join('');
    row.querySelectorAll('.pk').forEach((b) => b.addEventListener('pointerdown', (e) => {
      e.preventDefault(); K.audio.unlock(); K.audio.sfx('pop');
      S.data.cur = +b.dataset.i; S.write();
      document.querySelector('#startPrincess .anim').innerHTML = A.princess(K.me());
      K.voice.say(`Princess ${K.myName()}!`, { force: true });
      drawPicker();
    }));
  }
  drawPicker();
  K.drawPicker = drawPicker;

  function startGame() {
    K.audio.sfx('fanfare');
    K.voice.say(`Welcome to the Sparkle Kingdom, Princess ${S.data.names[S.data.cur]}!`);
    $('start').classList.add('gone');
    K.go('kingdom', { intro: true });
    if (K.rest) K.rest.check();
  }
  // the very first time on a device, ask the princess's name (a grown-up can type it)
  function askName(done) {
    const c = $('nameCard');
    c.innerHTML = `<div class="nm-panel"><svg viewBox="-60 -70 120 130"><g transform="translate(0 6) scale(.5)">${A.princessHead(K.me())}</g></svg>
      <label for="nmInput">What's your princess name?</label><input id="nmInput" maxlength="14" autocomplete="off" value="${K.myName()}">
      <button id="nmOk" aria-label="OK"><svg viewBox="-36 -36 72 72">${A.icons.check}</svg></button></div>`;
    c.classList.remove('hidden');
    K.voice.say("What's your princess name? A grown-up can help type it.", { force: true });
    const ok = (e) => {
      if (e) e.preventDefault();
      const v = $('nmInput').value.trim();
      if (v) S.data.names[S.data.cur] = v.slice(0, 14);
      S.data.namedOnce = true; S.write();
      c.classList.add('hidden'); c.innerHTML = '';
      drawPicker();
      done();
    };
    $('nmOk').addEventListener('pointerdown', ok);
    $('nmInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') ok(e); });
    c.addEventListener('pointerdown', (e) => e.stopPropagation());
  }
  $('playBtn').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    K.audio.unlock();
    if (!S.data.namedOnce) return askName(startGame);
    startGame();
  });
})();

/* Offline play: on the real website (https) a service worker keeps a copy of the game on the device. */
(function () {
  try {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
        // look for a newer version whenever the game is opened again
        document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      }).catch(() => {});
    }
  } catch (e) { /* not available here */ }
})();
