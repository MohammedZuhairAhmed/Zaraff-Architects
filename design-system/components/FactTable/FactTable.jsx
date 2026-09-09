import { StatusChip } from '../StatusChip/StatusChip.jsx';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : n);

/** The case-study convention: location, year, status, area, typology, credits. */
export function FactTable({
  location,
  year,
  status,
  statusLabel,
  area,
  typology,
  credits = [],
  rows = [],
  className = '',
  ...rest
}) {
  const base = [
    location && { key: 'Location', value: location },
    year && { key: 'Year', value: String(year) },
    status && {
      key: 'Status',
      value: <StatusChip status={status} bare>{statusLabel}</StatusChip>,
    },
    area && { key: 'Area', value: fmt(area) + ' square feet' },
    typology && { key: 'Typology', value: typology },
  ].filter(Boolean);

  const all = base.concat(rows);

  return (
    <dl className={['zf-facts', className].filter(Boolean).join(' ')} {...rest}>
      {all.map((r) => (
        <div className="zf-facts__row" key={r.key}>
          <dt className="zf-facts__key">{r.key}</dt>
          <dd className="zf-facts__val">{r.value}</dd>
        </div>
      ))}
      {credits.length ? (
        <div className="zf-facts__row">
          <dt className="zf-facts__key">Credits</dt>
          <dd className="zf-facts__val zf-facts__val--credits">
            {credits.map((c, i) => (
              <span key={i}>{c.role ? c.role + ', ' + c.name : c}</span>
            ))}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
