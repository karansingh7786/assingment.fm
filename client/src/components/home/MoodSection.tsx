import React from 'react';
import {
  BrainCircuit,
  Coffee,
  Compass,
  Heart,
  HeartCrack,
  Moon,
  PartyPopper,
  Radio,
  RotateCcw,
  Smile,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import type { Song } from '@assignment-fm/shared';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { SectionKicker } from '../layout/SectionKicker';

export interface MoodConfig {
  id: string;
  name: string;
  hindi: string;
  description: string;
  color: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const MOODS: MoodConfig[] = [
  {
    id: 'happy',
    name: 'Happy',
    hindi: 'खुशी के तराने',
    description: 'Upbeat melodies for when code compiles on the first attempt.',
    color: '#dcae4d',
    accent: '#8a620d',
    icon: Smile,
  },
  {
    id: 'sad',
    name: 'Sad',
    hindi: 'दिल की बात',
    description: 'When the assignment passed, but feelings lingered in the corridor.',
    color: '#7b8f98',
    accent: '#3e525a',
    icon: HeartCrack,
  },
  {
    id: 'romantic',
    name: 'Romantic',
    hindi: 'इश्क़ का मौसम',
    description: 'First crush protocol and eye contact across the digital lab.',
    color: '#bb5043',
    accent: '#641b13',
    icon: Heart,
  },
  {
    id: 'chill',
    name: 'Chill',
    hindi: 'सुकून के पल',
    description: 'Mellow acoustic textures for unwinding after brutal practicals.',
    color: '#8ca5a0',
    accent: '#35534c',
    icon: Coffee,
  },
  {
    id: 'masti',
    name: 'Masti',
    hindi: 'मस्ती और धमाल',
    description: 'Canteen table drumming, inside jokes, and zero adult worries.',
    color: '#d28a73',
    accent: '#793e2b',
    icon: Sparkles,
  },
  {
    id: 'energetic',
    name: 'Energetic',
    hindi: 'पूरी ऊर्जा',
    description: 'High-octane Bollywood anthems to outrun the submission clock.',
    color: '#e27b4f',
    accent: '#863613',
    icon: Zap,
  },
  {
    id: 'nostalgic',
    name: 'Nostalgic',
    hindi: 'यादों का सफर',
    description: 'Songs that instantly transport you back to school vacation tapes.',
    color: '#c99f6b',
    accent: '#684a22',
    icon: RotateCcw,
  },
  {
    id: 'late-night',
    name: 'Late Night',
    hindi: 'रात अभी बाकी है',
    description: 'The hostel wing is pitch black. The playlist knows better.',
    color: '#55667e',
    accent: '#263449',
    icon: Moon,
  },
  {
    id: 'focus',
    name: 'Focus',
    hindi: 'एकाग्रता',
    description: 'Smooth, steady analog melodies designed for uninterrupted flow.',
    color: '#6e7a68',
    accent: '#384332',
    icon: BrainCircuit,
  },
  {
    id: 'party',
    name: 'Party',
    hindi: 'धमाकेदार पार्टी',
    description: 'Cultural fest anthems and emergency room-dance breaks.',
    color: '#bd5378',
    accent: '#6b203c',
    icon: PartyPopper,
  },
  {
    id: 'road-trip',
    name: 'Road Trip',
    hindi: 'सफर के हमसफर',
    description: 'Wind in your hair, window-seat classics on the highway bypass.',
    color: '#8a6552',
    accent: '#472d1f',
    icon: Compass,
  },
  {
    id: 'peaceful',
    name: 'Peaceful',
    hindi: 'शांति और सुकून',
    description: 'Calm and meditative compositions for late deadlines and rain.',
    color: '#658284',
    accent: '#2d4546',
    icon: Waves,
  },
];

export function MoodSection({ allSongs }: { allSongs: Song[] }) {
  const { selectedMood, selectMood, isPlaying } = useMusicPlayer();

  return (
    <section
      id="moods"
      className="border-y border-[hsl(var(--foreground))]/12 bg-[hsl(var(--card))] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 transition-colors"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>mood experience / instant broadcast</SectionKicker>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[.92] tracking-[-.07em] sm:text-6xl lg:text-7xl">
              How are you<br />
              <span className="text-[hsl(var(--primary))]">feeling today?</span>
            </h2>
          </div>
          <p className="max-w-[480px] text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
            Pick a feeling. We’ll curate an authentic radio broadcast tailored to your emotional bandwidth,
            complete with seamless queue shuffling and vintage tone.
          </p>
        </div>

        {/* 12 MOOD CARDS GRID */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {MOODS.map((mood, index) => {
            const Icon = mood.icon;
            const isSelected = selectedMood?.toLowerCase() === mood.id.toLowerCase() ||
              (selectedMood?.toLowerCase() === 'late night' && mood.id === 'late-night');

            return (
              <button
                data-testid={`card-mood-${mood.id}`}
                key={mood.id}
                onClick={() => selectMood(mood.id, allSongs)}
                className={`group relative flex flex-col justify-between rounded-[1.35rem] border-2 p-4 text-left transition-all duration-300 hover:-translate-y-1 sm:p-5 cursor-pointer ${
                  isSelected
                    ? 'border-[hsl(var(--foreground))] shadow-[5px_6px_0_hsl(var(--foreground))] ring-2 ring-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--foreground))]/15 bg-[hsl(var(--background))] hover:border-[hsl(var(--foreground))]/60 hover:shadow-soft'
                }`}
                style={{
                  backgroundColor: isSelected ? 'hsl(var(--background))' : undefined,
                }}
              >
                {/* TOP HEADER OF CARD */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[hsl(var(--foreground))]/20 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${mood.color}25`,
                      color: mood.accent,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="font-mono-custom text-[9px] font-bold uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">
                    0{index + 1}
                  </span>
                </div>

                {/* MIDDLE / CONTENT */}
                <div className="mt-6 sm:mt-8">
                  <span className="font-mono-custom text-[10px] opacity-70 block font-medium">
                    {mood.hindi}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl text-[hsl(var(--foreground))]">
                    {mood.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))] line-clamp-2">
                    {mood.description}
                  </p>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--foreground))]/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 font-mono-custom text-[9px] uppercase tracking-[.12em] font-semibold text-[hsl(var(--primary))]">
                    <Radio size={12} className={isSelected && isPlaying ? 'animate-pulse' : ''} />
                    {isSelected ? (isPlaying ? 'playing now' : 'queued') : 'start radio'}
                  </span>

                  {/* Visual indicator for active selection */}
                  {isSelected && (
                    <div className="flex items-end gap-0.5">
                      <span className="h-2 w-1 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                      <span className="h-3.5 w-1 rounded-full bg-[hsl(var(--primary))] animate-pulse delay-1" />
                      <span className="h-2 w-1 rounded-full bg-[hsl(var(--primary))] animate-pulse delay-2" />
                    </div>
                  )}
                </div>

                {/* Subtle colored accent glow on hover */}
                <div
                  className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-25"
                  style={{ backgroundColor: mood.color }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
