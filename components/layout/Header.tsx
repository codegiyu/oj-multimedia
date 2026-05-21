'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Search,
  Music,
  Video,
  Newspaper,
  ShoppingBag,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu, UserMobileMenu } from './UserMenu';
import { Logo } from '@/components/atoms/Logo';
import { SearchModalDynamic } from '../section/public/search/SearchModalDynamic';
import { useCartStore } from '@/lib/store/cartStore';

const navItems = [
  { label: 'Music', icon: Music, href: '/music' },
  { label: 'Videos', icon: Video, href: '/videos' },
  { label: 'News', icon: Newspaper, href: '/news' },
  { label: 'Marketplace', icon: ShoppingBag, href: '/marketplace' },
  { label: 'Community', icon: Users, href: '/community' },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { actions } = useCartStore();
  const cartCount = actions.getCount();

  const isMarketplace = pathname === '/marketplace' || pathname.startsWith('/marketplace/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium ${
                    active
                      ? 'text-foreground bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isMarketplace && (
              <Link
                href="/marketplace/cart"
                className="relative inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors h-9 w-9 lg:h-10 lg:w-10"
                aria-label="View cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 min-w-[1.1rem]">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSearchOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>
            <div className="hidden lg:block">
              <UserMenu />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map(item => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                      active
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMenuOpen(false)}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border mt-2">
                <UserMobileMenu onMenuClose={() => setIsMenuOpen(false)} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModalDynamic isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
