import { Router, type Request, type Response } from 'express';
import { youtubeSearchService, YouTubeApiError } from '../services/youtubeSearchService.js';
import { songService } from '../services/songService.js';

export const youtubeRouter = Router();

// GET /api/youtube/search?q=...&limit=...
youtubeRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    if (typeof q !== 'string' || !q.trim()) {
      res.status(400).json({ error: "Search query parameter 'q' is required" });
      return;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const results = await youtubeSearchService.search(q, limit);
    res.json(results);
  } catch (err) {
    if (err instanceof YouTubeApiError) {
      // If API key is not configured locally, provide verified catalog fallback
      if (err.statusCode === 503) {
        const queryLower = String(req.query.q || '').trim().toLowerCase();
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const allSongs = songService.getAllSongs();

        const matches = allSongs.filter((song) => {
          if (!song.youtubeVideoId) return false;
          const title = (song.title || '').toLowerCase();
          const movie = (song.movie || '').toLowerCase();
          const artist = (song.artist || '').toLowerCase();
          return (
            title.includes(queryLower) ||
            queryLower.includes(title) ||
            movie.includes(queryLower) ||
            queryLower.includes(movie) ||
            artist.includes(queryLower)
          );
        });

        if (matches.length > 0) {
          const items = matches.slice(0, limit).map((song) => ({
            videoId: song.youtubeVideoId!,
            title: `${song.title} (${song.movie || 'Official'})`,
            channelTitle: song.artist || 'Official Bollywood',
            thumbnail: `https://i.ytimg.com/vi/${song.youtubeVideoId}/hqdefault.jpg`,
            publishedAt: `${song.year || 1992}-01-01T00:00:00Z`,
          }));
          res.json({ items });
          return;
        }
      }

      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    console.error('Unhandled error in YouTube search route:', err);
    res.status(500).json({ error: 'Internal server error during YouTube search' });
  }
});
