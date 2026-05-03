import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactPageClient } from '@/components/section/public/contact';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { ContactInfo, Social } from '@/lib/types/site-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Have a question, prayer request, or want to partner with us? Reach out and let's connect.",
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === 'string');
}

function isContactInfo(value: unknown): value is ContactInfo {
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

function isSocial(value: unknown): value is Social {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return typeof v.platform === 'string' && typeof v.href === 'string';
}

async function fetchContactPageData(): Promise<{
  contactInfo: ContactInfo | null;
  socials: Social[] | null;
  error: string | null;
}> {
  const [contactRes, socialsRes] = await Promise.all([
    callPublicServerApi('GET_SITE_SETTINGS', { query: '/contactInfo' as `/${string}` }),
    callPublicServerApi('GET_SITE_SETTINGS', { query: '/socials' as `/${string}` }),
  ]);

  const contactError = contactRes.error?.message ?? null;
  const socialsError = socialsRes.error?.message ?? null;
  const error = contactError || socialsError;

  const contactInfo =
    contactRes.type === 'success' && isContactInfo(contactRes.data) ? contactRes.data : null;

  const socials =
    socialsRes.type === 'success' && Array.isArray(socialsRes.data)
      ? socialsRes.data.filter(isSocial)
      : null;

  return { contactInfo, socials, error };
}

export default async function ContactPage() {
  const { contactInfo, socials, error } = await fetchContactPageData();

  return (
    <MainLayout>
      <ContactHero />
      <ContactPageClient contactInfo={contactInfo} socials={socials} contactError={error} />
    </MainLayout>
  );
}
