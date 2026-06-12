'use client';

import { useEffect, useState } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, Hash, Store, Package, ShoppingCart } from 'lucide-react';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import type {
  IMarketplaceVendor,
  IMarketplaceProduct,
  PopulatedMarketplaceOrder,
  IAdminPatchOrderPayload,
} from '@/lib/constants/endpoints';
import type { MarketplaceTabType } from './MarketplacePageClient';
import {
  AdminProductFieldLink,
  AdminVendorFieldLink,
} from '@/components/section/admin/shared/AdminEntityFieldLinks';
import { Badge } from '@/components/ui/badge';

const ORDER_STATUS_OPTIONS = [
  { text: 'Pending', value: 'pending' },
  { text: 'Confirmed', value: 'confirmed' },
  { text: 'Processing', value: 'processing' },
  { text: 'Shipped', value: 'shipped' },
  { text: 'Delivered', value: 'delivered' },
  { text: 'Cancelled', value: 'cancelled' },
];

const PAYMENT_STATUS_OPTIONS = [
  { text: 'Pending', value: 'pending' },
  { text: 'Paid', value: 'paid' },
  { text: 'Failed', value: 'failed' },
  { text: 'Refunded', value: 'refunded' },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function ApprovalMetadataFields({
  data,
}: {
  data: { approvedAt?: string; rejectedAt?: string; rejectionReason?: string };
}) {
  const hasApproval = Boolean(data.approvedAt);
  const hasRejection = Boolean(data.rejectedAt || data.rejectionReason);

  if (!hasApproval && !hasRejection) return null;

  return (
    <>
      {hasApproval && (
        <InfoCard icon={FileText} label="Approved" value={formatDate(data.approvedAt)} />
      )}
      {hasRejection && (
        <>
          <InfoCard icon={FileText} label="Rejected" value={formatDate(data.rejectedAt)} />
          {data.rejectionReason ? (
            <InfoCard
              icon={FileText}
              label="Rejection reason"
              value={data.rejectionReason}
              preserveParagraphs
            />
          ) : null}
        </>
      )}
    </>
  );
}

function VendorDetails({ data }: { data: IMarketplaceVendor }) {
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={data.logo} alt={data.storeName} size="sm" />
      <div className="grid gap-3">
        <InfoCard icon={Store} label="Store Name" value={data.storeName} />
        {data.isFeatured ? (
          <div>
            <Badge variant="outline">Featured store</Badge>
          </div>
        ) : null}
        <InfoCard icon={FileText} label="Name" value={data.name} />
        <InfoCard icon={FileText} label="Status" value={data.status} />
        <ApprovalMetadataFields data={data} />
        <InfoCard
          icon={FileText}
          label="Logo URL"
          value={data.logo ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Store Description"
          value={data.storeDescription ?? '—'}
          preserveParagraphs
        />
        <InfoCard icon={FileText} label="WhatsApp" value={data.whatsapp ?? '—'} />
        <InfoCard icon={FileText} label="Address" value={data.address ?? '—'} />
        <InfoCard icon={FileText} label="Created" value={formatDate(data.createdAt)} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

function ProductDetails({ data }: { data: IMarketplaceProduct }) {
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={data.images?.[0]} alt={data.name} images={data.images} />
      <div className="grid gap-3">
        <InfoCard icon={Package} label="Name" value={data.name} />
        {data.isFeatured ? (
          <div>
            <Badge variant="outline">Featured product</Badge>
          </div>
        ) : null}
        <InfoCard icon={FileText} label="Vendor">
          <AdminVendorFieldLink
            vendor={data.vendorPopulated ?? data.vendor}
            vendorName={data.vendorName}
          />
        </InfoCard>
        <InfoCard icon={FileText} label="Status" value={data.status} />
        <ApprovalMetadataFields data={data} />
        <InfoCard icon={FileText} label="Price" value={formatPrice(data.price)} />
        <InfoCard
          icon={FileText}
          label="Description"
          value={data.description ?? '—'}
          preserveParagraphs
        />
        <InfoCard icon={FileText} label="In Stock" value={data.inStock ? 'Yes' : 'No'} />
        <InfoCard icon={FileText} label="Created" value={formatDate(data.createdAt)} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

function AdminOrderStatusControls({
  data,
  onOrderUpdated,
}: {
  data: PopulatedMarketplaceOrder;
  onOrderUpdated: (order: PopulatedMarketplaceOrder) => void;
}) {
  const [status, setStatus] = useState(data.status);
  const [paymentStatus, setPaymentStatus] = useState(data.paymentStatus);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(data.status);
    setPaymentStatus(data.paymentStatus);
  }, [data._id, data.status, data.paymentStatus]);

  const hasChanges = status !== data.status || paymentStatus !== data.paymentStatus;

  const handleSave = async () => {
    if (!hasChanges) return;

    const payload: IAdminPatchOrderPayload = {};
    if (status !== data.status) {
      payload.status = status as IAdminPatchOrderPayload['status'];
    }
    if (paymentStatus !== data.paymentStatus) {
      payload.paymentStatus = paymentStatus as IAdminPatchOrderPayload['paymentStatus'];
    }

    setSaving(true);
    const {
      data: responseData,
      error,
      message,
    } = await callApi('ADMIN_ORDER_UPDATE', {
      query: `/${data._id}` as `/${string}`,
      payload,
    });
    setSaving(false);

    if (error || !responseData?.order) {
      toast.error(message || 'Could not update order.');
      return;
    }

    onOrderUpdated(responseData.order);
    toast.success('Order updated.');
  };

  return (
    <div className="grid gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
      <p className="text-sm font-medium text-foreground">Update order</p>
      <RegularSelect
        label="Order status"
        value={status}
        options={ORDER_STATUS_OPTIONS}
        onSelectChange={value => setStatus(value)}
      />
      <RegularSelect
        label="Payment status"
        value={paymentStatus}
        options={PAYMENT_STATUS_OPTIONS}
        onSelectChange={value => setPaymentStatus(value)}
      />
      <RegularBtn
        type="button"
        text={saving ? 'Saving…' : 'Save changes'}
        disabled={!hasChanges || saving}
        loading={saving}
        onClick={handleSave}
        className="w-full sm:w-auto"
      />
    </div>
  );
}

function OrderDetails({
  data,
  onOrderUpdated,
}: {
  data: PopulatedMarketplaceOrder;
  onOrderUpdated?: (order: PopulatedMarketplaceOrder) => void;
}) {
  const customer = data.customer;
  const customerName = customer?.name ?? '—';
  const customerEmail = customer?.email ?? '—';
  const customerPhone = customer?.phone ?? '—';
  return (
    <div className="grid gap-4 p-4">
      {onOrderUpdated ? (
        <AdminOrderStatusControls data={data} onOrderUpdated={onOrderUpdated} />
      ) : null}
      <div className="grid gap-3">
        <InfoCard icon={ShoppingCart} label="Order Number" value={data.orderNumber} />
        <InfoCard icon={FileText} label="Status" value={data.status} />
        <InfoCard icon={FileText} label="Payment Status" value={data.paymentStatus} />
        <InfoCard icon={FileText} label="Total Amount" value={formatPrice(data.totalAmount)} />
        <InfoCard icon={FileText} label="Vendor">
          <AdminVendorFieldLink vendor={data.vendor} vendorName={data.vendor?.storeName} />
        </InfoCard>
        <InfoCard icon={FileText} label="Customer Name" value={customerName} />
        <InfoCard icon={FileText} label="Customer Email" value={customerEmail} />
        <InfoCard icon={FileText} label="Customer Phone" value={customerPhone} />
        <InfoCard icon={FileText} label="Created" value={formatDate(data.createdAt)} />
        {data.items?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/90">Items</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {data.items.map((item, idx) => {
                const productName =
                  typeof item.product === 'object'
                    ? item.product?.name
                    : (item.productName ?? 'Product');
                const productId =
                  typeof item.product === 'object' ? item.product?._id : item.product;

                return (
                  <li key={idx}>
                    <AdminProductFieldLink
                      productId={productId}
                      productName={productName ?? 'Product'}
                    />{' '}
                    × {item.quantity} — {formatPrice(item.totalPrice)}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<
    IMarketplaceVendor | IMarketplaceProduct | PopulatedMarketplaceOrder,
    MarketplaceTabType
  >;
}) {
  const data = rowDetails.data;
  const title =
    'storeName' in data
      ? data.storeName
      : 'name' in data
        ? data.name
        : 'orderNumber' in data
          ? data.orderNumber
          : 'Details';
  const subtitle =
    'storeName' in data
      ? data.status
      : 'name' in data
        ? `${data.status} · ${formatPrice((data as IMarketplaceProduct).price)}`
        : 'orderNumber' in data
          ? (data as PopulatedMarketplaceOrder).status
          : '';

  const isVendor = 'storeName' in data;
  const isProduct = 'vendor' in data && !('orderNumber' in data);
  const thumbnailSrc = isVendor
    ? (data as IMarketplaceVendor).logo
    : isProduct
      ? (data as IMarketplaceProduct).images?.[0]
      : undefined;

  return (
    <div className="flex gap-3 items-start">
      {isVendor || isProduct ? (
        <DashboardThumbnail
          src={thumbnailSrc}
          alt={title}
          size={48}
          rounded={isVendor ? 'full' : 'md'}
        />
      ) : null}
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function DetailsContent({
  rowDetails,
  onOrderUpdated,
}: {
  rowDetails: ClickedRowDetails<
    IMarketplaceVendor | IMarketplaceProduct | PopulatedMarketplaceOrder,
    MarketplaceTabType
  >;
  onOrderUpdated?: (order: PopulatedMarketplaceOrder) => void;
}) {
  const { data, tab } = rowDetails;

  if (tab === 'vendors' && 'storeName' in data) {
    return <VendorDetails data={data as IMarketplaceVendor} />;
  }
  if (tab === 'products' && 'vendor' in data) {
    return <ProductDetails data={data as IMarketplaceProduct} />;
  }
  if (tab === 'orders' && 'orderNumber' in data) {
    return (
      <OrderDetails data={data as PopulatedMarketplaceOrder} onOrderUpdated={onOrderUpdated} />
    );
  }

  return (
    <div className="grid gap-4 p-4">
      <pre className="text-xs overflow-auto bg-muted/50 p-3 rounded-md">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export type MarketplaceClickedRowDetails = ClickedRowDetails<
  IMarketplaceVendor | IMarketplaceProduct | PopulatedMarketplaceOrder,
  MarketplaceTabType
>;

interface MarketplaceDetailsDrawerProps {
  clickedRowDetails: MarketplaceClickedRowDetails | undefined;
  setClickedRowDetails: (d: MarketplaceClickedRowDetails | undefined) => void;
  onOrderUpdated?: (order: PopulatedMarketplaceOrder) => void;
}

export function MarketplaceDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onOrderUpdated,
}: MarketplaceDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  const title =
    clickedRowDetails.tab === 'vendors'
      ? 'Vendor details'
      : clickedRowDetails.tab === 'products'
        ? 'Product details'
        : 'Order details';

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title={title}
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName={clickedRowDetails.tab ?? 'item'}
      showMeta={false}
      setShowMeta={() => {}}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      <DetailsContent rowDetails={clickedRowDetails} onOrderUpdated={onOrderUpdated} />
    </TableRowDetails>
  );
}
