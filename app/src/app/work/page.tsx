import type { Metadata } from 'next';
import { getProjects } from '@/content/cached';
import { ProjectGrid } from '@/components/collections/ProjectGrid';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Houses, apartments and interiors drawn and built by Zaraff in Hyderabad.',
};

export default async function WorkPage() {
  const projects = await getProjects();
  const completed = projects.filter(p => p.status === 'completed').length;
  const ongoing = projects.filter(p => p.status === 'ongoing').length;

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1 className="zf-display-mega">Work</h1>
          <p className="page-head__lead zf-body">
            {completed} delivered, {ongoing} on site right now. Every one of them drawn and
            built by the same team.
          </p>
        </div>
      </section>
      <section className="sect sect--flush">
        <div className="wrap">
          <ProjectGrid projects={projects} density="featured" empty="The first projects are being photographed." />
        </div>
      </section>
    </>
  );
}
