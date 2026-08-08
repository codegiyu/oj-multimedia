'use client';

import { useEffect, useState } from 'react';
import { youtubeEmbedUrlFromInput } from '@/lib/utils/videoEmbed';

type YoutubeEmbedPreviewProps = {
  embedUrl: string | undefined | null;
  title?: string;
  debounceMs?: number;
};

/** Debounced YouTube iframe preview for admin/artist forms. */
export function YoutubeEmbedPreview({
  embedUrl,
  title = 'YouTube preview',
  debounceMs = 400,
}: YoutubeEmbedPreviewProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const parsed = youtubeEmbedUrlFromInput(embedUrl);
    if (!parsed) {
      setPreviewSrc(null);
      return;
    }

    const timer = window.setTimeout(() => {
      setPreviewSrc(parsed);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [embedUrl, debounceMs]);

  if (!previewSrc) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 bg-black aspect-video">
      <iframe
        src={previewSrc}
        title={title}
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
