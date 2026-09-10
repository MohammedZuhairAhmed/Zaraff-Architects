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
    const root = document.documentElement;

    // Copy the page BEFORE the theme changes, so the clone shows the old one.
    const layer = document.createElement('div');
    layer.className = 'theme-reveal';
    layer.setAttribute('data-theme', outgoing);
    layer.setAttribute('aria-hidden', 'true');
    layer.inert = true;

    const inner = document.createElement('div');
    inner.className = 'theme-reveal__page';
    // Non-fixed content sits at document coordinates; pull it up so the clone
    // lines up with what is currently on screen. Fixed descendants anchor to
    // the viewport on their own, which is why the layer must not create a
    // containing block (no transform, no filter, no will-change on it).
    inner.style.top = `${-window.scrollY}px`;
    for (const node of Array.from(document.body.children)) {
      if (node instanceof HTMLScriptElement) continue;
      inner.appendChild(node.cloneNode(true));
    }
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
