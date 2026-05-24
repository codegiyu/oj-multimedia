import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

describe('DashboardThumbnail', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it('renders the dashboard placeholder when src is missing', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(<DashboardThumbnail alt="Music cover" />);
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('renders the provided src when present', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(<DashboardThumbnail src="/uploads/cover.jpg" alt="Music cover" />);
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/uploads/cover.jpg');
  });
});
