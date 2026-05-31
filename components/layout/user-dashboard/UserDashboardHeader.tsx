'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, HelpCircle, LogOut, Menu, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { getPersonDisplayName, getPersonInitials } from '@/lib/utils/general';
import { getPublicSiteHref } from '@/lib/constants/texts';
import type { UserDashboardSidebarProps } from './UserDashboardSidebar';
import { NavLinks } from './UserDashboardNavLinks';

export function UserDashboardHeader({
  brandTitle,
  brandSubtitle,
  items,
}: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const {
    user,
    actions: { logout },
  } = useAuthStore(state => state);

  const name = getPersonDisplayName(user?.firstName, user?.lastName, user?.email ?? '');
  const initials = getPersonInitials(user?.firstName, user?.lastName);
  const publicSiteHref = getPublicSiteHref();
  const publicSiteIsExternal = publicSiteHref.startsWith('http');

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,280px)] p-0">
            <SheetHeader className="border-b border-border px-4 py-4 text-left">
              <SheetTitle className="text-base">{brandTitle}</SheetTitle>
              <p className="text-sm font-normal text-muted-foreground">{brandSubtitle}</p>
            </SheetHeader>
            <div className="px-3 py-4">
              <NavLinks items={items} pathname={pathname} onNavigate={() => setNavOpen(false)} />
            </div>
            <div className="border-t border-border p-3">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/" onClick={() => setNavOpen(false)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to site
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden min-w-0 flex-1 md:block">
        <p className="truncate text-sm font-semibold text-foreground">{brandTitle}</p>
        <p className="truncate text-xs text-muted-foreground">{brandSubtitle}</p>
      </div>

      <div className="flex-1 md:flex-none" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-auto items-center gap-2 px-2 py-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar ?? ''} alt="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline-block">{name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{user?.email ?? ''}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/account')}>
            <User className="mr-2 h-4 w-4" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/account/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={publicSiteHref}
              className="flex cursor-pointer items-center"
              {...(publicSiteIsExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>View public site</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help &amp; Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={logout}>
            <LogOut className="mr-2 h-4 w-4 text-current" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
