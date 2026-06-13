'use client';

import { formatPrice } from '@/lib/utils/marketplace';
import {
  buildVendorProductInquiryHref,
  type ProductInquiryMessageParams,
} from '@/lib/utils/marketplaceProductInquiry';
import { MarketplaceVendorWhatsAppModal } from '@/components/section/marketplace/MarketplaceVendorWhatsAppModal';

export interface VendorProductWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ProductInquiryMessageParams;
  vendorWhatsapp?: string;
}

export function VendorProductWhatsAppModal({
  open,
  onOpenChange,
  inquiry,
  vendorWhatsapp,
}: VendorProductWhatsAppModalProps) {
  const waHref = buildVendorProductInquiryHref(vendorWhatsapp, inquiry);

  const summaryLines = [
    { label: 'Product', value: inquiry.productName },
    ...(inquiry.vendorName ? [{ label: 'Store', value: inquiry.vendorName }] : []),
    { label: 'Price', value: formatPrice(inquiry.price), emphasis: true },
    ...(inquiry.variantLabel ? [{ label: 'Options', value: inquiry.variantLabel }] : []),
  ];

  return (
    <MarketplaceVendorWhatsAppModal
      open={open}
      onOpenChange={onOpenChange}
      summaryLines={summaryLines}
      waHref={waHref}
    />
  );
}
