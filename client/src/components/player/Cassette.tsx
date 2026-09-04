import React from 'react';

export function Cassette({ compact = false }: { compact?: boolean }) {
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
