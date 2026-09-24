import { Router, type Request, type Response } from 'express';
import { searchService } from '../services/searchService.js';

export const searchRouter = Router();

// GET /api/search?q=...
searchRouter.get('/', (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    if (typeof q !== 'string' || !q.trim()) {
      res.json([]);
      return;
    }
    const results = searchService.search(q);
    res.json(results);
  } catch (error) {
    console.error('Error executing search:', error);
    res.status(500).json({ error: 'Failed to execute search' });
  }
});
