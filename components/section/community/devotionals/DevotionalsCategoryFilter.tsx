'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { BookOpen } from 'lucide-react';
import { DEVOTIONAL_CATEGORY_FILTER_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';

export const DevotionalsCategoryFilter = () => {
  const router = useRouter();
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('all'));

  const handleChange = async (value: string) => {
    await setCategory(value === 'all' ? null : value);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        <BookOpen className="w-4 h-4" />
        Category:
      </span>
      {DEVOTIONAL_CATEGORY_FILTER_OPTIONS.map(cat => (
        <button
          key={cat.value}
          type="button"
          onClick={() => void handleChange(cat.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            category === cat.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}>
          {cat.text}
        </button>
      ))}
    </div>
  );
};
