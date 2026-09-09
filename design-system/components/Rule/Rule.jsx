/** Hairline rule. The frame device, reduced to a single edge. */
export function Rule({ className = '', ...rest }) {
  return <hr className={['zf-rule', className].filter(Boolean).join(' ')} {...rest} />;
}
