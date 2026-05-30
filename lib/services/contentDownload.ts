import { getPublicMusicDownloadUrl, getPublicVideoDownloadUrl } from '@/lib/constants/endpoints';
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
  /** Uses public download API (server counter + attachment redirect). */
  useDownloadApi: boolean;
  /** @deprecated Use useDownloadApi */
  useTrackedDownload: boolean;
  downloadApiUrl: string;
  /** @deprecated Use downloadApiUrl */
  trackedDownloadUrl: string;
  effectiveFileUrl: string;
  /** @deprecated Use effectiveFileUrl */
  directUrl: string;
  fallbackViewUrl: string;
}

const STATIC_DOWNLOAD_HOST = 'static.ojmultimedia.com';

function isHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

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

/** Hosted file URL used for forced download (downloadUrl preferred, then media URL). */
export function resolveEffectiveFileUrl(input: ContentDownloadInput): string {
  const explicit = input.downloadUrl?.trim() ?? '';
  const media = input.mediaUrl?.trim() ?? '';

  if (input.kind === 'video') {
    const hosted = media && !isLikelyYoutubeUrl(media) ? media : '';

    return explicit || hosted;
  }

  if (input.kind === 'music') {
    const candidate = explicit || media;

    if (!candidate || !isHttpUrl(candidate) || isLikelyYoutubeUrl(candidate)) return '';

    return candidate;
  }

  const candidate = explicit || media;

  return candidate && isHttpUrl(candidate) ? candidate : '';
}

/** External page/stream URL when no downloadable file is available. */
export function resolveContentViewUrl(input: ContentDownloadInput): string {
  const candidates = [input.downloadUrl, input.mediaUrl]
    .map(value => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  return candidates.find(url => isHttpUrl(url)) ?? '';
}

export function openContentInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Direct file save for news/resources (and static CDN when not using the download API). */
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

  openContentInNewTab(url);
}

/** Triggers GET /public/.../download without navigating the current page away. */
export function triggerDownloadViaApi(apiUrl: string): void {
  const link = document.createElement('a');
  link.href = apiUrl;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getContentDownloadStrategy(input: ContentDownloadInput): ContentDownloadStrategy {
  const idOrSlug = input.slug || input._id;
  const downloadApiUrl =
    input.kind === 'music'
      ? getPublicMusicDownloadUrl(idOrSlug)
      : getPublicVideoDownloadUrl(idOrSlug);

  const effectiveFileUrl = resolveEffectiveFileUrl(input);
  const fallbackViewUrl = resolveContentViewUrl(input);
  const price = resolveContentPrice(input);

  if (input.isMonetizable && price != null) {
    return {
      idOrSlug,
      canDownload: true,
      requiresPurchase: true,
      useDownloadApi: false,
      useTrackedDownload: false,
      downloadApiUrl,
      trackedDownloadUrl: downloadApiUrl,
      effectiveFileUrl,
      directUrl: effectiveFileUrl,
      fallbackViewUrl,
    };
  }

  const useDownloadApi =
    (input.kind === 'music' || input.kind === 'video') && Boolean(effectiveFileUrl);

  const hasDirectFile =
    (input.kind === 'resource' || input.kind === 'news') && Boolean(effectiveFileUrl);

  const canDownload = Boolean(useDownloadApi || hasDirectFile || fallbackViewUrl);

  return {
    idOrSlug,
    canDownload,
    requiresPurchase: false,
    useDownloadApi,
    useTrackedDownload: useDownloadApi,
    downloadApiUrl,
    trackedDownloadUrl: downloadApiUrl,
    effectiveFileUrl,
    directUrl: effectiveFileUrl,
    fallbackViewUrl,
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

  if (strategy.useDownloadApi) {
    triggerDownloadViaApi(strategy.downloadApiUrl);

    return { started: true };
  }

  if (strategy.effectiveFileUrl) {
    const ext = input.kind === 'video' ? '.mp4' : input.kind === 'resource' ? '' : '.mp3';
    const filename = ext ? `${input.title} - ${input.creatorName}${ext}` : undefined;

    deliverFileUrl(strategy.effectiveFileUrl, filename);

    return { started: true };
  }

  if (strategy.fallbackViewUrl) {
    openContentInNewTab(strategy.fallbackViewUrl);

    return { started: true };
  }

  return { started: false, reason: 'unavailable' };
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
