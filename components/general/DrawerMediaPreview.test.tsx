import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} />
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

  it('recovers gallery tiles independently when a URL fails to load', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <DrawerMediaPreview
          alt="News gallery"
          images={['https://cdn.example.com/broken.jpg', '/b.jpg']}
        />
      );
    });

    const images = container.querySelectorAll('img');
    expect(images[0]?.getAttribute('src')).toBe('https://cdn.example.com/broken.jpg');

    await act(async () => {
      images[0]?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    const updatedImages = container.querySelectorAll('img');
    expect(updatedImages[0]?.getAttribute('src')).toBe('/placeholder.svg');
    expect(updatedImages[1]?.getAttribute('src')).toBe('/b.jpg');
  });
});
