import type { Permission } from '@/lib/types/server-models';
import type { ClientAdmin } from '@/lib/constants/endpoints';
import { SUPER_ADMIN_ROLE_SLUG, type AdminPermissionSlug } from '@/lib/constants/adminPermissions';

export function isSuperAdminUser(user: ClientAdmin | null | undefined): boolean {
  if (!user?.auth?.roles?.length) return false;

  return user.auth.roles.some(role => role.slug === SUPER_ADMIN_ROLE_SLUG);
}

export function hasAdminPermission(
  permissions: Permission[],
  slug: AdminPermissionSlug,
  user?: ClientAdmin | null
): boolean {
  if (user && isSuperAdminUser(user)) {
    return true;
  }

  return permissions.some(permission => permission.slug === slug);
}

export function permissionsFromAdminUser(user: ClientAdmin | null | undefined): Permission[] {
  return user?.auth?.permissions ?? [];
}
