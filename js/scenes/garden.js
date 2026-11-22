/* Enchanted garden: plant, water, bloom — each flower reveals a letter; together they spell a word */
(function () {
  const A = K.art, D = K.data;
  const LETTER_NAMES = { A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee', H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'el', M: 'em', N: 'en', O: 'oh', P: 'pee', Q: 'cue', R: 'ar', S: 'ess', T: 'tee', U: 'you', V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zee' };
  // Speak a letter as itself ("C."). Spelled-out names like "ay" were read as "I" by some voices.
  K.letterName = (ch) => (LETTER_NAMES[ch.toUpperCase()] ? ch.toUpperCase() + '.' : ch);

  K.scenes.garden = {
    enter(root) {
      const S = K.save.data, G = S.garden;
      const wordKey = D.WORDS[G.word % D.WORDS.length];
      const word = wordKey === 'NAME' ? K.myName().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'ADDIE' : wordKey;
      const n = word.length;
      if (!Array.isArray(G.plots) || G.plots.length !== n || G.plotsWord !== word) {
        G.plots = Array.from({ length: n }, () => ({ st: 0, c: K.pick(D.FLOWER_COLORS) }));
        G.plotsWord = word;
      }
      K.save.write();
      K.hintOnce('garden', 'Tap the dirt to plant a seed. Then tap again to water it. Each flower has a letter!');

      /* ---------- scenery ---------- */
      const bg = K.g(`${A.skyRect()}
        <g transform="translate(1080 110) scale(.7)">${A.sun()}</g>
        <g transform="translate(600 470)">${A.rainbow(420, 18, 0.45)}</g>
        <g class="drift" style="animation-duration:90s;animation-delay:-20s"><g transform="translate(0 100)">${A.cloud(0.7)}</g></g>
        <g class="drift" style="animation-duration:120s;animation-delay:-80s"><g transform="translate(0 190)">${A.cloud(0.5)}</g></g>
        ${A.hills(430)}${A.groundRect(450)}
        <g transform="translate(70 470)">${A.tree(1, 0.95)}</g><g transform="translate(260 455)">${A.tree(0, 0.7)}</g>
        <g transform="translate(940 455)">${A.tree(0, 0.7)}</g>
        ${Array.from({ length: 16 }, (_, i) => `<g transform="translate(${-40 + i * 84} 476)">${A.bush(i % 2 ? '#a9e3ad' : '#9ad8a2', 1.25)}</g>`).join('')}
        <g transform="translate(600 476)"><path d="M-80 0 V-120 A80 80 0 0 1 80 -120 V0" fill="none" stroke="#8fd88f" stroke-width="26"/>
          ${[-80, -60, -20, 20, 60, 80].map((x, i) => `<g transform="translate(${x} ${-120 - Math.cos((x / 80) * Math.PI / 2) * 70})">${A.flowerHead(D.FLOWER_COLORS[i], 10, false)}</g>`).join('')}</g>
        <path d="M-900 790 H2100" stroke="#b5e3b9" stroke-width="80"/>
        ${Array.from({ length: 18 }, (_, i) => `<g transform="translate(${-20 + i * 72} ${770 + (i % 2) * 14})"><path d="M0 0 V-26" stroke="#6cc07a" stroke-width="4"/><g class="sway" style="animation-delay:-${(i * 0.37).toFixed(2)}s"><g transform="translate(0 -30)">${i % 3 ? A.flowerHead(D.FLOWER_COLORS[i % 7], 13) : `<g transform="translate(0 12)">${A.tulip(D.FLOWER_COLORS[(i + 3) % 7])}</g>`}</g></g></g>`).join('')}`, root);
      [[300, 300, '#ffb3d4'], [880, 260, '#c9a6ff'], [760, 420, '#9fd2ff']].forEach(([cx, cy, c], i) => {
        const b = K.g(`<g>${A.butterfly(c)}</g>`, root);
        K.every((dt, now) => {
          const t = now / 1000 + i * 2;
          b.setAttribute('transform', `translate(${(cx + Math.sin(t * 0.5) * 110).toFixed(1)} ${(cy + Math.sin(t * 0.9) * 40).toFixed(1)}) rotate(${(Math.cos(t * 0.5) * 20).toFixed(0)}) scale(1.3)`);
        });
        K.tap(b, (p) => { K.audio.sfx('flutter'); K.fx.sparkle(p.x, p.y, { n: 8 }); K.fx.word('butterfly', p.x, p.y - 70); });
      });
      const fountain = K.g(`<ellipse cx="0" cy="0" rx="90" ry="22" fill="#e6dcf3"/><ellipse cx="0" cy="-6" rx="80" ry="18" fill="url(#gWater)"/>
        <rect x="-10" y="-90" width="20" height="84" fill="#f4eefb" stroke="#d8cbe8" stroke-width="2"/><ellipse cx="0" cy="-90" rx="40" ry="10" fill="#f4eefb" stroke="#d8cbe8" stroke-width="2"/>
        <path d="M0 -100 Q-30 -140 -50 -96 M0 -100 Q30 -140 50 -96 M0 -100 V-140" stroke="#9fd2ff" stroke-width="5" fill="none" stroke-linecap="round" class="twinkle"/>
        ${A.sparkle4(-30, -120, 7)}${A.sparkle4(34, -110, 6)}${A.sparkle4(0, -14, 6)}`, root, { transform: 'translate(1110 560)' });
      K.tap(fountain, () => { K.fx.drops(1110, 440, 14); K.fx.sparkle(1110, 450, { n: 10 }); K.audio.sfx('splash'); K.fx.word('water', 1060, 330); });

      /* ---------- plots ---------- */
      const gap = n > 4 ? 172 : 200;
      const X = (i) => 600 + (i - (n - 1) / 2) * gap;
      const PY = 610;
      const plotsG = K.g('', root);
      const plotEls = [];
      for (let i = 0; i < n; i++) {
        const g = K.g('', plotsG, { transform: `translate(${X(i)} ${PY})` });
        plotEls.push(g);
        drawPlot(i);
        K.tap(g, () => tend(i));
      }
      function drawPlot(i, grow) {
        const p = G.plots[i], c = p.c;
        let plant = '';
        if (p.st === 1) plant = `<ellipse cx="0" cy="-8" rx="26" ry="12" fill="#a8744f"/><ellipse cx="0" cy="-14" rx="7" ry="5" fill="#f2d3a8" stroke="#c99a62" stroke-width="2"/>`;
        if (p.st === 2) plant = `<g class="${grow ? 'grow-up' : ''}"><path d="M0 -6 V-60" stroke="#6cc07a" stroke-width="7" stroke-linecap="round"/>
          <path d="M0 -40 Q-30 -60 -36 -44 Q-20 -30 0 -40Z M0 -50 Q30 -70 36 -54 Q20 -40 0 -50Z" fill="#8fd88f" stroke="#5fb86f" stroke-width="2"/></g>`;
        if (p.st === 3) plant = `<g class="${grow ? 'grow-up' : ''}"><path d="M0 -6 V-120" stroke="#6cc07a" stroke-width="8" stroke-linecap="round"/>
          <path d="M0 -50 Q-40 -76 -48 -54 Q-26 -38 0 -50Z M0 -72 Q40 -98 48 -76 Q26 -60 0 -72Z" fill="#8fd88f" stroke="#5fb86f" stroke-width="2"/>
          <g class="sway" style="animation-delay:-${i * 0.5}s"><g transform="translate(0 -140)">${A.flowerHead(c, 34)}</g></g></g>`;
        const letter = p.st === 3 ? word[i] : '';
        const hint = p.st < 3 && i === G.plots.findIndex((q) => q.st < 3) ? `<g class="bob"><g transform="translate(0 ${p.st >= 2 ? -110 : -70})">${A.sparkle4(0, 0, 16, '#fff08a')}</g></g>` : '';
        plotEls[i].innerHTML = `<ellipse cx="0" cy="0" rx="78" ry="30" fill="#c99a72"/><ellipse cx="0" cy="-4" rx="68" ry="22" fill="#b58460"/>
          ${p.st === 0 ? '<path d="M-30 -4 h14 M-6 -8 h14 M18 -2 h14" stroke="#9a6b48" stroke-width="4" stroke-linecap="round"/>' : ''}
          ${plant}
          <g transform="translate(0 72)"><rect x="-6" y="-10" width="12" height="44" fill="#d9a77a"/><rect x="-40" y="-46" width="80" height="62" rx="12" fill="#fff4e0" stroke="#d9a77a" stroke-width="4"/>
            <text class="sign-letter${grow && letter ? ' pop-in' : ''}" y="4" text-anchor="middle" font-size="52" fill="${letter ? K.shade(c, -0.35) : '#e8d8c4'}">${letter || '?'}</text></g>
          ${hint}
          <rect x="-86" y="-190" width="172" height="300" fill="#fff" opacity="0"/>`;
      }

      /* ---------- princess ---------- */
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 110, 690, 0.95);
      K.makeDraggable(pr, { can: () => !busy, clamp: (x, y) => ({ x: K.clamp(x, 60, 1140), y: K.clamp(y, 640, 720) }), tap: () => { pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('giggle'); } });

      let busy = false;
      async function tend(i) {
        const p = G.plots[i];
        if (busy) return;
        if (p.st === 3) {
          // tap a bloomed flower: say its letter
          K.audio.sfx('chime');
          K.fx.sparkle(X(i), PY - 140, { n: 10 });
          K.fx.word(word[i], X(i), PY - 260, { sayText: K.letterName(word[i]) });
          return;
        }
        busy = true;
        const tx = X(i) - 110;
        await pr.walkTo(tx, 690);
        pr.face = 1; pr.place();
        const px = X(i), py = PY;
        if (p.st === 0) {
          const bag = K.g(`<g transform="rotate(-30)">${A.icons.seed}</g>`, K.layers.fx);
          await K.tween(400, (t) => K.place(bag, K.lerp(pr.x + 30, px + 20, t), K.lerp(pr.y - 140, py - 90, t), 1));
          for (let k = 0; k < 3; k++) {
            const sd = K.el('ellipse', { rx: 5, ry: 4, fill: '#f2d3a8', stroke: '#c99a62' }, K.layers.fx);
            K.tween(350, (t) => K.place(sd, px + K.rand(-6, 6), K.lerp(py - 70, py - 12, t)), 'in').then(() => sd.remove());
            await K.wait(90);
          }
          await K.wait(250);
          bag.remove();
          K.audio.sfx('plant');
          p.st = 1;
          pr.play('a-hop', 450);
          K.fx.word('seed', px, py - 220, { hold: 1.2 });
        } else {
          const can = K.g(`<g transform="scale(1.1)">${A.icons.can}</g>`, K.layers.fx);
          await K.tween(400, (t) => K.place(can, K.lerp(pr.x + 30, px - 30, t), K.lerp(pr.y - 140, py - 120, t), 1));
          K.audio.sfx('pour');
          await K.tween(250, (t) => K.place(can, px - 30, py - 120, 1, -35 * t));
          for (let k = 0; k < 6; k++) { K.fx.drops(px + 10, py - 140, 3); await K.wait(110); }
          can.remove();
          p.st++;
          K.audio.sfx('grow');
          if (p.st === 2) K.fx.word('sprout', px, py - 220, { hold: 1.2 });
        }
        K.save.write();
        drawPlot(i, true);
        G.plots.forEach((_, j) => j !== i && drawPlot(j));
        if (p.st === 3) {
          G.flowers = (G.flowers || 0) + 1; K.save.write();
          K.fx.sparkle(px, py - 150, { n: 24, spread: 120 });
          K.audio.sfx('chime');
          pr.happy();
          await K.wait(400);
          K.fx.word(word[i], px, py - 280, { sayText: K.letterName(word[i]), size: 70 });
          await K.wait(900);
          if (G.plots.every((q) => q.st === 3)) { busy = false; return celebrate(); }
        }
        busy = false;
      }

      async function celebrate() {
        busy = true;
        K.hint(`You grew the word ${word.toLowerCase()}!`);
        // read each letter, left to right
        for (let i = 0; i < n; i++) {
          const t = plotEls[i].querySelector('.sign-letter');
          if (t) K.replay(t, 'pop-in', 500);
          K.fx.sparkle(X(i), PY + 70, { n: 6, spread: 50 });
          K.audio.sfx('count', i + 1);
          K.voice.say(K.letterName(word[i]));
          await K.wait(750);
        }
        K.audio.sfx('fanfare');
        pr.happy(2500); pr.play('a-jump', 700);
        K.fx.word(word.toLowerCase(), 600, 200, { size: 90, hold: 3.2, picture: A.picture(wordKey), sayText: `${word.toLowerCase()}! You grew the word ${word.toLowerCase()}!` });
        K.fx.confetti(50);
        K.fx.stars(3, 600, 300);
        K.emit('word');
        await K.wait(3400);
        // magic seed packet for the next word
        const btn = K.g(`<g class="bob"><circle r="70" fill="url(#gGlow)"/><circle r="56" fill="url(#gBtnGold)" stroke="#fff" stroke-width="6"/><g transform="scale(1.15)">${A.icons.seed}</g></g>`, root, { transform: 'translate(730 300)' });
        // spell the word on the big keyboard
        const kb = K.g(`<g class="bob" style="animation-delay:-1.2s"><circle r="70" fill="url(#gGlow)"/><circle r="56" fill="url(#gBtnLilac)" stroke="#fff" stroke-width="6"/><g transform="scale(1.2)">${A.icons.keyboard}</g></g>`, root, { transform: 'translate(470 300)' });
        K.voice.say('Can you spell it on the keyboard? Or tap the magic seeds to grow a new word!');
        K.hint('Tap the keyboard to spell the word, or the magic seeds to grow a new word!');
        busy = false;
        K.tap(kb, () => {
          if (busy) return;
          busy = true;
          const layer = K.g('', root);
          K.spell(layer, {
            word, picture: `<g transform="scale(1.1)">${A.picture(wordKey)}</g>`, panel: true, guide: true,
            onDone: () => {
              layer.remove(); kb.remove();
              K.fx.stars(3, 600, 300);
              K.emit('spelled', { word });
              K.voice.say('Wonderful spelling! Now tap the magic seeds!');
              busy = false;
            },
          });
          const close = K.button(layer, 1110, 110, `<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>`, () => { layer.remove(); busy = false; }, { r: 40 });
          void close;
        });
        K.tap(btn, async () => {
          if (busy) return;
          btn.remove(); kb.remove();
          busy = true;
          // pick flowers into a bouquet and count them
          for (let i = 0; i < n; i++) {
            const f = K.g(`<g transform="scale(.9)">${A.flowerHead(G.plots[i].c, 34)}</g>`, K.layers.fx);
            const sx = X(i), sy = PY - 140;
            G.plots[i].st = 0; drawPlot(i);
            K.tween(600, (t) => K.place(f, K.lerp(sx, 600, t), K.lerp(sy, 300, t) - Math.sin(t * Math.PI) * 100, 1 - t * 0.6)).then(() => f.remove());
            K.fx.number(i + 1, sx, sy - 40);
            await K.wait(750);
          }
          K.fx.word('flowers', 600, 220, { sayText: `${n} flowers!` });
          await K.wait(1500);
          G.word = (G.word + 1) % D.WORDS.length;
          G.plots = []; K.save.write();
          K.go('garden');
        });
      }
      if (G.plots.every((q) => q.st === 3)) K.wait(500).then(celebrate);
    },
  };
})();
