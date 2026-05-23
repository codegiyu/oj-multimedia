'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
              <Image
                src={ad.imageUrl}
                alt={`Advertisement (${ad.slot === 'after_hero' ? 'after hero' : 'before call to action'})`}
                width={1200}
                height={280}
                className="h-auto max-h-[200px] w-full object-cover object-center md:max-h-[280px]"
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
