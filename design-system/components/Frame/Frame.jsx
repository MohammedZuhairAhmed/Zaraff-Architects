/** The wordmark's hairline rectangle as a container. 1px, no radius. */
export function Frame({ children, inset = false, elevated = false, as = 'div', className = '', ...rest }) {
  const Tag = as;
  const cls = [
    'zf-frame-box',
    inset ? 'zf-frame-box--inset' : '',
    elevated ? 'zf-frame-box--elevated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
