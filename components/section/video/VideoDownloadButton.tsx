'use client';

import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VideoItemWithCreator } from '@/lib/utils/videos';
import { useContentDownload } from '@/lib/hooks/useContentDownload';
import { getVideoDownloadMediaUrl, resolveContentPrice } from '@/lib/services/contentDownload';
import { PaidDownloadModal } from '@/components/section/shared/PaidDownloadModal';
import { formatPrice } from '@/lib/utils/marketplace';

interface VideoDownloadButtonProps {
  videoItem: VideoItemWithCreator;
}

export const VideoDownloadButton = ({ videoItem }: VideoDownloadButtonProps) => {
  const creatorName =
    typeof videoItem.creator === 'string' ? videoItem.creator : videoItem.creator.name;

  const mediaUrl = getVideoDownloadMediaUrl(videoItem);

  const {
    download,
    isDownloading,
    isDownloaded,
    canDownload,
    requiresPurchase,
    paidModalOpen,
    setPaidModalOpen,
  } = useContentDownload({
    kind: 'video',
    _id: videoItem._id,
    slug: videoItem.slug,
    title: videoItem.title,
    creatorName,
    downloadUrl: videoItem.downloadUrl,
    mediaUrl,
    isMonetizable: videoItem.isMonetizable,
    price: resolveContentPrice(videoItem),
    downloadPrice: videoItem.downloadPrice,
  });

  const price = resolveContentPrice(videoItem);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (!canDownload) {
    return null;
  }

  return (
    <>
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
              {requiresPurchase && price != null ? (
                <Lock className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {requiresPurchase && price != null ? `Download - ${formatPrice(price)}` : 'Download'}
            </>
          )}
        </Button>
        {requiresPurchase && price != null && (
          <p className="text-sm text-muted-foreground">
            Premium download. Contact the team on WhatsApp to purchase.
          </p>
        )}
      </div>

      {price != null && (
        <PaidDownloadModal
          open={paidModalOpen}
          onOpenChange={setPaidModalOpen}
          contentType="video"
          title={videoItem.title}
          creatorName={creatorName}
          price={price}
          pageUrl={pageUrl}
        />
      )}
    </>
  );
};
