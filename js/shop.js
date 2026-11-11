/* Star Shop: some outfits, unicorn manes and room decorations are locked until she spends stars on them.
   Learning games pay the most stars, so learning is how you unlock the fun stuff. */
(function () {
  const A = K.art, D = K.data;
  const ITEMS = [
    { cat: 'color', i: 6, price: 5, word: 'white dress' },
    { cat: 'color', i: 7, price: 5, word: 'red dress' },
    { cat: 'hair', i: 6, price: 6, word: 'blue hair' },
    { cat: 'hair', i: 7, price: 6, word: 'silver hair' },
    { cat: 'dress', i: 4, price: 12, word: 'fairy dress' },
    { cat: 'crown', i: 2, price: 10, word: 'big crown' },
    { cat: 'crown', i: 4, price: 15, word: 'unicorn horn' },
    { cat: 'mane', i: 4, price: 10, word: 'sunset mane' },
    { cat: 'mane', i: 5, price: 10, word: 'mint mane' },
    { cat: 'room', i: 'painting', price: 6, word: 'picture' },
    { cat: 'room', i: 'balloons', price: 6, word: 'balloons' },
    { cat: 'room', i: 'lights', price: 8, word: 'twinkle lights' },
    { cat: 'room', i: 'plush', price: 10, word: 'unicorn plush' },
    { cat: 'room', i: 'chandelier', price: 15, word: 'sparkle chandelier' },
  ];
  const key = (cat, i) => `${cat}:${i}`;
  const owned = () => { const S = K.save.data; if (!Array.isArray(S.owned)) S.owned = []; return S.owned; };
  const find = (cat, i) => ITEMS.find((x) => x.cat === cat && String(x.i) === String(i));
  const Shop = (K.shop = { ITEMS });
  Shop.isLocked = (cat, i) => { const it = find(cat, i); return !!it && !owned().includes(key(cat, i)); };
  Shop.price = (cat, i) => (find(cat, i) || {}).price || 0;
  /** small lock + price badge for a thumbnail (SVG, centered on 0,0, radius ~50) */
  Shop.badge = (cat, i, r = 50) => {
    if (!Shop.isLocked(cat, i)) return '';
    const p = Shop.price(cat, i);
    return `<circle r="${r}" fill="#fff" opacity=".5"/><g transform="translate(${r * 0.5} ${-r * 0.55})"><circle r="${r * 0.36}" fill="#fff" stroke="#e6c34a" stroke-width="3"/><g transform="scale(${r / 130})">${A.icons.lock.replace(/#d8cbe8/g, '#b08ce8')}</g></g>
      <g transform="translate(${r * 0.42} ${r * 0.62})"><rect x="${-r * 0.55}" y="${-r * 0.28}" width="${r * 1.1}" height="${r * 0.56}" rx="${r * 0.28}" fill="#ffd166" stroke="#fff" stroke-width="3"/>
      <path d="${A.star(r * 0.16)}" transform="translate(${-r * 0.3} 0)" fill="#fff"/><text x="${r * 0.12}" y="${r * 0.13}" text-anchor="middle" font-size="${r * 0.36}" fill="#6d4a92">${p}</text></g>`;
  };
  function picture(it) {
    switch (it.cat) {
      case 'color': return `<g transform="translate(0 -6) scale(.6)">${A.skirtOnly(0, it.i)}</g>`;
      case 'hair': return `<g transform="translate(0 6) scale(.4)">${A.princessHead(Object.assign({}, K.me(), { hair: it.i, crown: -1 }))}</g>`;
      case 'dress': return `<g transform="translate(0 -6) scale(.62)">${A.skirtOnly(it.i, 1)}</g>`;
      case 'crown': return `<g transform="scale(.8)">${A.crownOnly(it.i)}</g>`;
      case 'mane': return `<clipPath id="shm${it.i}"><circle r="36"/></clipPath><g clip-path="url(#shm${it.i})">${D.MANES[it.i].c.map((c, j) => `<rect x="-40" y="${-40 + j * 13.4}" width="80" height="14" fill="${c}"/>`).join('')}</g>`;
      case 'room': return `<g transform="translate(0 30) scale(${{ painting: 0.5, balloons: 0.3, lights: 0.4, plush: 0.45, chandelier: 0.4 }[it.i] || 0.4})">${A.room(it.i)}</g>`;
    }
    return '';
  }
  const card = () => document.getElementById('shopCard');
  const svg = (inner, vb = '-50 -50 100 100') => `<svg viewBox="${vb}">${inner}</svg>`;
  function close() { const c = card(); c.classList.add('hidden'); c.innerHTML = ''; }
  Shop.close = close;

  /** Ask to unlock one item. onDone() runs after a successful unlock. */
  Shop.ask = (cat, i, onDone) => {
    const it = find(cat, i);
    if (!it) return onDone && onDone();
    const stars = K.save.data.stars;
    const c = card();
    const enough = stars >= it.price;
    c.innerHTML = `<div class="sh-panel"><div class="sh-pic">${svg(picture(it))}</div>
      <div class="sh-word"><b>${it.word[0]}</b>${it.word.slice(1)}</div>
      <div class="sh-price">${svg(A.icons.star, '-36 -36 72 72')}<span>${it.price}</span></div>
      ${enough ? '' : `<div class="sh-need">${svg(A.icons.star, '-36 -36 72 72')}<span>${stars} / ${it.price}</span></div>`}
      <div class="sh-btns">${enough ? `<button class="sh-yes" aria-label="Unlock">${svg(A.icons.check)}</button>` : `<button class="sh-learn" aria-label="Earn stars at school">${svg(A.icons.book)}</button>`}
        <button class="sh-no" aria-label="Not now">${svg('<path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#9a7fe0" stroke-width="10" stroke-linecap="round"/>')}</button></div></div>`;
    c.classList.remove('hidden');
    K.voice.say(enough ? `Unlock the ${it.word} for ${it.price} stars?` : `The ${it.word} needs ${it.price} stars. You have ${stars}. Play at the royal school to earn more stars!`, { force: true });
    const on = (sel, fn) => { const b = c.querySelector(sel); if (b) b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); K.audio.sfx('tap'); fn(); }); };
    on('.sh-no', close);
    on('.sh-learn', () => { close(); if (K.curName !== 'spellbook') K.go('spellbook'); });
    on('.sh-yes', () => {
      K.save.data.stars -= it.price;
      owned().push(key(cat, i));
      K.save.write(); K.updateStars(true);
      close();
      K.audio.sfx('fanfare');
      if (K.layers) K.fx.confetti(60);
      K.voice.say(`Yay! You unlocked the ${it.word}!`, { force: true });
      onDone && onDone();
    });
  };

  /** Shop overview (tap the star counter) */
  Shop.open = () => {
    const c = card(), stars = K.save.data.stars;
    const cells = ITEMS.map((it) => {
      const own = !Shop.isLocked(it.cat, it.i);
      return `<button class="sh-item${own ? ' own' : ''}" data-k="${key(it.cat, it.i)}">${svg(picture(it))}
        <span class="sh-name">${it.word}</span><span class="sh-tag">${own ? svg(A.icons.check, '-36 -36 72 72') : `${svg(A.icons.star, '-36 -36 72 72')}${it.price}`}</span></button>`;
    }).join('');
    c.innerHTML = `<div class="sh-panel wide"><div class="sh-head">${svg(A.icons.star, '-36 -36 72 72')}<span>${stars}</span>
      <button class="sh-no" aria-label="Close">${svg('<path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#9a7fe0" stroke-width="10" stroke-linecap="round"/>')}</button></div>
      <div class="sh-grid">${['food', 'toys'].map((k) => { const u = K.pets.SUPPLY[k], have = typeof K.save.data[u.key] === 'number' ? K.save.data[u.key] : u.start;
          const pic = k === 'food' ? '<path d="M-30 -30 H30 L36 40 H-36Z" fill="#ffe6c9" stroke="#e6b98a" stroke-width="4" stroke-linejoin="round"/><rect x="-32" y="-40" width="64" height="16" rx="6" fill="#ff9ec7"/><g transform="translate(0 10) scale(.8)">' + A.icons.bowl + '</g>' : '<g transform="translate(-12 10) scale(.6)">' + A.icons.ball + '</g><g transform="translate(16 -14) scale(.5)">' + A.icons.ball + '</g>';
          return `<button class="sh-item sh-food" data-k="${k}">${svg(pic)}<span class="sh-name">${u.word} ${have}</span><span class="sh-tag">${svg(A.icons.star, '-36 -36 72 72')}${u.price}</span></button>`; }).join('')}
        <button class="sh-item sh-pet">${svg('<g transform="translate(0 30) scale(.55)">' + A.pet('cat', '#ffb36b') + '</g><g transform="translate(26 -28) scale(.5)">' + A.icons.paw + '</g>')}<span class="sh-name">new pet</span><span class="sh-tag">${svg(A.icons.star, '-36 -36 72 72')}${K.pets.price()}</span></button>
        ${cells}</div></div>`;
    c.classList.remove('hidden');
    K.voice.say(`You have ${stars} stars! Tap something to unlock it.`, { force: true });
    c.querySelector('.sh-no').addEventListener('pointerdown', (e) => { e.preventDefault(); close(); });
    // pet food and toys: tap once to hear the price, tap again to buy
    let armed = '', armedAt = 0;
    c.querySelectorAll('.sh-food').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.k, u = K.pets.SUPPLY[k], S = K.save.data;
      K.audio.sfx('tap');
      if (armed !== k || Date.now() - armedAt > 4000) { armed = k; armedAt = Date.now(); K.voice.say(`${u.word}! ${u.pack} for ${u.price} stars. Tap again to buy.`, { force: true }); return; }
      if (S.stars < u.price) { K.voice.say(`You need ${u.price} stars. Earn stars at the royal school!`, { force: true }); return; }
      S.stars -= u.price; S[u.key] = (typeof S[u.key] === 'number' ? S[u.key] : u.start) + u.pack; K.save.write(); K.updateStars(true);
      K.audio.sfx('chime'); K.voice.say(`You bought ${u.pack} ${u.word}!`, { force: true }); Shop.open();
    }));
    c.querySelector('.sh-pet').addEventListener('click', () => { K.audio.sfx('tap'); close(); K.go('pets', { adopt: true }); });
    c.querySelectorAll('.sh-item:not(.sh-food):not(.sh-pet)').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault(); K.audio.sfx('tap');
      const [cat, i] = b.dataset.k.split(':');
      const it = find(cat, i);
      if (!Shop.isLocked(cat, i)) { K.voice.say(`You have the ${it.word}! ${cat === 'room' ? 'Find it in your room.' : cat === 'mane' ? 'Find it with Sparkle.' : 'Find it in dress up.'}`, { force: true }); return; }
      Shop.ask(cat, i, () => K.wait(600).then(Shop.open));
    }));
  };
  document.addEventListener('DOMContentLoaded', () => {});
  const sc = document.getElementById('shopCard');
  if (sc) sc.addEventListener('pointerdown', (e) => { if (e.target === sc) close(); });

  /** helper: give several stars with a little stagger */
  K.fx.stars = (n, x, y) => { for (let k = 0; k < n; k++) K.wait(k * 260).then(() => K.fx.star(x + k * 36 - (n - 1) * 18, y)); };
})();
