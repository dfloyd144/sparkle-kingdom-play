/* Mermaid world: dive down in a submarine, the lagoon (tap a mermaid and only she swims),
   mermaid dress up (tails, fins, hair), and mermaid school (sea animal quiz, pearl math, bubble spelling). */
(function () {
  const A = K.art, D = K.data;
  const sh = K.shade;

  /* ---------- art ---------- */
  const eyes = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-7" cy="0" r="4.5" fill="#3a2a44"/><circle cx="7" cy="0" r="4.5" fill="#3a2a44"/><circle cx="-5.5" cy="-1.5" r="1.6" fill="#fff"/><circle cx="8.5" cy="-1.5" r="1.6" fill="#fff"/><path d="M-4 8 Q0 11 4 8" stroke="#3a2a44" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  const SEA = {
    octopus: `${[-36, -20, -6, 8, 22, 36].map((x, i) => `<path d="M${x * 0.6} -30 q${x * 0.4} 30 ${x} 34 q${i % 2 ? 8 : -8} 6 ${i % 2 ? 2 : -2} 12" stroke="#c9a6ff" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}<ellipse cy="-56" rx="40" ry="38" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>${eyes(0, -50, 1.1)}<circle cx="-18" cy="-74" r="5" fill="#fff" opacity=".5"/>`,
    starfish: `<path d="${A.star(48)}" transform="translate(0 -40) rotate(-8)" fill="#ff9a6a" stroke="#e0704a" stroke-width="3" stroke-linejoin="round"/>${[[-14, -50], [10, -30], [-6, -22], [16, -52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#ffd0b0"/>`).join('')}${eyes(0, -42, 0.8)}`,
    seahorse: `<path d="M6 -96 Q30 -96 26 -74 Q22 -60 10 -60 Q26 -44 14 -24 Q4 -8 14 4 Q-8 6 -6 -14 Q-4 -34 -10 -48 Q-22 -70 -6 -90Z" fill="#ffd166" stroke="#e6a52e" stroke-width="3"/><path d="M24 -82 L44 -80" stroke="#ffd166" stroke-width="10" stroke-linecap="round"/>${[-80, -66, -52, -38].map((y) => `<path d="M-8 ${y} l-10 -4" stroke="#e6a52e" stroke-width="4" stroke-linecap="round"/>`).join('')}<circle cx="12" cy="-82" r="4" fill="#3a2a44"/>`,
    whale: `<path d="M-70 -30 Q-70 -80 0 -80 Q60 -80 64 -40 Q66 -8 20 -6 H-40 Q-70 -6 -70 -30Z" fill="#6cb6ff" stroke="#4a8ad8" stroke-width="3"/><path d="M-66 -40 L-96 -64 L-92 -30 L-100 -6Z" fill="#6cb6ff" stroke="#4a8ad8" stroke-width="3" stroke-linejoin="round"/><path d="M-60 -22 Q0 -4 60 -26" fill="#dff4ff"/>${eyes(30, -46)}<path d="M0 -84 q-6 -20 -16 -24 M0 -84 q6 -20 16 -24" stroke="#9fd2ff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    dolphin: `<path d="M-70 -20 Q-40 -76 20 -70 Q56 -66 70 -44 Q50 -40 40 -36 Q10 -14 -30 -18Z" fill="#9fb8d8" stroke="#6a88b0" stroke-width="3"/><path d="M-6 -70 L4 -94 L18 -68Z M-66 -20 L-92 -36 L-84 -6Z" fill="#9fb8d8" stroke="#6a88b0" stroke-width="3" stroke-linejoin="round"/><path d="M-40 -26 Q10 -20 40 -38" stroke="#dfe8f4" stroke-width="8" fill="none"/><circle cx="36" cy="-54" r="4" fill="#3a2a44"/><path d="M50 -44 q6 4 14 0" stroke="#3a2a44" stroke-width="2" fill="none"/>`,
    jellyfish: `${[-24, -10, 4, 18].map((x, i) => `<path d="M${x} -40 q${i % 2 ? 8 : -8} 16 0 30 q${i % 2 ? -8 : 8} 14 0 26" stroke="#ff9ec7" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`).join('')}<path d="M-40 -40 Q-40 -96 0 -96 Q40 -96 40 -40 Q30 -32 20 -40 Q10 -32 0 -40 Q-10 -32 -20 -40 Q-30 -32 -40 -40Z" fill="#ffc2e0" fill-opacity=".85" stroke="#ff9ec7" stroke-width="3"/>${eyes(0, -64)}`,
    crab: `${[-1, 1].map((s) => `<path d="M${s * 30} -24 l${s * 26} 12 M${s * 32} -16 l${s * 24} 18 M${s * 28} -8 l${s * 18} 20" stroke="#e05a4a" stroke-width="6" stroke-linecap="round"/><path d="M${s * 36} -46 q${s * 22} -6 ${s * 30} -30" stroke="#e05a4a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${s * 66} -76 a14 14 0 1 1 ${s * -4} 22 l${s * 8} -10Z" fill="#ff7a6a" stroke="#e05a4a" stroke-width="3"/>`).join('')}<ellipse cy="-32" rx="40" ry="26" fill="#ff7a6a" stroke="#e05a4a" stroke-width="3"/><path d="M-10 -56 V-74 M10 -56 V-74" stroke="#e05a4a" stroke-width="4"/><circle cx="-10" cy="-76" r="7" fill="#fff"/><circle cx="10" cy="-76" r="7" fill="#fff"/><circle cx="-10" cy="-75" r="3.5" fill="#3a2a44"/><circle cx="10" cy="-75" r="3.5" fill="#3a2a44"/><path d="M-6 -24 Q0 -18 6 -24" stroke="#3a2a44" stroke-width="2.5" fill="none"/>`,
    turtle: `<ellipse cx="-44" cy="-14" rx="16" ry="9" fill="#8fd88f" stroke="#5aa85a" stroke-width="3"/><ellipse cx="38" cy="-14" rx="16" ry="9" fill="#8fd88f" stroke="#5aa85a" stroke-width="3"/><circle cx="60" cy="-40" r="20" fill="#8fd88f" stroke="#5aa85a" stroke-width="3"/>${eyes(62, -42, 0.85)}
      <path d="M-56 -24 Q-56 -80 0 -80 Q56 -80 56 -24Z" fill="#c9a07a" stroke="#8a6448" stroke-width="3"/><path d="M-20 -24 L-28 -56 L0 -72 L28 -56 L20 -24 M-28 -56 L-50 -40 M28 -56 L50 -40" stroke="#8a6448" stroke-width="3" fill="none"/>`,
    sub: `<rect x="-60" y="-62" width="120" height="60" rx="30" fill="#ffd166" stroke="#e6a52e" stroke-width="3"/><rect x="-10" y="-84" width="26" height="24" rx="6" fill="#ffd166" stroke="#e6a52e" stroke-width="3"/><circle cx="20" cy="-32" r="14" fill="#9fd2ff" stroke="#e6a52e" stroke-width="3"/><circle cx="-16" cy="-32" r="10" fill="#9fd2ff" stroke="#e6a52e" stroke-width="3"/><path d="M-60 -32 L-78 -44 V-20Z" fill="#ff9ec7"/>`,
    shell: `<path d="M0 -10 L-44 -50 Q-30 -90 0 -92 Q30 -90 44 -50Z" fill="#ffd6e8" stroke="#e0a0c0" stroke-width="3" stroke-linejoin="round"/><path d="M0 -10 L-24 -84 M0 -10 L0 -92 M0 -10 L24 -84 M0 -10 L-38 -64 M0 -10 L38 -64" stroke="#e0a0c0" stroke-width="2"/>`,
    pearl: `<circle cy="-40" r="34" fill="#fbf6ff" stroke="#d8cce8" stroke-width="3"/><circle cx="-12" cy="-52" r="10" fill="#fff"/>`,
    wave: `<path d="M-70 -20 Q-50 -70 -10 -60 Q-40 -50 -30 -30 Q-10 -60 30 -50 Q10 -40 20 -24 Q40 -54 70 -40 L70 0 H-70Z" fill="#6cb6ff" stroke="#4a8ad8" stroke-width="3"/>`,
    fish: `<path d="M-40 -40 Q0 -76 40 -40 Q0 -4 -40 -40Z" fill="#ff9a4d" stroke="#d9772e" stroke-width="3"/><path d="M-38 -40 L-62 -58 L-58 -40 L-62 -22Z" fill="#ff9a4d" stroke="#d9772e" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="-44" r="5" fill="#3a2a44"/>`,
  };
  A.sea = (k, s = 1) => `<g transform="scale(${s})">${SEA[k]}</g>`;
  const submarine = (look) => `<g><path d="M-170 0 Q-170 -110 0 -110 Q170 -110 170 0 Q170 80 0 80 Q-170 80 -170 0Z" fill="#ffd166" stroke="#e6a52e" stroke-width="6"/>
    <rect x="-30" y="-160" width="70" height="60" rx="14" fill="#ffd166" stroke="#e6a52e" stroke-width="6"/><path d="M20 -160 V-200 H60" stroke="#8a7aa0" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="40" cy="-6" r="62" fill="#dff4ff" stroke="#e6a52e" stroke-width="8"/><clipPath id="subWin"><circle cx="40" cy="-6" r="58"/></clipPath><g clip-path="url(#subWin)"><g transform="translate(40 -6) scale(.55)">${A.princessHead(look)}</g></g>
    <circle cx="-90" cy="-6" r="30" fill="#9fd2ff" stroke="#e6a52e" stroke-width="6"/><g class="prop" transform="translate(-180 0)"><ellipse rx="10" ry="40" fill="#ff9ec7"/></g>
    ${[-120, -60, 0, 60, 120].map((x) => `<circle cx="${x}" cy="60" r="6" fill="#e6a52e"/>`).join('')}</g>`;

  const ANIMALS = {
    octopus: ['An octopus has three hearts and blue blood!', 'An octopus can squirt ink to hide, and change color to match the rocks.'],
    starfish: ['A starfish has no brain, and it can grow back a lost arm!', 'A starfish has a tiny eye at the end of each arm.'],
    seahorse: ['Seahorse dads carry the babies in a pouch until they hatch!', 'A seahorse is a fish that swims standing up.'],
    whale: ['The blue whale is the biggest animal that has ever lived, even bigger than dinosaurs!', 'Humpback whales sing long songs under the sea.'],
    dolphin: ['Dolphins sleep with half of their brain awake.', 'Dolphins talk with clicks and whistles, and each one has its own name whistle.'],
    jellyfish: ['A jellyfish has no bones, no heart, and no brain!', 'Jellyfish have been in the ocean longer than the dinosaurs.'],
    crab: ['Crabs walk sideways!', 'Many crabs have eyes on stalks that pop up to look around.'],
    turtle: ['Sea turtles breathe air, so they swim up to the top to take a breath.', 'Mother sea turtles crawl onto the beach to lay their eggs in the sand.'],
  };
  const QUIZ = [['Which animal has eight arms?', 'octopus'], ['Which animal is shaped like a star?', 'starfish'], ['Which animal walks sideways?', 'crab'], ['Which is the biggest animal in the world?', 'whale'],
    ['Which animal has a shell and swims in the sea?', 'turtle'], ['Which animal is squishy and see-through?', 'jellyfish'], ['Which animal clicks and whistles to talk?', 'dolphin'], ['Which fish swims standing up?', 'seahorse']];
  const QUIZ_HARD = [['Which animal has three hearts?', 'octopus'], ['Which animal has no brain and can grow back an arm?', 'starfish'], ['In which animal does the dad carry the babies?', 'seahorse'],
    ['Which animal sleeps with half its brain awake?', 'dolphin'], ['Which animal has no bones, no heart, and no brain?', 'jellyfish'], ['Which animal sings long songs under the sea?', 'whale'],
    ['Which animal lays its eggs on the beach?', 'turtle'], ['Which animal can squirt ink?', 'octopus'], ['Which animal has eyes on stalks?', 'crab'], ['Which animal is bigger than any dinosaur?', 'whale']];
  const WORDS = [['CRAB', 'crab'], ['FISH', 'fish'], ['SUB', 'sub'], ['WAVE', 'wave'], ['WHALE', 'whale'], ['SHELL', 'shell'], ['PEARL', 'pearl'], ['TURTLE', 'turtle'], ['DOLPHIN', 'dolphin'], ['OCTOPUS', 'octopus'], ['SEAHORSE', 'seahorse'], ['STARFISH', 'starfish']];

  const view = () => {
    let vTop = 0, vBot = 800;
    try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
    return { vTop, vBot, tall: vBot - vTop > 1150, top: vBot - vTop > 1150 ? vTop + 210 : 64 };
  };
  const lvlOf = (n, steps) => steps.filter((s) => n >= s).length;

  K.scenes.mermaid = {
    enter(root, opts = {}) {
      const S = K.save.data;
      const MW = (S.mermaid = S.mermaid || { quiz: 0, pearls: 0, spell: 0, dives: 0 });
      // every princess is also a mermaid (her own tail, fin and mermaid hair)
      if (!Array.isArray(S.mermaids)) S.mermaids = [];
      S.looks.forEach((l, i) => { if (!S.mermaids[i]) S.mermaids[i] = { tail: i % 8, fin: i % 3, hair: l.hair, style: l.style }; });
      const mlook = (i) => Object.assign({}, S.looks[i], { hair: S.mermaids[i].hair, style: S.mermaids[i].style });
      const mart = (i) => A.mermaid(mlook(i), S.mermaids[i]);
      const v = view(), T = v.tall, mid = (v.top + v.vBot) / 2;

      // water
      const water = K.g(`<defs><linearGradient id="mwGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fe3f0"/><stop offset="1" stop-color="#2a6aa8"/></linearGradient></defs>
        <rect x="-900" y="-1400" width="3000" height="3600" fill="url(#mwGrad)"/>`, root);
      const layer = K.g('', root);
      const bubbleG = K.g('', root);
      // bubbles always drift up
      let bt = 0;
      K.every((dt) => {
        if (!root.isConnected) return false;
        bt += dt;
        if (bt > 0.5) { bt = 0; const b = K.el('circle', { cx: K.rand(0, 1200), cy: v.vBot + 20, r: K.rand(4, 12), fill: '#fff', opacity: 0.5 }, bubbleG); K.tween(K.rand(4000, 7000), (t) => b.setAttribute('cy', v.vBot + 20 - t * (v.vBot - v.vTop + 80)), 'linear').then(() => b.remove()); }
      });

      /* ---------- dive down in the submarine ---------- */
      function dive() {
        layer.innerHTML = '';
        water.querySelector('rect').setAttribute('fill', '#7fd0ea');
        const depthG = K.g('', layer);
        const sub = K.g(submarine(K.me()), layer, { transform: `translate(600 ${mid}) scale(${T ? 1.4 : 1})` });
        const STEP = MW.dives >= 3 ? 20 : 10, GOAL = STEP * 5;
        let depth = 0;
        const gauge = () => { depthG.innerHTML = `<g transform="translate(${T ? 600 : 1040} ${T ? v.top + 70 : 160})"><rect x="-110" y="-50" width="220" height="100" rx="24" fill="#1a3a6a" stroke="#9fe3f0" stroke-width="5"/><text y="18" text-anchor="middle" font-size="52" fill="#9fe3f0">${depth} m</text></g>`; };
        gauge();
        const btn = K.button(layer, T ? 600 : 160, T ? v.vBot - 200 : 650, `<path d="M0 30 V-20 M-22 6 L0 30 L22 6" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, () => {
          if (depth >= GOAL) return;
          depth += STEP; gauge();
          K.audio.sfx('bubble'); K.replay(sub.firstChild, 'squish', 400);
          K.voice.say(`${depth} meters`, { force: true });
          const k = depth / GOAL;
          water.querySelector('rect').setAttribute('fill', `rgb(${Math.round(127 - k * 100)},${Math.round(208 - k * 120)},${Math.round(234 - k * 90)})`);
          // fish swim past as she goes deeper
          const f = K.g(A.sea(K.pick(['fish', 'jellyfish', 'turtle', 'starfish']), T ? 1.2 : 0.9), layer);
          const y = K.rand(v.top + 150, v.vBot - 300);
          K.tween(2600, (t) => K.place(f, K.lerp(1350, -150, t), y - t * 120), 'linear').then(() => f.remove());
          if (depth >= GOAL) {
            btn.remove();
            K.voice.say(`${depth} meters deep! We found the mermaid lagoon!`, { force: true });
            MW.dives = (MW.dives || 0) + 1; K.save.write();
            K.tween(1400, (t) => sub.setAttribute('transform', `translate(600 ${mid + t * (v.vBot - mid + 400)}) scale(${T ? 1.4 : 1})`)).then(() => lagoon(true));
          }
        }, { r: T ? 110 : 76, fill: 'url(#gBtnGold)', label: 'dive!' });
        btn.inner.classList.add('bob');
        K.voice.say(`Let's dive down to the mermaid lagoon! Tap dive. We count by ${STEP === 10 ? 'tens' : 'twenties'}!`);
      }

      /* ---------- the lagoon ---------- */
      function lagoon(first) {
        layer.innerHTML = '';
        water.querySelector('rect').setAttribute('fill', 'url(#mwGrad)');
        const sandY = T ? v.vBot - 330 : 640;
        K.g(`${[150, 420, 760, 1050].map((x, i) => `<path d="M${x} -2000 L${x + 160} ${sandY} L${x + 60} ${sandY} Z" fill="#fff" opacity=".07"/>`).join('')}
          <path d="M-900 ${sandY} Q300 ${sandY - 60} 2100 ${sandY} V${sandY + 1600} H-900Z" fill="#f6e3b0"/>
          ${[90, 330, 880, 1120].map((x, i) => `<path d="M${x} ${sandY + 10} q-20 -60 0 -120 q20 -60 0 -120" stroke="${i % 2 ? '#4ac68a' : '#3ab07a'}" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('')}
          <g transform="translate(220 ${sandY + 30})"><path d="M0 0 q-20 -60 -50 -80 M0 0 q10 -70 0 -110 M0 0 q30 -50 60 -70" stroke="#ff8fa8" stroke-width="14" fill="none" stroke-linecap="round"/></g>
          <g transform="translate(1000 ${sandY + 40}) scale(.8)">${SEA.shell}</g><g transform="translate(700 ${sandY + 60}) scale(.6)">${SEA.starfish}</g>`, layer);
        // little submarines: tap one and only that one goes
        [[260, T ? v.top + 140 : 150], [960, T ? v.top + 260 : 230]].forEach(([x, y], i) => {
          const g = K.g(`<g transform="scale(${i ? -1 : 1} 1)">${SEA.sub}</g><circle cy="-30" r="80" fill="#fff" opacity="0"/>`, layer, { class: 'btn', transform: `translate(${x} ${y}) scale(${T ? 1.3 : 1})` });
          let busy = false, at = x;
          K.tap(g, async () => {
            if (busy) return; busy = true;
            K.audio.sfx('bubble');
            const to = at < 600 ? K.rand(700, 1050) : K.rand(150, 500);
            const from = at;
            await K.tween(2200, (t) => g.setAttribute('transform', `translate(${K.lerp(from, to, t)} ${y + Math.sin(t * Math.PI) * -40}) scale(${(to < from ? -1 : 1) * (T ? 1.3 : 1)} ${T ? 1.3 : 1})`));
            at = to; busy = false;
          });
        });
        // the mermaids: nobody moves until she taps one, and then only that one swims
        const n = S.looks.length, cols = T ? 3 : 4, ms = T ? 0.95 : 0.7;
        const spots = S.looks.map((_, i) => {
          const row = Math.floor(i / cols), inRow = Math.min(cols, n - row * cols), col = i % cols;
          return [600 + (col - (inRow - 1) / 2) * (T ? 340 : 260), (T ? v.top + 560 : 400) + row * (T ? 420 : 250) - (col % 2) * 30];
        });
        S.looks.forEach((_, i) => {
          let [x, y] = spots[i];
          const g = K.g(`<g class="mm">${mart(i)}</g><circle cy="-110" r="110" fill="#fff" opacity="0"/>`, layer, { class: 'btn', transform: `translate(${x} ${y}) scale(${ms})` });
          let busy = false;
          K.tap(g, async () => {
            if (busy) return; busy = true;
            g.querySelector('.mm').classList.add('happy');
            K.audio.sfx(K.pick(['giggle', 'bubble', 'sparkle']));
            if (Math.random() < 0.5) K.voice.say(`${S.names[i]} the mermaid!`, { force: true });
            const tx = K.clamp(x + K.rand(-300, 300), 120, 1080), ty = K.clamp(y + K.rand(-160, 120), (T ? v.top + 380 : 260), (T ? v.vBot - 380 : 560));
            const fx = x, fy = y, flip = K.pick([0, 1]);
            await K.tween(1600, (t) => {
              const px = K.lerp(fx, tx, t), py = K.lerp(fy, ty, t) - Math.sin(t * Math.PI) * 120;
              g.setAttribute('transform', `translate(${px} ${py}) rotate(${flip ? t * 360 : Math.sin(t * Math.PI * 2) * 20}) scale(${ms})`);
              if (Math.random() < 0.15) K.fx.bubbles(px, py - 60, 1, 10);
            });
            x = tx; y = ty;
            g.setAttribute('transform', `translate(${x} ${y}) scale(${ms})`);
            g.querySelector('.mm').classList.remove('happy');
            busy = false;
          });
        });
        const by = T ? v.vBot - 150 : 735;
        K.button(layer, T ? 380 : 470, by, `<g transform="translate(0 32) scale(.3)">${A.mermaid(mlook(S.cur), S.mermaids[S.cur])}</g>`, () => dressUp(), { r: T ? 90 : 56, fill: 'url(#gBtnGold)', label: 'mermaid dress up' });
        K.button(layer, T ? 820 : 730, by, `<g transform="translate(0 34) scale(.5)">${SEA.shell}</g><text y="10" text-anchor="middle" font-size="22" fill="#6d4a92">abc</text>`, () => school(), { r: T ? 90 : 56, fill: 'url(#gBtnGold)', label: 'mermaid school' });
        if (first) K.wait(500).then(() => K.voice.say('Welcome to the mermaid lagoon! Your princesses are mermaids here. Tap a mermaid to make her swim!'));
      }

      /* ---------- panel ---------- */
      let pop = null;
      function panel(fill = '#f0fbff') {
        if (pop) pop.remove();
        pop = K.g('', root);
        const shade = K.g('<rect x="-900" y="-1400" width="3000" height="3600" fill="#1a3a6a" opacity=".45"/>', pop);
        K.tap(shade, () => {});
        const ph = T ? Math.min(1300, v.vBot - v.top - 40) : 700, py = T ? v.top + 10 : 80;
        K.g(`<rect x="70" y="${py}" width="1060" height="${ph}" rx="50" fill="${fill}" stroke="#7fd8c8" stroke-width="8"/>`, pop);
        K.button(pop, 1100, py + 30, '<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#9a7fe0" stroke-width="8" stroke-linecap="round"/>', () => { pop.remove(); pop = null; lagoon(false); }, { r: T ? 56 : 42 });
        return { py, ph };
      }
      const alive = () => pop && pop.isConnected;
      const title = (py, t) => K.g(`<text x="600" y="${py + 100}" text-anchor="middle" font-size="${T ? 48 : 40}" fill="#2a5a8a">${t}</text>`, pop);

      /* ---------- mermaid dress up ---------- */
      function dressUp(sel = S.cur, cat = 0) {
        const { py, ph } = panel();
        title(py, 'mermaid dress up');
        // pick a mermaid
        S.looks.forEach((l, i) => {
          const x = 600 + (i - (S.looks.length - 1) / 2) * (T ? 140 : 120);
          const g = K.g(`<circle r="${T ? 58 : 48}" fill="${i === sel ? '#fff4b8' : '#fff'}" stroke="${i === sel ? '#ff6fae' : '#d8eef0'}" stroke-width="6"/><clipPath id="mh${i}"><circle r="${T ? 54 : 44}"/></clipPath><g clip-path="url(#mh${i})"><g transform="translate(0 ${T ? 34 : 28}) scale(${T ? 0.5 : 0.42})">${A.princessHead(mlook(i))}</g></g>`, pop, { class: 'btn', transform: `translate(${x} ${py + (T ? 200 : 180)})` });
          K.tap(g, () => { K.audio.sfx('pop'); K.voice.say(S.names[i], { force: true }); dressUp(i, cat); });
        });
        const m = S.mermaids[sel];
        const px = T ? 600 : 330, pyy = T ? py + 720 : py + 620, ps = T ? 1.9 : 1.6;
        K.g(`<ellipse cx="${px}" cy="${pyy + 10}" rx="${120 * ps / 1.6}" ry="20" fill="#7fd8c8" opacity=".35"/><g transform="translate(${px} ${pyy}) scale(${ps})">${mart(sel)}</g>`, pop);
        // categories
        const CATS = [
          { word: 'tail colors', n: 8, icon: (k) => `<circle r="26" fill="${A.TAIL_COLORS[k]}" stroke="${sh(A.TAIL_COLORS[k], -0.25)}" stroke-width="3"/>`, set: (k) => { m.tail = k; }, cur: () => m.tail, say: (k) => `${A.TAIL_NAMES[k]} tail` },
          { word: 'fins', n: 3, icon: (k) => `<path d="${A.finPath(k)}" transform="translate(0 -2) scale(.7)" fill="${A.TAIL_COLORS[m.tail]}" stroke="${sh(A.TAIL_COLORS[m.tail], -0.25)}" stroke-width="3"/>`, set: (k) => { m.fin = k; }, cur: () => m.fin, say: (k) => A.FIN_NAMES[k] },
          { word: 'hair styles', n: 6, icon: (k) => `<g transform="translate(0 22) scale(.28)">${A.princessHead(Object.assign({}, mlook(sel), { style: k, crown: -1 }))}</g>`, set: (k) => { m.style = k; }, cur: () => m.style, say: (k) => D.HAIR_NAMES[k] },
          { word: 'hair colors', n: 8, icon: (k) => `<circle r="26" fill="${D.HAIR_COLORS[k].hex}" stroke="${sh(D.HAIR_COLORS[k].hex, -0.25)}" stroke-width="3"/>`, set: (k) => { m.hair = k; }, cur: () => m.hair, say: (k) => `${D.HAIR_COLORS[k].name} hair` },
        ];
        const tx0 = T ? 600 : 800, ty0 = T ? py + 300 : py + 290;
        CATS.forEach((c, i) => {
          const x = tx0 + (i - 1.5) * (T ? 230 : 150);
          const g = K.g(`<rect x="-70" y="-30" width="140" height="60" rx="30" fill="${i === cat ? '#ff9ec7' : '#fff'}" stroke="#ff9ec7" stroke-width="4"/><text y="9" text-anchor="middle" font-size="${T ? 24 : 20}" fill="${i === cat ? '#fff' : '#6d4a92'}">${c.word}</text>`, pop, { class: 'btn', transform: `translate(${x} ${ty0})` });
          K.tap(g, () => { K.audio.sfx('tap'); K.voice.say(c.word, { force: true }); dressUp(sel, i); });
        });
        const c = CATS[cat];
        for (let k = 0; k < c.n; k++) {
          const per = T ? 4 : 4, col = k % per, row = Math.floor(k / per);
          const x = (T ? 600 : 800) + (col - 1.5) * (T ? 200 : 120), y = (T ? py + 1010 : py + 400) + row * (T ? 150 : 120);
          const on = c.cur() === k;
          const g = K.g(`<circle r="${T ? 62 : 48}" fill="${on ? '#fff4b8' : '#fff'}" stroke="${on ? '#ff6fae' : '#d8eef0'}" stroke-width="5"/><g transform="scale(${T ? 1.3 : 1})">${c.icon(k)}</g>`, pop, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => { c.set(k); K.save.write(); K.audio.sfx('sparkle'); K.voice.say(c.say(k), { force: true }); K.emit('mermaidDress'); dressUp(sel, cat); });
        }
      }

      /* ---------- mermaid school ---------- */
      function school() {
        const { py, ph } = panel('#eafaff');
        title(py, 'mermaid school');
        const G = [['sea animal quiz', `<g transform="translate(0 30) scale(.55)">${SEA.octopus}</g>`, quiz], ['pearl math', `<g transform="translate(0 30) scale(.55)">${SEA.pearl}</g><text y="20" text-anchor="middle" font-size="26" fill="#6d4a92">10</text>`, pearls], ['bubble words', `<circle r="30" fill="#dff4ff" stroke="#9fd2ff" stroke-width="4"/><text y="12" text-anchor="middle" font-size="34" fill="#2a5a8a">a</text>`, bubbles]];
        G.forEach(([label, icon, fn], i) => K.button(pop, 600 + (i - 1) * (T ? 320 : 290), py + ph / 2, icon, fn, { r: T ? 110 : 90, fill: 'url(#gBtnGold)', label }));
        K.voice.say('Welcome to mermaid school! Pick a game.');
      }

      // shared answer cards
      function numberChoices(y, ans, onRight, onWrong, spread = [-2, -1, 1, 2]) {
        const set = new Set([ans]);
        while (set.size < 3) { const d = ans + K.pick(spread); if (d >= 0) set.add(d); }
        let done = false;
        K.shuffle([...set]).forEach((val, i) => {
          const x = 600 + (i - 1) * 300;
          const g = K.g(`<rect x="-110" y="-75" width="220" height="150" rx="30" fill="#fff" stroke="#cfe8f0" stroke-width="6"/><text y="34" text-anchor="middle" font-size="96" fill="#2a5a8a">${val}</text>`, pop, { class: 'btn', transform: `translate(${x} ${y}) scale(${T ? 1.15 : 0.85})` });
          K.tap(g, () => {
            if (done) return;
            if (val === ans) { done = true; g.firstChild.setAttribute('fill', '#c9f7dd'); g.firstChild.setAttribute('stroke', '#5fc48a'); onRight(x, y); }
            else { K.audio.sfx('boing'); K.replay(g, 'shake', 600); onWrong(val); }
          });
        });
      }

      /* sea animal quiz */
      function quiz() {
        const { py, ph } = panel('#eafaff');
        const hard = (MW.quiz || 0) >= 6 && !K.learn.struggling('sea');
        let qa = K.pick((hard && Math.random() < 0.75 ? QUIZ_HARD : QUIZ).filter((x) => x[0] !== MW.lastQ));
        const tricky = K.learn.tricky('sea');
        if (tricky.length && Math.random() < 0.3) { const t2 = [...QUIZ, ...QUIZ_HARD].find((x) => x[1] === tricky[0] && x[0] !== MW.lastQ); if (t2) qa = t2; }
        const [q, ans] = qa; MW.lastQ = q;
        const opts = K.shuffle([ans, ...K.shuffle(Object.keys(ANIMALS).filter((a) => a !== ans)).slice(0, hard ? 3 : 2)]);
        const qt = title(py, q); K.tap(qt, () => K.voice.say(q, { force: true }));
        K.voice.say(q, { force: true });
        let tries = 0, done = false;
        const n = opts.length, cy = py + ph / 2 + 40;
        opts.forEach((o, i) => {
          const x = n === 4 ? (T ? 370 + (i % 2) * 460 : 600 + (i - 1.5) * 250) : 600 + (i - 1) * 320;
          const y = n === 4 && T ? cy - 200 + Math.floor(i / 2) * 380 : cy;
          const g = K.g(`<rect x="-120" y="-150" width="240" height="310" rx="36" fill="#fff" stroke="#cfe8f0" stroke-width="6"/><g transform="translate(0 40) scale(1.1)">${SEA[o]}</g><text y="130" text-anchor="middle" font-size="34" fill="#2a5a8a">${o}</text>`, pop, { class: 'btn', transform: `translate(${x} ${y}) scale(${T ? 1.15 : n === 4 ? 0.85 : 0.95})` });
          K.tap(g, async () => {
            if (done) return;
            if (o === ans) {
              done = true; g.firstChild.setAttribute('fill', '#c9f7dd'); g.firstChild.setAttribute('stroke', '#5fc48a');
              K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (hard ? 4 : 3) : 1, x, y);
              MW.quiz = (MW.quiz || 0) + 1; K.save.write(); K.learn.record('sea', ans, tries === 0); K.emit('seaQuiz');
              K.voice.say(`${ans}! ${K.pick(ANIMALS[ans])}${MW.quiz === 6 ? ' Level up! Trickier questions are coming!' : ''}`, { force: true });
              await K.wait(6000); if (alive()) quiz();
            } else { tries++; K.audio.sfx('boing'); K.replay(g, 'shake', 600); K.voice.say(`That's a ${o}. ${q}`, { force: true }); }
          });
        });
      }

      /* pearl math: fill the clam to 10 (a ten frame), then to 20, then add past 10 */
      function pearls() {
        const { py, ph } = panel('#eafaff');
        const lvl = Math.max(0, lvlOf(MW.pearls || 0, [5, 10, 15]) - (K.learn.struggling('pearls') ? 1 : 0));
        let a, b, ans, q, frames, filled;
        if (lvl <= 1) { a = K.irand(lvl ? 1 : 4, 9); ans = 10 - a; frames = 1; filled = [a]; q = `This clam holds 10 pearls. It has ${a}. How many more pearls fill it up?`; }
        else if (lvl === 2) { a = K.irand(11, 19); ans = 20 - a; frames = 2; filled = [10, a - 10]; q = `Two clams hold 20 pearls. They have ${a}. How many more to make 20?`; }
        else { a = K.irand(6, 9); b = K.irand(11 - a, 9); ans = a + b; frames = 2; filled = [a, b]; q = `${a} pearls and ${b} more pearls. How many in all? Fill the first clam to 10 to help!`; }
        title(py, lvl === 3 ? `${a} + ${b} = ?` : lvl === 2 ? `${a} + ? = 20` : `${a} + ? = 10`);
        const cell = T ? 92 : 74, fw = cell * 5, fy0 = py + (T ? 330 : 230);
        for (let f = 0; f < frames; f++) {
          const fx0 = frames === 1 ? 600 - fw / 2 : 600 + (f ? 30 : -fw - 30), sY = fy0;
          let s = `<rect x="${fx0 - 20}" y="${sY - 20}" width="${fw + 40}" height="${cell * 2 + 40}" rx="40" fill="#ffd6e8" stroke="#e0a0c0" stroke-width="5"/>`;
          for (let k = 0; k < 10; k++) {
            const cx = fx0 + (k % 5) * cell + cell / 2, cy = sY + Math.floor(k / 5) * cell + cell / 2;
            s += `<circle cx="${cx}" cy="${cy}" r="${cell * 0.38}" fill="#fff" opacity=".6" stroke="#e0a0c0" stroke-width="2"/>`;
            if (k < filled[f]) s += `<circle cx="${cx}" cy="${cy}" r="${cell * 0.34}" fill="#fbf6ff" stroke="#c9bce0" stroke-width="2"/><circle cx="${cx - cell * 0.1}" cy="${cy - cell * 0.1}" r="${cell * 0.1}" fill="#fff"/>`;
          }
          K.g(s, pop);
        }
        K.voice.say(q, { force: true });
        let tries = 0;
        numberChoices(py + ph - (T ? 200 : 110), ans, (x, y) => {
          K.audio.sfx('fanfare'); K.fx.stars(tries === 0 ? (lvl >= 2 ? 4 : 3) : 1, x, y);
          MW.pearls = (MW.pearls || 0) + 1; K.save.write(); K.learn.record('pearls', lvl === 3 ? `${a}+${b}` : `${a}->${lvl === 2 ? 20 : 10}`, tries === 0); K.emit('math');
          K.voice.say(lvl === 3 ? `${ans}! ${a} plus ${b} is ${ans}. ${a} plus ${10 - a} makes 10, and ${b - (10 - a)} more makes ${ans}.` : `${ans}! ${a} plus ${ans} makes ${lvl === 2 ? 20 : 10}.${[5, 10, 15].includes(MW.pearls) ? ' Level up!' : ''}`, { force: true });
          K.wait(lvl === 3 ? 6500 : 3800).then(() => { if (alive()) pearls(); });
        }, (val) => { tries++; K.voice.say(lvl === 3 ? `Not ${val}. Move pearls to fill the first clam to 10, then count what is left.` : `Not ${val}. Count the empty spots!`, { force: true }); });
      }

      /* bubble words: pop the letter bubbles in order to spell the sea word */
      function bubbles() {
        const { py, ph } = panel('#eafaff');
        const lvl = Math.max(0, lvlOf(MW.spell || 0, [4, 9]) - (K.learn.struggling('seaspell') ? 1 : 0));
        const pool = WORDS.filter(([w]) => (lvl === 0 ? w.length <= 4 : lvl === 1 ? w.length >= 4 && w.length <= 6 : w.length >= 6) && w !== MW.lastWord);
        const [word, pic] = K.pick(pool); MW.lastWord = word;
        title(py, 'spell the sea word');
        const picG = K.g(`<g transform="translate(600 ${py + (T ? 330 : 250)}) scale(${T ? 1.5 : 1.15})">${SEA[pic]}</g>`, pop);
        K.tap(picG, () => K.voice.say(word.toLowerCase(), { force: true }));
        const slotW = Math.min(T ? 110 : 90, 900 / word.length), sy = py + (T ? 470 : 340);
        const slots = K.g('', pop);
        const drawSlots = (k) => { slots.innerHTML = word.split('').map((ch, i) => `<g transform="translate(${600 + (i - (word.length - 1) / 2) * slotW} ${sy})"><rect x="${-slotW / 2 + 6}" y="-50" width="${slotW - 12}" height="80" rx="16" fill="#fff" stroke="#9fd2ff" stroke-width="4"/>${i < k ? `<text y="16" text-anchor="middle" font-size="56" fill="#2a5a8a">${ch.toLowerCase()}</text>` : ''}</g>`).join(''); };
        drawSlots(0);
        const letters = word.split('');
        const decoys = lvl === 0 ? [] : K.shuffle('ABCDEGHKLMNPRSTUW'.split('').filter((c) => !word.includes(c))).slice(0, lvl === 1 ? 2 : 3);
        const all = K.shuffle([...letters, ...decoys]);
        let next = 0, wrong = 0;
        const per = T ? 4 : 6, by0 = py + (T ? 640 : 470);
        all.forEach((ch, i) => {
          const col = i % per, row = Math.floor(i / per), inRow = Math.min(per, all.length - row * per);
          const x = 600 + (col - (inRow - 1) / 2) * (T ? 220 : 150), y = by0 + row * (T ? 190 : 120);
          const g = K.g(`<g class="bob" style="animation-delay:-${i * 0.3}s"><circle r="${T ? 74 : 54}" fill="#dff4ff" fill-opacity=".9" stroke="#9fd2ff" stroke-width="5"/><circle cx="${T ? -24 : -18}" cy="${T ? -26 : -20}" r="${T ? 12 : 9}" fill="#fff"/><text y="${T ? 22 : 17}" text-anchor="middle" font-size="${T ? 64 : 50}" fill="#2a5a8a">${ch.toLowerCase()}</text></g>`, pop, { class: 'btn', transform: `translate(${x} ${y})` });
          K.tap(g, () => {
            if (!g.isConnected || next >= letters.length) return;
            if (ch !== letters[next]) { wrong++; K.audio.sfx('boing'); K.replay(g, 'shake', 500); K.voice.say(`That's ${K.letterName ? K.letterName(ch) : ch.toLowerCase()}. Listen: ${word.toLowerCase()}. What comes next?`, { force: true }); return; }
            g.remove(); K.audio.sfx('bubble'); K.fx.bubbles(x, y, 6, 30);
            K.voice.say(K.letterName ? K.letterName(ch) : ch.toLowerCase(), { force: true });
            next++; drawSlots(next);
            if (next === letters.length) {
              K.audio.sfx('fanfare'); K.fx.stars(wrong === 0 ? (lvl >= 1 ? 4 : 3) : wrong <= 2 ? 2 : 1, 600, sy);
              MW.spell = (MW.spell || 0) + 1; K.save.write(); K.learn.record('seaspell', word, wrong === 0); K.emit('spelled', { word });
              K.voice.say(`${word.toLowerCase()}! You spelled ${word.toLowerCase()}!${MW.spell === 4 || MW.spell === 9 ? ' Level up! Longer words!' : ''}`, { force: true });
              K.wait(3500).then(() => { if (alive()) bubbles(); });
            }
          });
        });
        K.voice.say(`Spell ${word.toLowerCase()}. Pop the bubbles in order!`, { force: true });
      }

      if (opts.landed) lagoon(false); else dive();
    },
  };
})();
