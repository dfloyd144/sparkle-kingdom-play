/* Worlds map (floating islands) and the Space Station world:
   count down to blast off, visit the 8 planets (real facts), a planet quiz, and connect-the-stars pictures. */
(function () {
  const A = K.art, I = A.icons;

  I.rocket = `<g transform="rotate(30) translate(0 4)"><path d="M0 -40 Q18 -22 16 14 H-16 Q-18 -22 0 -40Z" fill="#fff" stroke="#9a7fe0" stroke-width="4" stroke-linejoin="round"/>
    <circle cy="-12" r="8" fill="#9fd2ff" stroke="#9a7fe0" stroke-width="3"/><path d="M-16 4 L-26 20 L-14 16Z M16 4 L26 20 L14 16Z" fill="#ff7fb2" stroke="#e0609a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-8 16 Q0 36 8 16Z" fill="#ffb84d"/></g>`;

  const rocket = (look, flame) => `<g>
    ${flame ? `<path class="flame" d="M-34 70 Q0 190 34 70Z" fill="#ffb84d"/><path d="M-18 70 Q0 140 18 70Z" fill="#fff3a8"/>` : ''}
    <path d="M-60 40 L-100 90 L-50 76Z M60 40 L100 90 L50 76Z" fill="#ff7fb2" stroke="#e0609a" stroke-width="5" stroke-linejoin="round"/>
    <path d="M0 -170 Q70 -100 62 76 H-62 Q-70 -100 0 -170Z" fill="#fff" stroke="#9a7fe0" stroke-width="6" stroke-linejoin="round"/>
    <path d="M0 -170 Q34 -136 46 -100 H-46 Q-34 -136 0 -170Z" fill="#ff9ec7"/>
    <circle cy="-30" r="44" fill="#dff4ff" stroke="#9a7fe0" stroke-width="6"/>
    <clipPath id="rkWin"><circle cy="-30" r="40"/></clipPath><g clip-path="url(#rkWin)"><g transform="translate(0 -4) scale(.42)">${A.princessHead(look)}</g></g>
    <path d="M-62 60 H62" stroke="#c9a6ff" stroke-width="8"/>${[-30, 0, 30].map((x) => `<circle cx="${x}" cy="40" r="5" fill="#c9a6ff"/>`).join('')}</g>`;

  const view = () => {
    let vTop = 0, vBot = 800;
    try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
    return { vTop, vBot, tall: vBot - vTop > 1150, top: vBot - vTop > 1150 ? vTop + 210 : 64 };
  };

  /* ===================== WORLDS MAP ===================== */
  const island = (inner, w = 300) => `<g class="bob"><path d="M${-w / 2} 0 Q0 ${w * 0.75} ${w / 2} 0Z" fill="#c9a07a" stroke="#a87e5a" stroke-width="5"/>
    <path d="M${-w / 2 + 30} 30 Q0 ${w * 0.4} ${w / 2 - 40} 30" stroke="#a87e5a" stroke-width="4" fill="none" opacity=".5"/>
    <ellipse rx="${w / 2 + 6}" ry="34" fill="#a6e0a0" stroke="#7cc47a" stroke-width="5"/>${inner}</g>`;
  K.scenes.worlds = {
    enter(root) {
      const v = view();
      K.g(`<rect x="-900" y="-1400" width="3000" height="3600" fill="url(#gSky)"/>
        ${[[150, 140], [820, 90], [500, 620], [1050, 560]].map(([x, y]) => `<g class="drift" style="animation-duration:70s"><g transform="translate(${x} ${y})">${A.cloud(0.7)}</g></g>`).join('')}`, root);
      const mid = (v.top + v.vBot) / 2;
      const spots = v.tall ? [[330, mid - 520], [870, mid - 520], [330, mid - 60], [870, mid - 60], [600, mid + 400]] : [[220, 300], [600, 300], [980, 300], [400, 640], [800, 640]];
      const S = v.tall ? 1.05 : 0.78;
      const ISLES = [
        { word: 'castle', go: 'kingdom', art: `<g transform="translate(0 0) scale(.32)"><g transform="translate(-600 -470)">${A.castle()}</g></g>`, say: 'Back to the Sparkle Kingdom!' },
        { word: 'space', go: 'space', art: `<g transform="translate(-20 -20) scale(.6)">${rocket(K.me())}</g><g transform="translate(95 -150)"><circle r="30" fill="#ffd98a"/><ellipse rx="52" ry="12" fill="none" stroke="#ffb84d" stroke-width="6" transform="rotate(-18)"/></g>`, say: 'Blast off to space!' },
        { word: 'bug garden', go: 'bugs', art: `<g transform="translate(-60 -40)">${A.flowerHead('#ff9ec7', 34, false)}</g><g transform="translate(60 -70)">${A.flowerHead('#ffd166', 30, false)}</g><g transform="translate(10 -10) scale(.9)">${A.bug ? A.bug('ladybug', [3, 3]) : ''}</g>`, say: 'To the bug garden!' },
        { word: 'mermaids', go: 'mermaid', art: `<g transform="translate(0 -6) scale(.6)">${A.mermaid ? A.mermaid(K.me(), { tail: 3, fin: 0 }) : ''}</g><path d="M-120 -6 Q-60 -40 0 -6 T120 -6" stroke="#6cb6ff" stroke-width="10" fill="none" opacity=".7"/>`, say: 'Dive down to the mermaids!' },
        { word: 'candy factory', go: 'candy', art: `<g transform="translate(-50 -50) scale(.8)">${A.lolly ? A.lolly('red') : ''}</g><g transform="translate(50 -40) scale(.7)">${A.lolly ? A.lolly('purple') : ''}</g><g transform="translate(0 -20)">${A.candy ? A.candy('yellow', 'wrapped', 0.9) : ''}</g>`, say: 'To the candy factory!' },
      ];
      ISLES.forEach((isl, i) => {
        const [x, y] = spots[i];
        const inner = isl.soon ? `<g opacity=".55"><ellipse cy="-60" rx="110" ry="70" fill="#fff"/><text y="-36" text-anchor="middle" font-size="90" fill="#c9a6ff">?</text></g>` : isl.art;
        const g = K.g(`${island(inner)}<g transform="translate(0 150)">${A.label(isl.soon ? 'coming soon' : isl.word, 30)}</g><circle cy="-40" r="170" fill="#fff" opacity="0"/>`, root, { class: 'btn', transform: `translate(${x} ${y}) scale(${S})` });
        K.tap(g, () => {
          K.audio.sfx('pop'); K.replay(g, 'pop', 400);
          if (isl.soon) { K.voice.say('A new world is coming soon!'); return; }
          K.voice.say(isl.say); K.wait(900).then(() => K.go(isl.go));
        });
      });
      K.hintOnce('worlds', 'Pick a world to visit!');
      K.wait(500).then(() => K.voice.say('Which world do you want to visit?'));
    },
  };

  /* ===================== SPACE ===================== */
  const MORE = {
    Mercury: ['A year on Mercury is only 88 days, because it zooms around the sun so fast.', 'Mercury has no air, so its sky is always black, even in the daytime.'],
    Venus: ['On Venus, one day is longer than one whole year!', 'Venus spins backwards, so the sun rises in the west there.'],
    Earth: ['Earth is the only planet we know of with living things.', 'Earth has one moon. It takes about a month to go around us.'],
    Mars: ['Mars has two tiny moons named Phobos and Deimos.', 'Robot rovers are driving on Mars right now, taking pictures and studying rocks.'],
    Jupiter: ['More than one thousand Earths could fit inside Jupiter!', 'Jupiter is a gas giant. It has no ground to stand on.'],
    Saturn: ['Saturn has the most moons of any planet. More than one hundred!', 'Saturn is so light that it could float in a giant bathtub.'],
    Uranus: ['Uranus was the first planet found with a telescope.', 'Uranus is so cold that it is called an ice giant.'],
    Neptune: ['Neptune takes 165 years to go around the sun once.', 'Neptune has the fastest winds in our solar system.'],
  };
  const PLANETS = [
    { name: 'Mercury', c: '#b9b0a8', r: 22, fact: 'Mercury is the closest planet to the sun. It is small and rocky.' },
    { name: 'Venus', c: '#f3c97a', r: 32, fact: 'Venus is the hottest planet. It is covered in thick yellow clouds.' },
    { name: 'Earth', c: '#6cb6ff', r: 34, fact: 'Earth is our home! It has blue oceans, green land, and lots of people and animals.' },
    { name: 'Mars', c: '#e2704a', r: 27, fact: 'Mars is the red planet. It is dusty, and it has giant mountains.' },
    { name: 'Jupiter', c: '#e3b98a', r: 64, fact: 'Jupiter is the biggest planet. It has a giant storm called the great red spot.' },
    { name: 'Saturn', c: '#f0d58a', r: 52, fact: 'Saturn has beautiful rings made of ice and rock.' },
    { name: 'Uranus', c: '#9fe3e0', r: 40, fact: 'Uranus is an icy blue green planet. It spins on its side!' },
    { name: 'Neptune', c: '#5a7ff0', r: 39, fact: 'Neptune is dark blue, cold, and very windy. It is the farthest planet from the sun.' },
  ];
  const planetArt = (p) => {
    const sh = K.shade, r = p.r;
    let extra = '';
    if (p.name === 'Earth') extra = `<path d="M-20 -18 q10 -10 22 -4 q4 10 -6 14 q-12 2 -16 -10Z M4 8 q14 -4 20 6 q-4 12 -18 10Z" fill="#7cd47a"/>`;
    if (p.name === 'Jupiter') extra = `<path d="M-60 -20 H60 M-62 2 H62 M-56 24 H56" stroke="${sh(p.c, -0.18)}" stroke-width="8"/><ellipse cx="18" cy="12" rx="12" ry="8" fill="#d9776a"/>`;
    if (p.name === 'Mars') extra = `<circle cx="-8" cy="-6" r="5" fill="${sh(p.c, -0.2)}"/><circle cx="10" cy="8" r="4" fill="${sh(p.c, -0.2)}"/>`;
    if (p.name === 'Venus') extra = `<path d="M-24 -8 q24 -10 48 0 M-26 10 q26 -8 52 0" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`;
    const ring = p.name === 'Saturn' ? (front) => `<path d="M-96 0 A96 22 0 0 ${front ? 0 : 1} 96 0" fill="none" stroke="#e6b860" stroke-width="10" transform="rotate(-16)"/>`
      : p.name === 'Uranus' ? (front) => `<path d="M0 -62 A12 62 0 0 ${front ? 1 : 0} 0 62" fill="none" stroke="#cfeff0" stroke-width="5"/>` : () => '';
    return `${ring(false)}<circle r="${r}" fill="${p.c}" stroke="${sh(p.c, -0.25)}" stroke-width="4"/><clipPath id="pl${p.name}"><circle r="${r}"/></clipPath><g clip-path="url(#pl${p.name})">${extra}</g>
      <circle cx="${-r * 0.35}" cy="${-r * 0.35}" r="${r * 0.22}" fill="#fff" opacity=".35"/>
      <circle cx="${-r * 0.3}" cy="${r * 0.05}" r="${Math.max(2.5, r * 0.08)}" fill="#3a2a44"/><circle cx="${r * 0.3}" cy="${r * 0.05}" r="${Math.max(2.5, r * 0.08)}" fill="#3a2a44"/>
      <path d="M${-r * 0.18} ${r * 0.28} Q0 ${r * 0.42} ${r * 0.18} ${r * 0.28}" stroke="#3a2a44" stroke-width="${Math.max(2, r * 0.06)}" fill="none" stroke-linecap="round"/>${ring(true)}`;
  };
  const QUIZ = [
    ['Which planet is red?', 'Mars'], ['Which planet has big rings?', 'Saturn'], ['Which planet is the biggest?', 'Jupiter'],
    ['Which planet do we live on?', 'Earth'], ['Which planet is closest to the sun?', 'Mercury'], ['Which planet is the hottest?', 'Venus'],
    ['Which planet spins on its side?', 'Uranus'], ['Which planet is farthest from the sun?', 'Neptune'],
  ];
  const QUIZ_HARD = [
    ['Which planet comes right after Earth?', 'Mars'], ['Which planet comes right before Earth?', 'Venus'], ['Which planet has the most moons?', 'Saturn'],
    ['Which planet has two tiny moons named Phobos and Deimos?', 'Mars'], ['On which planet is one day longer than one year?', 'Venus'],
    ['Which planet is sixth from the sun?', 'Saturn'], ['Robot rovers drive around on which planet?', 'Mars'], ['Which planet has just one moon?', 'Earth'],
    ['Which planet takes 165 years to go around the sun?', 'Neptune'], ['More than one thousand Earths could fit inside which planet?', 'Jupiter'],
    ['Which is the smallest planet?', 'Mercury'], ['Which ice giant was the first planet found with a telescope?', 'Uranus'], ['Which planet has the fastest winds?', 'Neptune'],
    ['Which planet could float in a giant bathtub?', 'Saturn'], ['A year on which planet is only 88 days?', 'Mercury'], ['Which planet is third from the sun?', 'Earth'],
  ];
  // connect-the-stars pictures (points in order)
  const SHAPES = [
    { name: 'star', fill: '#ffd166', pts: Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 90 : 210; return [Math.cos(a) * r, Math.sin(a) * r + 20]; }) },
    { name: 'heart', fill: '#ff7fb2', pts: [[0, -90], [70, -170], [170, -120], [170, -10], [0, 170], [-170, -10], [-170, -120], [-70, -170]] },
    { name: 'rocket', fill: '#c9a6ff', pts: [[0, -220], [70, -110], [70, 80], [140, 170], [40, 140], [-40, 140], [-140, 170], [-70, 80], [-70, -110]] },
    { name: 'moon', fill: '#fff3a8', pts: [[40, -200], [-80, -150], [-150, -40], [-140, 80], [-60, 170], [60, 190], [-10, 110], [-50, 10], [-30, -110]] },
    { name: 'kite', fill: '#7fd8c8', pts: [[0, -210], [150, -40], [0, 200], [-150, -40]] },
  ];

  K.scenes.space = {
    enter(root, opts = {}) {
      const S = K.save.data;
      const SP = (S.space = S.space || { visited: [], tourDay: '', quizRight: 0, shape: 0 });
      const v = view();
      const mid = (v.top + v.vBot) / 2;
      // starry sky
      let skyDots = '';
      let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 140; i++) { const x = rnd() * 1500 - 150, y = v.vTop - 100 + rnd() * (v.vBot - v.vTop + 200); skyDots += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${1.5 + (i % 3)}" fill="#fff" opacity="${0.4 + (i % 5) / 10}"/>`; }
      K.g(`<rect x="-900" y="-1400" width="3000" height="3600" fill="#241a4a"/><rect x="-900" y="-1400" width="3000" height="3600" fill="url(#spGlow)"/>
        <defs><radialGradient id="spGlow" cx=".7" cy=".3" r=".8"><stop offset="0" stop-color="#6a4aa8" stop-opacity=".7"/><stop offset="1" stop-color="#241a4a" stop-opacity="0"/></radialGradient></defs>${skyDots}`, root);
      const layer = K.g('', root);

      /* ---------- countdown and blast off ---------- */
      function launch() {
        layer.innerHTML = '';
        K.g(`<rect x="-900" y="${v.vBot - 150}" width="3000" height="400" fill="#8a7aa0"/><rect x="420" y="${v.vBot - 170}" width="360" height="30" rx="10" fill="#c9bcd8"/>`, layer);
        const rk = K.g(rocket(K.me()), layer, { transform: `translate(600 ${v.vBot - 260}) scale(${v.tall ? 1.3 : 1})` });
        SP.launches = (SP.launches || 0) + 1; K.save.write();
        let n = SP.launches > 3 ? 20 : 10;
        const btnY = v.tall ? v.top + 160 : 170;
        const numBtn = K.button(layer, 600, btnY, `<text y="26" text-anchor="middle" font-size="76" fill="#6d4a92">${n}</text>`, () => tick(), { r: v.tall ? 110 : 80, fill: 'url(#gBtnGold)', label: 'tap to count down' });
        numBtn.inner.classList.add('bob');
        K.voice.say(`Count down to blast off! Tap the number. ${n === 20 ? 'Twenty' : 'Ten'}!`);
        function tick() {
          if (n <= 0) return;
          n--;
          K.audio.sfx('count', n);
          if (n > 0) { numBtn.inner.querySelector('text').textContent = n; K.voice.say(String(n), { force: true }); K.replay(numBtn.inner, 'pop', 300); return; }
          numBtn.remove();
          K.voice.say('Blast off!', { force: true });
          K.audio.sfx('swoosh');
          rk.innerHTML = rocket(K.me(), true);
          const y0 = v.vBot - 260;
          K.tween(1800, (t) => rk.setAttribute('transform', `translate(${600 + Math.sin(t * 20) * 3 * (1 - t)} ${y0 - t * t * (y0 - v.vTop + 500)}) scale(${v.tall ? 1.3 : 1})`), 'linear').then(() => { K.emit('blastoff'); hub(true); });
        }
      }

      /* ---------- planets ---------- */
      let pop = null;
      function hub(first) {
        layer.innerHTML = '';
        const today = new Date().toDateString();
        K.g(`<g transform="translate(-40 ${v.tall ? mid - 360 : 360})"><circle r="170" fill="#fff3a8" opacity=".12"/><circle r="130" fill="#ffd166"/><circle r="100" fill="#ffe08a"/></g>`, layer);
        const big = v.tall ? 1.5 : 1;
        PLANETS.forEach((p, i) => {
          const x = v.tall ? 250 + (i % 4) * 240 : [180, 270, 375, 480, 620, 790, 955, 1090][i];
          const y = v.tall ? (i < 4 ? mid - 230 : mid + 120) : 340;
          const g = K.g(`<g class="bob" style="animation-delay:-${i * 0.4}s">${planetArt(p)}</g><circle r="${Math.max(48, p.r + 14)}" fill="#fff" opacity="0"/>
            <g transform="translate(0 ${p.r + 34})">${A.label(p.name, 20)}</g>`, layer, { class: 'btn', transform: `translate(${x} ${y}) scale(${big})` });
          K.tap(g, () => visit(p, g, x, y));
        });
        const by = v.tall ? Math.min(v.vBot - 170, mid + 420) : 620;
        K.button(layer, v.tall ? 300 : 360, by, `<text y="20" text-anchor="middle" font-size="58" fill="#6d4a92">?</text>`, () => quiz(), { r: v.tall ? 90 : 62, fill: 'url(#gBtnGold)', label: 'planet quiz' });
        K.button(layer, v.tall ? 900 : 840, by, `<path d="${A.star(30)}" fill="#ffd166" stroke="#e6a52e" stroke-width="3"/><path d="M-30 30 L0 -2 L30 26" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="6 6"/>`, () => dots(), { r: v.tall ? 90 : 62, fill: 'url(#gBtnGold)', label: 'star pictures' });
        K.button(layer, 600, by + (v.tall ? 0 : 0), `<g transform="scale(.8)"><circle cx="-30" r="10" fill="#b9b0a8"/><circle r="14" fill="#6cb6ff"/><circle cx="36" r="20" fill="#e3b98a"/></g>`, () => order(), { r: v.tall ? 90 : 62, fill: 'url(#gBtnGold)', label: 'planet order' });
        if (first) K.wait(600).then(() => K.voice.say('Welcome to space! Tap a planet to visit it.'));
        function visit(p, g, x, y) {
          K.audio.sfx('sparkle'); K.replay(g, 'pop', 400);
          K.fx.sparkle(x, y, { n: 12, spread: 60 * big });
          SP.fi = SP.fi || {};
          const facts = [p.fact, ...MORE[p.name]], fi = (SP.fi[p.name] = ((SP.fi[p.name] ?? -1) + 1) % facts.length);
          K.voice.say(`${p.name}. ${facts[fi]}`, { force: true });
          if (!SP.visited.includes(p.name)) SP.visited.push(p.name);
          K.save.write();
          if (SP.visited.length === PLANETS.length && SP.tourDay !== today) {
            SP.tourDay = today; SP.visited = []; K.save.write();
            K.wait(5500).then(() => { if (!root.isConnected) return; K.audio.sfx('fanfare'); K.fx.stars(3, 600, mid); K.fx.confetti(50); K.voice.say('You visited all eight planets! Space explorer!'); });
          }
        }
      }

      /* ---------- overlay panel ---------- */
      function panel() {
        if (pop) pop.remove();
        pop = K.g('', root);
        const shade = K.g('<rect x="-900" y="-1400" width="3000" height="3600" fill="#120c2a" opacity=".6"/>', pop);
        K.tap(shade, () => {});
        const ph = v.tall ? Math.min(1300, v.vBot - v.top - 40) : 700, py = v.tall ? v.top + 10 : 80;
        K.g(`<rect x="70" y="${py}" width="1060" height="${ph}" rx="50" fill="#3a2a6a" stroke="#c9a6ff" stroke-width="8"/>`, pop);
        K.button(pop, 1100, py + 30, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => { pop.remove(); pop = null; }, { r: v.tall ? 56 : 42 });
        return { py, ph };
      }

      /* ---------- planet quiz ---------- */
      function quiz() {
        const { py, ph } = panel();
        const hard = (SP.quizRight || 0) >= 6 && !K.learn.struggling('space');
        const pool = hard ? (Math.random() < 0.75 ? QUIZ_HARD : QUIZ) : QUIZ;
        let qa = K.pick(pool.filter((x) => x[0] !== SP.lastQ));
        const tricky = K.learn.tricky('space');
        if (tricky.length && Math.random() < 0.3) { const t = [...QUIZ, ...QUIZ_HARD].find((x) => x[1] === tricky[0] && x[0] !== SP.lastQ); if (t) qa = t; }
        const [q, ans] = qa; SP.lastQ = q;
        const others = K.shuffle(PLANETS.filter((p) => p.name !== ans)).slice(0, hard ? 3 : 2);
        const opts = K.shuffle([PLANETS.find((p) => p.name === ans), ...others]);
        const qt = K.g(`<text x="600" y="${py + 120}" text-anchor="middle" font-size="${v.tall ? 54 : 46}" fill="#fff">${q}</text>`, pop);
        K.tap(qt, () => K.voice.say(q, { force: true }));
        K.voice.say(q, { force: true });
        let tries = 0, done = false;
        const cy = py + ph / 2 + 30, sc = v.tall ? 1.6 : 1.25;
        const n4 = opts.length === 4;
        opts.forEach((p, i) => {
          const x = n4 ? (v.tall ? 370 + (i % 2) * 460 : 600 + (i - 1.5) * 250) : 600 + (i - 1) * 330;
          const yy = n4 && v.tall ? cy - 200 + Math.floor(i / 2) * 380 : cy;
          const g = K.g(`<rect x="-140" y="-170" width="280" height="330" rx="36" fill="#4a3a80" stroke="#7a6ab0" stroke-width="5"/>
            <g transform="translate(0 -30) scale(${Math.min(sc, 90 / p.r)})">${planetArt(p)}</g><text y="130" text-anchor="middle" font-size="40" fill="#fff">${p.name}</text>`, pop, { class: 'btn', transform: `translate(${x} ${yy}) scale(${v.tall ? 1 : n4 ? 0.8 : 0.9})` });
          K.tap(g, async () => {
            if (done) return;
            if (p.name === ans) {
              done = true;
              g.firstChild.setAttribute('stroke', '#5fd38a'); g.firstChild.setAttribute('stroke-width', 10);
              K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (hard ? 4 : 3) : 1, x, yy);
              SP.quizRight = (SP.quizRight || 0) + 1; K.save.write(); K.learn.record('space', ans, tries === 0); K.emit('spaceQuiz');
              K.voice.say(`${ans}! ${K.pick([PLANETS.find((pp) => pp.name === ans).fact, ...MORE[ans]])}`, { force: true });
              if (SP.quizRight === 6) K.wait(5000).then(() => K.voice.say('Level up! Now the questions get trickier, with four planets to pick from!'));
              await K.wait(6000);
              if (pop && pop.isConnected) quiz();
            } else {
              tries++; K.audio.sfx('boing'); K.replay(g, 'shake', 600);
              K.voice.say(`That's ${p.name}. ${q}`, { force: true });
            }
          });
        });
      }

      /* ---------- planet order: tap them in order from the sun ---------- */
      function order() {
        const { py, ph } = panel();
        K.g(`<text x="600" y="${py + 90}" text-anchor="middle" font-size="40" fill="#fff">tap the planets in order from the sun</text>
          <g transform="translate(110 ${py + 200})"><circle r="44" fill="#ffd166"/></g>`, pop);
        const slotY = py + 200, slotX = (i) => 200 + i * 118;
        const slots = K.g(PLANETS.map((_, i) => `<circle cx="${slotX(i)}" cy="${slotY}" r="40" fill="none" stroke="#7a6ab0" stroke-width="4" stroke-dasharray="8 8"/><text x="${slotX(i)}" y="${slotY + 70}" text-anchor="middle" font-size="24" fill="#a99ad0">${i + 1}</text>`).join(''), pop);
        void slots;
        const mixed = K.shuffle([...PLANETS]);
        const cy = py + ph / 2 + 120;
        let next = 0, wrong = 0;
        mixed.forEach((p, i) => {
          const x = v.tall ? 250 + (i % 4) * 233 : 150 + i * 129, y = v.tall ? cy - 120 + Math.floor(i / 4) * 300 : cy;
          const g = K.g(`<g transform="scale(${Math.min(1.3, 60 / p.r) * (v.tall ? 1.3 : 0.95)})">${planetArt(p)}</g><text y="${v.tall ? 110 : 84}" text-anchor="middle" font-size="${v.tall ? 34 : 26}" fill="#fff">${p.name}</text><circle r="70" fill="#fff" opacity="0"/>`, pop, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => {
            if (!g.isConnected || next >= PLANETS.length) return;
            if (p.name !== PLANETS[next].name) {
              wrong++; K.audio.sfx('boing'); K.replay(g, 'shake', 500);
              K.voice.say(wrong % 3 === 0 ? 'Here is a trick to remember: My Very Educated Mother Just Served Us Nachos. Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!' : `Not ${p.name} yet. Which planet is number ${next + 1} from the sun?`, { force: true });
              return;
            }
            g.remove();
            K.g(`<g transform="translate(${slotX(next)} ${slotY}) scale(${Math.min(1, 34 / p.r)})">${planetArt(p)}</g>`, pop);
            K.audio.sfx('pop'); K.voice.say(`${next + 1}. ${p.name}`, { force: true });
            next++;
            if (next === PLANETS.length) {
              K.wait(900).then(() => {
                if (!pop || !pop.isConnected) return;
                K.audio.sfx('fanfare'); K.fx.confetti(60); K.fx.stars(wrong <= 1 ? 4 : wrong <= 4 ? 2 : 1, 600, cy);
                K.learn.record('space', 'order', wrong <= 1); K.emit('planetOrder');
                K.voice.say('Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune! You put the whole solar system in order!', { force: true });
              });
            }
          });
        });
        K.voice.say('Put the planets in order, starting next to the sun. Which planet is closest to the sun?', { force: true });
      }

      /* ---------- connect the stars ---------- */
      function dots() {
        const { py, ph } = panel();
        const shp = SHAPES[(SP.shape || 0) % SHAPES.length];
        const round = Math.floor((SP.shape || 0) / SHAPES.length), step = [1, 2, 5, 10][Math.min(3, round)];
        const lab = (i) => (i + 1) * step;
        const cy = py + ph / 2 + 20, k = v.tall ? 1.7 : 1.15;
        const P = shp.pts.map(([x, y]) => [600 + x * k, cy + y * k]);
        K.g(`<text x="600" y="${py + 90}" text-anchor="middle" font-size="44" fill="#fff">${step === 1 ? 'tap the stars 1, 2, 3...' : `count by ${step}s: ${step}, ${step * 2}, ${step * 3}...`}</text>`, pop);
        const lines = K.g('', pop);
        let next = 0;
        const gs = P.map(([x, y], i) => {
          const g = K.g(`<path d="${A.star(v.tall ? 30 : 24)}" fill="${i === 0 ? '#ffd166' : '#fff'}" stroke="#e6c34a" stroke-width="3"/><text y="${v.tall ? 66 : 54}" text-anchor="middle" font-size="${v.tall ? 40 : 32}" fill="#ffe9a8">${lab(i)}</text><circle r="${v.tall ? 60 : 46}" fill="#fff" opacity="0"/>`, pop, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => tapStar(i));
          return g;
        });
        K.voice.say(step === 1 ? 'Connect the stars to make a picture! Start with number one.' : `Count by ${step}s to connect the stars! Start with ${step}.`, { force: true });
        function tapStar(i) {
          if (next >= P.length) return;
          if (i !== next) { K.audio.sfx('boing'); K.replay(gs[i], 'shake', 500); K.voice.say(`What comes after ${next ? lab(next - 1) : 'zero'}? Find ${lab(next)}!`, { force: true }); return; }
          K.audio.sfx('count', i + 1); K.voice.say(String(lab(i)), { force: true });
          gs[i].firstChild.setAttribute('fill', '#ffd166'); K.replay(gs[i], 'pop', 300);
          if (i > 0) K.g(`<path d="M${P[i - 1][0]} ${P[i - 1][1]} L${P[i][0]} ${P[i][1]}" stroke="#ffd166" stroke-width="8" stroke-linecap="round"/>`, lines);
          next++;
          if (next < P.length) { gs[next].firstChild.setAttribute('fill', '#fff6c2'); return; }
          // close the shape and fill it in
          K.g(`<path d="M${P[P.length - 1][0]} ${P[P.length - 1][1]} L${P[0][0]} ${P[0][1]}" stroke="#ffd166" stroke-width="8" stroke-linecap="round"/>`, lines);
          K.wait(400).then(() => {
            if (!pop || !pop.isConnected) return;
            lines.insertBefore(K.el('path', { d: 'M' + P.map((p) => p.join(' ')).join(' L') + 'Z', fill: shp.fill, opacity: 0.85 }), lines.firstChild);
            K.audio.sfx('fanfare'); K.fx.stars(step === 1 ? 2 : 3, 600, cy); K.fx.sparkle(600, cy, { n: 30, spread: 220 });
            K.voice.say(`A ${shp.name}! You made a ${shp.name} with the stars!`, { force: true });
            SP.shape = (SP.shape || 0) + 1; K.save.write(); K.emit('starPicture');
            K.wait(4200).then(() => { if (pop && pop.isConnected) dots(); });
          });
        }
      }

      if (opts.landed) hub(false); else launch();
    },
  };
})();
