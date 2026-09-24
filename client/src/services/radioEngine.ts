import type { Song } from '@assignment-fm/shared';

/**
 * Normalizes strings for loose and case-insensitive matching
 * Handles hyphens, underscores, and extra spaces ('late-night' <-> 'late night')
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[-_]/g, ' ').trim();
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles items and ensures the first element is not the current song (if multiple exist)
 */
function shuffleAndAvoidImmediateRepeat(songs: Song[], previousSongId?: string): Song[] {
  if (songs.length <= 1) return songs;
  let shuffled = shuffle(songs);
  if (previousSongId && shuffled[0].id === previousSongId && shuffled.length > 1) {
    // Pick an index from 1 to end and swap with index 0
    const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
  }
  return shuffled;
}

/**
 * Filters and ranks songs matching a mood.
 * Stronger tag matches (e.g. primary mood tag or exact name) receive priority.
 */
export function getSongsByMood(mood: string, allSongs: Song[]): Song[] {
  const normTarget = normalize(mood);
  if (!normTarget) return [];

  const matched: { song: Song; score: number }[] = [];

  for (const song of allSongs) {
    let score = 0;
    const moods = song.moods || [];
    
    // Check moods array
    for (let i = 0; i < moods.length; i++) {
      const normMood = normalize(moods[i]);
      if (normMood === normTarget) {
        // High score for primary mood, slightly lower for subsequent
        score += Math.max(10 - i * 2, 2);
      } else if (normMood.includes(normTarget) || normTarget.includes(normMood)) {
        score += 3;
      }
    }

    // Check categories as secondary tag match
    const categories = song.categories || [];
    for (const cat of categories) {
      if (normalize(cat) === normTarget) {
        score += 4;
      }
    }

    // Check emotional label
    if (song.label && normalize(song.label).includes(normTarget)) {
      score += 2;
    }

    if (score > 0) {
      matched.push({ song, score });
    }
  }

  // Sort descending by score
  matched.sort((a, b) => b.score - a.score);
  return matched.map((item) => item.song);
}

/**
 * Filters songs matching a category.
 */
export function getSongsByCategory(category: string, allSongs: Song[]): Song[] {
  const target = normalize(category);
  if (!target) return [];

  return allSongs.filter((song) => {
    const cats = song.categories || [];
    return cats.some((c) => {
      const norm = normalize(c);
      return norm === target || norm.includes(target) || target.includes(norm);
    });
  });
}

/**
 * Filters songs matching an era (e.g. '80s', '90s', '2000s').
 */
export function getSongsByEra(era: string, allSongs: Song[]): Song[] {
  const target = normalize(era);
  if (!target) return [];

  return allSongs.filter((song) => {
    if (song.era && normalize(String(song.era)) === target) return true;
    if (song.year) {
      if (target === '80s' && song.year >= 1980 && song.year < 1990) return true;
      if (target === '90s' && song.year >= 1990 && song.year < 2000) return true;
      if (target === '2000s' && song.year >= 2000 && song.year < 2010) return true;
      if (target === '2010s' && song.year >= 2010 && song.year < 2020) return true;
      if (target === '2020s' && song.year >= 2020) return true;
    }
    return false;
  });
}

/**
 * Filters songs matching a language or genre ('Hindi', 'Marathi', 'Punjabi', 'Bhojpuri', 'Indie', 'Instrumental').
 */
export function getSongsByLanguage(language: string, allSongs: Song[]): Song[] {
  const target = normalize(language);
  if (!target) return [];

  return allSongs.filter((song) => {
    const normLang = normalize(song.language || '');
    if (normLang === target || normLang.includes(target)) return true;
    // Also check category for regional genre flags like 'Marathi', 'Punjabi', etc.
    const cats = song.categories || [];
    return cats.some((c) => normalize(c) === target);
  });
}

/**
 * Combines multi-criteria filters (e.g. 90s + Romantic)
 */
