let uid = 0;

/** Single-line field. Baseline rule only — no box, no radius. */
export function Input({ label, hint, error, id, className = '', ...rest }) {
  const fieldId = id || 'zf-input-' + ++uid;
  const message = error || hint;
  const messageId = message ? fieldId + '-msg' : undefined;
  return (
    <div className={['zf-field', className].filter(Boolean).join(' ')}>
      {label ? (
        <label className="zf-field__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <input
        className="zf-input"
        id={fieldId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={messageId}
        {...rest}
      />
      {message ? (
        <span
          className={'zf-field__hint' + (error ? ' zf-field__hint--error' : '')}
          id={messageId}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}
