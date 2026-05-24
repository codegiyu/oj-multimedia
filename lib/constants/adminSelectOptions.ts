import type { SelectOption } from '@/lib/types/general';

export const PUBLISHABLE_STATUS_VALUES = ['draft', 'published', 'archived'] as const;

export const PUBLISHABLE_STATUS_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

export const PUBLISHABLE_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All', value: 'all' },
  ...PUBLISHABLE_STATUS_SELECT_OPTIONS,
];

export const POLL_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Closed', value: 'closed' },
];

export const PRAYER_REQUEST_STATUS_VALUES = ['active', 'answered'] as const;

export const PRAYER_REQUEST_STATUS_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'Active', value: 'active' },
  { text: 'Answered', value: 'answered' },
];

export const PRAYER_REQUEST_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All', value: 'all' },
  ...PRAYER_REQUEST_STATUS_SELECT_OPTIONS,
];

/** Ask-a-pastor admin list uses the same active/answered statuses as public community. */
export const ASK_A_PASTOR_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> =
  PRAYER_REQUEST_STATUS_FILTER_SELECT_OPTIONS;

export const GOSPEL_VERSE_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All', value: 'all' },
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
];

export const DOCUMENT_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Verified', value: 'verified' },
  { text: 'Rejected', value: 'rejected' },
];

export const EMAIL_LOG_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All Statuses', value: 'all' },
  { text: 'Pending', value: 'pending' },
  { text: 'Sent', value: 'sent' },
  { text: 'Delivered', value: 'delivered' },
  { text: 'Failed', value: 'failed' },
  { text: 'Bounced', value: 'bounced' },
];

export const DOCUMENT_ENTITY_TYPE_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All entity types', value: 'all' },
  { text: 'Vendor', value: 'vendor' },
  { text: 'Product', value: 'product' },
  { text: 'User', value: 'user' },
  { text: 'Music', value: 'music' },
  { text: 'Video', value: 'video' },
  { text: 'Artist', value: 'artist' },
];

export const DOCUMENT_INTENT_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All intents', value: 'all' },
  { text: 'Avatar', value: 'avatar' },
  { text: 'Logo', value: 'logo' },
  { text: 'Card image', value: 'card-image' },
  { text: 'Banner image', value: 'banner-image' },
  { text: 'Image', value: 'image' },
  { text: 'Other', value: 'other' },
];
