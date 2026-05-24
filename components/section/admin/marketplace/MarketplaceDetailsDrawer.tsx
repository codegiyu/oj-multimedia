'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, Hash, Store, Package, ShoppingCart } from 'lucide-react';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import type {
  IMarketplaceVendor,
  IMarketplaceProduct,
  PopulatedMarketplaceOrder,
} from '@/lib/constants/endpoints';
import type { MarketplaceTabType } from './MarketplacePageClient';

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

function VendorDetails({ data }: { data: IMarketplaceVendor }) {
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={data.logo} alt={data.storeName} size="sm" />
      <div className="grid gap-3">
        <InfoCard icon={Store} label="Store Name" value={data.storeName} />
        <InfoCard icon={FileText} label="Name" value={data.name} />
        <InfoCard icon={FileText} label="Status" value={data.status} />
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
        <InfoCard icon={FileText} label="Vendor" value={data.vendorName ?? String(data.vendor)} />
        <InfoCard icon={FileText} label="Status" value={data.status} />
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

function OrderDetails({ data }: { data: PopulatedMarketplaceOrder }) {
  const customer = data.customer;
  const customerName = customer?.name ?? '—';
  const customerEmail = customer?.email ?? '—';
  const customerPhone = customer?.phone ?? '—';
  const vendorName = typeof data.vendor === 'object' ? data.vendor?.storeName : data.vendor;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={ShoppingCart} label="Order Number" value={data.orderNumber} />
        <InfoCard icon={FileText} label="Status" value={data.status} />
        <InfoCard icon={FileText} label="Payment Status" value={data.paymentStatus} />
        <InfoCard icon={FileText} label="Total Amount" value={formatPrice(data.totalAmount)} />
        <InfoCard icon={FileText} label="Vendor" value={vendorName ?? '—'} />
        <InfoCard icon={FileText} label="Customer Name" value={customerName} />
        <InfoCard icon={FileText} label="Customer Email" value={customerEmail} />
        <InfoCard icon={FileText} label="Customer Phone" value={customerPhone} />
        <InfoCard icon={FileText} label="Created" value={formatDate(data.createdAt)} />
        {data.items?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/90">Items</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {data.items.map((item, idx) => (
                <li key={idx}>
                  {typeof item.product === 'object'
                    ? item.product?.name
                    : (item.productName ?? 'Product')}{' '}
                  × {item.quantity} — {formatPrice(item.totalPrice)}
                </li>
              ))}
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
}: {
  rowDetails: ClickedRowDetails<
    IMarketplaceVendor | IMarketplaceProduct | PopulatedMarketplaceOrder,
    MarketplaceTabType
  >;
}) {
  const { data, tab } = rowDetails;

  if (tab === 'vendors' && 'storeName' in data) {
    return <VendorDetails data={data as IMarketplaceVendor} />;
  }
  if (tab === 'products' && 'vendor' in data) {
    return <ProductDetails data={data as IMarketplaceProduct} />;
  }
  if (tab === 'orders' && 'orderNumber' in data) {
    return <OrderDetails data={data as PopulatedMarketplaceOrder} />;
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
}

export function MarketplaceDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
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
      <DetailsContent rowDetails={clickedRowDetails} />
    </TableRowDetails>
  );
}
