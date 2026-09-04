import type { Category } from '@assignment-fm/shared';
import { categories } from '../data/categories.js';

export class CategoryRepository {
  getAll(): Category[] {
    return categories;
  }

  getById(id: string): Category | undefined {
    return categories.find(
      (c) =>
        c.id.toLowerCase() === id.toLowerCase() ||
        c.name.toLowerCase() === id.toLowerCase()
    );
  }
}

export const categoryRepository = new CategoryRepository();
