'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/marketplace';
import { Package, Plus, Pencil, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { IVendorProductsRes } from '@/lib/constants/endpoints';
import { getProductCategoryName, getProductSubCategoryName } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { toast } from 'sonner';
import { VendorCreateStoreState } from './VendorCreateStoreState';

interface VendorProductsListProps {
  products: IVendorProductsRes['products'];
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onArchive: (productId: string) => void;
  archivingProductId: string | null;
}

function VendorProductsLoadingState() {
  return (
    <SectionContainer>
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading products</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we fetch your store products.
        </p>
      </div>
    </SectionContainer>
  );
}

function VendorProductsList({
  products,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
  onArchive,
  archivingProductId,
}: VendorProductsListProps) {
  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Vendor Products</h1>
          <Button className="gap-2 bg-primary hover:bg-primary/90" asChild>
            <Link href="/account/vendor/products/new">
              <Plus className="w-4 h-4" />
              Add product
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">You have no products yet.</p>
            <Button asChild variant="outline">
              <Link href="/account/vendor/products/new">Add your first product</Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {products.map(product => (
                <Card
                  key={product._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getProductCategoryName(product)}
                      {getProductSubCategoryName(product) !== 'Other' &&
                        ` · ${getProductSubCategoryName(product)}`}{' '}
                      · {product.status}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      {product.variants?.length
                        ? `From ${formatPrice(Math.min(...product.variants.map(v => v.price)))}`
                        : formatPrice(product.price)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge
                        variant={product.inStock ? 'default' : 'secondary'}
                        className="text-xs">
                        {product.inStock ? 'In stock' : 'Out of stock'}
                      </Badge>
                      {product.variants?.length != null && product.variants.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {product.variants.length} variant
                          {product.variants.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/account/vendor/products/${product._id}/edit`}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-muted-foreground"
                      disabled={archivingProductId === product._id}
                      onClick={() => onArchive(product._id)}>
                      <Archive className="w-4 h-4" />
                      {archivingProductId === product._id ? 'Archiving…' : 'Archive'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={onPreviousPage}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={onNextPage}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
}

export interface VendorProductsPageClientProps {
  initialProducts: IVendorProductsRes['products'];
  initialTotalPages: number;
  initialHasVendorProfile: boolean;
  initialErrorMessage: string | null;
}

export function VendorProductsPageClient({
  initialProducts,
  initialTotalPages,
  initialHasVendorProfile,
  initialErrorMessage,
}: VendorProductsPageClientProps) {
  // NOTE: initial data is provided by the server page wrapper.
  // This component still refetches client-side when page/status changes.
  const [products, setProducts] = useState<IVendorProductsRes['products']>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(initialHasVendorProfile);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [archivingProductId, setArchivingProductId] = useState<string | null>(null);
  const didMountRef = useRef(false);

  const handleArchive = async (productId: string) => {
    setArchivingProductId(productId);
    const { data, error, message } = await callApi('VENDOR_UPDATE_PRODUCT', {
      payload: { status: 'archived' },
      query: `/${productId}`,
    });
    setArchivingProductId(null);
    if (error || !data) {
      toast.error(message || 'Failed to archive product.');
      return;
    }
    toast.success('Product archived.');
    setReloadIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      const query = `?page=${page}&limit=${pageSize}` as const;
      const { data, error, message } = await callApi('VENDOR_GET_PRODUCTS', { query });

      if (cancelled) return;

      if (error || !data) {
        setProducts([]);
        setTotalPages(1);

        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;

        // Treat authorization-style errors as "no vendor profile"
        if (responseCode === 403 || responseCode === 404) {
          setHasVendorProfile(false);
          setErrorMessage(null);
        } else {
          setHasVendorProfile(true);
          setErrorMessage(message || 'Unable to load products.');
        }
      } else {
        setHasVendorProfile(true);
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages || 1);
        setErrorMessage(null);
      }

      setLoading(false);
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, reloadIndex]);

  if (loading) {
    return <VendorProductsLoadingState />;
  }

  if (hasVendorProfile === false) {
    return (
      <VendorCreateStoreState description="You need a vendor store before you can add products. Become a vendor to start selling on the marketplace." />
    );
  }

  return (
    <>
      {errorMessage && (
        <SectionContainer>
          <div className="max-w-3xl mx-auto mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setReloadIndex(prev => prev + 1)}>
              Retry
            </Button>
          </div>
        </SectionContainer>
      )}
      <VendorProductsList
        products={products}
        page={page}
        totalPages={totalPages}
        onPreviousPage={() => setPage(Math.max(1, page - 1))}
        onNextPage={() => setPage(Math.min(totalPages, page + 1))}
        onArchive={handleArchive}
        archivingProductId={archivingProductId}
      />
    </>
  );
}
