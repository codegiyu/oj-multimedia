import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInitAuthStore } from '@/lib/store/useAuthStore';
import { selectCartCount, useInitCartStore } from '@/lib/store/cartStore';
import { callApi } from '@/lib/services/callApi';

vi.mock('@/lib/services/callApi', () => ({
  callApi: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function buildCartResponse(quantity: number) {
  return {
    items: [
      {
        productId: 'p1',
        quantity,
        sku: 'sku-1',
        product: {
          slug: 'product-one',
          name: 'Product One',
          image: 'https://example.com/image.jpg',
          price: 1000,
          vendorName: 'Vendor',
          vendorSlug: 'vendor',
        },
      },
    ],
    totalItems: quantity,
    subtotal: quantity * 1000,
  };
}

describe('cartStore optimistic race handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useInitAuthStore.getState().actions.setUser({ _id: 'u1' } as never);
    useInitCartStore.setState({ items: [], mutationSeq: 0 });
    useInitCartStore.persist?.clearStorage();
  });

  it('does not rollback newer state when older request fails later', async () => {
    const first = deferred<{ type: 'error'; message: string }>();
    const second = deferred<{ type: 'success'; data: ReturnType<typeof buildCartResponse> }>();

    vi.mocked(callApi)
      .mockReturnValueOnce(first.promise as never)
      .mockReturnValueOnce(second.promise as never);

    const { actions } = useInitCartStore.getState();

    actions.addItem({
      productId: 'p1',
      sku: 'sku-1',
      slug: 'product-one',
      name: 'Product One',
      image: 'https://example.com/image.jpg',
      price: 1000,
      quantity: 1,
    });

    actions.addItem({
      productId: 'p1',
      sku: 'sku-1',
      slug: 'product-one',
      name: 'Product One',
      image: 'https://example.com/image.jpg',
      price: 1000,
      quantity: 1,
    });

    second.resolve({
      type: 'success',
      data: buildCartResponse(2),
    });
    await Promise.resolve();

    first.resolve({
      type: 'error',
      message: 'first failed',
    });
    await Promise.resolve();

    const state = useInitCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(2);

    expect(vi.mocked(callApi)).toHaveBeenNthCalledWith(1, 'USER_CART_ADD', {
      payload: { productId: 'p1', quantity: 1, sku: 'sku-1' },
    });
    expect(vi.mocked(callApi)).toHaveBeenNthCalledWith(2, 'USER_CART_ADD', {
      payload: { productId: 'p1', quantity: 2, sku: 'sku-1' },
    });
  });
});

describe('cartStore persist rehydration', () => {
  const sampleItem = {
    productId: 'p1',
    slug: 'product-one',
    name: 'Product One',
    image: 'https://example.com/image.jpg',
    price: 1000,
    quantity: 2,
    sku: 'sku-1',
  };

  beforeEach(() => {
    useInitCartStore.setState({ items: [], mutationSeq: 0 });
    useInitCartStore.persist?.clearStorage();
  });

  it('keeps live cart actions after legacy persisted state without functions', async () => {
    localStorage.setItem(
      'marketplace-cart',
      JSON.stringify({
        state: {
          items: [sampleItem],
          actions: {},
          mutationSeq: 3,
        },
        version: 0,
      })
    );

    await useInitCartStore.persist.rehydrate();

    const state = useInitCartStore.getState();
    expect(typeof state.actions.getCount).toBe('function');
    expect(state.actions.getCount()).toBe(2);
    expect(selectCartCount(state)).toBe(2);
    expect(state.mutationSeq).toBe(0);
  });
});
