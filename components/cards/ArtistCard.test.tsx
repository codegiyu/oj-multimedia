import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArtistCard } from '@/components/cards/ArtistCard';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/components/atoms/AppLink', () => ({
  AppLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/general/FillImage', () => ({
  FixedImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/components/section/community/artists/ArtistFollowButton', () => ({
  ArtistFollowButton: () => <button type="button">Follow</button>,
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

describe('ArtistCard', () => {
  it('renders verified badge outside the circular image clip', () => {
    render(
      <ArtistCard
        _id="507f1f77bcf86cd799439011"
        name="Verified Artist"
        image="/artist.jpg"
        verified
      />
    );

    const clip = container.querySelector('[data-testid="artist-card-avatar-clip"]');
    const badge = container.querySelector('[data-testid="artist-card-verified-badge"]');

    expect(clip?.className).toContain('overflow-hidden');
    expect(badge).not.toBeNull();
    expect(badge?.closest('.overflow-hidden')).toBeNull();
  });
});
