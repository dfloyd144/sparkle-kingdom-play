/* Saved progress in localStorage */
(function () {
  const KEY = 'sparkle-kingdom-save-v1';
  const D = K.data;
  const DEF = () => ({
    v: 1,
    cur: 0,
    names: D.NAMES.slice(),
    looks: D.PRINCESSES.map((p) => Object.assign({}, p)),
    unicorn: {
      name: 'Sparkle', mane: 0, acc: [true, false, false, false, false], hearts: 0,
      needs: { food: 3, mud: [0, 1, 2], messy: true, play: 2 }, doneAt: 0,
    },
    garden: { word: 0, plots: [], flowers: 0 },
    treats: [],
    room: {
      wall: 0, floor: 0,
      items: [
        { t: 'bed', x: 300, y: 560 }, { t: 'rug', x: 640, y: 640 }, { t: 'lamp', x: 1010, y: 560 },
      ],
    },
    tea: { guests: [], cups: [], plates: [] },
    stars: 0,
    settings: { voice: true, music: true, playMins: 20 },
  });
  const NESTED = ['unicorn', 'garden', 'room', 'tea', 'settings'];

  K.save = {
    data: null,
    load() {
      let s = null;
      try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
      const d = DEF();
      if (s && typeof s === 'object') {
        for (const k in s) {
          if (NESTED.includes(k) && s[k] && typeof s[k] === 'object') d[k] = Object.assign(d[k], s[k]);
          else d[k] = s[k];
        }
        // keep saved princesses, and add any new princesses (e.g. Bella) that came with an update
        const def = DEF();
        if (!Array.isArray(d.looks)) d.looks = def.looks;
        if (!Array.isArray(d.names)) d.names = def.names;
        while (d.looks.length < def.looks.length) d.looks.push(def.looks[d.looks.length]);
        while (d.names.length < def.names.length) d.names.push(def.names[d.names.length]);
      }
      // one-time update: Bella has blonde hair
      if (!d.fixBellaHair && d.looks[6]) { d.looks[6].hair = 0; d.fixBellaHair = true; }
      this.data = d;
      return d;
    },
    write() {
      clearTimeout(this._t);
      this._t = setTimeout(() => {
        try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* storage blocked */ }
      }, 200);
    },
    reset() {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      this.data = DEF();
    },
  };
  K.save.load();
  // family setup link (#family=Name1,Name2): names the first and last princess on this device,
  // makes them both blonde, then removes the names from the address bar. Names never live in the code.
  try {
    const m = location.hash.match(/^#family=([^&]+)/);
    if (m) {
      const d = K.save.data, [a, b] = decodeURIComponent(m[1]).split(',').map((s) => s.trim().slice(0, 14));
      const last = d.looks.length - 1;
      if (a) { d.names[0] = a; d.looks[0].hair = 0; }
      if (b && last > 0) { d.names[last] = b; d.looks[last].hair = 0; }
      d.namedOnce = true;
      localStorage.setItem('sparkle-kingdom-save-v1', JSON.stringify(d));
      history.replaceState(null, '', location.pathname + location.search);
    }
  } catch (e) { /* ignore */ }
  K.me = () => K.save.data.looks[K.save.data.cur];
  K.myName = () => K.save.data.names[K.save.data.cur];
})();
