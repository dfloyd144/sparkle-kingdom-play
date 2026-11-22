/* Christmas castle: tap the big box, a surprise decoration pops out, drag it anywhere on the castle */
(function () {
  const A = K.art;
  // castle art coordinates -> stage: x*S + TX, y*S + TY  (decorations are saved in castle coordinates,
  // so the same decorations also show on the castle in the kingdom)
  const S_ = 1.42, TX = 520 - 600 * S_, TY = 690 - 470 * S_;
  const toLocal = (p) => ({ x: (p.x - TX) / S_, y: (p.y - TY) / S_ });
  const toStage = (q) => ({ x: q.x * S_ + TX, y: q.y * S_ + TY });
  const BOX = { x: 1030, y: 650 };

  K.xmasState = () => {
    const S = K.save.data;
    if (!S.xmas || typeof S.xmas !== 'object') S.xmas = {};
    S.xmas.items = S.xmas.items || [];
    S.xmas.bag = S.xmas.bag || [];
    if (S.xmas.snow === undefined) S.xmas.snow = true;
    return S.xmas;
  };
  /** decorations drawn in castle coordinates (used by the kingdom too) */
  K.xmasSvg = () => K.xmasState().items.map((it) => `<g transform="translate(${it.x} ${it.y})">${A.xmas(it.t, it.c)}</g>`).join('');

  K.scenes.christmas = {
    enter(root) {
      const X = K.xmasState();
      K.hintOnce('christmas', 'Tap the big present box! A decoration pops out. Drag it onto the castle!');

      /* ---------- snowy night ---------- */
      let stars = '';
      for (let i = 0; i < 50; i++) stars += `<circle cx="${K.rand(-300, 1500).toFixed(0)}" cy="${K.rand(-200, 360).toFixed(0)}" r="${K.rand(1.5, 3.5).toFixed(1)}" fill="#fff" class="twinkle" style="animation-delay:-${K.rand(0, 2).toFixed(1)}s"/>`;
      const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="-10" width="16" height="22" fill="#a8744f"/><path d="M0 -150 L-46 -80 H-24 L-60 -30 H-34 L-74 10 H74 L34 -30 H60 L24 -80 H46Z" fill="#3f9a6a"/>
        <path d="M0 -150 L-22 -116 Q0 -108 22 -116Z M-46 -80 Q-20 -70 -10 -84 M-60 -30 Q-30 -20 -14 -36 M10 -36 Q30 -20 60 -30" fill="#fff" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1500" fill="url(#gNight)"/>${stars}
        <g transform="translate(1040 120) scale(.8)">${A.picture('MOON')}</g>
        <path d="M-900 560 Q-200 430 300 520 Q700 430 1000 510 Q1300 440 2100 520 V1400 H-900Z" fill="#e6efff"/>
        <path d="M-900 660 Q200 600 600 650 Q1000 600 2100 650 V1400 H-900Z" fill="#fff"/>
        ${pine(70, 640, 1.1)}${pine(190, 600, 0.8)}${pine(880, 600, 0.75)}${pine(1150, 640, 1.05)}`, root);

      const castle = K.g(`${A.castle()}
        <g fill="#fff">
          <path d="M392 200 Q443 182 494 200 Q470 212 443 206 Q416 212 392 200Z"/><path d="M706 200 Q757 182 808 200 Q784 212 757 206 Q730 212 706 200Z"/>
          <path d="M544 156 Q600 140 656 156 Q630 168 600 162 Q570 168 544 156Z"/>
          ${[470, 497, 524, 552, 579, 606, 634, 661, 688, 716].map((x) => `<ellipse cx="${x + 9}" cy="246" rx="12" ry="6"/>`).join('')}
          <ellipse cx="600" cy="476" rx="260" ry="20"/></g>`, root, { transform: `translate(${TX.toFixed(1)} ${TY.toFixed(1)}) scale(${S_})` });
      K.tap(castle, (p) => { K.fx.sparkle(p.x, p.y, { n: 6 }); K.audio.sfx('sparkle'); });
      const deco = K.g('', root, { transform: `translate(${TX.toFixed(1)} ${TY.toFixed(1)}) scale(${S_})` });

      /* ---------- princess ---------- */
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 150, 740, 0.8);
      K.makeDraggable(pr, { clamp: (x, y) => ({ x: K.clamp(x, 60, 1140), y: K.clamp(y, 690, 780) }), tap: () => { pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('jingle'); } });

      /* ---------- placed decorations ---------- */
      function drawDeco() {
        deco.innerHTML = '';
        X.items.forEach((it) => {
          const g = K.g(`<g>${A.xmas(it.t, it.c)}</g>`, deco, { transform: `translate(${it.x} ${it.y})` });
          K.drag(g, {
            start: () => { deco.appendChild(g); },
            move: (p, dx, dy, moved) => { if (!moved) return; const q = toLocal(p); it.x = Math.round(q.x); it.y = Math.round(q.y); g.setAttribute('transform', `translate(${it.x} ${it.y}) scale(1.12)`); },
            end: (p) => {
              if (K.dist(p.x, p.y, BOX.x, BOX.y - 40) < 110) {
                X.items.splice(X.items.indexOf(it), 1);
                K.fx.poof(BOX.x, BOX.y - 60);
                K.voice.say('Back in the box!');
              } else K.audio.sfx('pop');
              K.save.write(); drawDeco();
            },
            tap: () => { K.replay(g.firstChild, 'pop', 600); K.audio.sfx('jingle'); const s = toStage(it); K.fx.sparkle(s.x, s.y, { n: 8 }); K.fx.word(A.XMAS_WORDS[it.t], K.clamp(s.x, 200, 1000), Math.max(150, s.y - 110)); },
          });
        });
      }
      drawDeco();

      /* ---------- the big surprise box ---------- */
      const boxG = K.g('', root, { transform: `translate(${BOX.x} ${BOX.y})` });
      boxG.innerHTML = `<g class="boxIn">
        <ellipse cx="0" cy="92" rx="130" ry="16" fill="#5a3d7a" opacity=".15"/>
        <rect x="-115" y="-40" width="230" height="130" rx="14" fill="#ff7d9c" stroke="#e0507a" stroke-width="5"/>
        <rect x="-18" y="-40" width="36" height="130" fill="#ffd166"/>
        ${[[-80, 0], [70, 40], [-60, 60], [80, -10]].map(([x, y]) => `<path d="${A.star(10)}" transform="translate(${x} ${y})" fill="#fff" opacity=".8"/>`).join('')}
        <g class="lid"><rect x="-128" y="-74" width="256" height="40" rx="12" fill="#ff9ab2" stroke="#e0507a" stroke-width="5"/><rect x="-18" y="-74" width="36" height="40" fill="#ffd166"/>
          <path d="M0 -74 C-52 -128 -62 -70 0 -74 C62 -70 52 -128 0 -74Z" fill="#ffd166" stroke="#e6a52e" stroke-width="4"/><circle cy="-76" r="10" fill="#ffc54d"/></g></g>`;
      const lid = boxG.querySelector('.lid');
      let ready = null, lastTap = 0;
      K.tap(boxG, () => openBox());
      const READY = { x: BOX.x, y: 430 };

      function nextType() {
        if (!X.bag.length) X.bag = K.shuffle(A.XMAS);
        return X.bag.shift();
      }
      async function openBox() {
        if (performance.now() - lastTap < 500) return;
        lastTap = performance.now();
        K.audio.sfx('pop'); K.audio.sfx('jingle');
        K.tween(500, (t) => lid.setAttribute('transform', `translate(0 ${(-60 * Math.sin(t * Math.PI)).toFixed(1)}) rotate(${(-14 * Math.sin(t * Math.PI)).toFixed(1)})`));
        K.fx.sparkle(BOX.x, BOX.y - 80, { n: 18, spread: 120 });
        if (ready) {
          const old = ready.el;
          K.tween(300, (t) => K.place(old, K.lerp(READY.x, BOX.x, t), K.lerp(READY.y, BOX.y, t), S_ * (1 - t))).then(() => old.remove());
          ready = null;
        }
        const t = nextType(), c = K.irand(0, 5);
        K.save.write();
        const el = K.g(`<g class="bob"><circle r="56" fill="url(#gGlow)"/>${A.xmas(t, c)}</g>`, root);
        ready = { t, c, el };
        K.tween(500, (k) => K.place(el, BOX.x, K.lerp(BOX.y - 40, READY.y, k), S_ * (0.3 + 0.7 * k)), 'back');
        K.fx.word(A.XMAS_WORDS[t], 900, 180, { sayText: `A ${A.XMAS_WORDS[t]}! Where should it go?` });
        const me = ready;
        K.drag(el, {
          start: () => { root.appendChild(el); },
          move: (p, dx, dy, moved) => { if (moved) K.place(el, p.x, p.y, S_ * 1.1); },
          end: (p) => {
            if (ready !== me) return;
            if (K.dist(p.x, p.y, BOX.x, BOX.y - 40) < 110) { K.tween(250, (k) => K.place(el, p.x, p.y, S_ * (1 - k))).then(() => el.remove()); ready = null; return; }
            place(me, p);
          },
          tap: () => { K.replay(el.firstChild, 'pop', 500); K.voice.say(A.XMAS_WORDS[t]); },
        });
      }
      function place(item, p) {
        if (X.items.length >= 80) { K.voice.say('The castle is so full of decorations!'); return; }
        const q = toLocal(p);
        X.items.push({ t: item.t, c: item.c, x: Math.round(q.x), y: Math.round(q.y) });
        K.save.write();
        item.el.remove(); ready = null;
        drawDeco();
        K.audio.sfx('sparkle');
        K.fx.sparkle(p.x, p.y, { n: 16, spread: 90 });
        const n = X.items.length;
        K.fx.number(n, K.clamp(p.x, 80, 1120), Math.max(110, p.y - 100), { sayText: n === 1 ? 'One decoration!' : `${n} decorations!` });
        K.emit('decorate', { t: item.t });
        if (n % 5 === 0) K.fx.star(p.x, p.y - 60);
      }

      /* ---------- snow + jingle buttons ---------- */
      const flakes = [];
      for (let i = 0; i < 46; i++) {
        const e = K.el('circle', { r: K.rand(3, 7).toFixed(1), fill: '#fff', opacity: K.rand(0.6, 1).toFixed(2) }, root);
        e.setAttribute('pointer-events', 'none');
        flakes.push({ e, x: K.rand(-200, 1400), y: K.rand(-100, 800), vy: K.rand(30, 70), ph: K.rand(0, 6) });
      }
      let snowing = X.snow;
      K.every((dt, now) => {
        flakes.forEach((f) => {
          f.e.setAttribute('display', snowing ? '' : 'none');
          if (!snowing) return;
          f.y += f.vy * dt; if (f.y > 820) { f.y = -20; f.x = K.rand(-200, 1400); }
          f.e.setAttribute('cx', (f.x + Math.sin(now / 900 + f.ph) * 20).toFixed(1)); f.e.setAttribute('cy', f.y.toFixed(1));
        });
      });
      K.button(root, 1120, 230, A.icons.snowflake, () => { snowing = !snowing; X.snow = snowing; K.save.write(); K.fx.word(snowing ? 'snow' : 'no snow', 900, 180, { sayText: snowing ? 'Let it snow!' : 'The snow stopped.' }); }, { r: 64, fill: 'url(#gBtnLilac)' });
      K.button(root, 1120, 350, A.icons.bells, () => {
        K.audio.sfx('jingle'); K.wait(350).then(() => K.audio.sfx('jingle'));
        Array.from(deco.children).forEach((g, i) => K.wait(i * 40).then(() => K.replay(g.firstChild, 'pop', 600)));
        K.fx.sparkle(520, 350, { n: 30, spread: 320 });
        pr.happy(1400); pr.play('a-jump', 700);
        K.fx.word('jingle', 600, 180, { sayText: 'Jingle, jingle! Merry Christmas!' });
      }, { r: 64, fill: 'url(#gBtnGold)' });
    },
  };
})();
