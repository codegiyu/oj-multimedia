/* eslint-disable react-hooks/exhaustive-deps */
'use client';

/**
 * Video Player using media-chrome
 *
 * Benefits:
 * - Battle-tested edge case handling (750K+ weekly downloads)
 * - Pre-built accessible components
 * - Full CSS customization
 * - Supports picture-in-picture, fullscreen, playback rate
 * - Keyboard shortcuts built-in
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
  MediaPipButton,
  MediaFullscreenButton,
  MediaPlaybackRateButton,
} from 'media-chrome/react';
import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  poster?: string;
  title?: string;
  description?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  /** Fires once when playback actually starts. */
  onFirstPlay?: () => void;
}

export const VideoPlayer = ({
  videoUrl,
  poster,
  title,
  description,
  autoplay = false,
  muted = false,
  loop = false,
  className = '',
  onFirstPlay,
}: VideoPlayerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    playedRef.current = false;
  }, [videoUrl]);

  useEffect(() => {
    if (!onFirstPlay || !rootRef.current) return;
    const el = rootRef.current.querySelector('video');
    if (!el) return;
    const onPlay = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      onFirstPlay();
    };
    el.addEventListener('play', onPlay);
    return () => el.removeEventListener('play', onPlay);
  }, [videoUrl]);

  return (
    <div
      ref={rootRef}
      className={`bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 ${className}`}>
      {/* Title and Description */}
      {(title || description) && (
        <div className="p-6 pb-4">
          {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Media Chrome Player */}
      <MediaController className="w-full video-player">
        <video
          slot="media"
          src={videoUrl}
          poster={poster}
          preload="metadata"
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          crossOrigin=""
          className="w-full aspect-video object-contain bg-black"
        />
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
          <MediaPlaybackRateButton className="text-foreground hover:text-primary transition-colors" />
          <MediaMuteButton className="text-foreground hover:text-primary transition-colors" />
          <MediaVolumeRange className="w-24" />
          <MediaPipButton className="text-foreground hover:text-primary transition-colors" />
          <MediaFullscreenButton className="text-foreground hover:text-primary transition-colors" />
        </MediaControlBar>
      </MediaController>

      {/* Custom Styling */}
      <style jsx global>{`
        .video-player media-controller {
          --media-primary-color: hsl(var(--primary));
          --media-secondary-color: hsl(var(--muted-foreground));
          --media-range-bar-color: hsl(var(--primary));
          --media-range-bar-buffer-color: hsl(var(--primary) / 0.3);
          --media-range-bar-track-color: hsl(var(--muted));
          --media-control-background: hsl(var(--card) / 0.95);
          --media-control-hover-background: hsl(var(--muted) / 0.5);
        }

        .video-player media-control-bar {
          padding: 0.75rem 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
        }

        .video-player media-play-button,
        .video-player media-seek-backward-button,
        .video-player media-seek-forward-button,
        .video-player media-mute-button,
        .video-player media-pip-button,
        .video-player media-fullscreen-button,
        .video-player media-playback-rate-button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
        }

        .video-player media-time-range {
          height: 0.5rem;
        }

        .video-player media-volume-range {
          height: 0.5rem;
        }

        /* Hide controls when not hovering (optional enhancement) */
        .video-player media-controller:not(:hover) media-control-bar {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-player media-controller:hover media-control-bar,
        .video-player media-controller[media-paused] media-control-bar {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
