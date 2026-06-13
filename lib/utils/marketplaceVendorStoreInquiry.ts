export interface VendorStoreInquiryMessageParams {
  vendorName: string;
  storeUrl: string;
}

export function formatVendorStoreInquiryMessage(params: VendorStoreInquiryMessageParams): string {
  const lines = [
    'Hello,',
    '',
    'I found your store on OJ Multimedia Marketplace and would like to get in touch.',
    '',
    `*Store:* ${params.vendorName.trim()}`,
    `*Link:* ${params.storeUrl}`,
    '',
    'Please let me know how I can place an order or ask about your products. Thank you.',
  ];

  return lines.join('\n');
}

export function buildVendorStoreInquiryHref(
  whatsappRaw: string | undefined,
  params: VendorStoreInquiryMessageParams
): string | null {
  if (!whatsappRaw?.trim()) return null;

  const digits = whatsappRaw.replace(/\D/g, '');
  if (!digits.length) return null;

  const message = formatVendorStoreInquiryMessage(params);

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
