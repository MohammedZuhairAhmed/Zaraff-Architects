import { Button } from '../Button/Button.jsx';

const waHref = (phone, tier) =>
  'https://wa.me/' + String(phone || '').replace(/[^0-9]/g, '') +
  '?text=' + encodeURIComponent('Hi Zaraff, I would like a quote for the ' + tier + ' package.');

/** One tier. Two of these side by side is the comparison homeowners read. */
export function PackageTier({
  name,
  rate,
  basis = 'per square foot',
  summary,
  includes = [],
  excludes = [],
  phone,
  emphasis = false,
  actionLabel,
  className = '',
  ...rest
}) {
  return (
    <section className={['zf-tier', emphasis ? 'zf-tier--emphasis' : '', className].filter(Boolean).join(' ')} {...rest}>
      <h3 className="zf-tier__name">{name}</h3>
      <div>
        <div className="zf-tier__rate">{rate}</div>
        <div className="zf-tier__basis">{basis}</div>
      </div>
      {summary ? <p className="zf-tier__basis" style={{ margin: 0 }}>{summary}</p> : null}
      <p className="zf-tier__grouplabel">What it includes</p>
      <ul className="zf-tier__list">
        {includes.map((item, i) => (
          <li key={i}>
            <span className="zf-tier__tick" aria-hidden="true"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {excludes.length ? (
        <>
          <p className="zf-tier__grouplabel">What it excludes</p>
          <ul className="zf-tier__list zf-tier__list--excluded">
            {excludes.map((item, i) => (
              <li key={i}>
                <span className="zf-tier__cross" aria-hidden="true"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="zf-tier__action">
        <Button variant="whatsapp" href={waHref(phone, name)}>
          {actionLabel || 'Message us about ' + name}
        </Button>
      </div>
    </section>
  );
}

/** Two tiers, line by line. Stacks on a phone; two columns from 760px. */
export function PackageComparison({ tiers = [], phone, className = '', ...rest }) {
  return (
    <div className={['zf-packages', className].filter(Boolean).join(' ')} {...rest}>
      {tiers.map((t, i) => (
        <PackageTier key={t.name || i} phone={phone} {...t} />
      ))}
    </div>
  );
}
