import type { Song, YouTubeSearchResponse } from '@assignment-fm/shared';

// In-memory cache for resolved YouTube video IDs
const resolvedVideoIdCache = new Map<string, string | null>();

// In-flight resolution requests deduplication map
const pendingResolutions = new Map<string, Promise<string | null>>();

// Official/verified Bollywood & Indian label channels to prefer when ranking search results
const PREFERRED_CHANNELS = [
  'tips official',
  't-series',
  'saregama music',
  'venus',
  'sony music india',
  'rajshri',
  'universal music india',
  'shemaroo filmi gaane',
  'yrf',
  'zee music company',
  'saregama',
  'tips',
  'tseries',
];

// Verified fallback IDs for Bollywood catalog
const VERIFIED_FALLBACK_IDS: Record<string, string> = {
  'pehla-nasha': 'iSUK1QoK9-E',
  'bahon-ke-darmiyan': 'yx3pXbo1aBM',
  'ek-ladki-ko-dekha': 'fTauOK8J-U8',
  'tujhse-naraz': 'LZ_YUOr-tYw',
  'chitthi-aayi-hai': 'yexZf8g_dJw',
  'tu-hi-re': 'V9mN0qBgEzQ',
  'my-name-is-lakhan': 'kKC1hAcPoI4',
  'jumma-chumma': 'NNQkWpD7YTE',
  'disco-dancer': '7JdEZoffm-Q',
  'neele-neele-ambar': 'ThHYiiZTB1Y',
  'naam-gum-jaayega': 'Hziy9jXQ8VQ',
  'do-dil-mil-rahe': '5SvIuD6wJRI',
  'ek-do-teen': 'JzFemLoFkN4',
  'urvashi-urvashi': 'dkedupX73xs',
  'yaad-aa-rahi': 'oYOaMwxlGCM',
  'kehte-hain-yeh': 'YG9zmhT67gE',
  'hothon-se-chhu-lo': 'Ee5sDeaNCnw',
  'aap-ke-aa-jaane-se': 'idX60r9x9V0',
  'dil-cheez-kya-hai': 'tCEj3yJ2whM',
  'tum-itna-jo-muskura-rahe': 'C8eAKT-zQXk',
  'kya-yahi-pyaar-hai': 'HppDw90kMB8',
  'aap-jaisa-koi': 'LawHH2Nf0JI',
  'tum-ko-dekha-toh': 'PnH56Koh_TY',
  'aane-wala-pal': 'W65lyLhUpNw',
  'mera-dil-bhi-kitna-pagal-hai': 'RVQsBlI35vw',
  'ae-ajnabi': 'gga4bIVcA-A',
  'kehna-hi-kya': '_YB1taxJPgk',
  'chura-ke-dil-mera': 'Yqj1_V90KJo',
  'chaiyya-chaiyya': 'PQmrmVs10X8',
  'bombay-theme': '18GFDP5bLLs',
  'apsara-aali': 'mW67u_hWiSo',
  'ishq-tera-tadpave': '-99Z8E1pOrs',
  'dil-chahta-hai': 'HoDgYV1NzAI',
  'kho-gaye-hum-kahan': 'vt4jX0iRgCg',
  'lollypop-lagelu': 'WOVt49tksec',
};

