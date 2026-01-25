'use client';

import { useState } from 'react';
import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MusicItem } from '@/lib/constants/music';

interface DownloadButtonProps {
  musicItem: MusicItem;
}

export const DownloadButton = ({ musicItem }: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!musicItem.downloadUrl) return;

    // Check if monetizable
    if (musicItem.isMonetizable && musicItem.downloadPrice) {
      // TODO: Integrate with payment system
      // For now, show a placeholder
      const proceed = window.confirm(
        `This download costs $${musicItem.downloadPrice.toFixed(2)}. Proceed to payment?`
      );
      if (!proceed) return;
    }

    setIsDownloading(true);

    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would trigger the actual download
      if (musicItem.downloadUrl) {
        const link = document.createElement('a');
        link.href = musicItem.downloadUrl;
        link.download = `${musicItem.title} - ${musicItem.artist}.mp3`;
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

  if (!musicItem.downloadUrl) {
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
