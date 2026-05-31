import type { FeaturedOption, PromotionPricingOption } from '@/lib/types/promotion';
import { formatPrice } from '@/lib/utils/marketplace';

export type PaidDownloadContentType = 'music' | 'video' | 'resource' | 'news';

export interface PaidDownloadWhatsAppParams {
  contentType: PaidDownloadContentType;
  title: string;
  creatorName: string;
  price: number;
  pageUrl: string;
}

export type AlbumWhatsAppRequestType = 'create' | 'edit' | 'delete';

export interface AlbumRequestWhatsAppContext {
  requestType: AlbumWhatsAppRequestType;
  artistName: string;
  albumTitle?: string;
  albumPageUrl?: string;
  albumId?: string;
}

export type PromotionPlanInquiry = 'plan' | 'custom';

export interface PromotionPlanWhatsAppParams {
  plan: Pick<PromotionPricingOption, 'title' | 'price' | 'description' | 'features'>;
  inquiry?: PromotionPlanInquiry;
}

export type FeaturedPlanInquiry = 'plan' | 'packages';

export interface FeaturedPlanWhatsAppParams {
  plan: Pick<FeaturedOption, 'title' | 'price' | 'duration' | 'description' | 'features'>;
  inquiry?: FeaturedPlanInquiry;
}

export type WhatsAppMessagePayload =
  | { type: 'paid_download'; data: PaidDownloadWhatsAppParams }
  | { type: 'album_request'; data: AlbumRequestWhatsAppContext }
  | { type: 'artist_content_submit' }
  | { type: 'artist_music_submit' }
  | { type: 'artist_video_submit' }
  | { type: 'artist_beats_submit' }
  | { type: 'promotion_plan'; data: PromotionPlanWhatsAppParams }
  | { type: 'featured_plan'; data: FeaturedPlanWhatsAppParams };

const ALBUM_REQUEST_LABELS: Record<AlbumWhatsAppRequestType, string> = {
  create: 'Create a new album',
  edit: 'Edit an existing album',
  delete: 'Delete an album',
};

function paidDownloadTypeLabel(contentType: PaidDownloadContentType): string {
  if (contentType === 'music') return 'Music track';
  if (contentType === 'video') return 'Video';
  if (contentType === 'resource') return 'Resource';

  return 'News article';
}

function formatPaidDownloadMessage(data: PaidDownloadWhatsAppParams): string {
  const typeLabel = paidDownloadTypeLabel(data.contentType);

  return [
    'Hello OJ Multimedia team,',
    '',
    `I would like to purchase a download for the following ${typeLabel.toLowerCase()}:`,
    '',
    `*Title:* ${data.title}`,
    `*Creator / author:* ${data.creatorName}`,
    `*Price:* ${formatPrice(data.price)}`,
    `*Page:* ${data.pageUrl}`,
    '',
    'Please let me know how to complete payment and receive the file. Thank you.',
  ].join('\n');
}

function formatAlbumRequestMessage(data: AlbumRequestWhatsAppContext): string {
  const lines = [
    'Hello OJ Multimedia team,',
    '',
    'I would like help with an album on the platform.',
    '',
    `*Request:* ${ALBUM_REQUEST_LABELS[data.requestType]}`,
    `*Artist profile:* ${data.artistName}`,
  ];

  if (data.requestType !== 'create') {
    if (data.albumTitle) lines.push(`*Album title:* ${data.albumTitle}`);
    if (data.albumId) lines.push(`*Album ID:* ${data.albumId}`);
    if (data.albumPageUrl) lines.push(`*Album page:* ${data.albumPageUrl}`);
  }

  lines.push(
    '',
    'Please describe the changes you need (cover art, title, track list, publishing, removal, etc.) in your reply.',
    '',
    'Thank you.'
  );

  return lines.join('\n');
}

function formatArtistContentSubmitMessage(): string {
  return [
    'Hello OJ Multimedia team,',
    '',
    'I would like to submit music or video for publishing on OJ Multimedia.',
    '',
    'Please let me know the next steps for uploading and review. Thank you.',
  ].join('\n');
}

