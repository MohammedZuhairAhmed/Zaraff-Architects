import type { Metadata } from 'next';
import { getSettings, getStudio } from '@/content/cached';
import { waLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Talk to Zaraff on WhatsApp. Send the plot size and location for a rough number.',
};

export default async function ContactPage() {
  const [settings, studio] = await Promise.all([getSettings(), getStudio()]);
  const pretty = `+${settings.whatsappNumber.replace(/\D/g, '')}`;
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1 className="zf-display-mega">Contact</h1>
          <p className="page-head__lead zf-body">
            WhatsApp is fastest. Send the plot size and location and you will usually have a
            rough number the same day.
          </p>
        </div>
      </section>
      <section className="sect sect--flush">
        <div className="wrap contact__grid">
          <a className="contact__card contact__card--wa" href={waLink({ number: settings.whatsappNumber })}>
            <h2 className="zf-heading">WhatsApp</h2>
            <p className="zf-body">{pretty}</p>
            <span className="zf-btn zf-btn--whatsapp">Open a chat</span>
          </a>
          <div className="contact__card">
            <h2 className="zf-heading">Email</h2>
            <p className="zf-body"><a className="zf-link" href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p className="zf-body-small">For drawings, tenders and anything with an attachment.</p>
          </div>
          <div className="contact__card">
            <h2 className="zf-heading">Studio</h2>
            <p className="zf-body">{studio.location}</p>
            <p className="zf-body-small">Visits by appointment. We are usually on site.</p>
          </div>
        </div>
      </section>
    </>
  );
}
