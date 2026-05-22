import { api } from '@/lib/services/callApi';
import {
  ENDPOINTS,
  type IPublicContentAnalyticsEventPayload,
  type PublicContentEntityType,
} from '@/lib/constants/endpoints';

const SESSION_KEY = 'oj_content_analytics_sid';

export function getContentAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

function sessionDedupeKey(
  entityType: PublicContentEntityType,
  entityIdOrSlug: string,
  event: IPublicContentAnalyticsEventPayload['event']
): string {
  return `oj_ca_${entityType}_${entityIdOrSlug}_${event}`;
}

/**
 * Sends a public analytics event. Fails silently. Uses sessionStorage to avoid duplicate view events per tab session.
 */
export function sendContentAnalyticsEvent(
  entityType: PublicContentEntityType,
  entityIdOrSlug: string,
  event: IPublicContentAnalyticsEventPayload['event'],
  options?: { force?: boolean }
): void {
  if (typeof window === 'undefined' || !entityIdOrSlug) return;

  if (event === 'view' && !options?.force) {
    const dedupe = sessionDedupeKey(entityType, entityIdOrSlug, event);
    try {
      if (sessionStorage.getItem(dedupe)) return;
      sessionStorage.setItem(dedupe, '1');
    } catch {
      // ignore storage failures
    }
  }

  const clientSessionId = getContentAnalyticsSessionId();
  const idempotencyKey = `${clientSessionId}:${entityType}:${entityIdOrSlug}:${event}`;

  const payload: IPublicContentAnalyticsEventPayload = {
    entityType,
    entityIdOrSlug,
    event,
    clientSessionId: clientSessionId || undefined,
  };

  void api
    .request({
      url: ENDPOINTS.PUBLIC_CONTENT_ANALYTICS_EVENT.path,
      method: 'POST',
      data: payload,
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    .catch(() => {});
}
