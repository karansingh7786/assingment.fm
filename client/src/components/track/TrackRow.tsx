import React from 'react';
import { Heart, Pause, Play } from 'lucide-react';
import type { Song } from '@assignment-fm/shared';
import { Poster } from '../player/Poster';

export function TrackRow({
  track,
  index,
  current,
  playing,
  onPlay,
  onFavorite,
  favorite,
}: {
  track: Song;
  index: number;
  current: boolean;
  playing: boolean;
  favorite: boolean;
  onPlay: () => void;
  onFavorite: () => void;
}) {
  return (
    <div
      data-testid={`row-track-${track.id}`}
      className={`group grid grid-cols-[32px_44px_1fr_auto] items-center gap-3 rounded-2xl p-2.5 transition-colors sm:grid-cols-[34px_48px_1fr_125px_auto_auto] sm:gap-4 sm:p-3 ${
        current ? 'bg-[hsl(var(--secondary))]/35' : 'hover:bg-[hsl(var(--muted))]'
      }`}
    >
      <span className="text-center font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <button
        data-testid={`button-play-track-${track.id}`}
        onClick={onPlay}
        className="relative h-11 w-11 overflow-hidden rounded-xl"
        aria-label={`Play ${track.title}`}
      >
        <Poster track={track} size="small" />
        <span className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--foreground))]/55 text-[hsl(var(--background))] opacity-0 transition-opacity group-hover:opacity-100">
          {current && playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </span>
      </button>
      <button
        data-testid={`button-select-track-${track.id}`}
        onClick={onPlay}
        className="min-w-0 text-left"
      >
        <span className="block truncate text-sm font-bold">{track.title}</span>
        <span className="block truncate text-xs text-[hsl(var(--muted-foreground))]">
          {track.artist}
        </span>
      </button>
      <span className="hidden truncate font-mono-custom text-[9px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))] sm:block">
        {track.label}
      </span>
      <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">
        {track.duration}
      </span>
      <button
        data-testid={`button-favorite-track-${track.id}`}
        onClick={onFavorite}
        className={`hidden rounded-full p-2 transition-colors sm:block ${
          favorite
            ? 'text-[hsl(var(--primary))]'
            : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
        }`}
        aria-label={favorite ? `Remove ${track.title} from favorites` : `Save ${track.title}`}
      >
        <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
