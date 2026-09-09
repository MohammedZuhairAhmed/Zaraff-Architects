import * as React from 'react';

export interface PackageTierProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  /** Headline figure, e.g. "₹1,850" or "₹42 lakh". */
  rate: string;
  /** How the figure is charged: "per square foot" or "lump sum". */
  basis?: string;
  summary?: string;
  includes?: string[];
  excludes?: string[];
  /** WhatsApp number; the deep link pre-fills the tier name. */
  phone?: string;
  /** Red oxide border. At most one tier per comparison. */
  emphasis?: boolean;
  actionLabel?: string;
  className?: string;
}

export declare function PackageTier(props: PackageTierProps): JSX.Element;

export interface PackageComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Exactly two tiers. */
  tiers?: PackageTierProps[];
  phone?: string;
  className?: string;
}

export declare function PackageComparison(props: PackageComparisonProps): JSX.Element;