export function getMatchingSongs(
  criteria: { mood?: string; category?: string; era?: string; language?: string },
  allSongs: Song[]
): Song[] {
  let result = [...allSongs];

  if (criteria.mood) {
    const moodSongs = new Set(getSongsByMood(criteria.mood, allSongs).map((s) => s.id));
    result = result.filter((s) => moodSongs.has(s.id));
  }

  if (criteria.category) {
    const catSongs = new Set(getSongsByCategory(criteria.category, allSongs).map((s) => s.id));
    result = result.filter((s) => catSongs.has(s.id));
  }

  if (criteria.era) {
    const eraSongs = new Set(getSongsByEra(criteria.era, allSongs).map((s) => s.id));
    result = result.filter((s) => eraSongs.has(s.id));
  }

  if (criteria.language) {
    const langSongs = new Set(getSongsByLanguage(criteria.language, allSongs).map((s) => s.id));
    result = result.filter((s) => langSongs.has(s.id));
  }

  return result;
}

/**
 * Mood Radio Engine:
 * 1. Find songs matching the selected mood.
 * 2. Give priority to songs with stronger tag matches.
 * 3. Remove duplicate songs.
 * 4. Shuffle the result while preserving top match affinity.
 * 5. Avoid immediately repeating the previous song.
 * 6. Fallback gracefully to all songs if none match.
 * 7. Return the radio queue.
 */
export function createRadioFromMood(
  moodId: string,
  allSongs: Song[],
  previousSongId?: string
): Song[] {
  const matched = getSongsByMood(moodId, allSongs);

  // If no match found for an obscure mood, fallback gracefully to full catalogue
  const candidatePool = matched.length > 0 ? matched : allSongs;

  // Deduplicate
  const uniqueSongs = Array.from(new Map(candidatePool.map((s) => [s.id, s])).values());

  // Split top tier (strongest matches) and secondary tier for weighted shuffle
  if (uniqueSongs.length <= 4) {
    return shuffleAndAvoidImmediateRepeat(uniqueSongs, previousSongId);
  }

  const topTier = uniqueSongs.slice(0, Math.ceil(uniqueSongs.length / 2));
  const restTier = uniqueSongs.slice(Math.ceil(uniqueSongs.length / 2));

  const shuffledTop = shuffleAndAvoidImmediateRepeat(topTier, previousSongId);
  const shuffledRest = shuffle(restTier);

  return [...shuffledTop, ...shuffledRest];
}

/**
 * Category Radio Engine
 */
export function createRadioFromCategory(
  categoryId: string,
  allSongs: Song[],
  previousSongId?: string
): Song[] {
  const matched = getSongsByCategory(categoryId, allSongs);
  const candidatePool = matched.length > 0 ? matched : allSongs;
  const uniqueSongs = Array.from(new Map(candidatePool.map((s) => [s.id, s])).values());
  return shuffleAndAvoidImmediateRepeat(uniqueSongs, previousSongId);
}

/**
 * Era Radio Engine
 */
export function createRadioFromEra(
  era: string,
  allSongs: Song[],
  previousSongId?: string
): Song[] {
  const matched = getSongsByEra(era, allSongs);
  const candidatePool = matched.length > 0 ? matched : allSongs;
  const uniqueSongs = Array.from(new Map(candidatePool.map((s) => [s.id, s])).values());
  return shuffleAndAvoidImmediateRepeat(uniqueSongs, previousSongId);
}

/**
 * Language/Genre Radio Engine
 */
export function createRadioFromLanguage(
  language: string,
  allSongs: Song[],
  previousSongId?: string
): Song[] {
  const matched = getSongsByLanguage(language, allSongs);
  const candidatePool = matched.length > 0 ? matched : allSongs;
  const uniqueSongs = Array.from(new Map(candidatePool.map((s) => [s.id, s])).values());
  return shuffleAndAvoidImmediateRepeat(uniqueSongs, previousSongId);
}
