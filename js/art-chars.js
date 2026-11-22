/* Art: princesses, unicorn, bunny chef. Feet are at (0,0); characters face right. */
(function () {
  const A = K.art, sh = K.shade, D = K.data;

  /* ---------- princess ---------- */
  function hairBack(style, c, cd, cl) {
    switch (style) {
      case 0: return `<path d="M-56 -172 C-72 -244 72 -244 56 -172 C62 -146 66 -118 70 -90 Q60 -78 50 -90 Q40 -78 28 -92 L-28 -92 Q-40 -78 -50 -90 Q-60 -78 -70 -90 C-66 -118 -62 -146 -56 -172Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-58 -150 Q-62 -120 -60 -98 M58 -150 Q62 -120 60 -98" stroke="${cl}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`;
      case 1: return `<circle cx="-44" cy="-208" r="25" fill="${c}" stroke="${cd}" stroke-width="2"/><circle cx="44" cy="-208" r="25" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-50 -214 q8 -12 16 -2 M38 -214 q8 -12 16 -2" stroke="${cd}" stroke-width="3" fill="none"/>
        <path d="M-55 -168 C-62 -238 62 -238 55 -168 L58 -126 Q0 -112 -58 -126Z" fill="${c}" stroke="${cd}" stroke-width="2"/>`;
      case 2: {
        const pts = [[-60, -148, 24], [-64, -178, 25], [-52, -208, 26], [-27, -228, 26], [3, -234, 26], [32, -226, 26], [56, -205, 25], [65, -176, 24], [61, -147, 24], [-52, -122, 21], [53, -122, 21]];
        return pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${cd}" stroke-width="2"/>`).join('') +
          pts.slice(0, 9).map(([x, y]) => `<circle cx="${x - 6}" cy="${y - 7}" r="5" fill="${cl}" opacity=".7"/>`).join('');
      }
      case 3: return `<path d="M-55 -165 C-63 -236 63 -236 55 -165 L50 -140 L-50 -140Z" fill="${c}" stroke="${cd}" stroke-width="2"/>`;
      case 4: return `<path d="M-58 -165 C-66 -240 66 -240 58 -165 C63 -140 61 -124 50 -116 Q0 -108 -50 -116 C-61 -124 -63 -140 -58 -165Z" fill="${c}" stroke="${cd}" stroke-width="2"/>`;
      case 5: return `<path d="M-55 -165 C-63 -236 63 -236 55 -165 L52 -138 L-52 -138Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M14 -224 C72 -264 108 -206 90 -150 C82 -120 92 -100 78 -80 C62 -102 54 -126 58 -156 C62 -190 46 -206 14 -208Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M74 -204 Q90 -160 76 -112" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
    }
    return '';
  }
  function hairFront(style, c, cd, cl) {
    const cap = 'M-55 -160 C-63 -240 63 -240 55 -160';
    switch (style) {
      case 0: return `<path d="${cap} C46 -192 22 -198 8 -186 C-6 -204 -38 -198 -55 -160Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-53 -170 Q-62 -138 -50 -108 Q-42 -134 -44 -164Z M53 -170 Q62 -138 50 -108 Q42 -134 44 -164Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-30 -205 Q-10 -216 12 -210" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
      case 1: return `<path d="${cap} Q45 -184 30 -182 Q18 -195 0 -186 Q-18 -195 -30 -182 Q-45 -184 -55 -160Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-28 -206 Q-8 -216 14 -210" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
      case 2: return `<path d="${cap} Q30 -196 0 -192 Q-30 -196 -55 -160Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        ${[[-34, -200], [-12, -208], [12, -208], [34, -200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${c}" stroke="${cd}" stroke-width="2"/>`).join('')}`;
      case 3: return `<path d="${cap} C40 -200 0 -206 -20 -190 C-36 -184 -48 -176 -55 -160Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        ${[[40, -128], [46, -110], [50, -92], [52, -74], [52, -57]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${14 - i}" ry="11" fill="${i % 2 ? cd : c}" stroke="${cd}" stroke-width="2"/>`).join('')}
        <circle cx="52" cy="-46" r="6" fill="#ff8fb8"/><path d="M52 -46 l-8 10 M52 -46 l8 10" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
        <path d="M-20 -208 Q8 -218 30 -204" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
      case 5: return `<path d="${cap} C44 -190 18 -200 -2 -190 C-20 -200 -42 -190 -55 -160Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-28 -206 Q-6 -218 18 -212" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
        <circle cx="24" cy="-218" r="11" fill="#ff8fb8" stroke="#e05c90" stroke-width="2.5"/><circle cx="20" cy="-222" r="3" fill="#fff" opacity=".8"/>`;
      case 4: return `<path d="${cap} L50 -180 L-50 -180Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-56 -168 Q-60 -140 -52 -118 Q-46 -140 -46 -170Z M56 -168 Q60 -140 52 -118 Q46 -140 46 -170Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-26 -208 Q-6 -218 16 -212" stroke="${cl}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
    }
    return '';
  }
  function crown(i) {
    switch (i) {
      case 0: return `<path d="M-28 -211 L-20 -234 L-10 -220 L0 -246 L10 -220 L20 -234 L28 -211 Q0 -203 -28 -211Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="0" cy="-222" r="5.5" fill="#ff7fb2" stroke="#fff" stroke-width="1.5"/><circle cx="-16" cy="-215" r="3" fill="#9fd2ff"/><circle cx="16" cy="-215" r="3" fill="#a6eec0"/>`;
      case 1: return [[-44, -192], [-32, -208], [-14, -216], [6, -218], [26, -212], [42, -198]].map(([x, y], j) =>
        `<g transform="translate(${x} ${y})">${j % 2 ? '' : '<ellipse cx="9" cy="5" rx="8" ry="4" fill="#8fd88f" transform="rotate(30 9 5)"/>'}${A.flowerHead(['#ff9ec7', '#fff08a', '#c9a6ff', '#9fd2ff', '#ffb38a', '#ff9ec7'][j], 9, false)}</g>`).join('');
      case 2: return `<path d="M-32 -206 L-37 -252 L-17 -228 L0 -262 L17 -228 L37 -252 L32 -206 Q0 -198 -32 -206Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="0" cy="-222" r="7" fill="#c9a6ff" stroke="#fff" stroke-width="2"/><circle cx="-20" cy="-216" r="4.5" fill="#ff7fb2"/><circle cx="20" cy="-216" r="4.5" fill="#9fd2ff"/>
        <circle cx="0" cy="-264" r="5" fill="#fff6b0"/><circle cx="-37" cy="-254" r="4" fill="#fff6b0"/><circle cx="37" cy="-254" r="4" fill="#fff6b0"/>`;
      case 3: return `<g transform="translate(32 -206) rotate(18)"><path d="M0 0 L-26 -16 Q-32 0 -26 16Z M0 0 L26 -16 Q32 0 26 16Z" fill="#ff8fb8" stroke="#e05c90" stroke-width="2.5" stroke-linejoin="round"/>
        <circle r="7" fill="#ff7fb2" stroke="#e05c90" stroke-width="2"/><path d="M-4 6 L-10 24 M4 6 L10 24" stroke="#ff8fb8" stroke-width="6" stroke-linecap="round"/></g>`;
      case 5: return `<path d="M-30 -208 Q0 -200 30 -208 L26 -222 Q0 -214 -26 -222Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/>
        <path d="${A.heart(1.5)}" transform="translate(0 -230)" fill="#ff7fb2" stroke="#e05c90" stroke-width="2"/><path d="${A.heart(0.8)}" transform="translate(-24 -224)" fill="#ffb3d4" stroke="#e05c90" stroke-width="1.5"/><path d="${A.heart(0.8)}" transform="translate(24 -224)" fill="#ffb3d4" stroke="#e05c90" stroke-width="1.5"/>
        <circle cx="-6" cy="-238" r="3" fill="#fff" opacity=".8"/>`;
      case 4: return `<path d="M-46 -194 Q0 -238 46 -194" stroke="#ffb3d4" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M-10 -214 L0 -268 L10 -214Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5" stroke-linejoin="round"/><path d="M-6 -226 L6 -230 M-4 -242 L5 -245" stroke="#e6a52e" stroke-width="2"/>
        <path d="M-40 -204 L-36 -230 L-24 -212Z M40 -204 L36 -230 L24 -212Z" fill="#fff" stroke="#ffb3d4" stroke-width="3" stroke-linejoin="round"/>`;
    }
    return '';
  }
  function skirt(style, c, cd, cl) {
    switch (style) {
      case 0: return `<path d="M-15 -86 C-34 -64 -70 -34 -80 -6${A.scallop(-80, 80, -6, 6, 11)} C70 -34 34 -64 15 -86Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-6 -84 C-16 -52 -26 -26 -30 -4 Q0 6 30 -4 C26 -26 16 -52 6 -84Z" fill="${cl}" opacity=".6"/>
        ${[-53, -27, 0, 27, 53].map((x) => `<circle cx="${x}" cy="-6" r="3.5" fill="#ffe08a"/>`).join('')}
        <rect x="-17" y="-92" width="34" height="9" rx="4" fill="${cd}"/>
        <path d="M14 -88 l14 -9 v18Z M14 -88 l-4 16" fill="${cd}" stroke="${cd}" stroke-width="3" stroke-linejoin="round"/>`;
      case 1: {
        const tier = (y1, y2, w1, w2, f) => `<path d="M${-w1} ${y1} L${-w2} ${y2}${A.scallop(-w2, w2, y2, Math.round(w2 / 14), 10)} L${w1} ${y1}Z" fill="${f}" stroke="${cd}" stroke-width="2" stroke-linejoin="round"/>`;
        return tier(-40, -6, 50, 80, c) + tier(-64, -32, 32, 62, cl) + tier(-88, -56, 15, 44, c) +
          `<rect x="-17" y="-92" width="34" height="8" rx="4" fill="#fff" opacity=".8"/>`;
      }
      case 2: {
        const stars = [[-30, -30], [10, -52], [38, -22], [-8, -16], [-44, -12], [24, -70], [-18, -62], [52, -10]];
        return `<path d="M-14 -86 L-72 -8 Q0 8 72 -8 L14 -86Z" fill="${c}" stroke="${cd}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M-14 -86 L-60 -12 Q0 0 60 -12 L14 -86Z" fill="#fff" opacity=".25"/>
          ${stars.map(([x, y], i) => `<path d="${A.star(i % 2 ? 5 : 7)}" transform="translate(${x} ${y})" fill="${i % 3 ? '#fff' : '#ffe08a'}"/>`).join('')}
          <path d="M-17 -88 Q0 -82 17 -88" stroke="#ffe08a" stroke-width="5" fill="none"/>`;
      }
      case 3: {
        let s = '';
        [-3, 3, -2, 2, -1, 1, 0].forEach((i) => { s += `<ellipse cx="0" cy="-42" rx="22" ry="46" transform="rotate(${i * 13} 0 -86)" fill="${Math.abs(i) % 2 ? cl : c}" stroke="${cd}" stroke-width="2"/>`; });
        [-2, 2, -1, 1, 0].forEach((i) => { s += `<ellipse cx="0" cy="-62" rx="13" ry="26" transform="rotate(${i * 17} 0 -88)" fill="${Math.abs(i) % 2 ? c : cl}" stroke="${cd}" stroke-width="1.5"/>`; });
        return s + `<path d="M-16 -90 Q0 -84 16 -90" stroke="#8fd88f" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      }
      case 5: return `<path d="M-15 -86 C-30 -60 -50 -30 -58 -6${A.scallop(-58, 58, -6, 7, 9)} C50 -30 30 -60 15 -86Z" fill="${c}" stroke="${cd}" stroke-width="2"/>
        <path d="M-56 -12 Q0 2 56 -12" stroke="${cl}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${[[-26, -50, 0], [14, -64, 1], [30, -30, 0], [-6, -28, 1], [-36, -22, 1], [6, -46, 0]].map(([x, y, m]) => (m ? `<path d="M3 -6 A6 6 0 1 0 6 4 A5 5 0 1 1 3 -6Z" transform="translate(${x} ${y})" fill="#fff6c2"/>` : `<path d="${A.star(5)}" transform="translate(${x} ${y})" fill="#fff"/>`)).join('')}`;
      case 4: return `<path d="M-14 -86 L-72 -4 L-54 -14 L-36 0 L-18 -12 L0 2 L18 -12 L36 0 L54 -14 L72 -4 L14 -86Z" fill="${c}" stroke="${cd}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M-14 -86 L-50 -20 L-30 -28 L-12 -16 L6 -28 L26 -18 L48 -26 L14 -86Z" fill="${cl}" opacity=".7"/>
        ${A.sparkle4(-30, -40, 6)}${A.sparkle4(22, -50, 5)}${A.sparkle4(40, -20, 4)}`;
    }
    return '';
  }
  function fairyWings(c) {
    const w = `<ellipse cx="-50" cy="-128" rx="40" ry="22" transform="rotate(-32 -50 -128)" fill="#fff" fill-opacity=".6" stroke="${c}" stroke-width="3"/>
      <ellipse cx="-40" cy="-92" rx="26" ry="15" transform="rotate(24 -40 -92)" fill="#fff" fill-opacity=".6" stroke="${c}" stroke-width="3"/>`;
    return `<g class="wings">${w}<g transform="scale(-1 1)">${w}</g></g>`;
  }

  A.princess = (p) => {
    const skin = p.skin, skinD = sh(skin, -0.14);
    const hc = D.HAIR_COLORS[p.hair].hex, hcD = sh(hc, -0.22), hcL = sh(hc, 0.4);
    const dc = D.DRESS_COLORS[p.color].hex, dcD = sh(dc, -0.2), dcL = sh(dc, 0.5);
    return `
    <ellipse cx="0" cy="0" rx="58" ry="11" fill="#5a3d7a" opacity=".16"/>
    ${p.dress === 4 ? fairyWings(dcD) : ''}
    ${hairBack(p.style, hc, hcD, hcL)}
    <ellipse cx="-15" cy="-4" rx="13" ry="7" fill="${dcD}"/><ellipse cx="15" cy="-4" rx="13" ry="7" fill="${dcD}"/>
    ${skirt(p.dress, dc, dcD, dcL)}
    <path d="M-19 -117 Q0 -111 19 -117 L16 -85 Q0 -81 -16 -85Z" fill="${dc}" stroke="${dcD}" stroke-width="2"/>
    <path d="M-18 -116 Q0 -108 18 -116" stroke="#fff" stroke-width="3" fill="none" opacity=".9"/>
    <circle cy="-104" r="4" fill="#fff6b0" stroke="#e6a52e" stroke-width="1"/>
    <path d="M-25 -106 Q-37 -92 -37 -77 M25 -106 Q37 -92 37 -77" stroke="${skin}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <circle cx="-37" cy="-74" r="7" fill="${skin}"/><circle cx="37" cy="-74" r="7" fill="${skin}"/>
    <circle cx="-22" cy="-111" r="12" fill="${dcL}" stroke="${dc}" stroke-width="2.5"/><circle cx="22" cy="-111" r="12" fill="${dcL}" stroke="${dc}" stroke-width="2.5"/>
    <rect x="-7" y="-128" width="14" height="16" rx="5" fill="${skinD}"/>
    <circle cx="0" cy="-165" r="50" fill="${skin}"/>
    <g class="eyes">
      <ellipse cx="-19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/><ellipse cx="19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/>
      <circle cx="-16.5" cy="-160" r="3.2" fill="#fff"/><circle cx="21.5" cy="-160" r="3.2" fill="#fff"/>
      <circle cx="-21" cy="-152" r="1.6" fill="#fff"/><circle cx="17" cy="-152" r="1.6" fill="#fff"/>
      <path d="M-26 -162 l-6 -4 M-26.5 -157 l-7 -1 M26 -162 l6 -4 M26.5 -157 l7 -1" stroke="#4a2c5a" stroke-width="2.2" stroke-linecap="round"/>
    </g>
    <path class="eyes-happy" d="M-27 -155 Q-19 -166 -11 -155 M11 -155 Q19 -166 27 -155" stroke="#4a2c5a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="-32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/><ellipse cx="32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/>
    <path d="M-2 -145 Q0 -143 2 -145" stroke="${skinD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path class="mouth" d="M-8 -135 Q0 -128 8 -135" stroke="#c0566e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="mouth-open" d="M-9 -136 Q0 -122 9 -136Z" fill="#d9587a" stroke="#c0466a" stroke-width="1.5" stroke-linejoin="round"/>
    <path class="mouth-sad" d="M-8 -130 Q0 -137 8 -130" stroke="#c0566e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="sad-brows" d="M-28 -176 L-12 -172 M28 -176 L12 -172" stroke="#6d4a52" stroke-width="3" stroke-linecap="round"/>
    ${hairFront(p.style, hc, hcD, hcL)}
    ${crown(p.crown)}`;
  };
  /* ---------- mermaid: a princess with a tail (m = { tail, fin } ) ---------- */
  A.TAIL_COLORS = ['#7fd8c8', '#9fd2ff', '#c9a6ff', '#ff9ec7', '#6cd48a', '#ffd166', '#ff8f8f', '#b0f0ff'];
  A.TAIL_NAMES = ['teal', 'blue', 'purple', 'pink', 'green', 'gold', 'coral', 'aqua'];
  A.FIN_NAMES = ['fan fin', 'swirl fin', 'frilly fin'];
  A.finPath = (f) => [
    'M0 -14 C-20 -4 -46 0 -40 18 C-24 12 -10 8 0 4 C10 8 24 12 40 18 C46 0 20 -4 0 -14Z',
    'M0 -14 C-30 -10 -56 -20 -62 -2 C-40 -6 -20 4 0 4 C20 4 40 -6 62 -2 C56 -20 30 -10 0 -14Z',
    'M0 -14 C-16 -6 -40 -2 -44 14 Q-30 6 -22 16 Q-12 6 0 16 Q12 6 22 16 Q30 6 44 14 C40 -2 16 -6 0 -14Z',
  ][f % 3];
  A.mermaid = (p, m) => {
    const skin = p.skin, skinD = sh(skin, -0.14);
    const hc = D.HAIR_COLORS[p.hair].hex, hcD = sh(hc, -0.22), hcL = sh(hc, 0.4);
    const tc = A.TAIL_COLORS[m.tail % A.TAIL_COLORS.length], tcD = sh(tc, -0.25), tcL = sh(tc, 0.45);
    return `
    ${hairBack(p.style, hc, hcD, hcL)}
    <g class="tail"><path d="M-26 -94 C-32 -54 -14 -32 -6 -14 L6 -14 C14 -32 32 -54 26 -94Z" fill="${tc}" stroke="${tcD}" stroke-width="2.5"/>
      <path d="M-18 -78 q6 6 12 0 q6 6 12 0 q6 6 12 0 M-14 -62 q6 6 12 0 q6 6 12 0 M-10 -46 q5 5 10 0 q5 5 10 0 M-6 -30 q6 6 12 0" stroke="${tcL}" stroke-width="2.5" fill="none"/>
      <path class="fin" d="${A.finPath(m.fin || 0)}" fill="${tcL}" stroke="${tcD}" stroke-width="2.5" stroke-linejoin="round"/></g>
    <path d="M-20 -116 Q0 -110 20 -116 L22 -94 Q0 -88 -22 -94Z" fill="${skin}"/>
    ${[-16, -8, 0, 8, 16].map((x) => `<circle cx="${x}" cy="-94" r="3.5" fill="#fff" stroke="#e8dcf0" stroke-width="1"/>`).join('')}
    ${[-11, 11].map((x) => `<path d="M${x - 10} -104 Q${x} -122 ${x + 10} -104Z" fill="${tcL}" stroke="${tcD}" stroke-width="2"/><path d="M${x} -104 V-116 M${x - 5} -105 L${x - 3} -115 M${x + 5} -105 L${x + 3} -115" stroke="${tcD}" stroke-width="1.2"/>`).join('')}
    <path d="M-25 -110 Q-37 -96 -37 -81 M25 -110 Q37 -96 37 -81" stroke="${skin}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <circle cx="-37" cy="-78" r="7" fill="${skin}"/><circle cx="37" cy="-78" r="7" fill="${skin}"/>
    <rect x="-7" y="-128" width="14" height="16" rx="5" fill="${skinD}"/>
    <circle cx="0" cy="-165" r="50" fill="${skin}"/>
    <g class="eyes">
      <ellipse cx="-19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/><ellipse cx="19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/>
      <circle cx="-16.5" cy="-160" r="3.2" fill="#fff"/><circle cx="21.5" cy="-160" r="3.2" fill="#fff"/>
      <path d="M-26 -162 l-6 -4 M-26.5 -157 l-7 -1 M26 -162 l6 -4 M26.5 -157 l7 -1" stroke="#4a2c5a" stroke-width="2.2" stroke-linecap="round"/>
    </g>
    <path class="eyes-happy" d="M-27 -155 Q-19 -166 -11 -155 M11 -155 Q19 -166 27 -155" stroke="#4a2c5a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="-32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/><ellipse cx="32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/>
    <path class="mouth" d="M-8 -135 Q0 -128 8 -135" stroke="#c0566e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="mouth-open" d="M-9 -136 Q0 -122 9 -136Z" fill="#d9587a" stroke="#c0466a" stroke-width="1.5" stroke-linejoin="round"/>
    ${hairFront(p.style, hc, hcD, hcL)}
    ${crown(p.crown)}`;
  };
  /** Just the head (for portraits & option thumbnails). */
  A.princessHead = (p) => {
    const hc = D.HAIR_COLORS[p.hair].hex, hcD = sh(hc, -0.22), hcL = sh(hc, 0.4);
    return `<g transform="translate(0 165)">${hairBack(p.style, hc, hcD, hcL)}<rect x="-20" y="-125" width="40" height="30" fill="${D.DRESS_COLORS[p.color].hex}"/>
      <circle cx="0" cy="-165" r="50" fill="${p.skin}"/>
      <ellipse cx="-19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/><ellipse cx="19" cy="-156" rx="7.5" ry="10" fill="#4a2c5a"/>
      <circle cx="-16.5" cy="-160" r="3.2" fill="#fff"/><circle cx="21.5" cy="-160" r="3.2" fill="#fff"/>
      <ellipse cx="-32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/><ellipse cx="32" cy="-138" rx="12" ry="7" fill="url(#gCheek)"/>
      <path d="M-8 -135 Q0 -128 8 -135" stroke="#c0566e" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${hairFront(p.style, hc, hcD, hcL)}${crown(p.crown)}</g>`;
  };
  A.skirtOnly = (style, colorIdx) => {
    const dc = D.DRESS_COLORS[colorIdx].hex;
    return `<g transform="translate(0 50)">${skirt(style, dc, sh(dc, -0.2), sh(dc, 0.5))}<path d="M-19 -117 Q0 -111 19 -117 L16 -85 Q0 -81 -16 -85Z" fill="${dc}" stroke="${sh(dc, -0.2)}" stroke-width="2"/></g>`;
  };
  A.crownOnly = (i) => `<g transform="translate(0 ${i === 3 ? 205 : 232})">${crown(i)}</g>`;

  /* ---------- unicorn ---------- */
  const LOCK = 'M0 -6 C22 -6 30 22 12 44 C12 30 -2 22 -16 18 C-22 6 -12 -6 0 -6Z';
  A.MUD = [[-40, -150], [20, -118], [-78, -122], [52, -168]];
  A.unicorn = (u) => {
    const c = D.MANES[u.mane || 0].c;
    const acc = u.acc || [];
    const lock = (x, y, rot, s, col) => `<path class="mane-lock" d="${LOCK}" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${col}" stroke="${sh(col, -0.15)}" stroke-width="2"/>`;
    let tail = '';
    for (let i = 0; i < 6; i++) tail += lock(-100 - i * 7, -168 + i * 9, 38 + i * 9, 1.55 - i * 0.06, c[i]);
    let mane = '';
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      mane += lock(K.lerp(96, 30, t), K.lerp(-300, -168, t), 34 + t * 18, 1.3 - t * 0.25, c[i % 6]);
    }
    const leg = (x, cls, fill) => `<g class="leg ${cls}"><rect x="${x - 13}" y="-118" width="26" height="106" rx="13" fill="${fill}" stroke="#e0d4f2" stroke-width="2"/>
      <rect x="${x - 14}" y="-22" width="28" height="21" rx="8" fill="url(#gGold)" stroke="#f0a930" stroke-width="2"/></g>`;
    const wing = acc[4] ? `<g class="uwing"><ellipse cx="-52" cy="-238" rx="74" ry="32" transform="rotate(-38 -52 -238)" fill="#fff" stroke="#e2d6f5" stroke-width="3"/>
      <ellipse cx="-40" cy="-220" rx="58" ry="25" transform="rotate(-28 -40 -220)" fill="#ffe6f3" stroke="#f5cde2" stroke-width="2"/>
      <ellipse cx="-26" cy="-204" rx="42" ry="18" transform="rotate(-16 -26 -204)" fill="#ece2ff" stroke="#d9c9fb" stroke-width="2"/></g>` : '';
    return `<g class="uni-art">
      <ellipse cx="0" cy="0" rx="128" ry="16" fill="#5a3d7a" opacity=".15"/>
      ${wing}
      <g class="tail">${tail}</g>
      ${leg(-50, 'b', '#eee6fb')}${leg(84, 'a', '#eee6fb')}
      <ellipse cx="0" cy="-140" rx="110" ry="62" fill="url(#gPearl)" stroke="#e0d4f2" stroke-width="2.5"/>
      <ellipse cx="-20" cy="-168" rx="60" ry="18" fill="#fff" opacity=".8"/>
      ${leg(-74, 'a', '#fbf8ff')}${leg(60, 'b', '#fbf8ff')}
      ${acc[3] ? `<path d="M-56 -194 Q-4 -214 44 -196 L40 -146${A.scallop(40, -52, -146, 5, 12)} Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="2.5"/>
        <path d="${A.heart(1)}" transform="translate(-6 -170)" fill="#fff"/>${[-42, -18, 6, 30].map((x) => `<circle cx="${x}" cy="-200" r="3" fill="#ffe08a"/>`).join('')}` : ''}
      <path d="M48 -172 C60 -216 80 -252 100 -274 L142 -246 C128 -220 116 -190 110 -140Z" fill="url(#gPearl)" stroke="#e0d4f2" stroke-width="2.5"/>
      <g class="mane">${mane}</g>
      ${acc[1] ? `<path d="M64 -204 Q94 -176 128 -210" stroke="url(#gGold)" stroke-width="5" fill="none"/><path d="${A.star(11)}" transform="translate(96 -184)" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>` : ''}
      <g class="head">
        <path d="M92 -280 C88 -306 96 -324 104 -320 C110 -310 110 -294 106 -282Z" fill="#fbf8ff" stroke="#e0d4f2" stroke-width="2.5"/>
        <path d="M96 -284 C95 -300 99 -312 103 -309 C106 -300 105 -292 103 -286Z" fill="#ffd1e8"/>
        <ellipse cx="122" cy="-256" rx="46" ry="40" fill="url(#gPearl)" stroke="#e0d4f2" stroke-width="2.5"/>
        <ellipse cx="156" cy="-236" rx="31" ry="25" transform="rotate(-12 156 -236)" fill="#fff4f9" stroke="#f3d4e4" stroke-width="2.5"/>
        <ellipse cx="172" cy="-243" rx="3.5" ry="2.6" fill="#e7a8c3"/>
        <path class="mouth" d="M150 -222 Q161 -214 173 -223" stroke="#d68aab" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path class="mouth-open" d="M150 -225 Q162 -206 175 -225Z" fill="#e57aa0"/>
        <g class="eyes"><ellipse cx="122" cy="-262" rx="10" ry="13" fill="#4a2c5a"/><circle cx="125.5" cy="-267" r="4.2" fill="#fff"/><circle cx="119" cy="-256" r="2" fill="#fff"/>
          <path d="M113 -270 l-9 -6 M112 -264 l-10 -1 M116 -274 l-4 -9" stroke="#4a2c5a" stroke-width="2.6" stroke-linecap="round"/></g>
        <path class="eyes-happy" d="M111 -260 Q122 -274 133 -260" stroke="#4a2c5a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="140" cy="-240" rx="12" ry="7" fill="url(#gCheek)"/>
        <path d="M108 -290 Q120 -326 132 -364 Q134 -326 128 -288Z" fill="url(#gGold)" stroke="#f0a930" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M111 -301 L128 -297 M115 -315 L129 -311 M119 -329 L130 -325 M124 -343 L131 -340" stroke="#f0a930" stroke-width="2.5" stroke-linecap="round"/>
        ${lock(104, -296, -30, 0.95, c[0])}${lock(112, -292, -58, 0.8, c[1])}
        ${acc[2] ? [[96, -290, 0], [108, -300, 1], [124, -298, 2], [138, -290, 3]].map(([x, y, j]) => `<g transform="translate(${x} ${y})">${A.flowerHead(['#ff9ec7', '#fff08a', '#c9a6ff', '#9fd2ff'][j], 8, false)}</g>`).join('') : ''}
        ${acc[0] ? `<g transform="translate(84 -282) rotate(-20)"><path d="M0 0 L-20 -13 Q-25 0 -20 13Z M0 0 L20 -13 Q25 0 20 13Z" fill="#ff8fb8" stroke="#e05c90" stroke-width="2.5" stroke-linejoin="round"/><circle r="6" fill="#ff7fb2" stroke="#e05c90" stroke-width="2"/></g>` : ''}
      </g>
      <g class="tangles" opacity="${u.messy ? 1 : 0}">
        <path d="M58 -258 c14 -26 40 4 14 12 c-26 8 -8 -30 12 -18 c16 10 -6 26 -16 16" stroke="${sh(c[0], -0.25)}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M36 -206 c18 -18 34 10 10 14 c-22 4 -2 -26 14 -12" stroke="${sh(c[3], -0.25)}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M-118 -120 c-20 -10 -6 -30 8 -16 c12 12 -18 22 -20 4" stroke="${sh(c[2], -0.25)}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M70 -300 l-14 -18 M80 -296 l-4 -22 M52 -280 l-20 -8" stroke="${sh(c[1], -0.2)}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g class="mud">${A.MUD.map(([x, y], i) => `<g data-i="${i}" transform="translate(${x} ${y})" opacity="${(u.mud || []).includes(i) ? 1 : 0}">
        <circle r="17" fill="#c49a78"/><circle cx="13" cy="7" r="10" fill="#c49a78"/><circle cx="-12" cy="9" r="8" fill="#c49a78"/><circle cx="-4" cy="-6" r="5" fill="#d8b596"/></g>`).join('')}</g>
    </g>`;
  };

  /* ---------- bunny chef (Chef Biscuit) ---------- */
  A.bunny = (hat = true) => `
    <ellipse cx="0" cy="0" rx="48" ry="10" fill="#5a3d7a" opacity=".15"/>
    <ellipse cx="-20" cy="-6" rx="18" ry="9" fill="#fff" stroke="#e5dcef" stroke-width="2"/><ellipse cx="20" cy="-6" rx="18" ry="9" fill="#fff" stroke="#e5dcef" stroke-width="2"/>
    <ellipse cx="0" cy="-54" rx="42" ry="50" fill="#fff" stroke="#e5dcef" stroke-width="2.5"/>
    <path d="M-28 -78 H28 L32 -18 Q0 -4 -32 -18Z" fill="#ffd1e8" stroke="#f0a8c8" stroke-width="2"/>
    <path d="${A.heart(0.8)}" transform="translate(0 -40)" fill="#ff9ec7"/>
    <ellipse cx="-40" cy="-66" rx="11" ry="18" transform="rotate(25 -40 -66)" fill="#fff" stroke="#e5dcef" stroke-width="2"/>
    <ellipse cx="40" cy="-66" rx="11" ry="18" transform="rotate(-25 40 -66)" fill="#fff" stroke="#e5dcef" stroke-width="2"/>
    <ellipse cx="-17" cy="-176" rx="12" ry="36" transform="rotate(-12 -17 -176)" fill="#fff" stroke="#e5dcef" stroke-width="2.5"/>
    <ellipse cx="-17" cy="-176" rx="6" ry="26" transform="rotate(-12 -17 -176)" fill="#ffd1e8"/>
    <path d="M14 -150 C20 -190 40 -206 52 -196 C58 -186 40 -170 26 -146Z" fill="#fff" stroke="#e5dcef" stroke-width="2.5"/>
    <circle cx="0" cy="-122" r="42" fill="#fff" stroke="#e5dcef" stroke-width="2.5"/>
    ${hat ? `<path d="M-30 -150 Q-48 -170 -30 -184 Q-26 -204 -6 -198 Q8 -214 24 -198 Q46 -200 40 -178 Q50 -160 30 -150Z" fill="#fff" stroke="#d8cbe8" stroke-width="2.5"/><rect x="-30" y="-158" width="60" height="14" rx="5" fill="#fff" stroke="#d8cbe8" stroke-width="2.5"/>` : ''}
    <g class="eyes"><circle cx="-15" cy="-126" r="6.5" fill="#4a2c5a"/><circle cx="15" cy="-126" r="6.5" fill="#4a2c5a"/><circle cx="-13" cy="-129" r="2.4" fill="#fff"/><circle cx="17" cy="-129" r="2.4" fill="#fff"/></g>
    <path class="eyes-happy" d="M-22 -124 Q-15 -133 -8 -124 M8 -124 Q15 -133 22 -124" stroke="#4a2c5a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-5 -113 L5 -113 L0 -107Z" fill="#ff8fb8"/>
    <path class="mouth" d="M-8 -103 Q-4 -98 0 -104 Q4 -98 8 -103" stroke="#a0607a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path class="mouth-open" d="M-7 -104 Q0 -92 7 -104Z" fill="#e57aa0"/>
    <path class="mouth-sad" d="M-8 -98 Q0 -106 8 -98" stroke="#a0607a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path class="sad-brows" d="M-24 -141 L-9 -136 M24 -141 L9 -136" stroke="#4a2c5a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="-27" cy="-108" rx="9" ry="6" fill="url(#gCheek)"/><ellipse cx="27" cy="-108" rx="9" ry="6" fill="url(#gCheek)"/>
    <path d="M-20 -112 L-40 -116 M-20 -108 L-40 -104 M20 -112 L40 -116 M20 -108 L40 -104" stroke="#e5dcef" stroke-width="2" stroke-linecap="round"/>`;
})();
