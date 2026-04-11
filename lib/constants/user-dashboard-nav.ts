import type { LucideIcon } from 'lucide-react';
import {
  Home,
  LayoutDashboard,
  MessageCircle,
  Mic2,
  Music2,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Video,
  Heart,
} from 'lucide-react';

export type UserDashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Render after a spacer (e.g. portal links) */
  end?: boolean;
  /** Only `pathname === href` is active (overview routes) */
  exact?: boolean;
};

export const USER_ACCOUNT_NAV: UserDashboardNavItem[] = [
  { href: '/account', label: 'Overview', icon: Home, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/settings', label: 'Settings', icon: Settings },
  { href: '/account/artist-portal', label: 'Artist Portal', icon: Mic2, end: true },
  { href: '/account/vendor', label: 'Vendor Dashboard', icon: Store, end: true },
];

export const USER_ARTIST_NAV: UserDashboardNavItem[] = [
  { href: '/account/artist-portal', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/artist-portal/music', label: 'My Music', icon: Music2 },
  { href: '/account/artist-portal/videos', label: 'My Videos', icon: Video },
  { href: '/account/artist-portal/upload', label: 'Submit content', icon: MessageCircle },
  { href: '/account/artist-portal/settings', label: 'My Account', icon: Settings, end: true },
];

export const USER_VENDOR_NAV: UserDashboardNavItem[] = [
  { href: '/account/vendor', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/account/vendor/products', label: 'Products', icon: Package },
  { href: '/account/vendor/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/vendor/settings', label: 'Settings', icon: Settings },
  { href: '/account/settings', label: 'My Account', icon: Settings, end: true },
];

export function isNavActive(pathname: string, item: UserDashboardNavItem): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const href = item.href.replace(/\/$/, '') || '/';
  if (item.exact) return normalized === href;
  return normalized === href || normalized.startsWith(`${href}/`);
}
