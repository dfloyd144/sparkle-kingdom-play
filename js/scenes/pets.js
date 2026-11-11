/* Pet Palace: adopt pets (cat, dog, bunny, dragon, lizard, hamster, fox, penguin, pony, horse, zebra, lion, tiger), name them by reading,
   and take care of them: feed (with counting), play, cuddle. Pick which pet follows you in the kingdom. */
(function () {
  const A = K.art, I = A.icons, D = K.data;
  const FOOD_ART = {
    fish: '<path d="M-22 0 Q-6 -16 12 0 Q-6 16 -22 0Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="2.5"/><path d="M10 0 L24 -10 L22 0 L24 10Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="2.5"/><circle cx="-12" cy="-3" r="2.5" fill="#3a2a44"/>',
    bone: '<path d="M-16 -4 H16 M-16 4 H16" stroke="#fff4e0" stroke-width="10"/><circle cx="-18" cy="-6" r="7" fill="#fff4e0" stroke="#e6c89a" stroke-width="2"/><circle cx="-18" cy="6" r="7" fill="#fff4e0" stroke="#e6c89a" stroke-width="2"/><circle cx="18" cy="-6" r="7" fill="#fff4e0" stroke="#e6c89a" stroke-width="2"/><circle cx="18" cy="6" r="7" fill="#fff4e0" stroke="#e6c89a" stroke-width="2"/>',
    carrot: `<g transform="scale(.6)">${I.carrot}</g>`,
    berry: '<circle cx="-6" cy="2" r="9" fill="#c94d8a"/><circle cx="7" cy="0" r="9" fill="#b23f7a"/><circle cx="0" cy="-9" r="8" fill="#d6589a"/><path d="M0 -16 q4 -6 10 -6" stroke="#5fb86f" stroke-width="3" fill="none"/>',
    bug: '<ellipse rx="12" ry="9" fill="#ff6b6b"/><path d="M0 -9 V9" stroke="#3a2a44" stroke-width="2"/><circle cx="-5" cy="-2" r="2.5" fill="#3a2a44"/><circle cx="5" cy="3" r="2.5" fill="#3a2a44"/><circle cx="12" cy="-2" r="5" fill="#3a2a44"/>',
    seed: '<ellipse cx="-6" rx="6" ry="10" fill="#e9c88a" stroke="#c99a62" stroke-width="2" transform="rotate(-20)"/><ellipse cx="7" cy="2" rx="6" ry="10" fill="#e9c88a" stroke="#c99a62" stroke-width="2" transform="rotate(20)"/>',
  };
  FOOD_ART.apple = '<circle cx="-5" cy="2" r="12" fill="#ff6b6b"/><circle cx="5" cy="2" r="12" fill="#ff6b6b"/><path d="M0 -10 q1 -6 4 -9" stroke="#8a5a3a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="7" cy="-13" rx="6" ry="3" fill="#6cc46c" transform="rotate(-20 7 -13)"/><ellipse cx="-6" cy="-3" rx="3" ry="5" fill="#fff" opacity=".5"/>';
  FOOD_ART.worm = '<path d="M-20 4 Q-12 -10 -4 4 T12 4 T24 -2" stroke="#ff9ec7" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="24" cy="-3" r="2" fill="#3a2a44"/>';
  FOOD_ART.bamboo = '<rect x="-6" y="-24" width="12" height="48" rx="5" fill="#8fd88f" stroke="#5aa85a" stroke-width="2.5"/><path d="M-6 -6 H6 M-6 10 H6" stroke="#5aa85a" stroke-width="2.5"/><path d="M6 -14 Q22 -22 24 -12 Q14 -10 6 -14Z" fill="#6cc46c"/>';
  FOOD_ART.leaf = '<path d="M-20 14 Q-22 -16 18 -18 Q20 14 -20 14Z" fill="#6cc46c" stroke="#4a9a4a" stroke-width="2.5"/><path d="M-16 10 L14 -14" stroke="#4a9a4a" stroke-width="2"/>';
  FOOD_ART.shrimp = '<path d="M14 -10 Q-10 -20 -18 0 Q-14 16 4 12" stroke="#ff8f8f" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M4 12 L-2 20 M4 12 L10 20" stroke="#ff8f8f" stroke-width="4" stroke-linecap="round"/><circle cx="12" cy="-12" r="2" fill="#3a2a44"/>';
  FOOD_ART.flower = '<g transform="scale(.9)">' + A.flowerHead('#ff9ec7', 12, false) + '</g>';
  FOOD_ART.meat = '<ellipse cx="-4" cy="0" rx="15" ry="12" fill="#d9776a" stroke="#b05a50" stroke-width="2.5"/><path d="M8 4 L22 12" stroke="#fff4e0" stroke-width="7" stroke-linecap="round"/><circle cx="24" cy="10" r="5" fill="#fff4e0"/><circle cx="22" cy="16" r="5" fill="#fff4e0"/>';
  const FOOD_WORDS = { fish: 'fish', bone: 'bone', carrot: 'carrot', berry: 'berries', bug: 'bug', seed: 'seeds', apple: 'apple', meat: 'meat', worm: 'worm', bamboo: 'bamboo', leaf: 'leaf', shrimp: 'shrimp', flower: 'flower' };

  K.scenes.pets = {
    enter(root, opts = {}) {
      const S = K.save.data, P = K.pets;
      let selected = P.get(opts.pet) || P.active() || P.list()[0] || null;
      let busy = false;

      /* ---------- the pet yard ---------- */
      K.g(`${A.skyRect()}<g transform="translate(1080 100) scale(.6)">${A.sun()}</g>
        <g class="drift" style="animation-duration:90s"><g transform="translate(0 110)">${A.cloud(0.6)}</g></g>
        ${A.hills(430)}${A.groundRect(450)}
        <g transform="translate(140 470)"><path d="M-90 0 V-110 L0 -170 L90 -110 V0Z" fill="#ffe6c9" stroke="#e6b98a" stroke-width="3"/>
          <path d="M-104 -104 L0 -186 L104 -104" fill="none" stroke="#ff9ec7" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M-34 0 V-60 A34 34 0 0 1 34 -60 V0Z" fill="#c9a07a"/><g transform="translate(0 -122) scale(.7)">${I.paw}</g></g>
        <g transform="translate(1080 470)"><path d="M-70 0 V-90 L0 -140 L70 -90 V0Z" fill="#dff4ff" stroke="#9fcdea" stroke-width="3"/>
          <path d="M-84 -86 L0 -152 L84 -86" fill="none" stroke="#c9a6ff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M-28 0 V-48 A28 28 0 0 1 28 -48 V0Z" fill="#9a7fe0"/><path d="${A.heart(1.2)}" transform="translate(0 -96)" fill="#ff8fb8"/></g>
        ${A.fence(240, 960, 480)}
        <ellipse cx="600" cy="640" rx="430" ry="90" fill="#c6efc0" opacity=".7"/>
        ${[[300, 700], [900, 710], [520, 760], [720, 560]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${A.flowerHead(D.FLOWER_COLORS[i], 9, false)}</g>`).join('')}`, root);

      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 170, 690, 0.8);
      K.makeDraggable(pr, { can: () => !busy, clamp: (x, y) => ({ x: K.clamp(x, 80, 1120), y: K.clamp(y, 560, 760) }), tap: () => { pr.happy(); pr.play('a-hop', 450); K.audio.sfx('giggle'); } });

      // each owned pet wanders around the yard
      const actors = new Map();
      function petActor(p, x, y) {
        const a = new K.Actor(actorsG, x, y, P.list().length > 8 ? 0.75 : 0.95, 'pet');
        a.anim.innerHTML = A.pet(p.type, p.color);
        a.pet = p;
        K.tap(a.root, () => select(p, true));
        actors.set(p.id, a);
        return a;
      }
      P.list().forEach((p, i) => petActor(p, 300 + ((i * 233) % 800), 560 + ((i * 97) % 90)));
      let wanderT = 0;
      K.every((dt) => {
        wanderT += dt;
        actors.forEach((a) => a.root.classList.toggle('sad', P.mood(a.pet) === 'sad'));
        if (wanderT > 2.5 && !busy) {
          wanderT = 0;
          const list = [...actors.values()].filter((a) => !selected || a.pet.id !== selected.id);
          const a = K.pick(list);
          if (a) a.walkTo(K.rand(280, 1100), K.rand(560, 650), 140);
        }
        K.sortByY(actorsG, [pr, ...actors.values()]);
      });

      /* ---------- selected pet: name + needs ---------- */
      const info = K.g('', root);
      const ring = K.g('', actorsG.parentNode.insertBefore(K.el('g'), actorsG));
      function drawInfo() {
        info.innerHTML = ''; ring.innerHTML = '';
        if (!selected) return;
        const bars = [['hunger', FOOD_ART[P.TYPES[selected.type].food], 'food'], ['fun', I.ball, 'play'], ['love', I.heart, 'love']];
        K.g(`<rect x="330" y="80" width="540" height="96" rx="40" fill="#fff" opacity=".9" stroke="#ffd1e8" stroke-width="5"/>
          <text x="600" y="124" text-anchor="middle" font-size="40" fill="#6d4a92"><tspan fill="#ff5fa2">${selected.name[0]}</tspan>${selected.name.slice(1)}</text>
          ${bars.map(([k, ic], i) => { const v = Math.round(selected[k]); const col = v >= 50 ? '#5fc48a' : v >= 25 ? '#ffb84d' : '#ff6f91'; const x = 392 + i * 160; return `<g transform="translate(${x} 152)"><g transform="scale(.5)">${ic}</g><rect x="22" y="-7" width="90" height="14" rx="7" fill="#efe6fb"/><rect x="22" y="-7" width="${Math.max(8, v * 0.9)}" height="14" rx="7" fill="${col}"/></g>`; }).join('')}`, info);
        const a = actors.get(selected.id);
        if (a) ring.innerHTML = `<ellipse cx="${a.x}" cy="${a.y + 4}" rx="70" ry="16" fill="#fff6b0" opacity=".8" stroke="#ffd166" stroke-width="4"/>`;
        const isActive = S.petActive === selected.id;
        followBtn.inner.querySelector('.ring').setAttribute('fill', isActive ? 'url(#gBtnGold)' : 'url(#gBtnLilac)');
      }
      function select(p, speak) {
        if (busy) return;
        selected = p;
        const a = actors.get(p.id);
        a.happy(1200); a.play('a-hop', 450); K.audio.sfx('pop');
        if (speak) {
          const need = P.mood(p) === 'happy' ? '' : p.hunger < p.fun && p.hunger < p.love ? ` ${p.name} is hungry!` : p.fun < p.love ? ` ${p.name} wants to play!` : ` ${p.name} wants a cuddle!`;
          K.voice.say(`${p.name} the ${P.TYPES[p.type].word}!${need}`);
        }
        drawInfo();
      }
      K.every(() => { if (selected && Math.random() < 0.02) drawInfo(); });

      /* ---------- care tray ---------- */
      const tray = K.g('<rect x="110" y="664" width="980" height="136" rx="48" fill="#fff" opacity=".8"/>', root);
      const feedBtn = K.button(tray, 260, 732, `<g transform="scale(1.1)">${I.bowl}</g>`, () => feed(), { r: 60, label: 'feed' });
      const playBtn = K.button(tray, 430, 732, I.ball, () => play(), { r: 60, label: 'play' });
      const hugBtn = K.button(tray, 600, 732, I.hug, () => cuddle(), { r: 60, label: 'cuddle' });
      const followBtn = K.button(tray, 770, 732, I.leash, () => follow(), { r: 60, fill: 'url(#gBtnLilac)', label: 'follow me' });
      const adoptBtn = K.button(tray, 940, 732, `<g transform="scale(1.1)">${I.paw}</g><circle cx="26" cy="-26" r="14" fill="#5fc48a" stroke="#fff" stroke-width="3"/><path d="M26 -34 V-18 M18 -26 H34" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`, () => openAdopt(), { r: 60, fill: 'url(#gBtnGold)', label: 'new pet' });
      void feedBtn; void playBtn; void hugBtn; void adoptBtn;

      function needPet() {
        if (selected) return true;
        K.voice.say('Adopt a pet first! Tap the paw.');
        adoptBtn.inner.classList.add('bob');
        return false;
      }
      let fedCount = 0;
      // pet supplies cost stars: each feed uses one food, each play wears out one toy
      const SUP = P.SUPPLY;
      Object.values(SUP).forEach((u) => { if (typeof S[u.key] !== 'number') S[u.key] = u.start; });
      const badges = { food: K.g('', tray), toys: K.g('', tray) };
      function drawSupply(kind) {
        const u = SUP[kind], n = S[u.key], col = n === 0 ? '#ff6f91' : n <= 2 ? '#ffb84d' : '#5fc48a', btn = kind === 'food' ? feedBtn : playBtn;
        badges[kind].innerHTML = `<g transform="translate(${kind === 'food' ? 306 : 476} 690)"><circle r="22" fill="${col}" stroke="#fff" stroke-width="4"/><text y="9" text-anchor="middle" font-size="26" fill="#fff">${n}</text></g>`;
        btn.inner.classList.toggle('bob', n === 0);
      }
      const drawFood = () => drawSupply('food'), drawToys = () => drawSupply('toys');
      drawFood(); drawToys();
      function buySupply(kind) {
        const u = SUP[kind];
        const pic = kind === 'food' ? `<g transform="translate(0 20) scale(2.2)">${FOOD_ART[P.TYPES[selected.type].food]}</g>` : `<g transform="translate(-28 30) scale(1.1)">${I.ball}</g><g transform="translate(34 -10) scale(.9) rotate(20)">${I.ball}</g>`;
        panel();
        const enough = S.stars >= u.price;
        K.g(`<text x="600" y="160" text-anchor="middle" font-size="48" fill="#6d4a92">${u.word}</text>
          <g transform="translate(470 380)"><path d="M-70 -90 H70 L84 110 H-84Z" fill="${kind === 'food' ? '#ffe6c9' : '#e6f4ff'}" stroke="#e6b98a" stroke-width="5" stroke-linejoin="round"/><rect x="-74" y="-104" width="148" height="24" rx="10" fill="#ff9ec7"/>${pic}</g>
          <text x="700" y="330" font-size="90" fill="#6d4a92">${u.pack}</text>
          <g transform="translate(720 420)"><path d="${A.star(30)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3"/><text x="44" y="16" font-size="56" fill="#c27a12">${u.price}</text></g>
          ${enough ? '' : `<text x="600" y="560" text-anchor="middle" font-size="34" fill="#a48bc4">you have ${S.stars} stars</text>`}`, pop);
        const out = kind === 'food' ? 'Out of pet food!' : `${selected.name}'s toys are all worn out!`;
        if (enough) {
          K.button(pop, 600, 650, A.icons.check, () => {
            S.stars -= u.price; S[u.key] += u.pack; K.save.write(); K.updateStars(true);
            pop.innerHTML = ''; drawSupply(kind);
            K.audio.sfx('chime'); K.fx.sparkle(kind === 'food' ? 260 : 430, 690, { n: 14 });
            K.voice.say(`You bought ${u.pack} ${u.word}! Now ${kind === 'food' ? 'feed' : 'play with'} ${selected.name}.`);
          }, { r: 62, fill: '#a6eec0' });
          K.voice.say(`${out} Buy ${u.pack} ${u.word} for ${u.price} stars?`);
        } else {
          K.button(pop, 600, 650, A.icons.book, () => { pop.innerHTML = ''; K.go('spellbook'); }, { r: 62, fill: 'url(#gBtnGold)', label: 'earn stars' });
          K.voice.say(`${out} They cost ${u.price} stars, and you have ${S.stars}. Earn stars at the royal school!`);
        }
      }
      async function feed() {
        if (busy || !needPet()) return;
        if (S.petFood <= 0) return buySupply('food');
        busy = true;
        S.petFood--; drawFood();
        const a = actors.get(selected.id), food = P.TYPES[selected.type].food;
        const f = K.g(`<g transform="scale(1.4)">${FOOD_ART[food]}</g>`, K.layers.fx);
        await K.tween(500, (t) => K.place(f, K.lerp(pr.x + 40, a.x + 30 * a.face, t), K.lerp(pr.y - 100, a.y - 60, t) - Math.sin(t * Math.PI) * 100));
        f.remove();
        K.replay(a.anim, 'a-hop', 450); K.audio.sfx('munch');
        K.fx.sparkle(a.x, a.y - 60, { n: 6, spread: 40 });
        selected.hunger = Math.min(100, selected.hunger + 20);
        fedCount++;
        K.fx.number(fedCount, a.x, a.y - 150, { sayText: fedCount === 1 ? `one ${FOOD_WORDS[food]}` : `${D.NUM_WORDS[fedCount] || fedCount}` });
        if (selected.hunger >= 100) { a.happy(1500); K.wait(700).then(() => K.voice.say(`${selected.name} is full! Yummy!`)); fedCount = 0; }
        K.emit('pet', { act: 'feed' });
        K.save.write(); drawInfo();
        busy = false;
      }
      async function play() {
        if (busy || !needPet()) return;
        if (S.petToys <= 0) return buySupply('toys');
        busy = true;
        S.petToys--; drawToys();
        const a = actors.get(selected.id);
        const ball = K.g(`<g transform="scale(.7)">${I.ball}</g>`, K.layers.fx);
        const tx = K.clamp(a.x + K.pick([-260, 260]), 300, 1050), ty = K.rand(590, 720);
        K.audio.sfx('swoosh');
        const throwP = K.tween(800, (t) => K.place(ball, K.lerp(pr.x + 40, tx, t), K.lerp(pr.y - 110, ty - 20, t) - Math.sin(t * Math.PI) * 180, 1, t * 540), 'out');
        await K.wait(250);
        a.play('a-jump', 700);
        await a.walkTo(tx, ty, 380);
        await throwP;
        K.audio.sfx('boing'); ball.remove();
        a.happy(1600); a.play('a-hop', 450);
        K.fx.sparkle(a.x, a.y - 60, { n: 12 });
        selected.fun = Math.min(100, selected.fun + 25);
        K.voice.say(K.pick([`${selected.name} caught it!`, 'Fetch! Good job!', 'Again! Again!']));
        K.emit('pet', { act: 'play' });
        K.save.write(); drawInfo();
        busy = false;
      }
      async function cuddle() {
        if (busy || !needPet()) return;
        busy = true;
        const a = actors.get(selected.id);
        await pr.walkTo(K.clamp(a.x - 110, 80, 1100), a.y);
        pr.face = 1; pr.place(); a.face = -1; a.place();
        pr.happy(2000); a.happy(2000);
        K.fx.hearts(a.x - 50, a.y - 120, 8); K.audio.sfx('giggle');
        selected.love = Math.min(100, selected.love + 25);
        K.voice.say(K.pick([`${selected.name} loves you!`, 'Snuggle time!', 'Aww, so cozy!']));
        K.emit('pet', { act: 'cuddle' });
        K.save.write(); drawInfo();
        busy = false;
      }
      function follow() {
        if (!needPet()) return;
        S.petActive = selected.id; K.save.write();
        K.audio.sfx('sparkle');
        K.fx.sparkle(actors.get(selected.id).x, actors.get(selected.id).y - 60, { n: 16 });
        K.voice.say(`${selected.name} will follow you around the kingdom!`);
        drawInfo();
      }

      /* ---------- adopting: pick an animal, a color, then a name (reading!) ---------- */
      const pop = K.g('', root);
      function panel(big) {
        pop.innerHTML = '';
        const shade = K.g('<rect x="-900" y="-1400" width="3000" height="3600" fill="#6d4a92" opacity=".3"/>', pop);
        K.tap(shade, () => { pop.innerHTML = ''; });
        // on a tall phone screen the pet picker uses the whole screen so the pets are big enough to tap
        let vTop = 0, vBot = 800;
        try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
        const tall = big && vBot - vTop > 1150;
        const R = tall ? { x: 40, y: vTop + 215, w: 1120, h: Math.min(1760, vBot - vTop - 250), tall } : { x: 130, y: 80, w: 940, h: 700, tall: false };
        const p = K.g(`<rect x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="50" fill="#fff" stroke="#ffd1e8" stroke-width="8"/>`, pop);
        K.tap(p, () => {});
        K.button(pop, R.x + R.w - 20, R.y + 20, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => { pop.innerHTML = ''; }, { r: tall ? 56 : 40 });
        return R;
      }
      function openAdopt() {
        if (busy) return;
        const price = P.price();
        if (price > S.stars) { K.voice.say(`A new pet needs ${price} stars. You have ${S.stars}. Earn stars at the royal school!`); K.audio.sfx('boing'); return; }
        const R = panel(true);
        const NT = Object.keys(P.TYPES).length, COLS = R.tall ? 5 : 7, ROWS = Math.ceil(NT / COLS);
        const stepX = R.tall ? 216 : 132, stepY = R.tall ? Math.min(270, (R.h - 170) / ROWS) : 118, tileS = R.tall ? Math.min(1.5, stepY / 150) : 0.84;
        K.g(`<text x="600" y="${R.y + 70}" text-anchor="middle" font-size="48" fill="#6d4a92"><tspan fill="#ff5fa2">p</tspan>ick a pet</text>
          ${price ? `<g transform="translate(860 ${R.y + 60})"><path d="${A.star(18)}" fill="url(#gGold)"/><text x="26" y="12" font-size="34" fill="#c27a12">${price}</text></g>` : `<text x="900" y="${R.y + 72}" font-size="30" fill="#5fc48a">free!</text>`}`, pop);
        Object.keys(P.TYPES).forEach((type, i) => {
          const t = P.TYPES[type];
          const x = 600 + ((i % COLS) - (COLS - 1) / 2) * stepX, y = R.y + 110 + stepY / 2 + Math.floor(i / COLS) * stepY;
          const g = K.g(`<g class="inner pop-in" style="animation-delay:${i * 0.03}s"><rect x="-70" y="-70" width="140" height="140" rx="26" fill="#fff8fc" stroke="#f0dcec" stroke-width="5"/>
            <g transform="translate(0 36) scale(.6)">${A.pet(type, t.colors[0])}</g>
            <text y="62" text-anchor="middle" font-size="21" fill="#6d4a92"><tspan fill="#ff5fa2">${t.word[0]}</tspan>${t.word.slice(1)}</text></g>`, pop, { class: 'btn', transform: `translate(${x} ${y}) scale(${tileS})` });
          K.tap(g, () => { K.audio.sfx('pop'); K.voice.say(t.word); pickColor(type); });
        });
        K.voice.say('Which pet do you want?');
      }
      function pickColor(type) {
        const t = P.TYPES[type];
        panel();
        K.g(`<text x="600" y="150" text-anchor="middle" font-size="48" fill="#6d4a92"><tspan fill="#ff5fa2">p</tspan>ick a color</text>`, pop);
        t.colors.forEach((c, i) => {
          const g = K.g(`<g class="inner pop-in"><rect x="-96" y="-120" width="192" height="240" rx="34" fill="#fff8fc" stroke="#f0dcec" stroke-width="5"/><g transform="translate(0 70) scale(1.4)">${A.pet(type, c)}</g></g>`, pop, { class: 'btn', transform: `translate(${270 + i * 220} 420)` });
          K.tap(g, () => { K.audio.sfx('pop'); pickName(type, c); });
        });
        K.voice.say(`What color ${t.word}?`);
      }
      function pickName(type, color) {
        const t = P.TYPES[type];
        panel();
        K.g(`<text x="600" y="150" text-anchor="middle" font-size="48" fill="#6d4a92"><tspan fill="#ff5fa2">p</tspan>ick a name</text>
          <g transform="translate(600 360) scale(1.5)">${A.pet(type, color)}</g>`, pop);
        t.names.forEach((nm, i) => {
          const g = K.g(`<g class="inner pop-in"><rect x="-130" y="-55" width="260" height="110" rx="32" fill="#fff" stroke="#e8dcf8" stroke-width="6"/>
            <text y="18" text-anchor="middle" font-size="46" fill="#6d4a92"><tspan fill="#ff5fa2">${nm[0]}</tspan>${nm.slice(1)}</text></g>`, pop, { class: 'btn', transform: `translate(${330 + i * 270} 560)` });
          let tapped = false;
          K.tap(g, () => {
            if (!tapped) { tapped = true; K.voice.say(`${nm}? Tap again to pick ${nm}!`); K.replay(g.firstChild, 'pop', 400); return; }
            adopt(type, color, nm);
          });
        });
        K.voice.say('Pick a name! Tap a name to hear it.');
      }
      async function adopt(type, color, name) {
        pop.innerHTML = '';
        const price = P.price();
        if (price) { S.stars -= price; K.updateStars(true); }
        const p = P.add(type, color, name);
        const a = petActor(p, 600, 640);
        a.setPos(600, 640);
        K.audio.sfx('fanfare'); K.fx.confetti(70); K.fx.hearts(600, 520, 10);
        a.happy(3000); a.play('a-jump', 700);
        K.voice.say(`Welcome home, ${name}! You adopted a ${P.TYPES[type].word}!`);
        K.emit('adopt', { type });
        selected = p; drawInfo();
      }

      drawInfo();
      if (!P.list().length) { K.hint('Tap the paw to adopt your very first pet!'); K.wait(700).then(() => { K.voice.say('Welcome to the pet palace! Tap the paw to adopt your very first pet. It is free!'); adoptBtn.inner.classList.add('bob'); }); }
      else if (opts.adopt) { K.wait(500).then(openAdopt); }
      else { K.hintOnce('pets', 'Tap a pet, then feed it, play, or cuddle. Tap follow me to take it to the kingdom!'); }
    },
  };
})();
