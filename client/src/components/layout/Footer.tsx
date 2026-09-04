import React from 'react';

export function Footer({
  onNavigate,
  onFeedback,
}: {
  onNavigate: (sectionId: string) => void;
  onFeedback: () => void;
}) {
  return (
    <footer className="mx-auto max-w-[1320px] px-5 pb-36 pt-14 sm:px-8 lg:px-12">
      <div className="flex flex-col justify-between gap-7 border-b border-[hsl(var(--foreground))]/15 pb-10 sm:flex-row sm:items-end">
        <div>
          <button
            data-testid="button-footer-logo"
            onClick={() => onNavigate('top')}
            className="font-display text-2xl font-semibold tracking-[-.06em] cursor-pointer"
          >
            assignment<span className="text-[hsl(var(--primary))]">.fm</span>
          </button>
          <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            A tiny radio station for big deadlines and songs that outlived the syllabus.
          </p>
        </div>
        <div className="flex gap-6 text-xs font-bold text-[hsl(var(--muted-foreground))]">
          <button
            data-testid="button-footer-categories"
            onClick={() => onNavigate('categories')}
            className="cursor-pointer hover:text-[hsl(var(--foreground))]"
          >
            Categories
          </button>
          <button
            data-testid="button-footer-library"
            onClick={() => onNavigate('library')}
            className="cursor-pointer hover:text-[hsl(var(--foreground))]"
          >
            Library
          </button>
          <button
            data-testid="button-footer-feedback"
            onClick={onFeedback}
            className="cursor-pointer hover:text-[hsl(var(--foreground))]"
          >
            Feedback
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3 pt-5 font-mono-custom text-[9px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))] sm:flex-row">
        <span>Music links open on official YouTube channels and rightsholder pages.</span>
        <span>Built between two submissions / 2025</span>
      </div>
    </footer>
  );
}
