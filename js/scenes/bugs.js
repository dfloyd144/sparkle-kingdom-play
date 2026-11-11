/* Bug Garden world: find bugs hiding under leaves (real facts), a leveled bug quiz,
   life cycles in order, and ladybug spot math (adding, then missing numbers). */
(function () {
  const A = K.art;

  const face = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-6" cy="-2" r="3.6" fill="#3a2a44"/><circle cx="6" cy="-2" r="3.6" fill="#3a2a44"/>
    <circle cx="-5" cy="-3.4" r="1.3" fill="#fff"/><circle cx="7" cy="-3.4" r="1.3" fill="#fff"/><path d="M-4 5 Q0 8 4 5" stroke="#3a2a44" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  const legs6 = (y, w, c = '#3a2a44') => [-1, 0, 1].map((k) => `<path d="M${k * 14} ${y} l-${w} 16 M${k * 14} ${y} l${w} 16" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`).join('');

  const BUG_ART = {
    ladybug: (spots = [3, 3]) => {
      const SPOT = [[28, -42], [14, -22], [36, -22], [24, -4], [12, -44], [26, -60], [42, -36]]; // clear of the head so every spot can be counted
      const sp = (n, side) => SPOT.slice(0, n).map(([x, y]) => `<circle cx="${side * x}" cy="${y}" r="6.5" fill="#3a2a44"/>`).join('');
      return `${legs6(-14, 26)}<ellipse cy="-30" rx="46" ry="40" fill="#ff4d5e" stroke="#c9303f" stroke-width="4"/><path d="M0 -70 V10" stroke="#3a2a44" stroke-width="4"/>
        ${sp(spots[0], -1)}${sp(spots[1], 1)}<circle cy="-74" r="22" fill="#3a2a44"/><path d="M-10 -92 q-8 -14 -16 -14 M10 -92 q8 -14 16 -14" stroke="#3a2a44" stroke-width="3" fill="none"/>
        <g transform="translate(0 -74)"><circle cx="-7" cy="-2" r="5" fill="#fff"/><circle cx="7" cy="-2" r="5" fill="#fff"/><circle cx="-7" cy="-1" r="2.6" fill="#3a2a44"/><circle cx="7" cy="-1" r="2.6" fill="#3a2a44"/><path d="M-5 8 Q0 11 5 8" stroke="#fff" stroke-width="2" fill="none"/></g>`;
    },
    bee: () => `${legs6(-12, 16)}<ellipse cx="-14" cy="-62" rx="22" ry="14" fill="#dff4ff" stroke="#9fcdea" stroke-width="3" transform="rotate(-25 -14 -62)"/><ellipse cx="14" cy="-62" rx="22" ry="14" fill="#dff4ff" stroke="#9fcdea" stroke-width="3" transform="rotate(25 14 -62)"/>
      <ellipse cy="-34" rx="40" ry="30" fill="#ffd34d" stroke="#d9a12e" stroke-width="4"/><path d="M-22 -60 V-8 M0 -64 V-4 M22 -60 V-8" stroke="#3a2a44" stroke-width="9"/><path d="M40 -34 L54 -34" stroke="#3a2a44" stroke-width="4" stroke-linecap="round"/>
      <circle cx="-44" cy="-40" r="20" fill="#ffd34d" stroke="#d9a12e" stroke-width="4"/>${face(-44, -40, 0.9)}<path d="M-50 -58 q-6 -14 -14 -12 M-40 -58 q2 -14 10 -14" stroke="#3a2a44" stroke-width="3" fill="none"/>`,
    butterfly: () => `<path d="M0 -40 C-40 -100 -90 -80 -70 -40 C-90 -10 -40 10 0 -30Z" fill="#ff9ec7" stroke="#e0609a" stroke-width="4"/><path d="M0 -40 C40 -100 90 -80 70 -40 C90 -10 40 10 0 -30Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="4"/>
      <circle cx="-44" cy="-60" r="10" fill="#fff6b0"/><circle cx="44" cy="-60" r="10" fill="#fff6b0"/><circle cx="-40" cy="-22" r="7" fill="#9fd2ff"/><circle cx="40" cy="-22" r="7" fill="#9fd2ff"/>
      <ellipse cy="-30" rx="8" ry="30" fill="#5a3d6a"/><circle cy="-64" r="12" fill="#5a3d6a"/>${face(0, -64, 0.7)}<path d="M-4 -74 q-8 -16 -16 -16 M4 -74 q8 -16 16 -16" stroke="#5a3d6a" stroke-width="3" fill="none"/>`,
    ant: () => `${legs6(-16, 22)}<ellipse cx="-36" cy="-26" rx="20" ry="16" fill="#6a3a3a"/><ellipse cx="0" cy="-26" rx="16" ry="12" fill="#6a3a3a"/><ellipse cx="38" cy="-30" rx="24" ry="20" fill="#6a3a3a"/>
      ${face(38, -30, 0.9).replace(/#3a2a44/g, '#fff')}<path d="M44 -48 q8 -18 20 -18 M32 -48 q-2 -18 6 -22" stroke="#6a3a3a" stroke-width="3" fill="none"/>`,
    caterpillar: () => `${[-60, -30, 0, 30].map((x, i) => `<circle cx="${x}" cy="-24" r="22" fill="${i % 2 ? '#8fd88f' : '#7cc87c'}" stroke="#5aa85a" stroke-width="3"/><path d="M${x - 6} -2 v8 M${x + 6} -2 v8" stroke="#5aa85a" stroke-width="4" stroke-linecap="round"/>`).join('')}
      <circle cx="58" cy="-32" r="26" fill="#a6e0a0" stroke="#5aa85a" stroke-width="3"/>${face(58, -32)}<path d="M50 -56 l-6 -14 M66 -56 l6 -14" stroke="#5aa85a" stroke-width="3"/><circle cx="44" cy="-70" r="4" fill="#ff9ec7"/><circle cx="72" cy="-70" r="4" fill="#ff9ec7"/>`,
    spider: () => `${[-1, 1].map((sd) => [0, 1, 2, 3].map((k) => `<path d="M${sd * 14} -30 q${sd * 30} ${-20 + k * 12} ${sd * 46} ${k * 14}" stroke="#4a3a5a" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')).join('')}
      <circle cy="-34" r="30" fill="#4a3a5a"/><circle cy="-30" r="14" fill="#ff9ec7" opacity=".6"/>${face(0, -40).replace(/#3a2a44/g, '#fff')}<path d="M0 -64 V-110" stroke="#c9c2d8" stroke-width="2"/>`,
    snail: () => `<path d="M-60 0 Q-70 -10 -50 -12 H40 Q56 -12 60 -30 Q62 -50 48 -52 Q40 -40 44 -26 Q30 -10 -60 0Z" fill="#ffc9a8" stroke="#e09a78" stroke-width="3"/>
      <circle cx="-6" cy="-40" r="34" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="4"/><path d="M-6 -40 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a20 20 0 1 1 -20 -20" stroke="#9a7fe0" stroke-width="4" fill="none"/>
      <path d="M50 -48 l-4 -22 M56 -48 l6 -20" stroke="#e09a78" stroke-width="3"/><circle cx="46" cy="-72" r="4" fill="#3a2a44"/><circle cx="62" cy="-70" r="4" fill="#3a2a44"/><path d="M48 -36 Q54 -32 58 -36" stroke="#3a2a44" stroke-width="2" fill="none"/>`,
    dragonfly: () => `<ellipse cx="-10" cy="-56" rx="40" ry="10" fill="#dff4ff" stroke="#7fc8f0" stroke-width="3" transform="rotate(-12 -10 -56)"/><ellipse cx="-10" cy="-40" rx="38" ry="9" fill="#dff4ff" stroke="#7fc8f0" stroke-width="3" transform="rotate(10 -10 -40)"/>
      <ellipse cx="34" cy="-56" rx="40" ry="10" fill="#dff4ff" stroke="#7fc8f0" stroke-width="3" transform="rotate(12 34 -56)"/><ellipse cx="34" cy="-40" rx="38" ry="9" fill="#dff4ff" stroke="#7fc8f0" stroke-width="3" transform="rotate(-10 34 -40)"/>
      <rect x="-70" y="-52" width="80" height="12" rx="6" fill="#4ac6b8"/><circle cx="20" cy="-46" r="14" fill="#4ac6b8"/><circle cx="40" cy="-48" r="16" fill="#3ab0a2"/>${face(40, -48, 0.8)}`,
    grasshopper: () => `<path d="M-40 -30 L-10 -70 L10 -30" stroke="#5aa85a" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="M10 -30 l-6 30 M24 -30 l6 30" stroke="#5aa85a" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="0" cy="-34" rx="52" ry="18" fill="#8fd88f" stroke="#5aa85a" stroke-width="3"/><circle cx="54" cy="-40" r="20" fill="#a6e0a0" stroke="#5aa85a" stroke-width="3"/>${face(56, -40, 0.9)}
      <path d="M50 -58 q-4 -30 -24 -40 M60 -58 q4 -30 22 -40" stroke="#5aa85a" stroke-width="3" fill="none"/>`,
    firefly: () => `<circle cx="-34" cy="-30" r="30" fill="#fff6a0" opacity=".55"/>${legs6(-14, 14)}<ellipse cx="-6" cy="-58" rx="20" ry="12" fill="#e9e2f4" stroke="#b9aed0" stroke-width="2" transform="rotate(-20 -6 -58)"/>
      <ellipse cx="-28" cy="-30" rx="20" ry="16" fill="#ffe94d" stroke="#e6c22e" stroke-width="3"/><ellipse cx="6" cy="-32" rx="22" ry="16" fill="#5a4a6a"/><circle cx="34" cy="-36" r="16" fill="#ff8f6a"/>${face(34, -36, 0.8)}
      <path d="M38 -50 q4 -14 14 -16 M30 -50 q-2 -14 -8 -18" stroke="#5a4a6a" stroke-width="3" fill="none"/>`,
  };
  A.bug = (type, opt) => `<g class="bug-art">${BUG_ART[type](opt)}</g>`;

  const BUGS = [
    { id: 'ladybug', name: 'ladybug', legs: 6, facts: ['Ladybugs are beetles. They eat tiny bugs called aphids that hurt plants, so gardeners love them.', 'A ladybug’s bright red color tells birds: I taste yucky! Leave me alone!', 'When a ladybug is scared, it plays dead.'] },
    { id: 'bee', name: 'bee', legs: 6, facts: ['Honey bees make honey from the nectar inside flowers.', 'Bees do a wiggle dance to tell the other bees where the best flowers are.', 'Bees carry pollen from flower to flower, and that helps plants grow fruit like apples and strawberries.'] },
    { id: 'butterfly', name: 'butterfly', legs: 6, facts: ['Butterflies taste with their feet!', 'A butterfly drinks nectar through a long straw called a proboscis.', 'Every butterfly started out as a caterpillar.'] },
    { id: 'ant', name: 'ant', legs: 6, facts: ['Ants can carry things much heavier than their own bodies.', 'Ants live in big families called colonies, with a queen ant in charge of laying eggs.', 'Ants leave a smell trail so their friends can follow them to food.'] },
    { id: 'caterpillar', name: 'caterpillar', legs: 6, facts: ['A caterpillar eats and eats, then makes a chrysalis and changes into a butterfly. That change is called metamorphosis.', 'A caterpillar has six real legs in front and squishy pretend legs called prolegs in back.'] },
    { id: 'spider', name: 'spider', legs: 8, facts: ['Spiders have eight legs, so they are not insects. They are arachnids.', 'Spiders spin silk to make webs, and spider silk is stronger than steel of the same size!', 'Most spiders have eight eyes.'] },
    { id: 'snail', name: 'snail', legs: 0, facts: ['Snails carry their homes on their backs.', 'A snail has no legs. It slides along on one big foot, on a trail of slime.', 'Snails are not insects. They are mollusks, like clams and octopuses.'] },
    { id: 'dragonfly', name: 'dragonfly', legs: 6, facts: ['Dragonflies can fly forwards, backwards, and even upside down!', 'Dragonflies have giant eyes that can see almost all the way around them.', 'Dragonflies were flying around even before the dinosaurs.'] },
    { id: 'grasshopper', name: 'grasshopper', legs: 6, facts: ['Grasshoppers hear with ears on their tummies!', 'A grasshopper can jump about twenty times the length of its body.', 'Grasshoppers sing by rubbing their legs against their wings.'] },
    { id: 'firefly', name: 'firefly', legs: 6, facts: ['Fireflies make their own light to talk to each other.', 'Fireflies are beetles, and their light does not get hot at all.', 'Each kind of firefly blinks its own special pattern.'] },
  ];
  const byId = (id) => BUGS.find((b) => b.id === id);

  // quiz: each answer is a bug (or a number of legs)
  const QUIZ = [
    ['Which bug makes honey?', 'bee'], ['Which bug turns into a butterfly?', 'caterpillar'], ['Which bug carries its house on its back?', 'snail'],
    ['Which bug spins a web?', 'spider'], ['Which bug can glow in the dark?', 'firefly'], ['Which bug is red with black spots?', 'ladybug'],
    ['Which bug lives in a colony with a queen?', 'ant'], ['Which bug has big jumping legs?', 'grasshopper'],
  ];
  const QUIZ_HARD = [
    ['Which bug tastes with its feet?', 'butterfly'], ['Which bug has eight legs and is not an insect?', 'spider'], ['Which bug has no legs at all?', 'snail'],
    ['Which bug can fly backwards and upside down?', 'dragonfly'], ['Which bug hears with ears on its tummy?', 'grasshopper'], ['Which bug does a wiggle dance?', 'bee'],
    ['Which beetle eats aphids and helps gardens?', 'ladybug'], ['Which bug drinks with a long straw called a proboscis?', 'butterfly'], ['Which bug was flying before the dinosaurs?', 'dragonfly'],
    ['Which bug leaves a smell trail for its friends?', 'ant'], ['Which bug is a mollusk, like a clam?', 'snail'], ['Which bug has eight eyes?', 'spider'],
  ];
  const LEGQ = [['spider', 8], ['ant', 6], ['snail', 0], ['bee', 6], ['grasshopper', 6], ['ladybug', 6]];

  // life cycles
  const egg = `<ellipse cx="-10" cy="4" rx="9" ry="12" fill="#fff6c2" stroke="#e6c34a" stroke-width="2"/><ellipse cx="8" cy="0" rx="9" ry="12" fill="#fff6c2" stroke="#e6c34a" stroke-width="2"/><ellipse cx="0" cy="18" rx="9" ry="12" fill="#fff6c2" stroke="#e6c34a" stroke-width="2"/>`;
  const leaf = (inner) => `<path d="M-60 30 Q-50 -50 50 -40 Q60 40 -60 30Z" fill="#a6e0a0" stroke="#5aa85a" stroke-width="3"/><g>${inner}</g>`;
  const CYCLES = [
    { name: 'butterfly', stages: [
      { w: 'egg', art: leaf(egg), say: 'First, a tiny egg on a leaf.' },
      { w: 'caterpillar', art: `<g transform="scale(.6) translate(0 30)">${BUG_ART.caterpillar()}</g>`, say: 'Then a hungry caterpillar hatches out.' },
      { w: 'chrysalis', art: `<path d="M0 -60 V-44" stroke="#8a6448" stroke-width="4"/><path d="M0 -44 C26 -30 22 30 0 50 C-22 30 -26 -30 0 -44Z" fill="#9fd88f" stroke="#5aa85a" stroke-width="3"/><path d="M-12 -10 H12 M-10 10 H10" stroke="#ffd166" stroke-width="3"/>`, say: 'Next it makes a chrysalis and changes inside.' },
      { w: 'butterfly', art: `<g transform="scale(.7) translate(0 30)">${BUG_ART.butterfly()}</g>`, say: 'Out comes a beautiful butterfly!' } ] },
    { name: 'ladybug', stages: [
      { w: 'egg', art: leaf(egg.replace(/#fff6c2/g, '#ffd166')), say: 'First, a little cluster of yellow eggs.' },
      { w: 'larva', art: `<g>${[-36, -12, 12].map((x) => `<ellipse cx="${x}" cy="0" rx="14" ry="12" fill="#4a3a5a"/><circle cx="${x}" cy="-4" r="4" fill="#ff9a3d"/>`).join('')}<circle cx="36" cy="-2" r="13" fill="#4a3a5a"/>${face(36, -2, 0.6).replace(/#3a2a44/g, '#fff')}</g>`, say: 'Then a spiky larva hatches. It does not look like a ladybug yet!' },
      { w: 'pupa', art: `<ellipse cy="0" rx="30" ry="24" fill="#ff9a3d" stroke="#d9772e" stroke-width="3"/><circle cx="-10" cy="-4" r="4" fill="#4a3a5a"/><circle cx="10" cy="6" r="4" fill="#4a3a5a"/>`, say: 'Next it becomes a pupa and changes inside.' },
      { w: 'ladybug', art: `<g transform="scale(.7) translate(0 40)">${BUG_ART.ladybug([3, 3])}</g>`, say: 'Out comes a ladybug!' } ] },
  ];

  const view = () => {
    let vTop = 0, vBot = 800;
    try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
    return { vTop, vBot, tall: vBot - vTop > 1150, top: vBot - vTop > 1150 ? vTop + 210 : 64 };
  };

  K.scenes.bugs = {
    enter(root) {
      const S = K.save.data;
      const BG = (S.bugs = S.bugs || { found: [], day: '', quizRight: 0, cycle: 0, mathRight: 0 });
      const v = view(), mid = (v.top + v.vBot) / 2, big = v.tall ? 1.4 : 1;
      const today = new Date().toDateString();
      if (BG.day !== today) { BG.day = today; BG.found = []; BG.paid = false; }

      // garden
      K.g(`<rect x="-900" y="-1400" width="3000" height="3600" fill="url(#gSky)"/><g transform="translate(1050 ${v.top + 60}) scale(.6)">${A.sun()}</g>
        <rect x="-900" y="${v.tall ? v.top + 220 : 250}" width="3000" height="3000" fill="#b9e8a8"/>
        <path d="M-900 ${v.tall ? v.top + 230 : 260} Q300 ${v.tall ? v.top + 160 : 190} 1200 ${v.tall ? v.top + 230 : 260} V3000 H-900Z" fill="#a6e0a0"/>`, root);
      const layer = K.g('', root);

      /* ---------- hidden bugs ---------- */
      const cols = v.tall ? 3 : 5, rows = Math.ceil(BUGS.length / cols);
      const gx = (i) => (v.tall ? 240 + (i % cols) * 360 : 160 + (i % cols) * 220), gy = (i) => (v.tall ? v.top + 380 + Math.floor(i / cols) * ((v.vBot - v.top - 760) / Math.max(1, rows - 1)) : 340 + Math.floor(i / cols) * 200);
      const COVERS = [
        (c) => `<path d="M-70 10 Q-60 -70 0 -80 Q60 -70 70 10 Q0 30 -70 10Z" fill="${c}" stroke="#5aa85a" stroke-width="4"/><path d="M0 -76 V14" stroke="#5aa85a" stroke-width="3"/>`,
        () => `<ellipse cy="-20" rx="70" ry="40" fill="#c9bcd8" stroke="#a99ac0" stroke-width="4"/><ellipse cx="-20" cy="-36" rx="16" ry="8" fill="#fff" opacity=".4"/>`,
        () => `${[-40, 0, 40].map((x, k) => `<g transform="translate(${x} ${-20 - (k % 2) * 16})">${A.flowerHead(['#ff9ec7', '#ffd166', '#c9a6ff'][k], 22, false)}</g>`).join('')}<path d="M-60 10 Q0 -10 60 10" stroke="#5aa85a" stroke-width="10" fill="none"/>`,
      ];
      function garden() {
        layer.innerHTML = '';
        BUGS.forEach((b, i) => {
          const x = gx(i), y = gy(i), found = BG.found.includes(b.id);
          const g = K.g('', layer, { class: 'btn', transform: `translate(${x} ${y}) scale(${big})` });
          const draw = (open) => {
            g.innerHTML = open ? `<g class="pop-in"><g transform="scale(.8)">${A.bug(b.id)}</g><g transform="translate(0 40)">${A.label(b.name, 22)}</g></g><circle cy="-30" r="80" fill="#fff" opacity="0"/>`
              : `<g class="bob" style="animation-delay:-${i * 0.3}s">${COVERS[i % 3](['#8fd88f', '#7cc87c', '#a6e0a0'][i % 3])}</g><circle cy="-30" r="80" fill="#fff" opacity="0"/>`;
          };
          draw(found);
          K.tap(g, () => {
            const open = BG.found.includes(b.id);
            if (!open) { BG.found.push(b.id); K.save.write(); draw(true); K.audio.sfx('pop'); K.fx.sparkle(x, y - 40, { n: 12, spread: 60 }); }
            else K.replay(g, 'pop', 400);
            BG.fi = BG.fi || {};
            const fi = (BG.fi[b.id] = ((BG.fi[b.id] ?? -1) + 1) % b.facts.length);
            K.voice.say(`${open ? '' : 'You found a ' + b.name + '! '}${b.facts[fi]}`, { force: true });
            K.emit('bugFound', { id: b.id });
            if (BG.found.length === BUGS.length && !BG.paid) {
              BG.paid = true; K.save.write();
              K.wait(6500).then(() => { if (!root.isConnected) return; K.audio.sfx('fanfare'); K.fx.confetti(60); K.fx.stars(3, 600, mid); K.voice.say('You found all ten bugs! You are a real bug scientist!'); });
            }
          });
        });
        const by = v.tall ? v.vBot - 170 : 720;
        const BTNS = [['bug quiz', `<text y="20" text-anchor="middle" font-size="58" fill="#6d4a92">?</text>`, quiz], ['life cycles', `<g transform="scale(.42)">${A.bug('butterfly')}</g><path d="M-34 24 A40 40 0 1 0 -40 -10" stroke="#9a7fe0" stroke-width="5" fill="none"/>`, cycles], ['ladybug math', `<g transform="translate(0 22) scale(.45)">${A.bug('ladybug', [2, 3])}</g>`, ladyMath]];
        BTNS.forEach(([label, icon, fn], i) => K.button(layer, 600 + (i - 1) * (v.tall ? 330 : 260), by, icon, fn, { r: v.tall ? 88 : 54, fill: 'url(#gBtnGold)', label }));
      }

      /* ---------- panel ---------- */
      let pop = null;
      function panel() {
        if (pop) pop.remove();
        pop = K.g('', root);
        const shade = K.g('<rect x="-900" y="-1400" width="3000" height="3600" fill="#3a5a3a" opacity=".45"/>', pop);
        K.tap(shade, () => {});
        const ph = v.tall ? Math.min(1300, v.vBot - v.top - 40) : 700, py = v.tall ? v.top + 10 : 80;
        K.g(`<rect x="70" y="${py}" width="1060" height="${ph}" rx="50" fill="#fffaf2" stroke="#a6e0a0" stroke-width="8"/>`, pop);
        K.button(pop, 1100, py + 30, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => { pop.remove(); pop = null; }, { r: v.tall ? 56 : 42 });
        return { py, ph };
      }
      const titleAt = (py, text) => K.g(`<text x="600" y="${py + 110}" text-anchor="middle" font-size="${v.tall ? 50 : 42}" fill="#4a3366">${text}</text>`, pop);

      /* ---------- bug quiz (bugs, then legs, then tricky facts) ---------- */
      function quiz() {
        const { py, ph } = panel();
        const hard = (BG.quizRight || 0) >= 6 && !K.learn.struggling('bugs');
        const legsQ = Math.random() < (hard ? 0.3 : 0.2);
        let q, ans, opts;
        if (legsQ) {
          const [id, n] = K.pick(LEGQ);
          q = `How many legs does a ${byId(id).name} have?`; ans = String(n);
          opts = K.shuffle(['0', '6', '8']);
        } else {
          const pool = hard && Math.random() < 0.75 ? QUIZ_HARD : QUIZ;
          let qa = K.pick(pool.filter((x) => x[0] !== BG.lastQ));
          const tricky = K.learn.tricky('bugs');
          if (tricky.length && Math.random() < 0.3) { const t = [...QUIZ, ...QUIZ_HARD].find((x) => x[1] === tricky[0] && x[0] !== BG.lastQ); if (t) qa = t; }
          [q, ans] = qa;
          opts = K.shuffle([ans, ...K.shuffle(BUGS.filter((b) => b.id !== ans).map((b) => b.id)).slice(0, hard ? 3 : 2)]);
        }
        BG.lastQ = q;
        const qt = titleAt(py, q);
        K.tap(qt, () => K.voice.say(q, { force: true }));
        K.voice.say(q, { force: true });
        let tries = 0, done = false;
        const n = opts.length, cy = py + ph / 2 + 40;
        opts.forEach((o, i) => {
          const x = n === 4 ? (v.tall ? 370 + (i % 2) * 460 : 600 + (i - 1.5) * 250) : 600 + (i - 1) * 320;
          const y = n === 4 && v.tall ? cy - 200 + Math.floor(i / 2) * 380 : cy;
          const inner = legsQ ? `<text y="30" text-anchor="middle" font-size="110" fill="#6d4a92">${o}</text><text y="100" text-anchor="middle" font-size="34" fill="#a48bc4">legs</text>`
            : `<g transform="translate(0 30) scale(${n === 4 ? 0.9 : 1.05})">${A.bug(o)}</g><text y="130" text-anchor="middle" font-size="34" fill="#6d4a92">${byId(o).name}</text>`;
          const g = K.g(`<rect x="-120" y="-150" width="240" height="310" rx="36" fill="#fff" stroke="#e8dcf8" stroke-width="6"/>${inner}`, pop, { class: 'btn', transform: `translate(${x} ${y}) scale(${v.tall ? 1.15 : n === 4 ? 0.85 : 0.95})` });
          K.tap(g, async () => {
            if (done) return;
            if (o === ans) {
              done = true;
              g.firstChild.setAttribute('fill', '#c9f7dd'); g.firstChild.setAttribute('stroke', '#5fc48a');
              K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (hard ? 4 : 3) : 1, x, y);
              BG.quizRight = (BG.quizRight || 0) + 1; K.save.write(); K.learn.record('bugs', legsQ ? 'legs' : ans, tries === 0); K.emit('bugQuiz');
              const b = legsQ ? byId(LEGQ.find(([id]) => q.includes(byId(id).name))[0]) : byId(ans);
              K.voice.say(`${legsQ ? ans + ' legs!' : b.name + '!'} ${K.pick(b.facts)}`, { force: true });
              if (BG.quizRight === 6) K.wait(5000).then(() => K.voice.say('Level up! Now the bug questions get trickier!'));
              await K.wait(6500);
              if (pop && pop.isConnected) quiz();
            } else {
              tries++; K.audio.sfx('boing'); K.replay(g, 'shake', 600);
              K.voice.say(legsQ ? `Not ${o}. Insects have six legs. Is this one an insect? ${q}` : `That's a ${byId(o).name}. ${q}`, { force: true });
            }
          });
        });
      }

      /* ---------- life cycles: tap the stages in order ---------- */
      function cycles() {
        const { py, ph } = panel();
        const cyc = CYCLES[(BG.cycle || 0) % CYCLES.length];
        titleAt(py, `the ${cyc.name} life cycle`);
        const cx = 600, cy = v.tall ? py + ph * 0.42 : py + 314, R = v.tall ? 230 : 150, SR = v.tall ? 85 : 58;
        // four slots in a circle with arrows
        const slotP = (i) => [cx + Math.cos(-Math.PI / 2 + (i * Math.PI) / 2) * R, cy + Math.sin(-Math.PI / 2 + (i * Math.PI) / 2) * R * (v.tall ? 1 : 0.75)];
        K.g([0, 1, 2, 3].map((i) => { const [x, y] = slotP(i); return `<circle cx="${x}" cy="${y}" r="${SR}" fill="#f2fbf0" stroke="#a6e0a0" stroke-width="4" stroke-dasharray="10 10"/><text x="${x + SR * 0.75}" y="${y - SR * 0.6}" text-anchor="middle" font-size="30" fill="#8ab88a">${i + 1}</text>`; }).join('')
          + `<ellipse cx="${cx}" cy="${cy}" rx="${R - SR - 16}" ry="${R * (v.tall ? 1 : 0.75) - SR - 16}" fill="none" stroke="#c9a6ff" stroke-width="6" stroke-dasharray="20 16"/>`, pop);
        const choicesG = K.g('', pop);
        let next = 0, wrong = 0;
        // choices sit in the middle, shuffled
        K.shuffle(cyc.stages.map((s, i) => ({ s, i }))).forEach(({ s, i }, k) => {
          const x = 600 + (k - 1.5) * (v.tall ? 250 : 200), y = py + ph - (v.tall ? 150 : 90);
          const g = K.g(`<circle r="${v.tall ? 80 : 58}" fill="#fff" stroke="#e8dcf8" stroke-width="5"/><g transform="scale(${v.tall ? 1.15 : 0.85})">${s.art}</g><circle r="${v.tall ? 80 : 58}" fill="#fff" opacity="0"/>`, choicesG, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => {
            if (next >= 4 || !g.isConnected) return;
            if (i !== next) {
              wrong++; K.audio.sfx('boing'); K.replay(g, 'shake', 500);
              K.voice.say(`Not yet! That is the ${s.w}. What comes ${next === 0 ? 'first' : 'after the ' + cyc.stages[next - 1].w}?`, { force: true });
              return;
            }
            g.remove();
            const [sx, sy] = slotP(next);
            K.g(`<g class="pop-in"><g transform="scale(${v.tall ? 1.05 : 0.75})">${s.art}</g><g transform="translate(0 ${SR + 22})">${A.label(s.w, 22)}</g></g>`, pop, { transform: `translate(${sx} ${sy})` });
            K.audio.sfx('pop'); K.voice.say(`${next + 1}. ${s.w}. ${s.say}`, { force: true });
            next++;
            if (next === 4) K.wait(2500).then(() => {
              if (!pop || !pop.isConnected) return;
              K.audio.sfx('fanfare'); K.fx.confetti(50); K.fx.stars(wrong <= 1 ? 3 : 2, cx, cy);
              BG.cycle = (BG.cycle || 0) + 1; K.save.write(); K.learn.record('bugs', cyc.name + ' cycle', wrong <= 1); K.emit('lifeCycle');
              K.voice.say(`You know the whole ${cyc.name} life cycle! The big word for changing like that is metamorphosis.`, { force: true });
              K.wait(5500).then(() => { if (pop && pop.isConnected) cycles(); });
            });
          });
        });
        K.voice.say(`Put the ${cyc.name} life cycle in order. What comes first?`, { force: true });
      }

      /* ---------- ladybug spot math ---------- */
      function ladyMath() {
        const { py, ph } = panel();
        const r = BG.mathRight || 0;
        let lvl = r < 6 ? 0 : r < 12 ? 1 : r < 18 ? 2 : 3;
        if (K.learn.struggling('ladymath') && lvl > 0) lvl--;
        const max = [3, 5, 7, 7][lvl];
        const a = K.irand(1, max), b = K.irand(lvl === 0 ? 1 : 0, max), total = a + b;
        const missing = lvl === 3; // one wing is hidden under a leaf: how many are under there?
        const ans = missing ? b : total;
        const q = missing ? `This ladybug has ${total} spots in all. ${a} are on this wing. How many spots are hiding under the leaf?` : `How many spots does this ladybug have in all?`;
        titleAt(py, missing ? `${total} spots in all. How many are hiding?` : 'how many spots in all?');
        const cy = py + ph / 2 - (v.tall ? 60 : 30), s = v.tall ? 3.4 : 2.4;
        K.g(`<g transform="translate(600 ${cy + 60 * s}) scale(${s})">${A.bug('ladybug', [a, b])}
          ${missing ? `<path d="M2 -72 Q60 -80 60 -30 Q56 20 2 4Z" fill="#7cc87c" stroke="#5aa85a" stroke-width="3"/><path d="M4 -34 Q30 -36 56 -30" stroke="#5aa85a" stroke-width="2" fill="none"/>` : ''}</g>
          <text x="${600 - 150 * (v.tall ? 1.3 : 1)}" y="${cy + 160 * (v.tall ? 1.2 : 1)}" text-anchor="middle" font-size="48" fill="#c9303f">${a}</text>
          ${missing ? '' : `<text x="${600 + 150 * (v.tall ? 1.3 : 1)}" y="${cy + 160 * (v.tall ? 1.2 : 1)}" text-anchor="middle" font-size="48" fill="#c9303f">${b}</text>`}`, pop);
        K.voice.say(q, { force: true });
        const set = new Set([ans]);
        while (set.size < 3) { const d = ans + K.pick([-2, -1, 1, 2, 3]); if (d >= 0 && d <= 16) set.add(d); }
        let tries = 0, done = false;
        const ay = py + ph - (v.tall ? 170 : 110);
        K.shuffle([...set]).forEach((val, i) => {
          const x = 600 + (i - 1) * 300;
          const g = K.g(`<rect x="-110" y="-75" width="220" height="150" rx="30" fill="#fff" stroke="#e8dcf8" stroke-width="6"/><text y="34" text-anchor="middle" font-size="100" fill="#6d4a92">${val}</text>`, pop, { class: 'btn', transform: `translate(${x} ${ay}) scale(${v.tall ? 1.2 : 0.9})` });
          K.tap(g, async () => {
            if (done) return;
            if (val === ans) {
              done = true;
              g.firstChild.setAttribute('fill', '#c9f7dd'); g.firstChild.setAttribute('stroke', '#5fc48a');
              K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, x, ay);
              BG.mathRight = r + 1; K.save.write(); K.learn.record('ladymath', `${a}+${b}`, tries === 0); K.emit('math');
              K.voice.say(missing ? `${b}! ${a} plus ${b} makes ${total}.` : `${a} plus ${b} equals ${total}!`, { force: true });
              if (BG.mathRight === 6 || BG.mathRight === 12) K.wait(3000).then(() => K.voice.say('Level up! Bigger numbers!'));
              if (BG.mathRight === 18) K.wait(3000).then(() => K.voice.say('Level up! Now some spots will hide under a leaf. Can you figure out how many?'));
              await K.wait(3600);
              if (pop && pop.isConnected) ladyMath();
            } else {
              tries++; K.audio.sfx('boing'); K.replay(g, 'shake', 600);
              K.voice.say(missing ? `Not ${val}. ${a} plus what makes ${total}? Count up from ${a}.` : `Not ${val}. Count this wing, then keep counting on the other wing.`, { force: true });
            }
          });
        });
      }

      garden();
      K.hintOnce('bugs', 'Tap the leaves, rocks and flowers to find hiding bugs!');
      K.wait(600).then(() => K.voice.say('Welcome to the bug garden! Ten bugs are hiding. Tap the leaves, rocks and flowers to find them!'));
    },
  };
})();
