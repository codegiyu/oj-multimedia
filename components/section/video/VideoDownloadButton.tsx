'use client';

import { useState } from 'react';
import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { getPublicVideoDownloadUrl } from '@/lib/constants/endpoints';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';

interface VideoDownloadButtonProps {
  videoItem: VideoItemWithCreator;
}

export const VideoDownloadButton = ({ videoItem }: VideoDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const idOrSlug = videoItem.slug || videoItem._id;
  const useTrackedDownload = !videoItem.isMonetizable && Boolean(videoItem.downloadUrl);

  const handleDownload = async () => {
    if (!videoItem.downloadUrl) return;

    if (videoItem.isMonetizable && videoItem.downloadPrice) {
      const proceed = window.confirm(
        `This download costs $${videoItem.downloadPrice.toFixed(2)}. Proceed to payment?`
      );
      if (!proceed) return;
    }

    setIsDownloading(true);

    try {
      if (useTrackedDownload) {
        window.location.href = getPublicVideoDownloadUrl(idOrSlug);
      } else if (videoItem.downloadUrl) {
        sendContentAnalyticsEvent('video', idOrSlug, 'download');
        const link = document.createElement('a');
        link.href = videoItem.downloadUrl;
        const creatorName =
          typeof videoItem.creator === 'string' ? videoItem.creator : videoItem.creator.name;
        link.download = `${videoItem.title} - ${creatorName}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        return;
      }

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch {
      void 0;
    } finally {
      setIsDownloading(false);
    }
  };

  if (!videoItem.downloadUrl) {
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
            {videoItem.isMonetizable && videoItem.downloadPrice ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {videoItem.isMonetizable && videoItem.downloadPrice
              ? `Download - $${videoItem.downloadPrice.toFixed(2)}`
              : 'Download'}
          </>
        )}
      </Button>
      {videoItem.isMonetizable && videoItem.downloadPrice && (
        <p className="text-sm text-muted-foreground">
          This is a premium download. Payment required.
        </p>
      )}
    </div>
  );
};
