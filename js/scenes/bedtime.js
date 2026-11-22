/* Bedtime: a picture routine that ends with the princess sleeping in her own bed, plus a real-life Brave Nights chart */
(function () {
  const A = K.art, D = K.data;
  const BED = { x: 650, y: 640 };

  K.sleepState = () => {
    const S = K.save.data;
    if (!S.sleep || typeof S.sleep !== 'object') S.sleep = {};
    S.sleep.total = S.sleep.total || 0;
    return S.sleep;
  };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

  K.scenes.bedtime = {
    enter(root, opts = {}) {
      const S = K.save.data, R = S.room, SL = K.sleepState();
      const name = K.myName();
      const who = ((S.settings && S.settings.goodnight) || 'Mommy and Daddy').trim();
      const whoPlural = / and |&/i.test(who);
      const uniName = S.unicorn.name;
      let step = opts.step || 0, busy = false; // opts.step lets testing jump ahead

      /* ---------- bedroom at night-time ---------- */
      const w = D.WALLS[R.wall % D.WALLS.length], f = D.FLOORS[R.floor % D.FLOORS.length];
      let dots = '';
      for (let x = -880; x < 2100; x += 80) for (let y = -660; y < 500; y += 80) dots += `<circle cx="${x + ((y / 80) % 2 ? 40 : 0)}" cy="${y}" r="7" fill="#fff" opacity=".45"/>`;
      let stars = '';
      for (let i = 0; i < 14; i++) stars += `<circle cx="${K.rand(-80, 80).toFixed(0)}" cy="${K.rand(-140, 40).toFixed(0)}" r="${K.rand(1.5, 3).toFixed(1)}" fill="#fff" class="twinkle" style="animation-delay:-${K.rand(0, 2).toFixed(1)}s"/>`;
      K.g(`<rect x="-900" y="-700" width="3000" height="1260" fill="${w}"/>${dots}
        <rect x="-900" y="470" width="3000" height="90" fill="${K.shade(w, 0.4)}"/><rect x="-900" y="462" width="3000" height="12" fill="#fff"/>
        <rect x="-900" y="556" width="3000" height="760" fill="${f}"/><rect x="-900" y="550" width="3000" height="12" fill="${K.shade(w, -0.12)}"/>
        <g transform="translate(905 230)" class="win"><clipPath id="bwin"><path d="M-90 110 V-50 A90 90 0 0 1 90 -50 V110Z"/></clipPath>
          <path d="M-102 120 V-50 A102 102 0 0 1 102 -50 V120Z" fill="#fff"/>
          <g clip-path="url(#bwin)"><g class="nightsky"><rect x="-100" y="-150" width="200" height="270" fill="url(#gNight)"/>${stars}<g transform="translate(30 -60) scale(.45)">${A.picture("MOON")}</g></g><g class="daysky" style="display:none"><rect x="-100" y="-150" width="200" height="270" fill="#bfe5ff"/><g transform="translate(30 -60) scale(.45)">${A.sun()}</g><path d="M-100 60 Q0 20 100 50 V120 H-100Z" fill="#b3e6c2"/></g></g>
          <path d="M0 -140 V110 M-90 20 H90" stroke="#fff" stroke-width="7"/>
          <path d="M-130 -150 Q-96 0 -138 130 H-96 Q-74 0 -100 -150Z M130 -150 Q96 0 138 130 H96 Q74 0 100 -150Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
          <rect x="-150" y="-162" width="300" height="16" rx="8" fill="url(#gGold)"/></g>`, root);

      // door the grown-ups use (right side)
      const door = K.g(`<path d="M-70 0 V-200 A70 70 0 0 1 70 -200 V0Z" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>
        <g class="panel"><path d="M-56 0 V-196 A56 56 0 0 1 56 -196 V0Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="4"/><circle cx="40" cy="-90" r="7" fill="#ffc54d"/></g>`, root, { transform: 'translate(1112 560)' });
      const doorPanel = door.querySelector('.panel');
      const setDoor = (open) => K.tween(400, (t) => doorPanel.setAttribute('transform', `scale(${(open ? 1 - t * 0.8 : 0.2 + t * 0.8).toFixed(2)} 1) translate(${(open ? -56 * t : -56 * (1 - t)).toFixed(1)} 0)`));

      // nightstand with lamp, the night-light on the floor
      const lamp = K.g(`<rect x="-46" y="-90" width="92" height="90" rx="10" fill="#fff4e0" stroke="#e6b98a" stroke-width="3"/><rect x="-50" y="-100" width="100" height="14" rx="6" fill="#ffd1e8" stroke="#e57aa8" stroke-width="2"/>
        <circle class="glow" cx="0" cy="-160" r="60" fill="url(#gWarm)"/><rect x="-4" y="-150" width="8" height="52" fill="#ffd166"/>
        <path d="M-30 -146 L-20 -186 H20 L30 -146Z" fill="#fff4e0" stroke="#e5c7dc" stroke-width="3"/>
        <g transform="translate(26 -108) scale(.42)">${A.icons.book}</g>`, root, { transform: 'translate(300 640)' });
      const nightLight = K.g(`<circle class="nlglow" r="70" fill="url(#gWarm)" opacity=".4"/><path d="${A.star(22)}" fill="#fff6c2" stroke="#e6c34a" stroke-width="3"/><rect x="-14" y="18" width="28" height="12" rx="5" fill="#c9a6ff"/>`, root, { transform: 'translate(960 640)' });
      K.tap(nightLight, () => { K.audio.sfx('chime'); K.fx.sparkle(960, 640, { n: 10 }); K.fx.word('night-light', 960, 480); });

      // the bed
      const bedBack = K.g(A.bigBedBack(), root, { transform: `translate(${BED.x} ${BED.y})` });
      const sleeperG = K.g('', root, { transform: `translate(${BED.x} ${BED.y})` });
      const bedFront = K.g(A.bigBedFront(), root, { transform: `translate(${BED.x} ${BED.y})` });
      [bedBack, bedFront].forEach((g) => K.tap(g, () => doStep(4)));

      /* ---------- people ---------- */
      const actorsG = K.g('', root);
      const pr = new K.Princess(actorsG, K.me(), 200, 680, 0.9);
      const dayLook = Object.assign({}, K.me());
      const pjLook = Object.assign({}, dayLook, { dress: 5, color: 2, crown: -1 });
      K.makeDraggable(pr, {
        can: () => !busy && step !== 5,
        clamp: (x, y) => ({ x: K.clamp(x, 120, 1060), y: K.clamp(y, 620, 740) }),
        drop: (a) => { if (Math.abs(a.x - BED.x) < 260) doStep(4); },
        tap: () => { pr.happy(); pr.play('a-hop', 450); K.audio.sfx('giggle'); },
      });

      /* ---------- night overlay ---------- */
      const night = K.g(`<rect x="-900" y="-700" width="3000" height="2400" fill="#1b1645" opacity=".68"/>
        ${Array.from({ length: 30 }, () => `<path d="${A.star(K.rand(4, 8))}" transform="translate(${K.rand(-100, 1300).toFixed(0)} ${K.rand(20, 430).toFixed(0)})" fill="#fff6c2" class="twinkle" style="animation-delay:-${K.rand(0, 2).toFixed(1)}s"/>`).join('')}
        <circle cx="960" cy="640" r="170" fill="url(#gWarm)" opacity=".75"/>`, root, { opacity: 0, 'pointer-events': 'none' });
      night.style.display = 'none';
      const uiG = K.g('', root);

      /* ---------- picture checklist ---------- */
      const STEPS = [
        { icon: 'pajamas', word: 'pajamas', say: 'First, put on your pajamas.' },
        { icon: 'toothbrush', word: 'brush teeth', say: 'Next, brush your teeth.' },
        { icon: 'book', word: 'story', say: 'Now, a bedtime story.' },
        { icon: 'hug', word: 'hugs', say: `Goodnight hugs from ${who}.` },
        { icon: 'bed', word: 'my bed', say: 'Get into your very own bed.' },
        { icon: 'moon', word: 'lights out', say: 'Lights out. Time to sleep.' },
      ];
      const strip = K.g('', uiG);
      function drawStrip() {
        strip.innerHTML = '';
        STEPS.forEach((s, i) => {
          const y = 165 + i * 104;
          const done = i < step, cur = i === step;
          const b = K.button(strip, 72, y, `<g transform="scale(1.05)">${A.icons[s.icon]}</g>`, () => doStep(i), { r: 50, fill: done ? 'url(#gBtnMint)' : cur ? 'url(#gBtnGold)' : 'url(#gBtn)', cls: cur ? 'sel' : '' });
          K.g(`<circle cx="38" cy="-36" r="17" fill="${done ? '#5fc48a' : '#ff7fb2'}" stroke="#fff" stroke-width="3"/>
            ${done ? '<path d="M30 -36 L36 -30 L46 -42" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' : `<text x="38" y="-29" text-anchor="middle" font-size="20" fill="#fff">${i + 1}</text>`}`, b.inner);
          if (cur) b.inner.classList.add('bob');
        });
      }
      drawStrip();
      const chartBtn = K.button(uiG, 1112, 230, A.icons.chart, () => openChart(), { r: 56, fill: 'url(#gBtnGold)' });
      void chartBtn;

      const intro = `It's bedtime, Princess ${name}! Let's get ready for bed. Tap the glowing picture.`;
      K.hint(intro);
      const hour = new Date().getHours();
      K.wait(700).then(() => K.voice.say(intro));

      /* ---------- the routine ---------- */
      function doStep(i) {
        if (busy) return;
        if (step >= STEPS.length) return;
        if (i < step) { K.audio.sfx('chime'); K.voice.say(`You already did ${STEPS[i].word}!`); return; }
        if (i > step) { K.audio.sfx('boing'); K.voice.say(STEPS[step].say); drawStrip(); return; }
        busy = true;
        [pajamas, teeth, story, hugs, intoBed, lightsOut][i]().then(() => { step++; drawStrip(); busy = false; if (step < STEPS.length) K.wait(600).then(() => { if (!busy) K.voice.say(STEPS[step].say); }); });
      }

      async function pajamas() {
        K.fx.poof(pr.x, pr.y - 120);
        await K.wait(250);
        pr.setLook(pjLook); pr.happy(1500); pr.play('a-twirl', 900);
        K.fx.sparkle(pr.x, pr.y - 120, { n: 20, spread: 120 });
        K.fx.word('pajamas', 500, 200, { sayText: 'Pajamas on! So soft and cozy.' });
        await K.wait(1800);
      }
      async function teeth() {
        const tb = K.g(`<g transform="scale(1.2)">${A.icons.toothbrush}</g>`, K.layers.fx);
        const hx = pr.x + 50, hy = pr.y - 130 * pr.s;
        K.voice.say('Brush, brush, brush! Let’s count to five.');
        for (let k = 1; k <= 5; k++) {
          await K.tween(380, (t) => K.place(tb, hx + Math.sin(t * Math.PI * 2) * 22, hy, 1, -20 + Math.sin(t * Math.PI * 2) * 20), 'linear');
          K.fx.bubbles(hx - 10, hy, 3, 20); K.audio.sfx('brush');
          K.fx.number(k, pr.x, hy - 150, { say: true });
          await K.wait(320);
        }
        tb.remove();
        pr.happy(1500);
        K.fx.sparkle(hx, hy, { n: 12, spread: 60 });
        K.fx.word('clean', 500, 200, { sayText: 'Sparkly clean teeth!' });
        await K.wait(1500);
      }
      function story() {
        return new Promise((done) => {
          const S2 = whoPlural ? 'sleep' : 'sleeps';
          const bedPages = [
            { pic: `<g transform="translate(0 70) scale(.7)">${A.room('bed')}</g><g transform="translate(-34 -10) scale(.36)">${A.princessHead(pjLook)}</g>`, text: 'my own bed', say: `This is Princess ${name}'s very own bed. It is soft, and cozy, and safe.` },
            { pic: `<g transform="translate(0 40) scale(.5)"><g transform="translate(-600 -300)">${A.castle()}</g></g><g transform="translate(110 -90) scale(.4)">${A.picture('MOON')}</g>`, text: 'everyone sleeps', say: `At night, everyone in the castle sleeps in their own bed. ${who} ${S2} in their bed, just downstairs. ${uniName} sleeps in her cozy stable.` },
            { pic: `<g transform="translate(-90 100) scale(1.35)">${A.room("teddy")}</g><g transform="translate(90 40) scale(2.2)"><path d="${A.star(22)}" fill="#fff6c2" stroke="#e6c34a" stroke-width="3"/></g><g transform="translate(150 -90) scale(.6)">${A.picture("MOON")}</g>`, text: "I am brave", say: `If ${name} wakes up in the night, she hugs her teddy, looks at her night-light, and closes her eyes again. She is brave! And in the morning, ${who} will be right there.` },
          ];
          // more bedtime books: the big words are easy to read; the grown-up voice tells the whole story
          const uni = uniName;
          const pic = (w, s = 1.25) => `<g transform="scale(${s})">${A.spellPic(w)}</g>`;
          const ME = name.toUpperCase(), UNI = uni.toUpperCase();
          const BOOKS = [
            { title: 'My Own Bed', cover: 'BED', pages: bedPages },
            { title: 'The Lost Star', cover: 'STAR', pages: [
              { w: 'STAR', text: 'A star fell down.', say: 'One night, a tiny star slipped out of the sky. It fell down, down, down, into the castle garden. A star fell down.' },
              { w: 'STAR', text: 'The star is sad.', say: 'The little star blinked and sniffled. I want to go home to the sky! The star is sad.' },
              { w: ME, text: 'I can help!', say: `Princess ${name} heard the little star. Don't be sad, she said. I can help!` },
              { w: UNI, text: 'Up, up, up we go!', say: `She climbed onto ${uni} and held the star very gently. ${uni} flew higher and higher into the night sky. Up, up, up we go!` },
              { w: 'MOON', text: 'The star is home.', say: 'The little star hopped back into its spot, right next to the moon, and twinkled extra bright, just for her. The star is home. Good night, little star.' },
            ] },
            { title: 'Bear Can Not Sleep', cover: 'BEAR', pages: [
              { w: 'BEAR', text: 'Bear is in bed.', say: 'Little Bear was all tucked in, but his eyes were wide open. Bear is in bed.' },
              { w: 'BEAR', text: 'Bear can not sleep.', say: 'He wiggled. He giggled. He counted his toes. Bear can not sleep!' },
              { w: 'CUP', text: 'Sip, sip, sip.', say: 'Mama Bear came in with a warm cup of milk. Little Bear took tiny sips. Sip, sip, sip.' },
              { w: 'DUCK', text: 'He hugs his duck.', say: 'Then he hugged his soft, squishy toy duck, nice and tight. He hugs his duck.' },
              { w: 'MOON', text: 'Shh! Bear is asleep.', say: 'His eyes got heavy, and heavier, and closed. Shh! Bear is asleep. Good night, Little Bear.' },
            ] },
            { title: 'Good Night, Kingdom', cover: 'MOON', pages: [
              { w: 'MOON', text: 'The moon is up.', say: 'The sun went down, and the big round moon came up over the Sparkle Kingdom. The moon is up.' },
              { w: 'FISH', text: 'Good night, fish.', say: 'In the pond, the little red fish blew one last bubble. Good night, fish.' },
              { w: 'BEE', text: 'Good night, bee.', say: 'In the garden, the busy bee curled up inside a flower. Good night, bee.' },
              { w: UNI, text: uni.length <= 9 ? `Good night, ${uni}.` : 'Good night, pony.', say: `In the stable, ${uni} lay down in the soft hay and swished her rainbow tail. Good night, ${uni}.` },
              { w: ME, text: 'Good night, me!', say: `And in the castle, Princess ${name} snuggled into her very own bed. Good night, everyone. Good night, me!` },
            ] },
            { title: 'Pig in the Tub', cover: 'PIG', pages: [
              { w: 'PIG', text: 'Pig is in the mud.', say: 'Pig loved to play in the mud. Splish! Splash! Squish! Pig is in the mud.' },
              { w: 'PIG', text: 'Pig is a big mess!', say: 'Pig had mud on his nose, mud on his ears, and mud on his curly tail. Pig is a big mess!' },
              { w: 'TUB', text: 'Get in the tub!', say: 'Bath time, said Mama Pig. Get in the tub!' },
              { w: 'TUB', text: 'Rub, rub, rub!', say: 'Bubbles here, bubbles there. Rub a dub, scrub a dub. Rub, rub, rub!' },
              { w: 'BED', text: 'Pig is in bed.', say: 'All clean and cozy, Pig snuggled under his blanket. Pig is in bed. Good night, Pig.' },
            ] },
          ];
          let pages = bedPages, p = 0;
          const ov = K.g('', uiG);
          // pick a book from the shelf
          function shelf() {
            ov.innerHTML = '';
            const shade = K.g('<rect x="-900" y="-1200" width="3000" height="3400" fill="#6d4a92" opacity=".3"/>', ov);
            K.tap(shade, () => {});
            K.g(`<g class="pop-in"><rect x="150" y="110" width="900" height="560" rx="44" fill="#fffaf2" stroke="#ffd1e8" stroke-width="8"/>
              <text x="600" y="190" text-anchor="middle" font-size="50" fill="#6d4a92"><tspan fill="#ff5fa2">p</tspan>ick a book</text></g>`, ov);
            const COLS = ['#ffb3d4', '#c9a6ff', '#9fd2ff', '#ffd98a', '#a6e0b0'];
            BOOKS.forEach((b, i) => {
              const words = b.title.split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
              const g = K.g(`<g class="inner pop-in" style="animation-delay:${i * 0.05}s"><rect x="-74" y="-130" width="148" height="260" rx="16" fill="${COLS[i]}" stroke="#fff" stroke-width="6"/><rect x="-74" y="-130" width="16" height="260" rx="6" fill="#000" opacity=".1"/>
                <g transform="translate(6 -40) scale(.55)">${b.cover === 'BED' ? `<g transform="translate(0 70) scale(.7)">${A.room('bed')}</g>` : A.spellPic(b.cover)}</g>
                <text x="6" y="58" text-anchor="middle" font-size="25" fill="#4a3366">${l1}</text><text x="6" y="90" text-anchor="middle" font-size="25" fill="#4a3366">${l2}</text></g>`, ov, { class: 'btn', transform: `translate(${280 + i * 160} 440)` });
              K.tap(g, () => { K.audio.sfx('pop'); pages = b.pages; p = 0; K.voice.say(b.title, { rate: 0.85 }); K.wait(1300).then(() => { if (ov.isConnected) draw(); }); });
            });
            K.voice.say('Pick a bedtime story!');
          }
          function draw() {
            ov.innerHTML = '';
            const shade = K.g('<rect x="-900" y="-700" width="3000" height="2400" fill="#6d4a92" opacity=".3"/>', ov);
            K.tap(shade, () => {});
            const pg = pages[p];
            K.g(`<g class="pop-in"><rect x="230" y="90" width="740" height="580" rx="44" fill="#fffaf2" stroke="#ffd1e8" stroke-width="8"/>
              <rect x="300" y="130" width="600" height="330" rx="30" fill="#e9f3ff"/>
              <g transform="translate(600 300)">${pg.pic || pic(pg.w)}</g>
              ${pages.map((_, i) => `<circle cx="${600 - (pages.length - 1) * 20 + i * 40}" cy="610" r="10" fill="${i === p ? '#ff7fb2' : '#ecdff8'}"/>`).join('')}</g>`, ov);
            // the words: tap one to hear it
            const fs = pg.text.length > 16 ? 52 : 62, cw = fs * 0.56, words = pg.text.split(' ');
            const total = words.reduce((a, w) => a + w.length * cw, 0) + (words.length - 1) * fs * 0.35;
            let wx = 600 - total / 2;
            words.forEach((w, i) => {
              const ww = w.length * cw, plain = w.replace(/[^A-Za-z']/g, '');
              const g = K.g(`<rect x="${wx - 6}" y="${545 - fs}" width="${ww + 12}" height="${fs * 1.3}" fill="#fff" opacity="0"/><text x="${wx + ww / 2}" y="545" text-anchor="middle" font-size="${fs}" fill="#6d4a92">${i === 0 ? `<tspan fill="#ff5fa2">${w[0]}</tspan>${w.slice(1)}` : w}</text>`, ov);
              K.tap(g, () => { const t = g.querySelector('text'); t.setAttribute('fill', '#ff5fa2'); K.replay(t, 'pop', 400); K.voice.say(plain.toLowerCase(), { force: true }); K.wait(700).then(() => t.setAttribute('fill', '#6d4a92')); });
              wx += ww + fs * 0.35;
            });
            const say = K.button(ov, 300, 600, A.icons.speaker, () => K.voice.say(pg.say), { r: 44 });
            const next = K.button(ov, 900, 600, A.icons.arrowR, () => { p++; if (p >= pages.length) { ov.remove(); K.fx.word('the end', 600, 200, { sayText: 'The end. Sweet dreams!' }); K.wait(1400).then(done); } else draw(); }, { r: 56, fill: 'url(#gBtnGold)' });
            next.inner.classList.add('bob');
            void say;
            K.voice.say(pg.say, { rate: 0.85 });
          }
          shelf();
        });
      }
      let king = null, queen = null;
      async function grownUpsIn() {
        await setDoor(true);
        queen = new K.Actor(actorsG, 1112, 640, 1.2, 'queen');
        queen.anim.innerHTML = A.queen();
        king = new K.Actor(actorsG, 1112, 650, 1.18, 'king');
        king.anim.innerHTML = A.king();
        queen.face = -1; king.face = -1; queen.place(); king.place();
        await Promise.all([queen.walkTo(pr.x + 150, 660, 240), K.wait(350).then(() => king.walkTo(pr.x + 290, 676, 240))]);
      }
      async function grownUpsOut() {
        await Promise.all([queen.walkTo(1112, 640, 260), K.wait(250).then(() => king.walkTo(1112, 650, 260))]);
        queen.root.remove(); king.root.remove(); queen = king = null;
        await setDoor(false);
      }
      async function hugs() {
        await grownUpsIn();
        pr.face = 1; pr.place();
        [pr, queen, king].forEach((a) => { a.happy(5000); a.play('a-hop', 450); });
        K.fx.hearts(pr.x + 100, pr.y - 220, 12);
        K.audio.sfx('chime');
        K.voice.say(`Goodnight, Princess ${name}! We love you so, so much. We'll be just downstairs. See you in the morning!`, { pitch: 1.0 });
        K.fx.speech('Goodnight! We love you!', pr.x + 220, 300, { say: false, hold: 4.5 });
        await K.wait(5200);
        queen.play('a-hop', 450); king.play('a-hop', 450);
        K.fx.hearts(pr.x + 200, pr.y - 260, 5);
        await grownUpsOut();
        K.voice.say(`${who} ${whoPlural ? 'sleep' : 'sleeps'} in their bed. Princess ${name} sleeps in her own bed.`);
        await K.wait(2500);
      }
      async function intoBed() {
        const tx = BED.x - 130, ty = BED.y - 30;
        await pr.walkTo(BED.x - 330, 690);
        const sx = pr.x, sy = pr.y;
        await K.tween(500, (t) => { pr.x = K.lerp(sx, tx, t); pr.y = K.lerp(sy, ty, t) - Math.sin(t * Math.PI) * 120; pr.place(); });
        pr.root.style.display = 'none';
        sleeperG.innerHTML = `<g transform="translate(8 -130) rotate(-90) scale(.9)"><g class="sleeper happy">${A.princess(pjLook)}</g></g>
          <g transform="translate(-60 -150) rotate(-12) scale(.42)">${A.room('teddy')}</g>`;
        K.audio.sfx('pop');
        K.fx.sparkle(BED.x - 60, BED.y - 160, { n: 16, spread: 120 });
        K.fx.word('my bed', 640, 220, { sayText: `Snuggle into your very own cozy bed. Hug your teddy!` });
        await K.wait(2400);
      }
      let zzz = null;
      async function lightsOut() {
        lamp.querySelector('.glow').setAttribute('opacity', 0);
        night.style.display = '';
        await K.tween(1400, (t) => night.setAttribute('opacity', t.toFixed(2)));
        K.audio.setTrack('lullaby');
        K.needs.sleeping = true;
        K.voice.say(`Goodnight, Princess ${name}. Close your eyes. Brave princesses sleep in their own bed all night long. Sweet dreams.`, { rate: 0.82, pitch: 1.05 });
        let acc = 0;
        zzz = K.every((dt) => {
          acc += dt;
          if (acc < 1.4) return; acc = 0;
          const z = K.el('text', { 'font-size': 44, fill: '#fff6c2' }, K.layers.fx); z.textContent = 'z';
          const x0 = BED.x - 150, y0 = BED.y - 230; let t = 0;
          K.every((d2) => { t += d2; const k = t / 3; if (k >= 1) { z.remove(); return false; } z.setAttribute('x', (x0 + Math.sin(t * 2) * 20 + k * 40).toFixed(1)); z.setAttribute('y', (y0 - k * 160).toFixed(1)); z.setAttribute('opacity', (1 - k).toFixed(2)); });
        });
        await K.wait(7000);
        const sun = K.g(`<g class="bob"><circle r="90" fill="url(#gWarm)"/><circle r="66" fill="#fff" opacity=".25"/>${A.icons.sunUp}</g>`, uiG, { transform: 'translate(640 200)' });
        K.voice.say('When it is morning, tap the sun!');
        K.hint('When it is morning, tap the sun!');
        K.tap(sun, () => { sun.remove(); morning(); });
      }
      async function morning() {
        busy = true;
        if (zzz) zzz();
        K.needs.sleeping = false;
        K.audio.setTrack(K.audio.song || 'kingdom');
        K.audio.sfx('chime');
        await K.tween(1600, (t) => night.setAttribute('opacity', (1 - t).toFixed(2)));
        night.style.display = 'none';
        lamp.querySelector('.glow').setAttribute('opacity', 1);
        root.querySelector('.nightsky').style.display = 'none'; root.querySelector('.daysky').style.display = '';
        K.wait(15000).then(() => { root.querySelector('.nightsky').style.display = ''; root.querySelector('.daysky').style.display = 'none'; });
        // wake up!
        sleeperG.innerHTML = `<g transform="translate(-60 -150) rotate(-12) scale(.42)">${A.room('teddy')}</g>`;
        pr.root.style.display = '';
        pr.setPos(BED.x - 330, 690); pr.face = 1; pr.place();
        pr.happy(4000); pr.play('a-jump', 700);
        K.fx.sparkle(pr.x, pr.y - 150, { n: 24, spread: 140 });
        K.fx.word('morning', 640, 200, { sayText: `Good morning, Princess ${name}!` });
        await K.wait(1600);
        await grownUpsIn();
        [pr, queen, king].forEach((a) => { a.happy(5000); a.play('a-jump', 700); });
        K.fx.confetti(70);
        K.audio.sfx('fanfare');
        K.voice.say(`Good morning! You slept in your own bed all night long! We are so proud of you, brave princess!`, { pitch: 1.0 });
        K.fx.speech('We are so proud of you!', pr.x + 220, 300, { say: false, hold: 4.5 });
        K.fx.star(pr.x, pr.y - 200);
        K.wait(500).then(() => K.fx.star(pr.x + 60, pr.y - 220));
        K.emit('slept');
        await K.wait(5200);
        await grownUpsOut();
        K.fx.poof(pr.x, pr.y - 120);
        pr.setLook(dayLook);
        K.voice.say('Tonight, you can be brave just like the princess!');
        // ready to play again
        step = 0; drawStrip();
        busy = false;
      }

      /* ---------- Brave Nights chart (for real nights) ---------- */
      function openChart(morningAsk) {
        if (busy && !morningAsk) return;
        const ov = K.g('', uiG);
        const shade = K.g('<rect x="-900" y="-700" width="3000" height="2400" fill="#2a2160" opacity=".55"/>', ov);
        K.tap(shade, () => {});
        const filled = SL.total === 0 ? 0 : ((SL.total - 1) % 7) + 1;
        const answered = SL.lastDay === today();
        let slots = '';
        for (let i = 0; i < 7; i++) {
          const x = 600 + (i - 3) * 110;
          slots += `<g transform="translate(${x} 300)"><circle r="48" fill="${i < filled ? '#fff4b8' : '#efe6fb'}" stroke="${i < filled ? '#e6c34a' : '#dccdf3'}" stroke-width="5"/>
            ${i < filled ? `<path d="${A.star(30)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/>` : `<g opacity=".35" transform="scale(.8)">${A.icons.moon}</g>`}
            <text y="78" text-anchor="middle" font-size="24" fill="#a48bc4">${i + 1}</text></g>`;
        }
        K.g(`<g class="pop-in"><rect x="170" y="100" width="860" height="600" rx="50" fill="#fff" stroke="#c9a6ff" stroke-width="8"/>
          <g transform="translate(380 180) scale(.9)">${A.icons.moon}</g>
          <text x="620" y="200" text-anchor="middle" font-size="58" fill="#6d4a92"><tspan fill="#ff5fa2">b</tspan>rave nights</text>
          ${slots}
          <text x="600" y="440" text-anchor="middle" font-size="34" fill="#a48bc4">${SL.total} ${SL.total === 1 ? 'night' : 'nights'} in my own bed</text></g>`, ov);
        const close = () => ov.remove();
        K.button(ov, 1010, 125, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', close, { r: 40 });
        if (answered) {
          K.g(`<g transform="translate(600 570)"><g transform="translate(-70 0) scale(.9)">${A.icons.sunUp}</g><text x="20" y="14" font-size="40" fill="#6d4a92">great job!</text></g>`, ov);
          K.voice.say(`You have ${SL.total} brave ${SL.total === 1 ? 'night' : 'nights'}! You are a brave princess!`);
          return;
        }
        const q = `Did you sleep in your own bed last night, Princess ${name}?`;
        K.voice.say(q);
        K.button(ov, 480, 575, `<g transform="scale(1.2)">${A.icons.thumbsUp}</g>`, async () => {
          SL.total++; SL.lastDay = today();
          K.save.data.stars += 3;
          K.save.write(); K.updateStars(true);
          close();
          K.fx.confetti(80); K.audio.sfx('fanfare');
          pr.happy(3000); pr.play('a-jump', 700);
          const reward = SL.total % 7 === 0;
          if (reward) {
            SL.starlight = true;
            const st = K.save.data.mission; if (st) st.medals = (st.medals || 0) + 1;
            K.save.write();
            K.voice.say(`Seven brave nights! You are a super brave princess! You earned ${uniName}'s magic starlight mane! Go see ${uniName}!`);
            K.fx.word('starlight', 600, 200, { say: false, hold: 3.5 });
          } else {
            K.voice.say(`Hooray! You slept in your own bed! That's ${SL.total} brave ${SL.total === 1 ? 'night' : 'nights'}! I'm so proud of you!`);
            K.fx.number(SL.total, 600, 220, { say: false });
          }
          K.wait(1200).then(() => openChart());
        }, { r: 70, fill: 'url(#gBtnMint)' });
        K.button(ov, 720, 575, `<g transform="scale(1.1)">${A.icons.moon}</g>`, () => {
          SL.lastDay = today(); K.save.write();
          close();
          K.voice.say(`That's okay. Every night is a new chance to be brave. Tonight you can try again, and ${who} will help you!`);
          pr.happy(1500);
        }, { r: 70, fill: 'url(#gBtnLilac)' });
      }
    },
  };
})();
