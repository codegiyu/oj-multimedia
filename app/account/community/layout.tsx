import type { ReactNode } from 'react';
import { AccountCommunityLayoutClient } from './AccountCommunityLayoutClient';

export const dynamic = 'force-dynamic';

export default function AccountCommunityLayout({ children }: { children: ReactNode }) {
  return <AccountCommunityLayoutClient>{children}</AccountCommunityLayoutClient>;
}