function formatArtistMusicSubmitMessage(): string {
  return [
    'Hello OJ Multimedia team,',
    '',
    'I would like to submit *music* for publishing on OJ Multimedia.',
    '',
    'I can share tracks, artwork, and metadata for your review.',
    'Please let me know the next steps for uploading and approval. Thank you.',
  ].join('\n');
}

function formatArtistVideoSubmitMessage(): string {
  return [
    'Hello OJ Multimedia team,',
    '',
    'I would like to submit a *video* for publishing on OJ Multimedia.',
    '',
    'I can share the file, thumbnail, and details for your review.',
    'Please let me know the next steps for uploading and approval. Thank you.',
  ].join('\n');
}

function formatArtistBeatsSubmitMessage(): string {
  return [
    'Hello OJ Multimedia team,',
    '',
    'I would like to submit *beats* or instrumentals for publishing on OJ Multimedia.',
    '',
    'Please let me know the next steps for uploading and review. Thank you.',
  ].join('\n');
}

function formatPromotionPlanMessage(data: PromotionPlanWhatsAppParams): string {
  const inquiry = data.inquiry ?? 'plan';
  const intro =
    inquiry === 'custom'
      ? 'I would like to discuss a custom song promotion package:'
      : 'I would like to request the following song promotion package:';

  const lines = [
    'Hello OJ Multimedia team,',
    '',
    intro,
    '',
    `*Package:* ${data.plan.title}`,
    `*Price:* ${data.plan.price}`,
    `*Description:* ${data.plan.description}`,
  ];

  if (data.plan.features.length > 0) {
    lines.push('', '*Includes:*');
    for (const feature of data.plan.features) {
      lines.push(`- ${feature}`);
    }
  }

  lines.push('', 'Please advise on payment and next steps. Thank you.');

  return lines.join('\n');
}

function formatFeaturedPlanMessage(data: FeaturedPlanWhatsAppParams): string {
  const inquiry = data.inquiry ?? 'plan';
  const intro =
    inquiry === 'packages'
      ? 'I would like to discuss a featured placement package (multiple options):'
      : 'I would like to request the following featured placement:';

  const lines = [
    'Hello OJ Multimedia team,',
    '',
    intro,
    '',
    `*Placement:* ${data.plan.title}`,
    `*Duration:* ${data.plan.duration}`,
    `*Price:* ${data.plan.price}`,
    `*Description:* ${data.plan.description}`,
  ];

  if (data.plan.features.length > 0) {
    lines.push('', '*Includes:*');
    for (const feature of data.plan.features) {
      lines.push(`- ${feature}`);
    }
  }

  lines.push('', 'Please advise on payment and next steps. Thank you.');

  return lines.join('\n');
}

export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  switch (payload.type) {
    case 'paid_download':
      return formatPaidDownloadMessage(payload.data);
    case 'album_request':
      return formatAlbumRequestMessage(payload.data);
    case 'artist_content_submit':
      return formatArtistContentSubmitMessage();
    case 'artist_music_submit':
      return formatArtistMusicSubmitMessage();
    case 'artist_video_submit':
      return formatArtistVideoSubmitMessage();
    case 'artist_beats_submit':
      return formatArtistBeatsSubmitMessage();
    case 'promotion_plan':
      return formatPromotionPlanMessage(payload.data);
    case 'featured_plan':
      return formatFeaturedPlanMessage(payload.data);
    default: {
      const _exhaustive: never = payload;
      return _exhaustive;
    }
  }
}

export function buildWhatsAppHref(
  whatsappRaw: string | undefined,
  payload: WhatsAppMessagePayload
): string | null {
  if (!whatsappRaw?.trim()) return null;

  const digits = whatsappRaw.replace(/\D/g, '');
  if (!digits.length) return null;

  const message = buildWhatsAppMessage(payload);

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** @deprecated Use buildWhatsAppHref with a message payload */
export function buildWhatsAppHrefFromMessage(
  whatsappRaw: string | undefined,
  message: string
): string | null {
  if (!whatsappRaw?.trim()) return null;

  const digits = whatsappRaw.replace(/\D/g, '');
  if (!digits.length) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function resolveAlbumPublicPageUrl(album: { slug?: string; _id: string }): string {
  const path = `/music/albums/${album.slug || album._id}`;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }

  return path;
}
