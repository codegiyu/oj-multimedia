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
  mutationSeq: number;
  actions: {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (productId: string, sku?: string) => void;
    updateQuantity: (productId: string, quantity: number, sku?: string) => void;
    clearCart: () => void;
    clearCartAfterOrder: () => void;
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

type PersistedCartState = Pick<CartStore, 'items'>;

function normalizePersistedItems(items: unknown): CartItem[] {
  return Array.isArray(items) ? (items as CartItem[]) : [];
}

export function selectCartCount(state: Pick<CartStore, 'items'>): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartTotal(state: Pick<CartStore, 'items'>): number {
  return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export const useInitCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      mutationSeq: 0,
      actions: {
        addItem: item => {
          const qty = item.quantity ?? 1;
          const previousItems = get().items;
          const opSeq = get().mutationSeq + 1;
          set({ mutationSeq: opSeq });

          let absoluteQuantity = qty;

          set(state => {
            const existing = state.items.find(i => itemsMatch(i, item));
            absoluteQuantity = existing ? existing.quantity + qty : qty;
            const next = existing
              ? state.items.map(i =>
                  itemsMatch(i, item)
                    ? { ...i, quantity: absoluteQuantity, sku: item.sku ?? i.sku }
                    : i
                )
              : [...state.items, { ...item, quantity: absoluteQuantity }];
            return { items: next };
          });

          if (!shouldSyncWithBackend()) return;

          const payload: IUserCartAddPayload = {
            productId: item.productId,
            quantity: absoluteQuantity,
            ...(item.sku ? { sku: item.sku } : {}),
          };

          void (async () => {
            const res = await callApi('USER_CART_ADD', { payload });
            if (res.type !== 'success' || !res.data) {
              if (get().mutationSeq === opSeq) {
                set({ items: previousItems });
              }
              toast.error(res.message || 'Could not update your cart. Please try again.');
              return;
            }
            if (get().mutationSeq === opSeq) {
              get().actions.syncFromBackend(res.data);
            }
          })();
        },
        removeItem: (productId, sku) => {
          const previousItems = get().items;
          const opSeq = get().mutationSeq + 1;
          set({ mutationSeq: opSeq });

          set(state => ({
            items: state.items.filter(i => !itemsMatch(i, { productId, sku })),
          }));

          if (!shouldSyncWithBackend()) return;

          const suffix = sku ? `/${productId}?sku=${encodeURIComponent(sku)}` : `/${productId}`;

          void (async () => {
            const res = await callApi('USER_CART_REMOVE', { query: suffix as `/${string}` });
            if (res.type !== 'success') {
              if (get().mutationSeq === opSeq) {
                set({ items: previousItems });
              }
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
          const opSeq = get().mutationSeq + 1;
          set({ mutationSeq: opSeq });

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
              if (get().mutationSeq === opSeq) {
                set({ items: previousItems });
              }
              toast.error(res.message || 'Could not update cart quantity.');
              return;
            }
            if (get().mutationSeq === opSeq) {
              get().actions.syncFromBackend(res.data);
            }
          })();
        },
        clearCart: () => {
          const previousItems = get().items;
          const opSeq = get().mutationSeq + 1;
          set({ mutationSeq: opSeq });
          set({ items: [] });

          if (!shouldSyncWithBackend()) return;

          void (async () => {
            const res = await callApi('USER_CART_CLEAR', {});
            if (res.type !== 'success') {
              if (get().mutationSeq === opSeq) {
                set({ items: previousItems });
              }
              toast.error(res.message || 'Could not clear your cart.');
            }
          })();
        },
        clearCartAfterOrder: () => {
          const opSeq = get().mutationSeq + 1;
          set({ mutationSeq: opSeq });
          set({ items: [] });

          if (!shouldSyncWithBackend()) return;

          void (async () => {
            const res = await callApi('USER_CART_CLEAR', {});
            if (res.type !== 'success') {
              // After an order is placed we intentionally avoid restoring stale cart items.
              toast.warning(res.message || 'Order placed, but we could not fully clear your cart.');
            } else {
              const d = res.data as unknown;
              if (get().mutationSeq === opSeq && d && typeof d === 'object' && 'items' in d) {
                get().actions.syncFromBackend(d as ICartRes);
              }
            }
          })();
        },
        replaceItems: items => set({ items }),
        syncFromBackend: cart => {
          const mapped = cart.items.map(mapBackendItemToCartItem);
          set({ items: mapped });
        },
        getTotal: () => selectCartTotal(get()),
        getCount: () => selectCartCount(get()),
      },
    }),
    {
      name: 'marketplace-cart',
      version: 1,
      partialize: state => ({ items: state.items }),
      migrate: persisted => ({
        items: normalizePersistedItems((persisted as PersistedCartState | undefined)?.items),
      }),
      merge: (persisted, current) => ({
        ...current,
        items: normalizePersistedItems((persisted as PersistedCartState | undefined)?.items),
        mutationSeq: 0,
        actions: current.actions,
      }),
    }
  )
);

export function useCartStore() {
  return useInitCartStore(state => state);
}

function backendCartItemsMatchLocal(
  localItems: CartItem[],
  backendItems: BackendCartItem[]
): boolean {
  if (localItems.length !== backendItems.length) return false;

  return localItems.every(local => {
    const backend = backendItems.find(
      b => b.productId === local.productId && (b.sku ?? '') === (local.sku ?? '')
    );
    return backend != null && backend.quantity === local.quantity;
  });
}

/** Merge persisted guest cart into the authenticated user's backend cart after login. */
export async function mergeGuestCartWithBackend(): Promise<void> {
  if (!shouldSyncWithBackend()) return;

  const { actions } = useInitCartStore.getState();
  const localItems = useInitCartStore.getState().items;
  const { data: backendCart, error } = await callApi('USER_CART_GET', {});

  if (error) return;

  const backendItems = backendCart?.items ?? [];

  if (
    backendCart &&
    backendItems.length > 0 &&
    backendCartItemsMatchLocal(localItems, backendItems)
  ) {
    actions.syncFromBackend(backendCart);
    return;
  }

  if (localItems.length === 0) {
    if (backendCart) actions.syncFromBackend(backendCart);
    return;
  }

  const quantityByKey = new Map<string, number>();

  for (const item of backendItems) {
    const key = `${item.productId}::${item.sku ?? ''}`;
    quantityByKey.set(key, item.quantity);
  }

  for (const item of localItems) {
    const key = `${item.productId}::${item.sku ?? ''}`;
    quantityByKey.set(key, (quantityByKey.get(key) ?? 0) + item.quantity);
  }

  for (const [key, quantity] of quantityByKey) {
    const [productId, skuPart] = key.split('::');
    const payload: IUserCartAddPayload = {
      productId,
      quantity,
      ...(skuPart ? { sku: skuPart } : {}),
    };
    await callApi('USER_CART_ADD', { payload });
  }

  const { data: mergedCart } = await callApi('USER_CART_GET', {});
  if (mergedCart) actions.syncFromBackend(mergedCart);
}
