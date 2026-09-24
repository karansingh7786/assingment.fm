import type { YouTubeSearchResponse, YouTubeSearchItem } from '@assignment-fm/shared';

interface CacheEntry {
  timestamp: number;
  data: YouTubeSearchResponse;
}

// In-memory cache for search results to avoid hitting YouTube API quota repeatedly
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export class YouTubeApiError extends Error {
  statusCode: number;
  isQuotaError: boolean;

  constructor(message: string, statusCode = 500, isQuotaError = false) {
    super(message);
    this.name = 'YouTubeApiError';
    this.statusCode = statusCode;
    this.isQuotaError = isQuotaError;
  }
}

/**
 * Normalizes query string for cache keying
 */
function normalizeQuery(q: string): string {
  return q.toLowerCase().replace(/\s+/g, ' ').trim();
}

export const youtubeSearchService = {
  /**
   * Clears internal search cache (used in tests or manual reset)
   */
  clearCache(): void {
    cache.clear();
  },

  /**
   * Searches YouTube Data API v3 for embeddable videos matching query
   */
  async search(query: string, rawLimit = 5): Promise<YouTubeSearchResponse> {
    if (!query || !query.trim()) {
      throw new YouTubeApiError("Search query parameter 'q' is required", 400);
    }

    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    if (!apiKey) {
      throw new YouTubeApiError('YouTube API key is not configured on the server', 503);
    }

    // Enforce sensible bounds on limit (max 10 to protect quota)
    const limit = Math.min(10, Math.max(1, Number(rawLimit) || 5));
    const cacheKey = `${normalizeQuery(query)}::${limit}`;

    // Return cached result if available and fresh
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
    endpoint.searchParams.set('part', 'snippet');
    endpoint.searchParams.set('type', 'video');
    endpoint.searchParams.set('videoEmbeddable', 'true');
    endpoint.searchParams.set('maxResults', String(limit));
    endpoint.searchParams.set('q', query.trim());
    endpoint.searchParams.set('key', apiKey);

    let res: Response;
    try {
      res = await fetch(endpoint.toString(), {
        headers: {
          Accept: 'application/json',
        },
      });
    } catch (networkErr) {
      console.error('YouTube Data API network error:', networkErr);
      throw new YouTubeApiError('Unable to connect to YouTube Data API. Please check network.', 502);
    }

    if (!res.ok) {
      let errorBody: any = null;
      try {
        errorBody = await res.json();
      } catch {
        // ignore non-json error body
      }

      const reason = errorBody?.error?.errors?.[0]?.reason || '';
      const message = errorBody?.error?.message || '';

      if (res.status === 403 && (reason === 'quotaExceeded' || message.includes('quota'))) {
        throw new YouTubeApiError('YouTube API quota exceeded. Please try again later.', 429, true);
      }

      console.error(`YouTube API error (${res.status}):`, reason || message || 'Unknown error');
      throw new YouTubeApiError('YouTube search failed. Please try again later.', res.status >= 500 ? 502 : res.status);
    }

    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new YouTubeApiError('Invalid response received from YouTube Data API', 502);
    }

    const rawItems: any[] = Array.isArray(json?.items) ? json.items : [];
    const items: YouTubeSearchItem[] = rawItems
      .map((item) => {
        const videoId = typeof item?.id?.videoId === 'string' ? item.id.videoId : '';
        const snippet = item?.snippet || {};
        const title = snippet.title || '';
        const channelTitle = snippet.channelTitle || '';
        const thumbnail =
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          snippet.thumbnails?.high?.url ||
          '';
        const publishedAt = snippet.publishedAt || '';

        return {
          videoId,
          title,
          channelTitle,
          thumbnail,
          publishedAt,
        };
      })
      .filter((item) => Boolean(item.videoId));

    const response: YouTubeSearchResponse = { items };

    // Cache result
    cache.set(cacheKey, { timestamp: Date.now(), data: response });

    return response;
  },
};
