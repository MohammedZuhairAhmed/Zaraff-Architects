/* Zaraff — motion. Inertia scroll, staggered reveals, parallax media.
   No dependencies. Everything here is disabled under prefers-reduced-motion.

   NOTE: the inertia technique fixes #smooth-content to the viewport and drives it
   with translate3d. Anything that must stay pinned to the real viewport — the
   sticky WhatsApp bar, modals — belongs OUTSIDE #smooth-wrapper. */

(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 1. Inertia scroll ---------- */
  function smoothScroll() {
    const content = document.getElementById('smooth-content');
    if (!content || still) return;

    let current = 0, target = 0, running = false;
    // How much of the gap is closed each frame. Lower = heavier, slower settle.
    const EASE = 0.075;

    const setHeight = () => {
      document.body.style.height = content.getBoundingClientRect().height + 'px';
    };
    setHeight();
    new ResizeObserver(setHeight).observe(content);

    Object.assign(content.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', willChange: 'transform'
    });

    const frame = () => {
      current = lerp(current, target, EASE);
      // Park it once the gap is sub-pixel, so we're not burning frames forever.
      if (Math.abs(target - current) < 0.08) { current = target; running = false; }
      content.style.transform = `translate3d(0, ${-current}px, 0)`;
      document.documentElement.style.setProperty('--scroll-y', current.toFixed(1));
      parallax(current);
      if (running) requestAnimationFrame(frame);
    };

    const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', () => { target = scrollY; kick(); }, { passive: true });
    kick();
  }

  /* ---------- 2. Parallax on media ---------- */
  let parallaxNodes = [];
  const collectParallax = () => { parallaxNodes = [...document.querySelectorAll('[data-parallax]')]; };
  function parallax(scrolled) {
    const vh = innerHeight;
    for (const el of parallaxNodes) {
      const box = el.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      // -1 below the fold, 0 at centre, 1 above it.
      const progress = (vh / 2 - mid) / (vh / 2 + box.height / 2);
      const depth = parseFloat(el.dataset.parallax) || 12;
      const inner = el.firstElementChild;
      if (inner) inner.style.transform = `translate3d(0, ${(progress * depth).toFixed(2)}px, 0) scale(1.06)`;
    }
  }

  /* ---------- 3. Staggered reveal ---------- */
  function reveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (still) { items.forEach(el => el.classList.add('is-in')); return; }

    const io = new IntersectionObserver((entries) => {
      // Stagger by position within the entry batch, not by DOM index —
      // otherwise a late section inherits a long delay it never earned.
      let n = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.style.setProperty('--reveal-delay', (n++ * 90) + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(el => io.observe(el));
  }

  const boot = () => { collectParallax(); reveals(); smoothScroll(); };
  document.readyState === 'loading'
    ? addEventListener('DOMContentLoaded', boot)
    : boot();
})();
