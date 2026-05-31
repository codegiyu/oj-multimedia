import { SectionLoadError } from '@/components/general/SectionLoadError';
import { SocialsLinks } from '@/components/section/public/contact/SocialsLinks';
import { getSocials } from './shared';

export async function SocialsSection() {
  const { socials, error } = await getSocials();

  if (error) {
    return <SectionLoadError title="Social links unavailable" message={error} />;
  }

  return <SocialsLinks initialSocials={socials} />;
}
