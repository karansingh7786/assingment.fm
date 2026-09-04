import { Router, type Request, type Response } from 'express';
import { songService } from '../services/songService.js';

export const songRouter = Router();

// GET /api/songs
songRouter.get('/', (_req: Request, res: Response) => {
  try {
    const songs = songService.getAllSongs();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// GET /api/songs/mood/:mood
songRouter.get('/mood/:mood', (req: Request, res: Response) => {
  try {
    const { mood } = req.params;
    if (!mood || !mood.trim()) {
      res.status(400).json({ error: 'Mood parameter is required' });
      return;
    }
    const songs = songService.getSongsByMood(mood);
    res.json(songs);
  } catch (error) {
    console.error(`Error fetching songs for mood ${req.params.mood}:`, error);
    res.status(500).json({ error: 'Failed to fetch songs for mood' });
  }
});

// GET /api/songs/category/:category
songRouter.get('/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    if (!category || !category.trim()) {
      res.status(400).json({ error: 'Category parameter is required' });
      return;
    }
    const songs = songService.getSongsByCategory(category);
    res.json(songs);
  } catch (error) {
    console.error(`Error fetching songs for category ${req.params.category}:`, error);
    res.status(500).json({ error: 'Failed to fetch songs for category' });
  }
});

// GET /api/songs/:id
songRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const song = songService.getSongById(id);
    if (!song) {
      res.status(404).json({ error: `Song with id '${id}' not found` });
      return;
    }
    res.json(song);
  } catch (error) {
    console.error(`Error fetching song ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});
