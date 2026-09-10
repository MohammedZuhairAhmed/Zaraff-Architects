import type { Project } from '@/content';

/** The convention on every architecture case study. Credits included, because
 *  the role line is what makes the work attributable. */
export function FactTable({ project }: { project: Project }) {
  const rows: [string, string][] = [
    ['Location', project.location],
    ['Year', String(project.year)],
    ['Status', project.status === 'ongoing' ? 'Ongoing' : 'Completed'],
    ...(project.areaSqft ? ([['Built area', `${project.areaSqft.toLocaleString('en-IN')} sqft`]] as [string, string][]) : []),
    ['Typology', project.typology],
    ['Credits', project.role],
  ];
  return (
    <dl className="zf-facts">
      {rows.map(([k, v]) => (
        <div className="zf-facts__row" key={k}>
          <dt className="zf-facts__key">{k}</dt>
          <dd className="zf-facts__val">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
