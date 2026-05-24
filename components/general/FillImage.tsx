'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  resolveContentImage,
  type ContentImageContext,
} from '@/lib/constants/contentImageDefaults';

function shouldUseUnoptimized(src: string): boolean {
  return src.startsWith('blob:') || src.startsWith('data:');
}

function resolveImageSrc(src: string, imageContext?: ContentImageContext): string {
  if (imageContext) {
    return resolveContentImage(src, imageContext);
  }

  return src.trim();
}

type FillImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  imageContext?: ContentImageContext;
};

/** Cover-style image; parent must be `position: relative` with defined size. */
export function FillImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority,
  imageContext,
}: FillImageProps) {
  const resolvedSrc = resolveImageSrc(src, imageContext);

  if (!resolvedSrc) return null;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={shouldUseUnoptimized(resolvedSrc)}
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
  imageContext?: ContentImageContext;
};

/** Sized image for logos, avatars, and icons. */
export function FixedImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  imageContext,
}: FixedImageProps) {
  const resolvedSrc = resolveImageSrc(src, imageContext);

  if (!resolvedSrc) return null;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={shouldUseUnoptimized(resolvedSrc)}
      className={className}
    />
  );
}
