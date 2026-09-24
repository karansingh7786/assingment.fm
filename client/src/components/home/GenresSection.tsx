import React from 'react';
import { Disc, Music2, Radio } from 'lucide-react';
import type { Song } from '@assignment-fm/shared';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { createRadioFromLanguage } from '../../services/radioEngine';
import { SectionKicker } from '../layout/SectionKicker';

interface GenreConfig {
  id: string;
  name: string;
  hindi: string;
  description: string;
  color: string;
  iconBg: string;
  filterTag: string;
}

const GENRES: GenreConfig[] = [
  {
    id: 'bollywood',
    name: 'Bollywood',
    hindi: 'हिंदी सिनेमा',
    description: 'Timeless melodic golden eras, orchestral strings, and dramatic cinematic duets.',
    color: '#bb5043',
    iconBg: '#f6dedb',
    filterTag: 'Bollywood',
  },
  {
    id: 'marathi',
    name: 'Marathi',
    hindi: 'मराठी संगीत',
    description: 'Lavani beats, dholki rhythms, theatre classics, and stirring Ajay-Atul melodies.',
    color: '#e27b4f',
    iconBg: '#fae6dc',
    filterTag: 'Marathi',
  },
  {
    id: 'punjabi',
    name: 'Punjabi',
    hindi: 'पंजाबी धुन',
    description: 'High-energy bhangra kicks, hostel corridor anthems, and iconic folk-pop grooves.',
    color: '#dcae4d',
    iconBg: '#faedd2',
    filterTag: 'Punjabi',
  },
  {
    id: 'bhojpuri',
    name: 'Bhojpuri',
    hindi: 'भोजपुरी तरंग',
    description: 'Electrifying grassroots beats, festive celebration anthems, and rustic charm.',
    color: '#d25b4b',
    iconBg: '#f7deda',
    filterTag: 'Bhojpuri',
  },
  {
    id: 'indie',
    name: 'Indie',
    hindi: 'स्वतंत्र संगीत',
    description: 'Intimate bedroom acoustics, poetic lyrics, and warm late-night introspections.',
    color: '#658284',
    iconBg: '#dbe5e6',
    filterTag: 'Indie',
  },
  {
    id: 'instrumental',
    name: 'Instrumental',
    hindi: 'वाद्य संगीत',
    description: 'Ambient santoor, flute, and lush film score themes built for intense concentration.',
    color: '#8ca5a0',
    iconBg: '#e4ecea',
    filterTag: 'Instrumental',
  },
];

export function GenresSection({ allSongs }: { allSongs: Song[] }) {
  const { startRadio } = useMusicPlayer();

  const handleStartGenreRadio = (genre: GenreConfig) => {
    const queue = createRadioFromLanguage(genre.filterTag, allSongs);
    startRadio(queue.length > 0 ? queue : allSongs, `${genre.name} Radio`);
  };

  return (
    <section id="genres" className="border-t border-[hsl(var(--foreground))]/12 bg-[hsl(var(--card))] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>dial selections / languages & genres</SectionKicker>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[.92] tracking-[-.07em] sm:text-6xl lg:text-7xl">
              From Bollywood<br />
              <span className="text-[hsl(var(--primary))]">to regional airwaves.</span>
            </h2>
          </div>
          <p className="max-w-[460px] text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
            Indian music carries infinite accents and roots. Tune your receiver into regional rhythms,
            folk frequencies, and acoustic indie recordings.
          </p>
        </div>

        {/* 6 GENRE CARDS */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GENRES.map((genre) => {
            const matchingCount = allSongs.filter(
              (s) =>
                (s.language || '').toLowerCase() === genre.filterTag.toLowerCase() ||
                (s.categories || []).some((c) => c.toLowerCase() === genre.filterTag.toLowerCase())
            ).length;

            return (
              <div
                key={genre.id}
                className="group relative overflow-hidden rounded-[1.6rem] border-2 border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--foreground))] hover:shadow-soft"
              >
                {/* Background decorative accent circle */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-125"
                  style={{ backgroundColor: genre.color }}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[hsl(var(--foreground))]/15 shadow-sm"
                    style={{ backgroundColor: genre.iconBg, color: genre.color }}
                  >
                    <Music2 size={22} />
                  </div>
                  <span className="font-mono-custom text-[10px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
                    {matchingCount > 0 ? `${matchingCount} tracks` : 'Rotation'}
                  </span>
                </div>

                <div className="relative z-10 mt-6">
                  <span className="font-mono-custom text-[11px] font-medium opacity-70">
                    {genre.hindi}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl">
                    {genre.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {genre.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[hsl(var(--foreground))]/10 pt-4">
                  <button
                    data-testid={`button-genre-tune-${genre.id}`}
                    onClick={() => handleStartGenreRadio(genre)}
                    className="flex items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-4 py-2 text-xs font-bold text-[hsl(var(--background))] shadow-sm transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Radio size={13} /> Tune In
                  </button>

                  <span className="flex items-center gap-1 font-mono-custom text-[9px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
                    <Disc size={12} /> Station Ready
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
