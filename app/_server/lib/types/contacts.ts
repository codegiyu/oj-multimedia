import type { Permission } from './constants';

export const PERMISSION_SLUGS = {
  // Admin permissions
  ADMIN_LIST: 'admin:list',
  ADMIN_VIEW: 'admin:view',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',

  // User permissions
  USER_LIST: 'user:list',
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Site Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',
} as const;

// Array of all admin permissions
export const ALL_ADMIN_PERMISSIONS: Permission[] = [
  // Admin permissions
  {
    slug: PERMISSION_SLUGS.ADMIN_LIST,
    name: 'List Admins',
    description: 'Permission to view list of all admins',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_VIEW,
    name: 'View Admin',
    description: 'Permission to view admin details',
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_CREATE,
    name: 'Create Admin',
    description: 'Permission to create new admin accounts',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_UPDATE,
    name: 'Update Admin',
    description: 'Permission to update admin information',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_DELETE,
    name: 'Delete Admin',
    description: 'Permission to delete admin accounts',
    isRestricted: true,
  },

  // User permissions
  {
    slug: PERMISSION_SLUGS.USER_LIST,
    name: 'List Users',
    description: 'Permission to view list of all users',
  },
  {
    slug: PERMISSION_SLUGS.USER_VIEW,
    name: 'View User',
    description: 'Permission to view user details',
  },
  {
    slug: PERMISSION_SLUGS.USER_CREATE,
    name: 'Create User',
    description: 'Permission to create new user accounts',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.USER_UPDATE,
    name: 'Update User',
    description: 'Permission to update user information',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.USER_DELETE,
    name: 'Delete User',
    description: 'Permission to delete user accounts',
    isRestricted: true,
  },

  // Site Settings permissions
  {
    slug: PERMISSION_SLUGS.SETTINGS_VIEW,
    name: 'View Settings',
    description: 'Permission to view site settings',
  },
  {
    slug: PERMISSION_SLUGS.SETTINGS_UPDATE,
    name: 'Update Settings',
    description: 'Permission to update site settings',
  },
];

// Basic admin permission slugs (read-only and basic content management)
export const BASIC_ADMIN_PERMISSION_SLUGS: string[] = [
  // View permissions
  PERMISSION_SLUGS.ADMIN_VIEW,
  PERMISSION_SLUGS.USER_LIST,
  PERMISSION_SLUGS.USER_VIEW,
  PERMISSION_SLUGS.SETTINGS_VIEW,
];
