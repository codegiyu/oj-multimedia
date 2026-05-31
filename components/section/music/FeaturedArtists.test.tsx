import { act, type ComponentProps, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeaturedArtists } from '@/components/section/music/FeaturedArtists';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/components/cards/ArtistCard', () => ({
  ArtistCard: ({ name }: { name: string }) => <div data-testid="artist-card">{name}</div>,
}));

vi.mock('@/components/general/SectionComp', () => ({
  SectionComp: ({ children, heading }: { children: React.ReactNode; heading: string }) => (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  ),
}));

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

describe('FeaturedArtists', () => {
  it('shows section empty state when there are no artists', () => {
    render(<FeaturedArtists artists={[]} />);

    expect(container.querySelector('h3')?.textContent).toBe('No featured artists yet');
    expect(container.textContent).toContain('Discover artists');
    expect(container.querySelector('[data-testid="artist-card"]')).toBeNull();
  });

  it('renders artist cards when data is present', () => {
    render(
      <FeaturedArtists
        artists={[
          {
            _id: '1',
            name: 'Grace Artist',
            genre: 'Gospel',
            image: '/img.jpg',
            followers: '1k',
            verified: true,
            songs: 3,
          },
        ]}
      />
    );

    expect(container.querySelector('[data-testid="artist-card"]')?.textContent).toBe(
      'Grace Artist'
    );
    expect(container.textContent).not.toContain('No featured artists yet');
  });
});
