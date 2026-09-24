import React from 'react';
import { ExternalLink, Heart, ListMusic, Pause, Play, SkipBack, SkipForward, Sparkles, Trash2, X } from 'lucide-react';
import { SectionKicker } from '../layout/SectionKicker';
import { Poster } from './Poster';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

export function ExpandedPlayer() {
  const {
    currentSong,
    queue,
    currentIndex,
    isPlaying,
    isExpanded,
    radioName,
    favorites,
    play,
    togglePlayPause,
    next,
    previous,
    toggleFavorite,
    clearQueue,
    setIsExpanded,
  } = useMusicPlayer();

  if (!isExpanded || !currentSong) return null;

  const currentPos = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <div
      data-testid="panel-expanded-player"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground))]/60 p-0 sm:items-center sm:p-5 backdrop-blur-sm"
      onClick={() => setIsExpanded(false)}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-[660px] overflow-y-auto rounded-t-[2rem] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--background))] p-5 shadow-ink sm:rounded-[2rem] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="button-close-expanded-player"
          onClick={() => setIsExpanded(false)}
          className="absolute right-5 top-5 rounded-full p-2.5 hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
          aria-label="Close expanded player"
        >
          <X size={19} />
        </button>

        <SectionKicker>now on air / {radioName}</SectionKicker>

        {/* NOW PLAYING SHOWCASE */}
        <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
          <Poster track={currentSong} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
                {currentSong.movie || currentSong.album} · {currentSong.year} · {currentSong.language}
              </span>
            </div>

            <h2 className="mt-2 font-display text-4xl font-semibold leading-[.92] tracking-[-.06em]">
              {currentSong.title}
            </h2>

            <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
              {currentSong.artist}
            </p>

            {/* Mood tags */}
            {currentSong.moods && currentSong.moods.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentSong.moods.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] px-2.5 py-0.5 font-mono-custom text-[9px] uppercase tracking-[.1em]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="mt-6 flex items-center gap-2">
              <button
                data-testid="button-expanded-previous"
                onClick={previous}
                className="rounded-full border border-[hsl(var(--foreground))]/15 p-3 hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={16} />
              </button>
              <button
                data-testid="button-expanded-play"
                onClick={togglePlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-ink transition-transform hover:scale-105 cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                data-testid="button-expanded-next"
                onClick={next}
                className="rounded-full border border-[hsl(var(--foreground))]/15 p-3 hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={16} />
              </button>
              <button
                data-testid="button-expanded-favorite"
                onClick={() => toggleFavorite(currentSong.id)}
                className={`ml-auto rounded-full border border-[hsl(var(--foreground))]/15 p-3 transition-colors cursor-pointer hover:bg-[hsl(var(--muted))] ${
                  favorites.includes(currentSong.id) ? 'text-[hsl(var(--primary))] border-[hsl(var(--primary))]' : ''
                }`}
                aria-label="Toggle favorite"
              >
                <Heart
                  size={16}
                  fill={favorites.includes(currentSong.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* YOUTUBE COURTESY BANNER */}
        <div className="mt-7 rounded-2xl border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--muted))]/60 p-4">
          <div className="flex items-start gap-3">
            <ExternalLink size={16} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />
            <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              Audio is streaming in demo emulation. Use the official YouTube link to listen to the master
              recording, respecting the composers, lyricists, and rightsholders.
            </p>
          </div>
          {currentSong.youtubeUrl && (
            <button
              data-testid="button-expanded-youtube"
              onClick={() => window.open(currentSong.youtubeUrl, '_blank', 'noopener,noreferrer')}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-bold text-[hsl(var(--background))] shadow-sm hover:opacity-95 cursor-pointer"
            >
              Open on YouTube <ExternalLink size={12} />
            </button>
          )}
        </div>

        {/* QUEUE PANEL */}
        <div className="mt-8 border-t border-[hsl(var(--foreground))]/12 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListMusic size={18} className="text-[hsl(var(--primary))]" />
              <h3 className="font-display text-2xl font-semibold">Queue & Upcoming</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
                Track {currentPos} of {queue.length}
              </span>
              {queue.length > 1 && (
                <button
                  onClick={clearQueue}
                  className="rounded p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] cursor-pointer"
                  title="Clear Queue"
                  aria-label="Clear Queue"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
            {queue.map((track, index) => {
              const isCurrent = track.id === currentSong.id;

              return (
                <button
                  data-testid={`button-expanded-queue-${track.id}`}
                  key={`${track.id}-${index}`}
                  onClick={() => play(track, queue)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border border-[hsl(var(--primary))] bg-[hsl(var(--secondary))]/25 shadow-sm'
                      : 'hover:bg-[hsl(var(--muted))]/70'
                  }`}
                >
                  <span className="w-6 font-mono-custom text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Poster track={track} size="small" />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">{track.title}</strong>
                    <small className="block truncate text-xs text-[hsl(var(--muted-foreground))]">
                      {track.artist} · {track.movie || track.album}
                    </small>
                  </span>
                  {isCurrent ? (
                    <span className="flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 font-mono-custom text-[8px] font-bold uppercase tracking-[.1em] text-[hsl(var(--background))]">
                      <Sparkles size={10} /> Playing
                    </span>
                  ) : (
                    <span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">
                      {track.duration}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
