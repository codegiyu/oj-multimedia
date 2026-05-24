'use client';

import { FixedImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';

type DashboardThumbnailProps = {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  rounded?: 'md' | 'full';
  /** `contain` shows the full image inside the cell; `cover` crops to fill. */
  objectFit?: 'cover' | 'contain';
};

/** Compact table-cell thumbnail with dashboard placeholder fallback. */
export function DashboardThumbnail({
  src,
  alt,
  size = 40,
  className,
  rounded = 'md',
  objectFit = 'contain',
}: DashboardThumbnailProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-muted',
        rounded === 'full' ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ width: size, height: size }}>
      <FixedImage
        src={src ?? ''}
        alt={alt}
        width={size}
        height={size}
        imageContext="dashboard"
        className={cn('h-full w-full', objectFit === 'contain' ? 'object-contain' : 'object-cover')}
      />
    </div>
  );
}
