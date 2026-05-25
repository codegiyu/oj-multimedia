'use client';

import { cn } from '@/lib/utils';
import { firstParagraphPreview } from '@/lib/utils/multilineText';

export interface MultilinePreviewProps {
  text?: string | null;
  className?: string;
  maxLength?: number;
}

/** Single-line preview of multiline textarea content for cards and list rows. */
export function MultilinePreview({ text, className, maxLength = 0 }: MultilinePreviewProps) {
  const preview = firstParagraphPreview(text, maxLength);

  if (!preview) return null;

  return <p className={cn(className)}>{preview}</p>;
}
