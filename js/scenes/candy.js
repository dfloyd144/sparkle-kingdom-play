/* Candy Factory world: candy machine recipes (reading color words, doubling, missing amounts),
   pattern belt, sharing fairly (dividing, then leftovers), candy shop (adding prices), and real candy facts. */
(function () {
  const A = K.art;
  const COL = { red: '#ff5e78', yellow: '#ffd34d', blue: '#6cb6ff', green: '#6cd48a', purple: '#b98aff', orange: '#ff9a4d' };
  const NAMES = Object.keys(COL);
  const sh = K.shade;
  const candy = (c, shape = 'round', s = 1) => {
    const h = COL[c] || c, d = sh(h, -0.25);
    let body;
    if (shape === 'wrapped') body = `<path d="M-30 0 L-46 -14 L-46 14Z M30 0 L46 -14 L46 14Z" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><ellipse rx="30" ry="22" fill="${h}" stroke="${d}" stroke-width="3"/><path d="M-10 -18 Q0 0 -10 18 M6 -20 Q16 0 6 20" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`;
    else if (shape === 'heart') body = `<path d="${A.heart(1.5)}" transform="translate(0 4)" fill="${h}" stroke="${d}" stroke-width="3"/>`;
    else if (shape === 'star') body = `<path d="${A.star(30)}" fill="${h}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/>`;
    else if (shape === 'drop') body = `<path d="M0 -30 Q28 10 22 18 Q0 34 -22 18 Q-28 10 0 -30Z" fill="${h}" stroke="${d}" stroke-width="3"/><circle cx="-8" cy="4" r="5" fill="#fff" opacity=".5"/>`;
    else body = `<circle r="26" fill="${h}" stroke="${d}" stroke-width="3"/><circle cx="-9" cy="-9" r="7" fill="#fff" opacity=".55"/>`;
    return `<g transform="scale(${s})">${body}</g>`;
  };
  A.candy = candy;
  const lolly = (c) => `<path d="M0 10 V80" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle r="34" fill="${COL[c]}" stroke="${sh(COL[c], -0.25)}" stroke-width="4"/><path d="M0 0 m0 -6 a6 6 0 1 1 -6 6 a14 14 0 1 1 14 14 a22 22 0 1 1 -22 -22" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/>`;
  A.lolly = lolly;

  const FACTS = [
    { at: 'cacao', say: 'Chocolate comes from cacao beans. They grow inside big pods on cacao trees, in hot and rainy places.' },
    { at: 'river', say: 'Chocolate melts at almost the same temperature as your body. That is why it melts in your mouth!' },
    { at: 'cotton', say: 'Cotton candy is sugar that gets melted and spun into super thin threads, like a spider spinning silk.' },
    { at: 'cane', say: 'Sugar comes from plants! Most sugar comes from sugar cane, a giant grass, or from sugar beets.' },
    { at: 'gum', say: 'Gumdrops get their squishy chew from pectin, which comes from fruits like apples.' },
  ];

  const view = () => {
    let vTop = 0, vBot = 800;
    try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
    return { vTop, vBot, tall: vBot - vTop > 1150, top: vBot - vTop > 1150 ? vTop + 210 : 64 };
  };
  const lvlOf = (n, steps) => steps.filter((s) => n >= s).length;

  K.scenes.candy = {
    enter(root) {
      const S = K.save.data;
      const CF = (S.candy = S.candy || { recipe: 0, pattern: 0, share: 0, shop: 0, fi: 0 });
      const v = view(), mid = (v.top + v.vBot) / 2, T = v.tall;

      /* ---------- the factory ---------- */
      const floorY = T ? v.vBot - 420 : 560;
      let stripes = '';
      for (let x = -900; x < 2100; x += 80) stripes += `<rect x="${x}" y="-1400" width="40" height="3600" fill="#fff" opacity=".25"/>`;
      K.g(`<rect x="-900" y="-1400" width="3000" height="3600" fill="#ffe1ee"/>${stripes}
        <rect x="-900" y="${floorY}" width="3000" height="1400" fill="#f6d9b8"/>
        <path d="M-900 ${floorY + 120} Q-600 ${floorY + 90} -300 ${floorY + 120} T300 ${floorY + 120} T900 ${floorY + 120} T1500 ${floorY + 120} T2100 ${floorY + 120} V${floorY + 260} H-900Z" fill="#8a5a3a"/>
        <path d="M-900 ${floorY + 135} Q-600 ${floorY + 110} -300 ${floorY + 135} T300 ${floorY + 135} T900 ${floorY + 135} T1500 ${floorY + 135} T2100 ${floorY + 135}" stroke="#b07a50" stroke-width="8" fill="none"/>`, root);
      const deco = K.g('', root);
      const decoY = floorY;
      const DECOR = {
        cacao: { x: 130, art: `<path d="M0 0 V-170" stroke="#8a5a3a" stroke-width="22"/><circle cy="-210" r="90" fill="#6cc46c"/><circle cx="-50" cy="-170" r="60" fill="#5ab05a"/><circle cx="50" cy="-170" r="60" fill="#7cd47a"/>${[[-30, -120], [24, -110]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="26" fill="#ff9a4d" stroke="#d9772e" stroke-width="3"/>`).join('')}` },
        cotton: { x: 380, art: `<rect x="-14" y="-110" width="28" height="110" fill="#c9a6ff"/><path d="M-60 -110 H60 L40 -150 H-40Z" fill="#fff" stroke="#c9a6ff" stroke-width="4"/>${[-30, 0, 30].map((x) => `<circle cx="${x}" cy="-180" r="34" fill="#ffc2e0"/>`).join('')}` },
        cane: { x: 820, art: `<path d="M0 0 V-150 A36 36 0 0 1 72 -150" stroke="#fff" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M0 0 V-150 A36 36 0 0 1 72 -150" stroke="#ff5e78" stroke-width="22" fill="none" stroke-dasharray="14 14"/>` },
        gum: { x: 1070, art: `<path d="M0 0 V-120" stroke="#8a5a3a" stroke-width="14"/>${[[-40, -150, 'red'], [0, -180, 'yellow'], [40, -150, 'green'], [-20, -120, 'purple'], [26, -120, 'orange']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${candy(c, 'drop', 0.9)}</g>`).join('')}` },
        river: { x: 600, y: floorY + (T ? 160 : 100), art: `<ellipse rx="140" ry="30" fill="#fff" opacity="0"/><text y="10" text-anchor="middle" font-size="26" fill="${T ? "#fff" : "#8a5a3a"}" opacity=".85">chocolate river</text>` },
      };
      Object.entries(DECOR).forEach(([id, d]) => {
        const g = K.g(`<g class="bob">${d.art}</g><circle cy="-120" r="110" fill="#fff" opacity="0"/>`, deco, { class: 'btn', transform: `translate(${d.x} ${d.y || decoY}) scale(${T ? 1.2 : 0.9})` });
        K.tap(g, () => { K.audio.sfx('pop'); K.replay(g, 'pop', 400); K.voice.say(FACTS.find((f) => f.at === id).say, { force: true }); K.emit('candyFact'); });
      });
      // the big candy machine in the middle
      const MX = 600, MY = T ? floorY - 300 : 330;
      K.g(`<g transform="translate(${MX} ${MY}) scale(${T ? 1.3 : 1})"><rect x="-130" y="-130" width="260" height="260" rx="40" fill="#ff9ec7" stroke="#e0609a" stroke-width="6"/>
        <circle cy="-30" r="80" fill="#fff" stroke="#e0609a" stroke-width="6"/>${[[-30, -50, 'red'], [20, -60, 'blue'], [-10, -10, 'yellow'], [34, -16, 'green'], [-44, 0, 'purple']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${candy(c, 'round', 0.7)}</g>`).join('')}
        <rect x="-40" y="80" width="80" height="50" rx="10" fill="#e0609a"/><path d="M130 -40 h40 v-60" stroke="#c9a6ff" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="170" cy="-110" r="18" fill="#ffd166"/></g>`, root);

      /* ---------- menu ---------- */
      const by = T ? v.vBot - 170 : 735, br = T ? 82 : 52;
      const GAMES = [
        ['recipes', `<g transform="translate(-12 0)">${candy('red', 'round', 0.55)}</g><g transform="translate(14 -8)">${candy('blue', 'round', 0.55)}</g><g transform="translate(6 18)">${candy('yellow', 'round', 0.55)}</g>`, recipes],
        ['patterns', `${['red', 'yellow', 'red'].map((c, i) => `<g transform="translate(${(i - 1) * 26} 0)">${candy(c, 'round', 0.42)}</g>`).join('')}<text x="44" y="12" font-size="34" fill="#6d4a92">?</text>`, patterns],
        ['sharing', `<g transform="translate(-20 4) scale(.32)">${A.princessHead(K.me())}</g><g transform="translate(22 4)">${candy('purple', 'drop', 0.6)}</g>`, sharing],
        ['candy shop', `<g transform="translate(0 -6) scale(.55)">${lolly('red')}</g>`, shop],
      ];
      GAMES.forEach(([label, icon, fn], i) => K.button(root, 600 + (i - 1.5) * (T ? 250 : 220), by, icon, fn, { r: br, fill: 'url(#gBtnGold)', label }));

      /* ---------- panel ---------- */
      let pop = null;
      function panel() {
        if (pop) pop.remove();
        pop = K.g('', root);
        const shade = K.g('<rect x="-900" y="-1400" width="3000" height="3600" fill="#7a3a5a" opacity=".4"/>', pop);
        K.tap(shade, () => {});
        const ph = T ? Math.min(1300, v.vBot - v.top - 40) : 700, py = T ? v.top + 10 : 80;
        K.g(`<rect x="70" y="${py}" width="1060" height="${ph}" rx="50" fill="#fff8fb" stroke="#ff9ec7" stroke-width="8"/>`, pop);
        K.button(pop, 1100, py + 30, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => { pop.remove(); pop = null; }, { r: T ? 56 : 42 });
        return { py, ph };
      }
      const alive = () => pop && pop.isConnected;
      const title = (py, text, size) => K.g(`<text x="600" y="${py + 100}" text-anchor="middle" font-size="${size || (T ? 48 : 40)}" fill="#6d4a92">${text}</text>`, pop);
      // answer cards (numbers)
      function numberChoices(y, ans, onRight, onWrong, spread = [-2, -1, 1, 2, 3]) {
        const set = new Set([ans]);
        while (set.size < 3) { const d = ans + K.pick(spread); if (d >= 0) set.add(d); }
        let done = false;
        K.shuffle([...set]).forEach((val, i) => {
          const x = 600 + (i - 1) * 300;
          const g = K.g(`<rect x="-110" y="-75" width="220" height="150" rx="30" fill="#fff" stroke="#f0dcec" stroke-width="6"/><text y="34" text-anchor="middle" font-size="96" fill="#6d4a92">${val}</text>`, pop, { class: 'btn', transform: `translate(${x} ${y}) scale(${T ? 1.15 : 0.85})` });
          K.tap(g, () => {
            if (done) return;
            if (val === ans) { done = true; g.firstChild.setAttribute('fill', '#c9f7dd'); g.firstChild.setAttribute('stroke', '#5fc48a'); onRight(x, y); }
            else { K.audio.sfx('boing'); K.replay(g, 'shake', 600); onWrong(val); }
          });
        });
      }

      /* ---------- 1. candy machine recipes ---------- */
      function recipes() {
        const { py, ph } = panel();
        const lvl = Math.max(0, lvlOf(CF.recipe || 0, [5, 10, 15]) - (K.learn.struggling('recipe') ? 1 : 0));
        const cols = K.shuffle(NAMES).slice(0, lvl === 0 ? 2 : 3);
        let need = {}, card, sayIt;
        cols.forEach((c) => { need[c] = K.irand(1, lvl === 0 ? 3 : 4); });
        if (lvl === 2) { // make double
          card = `${cols.map((c) => `${need[c]} ${c}`).join(', ')}  ×2`;
          sayIt = `Make a double batch! The recipe says ${cols.map((c) => `${need[c]} ${c}`).join(', ')}. Make twice as much!`;
          Object.keys(need).forEach((c) => { need[c] *= 2; });
        } else if (lvl === 3) { // a missing amount
          const total = Object.values(need).reduce((a, b) => a + b, 0), last = cols[cols.length - 1];
          card = `${total} in all: ${cols.slice(0, -1).map((c) => `${need[c]} ${c}`).join(', ')}, the rest ${last}`;
          sayIt = `Make ${total} candies in all. ${cols.slice(0, -1).map((c) => `${need[c]} ${c}`).join(', ')}, and the rest are ${last}. How many ${last}?`;
        } else {
          card = cols.map((c) => `${need[c]} ${c}`).join(', ');
          sayIt = `The recipe says: ${card}.`;
        }
        title(py, 'make the recipe!');
        const cy = py + (T ? 230 : 190);
        // recipe card: words (colored chips only on the first level)
        K.g(`<rect x="170" y="${cy - 60}" width="860" height="110" rx="24" fill="#fff6c2" stroke="#e6c34a" stroke-width="4"/>
          <text x="600" y="${cy + 12}" text-anchor="middle" font-size="${card.length > 34 ? 30 : 40}" fill="#6d4a92">${card}</text>`, pop);
        if (lvl === 0) K.g(cols.map((c, i) => `<g transform="translate(${600 + (i - (cols.length - 1) / 2) * 120} ${cy + (T ? 100 : 78)})">${candy(c, 'round', T ? 0.7 : 0.55)}</g>`).join(''), pop);
        const cardTap = K.g(`<rect x="170" y="${cy - 60}" width="860" height="110" fill="#fff" opacity="0"/>`, pop);
        K.tap(cardTap, () => K.voice.say(sayIt, { force: true }));
        // the hopper shows what she has put in
        const have = {}; NAMES.forEach((c) => { have[c] = 0; });
        const hop = K.g('', pop);
        const hy = cy + (T ? 290 : 175);
        const drawHop = () => {
          const list = NAMES.filter((c) => have[c]);
          hop.innerHTML = `<rect x="320" y="${hy - 70}" width="560" height="140" rx="30" fill="#fff" stroke="#ff9ec7" stroke-width="5" stroke-dasharray="14 10"/>`
            + (list.length ? list.map((c, i) => `<g transform="translate(${600 + (i - (list.length - 1) / 2) * 150} ${hy})">${candy(c, 'round', 0.9)}<text x="40" y="14" font-size="40" fill="#6d4a92">${have[c]}</text></g>`).join('') : `<text x="600" y="${hy + 12}" text-anchor="middle" font-size="30" fill="#c9a6c9">tap the jars to add candy</text>`);
        };
        drawHop();
        // jars of every color (she has to read which ones)
        const jy = py + ph - (T ? 330 : 200);
        NAMES.forEach((c, i) => {
          const x = 600 + (i - 2.5) * (T ? 165 : 150);
          const g = K.g(`<path d="M-50 -60 H50 V40 Q50 64 26 64 H-26 Q-50 64 -50 40Z" fill="#eaf6ff" stroke="#b9d8f0" stroke-width="4"/><rect x="-56" y="-74" width="112" height="20" rx="8" fill="${COL[c]}"/>
            ${[[-20, 30], [16, 34], [-2, 6], [22, 2], [-26, -6]].map(([xx, yy]) => `<g transform="translate(${xx} ${yy})">${candy(c, 'round', 0.45)}</g>`).join('')}<text y="100" text-anchor="middle" font-size="28" fill="#6d4a92">${c}</text>`, pop, { class: 'btn', transform: `translate(${x} ${jy}) scale(${T ? 1.1 : 0.85})` });
          K.tap(g, () => { if (have[c] >= 9) return; have[c]++; K.audio.sfx('pop'); K.replay(g, 'pop', 300); K.voice.say(`${have[c]} ${c}`, { force: true }); drawHop(); });
        });
        let tries = 0, done = false;
        const ly = T ? py + ph - 120 : hy, lxE = T ? 360 : 240, lxM = T ? 840 : 960;
        K.button(pop, lxE, ly, '<path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke="#e0609a" stroke-width="7" stroke-linecap="round"/>', () => { NAMES.forEach((c) => { have[c] = 0; }); drawHop(); K.voice.say('Empty!'); }, { r: T ? 60 : 44, label: 'empty' });
        K.button(pop, lxM, ly, `<path d="M-6 26 V-20" stroke="#8a7aa0" stroke-width="10" stroke-linecap="round"/><circle cy="-26" r="16" fill="#ff5e78"/>`, () => {
          if (done) return;
          const wrong = NAMES.find((c) => (need[c] || 0) !== have[c]);
          if (!wrong) {
            done = true;
            K.audio.sfx('fanfare'); K.fx.confetti(50); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, 600, hy);
            CF.recipe = (CF.recipe || 0) + 1; K.save.write(); K.learn.record('recipe', card, tries === 0); K.emit('candyRecipe');
            K.voice.say(K.pick(['Perfect candy! The machine made it!', 'Yum! Exactly right!', 'You followed the recipe!']) + (CF.recipe === 5 || CF.recipe === 10 || CF.recipe === 15 ? ' Level up! Harder recipes are coming!' : ''), { force: true });
            K.wait(3500).then(() => { if (alive()) recipes(); });
            return;
          }
          tries++; K.audio.sfx('boing');
          const n = need[wrong] || 0;
          K.voice.say(n === 0 ? `Oops! This recipe has no ${wrong}.` : `Hmm, check the ${wrong}. ${lvl === 3 && wrong === cols[cols.length - 1] ? 'Count how many more you need to make the total.' : `You need ${lvl === 2 ? 'double' : n}${lvl === 2 ? '' : ''}.`} You have ${have[wrong]}.`, { force: true });
        }, { r: T ? 70 : 50, fill: 'url(#gBtnGold)', label: 'make it!' });
        K.voice.say(sayIt + ' Tap the jars, then pull the lever.', { force: true });
      }

      /* ---------- 2. pattern belt ---------- */
      function patterns() {
        const { py, ph } = panel();
        const lvl = Math.max(0, lvlOf(CF.pattern || 0, [5, 10, 15]) - (K.learn.struggling('pattern') ? 1 : 0));
        const cs = K.shuffle(NAMES).slice(0, 3), shapes = K.shuffle(['round', 'heart', 'star', 'wrapped']).slice(0, 3);
        const unitsByLvl = [[[0, 'round'], [1, 'round']], [[0, 'round'], [0, 'round'], [1, 'round']], [[0, 'round'], [1, 'round'], [2, 'round']], null];
        let unit;
        if (lvl < 3) unit = K.pick([unitsByLvl[lvl], lvl ? [[0, 'round'], [1, 'round'], [1, 'round']] : unitsByLvl[0]]).map(([c, s]) => [cs[c], s]);
        else unit = [[cs[0], shapes[0]], [cs[1], shapes[1]], [cs[0], shapes[2]]]; // color and shape both change
        const len = unit.length * 2 + (lvl >= 2 ? 1 : 2);
        const seq = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
        const ans = unit[len % unit.length];
        title(py, "what comes next on the belt?");
        const beltY = py + (T ? 360 : 280);
        const n = len + 1, gap = Math.min(T ? 120 : 110, 900 / n), x0 = 600 - ((n - 1) * gap) / 2;
        K.g(`<rect x="90" y="${beltY - 70}" width="1020" height="140" rx="30" fill="#c9bcd8"/><rect x="90" y="${beltY + 40}" width="1020" height="20" fill="#a99ac0"/>
          ${seq.map(([c, s], i) => `<g transform="translate(${x0 + i * gap} ${beltY})">${candy(c, s, T ? 1.15 : 1)}</g>`).join('')}
          <g transform="translate(${x0 + len * gap} ${beltY})"><circle r="40" fill="#fff" stroke="#ff9ec7" stroke-width="4" stroke-dasharray="8 8"/><text y="18" text-anchor="middle" font-size="52" fill="#ff5fa2">?</text></g>`, pop);
        const say = seq.map(([c, s]) => (lvl >= 3 ? `${c} ${s === 'round' ? 'gumball' : s}` : c)).join(', ');
        K.voice.say(`${say}. What comes next?`, { force: true });
        // choices
        const opts = [ans];
        const pool = [];
        cs.forEach((c) => (lvl >= 3 ? shapes : ['round']).forEach((s) => pool.push([c, s])));
        K.shuffle(pool).forEach((p) => { if (opts.length < (lvl >= 2 ? 4 : 3) && !opts.some((o) => o[0] === p[0] && o[1] === p[1])) opts.push(p); });
        let tries = 0, done = false;
        const cy = py + ph - (T ? 280 : 170);
        K.shuffle(opts).forEach(([c, s], i) => {
          const x = 600 + (i - (opts.length - 1) / 2) * (T ? 240 : 220);
          const g = K.g(`<circle r="${T ? 90 : 70}" fill="#fff" stroke="#f0dcec" stroke-width="6"/>${candy(c, s, T ? 1.5 : 1.2)}`, pop, { class: 'btn', transform: `translate(${x} ${cy})` });
          K.tap(g, () => {
            if (done) return;
            if (c === ans[0] && s === ans[1]) {
              done = true; g.firstChild.setAttribute('stroke', '#5fc48a');
              K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, x, cy);
              CF.pattern = (CF.pattern || 0) + 1; K.save.write(); K.learn.record('pattern', unit.map((u) => u.join('-')).join(' '), tries === 0); K.emit('candyPattern');
              K.voice.say(`Yes! The pattern repeats: ${unit.map(([cc, ss]) => (lvl >= 3 ? `${cc} ${ss === 'round' ? 'gumball' : ss}` : cc)).join(', ')}.${CF.pattern === 5 || CF.pattern === 10 || CF.pattern === 15 ? ' Level up! Trickier patterns!' : ''}`, { force: true });
              K.wait(4000).then(() => { if (alive()) patterns(); });
            } else {
              tries++; K.audio.sfx('boing'); K.replay(g, 'shake', 500);
              K.voice.say(`Not that one. Say the pattern out loud: ${say}...`, { force: true });
            }
          });
        });
      }

      /* ---------- 3. sharing fairly ---------- */
      function sharing() {
        const { py, ph } = panel();
        const lvl = Math.max(0, lvlOf(CF.share || 0, [4, 8, 12]) - (K.learn.struggling('share') ? 1 : 0));
        const friends = [2, K.pick([2, 3]), K.pick([3, 4]), K.pick([2, 3, 4])][lvl];
        const each = K.irand(lvl === 0 ? 1 : 2, [3, 4, 5, 4][lvl]);
        const extra = lvl === 3 ? K.irand(1, friends - 1) : 0;
        const total = friends * each + extra;
        const c = K.pick(NAMES), shape = K.pick(['round', 'drop', 'wrapped']);
        const looks = K.shuffle(S.looks.map((l, i) => i)).slice(0, friends);
        title(py, `share ${total} candies with ${friends} friends`);
        const fy = py + (T ? 300 : 230);
        const plates = looks.map((li, i) => {
          const x = 600 + (i - (friends - 1) / 2) * (T ? 250 : 230);
          K.g(`<g transform="translate(${x} ${fy - 40}) scale(${T ? 0.6 : 0.48})">${A.princessHead(S.looks[li])}</g><ellipse cx="${x}" cy="${fy + 100}" rx="${T ? 100 : 90}" ry="34" fill="#fff" stroke="#f0dcec" stroke-width="5"/>`, pop);
          return { x, n: 0 };
        });
        const pileY = py + ph - (T ? 470 : 250);
        const pile = Array.from({ length: total }, (_, k) => {
          const cols = Math.min(T ? 8 : 9, total), x = 600 + ((k % cols) - (cols - 1) / 2) * (T ? 112 : 96), y = pileY + Math.floor(k / cols) * (T ? 84 : 66);
          const g = K.g(candy(c, shape, T ? 1.1 : 0.9), pop, { class: 'btn', transform: `translate(${x} ${y})` });
          return g;
        });
        let dealt = 0, turn = 0, phase = 'deal';
        pile.forEach((g) => K.tap(g, () => {
          if (phase !== 'deal' || !g.isConnected) return;
          if (dealt >= friends * each) { K.voice.say('Oh! There are not enough left for everyone to get one more.', { force: true }); return; }
          const p = plates[turn];
          g.remove();
          K.g(candy(c, shape, T ? 0.8 : 0.65), pop, { transform: `translate(${p.x - 60 + (p.n % 4) * 40} ${fy + 90 - Math.floor(p.n / 4) * 30})` });
          p.n++; dealt++; turn = (turn + 1) % friends;
          K.audio.sfx('pop');
          if (dealt === friends * each) { phase = 'ask'; K.wait(500).then(ask); }
          else if (dealt === 1) K.voice.say('One for you! Now the next friend. Take turns!', { force: true });
        }));
        K.voice.say(`Share ${total} candies with ${friends} friends so it is fair. Tap a candy to give it out. Take turns!`, { force: true });
        let tries = 0;
        function ask() {
          if (!alive()) return;
          const q = extra ? `Each friend got ${each}. How many candies are left over?` : `How many candies did each friend get?`;
          const ans = extra ? extra : each;
          K.voice.say(q, { force: true });
          K.g(`<text x="600" y="${py + ph - (T ? 300 : 150)}" text-anchor="middle" font-size="${T ? 44 : 36}" fill="#6d4a92">${extra ? 'how many left over?' : 'how many each?'}</text>`, pop);
          numberChoices(py + ph - (T ? 160 : 70), ans, (x, y) => {
            K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, x, y);
            CF.share = (CF.share || 0) + 1; K.save.write(); K.learn.record('share', `${total}/${friends}`, tries === 0); K.emit('candyShare');
            K.voice.say(extra ? `${extra} left over! ${total} shared by ${friends} is ${each} each, with ${extra} left over.` : `${each} each! ${total} shared by ${friends} is ${each}. That is called dividing!${CF.share === 4 || CF.share === 8 || CF.share === 12 ? ' Level up!' : ''}`, { force: true });
            K.wait(4500).then(() => { if (alive()) sharing(); });
          }, (val) => { tries++; K.voice.say(`Not ${val}. Count the candies on one plate.`, { force: true }); }, [-1, 1, 2]);
        }
      }

      /* ---------- 4. candy shop: read the order, add the prices ---------- */
      const MENU = [['lollipop', 'red'], ['gumdrop', 'green'], ['candy cane', 'red'], ['taffy', 'purple'], ['jelly bean', 'orange'], ['mint', 'blue']];
      function shop() {
        const { py, ph } = panel();
        const lvl = Math.max(0, lvlOf(CF.shop || 0, [5, 10, 15]) - (K.learn.struggling('shop') ? 1 : 0));
        const prices = {}; MENU.forEach(([w]) => { prices[w] = lvl < 2 ? K.irand(1, 5) : K.irand(2, 10); });
        const items = K.shuffle(MENU).slice(0, [1, 2, 2, 3][lvl]).map(([w, c]) => ({ w, c, q: lvl >= 2 ? K.irand(1, 2) : 1 }));
        const total = items.reduce((a, it) => a + prices[it.w] * it.q, 0);
        const order = items.map((it) => `${it.q} ${it.w}${it.q > 1 ? 's' : ''}`).join(' and ');
        title(py, 'candy shop');
        // price board
        const bx = T ? 600 : 330, bTop = py + 150;
        K.g(`<rect x="${bx - 230}" y="${bTop}" width="460" height="${MENU.length * 56 + 40}" rx="20" fill="#5a3d6a"/>
          ${MENU.map(([w], i) => `<text x="${bx - 200}" y="${bTop + 60 + i * 56}" font-size="34" fill="#fff">${w}</text><text x="${bx + 200}" y="${bTop + 60 + i * 56}" text-anchor="end" font-size="34" fill="#ffd166">${prices[w]}¢</text>`).join('')}`, pop);
        // the customer's order (reading!)
        const ox = T ? 600 : 840, oy = T ? bTop + MENU.length * 56 + 160 : bTop + 60;
        const f = K.pick(S.looks);
        K.g(`<g transform="translate(${ox} ${oy + (T ? 20 : 40)}) scale(${T ? 0.6 : 0.55})">${A.princessHead(f)}</g>
          <rect x="${ox - 210}" y="${oy + (T ? 120 : 130)}" width="420" height="${T ? 110 : 120}" rx="20" fill="#fff" stroke="#ff9ec7" stroke-width="4"/>
          <text x="${ox}" y="${oy + (T ? 188 : 200)}" text-anchor="middle" font-size="${order.length > 26 ? 26 : 32}" fill="#6d4a92">I want ${order}.</text>`, pop);
        K.voice.say(`A customer is here! Read the order, then find the prices. How many cents in all?`, { force: true });
        const orderTap = K.g(`<rect x="${ox - 210}" y="${oy + (T ? 120 : 130)}" width="420" height="120" fill="#fff" opacity="0"/>`, pop);
        K.tap(orderTap, () => K.voice.say(`I want ${order}.`, { force: true }));
        let tries = 0;
        numberChoices(py + ph - (T ? 150 : 80), total, (x, y) => {
          K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, x, y);
          CF.shop = (CF.shop || 0) + 1; K.save.write(); K.learn.record('shop', order, tries === 0); K.emit('candyShop');
          K.voice.say(`${total} cents! ${items.map((it) => `${it.q > 1 ? it.q + ' ' + it.w + 's at ' + prices[it.w] + ' cents each is ' + prices[it.w] * it.q : it.w + ' is ' + prices[it.w]}`).join(', plus ')}. Thank you!${CF.shop === 5 || CF.shop === 10 || CF.shop === 15 ? ' Level up! Bigger orders!' : ''}`, { force: true });
          K.wait(5500).then(() => { if (alive()) shop(); });
        }, (val) => { tries++; K.voice.say(`Not ${val}. Find each candy on the price board, then add them up.`, { force: true }); }, [-3, -2, -1, 1, 2, 3]);
      }

      K.hintOnce('candy', 'Welcome to the candy factory! Tap the trees and machines for candy facts, or play a game.');
      K.wait(600).then(() => K.voice.say('Welcome to the candy factory! Tap things to learn candy facts, or pick a game.'));
    },
  };
})();
