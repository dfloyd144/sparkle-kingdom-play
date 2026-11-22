/* Unicorn care: feed (counting), brush, bubble bath, play, ride across the sky, and style */
(function () {
  const A = K.art, D = K.data;
  const FOODS = { apple: { icon: 'apple', word: 'apple', plural: 'apples' }, carrot: { icon: 'carrot', word: 'carrot', plural: 'carrots' }, cookie: { icon: 'cookie', word: 'cookie', plural: 'cookies' } };

  function newNeeds() {
    const n = { food: 0, foodType: K.pick(['apple', 'carrot', 'cookie']), mud: [], messy: false, play: 0 };
    const picks = K.shuffle(['food', 'mud', 'messy', 'play']).slice(0, K.irand(2, 3));
    if (picks.includes('food')) n.food = K.irand(2, 5);
    if (picks.includes('mud')) n.mud = K.shuffle([0, 1, 2, 3]).slice(0, K.irand(2, 4));
    if (picks.includes('messy')) n.messy = true;
    if (picks.includes('play')) n.play = K.irand(2, 4);
    return n;
  }

  K.scenes.unicorn = {
    enter(root) {
      const S = K.save.data, U = S.unicorn;
      if (!U.needs) U.needs = newNeeds();
      const N = U.needs;
      if (!N.foodType) N.foodType = 'apple';
      const anyNeed = () => N.food > 0 || N.mud.length > 0 || N.messy || N.play > 0;
      if (!anyNeed() && Date.now() - (U.doneAt || 0) > 3 * 60 * 1000) { U.needs = newNeeds(); Object.assign(N, U.needs); U.needs = N; }
      K.save.write();
      const name = U.name;

      /* ---------- scenery ---------- */
      const bg = K.g(`${A.skyRect()}
        <g transform="translate(1090 100) scale(.7)">${A.sun()}</g>
        <g class="drift" style="animation-duration:100s;animation-delay:-30s"><g transform="translate(0 110)">${A.cloud(0.7)}</g></g>
        <g transform="translate(620 600)">${A.rainbow(560, 24, 0.45)}</g>
        ${A.hills(470)}${A.groundRect(478)}
        <g transform="translate(120 488) scale(.95)">
          <path d="M-90 0 V-110 L0 -170 L90 -110 V0Z" fill="#ffe0ee" stroke="#eaa3c6" stroke-width="3"/>
          <path d="M-106 -104 L0 -186 L106 -104" fill="none" stroke="#b49af0" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M-36 0 V-70 H36 V0Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><path d="M-36 -70 L36 0 M36 -70 L-36 0" stroke="#fff" stroke-width="5"/>
          <path d="${A.heart(1.4)}" transform="translate(0 -112)" fill="#ff9ec7"/></g>
        ${A.fence(250, 1220, 500)}
        <g transform="translate(1140 520)">${A.tree(1, 0.8)}</g>
        ${[[330, 560], [470, 700], [880, 540], [1010, 690], [1130, 600], [60, 620], [380, 650]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><path d="M0 0 V-24" stroke="#6cc07a" stroke-width="3"/><g transform="translate(0 -28)">${A.flowerHead(D.FLOWER_COLORS[i % 7], 10)}</g></g>`).join('')}
        <rect x="110" y="658" width="980" height="140" rx="48" fill="#fff" opacity=".55"/>`, root);

      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 170, 650, 1.0);
      const uni = new K.Unicorn(actorsG, { mane: U.mane, acc: U.acc, mud: N.mud, messy: N.messy }, 720, 612, 1.2);
      uni.face = -1; uni.place();
      const UX = uni.x, UY = uni.y, US = uni.s;
      const toWorld = (lx, ly) => ({ x: uni.x + uni.face * lx * uni.s, y: uni.y + ly * uni.s });
      const mouth = () => toWorld(162, -226);
      const refreshLook = (extra = {}) => uni.setLook(Object.assign({ mane: U.mane, acc: U.acc, mud: N.mud, messy: N.messy }, extra));

      /* ---------- heart meter ---------- */
      const meter = K.g('', root, { transform: 'translate(92 200)' });
      function drawMeter(bump) {
        meter.innerHTML = `<g class="${bump ? 'pop-in' : ''}"><path d="${A.heart(3.4)}" transform="translate(0 26)" fill="#ff8fb8" stroke="#fff" stroke-width="5"/>
          <text y="20" text-anchor="middle" font-size="46" fill="#fff" stroke="#e05c90" stroke-width="4" paint-order="stroke">${U.hearts}</text></g>
          <g transform="translate(0 92)">${A.label(name, 26)}</g>`;
      }
      drawMeter();
      K.tap(meter, () => { K.fx.hearts(92, 180, 4); K.voice.say(`${name} has ${U.hearts} love ${U.hearts === 1 ? 'heart' : 'hearts'}!`); });

      /* ---------- thought bubble ---------- */
      const thought = K.g('', root, { transform: 'translate(800 150)' });
      const trail = K.g(`<circle cx="610" cy="250" r="10" fill="#fff" opacity=".95"/><circle cx="650" cy="222" r="15" fill="#fff" opacity=".95"/><circle cx="700" cy="196" r="20" fill="#fff" opacity=".95"/>`, root);
      function needSentence() {
        if (N.food > 0) { const f = FOODS[N.foodType]; return `${name} is hungry! Can you give her ${N.food} ${N.food === 1 ? f.word : f.plural}?`; }
        if (N.mud.length) return `Oh no, ${name} is muddy! Use the bubbly sponge to wash ${N.mud.length} mud spots.`;
        if (N.messy) return `${name}'s mane is tangled. Can you brush it?`;
        if (N.play > 0) return `${name} wants to play ball! Throw the ball ${N.play} times.`;
        return `${name} is so happy! Go for a magic ride, or play together!`;
      }
      function drawThought(pop = true) {
        let inner;
        if (N.food > 0) {
          const f = FOODS[N.foodType];
          let row = '';
          for (let i = 0; i < N.food; i++) row += `<g transform="translate(${(i - (N.food - 1) / 2) * 30} 42) scale(.38)">${A.icons[f.icon]}</g>`;
          inner = `<g transform="translate(-34 -14) scale(.95)">${A.icons[f.icon]}</g><text x="34" y="10" text-anchor="middle" font-size="58" fill="#6d4a92">${N.food}</text>${row}`;
        } else if (N.mud.length) {
          let row = '';
          for (let i = 0; i < N.mud.length; i++) row += `<circle cx="${(i - (N.mud.length - 1) / 2) * 26}" cy="44" r="10" fill="#c49a78"/>`;
          inner = `<g transform="translate(-30 -12) scale(.9)">${A.icons.sponge}</g><text x="36" y="10" text-anchor="middle" font-size="58" fill="#6d4a92">${N.mud.length}</text>${row}`;
        } else if (N.messy) {
          inner = `<g transform="translate(0 -4) scale(1.2)">${A.icons.brush}</g>`;
        } else if (N.play > 0) {
          let row = '';
          for (let i = 0; i < N.play; i++) row += `<circle cx="${(i - (N.play - 1) / 2) * 26}" cy="44" r="9" fill="#9fd2ff" stroke="#fff" stroke-width="2"/>`;
          inner = `<g transform="translate(-30 -12) scale(.8)">${A.icons.ball}</g><text x="36" y="10" text-anchor="middle" font-size="58" fill="#6d4a92">${N.play}</text>${row}`;
        } else {
          inner = `<g transform="translate(0 4) scale(1.3)">${A.icons.heart}</g>${A.sparkle4(-50, -30, 10, '#ffd166')}${A.sparkle4(52, 22, 8, '#9fd2ff')}`;
        }
        thought.innerHTML = `<g class="${pop ? 'pop-in' : ''}"><g class="float"><ellipse rx="100" ry="76" fill="#fff" stroke="#f0d6ea" stroke-width="4"/>
          <circle cx="-70" cy="-40" r="32" fill="#fff"/><circle cx="64" cy="-48" r="30" fill="#fff"/><circle cx="76" cy="36" r="26" fill="#fff"/><circle cx="-76" cy="40" r="24" fill="#fff"/>
          <g transform="translate(0 -6)">${inner}</g></g></g>`;
      }
      drawThought();
      K.tap(thought, () => { K.audio.sfx('pop'); K.voice.say(needSentence()); });
      K.hint(needSentence());
      K.wait(900).then(() => K.voice.say(needSentence()));

      /* ---------- needs bookkeeping ---------- */
      async function needDone(word) {
        U.hearts++;
        K.save.write();
        uni.happy(2200);
        K.audio.sfx('fanfare');
        K.fx.hearts(uni.x - 100, uni.y - 300, 8);
        K.fx.star(uni.x - 80, uni.y - 320);
        drawMeter(true);
        // unlock accessory?
        const unlocked = D.UNI_ACC.find(([, need]) => need === U.hearts);
        await K.wait(600);
        drawThought();
        if (!anyNeed()) {
          U.doneAt = Date.now(); K.save.write();
          uni.play('a-dance', 1200);
          pr.happy(2000); pr.play('a-jump', 700);
          K.fx.confetti(60);
          K.fx.word(word || 'yay', 600, 140, { sayText: `Yay! ${name} is so happy! You are a great friend!` });
        } else {
          K.fx.word(word || 'yay', 600, 140, { sayText: `${word || 'Yay'}! ` + needSentence() });
        }
        K.hint(needSentence());
        if (unlocked && unlocked[1] > 0) {
          await K.wait(2600);
          const idx = D.UNI_ACC.indexOf(unlocked);
          U.acc[idx] = true; K.save.write(); refreshLook();
          K.fx.sparkle(uni.x - 80, uni.y - 250, { n: 30, spread: 200 });
          K.audio.sfx('sparkle');
          K.fx.word('new!', 600, 140, { sayText: `Wow! ${name} got a new ${unlocked[0]}!` });
        }
      }

      /* ---------- petting ---------- */
      let busy = false;
      K.tap(uni.root, () => {
        if (busy) return;
        uni.happy(1500); uni.play('a-hop', 450);
        K.audio.sfx('neigh');
        K.fx.hearts(uni.x - 80, uni.y - 300, 5);
        if (Math.random() < 0.35) K.fx.word(name, 600, 140);
      });
      K.makeDraggable(pr, { can: () => !busy, clamp: (x, y) => ({ x: K.clamp(x, 60, 1140), y: K.clamp(y, 560, 680) }), tap: () => { pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('giggle'); } });

      /* ---------- tool tray ---------- */
      const tray = K.g('', root);
      const tools = [['food', 'basket'], ['brush', 'brush'], ['wash', 'sponge'], ['play', 'ball'], ['ride', 'ride'], ['style', 'palette']];
      const toolBtn = {};
      tools.forEach(([id, icon], i) => {
        const x = 600 + (i - 2.5) * 152, y = 732;
        const b = K.button(tray, x, y, A.icons[icon], null, { r: 63, fill: id === 'ride' ? 'url(#gBtnGold)' : id === 'style' ? 'url(#gBtnLilac)' : 'url(#gBtn)' });
        toolBtn[id] = { b, x, y };
      });
      const popup = K.g('', root);
      const closePopup = () => { popup.innerHTML = ''; };

      /* --- food --- */
      K.tap(toolBtn.food.b, () => {
        K.audio.sfx('tap');
        if (popup.dataset.kind === 'food' && popup.childNodes.length) { closePopup(); popup.dataset.kind = ''; return; }
        closePopup(); popup.dataset.kind = 'food';
        const items = ['apple', 'carrot', 'cookie'].map((k) => ({ k, svg: `<g transform="scale(1.1)">${A.icons[FOODS[k].icon]}</g>`, word: FOODS[k].word }));
        S.treats.slice(-2).forEach((t) => items.push({ k: 'treat', svg: `<g transform="translate(0 40) scale(.5)">${A.dish(t)}</g>`, word: A.dishWord(t) }));
        K.g(`<rect x="250" y="560" width="${items.length * 104 + 20}" height="104" rx="40" fill="#fff" opacity=".85" stroke="#ffd1e8" stroke-width="4"/>`, popup);
        items.forEach((it, i) => {
          const g = K.g(`<g class="pop-in" style="animation-delay:${i * 0.05}s"><circle r="44" fill="#fff" opacity=".01"/>${it.svg}</g>`, popup);
          const hx = 312 + i * 104, hy = 612;
          K.place(g, hx, hy);
          let dragging = false;
          K.drag(g, {
            move: (p, dx, dy, moved) => { if (moved) { dragging = true; K.place(g, p.x, p.y, 1.1); } },
            end: (p) => {
              const m = mouth();
              if (dragging && K.dist(p.x, p.y, m.x, m.y) < 170) feed(it, p.x, p.y, g);
              else K.tween(250, (t) => K.place(g, K.lerp(p.x, hx, t), K.lerp(p.y, hy, t)));
              dragging = false;
            },
            tap: () => feed(it, hx, hy, null),
          });
        });
      });
      let fedCount = 0;
      async function feed(it, x, y, dragged) {
        if (busy) return;
        busy = true;
        K.fx.word(it.word, 600, 140, { hold: 1.2 });
        const m = mouth();
        const f = dragged ? dragged : K.g(`<g>${it.svg}</g>`, K.layers.fx);
        if (dragged) { dragged.remove(); K.layers.fx.appendChild(f); }
        await K.tween(550, (t) => K.place(f, K.lerp(x, m.x, t), K.lerp(y, m.y, t) - Math.sin(t * Math.PI) * 120, 1 - t * 0.5), 'inOut');
        f.remove();
        if (dragged) drawFoodBack();
        uni.eat(); K.audio.sfx("munch"); K.emit("unicorn", { act: "feed" });
        K.fx.sparkle(m.x, m.y, { n: 8, spread: 50, colors: ['#ffe0b3', '#ffc2e2', '#fff'] });
        await K.wait(500);
        if (N.food > 0) {
          fedCount++;
          N.food--; K.save.write();
          K.fx.number(fedCount, m.x - 60, m.y - 140);
          drawThought(false);
          if (N.food === 0) { fedCount = 0; await K.wait(700); needDone('yum'); }
        } else {
          uni.happy(); K.fx.hearts(m.x, m.y - 40, 4); K.audio.sfx('neigh');
        }
        busy = false;
      }
      function drawFoodBack() { if (popup.dataset.kind === 'food') { closePopup(); popup.dataset.kind = ''; } }

      /* --- brush & sponge (drag over the unicorn, or tap for automatic) --- */
      function overUnicorn(p) {
        const lx = (p.x - uni.x) / (uni.s * uni.face), ly = (p.y - uni.y) / uni.s;
        return lx > -150 && lx < 190 && ly > -340 && ly < -60;
      }
      let brushAmt = 0, lastBrushSfx = 0;
      const scrub = {};
      function brushAt(p, d) {
        if (!overUnicorn(p)) return;
        brushAmt += d;
        if (performance.now() - lastBrushSfx > 160) { K.audio.sfx('brush'); lastBrushSfx = performance.now(); K.fx.sparkle(p.x, p.y, { n: 2, spread: 40, size: 8 }); }
        if (brushAmt > 1400) {
          brushAmt = -99999;
          if (N.messy) {
            N.messy = false; K.save.write();
            const tg = uni.root.querySelector('.tangles'); if (tg) tg.setAttribute('opacity', 0);
            K.fx.sparkle(uni.x - 60, uni.y - 280, { n: 26, spread: 160 });
            needDone('shiny');
          } else {
            uni.happy(); K.fx.sparkle(uni.x - 60, uni.y - 280, { n: 18, spread: 140 }); K.audio.sfx('sparkle'); K.fx.word('soft', 600, 140, { sayText: 'So soft and sparkly!' });
          }
          K.wait(1500).then(() => { brushAmt = 0; });
        }
      }
      let mudCount = 0;
      function spongeAt(p, d) {
        if (!overUnicorn(p)) return;
        if (Math.random() < 0.25) K.fx.bubbles(p.x, p.y, 1, 20);
        if (performance.now() - lastBrushSfx > 200) { K.audio.sfx('bubble'); lastBrushSfx = performance.now(); }
        N.mud.forEach((i) => {
          const [mx, my] = A.MUD[i];
          const w = toWorld(mx, my);
          if (K.dist(p.x, p.y, w.x, w.y) < 75) {
            scrub[i] = (scrub[i] || 0) + d;
            if (scrub[i] > 260) cleanSpot(i);
          }
        });
      }
      async function cleanSpot(i) {
        if (!N.mud.includes(i)) return;
        N.mud = N.mud.filter((j) => j !== i); K.save.write();
        const spot = uni.root.querySelector(`.mud g[data-i="${i}"]`);
        if (spot) spot.setAttribute('opacity', 0);
        const w = toWorld(A.MUD[i][0], A.MUD[i][1]);
        K.fx.bubbles(w.x, w.y, 10, 40); K.audio.sfx('pop');
        mudCount++;
        K.fx.number(mudCount, w.x, w.y - 110);
        drawThought(false);
        if (!N.mud.length) {
          mudCount = 0;
          await K.wait(600);
          // rinse!
          const cloud = K.g(`<g transform="scale(.7)">${A.cloud(1)}</g>`, K.layers.fx);
          K.place(cloud, uni.x - 70, uni.y - 430);
          for (let k = 0; k < 10; k++) { K.wait(k * 120).then(() => { K.fx.drops(uni.x - 70 + K.rand(-80, 80), uni.y - 400, 3); }); }
          K.audio.sfx('splash');
          await K.wait(1300);
          cloud.remove();
          uni.play('a-shake', 700); K.fx.drops(uni.x - 60, uni.y - 200, 14);
          await K.wait(700);
          needDone('clean');
        }
      }
      function makeHeldTool(id, icon, handler) {
        const t = toolBtn[id];
        let sprite = null, prev = null;
        K.drag(t.b, {
          start: (p) => { if (busy) return false; closePopup(); sprite = K.g(`<g transform="scale(1.5)">${A.icons[icon]}</g>`, K.layers.fx); K.place(sprite, p.x, p.y); prev = p; },
          move: (p) => { if (!sprite) return; K.place(sprite, p.x, p.y - 20); handler(p, K.dist(p.x, p.y, prev.x, prev.y)); prev = p; },
          end: () => { if (sprite) { K.emit("unicorn", { act: id }); const s = sprite; K.tween(250, (k) => K.place(s, K.lerp(prev.x, t.x, k), K.lerp(prev.y, t.y, k), 1 - k * 0.5)).then(() => s.remove()); } sprite = null; },
          tap: async () => {
            if (sprite) sprite.remove(); sprite = null;
            if (busy) return;
            K.audio.sfx('tap');
            busy = true;
            const s = K.g(`<g transform="scale(1.5)">${A.icons[icon]}</g>`, K.layers.fx);
            let pts;
            if (id === 'wash' && N.mud.length) pts = N.mud.map((i) => toWorld(A.MUD[i][0], A.MUD[i][1]));
            else if (id === 'wash') pts = [toWorld(-40, -150), toWorld(40, -130)];
            else pts = [toWorld(96, -296), toWorld(30, -170), toWorld(90, -290), toWorld(34, -176), toWorld(-110, -150), toWorld(-130, -100)];
            let last = { x: t.x, y: t.y };
            for (const pt of pts) {
              const from = last;
              await K.tween(id === 'wash' ? 260 : 380, (k) => {
                const q = { x: K.lerp(from.x, pt.x, k) + (id === 'wash' ? Math.sin(k * 20) * 18 : 0), y: K.lerp(from.y, pt.y, k) };
                K.place(s, q.x, q.y - 20);
                handler(q, id === 'wash' ? 40 : 90);
              });
              if (id === 'wash') { for (let r = 0; r < 8; r++) { await K.wait(40); handler({ x: pt.x + K.rand(-20, 20), y: pt.y }, 45); } }
              last = pt;
            }
            s.remove(); K.emit("unicorn", { act: id });
            busy = false;
          },
        });
      }
      makeHeldTool('brush', 'brush', brushAt);
      makeHeldTool('wash', 'sponge', spongeAt);

      /* --- play ball --- */
      let throws = 0;
      K.tap(toolBtn.play.b, async () => {
        if (busy) return;
        busy = true; closePopup();
        K.audio.sfx('tap');
        pr.play('a-hop', 450);
        const ball = K.g(`<g transform="scale(.9)">${A.icons.ball}</g>`, K.layers.fx);
        const sx = pr.x + 40, sy = pr.y - 120, top = toWorld(130, -420);
        K.audio.sfx('swoosh');
        const up = K.tween(700, (t) => K.place(ball, K.lerp(sx, top.x, t), K.lerp(sy, top.y, t) - Math.sin(t * Math.PI) * 160, 1, t * 360), 'out');
        await K.wait(250);
        uni.play('a-jump', 700);
        await up;
        K.audio.sfx('boing'); K.fx.sparkle(top.x, top.y, { n: 12 });
        await K.tween(700, (t) => K.place(ball, K.lerp(top.x, 380, t), K.lerp(top.y, 640, t) - Math.sin(t * Math.PI) * 200, 1, 360 + t * 360), 'inOut');
        K.audio.sfx('boing');
        await K.tween(300, (t) => ball.setAttribute('opacity', 1 - t));
        ball.remove();
        uni.happy(); K.emit("unicorn", { act: "play" });
        if (N.play > 0) {
          throws++;
          N.play--; K.save.write();
          K.fx.number(throws, 600, 150);
          drawThought(false);
          if (N.play === 0) { throws = 0; await K.wait(600); needDone('fun'); }
        } else { K.fx.hearts(uni.x - 80, uni.y - 300, 4); K.audio.sfx('neigh'); }
        busy = false;
      });

      /* --- magic ride across the sky --- */
      K.tap(toolBtn.ride.b, async () => {
        if (busy) return;
        busy = true; closePopup();
        K.audio.sfx('tap');
        K.voice.say(`Hop on! Let's fly, ${name}!`);
        const saddle = toWorld(0, -150);
        await pr.walkTo(saddle.x - 120, pr.y);
        // hop on
        const sx = pr.x, sy = pr.y;
        await K.tween(450, (t) => { pr.setPos(K.lerp(sx, saddle.x, t), K.lerp(sy, saddle.y, t) - Math.sin(t * Math.PI) * 90); pr.s = K.lerp(1, 0.85, t); pr.place(); });
        actorsG.appendChild(pr.root);
        pr.face = uni.face; pr.place(); pr.happy(6000);
        if (!U.acc[4]) refreshLook({ acc: U.acc.map((a, i) => (i === 4 ? true : a)) });
        uni.root.classList.add('fly'); uni.happy(6000);
        K.audio.sfx('swoosh'); K.audio.sfx('neigh');
        const pts = [[UX, UY], [480, 470], [330, 260], [560, 150], [880, 170], [1020, 330], [900, 520], [UX, UY]];
        const cr = (p0, p1, p2, p3, t) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
        let lastTrail = 0;
        const cols = ['#ff9ec7', '#ffc28a', '#fff08a', '#a6eec0', '#9fd2ff', '#c9a6ff'];
        await K.tween(5200, (t) => {
          const seg = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1)));
          const lt = t * (pts.length - 1) - seg;
          const P = (i) => pts[K.clamp(i, 0, pts.length - 1)];
          const x = cr(P(seg - 1)[0], P(seg)[0], P(seg + 1)[0], P(seg + 2)[0], lt);
          const y = cr(P(seg - 1)[1], P(seg)[1], P(seg + 1)[1], P(seg + 2)[1], lt);
          const prevX = uni.x;
          const sc = US * (1 - Math.sin(t * Math.PI) * 0.35);
          uni.x = x; uni.y = y; uni.s = sc;
          if (Math.abs(x - prevX) > 0.5) uni.face = x < prevX ? -1 : 1;
          uni.place();
          const back = toWorld(0, -150);
          pr.x = back.x; pr.y = back.y; pr.s = sc * 0.71; pr.face = uni.face; pr.place();
          if (performance.now() - lastTrail > 45) {
            lastTrail = performance.now();
            const tail = toWorld(-110, -120);
            cols.forEach((c, i) => {
              const e = K.el('circle', { cx: tail.x, cy: tail.y + (i - 2.5) * 9 * sc, r: 7 * sc, fill: c }, K.layers.fx);
              K.tween(900, (k) => { e.setAttribute('opacity', 1 - k); }).then(() => e.remove());
            });
            if (Math.random() < 0.3) K.fx.sparkle(tail.x, tail.y, { n: 2, spread: 30 });
          }
        }, 'inOut');
        uni.face = -1; uni.x = UX; uni.y = UY; uni.s = US; uni.place();
        uni.root.classList.remove('fly');
        if (!U.acc[4]) refreshLook();
        // hop off
        const from = { x: pr.x, y: pr.y };
        await K.tween(450, (t) => { pr.x = K.lerp(from.x, 330, t); pr.y = K.lerp(from.y, 650, t) - Math.sin(t * Math.PI) * 80; pr.s = K.lerp(0.85, 1, t); pr.face = -1; pr.place(); });
        actorsG.insertBefore(pr.root, uni.root);
        K.audio.sfx('sparkle'); pr.play('a-jump', 700);
        K.fx.sparkle(330, 600, { n: 14 });
        await pr.walkTo(170, 650);
        pr.face = 1; pr.place(); K.emit("unicorn", { act: "ride" });
        if (N.play > 0) {
          N.play--; K.save.write(); drawThought(false);
          if (N.play === 0) { busy = false; return needDone('wow'); }
        }
        K.fx.word("wow", 600, 140, { sayText: 'Wow! What a magical ride!' });
        busy = false;
      });

      /* --- style panel --- */
      K.tap(toolBtn.style.b, () => {
        K.audio.sfx('tap');
        if (busy) return;
        closePopup(); popup.dataset.kind = 'style';
        const shade = K.g('<rect x="-900" y="-700" width="3000" height="2400" fill="#6d4a92" opacity=".2"/>', popup);
        K.tap(shade, () => closePopup());
        const panel = K.g(`<rect x="150" y="508" width="900" height="288" rx="46" fill="#fff" stroke="#ffd1e8" stroke-width="6"/>`, popup);
        K.tap(panel, () => {});
        panel.classList.add('pop-in');
        // manes
        D.MANES.forEach((m, i) => {
          const x = 600 + (i - (D.MANES.length - 1) / 2) * 120, y = 588;
          const lockedMane = m.reward && !(K.save.data.sleep && K.save.data.sleep.starlight);
          const shopLocked = K.shop.isLocked('mane', i);
          const stripes = m.c.map((c, j) => `<rect x="-40" y="${-40 + j * 13.4}" width="80" height="14" fill="${c}"/>`).join('');
          const g = K.g(`<clipPath id="mc${i}"><circle r="40"/></clipPath><g clip-path="url(#mc${i})">${stripes}</g><circle r="40" fill="none" stroke="${U.mane === i ? '#ff6fae' : '#fff'}" stroke-width="${U.mane === i ? 7 : 4}"/>${K.shop.badge('mane', i, 40)}${lockedMane ? `<circle r="40" fill="#fff" opacity=".55"/><g transform="scale(.75)">${A.icons.moon}</g>` : ''}`, panel, { transform: `translate(${x} ${y})` });
          K.tap(g, () => {
            if (shopLocked) { closePopup(); return K.shop.ask('mane', i, () => K.scenes.unicorn._reopenStyle()); }
            if (lockedMane) { K.audio.sfx('boing'); K.voice.say(`Sleep in your own bed for 7 nights to unlock the starlight mane! Check the moon chart in the bedroom.`); return; }
            U.mane = i; K.save.write(); K.emit("unicorn", { act: "style" }); refreshLook();
            uni.happy(); uni.play('a-hop', 450); K.audio.sfx('sparkle'); K.audio.sfx('neigh');
            K.fx.sparkle(uni.x - 60, uni.y - 290, { n: 20, spread: 140 });
            K.fx.word(m.name, 600, 140, { first: m.c[2] });
            closePopup(); K.scenes.unicorn._reopenStyle();
          });
        });
        // accessories
        const accIcons = ['bow', 'necklace', 'flowers', 'blanket', 'wings'];
        const accArt = {
          bow: `<path d="M0 0 L-24 -16 Q-30 0 -24 16Z M0 0 L24 -16 Q30 0 24 16Z" fill="#ff8fb8" stroke="#e05c90" stroke-width="3"/><circle r="7" fill="#ff7fb2"/>`,
          necklace: `<path d="M-26 -16 Q0 16 26 -16" stroke="url(#gGold)" stroke-width="5" fill="none"/><path d="${A.star(13)}" transform="translate(0 10)" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>`,
          flowers: `${[-20, 0, 20].map((x, j) => `<g transform="translate(${x} ${j === 1 ? -8 : 0})">${A.flowerHead(['#ff9ec7', '#fff08a', '#c9a6ff'][j], 10, false)}</g>`).join('')}`,
          blanket: `<path d="M-28 -14 Q0 -24 28 -14 L26 14${A.scallop(26, -26, 14, 4, 8)}Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/><path d="${A.heart(0.7)}" transform="translate(0 2)" fill="#fff"/>`,
          wings: `<ellipse cx="-6" cy="-6" rx="30" ry="14" transform="rotate(-30)" fill="#fff" stroke="#d9c9fb" stroke-width="3"/><ellipse cx="-2" cy="6" rx="22" ry="10" transform="rotate(-15)" fill="#ffe6f3" stroke="#f5cde2" stroke-width="2"/>`,
        };
        D.UNI_ACC.forEach(([nm, need], i) => {
          const x = 600 + (i - 2) * 134, y = 718;
          const locked = U.hearts < need;
          const on = U.acc[i];
          const g = K.g(`<circle r="44" fill="${on ? '#ffe6f3' : '#f6f0ff'}" stroke="${on ? '#ff6fae' : '#e8dcf8'}" stroke-width="${on ? 7 : 4}"/>
            <g opacity="${locked ? 0.3 : 1}">${accArt[accIcons[i]]}</g>
            ${locked ? `<g transform="translate(0 -6)">${A.icons.lock}</g><g transform="translate(26 30)"><path d="${A.heart(1.2)}" transform="translate(0 6)" fill="#ff8fb8"/><text y="9" text-anchor="middle" font-size="16" fill="#fff">${need}</text></g>` : ''}`, panel, { transform: `translate(${x} ${y})` });
          K.tap(g, () => {
            if (locked) { K.audio.sfx('boing'); K.voice.say(`Get ${need} love hearts to unlock the ${nm}! You have ${U.hearts}.`); return; }
            U.acc[i] = !U.acc[i]; K.save.write(); refreshLook();
            K.audio.sfx(U.acc[i] ? 'sparkle' : 'pop'); uni.happy();
            if (U.acc[i]) { K.fx.sparkle(uni.x - 60, uni.y - 280, { n: 16, spread: 140 }); K.fx.word(nm, 600, 140); }
            closePopup(); K.scenes.unicorn._reopenStyle();
          });
        });
        const close = K.button(popup, 1040, 522, `<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>`, () => closePopup(), { r: 34 });
        close.inner.classList.add('pop-in');
      });
      K.scenes.unicorn._reopenStyle = () => toolBtn.style.b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }));
    },
  };
})();
