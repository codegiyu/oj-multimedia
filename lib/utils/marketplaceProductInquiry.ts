import { formatPrice } from '@/lib/utils/marketplace';

export interface ProductInquiryMessageParams {
  productName: string;
  price: number;
  vendorName?: string;
  pageUrl: string;
  variantLabel?: string;
  sku?: string;
}

export function formatProductInquiryMessage(params: ProductInquiryMessageParams): string {
  const lines = [
    'Hello,',
    '',
    'I am interested in the following product on OJ Multimedia Marketplace:',
    '',
    `*Product:* ${params.productName}`,
  ];

  if (params.vendorName?.trim()) {
    lines.push(`*Store:* ${params.vendorName.trim()}`);
  }

  lines.push(`*Price:* ${formatPrice(params.price)}`);

  if (params.variantLabel?.trim()) {
    lines.push(`*Options:* ${params.variantLabel.trim()}`);
  }

  if (params.sku?.trim()) {
    lines.push(`*SKU:* ${params.sku.trim().toUpperCase()}`);
  }

  lines.push(`*Link:* ${params.pageUrl}`, '', 'Please let me know about availability. Thank you.');

  return lines.join('\n');
}

export function buildVendorProductInquiryHref(
  whatsappRaw: string | undefined,
  params: ProductInquiryMessageParams
): string | null {
  if (!whatsappRaw?.trim()) return null;

  const digits = whatsappRaw.replace(/\D/g, '');
  if (!digits.length) return null;

  const message = formatProductInquiryMessage(params);

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
