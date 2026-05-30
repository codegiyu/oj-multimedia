'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  CONTENT_IMAGE_DEFAULTS,
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

function useRecoverableImageSrc(resolvedSrc: string, imageContext?: ContentImageContext) {
  const fallbackSrc = imageContext ? CONTENT_IMAGE_DEFAULTS[imageContext] : null;
  const [displaySrc, setDisplaySrc] = useState(resolvedSrc);

  useEffect(() => {
    setDisplaySrc(resolvedSrc);
  }, [resolvedSrc]);

  function handleError() {
    if (!fallbackSrc) return;

    setDisplaySrc(current => (current !== fallbackSrc ? fallbackSrc : current));
  }

  return { displaySrc, handleError };
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
  const { displaySrc, handleError } = useRecoverableImageSrc(resolvedSrc, imageContext);

  if (!resolvedSrc) return null;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : 'low'}
      unoptimized={shouldUseUnoptimized(displaySrc)}
      onError={handleError}
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
  const { displaySrc, handleError } = useRecoverableImageSrc(resolvedSrc, imageContext);

  if (!resolvedSrc) return null;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority={priority ? 'high' : 'low'}
      unoptimized={shouldUseUnoptimized(displaySrc)}
      onError={handleError}
      className={className}
    />
  );
}
