import { getPublicMusicDownloadUrl, getPublicVideoDownloadUrl } from '@/lib/constants/endpoints';
import { sendContentAnalyticsEvent } from '@/lib/services/contentAnalytics';
import { isLikelyYoutubeUrl } from '@/lib/utils/videoEmbed';

export type ContentDownloadKind = 'music' | 'video' | 'resource' | 'news';

export interface ContentDownloadInput {
  kind: ContentDownloadKind;
  _id: string;
  slug?: string;
  title: string;
  creatorName: string;
  downloadUrl?: string;
  /** Primary media URL: audioUrl, videoFileUrl, or fileUrl */
  mediaUrl?: string;
  isMonetizable?: boolean;
  price?: number;
  /** @deprecated Use price */
  downloadPrice?: number;
}

export interface ContentDownloadStrategy {
  idOrSlug: string;
  canDownload: boolean;
  requiresPurchase: boolean;
  useTrackedDownload: boolean;
  trackedDownloadUrl: string;
  /** URL opened directly when not using tracked redirect */
  directUrl: string;
}

const STATIC_DOWNLOAD_HOST = 'static.ojmultimedia.com';

export function resolveContentPrice(input: {
  price?: number;
  downloadPrice?: number;
}): number | undefined {
  const value = input.price ?? input.downloadPrice;

  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return undefined;

  return value;
}

export function isStaticOjDownloadHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');

    return host === STATIC_DOWNLOAD_HOST;
  } catch {
    return url.includes(STATIC_DOWNLOAD_HOST);
  }
}

/** Opens a file URL: download attribute on static host; new tab elsewhere (incl. R2/CDN). */
export function deliverFileUrl(url: string, suggestedFilename?: string): void {
  if (isStaticOjDownloadHost(url)) {
    const link = document.createElement('a');
    link.href = url;
    if (suggestedFilename) link.download = suggestedFilename;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getVideoDownloadMediaUrl(input: {
  videoFileUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
}): string {
  const fileField = input.videoFileUrl?.trim() ?? '';
  const legacy = input.videoUrl?.trim() ?? '';
  const candidate = fileField || legacy;

  if (candidate && !isLikelyYoutubeUrl(candidate)) return candidate;

  return input.downloadUrl?.trim() ?? '';
}

export function getContentDownloadStrategy(input: ContentDownloadInput): ContentDownloadStrategy {
  const idOrSlug = input.slug || input._id;
  const trackedDownloadUrl =
    input.kind === 'music'
      ? getPublicMusicDownloadUrl(idOrSlug)
      : getPublicVideoDownloadUrl(idOrSlug);

  const explicitDownload = input.downloadUrl?.trim() ?? '';
  const mediaUrl = input.mediaUrl?.trim() ?? '';
  const price = resolveContentPrice(input);

  if (input.isMonetizable && price != null) {
    return {
      idOrSlug,
      canDownload: true,
      requiresPurchase: true,
      useTrackedDownload: false,
      trackedDownloadUrl,
      directUrl: explicitDownload || mediaUrl,
    };
  }

  const videoFileUrl =
    input.kind === 'video' && mediaUrl && !isLikelyYoutubeUrl(mediaUrl) ? mediaUrl : '';

  const useTrackedDownload =
    (input.kind === 'music' && Boolean(explicitDownload)) ||
    (input.kind === 'video' && Boolean(videoFileUrl));

  const directUrl =
    explicitDownload ||
    (input.kind === 'music' ? mediaUrl : '') ||
    (input.kind === 'video' ? videoFileUrl : '') ||
    (input.kind === 'resource' || input.kind === 'news' ? mediaUrl || explicitDownload : '');

  const canDownload = Boolean(useTrackedDownload || directUrl);

  return {
    idOrSlug,
    canDownload,
    requiresPurchase: false,
    useTrackedDownload,
    trackedDownloadUrl,
    directUrl,
  };
}

export interface ExecuteContentDownloadResult {
  started: boolean;
  reason?: 'cancelled' | 'unavailable';
}

export async function executeContentDownload(
  input: ContentDownloadInput
): Promise<ExecuteContentDownloadResult> {
  const strategy = getContentDownloadStrategy(input);

  if (!strategy.canDownload || strategy.requiresPurchase) {
    return { started: false, reason: 'unavailable' };
  }

  if (strategy.useTrackedDownload) {
    window.location.href = strategy.trackedDownloadUrl;

    return { started: true };
  }

  const url = strategy.directUrl;
  if (!url) return { started: false, reason: 'unavailable' };

  const analyticsKind = input.kind === 'news' ? 'news' : input.kind;
  if (analyticsKind === 'music' || analyticsKind === 'video') {
    sendContentAnalyticsEvent(analyticsKind, strategy.idOrSlug, 'download');
  }

  const ext = input.kind === 'video' ? '.mp4' : input.kind === 'resource' ? '' : '.mp3';
  const filename = ext ? `${input.title} - ${input.creatorName}${ext}` : undefined;

  deliverFileUrl(url, filename);

  return { started: true };
}

/** @deprecated Use ContentDownloadInput */
export type MusicDownloadSource = 'card' | 'detail';

/** Music download payload (maps to ContentDownloadInput in helpers). */
export type MusicDownloadInput = {
  _id: string;
  slug?: string;
  title: string;
  artistName: string;
  downloadUrl?: string;
  audioUrl?: string;
  isMonetizable?: boolean;
  price?: number;
  /** @deprecated Use price */
  downloadPrice?: number;
  source?: MusicDownloadSource;
};

export function getMusicDownloadStrategy(
  input: MusicDownloadInput
): ContentDownloadStrategy & { useTrackedDownload: boolean } {
  return getContentDownloadStrategy({
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
}

export async function executeMusicDownload(
  input: MusicDownloadInput
): Promise<ExecuteContentDownloadResult> {
  return executeContentDownload({
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
}
