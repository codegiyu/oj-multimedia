'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { FillImage } from '@/components/general/FillImage';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';
import { sortHomeAdverts } from '@/lib/utils/sortHomeAdverts';
import { cn } from '@/lib/utils';

const ADVERT_FRAME_CLASS = cn(
  'relative w-full overflow-hidden bg-black',
  'aspect-square max-sm:rounded-none',
  'sm:aspect-auto sm:h-[320px] sm:rounded-2xl sm:border sm:border-border/50',
  'md:h-[500px] md:rounded-2xl',
  'lg:h-[600px]'
);

const AUTOPLAY_DELAY_MS = 5000;
const SLIDE_TRANSITION_MS = 700;

function subscribePrefersReducedMotion(onStoreChange: () => void): () => void {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function getPrefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribePrefersReducedMotion, getPrefersReducedMotion, () => false);
}

interface HomeAdvertStripProps {
  adverts: IHomeAdvertItem[];
}

function advertAlt(slot: IHomeAdvertItem['slot']): string {
  return `Advertisement (${slot === 'after_hero' ? 'after hero' : 'before call to action'})`;
}

function HomeAdvertSlideContent({ ad }: { ad: IHomeAdvertItem }) {
  const image = (
    <div className="relative flex h-full w-full items-center justify-center p-2 sm:p-4">
      <FillImage
        src={ad.imageUrl ?? ''}
        alt={advertAlt(ad.slot)}
        imageContext="public"
        sizes="100vw"
        className="!object-contain object-center"
      />
    </div>
  );

  if (ad.linkUrl?.trim()) {
    return (
      <Link
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full">
        {image}
      </Link>
    );
  }

  return image;
}

function HomeAdvertCarousel({
  adverts,
  reduceMotion,
}: {
  adverts: IHomeAdvertItem[];
  reduceMotion: boolean;
}) {
  return (
    <div
      className={ADVERT_FRAME_CLASS}
      aria-roledescription="carousel"
      aria-label="Home advertisements">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        speed={SLIDE_TRANSITION_MS}
        autoplay={reduceMotion ? false : { delay: AUTOPLAY_DELAY_MS, disableOnInteraction: false }}
        className="h-full w-full overflow-hidden">
        {adverts.map(ad => (
          <SwiperSlide key={ad._id} className="!h-full">
            <HomeAdvertSlideContent ad={ad} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function HomeAdvertStrip({ adverts }: HomeAdvertStripProps) {
  const active = sortHomeAdverts(adverts);
  const reduceMotion = usePrefersReducedMotion();

  if (active.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-y border-border/40 bg-muted/20">
      <div className="w-full max-sm:px-0 sm:container sm:mx-auto sm:px-4">
        <div className="max-sm:w-screen max-sm:relative max-sm:left-1/2 max-sm:-translate-x-1/2">
          {active.length === 1 ? (
            <div className={ADVERT_FRAME_CLASS}>
              <HomeAdvertSlideContent ad={active[0]!} />
            </div>
          ) : (
            <HomeAdvertCarousel adverts={active} reduceMotion={reduceMotion} />
          )}
        </div>
      </div>
    </section>
  );
}
