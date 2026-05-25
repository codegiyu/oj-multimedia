/**
 * Source of truth: textarea-backed form fields and their API/display mapping.
 * Used to drive MultilineText rollout (admin drawers, public detail pages, previews).
 *
 * Display scopes:
 * - public_detail — full MultilineText on public detail/read pages
 * - public_list_preview — cards/lists (truncate or first-paragraph preview)
 * - admin_drawer — InfoCard preserveParagraphs / MultilineText in admin drawers
 * - admin_only — settings or admin UI only (no public prose page yet)
 * - internal_admin — reject reasons, moderation copy
 * - deferred — intentionally not paragraph UI (SEO scripts, table truncate only)
 */

export type MultilineTextDisplayScope =
  | 'public_detail'
  | 'public_list_preview'
  | 'admin_drawer'
  | 'admin_only'
  | 'internal_admin'
  | 'deferred';

export interface MultilineTextFieldEntry {
  /** Payload / entity property name */
  apiKey: string;
  /** Human label in the form */
  formLabel: string;
  /** Form or page component (relative to components/) */
  formSource: string;
  displayScopes: MultilineTextDisplayScope[];
  notes?: string;
}

export type MultilineTextFieldEntryWithEntity = MultilineTextFieldEntry & {
  entity: string;
};

export interface MultilineTextEntityGroup {
  entity: string;
  fields: MultilineTextFieldEntry[];
}

