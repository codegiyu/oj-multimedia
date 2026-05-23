/**
 * Client-side completeness checks (mirrors oj-backend public catalog rules).
 */

import { isLikelyYoutubeUrl } from '@/lib/utils/videoEmbed';

const NON_EMPTY = /\S/;

export function hasNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && NON_EMPTY.test(value.trim());
}

export function isSermonCategory(category: unknown): boolean {
  if (typeof category !== 'string') return false;

  return /^sermons?$/i.test(category.trim());
}

export function isCompleteMusic(raw: Record<string, unknown>): boolean {
  if (isSermonCategory(raw.category)) {
    return hasNonEmptyString(raw.audioUrl) || hasNonEmptyString(raw.videoUrl);
  }

  return hasNonEmptyString(raw.audioUrl);
}

export function isCompleteVideo(raw: Record<string, unknown>): boolean {
  const fileFromField = typeof raw.videoFileUrl === 'string' ? raw.videoFileUrl.trim() : '';
  const legacyUrl = typeof raw.videoUrl === 'string' ? raw.videoUrl.trim() : '';
  const embedField = typeof raw.embedUrl === 'string' ? raw.embedUrl.trim() : '';

  const videoFileUrl =
    fileFromField || (legacyUrl && !isLikelyYoutubeUrl(legacyUrl) ? legacyUrl : '');
  const embedUrl = embedField || (legacyUrl && isLikelyYoutubeUrl(legacyUrl) ? legacyUrl : '');

  return Boolean(videoFileUrl || embedUrl);
}

/** List responses may omit `content`; `excerpt` is acceptable for cards. */
export function isCompleteNewsArticle(raw: Record<string, unknown>): boolean {
  return hasNonEmptyString(raw.content) || hasNonEmptyString(raw.excerpt);
}

export function isCompleteDevotional(raw: Record<string, unknown>): boolean {
  return hasNonEmptyString(raw.content) || hasNonEmptyString(raw.excerpt);
}

export function isCompleteTestimony(raw: Record<string, unknown>): boolean {
  return hasNonEmptyString(raw.content);
}

export function isCompletePrayerRequest(raw: Record<string, unknown>): boolean {
  return hasNonEmptyString(raw.content);
}

export function isCompleteResource(raw: Record<string, unknown>): boolean {
  if (raw.type === 'affiliate') return true;

  return hasNonEmptyString(raw.fileUrl);
}

export function filterCompleteMusic<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteMusic);
}

export function filterCompleteVideo<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteVideo);
}

export function filterCompleteNews<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteNewsArticle);
}

export function filterCompleteDevotionals<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteDevotional);
}

export function filterCompleteTestimonies<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteTestimony);
}

export function filterCompletePrayerRequests<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompletePrayerRequest);
}

export function filterCompleteResources<T extends Record<string, unknown>>(items: T[]): T[] {
  return items.filter(isCompleteResource);
}
