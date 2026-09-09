/* Zaraff — comparison slider for the static mockups.
   Mirrors ComparisonHero.jsx so behaviour matches the real component:
   pointer drag, keyboard slider, and a toggle fallback on coarse+narrow. */

(() => {
  const clamp = n => Math.max(0, Math.min(100, n));
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.zf-compare').forEach((box) => {
    const clip    = box.querySelector('.zf-compare__clip');
    const divider = box.querySelector('.zf-compare__divider');
    const handle  = box.querySelector('.zf-compare__handle');
    const hint    = box.querySelector('.zf-compare__hint');
    if (!clip || !divider || !handle) return;

    let pos = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    let dragging = false, touched = false;

    const paint = () => {
      clip.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      divider.style.left  = pos + '%';
      handle.setAttribute('aria-valuenow', Math.round(pos));
      handle.setAttribute('aria-valuetext', Math.round(pos) + ' per cent render');
      if (touched && hint) hint.style.opacity = '0';
    };

    const fromEvent = (e) => {
      const r = box.getBoundingClientRect();
      pos = clamp(((e.clientX - r.left) / r.width) * 100);
      touched = true;
      paint();
    };

    box.addEventListener('pointerdown', (e) => {
      dragging = true;
      box.setPointerCapture?.(e.pointerId);
      fromEvent(e);
    });
    box.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    const stop = () => { dragging = false; };
    box.addEventListener('pointerup', stop);
    box.addEventListener('pointercancel', stop);

    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft')  { pos = clamp(pos - step); touched = true; paint(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { pos = clamp(pos + step); touched = true; paint(); e.preventDefault(); }
      if (e.key === 'Home')       { pos = 0;   paint(); e.preventDefault(); }
      if (e.key === 'End')        { pos = 100; paint(); e.preventDefault(); }
    });

    /* Toggle fallback: 190px of travel per side on a phone is not a drag. */
    const decide = () => {
      const coarse = matchMedia('(pointer: coarse)').matches;
      const narrow = matchMedia('(max-width: 520px)').matches;
      box.classList.toggle('is-toggle', still || (coarse && narrow));
    };
    decide();
    addEventListener('resize', decide);

    box.closest('section')?.querySelector('.zf-compare__toggle')
      ?.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const showRender = btn.dataset.side === 'a';
        pos = showRender ? 100 : 0;
        touched = true;
        paint();
        btn.parentElement.querySelectorAll('button')
           .forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      });

    paint();
  });
})();
