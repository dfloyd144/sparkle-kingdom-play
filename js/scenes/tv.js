/* TV show: "Bubbles and Clover" - short cartoons about an axolotl and a bunny who are best friends.
   She reads along (tap a word to hear it). Each show teaches one true animal fact and ends with one
   question about it. Stars only come from the question, once a day per show, so there is nothing to farm. */
(function () {
  const A = K.art, I = A.icons;
  I.tv = `<path d="M-12 -36 L0 -24 L12 -36" stroke="#8d62c2" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="-32" y="-24" width="64" height="46" rx="10" fill="#b48ad8" stroke="#8d62c2" stroke-width="3"/><rect x="-25" y="-17" width="50" height="32" rx="6" fill="#dff4ff"/>
    <path d="${A.heart(0.9)}" transform="translate(0 1)" fill="#ff8fb8"/><path d="M-16 28 H16" stroke="#8d62c2" stroke-width="5" stroke-linecap="round"/>`;

  // b = where Bubbles is, c = where Clover is, act = how they move, prop = an extra picture, s = a sound
  const SHOWS = [
    { id: 'stare', title: 'The Staring Contest', pages: [
      { t: 'Bubbles the axolotl lives in the pond. Clover the bunny lives on the grass.', b: 'pond', c: 'grass', act: 'both' },
      { t: 'They are best friends. Every morning Clover hops to the pond to play.', b: 'edge', c: 'edge', act: 'hop', prop: 'heart' },
      { t: '"Let us have a staring contest," said Clover. "Do not blink!"', b: 'edge', c: 'edge', act: 'stare' },
      { t: 'Clover stared and stared. Her eyes began to itch. Blink! Bubbles won.', b: 'edge', c: 'edge', act: 'stare', s: 'boing' },
      { t: 'They played ten more times. Bubbles won every single game!', b: 'pond', c: 'edge', act: 'wiggle', s: 'giggle' },
      { t: '"How do you do it?" asked Clover. Bubbles smiled. "I have no eyelids!"', b: 'edge', c: 'edge', prop: 'spark' },
      { t: 'It is true. An axolotl can not blink at all! So Clover picked a new game: hopscotch.', b: 'pond', c: 'grass', act: 'hop' },
    ], q: 'Why did Bubbles win every staring contest?', a: ['Axolotls have no eyelids', 'Axolotls have five eyes', 'Clover fell asleep'], fact: 'Axolotls have no eyelids, so they can never blink!' },
    { id: 'boat', title: 'The Leaf Boat', pages: [
      { t: 'Clover wanted to visit Bubbles at home. But his home is under the water.', b: 'pond', c: 'edge' },
      { t: 'Clover put her face in the pond. Glub! She could not breathe down there.', b: 'pond', c: 'edge', act: 'dunk', s: 'splash' },
      { t: '"I breathe air with my lungs," said Clover. "How do you breathe in water?"', b: 'edge', c: 'edge' },
      { t: 'Bubbles wiggled the pink feathers on his head. "These are my gills!"', b: 'edge', c: 'edge', act: 'wiggle', prop: 'spark' },
      { t: 'Gills take oxygen right out of the water. That is how Bubbles can stay under all day.', b: 'pond', c: 'edge', s: 'bubble' },
      { t: 'So Clover made a boat from a big green leaf. Now she can float next to her friend.', b: 'pond', c: 'boat', s: 'splash' },
      { t: 'And Bubbles rides in a bowl on wheels to visit the grass. Good friends find a way!', b: 'wagon', c: 'grass', act: 'hop', prop: 'heart' },
    ], q: 'What do the pink feathers on an axolotl do?', a: ['They help it breathe under water', 'They help it hear music', 'They keep its head warm'], fact: 'Those feathers are gills. Gills take oxygen out of the water!' },
    { id: 'teeth', title: 'The Crunchy Carrot', pages: [
      { t: 'Clover found a giant carrot. Crunch, crunch, crunch! She chewed all day long.', b: 'pond', c: 'edge', act: 'chew', prop: 'carrot', s: 'munch' },
      { t: '"Why do you chew so much?" asked Bubbles.', b: 'edge', c: 'edge', act: 'chew', prop: 'carrot' },
      { t: '"My teeth never stop growing," said Clover. "Chewing keeps them short."', b: 'edge', c: 'edge', prop: 'carrot' },
      { t: 'Bubbles opened his mouth wide. His teeth were so tiny you could hardly see them.', b: 'edge', c: 'edge', act: 'wiggle' },
      { t: '"I do not chew. I open up and suck my food in, like a vacuum!"', b: 'edge', c: 'edge', prop: 'worm' },
      { t: 'Slurp! A worm zipped right into his mouth. Clover giggled so hard she dropped her carrot.', b: 'edge', c: 'edge', act: 'hop', s: 'whoosh' },
      { t: 'Crunch for Clover and slurp for Bubbles. Lunch time is the best time.', b: 'pond', c: 'edge', act: 'chew', prop: 'carrot', s: 'munch' },
    ], q: 'Why do bunnies chew so much?', a: ['Their teeth never stop growing', 'They are always angry', 'Carrots are very loud'], fact: 'Bunny teeth never stop growing. Chewing keeps them short!' },
    { id: 'leg', title: 'The New Leg', pages: [
      { t: 'One day Bubbles came up slowly. A grumpy crab had pinched him, and one little leg was gone.', b: 'edge', c: 'grass' },
      { t: 'It did not hurt. But Clover gasped. "Oh no! I will find you a new leg!"', b: 'edge', c: 'edge', act: 'hop' },
      { t: 'She tried a stick. Too stiff. She tried a noodle. Too wiggly!', b: 'edge', c: 'edge', prop: 'stick', s: 'boing' },
      { t: 'Bubbles laughed. "Thank you, Clover. But I can grow a new one all by myself."', b: 'edge', c: 'edge', act: 'wiggle', s: 'giggle' },
      { t: 'Clover came to look every day. First a tiny bump. Then a little foot. Then tiny toes!', b: 'edge', c: 'edge', prop: 'spark', s: 'grow' },
      { t: 'Soon the new leg was just as good as the old one. Scientists study axolotls to learn how they do it.', b: 'pond', c: 'edge', act: 'wiggle', prop: 'spark' },
      { t: '"You are magic," said Clover. "No," said Bubbles. "I am an axolotl!"', b: 'edge', c: 'edge', act: 'hop', prop: 'heart' },
    ], q: 'What can an axolotl do that people can not do?', a: ['Grow a new leg', 'Fly to the moon', 'Turn into a bunny'], fact: 'An axolotl can grow back a leg, a tail, and even part of its heart!' },
  ];

  K.scenes.tv = {
    enter(root) {
      const S = K.save.data;
      if (!S.tv) S.tv = { seen: {}, day: {} };
      let vTop = 0, vBot = 800;
      try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
      const tall = vBot - vTop > 1150, M = (vTop + vBot) / 2, top = tall ? vTop + 210 : 150;
      const CS = tall ? 2.4 : 1.5, HZ = tall ? M - 60 : 452;
      const POND = tall ? [600, M + 560, 540, 200] : [340, 655, 300, 110];
      const POS = tall
        ? { b: { pond: [640, M + 600], edge: [520, M + 500], wagon: [340, M + 270] }, c: { grass: [820, M + 230], edge: [800, M + 335], boat: [280, M + 570] } }
        : { b: { pond: [330, 690], edge: [500, 675], wagon: [690, 720] }, c: { grass: [930, 700], edge: [760, 670], boat: [170, 680] } };

      /* ---------- the set ---------- */
      const [px, py, prx, pry] = POND;
      K.g(`${A.skyRect()}${A.hills(HZ - 7)}${A.groundRect(HZ)}
        <ellipse cx="${px}" cy="${py + 8}" rx="${prx + 14}" ry="${pry + 12}" fill="#8fc98a"/>
        <ellipse cx="${px}" cy="${py}" rx="${prx}" ry="${pry}" fill="#9fdcff" stroke="#7cc4ee" stroke-width="6"/>
        <ellipse cx="${px - prx * 0.2}" cy="${py - pry * 0.3}" rx="${prx * 0.5}" ry="${pry * 0.3}" fill="#c9eeff" opacity=".7"/>
        ${[[-0.78, -0.2], [0.72, 0.38], [0.5, -0.6]].map(([dx, dy]) => `<g transform="translate(${px + dx * prx} ${py + dy * pry}) scale(${CS * 0.6})"><ellipse rx="34" ry="12" fill="#7ccf7c" stroke="#4fa85a" stroke-width="3"/><path d="M0 0 L30 -8 L30 8Z" fill="#9fdcff"/></g>`).join('')}
        ${[[0.1, 0.25], [0.9, 0.5], [0.72, 0.12], [0.97, 0.2]].map(([fx, fy], i) => `<g transform="translate(${fx * 1200} ${HZ + 40 + fy * (tall ? 330 : 80)}) scale(${CS * 0.7})">${A.flowerHead(K.data.FLOWER_COLORS[i % 7], 8, false)}</g>`).join('')}`, root);
      const charsG = K.g('', root), propG = K.g('', root), capG = K.g('', root), uiG = K.g('', root);

      const mk = (type, color) => {
        const g = K.g('', charsG), flip = K.g('', g), back = K.g('', flip), anim = K.g(A.pet(type, color), flip), front = K.g('', flip);
        return { g, flip, back, anim, front, x: 0, y: 0, at: '', boing: 0 };
      };
      const B = mk('axolotl', '#ffb3d4'), C = mk('bunny', '#ffffff');
      const WAGON_BACK = `<rect x="-92" y="-6" width="170" height="16" rx="8" fill="#ff8fc0" stroke="#e0609a" stroke-width="3"/><circle cx="-60" cy="14" r="14" fill="#4a3a5a"/><circle cx="-60" cy="14" r="6" fill="#e8dcf8"/><circle cx="46" cy="14" r="14" fill="#4a3a5a"/><circle cx="46" cy="14" r="6" fill="#e8dcf8"/>`;
      const WAGON_FRONT = `<path d="M-98 -84 Q-112 -4 -8 -4 Q96 -4 82 -84" fill="#bfe8ff" opacity=".4" stroke="#7cc4ee" stroke-width="4"/>`;
      const BOAT = `<ellipse cx="0" cy="2" rx="78" ry="22" fill="#7ccf7c" stroke="#4fa85a" stroke-width="3"/><path d="M-60 2 Q0 10 60 2" stroke="#4fa85a" stroke-width="3" fill="none"/>`;
      const setAt = (o, key, which) => {
        o.at = key;
        if (which === 'b') { o.back.innerHTML = key === 'wagon' ? WAGON_BACK : ''; o.front.innerHTML = key === 'wagon' ? WAGON_FRONT : ''; }
        else o.back.innerHTML = key === 'boat' ? BOAT : '';
      };
      const moveTo = (o, which, key, quick) => {
        const [tx, ty] = POS[which][key], sx = o.x, sy = o.y;
        setAt(o, key, which);
        if (quick || (sx === tx && sy === ty)) { o.x = tx; o.y = ty; return Promise.resolve(); }
        return K.tween(750, (t) => { o.x = K.lerp(sx, tx, t); o.y = K.lerp(sy, ty, t) - Math.sin(t * Math.PI) * (which === 'c' ? 60 : 0); });
      };

      let T = 0, act = 'both';
      K.every((dt) => {
        T += dt;
        const bf = C.x >= B.x ? 1 : -1, cf = -bf;
        B.g.setAttribute('transform', `translate(${B.x.toFixed(1)} ${B.y.toFixed(1)}) scale(${CS})`); B.flip.setAttribute('transform', `scale(${bf} 1)`);
        C.g.setAttribute('transform', `translate(${C.x.toFixed(1)} ${C.y.toFixed(1)}) scale(${CS})`); C.flip.setAttribute('transform', `scale(${cf} 1)`);
        const swim = B.at !== 'wagon';
        let bx = swim ? Math.sin(T * 1.6) * 7 : 0, br = swim ? Math.sin(T * 2.2) * 3 : 0, cy = Math.sin(T * 2) * 2, cr = 0, sy = 1;
        if (act === 'wiggle') br = Math.sin(T * 13) * 8;
        if (act === 'hop' || act === 'both') cy = -Math.abs(Math.sin(T * 4.5)) * 24;
        if (act === 'chew') sy = 1 + Math.sin(T * 18) * 0.035;
        if (act === 'dunk') cr = 30;
        if (act === 'stare') { cr = 5; br = -3; bx = 0; cy = 0; }
        B.boing = Math.max(0, B.boing - dt * 2.2); C.boing = Math.max(0, C.boing - dt * 2.2);
        cy -= Math.sin(C.boing * Math.PI) * 46; br += Math.sin(B.boing * Math.PI * 4) * 10;
        B.anim.setAttribute('transform', `translate(${bx.toFixed(1)} 0) rotate(${br.toFixed(1)} 0 -30)`);
        C.anim.setAttribute('transform', `translate(0 ${cy.toFixed(1)}) rotate(${cr} 10 -10) scale(1 ${sy.toFixed(3)})`);
      });
      K.tap(B.g, () => { B.boing = 1; K.audio.sfx('bubble'); K.fx.bubbles && K.fx.bubbles(B.x, B.y - 60 * CS); K.fx.word('axolotl', B.x, B.y - 110 * CS); });
      K.tap(C.g, () => { C.boing = 1; K.audio.sfx('boing'); K.fx.word('bunny', C.x, C.y - 150 * CS); });

      /* ---------- words on the screen: every word can be tapped to hear it ---------- */
      const caption = (text, big) => {
        capG.innerHTML = '';
        const fs = (tall ? 70 : 38) * (big ? 1.15 : 1), maxW = tall ? 1060 : 1040, lh = fs * 1.28;
        const lines = [[]]; let w = 0;
        text.split(' ').forEach((wd) => {
          const ww = (wd.length + 1) * fs * 0.54;
          if (w + ww > maxW && lines[lines.length - 1].length) { lines.push([]); w = 0; }
          lines[lines.length - 1].push(wd); w += ww;
        });
        K.el('rect', { x: 600 - maxW / 2 - 40, y: top, width: maxW + 80, height: lines.length * lh + fs * 0.7, rx: 40, fill: '#fff', opacity: 0.95, stroke: '#ffd0e6', 'stroke-width': 5 }, capG);
        lines.forEach((ln, li) => {
          const tx = K.el('text', { x: 600, y: top + fs * 0.25 + (li + 0.8) * lh, 'text-anchor': 'middle', 'font-size': fs, fill: '#5a3d7a' }, capG);
          ln.forEach((wd, wi) => {
            const sp = K.el('tspan', {}, tx); sp.textContent = wd + (wi < ln.length - 1 ? ' ' : '');
            K.tap(sp, () => { const clean = wd.replace(/[^A-Za-z']/g, ''); if (!clean) return; sp.setAttribute('fill', '#ff5fa2'); K.voice.say(clean, { force: true }); K.wait(900).then(() => sp.setAttribute('fill', '#5a3d7a')); });
          });
        });
      };

      const ARROW = (d) => `<path d="M${d * -10} -20 L${d * 14} 0 L${d * -10} 20" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      const BR = tall ? 92 : 56, BY = tall ? vBot - 150 : 716;
      let token = 0;

      const props = (p) => {
        propG.innerHTML = '';
        const [bx, by] = POS.b[p.b], [cx, cy] = POS.c[p.c], dir = cx >= bx ? 1 : -1;
        if (p.prop === 'heart') K.g(`<g class="bob"><path d="${A.heart(3)}" fill="#ff8fb8" stroke="#fff" stroke-width="3"/></g>`, propG, { transform: `translate(${(bx + cx) / 2} ${Math.min(by, cy) - 150 * CS}) scale(${CS / 1.5})` });
        if (p.prop === 'carrot') K.g(`<g class="bob">${I.carrot}</g>`, propG, { transform: `translate(${cx - dir * 62 * CS} ${cy - 30 * CS}) scale(${CS * 0.9})` });
        if (p.prop === 'worm') K.g(`<g class="bob"><path d="M-26 0 q8 -16 16 0 t16 0 t16 0" stroke="#ff9ec7" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="24" cy="-2" r="2" fill="#5a3d7a"/></g>`, propG, { transform: `translate(${bx + dir * 105 * CS} ${by - 46 * CS}) scale(${CS})` });
        if (p.prop === 'stick') K.g(`<path d="M-30 0 L30 -8 M6 -4 L18 -18" stroke="#a9744a" stroke-width="8" stroke-linecap="round"/><path d="M-30 30 q10 -12 20 0 t20 0 t20 0" stroke="#ffe08a" stroke-width="7" fill="none" stroke-linecap="round"/>`, propG, { transform: `translate(${(bx + cx) / 2} ${Math.max(by, cy) - 20 * CS}) scale(${CS})` });
        if (p.prop === 'spark') K.fx.sparkle(bx, by - 46 * CS, { n: 16, spread: 90 * CS });
      };

      /* ---------- one show ---------- */
      const play = (show) => {
        let tries = 0;
        const page = (i) => {
          const my = ++token, p = show.pages[i];
          uiG.innerHTML = '';
          act = p.act || '';
          caption(p.t);
          propG.innerHTML = '';
          Promise.all([moveTo(B, 'b', p.b), moveTo(C, 'c', p.c)]).then(() => { if (my === token && root.isConnected) { props(p); if (p.s) K.audio.sfx(p.s); } });
          K.voice.say((i === 0 ? show.title + '. ' : '') + p.t.replace(/"/g, ''));
          if (i > 0) K.button(uiG, tall ? 330 : 80, BY, ARROW(-1), () => page(i - 1), { r: BR * 0.7, fill: '#c9a6ff' });
          // the next arrow shows up once there has been time to hear and read the words
          K.wait(1100 + p.t.length * 42).then(() => {
            if (my !== token || !root.isConnected) return;
            const nb = K.button(uiG, tall ? 870 : 1120, BY, ARROW(1), () => (i + 1 < show.pages.length ? page(i + 1) : question()), { r: BR, fill: '#ff7fb2' });
            nb.inner.classList.add('pop-in');
          });
          K.g(`<text text-anchor="middle" font-size="${tall ? 44 : 24}" fill="#6d4a92" stroke="#fff" stroke-width="6" paint-order="stroke">${i + 1} of ${show.pages.length}</text>`, uiG, { transform: `translate(600 ${BY + 14})` });
        };
        const question = () => {
          ++token; uiG.innerHTML = ''; propG.innerHTML = ''; act = '';
          caption(show.q, true); K.voice.say(show.q);
          const list = show.a.map((t, k) => ({ t, ok: k === 0 }));
          const opts = K.shuffle(list) || list;
          // the answers sit in the sky, and the friends wait below them
          moveTo(B, 'b', 'pond'); moveTo(C, 'c', tall ? 'edge' : 'grass');
          const W = tall ? 1080 : 640, H = tall ? 130 : 78, fs = tall ? 54 : 32, y0 = tall ? M - 320 : 330, step = H + (tall ? 20 : 18);
          opts.forEach((o, k) => {
            const y = y0 + k * step;
            const g = K.g(`<g class="inner"><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="${H / 2}" fill="#fff" stroke="#c9a6ff" stroke-width="6"/><text y="${fs * 0.34}" text-anchor="middle" font-size="${fs}" fill="#5a3d7a">${o.t}</text></g>`, uiG, { class: 'btn', transform: `translate(600 ${y})` });
            K.tap(g, () => {
              if (g.done) return;
              if (!o.ok) { tries++; g.done = true; g.setAttribute('opacity', 0.4); K.audio.sfx('boing'); K.voice.say('Hmm, not that one. Try again!'); return; }
              [...uiG.children].forEach((e) => { e.done = true; });
              g.querySelector('rect').setAttribute('fill', '#d6f7dc'); g.querySelector('rect').setAttribute('stroke', '#5fd38a');
              const today = new Date().toDateString(), first = S.tv.day[show.id] !== today;
              S.tv.day[show.id] = today; S.tv.seen[show.id] = (S.tv.seen[show.id] || 0) + 1;
              K.audio.sfx('fanfare'); K.fx.confetti(40); act = 'both';
              if (first) K.fx.stars(tries === 0 ? 3 : 2, 600, y);
              K.save.write();
              caption(show.fact, true); K.voice.say('Yes! ' + show.fact);
              K.wait(1500 + show.fact.length * 45).then(() => { if (root.isConnected) menu(); });
            });
          });
        };
        K.audio.sfx('jingle');
        page(0);
      };

      /* ---------- pick a show ---------- */
      const menu = () => {
        ++token; uiG.innerHTML = ''; propG.innerHTML = ''; act = 'both';
        moveTo(B, 'b', 'pond'); moveTo(C, 'c', 'grass');
        caption('Bubbles and Clover! Pick a show.', true);
        const W = tall ? 520 : 262, H = tall ? 200 : 150, fs = tall ? 46 : 27;
        SHOWS.forEach((sh, i) => {
          const x = tall ? 320 + (i % 2) * 560 : 165 + i * 290, y = tall ? top + 400 + ((i / 2) | 0) * 240 : 380;
          const words = sh.title.split(' '), half = Math.ceil(words.length / 2), l1 = words.slice(0, half).join(' '), l2 = words.slice(half).join(' ');
          const g = K.g(`<g class="inner"><rect x="${-W / 2}" y="${-H / 2 + 6}" width="${W}" height="${H}" rx="34" fill="#e9a6cf" opacity=".7"/>
            <rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="34" fill="${['#ffe3f0', '#e3f4ff', '#fff3d6', '#e6f9e6'][i]}" stroke="#fff" stroke-width="6"/>
            <circle cx="${-W / 2 + fs * 1.1}" cy="${-H / 2 + fs * 1.1}" r="${fs * 0.7}" fill="#ff7fb2"/><text x="${-W / 2 + fs * 1.1}" y="${-H / 2 + fs * 1.42}" text-anchor="middle" font-size="${fs * 0.9}" fill="#fff">${i + 1}</text>
            <text y="${-fs * 0.1}" text-anchor="middle" font-size="${fs}" fill="#5a3d7a">${l1}</text><text y="${fs * 1.1}" text-anchor="middle" font-size="${fs}" fill="#5a3d7a">${l2}</text>
            ${S.tv.seen[sh.id] ? `<g transform="translate(${W / 2 - fs} ${-H / 2 + fs}) scale(${fs / 40})">${I.star}</g>` : ''}</g>`, uiG, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => { K.audio.sfx('tap'); play(sh); });
        });
        K.voice.say('Bubbles and Clover! Pick a show.');
      };

      moveTo(B, 'b', 'pond', true); moveTo(C, 'c', 'grass', true);
      K.hintOnce('tv', 'Pick a show to watch. Tap any word to hear it!', 1200);
      menu();
    },
  };
})();
