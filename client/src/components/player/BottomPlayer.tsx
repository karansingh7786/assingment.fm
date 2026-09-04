import React from 'react';
import { ExternalLink, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Cassette } from './Cassette';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

export function BottomPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    isMuted,
    togglePlayPause,
    next,
    previous,
    seek,
    toggleMute,
    setIsExpanded,
  } = useMusicPlayer();

  if (!currentSong) return null;

  return (
    <div
      id="player"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))]/95 shadow-[0_-8px_30px_hsl(var(--foreground))/.1] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[78px] max-w-[1320px] items-center gap-3 px-4 sm:h-[86px] sm:gap-5 sm:px-8 lg:px-12">
        <button
          data-testid="button-expand-player"
          onClick={() => setIsExpanded(true)}
          className="hidden sm:block"
        >
          <Cassette compact />
        </button>
        <button
          data-testid="button-expand-player-mobile"
          onClick={() => setIsExpanded(true)}
          className="min-w-0 flex-1 text-left sm:flex-none sm:w-[220px]"
        >
          <div className="flex items-center gap-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
            <span className="font-mono-custom text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">
              {isPlaying ? 'on air' : 'ready when you are'}
            </span>
          </div>
          <h3 data-testid="text-current-track" className="mt-1 truncate text-sm font-bold">
            {currentSong.title}
          </h3>
          <p data-testid="text-current-artist" className="truncate text-xs text-[hsl(var(--muted-foreground))]">
            {currentSong.artist}
          </p>
        </button>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            data-testid="button-previous-track"
            onClick={previous}
            className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
            aria-label="Previous track"
          >
            <SkipBack size={17} fill="currentColor" />
          </button>
          <button
            data-testid="button-toggle-player"
            onClick={togglePlayPause}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition-transform hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            data-testid="button-next-track"
            onClick={next}
            className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
            aria-label="Next track"
          >
            <SkipForward size={17} fill="currentColor" />
          </button>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">0:00</span>
          <input
            data-testid="input-progress"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seek(Number(e.target.value), true)}
            className="h-1.5 w-full accent-[hsl(var(--primary))]"
          />
          <span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">
            {currentSong.duration}
          </span>
        </div>
        <button
          data-testid="button-volume"
          onClick={toggleMute}
          className="hidden rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] sm:block"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
        <button
          data-testid="button-open-youtube"
          onClick={() => window.open(currentSong.youtubeUrl, '_blank', 'noopener,noreferrer')}
          className="hidden rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] sm:block"
          aria-label="Open song on official YouTube"
        >
          <ExternalLink size={16} />
        </button>
        <button
          data-testid="button-open-player"
          onClick={() => setIsExpanded(true)}
          className="rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] sm:hidden"
          aria-label="Open player details"
        >
          <ListMusic size={16} />
        </button>
      </div>
    </div>
  );
}