/**
 * Normalizes query string for deduplication cache keys
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

export const youtubeService = {
  /**
   * Constructs an intelligent search query from song metadata
   */
  constructSearchQuery(song: Song): string {
    const title = song.title.trim();
    const artist = song.artist?.trim() || '';
    const film = song.movie?.trim() || song.album?.trim() || '';

    if (film && artist) {
      return `${title} ${artist} ${film} official song`;
    }
    if (film) {
      return `${title} ${film} official song`;
    }
    if (artist) {
      return `${title} ${artist} official song`;
    }
    return `${title} official Bollywood song`;
  },

  /**
   * Resolves a Song to an embeddable YouTube video ID
   */
  async resolveSong(song: Song): Promise<string | null> {
    if (!song) return null;

    // 1. If song already has a verified/cached videoId, use it directly
    if (song.youtubeVideoId && song.youtubeVideoId.trim()) {
      resolvedVideoIdCache.set(song.id, song.youtubeVideoId.trim());
      return song.youtubeVideoId.trim();
    }

    // 2. Check song ID cache
    if (resolvedVideoIdCache.has(song.id)) {
      return resolvedVideoIdCache.get(song.id) || null;
    }

    const query = this.constructSearchQuery(song);
    const queryKey = normalize(query);

    // 3. Check query cache
    if (resolvedVideoIdCache.has(queryKey)) {
      const cached = resolvedVideoIdCache.get(queryKey) || null;
      if (cached) resolvedVideoIdCache.set(song.id, cached);
      return cached;
    }

    // 4. Return in-flight promise if resolution for this song or query is already in progress
    const inflightKey = song.id || queryKey;
    if (pendingResolutions.has(inflightKey)) {
      return pendingResolutions.get(inflightKey)!;
    }

    const resolutionPromise = (async () => {
      try {
        const url = `/api/youtube/search?q=${encodeURIComponent(query)}&limit=5`;
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
          console.warn(`YouTube search API returned status ${res.status} for query "${query}"`);
          const fallback = VERIFIED_FALLBACK_IDS[song.id] || null;
          if (fallback) {
            resolvedVideoIdCache.set(song.id, fallback);
            song.youtubeVideoId = fallback;
            return fallback;
          }
          return null;
        }

        const data: YouTubeSearchResponse = await res.json();
        if (!data?.items || data.items.length === 0) {
          const fallback = VERIFIED_FALLBACK_IDS[song.id] || null;
          if (fallback) {
            resolvedVideoIdCache.set(song.id, fallback);
            song.youtubeVideoId = fallback;
            return fallback;
          }
          resolvedVideoIdCache.set(song.id, null);
          resolvedVideoIdCache.set(queryKey, null);
          return null;
        }

        // Rank candidates: prioritize official channels
        let bestCandidate = data.items[0];
        for (const item of data.items) {
          const channel = (item.channelTitle || '').toLowerCase();
          if (PREFERRED_CHANNELS.some((preferred) => channel.includes(preferred))) {
            bestCandidate = item;
            break;
          }
        }

        const videoId = bestCandidate?.videoId?.trim() || null;
        if (videoId) {
          resolvedVideoIdCache.set(song.id, videoId);
          resolvedVideoIdCache.set(queryKey, videoId);
          song.youtubeVideoId = videoId;
        }

        return videoId;
      } catch (err) {
        console.error(`Error resolving YouTube video for song "${song.title}":`, err);
        const fallback = VERIFIED_FALLBACK_IDS[song.id] || null;
        if (fallback) {
          resolvedVideoIdCache.set(song.id, fallback);
          song.youtubeVideoId = fallback;
          return fallback;
        }
        return null;
      } finally {
        pendingResolutions.delete(inflightKey);
      }
    })();

    pendingResolutions.set(inflightKey, resolutionPromise);
    return resolutionPromise;
  },

  /**
   * Pre-resolves up to N upcoming songs in queue to avoid delay on track switch
   */
  async preResolveUpcoming(songs: Song[], startIndex: number, count = 2): Promise<void> {
    if (!songs || songs.length === 0) return;
    const targets: Song[] = [];
    for (let i = 1; i <= count; i++) {
      const idx = (startIndex + i) % songs.length;
      const target = songs[idx];
      if (target && !target.youtubeVideoId && !resolvedVideoIdCache.has(target.id)) {
        targets.push(target);
      }
    }

    // Resolve in parallel without blocking
    await Promise.allSettled(targets.map((s) => this.resolveSong(s)));
  },

  /**
   * Clears internal client cache (useful for testing)
   */
  clearCache(): void {
    resolvedVideoIdCache.clear();
    pendingResolutions.clear();
  },
};
