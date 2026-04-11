'use client';

import { useState } from 'react';
import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { getPublicMusicDownloadUrl } from '@/lib/constants/endpoints';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';

interface DownloadButtonProps {
  musicItem: MusicItemWithArtist;
}

export const DownloadButton = ({ musicItem }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const idOrSlug = musicItem.slug || musicItem._id;
  const trackedDownloadUrl = getPublicMusicDownloadUrl(idOrSlug);
  const useTrackedDownload =
    !musicItem.isMonetizable && Boolean(musicItem.audioUrl || musicItem.downloadUrl);

  const handleDownload = async () => {
    if (musicItem.isMonetizable && musicItem.downloadPrice) {
      const proceed = window.confirm(
        `This download costs $${musicItem.downloadPrice.toFixed(2)}. Proceed to payment?`
      );
      if (!proceed) return;
    }

    setIsDownloading(true);

    try {
      if (useTrackedDownload) {
        window.location.href = trackedDownloadUrl;
      } else if (musicItem.downloadUrl) {
        sendContentAnalyticsEvent('music', idOrSlug, 'download');
        const link = document.createElement('a');
        link.href = musicItem.downloadUrl;
        const artistName =
          typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;
        link.download = `${musicItem.title} - ${artistName}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        return;
      }

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!useTrackedDownload && !musicItem.downloadUrl) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => void handleDownload()}
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
