/* Art: bathroom & mission pictures, Pip the royal owl */
(function () {
  const A = K.art, I = A.icons;

  I.toilet = `<rect x="-20" y="-40" width="40" height="34" rx="7" fill="#fff" stroke="#8cc6ea" stroke-width="3"/>
    <rect x="-23" y="-44" width="46" height="9" rx="4" fill="#fff" stroke="#8cc6ea" stroke-width="3"/>
    <circle cx="-13" cy="-28" r="3.5" fill="#ffc54d"/><path d="${A.heart(0.5)}" transform="translate(4 -20)" fill="#ff9ec7"/>
    <path d="M-26 0 Q-22 22 -10 26 H10 Q22 22 26 0Z" fill="#fff" stroke="#8cc6ea" stroke-width="3"/>
    <ellipse cx="0" cy="-1" rx="29" ry="9" fill="#fff" stroke="#8cc6ea" stroke-width="3"/><ellipse cx="0" cy="-1" rx="18" ry="5" fill="#cdeeff"/>
    <rect x="-12" y="24" width="24" height="10" rx="3" fill="#fff" stroke="#8cc6ea" stroke-width="3"/>`;
  I.tub = `<circle cx="-20" cy="-14" r="10" fill="#fff" stroke="#9fd2ff" stroke-width="2"/><circle cx="-2" cy="-20" r="12" fill="#fff" stroke="#9fd2ff" stroke-width="2"/><circle cx="16" cy="-14" r="9" fill="#fff" stroke="#9fd2ff" stroke-width="2"/>
    <path d="M-34 -6 H34 Q34 20 14 22 H-14 Q-34 20 -34 -6Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3"/>
    <rect x="-38" y="-10" width="76" height="8" rx="4" fill="#fff" stroke="#e57aa8" stroke-width="2"/>
    <circle cx="-20" cy="26" r="4" fill="#ffc54d"/><circle cx="20" cy="26" r="4" fill="#ffc54d"/>
    <g transform="translate(26 -16)"><ellipse rx="8" ry="6" fill="#ffe27f"/><circle cx="5" cy="-6" r="5" fill="#ffe27f"/><path d="M9 -6 l5 1 -5 2Z" fill="#ffad6b"/></g>`;
  I.scroll = `<rect x="-22" y="-28" width="44" height="56" rx="4" fill="#fff4e0" stroke="#d9a873" stroke-width="3"/>
    <rect x="-28" y="-36" width="56" height="13" rx="6" fill="#f2d3a8" stroke="#d9a873" stroke-width="3"/>
    <rect x="-28" y="23" width="56" height="13" rx="6" fill="#f2d3a8" stroke="#d9a873" stroke-width="3"/>
    <path d="${A.star(13)}" transform="translate(0 -4)" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/><path d="M-12 14 H12" stroke="#e5b98a" stroke-width="3" stroke-linecap="round"/>`;
  I.medal = `<path d="M-18 -36 L-5 -6 L5 -6 L18 -36 L7 -36 L0 -20 L-7 -36Z" fill="#ff8fb8" stroke="#e05c90" stroke-width="2" stroke-linejoin="round"/>
    <circle cy="12" r="23" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3"/><path d="${A.star(13)}" transform="translate(0 12)" fill="#fff6c2" stroke="#e6a52e" stroke-width="2"/>`;
  I.butterfly = `<g transform="scale(2)">${A.butterfly('#c9a6ff')}</g>`;
  I.teddy = `<g transform="translate(0 44) scale(.62)">${A.room('teddy')}</g>`;
  I.purpleDress = I.dress.replace(/#ffa6c9/g, '#c7a6ff').replace(/#e57aa8/g, '#9a7fe0');
  I.cherries = `<g transform="translate(-13 8) scale(2)">${A.topping('cherry', -10)}</g><g transform="translate(14 8) scale(2)">${A.topping('cherry', 10)}</g>`;
  I.arrowL = `<path d="M10 -22 L-14 0 L10 22" fill="none" stroke="#8d62c2" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`;
  I.arrowR = `<path d="M-10 -22 L14 0 L-10 22" fill="none" stroke="#8d62c2" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`;
  I.door = `<path d="M-24 32 V-12 A24 24 0 0 1 24 -12 V32Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><circle cx="12" cy="10" r="3.5" fill="#ffc54d"/><g transform="translate(-2 -6) scale(.42)">${I.tub}</g>`;

  I.keyboard = `<rect x="-36" y="-22" width="72" height="44" rx="9" fill="#fff" stroke="#9a7fe0" stroke-width="3"/>
    ${[-24, -8, 8, 24].map((x, i) => `<rect x="${x - 6}" y="-14" width="12" height="11" rx="3" fill="${['#ff9ec7', '#fff08a', '#9fd2ff', '#a6eec0'][i]}"/>`).join('')}
    ${[-16, 0, 16].map((x) => `<rect x="${x - 6}" y="0" width="12" height="11" rx="3" fill="#e3d6f5"/>`).join('')}
    <text y="-28" text-anchor="middle" font-size="18" fill="#ff5fa2">ABC</text>`;
  I.book = `<path d="M0 -18 Q-18 -28 -36 -22 V22 Q-18 16 0 26 Q18 16 36 22 V-22 Q18 -28 0 -18Z" fill="#fff4e0" stroke="#c99a62" stroke-width="3" stroke-linejoin="round"/>
    <path d="M0 -18 V26" stroke="#c99a62" stroke-width="3"/><path d="M-28 -10 Q-16 -14 -6 -8 M-28 0 Q-16 -4 -6 2 M6 -8 Q16 -14 28 -10 M6 2 Q16 -4 28 0" stroke="#e0c49c" stroke-width="3" fill="none"/>
    <text x="-17" y="18" text-anchor="middle" font-size="16" fill="#ff5fa2">A</text><text x="17" y="18" text-anchor="middle" font-size="16" fill="#8d62c2">b</text>
    ${A.sparkle4(-22, -32, 8, '#ffd166')}${A.sparkle4(26, -34, 6, '#9fd2ff')}`;
  I.present = `<rect x="-30" y="-12" width="60" height="44" rx="5" fill="#ff7d9c" stroke="#e0507a" stroke-width="3"/><rect x="-34" y="-22" width="68" height="14" rx="4" fill="#ff9ab2" stroke="#e0507a" stroke-width="3"/>
    <rect x="-6" y="-22" width="12" height="54" fill="#ffd166"/><path d="M0 -22 C-26 -46 -30 -20 0 -22 C30 -20 26 -46 0 -22Z" fill="#ffd166" stroke="#e6a52e" stroke-width="2.5"/>
    ${A.sparkle4(30, -34, 7, '#fff08a')}${A.sparkle4(-30, 30, 6, '#fff')}`;
  I.snowflake = `<g stroke="#9fd2ff" stroke-width="5" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M0 -30 V30 M-8 -22 L0 -14 L8 -22 M-8 22 L0 14 L8 22" transform="rotate(${a})"/>`).join('')}</g><circle r="5" fill="#fff"/>`;
  I.bells = `<g transform="rotate(-14) translate(-12 0)"><path d="M-14 14 Q-14 -18 0 -20 Q14 -18 14 14 L18 18 H-18Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/><circle cy="20" r="5" fill="#e6a52e"/></g>
    <g transform="rotate(14) translate(12 0)"><path d="M-14 14 Q-14 -18 0 -20 Q14 -18 14 14 L18 18 H-18Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5"/><circle cy="20" r="5" fill="#e6a52e"/></g>
    <path d="M0 -22 L-14 -32 Q-18 -22 -12 -16Z M0 -22 L14 -32 Q18 -22 12 -16Z" fill="#ff4d79"/>`;

  A.duck = `<ellipse cx="0" cy="8" rx="34" ry="24" fill="#ffe27f" stroke="#e6b84a" stroke-width="3"/><circle cx="18" cy="-18" r="20" fill="#ffe27f" stroke="#e6b84a" stroke-width="3"/>
    <path d="M34 -20 l18 4 -18 8Z" fill="#ffad6b"/><circle cx="23" cy="-24" r="4" fill="#4a2c5a"/><path d="M-24 0 q-14 -12 -4 -22" stroke="#e6b84a" stroke-width="3" fill="none"/>`;

  /** Pictures for spelling words (fit radius ~70) */
  A.spellPic = (word) => {
    const S = K.save.data;
    const ni = S.names.findIndex((nm) => nm.toUpperCase() === word);
    if (ni >= 0) return `<g transform="translate(0 14) scale(.95)">${A.princessHead(S.looks[ni])}</g>`;
    if (S.unicorn && S.unicorn.name.toUpperCase() === word) return `<g transform="translate(-20 70) scale(.36)">${A.unicorn(S.unicorn).replace('class="uni-art"', 'transform="translate(-60 0)"')}</g>`;
    const big = (svg, s = 1.7) => `<g transform="scale(${s})">${svg}</g>`;
    switch (word) {
      case 'BED': return big(I.bed);
      case 'CUP': return big(I.teacup);
      case 'TUB': return big(I.tub);
      case 'DUCK': return big(A.duck, 1.3);
      case 'BALL': return big(I.ball);
      case 'BEAR': return `<g transform="translate(0 64) scale(1.05)">${A.room('teddy')}</g>`;
      case 'APPLE': return big(I.apple);
      case 'CROWN': return big(I.crown);
      case 'TREE': return `<g transform="scale(1.1)">${A.xmas('tree')}</g>`;
      case 'BELL': return `<g transform="scale(1.9)">${A.xmas('bell')}</g>`;
      case 'GIFT': return big(I.present);
      case 'SNOW': return big(I.snowflake);
      default: return `<g transform="scale(1.15)">${A.picture(word)}</g>`;
    }
  };

  /* ---------- Christmas decorations (centered at 0,0) ---------- */
  A.XMAS = ['wreath', 'ornament', 'candycane', 'star', 'lights', 'stocking', 'bell', 'present', 'snowman', 'tree', 'gingerbread', 'holly', 'snowflake', 'bow', 'candle', 'hat'];
  A.XMAS_WORDS = { wreath: 'wreath', ornament: 'ornament', candycane: 'candy cane', star: 'star', lights: 'lights', stocking: 'stocking', bell: 'bell', present: 'present', snowman: 'snowman', tree: 'tree', gingerbread: 'gingerbread', holly: 'holly', snowflake: 'snowflake', bow: 'bow', candle: 'candle', hat: 'santa hat' };
  const ORN = ['#ff4d79', '#ffd166', '#9fd2ff', '#c9a6ff', '#7fd8a8', '#ff9ec7'];
  A.xmas = (t, c = 0) => {
    const col = ORN[c % ORN.length];
    switch (t) {
      case 'wreath': return `<circle r="28" fill="none" stroke="#3fa66a" stroke-width="16"/>
        ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<ellipse cx="${(Math.cos(a) * 28).toFixed(1)}" cy="${(Math.sin(a) * 28).toFixed(1)}" rx="9" ry="5" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${(Math.cos(a) * 28).toFixed(1)} ${(Math.sin(a) * 28).toFixed(1)})" fill="#5fc48a"/>`; }).join('')}
        ${[30, 110, 200, 290].map((d) => { const a = d * Math.PI / 180; return `<circle cx="${(Math.cos(a) * 30).toFixed(1)}" cy="${(Math.sin(a) * 30).toFixed(1)}" r="4.5" fill="#ff4d79"/>`; }).join('')}
        <path d="M0 26 L-16 16 Q-20 30 -14 36Z M0 26 L16 16 Q20 30 14 36Z" fill="#ff4d79" stroke="#d6335e" stroke-width="2"/><circle cy="26" r="5" fill="#ff4d79"/>`;
      case 'ornament': return `<path d="M0 -30 q-8 -8 0 -12 q8 4 0 12" fill="none" stroke="#e6a52e" stroke-width="2.5"/><rect x="-7" y="-30" width="14" height="9" rx="2" fill="url(#gGold)"/>
        <circle cy="0" r="22" fill="${col}" stroke="${K.shade(col, -0.2)}" stroke-width="2.5"/><path d="M-20 -4 Q0 6 20 -4" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>
        <circle cx="-8" cy="-9" r="5" fill="#fff" opacity=".7"/>`;
      case 'candycane': return `<path d="M8 34 V-14 A14 14 0 0 0 -20 -14" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
        <path d="M8 34 V-14 A14 14 0 0 0 -20 -14" fill="none" stroke="#ff4d79" stroke-width="12" stroke-dasharray="7 9" stroke-linecap="butt"/>`;
      case 'star': return `<circle r="30" fill="url(#gWarm)"/><path d="${A.star(28)}" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5" stroke-linejoin="round"/>${A.sparkle4(-10, -10, 5)}`;
      case 'lights': return `<path d="M-62 -8 Q-31 14 0 -8 Q31 14 62 -8" stroke="#3fa66a" stroke-width="3" fill="none"/>
        ${[-50, -30, -10, 10, 30, 50].map((x, i) => `<g transform="translate(${x} ${Math.abs(Math.sin((x + 62) / 62 * Math.PI)) * 9 - 2})"><circle r="11" fill="url(#gWarm)" class="twinkle" style="animation-delay:-${i * 0.35}s"/><ellipse cy="5" rx="5.5" ry="8" fill="${ORN[i % 6]}"/><rect x="-3" y="-4" width="6" height="4" fill="#3fa66a"/></g>`).join('')}`;
      case 'stocking': return `<path d="M-12 -26 H12 V8 Q12 20 26 22 Q36 26 30 34 H0 Q-12 34 -12 20Z" fill="#ff4d79" stroke="#d6335e" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="-15" y="-34" width="30" height="13" rx="6" fill="#fff" stroke="#e8dcf0" stroke-width="2"/><path d="${A.heart(0.45)}" transform="translate(0 2)" fill="#fff"/>`;
      case 'bell': return `<path d="M-18 16 Q-18 -18 0 -20 Q18 -18 18 16 L23 22 H-23Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5" stroke-linejoin="round"/><circle cy="24" r="6" fill="#e6a52e"/>
        <path d="M0 -20 L-16 -32 Q-20 -20 -12 -14Z M0 -20 L16 -32 Q20 -20 12 -14Z" fill="#ff4d79" stroke="#d6335e" stroke-width="2"/><circle cy="-20" r="4" fill="#ff4d79"/>`;
      case 'present': return `<rect x="-20" y="-12" width="40" height="34" rx="4" fill="${col}" stroke="${K.shade(col, -0.25)}" stroke-width="2.5"/>
        <rect x="-4" y="-12" width="8" height="34" fill="#fff"/><rect x="-20" y="2" width="40" height="7" fill="#fff"/>
        <path d="M0 -12 C-18 -30 -20 -10 0 -12 C20 -10 18 -30 0 -12Z" fill="#fff" stroke="#e8dcf0" stroke-width="2"/>`;
      case 'snowman': return `<ellipse cy="46" rx="32" ry="6" fill="#5a3d7a" opacity=".12"/>
        <circle cy="22" r="27" fill="#fff" stroke="#d6e8f6" stroke-width="3"/><circle cy="-16" r="20" fill="#fff" stroke="#d6e8f6" stroke-width="3"/><circle cy="-46" r="15" fill="#fff" stroke="#d6e8f6" stroke-width="3"/>
        <circle cx="-5" cy="-49" r="2.5" fill="#4a2c5a"/><circle cx="6" cy="-49" r="2.5" fill="#4a2c5a"/><path d="M0 -44 L14 -41 L0 -39Z" fill="#ffad6b"/>
        <path d="M-17 -30 Q0 -22 17 -30 L15 -24 Q0 -17 -15 -24Z" fill="#ff4d79"/><path d="M10 -26 l4 16 6 -2 -4 -14" fill="#ff4d79"/>
        <rect x="-13" y="-72" width="26" height="14" rx="3" fill="#4a3a5a"/><rect x="-18" y="-60" width="36" height="5" rx="2" fill="#4a3a5a"/>
        <circle cy="-14" r="2.5" fill="#4a2c5a"/><circle cy="-4" r="2.5" fill="#4a2c5a"/>`;
      case 'tree': return `<rect x="-7" y="40" width="14" height="14" fill="#a8744f"/>
        <path d="M0 -50 L-24 -14 H-12 L-34 16 H-18 L-42 46 H42 L18 16 H34 L12 -14 H24Z" fill="#3fa66a" stroke="#2f8a55" stroke-width="2.5" stroke-linejoin="round"/>
        ${[[-10, -16, 0], [14, 6, 1], [-18, 28, 2], [10, 34, 3], [-2, 10, 4], [24, 38, 5]].map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="5" fill="${ORN[k]}"/>`).join('')}
        <path d="${A.star(13)}" transform="translate(0 -52)" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>`;
      case 'gingerbread': return `<path d="M0 -36 A13 13 0 0 1 0 -10 A13 13 0 0 1 0 -36Z" fill="#c9895a"/><circle cy="-23" r="13" fill="#c9895a"/>
        <path d="M-10 -12 H10 L26 -4 Q30 4 22 6 L12 2 V12 L22 30 Q20 38 12 34 L0 20 L-12 34 Q-20 38 -22 30 L-12 12 V2 L-22 6 Q-30 4 -26 -4Z" fill="#c9895a" stroke="#a86b40" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="-4" cy="-26" r="2" fill="#fff"/><circle cx="4" cy="-26" r="2" fill="#fff"/><path d="M-5 -18 Q0 -14 5 -18" stroke="#fff" stroke-width="2" fill="none"/>
        <circle cy="0" r="2.6" fill="#ff4d79"/><circle cy="10" r="2.6" fill="#7fd8a8"/><path d="M-22 -1 l6 2 M22 -1 l-6 2" stroke="#fff" stroke-width="2"/>`;
      case 'holly': return `<path d="M0 0 C-10 -8 -26 -6 -32 2 C-26 2 -24 8 -18 8 C-14 6 -8 6 0 0Z" fill="#3fa66a" stroke="#2f8a55" stroke-width="2"/>
        <path d="M0 0 C10 -8 26 -6 32 2 C26 2 24 8 18 8 C14 6 8 6 0 0Z" fill="#3fa66a" stroke="#2f8a55" stroke-width="2"/>
        <circle cx="-5" cy="-6" r="6" fill="#ff4d79"/><circle cx="6" cy="-6" r="6" fill="#ff4d79"/><circle cx="0" cy="-14" r="6" fill="#ff4d79"/>`;
      case 'snowflake': return `<g transform="scale(.9)">${I.snowflake}</g>`;
      case 'bow': return `<path d="M0 0 L-28 -18 Q-34 0 -28 18Z M0 0 L28 -18 Q34 0 28 18Z" fill="#ff4d79" stroke="#d6335e" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M-4 6 L-14 32 M4 6 L14 32" stroke="#ff4d79" stroke-width="8" stroke-linecap="round"/><circle r="7" fill="#ff6b8f" stroke="#d6335e" stroke-width="2"/>`;
      case 'candle': return `<circle cy="-34" r="16" fill="url(#gWarm)" class="glowpulse"/><path d="M0 -44 Q7 -34 0 -26 Q-7 -34 0 -44Z" fill="#ffc54d"/>
        <rect x="-9" y="-24" width="18" height="44" rx="4" fill="#ff4d79"/><path d="M-9 -16 H9" stroke="#fff" stroke-width="3" opacity=".7"/><ellipse cy="22" rx="18" ry="5" fill="url(#gGold)"/>`;
      case 'hat': return `<path d="M-26 10 Q-20 -30 10 -34 Q30 -34 34 -10 L22 -14 Q16 -18 14 -10 Q12 0 24 10Z" fill="#ff4d79" stroke="#d6335e" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="-30" y="4" width="60" height="14" rx="7" fill="#fff" stroke="#e8dcf0" stroke-width="2"/><circle cx="34" cy="-8" r="9" fill="#fff" stroke="#e8dcf0" stroke-width="2"/>`;
    }
    return '';
  };

  /** Pip, the royal owl who brings missions (feet at 0,0) */
  A.owl = () => `
    <ellipse cx="0" cy="0" rx="34" ry="7" fill="#5a3d7a" opacity=".15"/>
    <path d="M-30 -66 L-27 -94 L-11 -76Z M30 -66 L27 -94 L11 -76Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-42" rx="36" ry="42" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
    <ellipse cx="-33" cy="-36" rx="10" ry="24" transform="rotate(14 -33 -36)" fill="#b393f2" stroke="#9a7fe0" stroke-width="2"/>
    <ellipse cx="0" cy="-30" rx="23" ry="27" fill="#f3ecff"/>
    <path d="M-12 -30 q4 5 8 0 M4 -30 q4 5 8 0 M-6 -18 q4 5 8 0" stroke="#d8c8f6" stroke-width="2.5" fill="none"/>
    <g class="eyes"><circle cx="-14" cy="-58" r="14" fill="#fff" stroke="#9a7fe0" stroke-width="2"/><circle cx="14" cy="-58" r="14" fill="#fff" stroke="#9a7fe0" stroke-width="2"/>
      <circle cx="-12" cy="-57" r="7" fill="#4a2c5a"/><circle cx="12" cy="-57" r="7" fill="#4a2c5a"/><circle cx="-10" cy="-60" r="2.6" fill="#fff"/><circle cx="14" cy="-60" r="2.6" fill="#fff"/></g>
    <path class="eyes-happy" d="M-24 -56 Q-14 -66 -4 -56 M4 -56 Q14 -66 24 -56" stroke="#4a2c5a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-6 -46 L6 -46 L0 -36Z" fill="#ffc54d" stroke="#e6a52e" stroke-width="1.5" stroke-linejoin="round"/>
    <ellipse cx="-24" cy="-44" rx="6" ry="4" fill="url(#gCheek)"/><ellipse cx="24" cy="-44" rx="6" ry="4" fill="url(#gCheek)"/>
    <path d="M-12 -82 L-14 -96 L-6 -88 L0 -100 L6 -88 L14 -96 L12 -82Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2" stroke-linejoin="round"/>
    <path d="M-12 -2 l-4 6 M-8 -2 v7 M8 -2 v7 M12 -2 l4 6" stroke="#ffad6b" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(32 -26) rotate(18) scale(.55)">${I.scroll}</g>`;
})();
