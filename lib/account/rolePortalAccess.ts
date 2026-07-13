import type { RolePortalStatus } from '@/lib/types/rolePortal';

/** True when a portal list/detail API refusal should not blank the page. */
export function isPortalForbiddenCode(responseCode: number | undefined): boolean {
  return responseCode === 403 || responseCode === 404;
}

/** Only `active` portals should render dashboard children. */
export function isRolePortalOperational(status: RolePortalStatus | undefined): boolean {
  return status === 'active';
}

export function isRolePortalPending(status: RolePortalStatus | undefined): boolean {
  return status === 'pending';
}

export function isRolePortalInactiveOrRejected(status: RolePortalStatus | undefined): boolean {
  return status === 'inactive' || status === 'rejected';
}

export function isRolePortalLifecycleBlocked(status: RolePortalStatus | undefined): boolean {
  return status === 'deactivated' || status === 'suspended';
}
