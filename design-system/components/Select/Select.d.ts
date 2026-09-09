import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options?: Array<SelectOption | string>;
  /** Empty first option, e.g. "Select a typology". */
  placeholder?: string;
  className?: string;
}

export declare function Select(props: SelectProps): JSX.Element;
