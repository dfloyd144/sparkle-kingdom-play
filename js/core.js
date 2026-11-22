/* Sparkle Kingdom — core helpers: DOM, math, animation loop, input, scenes */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const K = (window.K = { scenes: {}, epoch: 0, NS });

  K.el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  K.g = (html, parent, attrs) => {
    const e = K.el('g', attrs, parent);
    if (html) e.innerHTML = html;
    return e;
  };
  K.rand = (a, b) => a + Math.random() * (b - a);
  K.irand = (a, b) => Math.floor(K.rand(a, b + 1));
  K.pick = (a) => a[Math.floor(Math.random() * a.length)];
  K.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  K.lerp = (a, b, t) => a + (b - a) * t;
  K.dist = (a, b, c, d) => Math.hypot(c - a, d - b);
  K.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  K.shade = (hex, amt) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const n = parseInt(c, 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  K.ease = {
    linear: (t) => t,
    inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t * t,
    back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };

  /* ---------- animation loop (scene-scoped) ---------- */
  const updates = new Set();
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(K.dtMax || 0.05, (now - last) / 1000);
    last = now;
    for (const u of Array.from(updates)) {
      if (!u.global && u.epoch !== K.epoch) { updates.delete(u); continue; }
      try { if (u.fn(dt, now) === false) updates.delete(u); }
      catch (e) { console.error(e); updates.delete(u); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  K.every = (fn, global) => { const u = { fn, epoch: K.epoch, global }; updates.add(u); return () => updates.delete(u); };
  K.tween = (dur, step, ease = 'inOut') => new Promise((res) => {
    let t = 0;
    const e = typeof ease === 'function' ? ease : K.ease[ease];
    step(e(0), 0);
    K.every((dt) => {
      t += (dt * 1000) / dur;
      if (t >= 1) { step(e(1), 1); res(); return false; }
      step(e(t), t);
    });
  });
  K.wait = (ms) => new Promise((res) => {
    let t = 0;
    K.every((dt) => { t += dt * 1000; if (t >= ms) { res(); return false; } });
  });
  K.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  K.place = (el, x, y, s = 1, rot = 0) =>
    el.setAttribute('transform', `translate(${(+x).toFixed(1)} ${(+y).toFixed(1)})${rot ? ` rotate(${rot.toFixed(1)})` : ''}${s !== 1 ? ` scale(${(+s).toFixed(3)})` : ''}`);

  /** Replays a one-shot CSS animation class on an element. */
  K.replay = (el, cls, ms = 1000) => {
    el.classList.remove(cls);
    void el.getBoundingClientRect();
    el.classList.add(cls);
    clearTimeout(el['_t_' + cls]);
    el['_t_' + cls] = setTimeout(() => el.classList.remove(cls), ms);
  };

  /* ---------- input ---------- */
  K.pt = (e) => {
    const p = K.stage.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const r = p.matrixTransform(K.stage.getScreenCTM().inverse());
    return { x: r.x, y: r.y };
  };
  /** Screen rect center of an HTML element converted to stage coordinates. */
  K.stagePointOf = (htmlEl) => {
    const b = htmlEl.getBoundingClientRect();
    return K.pt({ clientX: b.left + b.width / 2, clientY: b.top + b.height / 2 });
  };
  K.tap = (el, fn) => {
    el.classList.add('tappable');
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || K.busy) return;
      e.stopPropagation(); e.preventDefault();
      K.audio.unlock();
      if (el.classList.contains('player') && K.onPlayerTap && K.onPlayerTap(el)) return;
      fn(K.pt(e), e);
    });
    return el;
  };
  K.drag = (el, h) => {
    el.classList.add('tappable');
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || K.busy) return;
      e.stopPropagation(); e.preventDefault();
      K.audio.unlock();
      const p0 = K.pt(e);
      let moved = false, lastP = p0;
      const ep = K.epoch;
      if (h.start && h.start(p0, e) === false) return;
      const mv = (ev) => {
        if (K.epoch !== ep) return;
        const p = K.pt(ev);
        if (!moved && K.dist(p.x, p.y, p0.x, p0.y) > 14) moved = true;
        if (h.move) h.move(p, p.x - lastP.x, p.y - lastP.y, moved);
        lastP = p;
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', mv);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        if (K.epoch !== ep) return;
        const p = K.pt(ev);
        if (!moved && h.tap) h.tap(p); else if (h.end) h.end(p, moved);
      };
      window.addEventListener('pointermove', mv);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
    return el;
  };

  /**
   * A round picture button drawn in SVG.
   * opts: r, fill, label (small word under it), sel
   */
  K.button = (parent, x, y, icon, fn, opts = {}) => {
    const r = opts.r || 52;
    const outer = K.el('g', { class: 'btn' + (opts.cls ? ' ' + opts.cls : ''), transform: `translate(${x} ${y})` }, parent);
    const inner = K.el('g', { class: 'inner' }, outer);
    inner.innerHTML = `
      <circle r="${r}" cy="6" fill="${opts.shadow || '#e9a6cf'}" opacity=".7"/>
      <circle class="ring" r="${r}" fill="${opts.fill || 'url(#gBtn)'}" stroke="#fff" stroke-width="5"/>
      <g transform="scale(${(r / 52).toFixed(3)})">${icon}</g>
      ${opts.label ? `<text y="${r + 30}" text-anchor="middle" font-size="24" fill="#6d4a92" stroke="#fff" stroke-width="6" paint-order="stroke">${opts.label}</text>` : ''}`;
    if (fn) K.tap(outer, (p, e) => { K.audio.sfx('tap'); fn(p, e, outer); });
    outer.inner = inner;
    return outer;
  };

  /* ---------- scenes ---------- */
  K.hintText = '';
  K.hint = (text, speakNow) => {
    K.hintText = text;
    if (speakNow) K.voice.say(text);
  };
  const spokenThisSession = new Set();
  /** Speak the scene hint the first time the scene is visited this session. */
  K.hintOnce = (key, text, delay = 700) => {
    K.hint(text);
    if (spokenThisSession.has(key)) return;
    spokenThisSession.add(key);
    K.wait(delay).then(() => K.voice.say(text));
  };

  K.go = async (name, opts = {}) => {
    if (K.busy) return;
    K.busy = true;
    const cur = document.getElementById('curtain');
    cur.classList.add('on');
    K.audio.sfx('whoosh');
    await K.sleep(360);
    try { if (K.cur && K.cur.exit) K.cur.exit(); } catch (e) { console.error(e); }
    K.voice.cancel();
    K.epoch++;
    K.layers.scene.innerHTML = '';
    K.layers.fx.innerHTML = '';
    K.prevName = K.curName;
    K.curName = name;
    K.cur = K.scenes[name];
    document.body.dataset.scene = name;
    K.audio.setTrack(name === 'ball' ? 'ball' : K.audio.song || 'kingdom');
    try { K.cur.enter(K.layers.scene, opts); } catch (e) { console.error(e); }
    await K.sleep(60);
    cur.classList.remove('on');
    K.busy = false;
  };
})();
