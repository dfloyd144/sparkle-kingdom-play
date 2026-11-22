/* Magic Wardrobe: choose one of 6 princesses, change dress, colors, hair and crown */
(function () {
  const A = K.art, D = K.data;

  K.scenes.dressup = {
    enter(root) {
      const S = K.save.data;
      K.hintOnce('dressup', 'Pick a princess. Then tap the pictures to change her dress, hair and crown!');

      /* ---------- room ---------- */
      let stripes = '';
      for (let x = -900; x < 2100; x += 60) stripes += `<rect x="${x}" y="-700" width="30" height="1260" fill="#fff" opacity=".35"/>`;
      let hearts = '';
      for (let x = -870; x < 2100; x += 120) for (let y = 40; y < 560; y += 120) hearts += `<path d="${A.heart(0.6)}" transform="translate(${x + ((y / 120) % 2) * 60} ${y})" fill="#ffc2dc" opacity=".6"/>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1260" fill="#ffe1ef"/>${stripes}${hearts}
        <rect x="-900" y="560" width="3000" height="700" fill="#f3d3ea"/>
        <path d="M-900 560 H2100" stroke="#fff" stroke-width="10"/>
        <ellipse cx="560" cy="690" rx="300" ry="60" fill="#ffd1e8" stroke="#ffb3d4" stroke-width="5"/>
        <ellipse cx="560" cy="690" rx="230" ry="40" fill="#ffe6f3"/>
        <g>
          <path d="M370 560 V250 A190 190 0 0 1 750 250 V560Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="4"/>
          <path d="M390 560 V254 A170 170 0 0 1 730 254 V560Z" fill="#e3f4ff"/>
          <path d="M430 340 L560 200 M440 420 L640 220 M600 520 L710 400" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".7" class="twinkle"/>
          <path d="${A.heart(2)}" transform="translate(560 92)" fill="#ff8fb8" stroke="#fff" stroke-width="4"/>
          ${A.sparkle4(420, 160, 14, '#fff08a')}${A.sparkle4(700, 140, 12, '#fff')}
        </g>
        <path d="M-900 -700 H300 Q300 -200 270 -100 Q250 120 300 560 H-900Z" fill="#c9a6ff" opacity=".9"/>
        <path d="M2100 -700 H860 Q860 -200 890 -100 Q910 120 860 560 H2100Z" fill="#c9a6ff" opacity=".9"/>
        <path d="M300 -700 Q300 -200 270 -100 Q250 120 300 560" stroke="#b08ce8" stroke-width="10" fill="none"/>
        <path d="M860 -700 Q860 -200 890 -100 Q910 120 860 560" stroke="#b08ce8" stroke-width="10" fill="none"/>
        <rect x="-900" y="-700" width="3000" height="60" fill="#b08ce8"/>`, root);

      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 560, 700, 1.82);
      K.tap(pr.root, () => {
        pr.happy(1600); pr.play('a-twirl', 900); K.audio.sfx('sparkle');
        K.fx.sparkle(560, 450, { n: 18, spread: 180 });
        K.voice.say(K.pick(['So pretty!', 'Twirl, twirl!', 'You look beautiful!', 'What a lovely princess!', 'Sparkly!']));
      });

      /* ---------- princess picker (6 princesses) ---------- */
      const pick = K.g('', root);
      function drawPicker() {
        pick.innerHTML = '';
        const n = S.looks.length;
        for (let i = 0; i < n; i++) {
          const last = i === n - 1 && n % 2 === 1;
          const x = last ? 137 : 78 + (i % 2) * 118, y = 148 + Math.floor(i / 2) * 140;
          const sel = S.cur === i;
          const g = K.g(`<circle r="50" cy="5" fill="#e9a6cf" opacity=".6"/><circle r="50" fill="${sel ? '#fff4b8' : '#fff'}" stroke="${sel ? '#ff6fae' : '#fff'}" stroke-width="${sel ? 7 : 4}"/>
            <clipPath id="pc${i}"><circle r="46"/></clipPath><g clip-path="url(#pc${i})"><g transform="translate(0 28) scale(.46)">${A.princessHead(S.looks[i])}</g></g>
            <g transform="translate(0 68)">${A.label(S.names[i], 21)}</g>`, pick, { transform: `translate(${x} ${y})`, class: 'btn' });
          K.tap(g, () => choosePrincess(i));
        }
      }
      drawPicker();
      function choosePrincess(i) {
        if (S.cur === i) { pr.happy(); pr.play('a-hop', 450); K.fx.word(S.names[i], 560, 140); return; }
        S.cur = i; K.save.write();
        K.fx.poof(560, 500);
        pr.setLook(K.me());
        pr.happy(1600); pr.play('a-jump', 700);
        K.fx.sparkle(560, 400, { n: 24, spread: 220 });
        K.fx.word(S.names[i], 560, 140, { sayText: `Hi! I'm Princess ${S.names[i]}!` });
        drawPicker(); drawOptions();
      }

      /* ---------- categories & options ---------- */
      const CATS = [
        { id: 'dress', icon: 'dress', n: 6, word: (i) => D.DRESS_NAMES[i] },
        { id: 'color', icon: 'palette', n: 8, word: (i) => D.DRESS_COLORS[i].name },
        { id: 'style', icon: 'hair', n: 6, word: (i) => D.HAIR_NAMES[i] },
        { id: 'hair', icon: 'drop', n: 8, word: (i) => D.HAIR_COLORS[i].name },
        { id: 'crown', icon: 'crown', n: K.save.data.hands && K.save.data.hands.crown ? 6 : 5, word: (i) => D.CROWN_NAMES[i] },
      ];
      let cat = 0;
      const tabs = K.g('', root);
      const opts = K.g('', root);
      function drawTabs() {
        tabs.innerHTML = '';
        CATS.forEach((c, i) => {
          const b = K.button(tabs, 1128, 150 + i * 106, `<g transform="scale(.9)">${A.icons[c.icon]}</g>`, () => { cat = i; drawTabs(); drawOptions(); K.voice.say(['dresses', 'colors', 'hair', 'hair colors', 'crowns'][i]); }, { r: 54, cls: cat === i ? 'sel' : '' });
          if (cat === i) b.querySelector('.ring').setAttribute('fill', 'url(#gBtnGold)');
        });
        K.button(tabs, 1128, 150 + 5 * 106, A.icons.wand, () => surprise(), { r: 54, fill: 'url(#gBtnLilac)' });
      }
      function thumb(c, i) {
        const L = K.me();
        switch (c.id) {
          case 'dress': return `<g transform="translate(0 -8) scale(.62)">${A.skirtOnly(i, L.color)}</g>`;
          case 'color': return `<circle r="34" fill="${D.DRESS_COLORS[i].hex}" stroke="${K.shade(D.DRESS_COLORS[i].hex, -0.2)}" stroke-width="3"/>${A.sparkle4(-12, -12, 8)}`;
          case 'style': return `<g transform="translate(0 6) scale(.36)">${A.princessHead(Object.assign({}, L, { style: i, crown: -1 }))}</g>`;
          case 'hair': { const h = D.HAIR_COLORS[i].hex; return `<path d="M-14 -34 C-40 -20 -10 0 -30 20 C-40 34 -20 40 0 34 C30 26 4 6 24 -10 C36 -22 20 -40 -14 -34Z" fill="${h}" stroke="${K.shade(h, -0.25)}" stroke-width="3"/><path d="M-10 -24 C-22 -12 -6 2 -16 16" stroke="${K.shade(h, 0.4)}" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
          case 'crown': return `<g transform="scale(.75)">${A.crownOnly(i)}</g>`;
        }
        return '';
      }
      function drawOptions() {
        opts.innerHTML = '';
        const c = CATS[cat], L = K.me();
        for (let i = 0; i < c.n; i++) {
          const x = 880 + (i % 2) * 118, y = 168 + Math.floor(i / 2) * 120;
          const sel = L[c.id] === i;
          const g = K.g(`<g class="inner pop-in" style="animation-delay:${i * 0.03}s"><circle r="57" cy="5" fill="#e9a6cf" opacity=".5"/>
            <circle class="ring" r="57" fill="${sel ? '#fff4b8' : '#fff'}" stroke="${sel ? '#ff6fae' : '#fff'}" stroke-width="${sel ? 7 : 4}"/><g transform="scale(1.12)">${thumb(c, i)}</g>${K.shop.badge(c.id, i, 52)}</g>`, opts, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => apply(c, i));
        }
      }
      const SPOT = { dress: [560, 600], color: [560, 600], style: [560, 360], hair: [560, 360], crown: [560, 280] };
      function apply(c, i) {
        if (K.shop.isLocked(c.id, i)) return K.shop.ask(c.id, i, () => { drawOptions(); apply(c, i); });
        const L = K.me();
        L[c.id] = i; K.save.write();
        pr.setLook(L);
        pr.happy(1200); pr.play('a-twirl', 900);
        K.audio.sfx('sparkle');
        const [sx, sy] = SPOT[c.id];
        K.fx.sparkle(sx, sy, { n: 20, spread: 150 });
        const opt = c.id === 'color' ? { first: D.DRESS_COLORS[i].hex, color: D.DRESS_COLORS[i].hex } : c.id === 'hair' ? { first: D.HAIR_COLORS[i].hex, color: D.HAIR_COLORS[i].hex } : {};
        K.fx.word(c.word(i), 560, 140, opt);
        drawOptions(); drawPicker();
        K.emit('dress', K.me());
      }
      function surprise() {
        const L = K.me();
        const free = (cat, n) => { const ok = []; for (let k = 0; k < n; k++) if (!K.shop.isLocked(cat, k)) ok.push(k); return K.pick(ok); };
        L.dress = free('dress', 5); L.color = free('color', 8); L.style = K.irand(0, 5); L.hair = free('hair', 8); L.crown = free('crown', K.save.data.hands && K.save.data.hands.crown ? 6 : 5);
        K.save.write();
        K.audio.sfx('swoosh');
        K.fx.sparkle(560, 450, { n: 40, spread: 260 });
        K.fx.poof(560, 520);
        pr.setLook(L); pr.happy(1600); pr.play('a-twirl', 900);
        K.fx.word('magic', 560, 140, { sayText: 'Magic surprise!' });
        K.emit('dress', K.me());
        drawOptions(); drawPicker();
      }
      drawTabs(); drawOptions();
    },
  };
})();
