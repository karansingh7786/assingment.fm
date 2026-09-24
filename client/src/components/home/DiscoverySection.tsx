import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Radio, Sparkles } from 'lucide-react';
import type { Song } from '@assignment-fm/shared';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { Poster } from '../player/Poster';
import { SectionKicker } from '../layout/SectionKicker';

interface DiscoveryChannel {
  id: string;
  title: string;
  hindi: string;
  kicker: string;
  description: string;
  badge: string;
  filter: (song: Song) => boolean;
}

const DISCOVERY_CHANNELS: DiscoveryChannel[] = [
  {
    id: '80s',
    title: 'Back to the 80s',
    hindi: '८० के सुनहरे पल',
    kicker: 'analog tape / signature warmth',
    description: 'Cassettes, Kishore Kumar, synthesizer strings, and timeless melodrama.',
    badge: 'Analog 80s',
    filter: (s) => s.era === '80s' || (s.year !== undefined && s.year >= 1980 && s.year < 1990),
  },
  {
    id: '90s',
    title: '90s Department',
    hindi: '९० का जादू',
    kicker: 'the golden decade of melody',
    description: 'Kumar Sanu, Alka Yagnik, Nadeem-Shravan, and pencil-rewound memories.',
    badge: 'Pure 90s',
    filter: (s) => s.era === '90s' || (s.year !== undefined && s.year >= 1990 && s.year < 2000),
  },
  {
    id: 'love',
    title: 'Love Department',
    hindi: 'इश्क़ का कमरा',
    kicker: 'duets & corridor slow-mo',
    description: 'First crush protocol, library glances, and romantic string orchestrations.',
    badge: 'Romance',
    filter: (s) =>
      s.moods.some((m) => m.toLowerCase().includes('romantic')) ||
      s.categories.some((c) => c.toLowerCase().includes('love') || c.toLowerCase().includes('romance')),
  },
  {
    id: '2000s',
    title: '2000s Memories',
    hindi: 'मिलेनियम यादें',
    kicker: 'walkman & cd transition',
    description: 'Goa road trips, acoustic guitars, and hostel farewell anthems.',
    badge: 'Y2K Millennial',
    filter: (s) => s.era === '2000s' || (s.year !== undefined && s.year >= 2000 && s.year < 2010),
  },
  {
    id: 'regional',
    title: 'Regional Radio',
    hindi: 'देश की धुन',
    kicker: 'marathi · punjabi · bhojpuri · indie',
    description: 'Vibrant local sounds, folk rhythms, indie acoustics, and authentic roots.',
    badge: 'Regional Folk',
    filter: (s) =>
      ['Marathi', 'Punjabi', 'Bhojpuri', 'Indie', 'Instrumental'].some(
        (lang) =>
          (s.language || '').toLowerCase().includes(lang.toLowerCase()) ||
          s.categories.some((c) => c.toLowerCase().includes(lang.toLowerCase()))
      ),
  },
  {
    id: 'late-night',
    title: 'Late Night Department',
    hindi: 'रात का पहरा',
    kicker: 'quiet reflections & compile time',
    description: 'When the whole wing is asleep and the code finally behaves.',
    badge: '2:00 AM',
    filter: (s) =>
      s.moods.some((m) => m.toLowerCase().includes('night') || m.toLowerCase().includes('chill')) ||
      s.categories.some((c) => c.toLowerCase().includes('late-night')),
  },
  {
    id: 'canteen',
    title: 'College Canteen',
    hindi: 'कैंटीन का शोर',
    kicker: 'samosa diplomacy & tea',
    description: 'Suspiciously long breaks with the biggest crowd-pleaser tracks.',
    badge: 'Campus Vibe',
    filter: (s) =>
      s.categories.some((c) => c.toLowerCase().includes('college') || c.toLowerCase().includes('masti')) ||
      s.moods.some((m) => m.toLowerCase().includes('party') || m.toLowerCase().includes('happy')),
  },
  {
    id: 'bus-driver',
    title: 'Bus Driver Radio',
    hindi: 'रोडवेज़ बस रेडियो',
    kicker: 'early morning windshield fog',
    description: 'The state roadways bus soundtrack with the driver singing every line.',
    badge: 'Roadways FM',
    filter: (s) =>
      s.moods.some((m) => m.toLowerCase().includes('trip') || m.toLowerCase().includes('nostalgic')) ||
      s.categories.some((c) => c.toLowerCase().includes('road trip')),
  },
  {
    id: 'rainy-day',
    title: 'Rainy Day Radio',
    hindi: 'बारिश और खिड़की',
    kicker: 'petrichor & wet glass',
    description: 'Warm chai, balcony drippings, and melancholy monsoon instrumentation.',
    badge: 'Monsoon',
    filter: (s) =>
      s.moods.some((m) => m.toLowerCase().includes('peaceful') || m.toLowerCase().includes('sad')) ||
      s.categories.some((c) => c.toLowerCase().includes('rainy')),
  },
  {
    id: 'masti',
    title: 'Full Masti',
    hindi: 'धमाल और मस्ती',
    kicker: 'zero regrets & dramatic entries',
    description: 'Fest core, high-voltage dance floor fillers, and cultural night energy.',
    badge: 'High Energy',
    filter: (s) =>
      s.moods.some((m) => m.toLowerCase().includes('energetic') || m.toLowerCase().includes('party')) ||
      s.categories.some((c) => c.toLowerCase().includes('dance') || c.toLowerCase().includes('masti')),
  },
];

