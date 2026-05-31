'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { PUBLIC_URL_KEYS } from '@/lib/constants/publicUrlKeys';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { SectionTabs } from '@/components/general/SectionTabs';

interface HomeVideoCategoryNavProps {
  categoryOptions: CategoryNavItem[];
}

export function HomeVideoCategoryNav({ categoryOptions }: HomeVideoCategoryNavProps) {
  const router = useRouter();
  const [, setActiveCategory] = useQueryState(
    PUBLIC_URL_KEYS.VIDEO_CATEGORY,
    parseAsString.withDefault(ALL_CATEGORY_ID).withOptions({ shallow: true, history: 'replace' })
  );

  const tabs = categoryOptions.map(opt => ({ id: opt.id, label: opt.label }));

  const handleTabChange = async (tabId: string) => {
    await setActiveCategory(tabId === ALL_CATEGORY_ID ? null : tabId);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 pt-2 pb-4 bg-muted/30">
      <SectionTabs
        tabs={tabs}
        queryKey={PUBLIC_URL_KEYS.VIDEO_CATEGORY}
        defaultTab={ALL_CATEGORY_ID}
        onTabChange={tabId => void handleTabChange(tabId)}
        iconColor="secondary"
      />
    </div>
  );
}
