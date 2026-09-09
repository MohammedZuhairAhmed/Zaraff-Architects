import * as React from 'react';
import { ProjectMediaProps } from '../ProjectPlate/ProjectPlate';

export interface ComparisonHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The Enscape render — the left side under the divider. */
  render?: ProjectMediaProps;
  /** The finished photograph — the right side. */
  photo?: ProjectMediaProps;
  labelA?: string;
  labelB?: string;
  /** CSS aspect-ratio for both layers. */
  ratio?: string;
  /** Divider start position, 0-100. */
  initial?: number;
  /** auto picks toggle on coarse narrow pointers and under reduced motion. */
  mode?: 'auto' | 'drag' | 'toggle';
  className?: string;
}

export declare function ComparisonHero(props: ComparisonHeroProps): JSX.Element;
