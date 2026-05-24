import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { AudioPlayer } from '@/components/section/music/AudioPlayer';

describe('AudioPlayer', () => {
  let container: HTMLDivElement;
  let root: Root;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    container?.remove();
  });

  it('renders media-chrome controls after client mount', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <AudioPlayer
          audioUrl="https://example.com/track.mp3"
          title="Test Song"
          artist="Test Artist"
        />
      );
    });

    expect(container.querySelector('media-controller')).toBeTruthy();
    expect(container.querySelector('media-control-bar')).toBeTruthy();
    expect(container.querySelector('media-play-button')).toBeTruthy();
    expect(container.querySelector('audio')?.getAttribute('src')).toBe(
      'https://example.com/track.mp3'
    );
  });
});
