import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Disc3,
  ExternalLink,
  Play,
  Radio,
  Search,
} from 'lucide-react';
import type { Song, Category } from '@assignment-fm/shared';
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
import { CategoryCard } from '../components/categories/CategoryCard';
import { BottomPlayer } from '../components/player/BottomPlayer';
import { ExpandedPlayer } from '../components/player/ExpandedPlayer';
import { bollywoodTracks, categories as defaultCategories, playlists as defaultPlaylists } from '../data/bollywood';

const allFilters = ['all', '80s', '90s', 'romance', 'sad', 'dance', 'late night', 'study'] as const;
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

  const categories = useMemo(() => {
    return apiCategories.length > 0
      ? apiCategories
      : (defaultCategories.map((c) => ({
          id: c.key,
          name: c.title,
          hindi: c.hindi,
          description: c.description,
          color: c.color,
          number: c.number,
        })) as Category[]);
  }, [apiCategories]);

  const playlists = useMemo(() => {
    return apiPlaylists.length > 0
      ? apiPlaylists
      : defaultPlaylists.map((p) => ({
          ...p,
          songIds: p.trackIds,
        }));
  }, [apiPlaylists]);

  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [movieFilter, setMovieFilter] = useState('');

  const movies = useMemo(() => {
    return Array.from(new Set(songs.map((track) => track.movie))).slice(0, 8);
  }, [songs]);

  const selectedCategory =
    activeFilter === 'all' || activeFilter === '80s' || activeFilter === '90s'
      ? null
      : activeFilter === 'late night'
      ? 'late-night'
      : activeFilter;

  const filteredTracks = useMemo(() => {
    return songs.filter((track) => {
      const query = search.trim().toLowerCase();
      const categoriesList: string[] = Array.isArray(track.categories)
        ? track.categories
        : (track as unknown as { category?: string }).category
        ? [(track as unknown as { category: string }).category]
        : [];
      const searchable = `${track.title || ''} ${track.artist || ''} ${track.movie || ''} ${track.year || ''} ${track.era || ''} ${categoriesList.join(' ')} ${track.label || ''}`.toLowerCase();
      const matchesQuery = !query || searchable.includes(query);
      const matchesFilter =
        activeFilter === 'all' ||
        activeFilter === track.era ||
        categoriesList.some((c) => c.toLowerCase() === activeFilter.toLowerCase()) ||
        (activeFilter === 'late night' && categoriesList.some((c) => c.toLowerCase() === 'late-night'));
      const matchesMovie = !movieFilter || track.movie === movieFilter;
      return matchesQuery && matchesFilter && matchesMovie;
    });
  }, [activeFilter, movieFilter, search, songs]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartCategoryRadio = (categoryId?: string) => {
    const radioTracks = categoryId
      ? songs.filter((track) => {
          const categoriesList: string[] = Array.isArray(track.categories)
            ? track.categories
            : (track as unknown as { category?: string }).category
            ? [(track as unknown as { category: string }).category]
            : [];
          return categoriesList.some((c) => c.toLowerCase() === categoryId.toLowerCase());
        })
      : songs;
    const catObj = categories.find((item) => item.id === categoryId);
    const label = catObj ? catObj.name : 'All India Hostel Radio';
    startRadio(radioTracks.length > 0 ? radioTracks : songs, label);
  };

  const handleStartPlaylistRadio = (playlistId: string) => {
    const targetPlaylist = playlists.find((p) => p.id === playlistId);
    if (!targetPlaylist) return;
    const plTracks = targetPlaylist.songIds
      .map((id) => songs.find((t) => t.id === id))
      .filter((t): t is Song => Boolean(t));
    const tracksToPlay = plTracks.length > 0 ? plTracks : songs;
    startRadio(tracksToPlay, targetPlaylist.title);
  };

  const activeSong = currentSong || songs[0];

  return (
    <div className="min-h-[100dvh] overflow-x-hidden pb-28">
      <div className="grain" />
      <Header onTuneIn={() => handleStartCategoryRadio()} onNavigate={scrollTo} />

      <main id="top">
        {/* HERO SECTION */}
        <section
          id="discover"
          className="mx-auto max-w-[1320px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24"
        >
          <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_.94fr]">
            <div className="reveal">
              <SectionKicker>assignment fm presents / side A</SectionKicker>
              <h1
                data-testid="text-hero-heading"
                className="mt-5 max-w-[760px] font-display text-[clamp(3.5rem,8.5vw,8rem)] font-semibold leading-[.83] tracking-[-.09em]"
              >
                Assignments<br />
                <span className="text-[hsl(var(--primary))]">modern hain.</span><br />
                Gaane timeless hain.
              </h1>
              <p className="mt-8 max-w-[570px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">
                Assignments karte karte thoda purane zamaane mein chale jao. A warm Hindi Bollywood
                jukebox for hostel nights, practical files, and the group project that is definitely not
                going to finish itself.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  data-testid="button-hero-radio"
                  onClick={() => handleStartCategoryRadio()}
                  className="rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--background))] shadow-ink transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <Radio size={16} className="mr-2 inline" /> Golden Era Radio
                </button>
                <button
                  data-testid="button-hero-browse"
                  onClick={() => scrollTo('library')}
                  className="rounded-full border-2 border-[hsl(var(--foreground))] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] cursor-pointer"
                >
                  Browse the jukebox <ArrowDownRight size={15} className="ml-1 inline" />
                </button>
              </div>
              <div className="mt-10 flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">
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

            <div className="relative reveal delay-2">
              <div className="relative mx-auto max-w-[510px] rotate-[2deg] rounded-[2.4rem] border-2 border-[hsl(var(--foreground))] bg-[#6b3942] p-5 shadow-ink sm:p-8">
                <div className="absolute -right-3 -top-4 rotate-[7deg] rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-3 py-2 font-mono-custom text-[9px] font-bold uppercase tracking-[.12em] shadow-[3px_3px_0_hsl(var(--foreground))]">
                  side A / focus
                </div>
                <div className="rounded-[1.65rem] border border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.08] p-5 sm:p-7">
                  <div className="flex items-start justify-between text-[hsl(var(--background))]">
                    <div>
                      <p className="font-mono-custom text-[9px] uppercase tracking-[.2em] opacity-60">
                        assignment fm
                      </p>
                      <p className="mt-2 font-display text-3xl font-semibold leading-[.9] sm:text-4xl">
                        Late night<br />department
                      </p>
                    </div>
                    <Disc3 size={28} className="animate-[spin_9s_linear_infinite] opacity-75" />
                  </div>
                  <div className="flex justify-center py-9">
                    <Cassette />
                  </div>
                  <div className="flex items-end justify-between text-[hsl(var(--background))]">
                    <div>
                      <p className="font-mono-custom text-[9px] uppercase tracking-[.17em] opacity-60">
                        now playing
                      </p>
                      <p data-testid="text-hero-current" className="mt-2 text-sm font-bold">
                        {activeSong ? activeSong.title : 'Pehla Nasha'}
                      </p>
                      <p className="text-xs opacity-60">
                        {activeSong ? activeSong.artist : 'Udit Narayan'}
                      </p>
                    </div>
                    <div className="flex items-end gap-1">
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
              <div className="absolute -bottom-9 -left-3 hidden rotate-[-8deg] sm:block">
                <Cassette compact />
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-4 border-t border-[hsl(var(--foreground))]/15 pt-5 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
            <span>curated for</span>
            <span className="h-px w-9 bg-[hsl(var(--foreground))]/25" />
            <span>CS / ECE / ME / CE</span>
            <span className="ml-auto hidden sm:inline">press play, lower expectations</span>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section
          id="categories"
          className="bg-[hsl(var(--foreground))] px-5 py-16 text-[hsl(var(--background))] sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <SectionKicker dark>choose your current situation</SectionKicker>
                <h2 className="mt-4 font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">
                  A song for<br />
                  <span className="text-[hsl(var(--secondary))]">every submission.</span>
                </h2>
              </div>
              <p className="max-w-[440px] justify-self-end text-base leading-relaxed text-[hsl(var(--background))]/60">
                Six rooms in the old record store. Tap a category to filter the library, or press the little
                radio button to queue an entire broadcast.
              </p>
            </div>
            <div className="scrollbar-hide mt-12 flex snap-x gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  active={selectedCategory === category.id}
                  onSelect={() => {
                    setActiveFilter(
                      category.id === 'late-night' ? 'late night' : (category.id as Filter)
                    );
                    scrollTo('library');
                  }}
                  onRadio={() => handleStartCategoryRadio(category.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ESSENTIAL RECORD JUKEBOX */}
        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <SectionKicker>the essential record</SectionKicker>
              <h2 className="mt-4 max-w-[480px] font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">
                Ultimate<br />
                <span className="text-[hsl(var(--primary))]">Bollywood</span><br />
                Jukebox.
              </h2>
            </div>
            <div className="max-w-[540px] justify-self-end">
              <p className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
                80s–90s / lovingly overdramatic
              </p>
              <p className="mt-4 text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
                The songs your parents played in the car, your seniors played in the hostel, and you will
                suddenly know every word to at 1:40 AM.
              </p>
              <button
                data-testid="button-essential-play"
                onClick={() => play(songs[0], songs)}
                className="mt-6 inline-flex items-center rounded-full bg-[hsl(var(--foreground))] px-5 py-3 text-sm font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-1 cursor-pointer"
              >
                <Play size={15} fill="currentColor" className="mr-2" /> Play the essential set
              </button>
            </div>
          </div>
          <div className="scrollbar-hide mt-10 flex snap-x gap-4 overflow-x-auto pb-3">
            {songs.slice(0, 6).map((track) => (
              <button
                data-testid={`card-essential-${track.id}`}
                key={track.id}
                onClick={() => play(track, songs)}
                className="group min-w-[155px] snap-start text-left sm:min-w-[180px] cursor-pointer"
              >
                <Poster track={track} />
                <span className="mt-3 block truncate text-sm font-bold">{track.title}</span>
                <span className="mt-1 block truncate text-xs text-[hsl(var(--muted-foreground))]">
                  {track.movie} · {track.year}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* REMEMBER THESE? */}
        <section className="border-y border-[hsl(var(--foreground))]/10 bg-[#d6b56b]/20 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <SectionKicker>remember these?</SectionKicker>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">
                  You heard it once.<br />
                  <span className="text-[hsl(var(--primary))]">You never forgot.</span>
                </h2>
              </div>
              <button
                data-testid="button-remember-next"
                onClick={() => scrollTo('library')}
                className="hidden items-center gap-1 rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold sm:flex cursor-pointer"
              >
                Open collection <ArrowUpRight size={13} />
              </button>
            </div>
            <div className="scrollbar-hide mt-9 flex snap-x gap-4 overflow-x-auto pb-2">
              {songs.slice(6, 12).map((track) => (
                <button
                  data-testid={`card-remember-${track.id}`}
                  key={track.id}
                  onClick={() => play(track, songs)}
                  className="flex min-w-[260px] snap-start items-center gap-3 rounded-2xl border border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))]/65 p-2.5 text-left transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <Poster track={track} size="small" />
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{track.title}</strong>
                    <span className="mt-1 block truncate text-xs text-[hsl(var(--muted-foreground))]">
                      {track.artist}
                    </span>
                    <span className="mt-2 block font-mono-custom text-[9px] uppercase tracking-[.08em] text-[hsl(var(--primary))]">
                      {track.label}
                    </span>
                  </span>
                  <Play size={15} className="mr-1 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LIBRARY SECTION */}
        <section id="library" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <SectionKicker>the library / official links only</SectionKicker>
                <h2 className="mt-4 font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">
                  Press play.<br />
                  <span className="text-[hsl(var(--primary))]">Pretend it was easy.</span>
                </h2>
              </div>
              <label className="relative flex w-full max-w-[460px]">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                />
                <input
                  data-testid="input-search-library"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="search"
                  placeholder="Search song, artist, movie, year..."
                  className="h-12 w-full rounded-full border-2 border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))]"
                />
              </label>
            </div>
            <div className="scrollbar-hide mt-9 flex gap-2 overflow-x-auto pb-2">
              {allFilters.map((filter) => (
                <button
                  data-testid={`button-filter-${filter.replace(' ', '-')}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
                      : 'border border-[hsl(var(--foreground))]/15 hover:border-[hsl(var(--foreground))]'
                  }`}
                >
                  {filter === 'all' ? 'All tracks' : filter}
                </button>
              ))}
            </div>
            <div className="mt-7 overflow-hidden rounded-[1.45rem] border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--card))] p-2">
              <div className="hidden grid-cols-[34px_48px_1fr_125px_auto_auto] gap-4 px-3 pb-2 pt-2 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] sm:grid">
                <span>#</span>
                <span />
                <span>Track / film</span>
                <span>For when...</span>
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
                  <Search size={28} className="text-[hsl(var(--muted-foreground))]" />
                  <h3 className="mt-4 font-display text-2xl font-semibold">
                    No songs survived that search.
                  </h3>
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                    Try the movie name, singer, or a less specific emotional crisis.
                  </p>
                  <button
                    data-testid="button-clear-filters"
                    onClick={() => {
                      setSearch('');
                      setActiveFilter('all');
                      setMovieFilter('');
                    }}
                    className="mt-5 rounded-full bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))] cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between gap-4 text-xs text-[hsl(var(--muted-foreground))]">
              <span>{filteredTracks.length} tracks in rotation</span>
              <span className="hidden items-center gap-1 font-mono-custom text-[9px] uppercase tracking-[.1em] sm:flex">
                YouTube fallback available <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </section>

        {/* BROWSE BY FILM */}
        <section
          id="movies"
          className="border-y border-[hsl(var(--foreground))]/10 bg-[hsl(var(--card))] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        >
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-end justify-between">
              <div>
                <SectionKicker>browse by film</SectionKicker>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">
                  One movie.<br />
                  <span className="text-[hsl(var(--primary))]">Many feelings.</span>
                </h2>
              </div>
              <button
                data-testid="button-clear-movie"
                onClick={() => setMovieFilter('')}
                className={`rounded-full border border-[hsl(var(--foreground))]/15 px-4 py-2 text-xs font-bold cursor-pointer ${
                  movieFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                All films
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
                  className={`min-w-[178px] rounded-[1.1rem] border p-4 text-left transition-transform hover:-translate-y-1 cursor-pointer ${
                    movieFilter === movie
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10'
                      : 'border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))]'
                  }`}
                >
                  <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">
                    FILM 0{index + 1}
                  </span>
                  <strong className="mt-8 block font-display text-xl font-semibold leading-none">
                    {movie}
                  </strong>
                  <span className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">
                    {songs.filter((track) => track.movie === movie).length} track
                    {songs.filter((track) => track.movie === movie).length > 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SPECIAL PROGRAMMING PLAYLISTS */}
        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="flex items-end justify-between">
            <div>
              <SectionKicker>special programming</SectionKicker>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">
                No skip button<br />
                <span className="text-[hsl(var(--primary))]">necessary.</span>
              </h2>
            </div>
            <button
              data-testid="button-special-radio"
              onClick={() => handleStartCategoryRadio()}
              className="hidden rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold sm:block cursor-pointer"
            >
              <Radio size={13} className="mr-1 inline" /> Tune in live
            </button>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_.9fr_.9fr]">
            {playlists.slice(0, 3).map((playlist, index) => (
              <button
                data-testid={`button-playlist-${playlist.id}`}
                key={playlist.id}
                onClick={() => handleStartPlaylistRadio(playlist.id)}
                className={`group relative min-h-[230px] overflow-hidden rounded-[1.5rem] border-2 border-[hsl(var(--foreground))]/15 p-5 text-left transition-transform hover:-translate-y-1 cursor-pointer ${
                  index === 0 ? 'bg-[#6b3942] text-[hsl(var(--background))]' : 'bg-[hsl(var(--card))]'
                }`}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <span className="font-mono-custom text-[9px] uppercase tracking-[.13em] opacity-65">
                    {index === 0 ? 'broadcast / live' : `playlist / 0${index}`}
                  </span>
                  <span className="rounded-full bg-[hsl(var(--background))]/75 p-2 text-[hsl(var(--foreground))]">
                    <Play size={14} fill="currentColor" />
                  </span>
                </div>
                <div className="absolute -bottom-16 -right-7 h-56 w-56 rotate-[-12deg] rounded-full border-[27px] border-[hsl(var(--secondary))]/35 transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105" />
                <div className="absolute bottom-5 left-5 z-10 max-w-[250px]">
                  <h3 className="font-display text-2xl font-semibold leading-[.95] tracking-[-.05em]">
                    {playlist.title}
                  </h3>
                  <p className="mt-2 max-w-[220px] text-xs opacity-65">{playlist.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ENGINEERING COLLEGE FOLKLORE */}
        <section className="bg-[hsl(var(--foreground))] px-5 py-16 text-[hsl(var(--background))] sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <SectionKicker dark>engineering college folklore</SectionKicker>
              <h2 className="mt-4 max-w-[720px] font-display text-4xl font-semibold leading-[.9] tracking-[-.07em] sm:text-6xl">
                The code can wait.<br />
                <span className="text-[hsl(var(--secondary))]">The chorus cannot.</span>
              </h2>
              <p className="mt-6 max-w-[580px] leading-relaxed text-[hsl(var(--background))]/60">
                For the person who says “bas ek gaana” and emerges with a complete playlist, a new crush,
                and three tabs of Stack Overflow. Keep the headphones on. The viva is tomorrow.
              </p>
            </div>
            <div className="rotate-[5deg]">
              <Cassette compact />
            </div>
          </div>
        </section>

        <Footer onNavigate={scrollTo} onFeedback={() => showNotice('Feedback hotline is open in spirit')} />
      </main>

      <BottomPlayer />
      <ExpandedPlayer />

      {notice && (
        <div
          data-testid="status-notification"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-5 py-3 text-center text-xs font-bold text-[hsl(var(--foreground))] shadow-[4px_4px_0_hsl(var(--foreground))]"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
