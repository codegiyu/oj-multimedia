'use client';

import { Download, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MusicItemWithArtist } from '@/lib/utils/music';
import { useMusicDownload } from '@/lib/hooks/useMusicDownload';
import { toMusicDownloadInputFromItem } from '@/lib/utils/musicDownloadMappers';
import { PaidDownloadModal } from '@/components/section/shared/PaidDownloadModal';
import { formatPrice } from '@/lib/utils/marketplace';
import { resolveContentPrice } from '@/lib/services/contentDownload';

interface DownloadButtonProps {
  musicItem: MusicItemWithArtist;
}

export const DownloadButton = ({ musicItem }: DownloadButtonProps) => {
  const input = toMusicDownloadInputFromItem(musicItem, 'detail');
  const {
    download,
    isDownloading,
    isDownloaded,
    canDownload,
    requiresPurchase,
    paidModalOpen,
    setPaidModalOpen,
  } = useMusicDownload(input);

  const price = resolveContentPrice(musicItem);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;

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
          contentType="music"
          title={musicItem.title}
          creatorName={artistName}
          price={price}
          pageUrl={pageUrl}
        />
      )}
    </>
  );
};
