import * as React from 'react';

export interface WhatsAppBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  /** Pre-fills the message, e.g. a project or package name. */
  context?: string;
  phone?: string;
  label?: string;
  /** Render in flow instead of fixed — for specimens and previews. */
  staticPosition?: boolean;
  className?: string;
}

export declare function WhatsAppBar(props: WhatsAppBarProps): JSX.Element;

export interface WhatsAppBarSpacerProps {
  keepOnDesktop?: boolean;
  className?: string;
}

export declare function WhatsAppBarSpacer(props: WhatsAppBarSpacerProps): JSX.Element;
