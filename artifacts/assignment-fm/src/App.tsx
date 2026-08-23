import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowUpRight,
  Code2,
  Disc3,
  ExternalLink,
  Heart,
  ListMusic,
  Menu,
  Moon,
  Pause,
  Play,
  Plus,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Track = {
  id: number;
  title: string;
  artist: string;
  mood: string;
  energy: 'low' | 'mid' | 'high';
  duration: string;
  cover: string;
  youtubeUrl: string;
  tag: string;
};

type Mood = {
  id: string;
  name: string;
  line: string;
  color: string;
  icon: LucideIcon;
  trackIds: number[];
};

const tracks: Track[] = [
  { id: 1, title: 'Midnight City', artist: 'M83', mood: 'Locked in', energy: 'high', duration: '4:03', cover: 'linear-gradient(135deg, #f06e56 0%, #f7c36e 52%, #263f85 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=dX3k_QDnzHE', tag: 'deadline fuel' },
  { id: 2, title: 'A Moment Apart', artist: 'ODESZA', mood: 'Locked in', energy: 'mid', duration: '3:54', cover: 'linear-gradient(135deg, #90a9de 0%, #5265a5 48%, #242442 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=xarC5jAiO7w', tag: 'deep work' },
  { id: 3, title: 'Tadow', artist: 'Masego & FKJ', mood: 'Soft launch', energy: 'mid', duration: '5:29', cover: 'linear-gradient(135deg, #f7a3a5 0%, #d177a3 46%, #4b3467 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=44P8uV7Z3WQ', tag: 'good ideas' },
  { id: 4, title: 'Intro', artist: 'The xx', mood: 'Soft launch', energy: 'low', duration: '2:08', cover: 'linear-gradient(135deg, #c9d5bf 0%, #67827b 49%, #273b48 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=xMV6l2y67rk', tag: 'open tabs' },
  { id: 5, title: 'Weightless', artist: 'Marconi Union', mood: 'No thoughts', energy: 'low', duration: '8:00', cover: 'linear-gradient(135deg, #d5e86d 0%, #7ea77d 52%, #294a59 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU', tag: 'brain reset' },
  { id: 6, title: 'Sunset Lover', artist: 'Petit Biscuit', mood: 'Soft launch', energy: 'mid', duration: '3:58', cover: 'linear-gradient(135deg, #f9bc89 0%, #ef7e78 50%, #8c4a68 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=4fndeDfaWCg', tag: 'pretty productive' },
  { id: 7, title: 'The Less I Know The Better', artist: 'Tame Impala', mood: 'Main character', energy: 'high', duration: '3:36', cover: 'linear-gradient(135deg, #d6e76d 0%, #e27a56 51%, #454581 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=sBzrzS1Ag_g', tag: 'walk break' },
  { id: 8, title: 'Luv(sic) pt3', artist: 'Nujabes', mood: 'No thoughts', energy: 'low', duration: '5:35', cover: 'linear-gradient(135deg, #f6d89b 0%, #b37e67 52%, #483d60 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=F3cXxqMZxMI', tag: 'gentle focus' },
  { id: 9, title: 'Dog Days Are Over', artist: 'Florence + The Machine', mood: 'Main character', energy: 'high', duration: '4:12', cover: 'linear-gradient(135deg, #f06d5e 0%, #f2c75c 48%, #5b5e98 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=iWOyfLBYtuU', tag: 'submit button' },
  { id: 10, title: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk', mood: 'Locked in', energy: 'high', duration: '3:45', cover: 'linear-gradient(135deg, #e1ed7f 0%, #7297b9 48%, #272844 100%)', youtubeUrl: 'https://www.youtube.com/watch?v=gAjR4_CbPpQ', tag: 'compile again' },
];

const moods: Mood[] = [
  { id: 'locked', name: 'Locked in', line: 'Deadline? Never heard of her.', color: '#f17960', icon: Code2, trackIds: [1, 2, 10] },
  { id: 'soft', name: 'Soft launch', line: 'A little focus. A little sparkle.', color: '#d18bb0', icon: Sparkles, trackIds: [3, 4, 6] },
  { id: 'thoughts', name: 'No thoughts', line: 'The tabs are open. The brain is not.', color: '#8eaa8a', icon: Moon, trackIds: [5, 8] },
  { id: 'main', name: 'Main character', line: 'Walk to class like it is a music video.', color: '#d7e86e', icon: Zap, trackIds: [7, 9] },
];

const playlists = [
  { title: 'The 11:59 PM Special', sub: 'for assignments that were “almost done” yesterday', count: '28 tracks', color: '#f17960', cover: 'linear-gradient(135deg, #f17960 0%, #f6c66d 47%, #52568f 100%)', tracks: [1, 9, 10] },
  { title: 'Compile & Conquer', sub: 'a clean room for a messy codebase', count: '42 tracks', color: '#8da7d9', cover: 'linear-gradient(135deg, #a6bce6 0%, #50669e 48%, #25273f 100%)', tracks: [2, 5, 10] },
  { title: 'Canteen Table for One', sub: 'background music for a suspiciously long break', count: '19 tracks', color: '#d7e86e', cover: 'linear-gradient(135deg, #d7e86e 0%, #7ba496 48%, #383d65 100%)', tracks: [3, 6, 8] },
];

const navItems = [
  { label: 'Discover', href: '#discover' },
  { label: 'Moods', href: '#moods' },
  { label: 'Library', href: '#library' },
  { label: 'About', href: '#about' },
];

function Cassette({ small = false }: { small?: boolean }) {
  return (
    <div className={`relative ${small ? 'h-16 w-24' : 'h-52 w-72'} rounded-[1.4rem] border-2 border-[hsl(var(--foreground))] bg-[#f17960] shadow-ink ${small ? 'shadow-[3px_3px_0_hsl(var(--foreground))]' : ''} cassette-float`}>
      <div className={`absolute inset-x-[10%] ${small ? 'top-2 h-2' : 'top-5 h-4'} rounded-full bg-[hsl(var(--foreground))]/15`} />
      <div className={`absolute inset-x-[11%] ${small ? 'bottom-2 h-2' : 'bottom-5 h-4'} rounded-full bg-[hsl(var(--foreground))]/15`} />
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${small ? 'h-10 w-16' : 'h-28 w-48'} rounded-[.7rem] border-2 border-[hsl(var(--foreground))]/65 bg-[#f6c66d]`}>
        <div className="absolute left-[12%] top-1/2 h-2 w-[76%] -translate-y-1/2 rounded-full bg-[hsl(var(--foreground))]/25" />
        <div className={`absolute ${small ? 'left-2 h-3 w-3' : 'left-5 h-7 w-7'} top-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[#8eaa8a]`}>
          <span className="absolute inset-1 rounded-full bg-[hsl(var(--foreground))]/70" />
        </div>
        <div className={`absolute ${small ? 'right-2 h-3 w-3' : 'right-5 h-7 w-7'} top-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[#8eaa8a]`}>
          <span className="absolute inset-1 rounded-full bg-[hsl(var(--foreground))]/70" />
        </div>
        {!small && <span className="absolute left-1/2 top-2 -translate-x-1/2 font-mono-custom text-[10px] font-bold tracking-[.25em] text-[hsl(var(--foreground))]">AFM / 001</span>}
      </div>
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`mb-4 flex items-center gap-3 font-mono-custom text-[10px] font-bold uppercase tracking-[.18em] ${light ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
      <span className={`h-2 w-2 rounded-full ${light ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--primary))]'}`} />
      {children}
    </div>
  );
}

function TrackRow({
  track,
  index,
  isCurrent,
  isPlaying,
  onPlay,
  onAdd,
}: {
  track: Track;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAdd: () => void;
}) {
  return (
    <div data-testid={`row-track-${track.id}`} className={`group grid grid-cols-[32px_44px_1fr_auto_auto] items-center gap-3 rounded-2xl px-3 py-3 transition-all sm:grid-cols-[34px_48px_1fr_100px_auto_auto] sm:gap-4 ${isCurrent ? 'bg-[hsl(var(--secondary))]' : 'hover:bg-[hsl(var(--muted))]'}`}>
      <span className="text-center font-mono-custom text-[11px] text-[hsl(var(--muted-foreground))]">{String(index + 1).padStart(2, '0')}</span>
      <button data-testid={`button-play-track-${track.id}`} onClick={onPlay} className="relative h-11 w-11 overflow-hidden rounded-xl border border-[hsl(var(--foreground))]/15 text-[hsl(var(--foreground))]">
        <span className="absolute inset-0" style={{ background: track.cover }} />
        <span className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--foreground))]/15 opacity-0 transition-opacity group-hover:opacity-100">
          {isCurrent && isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </span>
      </button>
      <button data-testid={`button-select-track-${track.id}`} onClick={onPlay} className="min-w-0 text-left">
        <span className={`block truncate text-sm font-bold ${isCurrent ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--foreground))]'}`}>{track.title}</span>
        <span className="block truncate text-xs text-[hsl(var(--muted-foreground))]">{track.artist}</span>
      </button>
      <span className="hidden justify-self-start font-mono-custom text-[10px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))] sm:block">{track.tag}</span>
      <span className="font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">{track.duration}</span>
      <button data-testid={`button-add-track-${track.id}`} onClick={onAdd} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]" aria-label={`Add ${track.title} to playlist`}>
        <Plus size={16} />
      </button>
    </div>
  );
}

