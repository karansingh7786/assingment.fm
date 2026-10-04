import { songs } from '../data/songs.js';

export class SongRepository {
  getAll() {
    return songs;
  }

  getById(id) {
    if (!id) return undefined;
    return songs.find((s) => s.id.toLowerCase() === String(id).toLowerCase());
  }

  getByMood(mood) {
    if (!mood) return [];
    const target = String(mood).trim().toLowerCase();
    return songs.filter((s) =>
      (s.moods || []).some((m) => m.toLowerCase() === target)
    );
  }

  getByCategory(category) {
    if (!category) return [];
    const target = String(category).trim().toLowerCase();
    return songs.filter((s) =>
      (s.categories || []).some((c) => c.toLowerCase() === target)
    );
  }

  search(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    return songs.filter((s) => {
      const matchTitle = (s.title || '').toLowerCase().includes(q);
      const matchArtist = (s.artist || '').toLowerCase().includes(q);
      const movieOrAlbum = s.movie || s.album || '';
      const matchMovie = movieOrAlbum.toLowerCase().includes(q);
      const matchYear = s.year ? String(s.year).includes(q) : false;
      const matchEra = (s.era || '').toLowerCase().includes(q);
      const matchMood = (s.moods || []).some((m) => m.toLowerCase().includes(q));
      const matchCategory = (s.categories || []).some((c) => c.toLowerCase().includes(q));
      const matchLanguage = (s.language || '').toLowerCase().includes(q);
      const matchLabel = (s.label || '').toLowerCase().includes(q);
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
