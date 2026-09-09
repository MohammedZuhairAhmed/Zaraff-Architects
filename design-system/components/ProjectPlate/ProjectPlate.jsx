import { StatusChip } from '../StatusChip/StatusChip.jsx';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : n);

/**
 * Media block that survives whatever the project actually has: an Enscape
 * render, a scanned drawing, or a phone photo from site.
 */
export function ProjectMedia({ src, alt = '', kind = 'photo', ratio = '4 / 3', credit, className = '' }) {
  // A missing file must not leave a broken-image glyph in the work index:
  // if the fetch fails the block falls back to the hatched placeholder.
  const [failed, setFailed] = React.useState(false);
  const usable = src && !failed;
  return (
    <span
      className={['zf-media', 'zf-media--' + kind, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
    >
      {usable ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className="zf-media__ph">
          <span>{kind === 'drawing' ? 'Drawing' : kind === 'render' ? '3D render' : 'Site photograph'}</span>
        </span>
      )}
      {usable && credit ? <span className="zf-media__credit">{credit}</span> : null}
    </span>
  );
}

/** A plate in the work index. Two densities: featured and index. */
export function ProjectPlate({
  title,
  typology,
  area,
  location,
  year,
  status = 'completed',
  statusLabel,
  media = {},
  density = 'index',
  href,
  className = '',
  ...rest
}) {
  const Tag = href ? 'a' : 'article';
  const featured = density === 'featured';
  const sentence = [
    typology,
    area ? 'of ' + fmt(area) + ' square feet' : null,
    location ? 'in ' + location : null,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag
      className={['zf-plate', 'zf-plate--' + density, className].filter(Boolean).join(' ')}
      href={href}
      {...rest}
    >
      <span className="zf-plate__media">
        <StatusChip status={status} className="zf-plate__chip">
          {statusLabel}
        </StatusChip>
        <ProjectMedia ratio={featured ? '3 / 2' : '4 / 3'} {...media} />
      </span>
      <span className="zf-plate__foot">
        <span>
          <h3 className="zf-plate__title">{title}</h3>
          {sentence ? <p className="zf-plate__meta">{sentence + '.'}</p> : null}
        </span>
        {year ? <span className="zf-plate__year">{year}</span> : null}
      </span>
    </Tag>
  );
}
