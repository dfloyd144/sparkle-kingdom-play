/* Particle effects, word & number popups, star rewards */
(function () {
  const F = (K.fx = {});
  const A = K.art;
  const COLORS = ['#fff6a8', '#ffc2e2', '#c9b6ff', '#a8e6ff', '#ffffff', '#ffd98a'];
  const L = () => K.layers.fx;

  F.sparkle = (x, y, o = {}) => {
    const n = o.n || 12, spread = o.spread || 90, size = o.size || 10, colors = o.colors || COLORS;
    for (let i = 0; i < n; i++) {
      const e = K.el('path', { d: A.star(size * K.rand(0.6, 1.3)), fill: K.pick(colors), stroke: '#fff', 'stroke-width': 1 }, L());
      const a = K.rand(0, Math.PI * 2), sp = K.rand(0.35, 1) * spread;
      const vx = Math.cos(a) * sp, vy = Math.sin(a) * sp - (o.up || 0);
      const life = K.rand(0.6, 1.1), rot0 = K.rand(0, 90);
      let t = 0;
      K.every((dt) => {
        t += dt;
        const k = t / life;
        if (k >= 1) { e.remove(); return false; }
        const ek = K.ease.out(k), s = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
        e.setAttribute('transform', `translate(${(x + vx * ek).toFixed(1)} ${(y + vy * ek + 30 * k * k).toFixed(1)}) rotate(${(rot0 + k * 180).toFixed(0)}) scale(${s.toFixed(3)})`);
      });
    }
  };

  F.hearts = (x, y, n = 5) => {
    for (let i = 0; i < n; i++) {
      const e = K.el('path', { d: A.heart(K.rand(0.8, 1.4)), fill: K.pick(['#ff8fb8', '#ffb3d4', '#ff7fa8', '#d9a6ff']), stroke: '#fff', 'stroke-width': 2 }, L());
      const dx = K.rand(-70, 70), life = K.rand(1, 1.6), ph = K.rand(0, 6), delay = i * 0.08;
      let t = -delay;
      e.setAttribute('opacity', 0);
      K.every((dt) => {
        t += dt;
        if (t < 0) return;
        const k = t / life;
        if (k >= 1) { e.remove(); return false; }
        e.setAttribute('opacity', (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85).toFixed(2));
        e.setAttribute('transform', `translate(${(x + dx * k + Math.sin(ph + k * 8) * 10).toFixed(1)} ${(y - 150 * k).toFixed(1)}) scale(${(0.6 + k * 0.6).toFixed(2)})`);
      });
    }
  };

  F.bubbles = (x, y, n = 6, spread = 50) => {
    for (let i = 0; i < n; i++) {
      const r = K.rand(6, 16);
      const e = K.g(`<circle r="${r}" fill="#e8f7ff" fill-opacity=".55" stroke="#9fd2ff" stroke-width="2"/><circle cx="${-r * 0.35}" cy="${-r * 0.35}" r="${r * 0.25}" fill="#fff"/>`, L());
      const sx = x + K.rand(-spread, spread), sy = y + K.rand(-spread / 2, spread / 2), life = K.rand(0.7, 1.4), dx = K.rand(-30, 30);
      let t = 0;
      K.every((dt) => {
        t += dt;
        const k = t / life;
        if (k >= 1) { e.remove(); return false; }
        K.place(e, sx + dx * k, sy - 70 * k, 0.4 + Math.min(1, k * 4) * 0.6);
      });
    }
  };

  F.drops = (x, y, n = 8, color = '#9fd2ff') => {
    for (let i = 0; i < n; i++) {
      const e = K.el('path', { d: 'M0 -8 Q6 2 0 6 Q-6 2 0 -8Z', fill: color }, L());
      const vx = K.rand(-60, 60), vy = K.rand(-40, 20), life = K.rand(0.5, 0.8);
      let t = 0;
      K.every((dt) => {
        t += dt;
        const k = t / life;
        if (k >= 1) { e.remove(); return false; }
        K.place(e, x + vx * t, y + vy * t + 500 * t * t, 1 - k * 0.5);
      });
    }
  };

  F.poof = (x, y) => {
    for (let i = 0; i < 8; i++) {
      const e = K.el('circle', { r: K.rand(14, 26), fill: '#fff', opacity: 0.9 }, L());
      const a = (i / 8) * Math.PI * 2, life = 0.6;
      let t = 0;
      K.every((dt) => {
        t += dt;
        const k = t / life;
        if (k >= 1) { e.remove(); return false; }
        e.setAttribute('opacity', (0.9 * (1 - k)).toFixed(2));
        K.place(e, x + Math.cos(a) * 50 * K.ease.out(k), y + Math.sin(a) * 30 * K.ease.out(k), 0.6 + k);
      });
    }
    K.audio.sfx('pop');
  };

  F.ripple = (x, y) => {
    for (let i = 0; i < 3; i++) {
      const e = K.el('ellipse', { cx: x, cy: y, rx: 5, ry: 2, fill: 'none', stroke: '#fff', 'stroke-width': 4 }, L());
      let t = -i * 0.2;
      K.every((dt) => {
        t += dt;
        if (t < 0) return;
        const k = t / 1;
        if (k >= 1) { e.remove(); return false; }
        e.setAttribute('rx', 10 + 90 * k); e.setAttribute('ry', 4 + 26 * k);
        e.setAttribute('opacity', (1 - k).toFixed(2));
      });
    }
  };

  F.confetti = (n = 70, x0 = 600, y0 = -40, spread = 700) => {
    for (let i = 0; i < n; i++) {
      const c = K.pick(['#ff9ec7', '#9fd2ff', '#ffd166', '#a6eec0', '#c9a6ff', '#ffb38a']);
      const e = i % 3 ? K.el('rect', { x: -6, y: -9, width: 12, height: 18, rx: 3, fill: c }, L()) : K.el('path', { d: A.star(9), fill: c }, L());
      const x = x0 + K.rand(-spread, spread), sp = K.rand(160, 300), sw = K.rand(20, 60), ph = K.rand(0, 6), rs = K.rand(-300, 300);
      let t = -K.rand(0, 0.8);
      K.every((dt) => {
        t += dt;
        if (t < 0) return;
        const y = y0 + sp * t;
        if (y > 860) { e.remove(); return false; }
        e.setAttribute('transform', `translate(${(x + Math.sin(ph + t * 3) * sw).toFixed(1)} ${y.toFixed(1)}) rotate(${(rs * t).toFixed(0)}) scale(${Math.cos(t * 5 + ph).toFixed(2)} 1)`);
      });
    }
  };

  F.firework = (x, y, color) => {
    const c = color || K.pick(['#ff9ec7', '#9fd2ff', '#ffd166', '#a6eec0', '#c9a6ff']);
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      const e = K.el('circle', { r: 5, fill: i % 2 ? c : '#fff' }, L());
      let t = 0;
      K.every((dt) => {
        t += dt;
        const k = t / 1.2;
        if (k >= 1) { e.remove(); return false; }
        const d = 130 * K.ease.out(k);
        e.setAttribute('opacity', (1 - k).toFixed(2));
        K.place(e, x + Math.cos(a) * d, y + Math.sin(a) * d + 40 * k * k, 1 - k * 0.5);
      });
    }
  };

  /* ---------- word popup: letters pop in, first letter highlighted, then spoken ---------- */
  let wordEl = null;
  F.word = (word, x, y, o = {}) => {
    if (wordEl) wordEl.remove();
    const size = o.size || 62;
    const g = K.el('g', { 'pointer-events': 'none' }, L());
    wordEl = g;
    const bg = K.el('rect', { rx: size * 0.55, fill: '#fff', stroke: o.color || '#ffc2e2', 'stroke-width': 5, opacity: 0.96 }, g);
    const letters = [];
    let cx = 0;
    const chars = word.split('');
    chars.forEach((ch, i) => {
      const t = K.el('text', { 'font-size': size, fill: i === 0 ? (o.first || '#ff5fa2') : (o.color && o.colorText ? o.color : '#6d4a92'), class: 'wletter', style: `animation-delay:${i * 0.08}s` }, g);
      t.textContent = ch === ' ' ? ' ' : ch;
      letters.push(t);
    });
    // measure & lay out
    letters.forEach((t) => {
      t.setAttribute('x', cx);
      const w = t.getComputedTextLength ? t.getComputedTextLength() : size * 0.6;
      cx += w + size * 0.04;
    });
    const total = cx;
    letters.forEach((t) => t.setAttribute('x', +t.getAttribute('x') - total / 2));
    const padX = size * 0.45;
    bg.setAttribute('x', -total / 2 - padX); bg.setAttribute('y', -size * 0.95);
    bg.setAttribute('width', total + padX * 2); bg.setAttribute('height', size * 1.35);
    if (o.picture) {
      const pic = K.g(o.picture, g);
      K.place(pic, -total / 2 - padX - 50, -size * 0.3, 0.6);
    }
    const half = total / 2 + padX + (o.picture ? 90 : 0);
    const px = K.clamp(x, 20 + half, 1180 - half), py = K.clamp(y, 80, 760);
    K.place(g, px, py, 1);
    if (o.say !== false) K.voice.say(o.sayText || word);
    let t = 0;
    const hold = o.hold || 1.9;
    K.every((dt) => {
      t += dt;
      if (!g.isConnected) return false;
      if (t > hold) {
        const k = (t - hold) / 0.5;
        if (k >= 1) { g.remove(); if (wordEl === g) wordEl = null; return false; }
        g.setAttribute('opacity', (1 - k).toFixed(2));
        K.place(g, px, py - 30 * k, 1);
      }
    });
    return g;
  };

  /* ---------- number popup with counting dots ---------- */
  F.number = (n, x, y, o = {}) => {
    const g = K.el('g', { 'pointer-events': 'none' }, L());
    const dots = Math.min(n, 10);
    let dotsSvg = '';
    for (let i = 0; i < dots; i++) {
      const row = i < 5 ? 0 : 1, col = i % 5;
      const rowCount = row === 0 ? Math.min(dots, 5) : dots - 5;
      dotsSvg += `<circle cx="${(col - (rowCount - 1) / 2) * 18}" cy="${52 + row * 18}" r="7" fill="${o.dot || '#ff8fb8'}" stroke="#fff" stroke-width="2"/>`;
    }
    g.innerHTML = `<g class="pop-in"><circle r="46" fill="url(#gBtnGold)" stroke="#fff" stroke-width="6"/>
      <text y="22" text-anchor="middle" font-size="64" fill="#6d4a92">${n}</text>${dotsSvg}</g>`;
    K.place(g, K.clamp(x, 60, 1140), K.clamp(y, 70, 720));
    K.audio.sfx('count', n);
    if (o.say !== false) K.voice.say(o.sayText || String(n));
    let t = 0;
    K.every((dt) => {
      t += dt;
      if (!g.isConnected) return false;
      if (t > 1.1) {
        const k = (t - 1.1) / 0.5;
        if (k >= 1) { g.remove(); return false; }
        g.setAttribute('opacity', (1 - k).toFixed(2));
      }
    });
    return g;
  };

  /** Speech bubble for a character */
  F.speech = (text, x, y, o = {}) => {
    const size = 30;
    const w = Math.max(80, text.length * size * 0.56 + 36);
    const g = K.el('g', { 'pointer-events': 'none' }, L());
    g.innerHTML = `<g class="pop-in"><path d="M${-w / 2} -60 h${w} a20 20 0 0 1 20 20 v20 a20 20 0 0 1 -20 20 h${-w / 2 + 24} l-18 18 l-2 -18 h${-w / 2 + 2 - 24} a20 20 0 0 1 -20 -20 v-20 a20 20 0 0 1 20 -20Z" fill="#fff" stroke="#e5c7dc" stroke-width="3" transform="translate(-10 0)"/>
      <text y="-28" text-anchor="middle" font-size="${size}" fill="#6d4a92">${text}</text></g>`;
    K.place(g, K.clamp(x, w / 2 + 20, 1180 - w / 2), K.clamp(y, 80, 760));
    if (o.say !== false) K.voice.say(o.sayText || text, { pitch: o.pitch });
    let t = 0;
    const hold = o.hold || 1.8;
    K.every((dt) => {
      t += dt;
      if (!g.isConnected) return false;
      if (t > hold) { g.remove(); return false; }
    });
    return g;
  };

  /* ---------- star reward flies to the star jar ---------- */
  F.star = async (x, y) => {
    const jar = document.getElementById('starJar');
    const target = K.stagePointOf(jar.querySelector('.jar-icon'));
    const e = K.g(`<circle r="40" fill="url(#gGlow)"/><path d="${A.star(30)}" fill="url(#gGold)" stroke="#f0a930" stroke-width="3"/>`, L());
    K.save.data.stars++;
    K.save.write();
    K.audio.sfx('sparkle');
    await K.tween(350, (t) => K.place(e, x, y - 40 * t, 0.3 + 1.2 * t), 'back');
    await K.wait(250);
    const sx = x, sy = y - 40;
    await K.tween(700, (t) => {
      K.place(e, K.lerp(sx, target.x, t), K.lerp(sy, target.y, t) - Math.sin(t * Math.PI) * 120, 1.5 - t * 0.9);
    }, 'inOut');
    e.remove();
    K.updateStars(true);
    K.audio.sfx('chime');
  };
})();
