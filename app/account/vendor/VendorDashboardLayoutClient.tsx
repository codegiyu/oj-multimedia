'use client';

import { useEffect, useState } from 'react';
import { UserDashboardShell } from '@/components/layout/user-dashboard';
import { USER_VENDOR_NAV } from '@/lib/constants/user-dashboard-nav';
import type { IVendorMeRes, PopulatedUser } from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { ReactNode } from 'react';

export function VendorDashboardLayoutClient({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error } = await callApi('VENDOR_GET_ME', {});
      if (cancelled || error || !data) return;
      const v = data as IVendorMeRes;
      setStoreName(v.storeName?.trim() ? v.storeName : null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    user?.email ||
    'Your store';
  const subtitle = storeName || fallbackName;

  return (
    <UserDashboardShell
      brandTitle="Vendor Dashboard"
      brandSubtitle={subtitle}
      items={USER_VENDOR_NAV}>
      {children}
    </UserDashboardShell>
  );
}
