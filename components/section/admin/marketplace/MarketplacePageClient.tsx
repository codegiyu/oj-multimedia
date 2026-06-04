/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { toast } from 'sonner';
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
import { useAdminListUrlRefreshFromSearchParams } from '@/lib/hooks/useAdminListUrlRefreshFromSearchParams';
import { useAdminServerTabGate } from '@/lib/hooks/useAdminServerTabGate';
import { useAdminListRecordId } from '@/lib/hooks/useAdminListRecordId';
import { findRowIndexById, useAdminRecordIdDrawer } from '@/lib/hooks/useAdminRecordIdDrawer';
import { useAdminVendorFilterOptions } from '@/lib/hooks/useAdminVendorFilterOptions';
import { loadMarketplaceCategorySelectOptions } from '@/lib/utils/adminEntitySelect';

const TAB_VENDORS = 'vendors';
const TAB_PRODUCTS = 'products';
const TAB_ORDERS = 'orders';

const marketplaceListParsers = {
  tab: parseAsString.withDefault(TAB_VENDORS),
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
  status: parseAsString.withDefault('all'),
  vendor: parseAsString.withDefault('all'),
  category: parseAsString.withDefault('all'),
  startDate: parseAsString.withDefault(''),
  endDate: parseAsString.withDefault(''),
};

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
  serverTab: MarketplaceTabType;
  vendors: IMarketplaceVendor[];
  products: IMarketplaceProduct[];
  orders: PopulatedMarketplaceOrder[];
  totalPages: number;
  listError: string | null;
}

