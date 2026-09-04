import React from 'react';
import type { Song } from '@assignment-fm/shared';

export function Poster({ track, size = 'normal' }: { track: Song; size?: 'normal' | 'small' }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden border-2 border-[hsl(var(--foreground))]/20 ${
        size === 'small' ? 'h-12 w-12 rounded-xl' : 'aspect-[4/5] w-full rounded-[1.2rem]'
      }`}
      style={{ background: track.cover }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(115deg, transparent 0 9px, rgba(255,240,202,.22) 10px 11px)' }}
      />
      {size !== 'small' && (
        <div className="absolute inset-0 flex flex-col justify-between p-3 text-[hsl(var(--foreground))]">
          <span className="font-mono-custom text-[8px] uppercase tracking-[.15em]">
            {track.year} / {track.era}
          </span>
          <span className="font-display text-xl font-semibold leading-[.9]">
            {track.movie}
          </span>
        </div>
      )}
    </div>
  );
}
