import Link from 'next/link';
import { cacheLife } from 'next/cache';
import type { Studio, SiteSettings } from '@/content';

const PAGES = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
];
const STUDIO_LINKS = [
  { href: '/studio', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/**
 * `new Date()` is unstable across renders, so reading it directly blocks the
 * prerender. Giving it its own cached scope keeps the footer in the static
 * shell while still rolling over — daily, which is ample for a copyright year.
 */
async function currentYear(): Promise<number> {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export async function SiteFooter({ studio, settings }: { studio: Studio; settings: SiteSettings }) {
  const year = await currentYear();
  return (
    <footer className="foot zf-limewash">
      <div className="wrap foot__grid">
        <div>
          <p className="foot__mark">{studio.name}</p>
          <p className="zf-body-small">{studio.tagline}<br />{studio.location}</p>
        </div>
        <div>
          <p className="foot__h">Pages</p>
          {PAGES.map(l => <span key={l.href}><Link className="zf-link" href={l.href}>{l.label}</Link><br /></span>)}
        </div>
        <div>
          <p className="foot__h">Studio</p>
          {STUDIO_LINKS.map(l => <span key={l.href}><Link className="zf-link" href={l.href}>{l.label}</Link><br /></span>)}
        </div>
        <div>
          <p className="foot__h">Talk to us</p>
          <a className="zf-link" href={`mailto:${settings.email}`}>{settings.email}</a>
        </div>
      </div>
      <div className="wrap foot__base zf-body-small">
        <span>&copy; {year} {studio.name}</span>
        <span>Drawn and built in {studio.location.split(',')[0]}</span>
      </div>
    </footer>
  );
}
