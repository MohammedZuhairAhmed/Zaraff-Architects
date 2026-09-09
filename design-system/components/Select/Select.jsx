let uid = 0;

/** Native select on the same baseline rule as Input. */
export function Select({ label, hint, error, id, options = [], placeholder, className = '', ...rest }) {
  const fieldId = id || 'zf-select-' + ++uid;
  const message = error || hint;
  const messageId = message ? fieldId + '-msg' : undefined;
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div className={['zf-field', className].filter(Boolean).join(' ')}>
      {label ? (
        <label className="zf-field__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <span className="zf-select-wrap">
        <select
          className="zf-select"
          id={fieldId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={messageId}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {items.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="zf-select-wrap__caret" aria-hidden="true"></span>
      </span>
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
