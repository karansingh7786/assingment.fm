import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Disc3,
  ExternalLink,
  Heart,
  ListMusic,
  Menu,
  Pause,
  Play,
  Radio,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  bollywoodTracks,
  categories,
  movies,
  playlists,
  type BollywoodTrack,
  type CategoryKey,
  type EraFilter,
} from '@/data/bollywood';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const allFilters = ['all', '80s', '90s', 'romance', 'sad', 'dance', 'late night', 'study'] as const;
type Filter = typeof allFilters[number];

function SectionKicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-mono-custom text-[10px] font-bold uppercase tracking-[.18em] ${dark ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
      <span className={`h-2 w-2 rounded-full ${dark ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--primary))]'}`} />
      {children}
    </div>
  );
}

function Cassette({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative ${compact ? 'h-14 w-[5.5rem]' : 'h-44 w-64 sm:h-52 sm:w-72'} rounded-[1.35rem] border-2 border-[hsl(var(--foreground))] bg-[#bb5043] shadow-ink cassette-float`}>
      <div className={`absolute inset-x-[10%] ${compact ? 'top-2 h-1.5' : 'top-5 h-3'} rounded-full bg-[hsl(var(--foreground))]/20`} />
      <div className={`absolute inset-x-[10%] ${compact ? 'bottom-2 h-1.5' : 'bottom-5 h-3'} rounded-full bg-[hsl(var(--foreground))]/20`} />
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${compact ? 'h-9 w-16' : 'h-24 w-48'} rounded-[.7rem] border-2 border-[hsl(var(--foreground))]/55 bg-[#dcae4d]`}>
        <span className="absolute left-[15%] right-[15%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-[hsl(var(--foreground))]/25" />
        <span className={`absolute ${compact ? 'left-2 h-3 w-3' : 'left-4 h-6 w-6'} top-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[#687b72]`} />
        <span className={`absolute ${compact ? 'right-2 h-3 w-3' : 'right-4 h-6 w-6'} top-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[#687b72]`} />
        {!compact && <span className="absolute left-1/2 top-2 -translate-x-1/2 font-mono-custom text-[9px] font-bold tracking-[.22em]">AFM / SIDE A</span>}
      </div>
    </div>
  );
}

function Poster({ track, size = 'normal' }: { track: BollywoodTrack; size?: 'normal' | 'small' }) {
  return (
    <div className={`relative shrink-0 overflow-hidden border-2 border-[hsl(var(--foreground))]/20 ${size === 'small' ? 'h-12 w-12 rounded-xl' : 'aspect-[4/5] w-full rounded-[1.2rem]'}`} style={{ background: track.cover }}>
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'repeating-linear-gradient(115deg, transparent 0 9px, rgba(255,240,202,.22) 10px 11px)' }} />
      {size !== 'small' && <div className="absolute inset-0 flex flex-col justify-between p-3 text-[hsl(var(--foreground))]"><span className="font-mono-custom text-[8px] uppercase tracking-[.15em]">{track.year} / {track.era}</span><span className="font-display text-xl font-semibold leading-[.9]">{track.movie}</span></div>}
    </div>
  );
}

function TrackRow({ track, index, current, playing, onPlay, onFavorite, favorite }: {
  track: BollywoodTrack;
  index: number;
  current: boolean;
  playing: boolean;
  favorite: boolean;
  onPlay: () => void;
  onFavorite: () => void;
}) {
  return (
    <div data-testid={`row-track-${track.id}`} className={`group grid grid-cols-[32px_44px_1fr_auto] items-center gap-3 rounded-2xl p-2.5 transition-colors sm:grid-cols-[34px_48px_1fr_125px_auto_auto] sm:gap-4 sm:p-3 ${current ? 'bg-[hsl(var(--secondary))]/35' : 'hover:bg-[hsl(var(--muted))]'}`}>
      <span className="text-center font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">{String(index + 1).padStart(2, '0')}</span>
      <button data-testid={`button-play-track-${track.id}`} onClick={onPlay} className="relative h-11 w-11 overflow-hidden rounded-xl" aria-label={`Play ${track.title}`}>
        <Poster track={track} size="small" />
        <span className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--foreground))]/55 text-[hsl(var(--background))] opacity-0 transition-opacity group-hover:opacity-100">{current && playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</span>
      </button>
      <button data-testid={`button-select-track-${track.id}`} onClick={onPlay} className="min-w-0 text-left">
        <span className="block truncate text-sm font-bold">{track.title}</span>
        <span className="block truncate text-xs text-[hsl(var(--muted-foreground))]">{track.artist}</span>
      </button>
      <span className="hidden truncate font-mono-custom text-[9px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))] sm:block">{track.label}</span>
      <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">{track.duration}</span>
      <button data-testid={`button-favorite-track-${track.id}`} onClick={onFavorite} className={`hidden rounded-full p-2 transition-colors sm:block ${favorite ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'}`} aria-label={favorite ? `Remove ${track.title} from favorites` : `Save ${track.title}`}>
        <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

