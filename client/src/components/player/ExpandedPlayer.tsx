import React from 'react';
import { ExternalLink, Heart, Pause, Play, SkipBack, SkipForward, Sparkles, X } from 'lucide-react';
import { SectionKicker } from '../layout/SectionKicker';
import { Poster } from './Poster';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

export function ExpandedPlayer() {
  const {
    currentSong,
    queue,
    isPlaying,
    isExpanded,
    radioName,
    favorites,
    play,
    togglePlayPause,
    next,
    previous,
    toggleFavorite,
    setIsExpanded,
  } = useMusicPlayer();

  if (!isExpanded || !currentSong) return null;

  return (
    <div
      data-testid="panel-expanded-player"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground))]/55 p-0 sm:items-center sm:p-5"
      onClick={() => setIsExpanded(false)}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-[620px] overflow-y-auto rounded-t-[1.8rem] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--background))] p-5 shadow-ink sm:rounded-[1.8rem] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="button-close-expanded-player"
          onClick={() => setIsExpanded(false)}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-[hsl(var(--muted))]"
          aria-label="Close expanded player"
        >
          <X size={18} />
        </button>
        <SectionKicker>now playing / {radioName}</SectionKicker>
        <div className="mt-6 grid gap-6 sm:grid-cols-[170px_1fr] sm:items-center">
          <Poster track={currentSong} />
          <div>
            <p className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
              {currentSong.movie} · {currentSong.year}
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold leading-[.9] tracking-[-.06em]">
              {currentSong.title}
            </h2>
            <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
              {currentSong.artist}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <button
                data-testid="button-expanded-previous"
                onClick={previous}
                className="rounded-full border border-[hsl(var(--foreground))]/15 p-3"
              >
                <SkipBack size={16} />
              </button>
              <button
                data-testid="button-expanded-play"
                onClick={togglePlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                data-testid="button-expanded-next"
                onClick={next}
                className="rounded-full border border-[hsl(var(--foreground))]/15 p-3"
              >
                <SkipForward size={16} />
              </button>
              <button
                data-testid="button-expanded-favorite"
                onClick={() => toggleFavorite(currentSong.id)}
                className={`ml-auto rounded-full border border-[hsl(var(--foreground))]/15 p-3 ${
                  favorites.includes(currentSong.id) ? 'text-[hsl(var(--primary))]' : ''
                }`}
              >
                <Heart
                  size={16}
                  fill={favorites.includes(currentSong.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-7 rounded-xl border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--muted))]/60 p-3">
          <div className="flex items-start gap-3">
            <ExternalLink size={16} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />
            <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              Audio is not hosted here. Use the official YouTube fallback to listen to this track; this keeps the jukebox respectful of artists and rightsholders.
            </p>
          </div>
          <button
            data-testid="button-expanded-youtube"
            onClick={() => window.open(currentSong.youtubeUrl, '_blank', 'noopener,noreferrer')}
            className="mt-3 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))] cursor-pointer"
          >
            Open on YouTube <ExternalLink size={12} className="ml-1 inline" />
          </button>
        </div>
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold">Up next</h3>
            <span className="font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
              {queue.length} tracks / queued
            </span>
          </div>
          <div className="mt-3 space-y-1">
            {queue.slice(0, 5).map((track, index) => (
              <button
                data-testid={`button-expanded-queue-${track.id}`}
                key={track.id}
                onClick={() => play(track, queue)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left ${
                  track.id === currentSong.id ? 'bg-[hsl(var(--secondary))]/35' : 'hover:bg-[hsl(var(--muted))]'
                }`}
              >
                <span className="w-5 font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Poster track={track} size="small" />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{track.title}</strong>
                  <small className="block truncate text-xs text-[hsl(var(--muted-foreground))]">
                    {track.artist}
                  </small>
                </span>
                {track.id === currentSong.id && (
                  <Sparkles size={14} className="text-[hsl(var(--primary))]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
