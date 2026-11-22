/* Big ABC spelling keyboard. K.spell(parent, {word, picture, guide, panel, onDone}) */
(function () {
  const ROWS = ['ABCDEFG', 'HIJKLMN', 'OPQRSTU', 'VWXYZ'];
  const VOWELS = 'AEIOU';
  const ROW_COLORS = ['#ffe1ef', '#ece2ff', '#ddf2ff', '#e1f7ea'];

  K.spellState = () => {
    const S = K.save.data;
    if (!S.spell || typeof S.spell !== 'object') S.spell = {};
    S.spell.known = S.spell.known || {};
    S.spell.done = S.spell.done || [];
    if (typeof S.spell.page !== 'number') S.spell.page = 0;
    return S.spell;
  };

  K.spell = (parent, o) => {
    const A = K.art;
    const SP = K.spellState();
    const word = o.word.toUpperCase();
    const known = SP.known[word] || 0;
    const guide = o.guide !== undefined ? o.guide : known < 2;
    const g = K.g('', parent);
    let idx = 0, wrongs = 0, finished = false;
    const picAt = o.picAt || [270, 235], boxAt = o.boxAt || [760, 235];

    if (o.panel) {
      const shade = K.g('<rect x="-900" y="-700" width="3000" height="2400" fill="#fff5fb" opacity=".93"/>', g);
      K.tap(shade, () => {});
      K.g('<rect x="70" y="80" width="1060" height="320" rx="50" fill="#fff" stroke="#ffd1e8" stroke-width="7"/>', g);
    }

    /* picture: tap to hear the word */
    const pic = K.g(`<circle r="112" fill="#fff6fb" stroke="#ffd1e8" stroke-width="5"/><g class="pic-in">${o.picture || ''}</g>
      <g transform="translate(86 86) scale(.62)"><circle r="44" fill="url(#gBtn)" stroke="#fff" stroke-width="5"/>${A.icons.speaker}</g>`, g, { transform: `translate(${picAt[0]} ${picAt[1]})` });
    K.tap(pic, () => { K.replay(pic.querySelector('.pic-in'), 'pop', 600); K.voice.say(word.toLowerCase()); });

    /* letter boxes */
    const n = word.length, gap = 12, bw = Math.min(104, ((o.maxW || 640) - gap * (n - 1)) / n);
    const total = n * bw + (n - 1) * gap, x0 = boxAt[0] - total / 2;
    const boxes = [];
    for (let i = 0; i < n; i++) {
      const b = K.g(`<g class="bi"><rect class="bx" x="${-bw / 2}" y="-62" width="${bw}" height="124" rx="22" fill="#fff" stroke="#e8dcf8" stroke-width="6"/>
        <text class="gl" y="34" text-anchor="middle" font-size="${Math.min(96, bw * 0.95)}" fill="#ece3f8">${guide ? word[i] : ''}</text>
        <text class="lt" y="34" text-anchor="middle" font-size="${Math.min(96, bw * 0.95)}" fill="${i === 0 ? '#ff5fa2' : '#6d4a92'}"></text></g>`, g, { transform: `translate(${x0 + bw / 2 + i * (bw + gap)} ${boxAt[1]})` });
      boxes.push(b);
      K.tap(b, () => { if (i < idx) { K.voice.say(K.letterName(word[i])); K.replay(b.firstChild, 'pop', 500); } });
    }
    const under = K.g('', g, { transform: `translate(${boxAt[0]} ${boxAt[1] + 120})` });
    function cursor() {
      boxes.forEach((b, i) => {
        const r = b.querySelector('.bx');
        r.setAttribute('stroke', i === idx ? '#ff7fb2' : i < idx ? '#ffd166' : '#e8dcf8');
        r.setAttribute('fill', i < idx ? '#fffbe6' : '#fff');
      });
    }
    cursor();

    /* keyboard */
    const keys = {};
    const KW = 150, KH = 86, KG = 8;
    ROWS.forEach((row, r) => {
      const rowW = row.length * KW + (row.length - 1) * KG;
      row.split('').forEach((L, c) => {
        const vowel = VOWELS.includes(L);
        const x = 600 - rowW / 2 + KW / 2 + c * (KW + KG), y = 470 + r * (KH + 8);
        const k = K.g(`<g class="inner"><rect x="${-KW / 2}" y="${-KH / 2 + 5}" width="${KW}" height="${KH}" rx="20" fill="#d9c6ef"/>
          <rect class="kr" x="${-KW / 2}" y="${-KH / 2}" width="${KW}" height="${KH}" rx="20" fill="${vowel ? '#fff1b8' : ROW_COLORS[r]}" stroke="#fff" stroke-width="4"/>
          <text y="23" text-anchor="middle" font-size="66" fill="${vowel ? '#c27a12' : '#6d4a92'}">${L}</text>
          <text x="${KW / 2 - 18}" y="${KH / 2 - 10}" text-anchor="middle" font-size="20" fill="#a48bc4">${L.toLowerCase()}</text></g>`, g, { class: 'btn key', transform: `translate(${x} ${y})` });
        keys[L] = k;
        K.tap(k, () => press(L));
      });
    });

    let hinted = null;
    function hint(L) {
      if (hinted) hinted.querySelector('.kr').setAttribute('stroke', '#fff');
      hinted = keys[L];
      if (!hinted) return;
      hinted.querySelector('.kr').setAttribute('stroke', '#ff7fb2');
      K.replay(hinted.firstChild, 'pop', 600);
      K.fx.sparkle(+hinted.transform.baseVal[0].matrix.e, +hinted.transform.baseVal[0].matrix.f, { n: 6, spread: 50, size: 8 });
    }
    function press(L) {
      if (finished) return;
      K.replay(keys[L].firstChild, 'squish', 400);
      if (L === word[idx]) {
        if (hinted) { hinted.querySelector('.kr').setAttribute('stroke', '#fff'); hinted = null; }
        const b = boxes[idx];
        b.querySelector('.lt').textContent = L;
        K.replay(b.firstChild, 'pop', 500);
        K.audio.sfx('count', idx + 1);
        K.voice.say(K.letterName(L));
        const m = b.transform.baseVal[0].matrix;
        K.fx.sparkle(m.e, m.f, { n: 8, spread: 60, size: 9 });
        idx++;
        cursor();
        if (idx === n) finish();
      } else {
        wrongs++;
        K.audio.sfx('boing');
        K.replay(keys[L].firstChild, 'shake', 600);
        boxes[idx].querySelector('.gl').textContent = word[idx];
        K.voice.say(`That's ${K.letterName(L)}. Find ${K.letterName(word[idx])}!`);
        hint(word[idx]);
      }
    }
    async function finish() {
      finished = true;
      SP.known[word] = known + 1;
      K.save.write();
      await K.wait(500);
      const names = word.split('').map((c) => K.letterName(c)).join(' ');
      K.voice.say(`${names} ${word.toLowerCase()}!`, { rate: 0.8 });
      for (let i = 0; i < n; i++) {
        K.replay(boxes[i].firstChild, 'pop', 500);
        K.audio.sfx('count', i + 1);
        await K.wait(380);
      }
      under.innerHTML = `<g class="pop-in"><text text-anchor="middle" font-size="58" fill="#6d4a92"><tspan fill="#ff5fa2">${word[0].toLowerCase()}</tspan>${word.slice(1).toLowerCase()}</text></g>`;
      K.audio.sfx('fanfare');
      const m = pic.transform.baseVal[0].matrix;
      K.fx.sparkle(m.e, m.f, { n: 30, spread: 200 });
      K.replay(pic.querySelector('.pic-in'), 'pop', 600);
      await K.wait(1600);
      o.onDone && o.onDone({ wrongs, first: known === 0 });
    }

    K.voice.say(guide ? `Let's spell ${word.toLowerCase()}! Tap the letters.` : `Can you spell ${word.toLowerCase()} all by yourself?`);
    return { g, destroy: () => g.remove() };
  };
})();
