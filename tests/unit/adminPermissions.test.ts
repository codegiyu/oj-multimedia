import { describe, expect, it } from 'vitest';
import { hasAdminPermission, isSuperAdminUser } from '@/lib/utils/adminPermissions';
import type { ClientAdmin } from '@/lib/constants/endpoints';

describe('adminPermissions utils', () => {
  const superAdmin: ClientAdmin = {
    _id: '1',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super@example.com',
    accountStatus: 'active',
    auth: {
      roles: [{ roleId: 'r1', slug: 'super-admin' }],
      permissions: [],
    },
    createdAt: '',
    updatedAt: '',
  };

  it('treats super-admin role as having every permission', () => {
    expect(isSuperAdminUser(superAdmin)).toBe(true);
    expect(hasAdminPermission([], 'admin.staff.manage', superAdmin)).toBe(true);
  });

  it('checks explicit permission slugs for non-super admins', () => {
    expect(
      hasAdminPermission(
        [{ slug: 'admin.content.read', name: 'Read', description: '' }],
        'admin.content.read'
      )
    ).toBe(true);
    expect(
      hasAdminPermission(
        [{ slug: 'admin.content.read', name: 'Read', description: '' }],
        'admin.staff.manage'
      )
    ).toBe(false);
  });
});
