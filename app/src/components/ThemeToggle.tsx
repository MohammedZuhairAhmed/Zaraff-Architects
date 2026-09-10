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
 *   1. the theme is applied immediately, so the page below is already new
 *   2. an overlay painted in the OUTGOING ground colour hides it
 *   3. a hole opens in that overlay at the bulb and grows
 *
 * The new page is revealed THROUGH the hole, so the animation is the reveal
 * rather than a flat colour being painted over everything. Going dark, this
 * reads as darkness spreading from the bulb; going light, as light flooding
 * in. Outside the hole is flat outgoing colour rather than the old page,
 * which is the one thing a snapshot would buy — and snapshots are what made
 * the View Transitions version unpredictable.
 */
const GROUND: Record<Theme, string> = { light: '#F7F4EE', dark: '#12100D' };

const GROW = { light: 820, dark: 640 } as const;

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

    const outgoing: Theme = theme === 'dark' ? 'dark' : 'light';
    busy.current = true;

    // Cover the viewport in the colour we are leaving, then change the theme
    // underneath it. Nothing visibly happens yet.
    const veil = document.createElement('div');
    veil.className = 'theme-unveil';
    veil.style.background = GROUND[outgoing];
    veil.style.setProperty('--ux', `${x}px`);
    veil.style.setProperty('--uy', `${y}px`);
    veil.style.setProperty('--ur', `${Math.ceil(r)}px`);
    document.body.appendChild(veil);
    // Force a frame so the veil paints before the theme flips beneath it.
    void veil.offsetWidth;
    apply(next);

    try {
      // Open a hole at the bulb and grow it. The new page shows through.
      await veil.animate(
        [{ ['--hole' as string]: '0px' }, { ['--hole' as string]: `${Math.ceil(r)}px` }],
        { duration: GROW[next], easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
      ).finished;
    } catch {
      // Interruption must never strand a veil over the page.
    } finally {
      veil.remove();
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
