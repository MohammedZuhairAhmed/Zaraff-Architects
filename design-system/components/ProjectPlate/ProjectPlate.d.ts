import * as React from 'react';

export interface ProjectMediaProps {
  src?: string;
  alt?: string;
  /** render = Enscape output, drawing = plan or elevation (contained on light), photo = from site. */
  kind?: 'render' | 'drawing' | 'photo';
  /** CSS aspect-ratio, e.g. "4 / 3". */
  ratio?: string;
  /** Shot credit, over the image. */
  credit?: string;
  className?: string;
}

export declare function ProjectMedia(props: ProjectMediaProps): JSX.Element;

export interface ProjectPlateProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  typology?: string;
  /** Area in square feet. Formatted with Indian digit grouping. */
  area?: number | string;
  location?: string;
  year?: number | string;
  status?: 'ongoing' | 'completed';
  /** Override the chip label, e.g. "Under construction". */
  statusLabel?: string;
  media?: ProjectMediaProps;
  /** featured = large plate at the top of the index. index = compact grid item. */
  density?: 'featured' | 'index';
  href?: string;
  className?: string;
}

export declare function ProjectPlate(props: ProjectPlateProps): JSX.Element;
