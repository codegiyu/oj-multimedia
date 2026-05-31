import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountHubOrdersPreview } from '@/components/section/account/AccountHubOrdersPreview';
import { AccountHubOrdersStatCard } from '@/components/section/account/AccountHubQuickLinks';
import { getAccountHubOrders } from '@/lib/services/accountHubData';

export async function AccountHubOrdersStatSection() {
  const ordersRes = await getAccountHubOrders();

  if (ordersRes.type === 'error') {
    return null;
  }

  const ordersTotal = ordersRes.data.pagination?.total ?? ordersRes.data.orders.length;

  return <AccountHubOrdersStatCard total={ordersTotal} />;
}

export async function AccountHubOrdersSection() {
  const ordersRes = await getAccountHubOrders();

  if (ordersRes.type === 'error') {
    return (
      <SectionLoadError
        title="Orders unavailable"
        message={ordersRes.message || 'Unable to load your orders.'}
      />
    );
  }

  const recentOrders = ordersRes.data.orders.slice(0, 3);

  return <AccountHubOrdersPreview recentOrders={recentOrders} />;
}
