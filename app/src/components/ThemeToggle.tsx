'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * A pull-cord bulb that floods the screen with light.
 *
 * Deliberately NOT the View Transitions API. That version failed in ways I
 * could not control or reproduce: `ready` rejecting with InvalidStateError,
 * snapshot geometry, and behaviour differing between Chrome versions. For a
 * decorative flourish that is a bad trade.
 *
 * This is one absolutely-positioned circle, animated with `transform` only,
 * so it composites on the GPU and behaves identically everywhere:
 *
 * A circular reveal from the bulb that keeps every component on screen.
 *
 * The old rendering has to stay visible outside the circle while the DOM
 * already carries the new theme, which needs a copy of the page. View
 * Transitions provides one but proved unreliable across Chrome versions
 * here, so the copy is made explicitly: clone the page, force the OUTGOING
 * theme on the clone, lay it over the top, and open a hole in it at the
 * bulb. Real old content outside the hole, real new content inside.
 *
 * The clone is inert, aria-hidden, and has its animations disabled, so it is
 * a still image as far as the user and assistive tech are concerned.
 */
const GROW = { light: 620, dark: 520 } as const;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [pulling, setPulling] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem('zf-theme');
    if (stored === 'light' || stored === 'dark') { setTheme(stored); return; }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(media.matches ? 'dark' : 'light');
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('zf-theme')) setTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('zf-theme', next); } catch {}
    setTheme(next);
  };

  const flip = async () => {
    if (busy.current) return;
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    setPulling(true);
    window.setTimeout(() => setPulling(false), 420);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(next);
      return;
    }

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) { apply(next); return; }
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Reach the furthest corner, or the reveal leaves an unrevealed wedge.
    const r = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));

    const outgoing: Theme = theme === 'dark' ? 'dark' : 'light';
    busy.current = true;

    // Copy the page BEFORE the theme changes, so the clone shows the old one.
    const layer = document.createElement('div');
    layer.className = 'theme-reveal';
    layer.setAttribute('data-theme', outgoing);
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;

    const inner = document.createElement('div');
    inner.className = 'theme-reveal__page';
    // Align the clone with the real page.
    //
    // The clone container is absolutely positioned inside the layer, so it
    // does NOT inherit body's padding or margin the way the real flow
    // content does. Ignoring that put every cloned element 26px high — the
    // draft banner's padding-top — and as the hole grew, content swapped
    // between two copies at different heights. That is the layout shift.
    const bodyBox = getComputedStyle(document.body);
    const offsetTop =
      parseFloat(bodyBox.marginTop) + parseFloat(bodyBox.borderTopWidth) + parseFloat(bodyBox.paddingTop);
    const offsetLeft =
      parseFloat(bodyBox.marginLeft) + parseFloat(bodyBox.borderLeftWidth) + parseFloat(bodyBox.paddingLeft);
    // Track scroll for as long as the clone is mounted. The clone is pinned
    // to the scroll offset captured at click time, so any scrolling during
    // the reveal — trackpad momentum after the click is enough — leaves it
    // stale and the two copies visibly slide apart. 160px of scroll produced
    // 105px of drift before this.
    const syncScroll = () => {
      inner.style.top = `${offsetTop - window.scrollY}px`;
      inner.style.left = `${offsetLeft - window.scrollX}px`;
    };
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    inner.style.right = 'auto';
    inner.style.width = `${document.body.clientWidth - parseFloat(bodyBox.paddingLeft) - parseFloat(bodyBox.paddingRight)}px`;
    for (const node of Array.from(document.body.children)) {
      if (node instanceof HTMLScriptElement) continue;
      const copy = node.cloneNode(true) as HTMLElement;
      // A still image has no reason to fetch, decode or play. Images are
      // left alone: they come from cache and are part of what is revealed.
      copy.querySelectorAll?.('video, iframe, canvas, object, embed').forEach(el => el.remove());
      // Strip ids so the clone does not duplicate every id in the document
      // while it is mounted. Duplicates break getElementById, in-page
      // anchors and aria-labelledby for the ~1s the clone exists.
      if (copy.id) copy.removeAttribute('id');
      copy.querySelectorAll?.('[id]').forEach(el => el.removeAttribute('id'));
      inner.appendChild(copy);
    }

    // No content-visibility on off-screen clone sections. It saved about 4ms
    // on a toggle that costs 1ms, and it is the only change between the
    // reveal being right and the layout shift returning. Skipped sections
    // are decided once at click time, so anything that scrolls into view
    // mid-reveal renders blank in the clone — and the reserved-space maths
    // has already been wrong once. Not worth it at this page size.
    // If the site ever gets heavy enough to need it, re-evaluate visibility
    // on scroll as well, and verify while the page is MOVING.

    layer.appendChild(inner);
    layer.style.setProperty('--ux', `${x}px`);
    layer.style.setProperty('--uy', `${y}px`);
    document.body.appendChild(layer);

    // Now flip the real page. It is hidden behind the clone.
    apply(next);

    try {
      await layer.animate(
        [{ ['--hole' as string]: '0px' }, { ['--hole' as string]: `${r}px` }],
        { duration: GROW[next], easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
      ).finished;
    } catch {
      // An interrupted reveal must never strand a clone over the page.
    } finally {
      window.removeEventListener('scroll', syncScroll);
      layer.remove();
      busy.current = false;
    }
  };

  const label =
    theme === null ? 'Switch theme' : theme === 'dark' ? 'Turn the light on' : 'Turn the light off';

  return (
    <button
      ref={ref}
      type="button"
      className={`bulb${pulling ? ' is-pulling' : ''}${theme === 'light' ? ' is-lit' : ''}`}
      onClick={flip}
      aria-label={label}
      title={label}
    >
      <span className="bulb__cord" aria-hidden="true" />
      <svg className="bulb__glass" viewBox="0 0 24 24" aria-hidden="true">
        <path
          className="bulb__bowl"
          d="M12 3.2a6 6 0 0 0-3.6 10.8c.5.38.8.95.86 1.57l.06.63h5.36l.06-.63c.06-.62.36-1.19.86-1.57A6 6 0 0 0 12 3.2Z"
        />
        <path className="bulb__filament" d="M10.4 12.2c.5-1.1.9-1.6 1.6-1.6s1.1.5 1.6 1.6" />
        <path className="bulb__cap" d="M9.6 17.6h4.8M10.1 19.4h3.8" />
      </svg>
    </button>
  );
}