function Home() {
  const [location] = useLocation();
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [energy, setEnergy] = useState<'all' | Track['energy']>('all');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [liked, setLiked] = useState<number[]>([]);
  const [showTheme, setShowTheme] = useState(false);

  useEffect(() => {
    if (location !== '/') window.scrollTo({ top: 0 });
  }, [location]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const visibleTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch = `${track.title} ${track.artist} ${track.mood} ${track.tag}`.toLowerCase().includes(search.toLowerCase());
      const matchesMood = !selectedMood || track.mood === moods.find((mood) => mood.id === selectedMood)?.name;
      const matchesEnergy = energy === 'all' || track.energy === energy;
      return matchesSearch && matchesMood && matchesEnergy;
    });
  }, [search, selectedMood, energy]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setNotice(`Now playing “${track.title}”`);
  };

  const stepTrack = (direction: number) => {
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const addTrack = (track: Track) => {
    setNotice(`${track.title} added to your late-night queue`);
  };

  const selectMood = (moodId: string) => {
    setSelectedMood((current) => current === moodId ? null : moodId);
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden pb-24">
      <div className="grain" />
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--foreground))]/10 bg-[hsl(var(--background))]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a data-testid="link-home-logo" href="#top" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 rotate-[-5deg] items-center justify-center rounded-[13px] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] font-display text-lg font-extrabold shadow-[3px_3px_0_hsl(var(--foreground))] transition-transform group-hover:rotate-0">A</span>
            <span className="font-display text-lg font-extrabold tracking-[-.06em]">assignment<span className="text-[hsl(var(--primary))]">.fm</span></span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => <a data-testid={`link-nav-${item.label.toLowerCase()}`} key={item.href} href={item.href} className="text-sm font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">{item.label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <button data-testid="button-theme" onClick={() => setShowTheme((value) => !value)} className="rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]" aria-label="Open atmosphere settings">
              {showTheme ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a data-testid="link-share" href="#share" className="rounded-full bg-[hsl(var(--foreground))] px-5 py-2.5 text-xs font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-0.5">Share the aux <ArrowUpRight size={14} className="ml-1 inline" /></a>
          </div>
          <button data-testid="button-mobile-menu" onClick={() => setMobileOpen((value) => !value)} className="rounded-xl border border-[hsl(var(--foreground))]/15 p-2.5 md:hidden" aria-label="Toggle navigation">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-[hsl(var(--foreground))]/10 px-5 pb-5 pt-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => <a data-testid={`link-mobile-${item.label.toLowerCase()}`} key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-sm font-bold hover:bg-[hsl(var(--muted))]">{item.label}</a>)}
              <a data-testid="link-mobile-share" href="#share" onClick={() => setMobileOpen(false)} className="mt-2 rounded-xl bg-[hsl(var(--primary))] px-3 py-3 text-center text-sm font-bold">Share the aux</a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        <section id="discover" className="relative mx-auto max-w-[1320px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
          <div className="absolute -right-28 top-4 hidden h-72 w-72 rounded-full bg-[hsl(var(--secondary))]/70 blur-3xl lg:block" />
          <div className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
            <div className="reveal">
              <SectionLabel>your new academic coping mechanism</SectionLabel>
              <h1 data-testid="text-hero-heading" className="max-w-[720px] font-display text-[clamp(3.4rem,8vw,7.8rem)] font-extrabold leading-[.88] tracking-[-.09em]">
                Music for<br /><span className="text-[hsl(var(--primary))]">the plot.</span>
              </h1>
              <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-xl">
                Assignment FM is the soundtrack for engineering college: the clean compile, the questionable decision, and everything due at 11:59.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a data-testid="link-start-listening" href="#moods" onClick={() => playTrack(tracks[0])} className="group rounded-full bg-[hsl(var(--foreground))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--background))] shadow-ink transition-transform hover:-translate-y-1">
                  Start listening <Play size={15} fill="currentColor" className="ml-2 inline transition-transform group-hover:translate-x-0.5" />
                </a>
                <a data-testid="link-browse-library" href="#library" className="rounded-full border-2 border-[hsl(var(--foreground))] px-6 py-3.5 text-sm font-bold transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]">Browse the library</a>
              </div>
              <div className="mt-12 flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="flex -space-x-2">
                  {['KS', 'RM', 'AL', 'JV'].map((initials, index) => <span data-testid={`avatar-student-${index}`} key={initials} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--background))] text-[10px] font-bold text-[hsl(var(--foreground))] ${['bg-[#f17960]', 'bg-[#8da7d9]', 'bg-[#d7e86e]', 'bg-[#d18bb0]'][index]}`}>{initials}</span>)}
                </div>
                <span><strong className="text-[hsl(var(--foreground))]">4,821</strong> students are currently avoiding the group chat</span>
              </div>
            </div>
            <div className="relative reveal delay-2">
              <div className="relative mx-auto aspect-square max-w-[530px] rotate-[3deg] rounded-[2.5rem] border-2 border-[hsl(var(--foreground))] bg-[#263f85] p-7 shadow-ink sm:p-10">
                <div className="absolute -right-4 -top-5 rotate-[9deg] rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-4 py-2 font-mono-custom text-[10px] font-bold uppercase tracking-[.12em] shadow-[3px_3px_0_hsl(var(--foreground))]">side A / focus</div>
                <div className="flex h-full flex-col justify-between rounded-[1.7rem] border border-[hsl(var(--background))]/20 bg-[#e4e8f5]/10 p-6 sm:p-8">
                  <div className="flex items-start justify-between text-[hsl(var(--background))]">
                    <div><p className="font-mono-custom text-[10px] uppercase tracking-[.2em] opacity-65">assignment fm</p><p className="mt-2 font-display text-2xl font-bold leading-none sm:text-3xl">Late night<br />department</p></div>
                    <Disc3 className="animate-[spin_8s_linear_infinite] opacity-80" size={27} />
                  </div>
                  <div className="flex justify-center py-7 sm:py-10"><Cassette /></div>
                  <div className="flex items-end justify-between text-[hsl(var(--background))]">
                    <div><p className="font-mono-custom text-[9px] uppercase tracking-[.2em] opacity-65">now playing</p><p className="mt-2 text-sm font-bold">Midnight City</p><p className="text-xs opacity-65">M83</p></div>
                    <div className="flex items-end gap-1">{[13, 24, 18, 32, 21, 38, 17, 29, 14, 26].map((height, index) => <span key={index} className={`w-1 rounded-full bg-[hsl(var(--secondary))] ${isPlaying ? 'animate-pulse' : ''}`} style={{ height }} />)}</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-3 hidden rotate-[-7deg] sm:block"><Cassette small /></div>
            </div>
          </div>
          <div className="mt-20 flex items-center gap-4 border-t border-[hsl(var(--foreground))]/15 pt-5 font-mono-custom text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">
            <span>Curated for</span><span className="h-px w-10 bg-[hsl(var(--foreground))]/25" /><span>CS / ECE / ME / CE</span><span className="ml-auto hidden sm:inline">press play, lower expectations</span>
          </div>
        </section>

        <section id="moods" className="bg-[hsl(var(--foreground))] px-5 py-20 text-[hsl(var(--background))] sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <div className="reveal"><SectionLabel light>choose your current situation</SectionLabel><h2 className="font-display text-5xl font-extrabold leading-[.9] tracking-[-.08em] sm:text-7xl">What are we<br /><span className="text-[hsl(var(--secondary))]">feeling?</span></h2></div>
              <p className="max-w-[440px] justify-self-end text-base leading-relaxed text-[hsl(var(--background))]/65 lg:pb-1">No quizzes. No sign-up. Just four highly scientific moods for when your playlist needs to do the emotional heavy lifting.</p>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {moods.map((mood, index) => {
                const Icon = mood.icon;
                const active = selectedMood === mood.id;
                return (
                  <button data-testid={`button-mood-${mood.id}`} key={mood.id} onClick={() => selectMood(mood.id)} className={`group relative min-h-[245px] overflow-hidden rounded-[1.5rem] border-2 p-5 text-left transition-all hover:-translate-y-1 ${active ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] shadow-[5px_5px_0_hsl(var(--secondary))]' : 'border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.06] hover:border-[hsl(var(--background))]/50'}`}>
                    <div className="flex items-start justify-between"><span className="font-mono-custom text-[10px] opacity-60">0{index + 1}</span><span className="rounded-full p-2" style={{ background: active ? 'rgba(35,35,55,.1)' : `${mood.color}38` }}><Icon size={19} /></span></div>
                    <div className="absolute -bottom-14 -right-8 h-44 w-44 rounded-full opacity-80 transition-transform duration-500 group-hover:scale-125" style={{ background: mood.color }} />
                    <div className="relative mt-14"><h3 className="font-display text-2xl font-bold tracking-[-.06em]">{mood.name}</h3><p className={`mt-2 max-w-[180px] text-sm leading-snug ${active ? 'text-[hsl(var(--foreground))]/75' : 'text-[hsl(var(--background))]/60'}`}>{mood.line}</p></div>
                    <span className={`absolute bottom-5 right-5 text-xs font-bold transition-transform group-hover:translate-x-1 ${active ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--background))]/75'}`}>Play mood <ArrowUpRight size={14} className="ml-1 inline" /></span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="flex items-end justify-between gap-4"><div><SectionLabel>made for the group chat</SectionLabel><h2 className="font-display text-4xl font-extrabold tracking-[-.07em] sm:text-6xl">Playlists with<br /><span className="text-[hsl(var(--primary))]">alibis.</span></h2></div><button data-testid="button-see-all-playlists" onClick={() => setNotice('More playlists are brewing in the basement')} className="hidden rounded-full border border-[hsl(var(--foreground))]/20 px-4 py-2 text-xs font-bold sm:block">See all <ArrowUpRight size={13} className="ml-1 inline" /></button></div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_.9fr_.9fr]">
            {playlists.map((playlist, index) => (
              <button data-testid={`button-playlist-${index}`} key={playlist.title} onClick={() => { const first = tracks.find((track) => track.id === playlist.tracks[0]); if (first) playTrack(first); setNotice(`${playlist.title} is in session`); }} className={`group relative overflow-hidden rounded-[1.6rem] border-2 border-[hsl(var(--foreground))]/15 p-5 text-left transition-all hover:-translate-y-1 hover:border-[hsl(var(--foreground))] ${index === 0 ? 'min-h-[340px] bg-[#f17960]' : 'min-h-[280px] bg-[hsl(var(--card))]'}`}>
                <div className="relative z-10 flex items-start justify-between"><span className="rounded-full bg-[hsl(var(--background))]/80 px-3 py-1.5 font-mono-custom text-[9px] font-bold uppercase tracking-[.11em] text-[hsl(var(--foreground))]">{playlist.count}</span><span className="rounded-full bg-[hsl(var(--background))]/80 p-2"><Play size={15} fill="currentColor" /></span></div>
                <div className="absolute bottom-[-11%] right-[-5%] h-[70%] w-[72%] rotate-[-10deg] rounded-[1.5rem] border-2 border-[hsl(var(--foreground))]/30 opacity-80 transition-transform duration-500 group-hover:rotate-[-5deg] group-hover:scale-105" style={{ background: playlist.cover }}><div className="absolute left-[12%] top-[18%] h-[64%] w-[76%] rounded-full border-[15px] border-[hsl(var(--foreground))]/15" /></div>
                <div className="absolute bottom-5 left-5 z-10 max-w-[270px]"><p className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--foreground))]/60">playlist / 0{index + 1}</p><h3 className="mt-2 font-display text-2xl font-bold leading-[.95] tracking-[-.06em]">{playlist.title}</h3><p className="mt-2 max-w-[220px] text-xs text-[hsl(var(--foreground))]/65">{playlist.sub}</p></div>
              </button>
            ))}
          </div>
        </section>

        <section id="library" className="border-y border-[hsl(var(--foreground))]/10 bg-[hsl(var(--card))] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div><SectionLabel>the library</SectionLabel><h2 className="font-display text-4xl font-extrabold tracking-[-.07em] sm:text-6xl">Press play.<br /><span className="text-[hsl(var(--accent))]">Pretend it was easy.</span></h2></div>
              <div className="flex max-w-[510px] flex-col gap-3 sm:flex-row">
                <label className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" /><input data-testid="input-search-library" value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search songs, artists, moods..." className="h-12 w-full rounded-full border-2 border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))] pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))]" /></label>
                <button data-testid="button-queue" onClick={() => setQueueOpen((value) => !value)} className={`flex h-12 items-center justify-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors ${queueOpen ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))] hover:border-[hsl(var(--foreground))]'}`}><ListMusic size={16} /> Queue</button>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono-custom text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Filter</span>
              {(['all', 'low', 'mid', 'high'] as const).map((value) => <button data-testid={`button-filter-${value}`} key={value} onClick={() => setEnergy(value)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${energy === value ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'border border-[hsl(var(--foreground))]/15 hover:border-[hsl(var(--foreground))]'}`}>{value === 'all' ? 'All energy' : `${value} energy`}</button>)}
              {selectedMood && <button data-testid="button-clear-mood" onClick={() => setSelectedMood(null)} className="ml-auto rounded-full bg-[hsl(var(--secondary))] px-4 py-2 text-xs font-bold">Mood: {moods.find((mood) => mood.id === selectedMood)?.name} <X size={13} className="ml-1 inline" /></button>}
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[hsl(var(--foreground))]/12 bg-[hsl(var(--background))] p-2">
              <div className="hidden grid-cols-[34px_48px_1fr_100px_auto_auto] gap-4 px-3 pb-2 pt-2 font-mono-custom text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))] sm:grid"><span>#</span><span /><span>Track</span><span>For when...</span><span>Time</span><span /></div>
              {visibleTracks.length > 0 ? visibleTracks.map((track, index) => <TrackRow key={track.id} track={track} index={index} isCurrent={currentTrack.id === track.id} isPlaying={isPlaying && currentTrack.id === track.id} onPlay={() => playTrack(track)} onAdd={() => addTrack(track)} />) : <div data-testid="empty-library" className="flex flex-col items-center justify-center px-6 py-20 text-center"><Search size={30} className="text-[hsl(var(--muted-foreground))]" /><h3 className="mt-4 font-display text-xl font-bold">No tracks survived that search.</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Try a different keyword or clear the filters.</p><button data-testid="button-clear-filters" onClick={() => { setSearch(''); setEnergy('all'); setSelectedMood(null); }} className="mt-5 rounded-full bg-[hsl(var(--foreground))] px-4 py-2 text-xs font-bold text-[hsl(var(--background))]">Clear filters</button></div>}
            </div>
            <div className="mt-5 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]"><span>{visibleTracks.length} tracks in rotation</span><span className="font-mono-custom text-[10px] uppercase tracking-[.1em]">official links only <ExternalLink size={12} className="ml-1 inline" /></span></div>
          </div>
          {queueOpen && <div className="mx-auto mt-5 max-w-[1320px] rounded-[1.5rem] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] p-5 shadow-[5px_5px_0_hsl(var(--foreground))]"><div className="flex items-center justify-between"><div><SectionLabel>up next</SectionLabel><h3 className="font-display text-2xl font-bold tracking-[-.05em]">Your questionable queue</h3></div><button data-testid="button-close-queue" onClick={() => setQueueOpen(false)} className="rounded-full p-2 hover:bg-[hsl(var(--foreground))]/10"><X size={18} /></button></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{tracks.slice(0, 3).map((track, index) => <button data-testid={`button-queue-track-${track.id}`} key={track.id} onClick={() => playTrack(track)} className="flex items-center gap-3 rounded-xl bg-[hsl(var(--background))]/60 p-3 text-left hover:bg-[hsl(var(--background))]"><span className="font-mono-custom text-[10px]">0{index + 1}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{track.title}</strong><small className="block truncate text-xs opacity-60">{track.artist}</small></span><Play size={14} /></button>)}</div></div>}
        </section>

        <section id="share" className="relative overflow-hidden bg-[#263f85] px-5 py-20 text-[hsl(var(--background))] sm:px-8 lg:px-12 lg:py-28">
          <div className="absolute -right-20 top-[-100px] h-80 w-80 rounded-full border-[50px] border-[hsl(var(--secondary))]/30" />
          <div className="absolute bottom-[-180px] left-[12%] h-96 w-96 rounded-full border-[70px] border-[hsl(var(--primary))]/25" />
          <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div><SectionLabel light>an open invite</SectionLabel><h2 className="max-w-[760px] font-display text-5xl font-extrabold leading-[.9] tracking-[-.08em] sm:text-7xl">Send this to the<br /><span className="text-[hsl(var(--secondary))]">friend who gets it.</span></h2><p className="mt-7 max-w-[490px] text-base leading-relaxed text-[hsl(var(--background))]/65">For the lab partner who says “one last episode,” the roommate with the mechanical keyboard, and you — still naming files final_final_v7.</p><button data-testid="button-copy-share" onClick={() => { navigator.clipboard?.writeText(window.location.href); setNotice('Link copied. The aux is now communal.'); }} className="mt-8 rounded-full bg-[hsl(var(--secondary))] px-6 py-3.5 text-sm font-bold text-[hsl(var(--foreground))] transition-transform hover:-translate-y-1">Copy the link <ArrowUpRight size={15} className="ml-1 inline" /></button></div>
            <div className="relative mx-auto rotate-[7deg]"><div className="absolute -left-7 top-8 h-40 w-5 rounded-full bg-[hsl(var(--primary))]" /><Cassette /></div>
          </div>
        </section>

         <section id="about" className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
           <div className="grid gap-8 border-b border-[hsl(var(--foreground))]/15 pb-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
             <div><SectionLabel>why this exists</SectionLabel><h2 className="font-display text-4xl font-extrabold leading-[.92] tracking-[-.07em] sm:text-6xl">Built for the<br /><span className="text-[hsl(var(--primary))]">“tomorrow” people.</span></h2></div>
             <p className="max-w-[620px] text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">Assignment FM is a tiny internet corner for engineering students who need something playing in the background while surviving assignments, practicals, coding sessions, exams, and late-night submissions.</p>
           </div>
         </section>

        <footer className="mx-auto max-w-[1320px] px-5 pb-40 pt-14 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-8 border-b border-[hsl(var(--foreground))]/15 pb-12 sm:flex-row sm:items-end">
            <div><a data-testid="link-footer-logo" href="#top" className="font-display text-2xl font-extrabold tracking-[-.07em]">assignment<span className="text-[hsl(var(--primary))]">.fm</span></a><p className="mt-3 max-w-[270px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">A tiny radio station for big deadlines and even bigger headphones.</p></div>
            <div className="flex gap-7 text-xs font-bold text-[hsl(var(--muted-foreground))]"><a data-testid="link-footer-moods" href="#moods" className="hover:text-[hsl(var(--foreground))]">Moods</a><a data-testid="link-footer-library" href="#library" className="hover:text-[hsl(var(--foreground))]">Library</a><button data-testid="button-footer-feedback" onClick={() => setNotice('Feedback hotline is open in spirit')} className="hover:text-[hsl(var(--foreground))]">Feedback</button></div>
          </div>
           <div className="flex flex-col gap-3 pt-5 font-mono-custom text-[9px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]"><span>Music is streamed through third-party platforms such as YouTube. Rights belong to their respective artists, creators, and labels.</span><div className="flex flex-col justify-between gap-3 sm:flex-row"><span>Built between two submissions</span><span>© 2025 assignment fm / all vibes reserved</span></div></div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))]/95 shadow-[0_-8px_30px_hsl(var(--foreground))/.08] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center gap-3 px-4 sm:h-[88px] sm:gap-5 sm:px-8 lg:px-12">
          <div className="hidden sm:block"><Cassette small /></div>
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="pulse-dot h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /><span className="font-mono-custom text-[9px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">{isPlaying ? 'on air' : 'ready when you are'}</span></div><h3 data-testid="text-current-track" className="mt-1 truncate text-sm font-bold">{currentTrack.title}</h3><p data-testid="text-current-artist" className="truncate text-xs text-[hsl(var(--muted-foreground))]">{currentTrack.artist}</p></div>
          <div className="flex items-center gap-1 sm:gap-2"><button data-testid="button-previous-track" onClick={() => stepTrack(-1)} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]" aria-label="Previous track"><SkipBack size={17} fill="currentColor" /></button><button data-testid="button-toggle-player" onClick={() => setIsPlaying((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] transition-transform hover:scale-105" aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button data-testid="button-next-track" onClick={() => stepTrack(1)} className="rounded-full p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]" aria-label="Next track"><SkipForward size={17} fill="currentColor" /></button></div>
          <div className="hidden w-[180px] items-center gap-3 md:flex"><span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">0:00</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className={`h-full rounded-full bg-[hsl(var(--primary))] transition-all ${isPlaying ? 'w-[38%]' : 'w-[8%]'}`} /></div><span className="font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">{currentTrack.duration}</span></div>
          <button data-testid="button-like-track" onClick={() => { setLiked((current) => current.includes(currentTrack.id) ? current.filter((id) => id !== currentTrack.id) : [...current, currentTrack.id]); setNotice(liked.includes(currentTrack.id) ? 'Removed from favorites' : 'Saved to favorites'); }} className={`hidden rounded-full p-2.5 transition-colors sm:block ${liked.includes(currentTrack.id) ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'}`} aria-label="Favorite current track"><Heart size={17} fill={liked.includes(currentTrack.id) ? 'currentColor' : 'none'} /></button>
          <button data-testid="button-open-youtube" onClick={() => window.open(currentTrack.youtubeUrl, '_blank', 'noopener,noreferrer')} className="hidden rounded-full border border-[hsl(var(--foreground))]/15 p-2.5 text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] sm:block" aria-label="Open official YouTube"><ExternalLink size={16} /></button>
        </div>
      </div>
      {notice && <div data-testid="status-notification" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))] px-5 py-3 text-xs font-bold text-[hsl(var(--foreground))] shadow-[4px_4px_0_hsl(var(--foreground))]">{notice}</div>}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;