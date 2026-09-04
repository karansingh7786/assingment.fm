import React, { useState } from 'react';
import { Menu, Radio, X } from 'lucide-react';

export function Header({
  onTuneIn,
  onNavigate,
}: {
  onTuneIn: () => void;
  onNavigate: (sectionId: string) => void;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--foreground))]/10 bg-[hsl(var(--background))]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <button
          data-testid="button-home-logo"
          onClick={() => handleNavClick('top')}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <span className="flex h-10 w-10 rotate-[-5deg] items-center justify-center rounded-[12px] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] font-display text-xl font-bold text-[hsl(var(--background))] shadow-[3px_3px_0_hsl(var(--foreground))] transition-transform group-hover:rotate-0">
            A
          </span>
          <span className="font-display text-lg font-bold tracking-[-.05em]">
            assignment<span className="text-[hsl(var(--primary))]">.fm</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 md:flex">
          {['discover', 'categories', 'library', 'movies'].map((item) => (
            <button
              data-testid={`button-nav-${item}`}
              key={item}
              onClick={() => handleNavClick(item)}
              className="text-xs font-bold capitalize text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))] cursor-pointer"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="mr-2 hidden font-mono-custom text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] lg:block">
            est. after lab hours
          </span>
          <button
            data-testid="button-header-radio"
            onClick={onTuneIn}
            className="flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-4 py-2.5 text-xs font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Radio size={14} /> Tune in
          </button>
        </div>
        <button
          data-testid="button-mobile-menu"
          onClick={() => setMobileMenu((value) => !value)}
          className="rounded-xl border border-[hsl(var(--foreground))]/15 p-2.5 md:hidden cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {mobileMenu && (
        <div className="border-t border-[hsl(var(--foreground))]/10 px-5 pb-4 pt-2 md:hidden">
          <div className="grid grid-cols-2 gap-1">
            {['discover', 'categories', 'library', 'movies'].map((item) => (
              <button
                data-testid={`button-mobile-nav-${item}`}
                key={item}
                onClick={() => handleNavClick(item)}
                className="rounded-xl px-3 py-3 text-left text-sm font-bold capitalize hover:bg-[hsl(var(--muted))] cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
          <button
            data-testid="button-mobile-radio"
            onClick={() => {
              onTuneIn();
              setMobileMenu(false);
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] py-3 text-sm font-bold text-[hsl(var(--background))] cursor-pointer"
          >
            <Radio size={15} /> Start Golden Era Radio
          </button>
        </div>
      )}
    </header>
  );
}
