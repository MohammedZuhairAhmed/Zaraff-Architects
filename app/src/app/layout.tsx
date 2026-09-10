import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { getSettings, getStudio } from '@/content/cached';
import { Dock } from '@/components/Dock';
import { SiteFooter } from '@/components/SiteFooter';
import { ThemeScript } from '@/components/ThemeScript';
import { Intro } from '@/components/Intro';
import { IntroScript } from '@/components/IntroScript';
import '@/styles/index.css';

/**
 * Self-hosted at build time. Replaces the Google Fonts @import that was
 * render-blocking every page load and adding a third-party request.
 */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zaraff.in'),
  title: {
    default: 'Zaraff — Architects & Interiors, Hyderabad',
    template: '%s — Zaraff',
  },
  description:
    'Zaraff designs houses and builds them. Drawings, 3D walkthroughs and site execution from one accountable team in Hyderabad.',
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'Zaraff' },
  // Draft only. Remove before launch — see the technical plan.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#12100D' },
  ],
  colorScheme: 'light dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, studio] = await Promise.all([getSettings(), getStudio()]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://zaraff.in/#studio',
    name: studio.name,
    description: studio.intro,
    address: { '@type': 'PostalAddress', addressLocality: studio.location },
    email: settings.email,
    telephone: `+${settings.whatsappNumber.replace(/\D/g, '')}`,
    ...(studio.foundedYear ? { foundingDate: String(studio.foundedYear) } : {}),
  };

  return (
    <html lang="en-IN" className={archivo.variable} suppressHydrationWarning>
      {/* Extensions (ColorZilla, Grammarly, password managers) inject
          attributes onto <body> before React hydrates, which reads as a
          mismatch React cannot patch. Scoped to this element's own
          attributes — it does not hide mismatches in the tree below. */}
      <body suppressHydrationWarning>
        {/* First child of <body> so the theme lands before anything paints. */}
        <ThemeScript />
        <IntroScript />
        {/* Opaque and above everything, so it has to precede the content it
            covers — the markup is inert until IntroScript arms it. */}
        <Intro />
        <a className="zf-skip" href="#main">Skip to content</a>
        {settings.draftNotice && <div className="draft-flag">{settings.draftNotice}</div>}

        {/* The dock is fixed chrome and must sit outside the scroll wrapper. */}
        <div id="smooth-wrapper"><div id="smooth-content">
          <main id="main">{children}</main>
          <SiteFooter studio={studio} settings={settings} />
        </div></div>

        <Dock whatsappNumber={settings.whatsappNumber} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
