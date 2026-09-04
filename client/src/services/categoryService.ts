import type { Category } from '@assignment-fm/shared';
import { fetchApi } from './api';

export const categoryService = {
  getAll: (): Promise<Category[]> => fetchApi<Category[]>('/api/categories'),
  getById: (id: string): Promise<Category> => fetchApi<Category>(`/api/categories/${encodeURIComponent(id)}`),
};
