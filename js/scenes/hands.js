/* Happy Hands (finger-sucking helper)
   The princess's hand slowly creeps up toward her mouth. Stella taps the hand (or the princess) to stop it,
   then picks something fun for the hands to hold. If the finger gets there first: a few silly germs appear
   and Stella washes them away. Gentle: no sickness, no failing. */
(function () {
  const A = K.art, I = A.icons;

  I.hands = `<g transform="translate(-14 4) rotate(-14)"><path d="M-14 22 V-6 Q-14 -12 -9 -12 V-28 Q-9 -33 -5 -33 Q-1 -33 -1 -28 V-14 V-34 Q-1 -38 3 -38 Q7 -38 7 -34 V-14 V-30 Q7 -34 11 -34 Q15 -34 15 -30 V-10 Q19 -16 23 -12 Q25 -9 22 -4 L14 18 Q10 26 0 26 Q-14 26 -14 22Z" fill="#ffd9c0" stroke="#d89a78" stroke-width="2.5" stroke-linejoin="round"/></g>
    <g transform="translate(16 6) rotate(14) scale(-1 1)"><path d="M-14 22 V-6 Q-14 -12 -9 -12 V-28 Q-9 -33 -5 -33 Q-1 -33 -1 -28 V-14 V-34 Q-1 -38 3 -38 Q7 -38 7 -34 V-14 V-30 Q7 -34 11 -34 Q15 -34 15 -30 V-10 Q19 -16 23 -12 Q25 -9 22 -4 L14 18 Q10 26 0 26 Q-14 26 -14 22Z" fill="#ffd9c0" stroke="#d89a78" stroke-width="2.5" stroke-linejoin="round"/></g>
    <path d="${A.heart(0.9)}" transform="translate(0 -30)" fill="#ff7fb2"/>`;
  I.magnifier = `<circle cx="-6" cy="-6" r="22" fill="#e2f5ff" stroke="#9a7fe0" stroke-width="7"/><path d="M10 10 L30 30" stroke="#9a7fe0" stroke-width="11" stroke-linecap="round"/><path d="M-16 -14 Q-10 -22 -2 -22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const germ = (c, s = 1) => `<g transform="scale(${s})"><circle r="22" fill="${c}" stroke="${K.shade(c, -0.25)}" stroke-width="2.5"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 24).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 24).toFixed(1)}" r="5" fill="${c}" stroke="${K.shade(c, -0.25)}" stroke-width="2"/>`).join('')}
    <circle cx="-7" cy="-4" r="4" fill="#fff"/><circle cx="7" cy="-4" r="4" fill="#fff"/><circle cx="-6" cy="-3" r="2" fill="#4a2c5a"/><circle cx="8" cy="-3" r="2" fill="#4a2c5a"/>
    <path d="M-6 7 Q0 12 6 7" stroke="#4a2c5a" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  const GERM_COLORS = ['#a6e07a', '#c9a6ff', '#7fd8c8', '#ffd166', '#ff9ec7'];

  /** A big open hand with five fingers (outline pass + fill pass so it reads as one shape) */
  const HAND_PARTS = [
    ['rect', { x: -92, y: -40, width: 186, height: 210, rx: 64 }],
    ['rect', { x: -96, y: -112, width: 40, height: 140, rx: 20 }],
    ['rect', { x: -50, y: -168, width: 42, height: 200, rx: 21 }],
    ['rect', { x: -2, y: -192, width: 42, height: 220, rx: 21 }],
    ['rect', { x: 46, y: -160, width: 40, height: 190, rx: 20 }],
    ['rect', { x: 74, y: -40, width: 40, height: 124, rx: 20, transform: 'rotate(35 95 70)' }],
  ];
  const bigHand = (skin) => {
    const sd = K.shade(skin, -0.2);
    const shape = (fill, stroke) => HAND_PARTS.map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')} fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="10"` : ''}/>`).join('');
    return `${shape(sd, sd)}${shape(skin)}<path d="M-50 60 Q0 82 50 58" stroke="${sd}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>
      ${[[-76, -100], [-29, -156], [19, -180], [66, -148]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#fff" opacity=".55"/>`).join('')}`;
  };
  const TIPS = [[-76, -88], [-29, -146], [19, -170], [66, -138], [146, -16]];

  K.scenes.hands = {
    enter(root) {
      const S = K.save.data;
      if (!S.hands || typeof S.hands !== 'object') S.hands = {};
      const H = S.hands;
      const name = K.myName();
      const look = K.me();
      let hearts = 0;
      let state = 'idle'; // idle | rising | mouth | choose | busy | germs

      // layout: on a tall phone screen there is lots of room, so the princess is a big close-up
      let vTop = 0, vBot = 800;
      try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
      const tall = vBot - vTop > 1150;
      const top = tall ? vTop + 200 : 0; // below the HUD buttons
      const PS = tall ? Math.min(4.4, (vBot - top - 620) / 250) : 1.95;
      const PX = 600, PY = tall ? vBot - 420 : 735;
      const TRAY_Y = tall ? vBot - 260 : 730, TRAY_R = tall ? 86 : 66, TRAY_GAP = tall ? 222 : 172;
      const HEART_Y = tall ? top + 40 : 140;
      const sc = PS / 1.95; // size of held toys compared with the normal layout
      const handAt = () => ({ x: PX, y: PY - 74 * PS });

      /* ---------- sunny playroom ---------- */
      let stripes = '';
      for (let x = -900; x < 2100; x += 70) stripes += `<rect x="${x}" y="-700" width="35" height="1260" fill="#fff" opacity=".35"/>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1260" fill="#dff6ec"/>${stripes}
        <rect x="-900" y="556" width="3000" height="1600" fill="#f6e3cf"/><rect x="-900" y="548" width="3000" height="14" fill="#fff"/>
        <ellipse cx="600" cy="${PY - 35}" rx="${380 * Math.max(1, sc * 0.8)}" ry="70" fill="#ffd1e8" stroke="#ffb3d4" stroke-width="5"/>
        <g transform="translate(${tall ? 180 : 1010} ${tall ? top + 260 : 330})"><path d="M-90 110 V-40 A90 90 0 0 1 90 -40 V110Z" fill="#bfe5ff" stroke="#fff" stroke-width="12"/>
          <g transform="translate(30 -40) scale(.4)">${A.sun()}</g><path d="M-90 70 Q0 40 90 64 V110 H-90Z" fill="#b3e6c2"/><path d="M0 -130 V110 M-90 30 H90" stroke="#fff" stroke-width="7"/></g>`, root);

      /* ---------- hearts meter ---------- */
      const meter = K.g('', root);
      function drawMeter(bump) {
        meter.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const g = K.g(`<path d="${A.heart(2.3)}" transform="translate(0 18)" fill="${i < hearts ? '#ff7fb2' : '#fff'}" stroke="${i < hearts ? '#e05c90' : '#e8d8f0'}" stroke-width="4"/>`, meter, { transform: `translate(${(tall ? 380 : 420) + i * (tall ? 110 : 90)} ${HEART_Y}) scale(${tall ? 1.2 : 1})` });
          if (bump && i === hearts - 1) g.firstChild.classList.add('pop');
        }
      }
      drawMeter();

      /* ---------- the princess, with a right arm that can move ---------- */
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, look, PX, PY, PS);
      pr.root.classList.remove('sad'); // always a happy helper here
      function drawPrincess() {
        const art = A.princess(look)
          .replace('M-25 -106 Q-37 -92 -37 -77 M25 -106 Q37 -92 37 -77', 'M-25 -106 Q-37 -92 -37 -77')
          .replace(/<circle cx="37" cy="-74" r="7" fill="[^"]+"\/>/, '');
        pr.anim.innerHTML = `${art}<g class="arm"></g><g class="mouthgerms"></g>`;
      }
      drawPrincess();
      let armT = 0;
      function setArm(t) {
        armT = t;
        const hx = K.lerp(37, 9, t), hy = K.lerp(-74, -128, t);
        const ex = K.lerp(44, 52, t), ey = K.lerp(-88, -116, t);
        // a soft little fist with a thumb that points at her mouth as the hand comes up
        const skin = look.skin, sd = K.shade(skin, -0.2);
        const dc = K.data.DRESS_COLORS[look.color].hex;
        const ang = Math.atan2(-134 - hy, 0 - hx), L = 5 + 9 * t;
        const tx = hx + Math.cos(ang) * L, ty = hy + Math.sin(ang) * L;
        const thumb = t > 0.04 ? `<path d="M${hx} ${hy} L${tx} ${ty}" stroke="${sd}" stroke-width="8.6" stroke-linecap="round"/><path d="M${hx} ${hy} L${tx} ${ty}" stroke="${skin}" stroke-width="6.4" stroke-linecap="round"/>` : '';
        const fist = t > 0.04 ? `<circle cx="${hx}" cy="${hy}" r="8.6" fill="${skin}" stroke="${sd}" stroke-width="1.1"/><path d="M${hx - 4} ${hy + 3} q2 -3 4 0 q2 -3 4 0" stroke="${sd}" stroke-width="1" fill="none" stroke-linecap="round"/>`
          : `<circle cx="${hx}" cy="${hy}" r="7" fill="${skin}"/>`;
        const pulse = Math.sin(performance.now() / 110);
        const glow = state === 'rising' ? `<circle cx="${hx}" cy="${hy}" r="${22 + pulse * 4}" fill="#fff6b0" opacity=".45"/><circle cx="${hx}" cy="${hy}" r="${22 + pulse * 4}" fill="none" stroke="#ffb300" stroke-width="4"/>
          <g transform="translate(${hx + 44 + pulse * 4} ${hy + 8})"><path d="M18 -10 L0 0 L18 10Z M18 -4 H40 V4 H18Z" fill="#ff5fa2" stroke="#fff" stroke-width="2"/></g>` : '';
        pr.anim.querySelector('.arm').innerHTML = `${glow}<path d="M27 -103 Q${ex} ${ey} ${hx} ${hy}" stroke="${skin}" stroke-width="11" fill="none" stroke-linecap="round"/>
          <circle cx="22" cy="-111" r="12" fill="${K.shade(dc, 0.5)}" stroke="${dc}" stroke-width="2.5"/>
          ${thumb}${fist}
          <circle cx="${hx}" cy="${hy}" r="34" fill="#fff" opacity="0"/>`;
      }
      setArm(0);
      K.tap(pr.root, () => {
        if (state === 'rising') return save();
        if (state === 'idle' || state === 'choose') { pr.happy(); pr.play('a-hop', 450); K.audio.sfx('giggle'); }
      });

      /* ---------- busy-hands choices ---------- */
      const CHOICES = [
        { icon: `<g transform="translate(0 36) scale(.62)">${A.room('teddy')}</g>`, word: 'hug teddy', item: `<g transform="translate(0 30) scale(.62)">${A.room('teddy')}</g>` },
        { icon: I.hands, word: 'clap' },
        { icon: I.wand, word: 'wand', item: `<g transform="rotate(-20) scale(1.3)">${I.wand}</g>` },
        { icon: `<path d="${A.star(30)}" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3" stroke-linejoin="round"/><circle cx="-8" cy="-4" r="3" fill="#4a2c5a"/><circle cx="8" cy="-4" r="3" fill="#4a2c5a"/><path d="M-5 6 Q0 10 5 6" stroke="#4a2c5a" stroke-width="2.5" fill="none"/>`, word: 'squishy', item: `<g><path d="${A.star(44)}" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3" stroke-linejoin="round"/><circle cx="-12" cy="-6" r="4" fill="#4a2c5a"/><circle cx="12" cy="-6" r="4" fill="#4a2c5a"/><path d="M-7 9 Q0 15 7 9" stroke="#4a2c5a" stroke-width="3" fill="none"/></g>` },
        { icon: I.unicorn, word: 'pet Sparkle' },
      ];
      const held = K.g('', root);
      const tray = K.g(`<rect x="${600 - 2 * TRAY_GAP - TRAY_R - 24}" y="${TRAY_Y - TRAY_R - 10}" width="${4 * TRAY_GAP + 2 * TRAY_R + 48}" height="${2 * TRAY_R + 24}" rx="${TRAY_R}" fill="#fff" opacity=".8"/>`, root);
      const btns = CHOICES.map((c, i) => K.button(tray, 600 + (i - 2) * TRAY_GAP, TRAY_Y, `<g transform="scale(1.15)">${c.icon}</g>`, () => choose(i), { r: TRAY_R }));
      const glowChoices = (on) => btns.forEach((b) => b.inner.classList.toggle('bob', on));
      K.button(root, tall ? 1080 : 140, tall ? HEART_Y + 140 : 470, `<g transform="scale(1.1)">${I.magnifier}</g>`, () => germCheck(), { r: tall ? 76 : 62, fill: 'url(#gBtnGold)', label: 'germs' });

      /* ---------- the hand creeping up ---------- */
      let riseTimer = 0, stopRise = null;
      function scheduleRise(ms) {
        const my = ++riseTimer;
        K.wait(ms).then(() => { if (my === riseTimer && state === 'idle') rise(); });
      }
      function rise() {
        state = 'rising';
        K.audio.sfx('boing');
        K.hint(`Watch the princess's hand! Tap it before her finger gets to her mouth.`);
        if (!H.seenRise) { H.seenRise = true; K.save.write(); K.voice.say(`Uh oh! Princess ${name}'s finger is sneaking toward her mouth. Tap her hand to stop it!`); }
        else K.voice.say(K.pick(['Uh oh! Tap her hand!', 'Here comes the finger! Tap her hand!', 'Sneaky finger! Stop it!']));
        const dur = 7000; // slow enough for little hands
        let t = 0;
        stopRise = K.every((dt) => {
          if (state !== 'rising') return false;
          t += (dt * 1000) / dur;
          setArm(Math.min(1, t));
          if (t >= 1) { mouth(); return false; }
        });
      }
      async function save() {
        state = 'busy';
        if (stopRise) stopRise();
        const from = armT;
        K.fx.sparkle(PX + 20, PY - 110 * PS, { n: 16, spread: 90 * sc });
        K.audio.sfx('sparkle');
        pr.happy(2000);
        await K.tween(300, (k) => setArm(from * (1 - k)));
        K.voice.say(`You stopped it! Now give her hands something fun to do.`);
        state = 'choose';
        glowChoices(true);
        K.hint('Pick something fun for her hands!');
      }
      async function mouth() {
        state = 'germs';
        setArm(1);
        K.audio.sfx('pop');
        K.voice.say(`Oops, finger in the mouth! Germs can sneak in. Tap the germs to wash them away!`);
        const mg = pr.anim.querySelector('.mouthgerms');
        mg.innerHTML = [[-30, -128], [28, -150], [-14, -100]].map(([x, y], i) => `<g class="mgerm" transform="translate(${x} ${y})">${germ(GERM_COLORS[i], 0.5)}<circle r="26" fill="#fff" opacity="0"/></g>`).join('');
        let left = 3;
        mg.querySelectorAll('.mgerm').forEach((g, i) => K.tap(g, () => {
          if (!g.isConnected) return;
          const b = g.getBoundingClientRect(), p = K.pt({ clientX: b.left + b.width / 2, clientY: b.top + b.height / 2 });
          g.remove(); left--;
          K.fx.bubbles(p.x, p.y, 6, 20); K.audio.sfx('bubble');
          K.fx.number(3 - left, p.x, p.y - 60, { say: false });
          if (left === 0) cleaned();
        }));
        K.hint('Tap the germs to wash them away!');
      }
      async function cleaned() {
        state = 'busy';
        await K.tween(400, (k) => setArm(1 - k));
        K.fx.sparkle(PX, PY - 120 * PS, { n: 14 });
        K.voice.say(`All clean! Next time, tap her hand before it gets to her mouth.`);
        state = 'idle';
        scheduleRise(K.rand(4500, 7000));
      }

      /* ---------- doing something fun with the hands ---------- */
      const praise = () => K.pick(['Happy hands!', 'Busy hands are happy hands!', 'Great job keeping fingers out of the mouth!', 'Super helper!']);
      async function choose(i) {
        if (state === 'busy' || state === 'rising' || state === 'germs') return;
        const earned = state === 'choose';
        state = 'busy';
        glowChoices(false);
        const c = CHOICES[i];
        pr.happy(2500);
        const { x: hx, y: hy } = handAt();
        if (c.word === 'clap') {
          for (let k = 0; k < 3; k++) { K.audio.sfx('pop'); K.fx.sparkle(hx, hy, { n: 10, spread: 70 * sc }); pr.play('a-hop', 300); await K.wait(330); }
        } else if (c.word === 'pet Sparkle') {
          const u = K.g(`<g transform="scale(${-0.6 * Math.max(1, sc * 0.75)} ${0.6 * Math.max(1, sc * 0.75)})">${A.unicorn({ mane: S.unicorn.mane, acc: S.unicorn.acc })}</g>`, held);
          await K.tween(500, (t) => K.place(u, K.lerp(1400, tall ? 960 : 880, t), PY - 45, 1));
          K.fx.hearts(tall ? 900 : 820, PY - 265 * sc, 6); K.audio.sfx('neigh');
          await K.wait(1300);
          await K.tween(450, (t) => K.place(u, K.lerp(tall ? 960 : 880, 1400, t), PY - 45, 1));
          u.remove();
        } else {
          const it = K.g(`<g transform="scale(${sc})">${c.item}</g>`, held);
          K.place(it, hx, hy + 10);
          if (c.word === 'squishy') for (let k = 0; k < 3; k++) { K.replay(it.firstChild.firstChild, 'squish', 450); K.audio.sfx('boing'); await K.wait(480); }
          else if (c.word === 'wand') { K.audio.sfx('sparkle'); for (let k = 0; k < 3; k++) { K.fx.sparkle(hx + 40 * sc, hy - 70 * sc, { n: 10, spread: 90 * sc }); await K.wait(400); } }
          else { K.audio.sfx('giggle'); K.fx.hearts(hx, hy - 40 * sc, 5); await K.wait(1300); }
          await K.wait(300);
          it.remove();
        }
        if (earned) {
          hearts++;
          drawMeter(true);
          K.voice.say(praise());
          if (hearts >= 5) { await K.wait(1200); await allHearts(); }
        } else K.fx.word(c.word, 600, tall ? HEART_Y + 120 : 300);
        state = 'idle';
        scheduleRise(earned ? K.rand(3500, 6000) : K.rand(5000, 8000));
      }

      async function allHearts() {
        K.fx.confetti(80); K.audio.sfx('fanfare');
        pr.happy(4000); pr.play('a-jump', 700);
        K.fx.star(600, tall ? HEART_Y + 200 : 300);
        K.emit('hands');
        if (!H.crown) {
          H.crown = true; K.save.write();
          await K.wait(900);
          look.crown = 5; K.save.write(); drawPrincess(); setArm(0);
          K.fx.sparkle(PX, PY - 230 * PS, { n: 30, spread: 140 * sc });
          K.voice.say(`Five happy hands! You earned the heart crown, Princess ${name}! You can wear it in dress up.`);
          K.fx.word('heart crown', 600, tall ? HEART_Y + 120 : 300, { say: false, hold: 3 });
        } else {
          K.voice.say('Five happy hands! You are amazing at keeping fingers out of your mouth!');
        }
        H.rounds = (H.rounds || 0) + 1; K.save.write();
        await K.wait(3500);
        hearts = 0; drawMeter();
      }

      /* ---------- germ check (magnifying glass) ---------- */
      function germCheck() {
        if (state === 'rising' || state === 'busy' || state === 'germs') return;
        const prev = state;
        state = 'busy'; glowChoices(false);
        const outer = K.g('', root);
        const shade = K.g('<rect x="-900" y="-1200" width="3000" height="3400" fill="#6d4a92" opacity=".3"/>', outer);
        const GK = tall ? 1.5 : 1, GY = tall ? (vTop + vBot) / 2 + 40 : 435;
        const ov = K.g('', outer, { transform: `translate(600 ${GY}) scale(${GK}) translate(-600 -435)` });
        const toStage = (x, y) => [600 + (x - 600) * GK, GY + (y - 435) * GK];
        K.tap(shade, () => {});
        K.g('<rect x="220" y="90" width="760" height="690" rx="50" fill="#fff" stroke="#ffd1e8" stroke-width="8"/>', ov);
        K.g(bigHand(look.skin), ov, { transform: 'translate(540 500) scale(1.1)' });
        const germs = TIPS.map(([x, y], i) => K.g(`${germ(GERM_COLORS[i])}<circle r="34" fill="#fff" opacity="0"/>`, ov, { transform: `translate(${540 + x * 1.1} ${500 + y * 1.1})`, opacity: 0 }));
        const glass = K.g(`<g transform="scale(2.2)">${I.magnifier}</g>`, ov, { transform: 'translate(880 690)' });
        K.button(ov, 950, 120, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => end(), { r: 42 });
        K.voice.say('Let’s look closely at these fingers. Tap the magnifying glass!');
        let looked = false, cleanedN = 0;
        K.tap(glass, () => peek());
        async function peek() {
          if (looked) return; looked = true;
          K.audio.sfx('swoosh');
          let prevP = [880, 690];
          for (const [tx, ty] of TIPS) {
            const x = 540 + tx * 1.1, y = 500 + ty * 1.1, p0 = prevP;
            await K.tween(320, (t) => K.place(glass, K.lerp(p0[0], x + 30, t), K.lerp(p0[1], y + 30, t)));
            germs[TIPS.findIndex((q) => q[0] === tx)].setAttribute('opacity', 1);
            K.audio.sfx('pop');
            prevP = [x + 30, y + 30];
          }
          await K.tween(350, (t) => K.place(glass, K.lerp(prevP[0], 880, t), K.lerp(prevP[1], 690, t)));
          K.voice.say('Look! Tiny germs on all five fingers! If fingers go in your mouth, germs can go in your tummy and give you a tummy ache. Tap each germ to wash it away!');
          germs.forEach((g, i) => K.tap(g, () => zap(g, i)));
        }
        function zap(g, i) {
          if (!g.isConnected) return;
          const [gx, gy] = TIPS[i];
          const x = 540 + gx * 1.1, y = 500 + gy * 1.1;
          const [sx, sy] = toStage(x, y);
          K.fx.bubbles(sx, sy, 8, 30); K.audio.sfx('bubble');
          g.remove();
          cleanedN++;
          K.fx.number(cleanedN, sx, sy - 70);
          if (cleanedN === TIPS.length) K.wait(900).then(async () => {
            K.fx.sparkle(...toStage(540, 420), { n: 30, spread: 220 * GK }); K.audio.sfx('chime');
            K.voice.say('All clean! Keep fingers out of your mouth so the germs can’t get in. Happy hands!');
            K.fx.word('clean', ...toStage(600, 160), { say: false });
            await K.wait(3400);
            end();
          });
        }
        function end() { if (!outer.isConnected) return; outer.remove(); state = prev === 'choose' ? 'choose' : 'idle'; if (state === 'choose') glowChoices(true); else scheduleRise(2500); }
      }

      const intro = `Sometimes Princess ${name}'s fingers sneak into her mouth. Watch her hand! When it starts going up, tap it to help her.`;
      K.hint(intro);
      K.wait(600).then(() => K.voice.say(intro));
      scheduleRise(6500);
    },
  };
})();
