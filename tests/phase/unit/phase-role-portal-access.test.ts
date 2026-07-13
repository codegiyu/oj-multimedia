import { describe, expect, it } from 'vitest';
import {
  isPortalForbiddenCode,
  isRolePortalInactiveOrRejected,
  isRolePortalOperational,
  isRolePortalPending,
  isRolePortalLifecycleBlocked,
} from '@/lib/account/rolePortalAccess';

describe('rolePortalAccess (phase portal UX)', () => {
  it('treats only active as operational for dashboard children', () => {
    expect(isRolePortalOperational('active')).toBe(true);
    expect(isRolePortalOperational('pending')).toBe(false);
    expect(isRolePortalOperational('inactive')).toBe(false);
    expect(isRolePortalOperational('suspended')).toBe(false);
  });

  it('classifies pending and inactive/rejected statuses', () => {
    expect(isRolePortalPending('pending')).toBe(true);
    expect(isRolePortalInactiveOrRejected('inactive')).toBe(true);
    expect(isRolePortalInactiveOrRejected('rejected')).toBe(true);
    expect(isRolePortalLifecycleBlocked('deactivated')).toBe(true);
    expect(isRolePortalLifecycleBlocked('suspended')).toBe(true);
  });

  it('recognizes portal forbidden response codes', () => {
    expect(isPortalForbiddenCode(403)).toBe(true);
    expect(isPortalForbiddenCode(404)).toBe(true);
    expect(isPortalForbiddenCode(500)).toBe(false);
  });
});
