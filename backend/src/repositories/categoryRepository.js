import { categories } from '../data/categories.js';

export class CategoryRepository {
  getAll() {
    return categories;
  }

  getById(id) {
    if (!id) return undefined;
    const target = String(id).toLowerCase();
    return categories.find(
      (c) =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target
    );
  }
}

export const categoryRepository = new CategoryRepository();
