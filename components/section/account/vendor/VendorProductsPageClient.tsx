'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/marketplace';
import { Package, Plus, MoreVertical, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { IVendorProductsRes } from '@/lib/constants/endpoints';
import { getProductCategoryName, getProductSubCategoryName } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { toast } from 'sonner';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FillImage } from '@/components/general/FillImage';
import {
  DropdownMenu,
  DropdownMenuActionItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { actionMenuIcons } from '@/lib/constants/actionMenuIcons';
import { cn } from '@/lib/utils';

const VendorProductEditIcon = actionMenuIcons.edit;
import { FilterableDataPage } from '@/components/general/FilterableDataPage';
import type { SelectOption } from '@/lib/types/general';
import {
  buildAccountVendorProductsQuery,
  isAccountListUnfiltered,
} from '@/lib/account/accountListFilters';
import { VENDOR_PRODUCT_STATUS_FILTER_SELECT_OPTIONS } from '@/lib/constants/accountSelectOptions';
import { useAccountListSearch } from '@/lib/hooks/useAccountListSearch';
import { loadMarketplaceCategorySelectOptions } from '@/lib/utils/adminEntitySelect';

interface VendorProductsListProps {
  products: IVendorProductsRes['products'];
  searchQuery: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchCommit: () => void;
  filterStatus: string;
  filterCategory: string;
  categoryOptions: SelectOption[];
  onFilterStatusChange: (value: string) => void;
  onFilterCategoryChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onArchive: (productId: string) => void;
  archivingProductId: string | null;
  loading: boolean;
}

function VendorProductsList({
  products,
  searchQuery,
  searchValue,
  onSearchChange,
  onSearchCommit,
  filterStatus,
  filterCategory,
  categoryOptions,
  onFilterStatusChange,
  onFilterCategoryChange,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
  onArchive,
  archivingProductId,
  loading,
}: VendorProductsListProps) {
  const showOnboardingEmpty = isAccountListUnfiltered(searchQuery, filterStatus, filterCategory);

  return (
    <div className="relative space-y-8">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader title="My products" description="Manage your product listings">
        <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90" asChild>
          <Link href="/account/vendor/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </DashboardPageHeader>

      <FilterableDataPage
        searchPlaceholder="Search products..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchCommit={onSearchCommit}
        filters={[
          {
            label: 'Status',
            value: filterStatus,
            options: [...VENDOR_PRODUCT_STATUS_FILTER_SELECT_OPTIONS],
            onChange: onFilterStatusChange,
          },
          {
            label: 'Category',
            value: filterCategory,
            options: categoryOptions,
            onChange: onFilterCategoryChange,
          },
        ]}
      />

      {products.length === 0 ? (
        showOnboardingEmpty ? (
          <SectionEmptyState
            title="No products yet"
            description="Add your first product to start selling on the marketplace."
            icon={Package}
            actionLabel="Add your first product"
            actionHref="/account/vendor/products/new"
          />
        ) : (
          <Card className="border-border/80 p-8 text-center text-sm text-muted-foreground">
            No products match your search or filters.
          </Card>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(product => {
              const priceDisplay = product.variants?.length
                ? `From ${formatPrice(Math.min(...product.variants.map(v => v.price)))}`
                : formatPrice(product.price);
              const isActive = product.status === 'published' && product.inStock;
              return (
                <Card
                  key={product._id}
                  className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative aspect-square bg-muted">
                    <FillImage
                      src={product.images?.[0] ?? ''}
                      alt={`${product.name} product image`}
                      imageContext="dashboard"
                      sizes="(max-width: 768px) 50vw, 280px"
                    />
                    <Badge
                      className={cn(
                        'absolute left-3 top-3 rounded-full border-0 text-xs font-medium',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted-foreground/80 text-background'
                      )}>
                      {isActive ? 'Active' : 'Out of stock'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/80 shadow-sm backdrop-blur"
                          aria-label="Product actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/account/vendor/products/${product._id}/edit`}
                            className="flex items-center gap-2">
                            <VendorProductEditIcon aria-hidden className="size-4 shrink-0" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuActionItem
                          icon={actionMenuIcons.archive}
                          disabled={archivingProductId === product._id}
                          onClick={() => onArchive(product._id)}>
                          {archivingProductId === product._id ? 'Archiving…' : 'Archive'}
                        </DropdownMenuActionItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {getProductCategoryName(product)}
                      {getProductSubCategoryName(product) !== 'Other'
                        ? ` · ${getProductSubCategoryName(product)}`
                        : ''}
                    </p>
                    <div className="flex items-end justify-between gap-2 pt-1">
                      <span className="text-lg font-bold text-primary">{priceDisplay}</span>
                      <div className="text-right text-[11px] leading-tight text-muted-foreground">
                        <div>Stock: {product.inStock ? 'Yes' : 'No'}</div>
                        <div>{product.status}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={page <= 1}
                onClick={onPreviousPage}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={page >= totalPages}
                onClick={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export interface VendorProductsPageClientProps {
  initialProducts: IVendorProductsRes['products'];
  initialTotalPages: number;
  initialErrorMessage: string | null;
}

export function VendorProductsPageClient({
  initialProducts,
  initialTotalPages,
  initialErrorMessage,
}: VendorProductsPageClientProps) {
  const [products, setProducts] = useState<IVendorProductsRes['products']>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const { onSearchChange, onSearchCommit } = useAccountListSearch(setSearchQuery, setPage);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'All categories', value: 'all' },
  ]);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const [archivingProductId, setArchivingProductId] = useState<string | null>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    void loadMarketplaceCategorySelectOptions().then(options => {
      setCategoryOptions([{ text: 'All categories', value: 'all' }, ...options]);
    });
  }, []);

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
      const query = `?${buildAccountVendorProductsQuery({
        page,
        pageSize,
        search: searchQuery,
        status: filterStatus,
        category: filterCategory,
      }).toString()}` as const;
      const { data, error, message } = await callApi('VENDOR_GET_PRODUCTS', { query });

      if (cancelled) return;

      if (error || !data) {
        setProducts([]);
        setTotalPages(1);

        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;

        if (responseCode === 403 || responseCode === 404) {
          setErrorMessage(null);
        } else {
          setErrorMessage(message || 'Unable to load products.');
        }
      } else {
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
  }, [page, pageSize, searchQuery, filterStatus, filterCategory, reloadIndex]);

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setReloadIndex(prev => prev + 1)}>
            Retry
          </Button>
        </div>
      )}
      <VendorProductsList
        products={products}
        searchQuery={searchQuery}
        searchValue={searchQuery}
        onSearchChange={onSearchChange}
        onSearchCommit={onSearchCommit}
        filterStatus={filterStatus}
        filterCategory={filterCategory}
        categoryOptions={categoryOptions}
        onFilterStatusChange={v => {
          setFilterStatus(v);
          setPage(1);
        }}
        onFilterCategoryChange={v => {
          setFilterCategory(v);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPreviousPage={() => setPage(Math.max(1, page - 1))}
        onNextPage={() => setPage(Math.min(totalPages, page + 1))}
        onArchive={handleArchive}
        archivingProductId={archivingProductId}
        loading={loading}
      />
    </div>
  );
}
