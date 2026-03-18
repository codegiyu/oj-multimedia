import { MainLayout } from '@/components/layout/MainLayout';
import { ContactHero } from '@/components/section/public/contact/ContactHero';
import { ContactPageClient } from '@/components/section/public/contact';
import { callServerApi } from '@/lib/services/serverApi';
import type { ContactInfo, Social } from '@/lib/types/site-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Have a question, prayer request, or want to partner with us? Reach out and let's connect.",
};

export const dynamic = 'force-dynamic';

async function fetchContactPageData(): Promise<{
  contactInfo: ContactInfo | null;
  socials: Social[] | null;
  error: string | null;
}> {
  const [contactRes, socialsRes] = await Promise.all([
    callServerApi('GET_SITE_SETTINGS', { query: '/contactInfo' as `/${string}` }),
    callServerApi('GET_SITE_SETTINGS', { query: '/socials' as `/${string}` }),
  ]);

  const contactError = contactRes.error?.message ?? null;
  const socialsError = socialsRes.error?.message ?? null;
  const error = contactError || socialsError;

  const contactInfo =
    contactRes.data && typeof contactRes.data === 'object' && !Array.isArray(contactRes.data)
      ? (contactRes.data as unknown as ContactInfo)
      : null;
  const socials =
    socialsRes.data != null && Array.isArray(socialsRes.data)
      ? (socialsRes.data as Social[])
      : socialsRes.data != null &&
          typeof socialsRes.data === 'object' &&
          'socials' in socialsRes.data &&
          Array.isArray((socialsRes.data as { socials: Social[] }).socials)
        ? (socialsRes.data as { socials: Social[] }).socials
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
