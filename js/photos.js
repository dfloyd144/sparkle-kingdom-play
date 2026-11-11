/* Make-believe photos: the camera button snaps the current scene into a photo album.
   Photos are small JPEGs kept only on this device (newest 20). */
(function () {
  const KEY = 'sparkle-kingdom-photos-v1', MAX = 20;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const store = (list) => {
    for (let n = list.length; n > 0; n--) {
      try { localStorage.setItem(KEY, JSON.stringify(list.slice(-n))); return list.slice(-n); } catch (e) { /* too big: drop the oldest and retry */ }
    }
    return [];
  };
  const CAM = `<svg viewBox="-44 -44 88 88" xmlns="http://www.w3.org/2000/svg"><rect x="-30" y="-16" width="60" height="42" rx="10" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><path d="M-12 -16 L-6 -26 H6 L12 -16Z" fill="#b393f2" stroke="#9a7fe0" stroke-width="3" stroke-linejoin="round"/><circle cy="5" r="13" fill="#fff" stroke="#9a7fe0" stroke-width="3"/><circle cy="5" r="6" fill="#7fb8ff"/><circle cx="20" cy="-8" r="3.5" fill="#ff9ec7"/></svg>`;

  const css = document.createElement('style');
  css.textContent = `#camBtn{left:var(--hg);bottom:var(--hg);top:auto}
    #camFlash{position:absolute;inset:0;background:#fff;z-index:40;pointer-events:none;animation:camFlash .6s ease-out forwards}
    @keyframes camFlash{from{opacity:.95}to{opacity:0}}
    #album{position:absolute;inset:0;z-index:35;background:rgba(80,40,110,.55);display:flex;align-items:center;justify-content:center;touch-action:auto}
    #album .al{background:#fff6fb;border-radius:28px;padding:14px;width:min(92vw,900px);max-height:92%;display:flex;flex-direction:column;gap:10px;align-items:center;box-shadow:0 10px 40px rgba(60,20,90,.35)}
    #album .big{position:relative;width:100%;display:flex;align-items:center;justify-content:center;gap:8px}
    #album .big img{max-width:calc(100% - 140px);max-height:58vh;border-radius:16px;border:6px solid #fff;box-shadow:0 4px 14px rgba(120,60,140,.3);background:#fff}
    #album .ab{flex:none;width:clamp(52px,11vmin,76px);height:clamp(52px,11vmin,76px);border-radius:50%;border:4px solid #fff;background:#ffe0ef;color:#6d4a92;font:700 clamp(26px,6vmin,40px)/1 var(--font);box-shadow:0 4px 0 #f3a9cc}
    #album .ab.x{position:absolute;top:-6px;right:-6px;background:#ff9ec7;color:#fff}
    #album .ab.del{background:#f4eefc;font-size:clamp(18px,4vmin,26px)}#album .ab.del.armed{background:#ff6f91;color:#fff}
    #album .row{display:flex;gap:8px;overflow-x:auto;max-width:100%;padding:4px;touch-action:pan-x}
    #album .row img{height:clamp(44px,9vmin,70px);border-radius:8px;border:3px solid #fff;opacity:.7}#album .row img.on{border-color:#ff5fa2;opacity:1}
    #album .bar{display:flex;gap:12px;align-items:center}`;
  document.head.appendChild(css);

  /** Draw what is on screen right now into a small JPEG. */
  async function capture() {
    const st = K.stage, m = st.getScreenCTM(), r = st.getBoundingClientRect();
    const x0 = (Math.max(r.left, 0) - m.e) / m.a, y0 = (Math.max(r.top, 0) - m.f) / m.d;
    const x1 = (Math.min(r.right, innerWidth) - m.e) / m.a, y1 = (Math.min(r.bottom, innerHeight) - m.f) / m.d;
    const clone = st.cloneNode(true);
    // copy things CSS hides or fades (closed eyes, sad faces...) so the photo matches the screen
    const src = st.querySelectorAll('*'), dst = clone.querySelectorAll('*');
    for (let i = 0; i < src.length; i++) {
      const cs = getComputedStyle(src[i]);
      if (cs.display === 'none') dst[i].setAttribute('display', 'none');
      else if (cs.opacity !== '1') dst[i].setAttribute('opacity', cs.opacity);
    }
    const W = 640, H = Math.round(W * (y1 - y0) / (x1 - x0));
    clone.setAttribute('viewBox', `${x0} ${y0} ${x1 - x0} ${y1 - y0}`);
    clone.setAttribute('width', W); clone.setAttribute('height', H);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('style', `font-family:${getComputedStyle(st).fontFamily.replace(/"/g, "'")}`);
    clone.removeAttribute('class');
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
    try {
      const img = new Image();
      await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = url; });
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H); cx.drawImage(img, 0, 0, W, H);
      return cv.toDataURL('image/jpeg', 0.7);
    } finally { URL.revokeObjectURL(url); }
  }

  async function snap() {
    K.audio.unlock(); K.audio.sfx('pop');
    const f = document.createElement('div'); f.id = 'camFlash'; document.getElementById('app').appendChild(f);
    setTimeout(() => f.remove(), 700);
    let shot = null;
    try { shot = await capture(); } catch (e) { console.error(e); }
    if (!shot) { K.voice.say('Oops, the camera is sleepy. Try again!'); return; }
    const list = store([...load(), { d: shot, t: Date.now() }].slice(-MAX));
    K.voice.say(K.pick(['Click! Say cheese!', 'What a pretty picture!', 'Click! Into the album!']));
    K.emit('photo');
    open(list.length - 1);
  }

  function open(i) {
    const list = load();
    document.getElementById('album')?.remove();
    const el = document.createElement('div');
    el.id = 'album';
    if (!list.length) {
      el.innerHTML = `<div class="al"><div class="big"><p style="font:700 22px var(--font);color:#6d4a92">No photos yet!</p><button class="ab x" aria-label="Close">×</button></div></div>`;
    } else {
      i = Math.max(0, Math.min(list.length - 1, i));
      el.innerHTML = `<div class="al"><div class="big"><button class="ab prev" aria-label="Previous">‹</button><img src="${list[i].d}" alt="photo"><button class="ab next" aria-label="Next">›</button><button class="ab x" aria-label="Close">×</button></div>
        <div class="row">${list.map((p, k) => `<img data-k="${k}" class="${k === i ? 'on' : ''}" src="${p.d}" alt="">`).join('')}</div>
        <div class="bar"><button class="ab del" aria-label="Throw away this photo">🗑</button></div></div>`;
    }
    document.getElementById('app').appendChild(el);
    const on = (sel, fn) => { const b = el.querySelector(sel); if (b) b.addEventListener('click', (e) => { e.stopPropagation(); K.audio.sfx('tap'); fn(e); }); };
    on('.x', () => el.remove());
    on('.prev', () => open(i - 1));
    on('.next', () => open(i + 1));
    el.querySelectorAll('.row img').forEach((im) => im.addEventListener('click', () => open(+im.dataset.k)));
    // throw away: tap once to get ready, again to delete
    on('.del', (e) => {
      const b = e.currentTarget;
      if (!b.classList.contains('armed')) { b.classList.add('armed'); K.voice.say('Tap again to throw away this photo.', { force: true }); setTimeout(() => b.classList.remove('armed'), 3000); return; }
      const l = load(); l.splice(i, 1); store(l); open(i);
    });
    el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
    const row = el.querySelector('.row .on'); if (row) row.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  K.photos = { snap, open, count: () => load().length };

  // the camera button lives in the corner: tap to take a photo, hold to look at the album
  function addButton() {
    const hud = document.getElementById('hud');
    if (!hud || document.getElementById('camBtn')) return;
    const b = document.createElement('button');
    b.id = 'camBtn'; b.className = 'hud-btn'; b.setAttribute('aria-label', 'Take a photo. Hold to see the album.');
    b.innerHTML = CAM;
    hud.appendChild(b);
    let t = null, held = false;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); held = false; t = setTimeout(() => { held = true; K.audio.sfx('tap'); open(load().length - 1); }, 600); });
    b.addEventListener('pointerup', () => { clearTimeout(t); if (!held) snap(); });
    b.addEventListener('pointerleave', () => clearTimeout(t));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton); else addButton();
})();
