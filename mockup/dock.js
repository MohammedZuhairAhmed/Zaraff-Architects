/* Zaraff — the dock. One morphing element instead of a top nav plus a bottom bar.
   Lives OUTSIDE #smooth-content: position:fixed inside a transformed wrapper
   anchors to the wrapper, not the viewport. */

(() => {
  const dock = document.getElementById('dock');
  if (!dock) return;

  const toggle = dock.querySelector('.dock__toggle');
  const panel  = dock.querySelector('.dock__panel');
  const label  = dock.querySelector('.dock__where');
  const still  = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- expand / collapse ---- */
  let open = false;
  const setOpen = (next) => {
    open = next;
    dock.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) panel.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => setOpen(!open));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); } });
  document.addEventListener('click', (e) => { if (open && !dock.contains(e.target)) setOpen(false); });
  panel.hidden = true;

  /* ---- compact on scroll: the dock shrinks once you leave the hero ---- */
  let compact = false;
  const onScroll = () => {
    const next = scrollY > innerHeight * 0.6;
    if (next !== compact) { compact = next; dock.classList.toggle('is-compact', compact); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- "where you are": the compact state reports the current section ---- */
  const sections = [...document.querySelectorAll('[data-section]')];
  if (sections.length && label) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) label.textContent = e.target.dataset.section;
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  if (still) dock.classList.add('no-motion');
})();
