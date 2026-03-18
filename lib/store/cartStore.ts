'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

interface CartStore {
  items: CartItem[];
  actions: {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    replaceItems: (items: CartItem[]) => void;
    syncFromBackend: (cart: ICartRes) => void;
    getTotal: () => number;
    getCount: () => number;
  };
}

const mapBackendItemToCartItem = (item: BackendCartItem): CartItem => {
  const { product, productId, quantity, sku } = item;
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
    vendorWhatsapp: product.vendorWhatsapp,
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
          set(state => {
            const existing = state.items.find(i => i.productId === item.productId);
            const next = existing
              ? state.items.map(i =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + qty, sku: item.sku ?? i.sku }
                    : i
                )
              : [...state.items, { ...item, quantity: qty }];
            return { items: next };
          });

          if (shouldSyncWithBackend()) {
            const payload: IUserCartAddPayload = {
              productId: item.productId,
              quantity: qty,
              ...(item.sku ? { sku: item.sku } : {}),
            };
            void callApi('USER_CART_ADD', { payload });
          }
        },
        removeItem: productId => {
          set(state => ({ items: state.items.filter(i => i.productId !== productId) }));

          if (shouldSyncWithBackend()) {
            void callApi('USER_CART_REMOVE', { query: `/${productId}` as `/${string}` });
          }
        },
        updateQuantity: (productId, quantity) => {
          if (quantity < 1) {
            get().actions.removeItem(productId);
            return;
          }
          set(state => ({
            items: state.items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
          }));

          if (shouldSyncWithBackend()) {
            const payload: IUserCartUpdatePayload = { productId, quantity };
            void callApi('USER_CART_UPDATE', { payload });
          }
        },
        clearCart: () => {
          set({ items: [] });
          if (shouldSyncWithBackend()) {
            void callApi('USER_CART_CLEAR', {});
          }
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
