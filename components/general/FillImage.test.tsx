import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FillImage, FixedImage } from '@/components/general/FillImage';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    width,
    height,
    onError,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    onError?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      width={width}
      height={height}
      onError={onError}
    />
  ),
}));

describe('FillImage', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  async function renderFillImage(props: React.ComponentProps<typeof FillImage>) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <FillImage {...props} />
        </div>
      );
    });
  }

  it('renders nothing when src is empty and no imageContext is set', async () => {
    await renderFillImage({ src: '', alt: 'Cover' });

    expect(container.querySelector('img')).toBeNull();
  });

  it('uses the public default when src is empty and imageContext is public', async () => {
    await renderFillImage({ src: '', alt: 'Cover', imageContext: 'public' });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/images/album-1.jpg');
  });

  it('uses the dashboard default when src is empty and imageContext is dashboard', async () => {
    await renderFillImage({ src: ' ', alt: 'Cover', imageContext: 'dashboard' });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('renders the provided src when present', async () => {
    await renderFillImage({
      src: 'https://cdn.example.com/cover.jpg',
      alt: 'Cover',
      imageContext: 'public',
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://cdn.example.com/cover.jpg');
  });

  it('swaps to the public default when the primary URL fails to load', async () => {
    await renderFillImage({
      src: 'https://cdn.example.com/broken.jpg',
      alt: 'Cover',
      imageContext: 'public',
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://cdn.example.com/broken.jpg');

    await act(async () => {
      img?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/images/album-1.jpg');
  });

  it('swaps to the dashboard default when the primary URL fails to load', async () => {
    await renderFillImage({
      src: 'https://cdn.example.com/broken.jpg',
      alt: 'Cover',
      imageContext: 'dashboard',
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('does not swap src on error when imageContext is not set', async () => {
    await renderFillImage({
      src: 'https://cdn.example.com/broken.jpg',
      alt: 'Cover',
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/broken.jpg'
    );
  });

  it('does not retry fallback when the default image also fails to load', async () => {
    await renderFillImage({
      src: 'https://cdn.example.com/broken.jpg',
      alt: 'Cover',
      imageContext: 'dashboard',
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/placeholder.svg');

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('resets display src when the src prop changes', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <FillImage src="https://cdn.example.com/first.jpg" alt="Cover" imageContext="public" />
        </div>
      );
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/images/album-1.jpg');

    await act(async () => {
      root.render(
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <FillImage src="https://cdn.example.com/second.jpg" alt="Cover" imageContext="public" />
        </div>
      );
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/second.jpg'
    );
  });
});

describe('FixedImage', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it('uses the dashboard default when src is empty and imageContext is dashboard', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(<FixedImage src="" alt="Logo" width={40} height={40} imageContext="dashboard" />);
    });

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/placeholder.svg');
  });

  it('swaps to the dashboard default when the primary URL fails to load', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <FixedImage
          src="https://cdn.example.com/broken.jpg"
          alt="Logo"
          width={40}
          height={40}
          imageContext="dashboard"
        />
      );
    });

    await act(async () => {
      container.querySelector('img')?.dispatchEvent(new Event('error', { bubbles: true }));
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/placeholder.svg');
  });
});
