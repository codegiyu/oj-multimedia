/* eslint-disable react-hooks/exhaustive-deps */
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

import 'media-chrome';

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
  }, [audioUrl]);

  return (
    <div ref={rootRef} className="bg-card rounded-2xl p-6 shadow-lg border border-border/50">
      {(title || artist) && (
        <div className="mb-4 text-center">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
        </div>
      )}

      <div className="w-full min-h-[60px] overflow-hidden rounded-xl border border-border/40 bg-muted/40">
        <MediaController className="audio-player block w-full min-h-[60px] rounded-xl">
          <audio slot="media" src={audioUrl} preload="metadata" />
          <MediaControlBar className="flex w-full items-center gap-2 px-3 py-3 min-h-[60px]">
            <MediaPlayButton className="text-foreground hover:text-primary transition-colors" />
            <MediaSeekBackwardButton
              seekOffset={10}
              className="text-foreground hover:text-primary transition-colors"
            />
            <MediaSeekForwardButton
              seekOffset={10}
              className="text-foreground hover:text-primary transition-colors"
            />
            <MediaTimeRange className="min-h-2 flex-1" />
            <MediaTimeDisplay
              showDuration
              className="min-w-[100px] text-xs text-muted-foreground"
            />
            <MediaMuteButton className="text-foreground hover:text-primary transition-colors" />
            <MediaVolumeRange className="min-h-2 w-24" />
          </MediaControlBar>
        </MediaController>
      </div>
    </div>
  );
};
