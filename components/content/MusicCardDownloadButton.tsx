'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicDownload } from '@/lib/hooks/useMusicDownload';
import type { MusicDownloadInput } from '@/lib/services/musicDownload';
import { cn } from '@/lib/utils';

interface MusicCardDownloadButtonProps {
  input: MusicDownloadInput;
  className?: string;
}

export function MusicCardDownloadButton({ input, className }: MusicCardDownloadButtonProps) {
  const { download, isDownloading, canDownload } = useMusicDownload(input);

  if (!canDownload) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn('bg-card/80 backdrop-blur-sm hover:bg-card', className)}
      aria-label="Download"
      disabled={isDownloading}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        void download();
      }}>
      <Download className={cn('w-4 h-4', isDownloading && 'animate-pulse')} />
    </Button>
  );
}
