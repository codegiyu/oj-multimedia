import {
  LayoutDashboard,
  Settings,
  Music,
  Video,
  BookOpen,
  Newspaper,
  FileText,
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
  Mic2,
  UserRound,
  Users,
  ShieldAlert,
} from 'lucide-react';
import type { ISidebarLinkGroup } from '@/lib/types/general';
import type { AdminPermissionSlug } from '@/lib/constants/adminPermissions';

const CONTENT_READ: AdminPermissionSlug = 'admin.content.read';
const CONTENT_MODERATE: AdminPermissionSlug = 'admin.content.moderate';
const USERS_MANAGE: AdminPermissionSlug = 'admin.users.manage';
const SETTINGS_MANAGE: AdminPermissionSlug = 'admin.settings.manage';
const SYSTEM_READ: AdminPermissionSlug = 'admin.system.read';

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
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/home' },
      },
      {
        LucideIcon: Music,
        page: 'Music',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/music' },
      },
      {
        LucideIcon: DiscAlbum,
        page: 'Albums',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/albums' },
      },
      {
        LucideIcon: Video,
        page: 'Videos',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/videos' },
      },
      {
        LucideIcon: BookOpen,
        page: 'Devotionals',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/devotionals' },
      },
      {
        LucideIcon: Newspaper,
        page: 'News',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/news' },
      },
      {
        LucideIcon: Tags,
        page: 'Content categories',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/content-categories' },
      },
      {
        LucideIcon: ImageIcon,
        page: 'Home adverts',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/home-adverts' },
      },
      {
        LucideIcon: FileText,
        page: 'Resources',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/resources' },
      },
      {
        LucideIcon: Heart,
        page: 'Prayer Requests',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/prayer-requests' },
      },
      {
        LucideIcon: HelpCircle,
        page: 'Ask a Pastor',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/ask-a-pastor' },
      },
      {
        LucideIcon: MessageSquare,
        page: 'Testimonies',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/testimonies' },
      },
      {
        LucideIcon: BarChart3,
        page: 'Polls',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/polls' },
      },
      {
        LucideIcon: ShoppingCart,
        page: 'Marketplace',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/marketplace' },
      },
      {
        LucideIcon: Mic2,
        page: 'Artists',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/artists' },
      },
      {
        LucideIcon: UserRound,
        page: 'Pastors',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/pastors' },
      },
      {
        LucideIcon: UserRound,
        page: 'Pastor Applications',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/pastor-applications' },
      },
      {
        LucideIcon: Users,
        page: 'Users',
        permission: USERS_MANAGE,
        path: { prefix: '/admin', suffix: '/dashboard/users' },
      },
      {
        LucideIcon: ShieldAlert,
        page: 'Profile appeals',
        permission: CONTENT_MODERATE,
        path: { prefix: '/admin', suffix: '/dashboard/role-profile-appeals' },
      },
      /* CLIENT-HIDDEN: Admin staff / invite — uncomment when invite feature is paid for (import Shield).
      {
        LucideIcon: Shield,
        page: 'Admin staff',
        permission: CONTENT_READ,
        path: { prefix: '/admin', suffix: '/dashboard/staff' },
      },
      */
      {
        LucideIcon: TrendingUp,
        page: 'Gospel Verses',
        permission: CONTENT_READ,
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
        permission: SYSTEM_READ,
        path: { prefix: '/admin', suffix: '/dashboard/email-logs' },
      },
      {
        LucideIcon: Inbox,
        page: 'Contact Submissions',
        permission: SYSTEM_READ,
        path: { prefix: '/admin', suffix: '/dashboard/contact-submissions' },
      },
      {
        LucideIcon: FileCheck,
        page: 'Documents',
        permission: SYSTEM_READ,
        path: { prefix: '/admin', suffix: '/dashboard/documents' },
      },
      {
        LucideIcon: Settings,
        page: 'Settings',
        permission: SETTINGS_MANAGE,
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
