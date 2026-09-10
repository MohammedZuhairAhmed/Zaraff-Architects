import type { Package } from '@/content';
import { PackageTier } from '../PackageTier';

/**
 * The tiers, however many there are.
 *
 * Takes the WhatsApp number once and hands it to each tier, so pages no
 * longer thread site settings through every item they render.
 */
export function PackageTiers({
  packages,
  whatsappNumber,
  empty = 'Packages are being finalised. Send us a message and we will talk it through.',
}: {
  packages: Package[];
  whatsappNumber: string;
  empty?: string;
}) {
  if (packages.length === 0) {
    return <p className="zf-body collection-empty">{empty}</p>;
  }
  return (
    <div className={`zf-packages${packages.length === 1 ? ' zf-packages--single' : ''}`}>
      {packages.map(p => (
        <PackageTier key={p.slug} pkg={p} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}
