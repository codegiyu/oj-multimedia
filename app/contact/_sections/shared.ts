import { cache } from 'react';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { ContactInfo, Social } from '@/lib/types/site-settings';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === 'string');
}

export function isContactInfo(value: unknown): value is ContactInfo {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    isStringArray(v.address) &&
    isStringArray(v.tel) &&
    isStringArray(v.email) &&
    typeof v.whatsapp === 'string' &&
    typeof v.locationUrl === 'string' &&
    typeof v.officeHours === 'object' &&
    v.officeHours != null &&
    !Array.isArray(v.officeHours)
  );
}

export function isSocial(value: unknown): value is Social {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return typeof v.platform === 'string' && typeof v.href === 'string';
}

export const getContactInfo = cache(
  async (): Promise<{
    contactInfo: ContactInfo | null;
    error: string | null;
  }> => {
    const res = await callPublicServerApi('GET_SITE_SETTINGS', {
      query: '/contactInfo' as `/${string}`,
    });

    if (res.type === 'error') {
      return {
        contactInfo: null,
        error: res.error?.message ?? 'Failed to load contact information.',
      };
    }

    const contactInfo = isContactInfo(res.data) ? res.data : null;

    return { contactInfo, error: null };
  }
);

export async function getSocials(): Promise<{
  socials: Social[] | null;
  error: string | null;
}> {
  const res = await callPublicServerApi('GET_SITE_SETTINGS', {
    query: '/socials' as `/${string}`,
  });

  if (res.type === 'error') {
    return {
      socials: null,
      error: res.error?.message ?? 'Failed to load social links.',
    };
  }

  const socials = Array.isArray(res.data) ? res.data.filter(isSocial) : null;

  return { socials, error: null };
}
