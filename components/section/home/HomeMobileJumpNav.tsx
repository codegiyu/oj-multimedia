'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const JUMP_LINKS = [
  { id: 'music', label: 'Music' },
  { id: 'videos', label: 'Videos' },
  { id: 'news', label: 'News' },
  { id: 'marketplace', label: 'Shop' },
  { id: 'community', label: 'Community' },
] as const;

export function HomeMobileJumpNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>(JUMP_LINKS[0].id);

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = JUMP_LINKS.map(link => link.id);
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.id;
        if (top) setActiveId(top);
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.1, 0.25],
      }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== '/') return null;

  return (
    <nav
      className="lg:hidden sticky z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80"
      style={{ top: 'var(--header-height)' }}
      aria-label="Jump to homepage section">
      <div className="container mx-auto flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {JUMP_LINKS.map(link => {
          const isActive = activeId === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                'quick-link whitespace-nowrap min-h-11 shrink-0',
                isActive && 'bg-primary text-primary-foreground'
              )}
              aria-current={isActive ? 'true' : undefined}>
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
