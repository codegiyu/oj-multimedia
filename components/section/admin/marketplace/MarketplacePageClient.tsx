'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { AdminDashboardListLayout } from '@/components/section/admin/AdminDashboardListLayout';
import type {
  IMarketplaceVendor,
  IMarketplaceProduct,
  PopulatedMarketplaceOrder,
} from '@/lib/constants/endpoints';
import type { ClickedRowDetails } from '@/components/general/TableRowDetailsDrawer';
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

  const [clickedRowDetails, setClickedRowDetails] = useState<
    ClickedRowDetails<MarketplaceRowData, MarketplaceTabType> | undefined
  >(undefined);

  const [createVendorOpen, setCreateVendorOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<MarketplaceRowData | null>(null);
  const [rejectTarget, setRejectTarget] = useState<MarketplaceRowData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceRowData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleRefresh = () => router.refresh();
  const handleRowClick = (row: MarketplaceRowData, _index: number, tab: MarketplaceTabType) => {
    setClickedRowDetails({ data: row, index: 0, tab });
  };

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
  };

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
      filterableDataPageProps={{
        searchPlaceholder,
        searchValue: searchQuery,
        onSearchChange: setSearchQuery,
        onSearchApply: () => setPage(1),
        filters: [
          {
            label: 'Status',
            value: filterStatus,
            options: statusOptions,
            onChange: v => {
              setFilterStatus(v);
              setPage(1);
            },
          },
        ],
        onApplyFilters: () => setPage(1),
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
