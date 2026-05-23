import { formatPrice } from '@/lib/utils/marketplace';

export type PaidDownloadContentType = 'music' | 'video' | 'resource' | 'news';

export interface PaidDownloadWhatsAppParams {
  contentType: PaidDownloadContentType;
  title: string;
  creatorName: string;
  price: number;
  pageUrl: string;
}

export function buildPaidDownloadWhatsAppMessage(params: PaidDownloadWhatsAppParams): string {
  const typeLabel =
    params.contentType === 'music'
      ? 'Music track'
      : params.contentType === 'video'
        ? 'Video'
        : params.contentType === 'resource'
          ? 'Resource'
          : 'News article';

  const lines = [
    'Hello OJ Multimedia team,',
    '',
    `I would like to purchase a download for the following ${typeLabel.toLowerCase()}:`,
    '',
    `*Title:* ${params.title}`,
    `*Creator / author:* ${params.creatorName}`,
    `*Price:* ${formatPrice(params.price)}`,
    `*Page:* ${params.pageUrl}`,
    '',
    'Please let me know how to complete payment and receive the file. Thank you.',
  ];

  return lines.join('\n');
}

export function buildPaidDownloadWhatsAppHref(
  whatsappRaw: string | undefined,
  message: string
): string | null {
  if (!whatsappRaw?.trim()) return null;

  const digits = whatsappRaw.replace(/\D/g, '');
  if (!digits.length) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
