/* Tea party: invite friends, pour tea, serve treats, say cheers — lots of gentle counting */
(function () {
  const A = K.art, D = K.data;
  const SEATS = [250, 425, 775, 950];
  const HOST_X = 600;
  const FEET = 532;

  K.scenes.tea = {
    enter(root) {
      const S = K.save.data, T = S.tea;
      T.guests = (T.guests || []).slice(0, 4);
      while (T.guests.length < 4) T.guests.push(null);
      // the current princess is the host, so she can't also be a guest
      T.guests = T.guests.map((g) => (g === 'p' + S.cur ? null : g));
      T.cups = (T.cups || []).slice(0, 5); while (T.cups.length < 5) T.cups.push(false);
      T.plates = (T.plates || []).slice(0, 5); while (T.plates.length < 5) T.plates.push(null);
      K.save.write();
      K.hintOnce('tea', 'Tap the letter to invite friends to your tea party!');

      const guestName = (id) => (id === 'uni' ? S.unicorn.name : id === 'bun' ? 'Chef Biscuit' : S.names[+id.slice(1)]);
      const guestPitch = (id) => (id === 'uni' ? 1.6 : id === 'bun' ? 1.45 : 1.05 + (+id.slice(1)) * 0.06);

      /* ---------- scenery ---------- */
      K.g(`${A.skyRect()}<g transform="translate(1080 100) scale(.6)">${A.sun()}</g>
        <g class="drift" style="animation-duration:90s"><g transform="translate(0 120)">${A.cloud(0.6)}</g></g>
        ${A.hills(400)}${A.groundRect(420)}
        ${Array.from({ length: 15 }, (_, i) => `<g transform="translate(${-30 + i * 90} 440)">${A.bush(i % 2 ? '#a9e3ad' : '#9ad8a2', 1.3)}</g>`).join('')}
        <g transform="translate(600 440)">${[-420, -140, 140, 420].map((x) => `<rect x="${x - 10}" y="-260" width="20" height="260" rx="8" fill="#fff" stroke="#eac6dc" stroke-width="3"/>`).join('')}
          <path d="M-430 -250 Q-280 -330 -140 -250 Q0 -330 140 -250 Q280 -330 430 -250" stroke="#ffc2dc" stroke-width="16" fill="none" stroke-linecap="round"/>
          ${[-360, -280, -200, -80, 0, 80, 200, 280, 360].map((x, i) => `<g transform="translate(${x} ${-262 - Math.abs(Math.sin(((x + 430) / 280) * Math.PI)) * 40})">${A.flowerHead(D.FLOWER_COLORS[i % 7], 9, false)}</g>`).join('')}</g>
        <ellipse cx="600" cy="610" rx="600" ry="90" fill="#fff4fa" opacity=".6"/>`, root);

      // chairs (heart backs)
      const chairs = K.g([...SEATS, HOST_X].map((x) => `<g transform="translate(${x} 400)"><path d="${A.heart(4.4)}" transform="translate(0 30)" fill="#ffd1e8" stroke="#e57aa8" stroke-width="4"/><path d="${A.heart(2.6)}" transform="translate(0 20)" fill="#fff" opacity=".6"/></g>`).join(''), root);
      const actorsG = K.g('', root);
      // table
      K.g(`<ellipse cx="600" cy="585" rx="540" ry="72" fill="#fff" stroke="#f0d6ea" stroke-width="4"/>
        <path d="M60 585 Q60 680 120 735${A.scallop(120, 1080, 735, 16, 22)} Q1140 680 1140 585 Q600 670 60 585Z" fill="#fff" stroke="#f0d6ea" stroke-width="4"/>
        <path d="M100 640 Q600 720 1100 640" stroke="#ffd1e8" stroke-width="10" fill="none" stroke-dasharray="2 22" stroke-linecap="round"/>
        <ellipse cx="600" cy="585" rx="500" ry="58" fill="#fff8fc"/>
        `, root);
      const tableTop = K.g('', root);

      /* ---------- characters ---------- */
      const host = new K.Princess(actorsG, K.me(), HOST_X, FEET, 0.82);
      K.tap(host.root, () => { host.happy(); host.play('a-hop', 450); K.audio.sfx('giggle'); });
      const guestActors = [null, null, null, null];
      function makeGuest(seat, id, x) {
        let a;
        if (id === 'uni') { a = new K.Unicorn(actorsG, { mane: S.unicorn.mane, acc: S.unicorn.acc }, x, FEET + 20, 0.5); }
        else if (id === 'bun') { a = new K.Bunny(actorsG, x, FEET - 40, 0.85, false); }
        else { a = new K.Princess(actorsG, S.looks[+id.slice(1)], x, FEET, 0.82); }
        a.face = x < 600 ? 1 : -1; a.place();
        a.id = id;
        K.tap(a.root, () => {
          if (T.cups[seat]) return drink(seat);
          if (T.plates[seat]) return eatPlate(seat);
          a.happy(); a.play('a-hop', 450);
          if (id === 'uni') K.audio.sfx('neigh'); else K.audio.sfx('giggle');
          K.fx.speech(guestName(id), a.x, 250, { pitch: guestPitch(id) });
        });
        guestActors[seat] = a;
        return a;
      }
      T.guests.forEach((id, i) => { if (id) makeGuest(i, id, SEATS[i]); });

      /* ---------- cups & plates ---------- */
      const seatX = (i) => (i === 4 ? HOST_X : SEATS[i]);
      function drawTable() {
        tableTop.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const x = seatX(i);
          const present = i === 4 || T.guests[i];
          if (!present) continue;
          const g = K.g(`<ellipse cx="34" cy="606" rx="44" ry="13" fill="#fff" stroke="#e8d8f0" stroke-width="3"/>
            ${T.plates[i] ? `<g transform="translate(34 608) scale(.36)">${A.dish(T.plates[i])}</g>` : ''}
            <g transform="translate(-34 596)"><ellipse cy="12" rx="30" ry="8" fill="#ffd1e8" stroke="#e48ab4" stroke-width="2"/>
              <path d="M-22 -18 H20 Q20 10 -1 12 Q-22 10 -22 -18Z" fill="#fff" stroke="#e48ab4" stroke-width="3"/>
              <path d="M20 -12 Q32 -12 29 -1 Q26 6 17 4" stroke="#e48ab4" stroke-width="3" fill="none"/>
              ${T.cups[i] ? `<ellipse cx="-1" cy="-16" rx="19" ry="4.5" fill="#ff9ec7"/><g class="float"><path d="M-8 -26 q-5 -9 2 -16 M5 -26 q-5 -9 2 -16" stroke="#e9dcff" stroke-width="3" fill="none" stroke-linecap="round"/></g>` : ''}</g>`, tableTop, { transform: `translate(${x} 0)` });
          K.tap(g, (p) => { if (p.x < x) { if (T.cups[i]) drink(i); else pour([i]); } else if (T.plates[i]) eatPlate(i); else serve([i]); });
        }
      }
      drawTable();

      /* ---------- tray ---------- */
      const tray = K.g('<rect x="262" y="664" width="676" height="136" rx="48" fill="#fff" opacity=".7"/>', root);
      K.button(tray, 380, 737, A.icons.envelope, () => openInvite(), { r: 64, fill: 'url(#gBtnGold)' });
      K.button(tray, 527, 737, A.icons.teapot, () => pour(), { r: 64 });
      K.button(tray, 673, 737, A.icons.tray, () => serve(), { r: 64 });
      K.button(tray, 820, 737, A.icons.cheers, () => cheers(), { r: 64, fill: 'url(#gBtnMint)' });

      let busy = false;
      const guestCount = () => T.guests.filter(Boolean).length;

      /* ---------- invite ---------- */
      const popup = K.g('', root);
      function openInvite() {
        if (busy) return;
        popup.innerHTML = '';
        const shade = K.g('<rect x="-900" y="-700" width="3000" height="2400" fill="#6d4a92" opacity=".2"/>', popup);
        K.tap(shade, () => { popup.innerHTML = ''; });
        const all = S.looks.map((_, i) => i).filter((i) => i !== S.cur).map((i) => 'p' + i).concat(['uni', 'bun']);
        const free = all.filter((id) => !T.guests.includes(id));
        const w = free.length * 130 + 60;
        const panel = K.g(`<rect x="${600 - w / 2}" y="190" width="${w}" height="240" rx="46" fill="#fff" stroke="#ffd1e8" stroke-width="6"/>
          <g transform="translate(600 190)"><g transform="scale(.9)">${A.icons.envelope}</g></g>`, popup);
        panel.classList.add('pop-in');
        K.tap(panel, () => {});
        if (!free.length) { K.voice.say('Everyone is already here!'); }
        free.forEach((id, k) => {
          const x = 600 - w / 2 + 95 + k * 130, y = 300;
          let face;
          if (id === 'uni') face = `<g transform="translate(-10 52) scale(.3)">${A.unicorn({ mane: S.unicorn.mane, acc: S.unicorn.acc }).replace('class="uni-art"', 'transform="translate(-120 250)"')}</g>`;
          else if (id === 'bun') face = `<g transform="translate(0 60) scale(.45)">${A.bunny(false)}</g>`;
          else face = `<g transform="translate(0 28) scale(.48)">${A.princessHead(S.looks[+id.slice(1)])}</g>`;
          const g = K.g(`<circle r="56" fill="#fff6fb" stroke="#ffd1e8" stroke-width="4"/><clipPath id="ic${k}"><circle r="54"/></clipPath><g clip-path="url(#ic${k})">${face}</g>
            <g transform="translate(0 84)">${A.label(guestName(id), 22)}</g>`, popup, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => { popup.innerHTML = ''; invite(id); });
        });
      }
      async function invite(id) {
        busy = true;
        let seat = T.guests.indexOf(null);
        if (seat < 0) {
          // table is full: the friend who came first waves goodbye
          seat = 0;
          const old = guestActors[0];
          K.fx.speech('Bye bye!', old.x, 250, { pitch: guestPitch(old.id) });
          old.face = -1; old.place();
          await old.walkTo(-150, old.y, 420);
          old.root.remove();
          T.guests.splice(0, 1); T.guests.push(null);
          T.cups.splice(0, 1); T.cups.splice(3, 0, false);
          T.plates.splice(0, 1); T.plates.splice(3, 0, null);
          guestActors.splice(0, 1); guestActors.push(null);
          guestActors.forEach((a, i) => { if (a) a.walkTo(SEATS[i], a.y, 420).then(() => { a.face = SEATS[i] < 600 ? 1 : -1; a.place(); }); });
          drawTable();
          seat = 3;
        }
        T.guests[seat] = id;
        T.cups[seat] = false; T.plates[seat] = null;
        K.save.write();
        const fromRight = SEATS[seat] > 600;
        const a = makeGuest(seat, id, fromRight ? 1350 : -150);
        if (id === 'uni') a.root.classList.add('trot');
        K.audio.sfx(id === 'uni' ? 'neigh' : 'pop');
        await a.walkTo(SEATS[seat], a.y, 420);
        a.root.classList.remove('trot');
        a.face = SEATS[seat] < 600 ? 1 : -1; a.place();
        a.happy(1500); a.play('a-hop', 450);
        drawTable();
        K.fx.sparkle(a.x, 360, { n: 12 });
        K.fx.speech(`Hi, I'm ${guestName(id)}!`, a.x, 250, { pitch: guestPitch(id), hold: 1.6 });
        await K.wait(1700);
        const n = guestCount();
        K.emit('teaGuest', { n });
        K.fx.number(n, 600, 230, { sayText: n === 1 ? 'One friend!' : `${n} friends!` });
        busy = false;
      }

      /* ---------- pour tea ---------- */
      async function pour(only) {
        if (busy) return;
        const targets = (only || [0, 1, 2, 3, 4]).filter((i) => (i === 4 || T.guests[i]) && !T.cups[i]);
        if (!targets.length) {
          if (only) return;
          K.voice.say(guestCount() ? 'Everyone has tea!' : 'Invite some friends first!');
          return;
        }
        busy = true;
        const pot = K.g(`<g transform="scale(1.3)">${A.icons.teapot}</g>`, K.layers.fx);
        let from = { x: 527, y: 700 };
        let n = T.cups.filter(Boolean).length;
        for (const i of targets) {
          const cx = seatX(i) - 34, cy = 560;
          const f = from;
          await K.tween(450, (t) => K.place(pot, K.lerp(f.x, cx + 50, t), K.lerp(f.y, cy - 70, t) - Math.sin(t * Math.PI) * 60));
          await K.tween(200, (t) => K.place(pot, cx + 50, cy - 70, 1, -40 * t));
          K.audio.sfx('pour');
          const stream = K.el('path', { d: `M${cx + 4} ${cy - 66} Q${cx} ${cy - 40} ${cx - 2} ${cy + 18}`, stroke: '#ff9ec7', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, K.layers.fx);
          await K.wait(500);
          stream.remove();
          T.cups[i] = true; n++;
          drawTable();
          K.fx.number(n, cx, cy - 170, { sayText: n === 1 ? 'one cup' : `${K.data.NUM_WORDS[n] || n} cups` });
          await K.tween(150, (t) => K.place(pot, cx + 50, cy - 70, 1, -40 * (1 - t)));
          from = { x: cx + 50, y: cy - 70 };
          react(i);
        }
        const f = from;
        await K.tween(400, (t) => { K.place(pot, K.lerp(f.x, 527, t), K.lerp(f.y, 720, t), 1 - t * 0.5); pot.setAttribute('opacity', 1 - t); });
        pot.remove();
        K.save.write();
        busy = false;
      }

      /* ---------- serve treats ---------- */
      async function serve(only) {
        if (busy) return;
        const targets = (only || [0, 1, 2, 3, 4]).filter((i) => (i === 4 || T.guests[i]) && !T.plates[i]);
        if (!targets.length) { if (!only) K.voice.say(guestCount() ? 'Everyone has a treat!' : 'Invite some friends first!'); return; }
        busy = true;
        const baked = S.treats.slice();
        let n = T.plates.filter(Boolean).length;
        for (const i of targets) {
          const t = baked.length ? baked[(n) % baked.length] : { shape: K.irand(0, 2), baked: true, frost: K.irand(0, 5), tops: [{ k: K.pick(D.TOPPINGS), x: 0, y: [-94, -64, -124][0], r: 0 }] };
          if (!baked.length) t.tops[0].y = A.toppingZone(t.shape).cy;
          const fly = K.g(`<g transform="scale(.36)">${A.dish(t)}</g>`, K.layers.fx);
          const tx = seatX(i) + 34, ty = 608;
          await K.tween(450, (k) => K.place(fly, K.lerp(673, tx, k), K.lerp(700, ty, k) - Math.sin(k * Math.PI) * 140));
          fly.remove();
          T.plates[i] = t; n++;
          if (i === 4) K.emit('eat', { amount: 35 });
          drawTable();
          K.audio.sfx('pop');
          K.fx.number(n, tx, ty - 190, { sayText: n === 1 ? 'one treat' : `${K.data.NUM_WORDS[n] || n} treats` });
          react(i);
          await K.wait(250);
        }
        K.save.write();
        busy = false;
        K.hint('Tap a cup to drink the tea. Tap the food to eat it!');
        K.voice.say('Tap a cup to drink, and tap the food to eat!');
      }

      function react(i) {
        if (!T.cups[i] || !T.plates[i]) return;
        const a = i === 4 ? host : guestActors[i];
        if (!a) return;
        a.happy(1600); a.play('a-hop', 450);
        K.fx.hearts(a.x, 360, 4);
        if (i !== 4) K.wait(300).then(() => K.fx.speech(K.pick(['Thank you!', 'Yummy!', 'So sweet!', 'Delicious!']), a.x, 250, { pitch: guestPitch(a.id) }));
      }

      /* ---------- drinking and eating (tap a cup or the food) ---------- */
      async function drink(i) {
        if (busy) return;
        busy = true;
        const a = i === 4 ? host : guestActors[i], cx = seatX(i) - 34;
        const mx = a ? a.x : cx, my = 430;
        const cup = K.g(`<g transform="scale(.75)">${A.icons.teacup}</g>`, K.layers.fx);
        await K.tween(420, (t) => K.place(cup, K.lerp(cx, mx + 30, t), K.lerp(590, my, t), 1, -35 * t));
        K.audio.sfx('bubble'); await K.wait(180); K.audio.sfx('bubble');
        T.cups[i] = false; K.save.write(); drawTable();
        await K.tween(350, (t) => K.place(cup, K.lerp(mx + 30, cx, t), K.lerp(my, 590, t), 1, -35 * (1 - t)));
        cup.remove();
        if (a) { a.happy(1500); a.play('a-hop', 450); K.fx.hearts(a.x, 380, 3); }
        K.fx.speech(K.pick(['Slurp!', 'Yummy tea!', 'Mmm!']), mx, 250, { pitch: i === 4 ? undefined : guestPitch(T.guests[i]) });
        K.emit('teaDrink');
        if (i === 4) K.emit('eat', { amount: 5 });
        busy = false;
      }
      async function eatPlate(i) {
        if (busy) return;
        busy = true;
        const a = i === 4 ? host : guestActors[i], food = T.plates[i], px = seatX(i) + 34;
        const mx = a ? a.x : px, my = 430;
        const f = K.g(`<g transform="scale(.32)">${A.dish(food)}</g>`, K.layers.fx);
        await K.tween(420, (t) => K.place(f, K.lerp(px, mx + 20, t), K.lerp(608, my, t)));
        K.audio.sfx('munch');
        await K.wait(450);
        f.remove();
        T.plates[i] = null; K.save.write(); drawTable();
        if (a) { a.happy(1500); a.play('a-hop', 450); K.fx.sparkle(mx, my, { n: 6, colors: ['#ffe0b3', '#ffc2e2'] }); }
        K.fx.speech(food && food.meal ? K.pick(['Healthy and yummy!', 'Delicious!']) : K.pick(['Yummy treat!', 'Mmm!']), mx, 250, { pitch: i === 4 ? undefined : guestPitch(T.guests[i]) });
        if (i === 4) K.emit('eat', { amount: food && food.meal ? 40 : 20 });
        busy = false;
      }

      /* ---------- cheers! ---------- */
      async function cheers() {
        if (busy) return;
        busy = true;
        K.audio.sfx('clink');
        const everyone = [host, ...guestActors.filter(Boolean)];
        everyone.forEach((a, k) => K.wait(k * 120).then(() => { a.happy(1500); a.play('a-jump', 700); }));
        for (let i = 0; i < 5; i++) if ((i === 4 || T.guests[i]) && T.cups[i]) K.fx.sparkle(seatX(i) - 34, 560, { n: 10, spread: 60 });
        K.fx.word('cheers', 600, 230, { sayText: 'Cheers!' });
        await K.wait(900);
        K.audio.sfx('clink');
        const full = guestCount() > 0 && [0, 1, 2, 3, 4].every((i) => !(i === 4 || T.guests[i]) || (T.cups[i] && T.plates[i]));
        K.emit('cheers', { full });
        if (full) {
          K.fx.confetti(60);
          K.audio.sfx('fanfare');
          // count everyone at the party
          const n = everyone.length;
          for (let k = 0; k < n; k++) {
            const a = everyone.slice().sort((p, q) => p.x - q.x)[k];
            K.fx.number(k + 1, a.x, 300, { sayText: K.data.NUM_WORDS[k + 1] });
            a.play('a-hop', 450);
            await K.wait(700);
          }
          K.voice.say(`${n} friends at the tea party! What a lovely party!`);
          if (!T.starGiven) { T.starGiven = true; K.fx.star(600, 300); }
          await K.wait(2600);
          // clear cups & plates for another round
          T.cups = T.cups.map(() => false); T.plates = T.plates.map(() => null); T.starGiven = false;
          K.save.write(); drawTable();
        }
        busy = false;
      }
    },
  };
})();
