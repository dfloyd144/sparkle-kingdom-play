/* Sound effects + music box (Web Audio, no files) and spoken words (speechSynthesis) */
(function () {
  let ctx = null, master = null, musicGain = null;
  const A = (K.audio = { musicOn: true, track: 'kingdom' });
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  A.unlock = () => {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
        musicGain = ctx.createGain(); musicGain.gain.value = A.musicOn ? 0.5 : 0; musicGain.connect(master);
        startMusic();
      } catch (e) { return; }
    }
    if (ctx.state === 'suspended') ctx.resume();
  };

  function tone(f, dur, o = {}) {
    if (!ctx) return;
    const t = ctx.currentTime + (o.when || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + dur);
    const v = o.vol || 0.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.dest || master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  let noiseBuf;
  function noise(dur, o = {}) {
    if (!ctx) return;
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = ctx.currentTime + (o.when || 0);
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.freq || 1000, t);
    if (o.sweep) f.frequency.exponentialRampToValueAtTime(o.sweep, t + dur);
    f.Q.value = o.q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(o.vol || 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + dur + 0.02);
  }
  const PENTA = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98, 100].map(mtof);

  const S = {
    tap: () => tone(640, 0.12, { type: 'triangle', vol: 0.16, slide: 980 }),
    pop: () => tone(320, 0.16, { vol: 0.28, slide: 1300 }),
    sparkle: () => { for (let i = 0; i < 5; i++) tone(K.pick(PENTA.slice(5)), 0.4, { vol: 0.07, when: i * 0.055 }); },
    chime: () => [0, 2, 4].forEach((n, i) => tone(PENTA[n + 3], 0.7, { vol: 0.13, when: i * 0.09 })),
    fanfare: () => [72, 76, 79, 84].forEach((m, i) => { tone(mtof(m), i === 3 ? 1 : 0.3, { type: 'triangle', vol: 0.15, when: i * 0.13 }); tone(mtof(m + 12), i === 3 ? 1 : 0.3, { vol: 0.05, when: i * 0.13 }); }),
    munch: () => { noise(0.07, { freq: 900, q: 0.8, vol: 0.35 }); noise(0.07, { freq: 650, q: 0.8, vol: 0.35, when: 0.15 }); noise(0.07, { freq: 800, q: 0.8, vol: 0.3, when: 0.3 }); },
    splash: () => { noise(0.6, { freq: 3500, sweep: 300, vol: 0.25, type: 'lowpass' }); },
    whoosh: () => noise(0.4, { freq: 300, sweep: 2600, q: 2, vol: 0.1 }),
    neigh: () => { for (let i = 0; i < 7; i++) tone(1250 - i * 55 + (i % 2 ? 110 : 0), 0.1, { type: 'triangle', vol: 0.11, when: i * 0.065 }); },
    boing: () => tone(220, 0.38, { vol: 0.25, slide: 700 }),
    ding: () => { tone(1568, 1.4, { vol: 0.2 }); tone(2093, 1.1, { vol: 0.07, when: 0.02 }); },
    pour: () => { for (let i = 0; i < 9; i++) tone(K.rand(320, 620), 0.07, { vol: 0.07, when: i * 0.07, slide: K.rand(700, 1000) }); },
    brush: () => noise(0.14, { freq: 5200, q: 0.7, vol: 0.07 }),
    bubble: () => tone(K.rand(500, 900), 0.1, { vol: 0.12, slide: K.rand(1300, 1900) }),
    giggle: () => { for (let i = 0; i < 4; i++) tone(880 + i * 70, 0.08, { type: 'triangle', vol: 0.09, when: i * 0.09, slide: 1200 + i * 70 }); },
    count: (n) => { const f = PENTA[K.clamp((n || 1) - 1, 0, PENTA.length - 1)]; tone(f, 0.55, { type: 'triangle', vol: 0.15 }); tone(f * 2, 0.4, { vol: 0.04 }); },
    firework: () => { noise(1.1, { freq: 2200, sweep: 180, type: 'lowpass', vol: 0.28 }); for (let i = 0; i < 6; i++) tone(K.pick(PENTA.slice(6)), 0.3, { vol: 0.05, when: 0.2 + i * 0.07 }); },
    clink: () => { tone(2500, 0.35, { vol: 0.09 }); tone(3150, 0.28, { vol: 0.06, when: 0.01 }); },
    plant: () => { tone(300, 0.12, { vol: 0.2, slide: 180 }); noise(0.1, { freq: 400, vol: 0.15 }); },
    grow: () => { for (let i = 0; i < 5; i++) tone(mtof(67 + i * 3), 0.2, { type: 'triangle', vol: 0.09, when: i * 0.06 }); },
    flutter: () => { for (let i = 0; i < 6; i++) noise(0.04, { freq: 1500, q: 2, vol: 0.06, when: i * 0.05 }); },
    swoosh: () => noise(0.7, { freq: 500, sweep: 3000, q: 1.5, vol: 0.12 }),
    flush: () => {
      noise(1.6, { freq: 2600, sweep: 160, type: 'lowpass', vol: 0.32 });
      noise(1.2, { freq: 900, sweep: 200, q: 3, vol: 0.12, when: 0.2 });
      for (let i = 0; i < 8; i++) tone(K.rand(260, 520), 0.12, { vol: 0.08, when: 0.5 + i * 0.11, slide: K.rand(700, 1100) });
    },
    jingle: () => { for (let i = 0; i < 10; i++) { const f = K.pick([2093, 2349, 2637, 3136]); tone(f, 0.25, { type: 'triangle', vol: 0.05, when: i * 0.045 }); tone(f * 1.5, 0.15, { vol: 0.02, when: i * 0.045 }); } },
    quack: () => { tone(620, 0.16, { type: 'sawtooth', vol: 0.07, slide: 420 }); tone(600, 0.16, { type: 'sawtooth', vol: 0.06, slide: 400, when: 0.2 }); },
    honk: () => { tone(415, 0.16, { type: 'square', vol: 0.07 }); tone(523, 0.16, { type: 'square', vol: 0.05 }); tone(415, 0.22, { type: 'square', vol: 0.07, when: 0.22 }); tone(523, 0.22, { type: 'square', vol: 0.05, when: 0.22 }); },
    tinkle: () => { for (let i = 0; i < 8; i++) tone(mtof(88 + (i % 4) * 2), 0.18, { vol: 0.05, when: i * 0.09 }); },
  };
  A.sfx = (n, arg) => { if (!ctx) return; try { S[n] && S[n](arg); } catch (e) { /* ignore */ } };

  /* ---------- music box ---------- */
  // Original tunes. Each step: [melody midi or 0, bass midi or 0], one beat each.
  const TRACKS = {
    garden: { bpm: 118, inst: 'harp', notes: [
      [72, 48], [76, 0], [79, 55], [76, 0], [77, 53], [81, 0], [79, 48], [0, 0], [76, 48], [74, 0], [72, 55], [74, 0], [76, 52], [72, 0], [74, 55], [0, 0],
      [72, 48], [76, 0], [79, 55], [84, 0], [83, 53], [79, 0], [81, 57], [0, 0], [79, 55], [77, 0], [76, 53], [74, 0], [72, 48], [0, 55], [72, 48], [0, 0],
    ] },
    sparkle: { bpm: 96, inst: 'bell', notes: [
      [84, 60], [88, 0], [91, 0], [88, 0], [86, 55], [89, 0], [93, 0], [89, 0], [84, 57], [88, 0], [91, 0], [96, 0], [95, 55], [91, 0], [86, 0], [0, 0],
      [88, 53], [86, 0], [84, 0], [86, 0], [88, 55], [91, 0], [89, 0], [88, 0], [86, 53], [84, 0], [83, 55], [86, 0], [84, 60], [0, 0], [0, 0], [0, 0],
    ] },
    royal: { bpm: 108, inst: 'brass', notes: [
      [72, 48], [76, 0], [79, 0], [84, 55], [0, 0], [83, 0], [81, 53], [79, 0], [77, 53], [79, 0], [81, 0], [77, 53], [76, 48], [0, 0], [79, 55], [0, 0],
      [72, 48], [76, 0], [79, 0], [84, 55], [86, 0], [88, 0], [86, 53], [84, 0], [83, 55], [81, 0], [83, 0], [86, 55], [84, 48], [0, 0], [0, 0], [0, 0],
    ] },
    lullaby: { bpm: 60, notes: [
      [79, 48], [76, 0], [72, 0], [74, 43], [76, 0], [77, 0], [76, 45], [72, 0], [0, 0], [74, 41], [72, 0], [69, 0],
      [71, 43], [72, 0], [74, 0], [72, 48], [0, 0], [0, 0], [76, 45], [74, 0], [72, 0], [71, 43], [69, 0], [67, 0],
      [69, 41], [71, 0], [72, 0], [72, 48], [0, 0], [0, 0], [0, 43], [0, 0], [0, 0], [0, 48], [0, 0], [0, 0],
    ] },
    kingdom: { bpm: 92, notes: [
      [76, 48], [79, 0], [84, 0], [83, 43], [79, 0], [76, 0], [77, 41], [81, 0], [86, 0], [84, 45], [81, 0], [77, 0],
      [76, 48], [79, 0], [84, 0], [86, 43], [84, 0], [83, 0], [84, 48], [0, 0], [79, 52], [0, 0], [0, 55], [0, 0],
      [74, 41], [77, 0], [81, 0], [79, 43], [76, 0], [72, 0], [74, 45], [76, 0], [79, 0], [81, 41], [79, 0], [77, 0],
      [76, 48], [74, 0], [72, 0], [74, 43], [79, 0], [83, 0], [84, 48], [0, 0], [0, 55], [0, 52], [0, 0], [0, 0],
    ] },
    ball: { bpm: 138, waltz: true, notes: [
      [79, 48], [84, 0], [86, 0], [88, 43], [86, 0], [84, 0], [86, 41], [81, 0], [77, 0], [81, 43], [79, 0], [0, 0],
      [79, 48], [84, 0], [86, 0], [88, 45], [91, 0], [88, 0], [86, 41], [84, 0], [83, 43], [84, 48], [0, 0], [0, 0],
      [88, 45], [86, 0], [84, 0], [86, 41], [84, 0], [81, 0], [83, 43], [84, 0], [86, 0], [79, 48], [0, 0], [0, 0],
      [76, 41], [77, 0], [81, 0], [79, 43], [83, 0], [86, 0], [84, 48], [83, 0], [84, 0], [0, 48], [0, 0], [0, 0],
    ] },
  };
  let step = 0, nextTime = 0, timer = null;
  function musicNote(m, when, vol, dur, inst) {
    const f = mtof(m);
    if (inst === 'harp') { tone(f, dur * 0.7, { vol, when, dest: musicGain, type: 'triangle', attack: 0.004 }); tone(f * 2, dur * 0.3, { vol: vol * 0.2, when, dest: musicGain }); return; }
    if (inst === 'bell') { tone(f, dur * 1.2, { vol: vol * 0.9, when, dest: musicGain, attack: 0.002 }); tone(f * 2.76, dur * 0.4, { vol: vol * 0.18, when, dest: musicGain }); return; }
    if (inst === 'brass') { tone(f, dur * 0.6, { vol: vol * 0.55, when, dest: musicGain, type: 'sawtooth', attack: 0.03 }); tone(f, dur * 0.7, { vol: vol * 0.6, when, dest: musicGain, type: 'triangle', attack: 0.02 }); return; }
    tone(f, dur, { vol, when, dest: musicGain, attack: 0.01 });
    tone(f * 2, dur * 0.6, { vol: vol * 0.25, when, dest: musicGain, type: 'triangle' });
  }
  function startMusic() {
    nextTime = ctx.currentTime + 0.2;
    timer = setInterval(() => {
      if (!ctx || ctx.state !== 'running') return;
      const tr = TRACKS[A.track];
      const beat = 60 / tr.bpm;
      while (nextTime < ctx.currentTime + 0.3) {
        const [mel, bass] = tr.notes[step % tr.notes.length];
        const when = nextTime - ctx.currentTime;
        if (mel) musicNote(mel, when, 0.09, 1.3, tr.inst);
        if (bass) musicNote(bass, when, 0.07, 1.8, tr.inst === 'brass' ? 'harp' : tr.inst);
        if (tr.waltz && !bass && step % 3) { // "pah pah"
          const chordRoot = tr.notes[step - (step % 3)][1] || 48;
          musicNote(chordRoot + 16, when, 0.025, 0.4);
          musicNote(chordRoot + 19, when, 0.025, 0.4);
        }
        nextTime += beat;
        step++;
      }
    }, 90);
  }
  A.SONGS = [{ id: 'kingdom', name: 'castle song' }, { id: 'garden', name: 'garden song' }, { id: 'sparkle', name: 'sparkle song' }, { id: 'royal', name: 'royal march' }];
  A.song = 'kingdom';
  A.setTrack = (name) => {
    if (A.track === name) return;
    A.track = name; step = 0;
  };
  A.setMusic = (on) => {
    A.musicOn = on;
    if (musicGain && ctx) musicGain.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.2);
  };
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  /* ---------- voice ---------- */
  // One voice at a time. Starting a new phrase stops the old one and waits a moment before
  // speaking (iPhone garbles or drops speech when cancel+speak happen back to back), and a
  // burst of calls collapses into the last one so the voice never stutters.
  const V = (K.voice = { on: true, rate: 1, pitch: 1.2, name: '' });
  let voice = null, sayTimer = null, gen = 0;
  const hasTTS = 'speechSynthesis' in window;
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Good News|Hysterical|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Junior|Ralph|Kathy|Fred|Grandma|Grandpa|Rocko|Shelley|Flo|Eddy|Reed|Sandy|Princess|Pipe/i;
  const score = (v) => {
    let s = 0;
    const n = v.name;
    if (/premium/i.test(n)) s += 60;
    if (/enhanced/i.test(n)) s += 45;
    if (/neural|natural|online/i.test(n)) s += 40;
    if (/\b(Ava|Zoe|Samantha|Allison|Susan|Nicky|Karen|Moira|Tessa|Serena|Kate|Aria|Jenny|Michelle|Libby|Sonia|Emma|Joanna|Salli|Google US English|Google UK English Female)\b/i.test(n)) s += 25;
    if (/en[-_]US/i.test(v.lang)) s += 6; else if (/en[-_](GB|AU|IE)/i.test(v.lang)) s += 3;
    if (/\b(Daniel|Alex|Tom|Aaron|Arthur|Gordon|Rishi|Male|David|Mark|Guy|George|Ryan)\b/i.test(n)) s -= 15;
    if (NOVELTY.test(n)) s -= 100;
    return s;
  };
  V.list = () => (hasTTS ? speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang) && !NOVELTY.test(v.name)).sort((a, b) => score(b) - score(a)) : []);
  function pickVoice() {
    const vs = V.list();
    if (!vs.length) return null;
    if (V.name) { const chosen = vs.find((v) => v.name === V.name); if (chosen) return chosen; }
    return vs[0];
  }
  V.refresh = () => { if (hasTTS) voice = pickVoice(); };
  V.current = () => (voice ? voice.name : '');
  if (hasTTS) {
    V.refresh();
    speechSynthesis.onvoiceschanged = V.refresh;
  }
  // iPhone only lets a page talk after speech has been started from a real tap (touchend/click,
  // not touchstart). Say a silent word on the first few taps so later speech is allowed.
  if (hasTTS) {
    let primed = 0;
    const prime = () => {
      if (primed++ > 2) { ['touchend', 'click', 'keydown'].forEach((ev) => removeEventListener(ev, prime, true)); return; }
      try { if (!speechSynthesis.speaking) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } speechSynthesis.resume(); } catch (e) { /* ignore */ }
    };
    ['touchend', 'click', 'keydown'].forEach((ev) => addEventListener(ev, prime, true));
    // coming back to the game: unstick speech that the phone paused in the background
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch (e) { /* ignore */ } } });
  }
  let current = null; // keep the utterance alive (iPhone drops speech whose object gets garbage-collected)
  V.say = (text, o = {}) => {
    if (!hasTTS || !text || (!V.on && !o.force)) return;
    const my = ++gen;
    clearTimeout(sayTimer);
    let busy = false;
    try { busy = speechSynthesis.speaking || speechSynthesis.pending; if (busy) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    const go = (retry) => {
      if (my !== gen) return;
      try {
        if (!voice) V.refresh();
        const u = new SpeechSynthesisUtterance(String(text));
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
        // characters pass their own pitch (1.15 = normal); keep their difference relative to the chosen pitch
        u.pitch = K.clamp((o.pitch ? o.pitch / 1.15 : 1) * V.pitch, 0.5, 2);
        u.rate = K.clamp((o.rate ? o.rate / 0.9 : 1) * 0.9 * V.rate, 0.5, 1.4);
        let started = false;
        u.onstart = () => { started = true; };
        u.onend = u.onerror = () => { if (current === u) current = null; };
        current = u;
        speechSynthesis.resume(); // a paused speech engine (after the phone slept) silently ignores speak()
        speechSynthesis.speak(u);
        // watchdog: if the phone swallowed it, reset the speech engine and try once more
        if (!retry) setTimeout(() => { if (my === gen && !started && current === u) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } setTimeout(() => go(true), 120); } }, 1500);
      } catch (e) { /* ignore */ }
    };
    // nothing playing: speak right away (still inside the tap, which iPhone needs).
    // Something playing: a short pause after stopping it avoids the iPhone "garbled then cut off" bug.
    if (busy) sayTimer = setTimeout(go, 160); else go();
  };
  V.cancel = () => { gen++; clearTimeout(sayTimer); try { hasTTS && speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
})();
