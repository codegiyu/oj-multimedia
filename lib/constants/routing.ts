import {
  LayoutDashboard,
  Settings,
  Music,
  BookOpen,
  Newspaper,
  FileText,
  Users,
  LogOut,
  ShoppingCart,
  Heart,
  MessageSquare,
  TrendingUp,
  Mail,
} from 'lucide-react';
import type { ISidebarLinkGroup } from '@/lib/types/general';

export const unprotectedRoutes = new Set([
  '/admin/auth/login',
  '/admin/auth/accept-invite/create-password',
  '/admin/auth/request-password-reset',
  '/admin/auth/reset-password-mail-notification',
  '/admin/auth/reset-password',
]);

export const authenticatedAuthRoutes = new Set<string>([]);
export const noAuthCheckRoutes: string[] = [];

export const sidebarLinksData: ISidebarLinkGroup[] = [
  {
    groupName: 'Main',
    links: [
      {
        LucideIcon: LayoutDashboard,
        page: 'Dashboard',
        path: { prefix: '/admin', suffix: '/dashboard/home' },
      },
      {
        LucideIcon: Music,
        page: 'Music',
        path: { prefix: '/admin', suffix: '/dashboard/music' },
      },
      {
        LucideIcon: BookOpen,
        page: 'Devotionals',
        path: { prefix: '/admin', suffix: '/dashboard/devotionals' },
      },
      {
        LucideIcon: Newspaper,
        page: 'News',
        path: { prefix: '/admin', suffix: '/dashboard/news' },
      },
      {
        LucideIcon: FileText,
        page: 'Resources',
        path: { prefix: '/admin', suffix: '/dashboard/resources' },
      },
      {
        LucideIcon: Heart,
        page: 'Prayer Requests',
        path: { prefix: '/admin', suffix: '/dashboard/prayer-requests' },
      },
      {
        LucideIcon: MessageSquare,
        page: 'Testimonies',
        path: { prefix: '/admin', suffix: '/dashboard/testimonies' },
      },
      {
        LucideIcon: ShoppingCart,
        page: 'Marketplace',
        path: { prefix: '/admin', suffix: '/dashboard/marketplace' },
      },
      {
        LucideIcon: Users,
        page: 'Artists & Pastors',
        path: { prefix: '/admin', suffix: '/dashboard/artists-pastors' },
      },
      {
        LucideIcon: TrendingUp,
        page: 'Gospel Verses',
        path: { prefix: '/admin', suffix: '/dashboard/gospel-verses' },
      },
    ],
  },
  {
    groupName: 'System',
    links: [
      {
        LucideIcon: Mail,
        page: 'Email Logs',
        path: { prefix: '/admin', suffix: '/dashboard/email-logs' },
      },
      {
        LucideIcon: Settings,
        page: 'Settings',
        path: { prefix: '/admin', suffix: '/dashboard/settings' },
      },
    ],
  },
];

export const bottomBarLinks: ISidebarLinkGroup = {
  groupName: '',
  links: [
    {
      LucideIcon: LogOut,
      page: 'Logout',
      action: () => {
        // Import dynamically to avoid circular dependency
        import('@/lib/store/useAuthStore').then(({ useInitAuthStore }) => {
          useInitAuthStore.getState().actions.logout();
        });
      },
    },
  ],
};

export const pageHeadingsData = {} as const;
