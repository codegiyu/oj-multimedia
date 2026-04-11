'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { callApi } from '../services/callApi';
import type {
  ICartItem as BackendCartItem,
  ICartRes,
  IUserCartAddPayload,
  IUserCartUpdatePayload,
} from '../constants/endpoints';
import { useInitAuthStore } from './useAuthStore';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku?: string;
  vendorName?: string;
  vendorSlug?: string;
  vendorWhatsapp?: string;
}

function itemsMatch(
  a: { productId: string; sku?: string },
  b: { productId: string; sku?: string }
): boolean {
  return a.productId === b.productId && (a.sku ?? '') === (b.sku ?? '');
}

interface CartStore {
  items: CartItem[];
  actions: {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (productId: string, sku?: string) => void;
    updateQuantity: (productId: string, quantity: number, sku?: string) => void;
    clearCart: () => void;
    replaceItems: (items: CartItem[]) => void;
    syncFromBackend: (cart: ICartRes) => void;
    getTotal: () => number;
    getCount: () => number;
  };
}

const mapBackendItemToCartItem = (item: BackendCartItem): CartItem => {
  const { product, productId, quantity, sku } = item;
  const prod = product as { vendorWhatsapp?: string; whatsapp?: string };
  return {
    productId,
    quantity,
    sku,
    slug: product.slug,
    name: product.name,
    image: product.image || product.images?.[0] || '',
    price: product.price,
    vendorName: product.vendorName,
    vendorSlug: product.vendorSlug,
    vendorWhatsapp: prod.vendorWhatsapp ?? prod.whatsapp,
  };
};

const shouldSyncWithBackend = () => {
  const auth = useInitAuthStore.getState();
  return Boolean(auth.user);
};

export const useInitCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      actions: {
        addItem: item => {
          const qty = item.quantity ?? 1;
          const previousItems = get().items;

          set(state => {
            const existing = state.items.find(i => itemsMatch(i, item));
            const next = existing
              ? state.items.map(i =>
                  itemsMatch(i, item)
                    ? { ...i, quantity: i.quantity + qty, sku: item.sku ?? i.sku }
                    : i
                )
              : [...state.items, { ...item, quantity: qty }];
            return { items: next };
          });

          if (!shouldSyncWithBackend()) return;

          const payload: IUserCartAddPayload = {
            productId: item.productId,
            quantity: qty,
            ...(item.sku ? { sku: item.sku } : {}),
          };

          void (async () => {
            const res = await callApi('USER_CART_ADD', { payload });
            if (res.type !== 'success' || !res.data) {
              set({ items: previousItems });
              toast.error(res.message || 'Could not update your cart. Please try again.');
              return;
            }
            get().actions.syncFromBackend(res.data);
          })();
        },
        removeItem: (productId, sku) => {
          const previousItems = get().items;

          set(state => ({
            items: state.items.filter(i => !itemsMatch(i, { productId, sku })),
          }));

          if (!shouldSyncWithBackend()) return;

          const suffix = sku ? `/${productId}?sku=${encodeURIComponent(sku)}` : `/${productId}`;

          void (async () => {
            const res = await callApi('USER_CART_REMOVE', { query: suffix as `/${string}` });
            if (res.type !== 'success') {
              set({ items: previousItems });
              toast.error(res.message || 'Could not remove item from cart.');
            }
          })();
        },
        updateQuantity: (productId, quantity, sku) => {
          if (quantity < 1) {
            get().actions.removeItem(productId, sku);
            return;
          }
          const previousItems = get().items;

          set(state => ({
            items: state.items.map(i =>
              itemsMatch(i, { productId, sku }) ? { ...i, quantity } : i
            ),
          }));

          if (!shouldSyncWithBackend()) return;

          const payload: IUserCartUpdatePayload = {
            productId,
            quantity,
            ...(sku ? { sku } : {}),
          };

          void (async () => {
            const res = await callApi('USER_CART_UPDATE', { payload });
            if (res.type !== 'success' || !res.data) {
              set({ items: previousItems });
              toast.error(res.message || 'Could not update cart quantity.');
              return;
            }
            get().actions.syncFromBackend(res.data);
          })();
        },
        clearCart: () => {
          const previousItems = get().items;
          set({ items: [] });

          if (!shouldSyncWithBackend()) return;

          void (async () => {
            const res = await callApi('USER_CART_CLEAR', {});
            if (res.type !== 'success') {
              set({ items: previousItems });
              toast.error(res.message || 'Could not clear your cart.');
            }
          })();
        },
        replaceItems: items => set({ items }),
        syncFromBackend: cart => {
          const mapped = cart.items.map(mapBackendItemToCartItem);
          set({ items: mapped });
        },
        getTotal: () => {
          return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },
        getCount: () => {
          return get().items.reduce((sum, i) => sum + i.quantity, 0);
        },
      },
    }),
    { name: 'marketplace-cart' }
  )
);

export function useCartStore() {
  return useInitCartStore(state => state);
}
