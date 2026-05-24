'use client';

import { FillImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';

const PREVIEW_HEIGHT = {
  sm: 96,
  md: 160,
  lg: 220,
} as const;

type DrawerMediaPreviewProps = {
  src?: string | null;
  alt: string;
  images?: string[];
  size?: keyof typeof PREVIEW_HEIGHT;
  className?: string;
};

/** Cover preview for dashboard detail drawers with placeholder fallback. */
export function DrawerMediaPreview({
  src,
  alt,
  images,
  size = 'md',
  className,
}: DrawerMediaPreviewProps) {
  const height = PREVIEW_HEIGHT[size];
  const gallery = (images ?? []).map(image => image.trim()).filter(Boolean);
  const hasGallery = gallery.length > 0;

  if (hasGallery) {
    return (
      <div className={cn('grid gap-2', className)}>
        <div
          className="relative w-full overflow-hidden rounded-lg border border-border/80 bg-muted"
          style={{ height }}>
          <FillImage
            src={gallery[0]}
            alt={alt}
            imageContext="dashboard"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        {gallery.length > 1 ? (
          <div className="grid grid-cols-4 gap-2">
            {gallery.slice(1, 5).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-square overflow-hidden rounded-md border border-border/60 bg-muted">
                <FillImage
                  src={image}
                  alt=""
                  imageContext="dashboard"
                  sizes="(max-width: 768px) 25vw, 100px"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-border/80 bg-muted',
        className
      )}
      style={{ height }}>
      <FillImage
        src={src ?? ''}
        alt={alt}
        imageContext="dashboard"
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  );
}
