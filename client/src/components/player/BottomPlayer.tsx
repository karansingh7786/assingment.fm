import React from 'react';
import { ExternalLink, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Cassette } from './Cassette';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

function formatSeconds(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00';
  const mins = Math.floor(sec / 60);
  const remainingSecs = Math.floor(sec % 60);
  return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
}

export function BottomPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    radioName,
    isAutoplayBlocked,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    setIsExpanded,
  } = useMusicPlayer();

  if (!currentSong) return null;

  const displayDuration = typeof currentSong.duration === 'string'
    ? currentSong.duration
    : formatSeconds(duration || 180);

  const moodTag = currentSong.moods?.[0] || 'Radio';

  return (
    <div
      id="player"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))]/95 shadow-[0_-8px_30px_hsl(var(--foreground))/.1] backdrop-blur-xl"
    >
      {/* Autoplay restriction fallback banner */}
      {isAutoplayBlocked && (
        <div className="bg-[hsl(var(--primary))] px-4 py-1.5 text-center text-xs font-bold text-[hsl(var(--background))] flex items-center justify-center gap-2">
          <span>Browser paused audio.</span>
          <button
            onClick={togglePlayPause}
            className="rounded-full bg-[hsl(var(--background))] px-3 py-0.5 text-[11px] font-bold text-[hsl(var(--foreground))] cursor-pointer hover:opacity-90"
          >
            Tap to Play ▶
          </button>
        </div>
      )}

      <div className="mx-auto flex h-[78px] max-w-[1360px] items-center gap-3 px-4 sm:h-[86px] sm:gap-5 sm:px-8 lg:px-12">
        {/* CASSETTE GRAPHIC */}
        <button
          data-testid="button-expand-player"
          onClick={() => setIsExpanded(true)}
          className="hidden sm:block cursor-pointer transition-transform hover:scale-105"
          title="Open Cassette Deck"
        >
          <Cassette compact />
        </button>

        {/* TRACK & ARTIST INFO */}
        <button
          data-testid="button-expand-player-mobile"
          onClick={() => setIsExpanded(true)}
          className="min-w-0 flex-1 text-left sm:flex-none sm:w-[240px] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className={`pulse-dot h-2 w-2 rounded-full ${
                isPlaying ? 'bg-[#35a854]' : 'bg-[hsl(var(--primary))]'
              }`}
            />
            <span className="font-mono-custom text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] truncate">
              {isPlaying ? `${radioName}` : 'ready when you are'}
            </span>
          </div>
          <h3 data-testid="text-current-track" className="mt-1 truncate text-sm font-bold">
            {currentSong.title}
          </h3>
          <p data-testid="text-current-artist" className="truncate text-xs text-[hsl(var(--muted-foreground))]">
            {currentSong.artist} · <span className="text-[hsl(var(--primary))] font-medium">{moodTag}</span>
          </p>
        </button>

        {/* CONTROLS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            data-testid="button-previous-track"
            onClick={previous}
            className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
            aria-label="Previous track"
          >
            <SkipBack size={17} fill="currentColor" />
          </button>
          <button
            data-testid="button-toggle-player"
            onClick={togglePlayPause}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition-transform hover:scale-105 shadow-ink cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            data-testid="button-next-track"
            onClick={next}
            className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
            aria-label="Next track"
          >
            <SkipForward size={17} fill="currentColor" />
          </button>
        </div>

        {/* TIMELINE & PROGRESS BAR */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))] w-8 text-right">
            {formatSeconds(currentTime)}
          </span>
          <input
            data-testid="input-progress"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => seek(Number(e.target.value), true)}
            className="h-1.5 w-full accent-[hsl(var(--primary))] cursor-pointer"
            aria-label="Track progress"
          />
          <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))] w-8">
            {displayDuration}
          </span>
        </div>

        {/* VOLUME CONTROL */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            data-testid="button-volume"
            onClick={toggleMute}
            className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 w-16 accent-[hsl(var(--primary))] cursor-pointer"
            aria-label="Volume slider"
          />
        </div>

        {/* YOUTUBE LINK */}
        {currentSong.youtubeUrl && (
          <button
            data-testid="button-open-youtube"
            onClick={() => window.open(currentSong.youtubeUrl, '_blank', 'noopener,noreferrer')}
            className="hidden rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] sm:block cursor-pointer"
            aria-label="Open song on official YouTube"
            title="Listen on official YouTube"
          >
            <ExternalLink size={16} />
          </button>
        )}

        {/* QUEUE EXPAND BUTTON */}
        <button
          data-testid="button-open-player"
          onClick={() => setIsExpanded(true)}
          className="rounded-full border border-[hsl(var(--foreground))]/20 p-2.5 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] cursor-pointer"
          aria-label="Open queue and cassette player"
          title="Open Queue"
        >
          <ListMusic size={17} />
        </button>
      </div>
    </div>
  );
}
