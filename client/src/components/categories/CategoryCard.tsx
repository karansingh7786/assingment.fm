import React from 'react';
import { Radio } from 'lucide-react';
import type { Category } from '@assignment-fm/shared';

export function CategoryCard({
  category,
  active,
  onSelect,
  onRadio,
}: {
  category: Category;
  active: boolean;
  onSelect: () => void;
  onRadio: () => void;
}) {
  return (
    <article
      className={`relative min-w-[236px] snap-start overflow-hidden rounded-[1.35rem] border-2 p-4 transition-transform hover:-translate-y-1 sm:min-w-0 ${
        active
          ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] shadow-[5px_5px_0_hsl(var(--secondary))]'
          : 'border-[hsl(var(--background))]/20 bg-[hsl(var(--background))]/[.055] text-[hsl(var(--background))] hover:border-[hsl(var(--background))]/50'
      }`}
    >
      <button
        data-testid={`button-category-${category.id}`}
        onClick={onSelect}
        className="block min-h-[190px] w-full text-left"
      >
        <div className="flex items-start justify-between">
          <span className="font-mono-custom text-[10px] opacity-60">{category.number || '01'}</span>
          <span className="h-4 w-4 rounded-full border-2 border-current opacity-70" />
        </div>
        <div
          className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full opacity-75 transition-transform duration-500 group-hover:scale-110"
          style={{ background: category.color || '#d28a73' }}
        />
        <div className="relative mt-11">
          <p className="font-mono-custom text-[10px] opacity-65">{category.hindi || ''}</p>
          <h3 className="mt-2 max-w-[180px] font-display text-2xl font-semibold leading-[.95] tracking-[-.04em]">
            {category.name}
          </h3>
          <p
            className={`mt-2 max-w-[190px] text-xs leading-snug ${
              active ? 'text-[hsl(var(--foreground))]/70' : 'text-[hsl(var(--background))]/60'
            }`}
          >
            {category.description}
          </p>
        </div>
      </button>
      <button
        data-testid={`button-radio-${category.id}`}
        onClick={onRadio}
        className={`absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full ${
          active
            ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]'
            : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]'
        } transition-transform hover:scale-105`}
        aria-label={`Start ${category.name} radio`}
      >
        <Radio size={15} />
      </button>
    </article>
  );
}
