'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * A pull-cord bulb.
 *
 * Turning the light ON reveals the new theme through a circle expanding from
 * the bulb itself. Turning it OFF runs the same circle in reverse, so darkness
 * closes in from the far corners back to the bulb.
 *
 * Implemented with the View Transitions API — no library. The browser paints
 * the outgoing and incoming states as layers we can clip; the circle is a real
 * reveal of the new theme, not a fade of a fake overlay.
 *
 * Three states exist (light, dark, follow-the-system) but the control only
 * ever offers the opposite of what you are looking at. Following the system
 * is the default; picking either value opts out of it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [pulling, setPulling] = useState(false);
  const [bloom, setBloom] = useState<{ x: number; y: number; r: number; on: boolean } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

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
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    const rect = ref.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // The cord tugs whether or not the reveal is available.
    setPulling(true);
    window.setTimeout(() => setPulling(false), 420);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !document.startViewTransition) { apply(next); return; }

    // Reach the furthest corner, or the reveal leaves an unlit wedge.
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    // The bloom is the softness. It is a plain element scaled by transform,
    // so it composites on the GPU — unlike mask-size or clip-path, which
    // repaint a full-viewport layer every frame. The clipped reveal below
    // does the honest work; this makes the leading edge feel like light.
    setBloom({ x, y, r, on: next === 'light' });
    window.setTimeout(() => setBloom(null), 700);

    document.documentElement.dataset.themeAnim = next === 'dark' ? 'off' : 'on';
    const transition = document.startViewTransition(() => { apply(next); });

    try {
      await transition.ready;
      const lightOn = next === 'light';
      const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        { clipPath: lightOn ? clip : [...clip].reverse() },
        {
          // Inside the 300-500ms band for a view transition; exit faster than
          // entrance. Longer than this reads as latency, not atmosphere.
          duration: lightOn ? 480 : 380,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'forwards',
          pseudoElement: lightOn ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      );
      await transition.finished;
    } finally {
      delete document.documentElement.dataset.themeAnim;
    }
  };

  const label =
    theme === null ? 'Switch theme' : theme === 'dark' ? 'Turn the light on' : 'Turn the light off';

  return (
    <>
      {bloom && (
        <span
          aria-hidden="true"
          className={`bulb-bloom${bloom.on ? ' is-on' : ''}`}
          style={{
            left: bloom.x,
            top: bloom.y,
            width: bloom.r * 2,
            height: bloom.r * 2,
          }}
        />
      )}
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
        {/* glass */}
        <path
          className="bulb__bowl"
          d="M12 3.2a6 6 0 0 0-3.6 10.8c.5.38.8.95.86 1.57l.06.63h5.36l.06-.63c.06-.62.36-1.19.86-1.57A6 6 0 0 0 12 3.2Z"
        />
        {/* filament */}
        <path className="bulb__filament" d="M10.4 12.2c.5-1.1.9-1.6 1.6-1.6s1.1.5 1.6 1.6" />
        {/* cap */}
        <path className="bulb__cap" d="M9.6 17.6h4.8M10.1 19.4h3.8" />
      </svg>
    </button>
    </>
  );
}
