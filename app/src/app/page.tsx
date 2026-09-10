import Link from 'next/link';
import { getProjects, getServices, getPackages, getSettings } from '@/content/cached';
import { ProjectPlate } from '@/components/ProjectPlate';
import { PackageTier } from '@/components/PackageTier';
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
      <section className="film">
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

      <section className="sect">
        <div className="wrap sect__head">
          <h2 className="zf-display-large">Selected work</h2>
          <Link className="zf-link" href="/work">All projects</Link>
        </div>
        <div className="wrap grid grid--2">
          {featured.map(p => <ProjectPlate key={p.slug} project={p} featured />)}
        </div>
        <div className="wrap grid grid--3 grid--tight">
          {recent.map(p => <ProjectPlate key={p.slug} project={p} />)}
        </div>
      </section>

      <section className="sect sect--split">
        <div className="wrap split">
          <h2 className="zf-display-large">What we do</h2>
          <div className="split__body">
            {services.map(s => (
              <div className="svc" key={s.slug}>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect zf-light">
        <div className="wrap sect__head">
          <h2 className="zf-display-large">Two ways to work with us</h2>
          <Link className="zf-link" href="/packages">Compare in full</Link>
        </div>
        <div className="wrap zf-packages">
          {packages.map(p => (
            <PackageTier key={p.slug} pkg={p} whatsappNumber={settings.whatsappNumber} />
          ))}
        </div>
      </section>

      <section className="sect cta zf-grain">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Tell us the plot size.<br />We will tell you the number.</h2>
          <p className="zf-body">Most conversations start on WhatsApp and take about a minute.</p>
          <a className="zf-btn zf-btn--whatsapp" href={wa}>Start on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