/** Prose fields entered via textarea (or equivalent) in dashboards and public forms. */
export const MULTILINE_TEXT_FIELD_REGISTRY: MultilineTextEntityGroup[] = [
  {
    entity: 'news',
    fields: [
      {
        apiKey: 'excerpt',
        formLabel: 'Excerpt',
        formSource: 'section/admin/news/CreateNewsModal',
        displayScopes: ['public_detail', 'public_list_preview', 'admin_drawer'],
      },
      {
        apiKey: 'content',
        formLabel: 'Content',
        formSource: 'section/admin/news/CreateNewsModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'API maps to fullStory.introduction on public news detail',
      },
    ],
  },
  {
    entity: 'devotional',
    fields: [
      {
        apiKey: 'excerpt',
        formLabel: 'Excerpt',
        formSource: 'section/admin/devotionals/CreateDevotionalModal',
        displayScopes: ['public_detail', 'public_list_preview', 'admin_drawer'],
      },
      {
        apiKey: 'content',
        formLabel: 'Content',
        formSource: 'section/admin/devotionals/CreateDevotionalModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'May arrive as content or fullContent string/object from API',
      },
    ],
  },
  {
    entity: 'music',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/music/CreateMusicModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
      {
        apiKey: 'lyrics',
        formLabel: 'Lyrics',
        formSource: 'section/admin/music/CreateMusicModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
      {
        apiKey: 'excerpt',
        formLabel: 'Excerpt',
        formSource: 'section/admin/music/CreateMusicModal',
        displayScopes: ['admin_drawer'],
        notes:
          'RegularInput in admin form, not textarea; still multiline-safe if stored with newlines',
      },
    ],
  },
  {
    entity: 'album',
    fields: [
      {
        apiKey: 'excerpt',
        formLabel: 'Excerpt',
        formSource: 'section/admin/albums/CreateAlbumModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/albums/CreateAlbumModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
    ],
  },
  {
    entity: 'video',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/videos/CreateVideoModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
    ],
  },
  {
    entity: 'testimony',
    fields: [
      {
        apiKey: 'content',
        formLabel: 'Content',
        formSource: 'section/admin/testimonies/CreateTestimonyModal',
        displayScopes: ['public_detail', 'public_list_preview', 'admin_drawer'],
        notes: 'Public submit: section/community/testimonies/ShareTestimony',
      },
    ],
  },
  {
    entity: 'resource',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/resources/CreateResourceModal',
        displayScopes: ['admin_drawer'],
      },
    ],
  },
  {
    entity: 'poll',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/polls/CreatePollModal',
        displayScopes: ['public_detail', 'public_list_preview', 'admin_drawer'],
        notes: 'Public submit: section/community/polls/CreatePoll',
      },
    ],
  },
  {
    entity: 'prayer_request',
    fields: [
      {
        apiKey: 'content',
        formLabel: 'Content',
        formSource: 'section/admin/prayer-requests/PrayerRequestEditModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'Public submit: section/community/prayer-requests/SubmitPrayerRequestSection',
      },
      {
        apiKey: 'answer',
        formLabel: 'Answer',
        formSource: 'section/admin/prayer-requests/AnswerPrayerRequestModal',
        displayScopes: ['public_detail', 'internal_admin'],
        notes: 'Answered prayer public views; not in admin drawer today',
      },
    ],
  },
  {
    entity: 'ask_a_pastor',
    fields: [
      {
        apiKey: 'question',
        formLabel: 'Question',
        formSource: 'section/admin/ask-a-pastor/AskAPastorQuestionEditModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'Public submit: section/community/ask-a-pastor/SubmitQuestionSection',
      },
      {
        apiKey: 'answer',
        formLabel: 'Answer',
        formSource: 'section/admin/ask-a-pastor/AnswerAskAPastorModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
      {
        apiKey: 'reason',
        formLabel: 'Reason (optional)',
        formSource: 'section/admin/ask-a-pastor/RejectAskAPastorModal',
        displayScopes: ['internal_admin'],
      },
    ],
  },
  {
    entity: 'pastor',
    fields: [
      {
        apiKey: 'bio',
        formLabel: 'Bio',
        formSource: 'section/admin/pastors/CreatePastorModal',
        displayScopes: ['admin_drawer'],
        notes: 'Public pastor profile when added',
      },
    ],
  },
  {
    entity: 'artist',
    fields: [
      {
        apiKey: 'bio',
        formLabel: 'Bio',
        formSource: 'section/admin/artists/CreateArtistModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'Also: BecomeArtistModal, ArtistPortalSettingsPageClient',
      },
    ],
  },
  {
    entity: 'vendor',
    fields: [
      {
        apiKey: 'storeDescription',
        formLabel: 'Store Description',
        formSource: 'section/admin/marketplace/CreateVendorModal',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'Also: VendorSettingsPageClient, VendorApplicationForm (raw Textarea)',
      },
      {
        apiKey: 'address',
        formLabel: 'Address',
        formSource: 'section/account/vendor/VendorSettingsPageClient',
        displayScopes: ['public_detail'],
        notes: 'Also: VendorApplicationForm, CheckoutPageClient (raw Textarea)',
      },
    ],
  },
  {
    entity: 'product',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/account/vendor/VendorNewProductPageClient',
        displayScopes: ['public_detail', 'admin_drawer'],
        notes: 'Also: VendorEditProductPageClient; admin marketplace product drawer',
      },
    ],
  },
  {
    entity: 'contact_submission',
    fields: [
      {
        apiKey: 'message',
        formLabel: 'Message',
        formSource: 'section/public/contact/ContactFormSection',
        displayScopes: ['admin_drawer'],
        notes: 'Legacy FormTemplate: lib/constants/forms.ts (message textarea)',
      },
    ],
  },
  {
    entity: 'gospel_verse',
    fields: [
      {
        apiKey: 'verse',
        formLabel: 'Verse text',
        formSource: 'admin API / seed (no Create modal in app)',
        displayScopes: ['admin_drawer'],
      },
    ],
  },
  {
    entity: 'beats_submission',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description (Optional)',
        formSource: 'section/music/forms/SubmitBeatsForm',
        displayScopes: ['deferred'],
      },
      {
        apiKey: 'pricing',
        formLabel: 'Pricing Information (Optional)',
        formSource: 'section/music/forms/SubmitBeatsForm',
        displayScopes: ['deferred'],
      },
    ],
  },
  {
    entity: 'song_upload',
    fields: [
      {
        apiKey: 'lyrics',
        formLabel: 'Lyrics (Optional)',
        formSource: 'section/music/forms/UploadSongForm',
        displayScopes: ['public_detail'],
        notes: 'Mirrors artist-portal music form fields',
      },
      {
        apiKey: 'description',
        formLabel: 'Description (Optional)',
        formSource: 'section/music/forms/UploadSongForm',
        displayScopes: ['public_detail'],
      },
    ],
  },
  {
    entity: 'artist_portal_music',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/account/artist-portal/ArtistMusicFormModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
      {
        apiKey: 'lyrics',
        formLabel: 'Lyrics',
        formSource: 'section/account/artist-portal/ArtistMusicFormModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
    ],
  },
  {
    entity: 'artist_portal_video',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/account/artist-portal/ArtistVideoFormModal',
        displayScopes: ['public_detail', 'admin_drawer'],
      },
    ],
  },
  {
    entity: 'checkout',
    fields: [
      {
        apiKey: 'notes',
        formLabel: 'Notes',
        formSource: 'section/marketplace/CheckoutPageClient',
        displayScopes: ['internal_admin'],
        notes: 'Order notes; raw Textarea',
      },
    ],
  },
  {
    entity: 'site_settings',
    fields: [
      {
        apiKey: 'description',
        formLabel: 'Description',
        formSource: 'section/admin/settings/tabs/AppDetailsTab',
        displayScopes: ['admin_only'],
      },
      {
        apiKey: 'disclaimerText',
        formLabel: 'Disclaimer Text',
        formSource: 'section/admin/settings/tabs/LegalTab',
        displayScopes: ['admin_only'],
        notes: 'Render with MultilineText if shown on public legal/footer surfaces',
      },
      {
        apiKey: 'metaDescription',
        formLabel: 'Meta Description',
        formSource: 'section/admin/settings/tabs/SEOTab',
        displayScopes: ['deferred'],
      },
      {
        apiKey: 'keywords',
        formLabel: 'Keywords',
        formSource: 'section/admin/settings/tabs/SEOTab',
        displayScopes: ['deferred'],
      },
      {
        apiKey: 'otherTrackingIds',
        formLabel: 'Other Tracking IDs',
        formSource: 'section/admin/settings/tabs/AnalyticsTab',
        displayScopes: ['deferred'],
      },
    ],
  },
  {
    entity: 'moderation',
    fields: [
      {
        apiKey: 'reason',
        formLabel: 'Reason',
        formSource: 'section/admin/shared/RejectModal',
        displayScopes: ['internal_admin'],
        notes: 'Shared reject flow across publishable entities',
      },
    ],
  },
];

