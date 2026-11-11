/* Princess bedroom: drag furniture & decorations in, move them, paint walls and floor */
(function () {
  const A = K.art, D = K.data;
  const SCALE = { bed: 0.85, vanity: 1, rug: 1, plant: 0.95, lamp: 1, teddy: 0.95, plush: 1, painting: 1, shelf: 1, chest: 0.95, balloons: 1, lights: 1, chandelier: 1, pillow: 1 };
  const WALL_NAMES = ['pink', 'purple', 'blue', 'green', 'yellow', 'peach'];
  const FLOOR_NAMES = ['wood', 'pink', 'purple', 'mint', 'white'];
  const TRAY_Y = 735;

  K.scenes.room = {
    enter(root) {
      const S = K.save.data, R = S.room;
      K.hintOnce('room', 'Drag pictures from the bottom into your room. Drag them back down to put them away.');

      const wallG = K.g('', root);
      function drawWalls() {
        const w = D.WALLS[R.wall % D.WALLS.length], f = D.FLOORS[R.floor % D.FLOORS.length];
        let dots = '';
        for (let x = -880; x < 2100; x += 80) for (let y = -660; y < 500; y += 80) dots += `<circle cx="${x + ((y / 80) % 2 ? 40 : 0)}" cy="${y}" r="7" fill="#fff" opacity=".5"/>`;
        let planks = '';
        for (let y = 590; y < 1300; y += 44) planks += `<path d="M-900 ${y} H2100" stroke="${K.shade(f, -0.1)}" stroke-width="3"/>`;
        wallG.innerHTML = `<rect x="-900" y="-700" width="3000" height="1260" fill="${w}"/>${dots}
          <rect x="-900" y="470" width="3000" height="90" fill="${K.shade(w, 0.4)}"/><rect x="-900" y="462" width="3000" height="12" fill="#fff"/>
          <rect x="-900" y="556" width="3000" height="760" fill="${f}"/>${planks}<rect x="-900" y="550" width="3000" height="12" fill="${K.shade(w, -0.12)}"/>
          <g transform="translate(600 250)">
            <path d="M-120 140 V-60 A120 120 0 0 1 120 -60 V140Z" fill="#fff" />
            <path d="M-104 128 V-56 A104 104 0 0 1 104 -56 V128Z" fill="#bfe5ff"/>
            <path d="M-104 70 Q-40 30 20 60 Q70 36 104 54 V128 H-104Z" fill="#b3e6c2"/>
            <g transform="translate(-30 66) scale(.32)">${A.castle().replace('class="castle"', 'transform="translate(-600 -460)"')}</g>
            <g transform="translate(60 -70) scale(.35)">${A.sun()}</g>
            <path d="M0 -160 V128 M-104 20 H104" stroke="#fff" stroke-width="8"/>
            <path d="M-150 -170 Q-110 0 -160 150 H-108 Q-80 0 -112 -170Z M150 -170 Q110 0 160 150 H108 Q80 0 112 -170Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/>
            <rect x="-170" y="-182" width="340" height="18" rx="9" fill="url(#gGold)"/></g>`;
      }
      drawWalls();
      K.tap(wallG, (p) => { if (p.y > 560 && p.y < 690) pr.walkTo(K.clamp(p.x, 80, 1120), p.y); });

      const itemsG = K.g('', root);
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 760, 640, 0.95);
      pr.depth = (y) => 0.85 + (y - 570) / 120 * 0.15;
      pr.setPos(760, 640);
      K.makeDraggable(pr, { clamp: (x, y) => ({ x: K.clamp(x, 80, 1120), y: K.clamp(y, 570, 690) }), tap: () => { pr.happy(); pr.play('a-twirl', 900); K.audio.sfx('giggle'); K.fx.sparkle(pr.x, pr.y - 140); } });

      const zOf = (it) => (A.ROOM_WALL.includes(it.t) ? -2000 + it.y : it.t === 'rug' ? -1000 + it.y : it.y);
      function drawItems() {
        itemsG.innerHTML = '';
        const sorted = R.items.map((it, i) => ({ it, i })).sort((a, b) => zOf(a.it) - zOf(b.it));
        sorted.forEach(({ it }) => {
          const g = K.g(`<g>${A.room(it.t)}</g>`, itemsG);
          K.place(g, it.x, it.y, SCALE[it.t] || 1);
          let off = null;
          K.drag(g, {
            start: (p) => { off = { x: it.x - p.x, y: it.y - p.y }; itemsG.appendChild(g); },
            move: (p, dx, dy, moved) => { if (!moved) return; it.x = K.clamp(p.x + off.x, 30, 1170); it.y = K.clamp(p.y + off.y, 80, 800); K.place(g, it.x, it.y, (SCALE[it.t] || 1) * 1.06); },
            end: (p) => {
              if (p.y > TRAY_Y - 60) {
                R.items.splice(R.items.indexOf(it), 1);
                K.fx.poof(p.x, p.y - 40);
                K.voice.say('Put away!');
              } else {
                it.y = Math.min(it.y, 690);
                K.audio.sfx('pop');
              }
              K.save.write(); drawItems();
            },
            tap: () => { K.replay(g.firstChild, 'squish', 500); K.audio.sfx('boing'); K.fx.sparkle(it.x, it.y - 80, { n: 8 }); K.fx.word(D.ROOM_WORDS[it.t], K.clamp(it.x, 150, 1050), Math.max(150, it.y - 260)); },
          });
        });
        // keep the princess in front of rugs/wall items but sorted with furniture roughly
        actorsG.parentNode.appendChild(actorsG);
      }
      drawItems();

      /* ---------- paint buttons ---------- */
      K.button(root, 1108, 200, A.icons.roller, () => {
        R.wall = (R.wall + 1) % D.WALLS.length; K.save.write(); drawWalls();
        K.audio.sfx('swoosh'); K.fx.sparkle(600, 250, { n: 20, spread: 300 });
        K.fx.word(WALL_NAMES[R.wall], 600, 140, { first: K.shade(D.WALLS[R.wall], -0.35), color: K.shade(D.WALLS[R.wall], -0.15) });
      }, { r: 58, fill: 'url(#gBtnLilac)' });
      K.button(root, 1108, 340, A.icons.floor, () => {
        R.floor = (R.floor + 1) % D.FLOORS.length; K.save.write(); drawWalls();
        K.audio.sfx('swoosh'); K.fx.sparkle(600, 620, { n: 20, spread: 300 });
        K.fx.word(FLOOR_NAMES[R.floor], 600, 140, { first: K.shade(D.FLOORS[R.floor], -0.4), color: K.shade(D.FLOORS[R.floor], -0.15) });
      }, { r: 58, fill: 'url(#gBtnLilac)' });

      /* ---------- bedtime! ---------- */
      K.button(root, 1108, 480, `<g transform="scale(1.05)">${A.icons.moon}</g>`, () => { K.voice.say('bedtime'); K.go('bedtime'); }, { r: 58, fill: 'url(#gBtnGold)', label: 'bedtime' });

      /* ---------- door to the royal bathroom ---------- */
      const door = K.g(`<path d="M30 556 V380 A70 70 0 0 1 170 380 V556Z" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>
        <path d="M44 556 V384 A56 56 0 0 1 156 384 V556Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="4"/>
        <path d="M100 330 V556 M56 440 H144" stroke="#b393f2" stroke-width="3"/><circle cx="140" cy="470" r="7" fill="#ffc54d"/>
        <g transform="translate(100 400) scale(.9)"><circle r="34" fill="#fff"/>${A.icons.tub}</g>`, root);
      wallG.after(door);
      K.tap(door, async () => { K.audio.sfx('pop'); K.voice.say('bathroom'); await pr.walkTo(170, 600); K.go('bath'); });

      /* ---------- item tray: two pages of big pictures ---------- */
      const tray = K.g(`<rect x="10" y="${TRAY_Y - 68}" width="1180" height="136" rx="48" fill="#fff" opacity=".85" stroke="#ffd1e8" stroke-width="4"/>`, root);
      const THUMB = { bed: 0.22, vanity: 0.3, rug: 0.3, plant: 0.36, lamp: 0.3, teddy: 0.48, plush: 0.42, painting: 0.44, shelf: 0.34, chest: 0.44, balloons: 0.28, lights: 0.24, chandelier: 0.36, pillow: 0.6 };
      const THUMB_DY = { bed: 30, vanity: 34, rug: 12, plant: 32, lamp: 34, teddy: 26, plush: 30, painting: 26, shelf: 30, chest: 22, balloons: 32, lights: 20, chandelier: 32, pillow: 22 };
      const PER = 7, pages = Math.ceil(D.ROOM_ITEMS.length / PER);
      let page = 0;
      const pageG = K.g('', tray);
      function drawPage() {
        pageG.innerHTML = '';
        D.ROOM_ITEMS.slice(page * PER, page * PER + PER).forEach((t, i) => {
          const x = 192 + i * 136, y = TRAY_Y;
          const g = K.g(`<g class="inner pop-in" style="animation-delay:${i * 0.03}s"><circle r="60" fill="#fff6fb" stroke="#ffd1e8" stroke-width="4"/><g transform="translate(0 ${THUMB_DY[t] * 1.45}) scale(${THUMB[t] * 1.45})">${A.room(t)}</g>${K.shop.badge('room', t, 60)}</g>`, pageG, { class: 'btn', transform: `translate(${x} ${y})` });
          let ghost = null;
          K.drag(g, {
            start: (p) => { if (K.shop.isLocked('room', t)) { K.shop.ask('room', t, () => drawPage()); return false; } ghost = K.g(`<g opacity=".85">${A.room(t)}</g>`, K.layers.fx); K.place(ghost, p.x, p.y + 30, SCALE[t]); K.audio.sfx('pop'); },
            move: (p) => { if (ghost) K.place(ghost, p.x, p.y + 30, SCALE[t]); },
            end: (p) => {
              if (ghost) ghost.remove();
              ghost = null;
              if (p.y + 30 < TRAY_Y - 60) addItem(t, p.x, p.y + 30);
            },
            tap: () => {
              if (ghost) ghost.remove();
              ghost = null;
              const wall = A.ROOM_WALL.includes(t);
              addItem(t, K.rand(250, 950), wall ? (t === 'chandelier' ? 160 : K.rand(330, 420)) : K.rand(590, 670));
            },
          });
        });
      }
      const flip = (d) => { page = (page + d + pages) % pages; K.audio.sfx('swoosh'); drawPage(); };
      K.button(tray, 62, TRAY_Y, A.icons.arrowL, () => flip(-1), { r: 46, fill: 'url(#gBtnGold)' });
      K.button(tray, 1138, TRAY_Y, A.icons.arrowR, () => flip(1), { r: 46, fill: 'url(#gBtnGold)' });
      drawPage();
      function addItem(t, x, y) {
        if (R.items.length >= 40) { K.voice.say('Your room is so full!'); K.audio.sfx('boing'); return; }
        const it = { t, x: Math.round(K.clamp(x, 40, 1160)), y: Math.round(K.clamp(y, 90, 690)) };
        R.items.push(it); K.save.write(); drawItems();
        K.emit('roomAdd', { t });
        K.audio.sfx('sparkle');
        K.fx.sparkle(it.x, it.y - 60, { n: 14, spread: 100 });
        K.fx.word(D.ROOM_WORDS[t], K.clamp(it.x, 150, 1050), Math.max(150, it.y - 260));
        if (!R.placedStars) R.placedStars = 0;
        R.placedStars++;
        if (R.placedStars % 5 === 0) K.fx.star(it.x, it.y - 100);
      }
    },
  };
})();
