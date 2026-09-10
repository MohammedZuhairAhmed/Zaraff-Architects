'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Three states exist — light, dark, and "follow the system" — but the control
 * only ever offers the opposite of what you are looking at. Following the
 * system is the default; choosing either value opts out of it.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('zf-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(media.matches ? 'dark' : 'light');
    // Keep tracking the system while the visitor has made no explicit choice.
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('zf-theme')) setTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('zf-theme', next); } catch {}
    setTheme(next);
  };

  // Render nothing until the effect resolves, so the server markup and the
  // first client render agree and there is no hydration mismatch.
  const label = theme === null ? 'Switch theme' : `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <button
      type="button"
      className="dock__theme"
      onClick={flip}
      aria-label={label}
      title={label}
    >
      <span className="dock__theme-icon" aria-hidden="true" suppressHydrationWarning>
        {theme === 'dark' ? '☀' : '☾'}
      </span>
    </button>
  );
}
