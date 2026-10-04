import { categoryRepository } from '../repositories/categoryRepository.js';

export class CategoryService {
  getAllCategories() {
    return categoryRepository.getAll();
  }

  getCategoryById(id) {
    return categoryRepository.getById(id);
  }
}

export const categoryService = new CategoryService();
