import React, { type ReactNode } from 'react';

export function SectionKicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-mono-custom text-[10px] font-bold uppercase tracking-[.18em] ${dark ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
      <span className={`h-2 w-2 rounded-full ${dark ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--primary))]'}`} />
      {children}
    </div>
  );
}
