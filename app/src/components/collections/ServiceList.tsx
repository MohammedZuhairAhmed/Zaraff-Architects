import type { Service } from '@/content';
import { ServiceItem } from '../ServiceItem';

export function ServiceList({
  services,
  density = 'full',
  empty = 'Services are being written up.',
}: {
  services: Service[];
  density?: 'summary' | 'full';
  empty?: string;
}) {
  if (services.length === 0) {
    return <p className="zf-body collection-empty">{empty}</p>;
  }
  return (
    <div className={density === 'full' ? 'svc-list' : 'svc-summary'}>
      {services.map(s => <ServiceItem key={s.slug} service={s} density={density} />)}
    </div>
  );
}
