/* Bakery: pick a treat, bake it, frost it, add toppings (count them for Chef Biscuit's order) */
(function () {
  const A = K.art, D = K.data;
  const TOP_WORDS = K.art.FOOD_WORDS;
  const TREATS = ['cupcake', 'cookie', 'cake'];
  const FOODS = [...Object.keys(K.art.MEALS), ...TREATS];
  const foodKey = (t) => (t.meal ? t.meal : TREATS[t.shape]);
  const isTreat = (k) => TREATS.includes(k);
  const foodWord = (k) => (isTreat(k) ? k : K.art.MEALS[k].word);
  const withArticle = (k) => (['soup', 'pasta', 'toast'].includes(k) ? 'some ' + foodWord(k) : 'a ' + foodWord(k));
  // Chef mostly asks for healthy meals; a treat only sometimes
  const newOrder = () => {
    const food = Math.random() < 0.75 ? K.pick(Object.keys(K.art.MEALS)) : K.pick(TREATS);
    const k = isTreat(food) ? K.pick(K.data.TOPPINGS) : K.pick(K.art.MEALS[food].tops);
    return { food, k, n: K.irand(1, 5) };
  };

  K.scenes.bakery = {
    enter(root) {
      const S = K.save.data;
      const PX = 600, PY = 562; // plate on the counter
      let step = 'shape', treat = null, busy = false;
      let order = newOrder();
      const orderText = () => `Can you make ${withArticle(order.food)} with ${order.n} ${TOP_WORDS[order.k][order.n === 1 ? 0 : 1]}?`;

      /* ---------- kitchen ---------- */
      let tiles = '';
      for (let x = -900; x < 2100; x += 60) for (let y = -700; y < 540; y += 60) tiles += `<rect x="${x + 3}" y="${y + 3}" width="54" height="54" rx="10" fill="${(x / 60 + y / 60) % 2 ? '#e3f8ef' : '#d8f3e8'}"/>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1300" fill="#cdeee0"/>${tiles}
        <g transform="translate(330 170)"><rect x="-130" y="-110" width="260" height="200" rx="20" fill="#bfe5ff" stroke="#fff" stroke-width="12"/>
          <g transform="translate(40 -50) scale(.5)">${A.sun()}</g><g transform="translate(-60 -30) scale(.4)">${A.cloud(1)}</g>
          <path d="M-130 60 Q-60 30 0 56 Q70 30 130 52 V90 H-130Z" fill="#b3e6c2"/><path d="M0 -110 V90 M-130 -10 H130" stroke="#fff" stroke-width="8"/>
          <path d="M-150 -124 Q-120 0 -150 110 H-110 Q-90 0 -110 -124Z M150 -124 Q120 0 150 110 H110 Q90 0 110 -124Z" fill="#ffb3d4"/>
          <rect x="-160" y="-134" width="320" height="22" rx="10" fill="#ff9ec7"/></g>
        <rect x="740" y="120" width="460" height="16" rx="6" fill="#e9b98f"/>
        ${[[775, 120, '#ffb3d4'], [1160, 120, '#fff08a']].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><rect x="-22" y="-60" width="44" height="60" rx="10" fill="${c}" opacity=".85" stroke="#fff" stroke-width="3"/><rect x="-24" y="-68" width="48" height="12" rx="5" fill="#e9b98f"/></g>`).join('')}
        <rect x="-900" y="540" width="3000" height="700" fill="#f7d9c4"/>
        <rect x="-900" y="530" width="3000" height="26" fill="#fff4e0" stroke="#e9b98f" stroke-width="3"/>
        <path d="M-900 556${A.scallop(-900, 2100, 556, 60, 22)}" fill="#ffc2dc"/>`, root);

      const shelf = K.g('', root);
      function drawShelf() {
        shelf.innerHTML = S.treats.slice(-4).map((t, i) => `<g transform="translate(${862 + i * 80} 120) scale(.34)">${A.dish(t)}</g>`).join('');
      }
      drawShelf();

      // oven
      const oven = K.g(`<g class="ov"><rect x="-140" y="-300" width="280" height="300" rx="30" fill="#ff9ec7" stroke="#e57aa8" stroke-width="5"/>
        <rect x="-150" y="-322" width="300" height="34" rx="14" fill="#ffc2dc" stroke="#e57aa8" stroke-width="4"/>
        ${[-90, -30, 30, 90].map((x) => `<circle cx="${x}" cy="-260" r="14" fill="#fff" stroke="#e57aa8" stroke-width="3"/><path d="M${x} -270 V-260" stroke="#e57aa8" stroke-width="3"/>`).join('')}
        <rect x="-110" y="-220" width="220" height="150" rx="22" fill="#fff4e0" stroke="#e57aa8" stroke-width="5"/>
        <rect class="ovenglow" x="-96" y="-206" width="192" height="122" rx="16" fill="#ffd7a8" opacity=".3"/>
        <rect x="-80" y="-56" width="160" height="14" rx="7" fill="#fff" stroke="#e57aa8" stroke-width="3"/>
        <path d="${A.heart(1.3)}" transform="translate(0 -22)" fill="#fff"/></g>`, root, { transform: 'translate(1030 560)' });
      const ovenGlow = oven.querySelector('.ovenglow');
      K.tap(oven, () => { if (step === 'bake') bake(); else { K.audio.sfx('ding'); K.fx.word('oven', 1030, 180); } });

      // chef bunny + princess stand behind the counter
      const actorsG = K.g('', root);
      const bun = new K.Bunny(actorsG, 150, 680, 1.05);
      const pr = new K.Princess(actorsG, K.me(), 370, 612, 0.95);
      // counter + plate
      K.g(`<rect x="250" y="560" width="680" height="130" rx="10" fill="#fff4e0" stroke="#e9b98f" stroke-width="4"/>
        <path d="M250 600 H930 V640${A.scallop(930, 250, 640, 12, 22)}Z" fill="#ffc2dc" stroke="#e57aa8" stroke-width="3"/>
        <rect x="236" y="548" width="708" height="26" rx="12" fill="#fffaf2" stroke="#e9b98f" stroke-width="4"/>
        <ellipse cx="${PX}" cy="${PY + 4}" rx="120" ry="22" fill="#fff" stroke="#e8d8f0" stroke-width="4"/><ellipse cx="${PX}" cy="${PY + 2}" rx="92" ry="13" fill="#fdf6ff"/>`, root);
      const treatG = K.g('', root, { transform: `translate(${PX} ${PY})` });
      const orderG = K.g('', root, { transform: 'translate(200 330)' });
      function drawOrder() {
        let dots = '';
        for (let i = 0; i < order.n; i++) dots += `<g transform="translate(${(i - (order.n - 1) / 2) * 34} 52) scale(1.3)">${A.topping(order.k, 0)}</g>`;
        orderG.innerHTML = `<g class="pop-in"><path d="M-110 -80 h220 a24 24 0 0 1 24 24 v110 a24 24 0 0 1 -24 24 h-120 l-30 30 l2 -30 h-72 a24 24 0 0 1 -24 -24 v-110 a24 24 0 0 1 24 -24Z" fill="#fff" stroke="#ffc2dc" stroke-width="5" transform="translate(0 0)"/>
          <g transform="translate(-62 14) scale(.42)">${isTreat(order.food) ? A.treat({ shape: TREATS.indexOf(order.food), baked: true, frost: 1, tops: [] }) : A.meal({ meal: order.food, cooked: true, tops: [] })}</g>
          <g transform="translate(26 -20) scale(2.2)">${A.topping(order.k, 0)}</g>
          <text x="84" y="0" text-anchor="middle" font-size="64" fill="#6d4a92">${order.n}</text>${dots}</g>`;
      }
      drawOrder();
      const sayOrder = () => { bun.happy(); bun.play('a-hop', 450); K.voice.say(orderText(), { pitch: 1.45 }); };
      K.tap(bun.root, sayOrder);
      K.tap(orderG, sayOrder);
      K.tap(pr.root, () => { pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('giggle'); });
      K.hint('What should we cook? ' + orderText());
      K.wait(800).then(sayOrder);

      /* ---------- tray ---------- */
      const tray = K.g('', root);
      const counts = {};
      function drawTray() {
        tray.innerHTML = '';
        K.g('<rect x="120" y="680" width="960" height="114" rx="40" fill="#fff" opacity=".6"/>', tray);
        if (step === 'shape') {
          FOODS.forEach((f, i) => {
            const pic = isTreat(f) ? `<g transform="translate(0 22) scale(.32)">${A.treat({ shape: TREATS.indexOf(f), baked: true, frost: 1, tops: [] })}</g>` : `<g transform="translate(0 20) scale(.34)">${A.meal({ meal: f, cooked: true, tops: [] })}</g>`;
            const b = K.button(tray, 184 + i * 104, 735, pic, () => chooseFood(f), { r: 48, fill: isTreat(f) ? 'url(#gBtn)' : 'url(#gBtnMint)' });
            b.inner.classList.add('pop-in');
          });
        } else if (step === 'bake') {
          K.button(tray, 600, 735, `<g transform="scale(1.1)">${A.icons.oven}</g>`, () => bake(), { r: 72, fill: 'url(#gBtnGold)' });
        } else if (step === 'decorate' && treat.meal) {
          A.MEALS[treat.meal].tops.forEach((k, i) => {
            K.button(tray, 330 + i * 150, 735, `<g transform="scale(2.7)">${A.topping(k, 0)}</g>`, () => addTop(k), { r: 60, fill: k === order.k ? 'url(#gBtnGold)' : 'url(#gBtnMint)' });
          });
          if (treat.tops.length) { const done = K.button(tray, 810, 560, A.icons.check, () => finish(), { r: 66, fill: '#a6eec0' }); done.inner.classList.add('pop-in'); }
        } else if (step === 'decorate') {
          { const nf = treat.frost < 0 ? 0 : (treat.frost + 1) % D.FROSTINGS.length, c = D.FROSTINGS[nf]; K.button(tray, 235, 735, `<g transform="scale(1.45)"><path d="M-14 -28 H14 L8 12 H-8Z" fill="${c}" stroke="${K.shade(c, -0.25)}" stroke-width="3"/><path d="M-8 12 L0 28 L8 12" fill="${K.shade(c, -0.15)}"/><rect x="-16" y="-34" width="32" height="10" rx="4" fill="#fff" stroke="${K.shade(c, -0.25)}" stroke-width="2"/></g>`, () => frost(nf), { r: 58, fill: "url(#gBtnLilac)" }); }
          D.TOPPINGS.forEach((k, i) => {
            K.button(tray, 395 + i * 138, 735, `<g transform="scale(2.7)">${A.topping(k, 0)}</g>`, () => addTop(k), { r: 58, fill: k === order.k ? 'url(#gBtnGold)' : 'url(#gBtnMint)' });
          });
          if (treat.frost >= 0 || treat.tops.length) {
            const done = K.button(tray, 810, 560, A.icons.check, () => finish(), { r: 66, fill: '#a6eec0' });
            done.inner.classList.add('pop-in');
          }
        }
      }
      function drawTreat(cls) {
        treatG.innerHTML = `<g class="${cls || ''}">${A.dish(treat)}</g>`;
      }

      function chooseFood(f) {
        if (busy) return;
        treat = isTreat(f) ? { shape: TREATS.indexOf(f), baked: false, frost: -1, tops: [] } : { meal: f, cooked: false, tops: [] };
        Object.keys(counts).forEach((k) => delete counts[k]);
        drawTreat('pop-in');
        K.audio.sfx('pop');
        K.fx.word(foodWord(f), PX, 330);
        const needsCook = isTreat(f) || A.MEALS[f].cook;
        step = needsCook ? 'bake' : 'decorate'; drawTray();
        K.hint(needsCook ? 'Now cook it in the oven!' : 'Add the toppings! ' + orderText());
        K.wait(1300).then(() => { if (step === 'bake') K.voice.say('Now put it in the oven!'); else if (step === 'decorate') K.voice.say('Now add the toppings!'); });
      }
      async function bake() {
        if (busy || step !== 'bake') return;
        busy = true;
        tray.innerHTML = '';
        const moving = K.g(A.dish(treat), K.layers.fx);
        await K.tween(700, (t) => K.place(moving, K.lerp(PX, 1030, t), K.lerp(PY, 470, t) - Math.sin(t * Math.PI) * 160, 1 - t * 0.5));
        moving.remove(); treatG.innerHTML = '';
        K.audio.sfx('whoosh');
        // warm glow + bouncing numbers 1-2-3 while it bakes
        for (let k = 1; k <= 3; k++) {
          ovenGlow.setAttribute('opacity', 0.5 + k * 0.15); ovenGlow.setAttribute('fill', ['#ffd7a8', '#ffc38a', '#ffb070'][k - 1]);
          K.fx.number(k, 1030, 260);
          K.replay(oven.firstChild, 'squish', 500);
          await K.wait(900);
        }
        K.audio.sfx('ding');
        ovenGlow.setAttribute('opacity', 0.3); ovenGlow.setAttribute('fill', '#ffd7a8');
        if (treat.meal) treat.cooked = true; else treat.baked = true;
        const out = K.g(A.dish(treat), K.layers.fx);
        await K.tween(700, (t) => K.place(out, K.lerp(1030, PX, t), K.lerp(470, PY, t) - Math.sin(t * Math.PI) * 160, 0.5 + t * 0.5));
        out.remove();
        drawTreat('squish');
        K.fx.sparkle(PX, PY - 80, { n: 16, spread: 120 });
        K.fx.word('yum', PX, 330, { sayText: treat.meal ? 'Ding! Now add the toppings!' : 'Ding! Now add frosting and toppings!' });
        step = 'decorate'; drawTray();
        K.hint('Add frosting and toppings. ' + orderText());
        busy = false;
      }
      function frost(i) {
        if (busy) return;
        treat.frost = i;
        drawTreat('squish');
        K.audio.sfx('pop');
        K.fx.sparkle(PX, PY - 100, { n: 8, spread: 70, colors: [D.FROSTINGS[i], '#fff'] });
        drawTray();
      }
      function addTop(k) {
        if (busy) return;
        if (treat.tops.length >= 14) { K.audio.sfx('boing'); K.voice.say('Wow, that is a lot!'); return; }
        const z = treat.meal ? A.MEAL_ZONE[treat.meal] : A.toppingZone(treat.shape);
        let x, y, tries = 0;
        do {
          const a = K.rand(0, Math.PI * 2), r = Math.sqrt(Math.random());
          x = z.cx + Math.cos(a) * z.rx * r; y = z.cy + Math.sin(a) * z.ry * r;
          tries++;
        } while (tries < 20 && treat.tops.some((p) => K.dist(p.x, p.y, x, y) < 16));
        treat.tops.push({ k, x: Math.round(x), y: Math.round(y), r: Math.round(K.rand(-25, 25)) });
        counts[k] = (counts[k] || 0) + 1;
        drawTreat();
        K.fx.sparkle(PX + x, PY + y, { n: 4, spread: 30, size: 7 });
        K.fx.number(counts[k], PX + 170, PY - 170);
        drawTray();
      }
      // after decorating: give it to Chef Biscuit, keep it on the shelf, or eat it yourself
      function finish() {
        if (busy) return;
        tray.innerHTML = '';
        K.g('<rect x="120" y="664" width="960" height="134" rx="46" fill="#fff" opacity=".7"/>', tray);
        const opts = [
          [`<g transform="translate(0 44) scale(.42)">${A.bunny(true)}</g>`, () => giveChef(), 'url(#gBtnGold)', 'for Chef'],
          [`<g transform="scale(1.2)">${A.icons.basket}</g>`, () => keep(), 'url(#gBtnLilac)', 'keep it'],
          [`<g transform="translate(0 30) scale(.32)">${A.dish(treat)}</g>${A.sparkle4(24, -26, 8, '#ffd166')}`, () => eat(), 'url(#gBtnMint)', 'eat it'],
        ];
        opts.forEach(([icon, fn, fill, label], i) => { const b = K.button(tray, 400 + i * 200, 724, icon, fn, { r: 60, fill, label }); b.inner.classList.add('pop-in'); });
        K.voice.say('Who is it for? Chef Biscuit, keep it, or eat it?');
      }
      async function toShelf() {
        const fly = K.g(A.dish(treat), K.layers.fx);
        treatG.innerHTML = '';
        const slot = Math.min(S.treats.length, 3);
        await K.tween(800, (t) => K.place(fly, K.lerp(PX, 862 + slot * 80, t), K.lerp(PY, 120, t) - Math.sin(t * Math.PI) * 120, 1 - t * 0.66));
        fly.remove();
        S.treats.push(treat);
        if (S.treats.length > 8) S.treats.shift();
        K.save.write();
        drawShelf();
        K.audio.sfx('chime');
      }
      async function nextTreat(fresh) {
        treat = null; step = 'shape';
        if (fresh) order = newOrder();
        bun.root.classList.remove('sad');
        drawOrder(); drawTray();
        K.hint('What should we cook? ' + orderText());
        busy = false;
        await K.wait(600);
        sayOrder();
      }
      async function giveChef() {
        if (busy) return;
        busy = true; tray.innerHTML = '';
        const got = counts[order.k] || 0;
        const rightFood = foodKey(treat) === order.food;
        const perfect = rightFood && got === order.n;
        K.emit('baked', { counts: Object.assign({}, counts) });
        const fly = K.g(A.dish(treat), K.layers.fx);
        treatG.innerHTML = '';
        await K.tween(600, (t) => K.place(fly, K.lerp(PX, 220, t), K.lerp(PY, 560, t) - Math.sin(t * Math.PI) * 120, 1 - t * 0.4));
        fly.remove();
        if (perfect) {
          // Chef Biscuit is SO happy
          bun.happy(4000); pr.happy(4000);
          for (let k = 0; k < 3; k++) K.wait(k * 650).then(() => bun.play('a-jump', 700));
          pr.play('a-jump', 700);
          K.audio.sfx('fanfare');
          K.fx.confetti(70);
          K.fx.hearts(150, 470, 10);
          K.fx.speech('Perfect! Thank you!', 170, 430, { pitch: 1.45, hold: 3, sayText: `Hooray! ${withArticle(order.food)} with ${order.n} ${TOP_WORDS[order.k][order.n === 1 ? 0 : 1]}, just what I wanted! You are the best baker! Thank you, princess!` });
          K.fx.stars(3, 240, 400);
          K.emit('chef', { happy: true });
          await K.wait(3600);
          await nextTreat(true);
        } else {
          // a little disappointed, but still kind
          bun.root.classList.add('sad');
          bun.play('a-shake', 700);
          K.audio.sfx('boing');
          const said = got ? `you used ${got}` : `there were none`;
          K.fx.speech('Oh... not quite.', 170, 430, { pitch: 1.35, hold: 3.4, sayText: rightFood ? `Oh... I asked for ${order.n} ${TOP_WORDS[order.k][order.n === 1 ? 0 : 1]}, but ${said}. That's okay. Can you try again?` : `Oh... I asked for ${withArticle(order.food)}, not ${withArticle(foodKey(treat))}. That's okay. Can you try again?` });
          K.emit('chef', { happy: false });
          await K.wait(3800);
          bun.root.classList.remove('sad');
          bun.happy(1200);
          // Chef asks for the same order again so she can practise that number
          await nextTreat(false);
        }
      }
      async function keep() {
        if (busy) return;
        busy = true; tray.innerHTML = '';
        pr.happy(2000); pr.play('a-twirl', 900);
        K.fx.word('mine', 600, 330, { sayText: 'I\u2019ll keep this one!' });
        await toShelf();
        await nextTreat(false);
      }
      async function eat() {
        if (busy) return;
        busy = true; tray.innerHTML = '';
        const t0 = treat;
        const fly = K.g(A.dish(t0), K.layers.fx);
        treatG.innerHTML = '';
        await K.tween(600, (t) => K.place(fly, K.lerp(PX, pr.x + 10, t), K.lerp(PY, pr.y - 150, t) - Math.sin(t * Math.PI) * 80, 1 - t * 0.5));
        for (let k = 0; k < 3; k++) { K.audio.sfx('munch'); K.fx.sparkle(pr.x + 10, pr.y - 150, { n: 5, spread: 40, colors: ['#ffe0b3', '#ffc2e2'] }); await K.wait(380); }
        fly.remove();
        pr.happy(2500); pr.play('a-hop', 450);
        const healthy = !!t0.meal;
        K.fx.word('yum', 600, 330, { sayText: healthy ? 'Yum! Healthy food makes me big and strong!' : 'Yum! Treats are a sometimes food.' });
        K.emit('eat', { amount: healthy ? 60 : 25 });
        await K.wait(1600);
        await nextTreat(false);
      }
      drawTray();
    },
  };
})();
