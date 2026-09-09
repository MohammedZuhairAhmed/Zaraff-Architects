import * as React from 'react';

export interface FactRow {
  key: string;
  value: React.ReactNode;
}

export interface Credit {
  role: string;
  name: string;
}

export interface FactTableProps extends React.HTMLAttributes<HTMLElement> {
  location?: string;
  year?: number | string;
  status?: 'ongoing' | 'completed';
  statusLabel?: string;
  /** Area in square feet. */
  area?: number | string;
  typology?: string;
  credits?: Array<Credit | string>;
  /** Extra rows appended after the standard set. */
  rows?: FactRow[];
  className?: string;
}

export declare function FactTable(props: FactTableProps): JSX.Element;
