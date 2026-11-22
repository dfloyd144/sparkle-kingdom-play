/* Princess missions: picture-card quests from Pip the royal owl. Scenes report what happens with K.emit(). */
(function () {
  const A = K.art, I = A.icons;
  const M = (K.missions = {});
  const uni = () => K.save.data.unicorn.name;

  const LIST = [
    { id: 'feed', say: () => `Give ${uni()} 3 yummy snacks.`, word: 'feed', icon: 'apple', goal: 3, scene: 'unicorn', ev: 'unicorn', test: (e) => e.act === 'feed' },
    { id: 'bedtime', say: () => 'Get ready for bed, and sleep in your very own bed.', word: 'bedtime', icon: 'moon', goal: 1, scene: 'bedtime', ev: 'slept' },
    { id: 'read3', say: () => 'Read 3 words at the royal school.', word: 'read', icon: 'book', goal: 3, scene: 'spellbook', ev: 'read' },
    { id: 'missing3', say: () => 'Find 3 missing letters at the royal school.', word: 'letters', icon: 'book', goal: 3, scene: 'spellbook', ev: 'missing' },
    { id: 'math3', say: () => 'Solve 3 adding or taking away problems at the royal school.', word: 'math', icon: 'star', goal: 3, scene: 'spellbook', ev: 'math' },
    { id: 'adopt', say: () => 'Adopt a pet at the pet palace.', word: 'pet', icon: 'paw', goal: 1, scene: 'pets', ev: 'adopt' },
    { id: 'petfeed', say: () => 'Feed your pet 3 times.', word: 'feed', icon: 'bowl', goal: 3, scene: 'pets', ev: 'pet', test: (e) => e.act === 'feed' },
    { id: 'potty', say: () => 'Go potty, flush the toilet, and wash your hands.', word: 'potty', icon: 'toilet', goal: 1, scene: 'bath', ev: 'wash', test: (e) => e.afterFlush },
    { id: 'spell', say: () => 'Spell a word in the magic spell book.', word: 'spell', icon: 'book', goal: 1, scene: 'spellbook', ev: 'spelled' },
    { id: 'xmas', say: () => 'Put 3 Christmas decorations on the castle.', word: 'decorate', icon: 'present', goal: 3, scene: 'christmas', ev: 'decorate' },
    { id: 'hands', say: () => 'Help the princess keep happy hands. Keep fingers out of her mouth!', word: 'hands', icon: 'hands', goal: 1, scene: 'hands', ev: 'hands' },
    { id: 'purple', say: () => 'Put on a purple dress.', word: 'purple', icon: 'purpleDress', goal: 1, scene: 'dressup', ev: 'dress', test: (l) => l.color === 1 },
    { id: 'ride', say: () => `Go for a magic ride on ${uni()}.`, word: 'ride', icon: 'ride', goal: 1, scene: 'unicorn', ev: 'unicorn', test: (e) => e.act === 'ride' },
    { id: 'cherry', say: () => 'Bake a treat with 2 cherries on top.', word: 'bake', icon: 'cherries', goal: 1, scene: 'bakery', ev: 'baked', test: (e) => e.counts.cherry === 2 },
    { id: 'butterfly', say: () => 'Find 3 butterflies in the kingdom. Tap them!', word: 'butterfly', icon: 'butterfly', goal: 3, scene: 'kingdom', ev: 'tapWord', test: (e) => e.word === 'butterfly' },
    { id: 'spell2', say: () => 'Spell 2 words in the magic spell book.', word: 'spell', icon: 'keyboard', goal: 2, scene: 'spellbook', ev: 'spelled' },
    { id: 'grow', say: () => 'Grow a flower word in the garden.', word: 'grow', icon: 'flower', goal: 1, scene: 'garden', ev: 'word' },
    { id: 'bath', say: () => 'Take a bubble bath.', word: 'bath', icon: 'tub', goal: 1, scene: 'bath', ev: 'bath' },
    { id: 'teddy', say: () => 'Put a teddy bear in your bedroom.', word: 'teddy', icon: 'teddy', goal: 1, scene: 'room', ev: 'roomAdd', test: (e) => e.t === 'teddy' },
    { id: 'brush', say: () => `Brush ${uni()}'s rainbow mane.`, word: 'brush', icon: 'brush', goal: 1, scene: 'unicorn', ev: 'unicorn', test: (e) => e.act === 'brush' },
    { id: 'friends', say: () => 'Invite 3 friends to your tea party.', word: 'friends', icon: 'envelope', goal: 3, scene: 'tea', ev: 'teaGuest' },
    { id: 'dance', say: () => 'Dance 5 times at the royal ball.', word: 'dance', icon: 'twirl', goal: 5, scene: 'ball', ev: 'dance' },
    { id: 'crown', say: () => 'Put on the big gold crown.', word: 'crown', icon: 'crown', goal: 1, scene: 'dressup', ev: 'dress', test: (l) => l.crown === 2 },
    { id: 'wash', say: () => `Give ${uni()} a bubbly wash with the sponge.`, word: 'wash', icon: 'sponge', goal: 1, scene: 'unicorn', ev: 'unicorn', test: (e) => e.act === 'wash' },
    { id: 'fireworks', say: () => 'Make 3 fireworks at the ball.', word: 'fireworks', icon: 'firework', goal: 3, scene: 'ball', ev: 'firework' },
    { id: 'cheers', say: () => 'Give everyone at the tea party tea and a treat, then say cheers!', word: 'cheers', icon: 'cheers', goal: 1, scene: 'tea', ev: 'cheers', test: (e) => e.full },
  ];

  const st = () => {
    const S = K.save.data;
    if (!S.mission || typeof S.mission.i !== 'number') S.mission = { i: 0, n: 0, medals: 0 };
    return S.mission;
  };
  M.current = () => LIST[st().i % LIST.length];

  /* ---------- HUD button ---------- */
  const btn = document.getElementById('missionBtn');
  btn.innerHTML = `<svg viewBox="-44 -44 88 88">${I.scroll}</svg><span class="mbadge"></span>`;
  function updateHud(bump) {
    const m = M.current(), s = st();
    btn.querySelector('.mbadge').textContent = m.goal > 1 ? `${s.n}/${m.goal}` : '';
    btn.querySelector('.mbadge').style.display = m.goal > 1 ? '' : 'none';
    if (bump) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); }
  }
  updateHud();
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); K.audio.unlock(); K.audio.sfx('pop'); M.open(); });

  /* ---------- card ---------- */
  const card = document.getElementById('missionCard');
  const svg = (inner, vb = '-60 -60 120 120') => `<svg viewBox="${vb}">${inner}</svg>`;
  const wordHtml = (w) => `<span class="first">${w[0]}</span>${w.slice(1)}`;
  function medalsRow() {
    const n = st().medals;
    if (!n) return '';
    const shown = Math.min(n, 10);
    let s = '';
    for (let i = 0; i < shown; i++) s += svg(I.medal, '-40 -40 80 80');
    return `<div class="mc-medals">${s}${n > 10 ? `<b>+${n - 10}</b>` : ''}</div>`;
  }
  function dots(m) {
    let s = '';
    for (let i = 0; i < m.goal; i++) s += `<i class="${i < st().n ? 'on' : ''}"></i>`;
    return `<div class="mc-dots">${s}</div>`;
  }
  M.open = (idx) => {
    const s0 = st(), N = LIST.length, cur = s0.i % N;
    const i = (((idx === undefined ? cur : idx) % N) + N) % N, m = LIST[i], isCur = i === cur;
    card.innerHTML = `<div class="mc-panel">
      <div class="mc-owl">${svg(`<g transform="translate(0 56) scale(1.05)">${A.owl()}</g>`)}</div>
      <div class="mc-title">${svg(I.scroll, '-40 -40 80 80')}<span>${wordHtml('mission')}</span></div>
      <div class="mc-pic">${svg(I[m.icon])}</div>
      <div class="mc-word">${wordHtml(m.word)}</div>
      ${isCur ? dots(m) : `<div class="mc-other">${i + 1} / ${N}</div>`}
      <button class="mc-arrow l" aria-label="Previous mission">‹</button><button class="mc-arrow r" aria-label="Next mission">›</button>
      <div class="mc-btns">
        <button class="mc-say" aria-label="Say it again">${svg(I.speaker, '-44 -44 88 88')}</button>
        <button class="mc-go" aria-label="Go">${svg('<path d="M-16 -28 L24 0 L-16 28Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>')}</button>
        <button class="mc-close" aria-label="Close">${svg('<path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke="#9a7fe0" stroke-width="12" stroke-linecap="round"/>')}</button>
      </div>${medalsRow()}</div>`;
    card.classList.remove('hidden');
    K.voice.say(`${isCur ? 'Your mission' : 'Mission'}: ${m.say()}`, { force: true });
    const on = (sel, fn) => card.querySelector(sel).addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); K.audio.sfx('tap'); fn(); });
    on('.mc-say', () => K.voice.say(m.say(), { force: true }));
    on('.mc-close', () => M.close());
    on('.mc-go', () => { if (!isCur) { s0.i = i; s0.n = 0; K.save.write(); updateHud(true); } M.close(); if (K.curName !== m.scene) K.go(m.scene); });
    on('.mc-arrow.l', () => M.open(i - 1));
    on('.mc-arrow.r', () => M.open(i + 1));
    const pnl = card.querySelector('.mc-panel');
    let sx = null;
    pnl.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    pnl.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) { K.audio.sfx('swoosh'); M.open(dx < 0 ? i + 1 : i - 1); } });
  };
  M.close = () => { card.classList.add('hidden'); card.innerHTML = ''; };
  card.addEventListener('pointerdown', (e) => { if (e.target === card) M.close(); });

  function celebrate(done) {
    const next = M.current();
    card.innerHTML = `<div class="mc-panel done">
      <div class="mc-title">${svg(I.medal, '-40 -40 80 80')}<span>${wordHtml('yay')}!</span></div>
      <div class="mc-pic big">${svg(I.medal)}</div>
      <div class="mc-word">${wordHtml(done.word)}</div>
      <div class="mc-btns"><button class="mc-next" aria-label="Next mission">${svg(I.scroll, '-44 -44 88 88')}</button>
        <button class="mc-close" aria-label="Close">${svg('<path d="M-16 -28 L24 0 L-16 28Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>')}</button></div>
      ${medalsRow()}</div>`;
    card.classList.remove('hidden');
    K.audio.sfx('fanfare');
    if (K.layers) K.fx.confetti(70);
    K.voice.say(`Mission complete! You earned a medal, Princess ${K.myName()}! You have ${st().medals} ${st().medals === 1 ? 'medal' : 'medals'}.`, { force: true });
    card.querySelector('.mc-next').addEventListener('pointerdown', (e) => { e.preventDefault(); K.audio.sfx('tap'); M.open(); });
    card.querySelector('.mc-close').addEventListener('pointerdown', (e) => { e.preventDefault(); K.audio.sfx('tap'); M.close(); });
    void next;
  }

  /** Scenes call K.emit(eventName, data) when something happens. */
  K.emit = (ev, data = {}) => {
    try {
      const m = M.current();
      if (m.ev !== ev || (m.test && !m.test(data))) return;
      const s = st();
      s.n++;
      if (s.n >= m.goal) {
        s.medals++; s.i = (s.i + 1) % LIST.length; s.n = 0;
        K.save.data.stars += 2;
        K.save.write();
        updateHud(true);
        K.updateStars && setTimeout(() => K.updateStars(true), 400);
        setTimeout(() => celebrate(m), 1600);
      } else {
        K.save.write();
        updateHud(true);
        K.audio.sfx('chime');
      }
    } catch (e) { console.error(e); }
  };
})();
