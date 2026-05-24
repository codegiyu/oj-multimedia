import { act, type ComponentProps } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchResults } from '@/components/section/public/search/SearchResults';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: ComponentProps<'span'>) => <span {...props}>{children}</span>,
  },
}));

describe('SearchResults', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it('uses the public default image when a result has no image', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <SearchResults
          results={[
            {
              _id: 'music-1',
              title: 'Test Song',
              subtitle: 'Artist',
              type: 'music',
              meta: '1k plays',
            },
          ]}
        />
      );
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/images/album-1.jpg');
  });
});
