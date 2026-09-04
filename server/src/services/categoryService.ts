import type { Category } from '@assignment-fm/shared';
import { categoryRepository } from '../repositories/categoryRepository.js';

export class CategoryService {
  getAllCategories(): Category[] {
    return categoryRepository.getAll();
  }

  getCategoryById(id: string): Category | undefined {
    return categoryRepository.getById(id);
  }
}

export const categoryService = new CategoryService();
