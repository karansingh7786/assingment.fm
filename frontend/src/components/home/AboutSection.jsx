import React from 'react';
import { Cassette } from '../player/Cassette';
import { SectionKicker } from '../layout/SectionKicker';
import { ExternalLink, Heart, Radio, ShieldCheck } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="border-t border-[hsl(var(--foreground))]/12 bg-[hsl(var(--foreground))] px-5 py-20 text-[hsl(var(--background))] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <SectionKicker dark>engineering college folklore / since midnight</SectionKicker>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[.9] tracking-[-.07em] sm:text-6xl lg:text-7xl text-[hsl(var(--background))]">
              The code can wait.<br />
              <span className="text-[hsl(var(--secondary))]">The chorus cannot.</span>
            </h2>

            <div className="mt-8 space-y-4 text-base leading-relaxed text-[hsl(var(--background))]/75 sm:text-lg">
              <p>
                <strong>Assignment FM</strong> began in a quiet wing of a college hostel somewhere
                between 1:30 AM and sunrise. When compilation failed for the fourth time and the
                group chat went radio silent, only Kishore, Sanu, and Rahman stayed awake with us.
              </p>
              <p>
                We built this station to honour the analog tape culture that our seniors and parents
                handed down: songs you rewound with Nataraj pencils, melodies that filled roadways
                buses, and choruses that made the whole mess hall sing along.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[hsl(var(--background))]/15 pt-6 sm:grid-cols-3">
              <div>
                <span className="font-display text-3xl font-bold sm:text-4xl text-[hsl(var(--secondary))]">
                  4,821+
                </span>
                <p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.14em] opacity-70">
                  Late night listeners
                </p>
              </div>
              <div>
                <span className="font-display text-3xl font-bold sm:text-4xl text-[hsl(var(--secondary))]">
                  12
                </span>
                <p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.14em] opacity-70">
                  Mood radio stations
                </p>
              </div>
              <div>
                <span className="font-display text-3xl font-bold sm:text-4xl text-[hsl(var(--secondary))]">
                  100%
                </span>
                <p className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.14em] opacity-70">
                  Respectful fallback
                </p>
              </div>
            </div>

            {/* Respectful Audio Disclaimer */}
            <div className="mt-8 rounded-2xl border border-[hsl(var(--background))]/15 bg-[hsl(var(--background))]/[.06] p-4 text-xs leading-relaxed text-[hsl(var(--background))]/65">
              <div className="flex items-center gap-2 font-bold text-[hsl(var(--background))] mb-1">
                <ShieldCheck size={16} className="text-[hsl(var(--secondary))]" />
                <span>Respecting Artists & Rightsholders</span>
              </div>
              Audio is never hosted or scraped directly. Assignment FM links official YouTube and licensed
              music portals so artists, composers, and record labels receive their full streaming credit.
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative rotate-[4deg] transition-transform duration-500 hover:rotate-0">
              <Cassette />
              <div className="mt-6 text-center font-mono-custom text-[10px] uppercase tracking-[.2em] opacity-60">
                assignment.fm / analog broadcast unit 01
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
