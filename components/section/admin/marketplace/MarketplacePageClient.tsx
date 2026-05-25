'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type {
  IMarketplaceVendor,
  IMarketplaceProduct,
  PopulatedMarketplaceOrder,
} from '@/lib/constants/endpoints';
import { MarketplaceVendorsTableContent } from './MarketplaceVendorsTableContent';
import { MarketplaceProductsTableContent } from './MarketplaceProductsTableContent';
import { MarketplaceOrdersTableContent } from './MarketplaceOrdersTableContent';
import { MarketplaceDetailsDrawer } from './MarketplaceDetailsDrawer';
import { CreateVendorModal } from './CreateVendorModal';
import { CreateProductModal } from './CreateProductModal';
import { ApprovalModal, RejectModal } from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { Plus } from 'lucide-react';
import type { DataTableTab } from '@/components/general/DataTable';
import { RegularInput } from '@/components/atoms/RegularInput';
import type { SelectOption } from '@/lib/types/general';
import { useAdminListSearch } from '@/lib/hooks/useAdminListSearch';
import { serializeAdminListUrlKey } from '@/lib/admin/adminListUrl';
import { useAdminListUrlRefresh } from '@/lib/hooks/useAdminListUrlRefresh';
import { useAdminListRecordId } from '@/lib/hooks/useAdminListRecordId';
import { findRowIndexById, useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';
import { useAdminVendorFilterOptions } from '@/lib/hooks/useAdminVendorFilterOptions';
import { loadMarketplaceCategorySelectOptions } from '@/lib/utils/adminEntitySelect';

const TAB_VENDORS = 'vendors';
const TAB_PRODUCTS = 'products';
const TAB_ORDERS = 'orders';

const MARKETPLACE_TABLE_TABS: DataTableTab[] = [
  { value: TAB_VENDORS, label: 'Vendors' },
  { value: TAB_PRODUCTS, label: 'Products' },
  { value: TAB_ORDERS, label: 'Orders' },
];

const vendorStatusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
  { text: 'Rejected', value: 'rejected' },
];

const productStatusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

