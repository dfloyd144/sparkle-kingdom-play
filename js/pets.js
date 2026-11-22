/* Pets: art for 30 kinds of pets, and the saved list of pets she owns (several at once). Feet at (0,0), facing right. */
(function () {
  const A = K.art, I = A.icons;
  const sh = K.shade;

  const eyes = (pts, r = 6) => `<g class="eyes">${pts.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.22}" fill="#3a2a44"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff"/>`).join('')}</g>
    <path class="eyes-happy" d="${pts.map(([x, y]) => `M${x - r} ${y + 1} Q${x} ${y - r * 1.4} ${x + r} ${y + 1}`).join(' ')}" stroke="#3a2a44" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const mouth = (x, y, w = 5) => `<path class="mouth" d="M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}" stroke="#7a4a5a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path class="mouth-open" d="M${x - w} ${y - 1} Q${x} ${y + w * 1.8} ${x + w} ${y - 1}Z" fill="#e57aa0"/>
    <path class="mouth-sad" d="M${x - w} ${y + 4} Q${x} ${y - 2} ${x + w} ${y + 4}" stroke="#7a4a5a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const cheek = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" fill="url(#gCheek)"/>`;
  const shadow = (rx = 42) => `<ellipse cx="0" cy="0" rx="${rx}" ry="7" fill="#5a3d7a" opacity=".14"/>`;
  const legs = (xs, c, h = 16) => xs.map((x) => `<rect x="${x - 6}" y="${-h}" width="12" height="${h}" rx="6" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2"/>`).join('');

  // horse, pony and zebra share one shape (pony is shorter and fluffier, zebra has stripes)
  const STRIPE = '#3a2a44';
  function equine(c, o) {
    const L = o.small ? 18 : 30, mane = o.mane || sh(c, -0.35), y0 = -(L + 22);
    const stripes = o.stripes ? `<g stroke="${STRIPE}" stroke-width="5" stroke-linecap="round" fill="none">
        <path d="M-30 ${y0 - 16} q6 14 0 30 M-16 ${y0 - 20} q6 18 0 38 M-2 ${y0 - 21} q6 18 0 40 M12 ${y0 - 20} q6 16 0 36"/>
        <path d="M24 ${y0 - 22} l12 -8 M27 ${y0 - 34} l12 -8 M30 ${y0 - 46} l12 -8"/></g>` : '';
    const legStripes = o.stripes ? [-30, -14, 18, 34].map((x) => `<path d="M${x - 6} ${-L + 4} h12 M${x - 6} ${-L / 2} h12" stroke="${STRIPE}" stroke-width="3.5"/>`).join('') : '';
    return `${shadow(50)}
      <path class="ptail" d="M-42 ${y0 - 6} C-62 ${y0} -64 ${y0 + 26} -56 ${y0 + 40}" stroke="${mane}" stroke-width="${o.small ? 14 : 11}" fill="none" stroke-linecap="round"/>
      ${legs([-30, -14, 18, 34], c, L + 4)}${[-30, -14, 18, 34].map((x) => `<rect x="${x - 7}" y="-7" width="14" height="7" rx="3" fill="${sh(c, -0.45)}"/>`).join('')}${legStripes}
      <ellipse cx="0" cy="${y0}" rx="46" ry="${o.small ? 25 : 23}" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M18 ${y0 - 8} L30 ${y0 - 52} L56 ${y0 - 46} L44 ${y0 + 4}Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      ${stripes}
      ${[0, 1, 2, 3].map((i) => `<circle cx="${24 + i * 2}" cy="${y0 - 14 - i * 12}" r="${o.small ? 10 : 8}" fill="${mane}"/>`).join('')}
      <path d="M34 ${y0 - 88} L36 ${y0 - 108} L48 ${y0 - 92}Z M54 ${y0 - 92} L64 ${y0 - 108} L66 ${y0 - 88}Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="50" cy="${y0 - 72}" r="24" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${o.stripes ? `<path d="M42 ${y0 - 94} l2 10 M50 ${y0 - 96} v10 M58 ${y0 - 94} l-2 10" stroke="${STRIPE}" stroke-width="3.5" stroke-linecap="round"/>` : ''}
      <circle cx="40" cy="${y0 - 96}" r="${o.small ? 11 : 8}" fill="${mane}"/><circle cx="52" cy="${y0 - 98}" r="${o.small ? 10 : 7}" fill="${mane}"/>
      <ellipse cx="62" cy="${y0 - 56}" rx="17" ry="13" fill="${o.stripes ? '#4a3a52' : sh(c, 0.3)}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="57" cy="${y0 - 58}" r="2.2" fill="${o.stripes ? '#fff' : sh(c, -0.5)}"/><circle cx="67" cy="${y0 - 58}" r="2.2" fill="${o.stripes ? '#fff' : sh(c, -0.5)}"/>
      ${eyes([[41, y0 - 76], [58, y0 - 77]], 5)}${cheek(36, y0 - 64)}${o.small ? `<path d="${A.heart(0.5)}" transform="translate(-8 ${y0 - 4})" fill="#fff" opacity=".8"/>` : ''}`;
  }
  // lion and tiger share a big-cat shape
  function bigCat(c, o) {
    const dk = sh(c, -0.3);
    const mane = o.mane ? `<g>${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${(27 + Math.cos(a) * 30).toFixed(1)}" cy="${(-66 + Math.sin(a) * 30).toFixed(1)}" r="15" fill="${o.mane}"/>`; }).join('')}</g>` : '';
    const stripes = o.stripes ? `<g stroke="${STRIPE}" stroke-width="4.5" stroke-linecap="round" fill="none">
        <path d="M-26 -52 q5 10 0 20 M-12 -56 q5 12 0 24 M2 -56 q5 10 0 20"/><path d="M18 -92 l2 9 M27 -93 v10 M36 -92 l-2 9 M2 -70 h8 M44 -70 h8"/></g>` : '';
    return `${shadow()}
      <path class="ptail" d="M-32 -30 C-62 -38 -60 -82 -40 -86" stroke="${c}" stroke-width="11" fill="none" stroke-linecap="round"/>
      ${o.mane ? `<circle cx="-40" cy="-88" r="9" fill="${o.mane}"/>` : `<path d="M-58 -60 h8 M-56 -74 h8" stroke="${STRIPE}" stroke-width="4" stroke-linecap="round"/>`}
      ${legs([-24, -8, 10, 24], c, 18)}
      <ellipse cx="-2" cy="-34" rx="38" ry="26" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="6" cy="-26" rx="18" ry="14" fill="${sh(c, 0.45)}"/>
      ${mane}
      <circle cx="9" cy="-88" r="10" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><circle cx="45" cy="-88" r="10" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="9" cy="-88" r="5" fill="#ffc2d6"/><circle cx="45" cy="-88" r="5" fill="#ffc2d6"/>
      <circle cx="27" cy="-66" r="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${stripes}
      <ellipse cx="27" cy="-54" rx="14" ry="10" fill="${sh(c, 0.55)}"/>
      ${eyes([[17, -70], [37, -70]], 5.2)}${cheek(10, -56)}${cheek(44, -56)}
      <path d="M22 -61 L32 -61 L27 -55Z" fill="${dk}"/>${mouth(27, -50, 4)}`;
  }

  // bug pets reuse the Bug Garden drawings, tinted with the chosen color
  const tint = (art, map) => Object.entries(map).reduce((s, [from, to]) => s.split(from).join(to), art);
  const bugPet = (id, c, map) => `${shadow(40)}<g transform="translate(0 -4)">${A.bug ? tint(A.bug(id, [3, 3]), map(c)) : ''}</g>`;
  const DRAW = {
    grasshopper: (c) => bugPet('grasshopper', c, (k) => ({ '#8fd88f': k, '#a6e0a0': sh(k, 0.3), '#5aa85a': sh(k, -0.3) })),
    butterfly: (c) => bugPet('butterfly', c, (k) => ({ '#ff9ec7': k, '#e0609a': sh(k, -0.25), '#c9a6ff': sh(k, 0.35), '#9a7fe0': sh(k, -0.25) })),
    ladybug: (c) => bugPet('ladybug', c, (k) => ({ '#ff4d5e': k, '#c9303f': sh(k, -0.25) })),
    panda: (c) => `${shadow(42)}
      ${legs([-18, 18], '#3a2a44', 14)}
      <ellipse cx="0" cy="-34" rx="36" ry="30" fill="${c}" stroke="${sh(c, -0.18)}" stroke-width="2.5"/>
      <path d="M-34 -44 q-12 10 -6 26 M34 -44 q12 10 6 26" stroke="#3a2a44" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="-26" cy="-104" r="13" fill="#3a2a44"/><circle cx="26" cy="-104" r="13" fill="#3a2a44"/>
      <circle cx="0" cy="-80" r="31" fill="${c}" stroke="${sh(c, -0.18)}" stroke-width="2.5"/>
      <ellipse cx="-13" cy="-84" rx="9" ry="11" fill="#3a2a44" transform="rotate(18 -13 -84)"/><ellipse cx="13" cy="-84" rx="9" ry="11" fill="#3a2a44" transform="rotate(-18 13 -84)"/>
      <g class="eyes"><circle cx="-12" cy="-85" r="3.6" fill="#fff"/><circle cx="12" cy="-85" r="3.6" fill="#fff"/></g>
      <path class="eyes-happy" d="M-17 -84 Q-12 -90 -7 -84 M7 -84 Q12 -90 17 -84" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${cheek(-24, -70)}${cheek(24, -70)}<ellipse cx="0" cy="-72" rx="5" ry="3.5" fill="#3a2a44"/>${mouth(0, -65, 4)}`,
    owl: (c) => `${shadow(36)}
      <path d="M-10 -2 l-4 6 M-10 -2 l4 6 M10 -2 l-4 6 M10 -2 l4 6" stroke="#ffad5a" stroke-width="4" stroke-linecap="round"/>
      <path d="M-30 -92 L-24 -112 L-12 -98Z M30 -92 L24 -112 L12 -98Z" fill="${sh(c, -0.15)}" stroke="${sh(c, -0.25)}" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-52" rx="38" ry="50" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="2.5"/>
      <ellipse cx="0" cy="-34" rx="22" ry="28" fill="${sh(c, 0.5)}"/><path d="M-10 -40 q5 5 10 0 q5 5 10 0 M-10 -26 q5 5 10 0 q5 5 10 0" stroke="${sh(c, 0.1)}" stroke-width="2" fill="none"/>
      <ellipse cx="-36" cy="-46" rx="9" ry="24" fill="${sh(c, -0.15)}" transform="rotate(12 -36 -46)"/><ellipse cx="36" cy="-46" rx="9" ry="24" fill="${sh(c, -0.15)}" transform="rotate(-12 36 -46)"/>
      <circle cx="-14" cy="-76" r="15" fill="#fff" stroke="${sh(c, -0.25)}" stroke-width="2"/><circle cx="14" cy="-76" r="15" fill="#fff" stroke="${sh(c, -0.25)}" stroke-width="2"/>
      ${eyes([[-14, -76], [14, -76]], 6.5)}<path d="M-5 -66 L5 -66 L0 -57Z" fill="#ffad5a" stroke="#e8893a" stroke-width="1.5" stroke-linejoin="round"/>`,
    fawn: (c) => `${shadow(40)}
      <circle cx="-36" cy="-52" r="7" fill="#fff"/>
      ${legs([-24, -10, 12, 26], c, 30)}
      <ellipse cx="0" cy="-48" rx="38" ry="22" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${[[-18, -54], [-4, -58], [10, -52], [-10, -44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".85"/>`).join('')}
      <path d="M18 -56 L26 -92 L46 -88 L40 -48Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="14" cy="-116" rx="9" ry="17" transform="rotate(-28 14 -116)" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><ellipse cx="58" cy="-116" rx="9" ry="17" transform="rotate(28 58 -116)" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="36" cy="-98" r="24" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><ellipse cx="38" cy="-88" rx="12" ry="9" fill="${sh(c, 0.55)}"/>
      ${eyes([[26, -102], [46, -102]], 5.2)}${cheek(20, -90)}${cheek(52, -90)}<ellipse cx="38" cy="-91" rx="4.5" ry="3.2" fill="#3a2a44"/>${mouth(38, -85, 3.5)}`,
    duckling: (c) => `${shadow(34)}
      <path d="M-8 -2 l-8 4 h14Z M10 -2 l-8 4 h14Z" fill="#ffad5a"/>
      <ellipse cx="-4" cy="-28" rx="34" ry="26" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><path d="M-36 -34 L-48 -44 L-38 -24Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M-18 -30 Q-4 -14 12 -30" stroke="${sh(c, -0.18)}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="18" cy="-66" r="24" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><path d="M14 -90 q4 -10 10 -6" stroke="${sh(c, -0.22)}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${eyes([[10, -70], [28, -70]], 4.6)}${cheek(6, -60)}<path d="M34 -64 Q50 -62 48 -56 Q40 -52 34 -56Z" fill="#ffad5a" stroke="#e8893a" stroke-width="1.5"/>`,
    lamb: (c) => `${shadow(42)}
      ${legs([-22, -8, 10, 24], '#5a4a5a', 18)}
      ${[[-30, -34], [-14, -50], [6, -52], [24, -40], [-22, -22], [0, -26], [20, -22], [-36, -16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${c}" stroke="${sh(c, -0.14)}" stroke-width="2"/>`).join('')}
      <ellipse cx="-2" cy="-34" rx="30" ry="20" fill="${c}"/>
      <ellipse cx="14" cy="-74" rx="9" ry="6" transform="rotate(-30 14 -74)" fill="#f6d0c0"/><ellipse cx="58" cy="-74" rx="9" ry="6" transform="rotate(30 58 -74)" fill="#f6d0c0"/>
      <ellipse cx="36" cy="-64" rx="20" ry="22" fill="#fbe4d8" stroke="#e8c4b4" stroke-width="2.5"/>
      ${[[24, -86], [36, -90], [48, -86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="${sh(c, -0.14)}" stroke-width="2"/>`).join('')}
      ${eyes([[28, -66], [44, -66]], 4.4)}${cheek(22, -56)}${cheek(50, -56)}<path d="M33 -57 L39 -57 L36 -53Z" fill="#ff8fb0"/>${mouth(36, -50, 3.5)}`,
    piglet: (c) => `${shadow(42)}
      <path class="ptail" d="M-38 -36 q-14 -4 -10 -14 q6 -8 12 0" stroke="${sh(c, -0.2)}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${legs([-22, -8, 10, 24], sh(c, -0.1), 14)}
      <ellipse cx="-2" cy="-32" rx="40" ry="26" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M10 -84 L8 -104 L26 -92Z M34 -92 L50 -104 L50 -84Z" fill="${sh(c, -0.1)}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="30" cy="-64" r="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${eyes([[20, -70], [40, -70]], 4.8)}${cheek(12, -58)}${cheek(48, -58)}
      <ellipse cx="30" cy="-56" rx="11" ry="8" fill="${sh(c, -0.12)}" stroke="${sh(c, -0.25)}" stroke-width="2"/><circle cx="26" cy="-56" r="2" fill="${sh(c, -0.4)}"/><circle cx="34" cy="-56" r="2" fill="${sh(c, -0.4)}"/>${mouth(30, -44, 4)}`,
    turtle: (c) => `${shadow(48)}
      <ellipse cx="-30" cy="-8" rx="12" ry="8" fill="#9fdc9a" stroke="#5aa85a" stroke-width="2.5"/><ellipse cx="22" cy="-8" rx="12" ry="8" fill="#9fdc9a" stroke="#5aa85a" stroke-width="2.5"/>
      <circle cx="48" cy="-36" r="19" fill="#9fdc9a" stroke="#5aa85a" stroke-width="2.5"/>
      <path d="M-48 -16 Q-48 -70 -4 -70 Q40 -70 40 -16Z" fill="${c}" stroke="${sh(c, -0.28)}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M-20 -18 L-26 -46 L-4 -60 L18 -46 L12 -18 M-26 -46 L-42 -34 M18 -46 L34 -34" stroke="${sh(c, -0.28)}" stroke-width="2.5" fill="none"/>
      ${eyes([[42, -40], [56, -40]], 4)}${cheek(58, -30)}${mouth(50, -30, 3.5)}`,
    axolotl: (c) => `${shadow(50)}
      <path class="ptail" d="M-40 -24 C-70 -26 -84 -14 -88 -2 C-70 -4 -56 -10 -40 -12Z" fill="${sh(c, 0.3)}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      <path d="M-24 -10 l-8 10 M-10 -10 l-4 10 M14 -10 l4 10 M26 -10 l8 10" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="-4" cy="-22" rx="42" ry="17" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      ${[-1, 1].map((s) => [0, 1, 2].map((k) => `<path d="M${30 + s * 26} ${-50 + k * 8} q${s * 16} ${-10 + k * 6} ${s * 26} ${-6 + k * 10}" stroke="${sh(c, -0.25)}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')).join('')}
      <ellipse cx="30" cy="-46" rx="32" ry="24" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      ${eyes([[18, -50], [42, -50]], 4.5)}${cheek(12, -40)}${cheek(48, -40)}<path d="M16 -36 Q30 -26 44 -36" stroke="#7a4a5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    redpanda: (c) => `${shadow()}
      <path class="ptail" d="M-32 -30 C-70 -30 -78 -70 -56 -84" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M-46 -38 l-10 8 M-60 -52 l-12 4 M-62 -70 l-12 -2" stroke="${sh(c, -0.3)}" stroke-width="6" stroke-linecap="round"/>
      ${legs([-24, -8, 10, 24], '#5a3a3a', 18)}
      <ellipse cx="-2" cy="-34" rx="38" ry="24" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="10" cy="-88" r="11" fill="${c}" stroke="#fff" stroke-width="4"/><circle cx="46" cy="-88" r="11" fill="${c}" stroke="#fff" stroke-width="4"/>
      <circle cx="28" cy="-66" r="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M8 -58 Q12 -76 20 -78 Q28 -60 28 -50 Q28 -60 36 -78 Q44 -76 48 -58 Q40 -44 28 -44 Q16 -44 8 -58Z" fill="#fff"/>
      ${eyes([[18, -68], [38, -68]], 4.8)}<ellipse cx="28" cy="-55" rx="5" ry="3.5" fill="#3a2a44"/>${mouth(28, -48, 4)}`,
    sloth: (c) => `${shadow(40)}
      <ellipse cx="0" cy="-36" rx="36" ry="34" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M-30 -30 q-14 10 -10 26 M30 -30 q14 10 10 26" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M-46 -4 l-4 8 M-40 -2 l-2 8 M46 -4 l4 8 M40 -2 l2 8" stroke="#f4ece2" stroke-width="3" stroke-linecap="round"/>
      <circle cx="0" cy="-82" r="28" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="0" cy="-80" rx="22" ry="17" fill="#f4e6d2"/>
      <ellipse cx="-10" cy="-82" rx="9" ry="6" fill="${sh(c, -0.35)}" transform="rotate(-15 -10 -82)"/><ellipse cx="10" cy="-82" rx="9" ry="6" fill="${sh(c, -0.35)}" transform="rotate(15 10 -82)"/>
      <g class="eyes"><circle cx="-9" cy="-82" r="3.5" fill="#fff"/><circle cx="11" cy="-82" r="3.5" fill="#fff"/></g>
      <path class="eyes-happy" d="M-13 -82 Q-9 -86 -5 -82 M7 -82 Q11 -86 15 -82" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="-74" rx="4" ry="3" fill="#3a2a44"/>${mouth(0, -68, 5)}`,
    hedgehog: (c) => `${shadow(42)}
      ${legs([-18, 18], '#d9b8a0', 12)}
      <path d="M-44 -18 ${Array.from({ length: 11 }, (_, i) => { const a = Math.PI + (i / 10) * Math.PI * 0.85, r1 = 46, r2 = 60; return `L${(Math.cos(a) * r2).toFixed(0)} ${(Math.sin(a) * r2 * 0.95 - 22).toFixed(0)} L${(Math.cos(a + 0.14) * r1).toFixed(0)} ${(Math.sin(a + 0.14) * r1 * 0.95 - 22).toFixed(0)}`; }).join(' ')} L30 -30Z" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="-4" cy="-24" rx="42" ry="24" fill="${c}"/>
      <path d="M14 -48 Q50 -50 58 -24 Q50 -10 18 -10Z" fill="#f4e0c8" stroke="#d9b8a0" stroke-width="2.5"/>
      <circle cx="58" cy="-24" r="5" fill="#3a2a44"/>${eyes([[36, -34]], 4.5)}${cheek(44, -20)}<circle cx="24" cy="-44" r="7" fill="#f4e0c8" stroke="#d9b8a0" stroke-width="2"/>`,
    koala: (c) => `${shadow(42)}
      ${legs([-18, 18], c, 14)}
      <ellipse cx="0" cy="-34" rx="34" ry="30" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><ellipse cx="0" cy="-28" rx="20" ry="18" fill="${sh(c, 0.5)}"/>
      <circle cx="-34" cy="-96" r="20" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><circle cx="34" cy="-96" r="20" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="-34" cy="-96" r="11" fill="#fff"/><circle cx="34" cy="-96" r="11" fill="#fff"/>
      <circle cx="0" cy="-80" r="30" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${eyes([[-12, -86], [12, -86]], 4.5)}${cheek(-20, -72)}${cheek(20, -72)}<ellipse cx="0" cy="-74" rx="8" ry="10" fill="#3a2a44"/>${mouth(0, -60, 4)}`,
    capybara: (c) => `${shadow(52)}
      ${legs([-30, -14, 14, 30], sh(c, -0.1), 16)}
      <ellipse cx="-6" cy="-36" rx="50" ry="28" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <rect x="18" y="-82" width="52" height="44" rx="20" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="28" cy="-84" rx="7" ry="6" fill="${sh(c, -0.25)}"/><ellipse cx="54" cy="-84" rx="7" ry="6" fill="${sh(c, -0.25)}"/>
      <path class="eyes" d="M28 -66 h8 M48 -66 h8" stroke="#3a2a44" stroke-width="3.5" stroke-linecap="round"/>
      <path class="eyes-happy" d="M28 -64 Q32 -70 36 -64 M48 -64 Q52 -70 56 -64" stroke="#3a2a44" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="66" cy="-56" rx="5" ry="4" fill="#3a2a44"/>${cheek(44, -50)}<g transform="translate(40 -90)"><circle r="9" fill="#ffd166"/><circle r="4" fill="#ff9a4d"/></g>`,
    flamingo: (c) => `${shadow(30)}
      <path d="M-4 0 V-50 M10 0 V-36 l-12 -10" stroke="${sh(c, -0.2)}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="-4" cy="-62" rx="34" ry="22" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><path d="M-30 -62 Q-48 -50 -40 -70Z" fill="${sh(c, -0.15)}"/>
      <path d="M18 -70 C34 -90 4 -104 18 -124" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="24" cy="-128" r="16" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M36 -132 Q52 -130 50 -112 Q46 -120 36 -122Z" fill="#fff" stroke="#3a2a44" stroke-width="2"/><path d="M50 -116 Q50 -110 46 -112" fill="#3a2a44"/>
      ${eyes([[26, -132]], 4)}`,
    horse: (c) => equine(c, {}),
    pony: (c) => equine(c, { small: true, mane: sh(c, -0.3) }),
    zebra: (c) => equine(c, { stripes: true, mane: STRIPE }),
    lion: (c) => bigCat(c, { mane: sh(c, -0.32) }),
    tiger: (c) => bigCat(c, { stripes: true }),
    cat: (c) => `${shadow()}
      <path class="ptail" d="M-32 -30 C-62 -38 -60 -82 -40 -86" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      ${legs([-24, -8, 10, 24], c)}
      <ellipse cx="-2" cy="-32" rx="36" ry="25" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="6" cy="-26" rx="18" ry="14" fill="${sh(c, 0.45)}"/>
      <path d="M6 -84 L8 -110 L27 -92Z M30 -92 L48 -108 L49 -82Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M11 -88 L12 -102 L22 -92Z M34 -92 L45 -101 L45 -86Z" fill="#ffc2d6"/>
      <circle cx="27" cy="-66" r="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${eyes([[17, -68], [37, -68]], 5.2)}${cheek(12, -56)}${cheek(43, -56)}
      <path d="M24 -59 L30 -59 L27 -55Z" fill="#ff8fb0"/>${mouth(27, -51, 4)}
      <path d="M6 -56 L-8 -58 M6 -52 L-8 -50 M48 -56 L62 -58 M48 -52 L62 -50" stroke="${sh(c, -0.35)}" stroke-width="1.6" stroke-linecap="round"/>`,
    dog: (c) => `${shadow()}
      <path class="ptail" d="M-34 -36 C-48 -46 -50 -64 -44 -70" stroke="${c}" stroke-width="11" fill="none" stroke-linecap="round"/>
      ${legs([-24, -8, 10, 24], c, 18)}
      <ellipse cx="-2" cy="-34" rx="38" ry="25" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="-12" cy="-40" rx="12" ry="9" fill="${sh(c, -0.18)}" opacity=".6"/>
      <circle cx="28" cy="-68" r="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="8" cy="-64" rx="10" ry="22" transform="rotate(16 8 -64)" fill="${sh(c, -0.25)}"/><ellipse cx="50" cy="-64" rx="10" ry="22" transform="rotate(-16 50 -64)" fill="${sh(c, -0.25)}"/>
      <ellipse cx="32" cy="-54" rx="15" ry="11" fill="${sh(c, 0.5)}"/>
      ${eyes([[19, -74], [39, -74]], 5.2)}${cheek(14, -58)}${cheek(46, -58)}
      <ellipse cx="33" cy="-60" rx="6" ry="4.5" fill="#3a2a44"/>${mouth(32, -50, 5)}
      <path d="M8 -44 Q28 -36 48 -44" stroke="#ff6b8f" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="28" cy="-38" r="4" fill="#ffd166"/>`,
    bunny: (c) => `${shadow(38)}
      <circle cx="-32" cy="-32" r="11" fill="#fff" stroke="#e8dcf0" stroke-width="2"/>
      <ellipse cx="-12" cy="-6" rx="14" ry="7" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2"/><ellipse cx="14" cy="-6" rx="14" ry="7" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2"/>
      <ellipse cx="-2" cy="-30" rx="32" ry="27" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      <ellipse cx="12" cy="-104" rx="9" ry="27" transform="rotate(-10 12 -104)" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/><ellipse cx="12" cy="-104" rx="4.5" ry="19" transform="rotate(-10 12 -104)" fill="#ffc2d6"/>
      <ellipse cx="34" cy="-102" rx="9" ry="27" transform="rotate(12 34 -102)" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/><ellipse cx="34" cy="-102" rx="4.5" ry="19" transform="rotate(12 34 -102)" fill="#ffc2d6"/>
      <circle cx="23" cy="-64" r="25" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="2.5"/>
      ${eyes([[14, -67], [33, -67]], 5)}${cheek(9, -56)}${cheek(38, -56)}
      <path d="M21 -58 L26 -58 L23.5 -54Z" fill="#ff8fb0"/>${mouth(23.5, -50, 4)}`,
    dragon: (c) => `${shadow(46)}
      <path class="ptail" d="M-28 -26 C-56 -22 -72 -14 -78 -4" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M-78 -4 L-92 -14 L-86 4Z" fill="${sh(c, -0.15)}"/>
      <path class="pwing" d="M-6 -54 C-30 -100 -66 -96 -58 -60 Q-44 -66 -34 -54 Q-22 -62 -6 -48Z" fill="${sh(c, 0.35)}" stroke="${sh(c, -0.2)}" stroke-width="2.5" stroke-linejoin="round"/>
      ${legs([-22, -6, 12, 26], c)}
      <ellipse cx="0" cy="-32" rx="36" ry="27" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="10" cy="-27" rx="19" ry="18" fill="#fff1b3"/><path d="M-2 -36 H22 M-4 -27 H24 M0 -18 H20" stroke="#f0d68a" stroke-width="2"/>
      ${[-26, -14, -2].map((x) => `<path d="M${x} -57 L${x + 5} -68 L${x + 10} -57Z" fill="${sh(c, 0.4)}"/>`).join('')}
      <path d="M14 -88 Q8 -104 14 -110 Q18 -98 22 -90Z M34 -90 Q36 -106 44 -108 Q42 -96 40 -88Z" fill="#fff4e0" stroke="#e6c89a" stroke-width="2"/>
      <circle cx="30" cy="-66" r="26" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="50" cy="-58" rx="15" ry="12" fill="${sh(c, 0.25)}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="56" cy="-62" r="2" fill="${sh(c, -0.45)}"/><circle cx="62" cy="-60" r="2" fill="${sh(c, -0.45)}"/>
      ${eyes([[22, -72], [40, -72]], 5.6)}${cheek(16, -58)}${mouth(48, -50, 5)}`,
    lizard: (c) => `${shadow(52)}
      <path class="ptail" d="M-40 -18 C-70 -22 -88 -6 -74 4 C-64 10 -58 0 -64 -4" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M-26 -12 L-36 0 M-12 -12 L-6 0 M14 -12 L6 0 M28 -12 L36 0" stroke="${sh(c, -0.12)}" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="-2" cy="-22" rx="44" ry="17" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${[[-22, -28], [-4, -32], [14, -27], [-12, -18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${sh(c, -0.18)}"/>`).join('')}
      <ellipse cx="46" cy="-30" rx="24" ry="16" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      ${eyes([[46, -40], [58, -38]], 5.6)}${cheek(60, -27)}${mouth(56, -24, 5)}`,
    hamster: (c) => `${shadow(38)}
      <ellipse cx="-14" cy="-4" rx="10" ry="6" fill="#ffc2d6"/><ellipse cx="14" cy="-4" rx="10" ry="6" fill="#ffc2d6"/>
      <circle cx="-20" cy="-64" r="10" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/><circle cx="20" cy="-64" r="10" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <circle cx="-20" cy="-64" r="5" fill="#ffc2d6"/><circle cx="20" cy="-64" r="5" fill="#ffc2d6"/>
      <ellipse cx="0" cy="-34" rx="38" ry="34" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="0" cy="-24" rx="24" ry="20" fill="${sh(c, 0.55)}"/>
      ${eyes([[-11, -44], [11, -44]], 5)}<ellipse cx="-22" cy="-32" rx="9" ry="7" fill="url(#gCheek)"/><ellipse cx="22" cy="-32" rx="9" ry="7" fill="url(#gCheek)"/>
      <ellipse cx="0" cy="-35" rx="4" ry="3" fill="#ff8fb0"/>${mouth(0, -29, 4)}
      <ellipse cx="-8" cy="-16" rx="5" ry="4" fill="#ffc2d6"/><ellipse cx="8" cy="-16" rx="5" ry="4" fill="#ffc2d6"/>`,
    fox: (c) => `${shadow()}
      <path class="ptail" d="M-30 -30 C-80 -38 -86 -92 -52 -88 C-62 -72 -50 -52 -30 -42Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M-52 -88 C-70 -88 -76 -76 -72 -70 C-64 -78 -58 -82 -52 -88Z" fill="#fff"/>
      ${legs([-22, -6, 12, 26], '#5a3d4a')}
      <ellipse cx="0" cy="-32" rx="36" ry="24" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <ellipse cx="20" cy="-36" rx="14" ry="16" fill="#fff"/>
      <path d="M8 -84 L10 -110 L28 -90Z M32 -90 L50 -108 L50 -82Z" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M9 -98 L10 -110 L18 -101Z M42 -100 L50 -108 L50 -96Z" fill="#5a3d4a"/>
      <circle cx="29" cy="-66" r="25" fill="${c}" stroke="${sh(c, -0.22)}" stroke-width="2.5"/>
      <path d="M12 -60 Q29 -40 46 -60 Q40 -50 29 -48 Q18 -50 12 -60Z" fill="#fff"/>
      ${eyes([[20, -70], [38, -70]], 5)}<ellipse cx="29" cy="-58" rx="5" ry="3.5" fill="#3a2a44"/>${mouth(29, -51, 4)}`,
    penguin: (c) => `${shadow(34)}
      <ellipse cx="-12" cy="-3" rx="12" ry="6" fill="#ffad5a"/><ellipse cx="12" cy="-3" rx="12" ry="6" fill="#ffad5a"/>
      <ellipse cx="-32" cy="-42" rx="9" ry="22" transform="rotate(18 -32 -42)" fill="${c}"/><ellipse cx="32" cy="-42" rx="9" ry="22" transform="rotate(-18 32 -42)" fill="${c}"/>
      <ellipse cx="0" cy="-48" rx="32" ry="46" fill="${c}" stroke="${sh(c, -0.25)}" stroke-width="2.5"/>
      <ellipse cx="0" cy="-40" rx="22" ry="34" fill="#fff"/>
      <ellipse cx="0" cy="-70" rx="22" ry="16" fill="#fff"/>
      ${eyes([[-9, -74], [9, -74]], 5)}${cheek(-15, -62)}${cheek(15, -62)}
      <path d="M-6 -66 L6 -66 L0 -58Z" fill="#ffad5a" stroke="#e8893a" stroke-width="1.5" stroke-linejoin="round"/>${mouth(0, -54, 4)}`,
  };

  const TYPES = {
    cat: { word: 'kitty', colors: ['#ffb36b', '#b9b4c9', '#fff4ec', '#6b5a70'], names: ['Whiskers', 'Mittens', 'Pumpkin'], food: 'fish', price: 0 },
    dog: { word: 'puppy', colors: ['#e2b07a', '#fff2e2', '#8a6448', '#f7d47a'], names: ['Buddy', 'Cookie', 'Daisy'], food: 'bone', price: 0 },
    bunny: { word: 'bunny', colors: ['#ffffff', '#f3d8c2', '#d9d1e6', '#c9a07a'], names: ['Hoppy', 'Clover', 'Snowball'], food: 'carrot', price: 0 },
    dragon: { word: 'dragon', colors: ['#8fd88f', '#c9a6ff', '#ff9ec7', '#7fc8f0'], names: ['Ember', 'Sparky', 'Ruby'], food: 'berry', price: 0 },
    lizard: { word: 'lizard', colors: ['#9ad86a', '#7fd8c8', '#ffcb6b', '#ff9e8a'], names: ['Ziggy', 'Leafy', 'Pickles'], food: 'bug', price: 0 },
    hamster: { word: 'hamster', colors: ['#f5c58f', '#ffffff', '#d9b8a0', '#c9c2b0'], names: ['Peanut', 'Nibbles', 'Button'], food: 'seed', price: 0 },
    fox: { word: 'fox', colors: ['#ff9f5a', '#f2e6dc', '#c8805a', '#ffd0a8'], names: ['Rusty', 'Ginger', 'Fluffy'], food: 'berry', price: 0 },
    pony: { word: 'pony', colors: ['#ffc2e0', '#c9b8ff', '#a8e6ff', '#fff3a8'], names: ['Bluebell', 'Sugar', 'Twinkle'], food: 'apple', price: 0 },
    horse: { word: 'horse', colors: ['#b07a50', '#f4ece2', '#5a4038', '#e2b07a'], names: ['Star', 'Thunder', 'Honey'], food: 'apple', price: 0 },
    zebra: { word: 'zebra', colors: ['#ffffff', '#ffeaf4', '#eaf2ff', '#fff6dc'], names: ['Ziggy', 'Stripes', 'Zara'], food: 'apple', price: 0 },
    lion: { word: 'lion', colors: ['#f3b85a', '#f7d58a', '#fff1d6', '#e9a24a'], names: ['Leo', 'Sunny', 'Goldie'], food: 'meat', price: 0 },
    tiger: { word: 'tiger', colors: ['#ff9a3d', '#ffffff', '#ffb36b', '#ffc9a8'], names: ['Tigger', 'Stripy', 'Mango'], food: 'meat', price: 0 },
    axolotl: { word: 'axolotl', colors: ['#ffb3d4', '#c9a6ff', '#fff2e2', '#9fd2ff'], names: ['Bubbles', 'Smiley', 'Coral'], food: 'worm', price: 0 },
    redpanda: { word: 'red panda', colors: ['#d9773e', '#c96a3a', '#e8955a', '#b85a32'], names: ['Maple', 'Rusty', 'Ginger'], food: 'bamboo', price: 0 },
    sloth: { word: 'sloth', colors: ['#b59a7e', '#c9b296', '#a08568', '#d0bfa8'], names: ['Sleepy', 'Mochi', 'Slowpoke'], food: 'leaf', price: 0 },
    hedgehog: { word: 'hedgehog', colors: ['#a07a5a', '#c99a72', '#7a5a48', '#e0c4a0'], names: ['Prickles', 'Spike', 'Hazel'], food: 'bug', price: 0 },
    koala: { word: 'koala', colors: ['#a8a8b8', '#c2c2cc', '#9090a2', '#d8d4dc'], names: ['Kiki', 'Gumnut', 'Cuddles'], food: 'leaf', price: 0 },
    capybara: { word: 'capybara', colors: ['#b8855a', '#a87650', '#c99a6a', '#9a6a48'], names: ['Chill', 'Pumpkin', 'Captain'], food: 'leaf', price: 0 },
    flamingo: { word: 'flamingo', colors: ['#ff9ec7', '#ff8fa8', '#ffb3d4', '#ff7fb2'], names: ['Rosie', 'Flora', 'Sunny'], food: 'shrimp', price: 0 },
    grasshopper: { word: 'grasshopper', colors: ['#8fd88f', '#c9e86a', '#7fd8c8', '#ffd98a'], names: ['Hoppy', 'Skippy', 'Jumper'], food: 'leaf', price: 0 },
    butterfly: { word: 'butterfly', colors: ['#ff9ec7', '#ffd166', '#9fd2ff', '#c9a6ff'], names: ['Flutter', 'Petal', 'Rainbow'], food: 'flower', price: 0 },
    ladybug: { word: 'ladybug', colors: ['#ff4d5e', '#ff9a4d', '#ffd34d', '#ff7fb2'], names: ['Dotty', 'Lulu', 'Polka'], food: 'leaf', price: 0 },
    panda: { word: 'panda', colors: ['#ffffff', '#fff2e2', '#ffe6f0', '#eaf2ff'], names: ['Bamboo', 'Oreo', 'Dumpling'], food: 'bamboo', price: 0 },
    owl: { word: 'owl', colors: ['#c9a07a', '#f4ece2', '#c9a6ff', '#9fb8d8'], names: ['Hoot', 'Luna', 'Feathers'], food: 'seed', price: 0 },
    fawn: { word: 'baby deer', colors: ['#d9a066', '#e8b98a', '#c98a5a', '#f2d0a8'], names: ['Bambi', 'Clover', 'Willow'], food: 'leaf', price: 0 },
    duckling: { word: 'duckling', colors: ['#ffe27f', '#fff4c2', '#ffd0a8', '#fbf6ff'], names: ['Quackers', 'Puddles', 'Sunny'], food: 'seed', price: 0 },
    lamb: { word: 'lamb', colors: ['#ffffff', '#fff2e2', '#ffe6f0', '#e6e0f0'], names: ['Woolly', 'Cotton', 'Daisy'], food: 'leaf', price: 0 },
    piglet: { word: 'piglet', colors: ['#ffc2d6', '#ffd6c2', '#f6b0c8', '#ffe0ea'], names: ['Truffle', 'Petunia', 'Oinky'], food: 'apple', price: 0 },
    turtle: { word: 'turtle', colors: ['#c9a07a', '#8fd88f', '#ff9ec7', '#9fd2ff'], names: ['Shelly', 'Pebble', 'Zoomer'], food: 'leaf', price: 0 },
    penguin: { word: 'penguin', colors: ['#3d4a7a', '#4a4a5a', '#5a7ac9', '#7a5aa8'], names: ['Pebbles', 'Waddles', 'Frosty'], food: 'fish', price: 0 },
  };
  A.PET_TYPES = TYPES;
  A.pet = (type, color) => `<g class="pet-art">${DRAW[type](color)}</g>`;
  I.paw = `<ellipse cx="0" cy="12" rx="18" ry="15" fill="#ff8fb8"/>${[[-20, -8], [-7, -20], [8, -20], [21, -8]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="10" fill="#ff8fb8"/>`).join('')}`;
  I.bowl = `<path d="M-30 -4 H30 Q28 22 0 24 Q-28 22 -30 -4Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3"/><ellipse cx="0" cy="-4" rx="30" ry="8" fill="#c9e9ff" stroke="#5aa7d8" stroke-width="3"/>
    <circle cx="-10" cy="-8" r="6" fill="#e9b17a"/><circle cx="4" cy="-10" r="6" fill="#d99a5a"/><circle cx="14" cy="-6" r="6" fill="#e9b17a"/><path d="${A.heart(0.6)}" transform="translate(0 12)" fill="#fff"/>`;
  I.leash = `<path d="M-24 22 Q-30 -10 0 -18 Q30 -10 24 22" stroke="#ff7fb2" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="0" cy="-20" r="8" fill="#ffd166" stroke="#e6a52e" stroke-width="2"/>${A.sparkle4(22, -26, 7, '#ffd166')}`;

  /* ---------- saved pets ---------- */
  const P = (K.pets = { TYPES });
  const list = () => { const S = K.save.data; if (!Array.isArray(S.pets)) S.pets = []; return S.pets; };
  P.list = list;
  P.get = (id) => list().find((p) => p.id === id);
  P.active = () => P.get(K.save.data.petActive) || null;
  P.price = () => (list().length === 0 ? 0 : 10);
  P.max = Infinity; // no limit: she can adopt as many pets as she likes
  P.add = (type, color, name) => {
    const p = { id: 'p' + Date.now().toString(36), type, color, name, hunger: 70, fun: 70, love: 70 };
    list().push(p);
    if (!K.save.data.petActive) K.save.data.petActive = p.id;
    K.save.write();
    return p;
  };
  P.SUPPLY = { food: { key: 'petFood', pack: 5, price: 5, start: 5, word: 'pet food' }, toys: { key: 'petToys', pack: 3, price: 4, start: 3, word: 'toys' } };
  P.mood = (p) => { const lo = Math.min(p.hunger, p.fun, p.love); return lo >= 50 ? 'happy' : lo >= 25 ? 'ok' : 'sad'; };
  // pets get a little hungry/bored/lonely while she plays (never below 10)
  let saveT = 0;
  K.every((dt) => {
    if (!K.curName || document.hidden || !list().length) return;
    list().forEach((p) => {
      p.hunger = Math.max(10, p.hunger - (100 / (9 * 60)) * dt);
      p.fun = Math.max(10, p.fun - (100 / (8 * 60)) * dt);
      p.love = Math.max(10, p.love - (100 / (12 * 60)) * dt);
    });
    saveT += dt; if (saveT > 6) { saveT = 0; K.save.write(); }
  }, true);
})();
