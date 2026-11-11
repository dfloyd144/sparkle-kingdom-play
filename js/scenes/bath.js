/* Royal bathroom: use the potty, flush, wash hands (count to 5), bubble bath with a rubber duck */
(function () {
  const A = K.art;

  K.scenes.bath = {
    enter(root) {
      K.hintOnce('bath', 'This is the royal bathroom! Tap the potty, the sink, or the bubble bath.');
      let busy = false, pottyDone = false, flushed = false, inBath = false, paperLen = 40;

      /* ---------- room ---------- */
      let tiles = '';
      for (let x = -900; x < 2100; x += 50) for (let y = 300; y < 560; y += 50) tiles += `<rect x="${x + 2}" y="${y + 2}" width="46" height="46" rx="8" fill="${((x + y) / 50) % 2 ? '#d3effc' : '#e2f6ff'}"/>`;
      let bub = '';
      for (let i = 0; i < 26; i++) bub += `<circle cx="${(K.rand(-200, 1400)).toFixed(0)}" cy="${(K.rand(-60, 280)).toFixed(0)}" r="${K.rand(8, 26).toFixed(0)}" fill="#fff" opacity=".5" stroke="#cbe9fb" stroke-width="2"/>`;
      let floor = '';
      for (let x = -900; x < 2100; x += 70) for (let y = 560; y < 1300; y += 70) floor += `<rect x="${x}" y="${y}" width="70" height="70" fill="${((x + y) / 70) % 2 ? '#f6efff' : '#e7dbfb'}"/>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1260" fill="#eef9ff"/>${bub}${tiles}
        <rect x="-900" y="290" width="3000" height="14" fill="#fff"/>
        ${floor}<rect x="-900" y="552" width="3000" height="14" fill="#c9e6f7"/>
        <g transform="translate(600 150)"><path d="M-70 70 V-20 A70 70 0 0 1 70 -20 V70Z" fill="#bfe5ff" stroke="#fff" stroke-width="10"/>
          <g transform="translate(20 -20) scale(.35)">${A.sun()}</g><path d="M-70 40 Q0 10 70 36 V70 H-70Z" fill="#b3e6c2"/><path d="M0 -90 V70" stroke="#fff" stroke-width="6"/></g>
        <ellipse cx="230" cy="700" rx="150" ry="34" fill="#ffd1e8" stroke="#ffb3d4" stroke-width="4"/>
        <ellipse cx="900" cy="700" rx="100" ry="26" fill="#d6f1ff" stroke="#b3e1fa" stroke-width="4"/>
        <g transform="translate(1150 640)"><path d="M-26 -46 H26 L20 0 H-20Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3"/><path d="M0 -46 Q-30 -90 -36 -120 Q-6 -94 0 -46Z M0 -46 Q30 -96 34 -128 Q6 -96 0 -46Z" fill="#8fd88f" stroke="#5fb86f" stroke-width="2"/></g>`, root);

      /* ---------- bathtub (back half, princess, front half) ---------- */
      const tubBack = K.g(`<ellipse cx="225" cy="478" rx="168" ry="24" fill="#bfe6ff"/>
        <path d="M54 420 Q52 380 90 380 H104" stroke="url(#gGold)" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="104" cy="380" r="9" fill="#ffc54d"/>`, root);
      const tubActor = K.g('', root);
      const tubFront = K.g(`<path d="M52 480 H398 Q400 600 304 622 H146 Q50 600 52 480Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="5"/>
        <path d="M90 520 Q225 545 360 520" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>
        <rect x="40" y="466" width="370" height="24" rx="12" fill="#fff" stroke="#e57aa8" stroke-width="4"/>
        ${[70, 100, 130, 160, 195, 230, 265, 300, 330, 360, 385].map((x, i) => `<circle cx="${x}" cy="${462 - (i % 2) * 8}" r="${16 + (i % 3) * 4}" fill="#fff" stroke="#cbe9fb" stroke-width="2"/>`).join('')}
        <path d="${A.heart(1.6)}" transform="translate(225 572)" fill="#fff" opacity=".85"/>
        ${[120, 330].map((x) => `<path d="M${x - 16} 618 Q${x} 652 ${x + 16} 618Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>`).join('')}`, root);
      K.tap(tubFront, () => (inBath ? splash() : getInBath()));
      K.tap(tubBack, () => (inBath ? splash() : getInBath()));
      const duck = K.g(`<g class="duckIn"><ellipse cx="0" cy="0" rx="26" ry="18" fill="#ffe27f" stroke="#e6b84a" stroke-width="3"/><circle cx="16" cy="-20" r="15" fill="#ffe27f" stroke="#e6b84a" stroke-width="3"/>
        <path d="M28 -22 l14 3 -14 6Z" fill="#ffad6b"/><circle cx="20" cy="-24" r="3.2" fill="#4a2c5a"/><path d="M-20 -6 q-12 -10 -4 -18" stroke="#e6b84a" stroke-width="3" fill="none"/></g>`, root, { transform: 'translate(372 440)' });
      K.tap(duck, () => { K.replay(duck.firstChild, 'pop', 600); K.audio.sfx('quack'); K.fx.bubbles(372, 420, 4, 20); K.fx.word('duck', 372, 330); });

      /* ---------- toilet ---------- */
      const toilet = K.g(`<ellipse cx="600" cy="652" rx="64" ry="12" fill="#5a3d7a" opacity=".1"/>
        <rect x="546" y="356" width="108" height="100" rx="16" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <rect x="538" y="344" width="124" height="20" rx="9" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <path d="${A.heart(1.3)}" transform="translate(608 410)" fill="#ffb3d4"/>
        <path d="M575 598 L566 650 H634 L625 598Z" fill="#fff" stroke="#9fcdea" stroke-width="4" stroke-linejoin="round"/>
        <path d="M526 520 Q530 592 572 606 H628 Q670 592 674 520Z" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <ellipse cx="600" cy="518" rx="76" ry="24" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <ellipse class="water" cx="600" cy="520" rx="50" ry="13" fill="#cdeeff"/>`, root);
      const swirl = K.el('path', { d: 'M0 0', fill: 'none', stroke: '#7cc4ee', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, toilet);
      K.tap(toilet, () => potty());
      const handle = K.g(`<rect x="-30" y="-6" width="34" height="12" rx="6" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/><circle r="10" fill="#ffc54d" stroke="#e6a52e" stroke-width="2"/>
        <circle r="34" fill="#fff" opacity="0"/>`, root, { transform: 'translate(560 384)' });
      const handleHint = K.g('', root, { transform: 'translate(540 330)' });
      K.tap(handle, () => flush());
      // toilet paper
      const paper = K.g('', root, { transform: 'translate(730 430)' });
      function drawPaper() {
        paper.innerHTML = `<rect x="-36" y="-30" width="72" height="8" rx="4" fill="url(#gGold)"/><path d="M-30 -26 V-4 M30 -26 V-4" stroke="#e6a52e" stroke-width="4"/>
          <rect x="16" y="0" width="34" height="${paperLen}" fill="#fff" stroke="#e5dcef" stroke-width="2"/>
          <circle cx="0" cy="0" r="24" fill="#fff" stroke="#e5dcef" stroke-width="3"/><circle r="8" fill="#e8dcc8"/>
          ${paperLen > 40 ? `<path d="${A.heart(0.6)}" transform="translate(33 ${paperLen - 12})" fill="#ffc2dc"/>` : ''}`;
      }
      drawPaper();
      K.tap(paper, () => {
        paperLen = paperLen >= 130 ? 40 : paperLen + 45;
        drawPaper(); K.audio.sfx(paperLen === 40 ? 'whoosh' : 'flutter');
        K.fx.word('paper', 760, 330);
      });

      /* ---------- sink & mirror ---------- */
      const mirror = K.g(`<ellipse cx="960" cy="260" rx="86" ry="104" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3"/><ellipse cx="960" cy="260" rx="72" ry="90" fill="#e2f5ff"/>
        <path d="M920 220 L960 180 M914 262 L984 192" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>
        <path d="${A.heart(1.2)}" transform="translate(960 150)" fill="#ff8fb8"/>`, root);
      K.tap(mirror, () => { K.audio.sfx('sparkle'); K.fx.sparkle(960, 260, { n: 16, spread: 110 }); pr.happy(); K.fx.word('mirror', 960, 120, { sayText: 'Mirror, mirror! You look wonderful!' }); });
      const sink = K.g(`<path d="M942 512 H978 L986 640 H934Z" fill="#fff" stroke="#9fcdea" stroke-width="4" stroke-linejoin="round"/>
        <path d="M866 452 H1054 Q1050 516 960 522 Q870 516 866 452Z" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <rect x="856" y="440" width="208" height="20" rx="10" fill="#fff" stroke="#9fcdea" stroke-width="4"/>
        <ellipse cx="960" cy="452" rx="70" ry="8" fill="#cdeeff"/>
        <path d="M960 440 V414 Q960 404 972 404 H990 V414" stroke="url(#gGold)" stroke-width="10" fill="none" stroke-linecap="round"/>
        <g transform="translate(1030 438)"><rect x="-12" y="-30" width="24" height="30" rx="8" fill="#ffb3d4" stroke="#e57aa8" stroke-width="2"/><path d="M0 -30 V-40 H12" stroke="#e57aa8" stroke-width="4" fill="none"/></g>`, root);
      const stream = K.el('path', { d: 'M990 416 Q994 430 990 452', stroke: '#9fd2ff', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, root);
      const sinkHint = K.g('', root, { transform: 'translate(960 380)' });
      K.tap(sink, () => washHands());
      // towel
      const towel = K.g(`<g class="tw"><circle cx="0" cy="0" r="24" fill="none" stroke="url(#gGold)" stroke-width="6"/>
        <path d="M-30 16 H30 V120 Q0 130 -30 120Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/><path d="M-30 96 H30 M-30 104 H30" stroke="#fff" stroke-width="4"/></g>`, root, { transform: 'translate(1120 360)' });
      // Happy Hands: germ check + busy hands game
      K.button(root, 700, 730, `<g transform="scale(1.1)">${A.icons.hands}</g>`, () => { K.voice.say('happy hands'); K.go('hands'); }, { r: 60, fill: 'url(#gBtnGold)', label: 'happy hands' });
      K.tap(towel, () => {
        K.replay(towel.firstChild, 'shake', 700); K.audio.sfx('flutter');
        if (inBath) getOut(); else K.fx.word('towel', 1100, 300);
      });

      /* ---------- princess ---------- */
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 780, 668, 0.95);
      const floorClamp = (x, y) => ({ x: K.clamp(x, 70, 1130), y: K.clamp(y, 600, 720) });
      K.makeDraggable(pr, {
        can: () => !busy,
        clamp: floorClamp,
        lift: () => { if (inBath) { inBath = false; actorsG.appendChild(pr.root); K.emit('bath'); } },
        drop: (a) => {
          if (K.dist(a.x, a.y, 600, 640) < 110) potty();
          else if (K.dist(a.x, a.y, 230, 650) < 160) getInBath();
          else if (K.dist(a.x, a.y, 940, 660) < 110) washHands();
        },
        tap: () => {
          if (inBath) return splash();
          pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('giggle');
        },
      });
      const restS = 0.95;

      function hint(g, on) { g.innerHTML = on ? `<g class="bob"><circle r="30" fill="url(#gGlow)"/>${A.sparkle4(0, 0, 18, '#fff08a')}</g>` : ''; }

      /* ---------- stinky fumes (a poop makes the toilet a little smelly until it's flushed) ---------- */
      let fumes = null;
      function startFumes() {
        stopFumes();
        const g = K.g('', root);
        let t = 0;
        const stop = K.every((dt) => {
          if (!g.isConnected) return false;
          t += dt;
          let s = '';
          for (let i = 0; i < 4; i++) {
            const k = (t * 0.45 + i / 4) % 1, x = 560 + i * 27 + Math.sin(t * 2 + i) * 6, y = 505 - k * 170, o = Math.sin(k * Math.PI) * 0.75;
            const w = 12 + k * 8;
            s += `<path d="M${x} ${y} c${-w} -14 ${w} -26 0 -40 c${-w} -14 ${w} -26 0 -40" stroke="${i % 2 ? '#c9a23a' : '#a8823a'}" stroke-width="${9 - k * 3}" fill="none" stroke-linecap="round" opacity="${o.toFixed(2)}"/>`;
            s += `<circle cx="${x + 16}" cy="${y - 30}" r="${5 + k * 7}" fill="#d9c060" opacity="${(o * 0.5).toFixed(2)}"/>`;
          }
          g.innerHTML = s;
        });
        fumes = { g, stop };
      }
      function stopFumes() {
        if (!fumes) return;
        const f = fumes; fumes = null;
        K.tween(500, (k) => f.g.setAttribute('opacity', 1 - k)).then(() => { f.stop && f.stop(); f.g.remove(); });
      }

      /* ---------- potty ---------- */
      async function potty() {
        if (busy || inBath) return;
        busy = true;
        await pr.walkTo(600, 668);
        const sx = pr.x, sy = pr.y;
        await K.tween(450, (t) => { pr.x = K.lerp(sx, 600, t); pr.y = K.lerp(sy, 556, t) - Math.sin(t * Math.PI) * 60; pr.s = K.lerp(restS, 0.8, t); pr.face = 1; pr.place(); });
        pr.happy(3000);
        K.voice.say('Potty time!');
        K.fx.word('potty', 600, 250, { say: false });
        await K.wait(1300);
        const poop = Math.random() < 0.5;
        if (poop) { K.audio.sfx('boing'); K.wait(400).then(() => K.audio.sfx('pop')); startFumes(); }
        else { K.audio.sfx('tinkle'); K.fx.sparkle(600, 470, { n: 10, spread: 70 }); }
        await K.wait(1500);
        pottyDone = true; flushed = false;
        K.emit('potty');
        // hop off
        await K.tween(450, (t) => { pr.x = K.lerp(600, 470, t); pr.y = K.lerp(556, 668, t) - Math.sin(t * Math.PI) * 60; pr.s = K.lerp(0.8, restS, t); pr.place(); });
        pr.face = 1; pr.place();
        pr.play('a-hop', 450);
        hint(handleHint, true);
        K.voice.say(poop ? K.pick(['Pee-yew! A stinky poop! Flush it away!', 'Ooh, smelly! Flush the toilet, quick!', 'Poop time is done! Pee-yew! Flush it!']) : 'All done! Now flush the toilet!');
        if (poop) K.fx.word('pee-yew', 600, 330, { say: false });
        K.hint('Tap the shiny handle to flush the toilet!');
        busy = false;
      }

      /* ---------- flush ---------- */
      let flushing = false;
      async function flush() {
        if (flushing) return;
        flushing = true;
        hint(handleHint, false);
        K.audio.sfx('flush');
        K.tween(500, (t) => K.place(handle, 560, 384, 1, -35 * Math.sin(t * Math.PI)));
        K.replay(toilet, 'squish', 500);
        K.fx.word('flush', 600, 250);
        stopFumes();
        swirl.setAttribute('opacity', 1);
        await K.tween(1500, (t) => {
          let d = '';
          for (let k = 0; k <= 40; k++) {
            const a = k * 0.45 + t * 14, r = (1 - k / 40) * 46 * (1 - t * 0.6);
            d += (k ? 'L' : 'M') + (600 + Math.cos(a) * r).toFixed(1) + ' ' + (520 + Math.sin(a) * r * 0.28).toFixed(1);
          }
          swirl.setAttribute('d', d);
          swirl.setAttribute('opacity', (1 - t * 0.8).toFixed(2));
        }, 'linear');
        swirl.setAttribute('opacity', 0);
        K.fx.bubbles(600, 500, 5, 30);
        K.fx.sparkle(600, 500, { n: 12, spread: 80 });
        K.emit('flush');
        if (pottyDone && !flushed) {
          flushed = true;
          hint(sinkHint, true);
          K.voice.say('Whoosh! Now wash your hands!');
          K.hint('Tap the sink to wash your hands!');
        }
        flushing = false;
      }

      /* ---------- wash hands: count to 5 ---------- */
      async function washHands() {
        if (busy || inBath) return;
        busy = true;
        hint(sinkHint, false);
        await pr.walkTo(880, 668);
        pr.face = 1; pr.place();
        stream.setAttribute('opacity', 0.9);
        K.audio.sfx('splash');
        K.voice.say("Let's scrub and count to five!");
        await K.wait(1400);
        for (let k = 1; k <= 5; k++) {
          K.fx.bubbles(955, 455, 5, 34);
          K.audio.sfx('bubble');
          K.fx.number(k, 960, 330);
          pr.play('a-wiggle', 600);
          await K.wait(900);
        }
        stream.setAttribute('opacity', 0);
        K.replay(towel.firstChild, 'shake', 700);
        K.fx.sparkle(900, 520, { n: 14, spread: 80 });
        K.audio.sfx('chime');
        pr.happy(1600);
        const after = pottyDone && flushed;
        K.emit('wash', { afterFlush: after });
        if (after) {
          K.fx.word('clean', 960, 250, { sayText: `Squeaky clean hands! Great job, Princess ${K.myName()}!` });
          K.fx.star(900, 400);
          pottyDone = false; flushed = false;
        } else {
          K.fx.word('clean', 960, 250, { sayText: 'Squeaky clean hands!' });
        }
        K.hint('Tap the potty, the sink, or the bubble bath.');
        busy = false;
      }

      /* ---------- bubble bath ---------- */
      let bubbleStop = null;
      async function getInBath() {
        if (busy || inBath) return;
        busy = true;
        await pr.walkTo(400, 668);
        const sx = pr.x, sy = pr.y;
        await K.tween(600, (t) => { pr.x = K.lerp(sx, 225, t); pr.y = K.lerp(sy, 538, t) - Math.sin(t * Math.PI) * 140; pr.s = K.lerp(restS, 0.9, t); pr.face = 1; pr.place(); if (t > 0.6 && pr.root.parentNode !== tubActor) tubActor.appendChild(pr.root); });
        inBath = true;
        K.audio.sfx('splash');
        K.fx.drops(225, 460, 14);
        pr.happy(60000);
        K.fx.word('bath', 225, 250, { sayText: 'Splish splash! Bubble bath! Tap the towel when you are all clean.' });
        bubbleStop = K.every((dt) => { if (!inBath) return false; if (Math.random() < dt * 2.5) K.fx.bubbles(K.rand(90, 360), 450, 1, 10); });
        K.hint('Splish splash! Tap the bubbles. Tap the towel to get out.');
        busy = false;
      }
      function splash() {
        K.audio.sfx('splash'); K.audio.sfx('giggle');
        K.fx.drops(pr.x, 450, 10); K.fx.bubbles(pr.x, 440, 6, 50);
        pr.play('a-hop', 450);
      }
      async function getOut() {
        if (busy || !inBath) return;
        busy = true;
        inBath = false;
        if (bubbleStop) bubbleStop();
        actorsG.appendChild(pr.root);
        await K.tween(600, (t) => { pr.x = K.lerp(225, 440, t); pr.y = K.lerp(538, 668, t) - Math.sin(t * Math.PI) * 120; pr.s = K.lerp(0.9, restS, t); pr.place(); });
        pr.happy(1500); pr.play('a-twirl', 900);
        K.fx.sparkle(440, 520, { n: 24, spread: 140 });
        K.audio.sfx('sparkle');
        K.fx.word('clean', 440, 250, { sayText: 'All clean and sparkly!' });
        K.emit('bath');
        K.hint('Tap the potty, the sink, or the bubble bath.');
        busy = false;
      }
    },
  };
})();
