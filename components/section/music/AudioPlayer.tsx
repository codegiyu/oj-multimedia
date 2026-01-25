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
}

export const AudioPlayer = ({ audioUrl, title, artist }: AudioPlayerProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
      {/* Title and Artist */}
      {(title || artist) && (
        <div className="mb-4 text-center">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
        </div>
      )}

      {/* Media Chrome Player */}
      <MediaController className="w-full audio-player">
        <audio slot="media" src={audioUrl} preload="metadata" />
        <MediaControlBar className="flex items-center gap-2 w-full">
          <MediaPlayButton className="text-foreground hover:text-primary transition-colors" />
          <MediaSeekBackwardButton
            seekOffset={10}
            className="text-foreground hover:text-primary transition-colors"
          />
          <MediaSeekForwardButton
            seekOffset={10}
            className="text-foreground hover:text-primary transition-colors"
          />
          <MediaTimeRange className="flex-1" />
          <MediaTimeDisplay showDuration className="text-xs text-muted-foreground min-w-[100px]" />
          <MediaMuteButton className="text-foreground hover:text-primary transition-colors" />
          <MediaVolumeRange className="w-24" />
        </MediaControlBar>
      </MediaController>

      {/* Custom Styling */}
      <style jsx global>{`
        .audio-player media-controller {
          --media-primary-color: hsl(var(--primary));
          --media-secondary-color: hsl(var(--muted-foreground));
          --media-range-bar-color: hsl(var(--primary));
          --media-range-bar-buffer-color: hsl(var(--muted));
          --media-range-bar-track-color: hsl(var(--muted));
          --media-control-background: transparent;
          --media-control-hover-background: hsl(var(--muted) / 0.5);
        }

        .audio-player media-control-bar {
          padding: 0.5rem 0;
        }

        .audio-player media-play-button,
        .audio-player media-seek-backward-button,
        .audio-player media-seek-forward-button,
        .audio-player media-mute-button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
        }

        .audio-player media-time-range {
          height: 0.5rem;
        }

        .audio-player media-volume-range {
          height: 0.5rem;
        }
      `}</style>
    </div>
  );
};
