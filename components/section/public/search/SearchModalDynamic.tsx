'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { SearchModal } from './SearchModal';

const SearchModalLazy = dynamic(
  () => import('./SearchModal').then(module => ({ default: module.SearchModal })),
  { ssr: false }
);

export function SearchModalDynamic(props: ComponentProps<typeof SearchModal>) {
  return <SearchModalLazy {...props} />;
}
