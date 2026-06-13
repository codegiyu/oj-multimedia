import type {
  IMarketplacePlaceOrderRes,
  PopulatedMarketplaceOrder,
} from '@/lib/constants/endpoints';

export const MARKETPLACE_WHATSAPP_LINKS_KEY = 'oj-marketplace-whatsapp-links';

export interface MarketplaceWhatsappLinkEntry {
  orderNumber: string;
  vendorName: string;
  link: string;
}

export function openWhatsAppLink(link: string): boolean {
  if (typeof window === 'undefined') return false;

  const opened = window.open(link, '_blank', 'noopener,noreferrer');
  return opened != null;
}

export function stashMarketplaceWhatsappLinks(entries: MarketplaceWhatsappLinkEntry[]): void {
  if (typeof window === 'undefined' || entries.length === 0) return;

  sessionStorage.setItem(MARKETPLACE_WHATSAPP_LINKS_KEY, JSON.stringify(entries));
}

export function readMarketplaceWhatsappLinks(): MarketplaceWhatsappLinkEntry[] {
  if (typeof window === 'undefined') return [];

  const raw = sessionStorage.getItem(MARKETPLACE_WHATSAPP_LINKS_KEY);
  if (!raw) return [];

  sessionStorage.removeItem(MARKETPLACE_WHATSAPP_LINKS_KEY);

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is MarketplaceWhatsappLinkEntry =>
        typeof entry === 'object' &&
        entry != null &&
        typeof (entry as MarketplaceWhatsappLinkEntry).link === 'string' &&
        typeof (entry as MarketplaceWhatsappLinkEntry).orderNumber === 'string' &&
        typeof (entry as MarketplaceWhatsappLinkEntry).vendorName === 'string'
    );
  } catch {
    return [];
  }
}

function resolveVendorName(order: PopulatedMarketplaceOrder): string {
  return order.vendor?.storeName?.trim() || order.vendor?.name?.trim() || 'Vendor';
}

export function buildWhatsappLinkEntriesFromOrders(
  orders: PopulatedMarketplaceOrder[]
): MarketplaceWhatsappLinkEntry[] {
  return orders
    .filter(order => Boolean(order.whatsappLink))
    .map(order => ({
      orderNumber: order.orderNumber,
      vendorName: resolveVendorName(order),
      link: order.whatsappLink as string,
    }));
}

export function extractPlacedOrders(
  orderData: IMarketplacePlaceOrderRes | undefined
): PopulatedMarketplaceOrder[] {
  if (!orderData) return [];

  if (orderData.orders && orderData.orders.length > 0) {
    return orderData.orders;
  }

  if (orderData.order) {
    return [orderData.order];
  }

  return [];
}

export function openMarketplaceWhatsappLinks(entries: MarketplaceWhatsappLinkEntry[]): boolean {
  if (entries.length === 0) return false;

  let allOpened = true;
  for (const entry of entries) {
    if (!openWhatsAppLink(entry.link)) {
      allOpened = false;
    }
  }

  return allOpened;
}

export function decodeWhatsappLinkMessage(link: string): string | null {
  try {
    const url = new URL(link);
    const text = url.searchParams.get('text');

    if (!text) return null;

    return decodeURIComponent(text);
  } catch {
    return null;
  }
}
