/** Coloured dot plus a sentence-case label. The dot is the only round shape. */
export function StatusChip({ status = 'ongoing', children, bare = false, className = '' }) {
  const label = children || (status === 'ongoing' ? 'Ongoing' : 'Completed');
  const cls = ['zf-chip', 'zf-chip--' + status, bare ? 'zf-chip--bare' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls}>
      <span className="zf-chip__dot" aria-hidden="true"></span>
      {label}
    </span>
  );
}
