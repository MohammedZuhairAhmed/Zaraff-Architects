import Image from 'next/image';
import type { Image as DomainImage } from '@/content';

/** Plans, sections and details. Renders nothing when a project has none. */
export function DrawingGrid({ drawings }: { drawings: DomainImage[] }) {
  if (drawings.length === 0) return null;
  return (
    <div className={`grid ${drawings.length === 1 ? 'grid--1' : 'grid--2'}`}>
      {drawings.map(d => (
        <div className="zf-media zf-media--drawing" style={{ aspectRatio: '4 / 3' }} key={d.url}>
          <Image
            src={d.url}
            alt={d.alt}
            fill
            sizes={drawings.length === 1 ? '100vw' : '(max-width: 800px) 100vw, 50vw'}
            style={{ objectFit: 'contain' }}
          />
        </div>
      ))}
    </div>
  );
}
