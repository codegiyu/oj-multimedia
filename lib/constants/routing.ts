import {
  LayoutDashboard,
  Settings,
  Music,
  Video,
  BookOpen,
  Newspaper,
  FileText,
  Users,
  LogOut,
  ShoppingCart,
  Heart,
  HelpCircle,
  MessageSquare,
  TrendingUp,
  Mail,
  Inbox,
  BarChart3,
  FileCheck,
  Tags,
  ImageIcon,
  DiscAlbum,
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
        LucideIcon: DiscAlbum,
        page: 'Albums',
        path: { prefix: '/admin', suffix: '/dashboard/albums' },
      },
      {
        LucideIcon: Video,
        page: 'Videos',
        path: { prefix: '/admin', suffix: '/dashboard/videos' },
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
        LucideIcon: Tags,
        page: 'Content categories',
        path: { prefix: '/admin', suffix: '/dashboard/content-categories' },
      },
      {
        LucideIcon: ImageIcon,
        page: 'Home adverts',
        path: { prefix: '/admin', suffix: '/dashboard/home-adverts' },
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
        LucideIcon: HelpCircle,
        page: 'Ask a Pastor',
        path: { prefix: '/admin', suffix: '/dashboard/ask-a-pastor' },
      },
      {
        LucideIcon: MessageSquare,
        page: 'Testimonies',
        path: { prefix: '/admin', suffix: '/dashboard/testimonies' },
      },
      {
        LucideIcon: BarChart3,
        page: 'Polls',
        path: { prefix: '/admin', suffix: '/dashboard/polls' },
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
        LucideIcon: Inbox,
        page: 'Contact Submissions',
        path: { prefix: '/admin', suffix: '/dashboard/contact-submissions' },
      },
      {
        LucideIcon: FileCheck,
        page: 'Documents',
        path: { prefix: '/admin', suffix: '/dashboard/documents' },
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
