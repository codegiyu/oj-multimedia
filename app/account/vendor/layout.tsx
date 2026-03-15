'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/account/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/vendor/products', label: 'Products', icon: Package },
  { href: '/account/vendor/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/vendor/settings', label: 'Settings', icon: Settings },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-card/50 sticky top-20 z-40">
        <div className="regular-container py-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map(item => {
              const isActive =
                item.href === '/account/vendor'
                  ? pathname === '/account/vendor'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
