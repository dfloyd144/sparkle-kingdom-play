/* Royal Ball: dance with all six princesses and the unicorn, fireworks and confetti */
(function () {
  const A = K.art, D = K.data;

  K.scenes.ball = {
    enter(root) {
      const S = K.save.data;
      K.hintOnce('ball', 'Tap the pictures to dance! Twirl, jump, and make fireworks!');

      /* ---------- ballroom ---------- */
      let stars = '';
      for (let i = 0; i < 40; i++) stars += `<circle cx="${K.rand(-160, 160).toFixed(0)}" cy="${K.rand(-230, 100).toFixed(0)}" r="${K.rand(1.5, 3.5).toFixed(1)}" fill="#fff" class="twinkle" style="animation-delay:-${K.rand(0, 2).toFixed(1)}s"/>`;
      const win = (x) => `<g transform="translate(${x} 330)"><clipPath id="w${x}"><path d="M-110 120 V-150 A110 110 0 0 1 110 -150 V120Z"/></clipPath>
        <path d="M-122 130 V-150 A122 122 0 0 1 122 -150 V130Z" fill="url(#gGold)"/>
        <g clip-path="url(#w${x})"><rect x="-120" y="-280" width="240" height="420" fill="url(#gNight)"/>${stars}
        ${x === 600 ? `<g transform="translate(50 -150) scale(.7)">${A.picture('MOON')}</g>` : ''}</g>
        <path d="M0 -260 V120 M-110 -40 H110" stroke="#ffe7a8" stroke-width="7"/></g>`;
      let tiles = '';
      for (let r = 0; r < 9; r++) {
        const y0 = 470 + r * r * 5 + r * 26, y1 = 470 + (r + 1) * (r + 1) * 5 + (r + 1) * 26;
        for (let c = -12; c <= 12; c++) {
          const sx0 = 600 + c * (60 + r * 9), sx1 = 600 + (c + 1) * (60 + r * 9);
          const bx0 = 600 + c * (60 + (r + 1) * 9), bx1 = 600 + (c + 1) * (60 + (r + 1) * 9);
          tiles += `<path d="M${sx0} ${y0} L${sx1} ${y0} L${bx1} ${y1} L${bx0} ${y1}Z" fill="${(r + c) % 2 ? '#ffe3f0' : '#fff'}"/>`;
        }
      }
      K.g(`<rect x="-900" y="-700" width="3000" height="1200" fill="#d9c6ff"/>
        <rect x="-900" y="-700" width="3000" height="1200" fill="url(#gWall)" opacity=".35"/>
        ${win(240)}${win(600)}${win(960)}
        ${windowFireworks()}
        ${[60, 420, 780, 1140].map((x) => `<rect x="${x - 26}" y="60" width="52" height="420" fill="#fff4fb" stroke="#e5c7dc" stroke-width="3"/><rect x="${x - 36}" y="46" width="72" height="22" rx="6" fill="url(#gGold)"/><rect x="${x - 36}" y="470" width="72" height="18" rx="6" fill="url(#gGold)"/>`).join('')}
        <path d="M-900 -700 H2100 V40${A.scallop(2100, -900, 40, 30, 50)}Z" fill="#c9a6ff"/>
        <path d="M-900 40${A.scallop(-900, 2100, 40, 30, 50)}" fill="none" stroke="url(#gGold)" stroke-width="6"/>
        <rect x="-900" y="470" width="3000" height="900" fill="#fff"/>${tiles}
        <path d="M-900 470 H2100" stroke="url(#gGold)" stroke-width="8"/>`, root);
      function windowFireworks() { return ''; }

      // chandeliers
      [300, 900].forEach((x) => K.g(`<g class="swing"><g transform="translate(0 150)">${A.room('chandelier')}</g></g>`, root, { transform: `translate(${x} -10)` }));

      // floor spotlights
      const lights = K.g('', root);
      const PALETTES = [['#ffb3d4', '#c9a6ff', '#9fd2ff'], ['#fff08a', '#ffb38a', '#ff9ec7'], ['#a6eec0', '#9fd2ff', '#c9a6ff']];
      let pal = 0;
      const spots = [0, 1, 2].map((i) => K.el('ellipse', { rx: 170, ry: 50, fill: PALETTES[0][i], opacity: 0.35 }, lights));
      K.every((dt, now) => {
        const t = now / 1000;
        spots.forEach((e, i) => { e.setAttribute('cx', (600 + Math.sin(t * 0.6 + i * 2.1) * 380).toFixed(0)); e.setAttribute('cy', (600 + Math.sin(t * 0.9 + i) * 70).toFixed(0)); });
      });

      /* ---------- dancers ---------- */
      const actorsG = K.g('', root);
      const others = S.looks.map((_, i) => i).filter((i) => i !== S.cur);
      const POS = [[120, 660, 0.86], [265, 572, 0.76], [420, 515, 0.7], [780, 515, 0.7], [935, 572, 0.76], [1080, 660, 0.86]];
      const dancers = [];
      others.forEach((pi, k) => {
        const [x, y, s] = POS[k];
        const p = new K.Princess(actorsG, S.looks[pi], x, y, s);
        p.face = x < 600 ? 1 : -1; p.place();
        p.name = S.names[pi];
        dancers.push(p);
      });
      const uni = new K.Unicorn(actorsG, { mane: S.unicorn.mane, acc: S.unicorn.acc }, 690, 492, 0.5);
      uni.face = 1; uni.place(); uni.name = S.unicorn.name;
      dancers.push(uni);
      const me = new K.Princess(actorsG, K.me(), 600, 668, 1.08);
      me.name = K.myName();
      dancers.push(me);
      K.sortByY(actorsG, dancers);
      dancers.forEach((d) => K.tap(d.root, () => {
        d.happy(1400); d.play(d === uni ? 'a-hop' : 'a-twirl', 900);
        K.audio.sfx(d === uni ? 'neigh' : 'sparkle');
        K.fx.sparkle(d.x, d.y - 150 * d.s, { n: 12 });
        K.fx.word(d.name, d.x, d.y - 330 * d.s);
      }));

      /* ---------- dance moves ---------- */
      let moves = 0, starGiven = false;
      function countMove() {
        moves++;
        if (moves === 6 && !starGiven) {
          starGiven = true;
          K.wait(1200).then(() => { K.fx.star(600, 300); K.voice.say('You are a wonderful dancer!'); });
        }
      }
      function all(cls, ms, sfx, word, say) {
        K.audio.sfx(sfx);
        dancers.forEach((d, i) => K.wait(i * 90).then(() => { d.happy(ms + 600); d.play(d === uni && cls !== 'a-jump' ? 'a-hop' : cls, ms); }));
        K.fx.word(word, 600, 150, { sayText: say || word });
        K.fx.sparkle(600, 500, { n: 14, spread: 300 });
        countMove();
        K.emit('dance');
      }
      const tray = K.g('<rect x="50" y="666" width="1100" height="134" rx="48" fill="#fff" opacity=".75"/>', root);
      const BTNS = [
        ['twirl', () => all('a-twirl', 900, 'sparkle', 'twirl')],
        ['jump', () => all('a-jump', 700, 'boing', 'jump')],
        ['curtsy', () => all('a-bow', 1100, 'chime', 'bow', 'Take a bow!')],
        ['sway', () => all('a-dance', 1200, 'giggle', 'dance', 'Dance, dance, dance!')],
        ['firework', () => fireworks()],
        ['confetti', () => { K.fx.confetti(90); K.audio.sfx('pop'); K.audio.sfx('giggle'); K.fx.word('party', 600, 150, { sayText: 'Hooray!' }); countMove(); }],
        ['lights', () => { pal = (pal + 1) % PALETTES.length; spots.forEach((e, i) => e.setAttribute('fill', PALETTES[pal][i])); K.audio.sfx('chime'); K.fx.sparkle(300, 250, { n: 14 }); K.fx.sparkle(900, 250, { n: 14 }); K.fx.word('lights', 600, 150); countMove(); }],
      ];
      BTNS.forEach(([icon, fn], i) => K.button(tray, 600 + (i - 3) * 146, 740, A.icons[icon], fn, { r: 62, fill: i >= 4 ? 'url(#gBtnGold)' : 'url(#gBtn)' }));

      let fwBusy = false;
      async function fireworks() {
        if (fwBusy) return;
        fwBusy = true;
        const spotsW = [[240, 230], [600, 200], [960, 230]];
        for (let k = 0; k < 3; k++) {
          const [x, y] = spotsW[k];
          K.fx.firework(x + K.rand(-30, 30), y + K.rand(-30, 30));
          K.audio.sfx('firework');
          K.emit('firework');
          K.fx.number(k + 1, x, y + 160);
          await K.wait(800);
        }
        dancers.forEach((d) => d.happy(1500));
        countMove();
        fwBusy = false;
      }
    },
  };
})();
