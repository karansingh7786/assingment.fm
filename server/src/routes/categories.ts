import { Router, type Request, type Response } from 'express';
import { categoryService } from '../services/categoryService.js';

export const categoryRouter = Router();

// GET /api/categories
categoryRouter.get('/', (_req: Request, res: Response) => {
  try {
    const categories = categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
categoryRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = categoryService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: `Category with id '${id}' not found` });
      return;
    }
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});
