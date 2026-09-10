import type { Service } from '@/content';

/**
 * One service. Two densities because the home page summarises and the
 * services page expands — but it is one component, not two inline markups
 * that drift apart.
 */
export function ServiceItem({ service, density }: { service: Service; density: 'summary' | 'full' }) {
  if (density === 'summary') {
    return (
      <div className="svc">
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
      </div>
    );
  }
  return (
    <article className="svc-full">
      <div className="svc-full__media zf-media" style={{ aspectRatio: '3 / 2' }}>
        <div className="ph"><span>{service.title}</span></div>
      </div>
      <div className="svc-full__body">
        <h2 className="zf-display">{service.title}</h2>
        <p className="zf-body">{service.summary}</p>
        {service.includes.length > 0 && (
          <ul className="zf-tier__list">
            {service.includes.map(i => (
              <li key={i}><span className="zf-tier__tick" /><span>{i}</span></li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
