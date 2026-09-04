import type { Song } from '@assignment-fm/shared';
import { songs } from '../data/songs.js';

export class SongRepository {
  getAll(): Song[] {
    return songs;
  }

  getById(id: string): Song | undefined {
    return songs.find((s) => s.id.toLowerCase() === id.toLowerCase());
  }

  getByMood(mood: string): Song[] {
    const target = mood.trim().toLowerCase();
    return songs.filter((s) =>
      s.moods.some((m) => m.toLowerCase() === target)
    );
  }

  getByCategory(category: string): Song[] {
    const target = category.trim().toLowerCase();
    return songs.filter((s) =>
      s.categories.some((c) => c.toLowerCase() === target)
    );
  }

  search(query: string): Song[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return songs.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchArtist = s.artist.toLowerCase().includes(q);
      const matchMovie = s.movie.toLowerCase().includes(q);
      const matchYear = String(s.year).includes(q);
      const matchEra = s.era.toLowerCase().includes(q);
      const matchMood = s.moods.some((m) => m.toLowerCase().includes(q));
      const matchCategory = s.categories.some((c) => c.toLowerCase().includes(q));
      const matchLanguage = s.language.toLowerCase().includes(q);
      const matchLabel = s.label.toLowerCase().includes(q);
      return (
        matchTitle ||
        matchArtist ||
        matchMovie ||
        matchYear ||
        matchEra ||
        matchMood ||
        matchCategory ||
        matchLanguage ||
        matchLabel
      );
    });
  }
}

export const songRepository = new SongRepository();
