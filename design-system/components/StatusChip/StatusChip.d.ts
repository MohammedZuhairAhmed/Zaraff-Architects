import * as React from 'react';

export interface StatusChipProps {
  status?: 'ongoing' | 'completed';
  /** Sentence-case label. Defaults to the status name. */
  children?: React.ReactNode;
  /** Drop the chalk background and border — dot and label only. */
  bare?: boolean;
  className?: string;
}

export declare function StatusChip(props: StatusChipProps): JSX.Element;
