/* The Kingdom: explore, walk, tap things, pick an activity */
(function () {
  const A = K.art;
  const depth = (y) => 0.6 + ((y - 480) / 290) * 0.36;

  const LOCS = [
    { id: 'bakery', bx: 170, by: 236, icon: 'pot', word: 'cook', entry: [178, 520], scene: 'bakery' },
    { id: 'garden', bx: 150, by: 585, icon: 'flower', word: 'garden', entry: [250, 660], scene: 'garden' },
    { id: 'room', bx: 318, by: 150, icon: 'bed', word: 'my room', entry: [455, 492], scene: 'room' },
    { id: 'ball', bx: 600, by: 300, icon: 'ballroom', word: 'ball', entry: [600, 490], scene: 'ball' },
    { id: 'dressup', bx: 880, by: 150, icon: 'mirror', word: 'dress up', entry: [745, 492], scene: 'dressup' },
    { id: 'tea', bx: 1060, by: 548, icon: 'teacup', word: 'tea party', entry: [960, 700], scene: 'tea' },
    { id: 'bath', bx: 1075, by: 290, icon: 'toilet', word: 'bathroom', entry: [790, 492], scene: 'bath' },
    { id: 'spellbook', bx: 330, by: 392, icon: 'book', word: 'school', entry: [420, 500], scene: 'spellbook' },
    { id: 'pets', bx: 640, by: 640, icon: 'paw', word: 'pets', entry: [600, 710], scene: 'pets' },
    { id: 'worlds', bx: 975, by: 700, icon: 'rocket', word: 'worlds', entry: [900, 700], scene: 'worlds' },
    { id: 'christmas', bx: 770, by: 405, icon: 'present', word: 'Christmas', entry: [720, 500], scene: 'christmas' },
  ];

  K.scenes.kingdom = {
    enter(root, opts) {
      const S = K.save.data;
      K.hintOnce('kingdom', document.body.classList.contains('tall') ? 'Tap the grass to walk. Tap the arrows to see more of the kingdom. Tap a picture bubble to play!' : 'Tap the grass to walk. Tap a picture bubble to play!', 1600);
      let visiting = 0;

      /* ---------- background ---------- */
      const bg = K.g(`${A.skyRect()}
        <g transform="translate(600 470)">${A.rainbow(500, 16, 0.3)}</g>
        ${A.hills(445)}${A.groundRect(452)}
        <path d="M566 470 C556 560 520 650 470 830 L730 830 C680 650 644 560 634 470Z" fill="url(#gPath)"/>
        <path d="M560 540 C440 528 330 520 230 512 L222 540 C330 552 440 566 548 580Z" fill="url(#gPath)"/>
        <path d="M650 600 C760 620 880 650 980 690 L960 720 C860 690 740 660 640 646Z" fill="url(#gPath)"/>
        ${[[520, 640], [690, 600], [380, 620], [800, 560], [90, 560], [1130, 640], [700, 770], [320, 520]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${A.flowerHead(K.data.FLOWER_COLORS[i % 7], 8, false)}</g>`).join('')}`, root);
      K.tap(bg, (p) => walkTo(p.x, p.y));

      // sun
      const sun = K.g(`<g class="sunIn">${A.sun()}</g>`, root, { transform: 'translate(1060 100)' });
      K.tap(sun, () => { K.replay(sun.firstChild, 'pop', 600); K.fx.sparkle(1060, 100, { n: 16, spread: 120 }); K.audio.sfx('chime'); K.fx.word('sun', 1060, 230); });
      // clouds
      [[120, 90, 0.8, 90, -10], [700, 70, 0.6, 120, -70], [420, 150, 0.5, 100, -40]].forEach(([x, y, s, dur, del]) => {
        const c = K.g(`<g transform="translate(${x - 600} ${y})">${A.cloud(s)}</g>`, root, { class: 'drift', style: `animation-duration:${dur}s;animation-delay:${del}s` });
        K.tap(c, (p) => { K.fx.drops(p.x, p.y + 20, 10, '#c9e9ff'); K.fx.sparkle(p.x, p.y, { n: 6 }); K.audio.sfx('splash'); K.fx.word('cloud', p.x, p.y + 110); });
      });

      /* ---------- buildings ---------- */
      const castle = K.g(A.castle() + (K.xmasSvg ? K.xmasSvg() : ''), root);
      K.tap(castle, (p) => {
        if (p.x < 490 && p.y < 330) return visit(LOCS[2]);
        if (p.x > 710 && p.y < 330) return visit(LOCS[4]);
        if (p.y > 340 && Math.abs(p.x - 600) < 60) return visit(LOCS[3]);
        K.fx.sparkle(p.x, p.y, { n: 8 }); K.audio.sfx('sparkle'); K.fx.word('castle', p.x, p.y - 60);
      });
      // trees
      [[64, 486, 0, 0.85], [330, 478, 1, 0.75], [868, 474, 1, 0.72], [1150, 470, 0, 0.9]].forEach(([x, y, kind, s]) => {
        const t = K.g(`<g class="treeIn">${A.tree(kind, s)}</g>`, root, { transform: `translate(${x} ${y})` });
        K.tap(t, () => {
          K.replay(t.firstChild, 'shake', 700);
          K.audio.sfx('flutter');
          if (kind === 0) dropApple(x + K.rand(-30, 30), y - 110 * s, y + 10);
          else { K.fx.sparkle(x, y - 130 * s, { n: 10, colors: ['#ffd1e6', '#fff', '#ffbfdc'] }); K.fx.word('tree', x, y - 230 * s); }
        });
      });
      const bakery = K.g(A.bakery(), root, { transform: 'translate(170 505)' });
      K.tap(bakery, () => visit(LOCS[0]));
      // unicorn meadow
      K.g(`<g transform="translate(1030 500)">${A.rainbow(130, 12, 0.85)}</g>${A.fence(900, 1180, 505)}`, root);
      // garden bed
      const bed = K.g(`<ellipse cx="0" cy="0" rx="110" ry="40" fill="#c99a72"/><ellipse cx="0" cy="-4" rx="100" ry="32" fill="#b58460"/>
        ${[[-60, -6], [-25, 4], [15, -10], [55, 2], [-40, -22], [35, -26]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-34" stroke="#6cc07a" stroke-width="4"/><g class="sway" style="animation-delay:-${i * 0.4}s"><g transform="translate(0 -40)">${A.flowerHead(K.data.FLOWER_COLORS[i], 13)}</g></g></g>`).join('')}`, root, { transform: 'translate(170 690)' });
      K.tap(bed, () => visit(LOCS[1]));
      // pond
      const pond = K.g(A.pond(120, 36), root, { transform: 'translate(420 748)' });
      K.tap(pond, (p) => { K.fx.ripple(p.x, p.y); K.audio.sfx('splash'); jumpFish(p.x, p.y); });
      // gazebo
      const gz = K.g(A.gazebo(), root, { transform: 'translate(1062 772) scale(.72)' });
      K.tap(gz, () => visit(LOCS[5]));

      /* ---------- actors ---------- */
      const actorsG = K.g('', root);
      let start = S.kpos && !opts.intro ? S.kpos : { x: 600, y: 580 };
      const back = LOCS.find((l) => l.scene === opts.from);
      if (back) start = { x: back.entry[0], y: back.entry[1] };
      if (opts.from === 'unicorn') start = { x: 900, y: 600 };
      const pr = new K.Princess(actorsG, K.me(), start.x, start.y, depth(start.y));
      pr.depth = depth;
      pr.face = start.x > 600 ? -1 : 1; pr.place();
      K.makeDraggable(pr, {
        clamp: (x, y) => clampWalk(x, y),
        lift: () => { visiting++; K.voice.say(K.pick(['Wheee!', 'Up we go!', 'Flying princess!'])); },
        drop: () => { S.kpos = { x: pr.x, y: pr.y }; K.save.write(); },
        tap: () => {
          pr.stop(); pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('sparkle'); K.fx.sparkle(pr.x, pr.y - 120 * pr.s);
          if (!K.needs.enabled()) K.wait(700).then(() => visit(LOCS[4], true));
        },
      });

      const ustart = opts.from === 'unicorn' ? { x: 1010, y: 610 } : { x: 1020, y: 560 };
      const uni = new K.Unicorn(actorsG, S.unicorn, ustart.x, ustart.y, depth(ustart.y) * 0.8);
      uni.depth = (y) => depth(y) * 0.8;
      uni.face = -1; uni.place();
      const overG = K.g('', root);
      let needT = 1, needShown = '';
      const needBubble = K.g('', overG);
      K.tap(needBubble, () => { const lo = K.needs.lowest(); K.voice.say(lo.low, { pitch: 1.25 }); K.wait(1400).then(() => K.go(lo.scene)); });
      const uniBubble = K.g(`<g class="bob"><circle r="54" fill="#fff" stroke="#ffc2e2" stroke-width="6"/><g transform="scale(1.1)">${A.icons.heart}</g></g>`, overG);
      K.tap(uni.root, () => goUnicorn());
      K.tap(uniBubble, () => goUnicorn());
      async function goUnicorn() {
        uni.happy(); K.audio.sfx('neigh'); K.fx.hearts(uni.x, uni.y - 200 * uni.s, 6);
        K.fx.word(S.unicorn.name, uni.x, uni.y - 330 * uni.s);
        const my = ++visiting;
        await pr.walkTo(K.clamp(uni.x - uni.face * 110, 60, 1140), uni.y + 6);
        if (my !== visiting) return;
        await K.wait(300);
        K.go('unicorn');
      }

      // chef bunny by the bakery
      const bun = new K.Bunny(actorsG, 280, 520, 0.45);
      bun.face = 1; bun.place(); bun.z = 520;
      K.tap(bun.root, () => { bun.happy(); bun.play('a-hop', 450); K.audio.sfx('giggle'); K.fx.speech('Let’s bake!', 280, 410, { pitch: 1.5 }); });

      const actors = [pr, uni, bun];
      // the pet chosen with "follow me" in the pet palace walks along with the princess
      const myPet = K.pets.active();
      let petA = null, petWant = '';
      const petBubble = K.g('', overG);
      K.tap(petBubble, () => { K.voice.say(`${myPet.name} needs you!`); K.go('pets', { pet: myPet.id }); });
      if (myPet) {
        petA = new K.Actor(actorsG, K.clamp(start.x + 80, 60, 1140), K.clamp(start.y + 14, 490, 770), depth(start.y) * 0.6, 'pet');
        petA.depth = (y) => depth(y) * 0.6;
        petA.anim.innerHTML = A.pet(myPet.type, myPet.color);
        K.tap(petA.root, () => { petA.happy(); petA.play('a-hop', 450); K.audio.sfx('giggle'); K.fx.word(myPet.name, petA.x, petA.y - 140); K.wait(1200).then(() => K.go('pets', { pet: myPet.id })); });
        actors.push(petA);
        K.every((dt) => {
          const tx = K.clamp(pr.x + pr.face * 95, 60, 1140), ty = K.clamp(pr.y + 16, 490, 775);
          const d = K.dist(petA.x, petA.y, tx, ty);
          const moving = petA.anim.classList.contains('walk');
          if (d > (moving ? 10 : 90)) {
            const sp = 330 * dt * (petA.s / 0.45);
            petA.faceTo(tx);
            if (!moving) petA.anim.classList.add('walk');
            petA.setPos(petA.x + ((tx - petA.x) / d) * Math.min(sp, d), petA.y + ((ty - petA.y) / d) * Math.min(sp, d));
          } else if (moving) { petA.anim.classList.remove('walk'); petA.faceTo(pr.x); }
          petA.root.classList.toggle('sad', K.pets.mood(myPet) === 'sad');
          const want = myPet.hunger < 30 ? 'bowl' : myPet.fun < 25 ? 'ball' : myPet.love < 25 ? 'heart' : '';
          if (want !== petWant) { petWant = want; petBubble.innerHTML = want ? `<g class="bob"><circle r="34" fill="#fff" stroke="#ffb3c8" stroke-width="4"/><g transform="scale(.7)">${A.icons[want]}</g></g>` : ''; }
          K.place(petBubble, petA.x, petA.y - 190 * petA.s);
        });
      }
      if (opts.intro) K.wait(900).then(() => { pr.happy(); pr.play('a-jump', 700); K.wait(500).then(() => { uni.happy(); uni.play('a-hop', 450); K.audio.sfx('neigh'); }); });

      /* butterflies */
      for (let i = 0; i < 3; i++) {
        const b = K.g(`<g>${A.butterfly(['#ffb3d4', '#c9a6ff', '#9fd2ff'][i])}</g>`, root);
        const cx = [300, 760, 1000][i], cy = [400, 420, 640][i], ph = i * 2;
        let loop = 0;
        K.every((dt, now) => {
          const t = now / 1000 + ph;
          const x = cx + Math.sin(t * 0.5) * 120 + Math.sin(t * 1.3) * 30, y = cy + Math.sin(t * 0.8) * 40 - loop * 0;
          b.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.cos(t * 0.5) * 20 + loop).toFixed(0)}) scale(1.4)`);
          if (loop > 0) loop = Math.max(0, loop - dt * 720);
        });
        K.tap(b, (p) => { loop = 720; K.audio.sfx('flutter'); K.fx.sparkle(p.x, p.y, { n: 8 }); K.fx.word('butterfly', p.x, p.y - 70); K.emit('tapWord', { word: 'butterfly' }); });
      }

      /* Pip the royal owl brings missions */
      const owl = K.g(`<g class="bob"><circle cy="-50" r="62" fill="url(#gGlow)"/>${A.owl()}</g>`, root, { transform: 'translate(820 712) scale(1.05)' });
      K.tap(owl, () => { K.audio.sfx('giggle'); K.missions.open(); });
      if (!K._owlGreeted) {
        K._owlGreeted = true;
        K.wait(opts.intro ? 5200 : 2600).then(() => K.fx.speech('A mission for you!', 820, 580, { pitch: 1.6, hold: 2.6, sayText: 'Hoo hoo! I have a mission for you, princess! Tap me!' }));
      }

      /* ---------- bubbles ---------- */
      const bubbles = K.g('', root);
      const bs = 1; // phones zoom the whole kingdom instead (see the camera below)
      LOCS.forEach((l, i) => {
        const b = K.g(`<g class="bob" style="animation-delay:-${i * 0.5}s">
          <circle r="50" fill="url(#gBtn)" stroke="#fff" stroke-width="5"/>
          <g transform="scale(1)">${A.icons[l.icon]}</g>
          <g transform="translate(0 70)">${A.label(l.word, 22)}</g>
          <circle r="62" fill="#fff" opacity="0"/></g>`, bubbles, { transform: `translate(${l.bx} ${l.by}) scale(${bs})` });
        K.tap(b, () => { K.audio.sfx('pop'); visit(l); });
      });

      /* ---------- behaviours ---------- */
      function clampWalk(x, y) {
        y = K.clamp(y, 488, 770); x = K.clamp(x, 50, 1150);
        const dx = (x - 420) / 150, dy = (y - 748) / 56, r = Math.hypot(dx, dy);
        if (r < 1) { const k = 1 / Math.max(r, 0.01); x = 420 + (x - 420) * k; y = Math.min(770, 748 + (y - 748) * k); if (y > 740) y = 690; }
        return { x, y };
      }
      function walkTo(x, y) {
        visiting++;
        const p = clampWalk(x, y);
        K.fx.sparkle(p.x, p.y, { n: 5, spread: 30, size: 7 });
        pr.walkTo(p.x, p.y).then((ok) => { if (ok) { S.kpos = { x: pr.x, y: pr.y }; K.save.write(); } });
      }
      async function visit(l, skipWord) {
        const my = ++visiting;
        if (!skipWord) K.voice.say(l.word);
        await pr.walkTo(l.entry[0], l.entry[1]);
        if (my !== visiting) return;
        S.kpos = { x: l.entry[0], y: l.entry[1] }; K.save.write();
        pr.happy(); await K.wait(250);
        if (my !== visiting) return;
        K.go(l.id === 'spellbook' ? 'drive' : l.scene); // drive the car to school
      }
      function dropApple(x, y0, y1) {
        const a = K.g(`<g transform="scale(.45)">${A.icons.apple}</g>`, root);
        K.tween(600, (t) => K.place(a, x, K.lerp(y0, y1, t)), 'in').then(() => {
          K.audio.sfx('boing'); K.fx.word('apple', x, y1 - 80);
          let eaten = false;
          K.tap(a, () => { if (eaten) return; eaten = true; K.audio.sfx('munch'); K.fx.sparkle(x, y1 - 10, { n: 8, colors: ['#ff8a9e', '#fff'] }); a.remove(); K.emit('eat', { amount: 15 }); K.voice.say('Crunch! Yummy apple!'); });
          K.wait(6000).then(() => { if (!eaten && a.isConnected) K.tween(400, (t) => a.setAttribute('opacity', 1 - t)).then(() => a.remove()); });
        });
      }
      function jumpFish(x, y) {
        const f = K.g(`<g transform="scale(.45)">${A.picture('FISH')}</g>`, K.layers.fx);
        K.tween(900, (t) => K.place(f, x + 80 * t, y - Math.sin(t * Math.PI) * 120, 1, -40 + 80 * t), 'linear').then(() => { f.remove(); K.fx.ripple(x + 80, y); K.audio.sfx('splash'); });
        K.fx.word('fish', x, y - 160);
      }

      // unicorn follows the princess, grazes when idle
      let idle = 0;
      K.every((dt) => {
        const tx = K.clamp(pr.x - pr.face * 140, 60, 1140), ty = K.clamp(pr.y - 4, 490, 770);
        const d = K.dist(uni.x, uni.y, tx, ty);
        const moving = uni.root.classList.contains('trot');
        if (d > (moving ? 12 : 150)) {
          const sp = 300 * dt * (uni.s / 0.55);
          uni.faceTo(tx);
          if (!moving) { uni.root.classList.add('trot'); uni.anim.classList.add('walk'); }
          uni.setPos(uni.x + ((tx - uni.x) / d) * Math.min(sp, d), uni.y + ((ty - uni.y) / d) * Math.min(sp, d));
          idle = 0;
        } else {
          if (moving) { uni.root.classList.remove('trot'); uni.anim.classList.remove('walk'); uni.faceTo(pr.x); }
          idle += dt;
          if (idle > 6) { idle = 0; Math.random() < 0.5 ? uni.eat() : uni.play('a-hop', 450); }
        }
        K.place(uniBubble, uni.x + uni.face * 120 * uni.s, uni.y - 430 * uni.s);
        // the princess thinks about what she needs (Sims-style); tap the bubble to go take care of it
        needT += dt;
        if (needT > 0.5) {
          needT = 0;
          const lo = K.needs.enabled() ? K.needs.lowest() : null;
          const show = lo && K.needs.get(lo.id) < 30 ? lo.id : '';
          if (show !== needShown) {
            needShown = show;
            needBubble.innerHTML = show ? `<g class="bob"><circle cx="-40" cy="52" r="8" fill="#fff"/><circle cx="-24" cy="34" r="12" fill="#fff"/><circle r="52" fill="#fff" stroke="#ffb3c8" stroke-width="5"/><g transform="scale(1.05)">${A.icons[lo.icon]}</g></g>` : '';
          }
        }
        K.place(needBubble, pr.x + 90 * pr.s / 0.8, pr.y - 330 * pr.s);
        K.sortByY(actorsG, actors);
      });

      /* ---------- phone camera ----------
         Held upright, a phone is too narrow to show the whole kingdom at a good size. So the view zooms in
         and follows the princess; arrows at the edges look left and right. (Moving the stage viewBox keeps
         every tap and effect lined up, so nothing else in the scene has to change.) */
      const isTall = () => document.body.classList.contains('tall');
      if (isTall()) {
        const ZOOM = 1.8;
        let camX = null, manual = false, camT = 0, lastX = pr.x;
        const arrowArt = (dir) => `<g class="bob"><circle r="40" fill="#fff" opacity=".9" stroke="#ffb3d4" stroke-width="5"/><path d="M${dir * -8} -16 L${dir * 10} 0 L${dir * -8} 16" stroke="#ff5fa2" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><circle r="56" fill="#fff" opacity="0"/>`;
        const arrL = K.g(arrowArt(-1), root), arrR = K.g(arrowArt(1), root); // on top of the bubbles
        const dims = () => { const W = 1200 / ZOOM, H = (W * innerHeight) / innerWidth; const hud = H * (150 / innerHeight), free = Math.max(0, H - hud - 750); return { W, H, y0: Math.max(60 - hud - free * 0.35, 815 - H) }; };
        K.tap(arrL, () => { const { W } = dims(); manual = true; camT = K.clamp(camX - W * 0.65, 0, 1200 - W); K.audio.sfx('swoosh'); });
        K.tap(arrR, () => { const { W } = dims(); manual = true; camT = K.clamp(camX + W * 0.65, 0, 1200 - W); K.audio.sfx('swoosh'); });
        K.every((dt) => {
          if (!isTall()) return; // turned sideways: the normal full view takes over
          const { W, H, y0 } = dims();
          if (Math.abs(pr.x - lastX) > 0.5) manual = false; // she is walking: follow her again
          lastX = pr.x;
          if (!manual) camT = K.clamp(pr.x - W / 2, 0, 1200 - W);
          camX = camX === null ? camT : camX + (camT - camX) * Math.min(1, dt * 4);
          K.stage.setAttribute('viewBox', `${camX.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`);
          const ay = y0 + H * (150 / innerHeight) + 64; // in the open sky under the top buttons
          arrL.setAttribute('transform', `translate(${camX + 52} ${ay})`); arrL.setAttribute('display', camX > 6 ? '' : 'none');
          arrR.setAttribute('transform', `translate(${camX + W - 52} ${ay})`); arrR.setAttribute('display', camX < 1200 - W - 6 ? '' : 'none');
        });
      }
    },
    exit() {
      // put the normal view back for the other scenes
      K.stage.setAttribute('viewBox', innerWidth / innerHeight > 1.62 ? '0 64 1200 736' : '0 0 1200 800');
    },
  };
})();
