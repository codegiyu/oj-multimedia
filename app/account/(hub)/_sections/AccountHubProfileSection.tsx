import { SectionLoadError } from '@/components/general/SectionLoadError';
import { AccountHubProfileBanner } from '@/components/section/account/AccountHubProfileBanner';
import { getAccountHubProfile } from '@/lib/services/accountHubData';

export async function AccountHubProfileSection() {
  const meRes = await getAccountHubProfile();

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;

    if (responseCode === 401) {
      return <AccountHubProfileBanner user={null} />;
    }

    return (
      <SectionLoadError
        title="Profile unavailable"
        message={meRes.message || 'Unable to load your profile.'}
      />
    );
  }

  return <AccountHubProfileBanner user={meRes.data.user} />;
}