export function MarketplacePageClient({
  pageTitle,
  pageDescription,
  serverTab,
  vendors,
  products,
  orders,
  totalPages,
  listError,
}: MarketplacePageClientProps) {
  const router = useRouter();
  const [listQuery, setListQuery] = useQueryStates(marketplaceListParsers, {
    history: 'replace',
    shallow: false,
  });
  const activeTab = listQuery.tab;
  const page = listQuery.page;
  const searchQuery = listQuery.search;
  const filterStatus = listQuery.status;
  const filterVendor = listQuery.vendor;
  const filterCategory = listQuery.category;
  const startDate = listQuery.startDate;
  const endDate = listQuery.endDate;
  const setPage = (nextPage: number) => {
    void setListQuery({ page: nextPage });
  };
  const setActiveTab = (tab: MarketplaceTabType) => {
    void setListQuery({ tab });
  };
  const vendorOptions = useAdminVendorFilterOptions();
  const onSearchChange = (value: string) => {
    void setListQuery({ search: value, page: 1 });
  };
  const onSearchCommit = () => {
    void setListQuery({ page: 1 });
  };

  const [createVendorOpen, setCreateVendorOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<MarketplaceRowData | null>(null);
  const [rejectTarget, setRejectTarget] = useState<MarketplaceRowData | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<IMarketplaceVendor | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<IMarketplaceVendor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceRowData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [productCategoryOptions, setProductCategoryOptions] = useState<SelectOption[]>([
    { text: 'All categories', value: 'all' },
  ]);

  useAdminListUrlRefreshFromSearchParams();

  const { recordId, setRecordId, clearRecordId } = useAdminListRecordId();

  const resolveMarketplaceRecord = (id: string) => {
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
  };

  const { displayTab, isTabTransitioning } = useAdminServerTabGate({
    serverTab,
    clientTab: (activeTab ?? TAB_VENDORS) as MarketplaceTabType,
    setClientTab: setActiveTab,
  });

  const marketplaceRows = useMemo((): MarketplaceRowData[] => {
    if (displayTab === TAB_VENDORS) {
      return vendors;
    }
    if (displayTab === TAB_PRODUCTS) {
      return products;
    }

    return orders;
  }, [displayTab, vendors, products, orders]);

  const tableLoading = isTabTransitioning;

  const { clickedRowDetails, setClickedRowDetails, handleRowClick } = useAdminRecordIdDrawer({
    rows: marketplaceRows,
    recordId,
    setRecordId,
    clearRecordId,
    resolveRecord: resolveMarketplaceRecord,
  });

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

  const showCreateButton = activeTab === TAB_VENDORS || activeTab === TAB_PRODUCTS;

  const listFilters = useMemo(() => {
    const filters = [
      {
        label: 'Status',
        value: filterStatus,
        options: statusOptions,
        onChange: (v: string) => {
          void setListQuery({ status: v, page: 1 });
        },
      },
    ];

    if (activeTab === TAB_PRODUCTS || activeTab === TAB_ORDERS) {
      filters.push({
        label: 'Vendor',
        value: filterVendor,
        options: vendorOptions,
        onChange: (v: string) => {
          void setListQuery({ vendor: v, page: 1 });
        },
      });
    }

    if (activeTab === TAB_PRODUCTS) {
      filters.push({
        label: 'Category',
        value: filterCategory,
        options: productCategoryOptions,
        onChange: (v: string) => {
          void setListQuery({ category: v, page: 1 });
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
  ]);

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
      toast.error(err instanceof Error ? err.message : 'Approve failed');
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
      toast.error(err instanceof Error ? err.message : 'Reject failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (reason: string) => {
    if (!suspendTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_VENDOR_SUSPEND', {
        query: `/${suspendTarget._id}/suspend` as `/${string}`,
        payload: { reason },
      });
      if (error) throw new Error(error.message);
      setSuspendTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Suspend failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!unsuspendTarget) return;
    setActionLoading(true);
    try {
      const { error } = await callApi('ADMIN_VENDOR_UNSUSPEND', {
        query: `/${unsuspendTarget._id}/unsuspend` as `/${string}`,
      });
      if (error) throw new Error(error.message);
      setUnsuspendTarget(null);
      handleRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unsuspend failed');
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

  const handleCreateClick = () => {
    if (activeTab === TAB_VENDORS) setCreateVendorOpen(true);
    else if (activeTab === TAB_PRODUCTS) setCreateProductOpen(true);
  };

  const handleListTabChange = (v: string) => {
    clearRecordId();
    setClickedRowDetails(undefined);
    void setListQuery({
      tab: v,
      page: 1,
      status: 'all',
      vendor: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
    });
  };

  useEffect(() => {
    if (activeTab !== TAB_PRODUCTS) return;
    void loadMarketplaceCategorySelectOptions().then(options => {
      setProductCategoryOptions([{ text: 'All categories', value: 'all' }, ...options]);
    });
  }, [activeTab]);

  useEffect(() => {
    if (!recordId || isTabTransitioning) {
      return;
    }

    const resolved = resolveMarketplaceRecord(recordId);
    if (resolved?.tab && resolved.tab !== activeTab) {
      void setActiveTab(resolved.tab);
    }
  }, [recordId, activeTab, isTabTransitioning]);

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
                void setListQuery({ startDate: e.target.value, page: 1 });
              }}
              className="w-[160px]"
            />
            <RegularInput
              label="To"
              type="date"
              value={endDate}
              onChange={e => {
                void setListQuery({ endDate: e.target.value, page: 1 });
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

          <RejectModal
            open={!!suspendTarget}
            onOpenChange={val => !val && setSuspendTarget(null)}
            title="Suspend vendor"
            description={
              suspendTarget
                ? `Suspend "${suspendTarget.storeName}"? The store will be hidden publicly.`
                : ''
            }
            confirmText="Suspend"
            reasonLabel="Suspension reason"
            reasonPlaceholder="Reason shown to the vendor in their portal"
            onConfirm={handleSuspend}
            loading={actionLoading}
          />

          <ApprovalModal
            open={!!unsuspendTarget}
            onOpenChange={val => !val && setUnsuspendTarget(null)}
            title="Unsuspend vendor"
            description={
              unsuspendTarget
                ? `Restore "${unsuspendTarget.storeName}" to active? Pending appeals for this profile will be resolved.`
                : ''
            }
            confirmText="Unsuspend"
            onConfirm={handleUnsuspend}
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
      {displayTab === TAB_VENDORS && (
        <MarketplaceVendorsTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab ?? TAB_VENDORS}
          onTabChange={handleListTabChange}
          vendors={vendors}
          loading={tableLoading}
          onRefresh={handleRefresh}
          onRowClick={(row, idx) => handleRowClick(row, idx, TAB_VENDORS)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onApprove={r => setApproveTarget(r)}
          onReject={r => setRejectTarget(r)}
          onSuspend={r => setSuspendTarget(r)}
          onUnsuspend={r => setUnsuspendTarget(r)}
          onDelete={r => setDeleteTarget(r)}
        />
      )}
      {displayTab === TAB_PRODUCTS && (
        <MarketplaceProductsTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab ?? TAB_VENDORS}
          onTabChange={handleListTabChange}
          products={products}
          loading={tableLoading}
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
      {displayTab === TAB_ORDERS && (
        <MarketplaceOrdersTableContent
          tabs={MARKETPLACE_TABLE_TABS}
          activeTab={activeTab ?? TAB_VENDORS}
          onTabChange={handleListTabChange}
          orders={orders}
          loading={tableLoading}
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
