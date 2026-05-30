'use client';

import { useEffect } from 'react';
import {
  PUBLIC_CHROME_SETTINGS_SLICES,
  useInitSiteSettingsStore,
} from '@/lib/store/useSiteSettingsStore';

/** Loads footer/chrome site settings once per session; cached in Zustand. */
export function SiteSettingsBootstrap() {
  const ensureSettingsLoaded = useInitSiteSettingsStore(s => s.actions.ensureSettingsLoaded);

  useEffect(() => {
    void ensureSettingsLoaded(PUBLIC_CHROME_SETTINGS_SLICES);
  }, [ensureSettingsLoaded]);

  return null;
}
