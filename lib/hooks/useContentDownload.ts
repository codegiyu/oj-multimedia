'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  executeContentDownload,
  getContentDownloadStrategy,
  resolveContentPrice,
  type ContentDownloadInput,
} from '@/lib/services/contentDownload';

export function useContentDownload(input: ContentDownloadInput) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);

  const strategy = useMemo(() => getContentDownloadStrategy(input), [input]);
  const price = useMemo(() => resolveContentPrice(input), [input]);

  const download = useCallback(async () => {
    if (strategy.requiresPurchase) {
      setPaidModalOpen(true);

      return { started: false, reason: 'cancelled' as const };
    }

    setIsDownloading(true);

    try {
      const result = await executeContentDownload(input);

      if (result.started) {
        setIsDownloaded(true);
        window.setTimeout(() => setIsDownloaded(false), 3000);
      }

      return result;
    } finally {
      setIsDownloading(false);
    }
  }, [input, strategy.requiresPurchase]);

  return {
    download,
    isDownloading,
    isDownloaded,
    canDownload: strategy.canDownload,
    requiresPurchase: strategy.requiresPurchase,
    price,
    paidModalOpen,
    setPaidModalOpen,
  };
}
