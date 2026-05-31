'use client';

import { BookOpen } from 'lucide-react';
import { FixedImage } from '@/components/general/FillImage';
import { cn } from '@/lib/utils';

interface DevotionalListThumbnailProps {
  coverImage?: string;
  title: string;
  className?: string;
}

export function DevotionalListThumbnail({
  coverImage,
  title,
  className,
}: DevotionalListThumbnailProps) {
  if (coverImage?.trim()) {
    return (
      <div
        className={cn(
          'relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-muted',
          className
        )}>
        <FixedImage
          imageContext="public"
          src={coverImage}
          alt={title}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0',
        className
      )}>
      <BookOpen className="w-7 h-7 text-secondary" />
    </div>
  );
}
