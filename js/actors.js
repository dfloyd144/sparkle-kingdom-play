/* Characters that live in scenes: princesses, the unicorn, the bunny */
(function () {
  class Actor {
    constructor(parent, x = 0, y = 0, s = 1, cls = '') {
      this.root = K.el('g', { class: 'actor ' + cls }, parent);
      this.flipG = K.el('g', {}, this.root);
      this.anim = K.el('g', { class: 'anim' }, this.flipG);
      this.anim.style.animationDelay = `-${K.rand(0, 3).toFixed(2)}s`;
      this.x = x; this.y = y; this.s = s; this.face = 1;
      this.depth = null;
      this.place();
    }
    place() {
      this.root.setAttribute('transform', `translate(${this.x.toFixed(1)} ${this.y.toFixed(1)}) scale(${this.s.toFixed(3)})`);
      this.flipG.setAttribute('transform', `scale(${this.face} 1)`);
    }
    setPos(x, y) {
      this.x = x; this.y = y;
      if (this.depth) this.s = this.depth(y);
      this.place();
    }
    faceTo(x) { if (Math.abs(x - this.x) > 4) { this.face = x < this.x ? -1 : 1; this.place(); } }
    play(cls, ms = 1000) {
      this.anim.classList.remove('walk');
      K.replay(this.anim, cls, ms);
      return K.wait(ms);
    }
    happy(ms = 1400) {
      this.root.classList.add('happy');
      clearTimeout(this._h);
      this._h = setTimeout(() => this.root.classList.remove('happy'), ms);
    }
    /** Walk in a straight line. Resolves true on arrival, false if interrupted. */
    walkTo(x, y, speed = 300) {
      if (this._walkDone) this._walkDone(false);
      if (this._stopWalk) this._stopWalk();
      return new Promise((res) => {
        this._walkDone = res;
        this.faceTo(x);
        this.anim.classList.add('walk');
        this.onWalk && this.onWalk(true);
        this._stopWalk = K.every((dt) => {
          const d = K.dist(this.x, this.y, x, y);
          const step = speed * dt * (this.depth ? this.s / 0.8 : 1);
          if (d <= step) {
            this.setPos(x, y);
            this.anim.classList.remove('walk');
            this.onWalk && this.onWalk(false);
            this._walkDone = null; this._stopWalk = null;
            res(true);
            return false;
          }
          this.setPos(this.x + ((x - this.x) / d) * step, this.y + ((y - this.y) / d) * step);
        });
      });
    }
    stop() {
      if (this._stopWalk) this._stopWalk();
      if (this._walkDone) this._walkDone(false);
      this._stopWalk = this._walkDone = null;
      this.anim.classList.remove('walk');
      this.onWalk && this.onWalk(false);
    }
  }

  class Princess extends Actor {
    constructor(parent, look, x, y, s) {
      super(parent, x, y, s, 'princess' + (look === K.me() ? ' player' : ''));
      this.setLook(look);
      if (look === K.me() && K.needs && K.needs.mood() === 'sad' && K.needs.enabled()) this.root.classList.add('sad');
    }
    setLook(look) { this.look = look; this.anim.innerHTML = K.art.princess(look); }
  }

  class Unicorn extends Actor {
    constructor(parent, u, x, y, s) {
      super(parent, x, y, s, 'uni');
      this.setLook(u);
      this.onWalk = (on) => this.root.classList.toggle('trot', on);
    }
    setLook(u) { this.u = u; this.anim.innerHTML = K.art.unicorn(u); }
    eat() { K.replay(this.root, 'eat', 1300); }
  }

  class Bunny extends Actor {
    constructor(parent, x, y, s, hat = true) {
      super(parent, x, y, s, 'bunny');
      this.anim.innerHTML = K.art.bunny(hat);
    }
  }

  /**
   * Let a child pick a character up and drag it around.
   * o.clamp(x,y) -> {x,y}, o.tap(p), o.can() -> bool, o.lift(), o.drop(actor)
   */
  K.makeDraggable = (actor, o = {}) => {
    let held = false;
    K.drag(actor.root, {
      start: () => (o.can && !o.can() ? false : undefined),
      move: (p, dx, dy, moved) => {
        if (!moved) return;
        if (!held) {
          held = true;
          actor.stop();
          actor.dragging = true;
          actor.root.classList.add('held');
          actor.root.parentNode.appendChild(actor.root);
          actor.happy(60000);
          K.audio.sfx('pop');
          o.lift && o.lift(actor);
        }
        const fy = p.y + 110 * actor.s; // finger holds her middle, feet hang below
        const q = o.clamp ? o.clamp(p.x, fy) : { x: p.x, y: fy };
        if (Math.abs(q.x - actor.x) > 3) actor.faceTo(q.x);
        actor.setPos(q.x, q.y);
      },
      end: () => {
        if (!held) return;
        held = false;
        actor.dragging = false;
        actor.root.classList.remove('held');
        actor.happy(900);
        actor.play('a-hop', 450);
        K.audio.sfx('boing');
        K.fx.sparkle(actor.x, actor.y - 10, { n: 8, spread: 50, size: 8 });
        o.drop && o.drop(actor);
      },
      tap: (p) => { if (actor.root.classList.contains('player') && K.onPlayerTap && K.onPlayerTap(actor.root)) return; if (o.tap) o.tap(p); },
    });
  };

  K.Actor = Actor;
  K.Princess = Princess;
  K.Unicorn = Unicorn;
  K.Bunny = Bunny;

  /** Keep actor elements stacked by y (things lower on screen are in front). */
  K.sortByY = (group, actors) => {
    const sorted = actors.slice().sort((a, b) => (a.z ?? a.y) - (b.z ?? b.y));
    const kids = Array.from(group.children).filter((c) => sorted.some((a) => a.root === c));
    if (kids.every((c, i) => c === sorted[i].root)) return; // already in order (moving nodes restarts CSS animations)
    sorted.forEach((a) => group.appendChild(a.root));
  };
})();
