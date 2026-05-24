export const CONTENT_IMAGE_DEFAULTS = {
  public: '/images/album-1.jpg',
  dashboard: '/placeholder.svg',
} as const;

export type ContentImageContext = keyof typeof CONTENT_IMAGE_DEFAULTS;

export function resolveContentImage(
  src: string | null | undefined,
  context: ContentImageContext
): string {
  const trimmed = src?.trim() ?? '';

  return trimmed || CONTENT_IMAGE_DEFAULTS[context];
}
