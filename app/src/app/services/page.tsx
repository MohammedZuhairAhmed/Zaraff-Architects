import type { Metadata } from 'next';
import { getServices, getSettings } from '@/content/cached';
import { ServiceList } from '@/components/collections/ServiceList';
import { waLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Architectural design, 3D visualisation, interiors and turnkey construction in Hyderabad.',
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1 className="zf-display-mega">Services</h1>
          <p className="page-head__lead zf-body">
            Take any one of them on its own, or hand us the whole job.
          </p>
        </div>
      </section>
      <section className="sect sect--flush">
        <div className="wrap"><ServiceList services={services} density="full" /></div>
      </section>
      <section className="sect cta zf-grain">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Not sure which you need?</h2>
          <p className="zf-body">Send us the plot details and we will tell you honestly.</p>
          <a className="zf-btn zf-btn--whatsapp" href={waLink({ number: settings.whatsappNumber })}>Ask on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
