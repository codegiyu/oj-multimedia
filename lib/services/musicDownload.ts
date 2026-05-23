import { getPublicMusicDownloadUrl } from '@/lib/constants/endpoints';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';

export type MusicDownloadSource = 'card' | 'detail';

export interface MusicDownloadInput {
  _id: string;
  slug?: string;
  title: string;
  artistName: string;
  downloadUrl?: string;
  audioUrl?: string;
  isMonetizable?: boolean;
  downloadPrice?: number;
  /** List cards may only have _id; allow tracked public download without URL fields. */
  source?: MusicDownloadSource;
}

export interface MusicDownloadStrategy {
  idOrSlug: string;
  trackedDownloadUrl: string;
  useTrackedDownload: boolean;
  canDownload: boolean;
}

export function getMusicDownloadStrategy(input: MusicDownloadInput): MusicDownloadStrategy {
  const idOrSlug = input.slug || input._id;
  const trackedDownloadUrl = getPublicMusicDownloadUrl(idOrSlug);
  const hasKnownMedia = Boolean(input.audioUrl || input.downloadUrl);
  const useTrackedDownload = !input.isMonetizable && (hasKnownMedia || input.source === 'card');
  const canDownload = useTrackedDownload || Boolean(input.downloadUrl);

  return { idOrSlug, trackedDownloadUrl, useTrackedDownload, canDownload };
}

export interface ExecuteMusicDownloadResult {
  started: boolean;
  reason?: 'cancelled' | 'unavailable';
}

/** Runs download flow (confirm for paid tracks, tracked redirect, or direct file). */
export async function executeMusicDownload(
  input: MusicDownloadInput
): Promise<ExecuteMusicDownloadResult> {
  const strategy = getMusicDownloadStrategy(input);

  if (!strategy.canDownload) {
    return { started: false, reason: 'unavailable' };
  }

  if (input.isMonetizable && input.downloadPrice != null) {
    const proceed = window.confirm(
      `This download costs $${input.downloadPrice.toFixed(2)}. Proceed to payment?`
    );
    if (!proceed) {
      return { started: false, reason: 'cancelled' };
    }
  }

  if (strategy.useTrackedDownload) {
    window.location.href = strategy.trackedDownloadUrl;
    return { started: true };
  }

  if (input.downloadUrl) {
    sendContentAnalyticsEvent('music', strategy.idOrSlug, 'download');
    const link = document.createElement('a');
    link.href = input.downloadUrl;
    link.download = `${input.title} - ${input.artistName}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { started: true };
  }

  return { started: false, reason: 'unavailable' };
}
