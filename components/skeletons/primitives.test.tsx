import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SectionSkeleton,
  MusicCardSkeleton,
  ChartCardSkeleton,
  ArtistCardSkeleton,
} from '@/components/skeletons';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

function render(ui: ReactElement) {
  act(() => {
    root.render(ui);
  });
}

describe('Skeleton primitives', () => {
  it('uses motion-safe pulse on base Skeleton', () => {
    render(<Skeleton className="h-4 w-4" />);

    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el?.className).toContain('motion-safe:animate-pulse');
    expect(el?.getAttribute('aria-hidden')).toBe('true');
  });

  it('SectionSkeleton mirrors SectionComp padding', () => {
    render(
      <SectionSkeleton>
        <div data-testid="inner" />
      </SectionSkeleton>
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('py-16');
    expect(section?.className).toContain('md:py-24');
  });

  it('MusicCardSkeleton uses square art and rounded-2xl shell', () => {
    render(<MusicCardSkeleton />);

    expect(container.querySelector('.rounded-2xl')).toBeTruthy();
    expect(container.querySelector('.aspect-square')).toBeTruthy();
  });

  it('ChartCardSkeleton uses chart row dimensions', () => {
    render(<ChartCardSkeleton />);

    expect(container.querySelector('.w-12.h-12.rounded-lg')).toBeTruthy();
    expect(container.querySelector('.w-8')).toBeTruthy();
  });

  it('ArtistCardSkeleton uses muted card shell and 64px avatar', () => {
    render(<ArtistCardSkeleton />);

    expect(container.querySelector('.bg-muted\\/50')).toBeTruthy();
    expect(container.querySelector('.w-16.h-16.rounded-full')).toBeTruthy();
  });
});
