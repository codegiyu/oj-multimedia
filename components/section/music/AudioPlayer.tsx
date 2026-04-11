'use client';

/**
 * Audio Player using media-chrome
 *
 * Benefits:
 * - Battle-tested edge case handling (750K+ weekly downloads)
 * - Pre-built accessible components
 * - Full CSS customization
 * - More features (playback rate, keyboard shortcuts, etc.)
 * - Company-backed (Mux) - reliable long-term maintenance
 */

import { useEffect, useRef } from 'react';
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from 'media-chrome/react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  artist?: string;
  /** Fires once when playback actually starts. */
  onFirstPlay?: () => void;
}

export const AudioPlayer = ({ audioUrl, title, artist, onFirstPlay }: AudioPlayerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    playedRef.current = false;
  }, [audioUrl]);

  useEffect(() => {
    // Ensure media-chrome web components are properly defined
    if (typeof window !== 'undefined') {
      // The React wrapper should handle component registration
      // But we can ensure the base package is loaded
      import('media-chrome').catch(() => {
        // Media-chrome should be available via the React wrapper
      });
    }
  }, []);

  useEffect(() => {
    if (!onFirstPlay || !rootRef.current) return;
    const el = rootRef.current.querySelector('audio');
    if (!el) return;
    const onPlay = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      onFirstPlay();
    };
    el.addEventListener('play', onPlay);
    return () => el.removeEventListener('play', onPlay);
  }, [audioUrl, onFirstPlay]);

  return (
    <div ref={rootRef} className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
      {/* Title and Artist */}
      {(title || artist) && (
        <div className="mb-4 text-center">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
        </div>
      )}

      {/* Media Chrome Player */}
      <div className="w-full min-h-[60px]">
        <MediaController className="w-full audio-player">
          <audio slot="media" src={audioUrl} preload="metadata" crossOrigin="" />
          <MediaControlBar>
            <MediaPlayButton />
            <MediaSeekBackwardButton seekOffset={10} />
            <MediaSeekForwardButton seekOffset={10} />
            <MediaTimeRange />
            <MediaTimeDisplay showDuration />
            <MediaMuteButton />
            <MediaVolumeRange />
          </MediaControlBar>
        </MediaController>
      </div>

      {/* Custom Styling */}
      <style jsx global>{`
        .audio-player media-controller {
          display: block;
          width: 100%;
          min-height: 60px;
          position: relative;
          --media-primary-color: hsl(var(--primary));
          --media-secondary-color: hsl(var(--muted-foreground));
          --media-range-bar-color: hsl(var(--primary));
          --media-range-bar-buffer-color: hsl(var(--muted));
          --media-range-bar-track-color: hsl(var(--muted));
          --media-control-background: transparent;
          --media-control-hover-background: hsl(var(--muted) / 0.5);
        }

        .audio-player media-control-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          min-height: 60px;
        }

        .audio-player media-play-button,
        .audio-player media-seek-backward-button,
        .audio-player media-seek-forward-button,
        .audio-player media-mute-button {
          width: 2.5rem;
          height: 2.5rem;
          min-width: 2.5rem;
          min-height: 2.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .audio-player media-time-range {
          flex: 1;
          height: 0.5rem;
          min-height: 0.5rem;
        }

        .audio-player media-volume-range {
          width: 6rem;
          min-width: 6rem;
          height: 0.5rem;
          min-height: 0.5rem;
        }

        .audio-player media-time-display {
          min-width: 100px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};
