'use client';

import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { useMusicDownload } from '@/lib/hooks/useMusicDownload';
import { toMusicDownloadInputFromItem } from '@/lib/utils/musicDownloadMappers';

interface DownloadButtonProps {
  musicItem: MusicItemWithArtist;
}

export const DownloadButton = ({ musicItem }: DownloadButtonProps) => {
  const input = toMusicDownloadInputFromItem(musicItem, 'detail');
  const { download, isDownloading, isDownloaded, canDownload } = useMusicDownload(input);

  if (!canDownload) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => void download()}
        disabled={isDownloading || isDownloaded}
        size="lg"
        className="flex items-center gap-2">
        {isDownloaded ? (
          <>
            <Check className="w-5 h-5" />
            Downloaded
          </>
        ) : isDownloading ? (
          <>
            <Download className="w-5 h-5 animate-pulse" />
            Downloading...
          </>
        ) : (
          <>
            {musicItem.isMonetizable && musicItem.downloadPrice ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {musicItem.isMonetizable && musicItem.downloadPrice
              ? `Download - $${musicItem.downloadPrice.toFixed(2)}`
              : 'Download'}
          </>
        )}
      </Button>
      {musicItem.isMonetizable && musicItem.downloadPrice && (
        <p className="text-sm text-muted-foreground">
          This is a premium download. Payment required.
        </p>
      )}
    </div>
  );
};