function CategoryCard({ category, active, onSelect, onRadio }: { category: typeof categories[number]; active: boolean; onSelect: () => void; onRadio: () => void }) {
  return (
    <article className={`relative min-w-[236px] snap-start overflow-hidden rounded-[1.35rem] border-2 p-4 transition-transform hover:-translate-y-1 sm:min-w-0 ${active ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] shadow-[5px_5px_0_hsl(var(--secondary))]' : 'border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.055] text-[hsl(var(--background))] hover:border-[hsl(var(--background))]/50'}`}>
      <button data-testid={`button-category-${category.key}`} onClick={onSelect} className="block min-h-[190px] w-full text-left">
        <div className="flex items-start justify-between"><span className="font-mono-custom text-[10px] opacity-60">{category.number}</span><span className="h-4 w-4 rounded-full border-2 border-current opacity-70" /></div>
        <div className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full opacity-75 transition-transform duration-500 group-hover:scale-110" style={{ background: category.color }} />
        <div className="relative mt-11"><p className="font-mono-custom text-[10px] opacity-65">{category.hindi}</p><h3 className="mt-2 max-w-[180px] font-display text-2xl font-semibold leading-[.95] tracking-[-.04em]">{category.title}</h3><p className={`mt-2 max-w-[190px] text-xs leading-snug ${active ? 'text-[hsl(var(--foreground))]/70' : 'text-[hsl(var(--background))]/60'}`}>{category.description}</p></div>
      </button>
      <button data-testid={`button-radio-${category.key}`} onClick={onRadio} className={`absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]'} transition-transform hover:scale-105`} aria-label={`Start ${category.title} radio`}><Radio size={15} /></button>
    </article>
  );
}

