import * as React from 'react';

export interface TextLinkProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Omit to render a button styled as a link. */
  href?: string;
  disabled?: boolean;
  className?: string;
}

export declare function TextLink(props: TextLinkProps): JSX.Element;
