import type { Package } from '@/content';
import { waLink } from '@/lib/whatsapp';

/**
 * Homeowners compare these line against line, so both tiers carry the same
 * headings in the same order. `rate` is a string on purpose — "On request"
 * is a legitimate value, not a missing number.
 */
export function PackageTier({ pkg, whatsappNumber }: { pkg: Package; whatsappNumber: string }) {
  return (
    <div className={`zf-tier${pkg.emphasis ? ' zf-tier--emphasis' : ''}`}>
      {/* A recommendation is information, so it gets words. Previously it was
          signalled by a wash and a shadow alone, which is the same visual
          language as hover — so a static card looked permanently selected. */}
      {pkg.emphasis && <span className="zf-tier__flag">Most clients choose this</span>}
      <h3 className="zf-tier__name">{pkg.name}</h3>
      <div className="zf-tier__rate">{pkg.rate}</div>
      <div className="zf-tier__basis">{pkg.basis}</div>
      {pkg.note && <p className="zf-body-small">{pkg.note}</p>}

      <p className="zf-tier__grouplabel">What it includes</p>
      <ul className="zf-tier__list">
        {pkg.includes.map(item => (
          <li key={item}><span className="zf-tier__tick" /><span>{item}</span></li>
        ))}
      </ul>

      {pkg.excludes.length > 0 && (
        <>
          <p className="zf-tier__grouplabel">What it does not</p>
          <ul className="zf-tier__list zf-tier__list--excluded">
            {pkg.excludes.map(item => (
              <li key={item}><span className="zf-tier__cross" /><span>{item}</span></li>
            ))}
          </ul>
        </>
      )}

      <div className="zf-tier__action">
        <a className="zf-btn zf-btn--whatsapp" href={waLink({ number: whatsappNumber, context: pkg.name })}>
          Ask about {pkg.name.toLowerCase()}
        </a>
      </div>
    </div>
  );
}
