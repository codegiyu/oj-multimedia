'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  actions: {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getCount: () => number;
  };
}

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
                  i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
                )
              : [...state.items, { ...item, quantity: qty }];
            return { items: next };
          });
        },
        removeItem: productId => {
          set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
        },
        updateQuantity: (productId, quantity) => {
          if (quantity < 1) {
            get().actions.removeItem(productId);
            return;
          }
          set(state => ({
            items: state.items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
          }));
        },
        clearCart: () => set({ items: [] }),
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
