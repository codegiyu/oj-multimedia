import { redirect } from 'next/navigation';

/** Legacy marketplace orders URL — customer order history lives under the account hub. */
export default function MarketplaceOrdersPage() {
  redirect('/account/orders');
}
