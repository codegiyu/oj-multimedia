'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { PUBLIC_URL_KEYS } from '@/lib/constants/publicUrlKeys';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { SectionTabs } from '@/components/general/SectionTabs';

interface HomeMusicCategoryNavProps {
  categoryOptions: CategoryNavItem[];
}

export function HomeMusicCategoryNav({ categoryOptions }: HomeMusicCategoryNavProps) {
  const router = useRouter();
  const [, setActiveCategory] = useQueryState(
    PUBLIC_URL_KEYS.MUSIC_CATEGORY,
    parseAsString.withDefault(ALL_CATEGORY_ID).withOptions({ shallow: true, history: 'replace' })
  );

  const tabs = categoryOptions.map(opt => ({ id: opt.id, label: opt.label }));

  const handleTabChange = async (tabId: string) => {
    await setActiveCategory(tabId === ALL_CATEGORY_ID ? null : tabId);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 pt-2 pb-4">
      <SectionTabs
        tabs={tabs}
        queryKey={PUBLIC_URL_KEYS.MUSIC_CATEGORY}
        defaultTab={ALL_CATEGORY_ID}
        onTabChange={tabId => void handleTabChange(tabId)}
        iconColor="primary"
      />
    </div>
  );
}
