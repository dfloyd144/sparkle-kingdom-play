/* More Royal School pages: picture stories, letter tracing, telling time, counting coins, and missing letters.
   Each mode gets a ctx from the school scene: { page, answers, card, SC, alive(id) }. */
(function () {
  const A = K.art;
  const M = (K.schoolModes = {});
  const FONT = () => getComputedStyle(K.stage).fontFamily || 'sans-serif';
  const win = (n, x = 600, y = 420) => { K.audio.sfx('fanfare'); K.fx.sparkle(x, y - 170, { n: 22, spread: 160 }); K.fx.stars(n, x, y); };

  /* ================= STORIES: short picture books made of sight words ================= */
  const STORIES = [
    { id: 'cat', title: 'The Cat', pages: [['I see a cat.', 'CAT'], ['The cat can run.', 'CAT'], ['The cat is in a hat!', 'HAT'], ['I like the cat.', 'LOVE']] },
    { id: 'sun', title: 'Up, Up, Up', pages: [['Look at the sun.', 'SUN'], ['The sun is up.', 'SUN'], ['Look at the moon.', 'MOON'], ['The moon is up!', 'MOON']] },
    { id: 'bear', title: 'My Bear', pages: [['I have a bear.', 'BEAR'], ['My bear is big.', 'BEAR'], ['My bear can go to bed.', 'BED'], ['Good night, bear.', 'MOON']] },
    { id: 'duck', title: 'The Duck', pages: [['See the duck.', 'DUCK'], ['The duck is in the tub.', 'TUB'], ['The duck can play.', 'BALL'], ['We like the duck!', 'LOVE']] },
    { id: 'gift', title: 'A Gift', pages: [['Look! A gift!', 'GIFT'], ['It is a cake.', 'CAKE'], ['It is for me!', 'LOVE'], ['Yum, yum, yum!', 'CAKE']] },
    { id: 'snow', title: 'Snow Day', pages: [['It is a snow day.', 'SNOW'], ['I see a big tree.', 'TREE'], ['We go and play.', 'BALL'], ['I like snow!', 'STAR']] },
    { id: 'bee', title: 'The Bee', pages: [['I see a bee.', 'BEE'], ['The bee is little.', 'BEE'], ['The bee can go up.', 'SUN'], ['Bye, bye, bee!', 'BEE']] },
    { id: 'fish', title: 'Red Fish', pages: [['Look at the fish.', 'FISH'], ['The fish is red.', 'FISH'], ['The fish can swim.', 'FISH'], ['I love my fish!', 'LOVE']] },
  ];
  K.storyTitle = (id) => (STORIES.find((s) => s.id === id) || {}).title;
  M.story = {
    icon: `<g transform="translate(0 -4)">${A.icons.book}</g><path d="${A.heart(0.5)}" transform="translate(22 -22)" fill="#ff5fa2"/>`,
    say: 'Story time! Tap a word to hear it.',
    arrow(c, d) {
      const st = c.SC.story, s = STORIES[st.s % STORIES.length];
      st.p += d;
      if (st.p < 0) { st.p = 0; return; }
      if (st.p > s.pages.length) { st.s = (st.s + 1) % STORIES.length; st.p = 0; }
      K.save.write(); K.audio.sfx('swoosh'); this.run(c);
    },
    run(c) {
      c.SC.story = c.SC.story || { s: 0, p: 0 };
      c.SC.storiesRead = c.SC.storiesRead || {};
      const st = c.SC.story, s = STORIES[st.s % STORIES.length];
      c.answers.innerHTML = '';
      if (st.p >= s.pages.length) {
        // stars are earned by reading: find 2 words from the story (tapping through pages earns nothing)
        c.page.innerHTML = `<g class="hear" transform="translate(345 250)"><circle r="112" fill="#fff6fb" stroke="#ffd1e8" stroke-width="5"/><path d="${A.star(70)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="4"/>
            <g transform="translate(70 70)"><circle r="34" fill="#fff" stroke="#ffd1e8" stroke-width="4"/><g transform="scale(.6)">${A.icons.speaker}</g></g></g>
          <text x="850" y="200" text-anchor="middle" font-size="76" fill="#6d4a92"><tspan fill="#ff5fa2">T</tspan>he End!</text>
          <text class="qtxt" x="850" y="290" text-anchor="middle" font-size="40" fill="#a48bc4">find the word</text>`;
        const clean = (w) => w.replace(/[^A-Za-z]/g, '').toLowerCase();
        const wordsOf = (x) => x.pages.flatMap((pg) => pg[0].split(' ').map(clean));
        const mine = [...new Set(wordsOf(s))].filter((w) => w.length >= 2);
        const others = [...new Set(STORIES.flatMap(wordsOf))].filter((w) => w.length >= 2 && !mine.includes(w));
        const today = new Date().toDateString();
        if (!c.SC.storyDay || c.SC.storyDay.d !== today) c.SC.storyDay = { d: today, ids: [] };
        let q = 0, wrong = 0, target = '', last = '';
        const ask = () => {
          target = K.pick(mine.filter((w) => w !== last)); last = target;
          const opts = K.shuffle([target, ...K.shuffle(others.filter((w) => w !== target && w[0] !== target[0])).slice(0, 2)]);
          c.answers.innerHTML = ''; c.answers.dataset.done = '';
          c.page.querySelector('.qtxt').textContent = `find the word (${q + 1} of 2)`;
          K.voice.say(`${q === 0 ? `The end! Now show me you read it. ` : ''}Find the word: ${target}.`, { force: true });
          opts.forEach((w, i) => c.card(300 + i * 300, 610, 260, 150, `<text y="28" text-anchor="middle" font-size="76" fill="#6d4a92">${w}</text>`, async (g) => {
            if (c.answers.dataset.done) return;
            if (w === target) {
              c.answers.dataset.done = '1';
              g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
              K.audio.sfx('chime'); K.voice.say(`${w}! Yes!`);
              await K.wait(1400);
              if (!c.alive('story')) return;
              if (++q < 2) ask(); else finish();
            } else {
              wrong++; K.audio.sfx('boing'); K.replay(g.firstChild, 'shake', 600);
              K.voice.say(`That says ${w}. Find ${target}.`);
            }
          }));
        };
        const finish = () => {
          c.answers.innerHTML = '';
          const again = c.SC.storyDay.ids.includes(s.id);
          const n = again ? 1 : wrong === 0 ? 3 : wrong <= 2 ? 2 : 1;
          c.SC.storyDay.ids.push(s.id);
          c.SC.storiesRead[s.id] = (c.SC.storiesRead[s.id] || 0) + 1;
          K.learn.record('story', s.id, wrong === 0);
          K.save.write();
          c.page.querySelector('.qtxt').textContent = 'tap the arrow for a new story';
          win(n, 600, 330); if (n === 3) K.fx.confetti(50);
          K.emit('storyRead', { id: s.id });
          K.voice.say(again ? `You read ${s.title} again! Try a new story for more stars.` : `You read ${s.title}! Super reader!`);
        };
        K.tap(c.page.querySelector('.hear'), () => { if (target) K.voice.say(`Find the word: ${target}.`, { force: true }); });
        ask();
        return;
      }
      const [sentence, pic] = s.pages[st.p];
      // lay the words out in lines that fit the right-hand page
      const words = sentence.split(' '), lines = [[]];
      let w = 0;
      words.forEach((wd) => { const ww = wd.length * 34 + 26; if (w + ww > 460 && lines[lines.length - 1].length) { lines.push([]); w = 0; } lines[lines.length - 1].push(wd); w += ww; });
      let out = '', i = 0;
      const y0 = 250 - (lines.length - 1) * 48;
      lines.forEach((ln, li) => {
        const tot = ln.reduce((a, wd) => a + wd.length * 34 + 26, -26);
        let x = 850 - tot / 2;
        ln.forEach((wd) => { const ww = wd.length * 34; out += `<g class="sw" data-i="${i}" data-w="${wd.replace(/[^A-Za-z]/g, '')}" transform="translate(${x + ww / 2} ${y0 + li * 96})"><rect x="${-ww / 2 - 8}" y="-62" width="${ww + 16}" height="84" rx="16" fill="#fff" opacity="0"/><text text-anchor="middle" font-size="64" fill="#6d4a92">${wd}</text></g>`; x += ww + 26; i++; });
      });
      c.page.innerHTML = `<g transform="translate(345 250)"><circle r="112" fill="#fff6fb" stroke="#ffd1e8" stroke-width="5"/>${A.spellPic(pic)}</g>
        <text x="345" y="122" text-anchor="middle" font-size="28" fill="#a48bc4">${s.title}</text>${out}
        <text x="1050" y="400" text-anchor="middle" font-size="24" fill="#c9b49a">${st.p + 1} / ${s.pages.length}</text>`;
      const wgs = [...c.page.querySelectorAll('.sw')];
      const glow = (g, on) => { g.querySelector('text').setAttribute('fill', on ? '#ff5fa2' : '#6d4a92'); };
      wgs.forEach((g) => K.tap(g, () => { glow(g, true); K.replay(g.querySelector('text'), 'pop', 400); K.voice.say(g.dataset.w.toLowerCase(), { force: true }); K.wait(700).then(() => glow(g, false)); }));
      let reading = false;
      const readAloud = async () => {
        if (reading) return;
        reading = true;
        K.voice.say(sentence, { force: true });
        for (const g of wgs) { glow(g, true); await K.wait(330 + g.dataset.w.length * 60); glow(g, false); }
        reading = false;
      };
      K.button(c.answers, 600, 612, A.icons.speaker, readAloud, { r: 68, fill: 'url(#gBtnGold)', label: 'read to me' });
      if (st.p === 0) K.voice.say(`${s.title}. Can you read it? Tap a word if you need help.`);
      if (st.p === s.pages.length - 1) K.hint('Tap the arrow to finish the story!');
    },
  };

  /* ================= TRACE: follow the letter with a finger ================= */
  const TRACE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  const FOR = { A: 'APPLE', B: 'BEE', C: 'CAT', D: 'DUCK', F: 'FISH', G: 'GIFT', H: 'HAT', L: 'LOVE', M: 'MOON', P: 'PIG', S: 'STAR', T: 'TREE' };
  const sayCh = (ch) => (/[a-z]/.test(ch) ? `little ${K.letterName(ch.toUpperCase())}` : /[0-9]/.test(ch) ? ch : K.letterName(ch));
  M.trace = {
    icon: `<path d="M-22 22 L-4 -24 L14 22 M-13 4 H5" stroke="#c9a6ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="3 9"/><g transform="translate(18 -6) rotate(35)"><rect x="-6" y="-26" width="12" height="40" rx="4" fill="#ff9ec7"/><path d="M-6 14 L0 26 L6 14Z" fill="#ffe0b3"/></g>`,
    say: 'Trace the letters with your finger!',
    arrow(c, d) { c.SC.traceI = (((c.SC.traceI || 0) + d) % TRACE.length + TRACE.length) % TRACE.length; K.save.write(); K.audio.sfx('swoosh'); this.run(c); },
    run(c) {
      c.SC.traceDone = c.SC.traceDone || {};
      const ch = TRACE[(c.SC.traceI || 0) % TRACE.length];
      const font = FONT();
      c.answers.innerHTML = '';
      let right = '';
      if (/[0-9]/.test(ch)) { const n = +ch; right = Array.from({ length: n }, (_, k) => `<path d="${A.star(16)}" transform="translate(${850 + ((k % 5) - 2) * 50} ${282 + Math.floor(k / 5) * 50})" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>`).join(''); }
      else if (FOR[ch.toUpperCase()]) { const wd = FOR[ch.toUpperCase()]; right = `<g transform="translate(850 300) scale(.62)">${A.spellPic(wd)}</g><text x="850" y="398" text-anchor="middle" font-size="30" fill="#a48bc4">${ch} is for ${wd.toLowerCase()}</text>`; }
      c.page.innerHTML = `<text class="guide" x="345" y="345" text-anchor="middle" font-size="290" fill="#f6efff" stroke="#c9a6ff" stroke-width="5" stroke-dasharray="12 10" style="font-family:${font.replace(/"/g, "'")}">${ch}</text>
        <path class="ink" d="" fill="none" stroke="#ff7fb2" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
        <text x="850" y="190" text-anchor="middle" font-size="54" fill="#6d4a92"><tspan fill="#ff5fa2">t</tspan>race <tspan font-size="70">${ch}</tspan></text>${right}
        <rect class="pad" x="110" y="80" width="480" height="340" fill="#fff" opacity="0"/>`;
      K.voice.say(`Trace ${sayCh(ch)} with your finger!`);
      // targets: points inside the letter, found by drawing it on a hidden canvas
      const cv = document.createElement('canvas'); cv.width = 480; cv.height = 340;
      const cx = cv.getContext('2d'); cx.font = `290px ${font}`; cx.textAlign = 'center'; cx.fillStyle = '#000'; cx.fillText(ch, 235, 265);
      const px = cx.getImageData(0, 0, 480, 340).data, targets = [];
      for (let y = 4; y < 340; y += 16) for (let x = 4; x < 480; x += 16) if (px[(y * 480 + x) * 4 + 3] > 140) targets.push({ x: x + 110, y: y + 80, hit: false });
      const ink = c.page.querySelector('.ink'), pad = c.page.querySelector('.pad'), guide = c.page.querySelector('.guide');
      let d = '', drawing = false, done = false, len = 0, last = null;
      const check = () => {
        const hit = targets.filter((t) => t.hit).length;
        const ok = targets.length >= 8 ? hit / targets.length >= 0.8 : len > 900;
        if (!ok || done) return;
        done = true;
        guide.setAttribute('fill', '#ffc2dc'); guide.setAttribute('stroke', '#ff5fa2'); guide.removeAttribute('stroke-dasharray');
        const first = !c.SC.traceDone[ch];
        c.SC.traceDone[ch] = 1; K.save.write();
        K.learn.record('trace', ch, true);
        win(first ? 2 : 1, 345, 420);
        K.emit('traced', { ch });
        K.voice.say(`${sayCh(ch)}! Beautiful tracing!`);
        K.wait(2600).then(() => { if (c.alive('trace')) this.arrow(c, 1); });
      };
      const at = (e) => {
        const p = K.pt(e);
        if (last) len += Math.hypot(p.x - last.x, p.y - last.y);
        last = p;
        d += (d && drawing ? ' L' : ' M') + p.x.toFixed(0) + ' ' + p.y.toFixed(0);
        ink.setAttribute('d', d);
        targets.forEach((t) => { if (!t.hit && (t.x - p.x) ** 2 + (t.y - p.y) ** 2 < 30 * 30) t.hit = true; });
      };
      pad.addEventListener('pointerdown', (e) => { if (done) return; e.preventDefault(); try { pad.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } drawing = false; last = null; at(e); drawing = true; K.audio.unlock(); });
      pad.addEventListener('pointermove', (e) => { if (!drawing || done) return; at(e); });
      const up = () => { if (!drawing) return; drawing = false; check(); };
      pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up);
      K.button(c.answers, 600, 612, A.icons.again, () => { if (done) return; d = ''; len = 0; ink.setAttribute('d', ''); targets.forEach((t) => (t.hit = false)); K.audio.sfx('swoosh'); }, { r: 60, label: 'start over' });
    },
  };

  /* ================= CLOCK: what time is it? ================= */
  const clockSvg = (h, m) => {
    let nums = '';
    for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; nums += `<text x="${(Math.cos(a) * 104).toFixed(1)}" y="${(Math.sin(a) * 104 + 12).toFixed(1)}" text-anchor="middle" font-size="34" fill="#6d4a92">${i}</text>`; }
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    return `<g transform="translate(345 250)"><circle r="146" fill="#ff9ec7"/><circle r="134" fill="#fff" stroke="#ffd1e8" stroke-width="4"/>${nums}
      <line x1="0" y1="0" x2="0" y2="-66" stroke="#6d4a92" stroke-width="14" stroke-linecap="round" transform="rotate(${ha})"/>
      <line x1="0" y1="0" x2="0" y2="-104" stroke="#ff5fa2" stroke-width="8" stroke-linecap="round" transform="rotate(${ma})"/><circle r="10" fill="#ffd166"/></g>`;
  };
  const timeWords = (h, m) => (m ? `half past ${h}` : `${h} o'clock`);
  M.clock = {
    icon: `<circle r="30" fill="#fff" stroke="#ff9ec7" stroke-width="6"/><path d="M0 0 V-20 M0 0 H14" stroke="#6d4a92" stroke-width="5" stroke-linecap="round"/>`,
    say: 'What time is it?',
    run(c) {
      const SC = c.SC; SC.clockRight = SC.clockRight || 0;
      const half = SC.clockRight >= 8 && !K.learn.struggling('clock') && Math.random() < 0.5;
      const h = K.irand(1, 12), m = half ? 30 : 0, ans = `${h}:${m ? '30' : '00'}`;
      const opts = new Set([ans]);
      if (half) opts.add(`${h}:00`);
      while (opts.size < 3) { const hh = K.irand(1, 12); opts.add(`${hh}:${half && Math.random() < 0.5 ? '30' : '00'}`); }
      c.page.innerHTML = clockSvg(h, m) + `<text x="850" y="215" text-anchor="middle" font-size="58" fill="#6d4a92"><tspan fill="#ff5fa2">w</tspan>hat time?</text>
        <text x="850" y="290" text-anchor="middle" font-size="30" fill="#a48bc4">the short hand shows the hour</text>`;
      K.voice.say('What time is it?');
      let tries = 0;
      c.answers.dataset.done = '';
      K.shuffle([...opts]).forEach((v, i) => c.card(300 + i * 300, 610, 250, 150, `<text y="30" text-anchor="middle" font-size="84" fill="#6d4a92">${v}</text>`, async (g) => {
        if (c.answers.dataset.done) return;
        if (v === ans) {
          c.answers.dataset.done = '1';
          g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
          SC.clockRight++; K.save.write(); K.learn.record('clock', ans, tries === 0);
          win(tries === 0 ? (m ? 4 : 3) : 1, 600, 420); K.emit('clock');
          K.voice.say(`It's ${timeWords(h, m)}! ${K.pick(['Great time telling!', 'You can tell time!', 'Tick tock, you rock!'])}`);
          if (SC.clockRight === 8) K.wait(2400).then(() => K.voice.say('Level up! Now we will learn half past too!'));
          await K.wait(2800);
          if (c.alive('clock')) this.run(c);
        } else {
          tries++; K.audio.sfx('boing'); K.replay(g.firstChild, 'shake', 600);
          K.voice.say(m ? `Not ${v}. The long hand points down to the 6, so it is half past. Where is the short hand?` : `Not ${v}. The long hand points up to the 12. Look at the short hand. Which number does it point to?`);
        }
      }));
    },
  };

  /* ================= COINS: how many cents? ================= */
  const COIN = {
    1: { name: 'penny', r: 34, fill: '#dd8f55', stroke: '#a85e2e', fs: 26 },
    5: { name: 'nickel', r: 42, fill: '#d9dde6', stroke: '#9aa2b0', fs: 30 },
    10: { name: 'dime', r: 30, fill: '#eef0f5', stroke: '#a7aebb', fs: 22 },
  };
  M.coins = {
    icon: `<circle cx="-10" cy="6" r="22" fill="#dd8f55" stroke="#a85e2e" stroke-width="4"/><circle cx="12" cy="-8" r="22" fill="#d9dde6" stroke="#9aa2b0" stroke-width="4"/><text x="12" y="0" text-anchor="middle" font-size="20" fill="#6d6d80">5¢</text>`,
    say: 'Count the coins!',
    run(c) {
      const SC = c.SC; SC.coinRight = SC.coinRight || 0;
      let lvl = SC.coinRight < 6 ? 0 : SC.coinRight < 12 ? 1 : 2;
      if (K.learn.struggling('coins') && lvl > 0) lvl--;
      let coins = [];
      if (lvl === 0) coins = Array(K.irand(1, 5)).fill(1);
      else if (lvl === 1) coins = [5, ...Array(K.irand(0, 4)).fill(1)];
      else { coins = [...Array(K.irand(0, 1)).fill(10), ...Array(K.irand(0, 1)).fill(5), ...Array(K.irand(0, 4)).fill(1)]; if (coins.length < 2) coins = [10, 5, 1]; }
      const total = coins.reduce((a, b) => a + b, 0);
      const n = coins.length, cols = Math.min(5, n), gap = 92;
      const pos = coins.map((_, k) => [345 + ((k % cols) - (cols - 1) / 2) * gap, 250 + (Math.floor(k / cols) - (Math.ceil(n / cols) - 1) / 2) * 96]);
      c.page.innerHTML = coins.map((v, k) => { const o = COIN[v]; return `<g class="coin" data-k="${k}" transform="translate(${pos[k][0]} ${pos[k][1]})"><circle r="${o.r}" fill="${o.fill}" stroke="${o.stroke}" stroke-width="5"/><circle r="${o.r - 9}" fill="none" stroke="${o.stroke}" stroke-width="2" opacity=".5"/><text y="${o.fs * 0.36}" text-anchor="middle" font-size="${o.fs}" fill="#5a4a5a">${v}¢</text></g>`; }).join('')
        + `<text x="850" y="215" text-anchor="middle" font-size="58" fill="#6d4a92"><tspan fill="#ff5fa2">h</tspan>ow many cents?</text>
        <text x="850" y="290" text-anchor="middle" font-size="30" fill="#a48bc4">tap a coin to hear it</text>`;
      const gs = [...c.page.querySelectorAll('.coin')];
      gs.forEach((g) => K.tap(g, () => { const v = coins[+g.dataset.k]; K.replay(g, 'pop', 400); K.voice.say(`${COIN[v].name}, ${v} ${v === 1 ? 'cent' : 'cents'}`, { force: true }); }));
      K.voice.say(lvl === 0 ? 'How many cents? Each penny is one cent.' : 'How many cents? Start with the biggest coin and count on!');
      const countTogether = async () => {
        let run = 0;
        for (let k = 0; k < gs.length; k++) { run += coins[k]; K.replay(gs[k], 'pop', 400); K.fx.number(run, pos[k][0], pos[k][1] - 60, { say: true }); await K.wait(650); }
      };
      const opts = new Set([total]);
      while (opts.size < 3) { const d = total + K.pick([-5, -2, -1, 1, 2, 5]); if (d > 0 && d <= 25) opts.add(d); }
      let tries = 0;
      c.answers.dataset.done = '';
      K.shuffle([...opts]).forEach((v, i) => c.card(300 + i * 300, 610, 230, 150, `<text y="32" text-anchor="middle" font-size="90" fill="#6d4a92">${v}¢</text>`, async (g) => {
        if (c.answers.dataset.done) return;
        if (v === total) {
          c.answers.dataset.done = '1';
          g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
          SC.coinRight++; K.save.write(); K.learn.record('coins', String(total), tries === 0);
          await countTogether();
          win(tries === 0 ? (lvl >= 1 ? 4 : 3) : 1, 600, 420); K.emit('coins');
          K.voice.say(`${total} cents! ${K.pick(['Money smart!', 'Great counting!', 'You could run a shop!'])}`);
          if (SC.coinRight === 6) K.wait(2400).then(() => K.voice.say('Level up! Now a nickel is five cents!'));
          if (SC.coinRight === 12) K.wait(2400).then(() => K.voice.say('Level up! Now a dime is ten cents!'));
          await K.wait(2600);
          if (c.alive('coins')) this.run(c);
        } else {
          tries++; c.answers.dataset.done = '1';
          K.audio.sfx('boing'); K.replay(g.firstChild, 'shake', 600);
          K.voice.say(`Not ${v}. Let's count them together!`);
          await K.wait(1300); await countTogether();
          delete c.answers.dataset.done;
          K.voice.say('How many cents?');
        }
      }));
    },
  };
  /* ================= MISSING LETTER: hear the word, find the missing sound (replaces counting) =================
     Level 0: first letter (c_t -> _at). Level 1: last letter. Level 2: the middle sound (vowels). */
  const MW = ['CAT', 'HAT', 'SUN', 'PIG', 'BED', 'CUP', 'TUB', 'BEE', 'BOW', 'FISH', 'DUCK', 'BELL', 'STAR', 'MOON', 'CAKE', 'BEAR', 'TREE', 'GIFT', 'BALL'];
  const CVC = ['CAT', 'HAT', 'SUN', 'PIG', 'BED', 'CUP', 'TUB'];
  const VOWELS = ['A', 'E', 'I', 'O', 'U'];
  M.missing = {
    icon: `<text y="16" text-anchor="middle" font-size="40" fill="#6d4a92">c<tspan fill="#ff5fa2">_</tspan>t</text>`,
    say: 'Find the missing letter!',
    run(c) {
      const SC = c.SC;
      SC.missRight = SC.missRight || 0;
      let lvl = SC.missRight < 6 ? 0 : SC.missRight < 14 ? 1 : 2;
      if (K.learn.struggling('missing') && lvl > 0) lvl--;
      const list = lvl === 2 ? CVC : MW;
      const word = K.learn.pick('missing', list.filter((w) => w !== SC.lastMiss));
      SC.lastMiss = word;
      const at = lvl === 0 ? 0 : lvl === 1 ? word.length - 1 : 1;
      const ans = word[at];
      // choices: other letters (vowels for the middle sound) that don't make another real word here
      const pool = (lvl === 2 ? VOWELS : 'BCDFGHLMNPRSTW'.split('')).filter((l) => l !== ans);
      const opts = K.shuffle([ans, ...K.shuffle(pool).slice(0, lvl === 0 ? 2 : 3)]);
      const lw = word.toLowerCase(), say = lw;
      const shown = lw.split('').map((ch, i) => (i === at ? '_' : ch));
      const drawWord = (fill) => shown.map((ch, i) => `<text x="${850 + (i - (shown.length - 1) / 2) * 92}" y="250" text-anchor="middle" font-size="96" fill="${i === at ? (fill ? '#ff5fa2' : '#c9b8e8') : '#6d4a92'}">${i === at && fill ? fill : ch}</text>`).join('');
      c.page.innerHTML = `<g class="mpic" transform="translate(340 250)"><circle r="112" fill="#fff6fb" stroke="#ffd1e8" stroke-width="5"/>${A.spellPic(word)}</g>
        <g class="mword">${drawWord('')}</g>
        <text x="850" y="335" text-anchor="middle" font-size="30" fill="#a48bc4">${['what sound does it start with?', 'what sound does it end with?', 'what sound is in the middle?'][lvl]}</text>`;
      const ask = () => K.voice.say(`${say}. ${['What letter does ' + say + ' start with?', 'What letter does ' + say + ' end with?', 'What sound is in the middle of ' + say + '?'][lvl]}`);
      ask();
      K.tap(c.page.querySelector('.mpic'), () => { K.replay(c.page.querySelector('.mpic'), 'pop', 400); ask(); });
      let tries = 0;
      c.answers.dataset.done = '';
      const n = opts.length, gap = n === 3 ? 300 : 230;
      opts.forEach((l, i) => c.card(600 + (i - (n - 1) / 2) * gap, 610, n === 3 ? 220 : 190, 150, `<text y="34" text-anchor="middle" font-size="100" fill="#6d4a92">${l.toLowerCase()}</text>`, async (g) => {
        if (c.answers.dataset.done) return;
        if (l === ans) {
          c.answers.dataset.done = '1';
          g.querySelector('.cr').setAttribute('fill', '#c9f7dd'); g.querySelector('.cr').setAttribute('stroke', '#5fc48a');
          c.page.querySelector('.mword').innerHTML = drawWord(ans.toLowerCase());
          SC.missRight++; K.save.write(); K.learn.record('missing', word, tries === 0);
          win(tries === 0 ? (lvl === 2 ? 4 : 3) : 1, 600, 420); K.emit('missing', { word });
          K.voice.say(`${K.letterName ? K.letterName(ans) : ans.toLowerCase()}! ${say}! ${K.pick(['Super listening!', 'You found it!', 'Great sounding out!'])}`);
          if (SC.missRight === 6) K.wait(2400).then(() => K.voice.say('Level up! Now find the last letter!'));
          if (SC.missRight === 14) K.wait(2400).then(() => K.voice.say('Level up! Now find the middle sound!'));
          await K.wait(2800);
          if (c.alive('missing')) M.missing.run(c);
        } else {
          tries++;
          K.audio.sfx('boing'); K.replay(g.firstChild, 'shake', 600);
          K.voice.say(`That's ${K.letterName ? K.letterName(l) : l.toLowerCase()}. Listen: ${say}. Try again!`);
          if (tries >= 2) { const right = [...c.answers.children].find((x) => x.textContent.trim() === ans.toLowerCase()); if (right) right.querySelector('.cr').setAttribute('stroke', '#ffd166'); }
        }
      }));
    },
  };
})();
