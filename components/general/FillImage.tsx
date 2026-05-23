'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

function shouldUseUnoptimized(src: string): boolean {
  return src.startsWith('blob:') || src.startsWith('data:');
}

type FillImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Cover-style image; parent must be `position: relative` with defined size. */
export function FillImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority,
}: FillImageProps) {
  if (!src.trim()) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={shouldUseUnoptimized(src)}
      className={cn('object-cover', className)}
    />
  );
}

type FixedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/** Sized image for logos, avatars, and icons. */
export function FixedImage({ src, alt, width, height, className, priority }: FixedImageProps) {
  if (!src.trim()) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={shouldUseUnoptimized(src)}
      className={className}
    />
  );
}
