/* Art: shared gradients, basic shapes, and picture icons. All artwork is original SVG drawn in code. */
(function () {
  const A = (K.art = {});
  const sh = K.shade;

  A.defs = `
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b9e0ff"/><stop offset=".5" stop-color="#ffd8ec"/><stop offset="1" stop-color="#ffefdc"/></linearGradient>
  <linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2d2466"/><stop offset=".6" stop-color="#6a4fae"/><stop offset="1" stop-color="#d79bd8"/></linearGradient>
  <linearGradient id="gGrass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c6f0c4"/><stop offset="1" stop-color="#93d9a9"/></linearGradient>
  <linearGradient id="gHill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9f5d3"/><stop offset="1" stop-color="#b3e6c2"/></linearGradient>
  <linearGradient id="gHill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7dcff"/><stop offset="1" stop-color="#cbe9e6"/></linearGradient>
  <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0f7"/><stop offset="1" stop-color="#ffc9e0"/></linearGradient>
  <linearGradient id="gWall2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd2e6"/><stop offset=".5" stop-color="#fff0f7"/><stop offset="1" stop-color="#ffc2dc"/></linearGradient>
  <linearGradient id="gRoof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bba2f7"/><stop offset=".45" stop-color="#e2d6ff"/><stop offset="1" stop-color="#9f86ea"/></linearGradient>
  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b3"/><stop offset="1" stop-color="#ffc54d"/></linearGradient>
  <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4f0ff"/><stop offset="1" stop-color="#80c6ef"/></linearGradient>
  <linearGradient id="gPearl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#efe6ff"/></linearGradient>
  <linearGradient id="gPath" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2df"/><stop offset="1" stop-color="#ffe2c4"/></linearGradient>
  <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b98f"/><stop offset="1" stop-color="#c98d66"/></linearGradient>
  <radialGradient id="gBtn" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffd3ea"/></radialGradient>
  <radialGradient id="gBtnGold" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="#ffe08a"/></radialGradient>
  <radialGradient id="gBtnMint" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#bff0dc"/></radialGradient>
  <radialGradient id="gBtnLilac" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ddcdff"/></radialGradient>
  <radialGradient id="gGlow"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="gWarm"><stop offset="0" stop-color="#fff6c2" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <radialGradient id="gSun"><stop offset="0" stop-color="#fffbe0"/><stop offset=".7" stop-color="#ffe58a"/><stop offset="1" stop-color="#ffd166"/></radialGradient>
  <radialGradient id="gCheek"><stop offset="0" stop-color="#ff8fb0" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fb0" stop-opacity="0"/></radialGradient>
  <filter id="fSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  `;

  A.star = (r) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.48 : r;
      d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ' ' + (Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  };
  A.heart = (s = 1) => `M0 ${8 * s} C ${-14 * s} ${-2 * s} ${-16 * s} ${-14 * s} ${-8 * s} ${-17 * s} C ${-3 * s} ${-19 * s} 0 ${-15 * s} 0 ${-12 * s} C 0 ${-15 * s} ${3 * s} ${-19 * s} ${8 * s} ${-17 * s} C ${16 * s} ${-14 * s} ${14 * s} ${-2 * s} 0 ${8 * s} Z`;
  A.scallop = (x1, x2, y, n, d) => {
    let s = '';
    const w = (x2 - x1) / n;
    for (let i = 0; i < n; i++) s += ` Q ${(x1 + w * (i + 0.5)).toFixed(1)} ${y + d} ${(x1 + w * (i + 1)).toFixed(1)} ${y}`;
    return s;
  };
  A.sparkle4 = (x, y, r, fill = '#fff') =>
    `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="${fill}"/>`;

  A.flowerHead = (c, r = 14, face = true) => {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      s += `<circle cx="${(Math.cos(a) * r * 0.85).toFixed(1)}" cy="${(Math.sin(a) * r * 0.85).toFixed(1)}" r="${r * 0.62}" fill="${c}" stroke="${sh(c, -0.12)}" stroke-width="1.5"/>`;
    }
    s += `<circle r="${r * 0.6}" fill="#fff3a0" stroke="#f3c95a" stroke-width="1.5"/>`;
    if (face && r >= 12) s += `<circle cx="${-r * 0.2}" cy="${-r * 0.08}" r="${r * 0.09}" fill="#6d4a52"/><circle cx="${r * 0.2}" cy="${-r * 0.08}" r="${r * 0.09}" fill="#6d4a52"/><path d="M${-r * 0.2} ${r * 0.15} Q0 ${r * 0.35} ${r * 0.2} ${r * 0.15}" stroke="#6d4a52" stroke-width="${Math.max(1.2, r * 0.07)}" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  A.tulip = (c) => `<path d="M-12 0 Q-14 -22 -8 -26 L-4 -16 L0 -28 L4 -16 L8 -26 Q14 -22 12 0 Q0 8 -12 0Z" fill="${c}" stroke="${sh(c, -0.15)}" stroke-width="1.5"/>`;

  A.cloud = (s = 1) => `<g transform="scale(${s})">
    <ellipse cx="0" cy="14" rx="92" ry="22" fill="#e9dcff" opacity=".7"/>
    <circle cx="-48" cy="0" r="30" fill="#fff"/><circle cx="-10" cy="-18" r="40" fill="#fff"/>
    <circle cx="34" cy="-6" r="34" fill="#fff"/><circle cx="66" cy="8" r="22" fill="#fff"/>
    <rect x="-78" y="0" width="160" height="28" rx="14" fill="#fff"/></g>`;

  A.rainbow = (r, w = 14, op = 0.75) => {
    const cs = ['#ff9ec7', '#ffc28a', '#fff08a', '#a6eec0', '#9fd2ff', '#c9a6ff'];
    return `<g opacity="${op}" fill="none" stroke-linecap="round">${cs.map((c, i) => `<path d="M${-(r - i * w)} 0 A ${r - i * w} ${r - i * w} 0 0 1 ${r - i * w} 0" stroke="${c}" stroke-width="${w + 1}"/>`).join('')}</g>`;
  };

  /* ---------- picture icons (fit radius ~38) ---------- */
  const I = (A.icons = {});
  I.castle = `<g transform="translate(0 4)"><path d="M-30 30 V-6 H-20 V-14 H-12 V-6 H-6 V-18 H6 V-6 H12 V-14 H20 V-6 H30 V30 Z" fill="#ffc9e0" stroke="#e48ab4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-34 -6 L-25 -30 L-16 -6Z M16 -6 L25 -30 L34 -6Z M-9 -18 L0 -40 L9 -18Z" fill="#c4adff" stroke="#9a7fe0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-8 30 V14 A8 8 0 0 1 8 14 V30Z" fill="#b97ad0"/><circle cx="0" cy="-2" r="4" fill="#fff6b0"/></g>`;
  I.speaker = `<path d="M-26 -10 H-12 L4 -24 V24 L-12 10 H-26Z" fill="#b48ad8" stroke="#8d62c2" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 -12 Q20 0 12 12 M20 -20 Q34 0 20 20" fill="none" stroke="#ff7fb2" stroke-width="5" stroke-linecap="round"/>`;
  I.music = `<path d="M-6 18 V-22 L22 -28 V12" fill="none" stroke="#8d62c2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="-14" cy="18" rx="10" ry="8" fill="#ff7fb2"/><ellipse cx="14" cy="12" rx="10" ry="8" fill="#ff7fb2"/>`;
  I.star = `<path d="${A.star(30)}" fill="url(#gGold)" stroke="#f0a930" stroke-width="3" stroke-linejoin="round"/><circle cx="-8" cy="-6" r="4" fill="#fff" opacity=".8"/>`;
  I.heart = `<path d="${A.heart(2.1)}" transform="translate(0 6)" fill="#ff8fb8" stroke="#e8628f" stroke-width="3"/><ellipse cx="-12" cy="-12" rx="5" ry="3" fill="#fff" opacity=".7"/>`;
  I.dress = `<path d="M-8 -26 Q0 -30 8 -26 L6 -10 Q20 8 28 26 Q0 34 -28 26 Q-20 8 -6 -10Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-8 -26 L-4 -34 M8 -26 L4 -34" stroke="#e57aa8" stroke-width="3" stroke-linecap="round"/><circle cy="-10" r="4" fill="#fff3a0"/>`;
  I.palette = `<path d="M0 -30 C 22 -30 34 -14 32 4 C 30 18 16 16 12 22 C 8 30 -2 32 -12 28 C -30 22 -34 -4 -24 -18 C -18 -26 -10 -30 0 -30Z" fill="#fff4e0" stroke="#d9a873" stroke-width="3"/>
    <circle cx="-14" cy="-12" r="6" fill="#ff8fb8"/><circle cx="2" cy="-18" r="6" fill="#ffd166"/><circle cx="18" cy="-8" r="6" fill="#8fd6ff"/><circle cx="-18" cy="6" r="6" fill="#a6eec0"/><circle cx="0" cy="10" r="5" fill="#c9a6ff"/>`;
  I.hair = `<path d="M-26 22 C -34 -4 -24 -30 0 -30 C 24 -30 34 -4 26 22 L 18 22 C 22 0 16 -12 0 -14 C -16 -12 -22 0 -18 22Z" fill="#f7cf6b" stroke="#d9a845" stroke-width="3"/>
    <circle cy="2" r="16" fill="#fde2d1"/><path d="M-16 -4 C -14 -16 14 -16 16 -4 Q 4 -10 -16 -4Z" fill="#f7cf6b"/>`;
  I.drop = `<path d="M0 -30 C 14 -10 24 2 24 12 A24 24 0 0 1 -24 12 C -24 2 -14 -10 0 -30Z" fill="url(#gHairDrop)" stroke="#c48bd8" stroke-width="3"/>
    <defs><linearGradient id="gHairDrop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7cf6b"/><stop offset=".5" stop-color="#f6a3d2"/><stop offset="1" stop-color="#ad8be6"/></linearGradient></defs><ellipse cx="-9" cy="6" rx="5" ry="8" fill="#fff" opacity=".6"/>`;
  I.crown = `<path d="M-28 18 L-30 -18 L-14 -2 L0 -26 L14 -2 L30 -18 L28 18Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="0" cy="6" r="6" fill="#ff8fb8"/><circle cx="-16" cy="8" r="4" fill="#9fd2ff"/><circle cx="16" cy="8" r="4" fill="#a6eec0"/>`;
  I.wand = `<path d="M-24 26 L8 -6" stroke="#c9a6ff" stroke-width="8" stroke-linecap="round"/><path d="M-24 26 L8 -6" stroke="#fff" stroke-width="2" stroke-dasharray="4 6" stroke-linecap="round"/>
    <g transform="translate(12 -10)"><path d="${A.star(18)}" fill="url(#gGold)" stroke="#f0a930" stroke-width="2.5"/></g>${A.sparkle4(-14, -20, 8, '#ff9ec7')}${A.sparkle4(26, 18, 6, '#9fd2ff')}`;
  I.apple = `<path d="M0 -14 C -10 -24 -32 -20 -30 2 C -28 22 -12 32 0 26 C 12 32 28 22 30 2 C 32 -20 10 -24 0 -14Z" fill="#ff8a9e" stroke="#e05c78" stroke-width="3"/>
    <path d="M0 -14 Q2 -24 6 -30" stroke="#8a5a3a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M4 -24 Q16 -34 22 -24 Q12 -18 4 -24Z" fill="#8fd88f"/><ellipse cx="-14" cy="-4" rx="5" ry="8" fill="#fff" opacity=".6"/>`;
  I.carrot = `<g transform="rotate(30)"><path d="M-12 -14 Q0 -20 12 -14 L2 32 Q0 36 -2 32Z" fill="#ffad6b" stroke="#e8803f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-6 -2 L2 -2 M-4 10 L4 10" stroke="#e8803f" stroke-width="2.5" stroke-linecap="round"/><path d="M0 -16 Q-12 -34 -8 -38 Q0 -30 0 -18 Q2 -34 10 -36 Q10 -24 0 -16Z" fill="#8fd88f" stroke="#5fb86f" stroke-width="2"/></g>`;
  I.cookie = `<path d="${A.star(30)}" fill="#f5c98f" stroke="#d99a5a" stroke-width="3" stroke-linejoin="round"/><path d="${A.star(20)}" fill="#ffd1e6"/><circle cx="-5" cy="-3" r="2.5" fill="#fff"/><circle cx="6" cy="4" r="2.5" fill="#9fd2ff"/>`;
  I.brush = `<g transform="rotate(-30)"><rect x="-8" y="-6" width="16" height="40" rx="8" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
    <rect x="-20" y="-30" width="40" height="26" rx="10" fill="#ffd1e8" stroke="#e48ab4" stroke-width="3"/>
    <path d="M-14 -30 V-40 M-7 -30 V-42 M0 -30 V-42 M7 -30 V-42 M14 -30 V-40" stroke="#fff6b0" stroke-width="4" stroke-linecap="round"/></g>`;
  I.sponge = `<rect x="-28" y="-18" width="56" height="38" rx="12" fill="#fff08a" stroke="#e6c34a" stroke-width="3"/><circle cx="-12" cy="-4" r="4" fill="#e6c34a"/><circle cx="8" cy="6" r="5" fill="#e6c34a"/><circle cx="16" cy="-8" r="3" fill="#e6c34a"/>
    <circle cx="-20" cy="-26" r="9" fill="#d6f1ff" stroke="#9fd2ff" stroke-width="2"/><circle cx="2" cy="-30" r="6" fill="#d6f1ff" stroke="#9fd2ff" stroke-width="2"/><circle cx="20" cy="-26" r="8" fill="#d6f1ff" stroke="#9fd2ff" stroke-width="2"/>`;
  I.ball = `<circle r="28" fill="#fff" stroke="#e48ab4" stroke-width="3"/><path d="M-28 0 Q0 -16 28 0" stroke="#ff8fb8" stroke-width="8" fill="none"/><path d="M-24 14 Q0 2 24 14" stroke="#9fd2ff" stroke-width="7" fill="none"/><path d="M-20 -18 Q0 -26 20 -18" stroke="#fff08a" stroke-width="7" fill="none"/>`;
  I.ride = `<g transform="translate(0 10)">${A.rainbow(32, 6, 1)}</g><g transform="translate(0 -8)"><path d="${A.star(13)}" fill="url(#gGold)" stroke="#f0a930" stroke-width="2"/></g>`;
  I.seed = `<path d="M-22 -18 L22 -18 L26 28 Q0 34 -26 28Z" fill="#f2d3a8" stroke="#c99a62" stroke-width="3" stroke-linejoin="round"/><path d="M-22 -18 Q0 -30 22 -18" fill="#e3bd8a" stroke="#c99a62" stroke-width="3"/>
    <g transform="translate(0 6)">${A.flowerHead('#ff9ec7', 12, false)}</g>`;
  I.can = `<path d="M-24 -10 H14 V24 Q-5 30 -24 24Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3"/><path d="M14 0 L34 -18" stroke="#5aa7d8" stroke-width="7" stroke-linecap="round"/><circle cx="35" cy="-19" r="5" fill="#5aa7d8"/>
    <path d="M-24 -4 Q-40 6 -26 18" stroke="#5aa7d8" stroke-width="5" fill="none"/><path d="M-18 -10 Q-5 -26 8 -10" stroke="#5aa7d8" stroke-width="5" fill="none"/><path d="M-14 6 l6 -6 6 6 -6 6Z" fill="#fff" opacity=".8"/>`;
  I.envelope = `<rect x="-30" y="-20" width="60" height="42" rx="6" fill="#fff" stroke="#e48ab4" stroke-width="3"/><path d="M-30 -18 L0 6 L30 -18" fill="none" stroke="#e48ab4" stroke-width="3"/>
    <path d="${A.heart(0.9)}" transform="translate(0 10)" fill="#ff7fb2"/>`;
  I.teapot = `<path d="M-22 -6 Q-24 24 0 26 Q24 24 22 -6Z" fill="#fff" stroke="#c9a6ff" stroke-width="3"/><path d="M22 0 Q34 -6 36 -16" stroke="#c9a6ff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M-22 0 Q-36 2 -32 14 Q-28 22 -20 16" stroke="#c9a6ff" stroke-width="5" fill="none"/><ellipse cx="0" cy="-8" rx="22" ry="6" fill="#ffd1e8" stroke="#c9a6ff" stroke-width="3"/><circle cy="-16" r="5" fill="#ffd166"/>
    <path d="${A.heart(0.7)}" transform="translate(0 12)" fill="#ff9ec7"/>`;
  I.cupcake = `<path d="M-20 4 L-14 28 H14 L20 4Z" fill="#9fd2ff" stroke="#5aa7d8" stroke-width="3" stroke-linejoin="round"/><path d="M-8 4 V28 M4 4 V28" stroke="#5aa7d8" stroke-width="2"/>
    <path d="M-24 6 Q-28 -10 -12 -14 Q-10 -30 6 -26 Q22 -24 20 -10 Q30 -4 24 6Z" fill="#ffb3d4" stroke="#e57aa8" stroke-width="3"/><circle cx="2" cy="-30" r="6" fill="#ff6b8a"/><path d="M2 -36 q2 -6 8 -8" stroke="#5fb86f" stroke-width="2" fill="none"/>`;
  I.flower = `<path d="M0 30 V-2" stroke="#6cc07a" stroke-width="5"/><path d="M0 18 Q-16 8 -20 18 Q-8 26 0 18Z M0 12 Q16 2 20 12 Q8 20 0 12Z" fill="#8fd88f"/><g transform="translate(0 -12)">${A.flowerHead('#ff9ec7', 16)}</g>`;
  I.teacup = `<path d="M-24 -8 H20 Q20 22 -2 24 Q-24 22 -24 -8Z" fill="#fff" stroke="#e48ab4" stroke-width="3"/><path d="M20 -2 Q34 -2 30 10 Q26 18 16 14" stroke="#e48ab4" stroke-width="4" fill="none"/>
    <ellipse cx="-2" cy="28" rx="30" ry="6" fill="#ffd1e8" stroke="#e48ab4" stroke-width="2"/><path d="${A.heart(0.6)}" transform="translate(-2 10)" fill="#ff9ec7"/><path d="M-8 -14 q-4 -8 2 -14 M4 -14 q-4 -8 2 -14" stroke="#c9a6ff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  I.ballroom = `<path d="M-6 -20 Q0 -24 6 -20 L4 -6 Q16 10 22 28 Q0 34 -22 28 Q-16 10 -4 -6Z" fill="#c7a6ff" stroke="#9a7fe0" stroke-width="3"/>
    <path d="M18 -26 V-6" stroke="#ff7fb2" stroke-width="4" stroke-linecap="round"/><ellipse cx="13" cy="-5" rx="6" ry="5" fill="#ff7fb2"/>${A.sparkle4(-22, -18, 8, '#ffd166')}${A.sparkle4(28, 6, 6, '#9fd2ff')}`;
  I.bed = `<rect x="-30" y="-2" width="60" height="22" rx="6" fill="#ffd1e8" stroke="#e48ab4" stroke-width="3"/><rect x="-32" y="-22" width="12" height="48" rx="5" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/>
    <rect x="-18" y="-8" width="18" height="10" rx="5" fill="#fff" stroke="#e48ab4" stroke-width="2"/><path d="M-30 -2 Q0 -12 30 -2" fill="none" stroke="#e48ab4" stroke-width="2"/><path d="${A.heart(0.6)}" transform="translate(14 10)" fill="#ff8fb8"/>`;
  I.mirror = `<ellipse cy="-4" rx="22" ry="28" fill="#dff4ff" stroke="url(#gGold)" stroke-width="7"/><path d="M-10 -14 L2 -26 M-12 -2 L8 -22" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="-16" y="24" width="32" height="7" rx="3" fill="#ffc54d"/>`;
  I.unicorn = `<g transform="translate(-4 4)"><path d="M-14 26 C -22 6 -18 -16 0 -18 C 14 -20 22 -10 28 2 C 32 10 26 18 18 14 C 12 12 8 16 8 26Z" fill="#fff" stroke="#c9a6ff" stroke-width="3"/>
    <path d="M2 -18 L10 -44 L12 -16Z" fill="url(#gGold)" stroke="#f0a930" stroke-width="2"/><path d="M-4 -16 Q-22 -16 -22 4 Q-26 16 -18 26" stroke="#ff9ec7" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M-8 -14 Q-16 -6 -14 8" stroke="#9fd2ff" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="8" cy="-4" r="3.5" fill="#4a2c5a"/><circle cx="16" cy="6" r="3" fill="#ffb3cc"/></g>`;
  I.check = `<circle r="32" fill="#a6eec0" stroke="#5fc48a" stroke-width="3"/><path d="M-14 0 L-4 12 L16 -12" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  I.again = `<path d="M18 -14 A22 22 0 1 0 22 8" fill="none" stroke="#8d62c2" stroke-width="7" stroke-linecap="round"/><path d="M10 -24 L22 -14 L8 -6" fill="none" stroke="#8d62c2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${A.sparkle4(0, 0, 9, '#ffd166')}`;
  I.roller = `<rect x="-26" y="-28" width="44" height="20" rx="8" fill="#ff9ec7" stroke="#e57aa8" stroke-width="3"/><path d="M18 -18 H26 V0 H0 V12" fill="none" stroke="#9a7fe0" stroke-width="4"/><rect x="-5" y="12" width="10" height="20" rx="4" fill="#c9a6ff"/>`;
  I.floor = `<path d="M-30 -6 L30 -6 L36 26 L-36 26Z" fill="#f0d2b4" stroke="#c99a62" stroke-width="3"/><path d="M-10 -6 L-12 26 M10 -6 L12 26 M-33 10 L33 10" stroke="#c99a62" stroke-width="2"/><path d="M-20 -26 v12 M-26 -20 h12" stroke="#ff8fb8" stroke-width="4" stroke-linecap="round"/>`;
  I.twirl = `<path d="M-6 -16 Q0 -20 6 -16 L4 -2 Q16 12 24 26 Q0 32 -24 26 Q-16 12 -4 -2Z" fill="#ffa6c9" stroke="#e57aa8" stroke-width="3"/><path d="M-30 0 A30 14 0 0 0 30 0" fill="none" stroke="#9a7fe0" stroke-width="4" stroke-dasharray="6 6" stroke-linecap="round"/><path d="M26 -8 L32 2 L20 4" fill="none" stroke="#9a7fe0" stroke-width="4" stroke-linecap="round"/><circle cy="-24" r="8" fill="#fde2d1"/>`;
  I.jump = `<path d="M-14 26 h28" stroke="#c9a6ff" stroke-width="5" stroke-linecap="round"/><path d="M0 -6 V-34 M-10 -24 L0 -34 L10 -24" fill="none" stroke="#ff7fb2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cy="8" r="10" fill="#fde2d1"/>${A.sparkle4(-22, 4, 7, '#ffd166')}${A.sparkle4(22, 0, 7, '#9fd2ff')}`;
  I.curtsy = `<path d="M-6 -6 Q0 -10 6 -6 L4 4 Q20 16 30 28 Q0 34 -30 28 Q-20 16 -4 4Z" fill="#c7a6ff" stroke="#9a7fe0" stroke-width="3"/><circle cy="-16" r="9" fill="#fde2d1" transform="rotate(-20 0 0)"/><path d="M-22 -26 Q0 -40 22 -26" fill="none" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/>`;
  I.sway = `<path d="M-28 -10 Q-14 -26 0 -10 Q14 6 28 -10" fill="none" stroke="#ff7fb2" stroke-width="6" stroke-linecap="round"/><path d="M-28 12 Q-14 -4 0 12 Q14 28 28 12" fill="none" stroke="#9fd2ff" stroke-width="6" stroke-linecap="round"/>`;
  I.firework = `<g stroke-linecap="round" stroke-width="5">${[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => `<path d="M0 0 L0 -26" transform="rotate(${a})" stroke="${['#ff7fb2', '#ffd166', '#9fd2ff', '#a6eec0'][i % 4]}"/>`).join('')}</g><circle r="7" fill="#fff"/>`;
  I.confetti = `<rect x="-24" y="-20" width="10" height="16" rx="2" transform="rotate(-20 -19 -12)" fill="#ff9ec7"/><rect x="4" y="-28" width="10" height="16" rx="2" transform="rotate(25 9 -20)" fill="#9fd2ff"/><rect x="-6" y="4" width="10" height="16" rx="2" transform="rotate(10 -1 12)" fill="#ffd166"/><rect x="16" y="6" width="10" height="16" rx="2" transform="rotate(-30 21 14)" fill="#a6eec0"/><circle cx="-20" cy="16" r="5" fill="#c9a6ff"/><circle cx="20" cy="-6" r="4" fill="#ff7fb2"/>`;
  I.lights = `<path d="M0 -30 V-16" stroke="#c99a62" stroke-width="3"/><path d="M-26 -16 H26 L18 4 H-18Z" fill="url(#gGold)" stroke="#e6a52e" stroke-width="3"/><circle cx="-14" cy="14" r="6" fill="#ff9ec7"/><circle cx="0" cy="18" r="6" fill="#9fd2ff"/><circle cx="14" cy="14" r="6" fill="#a6eec0"/>${A.sparkle4(-26, 24, 6, '#fff08a')}${A.sparkle4(26, 24, 6, '#fff08a')}`;
  I.cheers = `<g transform="rotate(-18 -10 0)"><path d="M-30 -14 H-6 Q-6 10 -18 12 Q-30 10 -30 -14Z" fill="#fff" stroke="#e48ab4" stroke-width="3"/></g><g transform="rotate(18 10 0)"><path d="M6 -14 H30 Q30 10 18 12 Q6 10 6 -14Z" fill="#fff" stroke="#c9a6ff" stroke-width="3"/></g>${A.sparkle4(0, -26, 9, '#ffd166')}`;
  I.tray = `<ellipse cy="16" rx="34" ry="10" fill="#ffd1e8" stroke="#e48ab4" stroke-width="3"/><circle cx="-12" cy="4" r="10" fill="#c9a6ff"/><circle cx="12" cy="4" r="10" fill="#9fd2ff"/><circle cy="-10" r="10" fill="#ff9ec7"/><rect x="-22" y="1" width="20" height="5" fill="#fff" opacity=".8"/><rect x="2" y="1" width="20" height="5" fill="#fff" opacity=".8"/>`;
  I.oven = `<rect x="-30" y="-26" width="60" height="54" rx="8" fill="#ff9ec7" stroke="#e57aa8" stroke-width="3"/><rect x="-22" y="-8" width="44" height="28" rx="6" fill="#ffd7a8" stroke="#e57aa8" stroke-width="3"/><circle cx="-16" cy="-18" r="4" fill="#fff"/><circle cx="0" cy="-18" r="4" fill="#fff"/>`;
  I.lock = `<rect x="-14" y="-4" width="28" height="22" rx="5" fill="#d8cbe8"/><path d="M-8 -4 V-12 A8 8 0 0 1 8 -12 V-4" fill="none" stroke="#d8cbe8" stroke-width="5"/>`;
  I.play = `<path d="${A.heart(4.2)}" transform="translate(0 22)" fill="#ff7fb2" stroke="#fff" stroke-width="5"/><path d="M-12 -16 L18 2 L-12 20Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round" transform="translate(0 -4)"/>`;
  I.basket = `<path d="M-30 -4 H30 L24 26 H-24Z" fill="#f2d3a8" stroke="#c99a62" stroke-width="3" stroke-linejoin="round"/><path d="M-26 6 H26 M-24 16 H24" stroke="#c99a62" stroke-width="2"/><path d="M-22 -4 Q0 -36 22 -4" fill="none" stroke="#c99a62" stroke-width="4"/><circle cx="-12" cy="-8" r="8" fill="#ff8a9e"/><circle cx="6" cy="-10" r="8" fill="#ffad6b"/>`;
})();
