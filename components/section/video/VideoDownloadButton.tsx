'use client';

import { useState } from 'react';
import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VideoItemWithCreator } from '@/lib/utils/videos';

interface VideoDownloadButtonProps {
  videoItem: VideoItemWithCreator;
}

export const VideoDownloadButton = ({ videoItem }: VideoDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!videoItem.downloadUrl) return;

    // Check if monetizable
    if (videoItem.isMonetizable && videoItem.downloadPrice) {
      // TODO: Integrate with payment system
      // For now, show a placeholder
      const proceed = window.confirm(
        `This download costs $${videoItem.downloadPrice.toFixed(2)}. Proceed to payment?`
      );
      if (!proceed) return;
    }

    setIsDownloading(true);

    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would trigger the actual download
      if (videoItem.downloadUrl) {
        const link = document.createElement('a');
        link.href = videoItem.downloadUrl;
        const creatorName =
          typeof videoItem.creator === 'string' ? videoItem.creator : videoItem.creator.name;
        link.download = `${videoItem.title} - ${creatorName}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
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
        onClick={handleDownload}
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
