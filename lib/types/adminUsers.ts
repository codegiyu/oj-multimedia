/** Admin dashboard user list and detail shapes (platform users, not admins). */

export type UserAccountStatus = 'unverified' | 'active' | 'suspended' | 'deleted' | 'blacklisted';

export interface UserListItem {
  _id: string;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  avatar?: string;
  accountStatus: UserAccountStatus;
  artistId?: string;
  linkedArtistName?: string;
  vendorId?: string;
  linkedVendorName?: string;
  pastorId?: string;
  linkedPastorName?: string;
  deleteRequestedAt?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface UserDetail extends UserListItem {
  middleName?: string;
  title?: string;
  gender?: string;
  phoneNumber?: string;
  roleSlugs?: string[];
  kycEmailVerified?: boolean;
  kycPhoneVerified?: boolean;
  updatedAt?: string;
  linkedArtist?: { _id: string; name: string };
  linkedVendor?: { _id: string; storeName: string };
  linkedPastor?: { _id: string; name: string };
  deletionApprovedAt?: string;
  deletionApprovedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type UsersListData = {
  users: UserListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UserDetailData = {
  user: UserDetail;
};
