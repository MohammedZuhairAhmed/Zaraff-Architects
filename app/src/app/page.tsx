import Link from 'next/link';
import { getProjects, getServices, getPackages, getSettings } from '@/content/cached';
import { ProjectGrid } from '@/components/collections/ProjectGrid';
import { PackageTiers } from '@/components/collections/PackageTiers';
import { ServiceList } from '@/components/collections/ServiceList';
import { waLink } from '@/lib/whatsapp';

export default async function HomePage() {
  const [featured, recent, services, packages, settings] = await Promise.all([
    getProjects({ featured: true, limit: 2 }),
    getProjects({ limit: 3 }),
    getServices(),
    getPackages(),
    getSettings(),
  ]);
  const wa = waLink({ number: settings.whatsappNumber });

  return (
    <>
      <section className="film" data-section="Home">
        <div className="film__media">
          <div className="film__stand-in" aria-hidden="true" />
        </div>
        <div className="film__scrim" />
        <div className="wrap film__copy">
          <h1 className="zf-display-mega">We draw it,<br />then we build it.</h1>
          <p className="film__lead">
            One studio from the first line to the day you get the keys.
          </p>
          <div className="film__cta">
            <a className="zf-btn zf-btn--whatsapp" href={wa}>Get a quote on WhatsApp</a>
            <Link className="zf-btn zf-btn--secondary" href="/work">See the work</Link>
          </div>
        </div>
        <div className="film__cue" aria-hidden="true"><span /></div>
      </section>

      <section className="sect" data-section="Work">
        <div className="wrap sect__head">
          <h2 className="zf-display-large">Selected work</h2>
          <Link className="zf-link" href="/work">All projects</Link>
        </div>
        <div className="wrap"><ProjectGrid projects={featured} density="featured" /></div>
        <div className="wrap grid--tight"><ProjectGrid projects={recent} density="index" /></div>
      </section>

      <section className="sect sect--split" data-section="Services">
        <div className="wrap split">
          <h2 className="zf-display-large">What we do</h2>
          <div className="split__body">
            <ServiceList services={services} density="summary" />
          </div>
        </div>
      </section>

      <section className="sect zf-limewash" data-section="Packages">
        <div className="wrap sect__head">
          <h2 className="zf-display-large">Two ways to work with us</h2>
          <Link className="zf-link" href="/packages">Compare in full</Link>
        </div>
        <div className="wrap">
          <PackageTiers packages={packages} whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>

      <section className="sect cta zf-grain" data-section="Contact">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Tell us the plot size.<br />We will tell you the number.</h2>
          <p className="zf-body">Most conversations start on WhatsApp and take about a minute.</p>
          <a className="zf-btn zf-btn--whatsapp" href={wa}>Start on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
