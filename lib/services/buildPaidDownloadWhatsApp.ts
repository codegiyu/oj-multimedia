import {
  buildWhatsAppHrefFromMessage,
  buildWhatsAppMessage,
  type PaidDownloadContentType,
  type PaidDownloadWhatsAppParams,
} from '@/lib/services/whatsappMessaging.service';

export type { PaidDownloadContentType, PaidDownloadWhatsAppParams };

export function buildPaidDownloadWhatsAppMessage(params: PaidDownloadWhatsAppParams): string {
  return buildWhatsAppMessage({ type: 'paid_download', data: params });
}

export function buildPaidDownloadWhatsAppHref(
  whatsappRaw: string | undefined,
  message: string
): string | null {
  return buildWhatsAppHrefFromMessage(whatsappRaw, message);
}
