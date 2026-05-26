/** Admin console staff (platform admins), distinct from platform users. */

export type StaffAccountStatus =
  | 'unverified'
  | 'invited'
  | 'active'
  | 'suspended'
  | 'deleted'
  | 'blacklisted';

export interface StaffListItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountStatus: StaffAccountStatus;
  roleSlugs: string[];
  primaryRoleSlug: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface StaffPermission {
  slug: string;
  name: string;
}

export interface StaffDetail extends StaffListItem {
  permissions: StaffPermission[];
}

export type StaffListData = {
  staff: StaffListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type StaffDetailData = {
  staff: StaffDetail;
};

export interface IAdminStaffInvitePayload {
  email: string;
  firstName: string;
  lastName: string;
  roleSlug?: 'admin' | 'super-admin';
  permissions?: string[];
}

export type IAdminStaffInviteRes = StaffDetailData;

export type IAdminStaffReinviteRes = {
  success: boolean;
};
