import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/content';

/**
 * The work-index card. Must survive a render, a technical drawing or a phone
 * photo from site — not every project has professional photography, and some
 * have no image at all, which is a supported state rather than a bug.
 */
export function ProjectPlate({ project, featured = false }: { project: Project; featured?: boolean }) {
  const meta = [project.typology, project.areaSqft ? `${project.areaSqft.toLocaleString('en-IN')} sqft` : null, project.location]
    .filter(Boolean)
    .join(', ');

  return (
    <Link className={`zf-plate ${featured ? 'zf-plate--featured' : 'zf-plate--index'}`} href={`/work/${project.slug}`}>
      <div className="zf-plate__media zf-media" style={{ aspectRatio: featured ? '4 / 3' : '3 / 2' }}>
        {project.hero ? (
          <Image
            src={project.hero.url}
            alt={project.hero.alt}
            fill
            // Two-up on desktop, full width on a phone. Getting `sizes` wrong
            // ships desktop bitmaps to phones, which is the usual cause of a
            // slow gallery on the connections we are designing for.
            sizes={featured ? '(max-width: 800px) 100vw, 50vw' : '(max-width: 900px) 100vw, 33vw'}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="ph"><span>{project.title}</span></div>
        )}
        <span className={`zf-chip zf-plate__chip zf-chip--${project.status}`}>
          <i className="zf-chip__dot" />
          {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
        </span>
      </div>
      <div className="zf-plate__foot">
        <div>
          <h3 className="zf-plate__title">{project.title}</h3>
          <p className="zf-plate__meta">{meta}</p>
        </div>
        <span className="zf-plate__year">{project.year}</span>
      </div>
    </Link>
  );
}
