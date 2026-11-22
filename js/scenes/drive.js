/* Drive to school: the princess drives her pink car down the road. Hold the gas pedal to go,
   tap the horn to beep, stop at the red light, and park at the royal school. */
(function () {
  const A = K.art;

  const car = (look) => `<g>
    <ellipse cx="0" cy="6" rx="150" ry="14" fill="#5a3d7a" opacity=".14"/>
    <g transform="translate(-6 -112) scale(.62)">${A.princessHead(look)}</g>
    <path d="M40 -86 L66 -132" stroke="#bfe8ff" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M40 -86 L66 -132" stroke="#e0609a" stroke-width="3" stroke-linecap="round"/>
    <path d="M-150 -30 Q-152 -84 -110 -86 H130 Q160 -82 156 -30 Q156 -10 136 -10 H-134 Q-150 -10 -150 -30Z" fill="#ff8fc0" stroke="#e0609a" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-120 -56 H136" stroke="#ffb3d6" stroke-width="5" stroke-linecap="round"/>
    <path d="${A.heart(1)}" transform="translate(-96 -44)" fill="#fff"/>
    <circle cx="146" cy="-52" r="9" fill="#fff6b0" stroke="#e6c34a" stroke-width="3"/>
    ${[-92, 92].map((x) => `<g class="wheel" transform="translate(${x} -12)"><g class="spin"><circle r="30" fill="#4a3a5a"/><circle r="15" fill="#e8dcf8"/><path d="M0 -15 V15 M-15 0 H15" stroke="#b9a6d8" stroke-width="4"/></g></g>`).join('')}
  </g>`;

  const light = (c) => `<g><rect x="-6" y="-10" width="12" height="230" fill="#8a7aa0" transform="translate(0 -220)"/>
    <rect x="-34" y="-370" width="68" height="160" rx="22" fill="#4a3a5a"/>
    <circle cy="-336" r="20" fill="${c === 'red' ? '#ff4d6d' : '#5a4a68'}"/>
    <circle cy="-290" r="20" fill="${c === 'yellow' ? '#ffd166' : '#5a4a68'}"/>
    <circle cy="-244" r="20" fill="${c === 'green' ? '#5fd38a' : '#5a4a68'}"/>
    ${c === 'red' ? '<circle cy="-336" r="28" fill="#ff4d6d" opacity=".25"/>' : c === 'green' ? '<circle cy="-244" r="28" fill="#5fd38a" opacity=".25"/>' : ''}</g>`;

  const school = () => `<g>
    <rect x="-200" y="-300" width="400" height="300" rx="10" fill="#ffe6c9" stroke="#e6b98a" stroke-width="5"/>
    <path d="M-230 -296 L0 -420 L230 -296Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="5" stroke-linejoin="round"/>
    <circle cy="-340" r="34" fill="#fff" stroke="#9a7fe0" stroke-width="5"/><path d="M0 -340 V-362 M0 -340 H16" stroke="#6d4a92" stroke-width="5" stroke-linecap="round"/>
    <path d="M-44 0 V-100 A44 44 0 0 1 44 -100 V0Z" fill="#ff9ec7" stroke="#e0609a" stroke-width="4"/>
    ${[-140, 100].map((x) => `<rect x="${x}" y="-230" width="40" height="40" rx="6" fill="#dff4ff" stroke="#e6b98a" stroke-width="4"/>`).join('')}
    <rect x="-130" y="-286" width="260" height="44" rx="14" fill="#fff"/><text y="-254" text-anchor="middle" font-size="32" fill="#6d4a92"><tspan fill="#ff5fa2">s</tspan>chool</text>
    <path d="M200 -300 V-470" stroke="#8a7aa0" stroke-width="6"/><path d="M200 -470 L260 -452 L200 -434Z" fill="#ff7fb2"/></g>`;

  K.scenes.drive = {
    enter(root) {
      const look = K.me();
      let vTop = 0, vBot = 800;
      try { const m = K.stage.getScreenCTM(), r = K.stage.getBoundingClientRect(); vTop = (Math.max(r.top, 0) - m.f) / m.d; vBot = (Math.min(r.bottom, innerHeight) - m.f) / m.d; } catch (e) { /* default */ }
      const tall = vBot - vTop > 1150;
      const ROAD = tall ? Math.min(vBot - 560, 900) : 640; // where the wheels touch the road
      const CAR_X = tall ? 380 : 330, SC = tall ? 1.7 : 1;

      // sky, far hills (slow), road, grass
      K.g(`<rect x="-900" y="-1400" width="3000" height="${ROAD + 1400}" fill="url(#gSky)"/>
        <g transform="translate(1000 ${ROAD - 520}) scale(.6)">${A.sun()}</g>`, root);
      const far = K.g('', root);
      far.innerHTML = [0, 1, 2].map((i) => `<g transform="translate(${i * 1800} ${ROAD - 640})">${A.hills(430)}</g>`).join('');
      const clouds = K.g([0, 1, 2, 3].map((i) => `<g transform="translate(${i * 520} ${ROAD - 520 + (i % 2) * 60})">${A.cloud(0.6)}</g>`).join(''), root);
      K.g(`<rect x="-900" y="${ROAD - 150}" width="3000" height="60" fill="#b8e6a8"/>
        <rect x="-900" y="${ROAD - 90}" width="3000" height="170" fill="#c8bcd8"/>
        <rect x="-900" y="${ROAD - 96}" width="3000" height="10" fill="#fff"/><rect x="-900" y="${ROAD + 76}" width="3000" height="10" fill="#fff"/>
        <rect x="-900" y="${ROAD + 86}" width="3000" height="1400" fill="url(#gGrass)"/>`, root);
      const dashes = K.g('', root);
      const world = K.g('', root); // trees, light and school move with the road
      const carG = K.g(car(look), root, { transform: `translate(${CAR_X} ${ROAD + 20}) scale(${SC})` });
      const wheels = [...carG.querySelectorAll('.spin')];

      // things along the road (x in world units)
      const LIGHT_X = 1700, SCHOOL_X = 3600, STOP_LIGHT = LIGHT_X - (tall ? 340 : 260), STOP_SCHOOL = SCHOOL_X - 120;
      const decor = [];
      for (let x = 500; x < SCHOOL_X + 900; x += 420) decor.push({ x, kind: (x / 420) % 2 | 0, s: 0.55 + ((x * 7) % 5) / 20 });
      const decorG = K.g(decor.map((d) => `<g data-x="${d.x}"><g transform="scale(${d.s * (tall ? 1.5 : 1)})">${A.tree(d.kind)}</g></g>`).join(''), world);
      const lightG = K.g(light('green'), world);
      const schoolG = K.g(school(), world);

      // controls
      const cy = tall ? Math.min(vBot - 190, ROAD + 360) : 735;
      let gas = false;
      const pedal = K.button(root, tall ? 930 : 1040, cy, `<g transform="scale(1.2)"><rect x="-26" y="-34" width="52" height="68" rx="16" fill="#5fd38a" stroke="#fff" stroke-width="5"/><path d="M-14 -16 H14 M-14 0 H14 M-14 16 H14" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`, () => { gas = true; K.audio.unlock(); }, { r: tall ? 130 : 80, fill: "url(#gBtnGold)", label: "go" });
      const release = () => { gas = false; };
      ['pointerup', 'pointercancel'].forEach((ev) => addEventListener(ev, release));
      pedal.inner.classList.add('bob');
      K.button(root, tall ? 600 : 820, cy, `<g transform="scale(1.1)"><path d="M-26 -10 L6 -26 V26 L-26 10Z" fill="#ff7fb2" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M16 -14 Q26 0 16 14 M24 -24 Q40 0 24 24" stroke="#ff7fb2" stroke-width="5" fill="none" stroke-linecap="round"/></g>`, () => {
        K.audio.sfx('honk'); K.replay(carG.firstElementChild, 'squish', 400);
        K.fx.word('beep', CAR_X + 150, ROAD - 230, { say: false });
      }, { r: tall ? 100 : 64, label: "beep" });

      let dist = 0, speed = 0, lightState = 'green', lightT = 0, stoppedT = 0, arrived = false, spoke = {};
      const say = (id, text) => { if (spoke[id]) return; spoke[id] = true; K.voice.say(text); };
      const setLight = (c) => { lightState = c; lightG.innerHTML = light(c); };
      let wheelA = 0;

      K.every((dt) => {
        if (!root.isConnected) { ['pointerup', 'pointercancel'].forEach((ev) => removeEventListener(ev, release)); return false; }
        // speed
        const target = gas && !arrived ? 420 : 0;
        speed += (target > speed ? 520 : -700) * dt;
        speed = K.clamp(speed, 0, 420);
        // stop at the red light, and at the school
        let limit = STOP_SCHOOL;
        if (lightState !== 'green' && dist <= STOP_LIGHT + 2) limit = STOP_LIGHT;
        dist += speed * dt;
        if (dist >= limit) { dist = limit; speed = 0; }
        // traffic light: turns yellow then red as she gets close, then green after she waits
        lightT += dt;
        if (lightState === 'green' && !spoke.red && dist > STOP_LIGHT - 650) { setLight('yellow'); lightT = 0; say('yellow', 'Yellow light! Slow down.'); }
        else if (lightState === 'yellow' && lightT > 1.4) { setLight('red'); lightT = 0; say('red', 'Red light! Red means stop.'); }
        else if (lightState === 'red') {
          if (dist >= STOP_LIGHT - 40 && speed < 5) stoppedT += dt;
          if (stoppedT > 2.2 || lightT > 9) { setLight('green'); spoke.red = true; say('green', 'Green light! Green means go!'); }
        }
        // arrived at school
        if (!arrived && dist >= STOP_SCHOOL) {
          arrived = true;
          K.audio.sfx('chime'); K.fx.sparkle(CAR_X, ROAD - 120, { n: 20, spread: 160 });
          K.voice.say("We're at school! Time to learn!");
          K.emit('drive');
          K.wait(1800).then(() => { if (root.isConnected) K.go('spellbook'); });
        }
        // move everything
        const sx = (wx) => wx - dist + CAR_X;
        lightG.setAttribute('transform', `translate(${sx(LIGHT_X)} ${ROAD - 100})`);
        schoolG.setAttribute('transform', `translate(${sx(SCHOOL_X) + 160} ${ROAD - 100})`);
        decorG.childNodes.forEach((g) => g.setAttribute('transform', `translate(${sx(+g.dataset.x)} ${ROAD - 120})`));
        far.setAttribute('transform', `translate(${-((dist * 0.25) % 1800)} 0)`);
        clouds.setAttribute('transform', `translate(${-((dist * 0.1) % 520)} 0)`);
        let d = '';
        for (let x = -((dist) % 160) - 160; x < 1400; x += 160) d += `<rect x="${x}" y="${ROAD - 9}" width="80" height="12" rx="6" fill="#fff" opacity=".85"/>`;
        dashes.innerHTML = d;
        wheelA += speed * dt * 1.9;
        wheels.forEach((w) => w.setAttribute('transform', `rotate(${wheelA.toFixed(1)})`));
        carG.setAttribute('transform', `translate(${CAR_X} ${ROAD + 20 + (speed > 20 ? Math.sin(dist / 18) * 1.6 : 0)}) scale(${SC})`);
        if (gas) pedal.inner.classList.remove('bob');
      });

      K.hintOnce('drive', 'Hold the green pedal to drive to school! Tap the horn to beep.');
      K.wait(500).then(() => K.voice.say('Let\'s drive to school! Hold the green button to go.'));
    },
  };
})();
