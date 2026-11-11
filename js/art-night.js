/* Art: bedtime — routine icons, the King, the cozy princess bed */
(function () {
  const A = K.art, I = A.icons;

  I.pajamas = `<path d="M-10 -30 Q0 -34 10 -30 L12 -16 Q24 6 28 30 Q0 38 -28 30 Q-24 6 -12 -16Z" fill="#b9d8ff" stroke="#7fa8e0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-10 -30 L-20 -22 L-14 -12 M10 -30 L20 -22 L14 -12" fill="#b9d8ff" stroke="#7fa8e0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M2 -8 A6 6 0 1 0 5 2 A5 5 0 1 1 2 -8Z" fill="#fff6c2"/>${A.sparkle4(-10, 10, 5)}${A.sparkle4(12, 16, 4)}
    <path d="M-27 28 Q0 36 27 28" stroke="#fff" stroke-width="4" fill="none"/>`;
  I.toothbrush = `<g transform="rotate(-35)"><rect x="-6" y="-8" width="12" height="46" rx="6" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3"/>
    <rect x="-10" y="-34" width="20" height="28" rx="6" fill="#fff" stroke="#5aa7d8" stroke-width="3"/>
    ${[-6, 0, 6].map((x) => `<path d="M${x} -34 V-44" stroke="#a6eec0" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
    <circle cx="20" cy="-22" r="7" fill="#fff" stroke="#9fd2ff" stroke-width="2"/><circle cx="28" cy="-8" r="5" fill="#fff" stroke="#9fd2ff" stroke-width="2"/>`;
  I.moon = `<path d="M8 -32 A32 32 0 1 0 30 18 A26 26 0 1 1 8 -32Z" fill="#fff4b8" stroke="#e6c34a" stroke-width="3"/>
    <circle cx="-8" cy="2" r="3" fill="#b08a3a"/><path d="M-14 12 Q-8 16 -2 12" stroke="#b08a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${A.sparkle4(24, -24, 8, '#fff08a')}${A.sparkle4(30, 2, 5, '#fff')}`;
  I.sunUp = `<g transform="scale(.48)">${A.sun()}</g>`;
  I.hug = `<path d="${A.heart(2.2)}" transform="translate(-8 8)" fill="#ff8fb8" stroke="#e05c90" stroke-width="3"/><path d="${A.heart(1.4)}" transform="translate(16 -4)" fill="#ffc2dc" stroke="#e05c90" stroke-width="3"/>`;
  I.thumbsUp = `<path d="M-20 -2 H-8 V30 H-20Z" fill="#ffd9c0" stroke="#d89a78" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-8 -2 L6 -30 Q14 -34 14 -24 L10 -8 H26 Q34 -6 32 4 L28 24 Q26 30 18 30 H-8Z" fill="#ffd9c0" stroke="#d89a78" stroke-width="3" stroke-linejoin="round"/>`;
  I.chart = `<rect x="-30" y="-30" width="60" height="62" rx="8" fill="#fff" stroke="#9a7fe0" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${-15 + (i % 3) * 15}" cy="${-10 + Math.floor(i / 3) * 22}" r="6" fill="${i < 4 ? '#ffd166' : '#ece3f8'}"/>`).join('')}
    <path d="M-10 -40 A12 12 0 1 0 2 -26 A9 9 0 1 1 -10 -40Z" fill="#fff4b8" stroke="#e6c34a" stroke-width="2"/>`;

  /** The King: a young, clean-shaven dad (feet at 0,0) */
  A.king = () => `
    <ellipse cx="0" cy="0" rx="62" ry="11" fill="#5a3d7a" opacity=".16"/>
    <path d="M-34 -124 Q-62 -60 -58 -4 Q0 6 58 -4 Q62 -60 34 -124Z" fill="#7a5fc0"/>
    <rect x="-24" y="-44" width="20" height="40" rx="6" fill="#3d3f6e"/><rect x="4" y="-44" width="20" height="40" rx="6" fill="#3d3f6e"/>
    <ellipse cx="-14" cy="-3" rx="15" ry="7" fill="#4a3a5a"/><ellipse cx="14" cy="-3" rx="15" ry="7" fill="#4a3a5a"/>
    <path d="M-30 -124 Q0 -132 30 -124 L34 -40 Q0 -32 -34 -40Z" fill="#4f63c9" stroke="#3e50ad" stroke-width="2.5"/>
    <path d="M-30 -122 L28 -46" stroke="#ff7fa8" stroke-width="12" stroke-linecap="round"/>
    <path d="M-34 -42 Q0 -34 34 -42" stroke="url(#gGold)" stroke-width="6" fill="none"/>
    ${[-102, -86, -70].map((y) => `<circle cx="10" cy="${y}" r="3.2" fill="#ffd166"/>`).join('')}
    <path d="M-30 -118 Q-46 -96 -46 -70 M30 -118 Q46 -96 46 -70" stroke="#4f63c9" stroke-width="17" fill="none" stroke-linecap="round"/>
    <circle cx="-46" cy="-64" r="9" fill="#f2c9a8"/><circle cx="46" cy="-64" r="9" fill="#f2c9a8"/>
    <path d="M-30 -124 L-20 -110 L-34 -104Z M30 -124 L20 -110 L34 -104Z" fill="url(#gGold)"/>
    <rect x="-9" y="-140" width="18" height="20" rx="6" fill="#e0b392"/>
    <path d="M-12 -126 L0 -116 L12 -126" stroke="#fff" stroke-width="4" fill="none"/>
    <circle cx="-46" cy="-168" r="9" fill="#f2c9a8"/><circle cx="46" cy="-168" r="9" fill="#f2c9a8"/>
    <path d="M-46 -176 C-48 -226 48 -226 46 -176 C46 -140 30 -122 0 -120 C-30 -122 -46 -140 -46 -176Z" fill="#f2c9a8"/>
    <path d="M-48 -176 C-54 -232 50 -238 50 -176 C46 -194 40 -202 30 -204 C12 -216 -16 -212 -34 -200 C-42 -194 -46 -186 -48 -176Z" fill="#6b4a2f"/>
    <path d="M-30 -204 C-6 -232 30 -228 46 -206 C26 -216 2 -214 -30 -204Z" fill="#8a6342"/>
    <g class="eyes"><ellipse cx="-17" cy="-166" rx="6.5" ry="8" fill="#3a2a44"/><ellipse cx="17" cy="-166" rx="6.5" ry="8" fill="#3a2a44"/>
      <circle cx="-15" cy="-169" r="2.6" fill="#fff"/><circle cx="19" cy="-169" r="2.6" fill="#fff"/></g>
    <path class="eyes-happy" d="M-25 -164 Q-17 -173 -9 -164 M9 -164 Q17 -173 25 -164" stroke="#3a2a44" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-27 -183 Q-17 -188 -7 -184 M7 -184 Q17 -188 27 -183" stroke="#5a3d28" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M-2 -158 Q2 -150 -2 -146" stroke="#d8a888" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="mouth" d="M-12 -138 Q0 -128 12 -138" stroke="#a0505a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path class="mouth-open" d="M-12 -139 Q0 -124 12 -139Z" fill="#c8506a"/>
    <ellipse cx="-30" cy="-148" rx="8" ry="5" fill="url(#gCheek)" opacity=".6"/><ellipse cx="30" cy="-148" rx="8" ry="5" fill="url(#gCheek)" opacity=".6"/>
    <g transform="rotate(-6 0 -226)"><path d="M-28 -214 L-31 -246 L-14 -228 L0 -252 L14 -228 L31 -246 L28 -214 Q0 -208 -28 -214Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="0" cy="-226" r="5.5" fill="#4f9cf0" stroke="#fff" stroke-width="1.5"/></g>`;
  A.QUEEN_LOOK = { skin: '#f8dcc8', hair: 0, style: 0, dress: 0, color: 1, crown: 0 };
  /** The Queen: blonde, glamorous mom — princess art plus lashes, lipstick, earrings and pearls */
  A.queen = () => A.princess(A.QUEEN_LOOK)
    .replace(/stroke="#c0566e" stroke-width="3"/g, 'stroke="#e0457a" stroke-width="3.6"')
    .replace('<g class="eyes">', '<ellipse cx="-19" cy="-168" rx="11" ry="5" fill="#c9a6ff" opacity=".45"/><ellipse cx="19" cy="-168" rx="11" ry="5" fill="#c9a6ff" opacity=".45"/><g class="eyes">')
    + '<path d="M-28 -164 l-8 -6 M-28.5 -159 l-9 -2 M28 -164 l8 -6 M28.5 -159 l9 -2" stroke="#4a2c5a" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path d="M-15 -118 Q0 -104 15 -118" stroke="#fff" stroke-width="3" fill="none"/>' + [-12, -6, 0, 6, 12].map((x) => `<circle cx="${x}" cy="${-111 + Math.abs(x) * -0.5 + 4}" r="2.6" fill="#fff" stroke="#e8dcf0"/>`).join('')
    + '<circle cx="-47" cy="-142" r="4.5" fill="#fff" stroke="#e8dcf0"/><circle cx="47" cy="-142" r="4.5" fill="#fff" stroke="#e8dcf0"/>';

  /** The princess bed seen from the side, bottom at y=0, head end on the left */
  A.bigBedBack = (c = '#ffc2dc') => `
    <ellipse cx="0" cy="6" rx="270" ry="18" fill="#5a3d7a" opacity=".12"/>
    <path d="M-250 0 V-300 Q-220 -340 -190 -300 V0Z" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>
    <path d="M-236 -60 V-280 Q-220 -306 -204 -280 V-60Z" fill="${c}"/>
    <path d="${A.heart(1.6)}" transform="translate(-220 -230)" fill="#fff"/>
    <rect x="-200" y="-110" width="430" height="56" rx="20" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>
    <rect x="-200" y="-60" width="430" height="40" rx="10" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
    <rect x="-200" y="-24" width="16" height="24" fill="#c9a6ff"/><rect x="214" y="-24" width="16" height="24" fill="#c9a6ff"/>
    <ellipse cx="-140" cy="-118" rx="62" ry="26" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>`;
  A.bigBedFront = (c = '#ffa6c9') => `
    <path d="M-98 -150 C-84 -224 60 -226 120 -198 Q190 -170 232 -152 L232 -50 Q60 -40 -98 -50Z" fill="${c}" stroke="${K.shade(c, -0.2)}" stroke-width="4"/>
    <path d="M-98 -150 C-84 -224 60 -226 120 -198 Q190 -170 232 -152" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
    ${[-40, 30, 100, 170].map((x, i) => (i % 2 ? `<path d="${A.star(10)}" transform="translate(${x} -92)" fill="#fff" opacity=".85"/>` : `<path d="${A.heart(0.8)}" transform="translate(${x} -88)" fill="#fff" opacity=".85"/>`)).join('')}
    <path d="M230 0 V-190 Q250 -216 270 -190 V0Z" fill="#fff" stroke="#e5c7dc" stroke-width="4"/>
    <path d="${A.heart(1.1)}" transform="translate(250 -150)" fill="${c}"/>`;
})();
