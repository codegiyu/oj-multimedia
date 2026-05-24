'use client';

import Link from 'next/link';
import { FillImage } from '@/components/general/FillImage';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';

interface HomeAdvertStripProps {
  adverts: IHomeAdvertItem[];
}

export function HomeAdvertStrip({ adverts }: HomeAdvertStripProps) {
  const active = adverts
    .filter(a => a.isActive !== false)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  if (active.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 flex flex-col gap-6">
        {active.map(ad => {
          const inner = (
            <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm aspect-[1200/280] max-h-[200px] md:max-h-[280px]">
              <FillImage
                src={ad.imageUrl ?? ''}
                alt={`Advertisement (${ad.slot === 'after_hero' ? 'after hero' : 'before call to action'})`}
                imageContext="public"
                sizes="100vw"
                className="object-center"
              />
            </div>
          );
          return (
            <div key={ad._id}>
              {ad.linkUrl?.trim() ? (
                <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
