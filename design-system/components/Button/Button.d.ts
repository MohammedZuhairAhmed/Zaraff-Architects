import * as React from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** primary = red oxide. whatsapp = the conversion action, once per view. */
  variant?: 'primary' | 'whatsapp' | 'secondary';
  children?: React.ReactNode;
  disabled?: boolean;
  /** Renders an anchor instead of a button. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  /** Show the message mark on the WhatsApp variant. Default true. */
  showMark?: boolean;
}

export declare function Button(props: ButtonProps): JSX.Element;
