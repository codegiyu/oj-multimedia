import type { SelectOption } from '@/lib/types/general';

/** Public testimony submission + admin testimony forms */
export const TESTIMONY_CATEGORY_SELECT_OPTIONS: SelectOption[] = [
  { value: 'healing', text: 'Healing' },
  { value: 'purpose', text: 'Purpose' },
  { value: 'prayer', text: 'Prayer' },
  { value: 'marriage', text: 'Marriage' },
  { value: 'provision', text: 'Provision' },
  { value: 'deliverance', text: 'Deliverance' },
  { value: 'salvation', text: 'Salvation' },
  { value: 'blessing', text: 'Blessing' },
];

/** Public prayer request + admin prayer forms */
export const PRAYER_CATEGORY_SELECT_OPTIONS: SelectOption[] = [
  { value: 'healing', text: 'Healing' },
  { value: 'finance', text: 'Finance' },
  { value: 'family', text: 'Family' },
  { value: 'career', text: 'Career' },
  { value: 'spiritual', text: 'Spiritual' },
  { value: 'protection', text: 'Protection' },
  { value: 'other', text: 'Other' },
];

/** Public poll creation + admin poll forms */
export const POLL_CATEGORY_SELECT_OPTIONS: SelectOption[] = [
  { value: 'worship', text: 'Worship' },
  { value: 'spiritual-growth', text: 'Spiritual Growth' },
  { value: 'content', text: 'Content' },
  { value: 'devotionals', text: 'Devotionals' },
  { value: 'sermons', text: 'Sermons' },
  { value: 'ministry', text: 'Ministry' },
  { value: 'prayer', text: 'Prayer' },
  { value: 'social-media', text: 'Social Media' },
];
