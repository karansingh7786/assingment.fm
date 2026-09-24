import React from 'react';
import { Disc3, Play, Radio } from 'lucide-react';
import type { Song, Playlist } from '@assignment-fm/shared';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { SectionKicker } from '../layout/SectionKicker';

export function PlaylistsSection({
  playlists,
  allSongs,
}: {
  playlists: Playlist[];
  allSongs: Song[];
}) {
  const { startRadio } = useMusicPlayer();

  const handleStartPlaylist = (playlist: Playlist) => {
    // Resolve songs from songIds or fallback to category/keyword match
    const resolvedSongs = (playlist.songIds || [])
      .map((id) => allSongs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));

    const finalQueue = resolvedSongs.length > 0 ? resolvedSongs : allSongs.slice(0, 6);
    startRadio(finalQueue, `${playlist.title} Playlist`);
  };

  return (
    <section id="playlists" className="border-t border-[hsl(var(--foreground))]/12 bg-[hsl(var(--background))] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>special programming / hand-curated broadcasts</SectionKicker>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[.92] tracking-[-.07em] sm:text-6xl lg:text-7xl">
              Curated playlists.<br />
              <span className="text-[hsl(var(--primary))]">Zero skip buttons needed.</span>
            </h2>
          </div>
          <p className="max-w-[460px] text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
            Designed for specific moments in hostel life: 11:59 PM deadline panic, early morning bus
            rides, and unexplainable monsoon melancholy.
          </p>
        </div>

        {/* PLAYLIST CARDS GRID */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist, index) => {
            const trackCount = playlist.songIds?.length || 5;
            const isFeatured = index === 0 || playlist.id === '90s-nostalgia' || playlist.id === 'late-night-department';

            return (
              <div
                key={playlist.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] border-2 border-[hsl(var(--foreground))] p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7 ${
                  isFeatured
                    ? 'bg-[#6b3942] text-[#fdfbf7] shadow-ink'
                    : 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-soft'
                }`}
              >
                {/* Decorative vinyl groove watermark */}
                <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rounded-full border-[22px] border-current opacity-10 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-custom text-[9px] font-bold uppercase tracking-[.18em] opacity-75">
                      broadcast · 0{index + 1}
                    </span>
                    <span className="rounded-full border border-current/25 px-2.5 py-0.5 font-mono-custom text-[9px] uppercase tracking-[.1em]">
                      {trackCount} tracks
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold tracking-[-.03em] sm:text-3xl">
                    {playlist.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed opacity-75">
                    {playlist.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex items-center justify-between border-t border-current/15 pt-4">
                  <button
                    data-testid={`button-playlist-play-${playlist.id}`}
                    onClick={() => handleStartPlaylist(playlist)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-transform hover:scale-105 cursor-pointer ${
                      isFeatured
                        ? 'bg-white text-[hsl(var(--foreground))] shadow-ink'
                        : 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-sm'
                    }`}
                  >
                    <Play size={13} fill="currentColor" /> Play Broadcast
                  </button>

                  <span className="flex items-center gap-1.5 font-mono-custom text-[9px] uppercase tracking-[.12em] opacity-65">
                    <Disc3 size={13} className="animate-[spin_6s_linear_infinite]" /> On Deck
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
