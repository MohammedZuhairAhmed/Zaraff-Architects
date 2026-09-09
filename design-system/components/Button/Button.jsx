const MessageMark = () => (
  <svg className="zf-btn__mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <rect x="1.6" y="2.2" width="12.8" height="9.6" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3.4" y="11" width="3.4" height="3.4" transform="rotate(45 5.1 12.7)" fill="currentColor" />
  </svg>
);

/**
 * Zaraff button. One primary action per view; the WhatsApp variant is the
 * conversion action and appears at most once per view.
 */
export function Button({
  variant = 'primary',
  children,
  disabled = false,
  href,
  type = 'button',
  className = '',
  showMark = true,
  ...rest
}) {
  const cls = ['zf-btn', 'zf-btn--' + variant, className].filter(Boolean).join(' ');
  const mark = variant === 'whatsapp' && showMark ? <MessageMark /> : null;
  if (href) {
    return (
      <a
        className={cls}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? 'true' : undefined}
        {...rest}
      >
        {mark}
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type={type} disabled={disabled} {...rest}>
      {mark}
      {children}
    </button>
  );
}
