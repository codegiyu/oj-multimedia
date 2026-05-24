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
    onError,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    onError?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} onError={onError} />
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

  it('swaps to the dashboard placeholder when the primary URL fails to load', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <DashboardThumbnail src="https://cdn.example.com/broken.jpg" alt="Music cover" />
      );
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/placeholder.svg');
  });
});
