import { buildPaidDownloadWhatsAppHref } from '@/lib/services/buildPaidDownloadWhatsApp';

export type AlbumWhatsAppRequestType = 'create' | 'edit' | 'delete';

export interface AlbumRequestWhatsAppContext {
  requestType: AlbumWhatsAppRequestType;
  artistName: string;
  albumTitle?: string;
  albumPageUrl?: string;
  albumId?: string;
}

const REQUEST_LABELS: Record<AlbumWhatsAppRequestType, string> = {
  create: 'Create a new album',
  edit: 'Edit an existing album',
  delete: 'Delete an album',
};

export function buildAlbumRequestWhatsAppMessage(ctx: AlbumRequestWhatsAppContext): string {
  const lines = [
    'Hello OJ Multimedia team,',
    '',
    'I would like help with an album on the platform.',
    '',
    `*Request:* ${REQUEST_LABELS[ctx.requestType]}`,
    `*Artist profile:* ${ctx.artistName}`,
  ];

  if (ctx.requestType !== 'create') {
    if (ctx.albumTitle) lines.push(`*Album title:* ${ctx.albumTitle}`);
    if (ctx.albumId) lines.push(`*Album ID:* ${ctx.albumId}`);
    if (ctx.albumPageUrl) lines.push(`*Album page:* ${ctx.albumPageUrl}`);
  }

  lines.push(
    '',
    'Please describe the changes you need (cover art, title, track list, publishing, removal, etc.) in your reply.',
    '',
    'Thank you.'
  );

  return lines.join('\n');
}

export function buildAlbumRequestWhatsAppHref(
  whatsappRaw: string | undefined,
  ctx: AlbumRequestWhatsAppContext
): string | null {
  return buildPaidDownloadWhatsAppHref(whatsappRaw, buildAlbumRequestWhatsAppMessage(ctx));
}

export function resolveAlbumPublicPageUrl(album: { slug?: string; _id: string }): string {
  const path = `/music/albums/${album.slug || album._id}`;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }

  return path;
}
