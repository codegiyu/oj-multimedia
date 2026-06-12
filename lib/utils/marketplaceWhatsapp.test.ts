import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MARKETPLACE_WHATSAPP_LINKS_KEY,
  buildWhatsappLinkEntriesFromOrders,
  extractPlacedOrders,
  openMarketplaceWhatsappLinks,
  openWhatsAppLink,
  readMarketplaceWhatsappLinks,
  stashMarketplaceWhatsappLinks,
} from '@/lib/utils/marketplaceWhatsapp';
import type { IMarketplacePlaceOrderRes } from '@/lib/constants/endpoints';

describe('marketplaceWhatsapp', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('openWhatsAppLink returns true when window.open succeeds', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({} as Window);

    expect(openWhatsAppLink('https://wa.me/234?text=hello')).toBe(true);
    expect(openSpy).toHaveBeenCalledWith(
      'https://wa.me/234?text=hello',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('openWhatsAppLink returns false when popup is blocked', () => {
    vi.spyOn(window, 'open').mockReturnValue(null);

    expect(openWhatsAppLink('https://wa.me/234?text=hello')).toBe(false);
  });

  it('stashes and reads whatsapp link entries once', () => {
    const entries = [{ orderNumber: 'ORD-1', vendorName: 'Vendor A', link: 'https://wa.me/1' }];

    stashMarketplaceWhatsappLinks(entries);
    expect(sessionStorage.getItem(MARKETPLACE_WHATSAPP_LINKS_KEY)).toBeTruthy();

    expect(readMarketplaceWhatsappLinks()).toEqual(entries);
    expect(sessionStorage.getItem(MARKETPLACE_WHATSAPP_LINKS_KEY)).toBeNull();
  });

  it('builds link entries from placed orders with vendor names', () => {
    const entries = buildWhatsappLinkEntriesFromOrders([
      {
        _id: 'o1',
        orderNumber: 'ORD-1',
        vendor: { _id: 'v1', storeName: 'Grace Fashion Co', name: 'Grace' },
        whatsappLink: 'https://wa.me/234',
      } as never,
    ]);

    expect(entries).toEqual([
      {
        orderNumber: 'ORD-1',
        vendorName: 'Grace Fashion Co',
        link: 'https://wa.me/234',
      },
    ]);
  });

  it('extractPlacedOrders supports single and multi-vendor responses', () => {
    const multi: IMarketplacePlaceOrderRes = {
      orders: [{ _id: 'o1', orderNumber: 'ORD-1' } as never],
      order: { _id: 'ignored', orderNumber: 'ORD-ignored' } as never,
    };
    const single: IMarketplacePlaceOrderRes = {
      order: { _id: 'o2', orderNumber: 'ORD-2' } as never,
    };

    expect(extractPlacedOrders(multi)).toHaveLength(1);
    expect(extractPlacedOrders(single)[0]?.orderNumber).toBe('ORD-2');
  });

  it('openMarketplaceWhatsappLinks reports blocked popups', () => {
    const openSpy = vi
      .spyOn(window, 'open')
      .mockReturnValueOnce({} as Window)
      .mockReturnValueOnce(null);

    const ok = openMarketplaceWhatsappLinks([
      { orderNumber: 'ORD-1', vendorName: 'A', link: 'https://wa.me/1' },
      { orderNumber: 'ORD-2', vendorName: 'B', link: 'https://wa.me/2' },
    ]);

    expect(ok).toBe(false);
    expect(openSpy).toHaveBeenCalledTimes(2);
  });
});
