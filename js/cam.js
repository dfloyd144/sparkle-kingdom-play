/* Phone camera for rooms that were drawn for a sideways screen.
   Held upright, a phone shows those rooms very small. K.cam zooms the room in and follows the princess,
   while the room's buttons and trays stay "pinned" exactly where they are on the screen today.
   It works by moving the stage viewBox, so taps, drags and effects all stay lined up.

   K.cam(root, { zoom, follow: () => x, pinned: [elements], floorY, uiTopY, arrows })
     follow   x position (in room units) to keep in the middle
     pinned   buttons / trays that must stay fixed on screen
     floorY   the room line that should sit just above the bottom tray
     uiTopY   the top edge of the bottom tray in the room's own drawing units */
(function () {
  const isTall = () => document.body.classList.contains('tall');
  K.cam = (root, o = {}) => {
    if (!isTall()) return null;
    const Z = o.zoom || 1.6;
    const arrowArt = (dir) => `<g class="bob"><circle r="40" fill="#fff" opacity=".9" stroke="#ffb3d4" stroke-width="5"/><path d="M${dir * -8} -16 L${dir * 10} 0 L${dir * -8} 16" stroke="#ff5fa2" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g><circle r="56" fill="#fff" opacity="0"/>`;
    const arrL = K.g(arrowArt(-1), root), arrR = K.g(arrowArt(1), root);
    // pinned things go on top of the arrows, so a pinned pop-up covers them
    const pinG = K.g('', root);
    (o.pinned || []).filter(Boolean).forEach((el) => pinG.appendChild(el));
    const dims = () => {
      const W = 1200 / Z, H = (W * innerHeight) / innerWidth;
      return { W, H, y0: (o.floorY === undefined ? 700 : o.floorY) - H / 2 - ((o.uiTopY === undefined ? 667 : o.uiTopY) - 400) / Z };
    };
    let camX = null, camT = 0, manual = false, lastF = null;
    const pan = (dir) => { const { W } = dims(); manual = true; camT = K.clamp(camX + dir * W * 0.65, 0, 1200 - W); K.audio.sfx('swoosh'); };
    K.tap(arrL, () => pan(-1)); K.tap(arrR, () => pan(1));
    K.every(() => {
      if (!isTall() || !root.isConnected) return; // turned sideways: the normal full view takes over
      const { W, H, y0 } = dims();
      const f = o.follow ? o.follow() : 600;
      if (lastF !== null && Math.abs(f - lastF) > 0.5) manual = false; // she moved: follow her again
      lastF = f;
      if (!manual) camT = K.clamp(f - W / 2, 0, 1200 - W);
      camX = camX === null ? camT : camX + (camT - camX) * 0.12;
      K.stage.setAttribute('viewBox', `${camX.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`);
      // pinned things keep today's place on the screen: their own 1200-wide layout squeezed into the view
      pinG.setAttribute('transform', `translate(${camX.toFixed(1)} ${(y0 + H / 2 - 400 / Z).toFixed(1)}) scale(${(1 / Z).toFixed(4)})`);
      const ay = y0 + H * (150 / innerHeight) + 64, show = o.arrows !== false;
      arrL.setAttribute('transform', `translate(${camX + 52} ${ay})`); arrL.setAttribute('display', show && camX > 6 ? '' : 'none');
      arrR.setAttribute('transform', `translate(${camX + W - 52} ${ay})`); arrR.setAttribute('display', show && camX < 1200 - W - 6 ? '' : 'none');
    });
    // put the normal view back when she leaves the room
    const scene = K.cur, oldExit = scene && scene.exit;
    if (scene && !scene._camExit) {
      scene._camExit = true;
      scene.exit = function () { if (oldExit) oldExit.call(scene); K.stage.setAttribute('viewBox', innerWidth / innerHeight > 1.62 ? '0 64 1200 736' : '0 0 1200 800'); };
    }
    return { pin: (el) => pinG.appendChild(el), pinG };
  };
})();
