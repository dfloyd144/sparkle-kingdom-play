/* Magic Spell Book: look at the picture, spell the word on the big keyboard, and the picture comes alive */
(function () {
  const A = K.art;
  const BASE = ['CAT', 'SUN', '*0', 'PIG', 'HAT', 'BED', 'CUP', 'BEE', 'BOW', 'TUB', 'STAR', 'MOON', 'FISH', 'CAKE', 'DUCK', 'BALL', 'LOVE', 'BEAR', 'TREE', 'BELL', 'GIFT', 'SNOW', 'APPLE', 'CROWN', '*rest', '*uni'];
  const clean = (s) => (s || '').toUpperCase().replace(/[^A-Z]/g, '');
  K.spellWords = () => {
    const S = K.save.data;
    const names = S.names.map(clean).filter((n) => n.length >= 3 && n.length <= 7);
    const out = [];
    BASE.forEach((w) => {
      if (w === '*0') { if (names[0]) out.push(names[0]); }
      else if (w === '*rest') names.slice(1).forEach((n) => out.push(n));
      else if (w === '*uni') { const u = clean(S.unicorn.name); if (u.length >= 3 && u.length <= 7) out.push(u); }
      else out.push(w);
    });
    return out.filter((w, i) => out.indexOf(w) === i);
  };
  const MAGIC_SFX = { CAT: 'giggle', DUCK: 'quack', BEE: 'flutter', BELL: 'chime', SUN: 'chime', STAR: 'sparkle', FISH: 'splash', BALL: 'boing', PIG: 'giggle', SNOW: 'sparkle', TUB: 'splash', CUP: 'pour' };

  K.scenes.spellbook = {
    enter(root) {
      const SP = K.spellState();
      const words = K.spellWords();
      K.hintOnce('spellbook', 'Welcome to the royal school! Spell, read stories, trace letters, find missing letters, do math, tell time and count coins. Harder games earn more stars!');
      const SC = (K.save.data.school = K.save.data.school || { mode: 'spell', readStreak: 0, readRight: 0, countRight: 0, countStreak: 0 });
      if (SC.mode === 'count') SC.mode = 'missing';

      /* ---------- library ---------- */
      let stripes = '';
      for (let x = -900; x < 2100; x += 70) stripes += `<rect x="${x}" y="-700" width="35" height="1500" fill="#fff" opacity=".3"/>`;
      const shelf = (x) => {
        let s = `<rect x="${x - 95}" y="-40" width="190" height="760" fill="#e9b98f"/>`;
        for (let r = 0; r < 6; r++) {
          const y = 40 + r * 120;
          s += `<rect x="${x - 95}" y="${y + 70}" width="190" height="14" fill="#c98d66"/>`;
          let bx = x - 86;
          for (let b = 0; b < 7; b++) { const w = 18 + ((b * 7 + r * 3) % 4) * 4, h = 50 + ((b + r) % 3) * 8; s += `<rect x="${bx}" y="${y + 70 - h}" width="${w}" height="${h}" rx="3" fill="${['#ff9ec7', '#c9a6ff', '#9fd2ff', '#fff08a', '#a6eec0', '#ffb38a'][(b + r) % 6]}"/>`; bx += w + 4; }
        }
        return s;
      };
      K.g(`<rect x="-900" y="-700" width="3000" height="1500" fill="#efe3ff"/>${stripes}${shelf(-30)}${shelf(1230)}
        <rect x="-900" y="440" width="3000" height="900" fill="#e4d4fb"/><ellipse cx="600" cy="620" rx="560" ry="190" fill="#f6eeff"/>`, root);

      /* ---------- the big book ---------- */
      K.g(`<path d="M96 70 Q600 40 1104 70 L1112 430 Q600 410 88 430Z" fill="#9a7fe0"/>
        <path d="M110 74 Q360 54 600 92 V420 Q360 386 106 410Z" fill="#fffaf2" stroke="#e8d6bc" stroke-width="3"/>
        <path d="M1090 74 Q840 54 600 92 V420 Q840 386 1094 410Z" fill="#fffaf2" stroke="#e8d6bc" stroke-width="3"/>
        <path d="M600 92 V420" stroke="#d9c3a3" stroke-width="5"/>
        ${A.sparkle4(150, 110, 10, '#ffd166')}${A.sparkle4(1050, 380, 9, '#c9a6ff')}`, root);
      const page = K.g('', root);
      const sticker = K.g('', root);
      const arrows = K.g('', root);
      let ui = null, nextBtn = null;
      const answers = K.g('', root);
      const tabs = K.g('', root);
      const XM = K.schoolModes || {};
      const MODES = [
        { id: 'spell', icon: A.icons.keyboard, say: 'Spell the word!' },
        { id: 'read', icon: A.icons.book, say: 'Read the word!' },
        ...['story', 'trace'].filter((id) => XM[id]).map((id) => ({ id, icon: XM[id].icon, say: XM[id].say })),
        ...['missing'].filter((id) => XM[id]).map((id) => ({ id, icon: XM[id].icon, say: XM[id].say })), // counting was too easy: replaced
        { id: 'math', icon: `<text y="18" text-anchor="middle" font-size="54" fill="#ff5fa2">+<tspan fill="#6d4a92">−</tspan></text>`, say: 'Adding and taking away!' },
        ...['clock', 'coins'].filter((id) => XM[id]).map((id) => ({ id, icon: XM[id].icon, say: XM[id].say })),
      ];
      const ctx = { page, answers, root, SC, card: (...a) => card(...a), alive: (id) => SC.mode === id && page.isConnected };
      const WORD = { spell: 'spelling', read: 'reading', story: 'story', trace: 'tracing', math: 'math', clock: 'clock', coins: 'coin', missing: 'missing letter' };
      const resting = (id) => !!(SC.resting && SC.resting[id]);
      // a game that has been played a lot takes a nap; school moves her to a different game
      K.schoolRest = (kind) => {
        if (!page.isConnected) return;
        const choices = MODES.filter((m) => m.id !== kind && !resting(m.id));
        const nxt = K.pick(choices.length ? choices : MODES.filter((m) => m.id !== kind));
        SC.mode = nxt.id; K.save.write(); // stops the old game from starting another question
        K.wait(4200).then(() => {
          if (!page.isConnected) return;
          drawTabs(); render();
          K.voice.say(`Great job! The ${WORD[kind] || kind} game needs a little nap. Let's try the ${WORD[nxt.id] || nxt.id} game! ${nxt.say}`);
        });
      };
      const pickMode = (m) => {
        if (resting(m.id)) { K.audio.sfx('boing'); K.voice.say(`Shh! The ${WORD[m.id] || m.id} game is napping. Play a different game, and it will wake up soon.`); return; }
        if (SC.mode === m.id) return; SC.mode = m.id; K.save.write(); drawTabs(); K.voice.say(m.say); render(); };
      function drawTabs() {
        tabs.innerHTML = '';
        // how much wall is showing above the book?
        let top = 64;
        try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); top = Math.max(-2000, (Math.max(r.top, 0) - m.f) / m.d); } catch (e) { /* default */ }
        const free = 66 - top, n = MODES.length;
        const lay = free >= 420 ? { r: 84, rows: 2, gap: 220, y: [(top + 66) / 2 - 100, (top + 66) / 2 + 100] }
          : free >= 230 ? { r: 60, rows: 1, gap: 140, y: [(top + 66) / 2] }
          : null;
        if (!lay) {
          // wide screens have no room above the book: one button (showing this game) opens a big game picker
          const curM = MODES.find((m) => m.id === SC.mode) || MODES[0];
          K.button(tabs, 690, 112, `<g transform="scale(1.05)">${curM.icon}</g>`, openPicker, { r: 50, fill: 'url(#gBtnGold)', label: 'games' });
          return;
        }
        const per = Math.ceil(n / lay.rows);
        MODES.forEach((m, i) => {
          const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, n - row * per);
          const nap = resting(m.id) ? `<g transform="translate(34 -34)"><circle r="20" fill="#6d4a92"/><path d="M6 -10 A12 12 0 1 0 6 10 A9 9 0 1 1 6 -10Z" fill="#fff3a8"/></g>` : '';
          const b = K.button(tabs, 600 + (col - (inRow - 1) / 2) * lay.gap, lay.y[row], `<g transform="scale(1.05)" opacity="${nap ? 0.4 : 1}">${m.icon}</g>${nap}`, () => pickMode(m), { r: lay.r, fill: SC.mode === m.id ? 'url(#gBtnGold)' : 'url(#gBtn)', cls: SC.mode === m.id ? 'sel' : '' });
          void b;
        });
      }
      function openPicker() {
        K.voice.say('Pick a game!');
        const ov = K.g('<rect x="-900" y="-1200" width="3000" height="3400" fill="#6d4a92" opacity=".35"/><rect x="170" y="190" width="860" height="470" rx="50" fill="#fff6fb" stroke="#ffd1e8" stroke-width="8"/>', root);
        K.tap(ov.firstChild, () => ov.remove());
        MODES.forEach((m, i) => {
          const sel = SC.mode === m.id;
          K.button(ov, 600 + ((i % 4) - 1.5) * 200, 315 + Math.floor(i / 4) * 220, `<g transform="scale(1.05)" opacity="${resting(m.id) ? 0.4 : 1}">${m.icon}</g>${resting(m.id) ? '<text x="34" y="-30" font-size="34">🌙</text>' : ''}`, () => { ov.remove(); pickMode(m); }, { r: 84, fill: sel ? 'url(#gBtnGold)' : 'url(#gBtn)', cls: sel ? 'sel' : '' });
        });
      }
      drawTabs();

      /* ---------- READ: which word goes with the picture? ---------- */
      const READ_WORDS = ['CAT', 'SUN', 'PIG', 'HAT', 'BED', 'CUP', 'BEE', 'BOW', 'TUB', 'STAR', 'MOON', 'FISH', 'CAKE', 'DUCK', 'BALL', 'LOVE', 'BEAR', 'TREE', 'BELL', 'GIFT', 'APPLE', 'CROWN'];
      const card = (x, y, w, h, inner, onTap) => {
        const g = K.g(`<g class="inner pop-in"><rect x="${-w / 2}" y="${-h / 2 + 7}" width="${w}" height="${h}" rx="30" fill="#d9c6ef"/><rect class="cr" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="30" fill="#fff" stroke="#e8dcf8" stroke-width="6"/>${inner}</g>`, answers, { class: 'btn', transform: `translate(${x} ${y})` });
        K.tap(g, () => onTap(g));
        return g;
      };
      function readQuestion() {
        answers.innerHTML = '';
        const target = K.learn.pick('read', READ_WORDS.filter((w) => w !== SC.lastRead));
        SC.lastRead = target;
        const easy = K.learn.struggling('read');
        const hard = !easy && SC.readStreak >= 5;
        const pool = READ_WORDS.filter((w) => w !== target && (hard ? w.length === target.length : w[0] !== target[0]));
        const opts = K.shuffle([target, ...K.shuffle(pool).slice(0, easy ? 1 : 2)]);
        page.innerHTML = `<g transform="translate(340 250)"><circle r="112" fill="#fff6fb" stroke="#ffd1e8" stroke-width="5"/>${A.spellPic(target)}</g>
          <text x="850" y="215" text-anchor="middle" font-size="64" fill="#6d4a92"><tspan fill="#ff5fa2">w</tspan>hich word?</text>
          <text x="850" y="300" text-anchor="middle" font-size="36" fill="#a48bc4">tap the right word</text>`;
        K.voice.say('Which word goes with the picture?');
        let tries = 0;
        opts.forEach((w, i) => {
          card(300 + i * 300, 610, 270, 150, `<text y="26" text-anchor="middle" font-size="80" fill="#6d4a92"><tspan fill="#ff5fa2">${w[0].toLowerCase()}</tspan>${w.slice(1).toLowerCase()}</text>`, async (g) => {
            if (answers.dataset.done) return;
            if (w === target) {
              answers.dataset.done = '1';
              g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
              K.audio.sfx('fanfare');
              SC.readRight++; SC.readStreak++; K.save.write(); K.learn.record('read', w, tries === 0);
              K.voice.say(`${w.toLowerCase()}! ${K.pick(['Great reading!', 'You read it!', 'Super reader!'])}`);
              K.fx.sparkle(340, 250, { n: 24, spread: 160 });
              K.fx.stars(1, 600, 420);
              K.emit('read', { word: w });
              if (SC.readStreak % 5 === 0) { K.wait(900).then(() => { K.fx.confetti(60); K.fx.stars(2, 600, 300); K.voice.say(`${SC.readStreak} words in a row! Bonus stars!`); }); }
              await K.wait(2600);
              delete answers.dataset.done;
              if (SC.mode === 'read') readQuestion();
            } else {
              tries++; SC.readStreak = 0;
              K.audio.sfx('boing');
              K.replay(g.firstChild, 'shake', 600);
              K.voice.say(`That says ${w.toLowerCase()}. Which one says ${target.toLowerCase()}?`);
              const right = [...answers.children].find((c) => c.textContent.toUpperCase() === target);
              if (tries >= 2 && right) right.querySelector('.cr').setAttribute('stroke', '#ffd166');
            }
          });
        });
      }

      /* ---------- COUNT: how many? (then simple adding) ---------- */
      const THINGS = [['apple', A.icons.apple], ['star', A.icons.star], ['heart', A.icons.heart], ['cupcake', A.icons.cupcake], ['flower', A.icons.flower]];
      function countQuestion() {
        answers.innerHTML = '';
        const adding = false;
        const max = K.learn.struggling('count') ? 5 : Math.min(10, 5 + Math.floor(SC.countRight / 4));
        let a = K.irand(1, adding ? Math.min(5, max - 1) : max), b = adding ? K.irand(1, Math.min(5, max - a)) : 0;
        const n = a + b;
        const [thing, icon] = K.pick(THINGS);
        let items = '';
        const place = (k, total, x0, w) => { const cols = total > 5 ? 5 : total, row = Math.floor(k / cols), col = k % cols, rows = Math.ceil(total / cols); return [x0 + (col - (cols - 1) / 2) * w, 250 + (row - (rows - 1) / 2) * 92]; };
        if (adding) {
          for (let k = 0; k < a; k++) { const [x, y] = place(k, a, 230, 62); items += `<g class="cnt" data-k="${k}" transform="translate(${x} ${y}) scale(.75)">${icon}<circle r="40" fill="#fff" opacity="0"/></g>`; }
          items += '<text x="340" y="268" text-anchor="middle" font-size="64" fill="#ff5fa2">+</text>';
          for (let k = 0; k < b; k++) { const [x, y] = place(k, b, 470, 62); items += `<g class="cnt" data-k="${a + k}" transform="translate(${x} ${y}) scale(.75)">${icon}<circle r="40" fill="#fff" opacity="0"/></g>`; }
        } else {
          for (let k = 0; k < n; k++) { const [x, y] = place(k, n, 340, 86); items += `<g class="cnt" data-k="${k}" transform="translate(${x} ${y}) scale(.95)">${icon}<circle r="40" fill="#fff" opacity="0"/></g>`; }
        }
        page.innerHTML = items + `<text x="850" y="215" text-anchor="middle" font-size="64" fill="#6d4a92"><tspan fill="#ff5fa2">h</tspan>ow many?</text>
          <text x="850" y="300" text-anchor="middle" font-size="36" fill="#a48bc4">${adding ? "count them all" : "tap each one to count"}</text>`;
        const plural = thing === 'cupcake' ? 'cupcakes' : thing + 's';
        K.voice.say(adding ? `${a} ${a === 1 ? thing : plural} and ${b} more. How many altogether?` : `How many ${plural}?`);
        // tapping the things counts them out loud
        let counted = 0;
        page.querySelectorAll('.cnt').forEach((g) => K.tap(g, () => {
          if (g.dataset.c) return; g.dataset.c = '1'; counted++;
          g.setAttribute('opacity', 0.45);
          const m = g.transform.baseVal[0].matrix; K.fx.number(counted, m.e, m.f - 60);
        }));
        const opts = new Set([n]);
        while (opts.size < 3) { const d = n + K.pick([-2, -1, 1, 2]); if (d >= 1 && d <= 10) opts.add(d); }
        let tries = 0;
        K.shuffle([...opts]).forEach((v, i) => {
          card(300 + i * 300, 610, 220, 150, `<text y="34" text-anchor="middle" font-size="104" fill="#6d4a92">${v}</text>`, async (g) => {
            if (answers.dataset.done) return;
            if (v === n) {
              answers.dataset.done = '1';
              g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
              SC.countRight++; SC.countStreak = (SC.countStreak || 0) + 1; K.save.write(); K.learn.record('count', String(n), tries === 0);
              // count them out loud together
              const all = [...page.querySelectorAll('.cnt')];
              for (let k = 0; k < all.length; k++) { const m = all[k].transform.baseVal[0].matrix; K.replay(all[k].firstElementChild, 'pop', 400); K.fx.number(k + 1, m.e, m.f - 60, { say: true }); await K.wait(520); }
              K.audio.sfx('fanfare');
              K.voice.say(`${n}! ${K.pick(['Great counting!', 'You got it!', 'Super counter!'])}`);
              K.fx.stars(tries === 0 ? 2 : 1, 600, 420);
              K.emit('counted', { n });
              if (SC.countStreak % 5 === 0) { K.wait(900).then(() => { K.fx.confetti(60); K.fx.stars(3, 600, 300); K.voice.say(`${SC.countStreak} in a row! Bonus stars!`); }); }
              await K.wait(2400);
              delete answers.dataset.done;
              if (SC.mode === 'count') countQuestion();
            } else {
              tries++; SC.countStreak = 0;
              K.audio.sfx('boing');
              K.replay(g.firstChild, 'shake', 600);
              K.voice.say(`Not ${v}. Let's tap each one and count!`);
            }
          });
        });
      }

      /* ---------- MATH: adding and taking away, with pictures to count ---------- */
      // Levels grow slowly: 1) add within 5  2) add + take away within 5  3) add within 10  4) both within 10
      const MATH_THINGS = [['apple', A.icons.apple, 'eats', 'Sparkle eats'], ['star', A.icons.star, 'float away', 'float away'], ['cupcake', A.icons.cupcake, 'get eaten', 'get eaten'], ['flower', A.icons.flower, 'get picked', 'get picked'], ['heart', A.icons.heart, 'float away', 'float away']];
      function mathQuestion() {
        answers.innerHTML = '';
        SC.mathRight = SC.mathRight || 0;
        let lvl = SC.mathRight < 6 ? 0 : SC.mathRight < 12 ? 1 : SC.mathRight < 20 ? 2 : 3;
        if (K.learn.struggling('math') && lvl > 0) lvl--;
        const max = lvl >= 2 ? 10 : 5;
        let sub = lvl === 0 ? false : lvl === 2 ? Math.random() < 0.35 : Math.random() < 0.5;
        const subMax = lvl === 3 ? 10 : 5;
        let a, b, ans;
        if (sub) { a = K.irand(2, subMax); b = K.irand(1, a - 1); ans = a - b; }
        else { a = K.irand(1, max - 1); b = K.irand(1, Math.min(max - a, lvl >= 2 ? 5 : 4)); ans = a + b; }
        // sometimes bring back a fact she missed before (if it fits this level)
        const redo = Math.random() < 0.35 && K.learn.tricky('math').map((f) => f.match(/^(\d+)([+-])(\d+)$/)).filter(Boolean)
          .find((mm) => (mm[2] === '-' ? lvl > 0 && +mm[1] <= subMax : +mm[1] + +mm[3] <= max));
        if (redo) { sub = redo[2] === '-'; a = +redo[1]; b = +redo[3]; ans = sub ? a - b : a + b; }
        const [thing, icon] = K.pick(MATH_THINGS);
        const plural = thing + 's';
        const one = (n) => (n === 1 ? thing : plural);
        // picture layout on the left page
        const grid = (n, cx, cols, gap) => Array.from({ length: n }, (_, k) => { const c = Math.min(cols, n), r = Math.floor(k / cols), col = k % cols, rows = Math.ceil(n / cols); return [cx + (col - (c - 1) / 2) * gap, 252 + (r - (rows - 1) / 2) * gap]; });
        let pics = '';
        const item = (k, x, y, grp) => `<g class="mi" data-k="${k}" data-g="${grp}" transform="translate(${x} ${y}) scale(.86)"><g class="mi-in">${icon}</g><circle r="38" fill="#fff" opacity="0"/></g>`;
        let pos = [];
        if (sub) {
          pos = grid(a, 345, 5, 88);
          pos.forEach(([x, y], k) => { pics += item(k, x, y, k >= a - b ? 'away' : 'stay'); });
        } else {
          const pa = grid(a, 205, 3, 68), pb = grid(b, 495, 3, 68);
          pa.forEach(([x, y], k) => { pics += item(k, x, y, 'a'); });
          pics += '<text x="350" y="276" text-anchor="middle" font-size="72" fill="#ff5fa2">+</text>';
          pb.forEach(([x, y], k) => { pics += item(a + k, x, y, 'b'); });
        }
        const op = sub ? '−' : '+';
        const sentence = (q) => `<text x="850" y="232" text-anchor="middle" font-size="96" fill="#6d4a92">${a} <tspan fill="#ff5fa2">${op}</tspan> ${b} <tspan fill="#ff5fa2">=</tspan> <tspan fill="${q === '?' ? '#e6a52e' : '#5fc48a'}">${q}</tspan></text>`;
        page.innerHTML = pics + `<g class="sent">${sentence('?')}</g><text x="850" y="320" text-anchor="middle" font-size="36" fill="#a48bc4">${sub ? 'how many are left?' : 'how many in all?'}</text>`;
        const sentG = page.querySelector('.sent');
        const items = () => [...page.querySelectorAll('.mi')];
        const story = sub ? `${a} ${one(a)}. ${b} ${b === 1 ? 'goes' : 'go'} away. How many are left?` : `${a} ${one(a)}, and ${b} more. How many in all?`;
        K.voice.say(story);
        // taking away: the "away" ones float off and leave a dotted outline, so she can still see what happened
        if (sub) {
          K.wait(1600).then(async () => {
            for (const g of items().filter((g) => g.dataset.g === 'away')) {
              const m = g.transform.baseVal[0].matrix, x0 = m.e, y0 = m.f;
              K.audio.sfx('whoosh');
              await K.tween(450, (t) => { g.setAttribute('transform', `translate(${x0} ${y0 - 50 * t}) scale(.86)`); g.setAttribute('opacity', (1 - t * 0.8).toFixed(2)); });
              g.setAttribute('transform', `translate(${x0} ${y0}) scale(.86)`);
              g.firstElementChild.setAttribute('opacity', '0.18');
              g.insertAdjacentHTML('beforeend', '<circle r="40" fill="none" stroke="#c9a6ff" stroke-width="5" stroke-dasharray="8 8"/>');
              g.dataset.gone = '1';
            }
          });
        }
        // tap any picture to count it out loud
        let tapped = 0;
        items().forEach((g) => K.tap(g, () => {
          if (g.dataset.gone || g.dataset.c) return;
          g.dataset.c = '1'; tapped++;
          g.firstElementChild.setAttribute('opacity', '0.55');
          const m = g.transform.baseVal[0].matrix; K.fx.number(tapped, m.e, m.f - 56);
        }));
        async function countTogether() {
          const list = items().filter((g) => !g.dataset.gone);
          list.forEach((g) => { delete g.dataset.c; g.firstElementChild.setAttribute('opacity', '1'); });
          tapped = 0;
          for (let k = 0; k < list.length; k++) { const m = list[k].transform.baseVal[0].matrix; K.replay(list[k].firstElementChild, 'pop', 400); K.fx.number(k + 1, m.e, m.f - 56, { say: true }); await K.wait(560); }
        }
        const opts = new Set([ans]);
        while (opts.size < 3) { const d = ans + K.pick([-2, -1, 1, 2]); if (d >= 0 && d <= 10) opts.add(d); }
        let tries = 0;
        K.shuffle([...opts]).forEach((v, i) => {
          card(300 + i * 300, 610, 220, 150, `<text y="34" text-anchor="middle" font-size="104" fill="#6d4a92">${v}</text>`, async (g) => {
            if (answers.dataset.done) return;
            if (v === ans) {
              answers.dataset.done = '1';
              g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
              SC.mathRight++; SC.mathStreak = (SC.mathStreak || 0) + 1; K.save.write(); K.learn.record('math', `${a}${sub ? '-' : '+'}${b}`, tries === 0);
              // adding: the second group slides over to join the first
              if (!sub) {
                const bs = items().filter((x) => x.dataset.g === 'b');
                const all = grid(a + b, 345, 5, 88);
                const movers = items();
                await K.tween(600, (t) => movers.forEach((x, k) => { const m = x.transform.baseVal[0].matrix; const [tx, ty] = all[k]; x.setAttribute('transform', `translate(${K.lerp(m.e, tx, t * 0.35)} ${K.lerp(m.f, ty, t * 0.35)}) scale(.86)`); }));
                movers.forEach((x, k) => x.setAttribute('transform', `translate(${all[k][0]} ${all[k][1]}) scale(.86)`));
                page.querySelectorAll('text').forEach((tx) => { if (tx.textContent === '+') tx.remove(); });
                void bs;
              }
              sentG.innerHTML = sentence(ans);
              await countTogether();
              K.audio.sfx('fanfare');
              K.voice.say(`${a} ${sub ? 'take away' : 'plus'} ${b} equals ${ans}! ${K.pick(['Math star!', 'You figured it out!', 'Super smart!'])}`);
              K.fx.sparkle(850, 230, { n: 20, spread: 160 });
              K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, 600, 420);
              K.emit('math', { sub });
              if (SC.mathStreak % 5 === 0) { K.wait(1200).then(() => { K.fx.confetti(60); K.fx.stars(3, 600, 300); K.voice.say(`${SC.mathStreak} in a row! Bonus stars!`); }); }
              if ([6, 12, 20].includes(SC.mathRight)) K.wait(2600).then(() => K.voice.say(SC.mathRight === 6 ? 'Level up! Now we will take away too!' : SC.mathRight === 12 ? 'Level up! Bigger numbers, up to ten!' : 'Level up! Adding and taking away up to ten!'));
              await K.wait(2800);
              delete answers.dataset.done;
              if (SC.mode === 'math') mathQuestion();
            } else {
              tries++; SC.mathStreak = 0;
              K.audio.sfx('boing');
              K.replay(g.firstChild, 'shake', 600);
              K.voice.say(sub ? `Not ${v}. Let's count the ones that are left!` : `Not ${v}. Let's count them all together!`);
              answers.dataset.done = '1';
              await K.wait(1500);
              await countTogether();
              delete answers.dataset.done;
              K.voice.say(sub ? 'How many are left?' : 'How many in all?');
            }
          });
        });
      }

      function render() {
        if (ui) { ui.destroy(); ui = null; }
        answers.innerHTML = ''; page.innerHTML = '';
        if (nextBtn) { nextBtn.remove(); nextBtn = null; }
        if (SC.mode === 'read') { sticker.innerHTML = ''; return readQuestion(); }
        if (SC.mode === 'count') { sticker.innerHTML = ''; return countQuestion(); }
        if (SC.mode === 'math') { sticker.innerHTML = ''; return mathQuestion(); }
        if (XM[SC.mode]) { sticker.innerHTML = ''; return XM[SC.mode].run(ctx); }
        const idx = ((SP.page % words.length) + words.length) % words.length;
        const word = words[idx];
        sticker.innerHTML = SP.done.includes(word) ? `<g transform="translate(1046 116)"><circle r="30" fill="url(#gGlow)"/><path d="${A.star(24)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/></g>` : '';
        page.innerHTML = `<text x="1050" y="400" text-anchor="middle" font-size="24" fill="#c9b49a">${idx + 1}</text>`;
        if (nextBtn) { nextBtn.remove(); nextBtn = null; }
        ui = K.spell(page, {
          word, picture: A.spellPic(word), picAt: [340, 250], boxAt: [850, 230], maxW: 430,
          onDone: (r) => magic(word, r),
        });
      }
      function flip(d) {
        if (XM[SC.mode] && XM[SC.mode].arrow) return XM[SC.mode].arrow(ctx, d);
        SP.page += d; K.save.write();
        K.audio.sfx('swoosh');
        render();
      }
      K.button(arrows, 160, 380, A.icons.arrowL, () => flip(-1), { r: 40, fill: 'url(#gBtnGold)' });
      K.button(arrows, 1040, 380, A.icons.arrowR, () => flip(1), { r: 40, fill: 'url(#gBtnGold)' });

      async function magic(word, r) {
        const first = !SP.done.includes(word);
        if (first) { SP.done.push(word); K.save.write(); }
        K.learn.record('spell', word, r.wrongs === 0);
        K.emit('spelled', { word });
        K.audio.sfx(MAGIC_SFX[word] || 'sparkle');
        K.fx.confetti(40);
        // the picture floats out of the book and dances
        const pop = K.g(`<g>${A.spellPic(word)}</g>`, K.layers.fx);
        await K.tween(700, (t) => K.place(pop, K.lerp(340, 600, t), K.lerp(250, 300, t) - Math.sin(t * Math.PI) * 80, 1 + t * 0.6, Math.sin(t * Math.PI * 4) * 10));
        K.fx.sparkle(600, 300, { n: 26, spread: 220 });
        K.fx.hearts(600, 260, 6);
        K.fx.stars(first ? (r.wrongs === 0 ? 3 : 2) : 1, 600, 300);
        await K.wait(1200);
        await K.tween(500, (t) => { K.place(pop, K.lerp(600, 340, t), K.lerp(300, 250, t), 1.6 - t * 0.6); pop.setAttribute('opacity', 1 - t); });
        pop.remove();
        render.lastWord = word;
        sticker.innerHTML = `<g transform="translate(1046 116)" class="pop-in"><circle r="30" fill="url(#gGlow)"/><path d="${A.star(24)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/></g>`;
        nextBtn = K.g(`<g class="bob"><circle r="62" fill="url(#gGlow)"/><circle r="50" fill="url(#gBtnGold)" stroke="#fff" stroke-width="6"/>${A.icons.arrowR}</g>`, root, { transform: 'translate(1040 380)' });
        K.tap(nextBtn, () => flip(1));
        K.voice.say(r.wrongs === 0 ? 'Perfect spelling! Turn the page for a new word!' : 'You did it! Turn the page for a new word!');
      }
      render();
    },
  };
})();
