import React from 'react';
import { Calendar, Play, Radio, Sparkles } from 'lucide-react';
import type { Song } from '@assignment-fm/shared';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { createRadioFromEra } from '../../services/radioEngine';
import { SectionKicker } from '../layout/SectionKicker';
import { Cassette } from '../player/Cassette';

interface EraDetail {
  id: string;
  era: string;
  title: string;
  years: string;
  hindi: string;
  description: string;
  artists: string;
  isFeatured?: boolean;
  accentBg: string;
  textColor: string;
}

const ERAS: EraDetail[] = [
  {
    id: '80s',
    era: '80s',
    title: 'The Analog Golden Decade',
    years: '1980 — 1989',
    hindi: 'अस्सी का दशक',
    description: 'Cassettes sold in neighbourhood paan stalls, disco synthesizers, and Kishore Kumar’s deep baritone.',
    artists: 'Kishore Kumar · Lata Mangeshkar · Bappi Lahiri · R.D. Burman',
    isFeatured: true,
    accentBg: '#6b3942',
    textColor: '#fdfbf7',
  },
  {
    id: '90s',
    era: '90s',
    title: 'Melody at Peak Nostalgia',
    years: '1990 — 1999',
    hindi: 'नब्बे का जादू',
    description: 'Pencil-rewound magnetic tape, first crushes, Rahman’s revolutionary chords, and poetic duets.',
    artists: 'Kumar Sanu · Alka Yagnik · Udit Narayan · A.R. Rahman',
    isFeatured: true,
    accentBg: '#bb5043',
    textColor: '#fdfbf7',
  },
  {
    id: '2000s',
    era: '2000s',
    title: 'The Millennial Transit',
    years: '2000 — 2009',
    hindi: 'मिलेनियम धुन',
    description: 'CD jewel cases, MP3 players on buses, college road trips to Goa, and breezy acoustic guitars.',
    artists: 'Shankar-Ehsaan-Loy · Sonu Nigam · Shaan · Sunidhi Chauhan',
    accentBg: '#dcae4d',
    textColor: '#291819',
  },
  {
    id: '2010s',
    era: '2010s',
    title: 'The Indie & Streaming Wave',
    years: '2010 — 2019',
    hindi: 'डिजिटल दौर',
    description: 'Headphones on midnight coding marathons, folk fusions, and acoustic bedroom recordings.',
    artists: 'Arijit Singh · Amit Trivedi · Jasleen Royal · Prateek Kuhad',
    accentBg: '#658284',
    textColor: '#fdfbf7',
  },
  {
    id: '2020s',
    era: '2020s',
    title: 'Modern Retro Revival',
    years: '2020 — Present',
    hindi: 'आधुनिक दौर',
    description: 'Lo-fi remixes, analog textures reborn for late night study desks and nostalgic revivals.',
    artists: 'AP Dhillon · OAFF · King · Anuv Jain',
    accentBg: '#8ca5a0',
    textColor: '#291819',
  },
];

export function ErasSection({ allSongs }: { allSongs: Song[] }) {
  const { startRadio } = useMusicPlayer();

  const handleStartEraRadio = (eraDetail: EraDetail) => {
    const eraQueue = createRadioFromEra(eraDetail.era, allSongs);
    startRadio(eraQueue.length > 0 ? eraQueue : allSongs, `${eraDetail.era} Radio Station`);
  };

  const featuredEras = ERAS.filter((e) => e.isFeatured);
  const otherEras = ERAS.filter((e) => !e.isFeatured);

  return (
    <section id="eras" className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <SectionKicker>timeline selector / five decades of sound</SectionKicker>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[.92] tracking-[-.07em] sm:text-6xl lg:text-7xl">
            Choose your<br />
            <span className="text-[hsl(var(--primary))]">musical era.</span>
          </h2>
        </div>
        <p className="max-w-[480px] text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
          Every generation had its own medium: magnetic cassette, shiny CD, or lo-fi stream.
          Our heart remains proudly tuned to the 80s and 90s tape decks.
        </p>
      </div>

      {/* FEATURED 80s & 90s SIGNATURE CARDS */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {featuredEras.map((era) => {
          const eraSongs = allSongs.filter(
            (s) =>
              s.era === era.era ||
              (era.era === '80s' && s.year && s.year >= 1980 && s.year < 1990) ||
              (era.era === '90s' && s.year && s.year >= 1990 && s.year < 2000)
          );

          return (
            <div
              key={era.id}
              className="relative overflow-hidden rounded-[2rem] border-2 border-[hsl(var(--foreground))] p-7 sm:p-9 shadow-ink transition-transform hover:-translate-y-1"
              style={{ backgroundColor: era.accentBg, color: era.textColor }}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-mono-custom text-[10px] font-bold uppercase tracking-[.18em]">
                    <Sparkles size={12} /> signature station
                  </span>
                  <p className="mt-3 font-mono-custom text-xs opacity-75">{era.years} · {era.hindi}</p>
                </div>
                <span className="font-display text-5xl font-black opacity-30 tracking-tight sm:text-6xl">
                  {era.era}
                </span>
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">
                  {era.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-85">
                  {era.description}
                </p>
                <p className="mt-4 font-mono-custom text-[10px] uppercase tracking-[.12em] opacity-70">
                  {era.artists}
                </p>
              </div>

              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/15 pt-5">
                <button
                  data-testid={`button-era-play-${era.id}`}
                  onClick={() => handleStartEraRadio(era)}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[hsl(var(--foreground))] shadow-ink transition-transform hover:scale-105 cursor-pointer"
                >
                  <Radio size={14} /> Tune into {era.era} ({eraSongs.length} Tracks)
                </button>
                <span className="hidden sm:inline font-mono-custom text-[9px] uppercase tracking-[.15em] opacity-60">
                  analog certified
                </span>
              </div>

              {/* Decorative mini cassette silhouette */}
              <div className="pointer-events-none absolute -bottom-8 -right-6 opacity-20">
                <Cassette compact />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2000s, 2010s, 2020s TIMELINE CARDS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {otherEras.map((era) => {
          return (
            <div
              key={era.id}
              className="group flex flex-col justify-between rounded-[1.5rem] border-2 border-[hsl(var(--foreground))]/15 bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:border-[hsl(var(--foreground))] hover:shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-custom text-[9px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
                    {era.years}
                  </span>
                  <span className="font-mono-custom text-xs font-bold text-[hsl(var(--primary))]">
                    {era.hindi}
                  </span>
                </div>
                <h4 className="mt-3 font-display text-2xl font-bold tracking-tight">
                  {era.era}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                  {era.description}
                </p>
              </div>

              <div className="mt-6 border-t border-[hsl(var(--foreground))]/10 pt-4">
                <button
                  data-testid={`button-era-play-${era.id}`}
                  onClick={() => handleStartEraRadio(era)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[hsl(var(--foreground))]/20 bg-[hsl(var(--background))] py-2.5 text-xs font-bold text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] cursor-pointer"
                >
                  <Play size={13} fill="currentColor" /> Play {era.era} Radio
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
