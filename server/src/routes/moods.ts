import { Router, type Request, type Response } from 'express';
import { moodService } from '../services/moodService.js';

export const moodRouter = Router();

// GET /api/moods
moodRouter.get('/', (_req: Request, res: Response) => {
  try {
    const moods = moodService.getAllMoods();
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// GET /api/moods/:id
moodRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mood = moodService.getMoodById(id);
    if (!mood) {
      res.status(404).json({ error: `Mood with id '${id}' not found` });
      return;
    }
    res.json(mood);
  } catch (error) {
    console.error(`Error fetching mood ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch mood' });
  }
});
