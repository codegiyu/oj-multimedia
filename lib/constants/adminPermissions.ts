/** Mirrors oj-backend/src/constants/adminPermissions.ts slug values. */
export const ADMIN_PERMISSION_SLUGS = [
  'admin.content.read',
  'admin.content.write',
  'admin.content.delete',
  'admin.content.moderate',
  'admin.users.manage',
  'admin.staff.manage',
  'admin.settings.manage',
  'admin.system.read',
] as const;

export type AdminPermissionSlug = (typeof ADMIN_PERMISSION_SLUGS)[number];

export const SUPER_ADMIN_ROLE_SLUG = 'super-admin';
