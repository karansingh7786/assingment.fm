import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  Disc3,
  ExternalLink,
  Play,
  Radio,
  Search,
  Sparkles,
} from 'lucide-react';
import type { Song, Category, Playlist } from '@assignment-fm/shared';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { useSongs } from '../hooks/useSongs';
import { useCategories } from '../hooks/useCategories';
import { usePlaylists } from '../hooks/usePlaylists';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SectionKicker } from '../components/layout/SectionKicker';
import { Cassette } from '../components/player/Cassette';
import { Poster } from '../components/player/Poster';
import { TrackRow } from '../components/track/TrackRow';
import { BottomPlayer } from '../components/player/BottomPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import { MoodSection } from '../components/home/MoodSection';
import { DiscoverySection } from '../components/home/DiscoverySection';
import { GenresSection } from '../components/home/GenresSection';
import { ErasSection } from '../components/home/ErasSection';
import { PlaylistsSection } from '../components/home/PlaylistsSection';
import { AboutSection } from '../components/home/AboutSection';
import { bollywoodTracks, categories as defaultCategories, playlists as defaultPlaylists } from '../data/bollywood';

const allFilters = [
  'all',
  '80s',
  '90s',
  '2000s',
  'romance',
  'sad',
  'masti',
  'late night',
  'focus',
  'regional',
] as const;
type Filter = typeof allFilters[number];

