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
 *   1. a disc of the DESTINATION colour scales up from the bulb
 *   2. once it covers the viewport, the theme is applied underneath it
 *   3. the disc fades, revealing the newly themed page
 *
 * Because the disc is already the incoming ground colour, step 2 is
 * invisible — there is no flash, and the origin cannot drift.
 */
const GROUND: Record<Theme, string> = { light: '#F7F4EE', dark: '#12100D' };

const GROW = { light: 820, dark: 640 } as const;
const SETTLE = 220;

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
    // No rect means no bulb on screen; switch without the flourish rather
    // than guessing an origin.
    if (!rect) { apply(next); return; }

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // Reach the furthest corner so the disc covers the viewport completely.
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    busy.current = true;
    const disc = document.createElement('div');
    disc.className = 'theme-flood';
    disc.style.left = `${x}px`;
    disc.style.top = `${y}px`;
    disc.style.width = disc.style.height = `${r * 2}px`;
    disc.style.background = GROUND[next];
    document.body.appendChild(disc);

    try {
      // Grow the destination colour out of the bulb.
      await disc.animate(
        { transform: ['translate(-50%,-50%) scale(0)', 'translate(-50%,-50%) scale(1)'] },
        { duration: GROW[next], easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'forwards' },
      ).finished;

      // The disc now covers everything and is already the incoming ground
      // colour, so swapping the theme beneath it cannot be seen.
      apply(next);

      await disc.animate({ opacity: [1, 0] }, { duration: SETTLE, easing: 'linear', fill: 'forwards' }).finished;
    } catch {
      // An interrupted animation must never strand the page mid-swap.
      apply(next);
    } finally {
      disc.remove();
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
