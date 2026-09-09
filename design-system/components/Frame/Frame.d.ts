import * as React from 'react';

export interface FrameProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** 24px of breathing room inside the rule (--frame-inset). */
  inset?: boolean;
  /** Fill with canvas-elevated (or the light-band equivalent). */
  elevated?: boolean;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export declare function Frame(props: FrameProps): JSX.Element;
