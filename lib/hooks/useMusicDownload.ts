'use client';

import { useContentDownload } from '@/lib/hooks/useContentDownload';
import type { MusicDownloadInput } from '@/lib/services/contentDownload';

export function useMusicDownload(input: MusicDownloadInput) {
  const {
    download,
    isDownloading,
    isDownloaded,
    canDownload,
    requiresPurchase,
    price,
    paidModalOpen,
    setPaidModalOpen,
  } = useContentDownload({
    kind: 'music',
    _id: input._id,
    slug: input.slug,
    title: input.title,
    creatorName: input.artistName,
    downloadUrl: input.downloadUrl,
    mediaUrl: input.audioUrl,
    isMonetizable: input.isMonetizable,
    price: input.price,
    downloadPrice: input.downloadPrice,
  });

  const strategy = { useTrackedDownload: !requiresPurchase && Boolean(input.downloadUrl) };

  return {
    download,
    isDownloading,
    isDownloaded,
    canDownload,
    requiresPurchase,
    price,
    paidModalOpen,
    setPaidModalOpen,
    useTrackedDownload: strategy.useTrackedDownload,
  };
}
