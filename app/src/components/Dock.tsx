'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WhatsAppGlyph } from './WhatsAppGlyph';
import { waLink } from '@/lib/whatsapp';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
  { href: '/studio', label: 'Studio' },
  { href: '/contact', label: 'Contact' },
];

/**
 * One piece of chrome instead of a top nav plus a bottom WhatsApp bar.
 * Full-width over the hero, contracts to a floating pill on scroll, and on
 * small screens sits in the thumb zone and expands upward.
 */
export function Dock({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Which section is on screen. Shown only on small screens, where the nav
  // links are behind the menu and this is the sole indication of place.
  const [section, setSection] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The section wins once you are inside one; the page name is the fallback.
  const here = section ?? NAV.find(n => n.href === pathname)?.label ?? 'Zaraff';

  // Route change should never leave the panel hanging open.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    setSection(null);

    // Band across the middle of the viewport: whichever marked section is
    // crossing it is the one you are looking at.
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setSection(e.target.getAttribute('data-section'));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    // The dock lives in the root layout, so this effect can run before the
    // page's sections are in the DOM — in which case a one-shot query finds
    // nothing and the label never updates. Watch for them instead, and stop
    // watching once they arrive.
    const observed = new WeakSet<Element>();
    const scan = () => {
      const marked = document.querySelectorAll<HTMLElement>('[data-section]');
      marked.forEach(el => {
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
      return marked.length > 0;
    };

    let mo: MutationObserver | null = null;
    if (!scan()) {
      mo = new MutationObserver(() => { if (scan()) { mo?.disconnect(); mo = null; } });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => { io.disconnect(); mo?.disconnect(); };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const onClick = (e: MouseEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const links = NAV.map(n => (
    <Link
      key={n.href}
      href={n.href}
      className={`dock__link${n.href === pathname ? ' is-active' : ''}`}
      aria-current={n.href === pathname ? 'page' : undefined}
    >
      {n.label}
    </Link>
  ));

  return (
    <div ref={dockRef} className={`dock${open ? ' is-open' : ''}`}>
      <div className="dock__inner">
        <Link className="dock__mark" href="/"><span>Zaraff</span></Link>
        <span className="dock__where" aria-hidden="true">{here}</span>
        <nav className="dock__links" aria-label="Main">{links}</nav>
        <a
          className="dock__wa"
          href={waLink({ number: whatsappNumber })}
          aria-label="Message Zaraff on WhatsApp"
        >
          <WhatsAppGlyph className="dock__wa-glyph" />
          <span className="dock__wa-text">Message us</span>
        </a>
        <ThemeToggle />
        <button
          ref={toggleRef}
          type="button"
          className="dock__toggle"
          aria-expanded={open}
          aria-controls="dock-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          <span className="dock__bars" aria-hidden="true" />
        </button>
      </div>
      <div className="dock__panel" id="dock-panel" hidden={!open}>
        <nav className="dock__panel-links" aria-label="All pages">{links}</nav>
        <a className="zf-btn zf-btn--whatsapp dock__panel-cta" href={waLink({ number: whatsappNumber })}>
          Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
