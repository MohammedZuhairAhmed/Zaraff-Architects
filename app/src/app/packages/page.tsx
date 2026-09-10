import type { Metadata } from 'next';
import { getPackages, getSettings } from '@/content/cached';
import { PackageTiers } from '@/components/collections/PackageTiers';
import { waLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Two ways to work with Zaraff: design and drawings, or design and build.',
};

export default async function PackagesPage() {
  const [packages, settings] = await Promise.all([getPackages(), getSettings()]);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1 className="zf-display-mega">Packages</h1>
          <p className="page-head__lead zf-body">
            Two ways to work with us. What a figure comes to depends on the plot, the spec
            and the site, so a measured survey comes before anything in writing.
          </p>
        </div>
      </section>
      <section className="sect sect--flush zf-limewash">
        <div className="wrap">
          <PackageTiers packages={packages} whatsappNumber={settings.whatsappNumber} />
        </div>
        <div className="wrap note">
          <p className="zf-body-small">
            Rates exclude government fees, sanction charges and GST.
          </p>
        </div>
      </section>
      <section className="sect cta">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Send the plot size.<br />Get a real number.</h2>
          <a className="zf-btn zf-btn--whatsapp" href={waLink({ number: settings.whatsappNumber })}>Get a quote</a>
        </div>
      </section>
    </>
  );
}
