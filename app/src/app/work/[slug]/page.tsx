import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProject, getProjectSlugs, getProjects, getSettings } from '@/content/cached';
import { FactTable } from '@/components/FactTable';
import { ProjectGrid } from '@/components/collections/ProjectGrid';
import { DrawingGrid } from '@/components/collections/DrawingGrid';
import { waLink } from '@/lib/whatsapp';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.brief.slice(0, 155),
    openGraph: { title: project.title, description: project.brief.slice(0, 155) },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProject(slug), getSettings()]);
  if (!project) notFound();

  const others = (await getProjects({ excludeSlug: slug, limit: 2 }));

  return (
    <>
      <section className="case-hero">
        <div className="zf-media case-hero__media">
          {project.hero ? (
            <Image src={project.hero.url} alt={project.hero.alt} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="ph"><span>{project.title}</span></div>
          )}
        </div>
      </section>

      <section className="sect sect--flush">
        <div className="wrap case-intro">
          <div>
            <span className={`zf-chip zf-chip--${project.status}`}>
              <i className="zf-chip__dot" />
              {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
            </span>
            <h1 className="zf-display-large">{project.title}</h1>
          </div>
          <p className="zf-body">{project.brief}</p>
        </div>
      </section>

      {project.drawings.length > 0 && (
        <section className="sect">
          <div className="wrap"><DrawingGrid drawings={project.drawings} /></div>
        </section>
      )}

      <section className="sect">
        <div className="wrap case-facts">
          <h2 className="zf-heading">Project facts</h2>
          <FactTable project={project} />
        </div>
      </section>

      {others.length > 0 && (
        <section className="sect">
          <div className="wrap sect__head"><h2 className="zf-display-large">More work</h2></div>
          <div className="wrap"><ProjectGrid projects={others} density="index" columns={2} /></div>
        </section>
      )}

      <section className="sect cta">
        <div className="wrap cta__inner">
          <h2 className="zf-display-large">Want something like this?</h2>
          <a className="zf-btn zf-btn--whatsapp" href={waLink({ number: settings.whatsappNumber, context: project.title })}>
            Ask about {project.title}
          </a>
        </div>
      </section>
    </>
  );
}