export function Home() {
  const {
    currentSong,
    isPlaying,
    favorites,
    notice,
    play,
    startRadio,
    toggleFavorite,
    showNotice,
  } = useMusicPlayer();

  const { songs: apiSongs } = useSongs();
  const { categories: apiCategories } = useCategories();
  const { playlists: apiPlaylists } = usePlaylists();

  // Combine API data with fallback so it never flashes or breaks
  const songs = useMemo(() => {
    return apiSongs.length > 0 ? apiSongs : (bollywoodTracks as unknown as Song[]);
  }, [apiSongs]);

  const playlists = useMemo(() => {
    return apiPlaylists.length > 0
      ? apiPlaylists
      : (defaultPlaylists as unknown as Playlist[]);
  }, [apiPlaylists]);

  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [movieFilter, setMovieFilter] = useState('');

  const movies = useMemo(() => {
    return Array.from(new Set(songs.map((track) => track.movie || track.album || ''))).filter(Boolean).slice(0, 8);
  }, [songs]);

  const filteredTracks = useMemo(() => {
    return songs.filter((track) => {
      const query = search.trim().toLowerCase();
      const categoriesList: string[] = Array.isArray(track.categories) ? track.categories : [];
      const moodsList: string[] = Array.isArray(track.moods) ? track.moods : [];
      const movieOrAlbum = track.movie || track.album || '';

      const searchable = [
        track.title || '',
        track.artist || '',
        movieOrAlbum,
        track.year || '',
        track.era || '',
        track.language || '',
        ...categoriesList,
        ...moodsList,
        track.label || '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || searchable.includes(query);

      let matchesFilter = activeFilter === 'all';
      if (!matchesFilter) {
        if (activeFilter === '80s' || activeFilter === '90s' || activeFilter === '2000s') {
          matchesFilter = track.era === activeFilter;
        } else if (activeFilter === 'late night') {
          matchesFilter =
            categoriesList.some((c) => c.toLowerCase().includes('late-night')) ||
            moodsList.some((m) => m.toLowerCase().includes('late night'));
        } else if (activeFilter === 'regional') {
          matchesFilter = ['Marathi', 'Punjabi', 'Bhojpuri', 'Indie', 'Instrumental'].some(
            (lang) =>
              (track.language || '').toLowerCase().includes(lang.toLowerCase()) ||
              categoriesList.some((c) => c.toLowerCase().includes(lang.toLowerCase()))
          );
        } else {
          matchesFilter =
            categoriesList.some((c) => c.toLowerCase().includes(activeFilter)) ||
            moodsList.some((m) => m.toLowerCase().includes(activeFilter));
        }
      }

      const matchesMovie = !movieFilter || movieOrAlbum === movieFilter;
      return matchesQuery && matchesFilter && matchesMovie;
    });
  }, [activeFilter, movieFilter, search, songs]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartBroadcast = (label = 'Golden Era Radio') => {
    startRadio(songs, label);
  };

  const activeSong = currentSong || songs[0];

  return (
    <div className="min-h-[100dvh] overflow-x-hidden pb-28">
      <div className="grain" />
      <Header onTuneIn={() => handleStartBroadcast('Golden Era Live')} onNavigate={scrollTo} />

      <main id="top">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section
          id="discover"
          className="mx-auto max-w-[1360px] px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24"
        >
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <div className="reveal">
              <SectionKicker>assignment fm presents / side A</SectionKicker>

              {/* Exact required headline from user prompt */}
              <h1
                data-testid="text-hero-heading"
                className="mt-5 max-w-[780px] font-display text-[clamp(3.5rem,8.2vw,7.6rem)] font-semibold leading-[.84] tracking-[-.08em]"
              >
                Music for<br />
                <span className="text-[hsl(var(--primary))]">every mood.</span>
              </h1>

              {/* Exact supporting text from prompt */}
              <p className="mt-7 max-w-[560px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">
                Pick a feeling. We’ll pick the music.
              </p>
              <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]/80">
                A warm, analog Hindi & regional jukebox tuned for hostel nights, practical files,
                and deadlines that refuse to finish themselves.
              </p>

              {/* Exact CTAs from user prompt */}
              <div className="mt-9 flex flex-wrap gap-3.5">
                <button
                  data-testid="button-hero-radio"
                  onClick={() => scrollTo('moods')}
                  className="rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-sm font-bold text-[hsl(var(--background))] shadow-ink transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <Sparkles size={16} className="mr-2 inline" /> Choose Your Mood
                </button>
                <button
                  data-testid="button-hero-browse"
                  onClick={() => handleStartBroadcast('Golden Era Radio')}
                  className="rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--background))] px-7 py-4 text-sm font-bold transition-transform hover:-translate-y-1 hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] cursor-pointer shadow-sm"
                >
                  <Radio size={15} className="mr-2 inline" /> Explore Radio
                </button>
              </div>

              {/* Student counter banner */}
              <div className="mt-10 flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
                <span className="flex -space-x-2">
                  {['RS', 'AM', 'NK', 'PJ'].map((initials, index) => (
                    <span
                      data-testid={`avatar-student-${index}`}
                      key={initials}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--background))] text-[9px] font-bold text-[hsl(var(--foreground))] ${
                        ['bg-[#d28a73]', 'bg-[#dcae4d]', 'bg-[#8ca5a0]', 'bg-[#b47b82]'][index]
                      }`}
                    >
                      {initials}
                    </span>
                  ))}
                </span>
                <span>
                  <strong className="text-[hsl(var(--foreground))]">4,821</strong> students avoiding the group chat
                </span>
              </div>
            </div>

            {/* VINTAGE CASSETTE DECK CARD */}
            <div className="relative reveal delay-2">
              <div className="relative mx-auto max-w-[500px] rotate-[2deg] rounded-[2.4rem] border-2 border-[hsl(var(--foreground))] bg-[#6b3942] p-5 shadow-ink sm:p-8">
                <div className="absolute -right-3 -top-4 rotate-[7deg] rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-3.5 py-1.5 font-mono-custom text-[9px] font-bold uppercase tracking-[.14em] shadow-[3px_3px_0_hsl(var(--foreground))]">
                  side A / on air
                </div>

                <div className="rounded-[1.75rem] border border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.08] p-5 sm:p-7">
                  <div className="flex items-start justify-between text-[hsl(var(--background))]">
                    <div>
                      <p className="font-mono-custom text-[9px] uppercase tracking-[.2em] opacity-65">
                        assignment fm broadcast
                      </p>
                      <p className="mt-2 font-display text-3xl font-semibold leading-[.9] sm:text-4xl">
                        Late night<br />department
                      </p>
                    </div>
                    <Disc3 size={28} className="animate-[spin_8s_linear_infinite] opacity-75" />
                  </div>

                  <div className="flex justify-center py-8">
                    <Cassette />
                  </div>

                  <div className="flex items-end justify-between text-[hsl(var(--background))]">
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="font-mono-custom text-[9px] uppercase tracking-[.18em] opacity-65">
                        now playing
                      </p>
                      <p data-testid="text-hero-current" className="mt-1.5 truncate text-base font-bold">
                        {activeSong ? activeSong.title : 'Pehla Nasha'}
                      </p>
                      <p className="truncate text-xs opacity-75">
                        {activeSong ? activeSong.artist : 'Udit Narayan'} · {activeSong?.year || '1992'}
                      </p>
                    </div>
                    <div className="flex items-end gap-1 shrink-0">
                      {[13, 24, 18, 32, 21, 38, 17, 29, 14, 26].map((height, index) => (
                        <span
                          key={index}
                          className={`w-1 rounded-full bg-[hsl(var(--secondary))] ${
                            isPlaying ? 'animate-pulse' : ''
                          }`}
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative mini cassette badge */}
              <div className="absolute -bottom-7 -left-4 hidden rotate-[-8deg] sm:block">
                <Cassette compact />
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-4 border-t border-[hsl(var(--foreground))]/15 pt-5 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
            <span>curated for</span>
            <span className="h-px w-9 bg-[hsl(var(--foreground))]/25" />
            <span>CS / ECE / ME / CIVIL / ARCH</span>
            <span className="ml-auto hidden sm:inline">press play · lower deadline anxiety</span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. MOOD EXPERIENCE SECTION ("How are you feeling today?")                 */}
        {/* ========================================================================= */}
        <MoodSection allSongs={songs} />

        {/* ========================================================================= */}
        {/* 3. FEATURED ROTATIONS & DISCOVERY CHANNELS                                */}
        {/* ========================================================================= */}
        <DiscoverySection allSongs={songs} />

        {/* ========================================================================= */}
        {/* 4. ERAS DISCOVERY (80s, 90s, 2000s, 2010s, 2020s)                         */}
        {/* ========================================================================= */}
        <ErasSection allSongs={songs} />

        {/* ========================================================================= */}
        {/* 5. GENRES / LANGUAGES DISCOVERY                                           */}
        {/* ========================================================================= */}
        <GenresSection allSongs={songs} />

        {/* ========================================================================= */}
        {/* 6. CURATED PLAYLISTS EXPERIENCE                                           */}
        {/* ========================================================================= */}
        <PlaylistsSection playlists={playlists} allSongs={songs} />

        {/* ========================================================================= */}
        {/* 7. COMPLETE JUKEBOX LIBRARY & REAL-TIME SEARCH                            */}
        {/* ========================================================================= */}
        <section id="library" className="border-t border-[hsl(var(--foreground))]/12 px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1360px]">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <SectionKicker>complete catalogue / official playback fallback</SectionKicker>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-[.9] tracking-[-.07em] sm:text-6xl lg:text-7xl">
                  Search & browse<br />
                  <span className="text-[hsl(var(--primary))]">the full jukebox.</span>
                </h2>
              </div>
              <label className="relative flex w-full max-w-[480px]">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                />
                <input
                  data-testid="input-search-library"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search song, artist, film, mood, era, language..."
                  className="h-12 w-full rounded-full border-2 border-[hsl(var(--foreground))]/20 bg-[hsl(var(--card))] pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))]"
                />
              </label>
            </div>

            {/* FILTER PILLS */}
            <div className="scrollbar-hide mt-9 flex gap-2 overflow-x-auto pb-2">
              {allFilters.map((filter) => (
                <button
                  data-testid={`button-filter-${filter.replace(' ', '-')}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-ink'
                      : 'border border-[hsl(var(--foreground))]/15 hover:border-[hsl(var(--foreground))] bg-[hsl(var(--card))]'
                  }`}
                >
                  {filter === 'all' ? 'All Tracks' : filter}
                </button>
              ))}
            </div>

            {/* TRACKS TABLE */}
            <div className="mt-7 overflow-hidden rounded-[1.6rem] border border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] p-3 shadow-soft">
              <div className="hidden grid-cols-[34px_48px_1fr_135px_auto_auto] gap-4 px-3 pb-3 pt-2 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] sm:grid border-b border-[hsl(var(--foreground))]/10">
                <span>#</span>
                <span />
                <span>Track / Film</span>
                <span>Category / Mood</span>
                <span>Time</span>
                <span />
              </div>

              {filteredTracks.length ? (
                filteredTracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    current={track.id === activeSong?.id}
                    playing={isPlaying && track.id === activeSong?.id}
                    favorite={favorites.includes(track.id)}
                    onPlay={() => play(track, filteredTracks)}
                    onFavorite={() => toggleFavorite(track.id)}
                  />
                ))
              ) : (
                <div
                  data-testid="empty-library"
                  className="flex flex-col items-center justify-center px-6 py-20 text-center"
                >
                  <Search size={32} className="text-[hsl(var(--muted-foreground))]" />
                  <h3 className="mt-4 font-display text-2xl font-semibold">
                    No songs survived that search.
                  </h3>
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                    Try another mood, movie name, or singer.
                  </p>
                  <button
                    data-testid="button-clear-filters"
                    onClick={() => {
                      setSearch('');
                      setActiveFilter('all');
                      setMovieFilter('');
                    }}
                    className="mt-5 rounded-full bg-[hsl(var(--foreground))] px-5 py-2.5 text-xs font-bold text-[hsl(var(--background))] cursor-pointer shadow-ink"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-4 text-xs text-[hsl(var(--muted-foreground))]">
              <span>{filteredTracks.length} tracks matching criteria</span>
              <span className="hidden items-center gap-1 font-mono-custom text-[9px] uppercase tracking-[.1em] sm:flex">
                Official YouTube audio links ready <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. BROWSE BY FILM CAROUSEL                                                */}
        {/* ========================================================================= */}
        <section
          id="movies"
          className="border-y border-[hsl(var(--foreground))]/10 bg-[hsl(var(--card))] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        >
          <div className="mx-auto max-w-[1360px]">
            <div className="flex items-end justify-between">
              <div>
                <SectionKicker>browse by film</SectionKicker>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">
                  One soundtrack.<br />
                  <span className="text-[hsl(var(--primary))]">Many feelings.</span>
                </h2>
              </div>
              <button
                data-testid="button-clear-movie"
                onClick={() => setMovieFilter('')}
                className={`rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold cursor-pointer ${
                  movieFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                All Films
              </button>
            </div>
            <div className="scrollbar-hide mt-9 flex gap-3 overflow-x-auto pb-2">
              {movies.map((movie, index) => (
                <button
                  data-testid={`button-movie-${index}`}
                  key={movie}
                  onClick={() => {
                    setMovieFilter(movie);
                    scrollTo('library');
                  }}
                  className={`min-w-[190px] rounded-[1.2rem] border p-4 text-left transition-transform hover:-translate-y-1 cursor-pointer ${
                    movieFilter === movie
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 shadow-sm'
                      : 'border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))]'
                  }`}
                >
                  <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">
                    FILM 0{index + 1}
                  </span>
                  <strong className="mt-6 block font-display text-xl font-semibold leading-tight">
                    {movie}
                  </strong>
                  <span className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">
                    {songs.filter((track) => (track.movie || track.album) === movie).length} track
                    {songs.filter((track) => (track.movie || track.album) === movie).length > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. ABOUT ASSIGNMENT FM SECTION                                            */}
        {/* ========================================================================= */}
        <AboutSection />

        {/* ========================================================================= */}
        {/* 10. FOOTER                                                                */}
        {/* ========================================================================= */}
        <Footer onNavigate={scrollTo} onFeedback={() => showNotice('Hostel feedback line is open in spirit!')} />
      </main>

      {/* FLOATING CASSETTE & EXPANDED PLAYERS */}
      <BottomPlayer />
      <ExpandedPlayer />

      {/* TOAST / STATUS NOTIFICATION BANNER */}
      {notice && (
        <div
          data-testid="status-notification"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-5 py-2.5 text-center text-xs font-bold text-[hsl(var(--foreground))] shadow-[4px_4px_0_hsl(var(--foreground))] animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
