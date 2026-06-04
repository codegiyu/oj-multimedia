'use client';

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
import { User, Settings, HelpCircle, LogOut, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { getPersonDisplayName, getPersonInitials } from '@/lib/utils/general';
import { getPublicSiteHref } from '@/lib/constants/texts';

export type DashboardProfileMenuVariant = 'admin' | 'account';

interface DashboardProfileMenuProps {
  variant: DashboardProfileMenuVariant;
}

export function DashboardProfileMenu({ variant }: DashboardProfileMenuProps) {
  const {
    user,
    actions: { logout },
  } = useAuthStore(state => state);
  const router = useRouter();
  const publicSiteHref = getPublicSiteHref();
  const publicSiteIsExternal = publicSiteHref.startsWith('http');

  const name = getPersonDisplayName(user?.firstName, user?.lastName, user?.email ?? '');
  const initials = getPersonInitials(user?.firstName, user?.lastName);

  const profileHref = variant === 'admin' ? '/admin/dashboard/profile' : '/account';
  const settingsHref = variant === 'admin' ? '/admin/dashboard/settings' : '/account/settings';
  const profileLabel = variant === 'admin' ? 'My Profile' : 'My account';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto items-center gap-2 px-2 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar ?? ''} alt="User avatar" />
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
        <DropdownMenuItem onClick={() => router.push(profileHref)}>
          <User className="mr-2 h-4 w-4" />
          <span>{profileLabel}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(settingsHref)}>
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
  );
}
