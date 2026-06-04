/**
 * Shared layout classes for MusicCard / VideoCard parents.
 * Cards have no size API — width comes from grid columns or rail wrappers.
 */

/** Full-width browse/list grids (~280px cards at xl per MusicCard image sizes). */
export const MEDIA_BROWSE_GRID_CLASS =
  'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

/** Horizontal music rails (home + hub). */
export const MUSIC_RAIL_ITEM_CLASS =
  'min-w-[240px] w-[240px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] snap-start shrink-0';

/** Default 16:9 video horizontal rails. */
export const VIDEO_DEFAULT_RAIL_ITEM_CLASS =
  'w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] xl:w-[320px] snap-start shrink-0';

/** 9:16 short-form video rails. */
export const VIDEO_SHORT_FORM_RAIL_ITEM_CLASS = 'w-[140px] md:w-[160px] snap-start shrink-0';

/** scrollBy amount for music rails (max item width at 2xl). */
export const MUSIC_RAIL_SCROLL_PX = 260;

/** scrollBy amount for default video rails (max item width at xl). */
export const VIDEO_RAIL_SCROLL_PX = 320;
