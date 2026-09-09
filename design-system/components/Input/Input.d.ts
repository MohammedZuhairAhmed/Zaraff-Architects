import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Sentence case, always. */
  label?: string;
  hint?: string;
  /** Replaces the hint and marks the field invalid. */
  error?: string;
  className?: string;
}

export declare function Input(props: InputProps): JSX.Element;