function Home() {
  const [currentTrack, setCurrentTrack] = useState<BollywoodTrack>(bollywoodTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState<BollywoodTrack[]>(bollywoodTracks);
  const [radioName, setRadioName] = useState('All India Hostel Radio');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(26);
  const [movieFilter, setMovieFilter] = useState('');

  const selectedCategory = activeFilter === 'all' || activeFilter === '80s' || activeFilter === '90s' ? null : activeFilter === 'late night' ? 'late-night' : activeFilter as CategoryKey;
  const filteredTracks = useMemo(() => bollywoodTracks.filter((track) => {
    const query = search.trim().toLowerCase();
    const searchable = `${track.title} ${track.artist} ${track.movie} ${track.year} ${track.era} ${track.category} ${track.label}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesFilter = activeFilter === 'all' || activeFilter === track.era || activeFilter === track.category || (activeFilter === 'late night' && track.category === 'late-night');
    const matchesMovie = !movieFilter || track.movie === movieFilter;
    return matchesQuery && matchesFilter && matchesMovie;
  }), [activeFilter, movieFilter, search]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const playTrack = (track: BollywoodTrack, nextQueue = queue) => {
    setCurrentTrack(track);
    setQueue(nextQueue.length ? nextQueue : bollywoodTracks);
    setProgress(26);
    setIsPlaying(true);
    showNotice(`Now playing “${track.title}” — YouTube link ready`);
  };

  const startRadio = (category?: CategoryKey) => {
    const radioTracks = category ? bollywoodTracks.filter((track) => track.category === category) : bollywoodTracks;
    const label = category ? categories.find((item) => item.key === category)?.title : 'All India Hostel Radio';
    setRadioName(label ?? 'All India Hostel Radio');
    setQueue(radioTracks);
    playTrack(radioTracks[0], radioTracks);
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const stepTrack = (direction: number) => {
    const activeQueue = queue.length ? queue : bollywoodTracks;
    const currentIndex = activeQueue.findIndex((track) => track.id === currentTrack.id);
    const nextIndex = (currentIndex + direction + activeQueue.length) % activeQueue.length;
    playTrack(activeQueue[nextIndex], activeQueue);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    showNotice(favorites.includes(id) ? 'Removed from your remembered songs' : 'Saved to your remembered songs');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden pb-28">
      <div className="grain" />
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--foreground))]/10 bg-[hsl(var(--background))]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button data-testid="button-home-logo" onClick={() => scrollTo('top')} className="group flex items-center gap-3">
            <span className="flex h-10 w-10 rotate-[-5deg] items-center justify-center rounded-[12px] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] font-display text-xl font-bold text-[hsl(var(--background))] shadow-[3px_3px_0_hsl(var(--foreground))] transition-transform group-hover:rotate-0">A</span>
            <span className="font-display text-lg font-bold tracking-[-.05em]">assignment<span className="text-[hsl(var(--primary))]">.fm</span></span>
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {['discover', 'categories', 'library', 'movies'].map((item) => <button data-testid={`button-nav-${item}`} key={item} onClick={() => scrollTo(item)} className="text-xs font-bold capitalize text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">{item}</button>)}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="mr-2 hidden font-mono-custom text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] lg:block">est. after lab hours</span>
            <button data-testid="button-header-radio" onClick={() => startRadio()} className="flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-0.5"><Radio size={14} /> Tune in</button>
          </div>
          <button data-testid="button-mobile-menu" onClick={() => setMobileMenu((value) => !value)} className="rounded-xl border border-[hsl(var(--foreground))]/15 p-2.5 md:hidden" aria-label="Toggle navigation">{mobileMenu ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        {mobileMenu && <div className="border-t border-[hsl(var(--foreground))]/10 px-5 pb-4 pt-2 md:hidden"><div className="grid grid-cols-2 gap-1">{['discover', 'categories', 'library', 'movies'].map((item) => <button data-testid={`button-mobile-nav-${item}`} key={item} onClick={() => scrollTo(item)} className="rounded-xl px-3 py-3 text-left text-sm font-bold capitalize hover:bg-[hsl(var(--muted))]">{item}</button>)}</div><button data-testid="button-mobile-radio" onClick={() => startRadio()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] py-3 text-sm font-bold text-[hsl(var(--background))]"><Radio size={15} /> Start Golden Era Radio</button></div>}
      </header>

      <main id="top">
        <section id="discover" className="mx-auto max-w-[1320px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_.94fr]">
            <div className="reveal">
              <SectionKicker>assignment fm presents / side A</SectionKicker>
              <h1 data-testid="text-hero-heading" className="mt-5 max-w-[760px] font-display text-[clamp(3.5rem,8.5vw,8rem)] font-semibold leading-[.83] tracking-[-.09em]">Assignments<br /><span className="text-[hsl(var(--primary))]">modern hain.</span><br />Gaane timeless hain.</h1>
              <p className="mt-8 max-w-[570px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">Assignments karte karte thoda purane zamaane mein chale jao. A warm Hindi Bollywood jukebox for hostel nights, practical files, and the group project that is definitely not going to finish itself.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button data-testid="button-hero-radio" onClick={() => startRadio()} className="rounded-full bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--background))] shadow-ink transition-transform hover:-translate-y-1"><Radio size={16} className="mr-2 inline" /> Golden Era Radio</button>
                <button data-testid="button-hero-browse" onClick={() => scrollTo('library')} className="rounded-full border-2 border-[hsl(var(--foreground))] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]">Browse the jukebox <ArrowDownRight size={15} className="ml-1 inline" /></button>
              </div>
              <div className="mt-10 flex items-center gap-3 font-mono-custom text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]"><span className="flex -space-x-2">{['RS', 'AM', 'NK', 'PJ'].map((initials, index) => <span data-testid={`avatar-student-${index}`} key={initials} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--background))] text-[9px] font-bold text-[hsl(var(--foreground))] ${['bg-[#d28a73]', 'bg-[#dcae4d]', 'bg-[#8ca5a0]', 'bg-[#b47b82]'][index]}`}>{initials}</span>)}</span><span><strong className="text-[hsl(var(--foreground))]">4,821</strong> students avoiding the group chat</span></div>
            </div>
            <div className="relative reveal delay-2">
              <div className="relative mx-auto max-w-[510px] rotate-[2deg] rounded-[2.4rem] border-2 border-[hsl(var(--foreground))] bg-[#6b3942] p-5 shadow-ink sm:p-8">
                <div className="absolute -right-3 -top-4 rotate-[7deg] rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-3 py-2 font-mono-custom text-[9px] font-bold uppercase tracking-[.12em] shadow-[3px_3px_0_hsl(var(--foreground))]">side A / focus</div>
                <div className="rounded-[1.65rem] border border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.08] p-5 sm:p-7">
                  <div className="flex items-start justify-between text-[hsl(var(--background))]"><div><p className="font-mono-custom text-[9px] uppercase tracking-[.2em] opacity-60">assignment fm</p><p className="mt-2 font-display text-3xl font-semibold leading-[.9] sm:text-4xl">Late night<br />department</p></div><Disc3 size={28} className="animate-[spin_9s_linear_infinite] opacity-75" /></div>
                  <div className="flex justify-center py-9"><Cassette /></div>
                  <div className="flex items-end justify-between text-[hsl(var(--background))]"><div><p className="font-mono-custom text-[9px] uppercase tracking-[.17em] opacity-60">now playing</p><p data-testid="text-hero-current" className="mt-2 text-sm font-bold">{currentTrack.title}</p><p className="text-xs opacity-60">{currentTrack.artist}</p></div><div className="flex items-end gap-1">{[13, 24, 18, 32, 21, 38, 17, 29, 14, 26].map((height, index) => <span key={index} className={`w-1 rounded-full bg-[hsl(var(--secondary))] ${isPlaying ? 'animate-pulse' : ''}`} style={{ height }} />)}</div></div>
                </div>
              </div>
              <div className="absolute -bottom-9 -left-3 hidden rotate-[-8deg] sm:block"><Cassette compact /></div>
            </div>
          </div>
          <div className="mt-16 flex items-center gap-4 border-t border-[hsl(var(--foreground))]/15 pt-5 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]"><span>curated for</span><span className="h-px w-9 bg-[hsl(var(--foreground))]/25" /><span>CS / ECE / ME / CE</span><span className="ml-auto hidden sm:inline">press play, lower expectations</span></div>
        </section>

        <section id="categories" className="bg-[hsl(var(--foreground))] px-5 py-16 text-[hsl(var(--background))] sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><SectionKicker dark>choose your current situation</SectionKicker><h2 className="mt-4 font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">A song for<br /><span className="text-[hsl(var(--secondary))]">every submission.</span></h2></div><p className="max-w-[440px] justify-self-end text-base leading-relaxed text-[hsl(var(--background))]/60">Six rooms in the old record store. Tap a category to filter the library, or press the little radio button to queue an entire broadcast.</p></div>
            <div className="scrollbar-hide mt-12 flex snap-x gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">{categories.map((category) => <CategoryCard key={category.key} category={category} active={selectedCategory === category.key} onSelect={() => { setActiveFilter(category.key === 'late-night' ? 'late night' : category.key as Filter); scrollTo('library'); }} onRadio={() => startRadio(category.key)} />)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><SectionKicker>the essential record</SectionKicker><h2 className="mt-4 max-w-[480px] font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">Ultimate<br /><span className="text-[hsl(var(--primary))]">Bollywood</span><br />Jukebox.</h2></div><div className="max-w-[540px] justify-self-end"><p className="font-mono-custom text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">80s–90s / lovingly overdramatic</p><p className="mt-4 text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">The songs your parents played in the car, your seniors played in the hostel, and you will suddenly know every word to at 1:40 AM.</p><button data-testid="button-essential-play" onClick={() => playTrack(bollywoodTracks[0])} className="mt-6 inline-flex items-center rounded-full bg-[hsl(var(--foreground))] px-5 py-3 text-sm font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-1"><Play size={15} fill="currentColor" className="mr-2" /> Play the essential set</button></div></div>
          <div className="scrollbar-hide mt-10 flex snap-x gap-4 overflow-x-auto pb-3">{bollywoodTracks.slice(0, 6).map((track) => <button data-testid={`card-essential-${track.id}`} key={track.id} onClick={() => playTrack(track)} className="group min-w-[155px] snap-start text-left sm:min-w-[180px]"><Poster track={track} /><span className="mt-3 block truncate text-sm font-bold">{track.title}</span><span className="mt-1 block truncate text-xs text-[hsl(var(--muted-foreground))]">{track.movie} · {track.year}</span></button>)}</div>
        </section>

        <section className="border-y border-[hsl(var(--foreground))]/10 bg-[#d6b56b]/20 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto max-w-[1320px]"><div className="flex items-end justify-between gap-4"><div><SectionKicker>remember these?</SectionKicker><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">You heard it once.<br /><span className="text-[hsl(var(--primary))]">You never forgot.</span></h2></div><button data-testid="button-remember-next" onClick={() => scrollTo('library')} className="hidden items-center gap-1 rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold sm:flex">Open collection <ArrowUpRight size={13} /></button></div><div className="scrollbar-hide mt-9 flex snap-x gap-4 overflow-x-auto pb-2">{bollywoodTracks.slice(6, 12).map((track) => <button data-testid={`card-remember-${track.id}`} key={track.id} onClick={() => playTrack(track)} className="flex min-w-[260px] snap-start items-center gap-3 rounded-2xl border border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))]/65 p-2.5 text-left transition-transform hover:-translate-y-1"><Poster track={track} size="small" /><span className="min-w-0"><strong className="block truncate text-sm">{track.title}</strong><span className="mt-1 block truncate text-xs text-[hsl(var(--muted-foreground))]">{track.artist}</span><span className="mt-2 block font-mono-custom text-[9px] uppercase tracking-[.08em] text-[hsl(var(--primary))]">{track.label}</span></span><Play size={15} className="mr-1 shrink-0" /></button>)}</div></div>
        </section>

        <section id="library" className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto max-w-[1320px]"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><SectionKicker>the library / official links only</SectionKicker><h2 className="mt-4 font-display text-5xl font-semibold leading-[.88] tracking-[-.08em] sm:text-7xl">Press play.<br /><span className="text-[hsl(var(--primary))]">Pretend it was easy.</span></h2></div><label className="relative flex w-full max-w-[460px]"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-search-library" value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search song, artist, movie, year..." className="h-12 w-full rounded-full border-2 border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))]" /></label></div>
            <div className="scrollbar-hide mt-9 flex gap-2 overflow-x-auto pb-2">{allFilters.map((filter) => <button data-testid={`button-filter-${filter.replace(' ', '-')}`} key={filter} onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold capitalize transition-colors ${activeFilter === filter ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'border border-[hsl(var(--foreground))]/15 hover:border-[hsl(var(--foreground))]'}`}>{filter === 'all' ? 'All tracks' : filter}</button>)}</div>
            <div className="mt-7 overflow-hidden rounded-[1.45rem] border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--card))] p-2"><div className="hidden grid-cols-[34px_48px_1fr_125px_auto_auto] gap-4 px-3 pb-2 pt-2 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] sm:grid"><span>#</span><span /><span>Track / film</span><span>For when...</span><span>Time</span><span /></div>{filteredTracks.length ? filteredTracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} current={track.id === currentTrack.id} playing={isPlaying && track.id === currentTrack.id} favorite={favorites.includes(track.id)} onPlay={() => playTrack(track, filteredTracks)} onFavorite={() => toggleFavorite(track.id)} />) : <div data-testid="empty-library" className="flex flex-col items-center justify-center px-6 py-20 text-center"><Search size={28} className="text-[hsl(var(--muted-foreground))]" /><h3 className="mt-4 font-display text-2xl font-semibold">No songs survived that search.</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try the movie name, singer, or a less specific emotional crisis.</p><button data-testid="button-clear-filters" onClick={() => { setSearch(''); setActiveFilter('all'); setMovieFilter(''); }} className="mt-5 rounded-full bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))]">Clear filters</button></div>}</div><div className="mt-4 flex justify-between gap-4 text-xs text-[hsl(var(--muted-foreground))]"><span>{filteredTracks.length} tracks in rotation</span><span className="hidden items-center gap-1 font-mono-custom text-[9px] uppercase tracking-[.1em] sm:flex">YouTube fallback available <ExternalLink size={11} /></span></div></div>
        </section>

        <section id="movies" className="border-y border-[hsl(var(--foreground))]/10 bg-[hsl(var(--card))] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"><div className="mx-auto max-w-[1320px]"><div className="flex items-end justify-between"><div><SectionKicker>browse by film</SectionKicker><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">One movie.<br /><span className="text-[hsl(var(--primary))]">Many feelings.</span></h2></div><button data-testid="button-clear-movie" onClick={() => setMovieFilter('')} className={`rounded-full border border-[hsl(var(--foreground))]/15 px-4 py-2 text-xs font-bold ${movieFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>All films</button></div><div className="scrollbar-hide mt-9 flex gap-3 overflow-x-auto pb-2">{movies.map((movie, index) => <button data-testid={`button-movie-${index}`} key={movie} onClick={() => { setMovieFilter(movie); scrollTo('library'); }} className={`min-w-[178px] rounded-[1.1rem] border p-4 text-left transition-transform hover:-translate-y-1 ${movieFilter === movie ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10' : 'border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))]'}`}><span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">FILM 0{index + 1}</span><strong className="mt-8 block font-display text-xl font-semibold leading-none">{movie}</strong><span className="mt-2 block text-xs text-[hsl(var(--muted-foreground))]">{bollywoodTracks.filter((track) => track.movie === movie).length} track{bollywoodTracks.filter((track) => track.movie === movie).length > 1 ? 's' : ''}</span></button>)}</div></div></section>

        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12"><div className="flex items-end justify-between"><div><SectionKicker>special programming</SectionKicker><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.07em] sm:text-6xl">No skip button<br /><span className="text-[hsl(var(--primary))]">necessary.</span></h2></div><button data-testid="button-special-radio" onClick={() => startRadio()} className="hidden rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold sm:block"><Radio size={13} className="mr-1 inline" /> Tune in live</button></div><div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_.9fr_.9fr]">{playlists.map((playlist, index) => <button data-testid={`button-playlist-${playlist.id}`} key={playlist.id} onClick={() => { const tracks = playlist.trackIds.map((id) => bollywoodTracks.find((track) => track.id === id)).filter((track): track is BollywoodTrack => Boolean(track)); setQueue(tracks); playTrack(tracks[0], tracks); setRadioName(playlist.title); }} className={`group relative min-h-[230px] overflow-hidden rounded-[1.5rem] border-2 border-[hsl(var(--foreground))]/15 p-5 text-left transition-transform hover:-translate-y-1 ${index === 0 ? 'bg-[#6b3942] text-[hsl(var(--background))]' : 'bg-[hsl(var(--card))]'}`}><div className="relative z-10 flex items-start justify-between"><span className="font-mono-custom text-[9px] uppercase tracking-[.13em] opacity-65">{index === 0 ? 'broadcast / live' : `playlist / 0${index}`}</span><span className="rounded-full bg-[hsl(var(--background))]/75 p-2 text-[hsl(var(--foreground))]"><Play size={14} fill="currentColor" /></span></div><div className="absolute -bottom-16 -right-7 h-56 w-56 rotate-[-12deg] rounded-full border-[27px] border-[hsl(var(--secondary))]/35 transition-transform duration-500 group-hover:rotate-[-4deg] group-hover:scale-105" /><div className="absolute bottom-5 left-5 z-10 max-w-[250px]"><h3 className="font-display text-2xl font-semibold leading-[.95] tracking-[-.05em]">{playlist.title}</h3><p className="mt-2 max-w-[220px] text-xs opacity-65">{playlist.description}</p></div></button>)}</div></section>

        <section className="bg-[hsl(var(--foreground))] px-5 py-16 text-[hsl(var(--background))] sm:px-8 sm:py-20 lg:px-12"><div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[1fr_auto]"><div><SectionKicker dark>engineering college folklore</SectionKicker><h2 className="mt-4 max-w-[720px] font-display text-4xl font-semibold leading-[.9] tracking-[-.07em] sm:text-6xl">The code can wait.<br /><span className="text-[hsl(var(--secondary))]">The chorus cannot.</span></h2><p className="mt-6 max-w-[580px] leading-relaxed text-[hsl(var(--background))]/60">For the person who says “bas ek gaana” and emerges with a complete playlist, a new crush, and three tabs of Stack Overflow. Keep the headphones on. The viva is tomorrow.</p></div><div className="rotate-[5deg]"><Cassette compact /></div></div></section>

        <footer className="mx-auto max-w-[1320px] px-5 pb-36 pt-14 sm:px-8 lg:px-12"><div className="flex flex-col justify-between gap-7 border-b border-[hsl(var(--foreground))]/15 pb-10 sm:flex-row sm:items-end"><div><button data-testid="button-footer-logo" onClick={() => scrollTo('top')} className="font-display text-2xl font-semibold tracking-[-.06em]">assignment<span className="text-[hsl(var(--primary))]">.fm</span></button><p className="mt-3 max-w-[300px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A tiny radio station for big deadlines and songs that outlived the syllabus.</p></div><div className="flex gap-6 text-xs font-bold text-[hsl(var(--muted-foreground))]"><button data-testid="button-footer-categories" onClick={() => scrollTo('categories')}>Categories</button><button data-testid="button-footer-library" onClick={() => scrollTo('library')}>Library</button><button data-testid="button-footer-feedback" onClick={() => showNotice('Feedback hotline is open in spirit')}>Feedback</button></div></div><div className="flex flex-col justify-between gap-3 pt-5 font-mono-custom text-[9px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))] sm:flex-row"><span>Music links open on official YouTube channels and rightsholder pages.</span><span>Built between two submissions / 2025</span></div></footer>
      </main>

      <div id="player" className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))]/95 shadow-[0_-8px_30px_hsl(var(--foreground))/.1] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center gap-3 px-4 sm:h-[86px] sm:gap-5 sm:px-8 lg:px-12">
          <button data-testid="button-expand-player" onClick={() => setExpanded(true)} className="hidden sm:block"><Cassette compact /></button>
          <button data-testid="button-expand-player-mobile" onClick={() => setExpanded(true)} className="min-w-0 flex-1 text-left sm:flex-none sm:w-[220px]"><div className="flex items-center gap-2"><span className="pulse-dot h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /><span className="font-mono-custom text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{isPlaying ? 'on air' : 'ready when you are'}</span></div><h3 data-testid="text-current-track" className="mt-1 truncate text-sm font-bold">{currentTrack.title}</h3><p data-testid="text-current-artist" className="truncate text-xs text-[hsl(var(--muted-foreground))]">{currentTrack.artist}</p></button>
          <div className="flex items-center gap-1 sm:gap-2"><button data-testid="button-previous-track" onClick={() => stepTrack(-1)} className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label="Previous track"><SkipBack size={17} fill="currentColor" /></button><button data-testid="button-toggle-player" onClick={() => setIsPlaying((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition-transform hover:scale-105" aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button data-testid="button-next-track" onClick={() => stepTrack(1)} className="rounded-full p-2.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label="Next track"><SkipForward size={17} fill="currentColor" /></button></div>
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex"><span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">0:00</span><input data-testid="input-progress" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} className="h-1.5 w-full accent-[hsl(var(--primary))]" /><span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">{currentTrack.duration}</span></div>
          <button data-testid="button-volume" onClick={() => { setMuted((value) => !value); showNotice(muted ? 'Volume affordance restored' : 'Playback is muted in this preview'); }} className="hidden rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] sm:block" aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
          <button data-testid="button-open-youtube" onClick={() => window.open(currentTrack.youtubeUrl, '_blank', 'noopener,noreferrer')} className="hidden rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] sm:block" aria-label="Open song on official YouTube"><ExternalLink size={16} /></button>
          <button data-testid="button-open-player" onClick={() => setExpanded(true)} className="rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] sm:hidden" aria-label="Open player details"><ListMusic size={16} /></button>
        </div>
      </div>

      {expanded && <div data-testid="panel-expanded-player" className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(var(--foreground))]/55 p-0 sm:items-center sm:p-5" onClick={() => setExpanded(false)}><div className="relative max-h-[92dvh] w-full max-w-[620px] overflow-y-auto rounded-t-[1.8rem] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--background))] p-5 shadow-ink sm:rounded-[1.8rem] sm:p-7" onClick={(event) => event.stopPropagation()}><button data-testid="button-close-expanded-player" onClick={() => setExpanded(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-[hsl(var(--muted))]" aria-label="Close expanded player"><X size={18} /></button><SectionKicker>now playing / {radioName}</SectionKicker><div className="mt-6 grid gap-6 sm:grid-cols-[170px_1fr] sm:items-center"><Poster track={currentTrack} /><div><p className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{currentTrack.movie} · {currentTrack.year}</p><h2 className="mt-2 font-display text-4xl font-semibold leading-[.9] tracking-[-.06em]">{currentTrack.title}</h2><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{currentTrack.artist}</p><div className="mt-6 flex items-center gap-2"><button data-testid="button-expanded-previous" onClick={() => stepTrack(-1)} className="rounded-full border border-[hsl(var(--foreground))]/15 p-3"><SkipBack size={16} /></button><button data-testid="button-expanded-play" onClick={() => setIsPlaying((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button data-testid="button-expanded-next" onClick={() => stepTrack(1)} className="rounded-full border border-[hsl(var(--foreground))]/15 p-3"><SkipForward size={16} /></button><button data-testid="button-expanded-favorite" onClick={() => toggleFavorite(currentTrack.id)} className={`ml-auto rounded-full border border-[hsl(var(--foreground))]/15 p-3 ${favorites.includes(currentTrack.id) ? 'text-[hsl(var(--primary))]' : ''}`}><Heart size={16} fill={favorites.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button></div></div></div><div className="mt-7 rounded-xl border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--muted))]/60 p-3"><div className="flex items-start gap-3"><ExternalLink size={16} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" /><p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Audio is not hosted here. Use the official YouTube fallback to listen to this track; this keeps the jukebox respectful of artists and rightsholders.</p></div><button data-testid="button-expanded-youtube" onClick={() => window.open(currentTrack.youtubeUrl, '_blank', 'noopener,noreferrer')} className="mt-3 rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))]">Open on YouTube <ExternalLink size={12} className="ml-1 inline" /></button></div><div className="mt-7"><div className="flex items-center justify-between"><h3 className="font-display text-2xl font-semibold">Up next</h3><span className="font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{queue.length} tracks / queued</span></div><div className="mt-3 space-y-1">{queue.slice(0, 5).map((track, index) => <button data-testid={`button-expanded-queue-${track.id}`} key={track.id} onClick={() => playTrack(track, queue)} className={`flex w-full items-center gap-3 rounded-xl p-2 text-left ${track.id === currentTrack.id ? 'bg-[hsl(var(--secondary))]/35' : 'hover:bg-[hsl(var(--muted))]'}`}><span className="w-5 font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">{String(index + 1).padStart(2, '0')}</span><Poster track={track} size="small" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{track.title}</strong><small className="block truncate text-xs text-[hsl(var(--muted-foreground))]">{track.artist}</small></span>{track.id === currentTrack.id && <Sparkles size={14} className="text-[hsl(var(--primary))]" />}</button>)}</div></div></div></div>}
      {notice && <div data-testid="status-notification" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-5 py-3 text-center text-xs font-bold text-[hsl(var(--foreground))] shadow-[4px_4px_0_hsl(var(--foreground))]">{notice}</div>}
    </div>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;