import type { Project } from '@/content';
import { ProjectPlate } from '../ProjectPlate';

type Density = 'featured' | 'index';

/**
 * Renders however many projects it is given.
 *
 * The layout decision lives here, once, rather than being copy-pasted as
 * `grid grid--2` into every page that happens to show projects. Pages say
 * what they want shown; this decides how a collection of that size looks.
 */
export function ProjectGrid({
  projects,
  density = 'featured',
  columns,
  empty = 'No projects to show yet.',
}: {
  projects: Project[];
  density?: Density;
  /** Defaults to 2 for featured, 3 for index. Override only with a reason. */
  columns?: 2 | 3;
  empty?: string;
}) {
  if (projects.length === 0) {
    return <p className="zf-body collection-empty">{empty}</p>;
  }

  const cols = columns ?? (density === 'featured' ? 2 : 3);
  // A single item in a multi-column grid leaves a hole; let it run full width.
  const single = projects.length === 1;

  return (
    <div className={`grid ${single ? 'grid--1' : `grid--${cols}`}`}>
      {projects.map(p => (
        <ProjectPlate key={p.slug} project={p} featured={density === 'featured'} />
      ))}
    </div>
  );
}
