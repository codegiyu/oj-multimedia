'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import { BookOpen } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'faith', label: 'Faith' },
  { id: 'peace', label: 'Peace & Rest' },
  { id: 'growth', label: 'Growth' },
  { id: 'purpose', label: 'Purpose' },
  { id: 'prayer', label: 'Prayer' },
];

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
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          type="button"
          onClick={() => void handleChange(cat.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            category === cat.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}>
          {cat.label}
        </button>
      ))}
    </div>
  );
};
