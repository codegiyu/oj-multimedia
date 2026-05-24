import {
  buildWhatsAppHref,
  buildWhatsAppMessage,
  resolveAlbumPublicPageUrl,
  type AlbumRequestWhatsAppContext,
  type AlbumWhatsAppRequestType,
} from '@/lib/services/whatsappMessaging.service';

export type { AlbumRequestWhatsAppContext, AlbumWhatsAppRequestType };
export { resolveAlbumPublicPageUrl };

export function buildAlbumRequestWhatsAppMessage(ctx: AlbumRequestWhatsAppContext): string {
  return buildWhatsAppMessage({ type: 'album_request', data: ctx });
}

export function buildAlbumRequestWhatsAppHref(
  whatsappRaw: string | undefined,
  ctx: AlbumRequestWhatsAppContext
): string | null {
  return buildWhatsAppHref(whatsappRaw, { type: 'album_request', data: ctx });
}
