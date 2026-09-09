/** Inline text link. Underlined by default; turns red oxide on hover. */
export function TextLink({ children, href, disabled = false, className = '', ...rest }) {
  const cls = ['zf-link', className].filter(Boolean).join(' ');
  if (!href) {
    return (
      <button className={cls} type="button" disabled={disabled} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <a
      className={cls}
      href={disabled ? undefined : href}
      aria-disabled={disabled ? 'true' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
