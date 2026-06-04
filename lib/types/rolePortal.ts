export type RolePortalStatus =
  | 'active'
  | 'deactivated'
  | 'suspended'
  | 'pending'
  | 'inactive'
  | 'none'
  | 'rejected';

export interface IRoleProfileAppealSummary {
  _id: string;
  profileType?: 'vendor' | 'artist' | 'pastor';
  profileId?: string;
  userId?: string;
  message: string;
  adminResponse?: string;
  status: string;
  createdAt?: string;
  reviewedAt?: string;
}

export interface IRolePortalMeta {
  portalStatus?: RolePortalStatus;
  statusChangedAt?: string;
  suspensionReason?: string;
  openAppeal?: IRoleProfileAppealSummary | null;
  lastRejectedAppeal?: IRoleProfileAppealSummary | null;
}

export interface AccountSuspendedPayload {
  code: 'ACCOUNT_SUSPENDED';
  suspensionReason: string;
  suspensionDate: string | null;
  contactWhatsApp: string | null;
}
