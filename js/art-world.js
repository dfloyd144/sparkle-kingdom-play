/* Art: scenery pieces for the kingdom and shared backgrounds */
(function () {
  const A = K.art, sh = K.shade;

  A.skyRect = (fill = "url(#gSky)") => `<rect x="-900" y="-1500" width="3000" height="810" fill="${fill === "url(#gSky)" ? "#b9e0ff" : /Night/i.test(fill) ? "#2d2466" : fill}"/><rect x="-900" y="-700" width="3000" height="1500" fill="${fill}"/>`;
  A.groundRect = (y, fill = "url(#gGrass)") => `<rect x="-900" y="${y + 990}" width="3000" height="1200" fill="${fill === "url(#gGrass)" ? "#93d9a9" : fill}"/><rect x="-900" y="${y}" width="3000" height="1000" fill="${fill}"/>`;

  A.sun = () => `<g class="sun"><circle r="92" fill="url(#gWarm)"/><circle r="52" fill="url(#gSun)" stroke="#ffd166" stroke-width="3"/>
    <circle cx="-17" cy="-6" r="5" fill="#b07a3a"/><circle cx="17" cy="-6" r="5" fill="#b07a3a"/>
    <path d="M-14 12 Q0 24 14 12" stroke="#b07a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="-30" cy="8" rx="8" ry="5" fill="#ffa3a3" opacity=".6"/><ellipse cx="30" cy="8" rx="8" ry="5" fill="#ffa3a3" opacity=".6"/></g>`;

  A.hills = (y = 430) => `
    <path d="M-900 ${y} Q-200 ${y - 140} 250 ${y - 40} Q520 ${y - 150} 820 ${y - 60} Q1100 ${y - 160} 2100 ${y - 20} V${y + 200} H-900Z" fill="url(#gHill2)"/>
    <path d="M-900 ${y + 10} Q100 ${y - 90} 420 ${y - 10} Q700 ${y - 90} 1000 ${y - 20} Q1300 ${y - 80} 2100 ${y} V${y + 200} H-900Z" fill="url(#gHill1)"/>`;

  A.tree = (kind = 0, s = 1) => {
    const canopy = kind === 1 ? ['#ffd1e6', '#ffbfdc', '#ffe3f0'] : ['#b7e8b0', '#9ddca0', '#cdf2c4'];
    const fruit = kind === 1 ? '#fff' : '#ff8a9e';
    return `<g transform="scale(${s})">
      <ellipse cx="0" cy="0" rx="60" ry="12" fill="#5a3d7a" opacity=".12"/>
      <path d="M-12 0 Q-8 -50 -14 -90 L14 -90 Q8 -50 12 0Z" fill="url(#gWood)"/>
      <circle cx="-42" cy="-112" r="42" fill="${canopy[1]}"/><circle cx="40" cy="-114" r="44" fill="${canopy[1]}"/>
      <circle cx="0" cy="-150" r="56" fill="${canopy[0]}"/><circle cx="-24" cy="-120" r="40" fill="${canopy[0]}"/><circle cx="26" cy="-124" r="40" fill="${canopy[0]}"/>
      <circle cx="-14" cy="-168" r="20" fill="${canopy[2]}"/>
      ${[[-40, -116], [28, -150], [44, -104], [-12, -132], [8, -96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${fruit}"/>`).join('')}</g>`;
  };

  A.bush = (c = '#a9e3ad', s = 1) => `<g transform="scale(${s})"><circle cx="-26" cy="-18" r="24" fill="${c}"/><circle cx="24" cy="-18" r="24" fill="${c}"/><circle cx="0" cy="-30" r="30" fill="${sh(c, 0.15)}"/>
    <circle cx="-14" cy="-36" r="5" fill="#ff9ec7"/><circle cx="18" cy="-26" r="5" fill="#fff08a"/><circle cx="-30" cy="-16" r="5" fill="#c9a6ff"/></g>`;

  A.fence = (x1, x2, y, c = '#fff') => {
    let s = `<rect x="${x1}" y="${y - 40}" width="${x2 - x1}" height="9" rx="4" fill="${c}" stroke="#e8d8f0" stroke-width="2"/><rect x="${x1}" y="${y - 20}" width="${x2 - x1}" height="9" rx="4" fill="${c}" stroke="#e8d8f0" stroke-width="2"/>`;
    for (let x = x1 + 6; x < x2; x += 30) s += `<path d="M${x} ${y} V${y - 52} L${x + 8} ${y - 62} L${x + 16} ${y - 52} V${y}Z" fill="${c}" stroke="#e8d8f0" stroke-width="2"/>`;
    return s;
  };

  A.castle = () => {
    let cren = '';
    for (let x = 470; x <= 716; x += 27.3) cren += `<rect x="${x.toFixed(1)}" y="246" width="18" height="20" rx="4" fill="#ffe0ee" stroke="#eaa3c6" stroke-width="2.5"/>`;
    const win = (x, y, w = 28, h = 40) => `<path d="M${x - w / 2} ${y + h / 2} V${y - h / 2 + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y - h / 2 + w / 2} V${y + h / 2}Z" fill="#fff4b8" stroke="#eaa3c6" stroke-width="3"/>
      <path d="M${x} ${y - h / 2 + 3} V${y + h / 2} M${x - w / 2} ${y + 4} H${x + w / 2}" stroke="#ffd98a" stroke-width="2"/>`;
    const roof = (x, top, w, base) => `<path d="M${x - w} ${base} L${x} ${top} L${x + w} ${base}Z" fill="url(#gRoof)" stroke="#9a7fe0" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${x - w + 6} ${base - 4}${A.scallop(x - w + 6, x + w - 6, base - 4, 5, 10)}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
      <rect x="${x - w}" y="${base - 2}" width="${w * 2}" height="8" rx="4" fill="url(#gGold)"/>
      <line x1="${x}" y1="${top}" x2="${x}" y2="${top - 34}" stroke="#c99a62" stroke-width="3"/>
      <path class="flag" d="M${x} ${top - 34} L${x + 34} ${top - 26} L${x} ${top - 16}Z" fill="#ff8fb8"/>`;
    return `<g class="castle">
      <ellipse cx="600" cy="458" rx="250" ry="22" fill="#7a5a9a" opacity=".12"/>
      <rect x="552" y="150" width="96" height="140" fill="url(#gWall2)" stroke="#eaa3c6" stroke-width="3"/>
      ${roof(600, 40, 60, 156)}
      ${win(600, 210, 30, 46)}
      <rect x="470" y="262" width="260" height="193" fill="url(#gWall)" stroke="#eaa3c6" stroke-width="3"/>
      ${cren}
      <rect x="400" y="196" width="86" height="259" fill="url(#gWall2)" stroke="#eaa3c6" stroke-width="3"/>
      ${roof(443, 92, 56, 200)}
      <rect x="714" y="196" width="86" height="259" fill="url(#gWall2)" stroke="#eaa3c6" stroke-width="3"/>
      ${roof(757, 92, 56, 200)}
      <g class="heart-window"><path d="${A.heart(1.7)}" transform="translate(443 262)" fill="#fff4b8" stroke="#eaa3c6" stroke-width="3"/></g>
      ${win(757, 260, 30, 44)}
      ${win(443, 360, 26, 40)}${win(757, 360, 26, 40)}
      ${win(522, 320)}${win(678, 320)}
      <path d="M552 455 V392 A48 48 0 0 1 648 392 V455Z" fill="#f7b9d6" stroke="#eaa3c6" stroke-width="3"/>
      <path d="M564 455 V396 A36 36 0 0 1 636 396 V455Z" fill="#c08ad8" stroke="#9a6bc0" stroke-width="3"/>
      <path d="M600 362 V455 M572 400 H628 M572 428 H628" stroke="#a274c4" stroke-width="2.5"/>
      <circle cx="590" cy="418" r="4" fill="#ffd166"/><circle cx="610" cy="418" r="4" fill="#ffd166"/>
      <path d="${A.heart(1)}" transform="translate(600 345)" fill="#ff8fb8"/>
      <rect x="540" y="452" width="120" height="10" rx="5" fill="#fff0f7" stroke="#eaa3c6" stroke-width="2"/>
      <rect x="528" y="460" width="144" height="10" rx="5" fill="#fff0f7" stroke="#eaa3c6" stroke-width="2"/>
      <path d="M404 455 C420 420 396 390 414 352 C428 322 404 300 420 270" stroke="#8fd88f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M796 455 C780 420 804 390 786 352 C772 322 796 300 780 270" stroke="#8fd88f" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${[[414, 352], [420, 270], [408, 410], [786, 352], [780, 270], [792, 410]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${A.flowerHead(['#ff9ec7', '#fff08a', '#c9a6ff'][i % 3], 7, false)}</g>`).join('')}
      <path d="M470 280 Q600 300 730 280" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/>
      ${[500, 545, 655, 700].map((x, i) => `<path d="M${x} 284 l-9 0 0 22 9 -7 9 7 0 -22Z" fill="${['#ff9ec7', '#c9a6ff', '#c9a6ff', '#ff9ec7'][i]}"/>`).join('')}
    </g>`;
  };

  A.bakery = () => `<g>
    <ellipse cx="0" cy="4" rx="100" ry="14" fill="#5a3d7a" opacity=".12"/>
    <rect x="34" y="-176" width="26" height="60" rx="4" fill="#f7c9a8" stroke="#e0a07a" stroke-width="3"/>
    <g class="float"><circle cx="50" cy="-196" r="12" fill="#fff" opacity=".8"/><circle cx="62" cy="-214" r="9" fill="#fff" opacity=".6"/></g>
    <path d="M-80 0 V-92 H80 V0Z" fill="#fff4e0" stroke="#e6b98a" stroke-width="3"/>
    <path d="M-102 -86 Q0 -196 102 -86 Q92 -70 80 -84 Q70 -64 56 -82 Q44 -62 30 -80 Q16 -60 0 -78 Q-16 -60 -30 -80 Q-44 -62 -56 -82 Q-70 -64 -80 -84 Q-92 -70 -102 -86Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3" stroke-linejoin="round"/>
    ${[[-50, -110, '#9fd2ff', 20], [-20, -130, '#fff08a', -30], [16, -124, '#a6eec0', 40], [48, -106, '#c9a6ff', -10], [-68, -94, '#fff08a', 60], [0, -100, '#9fd2ff', 70], [70, -92, '#ff7fb2', 20]].map(([x, y, c, r]) => `<rect x="${x}" y="${y}" width="12" height="5" rx="2.5" fill="${c}" transform="rotate(${r} ${x + 6} ${y + 2})"/>`).join('')}
    <circle cx="0" cy="-152" r="15" fill="#ff6b8a" stroke="#e04870" stroke-width="2.5"/><path d="M0 -166 Q4 -182 14 -186" stroke="#5fb86f" stroke-width="3" fill="none"/><circle cx="-5" cy="-157" r="4" fill="#fff" opacity=".7"/>
    <path d="M-20 0 V-40 A20 20 0 0 1 20 -40 V0Z" fill="#a6eec0" stroke="#5fc48a" stroke-width="3"/><circle cx="12" cy="-22" r="3" fill="#fff"/>
    <circle cx="-50" cy="-46" r="18" fill="#fff4b8" stroke="#e6b98a" stroke-width="3"/><path d="M-50 -64 V-28 M-68 -46 H-32" stroke="#e6b98a" stroke-width="2"/>
    <circle cx="50" cy="-46" r="18" fill="#fff4b8" stroke="#e6b98a" stroke-width="3"/><path d="M50 -64 V-28 M32 -46 H68" stroke="#e6b98a" stroke-width="2"/>
    <path d="M-80 -6 H80" stroke="#ffd1e8" stroke-width="8"/>
  </g>`;

  A.gazebo = () => `<g>
    <ellipse cx="0" cy="0" rx="118" ry="24" fill="#fff4fa" stroke="#eac6dc" stroke-width="3"/>
    ${[-92, -32, 32, 92].map((x) => `<rect x="${x - 8}" y="-152" width="16" height="152" rx="6" fill="#fff" stroke="#eac6dc" stroke-width="2.5"/>`).join('')}
    <ellipse cx="0" cy="-40" rx="38" ry="10" fill="#fff" stroke="#e48ab4" stroke-width="2"/><rect x="-4" y="-40" width="8" height="38" fill="#fff" stroke="#e48ab4" stroke-width="2"/>
    <path d="M-10 -58 h14 q0 12 -7 12 q-7 0 -7 -12Z" fill="#ffd1e8" stroke="#e48ab4" stroke-width="1.5"/>
    <path d="M-126 -150 Q0 -268 126 -150${A.scallop(126, -126, -150, 7, 16)}Z" fill="#ffc2dc" stroke="#e57aa8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-90 -170 Q0 -240 90 -170" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>
    <path d="${A.heart(1.2)}" transform="translate(0 -226)" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2"/>
    ${[-100, -60, -20, 20, 60, 100].map((x, i) => `<g transform="translate(${x} -146)">${A.flowerHead(['#fff08a', '#c9a6ff', '#9fd2ff'][i % 3], 7, false)}</g>`).join('')}
  </g>`;

  A.pond = (rx, ry) => `<g>
    <ellipse cx="0" cy="6" rx="${rx + 14}" ry="${ry + 10}" fill="#e2d6c8"/>
    ${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<ellipse cx="${(Math.cos(a) * (rx + 8)).toFixed(0)}" cy="${(Math.sin(a) * (ry + 6) + 4).toFixed(0)}" rx="14" ry="8" fill="${i % 2 ? '#f3ece4' : '#e8dccd'}"/>`; }).join('')}
    <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="url(#gWater)"/>
    <ellipse class="shimmer" cx="${-rx * 0.3}" cy="${-ry * 0.3}" rx="${rx * 0.35}" ry="4" fill="#fff"/>
    <ellipse class="shimmer" style="animation-delay:-1.5s" cx="${rx * 0.3}" cy="${ry * 0.2}" rx="${rx * 0.25}" ry="3" fill="#fff"/>
    <g transform="translate(${rx * 0.45} ${-ry * 0.15})"><ellipse rx="20" ry="9" fill="#8fd88f"/><g transform="translate(4 -6)">${A.flowerHead('#ffc2dc', 7, false)}</g></g>
    <g transform="translate(${-rx * 0.5} ${ry * 0.3})"><ellipse rx="16" ry="7" fill="#8fd88f"/></g>
    ${A.sparkle4(-rx * 0.1, -ry * 0.1, 7)}${A.sparkle4(rx * 0.2, ry * 0.4, 5)}
  </g>`;

  A.butterfly = (c) => `<g class="flutter"><ellipse cx="-9" cy="-4" rx="10" ry="12" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="1.5"/><ellipse cx="9" cy="-4" rx="10" ry="12" fill="${c}" stroke="${sh(c, -0.2)}" stroke-width="1.5"/>
    <ellipse cx="-7" cy="9" rx="7" ry="8" fill="${sh(c, 0.3)}"/><ellipse cx="7" cy="9" rx="7" ry="8" fill="${sh(c, 0.3)}"/></g><rect x="-2" y="-10" width="4" height="22" rx="2" fill="#6d4a92"/>`;

  /** Rounded pill label behind a word */
  A.label = (text, size = 24) => {
    const w = text.length * size * 0.62 + 24;
    return `<rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.35}" rx="${size * 0.67}" fill="#fff" opacity=".92"/>
      <text text-anchor="middle" y="${size * 0.22}" font-size="${size}" fill="#6d4a92">${text}</text>`;
  };
})();