const orderStatusOptions = [
  { text: 'All', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Confirmed', value: 'confirmed' },
  { text: 'Completed', value: 'completed' },
  { text: 'Cancelled', value: 'cancelled' },
];

export type MarketplaceTabType = typeof TAB_VENDORS | typeof TAB_PRODUCTS | typeof TAB_ORDERS;
export type MarketplaceRowData =
  | IMarketplaceVendor
  | IMarketplaceProduct
  | PopulatedMarketplaceOrder;

export interface MarketplacePageClientProps {
  pageTitle: string;
  pageDescription: string;
  vendors: IMarketplaceVendor[];
  products: IMarketplaceProduct[];
  orders: PopulatedMarketplaceOrder[];
  totalPages: number;
  listError: string | null;
}

export function MarketplacePageClient({
  pageTitle,
  pageDescription,
  vendors,
  products,
  orders,
  totalPages,
  listError,
}: MarketplacePageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault(TAB_VENDORS));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  // const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(DEFAULT_PAGE_SIZE));
  const [searchQuery, setSearchQuery] = useQueryState('search', parseAsString.withDefault(''));
  const [filterStatus, setFilterStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [filterVendor, setFilterVendor] = useQueryState('vendor', parseAsString.withDefault('all'));
  const [filterCategory, setFilterCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  );
  const [startDate, setStartDate] = useQueryState('startDate', parseAsString.withDefault(''));
  const [endDate, setEndDate] = useQueryState('endDate', parseAsString.withDefault(''));
  const vendorOptions = useAdminVendorFilterOptions();
  const { onSearchChange, onSearchCommit } = useAdminListSearch(setSearchQuery, setPage);
  useAdminListUrlRefresh(
    serializeAdminListUrlKey({
      page,
      search: searchQuery,
      status: filterStatus,
      tab: activeTab,
      vendor: filterVendor,
      category: filterCategory,
      startDate,
      endDate,
    })
  );
  const [productCategoryOptions, setProductCategoryOptions] = useState<SelectOption[]>([
    { text: 'All categories', value: 'all' },
  ]);

  useEffect(() => {
    if (activeTab !== TAB_PRODUCTS) return;
    void loadMarketplaceCategorySelectOptions().then(options => {
      setProductCategoryOptions([{ text: 'All categories', value: 'all' }, ...options]);
    });
  }, [activeTab]);

  const { recordId, setRecordId, clearRecordId } = useAdminListRecordId();

  const resolveMarketplaceRecord = useCallback(
    (id: string) => {
      let index = findRowIndexById(vendors, id, row => row._id);
      if (index >= 0) {
        return { row: vendors[index], index, tab: TAB_VENDORS as MarketplaceTabType };
      }

      index = findRowIndexById(products, id, row => row._id);
      if (index >= 0) {
        return { row: products[index], index, tab: TAB_PRODUCTS as MarketplaceTabType };
      }

      index = findRowIndexById(orders, id, row => row._id);
      if (index >= 0) {
        return { row: orders[index], index, tab: TAB_ORDERS as MarketplaceTabType };
      }

      return null;
    },
    [vendors, products, orders]
  );

  useEffect(() => {
    if (!recordId) {
      return;
    }

    const resolved = resolveMarketplaceRecord(recordId);
    if (resolved?.tab && resolved.tab !== activeTab) {
      void setActiveTab(resolved.tab);
    }
  }, [recordId, resolveMarketplaceRecord, activeTab, setActiveTab]);

  const marketplaceRows = useMemo((): MarketplaceRowData[] => {
    if (activeTab === TAB_VENDORS) {
      return vendors;
    }
    if (activeTab === TAB_PRODUCTS) {
      return products;
    }

    return orders;
  }, [activeTab, vendors, products, orders]);

  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: marketplaceRows,
    recordId,
    setRecordId,
    clearRecordId,
    resolveRecord: resolveMarketplaceRecord,
  });

  const [createVendorOpen, setCreateVendorOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<MarketplaceRowData | null>(null);
  const [rejectTarget, setRejectTarget] = useState<MarketplaceRowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceRowData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      if ('storeName' in approveTarget) {
        const { error } = await callApi('ADMIN_VENDOR_APPROVE', {
          query: `/${approveTarget._id}/approve` as `/${string}`,
        });
        if (error) throw new Error(error.message);
      } else if ('vendor' in approveTarget && 'slug' in approveTarget) {
        const { error } = await callApi('ADMIN_PRODUCT_APPROVE', {
          query: `/${approveTarget._id}/approve` as `/${string}`,
        });
        if (error) throw new Error(error.message);
      }
      setApproveTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      if ('storeName' in rejectTarget) {
        const { error } = await callApi('ADMIN_VENDOR_REJECT', {
          query: `/${rejectTarget._id}/reject` as `/${string}`,
          payload: { reason },
        });
        if (error) throw new Error(error.message);
      } else if ('vendor' in rejectTarget && 'slug' in rejectTarget) {
        const { error } = await callApi('ADMIN_PRODUCT_REJECT', {
          query: `/${rejectTarget._id}/reject` as `/${string}`,
          payload: { reason },
        });
        if (error) throw new Error(error.message);
      }
      setRejectTarget(null);
      handleRefresh();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      if ('storeName' in deleteTarget) {
        const { error } = await callApi('ADMIN_VENDOR_UPDATE', {
          query: `/${deleteTarget._id}` as `/${string}`,
          payload: { status: 'inactive' },
        });
        if (error) throw new Error(error.message);
      } else if ('vendor' in deleteTarget && 'slug' in deleteTarget) {
        const { error } = await callApi('ADMIN_PRODUCT_DELETE', {
          query: `/${deleteTarget._id}` as `/${string}`,
        });
        if (error) throw new Error(error.message);
      }
      setDeleteTarget(null);
      setClickedRowDetails(undefined);
      handleRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const statusOptions =
    activeTab === TAB_VENDORS
      ? vendorStatusOptions
      : activeTab === TAB_PRODUCTS
        ? productStatusOptions
        : orderStatusOptions;

  const searchPlaceholder =
    activeTab === TAB_VENDORS
      ? 'Search vendors...'
      : activeTab === TAB_PRODUCTS
        ? 'Search products...'
        : 'Search orders...';

  const handleCreateClick = () => {
    if (activeTab === TAB_VENDORS) setCreateVendorOpen(true);
    else if (activeTab === TAB_PRODUCTS) setCreateProductOpen(true);
  };

  const showCreateButton = activeTab === TAB_VENDORS || activeTab === TAB_PRODUCTS;

  const handleListTabChange = (v: string) => {
    setActiveTab(v);
    setPage(1);
    setFilterStatus('all');
    setFilterVendor('all');
    setFilterCategory('all');
    setStartDate('');
    setEndDate('');
  };

  const listFilters = useMemo(() => {
    const filters = [
      {
        label: 'Status',
        value: filterStatus,
        options: statusOptions,
        onChange: (v: string) => {
          setFilterStatus(v);
          setPage(1);
        },
      },
    ];

    if (activeTab === TAB_PRODUCTS || activeTab === TAB_ORDERS) {
      filters.push({
        label: 'Vendor',
        value: filterVendor,
        options: vendorOptions,
        onChange: (v: string) => {
          setFilterVendor(v);
          setPage(1);
        },
      });
    }

    if (activeTab === TAB_PRODUCTS) {
      filters.push({
        label: 'Category',
        value: filterCategory,
        options: productCategoryOptions,
        onChange: (v: string) => {
          setFilterCategory(v);
          setPage(1);
        },
      });
    }

    return filters;
  }, [
    activeTab,
    filterStatus,
    filterVendor,
    filterCategory,
    statusOptions,
    vendorOptions,
    productCategoryOptions,
    setFilterStatus,
    setFilterVendor,
    setFilterCategory,
    setPage,
  ]);

  return (
    <AdminDashboardListLayout
      title={pageTitle}
      description={pageDescription}
      onRefresh={handleRefresh}
      pageHeaderActions={
        showCreateButton ? (
          <RegularBtn
            LeftIcon={Plus}
            text={activeTab === TAB_VENDORS ? 'Create Vendor' : 'Create Product'}
            onClick={handleCreateClick}
          />
        ) : null
      }
      listError={listError}
      toolbarBeforeFilters={
        activeTab === TAB_ORDERS ? (
          <div className="flex flex-wrap items-end gap-3">
            <RegularInput
              label="From"
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-[160px]"
            />
            <RegularInput
              label="To"
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-[160px]"
            />
          </div>
        ) : null
      }
      filterableDataPageProps={{
        searchPlaceholder,
        searchValue: searchQuery,
        onSearchChange,
        onSearchCommit,
        filters: listFilters,
      }}
      extraContent={
        <>
          <MarketplaceDetailsDrawer
            clickedRowDetails={clickedRowDetails}
            setClickedRowDetails={setClickedRowDetails}
          />

          <CreateVendorModal
            open={createVendorOpen}
            onOpenChange={setCreateVendorOpen}
            onSuccess={handleRefresh}
          />
          <CreateProductModal
            open={createProductOpen}
            onOpenChange={setCreateProductOpen}
            onSuccess={handleRefresh}
            vendors={vendors}
          />

          <ApprovalModal
            open={!!approveTarget}
            onOpenChange={val => !val && setApproveTarget(null)}
            title="Approve"
            description={
              approveTarget
                ? `Approve "${'storeName' in approveTarget ? approveTarget.storeName : 'name' in approveTarget ? approveTarget.name : approveTarget.orderNumber}"?`
                : ''
            }
            confirmText="Approve"
            onConfirm={handleApprove}
            loading={actionLoading}
          />

          <RejectModal
            open={!!rejectTarget}
            onOpenChange={val => !val && setRejectTarget(null)}
            title="Reject"
            description={
              rejectTarget
                ? `Reject "${'storeName' in rejectTarget ? rejectTarget.storeName : 'name' in rejectTarget ? rejectTarget.name : rejectTarget.orderNumber}"?`
                : ''
            }
            onConfirm={handleReject}
            loading={actionLoading}
          />

          {deleteTarget && (
            <ApprovalModal
              open={!!deleteTarget}
              onOpenChange={val => !val && setDeleteTarget(null)}
              title={'storeName' in deleteTarget ? 'Set Inactive' : 'Delete'}
              description={
                deleteTarget
                  ? 'storeName' in deleteTarget
                    ? `Set vendor "${deleteTarget.storeName}" as inactive?`
                    : `Delete product "${'name' in deleteTarget ? deleteTarget.name : ''}"? This cannot be undone.`
                  : ''
              }
              confirmText={'storeName' in deleteTarget ? 'Set Inactive' : 'Delete'}
              onConfirm={handleDelete}
              loading={actionLoading}
            />
          )}
        </>
      }>
      {activeTab === TAB_VENDORS && (
        <MarketplaceVendorsTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab}
          onTabChange={handleListTabChange}
          vendors={vendors}
          loading={false}
          onRefresh={handleRefresh}
          onRowClick={(row, idx) => handleRowClick(row, idx, TAB_VENDORS)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onApprove={r => setApproveTarget(r)}
          onReject={r => setRejectTarget(r)}
          onDelete={r => setDeleteTarget(r)}
        />
      )}
      {activeTab === TAB_PRODUCTS && (
        <MarketplaceProductsTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab}
          onTabChange={handleListTabChange}
          products={products}
          loading={false}
          onRefresh={handleRefresh}
          onRowClick={(row, idx) => handleRowClick(row, idx, TAB_PRODUCTS)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onApprove={r => setApproveTarget(r)}
          onReject={r => setRejectTarget(r)}
          onDelete={r => setDeleteTarget(r)}
        />
      )}
      {activeTab === TAB_ORDERS && (
        <MarketplaceOrdersTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab}
          onTabChange={handleListTabChange}
          orders={orders}
          loading={false}
          onRefresh={handleRefresh}
          onRowClick={(row, idx) => handleRowClick(row, idx, TAB_ORDERS)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </AdminDashboardListLayout>
  );
}
