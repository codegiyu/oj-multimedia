import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('DrawerMediaPreview', () => {
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
      root.render(<DrawerMediaPreview alt="News cover" />);
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('renders a gallery when images are provided', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <DrawerMediaPreview alt="News gallery" images={['/a.jpg', '/b.jpg', '/c.jpg']} />
      );
    });

    const images = container.querySelectorAll('img');
    expect(images.length).toBe(3);
    expect(images[0]?.getAttribute('src')).toBe('/a.jpg');
    expect(images[1]?.getAttribute('src')).toBe('/b.jpg');
  });
});
