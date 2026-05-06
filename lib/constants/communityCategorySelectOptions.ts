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
export const TESTIMONY_CATEGORY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', text: 'All' },
  ...TESTIMONY_CATEGORY_SELECT_OPTIONS,
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
export const PRAYER_CATEGORY_DISPLAY_VALUES = PRAYER_CATEGORY_SELECT_OPTIONS.map(
  option => option.text
);

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

/** Public ask-a-pastor sections + submit question form */
export const ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS: SelectOption[] = [
  { value: 'faith', text: 'Faith' },
  { value: 'relationships', text: 'Relationships' },
  { value: 'spiritual-growth', text: 'Spiritual Growth' },
  { value: 'finance', text: 'Finance' },
  { value: 'bible-study', text: 'Bible Study' },
  { value: 'prayer', text: 'Prayer' },
];
export const ASK_A_PASTOR_CATEGORY_DISPLAY_VALUES = ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS.map(
  option => option.text
);

/** Devotionals category filter chips */
export const DEVOTIONAL_CATEGORY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', text: 'All' },
  { value: 'faith', text: 'Faith' },
  { value: 'peace', text: 'Peace & Rest' },
  { value: 'growth', text: 'Growth' },
  { value: 'purpose', text: 'Purpose' },
  { value: 'prayer', text: 'Prayer' },
];

export function mapPrayerCategoryTextToValue(text: string): string {
  return (
    PRAYER_CATEGORY_SELECT_OPTIONS.find(option => option.text.toLowerCase() === text.toLowerCase())
      ?.value ?? text.toLowerCase()
  );
}

export function mapAskPastorCategoryTextToValue(text: string): string {
  return (
    ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS.find(
      option => option.text.toLowerCase() === text.toLowerCase()
    )?.value ?? text.toLowerCase().replace(/\s+/g, '-')
  );
}