/** Flat list of registry entries for lookups and rollout checks. */
export const MULTILINE_TEXT_FIELD_ENTRIES: MultilineTextFieldEntryWithEntity[] =
  MULTILINE_TEXT_FIELD_REGISTRY.flatMap(group =>
    group.fields.map(field => ({ ...field, entity: group.entity }))
  );

/** Unique API keys for prose fields (excludes deferred-only if filtered). */
export function getMultilineTextApiKeys(options?: { includeDeferred?: boolean }): string[] {
  const includeDeferred = options?.includeDeferred ?? true;
  const keys = new Set<string>();

  for (const group of MULTILINE_TEXT_FIELD_REGISTRY) {
    for (const field of group.fields) {
      if (!includeDeferred && field.displayScopes.every(s => s === 'deferred')) continue;
      keys.add(field.apiKey);
    }
  }

  return [...keys].sort();
}

export function getMultilineFieldsForEntity(entity: string): MultilineTextFieldEntry[] {
  return MULTILINE_TEXT_FIELD_REGISTRY.find(g => g.entity === entity)?.fields ?? [];
}

export function getMultilineFieldsByDisplayScope(
  scope: MultilineTextDisplayScope
): MultilineTextFieldEntryWithEntity[] {
  return MULTILINE_TEXT_FIELD_REGISTRY.flatMap(group =>
    group.fields
      .filter(f => f.displayScopes.includes(scope))
      .map(f => ({ ...f, entity: group.entity }))
  );
}

export function isMultilineTextApiKey(
  apiKey: string,
  options?: { scope?: MultilineTextDisplayScope }
): boolean {
  for (const group of MULTILINE_TEXT_FIELD_REGISTRY) {
    for (const field of group.fields) {
      if (field.apiKey !== apiKey) continue;
      if (options?.scope && !field.displayScopes.includes(options.scope)) continue;
      return true;
    }
  }
  return false;
}
