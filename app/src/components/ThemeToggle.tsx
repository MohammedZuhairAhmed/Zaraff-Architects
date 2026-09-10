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

    // The cord tugs regardless of whether the reveal is available.
    setPulling(true);
    window.setTimeout(() => setPulling(false), 420);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // A full-screen wipe is exactly the motion that causes trouble for some
    // people, so reduced motion gets the switch with no animation at all.
    if (reduced || !document.startViewTransition) { apply(next); return; }

    const rect = ref.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // Reach the furthest corner, or the reveal leaves an unlit wedge.
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.documentElement.dataset.themeAnim = next === 'dark' ? 'off' : 'on';
    const transition = document.startViewTransition(() => { apply(next); });

    try {
      await transition.ready;

      const lightOn = next === 'light';
      const pseudo = lightOn ? '::view-transition-new(root)' : '::view-transition-old(root)';

      // A hard clip-path circle reads as a wipe. A radial mask with a soft
      // stop gives the leading edge a falloff, so it reads as light spreading.
      // mask-size and mask-position animate together to keep the circle
      // centred on the bulb as it grows.
      const size = (n: number) => `${n * 2}px ${n * 2}px`;
      const pos = (n: number) => `${x - n}px ${y - n}px`;
      const frames: Keyframe[] = [
        { maskSize: size(0), maskPosition: pos(0) },
        { maskSize: size(r), maskPosition: pos(r) },
      ];

      document.documentElement.animate(lightOn ? frames : [...frames].reverse(), {
        duration: lightOn ? 900 : 700,
        // Fast out of the bulb, long settle — light floods then eases.
        easing: lightOn ? 'cubic-bezier(.16,.84,.34,1)' : 'cubic-bezier(.5,0,.75,.2)',
        fill: 'forwards',
        pseudoElement: pseudo,
      });

      await transition.finished;
    } finally {
      delete document.documentElement.dataset.themeAnim;
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
  );
}
