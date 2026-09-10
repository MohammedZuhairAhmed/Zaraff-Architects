import type { Metadata } from 'next';
import { getStudio, getSettings } from '@/content/cached';
import { waLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Zaraff is an architecture practice in Hyderabad that draws buildings and stays to build them.',
};

export default async function StudioPage() {
  const [studio, settings] = await Promise.all([getStudio(), getSettings()]);
  return (
    <>
      <section className="page-head">
        <div className="wrap"><h1 className="zf-display-mega">Studio</h1></div>
      </section>
      <section className="sect sect--flush">
        <div className="wrap studio__grid">
          <div className="zf-media" style={{ aspectRatio: '3 / 4' }}>
            <div className="ph"><span>On site</span></div>
          </div>
          <div className="studio__body">
            <p className="zf-display">{studio.intro}</p>
            {studio.body && <p className="zf-body">{studio.body}</p>}
            <p className="zf-body">
              We work mostly on private houses and interior fitouts around {studio.location.split(',')[0]}.
              We are small on purpose: the person who drew your plan is the person you meet on site.
            </p>
            {studio.stats.length > 0 && (
              <dl className="hero__stats">
                {studio.stats.map(s => (
                  <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>
      <section className="sect cta zf-grain">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Come and see a site.</h2>
          <p className="zf-body">We would rather show you a building than a brochure.</p>
          <a className="zf-btn zf-btn--whatsapp" href={waLink({ number: settings.whatsappNumber })}>Arrange a visit</a>
        </div>
      </section>
    </>
  );
}
