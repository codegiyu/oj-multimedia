import type { ReactNode } from 'react';
import { AccountHubLayoutClient } from './AccountHubLayoutClient';

export default function AccountHubLayout({ children }: { children: ReactNode }) {
  return <AccountHubLayoutClient>{children}</AccountHubLayoutClient>;
}
