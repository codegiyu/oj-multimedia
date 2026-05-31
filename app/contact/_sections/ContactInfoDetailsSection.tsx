import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ContactInfoDetails } from '@/components/section/public/contact/ContactInfoDetails';
import { getContactInfo } from './shared';

export async function ContactInfoDetailsSection() {
  const { contactInfo, error } = await getContactInfo();

  if (error) {
    return <SectionLoadError title="Contact information unavailable" message={error} />;
  }

  return <ContactInfoDetails initialContactInfo={contactInfo} />;
}
