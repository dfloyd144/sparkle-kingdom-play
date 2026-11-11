/* Art: treats, toppings, room decorations, word pictures */
(function () {
  const A = K.art, sh = K.shade, D = K.data;

  /* ---------- toppings ---------- */
  A.topping = (k, rot = 0) => {
    switch (k) {
      case 'strawberry': return `<g transform="rotate(${rot})"><path d="M0 14 C-14 6 -16 -8 -8 -10 Q0 -12 8 -10 C16 -8 14 6 0 14Z" fill="#ff6b8a" stroke="#e04870" stroke-width="2"/>
        <path d="M-8 -10 L-4 -16 L0 -11 L4 -16 L8 -10Z" fill="#7ccf7c"/><circle cx="-4" cy="-2" r="1.3" fill="#fff6b0"/><circle cx="4" cy="2" r="1.3" fill="#fff6b0"/><circle cx="0" cy="7" r="1.3" fill="#fff6b0"/></g>`;
      case 'cherry': return `<g transform="rotate(${rot})"><path d="M0 -6 Q4 -20 12 -24" stroke="#5fb86f" stroke-width="2.5" fill="none"/><circle r="10" fill="#ff4d79" stroke="#d6335e" stroke-width="2"/><circle cx="-3" cy="-3" r="3" fill="#fff" opacity=".7"/></g>`;
      case 'sprinkles': return `<rect x="-9" y="-3" width="18" height="6" rx="3" fill="${K.pick(['#9fd2ff', '#fff08a', '#a6eec0', '#c9a6ff', '#ff9ec7'])}" transform="rotate(${rot * 4})"/>`;
      case 'heart': return `<path d="${A.heart(0.75)}" transform="rotate(${rot})" fill="#ff8fb8" stroke="#e05c90" stroke-width="1.5"/>`;
      case 'star': return `<path d="${A.star(11)}" transform="rotate(${rot})" fill="url(#gGold)" stroke="#e6a52e" stroke-width="1.5"/>`;
    }
    return '';
  };
  A.toppingZone = (shape) => [{ cx: 0, cy: -94, rx: 32, ry: 14 }, { cx: 0, cy: -64, rx: 28, ry: 26 }, { cx: 0, cy: -124, rx: 36, ry: 7 }][shape];

  /** t = {shape, baked, frost(-1 none), tops:[{k,x,y,r}]} — bottom center at 0,0 */
  A.treat = (t) => {
    const crumb = t.baked ? '#e9b17a' : '#fbe3b8', crumbD = t.baked ? '#c98d56' : '#e8c890';
    const f = t.frost >= 0 ? D.FROSTINGS[t.frost] : null, fd = f ? sh(f, -0.18) : null;
    let s = '';
    if (t.shape === 0) {
      s += `<path d="M-50 -62 Q-50 -100 0 -102 Q50 -100 50 -62Z" fill="${crumb}" stroke="${crumbD}" stroke-width="3"/>`;
      if (f) s += `<path d="M-54 -62 Q-62 -86 -38 -94 Q-42 -116 -12 -116 Q0 -138 16 -116 Q44 -114 40 -94 Q62 -86 54 -62 Q0 -50 -54 -62Z" fill="${f}" stroke="${fd}" stroke-width="3"/>
        <path d="M-36 -80 Q0 -70 36 -80 M-22 -102 Q4 -96 24 -102" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>`;
      s += `<path d="M-48 -62 L-36 0 H36 L48 -62Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3" stroke-linejoin="round"/>
        ${[-30, -15, 0, 15, 30].map((x) => `<path d="M${x * 1.2} -60 L${x} -2" stroke="#c9e9ff" stroke-width="5"/>`).join('')}`;
    } else if (t.shape === 1) {
      s += `<path d="${A.star(66)}" transform="translate(0 -64)" fill="${crumb}" stroke="${crumbD}" stroke-width="3" stroke-linejoin="round"/>`;
      if (f) s += `<path d="${A.star(52)}" transform="translate(0 -64)" fill="${f}" stroke="${fd}" stroke-width="3" stroke-linejoin="round"/><circle cx="-14" cy="-82" r="6" fill="#fff" opacity=".6"/>`;
    } else {
      s += `<rect x="-62" y="-72" width="124" height="70" rx="12" fill="${crumb}" stroke="${crumbD}" stroke-width="3"/>
        <rect x="-62" y="-44" width="124" height="10" fill="${f || '#fff4e0'}" opacity=".9"/>
        <rect x="-46" y="-124" width="92" height="56" rx="12" fill="${crumb}" stroke="${crumbD}" stroke-width="3"/>`;
      if (f) s += `<path d="M-48 -124 Q-48 -134 0 -134 Q48 -134 48 -124 V-110 Q40 -100 34 -110 Q26 -96 18 -110 Q8 -98 0 -110 Q-10 -96 -18 -110 Q-28 -98 -34 -110 Q-42 -100 -48 -110Z" fill="${f}" stroke="${fd}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-64 -72 Q-64 -80 0 -80 Q64 -80 64 -72 V-62 Q54 -54 46 -64 Q36 -52 26 -64 Q14 -54 4 -64 Q-8 -52 -18 -64 Q-30 -54 -40 -64 Q-52 -52 -64 -62Z" fill="${f}" stroke="${fd}" stroke-width="3" stroke-linejoin="round"/>`;
      s += `<ellipse cx="0" cy="2" rx="80" ry="10" fill="#fff" stroke="#e8d8f0" stroke-width="3"/>`;
    }
    (t.tops || []).forEach((p) => { s += `<g transform="translate(${p.x} ${p.y}) scale(1.3)">${A.topping(p.k, p.r)}</g>`; });
    if (t.baked && !f && !(t.tops || []).length) s += A.sparkle4(30, -90, 6);
    return s;
  };

  /* ---------- word pictures (radius ~60) ---------- */
  A.picture = (word) => {
    switch (word) {
      case 'SUN': return `<g transform="scale(.9)">${A.sun()}</g>`;
      case 'CAT': return `<path d="M-40 40 Q-46 -10 -30 -26 L-36 -58 L-10 -36 Q0 -38 10 -36 L36 -58 L30 -26 Q46 -10 40 40Z" fill="#ffd6a8" stroke="#e0a070" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="-14" cy="-8" r="6" fill="#4a2c5a"/><circle cx="14" cy="-8" r="6" fill="#4a2c5a"/><path d="M-4 4 L4 4 L0 9Z" fill="#ff8fb8"/><path d="M-8 14 Q-4 18 0 13 Q4 18 8 14" stroke="#a0607a" stroke-width="2.5" fill="none"/>
        <path d="M-20 6 L-44 2 M-20 12 L-44 16 M20 6 L44 2 M20 12 L44 16" stroke="#c08860" stroke-width="2"/><path d="M40 30 Q66 20 56 -4" stroke="#ffd6a8" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      case 'BEE': return `<ellipse cx="-14" cy="-26" rx="16" ry="22" fill="#e6f7ff" stroke="#9fd2ff" stroke-width="3" transform="rotate(-20 -14 -26)"/><ellipse cx="12" cy="-28" rx="16" ry="22" fill="#e6f7ff" stroke="#9fd2ff" stroke-width="3" transform="rotate(20 12 -28)"/>
        <ellipse cx="0" cy="8" rx="44" ry="32" fill="#ffe27f" stroke="#e6b84a" stroke-width="3"/><path d="M-14 -20 Q-20 8 -14 38 M8 -22 Q2 8 8 38" stroke="#5a3d4a" stroke-width="9" fill="none"/>
        <circle cx="26" cy="0" r="5" fill="#4a2c5a"/><path d="M24 14 Q32 18 36 10" stroke="#4a2c5a" stroke-width="2.5" fill="none"/><path d="M-44 8 L-56 8" stroke="#5a3d4a" stroke-width="4"/>`;
      case 'STAR': return `<path d="${A.star(58)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3" stroke-linejoin="round"/><circle cx="-12" cy="-4" r="4" fill="#7a5a3a"/><circle cx="12" cy="-4" r="4" fill="#7a5a3a"/><path d="M-8 8 Q0 15 8 8" stroke="#7a5a3a" stroke-width="3" fill="none"/>`;
      case 'MOON': return `<path d="M10 -56 A56 56 0 1 0 50 34 A44 44 0 1 1 10 -56Z" fill="#fff4b8" stroke="#e6c34a" stroke-width="3"/><circle cx="-16" cy="-4" r="4" fill="#7a5a3a"/><path d="M-26 12 Q-18 18 -10 12" stroke="#7a5a3a" stroke-width="3" fill="none"/>${A.sparkle4(40, -36, 10, '#fff08a')}`;
      case 'FISH': return `<path d="M-46 0 Q-10 -40 30 0 Q-10 40 -46 0Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3"/><path d="M26 0 L56 -24 L50 0 L56 24Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="-24" cy="-6" r="6" fill="#4a2c5a"/><circle cx="-22" cy="-8" r="2" fill="#fff"/><path d="M-6 -16 Q2 0 -6 16 M6 -14 Q14 0 6 14" stroke="#fff" stroke-width="3" fill="none"/>`;
      case 'CAKE': return `<g transform="translate(0 46) scale(.8)">${A.treat({ shape: 2, baked: true, frost: 0, tops: [{ k: 'cherry', x: 0, y: -140, r: 0 }, { k: 'heart', x: -26, y: -132, r: -10 }, { k: 'heart', x: 26, y: -132, r: 10 }] })}</g>`;
      case 'LOVE': return `<path d="${A.heart(3.3)}" transform="translate(0 18)" fill="#ff8fb8" stroke="#e05c90" stroke-width="3"/><ellipse cx="-22" cy="-22" rx="9" ry="6" fill="#fff" opacity=".7"/>`;
      case 'BOW': return `<path d="M0 0 L-46 -30 Q-58 0 -46 30Z M0 0 L46 -30 Q58 0 46 30Z" fill="#ff8fb8" stroke="#e05c90" stroke-width="3" stroke-linejoin="round"/><circle r="12" fill="#ff7fb2" stroke="#e05c90" stroke-width="3"/>`;
      case 'PIG': return `<circle r="46" fill="#ffc2d6" stroke="#ec8fb0" stroke-width="3"/><path d="M-36 -30 L-40 -56 L-16 -42Z M36 -30 L40 -56 L16 -42Z" fill="#ffc2d6" stroke="#ec8fb0" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="0" cy="12" rx="18" ry="13" fill="#ff9ec0" stroke="#ec8fb0" stroke-width="3"/><circle cx="-6" cy="12" r="3.5" fill="#c0607e"/><circle cx="6" cy="12" r="3.5" fill="#c0607e"/><circle cx="-18" cy="-12" r="5" fill="#4a2c5a"/><circle cx="18" cy="-12" r="5" fill="#4a2c5a"/>`;
      case 'HAT': return `<ellipse cx="0" cy="22" rx="62" ry="14" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><path d="M-36 20 Q-38 -40 0 -42 Q38 -40 36 20Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><rect x="-37" y="0" width="74" height="12" fill="#ff8fb8"/><g transform="translate(26 -2)">${A.flowerHead('#fff08a', 10, false)}</g>`;
      default: return `<g transform="translate(0 10) scale(.72)">${A.princessHead(K.me())}</g>`;
    }
  };

  /* ---------- room items (bottom center at 0,0) ---------- */
  A.room = (t) => {
    switch (t) {
      case 'bed': return `<ellipse cx="0" cy="0" rx="130" ry="14" fill="#5a3d7a" opacity=".12"/>
        <rect x="-118" y="-250" width="14" height="250" rx="6" fill="#fff" stroke="#e5c7dc" stroke-width="2"/><rect x="104" y="-250" width="14" height="250" rx="6" fill="#fff" stroke="#e5c7dc" stroke-width="2"/>
        <path d="M-124 -250 Q0 -300 124 -250${A.scallop(124, -124, -250, 6, 16)}Z" fill="#ffc2dc" stroke="#e57aa8" stroke-width="3"/>
        <path d="M-110 -244 Q-80 -160 -104 -70 L-92 -70 Q-70 -160 -96 -244Z M110 -244 Q80 -160 104 -70 L92 -70 Q70 -160 96 -244Z" fill="#fff" opacity=".75"/>
        <path d="M-112 -40 V-150 Q-112 -176 -86 -176 H-40 Q-40 -150 -20 -150 V-40Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
        <rect x="-112" y="-80" width="224" height="58" rx="18" fill="#fff" stroke="#e5c7dc" stroke-width="3"/>
        <path d="M-60 -92 H112 V-22 H-60Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/><path d="M-60 -62 H112" stroke="#fff" stroke-width="4" stroke-dasharray="10 8"/>
        <ellipse cx="-80" cy="-98" rx="30" ry="18" fill="#fff" stroke="#e5c7dc" stroke-width="3"/>
        <rect x="-112" y="-26" width="16" height="26" fill="#c9a6ff"/><rect x="96" y="-26" width="16" height="26" fill="#c9a6ff"/>
        <path d="${A.heart(1)}" transform="translate(30 -60)" fill="#fff"/>`;
      case 'vanity': return `<ellipse cx="0" cy="0" rx="80" ry="10" fill="#5a3d7a" opacity=".12"/>
        <ellipse cx="0" cy="-150" rx="48" ry="58" fill="#e2f5ff" stroke="url(#gGold)" stroke-width="9"/><path d="M-20 -170 L6 -196 M-26 -146 L14 -186" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <rect x="-70" y="-88" width="140" height="20" rx="8" fill="#fff" stroke="#e5c7dc" stroke-width="3"/>
        <path d="M-64 -68 H64 V-30 Q0 -20 -64 -30Z" fill="#ffd1e8" stroke="#e57aa8" stroke-width="3"/>
        <rect x="-62" y="-30" width="10" height="30" fill="#fff" stroke="#e5c7dc" stroke-width="2"/><rect x="52" y="-30" width="10" height="30" fill="#fff" stroke="#e5c7dc" stroke-width="2"/>
        <rect x="-44" y="-104" width="12" height="18" rx="3" fill="#c9a6ff"/><circle cx="30" cy="-96" r="9" fill="#9fd2ff"/>`;
      case 'rug': return `<ellipse cx="0" cy="-30" rx="150" ry="40" fill="#e9dcff" stroke="#c9a6ff" stroke-width="4"/><ellipse cx="0" cy="-30" rx="116" ry="28" fill="#ffd1e8"/>
        <ellipse cx="0" cy="-30" rx="70" ry="16" fill="#fff4b8"/><path d="${A.heart(1)}" transform="translate(0 -28) scale(1 .5)" fill="#ff8fb8"/>`;
      case 'plant': return `<ellipse cx="0" cy="0" rx="40" ry="8" fill="#5a3d7a" opacity=".12"/>
        <path d="M-30 -56 H30 L24 0 H-24Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3"/><rect x="-34" y="-62" width="68" height="12" rx="6" fill="#ffc9e0" stroke="#e57aa8" stroke-width="3"/>
        <path d="M0 -62 Q-40 -110 -50 -150 Q-10 -120 0 -62Z M0 -62 Q40 -110 46 -158 Q8 -120 0 -62Z M0 -62 Q-6 -130 4 -176 Q14 -120 0 -62Z" fill="#8fd88f" stroke="#5fb86f" stroke-width="2.5"/>
        <g transform="translate(4 -176)">${A.flowerHead('#ff9ec7', 10, false)}</g>`;
      case 'lamp': return `<ellipse cx="0" cy="0" rx="34" ry="8" fill="#5a3d7a" opacity=".12"/><circle cx="0" cy="-190" r="70" fill="url(#gWarm)" class="glowpulse"/>
        <ellipse cx="0" cy="-4" rx="30" ry="8" fill="#c9a6ff"/><rect x="-4" y="-170" width="8" height="166" fill="#ffd166"/>
        <path d="M-40 -164 L-26 -214 H26 L40 -164Z" fill="#fff4e0" stroke="#e5c7dc" stroke-width="3"/><path d="M-40 -164${A.scallop(-40, 40, -164, 5, 8)}" fill="#ffb3d4" stroke="#e57aa8" stroke-width="2"/>`;
      case 'teddy': return `<ellipse cx="0" cy="0" rx="40" ry="8" fill="#5a3d7a" opacity=".12"/>
        <ellipse cx="-20" cy="-8" rx="14" ry="10" fill="#d9a77a"/><ellipse cx="20" cy="-8" rx="14" ry="10" fill="#d9a77a"/>
        <ellipse cx="0" cy="-36" rx="32" ry="30" fill="#e6b88a" stroke="#c99a62" stroke-width="2.5"/><ellipse cx="0" cy="-32" rx="18" ry="16" fill="#f7dcbc"/>
        <circle cx="-26" cy="-102" r="12" fill="#e6b88a" stroke="#c99a62" stroke-width="2.5"/><circle cx="26" cy="-102" r="12" fill="#e6b88a" stroke="#c99a62" stroke-width="2.5"/>
        <circle cx="0" cy="-82" r="30" fill="#e6b88a" stroke="#c99a62" stroke-width="2.5"/><ellipse cx="0" cy="-72" rx="13" ry="10" fill="#f7dcbc"/><circle cx="0" cy="-76" r="4" fill="#5a3d4a"/>
        <circle cx="-11" cy="-88" r="4" fill="#4a2c5a"/><circle cx="11" cy="-88" r="4" fill="#4a2c5a"/><path d="M-12 -56 l12 -4 12 4 -12 4Z" fill="#ff8fb8"/>`;
      case 'plush': return `<g transform="scale(.36)">${A.unicorn({ mane: 0, acc: [true] })}</g>`;
      case 'painting': return `<rect x="-66" y="-110" width="132" height="104" rx="6" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3"/><rect x="-54" y="-98" width="108" height="80" fill="#cfeaff"/>
        <path d="M-54 -40 Q-20 -64 10 -44 Q34 -60 54 -46 V-18 H-54Z" fill="#b3e6c2"/><g transform="translate(0 -40)">${A.rainbow(30, 5, 1)}</g><circle cx="34" cy="-80" r="9" fill="#ffe27f"/>`;
      case 'shelf': return `<ellipse cx="0" cy="0" rx="70" ry="8" fill="#5a3d7a" opacity=".12"/><rect x="-62" y="-176" width="124" height="176" rx="8" fill="#fff4e0" stroke="#e6b98a" stroke-width="3"/>
        <path d="M-62 -118 H62 M-62 -60 H62" stroke="#e6b98a" stroke-width="4"/>
        ${[[-50, -170, '#ff9ec7'], [-34, -166, '#9fd2ff'], [-20, -170, '#fff08a'], [-6, -164, '#c9a6ff'], [20, -170, '#a6eec0'], [-48, -112, '#c9a6ff'], [-32, -108, '#ffb38a'], [-16, -112, '#ff9ec7'], [26, -110, '#9fd2ff'], [-50, -54, '#a6eec0'], [-34, -54, '#fff08a']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="13" height="${(y < -120 ? -120 : y < -60 ? -62 : -4) - y}" rx="2" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="1.5"/>`).join('')}
        <g transform="translate(30 -64) scale(.4)">${A.room('teddy')}</g>`;
      case 'chest': return `<ellipse cx="0" cy="0" rx="72" ry="9" fill="#5a3d7a" opacity=".12"/>
        <circle cx="-24" cy="-82" r="16" fill="#9fd2ff"/><path d="M14 -76 L24 -110 L34 -76Z" fill="#fff08a"/><g transform="translate(36 -86) rotate(20)">${A.icons.ball.replace('r="28"', 'r="16"')}</g>
        <rect x="-64" y="-74" width="128" height="74" rx="10" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><rect x="-68" y="-84" width="136" height="18" rx="8" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3"/>
        <path d="${A.heart(1.3)}" transform="translate(0 -32)" fill="#fff"/>`;
      case 'balloons': return `<path d="M0 0 Q-10 -60 -34 -150 M0 0 Q4 -80 6 -176 M0 0 Q14 -60 40 -140" stroke="#c9a6ff" stroke-width="2" fill="none"/>
        <ellipse cx="-34" cy="-176" rx="28" ry="34" fill="#ff9ec7" stroke="#e57aa8" stroke-width="2.5"/><ellipse cx="6" cy="-204" rx="28" ry="34" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="2.5"/><ellipse cx="40" cy="-166" rx="28" ry="34" fill="#fff08a" stroke="#e6c34a" stroke-width="2.5"/>
        <ellipse cx="-42" cy="-188" rx="6" ry="10" fill="#fff" opacity=".6"/><ellipse cx="-2" cy="-216" rx="6" ry="10" fill="#fff" opacity=".6"/><ellipse cx="32" cy="-178" rx="6" ry="10" fill="#fff" opacity=".6"/><circle cx="0" cy="0" r="6" fill="#c9a6ff"/>`;
      case 'lights': return `<path d="M-140 -60 Q-70 -10 0 -60 Q70 -10 140 -60" stroke="#8fd88f" stroke-width="3" fill="none"/>
        ${[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((x, i) => { const y = -60 + Math.sin((Math.abs(x % 140) / 140) * Math.PI) * 38 + (Math.abs(x) === 140 ? 0 : 0); return `<g transform="translate(${x} ${(x % 140 === 0 ? -60 : y) + 6})"><circle r="14" fill="url(#gWarm)" class="twinkle" style="animation-delay:${-i * 0.3}s"/><ellipse ry="8" rx="6" fill="${['#ff9ec7', '#fff08a', '#9fd2ff', '#a6eec0', '#c9a6ff'][i % 5]}"/></g>`; }).join('')}`;
      case 'chandelier': return `<path d="M0 -150 V-90" stroke="#e6a52e" stroke-width="4"/><circle cy="-60" r="70" fill="url(#gWarm)" class="glowpulse"/>
        <path d="M-60 -70 Q0 -30 60 -70" stroke="url(#gGold)" stroke-width="7" fill="none"/><ellipse cx="0" cy="-90" rx="30" ry="10" fill="url(#gGold)"/>
        ${[-56, -28, 0, 28, 56].map((x) => `<path d="M${x} ${-70 + Math.abs(x) * 0} l0 ${30 - Math.abs(x) * 0.2} " stroke="#e6a52e" stroke-width="2"/><path d="M${x} ${-36 - Math.abs(x) * 0.25} l-7 12 7 14 7 -14Z" fill="#e2f5ff" stroke="#9fd2ff" stroke-width="1.5"/><ellipse cx="${x}" cy="${-78 + Math.abs(x) * 0.12}" rx="5" ry="9" fill="#fff4b8"/>`).join('')}`;
      case 'pillow': return `<ellipse cx="0" cy="0" rx="40" ry="7" fill="#5a3d7a" opacity=".12"/><path d="${A.heart(3)}" transform="translate(0 -24)" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/><path d="${A.heart(1.2)}" transform="translate(0 -38)" fill="#fff" opacity=".7"/>`;
    }
    return '';
  };
  /** Items that hang on the wall/ceiling (drawn behind floor items) */
  A.ROOM_WALL = ['painting', 'lights', 'chandelier'];
})();
