import React, { useState } from 'react';
import { Disc3, Menu, Radio, X } from 'lucide-react';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

const NAV_ITEMS = [
  { label: 'Home', id: 'top' },
  { label: 'Moods', id: 'moods' },
  { label: 'Genres', id: 'genres' },
  { label: 'Eras', id: 'eras' },
  { label: 'Playlists', id: 'playlists' },
  { label: 'About', id: 'about' },
];

export function Header({
  onTuneIn,
  onNavigate,
}: {
  onTuneIn: () => void;
  onNavigate: (sectionId: string) => void;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { currentSong, isPlaying, setIsExpanded } = useMusicPlayer();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--foreground))]/10 bg-[hsl(var(--background))]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* LOGO */}
        <button
          data-testid="button-home-logo"
          onClick={() => handleNavClick('top')}
          className="group flex items-center gap-3 cursor-pointer text-left"
          aria-label="Assignment FM Homepage"
        >
          <span className="flex h-10 w-10 rotate-[-5deg] items-center justify-center rounded-[12px] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] font-display text-xl font-bold text-[hsl(var(--background))] shadow-[3px_3px_0_hsl(var(--foreground))] transition-transform group-hover:rotate-0">
            A
          </span>
          <div>
            <span className="font-display text-lg font-bold tracking-[-.05em] block leading-tight">
              assignment<span className="text-[hsl(var(--primary))]">.fm</span>
            </span>
            <span className="hidden sm:block font-mono-custom text-[8px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">
              retro indian radio
            </span>
          </div>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <button
              data-testid={`button-nav-${item.label.toLowerCase()}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-xs font-bold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] cursor-pointer py-1"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Online Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] px-3 py-1.5 font-mono-custom text-[9px] uppercase tracking-[.14em]">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#35a854]" />
            <span className="font-bold">4,821 online</span>
          </div>

          {/* Player Mini Indicator */}
          {currentSong && (
            <button
              data-testid="button-header-now-playing"
              onClick={() => setIsExpanded(true)}
              className="hidden md:flex items-center gap-2 rounded-full border border-[hsl(var(--foreground))]/20 bg-[hsl(var(--muted))]/60 px-3 py-1.5 text-left transition-colors hover:border-[hsl(var(--foreground))] cursor-pointer max-w-[180px]"
              title={`Now Playing: ${currentSong.title}`}
            >
              <Disc3
                size={14}
                className={`text-[hsl(var(--primary))] shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
              />
              <span className="truncate text-xs font-medium">{currentSong.title}</span>
            </button>
          )}

          {/* Tune In Button */}
          <button
            data-testid="button-header-radio"
            onClick={onTuneIn}
            className="flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))] shadow-[2px_2px_0_hsl(var(--foreground))] transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Radio size={14} className="animate-pulse" /> Tune In
          </button>

          {/* Mobile Menu Toggle */}
          <button
            data-testid="button-mobile-menu"
            onClick={() => setMobileMenu((value) => !value)}
            className="rounded-xl border border-[hsl(var(--foreground))]/20 p-2.5 md:hidden cursor-pointer hover:bg-[hsl(var(--muted))]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenu && (
        <div className="border-t border-[hsl(var(--foreground))]/10 bg-[hsl(var(--background))] px-5 pb-6 pt-3 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                data-testid={`button-mobile-nav-${item.label.toLowerCase()}`}
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="rounded-xl border border-[hsl(var(--foreground))]/10 px-4 py-3 text-left text-sm font-bold capitalize hover:bg-[hsl(var(--muted))] cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[hsl(var(--foreground))]/10 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
              <span className="pulse-dot h-2 w-2 rounded-full bg-[#35a854]" />
              <span>Hostel Broadcast Live</span>
            </div>
            <button
              data-testid="button-mobile-radio"
              onClick={() => {
                onTuneIn();
                setMobileMenu(false);
              }}
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-bold text-[hsl(var(--background))] cursor-pointer shadow-ink"
            >
              <Radio size={13} /> Golden Era Radio
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
