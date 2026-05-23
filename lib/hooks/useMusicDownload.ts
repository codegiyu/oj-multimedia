'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  executeMusicDownload,
  getMusicDownloadStrategy,
  type MusicDownloadInput,
} from '@/lib/services/musicDownload';

export function useMusicDownload(input: MusicDownloadInput) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const strategy = useMemo(() => getMusicDownloadStrategy(input), [input]);

  const download = useCallback(async () => {
    setIsDownloading(true);

    try {
      const result = await executeMusicDownload(input);

      if (result.started) {
        setIsDownloaded(true);
        window.setTimeout(() => setIsDownloaded(false), 3000);
      }

      return result;
    } finally {
      setIsDownloading(false);
    }
  }, [input]);

  return {
    download,
    isDownloading,
    isDownloaded,
    canDownload: strategy.canDownload,
    useTrackedDownload: strategy.useTrackedDownload,
  };
}