export function DiscoverySection({ allSongs }: { allSongs: Song[] }) {
  const { play, currentSong, startRadio } = useMusicPlayer();
  const [activeChannelId, setActiveChannelId] = useState<string>('90s');

  const activeChannel =
    DISCOVERY_CHANNELS.find((c) => c.id === activeChannelId) || DISCOVERY_CHANNELS[1];

  const channelSongs = allSongs.filter(activeChannel.filter);
  // Fallback to all songs if channel has very few
  const displaySongs = channelSongs.length > 0 ? channelSongs : allSongs.slice(0, 8);

  const scrollRow = (direction: 'left' | 'right') => {
    const el = document.getElementById(`discovery-row-${activeChannel.id}`);
    if (el) {
      const scrollAmt = direction === 'left' ? -360 : 360;
      el.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  return (
    <section id="discoveries" className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      {/* SECTION HEADER */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <SectionKicker>the departments / curated rotations</SectionKicker>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[.92] tracking-[-.07em] sm:text-6xl lg:text-7xl">
            Vintage collections<br />
            <span className="text-[hsl(var(--primary))]">made for listeners.</span>
          </h2>
        </div>
        <p className="max-w-[460px] text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
          Explore our signature departments spanning golden eras, late night shifts, and regional anthems.
          Every channel connects straight to the analog cassette deck.
        </p>
      </div>

      {/* CHANNELS TAB BAR */}
      <div className="scrollbar-hide mt-10 flex gap-2 overflow-x-auto pb-2">
        {DISCOVERY_CHANNELS.map((ch) => {
          const isActive = ch.id === activeChannelId;
          return (
            <button
              data-testid={`tab-discovery-${ch.id}`}
              key={ch.id}
              onClick={() => setActiveChannelId(ch.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-ink'
                  : 'border border-[hsl(var(--foreground))]/18 hover:border-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50'
              }`}
            >
              {ch.title}
            </button>
          );
        })}
      </div>

      {/* ACTIVE CHANNEL HERO CARD & TRACK CAROUSEL */}
      <div className="mt-8 rounded-[1.8rem] border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--card))] p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col justify-between gap-6 border-b border-[hsl(var(--foreground))]/12 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[hsl(var(--primary))]/15 px-3 py-1 font-mono-custom text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">
                {activeChannel.badge}
              </span>
              <span className="font-mono-custom text-xs font-medium text-[hsl(var(--muted-foreground))]">
                {activeChannel.hindi}
              </span>
            </div>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">
              {activeChannel.title}
            </h3>
            <p className="mt-2 max-w-[620px] text-sm text-[hsl(var(--muted-foreground))]">
              {activeChannel.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              data-testid="button-discovery-play-all"
              onClick={() => startRadio(displaySongs, `${activeChannel.title} Station`)}
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--background))] shadow-ink transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Radio size={14} /> Start Broadcast ({displaySongs.length})
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => scrollRow('left')}
                className="rounded-full border border-[hsl(var(--foreground))]/20 p-2.5 hover:bg-[hsl(var(--muted))] cursor-pointer"
                aria-label="Previous tracks"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollRow('right')}
                className="rounded-full border border-[hsl(var(--foreground))]/20 p-2.5 hover:bg-[hsl(var(--muted))] cursor-pointer"
                aria-label="Next tracks"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* TRACKS HORIZONTAL SCROLL */}
        <div
          id={`discovery-row-${activeChannel.id}`}
          className="scrollbar-hide mt-8 flex snap-x gap-4 overflow-x-auto pb-4"
        >
          {displaySongs.map((track) => {
            const isPlayingThis = currentSong?.id === track.id;

            return (
              <div
                key={track.id}
                className="group relative min-w-[170px] max-w-[170px] snap-start sm:min-w-[190px] sm:max-w-[190px]"
              >
                <div className="relative">
                  <Poster track={track} />
                  <button
                    data-testid={`button-play-discovery-${track.id}`}
                    onClick={() => play(track, displaySongs)}
                    className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] opacity-90 shadow-ink transition-transform hover:scale-105 group-hover:opacity-100 cursor-pointer"
                    aria-label={`Play ${track.title}`}
                  >
                    <Play size={15} fill="currentColor" />
                  </button>
                  {isPlayingThis && (
                    <div className="absolute left-2 top-2 rounded-full bg-[hsl(var(--secondary))] px-2.5 py-0.5 font-mono-custom text-[8px] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] shadow-sm">
                      On Air
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="truncate text-sm font-bold leading-snug" title={track.title}>
                    {track.title}
                  </h4>
                  <p className="mt-1 truncate text-xs text-[hsl(var(--muted-foreground))]" title={track.artist}>
                    {track.artist}
                  </p>
                  <div className="mt-2 flex items-center justify-between font-mono-custom text-[9px] text-[hsl(var(--muted-foreground))]">
                    <span>{track.movie || track.album || track.language}</span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
